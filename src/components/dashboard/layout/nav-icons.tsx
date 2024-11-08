import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Briefcase } from '@phosphor-icons/react/dist/ssr/Briefcase';
import { ChartPie as ChartPieIcon } from '@phosphor-icons/react/dist/ssr/ChartPie';
import { ClipboardText as ClipboardTextIcon } from '@phosphor-icons/react/dist/ssr/ClipboardText'; // New project icon

import { FolderSimple as CategoryIcon } from '@phosphor-icons/react/dist/ssr/FolderSimple'; // New category icon
import { GearSix as GearSixIcon } from '@phosphor-icons/react/dist/ssr/GearSix';
import { PlugsConnected as PlugsConnectedIcon } from '@phosphor-icons/react/dist/ssr/PlugsConnected';
import { Star as SkillIcon } from '@phosphor-icons/react/dist/ssr/Star';
import { User as UserIcon } from '@phosphor-icons/react/dist/ssr/User';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import { XSquare } from '@phosphor-icons/react/dist/ssr/XSquare';





export const navIcons = {
  'chart-pie': ChartPieIcon,
  'gear-six': GearSixIcon,
  'plugs-connected': PlugsConnectedIcon,
  'x-square': XSquare,
  user: UserIcon,
  users: UsersIcon,
  jobs: Briefcase,
  projects: ClipboardTextIcon,
  categoryProject: CategoryIcon,
  skills: SkillIcon,
} as Record<string, Icon>;