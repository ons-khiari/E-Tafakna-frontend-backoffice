'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Cancel, CheckCircle, DeleteForever, ModeEdit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

import { useSelection } from '@/hooks/use-selection';

import axiosInstance from '../../../services/api';

function noop(): void {
  // do nothing
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  jobType: string;
  experienceLevel: string;
  qualifications: string;
  description: string;
  budgetmin: number;
  budgetmax: number;
  status: string; // jobStatus renamed to status for consistency
  postedAt: string;
  postedById: number;
}

interface JobsTableProps {
  count?: number;
  page?: number;
  rows?: Job[];
  rowsPerPage?: number;
}

export function JobsTable({ count = 0, page = 0, rowsPerPage = 0 }: JobsTableProps): React.JSX.Element {
  const [rows, setRows] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(count);

  // Fetch jobs from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/job/getAll'); // Update endpoint if needed
        console.log('response', response);

        const jobData = response.data.map((job: any) => ({
          id: job.id.toString(),
          title: job.title,
          company: job.Company, // Using 'Company' as per your example
          location: job.location,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          qualifications: job.Qualifications, // Added qualifications
          description: job.description, // Added description
          budgetmin: job.budgetmin, // Added budgetmin
          budgetmax: job.budgetmax, // Added budgetmax
          status: job.jobStatus, // Renamed to status
          postedAt: job.postedAt,
          postedById: job.postedById,
        }));

        setRows(jobData);
        setTotalCount(jobData.length);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchData();
  }, []);

  // Memoize row IDs for the selection hook
  const rowIds = React.useMemo(() => rows.map((job) => job.id), [rows]);

  // Destructure selection functions from the hook
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected?.size > 0 && selected?.size < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Job Type</TableCell> {/* New column */}
              <TableCell>Experience Level</TableCell> {/* New column */}
              <TableCell>Qualifications</TableCell> {/* New column */}
              <TableCell>Job Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.company}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.jobType}</TableCell> {/* New data */}
                  <TableCell>{row.experienceLevel}</TableCell> {/* New data */}
                  <TableCell>{row.qualifications}</TableCell> {/* New data */}
                  <TableCell>
                    {row.status === 'AVAILABLE' ? (
                      <CheckCircle sx={{ color: 'green' }} />
                    ) : (
                      <Cancel sx={{ color: 'red' }} />
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton sx={{ color: 'green' }}>
                      <ModeEdit  />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }}>
                      <DeleteForever  />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <TablePagination
        component="div"
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
