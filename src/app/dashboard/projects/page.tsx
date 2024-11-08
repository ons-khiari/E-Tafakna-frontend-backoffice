import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';



import { config } from '@/config';



import { ProjectsFilters } from '../../../components/dashboard/project/projects-filters'; // Updated component
import { ProjectsTable } from '../../../components/dashboard/project/projects-table'; // Updated component
import type { Project } from '../../../components/dashboard/project/projects-table'; // Update type to Project


export const metadata = { title: `Projects | Dashboard | ${config.site.name}` } satisfies Metadata;

const projects = [] satisfies Project[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedProjects = applyPagination(projects, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Projects</Typography>
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
            Add Project
          </Button>
        </div>
      </Stack>
      <ProjectsFilters /> {/* Updated component for project filters */}
      <ProjectsTable // Updated table component
        count={paginatedProjects.length}
        page={page}
        rows={paginatedProjects}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Project[], page: number, rowsPerPage: number): Project[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}