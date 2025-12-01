import { useContext } from "react";
import { AdminAuthContext } from "./AdminAuthContext";

export const useAuth = () => useContext(AdminAuthContext);
