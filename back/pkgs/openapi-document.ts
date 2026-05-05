export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Financial reporting",
    description:
      "1) **POST /auth/login** with JSON body — copy **token**. 2) **Authorize** → paste token. 3) **POST /financial/import/upload** with multipart **file** (after auth).\n\n**Public without JWT:** `GET /health`, `GET /openapi.json`, `POST /auth/login`. Swagger UI is at `/docs` (not listed here — it serves HTML). JWT payload claim: **email** only.",
    version: "0.2.0",
  },
  servers: [{ url: "/", description: "Current host" }],
  security: [{ bearerAuth: [] }],
  tags: [
    { name: "system", description: "Process health" },
    { name: "auth", description: "Login (no registration)" },
    { name: "financial", description: "CSV import (API)" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["system"],
        security: [],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is up",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" },
              },
            },
          },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["auth"],
        security: [],
        summary: "Login — obtain JWT",
        description:
          "**application/json** body. Paste **token** into Swagger **Authorize** (Bearer prefix is added automatically).",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginRequest" },
            },
          },
        },
        responses: {
          "200": {
            description: "Access token",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginTokenResponse" },
              },
            },
          },
          "400": {
            description: "Missing email or password",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "401": {
            description: "Invalid credentials",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
    "/openapi.json": {
      get: {
        tags: ["system"],
        security: [],
        summary: "OpenAPI JSON",
        description: "Public spec document (no auth).",
        responses: {
          "200": {
            description: "OpenAPI 3 document",
            content: {
              "application/json": {
                schema: { type: "object" },
              },
            },
          },
        },
      },
    },
    "/financial/import/upload": {
      post: {
        tags: ["financial"],
        summary: "Import CSV file (multipart)",
        description:
          "Upload a `.csv` with the same columns as server-path import (`year`, `quarter`, `indicator_code`, …). Swagger: execute **Authorize** first, then choose file for **file** and Execute. Responds with JSON only.",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                required: ["file"],
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                    description: "Financial CSV file",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Import summary",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ImportResult" },
              },
            },
          },
          "400": {
            description: "Missing file, multipart error, or invalid CSV",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
          "500": {
            description: "Server or database error",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ApiError" },
              },
            },
          },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description:
          "Paste the **token** string from POST /auth/login (JSON response) into Swagger Authorize — do not type `Bearer ` yourself. HS256 JWT; custom claim: **email** only.",
      },
    },
    schemas: {
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: {
            type: "string",
            description: "Stored in DB as plaintext (lab only).",
          },
        },
      },
      LoginTokenResponse: {
        type: "object",
        required: ["token", "email"],
        properties: {
          token: { type: "string" },
          email: { type: "string" },
        },
      },
      ApiError: {
        type: "object",
        required: ["error"],
        properties: {
          error: { type: "string" },
        },
      },
      HealthResponse: {
        type: "object",
        required: ["ok"],
        properties: {
          ok: { type: "boolean", example: true },
        },
      },
      ImportResult: {
        type: "object",
        required: [
          "rowsRead",
          "periodsEnsured",
          "indicatorsEnsured",
          "valuesUpserted",
        ],
        properties: {
          rowsRead: { type: "integer", minimum: 0 },
          periodsEnsured: { type: "integer", minimum: 0 },
          indicatorsEnsured: { type: "integer", minimum: 0 },
          valuesUpserted: { type: "integer", minimum: 0 },
        },
      },
    },
  },
} as const;

export type OpenApiDocument = typeof openApiDocument;
