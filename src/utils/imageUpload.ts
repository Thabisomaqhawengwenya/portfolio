/**
 * Utility to process, optimize, and compress images client-side
 * Supports uploads from desktop PCs and mobile smartphones (camera/gallery)
 */

export interface ProcessedImageResult {
  dataUrl: string
  fileName: string
  sizeKb: number
  width: number
  height: number
}

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
}

/**
 * Optimizes an image file down to a lightweight WebP/JPEG data URL using HTMLCanvas.
 * Prevents huge raw camera uploads (e.g. 10MB phone photos) from choking Firestore or network bandwidth.
 */
export async function optimizeImageForUpload(
  file: File,
  options: ImageOptimizationOptions = {}
): Promise<ProcessedImageResult> {
  const { maxWidth = 1200, maxHeight = 800, quality = 0.82 } = options

  if (!file.type.startsWith('image/')) {
    throw new Error('Selected file must be an image (PNG, JPG, WebP, GIF, etc.)')
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onerror = () => reject(new Error('Failed to read image file from device.'))

    reader.onload = () => {
      const img = new Image()

      img.onerror = () => reject(new Error('Failed to decode image.'))

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio constrained dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          // Fallback to original read if canvas context fails
          const fallbackKb = Math.round((reader.result as string).length / 1024)
          resolve({
            dataUrl: reader.result as string,
            fileName: file.name,
            sizeKb: fallbackKb,
            width: img.width,
            height: img.height,
          })
          return
        }

        // High quality bicubic scaling
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        // Try WebP first, fallback to JPEG
        let dataUrl: string
        try {
          dataUrl = canvas.toDataURL('image/webp', quality)
          if (!dataUrl.startsWith('data:image/webp')) {
            dataUrl = canvas.toDataURL('image/jpeg', quality)
          }
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality)
        }

        const sizeKb = Math.round((dataUrl.length * 3) / 4 / 1024)

        resolve({
          dataUrl,
          fileName: file.name,
          sizeKb,
          width,
          height,
        })
      }

      img.src = reader.result as string
    }

    reader.readAsDataURL(file)
  })
}
