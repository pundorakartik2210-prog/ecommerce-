export const API_URL = import.meta.env.MODE === 'production'
  ? 'https://api.nuveranatural.com'
  : 'http://127.0.0.1:8000';
