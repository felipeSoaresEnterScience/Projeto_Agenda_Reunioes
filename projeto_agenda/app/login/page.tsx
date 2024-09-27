"use client";

import Link from "next/link";

// Impoting hooks
import { useState } from "react";
import useUser from "@/hooks/useUser";

// impoting components from the library Shadcn UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";

// Interface para os dados do formulário
interface LoginFormData {
  email: string;
  password: string;
}

// Função de validação do formulário
const validateForm = (formData: LoginFormData) => {
  let errors: { [key: string]: string } = {};

  if (!formData.email) {
    errors.email = "O email é obrigatório.";
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Insira um endereço de email válido.";
  }

  if (!formData.password) {
    errors.password = "A senha é obrigatória.";
  }

  return errors;
};

export default function LoginPage() {
  // importing LoginUser from the useUser hook
  const { loginUser } = useUser();

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Valida o formulário
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors); // Exibe erros de validação
    } else {
      setErrors({});

      // Chama a função de login do contexto
      const result = await loginUser(formData.email, formData.password);

      console.log(result);

      if (result) {
        setSuccess("Login realizado com sucesso!"); // Mensagem de sucesso
      } else {
        setErrors({ form: "Erro ao fazer login. Verifique suas credenciais." });
      }
    }
  };

  return (
    <div className="container mx-auto px-4 h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre na sua conta para acessar suas reuniões
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
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
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
