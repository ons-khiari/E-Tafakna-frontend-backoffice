'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Cancel, CheckCircle, DeleteForever, ModeEdit } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton } from '@mui/material';
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

export interface CategoryProject {
  id: string;
  name: string;
  description: string;
}

interface CategoryProjectsTableProps {
  count?: number;
  page?: number;
  rows?: CategoryProject[];
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
}

export function CategoryProjectsTable({
  count = 0,
  page = 0,
  rowsPerPage = 0,
}: CategoryProjectsTableProps): React.JSX.Element {
  const [rows, setRows] = useState<CategoryProject[]>([]);
  const [totalCount, setTotalCount] = useState(count);

  // Fetch category projects from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/category-project/getAll'); // Replace with the correct endpoint
        console.log('response', response);

        const categoryData = response.data.map((category: any) => ({
          id: category.id.toString(),
          name: category.name,
          description: category.description,
        }));

        setRows(categoryData);
        setTotalCount(categoryData.length);
      } catch (error) {
        console.error('Error fetching category projects:', error);
      }
    };
    fetchData();
  }, []);

  // Memoize row IDs for the selection hook
  const rowIds = React.useMemo(() => rows.map((category) => category.id), [rows]);

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
              <TableCell>Category Name</TableCell>
              <TableCell>Description</TableCell>
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
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    <IconButton sx={{ color: 'green' }}>
                      <ModeEdit />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }}>
                      <DeleteForever />
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
        count={totalCount}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
}
