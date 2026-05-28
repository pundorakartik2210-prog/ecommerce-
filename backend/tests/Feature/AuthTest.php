<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user registration.
     */
    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'User registered successfully!',
                'user' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }

    /**
     * Test user login.
     */
    public function test_user_can_login(): void
    {
        $user = User::create([
            'name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'password' => Hash::make('password123'),
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'jane@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged in successfully!',
                'user' => [
                    'name' => 'Jane Doe',
                    'email' => 'jane@example.com',
                ]
            ]);
    }

    /**
     * Test google login for existing user.
     */
    public function test_google_login_for_existing_user(): void
    {
        $user = User::create([
            'name' => 'Google User',
            'email' => 'google@example.com',
            'password' => Hash::make('__google__'),
        ]);

        $response = $this->postJson('/api/auth/google-login', [
            'name' => 'Google User Update',
            'email' => 'google@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged in with Google successfully!',
                'user' => [
                    'name' => 'Google User', // maintains original name or database name
                    'email' => 'google@example.com',
                ]
            ]);
    }

    /**
     * Test google login creates user if not exists.
     */
    public function test_google_login_creates_user_if_not_exists(): void
    {
        $response = $this->postJson('/api/auth/google-login', [
            'name' => 'New Google User',
            'email' => 'newgoogle@example.com',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Logged in with Google successfully!',
                'user' => [
                    'name' => 'New Google User',
                    'email' => 'newgoogle@example.com',
                ]
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'newgoogle@example.com',
            'name' => 'New Google User',
        ]);
    }
}
