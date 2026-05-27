import type { ElementType } from 'react'
import {
  FileText,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Users,
  UsersRound,
} from 'lucide-react'

export type AppRoute = 'dashboard' | 'users' | 'teams' | 'roles' | 'audit' | 'settings'

export interface NavItemDefinition {
  id: AppRoute
  label: string
  icon: ElementType
}

export const PRIMARY_NAV: NavItemDefinition[] = [
  { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'teams', label: 'Teams', icon: UsersRound },
  { id: 'roles', label: 'Roles & Permissions', icon: ShieldCheck },
  { id: 'audit', label: 'Audit Log', icon: FileText },
]

export const SECONDARY_NAV: NavItemDefinition[] = [
  { id: 'settings', label: 'Settings', icon: Settings },
]

function normalizeBasePath(basePath: string) {
  if (basePath === '/' || basePath === '') {
    return ''
  }

  return basePath.endsWith('/') ? basePath.slice(0, -1) : basePath
}

export function getRouteHref(basePath: string, route: AppRoute) {
  const normalizedBasePath = normalizeBasePath(basePath)
  return `${normalizedBasePath}/${route}`.replace(/\/{2,}/g, '/')
}

export function getRouteAliases(basePath: string, route: AppRoute) {
  const href = getRouteHref(basePath, route)

  if (route !== 'users') {
    return [href]
  }

  const normalizedBasePath = normalizeBasePath(basePath)
  return normalizedBasePath ? [normalizedBasePath, href] : ['/', href]
}

export function isRouteActive(pathname: string, basePath: string, route: AppRoute) {
  return getRouteAliases(basePath, route).includes(pathname)
}
