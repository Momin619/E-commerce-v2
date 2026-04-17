import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./styles/output.css";
import Loader from "./components/ui/Loader";

import { ProtectedRoute } from "./components/Auth/ProtectedRoute";

// ─── Pages (lazy loaded) ─────────────────────────────────────────────────────

const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const SignupPage = lazy(() => import("./pages/Auth/SignupPage"));

const SellerDashboard = lazy(
  () => import("./pages/sellers/SellerDashboardPage")
);

const CustomerHome = lazy(
  () => import("./pages/customers/CustomerHomePage")
);

export default function App()
{


  return (
    <>
      <Toaster position="top-right" />

      <Suspense fallback={<Loader />}>
        <Routes>
          {/* ─── PUBLIC ROUTES ─────────────────────────────── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* ─── CUSTOMER ROUTES ───────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles="customer" />}>
            <Route path="/" element={<CustomerHome />} />
          </Route>

          {/* ─── SELLER ROUTES ─────────────────────────────── */}
          <Route element={<ProtectedRoute allowedRoles="seller" />}>
            <Route
              path="/seller/dashboard"
              element={<SellerDashboard />}
            />
          </Route>

          {/* ─── FALLBACK ─────────────────────────────────── */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </>
  );
}
