export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Financial reporting (minimal HTTP metadata)",
    version: "0.2.0",
  },
  servers: [{ url: "/", description: "Current host" }],
  tags: [{ name: "system" }],
  paths: {
    "/health": {
      get: {
        tags: ["system"],
        summary: "Health check",
        responses: {
          "200": {
            description: "OK",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      HealthResponse: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: { type: "boolean", example: true },
        },
      },
    },
  },
} as const;

export type OpenApiDocument = typeof openApiDocument;
