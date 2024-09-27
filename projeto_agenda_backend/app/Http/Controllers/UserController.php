<?php

namespace App\Http\Controllers;

use App\Services\UserService;
use App\Traits\ErrorResponseTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class UserController extends Controller
{
    protected $userService;

    use ErrorResponseTrait;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Register a new user.
     *
     * This method validates the incoming request data for user registration,
     * ensuring that the 'name', 'email', and 'password' fields are present and meet
     * the specified criteria. If any of these fields are null, an exception is thrown.
     * 
     * The user is then created using the userService. If the creation is successful
     * and the returned object is an instance of User, a JSON response with a success
     * message and the user data is returned. Otherwise, the error response from the
     * userService is returned.
     *
     * @param \Illuminate\Http\Request $request The incoming request containing user data.
     * @return \Illuminate\Http\JsonResponse The JSON response indicating success or failure.
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        if (is_null($request->name) || is_null($request->email) || is_null($request->password)) {
            return $this->handleException(new \Exception('Nome, email ou senha não podem ser nulos'), 'Error message', 400);
        }

        $user = $this->userService->createUser($request->all());

        // verificed if the user is an instance of User
        if ($user instanceof User) {
            return response()->json(['message' => 'Usuário cadastrado com sucesso', 'user' => $user], 201);
        }

        return $user; // Return the error response from the service
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (is_null($request->email) || is_null($request->password)) {
            return $this->handleException(new \Exception('Email ou senha não podem ser nulos'), 'Error message', 400);
        }

        $result = $this->userService->authenticateUser($request->email, $request->password);

        if (!is_string($result)) {
            return $result; // This is the error response from the service
        }

        return response()->json(['message' => 'Login realizado com sucesso', 'token' => $result], 200);
    }

    public function recoverPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        return $status === Password::RESET_LINK_SENT
            ? response()->json(['message' => 'Link de recuperação de senha enviado'], 200)
            : response()->json(['message' => 'Não foi possível enviar o link de recuperação'], 400);
    }


    /**
     * Verify if the authenticated user is still valid.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser()
    {
        $user = Auth::user();

        if (!$user) {
            return $this->handleException(new \Exception('Usuário não autenticado'), 'Error message', 401);
        }

        $result = $this->userService->verifyUser($user);

        return $result; // Response will be handled by the UserService
    }

    /**
     * Logout the authenticated user.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        $user = Auth::user();

        if (!$user) {
            return $this->handleException(new \Exception('Usuário não autenticado'), 'Error message', 401);
        }

        $result = $this->userService->logoutUser($user);

        return $result; // Response will be handled by the UserService
    }
}