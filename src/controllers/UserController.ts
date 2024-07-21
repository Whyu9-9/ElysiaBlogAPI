import { Elysia, t } from "elysia";
import UserModel from "../databases/models/User";
import { authMiddleware } from "../middlewares/authMiddleware";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

class UserController {
    public init() {
        return new Elysia({ prefix: "/api" })
            .group("/users", (app) => app
                .use(authMiddleware)
                .onBeforeHandle(({ authorized }) => {
                    if (!authorized) {
                        return {
                            success: false,
                            message: "Forbidden."
                        }
                    }
                }).get("/get/:id", async ({ jwt, params, set, headers }) => {
                    const bearer = headers.authorization?.split(' ')[1];
                    const jwtPayload = await jwt.verify(bearer);

                    if (!jwtPayload) {
                        set.status = 401;

                        return {
                            success: false,
                            message: "Unauthorized."
                        }
                    }

                    const id = jwtPayload.id;

                    if (String(id) !== params.id) {
                        set.status = 403;

                        return {
                            success: false,
                            message: "Forbidden."
                        }
                    }

                    const user = UserModel.findById(Number(params.id)) as User;

                    return {
                        success: true,
                        message: "Successfully retrieved user.",
                        data: user
                    }
                }, {
                    params: t.Object({
                        id: t.String({
                            required: true,
                        })
                    }),
                    detail: {
                        summary: "Get User by ID",
                        description: "Get an existing user by ID.",
                        tags: ["Users"],
                        security: [{ JwtAuth: [] }],
                        parameters: [
                            {
                                name: "id",
                                in: "path",
                                required: true,
                                schema: {
                                    type: "string"
                                },
                                description: "User ID.",
                                example: "1"
                            }
                        ],
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
                                                    example: "Successfully retrieved user."
                                                },
                                                data: {
                                                    type: "object",
                                                    properties: {
                                                        id: {
                                                            type: "number",
                                                            description: "User ID.",
                                                            example: 1
                                                        },
                                                        name: {
                                                            type: "string",
                                                            description: "User name.",
                                                            example: "John Doe"
                                                        },
                                                        email: {
                                                            type: "string",
                                                            description: "User email.",
                                                            example: "john@example.com"
                                                        },
                                                        isAdmin: {
                                                            type: "boolean",
                                                            description: "Indicates if the user is an admin.",
                                                            example: false
                                                        },
                                                        isActive: {
                                                            type: "boolean",
                                                            description: "Indicates if the user is active.",
                                                            example: true
                                                        },
                                                        created_at: {
                                                            type: "string",
                                                            description: "Date and time when the user was created.",
                                                            example: "2023-01-01T00:00:00.000Z"
                                                        },
                                                        updated_at: {
                                                            type: "string",
                                                            description: "Date and time when the user was last updated.",
                                                            example: "2023-01-01T00:00:00.000Z"
                                                        }
                                                    },
                                                    required: ["id", "name", "email", "isAdmin", "isActive", "created_at", "updated_at"]
                                                }
                                            }
                                        }
                                    }
                                }
                            },
                            404: {
                                description: "Not Found",
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
                                                    example: "User not found."
                                                }
                                            },
                                            required: ["success", "message"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }).put("/update/:id", async ({ jwt, body, params, set, headers }) => {
                    const bearer = headers.authorization?.split(' ')[1];
                    const jwtPayload = await jwt.verify(bearer);

                    if (!jwtPayload) {
                        set.status = 401;

                        return {
                            success: false,
                            message: "Unauthorized."
                        }
                    }

                    const id = jwtPayload.id;
                    const findUser = UserModel.findById(id as number) as User;

                    if (findUser.isAdmin && Number(params.id) !== null) {
                        UserModel.updateOrCreate(body.name, body.email, body.isAdmin, Number(params.id), undefined);

                        return {
                            success: true,
                            message: "User updated successfully.",
                        }
                    } else {
                        if (String(id) !== params.id) {
                            set.status = 403;

                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }

                        if (body.password) {
                            const password = await Bun.password.hash(body.password, {
                                algorithm: "bcrypt",
                                cost: 10
                            });

                            UserModel.updateOrCreate(body.name, body.email, false, Number(params.id), password);

                            return {
                                success: true,
                                message: "User updated successfully.",
                            }
                        } else {
                            UserModel.updateOrCreate(body.name, body.email, false, Number(params.id), undefined);

                            return {
                                success: true,
                                message: "User updated successfully.",
                            }
                        }
                    }
                }, {
                    body: t.Object({
                        name: t.String({
                            required: true,
                            examples: ["John Doe"]
                        }),
                        email: t.String({
                            required: true,
                            format: "email",
                            examples: ["john@example.com"]
                        }),
                        password: t.String({
                            required: false,
                            examples: ["12345678"],
                            minLength: 8
                        }),
                        isAdmin: t.Boolean({
                            default: false,
                        })
                    }),
                    error({ code, error }) {
                        switch (code) {
                            case 'VALIDATION':
                                const fields = [
                                    { path: '/name', field: 'name', message: 'Name is required.' },
                                    { path: '/email', field: 'email', message: 'Email is required.' },
                                    { path: '/email', field: 'email', message: 'Invalid email.' },
                                    { path: '/password', field: 'password', message: 'Password is required.' },
                                    { path: '/password', field: 'password', message: 'Password must be at least 8 characters long.' },
                                    { path: '/isAdmin', field: 'isAdmin', message: 'Invalid isAdmin.' }
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
                        summary: "Update User",
                        description: "Update an existing user.",
                        tags: ["Users"],
                        security: [{ JwtAuth: [] }],
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object",
                                        properties: {
                                            name: {
                                                type: "string",
                                                description: "User's name.",
                                                examples: ["John Doe"]
                                            },
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
                                        required: ["name", "email"]
                                    }
                                }
                            }
                        },
                        parameters: [
                            {
                                name: "id",
                                in: "path",
                                required: true,
                                schema: {
                                    type: "string"
                                },
                                description: "User ID.",
                                example: "1"
                            }
                        ],
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
                                                    example: "User updated successfully."
                                                }
                                            },
                                            required: ["success", "message"]
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
                                                                example: "name"
                                                            },
                                                            message: {
                                                                type: "string",
                                                                description: "Error message.",
                                                                example: "Name is required."
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
                            },
                            404: {
                                description: "Not Found",
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
                                                    example: "User not found."
                                                }
                                            },
                                            required: ["success", "message"]
                                        }
                                    }
                                }
                            },
                        }
                    }
                }).guard(app => app
                    .use(isAdminMiddleware)
                    .onBeforeHandle(({ isAdmin }) => {
                        if (!isAdmin) {
                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }
                    }).delete("/deactivate/:id", ({ params, set }) => {
                        const user = UserModel.findById(Number(params.id)) as User;

                        if (!user) {
                            set.status = 404;

                            return {
                                success: false,
                                message: "User not found."
                            }
                        }

                        UserModel.delete(Number(params.id));

                        return {
                            success: true,
                            message: "User deleted successfully."
                        }
                    }, {
                        params: t.Object({
                            id: t.String({
                                required: true,
                            })
                        }),
                        detail: {
                            summary: "Deactivate User",
                            description: "Deactivate an existing user.",
                            tags: ["Users"],
                            security: [{ JwtAuth: [] }],
                            parameters: [
                                {
                                    name: "id",
                                    in: "path",
                                    required: true,
                                    schema: {
                                        type: "string"
                                    },
                                    description: "User ID.",
                                    example: "1"
                                }
                            ],
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
                                                        example: "User deleted successfully."
                                                    }
                                                },
                                                required: ["success", "message"]
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
                                                                    example: "id"
                                                                },
                                                                message: {
                                                                    type: "string",
                                                                    description: "Error message.",
                                                                    example: "Invalid id."
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
                                },
                            }
                        }
                    }).get("/", () => {
                        const users = UserModel.getAll();

                        return {
                            success: true,
                            message: "Successfully retrieved users.",
                            data: users
                        }
                    }, {
                        detail: {
                            summary: "Get All Users",
                            description: "Get all users.",
                            tags: ["Users"],
                            security: [{ JwtAuth: [] }],
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
                                                        example: "Successfully retrieved users."
                                                    },
                                                    data: {
                                                        type: "array",
                                                        description: "Array of users.",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: {
                                                                    type: "number",
                                                                    description: "User ID.",
                                                                    example: 1
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                    description: "User name.",
                                                                    example: "John Doe"
                                                                },
                                                                email: {
                                                                    type: "string",
                                                                    description: "User email.",
                                                                    example: "john@example.com"
                                                                },
                                                                isAdmin: {
                                                                    type: "boolean",
                                                                    description: "Indicates if the user is an admin.",
                                                                    example: false
                                                                },
                                                                isActive: {
                                                                    type: "boolean",
                                                                    description: "Indicates if the user is active.",
                                                                    example: true
                                                                },
                                                                created_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the user was created.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                updated_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the user was last updated.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                }
                                                            },
                                                            required: ["id", "name", "email", "isAdmin", "created_at", "updated_at"]
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                403: {
                                    description: "Forbidden",
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
                                                        example: "Forbidden."
                                                    }
                                                },
                                                required: ["success", "message"]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                )
            );
    }
}

export default new UserController().init();