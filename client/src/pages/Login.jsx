import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Stack, Typography, Alert, Box } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function LoginPage() {
  const { login, setError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr(''); setError('');
    if (!email || !password) { setErr('Email and password are required'); return; }
    try {
      await login(email, password);
      nav('/dashboard');
    } catch (e) {
      setErr(e.message || 'Login failed');
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', mt: 6 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 420 }}>
        <Typography variant="h5" gutterBottom>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use your credentials to sign in.
        </Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" size="large">Login</Button>
          <Typography variant="body2">No account? <Link to="/signup">Create one</Link></Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
