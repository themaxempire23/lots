import { useContext } from 'react';
import { AuthCtx } from '../context/auth-ctx';

export default function useAuth() {
  return useContext(AuthCtx);
}
