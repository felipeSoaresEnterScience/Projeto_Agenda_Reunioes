"use client";

import Link from "next/link";
import React, { useState, ChangeEvent, FormEvent } from "react";

// Importing components from the shadcn UI library
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

// importing interfaces
import { FormErrors, FormData } from "../../types/formRegister";

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState<string>("");

  // Função de validação que retorna um objeto contendo os erros
  const validateForm = (): FormErrors => {
    let formErrors: FormErrors = {};
    if (!formData.name) formErrors.name = "Nome é obrigatório.";
    if (!formData.email) {
      formErrors.email = "Email é obrigatório.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email inválido.";
    }
    if (!formData.password) formErrors.password = "Senha é obrigatória.";
    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "As senhas não coincidem.";
    }

    return formErrors;
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      setSuccess("Registro realizado com sucesso!");
    }
  };

  // Manipulador de alteração dos campos de entrada
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Registrar</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Nome
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
              />
              {errors.name && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-2 w-4 h-4" /> {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {errors.email && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-2 w-4 h-4" /> {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Senha
              </label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              {errors.password && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-2 w-4 h-4" /> {errors.password}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 flex items-center">
                  <AlertCircle className="mr-2 w-4 h-4" />{" "}
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Registrar
            </Button>

            {success && (
              <p className="text-sm text-green-600 mt-4">{success}</p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <div className="text-sm">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Entre aqui
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
