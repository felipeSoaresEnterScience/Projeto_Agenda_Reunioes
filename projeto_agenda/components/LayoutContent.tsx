"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800 bg-opacity-75 dark:bg-opacity-75 z-50">
    <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
  </div>
);

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 250); // Simula um breve tempo de carregamento

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow p-6">{children}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <main className="flex-grow p-6">{children}</main>
      </div>
    </div>
  );
};

export default LayoutContent;
