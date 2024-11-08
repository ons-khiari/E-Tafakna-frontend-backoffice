'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Cancel, CheckCircle } from '@mui/icons-material';
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

export interface Skill {
  id: string;
  name: string;
  description: string;
}

interface SkillsTableProps {
  count?: number;
  page?: number;
  rows?: Skill[];
  rowsPerPage?: number;
}

export function SkillsTable({ count = 0, page = 0, rowsPerPage = 0 }: SkillsTableProps): React.JSX.Element {
  const [rows, setRows] = useState<Skill[]>([]);
  const [totalCount, setTotalCount] = useState(count);

  // Fetch skills from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/skills/getAll'); // Replace with the correct endpoint
        console.log('response', response);

        const skillData = response.data.map((skill: any) => ({
          id: skill.id.toString(),
          name: skill.name,
          description: skill.description,
        }));

        setRows(skillData);
        setTotalCount(skillData.length);
      } catch (error) {
        console.error('Error fetching skills:', error);
      }
    };
    fetchData();
  }, []);

  // Memoize row IDs for the selection hook
  const rowIds = React.useMemo(() => rows.map((skill) => skill.id), [rows]);

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
              <TableCell>Skill Name</TableCell>
              <TableCell>Description</TableCell>
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
