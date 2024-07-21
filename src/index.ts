import { Elysia } from "elysia";
import { setupDatabase } from "./databases/db";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import AuthController from "./controllers/AuthController";
import CategoryController from "./controllers/CategoryController";
import UserController from "./controllers/UserController";
import BlogController from "./controllers/BlogController";

console.log("🚀 Initializing Database...");
setupDatabase();
console.log("✅ Done!");

new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: "Elysia Blog API",
        version: "1.0.0",
        description: "Blog API Project. Developed with Elysia.js framework, Bun runtime, Typescript, and SQLite.",
      },
      components: {
        securitySchemes: {
          JwtAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      servers: [{ url: "http://localhost:3000" }]
    },
    swaggerOptions: {
      persistAuthorization: true
    }
  }))
  .use(AuthController)
  .use(CategoryController)
  .use(UserController)
  .use(BlogController)
  .listen(Bun.env.PORT!);

console.log(`🦊 Elysia is running on port ${Bun.env.PORT!}`);
