import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth, RequireRole } from "./components/Auth";
import AppShell from "./components/AppShell";

import Landing from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import CareerAssessmentPage from "./pages/CareerAssessmentPage";
import CareerGuidancePage from "./pages/CareerGuidancePage";
import CareerPathwayDetailPage from "./pages/CareerPathwayDetailPage";
import CVLetterBuilderPage from "./pages/CVLetterBuilderPage";
import FAQPage from "./pages/FAQPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import OpportunityDetailsPage from "./pages/OpportunityDetailsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import LabourMarketExplorerPage from './pages/LabourMarketExplorerPage.jsx'



import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import PasswordReset from "./pages/auth/PasswordReset";
import PassportPublic from "./pages/passport/Public";

import TraineeDashboard from "./pages/trainee/Dashboard";
import TraineeDashboardPage from "./pages/TraineeDashboardPage.jsx";
import TraineeProfilePage from "./pages/TraineeProfilePage.jsx";

import PostOpportunityPage from "./pages/PostOpportunityPage.jsx";


import Opportunities from "./pages/trainee/Opportunities";
import OpportunityDetail from "./pages/trainee/OpportunityDetail";
import TraineeApplications from "./pages/trainee/Applications";
import ApplicationDetail from "./pages/shared/ApplicationDetail";
import Saved from "./pages/trainee/Saved";
import Passport from "./pages/trainee/Passport";
import TraineePlacements from "./pages/trainee/Placements";
import Profile from "./pages/trainee/Profile";
import Notifications from "./pages/shared/Notifications";
import Complaints from "./pages/shared/Complaints";
import DataRights from "./pages/trainee/DataRights";
import ApplyPage from './pages/ApplyPage.jsx'

import OrgDashboard from "./pages/org/Dashboard";
import Organization from "./pages/org/Organization";
import OrgOpportunities from "./pages/org/Opportunities";
import OpportunityForm from "./pages/org/OpportunityForm";
import OpportunityManage from "./pages/org/OpportunityManage";
import OrgApplications from "./pages/org/Applications";
import OrgPlacements from "./pages/org/Placements";
import PlacementDetail from "./pages/org/PlacementDetail";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminOrganizations from "./pages/admin/Organizations";
import AdminOpportunities from "./pages/admin/Opportunities";
import AdminUsers from "./pages/admin/Users";
import AdminComplaints from "./pages/admin/Complaints";
import AdminReports from "./pages/admin/Reports";
import AdminAudit from "./pages/admin/AuditLogs";

