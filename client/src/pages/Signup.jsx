import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { TextField, Button, Paper, Stack, Typography, Alert } from '@mui/material'
import { useAuth } from '../context/AuthContext.jsx'

export default function SignupPage() {
  const { signup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    if (!email || !password) { setErr('Email and password are required'); return }
    if (password.length < 8) { setErr('Password must be at least 8 characters'); return }
    try {
      await signup(email, password, name)
      nav('/dashboard')
    } catch (e) {
      setErr(e.message || 'Signup failed')
    }
  }

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h5" gutterBottom>Signup</Typography>
      {err && <Alert severity="error" sx={{ mb: 2 }}>{err}</Alert>}
      <Stack component="form" spacing={2} onSubmit={onSubmit}>
        <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        <TextField label="Name (optional)" value={name} onChange={e => setName(e.target.value)} />
        <Button type="submit" variant="contained">Create account</Button>
        <Typography variant="body2">Already have an account? <Link to="/login">Login</Link></Typography>
      </Stack>
    </Paper>
  )
}
