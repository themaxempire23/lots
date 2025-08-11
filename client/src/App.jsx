import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom'
import { ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/Login.jsx'
import SignupPage from './pages/Signup.jsx'
import DashboardPage from './pages/Dashboard.jsx'
import TaskFormPage from './pages/TaskForm.jsx'

const theme = createTheme()

function TopBar() {
  const { user, logout } = useAuth()
  const nav = useNavigate()
  const onLogout = async () => {
    await logout()
    nav('/login')
  }
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          LOTS Tasks
        </Typography>
        {!user ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </>
        ) : (
          <>
            <Typography sx={{ mr: 2 }}>{user.email}</Typography>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <Box p={3}>Loading...</Box>
  return user ? children : <Navigate to="/login" replace />
}

function Shell() {
  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/tasks/new" element={<ProtectedRoute><TaskFormPage mode="create" /></ProtectedRoute>} />
        <Route path="/tasks/:id" element={<ProtectedRoute><TaskFormPage mode="edit" /></ProtectedRoute>} />
        <Route path="*" element={<Box p={3}>Not found</Box>} />
      </Routes>
    </Container>
  )
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <TopBar />
        <Shell />
      </AuthProvider>
    </ThemeProvider>
  )
}
