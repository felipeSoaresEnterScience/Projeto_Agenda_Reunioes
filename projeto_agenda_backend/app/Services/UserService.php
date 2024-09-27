<?php

namespace App\Services;

use App\Models\User;
use App\Traits\ErrorResponseTrait;
use Exception;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserService
{
    use ErrorResponseTrait;

    /**
     * Find a user by their email address.
     *
     * @param string $email
     * @return User|\Illuminate\Http\JsonResponse
     */
    public function findUserByEmail($email)
    {
        try {
            DB::beginTransaction();
            $user = User::where('email', $email)->firstOrFail();
            DB::commit();
            return $user;
        } catch (Exception $ex) {
            DB::rollBack(); // Ensure rollback in case of failure
            return $this->handleException($ex, 'Error finding user', 500);
        }
    }

    /**
     * Create a new user with the provided data.
     *
     * @param array $data
     * @return User|\Illuminate\Http\JsonResponse
     */
    public function createUser($data)
    {
        DB::beginTransaction();
        try {

            $user = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => Hash::make($data['password']),
                'registration_date' => now(),
            ]);
            DB::commit();
            return $user; // Return the User object
        } catch (Exception $ex) {
            DB::rollBack(); // Rollback the transaction in case of failure
            return $this->handleException($ex, 'Error creating user', 500);
        }
    }

    /**
     * Authenticate a user with their email and password.
     *
     * @param string $email
     * @param string $password
     * @return \Illuminate\Http\JsonResponse
     */
    public function authenticateUser($email, $password)
    {
        try {
            $user = $this->findUserByEmail($email);

            // Check if the password is correct
            if (!$user || !Hash::check($password, $user->password)) {
                return response()->json([
                    'result' => false,
                    'message' => 'Invalid credentials',
                    'user' => $user,
                ], 401);
            }

            // Generate authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'result' => true,
                'token' => $token,
            ]);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Error authenticating user', 500);
        }
    }
}
