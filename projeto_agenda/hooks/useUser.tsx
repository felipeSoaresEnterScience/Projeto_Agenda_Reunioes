//importing axios
import axios from "axios";

//importing hooks
import { useAuth } from "./useAuth";

export default function useUser() {
  const { login, logout, user } = useAuth();

  //function to register a user
  const RegisterUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<any> => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/register", {
        name,
        email,
        password,
      });
      console.log(response.data);
      return response.data; // Retorna os dados em caso de sucesso
    } catch (error) {
      console.error("Erro ao registrar o usuário:", error); // Erro mais descritivo
      return false; // Retorna false em caso de erro
    }
  };

  //function to login a user
  const loginUser = async (email: string, password: string): Promise<any> => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });

      const { token, result, user } = response.data;

      console.log(result);

      // Verifica se o resultado foi positivo
      if (result) {
        login(token, user); // Chama a função de login do contexto
        window.location.href = "/dashboard"; // Redireciona para a home
        return true; // Retorna sucesso
      } else {
        throw new Error("Falha na autenticação. Verifique suas credenciais.");
      }
    } catch (error: any) {
      // Se for um erro de resposta da API, captura o erro retornado pelo servidor
      if (error.response) {
        console.error(
          `Erro ${error.response.status}: ${
            error.response.data.message || "Erro inesperado ao fazer login."
          }`
        );
      }
      // Se for erro de rede ou outro tipo
      else if (error.request) {
        console.error(
          "Erro de rede: Não foi possível se conectar ao servidor."
        );
      }
      // Outros erros (erros de código, exceções)
      else {
        console.error("Erro:", error.message);
      }

      return false;
    }
  };

  //function to logout a user
  const logoutUser = async (): Promise<any> => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) throw new Error("Usuário não autenticado");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Passa o token no cabeçalho
          },
        }
      );

      if (response) {
        logout();
        alert("Logout realizado com sucesso!");
        window.location.href = "/login"; // Redireciona para a página de login
      }

      return true;
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
      return false;
    }
  };

  //function to verify if the user is authenticated
  const verifyUser = async (): Promise<any> => {
    try {
      const token = localStorage.getItem("authToken"); // Obtém o token do usuário autenticado
      if (!token) throw new Error("Usuário não autenticado");

      const response = await axios.get("http://127.0.0.1:8000/api/verify", {
        headers: {
          Authorization: `Bearer ${token}`, // Passa o token no cabeçalho
        },
      });

      console.log("Usuário verificado:", response.data);

      return response.data; // Retorna os dados do usuário verificado
    } catch (error: any) {
      console.error("Erro ao verificar usuário:", error.message);
      return false;
    }
  };

  return { RegisterUser, loginUser, logoutUser, verifyUser };
}
