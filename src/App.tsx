import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { VoterLayout } from "@/layouts/VoterLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";
import { useAuth } from "@/lib/auth-store";

// Auth
import Login from "@/pages/auth/Login";
import AdminLogin from "@/pages/auth/AdminLogin";
import Register from "@/pages/auth/Register";
import VerifyEmail from "@/pages/auth/VerifyEmail";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";
import TwoFactor from "@/pages/auth/TwoFactor";

// Voter
import VoterDashboard from "@/pages/voter/Dashboard";
import VoterElections from "@/pages/voter/Elections";
import VoterElectionDetail from "@/pages/voter/ElectionDetail";
import VotingBooth from "@/pages/voter/VotingBooth";
import AwardsVotingBooth from "@/pages/voter/AwardsVotingBooth";
import VoterHistory from "@/pages/voter/History";
import VoterApplyCandidacy from "@/pages/voter/ApplyCandidacy";
import VoterNotifications from "@/pages/voter/Notifications";
import VoterProfile from "@/pages/voter/Profile";

// Admin
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminElections from "@/pages/admin/Elections";
import AdminCreateElection from "@/pages/admin/CreateElection";
import AdminElectionDetail from "@/pages/admin/ElectionDetail";
import AdminResults from "@/pages/admin/Results";
import AdminVoters from "@/pages/admin/Voters";
import AdminCandidates from "@/pages/admin/Candidates";
import AdminCreateCandidate from "@/pages/admin/CreateCandidate";
import AdminEditCandidate from "@/pages/admin/EditCandidate";
import AdminPositions from "@/pages/admin/Positions";
import AdminPartylists from "@/pages/admin/Partylists";
import AdminManageAdmins from "@/pages/admin/Admins";
import AdminReports from "@/pages/admin/Reports";
import AdminAuditLogs from "@/pages/admin/AuditLogs";
import AdminSettings from "@/pages/admin/Settings";

import NotFound from "@/pages/NotFound";

function RootRedirect() {
  const user = useAuth((s) => s.user);
  if (user?.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === "voter") return <Navigate to="/voter/dashboard" replace />;
  return <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<RootRedirect />} />

        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/2fa/verify" element={<TwoFactor />} />

        <Route element={<ProtectedRoute role="voter" />}>
          <Route element={<VoterLayout />}>
            <Route path="/voter" element={<Navigate to="/voter/dashboard" replace />} />
            <Route path="/voter/dashboard" element={<VoterDashboard />} />
            <Route path="/voter/elections" element={<VoterElections />} />
            <Route path="/voter/elections/:id" element={<VoterElectionDetail />} />
            <Route path="/voter/elections/:id/vote" element={<VotingBooth />} />
            <Route path="/voter/awards/:id/vote" element={<AwardsVotingBooth />} />
            <Route path="/voter/history" element={<VoterHistory />} />
            <Route path="/voter/apply" element={<VoterApplyCandidacy />} />
            <Route path="/voter/notifications" element={<VoterNotifications />} />
            <Route path="/voter/profile" element={<VoterProfile />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute role="admin" />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/elections" element={<AdminElections />} />
            <Route path="/admin/elections/create" element={<AdminCreateElection />} />
            <Route path="/admin/elections/:id" element={<AdminElectionDetail />} />
            <Route path="/admin/elections/:id/results" element={<AdminResults />} />
            <Route path="/admin/voters" element={<AdminVoters />} />
            <Route path="/admin/candidates" element={<AdminCandidates />} />
            <Route path="/admin/candidates/create" element={<AdminCreateCandidate />} />
            <Route path="/admin/candidates/:id/edit" element={<AdminEditCandidate />} />
            <Route path="/admin/positions" element={<AdminPositions />} />
            <Route path="/admin/partylists" element={<AdminPartylists />} />
            <Route path="/admin/manage-admins" element={<AdminManageAdmins />} />
            <Route path="/admin/reports" element={<AdminReports />} />
            <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </>
  );
}
