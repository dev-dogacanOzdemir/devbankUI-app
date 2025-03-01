import React, {useEffect, useRef} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Layout from './components/Layout';
import useAuth from './hooks/useAuth';
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.tsx";
import AdminAccountsPage from "./pages/admin/AdminAccountsPage.tsx";
import AdminTransfersPage from "./pages/admin/AdminTransfersPage.tsx";
import AdminCurrencyGoldPage from "./pages/admin/AdminCurrencyGoldPage.tsx";
import AdminCardsPage from "./pages/admin/AdminCardsPage.tsx";
import AdminLoansPage from "./pages/admin/AdminLoansPage.tsx";
import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage.tsx";
import CustomerTransferPage from "./pages/customer/CustomerTransfersPage.tsx";
import CustomerAccountPage from "./pages/customer/CustomerAccountsPage.tsx";
import CustomerCardsPage from "./pages/customer/CustomerCardsPage.tsx";
import CustomerLoansPage from "./pages/customer/CustomerLoansPage.tsx";
import CustomerCurrencyGoldPage from "./pages/customer/CustomerCurrencyGoldPage.tsx";

const App: React.FC = () => {
    const { isAuthenticated, role } = useAuth();
    const navigate = useNavigate();
    const isFirstRender = useRef(true); // İlk render'ı kontrol etmek için useRef

    useEffect(() => {
        if (isAuthenticated && isFirstRender.current) {
            if (role === 'ROLE_ADMIN') {
                navigate('/dashboard/admin'); // Admin için varsayılan yol
            } else if (role === 'ROLE_CUSTOMER') {
                navigate('/dashboard/customer'); // Customer için varsayılan yol
            }
            isFirstRender.current = false; // İlk render tamamlandıktan sonra false yap
        }
    }, [isAuthenticated, role, navigate]);

    return (
        <Routes>
            {/* Login Sayfası */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
                path="/"
                element={
                    isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
                }
            >
                {/* Admin Routes */}
                {role === 'ROLE_ADMIN' && (
                    <>
                        <Route path="dashboard/admin" element={<AdminDashboardPage />} />
                        <Route path="dashboard/admin/accounts" element={<AdminAccountsPage/>} />
                        <Route path="dashboard/admin/cards" element={<AdminCardsPage/>} />
                        <Route path="dashboard/admin/transfers" element={<AdminTransfersPage/>} />
                        <Route path="dashboard/admin/loans" element={<AdminLoansPage/>} />
                        <Route path="dashboard/admin/currency-gold" element={<AdminCurrencyGoldPage/>} />
                        <Route path="dashboard/admin/reports" element={<div>Admin Reports</div>} />

                    </>
                )}

                {/* Customer Routes */}
                {role === 'ROLE_CUSTOMER' && (
                    <>
                        <Route path="dashboard/customer" element={<CustomerDashboardPage/>} />
                        <Route path="dashboard/customer/accounts" element={<CustomerAccountPage/>} />
                        <Route path="dashboard/customer/cards" element={<CustomerCardsPage/>} />
                        <Route path="dashboard/customer/transfers" element={<CustomerTransferPage/>} />
                        <Route path="dashboard/customer/loans" element={<CustomerLoansPage/>} />
                        <Route path="dashboard/customer/currency-gold" element={<CustomerCurrencyGoldPage/>} />
                        <Route path="dashboard/customer/reports" element={<div>Customer Reports</div>} />
                    </>
                )}
            </Route>

            {/* 404 Not Found Redirect */}
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
        </Routes>
    );
};

export default function WrappedApp() {
    return (
        <Router>
            <App />
        </Router>
    );
}
