import { Elysia, t } from "elysia";
import jwt from "@elysiajs/jwt";
import UserModel from "../databases/models/User";

class AuthController {
    public init() {
        return new Elysia({ prefix: "/api" })
            .use(jwt({
                name: 'jwt',
                secret: Bun.env.JWT_SECRET!
            }))
            .group("/auth", (app) => app
                .post("/login",
                    async ({ jwt, body, set }) => {
                        const findUser = UserModel.findByEmail(body.email) as User;

                        if (!findUser) {
                            set.status = 400;
                            return {
                                success: false,
                                message: "Invalid email or password."
                            }
                        }

                        const matchPassword = await Bun.password.verify(
                            body.password,
                            findUser.password,
                            "bcrypt"
                        );


                        if (!matchPassword) {
                            set.status = 400;
                            return {
                                success: false,
                                message: "Invalid email or password."
                            }
                        }

                        return {
                            success: true,
                            message: "Login successful.",
                            token: await jwt.sign({ id: findUser.id })
                        }
                    }, {
                    body: t.Object({
                        email: t.String({
                            required: true,
                            format: "email",
                            examples: ["john@example.com"]
                        }),
                        password: t.String({
                            required: true,
                            examples: ["12345678"]
                        })
                    }),
                    error({ code, error }) {
                        switch (code) {
                            case 'VALIDATION':
                                const fields = [
                                    { path: '/email', field: 'email', message: 'Invalid email.' },
                                    { path: '/email', field: 'email', message: 'Email is required.' },
                                    { path: '/password', field: 'password', message: 'Password is required.' }
                                ];

                                const errors = fields
                                    .filter(field => error.all.some(e => e.path === field.path))
                                    .map(field => ({ field: field.field, message: field.message }));

                                return {
                                    success: false,
                                    message: "Invalid request.",
                                    errors: errors
                                }
                        }
                    },
                    detail: {
                        summary: "Login",
                        description: "Login a user.",
                        tags: ["Auth"],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            email: {
                                                type: "string",
                                                description: "User's email.",
                                                examples: ["john@example.com"]
                                            },
                                            password: {
                                                type: "string",
                                                description: "User's password.",
                                                examples: ["12345678"]
                                            }
                                        },
                                        required: ["email", "password"]
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: "Success",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean",
                                                    description: "Indicates if the request was successful.",
                                                    example: true
                                                },
                                                message: {
                                                    type: "string",
                                                    description: "Message indicating the result of the request.",
                                                    example: "Login successful."
                                                },
                                                token: {
                                                    type: "string",
                                                    description: "JWT token for the user.",
                                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                                                }
                                            },
                                            required: ["success", "message", "token"]
                                        }
                                    }
                                }
                            },
                            400: {
                                description: "Bad Request",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean",
                                                    description: "Indicates if the request was successful.",
                                                    example: false
                                                },
                                                message: {
                                                    type: "string",
                                                    description: "Message indicating the result of the request.",
                                                    example: "Invalid request."
                                                },
                                                errors: {
                                                    type: "array",
                                                    description: "Array of errors.",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            field: {
                                                                type: "string",
                                                                description: "Field name.",
                                                                example: "email"
                                                            },
                                                            message: {
                                                                type: "string",
                                                                description: "Error message.",
                                                                example: "Invalid email."
                                                            }
                                                        },
                                                        required: ["field", "message"]
                                                    }
                                                }
                                            },
                                            required: ["success", "message", "errors"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
                .post("/register", async ({ jwt, body, set }) => {
                    const password = await Bun.password.hash(body.password, {
                        algorithm: "bcrypt",
                        cost: 10
                    });

                    const findUser = UserModel.findByEmail(body.email) as User;

                    if (findUser && findUser.email === body.email) {
                        set.status = 400;
                        return {
                            success: false,
                            message: "User already exists."
                        }
                    }

                    const registerUser = UserModel.updateOrCreate(body.name, body.email, false, undefined, password) as User;

                    return {
                        success: true,
                        message: "User registered successfully.",
                        token: await jwt.sign({ id: registerUser.id })
                    }
                }, {
                    body: t.Object({
                        email: t.String({
                            required: true,
                            format: "email",
                            examples: ["john@example.com"]
                        }),
                        name: t.String({
                            required: true,
                            examples: ["John Doe"]
                        }),
                        password: t.String({
                            required: true,
                            examples: ["12345678"],
                            minLength: 8
                        })
                    }),
                    error({ code, error }) {
                        switch (code) {
                            case 'VALIDATION':
                                const fields = [
                                    { path: '/email', field: 'email', message: 'Invalid email.' },
                                    { path: '/email', field: 'email', message: 'Email is required.' },
                                    { path: '/name', field: 'name', message: 'Name is required.' },
                                    { path: '/password', field: 'password', message: 'Password is required.' },
                                    { path: '/password', field: 'password', message: 'Password must be at least 8 characters long.' }
                                ];

                                const errors = fields
                                    .filter(field => error.all.some(e => e.path === field.path))
                                    .map(field => ({ field: field.field, message: field.message }));

                                return {
                                    success: false,
                                    message: "Invalid request.",
                                    errors: errors
                                }
                        }
                    },
                    detail: {
                        summary: "Register",
                        description: "Register a new user.",
                        tags: ["Auth"],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            email: {
                                                type: "string",
                                                description: "User's email.",
                                                examples: "john@example.com"
                                            },
                                            name: {
                                                type: "string",
                                                description: "User's name.",
                                                examples: "John Doe"
                                            },
                                            password: {
                                                type: "string",
                                                description: "User's password.",
                                                examples: "12345678"
                                            }
                                        },
                                        required: ["email", "name", "password"]
                                    }
                                }
                            }
                        },
                        responses: {
                            200: {
                                description: "Success",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean",
                                                    description: "Indicates if the request was successful.",
                                                    example: true
                                                },
                                                message: {
                                                    type: "string",
                                                    description: "Message indicating the result of the request.",
                                                    example: "User registered successfully."
                                                },
                                                token: {
                                                    type: "string",
                                                    description: "JWT token for the user.",
                                                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
                                                }
                                            },
                                            required: ["success", "message", "token"]
                                        }
                                    }
                                }
                            },
                            400: {
                                description: "Bad Request",
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                success: {
                                                    type: "boolean",
                                                    description: "Indicates if the request was successful.",
                                                    example: false
                                                },
                                                message: {
                                                    type: "string",
                                                    description: "Message indicating the result of the request.",
                                                    example: "Invalid request."
                                                },
                                                errors: {
                                                    type: "array",
                                                    description: "Array of errors.",
                                                    items: {
                                                        type: "object",
                                                        properties: {
                                                            field: {
                                                                type: "string",
                                                                description: "Field name.",
                                                                example: "email"
                                                            },
                                                            message: {
                                                                type: "string",
                                                                description: "Error message.",
                                                                example: "Invalid email."
                                                            }
                                                        },
                                                        required: ["field", "message"]
                                                    }
                                                }
                                            },
                                            required: ["success", "message", "errors"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                })
            );
    };
}

export default new AuthController().init();