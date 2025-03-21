import { Suspense, lazy } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { useAuthStore } from "./stores/authStore"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import AdminRoute from "./components/auth/AdminRoute"
import Layout from "./components/layout/Layout"
import LoadingPage from "./components/common/LoadingPage"

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"))
const LoginPage = lazy(() => import("./pages/auth/LoginPage"))
const RegisterPage = lazy(() => import("./pages/auth/Registerpage"))
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage"))
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage"))
const ProfilePage = lazy(() => import("./pages/user/ProfilePage"))
const PostDetailPage = lazy(() => import("./pages/posts/PostDetailPage"))
const CreatePostPage = lazy(() => import("./pages/posts/CreatePostPage"))
const EditPostPage = lazy(() => import("./pages/posts/EditPostPage"))
const DraftsPage = lazy(() => import("./pages/posts/DraftsPage"))
const AdminDashboardPage = lazy(() => import("./pages/admin/DashboardPage"))
const AdminUsersPage = lazy(() => import("./pages/admin/UsersPage"))
const AdminPostsPage = lazy(() => import("./pages/admin/PostsPage"))
const AdminCommentsPage = lazy(() => import("./pages/admin/CommentsPage"))
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"))

function App() {
  const { initialized } = useAuthStore()

  if (!initialized) {
    return <LoadingPage />
  }

  return (
    <>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="posts/:id" element={<PostDetailPage />} />

            {/* Auth routes */}
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />
            <Route path="reset-password/:token" element={<ResetPasswordPage />} />

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="posts/create" element={<CreatePostPage />} />
              <Route path="posts/edit/:id" element={<EditPostPage />} />
              <Route path="drafts" element={<DraftsPage />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="admin/users" element={<AdminUsersPage />} />
              <Route path="admin/posts" element={<AdminPostsPage />} />
              <Route path="admin/comments" element={<AdminCommentsPage />} />
            </Route>

            <Route path="404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
    </>
  )
}

export default App

