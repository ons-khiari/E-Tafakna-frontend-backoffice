import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';

// Importing updated components and types specific to category projects
import { CategoryProjectsFilters } from '../../../components/dashboard/categoryProject/categoryProjects-filters'; // Updated component for category project filters
import { CategoryProjectsTable } from '../../../components/dashboard/categoryProject/categoryProjects-table'; // Updated component for category project table
import type { CategoryProject } from '../../../components/dashboard/categoryProject/categoryProjects-table'; // Updated type to CategoryProject

// Metadata for the page
export const metadata = { title: `Category Projects | Dashboard | ${config.site.name}` } satisfies Metadata;

// Placeholder data to satisfy CategoryProject type requirements
const categoryProjects = [] satisfies CategoryProject[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedCategoryProjects = applyPagination(categoryProjects, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Category Projects</Typography>
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
            Add Category Project
          </Button>
        </div>
      </Stack>
      {/* Filters component for category projects */}
      <CategoryProjectsFilters /> {/* Updated component for category project filters */}
      {/* Table component with pagination */}
      <CategoryProjectsTable
        count={paginatedCategoryProjects.length}
        page={page}
        rows={paginatedCategoryProjects}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

// Pagination function to apply slicing based on page and rows per page
function applyPagination(rows: CategoryProject[], page: number, rowsPerPage: number): CategoryProject[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
