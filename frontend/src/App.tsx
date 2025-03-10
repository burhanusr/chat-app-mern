import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingPage from './pages/SettingPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useThemeStore } from './store/useThemeStore';

function App() {
   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
   const { theme } = useThemeStore();

   // auth handler
   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   if (isCheckingAuth && !authUser) {
      return (
         <div className="flex h-screen items-center justify-center">
            <Loader className="size-10 animate-spin" />
         </div>
      );
   }

   return (
      <div data-theme={theme}>
         <Navbar />

         <Routes>
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" replace />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" replace />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" replace />} />
            <Route path="/settings" element={<SettingPage />} />
            <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" replace />} />
         </Routes>

         <Toaster />
      </div>
   );
}

export default App;
