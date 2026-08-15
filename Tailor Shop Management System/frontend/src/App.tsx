import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Public pages
import HomePage from "./pages/public/HomePage.tsx";
import LoginPage from "./pages/public/LoginPage.tsx";
import NotFoundPage from "./pages/public/NotFoundPage.tsx";
import SignupPage from "./pages/public/SignupPage.tsx";
import AboutPage from "./pages/public/AboutPage.tsx";
import ContactPage from "./pages/public/ContactPage.tsx";

// User pages
import UserDashboardPage from "./pages/user/DashboardPage.tsx";
import UserProfilePage from "./pages/user/ProfilePage.tsx";
import UserProfileEditPage from "./pages/user/ProfileEditPage.tsx";
import UserNewOrderPage from "./pages/user/NewOrderPage.tsx";
import UserOrdersPage from "./pages/user/OrdersPage.tsx";
import UserOrderDetailPage from "./pages/user/OrderDetailPage.tsx";

// Admin pages
import AdminDashboardPage from "./pages/admin/DashboardPage.tsx";
import AdminOrdersPage from "./pages/admin/OrdersPage.tsx";
import AdminOrderDetailPage from "./pages/admin/OrderDetailPage.tsx";
import AdminTransactionsPage from "./pages/admin/TransactionsPage.tsx";
import AdminCustomersPage from "./pages/admin/CustomersPage.tsx";
import AdminEmployeesPage from "./pages/admin/EmployeesPage.tsx";

// Employee pages
import EmployeeDashboardPage from "./pages/employee/DashboardPage.tsx";
import EmployeeOrdersPage from "./pages/employee/OrdersPage.tsx";
import EmployeeOrderDetailPage from "./pages/employee/OrderDetailPage.tsx";

function App() {
  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* User Routes */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/edit"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders/new"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserNewOrderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <UserOrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminOrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/transactions"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTransactionsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminCustomersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/employees"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminEmployeesPage />
            </ProtectedRoute>
          }
        />

        {/* Employee Routes */}
        <Route
          path="/employee/dashboard"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/orders"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeOrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employee/orders/:id"
          element={
            <ProtectedRoute allowedRoles={["employee"]}>
              <EmployeeOrderDetailPage />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
