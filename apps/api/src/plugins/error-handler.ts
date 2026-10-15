import { FastifyPluginAsync, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

const errorHandlerPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.setErrorHandler((error: FastifyError, request, reply) => {
    request.log.error(error);

    // Zod validation errors
    if (error instanceof ZodError) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'The submitted payload failed validation checks.',
          details: error.flatten(),
        },
      });
    }

    // Fastify built-in schema validation error
    if (error.validation) {
      return reply.status(400).send({
        success: false,
        error: {
          code: 'SCHEMA_VALIDATION_ERROR',
          message: error.message,
          details: error.validation,
        },
      });
    }

    // Rate limit exceeded
    if (error.statusCode === 429) {
      return reply.status(429).send({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please slow down and try again later.',
        },
      });
    }

    // Generic Internal Server Error (Never leak internal stack traces)
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      success: false,
      error: {
        code: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
        message: statusCode === 404 ? 'Requested resource not found' : 'An unexpected error occurred.',
      },
    });
  });
};

export default fp(errorHandlerPlugin, {
  name: 'error-handler-plugin',
});
