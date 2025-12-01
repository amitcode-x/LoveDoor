// src/App.jsx
import AdminLayout from "./components/Layout/AdminLayout";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <AdminLayout>
      <AppRoutes />
    </AdminLayout>
  );
}
