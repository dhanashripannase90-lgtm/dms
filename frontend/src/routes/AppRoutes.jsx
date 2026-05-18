import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import UserDashboardPage from "../pages/UserDashboardPage";
import UploadPage from "../pages/UploadPage";
import DocumentsPage from "../pages/DocumentsPage";
import UserManagementPage from "../pages/UserManagementPage";
import FoldersPage from "../pages/FoldersPage";
import ApprovalQueuePage from "../pages/ApprovalQueuePage";
import AuditLogPage from "../pages/AuditLogPage";
import TagManagementPage from "../pages/TagManagementPage";
import ProfilePage from "../pages/ProfilePage";
import ProtectedRoute from "./ProtectedRoute";
import { getRole, isAuthenticated } from "../utils/auth";

function DashboardRedirect() {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  return getRole() === "ADMIN" ? <AdminDashboardPage /> : <UserDashboardPage />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardRedirect /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/documents" element={<ProtectedRoute><DocumentsPage /></ProtectedRoute>} />
      <Route path="/folders" element={<ProtectedRoute><FoldersPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={["ADMIN"]}><UserManagementPage /></ProtectedRoute>} />
      <Route path="/admin/approval" element={<ProtectedRoute roles={["ADMIN"]}><ApprovalQueuePage /></ProtectedRoute>} />
      <Route path="/admin/tags" element={<ProtectedRoute roles={["ADMIN"]}><TagManagementPage /></ProtectedRoute>} />
      <Route path="/admin/audit-logs" element={<ProtectedRoute roles={["ADMIN"]}><AuditLogPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
