import './App.css'
import AppRoutes from './routes/AppRoutes'
import { useAuthInitialization } from './features/auth/hooks/useAuthInitialization'

function App() {
  useAuthInitialization();

  return <AppRoutes />;
}

export default App
