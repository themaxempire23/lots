import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Paper, Stack, TextField, Button, Alert, Typography, Box } from '@mui/material';
import { api } from '../lib/api';

export default function TaskFormPage({ mode }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [err, setErr] = useState('');

  useEffect(() => {
    if (mode === 'edit' && id) {
      api.getTask(id).then(r => {
        setTitle(r.task.title || '');
        setDescription(r.task.description || '');
      }).catch(e => setErr(e.message || 'Failed to load task'));
    }
  }, [mode, id]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!title.trim()) { setErr('Title is required'); return; }
    try {
      if (mode === 'create') {
        await api.createTask({ title, description });
      } else {
        await api.updateTask(id, { title, description });
      }
      nav('/dashboard');
    } catch (e) {
      setErr(e.message || 'Save failed');
    }
  }

  return (
    <Box sx={{ mt: 3, display: 'grid', placeItems: 'center' }}>
      <Paper sx={{ p: 3, width: '100%', maxWidth: 640 }}>
        <Typography variant="h6" gutterBottom>
          {mode === 'create' ? 'New Task' : 'Edit Task'}
        </Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <Stack spacing={2} component="form" onSubmit={onSubmit}>
          <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
          <TextField label="Description" multiline minRows={4} value={description} onChange={e => setDescription(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <Button type="submit" variant="contained">Save</Button>
            <Button onClick={() => nav(-1)} variant="outlined">Cancel</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
