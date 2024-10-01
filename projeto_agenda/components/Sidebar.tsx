"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Home,
  Calendar,
  Users,
  Contact,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { FC } from "react";
import useUser from "@/hooks/useUser";

const menuItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/agenda", label: "Agenda", icon: Calendar },
];
interface MenuItemProps {
  href: string;
  label: string;
  icon: FC<{ className?: string }>;
  expanded: boolean;
}

const MenuItem: FC<MenuItemProps> = ({ href, label, icon: Icon, expanded }) => (
  <motion.li
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="mb-2"
  >
    <a
      href={href}
      className="flex items-center p-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      <Icon className="h-5 w-5" />
      {expanded && <span className="ml-3">{label}</span>}
    </a>
  </motion.li>
);

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true);
  const { theme, setTheme } = useTheme();

  const toggleSidebar = () => setExpanded(!expanded);

  const { logoutUser } = useUser(); // Acessa o estado de aut

  return (
    <motion.aside
      initial={false}
      animate={{ width: expanded ? 240 : 70 }}
      className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white h-screen flex flex-col shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        {expanded ? (
          <h1 className="text-xl font-bold">Agendetor</h1>
        ) : (
          <span className="text-xl font-bold">A</span>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="lg:hidden"
        >
          {expanded ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>
      <nav className="flex-grow overflow-y-auto p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem key={item.href} {...item} expanded={expanded} />
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="mb-2 w-full justify-start"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {expanded && <span className="ml-3">Toggle theme</span>}
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
          onClick={logoutUser}
        >
          <LogOut className="h-5 w-5" />
          {expanded && <span className="ml-3">Logout</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
