<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Register a new user in the database.
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email|max:255',
            'password' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => strtolower($validated['email']),
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User registered successfully!',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 201);
    }

    /**
     * Log in a user.
     */
    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $email = strtolower($validated['email']);
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password.'
            ], 401);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged in successfully!',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }

    /**
     * Handle Google Sign-In (Login or Register).
     */
    public function googleLogin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
        ]);

        $email = strtolower($validated['email']);

        // Find existing user or create a new one
        $user = User::where('email', $email)->first();

        if (!$user) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $email,
                'password' => Hash::make('__google__'), // Dummy password
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged in with Google successfully!',
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ]
        ], 200);
    }
}
