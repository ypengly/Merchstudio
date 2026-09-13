import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import ProductSelection from "@/pages/ProductSelection";
import Editor from "@/pages/Editor";
import SharedDesignView from "@/pages/SharedDesignView";
import Admin from "@/pages/Admin";

export default function App() {
  const init = useAuthStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/shared/:token" element={<SharedDesignView />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/products" element={<ProductSelection />} />
        <Route path="/editor/:designId" element={<Editor />} />
      </Route>

      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
