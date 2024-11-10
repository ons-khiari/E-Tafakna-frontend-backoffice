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

export interface Customer {
  id: string;
  avatar: string;
  email: string;
  role: string;
  verified: boolean;
}

interface CustomersTableProps {
  count?: number;
  page?: number;
  rows?: Customer[];
  rowsPerPage?: number;
}

export function CustomersTable({ count = 0, page = 0, rowsPerPage = 0 }: CustomersTableProps): React.JSX.Element {
  const [rows, setRows] = useState<Customer[]>([]);
  const [totalCount, setTotalCount] = useState(count);

  // Fetch users from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/auth/users');
        console.log('response', response);

        const userData = response.data.map((user: any) => ({
          id: user.id.toString(),
          email: user.email,
          role: user.role,
          verified: user.verified,
        }));
        setRows(userData);
        setTotalCount(userData.length);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchData();
  }, []);

  // Memoize row IDs for the selection hook
  const rowIds = React.useMemo(() => rows.map((customer) => customer.id), [rows]);

  // Destructure selection functions from the hook
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = selected?.size > 0 && selected?.size < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const handleDelete = async (id: string) => {
    try {
      // Send DELETE request to API
      await axiosInstance.delete(`/auth/delete/${id}`);
      setRows((prevRows) => prevRows.filter((row) => row.id !== id));
      setTotalCount((prevCount) => prevCount - 1); // Decrease the total count after deletion
      console.log(`Deleted user with ID: ${id}`);
      setOpenDialog(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleOpenDialog = (id: string) => {
    setDeleteId(id); // Set the ID of the customer to be deleted
    setOpenDialog(true); // Open the dialog
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDeleteId(null); // Reset the delete ID
  };
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
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Account Status</TableCell>
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
                  <TableCell>
                    <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="subtitle2">{row.email}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    {row.verified ? <CheckCircle sx={{ color: 'green' }} /> : <Cancel sx={{ color: 'red' }} />}
                  </TableCell>{' '}
                  <TableCell>
                    <IconButton sx={{ color: 'green' }}>
                      <ModeEdit />
                    </IconButton>
                    <IconButton sx={{ color: 'red' }} onClick={() => handleOpenDialog(row.id)}>
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
        count={count}
        onPageChange={noop}
        onRowsPerPageChange={noop}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* Confirmation Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (deleteId) {
                handleDelete(deleteId);
              }
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
