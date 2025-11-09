// App.tsx - 主应用组件
import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import { PrivateRoute } from './components/layout/PrivateRoute';

// Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { HomePage } from './pages/home/HomePage';
import { NotesPage } from './pages/notes/NotesPage';
import { NoteDetailPage } from './pages/notes/NoteDetailPage';
import { NoteEditPage } from './pages/notes/NoteEditPage';
import { CategoriesPage } from './pages/categories/CategoriesPage';
import { ReviewPage } from './pages/review/ReviewPage';

function App() {
  const { initAuth } = useAuthStore();

  // 初始化认证状态
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <BrowserRouter>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* 受保护路由 */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notes"
          element={
            <PrivateRoute>
              <NotesPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notes/new"
          element={
            <PrivateRoute>
              <NoteEditPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notes/:id"
          element={
            <PrivateRoute>
              <NoteDetailPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/notes/:id/edit"
          element={
            <PrivateRoute>
              <NoteEditPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/categories"
          element={
            <PrivateRoute>
              <CategoriesPage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/review/:id"
          element={
            <PrivateRoute>
              <ReviewPage />
            </PrivateRoute>
          }
        />

        {/* 404 重定向 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
