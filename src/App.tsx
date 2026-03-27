import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import TokenDetail from "@/pages/TokenDetail";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/token/:coinId" element={<TokenDetail />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
