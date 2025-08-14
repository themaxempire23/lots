import { Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import {
  ThemeProvider, createTheme, CssBaseline, AppBar, Toolbar,
  Typography, Button, Container, Box, Avatar
} from '@mui/material';
import { AuthProvider } from './context/AuthContext.jsx';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/Login.jsx';
import SignupPage from './pages/Signup.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import TaskFormPage from './pages/TaskForm.jsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1e88e5' },
    secondary: { main: '#7c4dff' },
    background: { default: '#f7f9fc' },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: { styleOverrides: { root: { borderRadius: 14 } } },
    MuiTableCell: { styleOverrides: { head: { background: '#f3f6fb' } } },
  },
});

function TopBar() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const onLogout = async () => { await logout(); nav('/login'); };

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: 'linear-gradient(90deg,#1e88e5,#7c4dff)' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}>
          LOTS Tasks
        </Typography>
        {!user ? (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/signup">Signup</Button>
          </>
        ) : (
          <>
            <Avatar sx={{ width: 28, height: 28, mr: 1 }}>{(user.name || user.email || 'U')[0].toUpperCase()}</Avatar>
            <Typography sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}>{user.email}</Typography>
            <Button color="inherit" onClick={onLogout}>Logout</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <Box p={3}>Loading...</Box>;
  return user ? children : <Navigate to="/login" replace />;
}

function Shell() {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
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
  );
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
  );
}
