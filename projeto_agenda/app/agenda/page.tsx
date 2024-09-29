import AgendaClient from "../../components/agenda/AgendaClient";
import { Event } from "@/types/Event";

// Dados mockados para simular eventos
const mockEvents: Event[] = [
  { id: "1", title: "Reunião de equipe", date: "2024-03-15" },
  { id: "2", title: "Entrega do projeto", date: "2024-03-20" },
];

export default function AgendaPage() {
  // const events = await getEvents();

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-3xl font-bold">Agenda</h1>
      <AgendaClient initialEvents={mockEvents} />
    </div>
  );
}
