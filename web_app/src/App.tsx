import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LoginPage from './pages/Auth/LoginPage';
import RegisterPage from './pages/Auth/RegisterPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import NotesPage from './pages/Notes/NotesPage';
import NoteDetailPage from './pages/Notes/NoteDetailPage';
import NoteEditPage from './pages/Notes/NoteEditPage';
import CategoriesPage from './pages/Categories/CategoriesPage';
import ReviewPage from './pages/Review/ReviewPage';
import Layout from './components/Layout';

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />} />

      <Route element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/notes/new" element={<NoteEditPage />} />
        <Route path="/notes/:id/edit" element={<NoteEditPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/review/:taskId" element={<ReviewPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;