import React from "react";
import Link from "next/link";

// Importing lucide icons
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";

// Importing the Components from the Shadcn UI
import { Button } from "@/components/ui/button";

// Importing the Components
import NavBar from "@/components/NavBar";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bem-vindo ao Agendetor</h1>
        <p className="text-xl text-gray-600">
          Organize suas reuniões de forma simples e eficiente
        </p>
      </header>

      <section className="grid md:grid-cols-3 gap-8 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2" /> Agendamento Fácil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Agende reuniões com poucos cliques
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2" /> Lembretes Automáticos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Receba lembretes personalizados para nunca perder uma reunião
              importante.
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2" /> Colaboração em Equipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Compartilhe agendas e coordene reuniões com sua equipe de forma
              eficiente.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      <div className="text-center">
        <Link href="/agendar" passHref>
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Agendar Reunião <ArrowRight className="ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
