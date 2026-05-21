<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class EmailJsService
{
    protected string $serviceId;
    protected string $templateId;
    protected string $publicKey;
    protected string $privateKey;
    protected string $apiUrl = 'https://api.emailjs.com/api/v1.0/email/send';

    public function __construct()
    {
        $this->serviceId = config('emailjs.service_id') ?? '';
        $this->templateId = config('emailjs.template_id') ?? '';
        $this->publicKey = config('emailjs.public_key') ?? '';
        $this->privateKey = config('emailjs.private_key') ?? '';
    }

    /**
     * Send an email using EmailJS templates.
     *
     * @param array $templateParams Key-value pairs matching placeholders in your EmailJS template.
     * @param string|null $customTemplateId Override the default template ID if needed.
     * @return bool
     */
    public function send(array $templateParams, ?string $customTemplateId = null): bool
    {
        if (empty($this->publicKey) || empty($this->privateKey)) {
            Log::error('EmailJS Error: Public Key or Private Key (accessToken) is missing in config.');
            return false;
        }

        $payload = [
            'service_id' => $this->serviceId,
            'template_id' => $customTemplateId ?? $this->templateId,
            'user_id' => $this->publicKey,
            'accessToken' => $this->privateKey, // Secret private key for secure server-side calls
            'template_params' => $templateParams,
        ];

        try {
            $client = Http::withHeaders([
                'Content-Type' => 'application/json',
            ]);

            // Bypass SSL verification in local environment to solve Windows PHP OpenSSL issues
            if (config('app.env') === 'local') {
                $client = $client->withoutVerifying();
            }

            $response = $client->post($this->apiUrl, $payload);

            if ($response->successful()) {
                Log::info('EmailJS: Email sent successfully.', ['params' => $templateParams]);
                return true;
            }

            Log::error('EmailJS Error response received:', [
                'status' => $response->status(),
                'body' => $response->body()
            ]);
            return false;
        } catch (\Exception $e) {
            Log::error('EmailJS Exception occurred:', [
                'message' => $e->getMessage()
            ]);
            return false;
        }
    }
}
