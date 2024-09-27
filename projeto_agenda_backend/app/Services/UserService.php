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
        DB::beginTransaction();
        try {
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
                'user' => $user,
            ]);
        } catch (Exception $ex) {
            return $this->handleException($ex, 'Error authenticating user', 500);
        }
    }


    /**
     * Logout a user by invalidating their authentication token.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function logoutUser($user)
    {
        DB::beginTransaction();
        try {
            // Revoke all tokens of the user (for single device logout, you can specify the token)
            $user->tokens()->delete();

            DB::commit();
            return response()->json([
                'result' => true,
                'message' => 'Logged out successfully',
            ]);
        } catch (Exception $ex) {
            DB::rollBack();
            return $this->handleException($ex, 'Error during logout', 500);
        }
    }

    /**
     * Verify if a user's token is valid.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function verifyUser($user)
    {
        DB::beginTransaction();
        try {
            // Check if the user still has a valid token
            $tokenExists = $user->tokens()->where('revoked', false)->exists();

            DB::commit();

            if (!$tokenExists) {
                return response()->json([
                    'result' => false,
                    'message' => 'Invalid or expired token',
                ], 401);
            }

            return response()->json([
                'result' => true,
                'message' => 'User is authenticated',
                'user' => $user,
            ]);
        } catch (Exception $ex) {
            DB::rollBack();
            return $this->handleException($ex, 'Error verifying user', 500);
        }
    }
}
