import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import FinancialAnalysisPage from "./pages/ExpenseAnalysis";
import SavingAdvisor from "./pages/SavingAdvisor";

export default function App() {
  const user = useSelector((state) => state.user.user);

  return (
    <Routes>
      {/* If user is logged in, redirect from home to dashboard */}
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Home />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
      <Route path="/expense-analysis" element={user ? <FinancialAnalysisPage /> : <Navigate to="/" />} />
      <Route path="/saving-advice" element={user ? <SavingAdvisor /> : <Navigate to="/" />} />
    </Routes>
  );
};