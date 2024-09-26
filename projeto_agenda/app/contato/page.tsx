import { Button } from "@/components/ui/button"; // Importa o botão do shadcn
import { Input } from "@/components/ui/input"; // Importa input e textarea do shadcn
import { Textarea } from "@/components/ui/textarea"; // Importa input e textarea do shadcn
import { Mail, Send } from "lucide-react"; // Ícones do lucide-react
import Image from "next/image"; // Importação para uso da imagem

export default function ContactPage() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen bg-gray-100">
      {/* Coluna da imagem */}
      <div className="w-full lg:w-1/2 p-6 flex items-center justify-center">
        <Image
          //src="/mnt/data/tela_de_contato.png" // Caminho da imagem que você enviou
          alt="Imagem de Contato"
          width={600}
          height={400}
          className="rounded-lg shadow-lg"
        />
      </div>

      {/* Coluna do formulário */}
      <div className="w-full lg:w-1/2 p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Contato</h1>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Nome
            </label>
            <Input
              type="text"
              id="name"
              placeholder="Seu nome"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute top-2 left-2 h-5 w-5 text-gray-400" />
              <Input
                type="email"
                id="email"
                placeholder="Seu email"
                className="pl-10 w-full"
              />
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700">
              Assunto
            </label>
            <Input
              type="text"
              id="subject"
              placeholder="Assunto"
              className="w-full"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="message" className="block text-gray-700">
              Mensagem
            </label>
            <Textarea
              id="message"
              placeholder="Sua mensagem"
              className="w-full"
              rows={4}
            />
          </div>
          <Button
            type="submit"
            className="w-full flex items-center justify-center gap-2"
          >
            Enviar <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
