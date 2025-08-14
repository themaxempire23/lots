import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TextField, Button, Paper, Stack, Typography, Alert, Box } from '@mui/material';
import useAuth from '../hooks/useAuth';

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [err, setErr] = useState('');
  const nav = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    setErr('');
    if (!email || !password) { setErr('Email and password are required'); return; }
    if (password.length < 8) { setErr('Password must be at least 8 characters'); return; }
    try {
      await signup(email, password, name);
      nav('/dashboard');
    } catch (e) {
      setErr(e.message || 'Signup failed');
    }
  }

  return (
    <Box sx={{ display: 'grid', placeItems: 'center', mt: 6 }}>
      <Paper sx={{ p: 4, width: '100%', maxWidth: 480 }}>
        <Typography variant="h5" gutterBottom>Create your account</Typography>
        {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
        <Stack component="form" spacing={2} onSubmit={onSubmit}>
          <TextField label="Full name (optional)" value={name} onChange={e => setName(e.target.value)} />
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          <Button type="submit" variant="contained" size="large">Create account</Button>
          <Typography variant="body2">Already have an account? <Link to="/login">Login</Link></Typography>
        </Stack>
      </Paper>
    </Box>
  );
}
