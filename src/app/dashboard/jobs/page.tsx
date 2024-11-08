import * as React from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';

import { config } from '@/config';
import { JobsFilters } from '../../../components/dashboard/job/jobs-filters'; // Updated component
import { JobsTable } from '../../../components/dashboard/job/jobs-table'; // Updated component
import type { Job } from '../../../components/dashboard/job/jobs-table'; // Update type to Job

export const metadata = { title: `Jobs | Dashboard | ${config.site.name}` } satisfies Metadata;

const jobs = [
] satisfies Job[];

export default function Page(): React.JSX.Element {
  const page = 0;
  const rowsPerPage = 5;

  const paginatedJobs = applyPagination(jobs, page, rowsPerPage);

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Jobs</Typography>
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
            Add Job
          </Button>
        </div>
      </Stack>
      <JobsFilters /> {/* Updated component for job filters */}
      <JobsTable // Updated table component
        count={paginatedJobs.length}
        page={page}
        rows={paginatedJobs}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  );
}

function applyPagination(rows: Job[], page: number, rowsPerPage: number): Job[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
