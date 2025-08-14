import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import {
  Paper, Stack, TextField, Button, Table, TableBody, TableCell,
  TableHead, TableRow, Typography, Pagination, TableContainer,
  IconButton, Tooltip, LinearProgress, Box
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (p, l, search) => {
    setLoading(true);
    try {
      const res = await api.listTasks({ page: p, limit: l, q: search });
      setItems(res.items);
      setPage(res.page);
      setLimit(res.limit);
      setTotalPages(res.totalPages);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(1, limit, q); }, [load, limit, q]);

  function onSearchSubmit(e) {
    e.preventDefault();
    load(1, limit, q);
  }

  async function onDelete(id) {
    if (!confirm('Delete this task?')) return;
    await api.deleteTask(id);
    load(page, limit, q);
  }

  return (
    <Paper sx={{ p: 3, mt: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} component="form" onSubmit={onSearchSubmit} alignItems={{ xs: 'stretch', sm: 'center' }}>
        <TextField size="small" label="Search tasks" value={q} onChange={e => setQ(e.target.value)} sx={{ flex: 1, maxWidth: 480 }} />
        <Stack direction="row" spacing={1}>
          <Button type="submit" variant="outlined">Search</Button>
          <Button component={Link} to="/tasks/new" variant="contained">New Task</Button>
        </Stack>
      </Stack>

      {loading && <Box sx={{ mt: 2 }}><LinearProgress /></Box>}

      <TableContainer sx={{ mt: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Updated</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(t => (
              <TableRow key={t.id} hover>
                <TableCell>{t.title}</TableCell>
                <TableCell sx={{ color: 'text.secondary' }}>{t.description || '—'}</TableCell>
                <TableCell>{new Date(t.updatedAt).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <Tooltip title="Edit">
                    <IconButton component={Link} to={`/tasks/${t.id}`} size="small">
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton color="error" size="small" onClick={() => onDelete(t.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {!loading && items.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography color="text.secondary">No tasks yet. Click “New Task” to create your first one.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          color="primary"
          count={totalPages}
          page={page}
          onChange={(_, p) => load(p, limit, q)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Paper>
  );
}
