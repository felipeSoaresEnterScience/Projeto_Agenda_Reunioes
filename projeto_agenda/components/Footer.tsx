import React from "react";
import Link from "next/link";

// Importing the icons from lucide-react
import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; 2024 Sua Empresa. Todos os direitos reservados.
            </p>
          </div>
          <div className="flex mb-4 md:mb-0">
            <Link
              href="/termos"
              className="text-sm text-gray-600 hover:text-gray-900 mr-4"
            >
              Termos de Uso
            </Link>
            <Link
              href="/privacidade"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Política de Privacidade
            </Link>
          </div>
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Facebook size={20} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Twitter size={20} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Instagram size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