const ORG_ROLES = ["ORG_OFFICER", "ORG_SUPERVISOR"];

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/career-assessment" element={<CareerAssessmentPage />} />
      <Route path="/career-guidance" element={<CareerGuidancePage />} />
      <Route path="/career-guidance/:pathwayKey" element={<CareerPathwayDetailPage />} />
      <Route path="/cv-builder" element={<CVLetterBuilderPage />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/opportunities" element={<OpportunitiesPage />} />
      <Route path="/opportunities/:id" element={<OpportunityDetailsPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/labour-market" element={<LabourMarketExplorerPage />} />


      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/password-reset" element={<PasswordReset />} />
      <Route path="/passport/public/:token" element={<PassportPublic />} />

      {/* Trainee workspace */}
      <Route path="/app" element={<RequireRole roles={["TRAINEE"]}><AppShell><TraineeDashboard /></AppShell></RequireRole>} />
      <Route path="/app/opportunities" element={<RequireAuth><AppShell><Opportunities /></AppShell></RequireAuth>} />
      <Route path="/app/opportunities/:id" element={<RequireAuth><AppShell><OpportunityDetail /></AppShell></RequireAuth>} />
      <Route path="/app/applications" element={<RequireRole roles={["TRAINEE"]}><AppShell><TraineeApplications /></AppShell></RequireRole>} />
      <Route path="/app/applications/:id" element={<RequireAuth><AppShell><ApplicationDetail /></AppShell></RequireAuth>} />
      <Route path="/app/saved" element={<RequireRole roles={["TRAINEE"]}><AppShell><Saved /></AppShell></RequireRole>} />
      <Route path="/app/passport" element={<RequireRole roles={["TRAINEE"]}><AppShell><Passport /></AppShell></RequireRole>} />
      <Route path="/app/placements" element={<RequireRole roles={["TRAINEE"]}><AppShell><TraineePlacements /></AppShell></RequireRole>} />
      <Route path="/app/profile" element={<RequireRole roles={["TRAINEE"]}><AppShell><Profile /></AppShell></RequireRole>} />
      <Route path="/app/notifications" element={<RequireRole roles={["TRAINEE"]}><AppShell><Notifications /></AppShell></RequireRole>} />
      <Route path="/app/complaints" element={<RequireRole roles={["TRAINEE"]}><AppShell><Complaints /></AppShell></RequireRole>} />
      <Route path="/app/data" element={<RequireRole roles={["TRAINEE"]}><AppShell><DataRights /></AppShell></RequireRole>} />
  
      <Route path="/apply/:id" element={<RequireRole roles={["TRAINEE"]}><ApplyPage /></RequireRole>} />
      <Route path="/app/trainee/dashboard" element={<RequireRole roles={["TRAINEE"]}><TraineeDashboardPage /></RequireRole>} />
      
      <Route path="/app/trainee/profile" element={<RequireRole roles={["TRAINEE"]}><TraineeProfilePage /></RequireRole>} />
      
      
      <Route path="/app/org/post-opportunity" element={<RequireRole  roles={ORG_ROLES}><PostOpportunityPage /></RequireRole>} />
    
      

      {/* Organisation workspace */}
      <Route path="/app/org" element={<RequireRole roles={ORG_ROLES}><AppShell><OrgDashboard /></AppShell></RequireRole>} />
      <Route path="/app/org/organization" element={<RequireRole roles={ORG_ROLES}><AppShell><Organization /></AppShell></RequireRole>} />
      <Route path="/app/org/opportunities" element={<RequireRole roles={ORG_ROLES}><AppShell><OrgOpportunities /></AppShell></RequireRole>} />
      <Route path="/app/org/opportunities/new" element={<RequireRole roles={ORG_ROLES}><AppShell><OpportunityForm /></AppShell></RequireRole>} />
      <Route path="/app/org/opportunities/:id/edit" element={<RequireRole roles={ORG_ROLES}><AppShell><OpportunityForm /></AppShell></RequireRole>} />
      <Route path="/app/org/opportunities/:id" element={<RequireRole roles={ORG_ROLES}><AppShell><OpportunityManage /></AppShell></RequireRole>} />
      <Route path="/app/org/applications" element={<RequireRole roles={ORG_ROLES}><AppShell><OrgApplications /></AppShell></RequireRole>} />
      <Route path="/app/org/applications/:id" element={<RequireRole roles={ORG_ROLES}><AppShell><ApplicationDetail /></AppShell></RequireRole>} />
      <Route path="/app/org/placements" element={<RequireRole roles={ORG_ROLES}><AppShell><OrgPlacements /></AppShell></RequireRole>} />
      <Route path="/app/org/placements/:id" element={<RequireRole roles={ORG_ROLES}><AppShell><PlacementDetail /></AppShell></RequireRole>} />
      <Route path="/app/org/notifications" element={<RequireRole roles={ORG_ROLES}><AppShell><Notifications /></AppShell></RequireRole>} />
      <Route path="/app/org/complaints" element={<RequireRole roles={ORG_ROLES}><AppShell><Complaints /></AppShell></RequireRole>} />

      {/* Admin workspace */}
      <Route path="/app/admin" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminDashboard /></AppShell></RequireRole>} />
      <Route path="/app/admin/organizations" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminOrganizations /></AppShell></RequireRole>} />
      <Route path="/app/admin/opportunities" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminOpportunities /></AppShell></RequireRole>} />
      <Route path="/app/admin/users" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminUsers /></AppShell></RequireRole>} />
      <Route path="/app/admin/complaints" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminComplaints /></AppShell></RequireRole>} />
      <Route path="/app/admin/reports" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminReports /></AppShell></RequireRole>} />
      <Route path="/app/admin/audit" element={<RequireRole roles={["ADMIN"]}><AppShell><AdminAudit /></AppShell></RequireRole>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
