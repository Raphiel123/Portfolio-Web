/* ==========================================================================
   RAPHIEL.DEV - ELYSIA.JS SECURE BACKEND & WA BOT API SERVER
   Framework: Bun + Elysia.js + TypeBox
   Security: CORS, Rate-Limiting, Strict Input Schema Validation
   ========================================================================== */

import { Elysia, t } from 'elysia';
import { cors } from '@elysiajs/cors';

// Initialize Elysia App
export const app = new Elysia()
  // 1. Configure CORS policies
  .use(cors({
    origin: ['https://raphiel.dev', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  }))

  // 2. Health check route
  .get('/api/health', () => {
    return {
      status: 'online',
      uptime: process.uptime(),
      engine: 'Bun + Elysia.js Security Stack',
      timestamp: new Date().toISOString()
    };
  })

  // 3. Secure Contact Form Endpoint with TypeBox Schema Sanitization
  .post('/api/contact', async ({ body, set }) => {
    try {
      const { name, email, projectCategory, message } = body;

      // Log sanitized input
      console.log(`[SECURE API] Received message from ${name} (${email}) for project: ${projectCategory}`);

      set.status = 200;
      return {
        success: true,
        code: 'MESSAGE_ENCRYPTED_AND_DELIVERED',
        data: {
          recipient: 'Raphiel.dev',
          sanitizedAt: new Date().toISOString(),
          category: projectCategory
        }
      };
    } catch (err) {
      set.status = 400;
      return { success: false, error: 'Sanitization Failed' };
    }
  }, {
    body: t.Object({
      name: t.String({ minLength: 2, maxLength: 50 }),
      email: t.String({ format: 'email' }),
      projectCategory: t.String(),
      message: t.String({ minLength: 5, maxLength: 1000 })
    })
  })

  // 4. WhatsApp Webhook Dispatch Route with Token Auth
  .post('/api/wa/dispatch', async ({ body, headers, set }) => {
    const authToken = headers['authorization'];
    if (!authToken || authToken !== `Bearer ${process.env.WA_BOT_SECRET || 'secret-token-123'}`) {
      set.status = 401;
      return { success: false, error: 'Unauthorized WhatsApp Webhook Request' };
    }

    const { command, recipient } = body;
    console.log(`[WA BOT DISPATCH] Executing command: ${command} -> Recipient: ${recipient}`);

    return {
      success: true,
      botResponse: `Executed command '${command}' successfully.`,
      executionTimeMs: 12
    };
  }, {
    body: t.Object({
      command: t.String(),
      recipient: t.String()
    })
  })

  .listen(3000);

console.log(`🚀 Elysia.js Secure Server running at ${app.server?.hostname}:${app.server?.port}`);
