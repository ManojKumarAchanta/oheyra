import { createClient, SupabaseClient } from '@supabase/supabase-js';
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import WebSocket from 'ws';
import { env } from '../config/env.js';

// Polyfill WebSocket for Node.js environments (required by Supabase client)
if (!globalThis.WebSocket) {
  // @ts-expect-error WebSocket polyfill
  globalThis.WebSocket = WebSocket;
}

declare module 'fastify' {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }
}

const supabasePlugin: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  fastify.decorate('supabase', supabase);
};

export default fp(supabasePlugin, {
  name: 'supabase-plugin',
});
