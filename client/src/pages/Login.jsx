import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Paper, Stack, Typography, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

export default function LoginPage() {
  const { login, setError } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setErr(''); setError('')
    if (!email || !password) { setErr('Email and password are required'); return }
    try {
      await login(email, password)
      nav('/dashboard')
    } catch (e) {
      setErr(e.message || 'Login failed')
    }
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained">Login</Button>
        <Typography variant="body2">No account? <Link to="/signup">Signup</Link></Typography>
      </Stack>
    </Paper>
  )
}
