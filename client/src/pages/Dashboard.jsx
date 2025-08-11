import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Paper, Stack, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography, Pagination } from '@mui/material'

export default function DashboardPage() {
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [q, setQ] = useState('')

  const load = useCallback(async (p, l, search) => {
    const res = await api.listTasks({ page: p, limit: l, q: search })
    setItems(res.items)
    setPage(res.page)
    setLimit(res.limit)
    setTotalPages(res.totalPages)
  }, [])

  useEffect(() => { load(1, limit, q) }, [load, limit, q])

  function onSearchSubmit(e) {
    e.preventDefault()
    load(1, limit, q)
  }

  async function onDelete(id) {
    if (!confirm('Delete this task?')) return
    await api.deleteTask(id)
    load(page, limit, q)
  }

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Stack direction="row" spacing={2} component="form" onSubmit={onSearchSubmit}>
        <TextField size="small" label="Search" value={q} onChange={e => setQ(e.target.value)} />
        <Button type="submit" variant="outlined">Search</Button>
        <Button component={Link} to="/tasks/new" variant="contained" sx={{ ml: 'auto' }}>New Task</Button>
      </Stack>

      <Table sx={{ mt: 2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Updated</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map(t => (
            <TableRow key={t.id}>
              <TableCell>{t.title}</TableCell>
              <TableCell>{t.description || '-'}</TableCell>
              <TableCell>{new Date(t.updatedAt).toLocaleString()}</TableCell>
              <TableCell align="right">
                <Button component={Link} to={/tasks/} size="small">Edit</Button>
                <Button color="error" size="small" onClick={() => onDelete(t.id)}>Delete</Button>
              </TableCell>
            </TableRow>
          ))}
          {items.length === 0 && (
            <TableRow><TableCell colSpan={4}><Typography>No tasks yet.</Typography></TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      <Stack alignItems="center" sx={{ mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_, p) => load(p, limit, q)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </Paper>
  )
}
