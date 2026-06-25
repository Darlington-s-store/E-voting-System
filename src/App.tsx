import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { SiteLayout } from "@/layouts/SiteLayout";

import { VoterLayout } from "@/layouts/VoterLayout";
import { AdminLayout } from "@/layouts/AdminLayout";
import { ProtectedRoute } from "@/components/shared/ProtectedRoute";

// Public
import Home from "@/pages/public/Home";
import About from "@/pages/public/About";
import Features from "@/pages/public/Features";
import Contact from "@/pages/public/Contact";
import Help from "@/pages/public/Help";

// Auth
import Login from "@/pages/auth/Login";
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
import AdminReports from "@/pages/admin/Reports";
import AdminAuditLogs from "@/pages/admin/AuditLogs";
import AdminSettings from "@/pages/admin/Settings";

import NotFound from "@/pages/NotFound";

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
        </Route>

        <Route path="/login" element={<Login />} />
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
