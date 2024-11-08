import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
  { key: 'customers', title: 'Users', href: paths.dashboard.customers, icon: 'users' },
  { key: 'jobs', title: 'Jobs', href: paths.dashboard.jobs, icon: 'jobs' },
  { key: 'projects', title: 'Projects', href: paths.dashboard.projects, icon: 'projects' },
  { key: 'categoryProjects', title: 'Category Projects', href: paths.dashboard.categoryProjects, icon: 'categoryProject' },
  { key: 'skills', title: 'Skills', href: paths.dashboard.skills, icon: 'skills' },
  // { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
  { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
  // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];