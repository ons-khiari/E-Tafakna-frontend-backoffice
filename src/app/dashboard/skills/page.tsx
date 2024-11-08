import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';

// Importing updated components and types specific to skills
import { SkillsFilters } from '../../../components/dashboard/skill/skills-filters'; // Updated component
import { SkillsTable } from '../../../components/dashboard/skill/skills-table'; // Updated component
import type { Skill } from '../../../components/dashboard/skill/skills-table'; // Update type to Skill

export const metadata = { title: `Skills | Dashboard | ${config.site.name}` } satisfies Metadata;

// Placeholder data to satisfy Skill type requirements
const skills = [] satisfies Skill[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedSkills = applyPagination(skills, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Skills</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button color="inherit" startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}>
              Import
            </Button>
            <Button color="inherit" startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}>
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add Skill
          </Button>
        </div>
      </Stack>
      {/* Filters component for skills */}
      <SkillsFilters /> {/* Updated component for skill filters */}
      {/* Table component with pagination */}
      <SkillsTable count={paginatedSkills.length} page={page} rows={paginatedSkills} rowsPerPage={rowsPerPage} />
    </Stack>
  );
}

// Pagination function to apply slicing based on page and rows per page
function applyPagination(rows: Skill[], page: number, rowsPerPage: number): Skill[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
