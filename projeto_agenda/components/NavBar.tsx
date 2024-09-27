"use client";

import React from "react";
import Link from "next/link";

// Importing components from the library Shadcn UI
import { Button } from "@/components/ui/button";

// Importing hooks
import { useAuth } from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";

export default function NavBar() {
  const { isAuthenticated } = useAuth();

  const { logoutUser } = useUser();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          Your Logo
        </Link>
        <div className="space-x-4 flex items-center">
          <Link href="/" passHref>
            <Button variant="ghost" className="text-white">
              Home
            </Button>
          </Link>
          <Link href="/sobre" passHref>
            <Button variant="ghost" className="text-white">
              Sobre
            </Button>
          </Link>
          <Link href="/contato" passHref>
            <Button variant="ghost" className="text-white">
              Contato
            </Button>
          </Link>
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="text-black border-white hover:bg-slate-500 hover:text-white"
                onClick={logoutUser}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button
                  variant="outline"
                  className="text-black border-white hover:bg-white hover:text-gray-800"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" passHref>
                <Button
                  variant="secondary"
                  className="bg-blue-500 text-white hover:bg-blue-600"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
