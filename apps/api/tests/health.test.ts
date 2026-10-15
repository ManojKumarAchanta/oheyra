import { describe, it, expect } from 'vitest';
import { createApp } from '../src/index.js';

describe('Health Checks', () => {
  const app = createApp();

  it('GET /health returns 200 and healthy status with Oheyra brand', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.status).toBe('healthy');
    expect(body.data.brand).toBe('Oheyra');
    expect(body.data.service).toBe('oheyra-api');
    expect(body.data.runtime).toBe('cloudflare-workers');
  });

  it('GET /api/v1/health returns 200 and timestamp', async () => {
    const res = await app.request('/api/v1/health');
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data).toHaveProperty('timestamp');
  });
});
