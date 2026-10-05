import type { GitHubStats } from '../types'

export const GITHUB_STATS_STORAGE_KEY = 'portfolio_github_stats_cache_v1'
export const GITHUB_STATS_UPDATE_INTERVAL_MS = 12 * 60 * 60 * 1000 // 12 hours

export const DEFAULT_GITHUB_STATS: GitHubStats = {
  projectCount: 94,
  commitCount: 312,
  lastUpdated: 0,
}

/**
 * Extracts username from a full GitHub URL (e.g. 'https://github.com/Thabisomaqhawengwenya')
 * or returns clean username directly.
 */
export function extractGitHubUsername(inputUrlOrUsername?: string): string {
  const fallback = 'Thabisomaqhawengwenya'
  if (!inputUrlOrUsername || typeof inputUrlOrUsername !== 'string') return fallback
  
  const trimmed = inputUrlOrUsername.trim()
  if (!trimmed) return fallback

  try {
    if (trimmed.includes('github.com/')) {
      const parts = trimmed.split('github.com/')[1].split('/')[0].trim()
      return parts.replace(/[^a-zA-Z0-9_-]/g, '') || fallback
    }
  } catch {
    return fallback
  }

  return trimmed.replace(/[^a-zA-Z0-9_-]/g, '') || fallback
}

export function getCachedGitHubStats(): GitHubStats | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(GITHUB_STATS_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as GitHubStats
    if (
      typeof parsed?.projectCount === 'number' &&
      typeof parsed?.commitCount === 'number' &&
      typeof parsed?.lastUpdated === 'number' &&
      parsed.projectCount > 0
    ) {
      return parsed
    }
  } catch (err) {
    console.warn('[GitHubStats] Failed reading localStorage cache:', err)
  }
  return null
}

export function setCachedGitHubStats(stats: GitHubStats): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(GITHUB_STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch (err) {
    console.warn('[GitHubStats] Failed writing localStorage cache:', err)
  }
}

/**
 * Performs actual network request to GitHub API to get:
 * 1. public_repos count from user profile
 * 2. total_count of authored commits from commit search API
 */
export async function fetchLiveGitHubStats(
  usernameInput?: string,
  fallbackStats?: GitHubStats
): Promise<GitHubStats> {
  const username = extractGitHubUsername(usernameInput)
  const cached = getCachedGitHubStats()
  const fallback: GitHubStats = fallbackStats ?? cached ?? DEFAULT_GITHUB_STATS

  try {
    const [userRes, commitRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: {
          Accept: 'application/vnd.github.v3+json',
        },
      }),
      fetch(`https://api.github.com/search/commits?q=author:${username}`, {
        headers: {
          Accept: 'application/vnd.github.cloak-preview+json, application/vnd.github.v3+json',
        },
      }),
    ])

    let projectCount = fallback.projectCount
    let commitCount = fallback.commitCount

    if (userRes.ok) {
      const userData = await userRes.json()
      if (typeof userData.public_repos === 'number' && userData.public_repos > 0) {
        projectCount = userData.public_repos
      }
    } else {
      console.warn(`[GitHubStats] GitHub users API returned HTTP ${userRes.status}`)
    }

    if (commitRes.ok) {
      const commitData = await commitRes.json()
      if (typeof commitData.total_count === 'number' && commitData.total_count > 0) {
        commitCount = commitData.total_count
      }
    } else {
      console.warn(`[GitHubStats] GitHub commits search API returned HTTP ${commitRes.status}`)
    }

    const updatedStats: GitHubStats = {
      projectCount,
      commitCount,
      lastUpdated: Date.now(),
    }

    setCachedGitHubStats(updatedStats)
    return updatedStats
  } catch (error) {
    console.error('[GitHubStats] Network error fetching GitHub stats:', error)
    return fallback
  }
}

/**
 * Returns cached stats if less than 12 hours old, otherwise triggers background fetch.
 */
export async function getOrUpdateGitHubStats(
  usernameInput?: string,
  forceRefresh = false
): Promise<GitHubStats> {
  const username = extractGitHubUsername(usernameInput)
  const cached = getCachedGitHubStats()
  const now = Date.now()

  if (
    !forceRefresh &&
    cached &&
    cached.lastUpdated > 0 &&
    now - cached.lastUpdated < GITHUB_STATS_UPDATE_INTERVAL_MS
  ) {
    return cached
  }

  return fetchLiveGitHubStats(username, cached ?? undefined)
}
