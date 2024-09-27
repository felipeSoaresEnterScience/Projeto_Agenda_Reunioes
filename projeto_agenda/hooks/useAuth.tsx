import { useContext } from "react";
import { AuthContext } from "../context/AuthContext"; // Isso está correto

export const useAuth = () => {
  const context = useContext(AuthContext); // Certifique-se de usar o AuthContext aqui
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
