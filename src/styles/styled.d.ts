import type { Theme } from './theme'
import type { AdminTheme } from '../admin/adminTheme'

declare module 'styled-components' {
  export interface DefaultTheme extends Theme, Partial<AdminTheme> {
    accentText?: string
    navBg?:      string
  }
}
