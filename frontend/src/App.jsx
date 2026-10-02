import { AuthProvider, useAuth } from "./auth/AuthContext";
import LoginPage from "./auth/LoginPage";
import Dashboard from "./dashboard/Dashboard";

function Application() {
  const { session } = useAuth();
  return session ? <Dashboard /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <Application />
    </AuthProvider>
  );
}
