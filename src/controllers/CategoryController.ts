import { Elysia, t } from "elysia";
import CategoryModel from "../databases/models/Category";
import { isAdminMiddleware } from "../middlewares/isAdminMiddleware";

class CategoryController {
    public init() {
        return new Elysia({ prefix: "/api" })
            .group("/categories", (app) => app
                .get("/", () => {
                    const categories = CategoryModel.getAll();

                    return {
                        success: true,
                        message: "Successfully retrieved categories.",
                        data: categories
                    }
                },
                    {
                        detail: {
                            summary: "Get All Categories",
                            description: "Get all categories.",
                            tags: ["Categories"],
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
                                                        example: "Successfully retrieved categories."
                                                    },
                                                    data: {
                                                        type: "array",
                                                        description: "Array of categories.",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: {
                                                                    type: "number",
                                                                    description: "Category ID.",
                                                                    example: 1
                                                                },
                                                                name: {
                                                                    type: "string",
                                                                    description: "Category name.",
                                                                    example: "Category 1"
                                                                },
                                                                created_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the category was created.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                updated_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the category was last updated.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                }
                                                            },
                                                            required: ["id", "name", "created_at", "updated_at"]
                                                        }
                                                    }
                                                },
                                                required: ["success", "message", "data"]
                                            }
                                        }
                                    }
                                },
                            }
                        }
                    }
                ).guard(app => app
                    .use(isAdminMiddleware)
                    .onBeforeHandle(({ isAdmin }) => {
                        if (!isAdmin) {
                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }
                    }).post("/create", ({ body }) => {
                        CategoryModel.updateOrCreate(body.title);

                        return {
                            success: true,
                            message: "Category created successfully.",
                        }
                    }, {
                        body: t.Object({
                            title: t.String({
                                required: true,
                                examples: ["Category 1"]
                            })
                        }),
                        error({ code, error }) {
                            switch (code) {
                                case 'VALIDATION':
                                    const fields = [
                                        { path: '/title', field: 'title', message: 'Invalid title.' },
                                        { path: '/title', field: 'title', message: 'Title is required.' }
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
                            summary: "Create Category",
                            description: "Create a new category.",
                            tags: ["Categories"],
                            security: [{ JwtAuth: [] }],
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                title: {
                                                    type: "string",
                                                    description: "Category title.",
                                                    examples: ["Category 1"]
                                                }
                                            },
                                            required: ["title"]
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
                                                        example: "Category created successfully."
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
                                                                    example: "title"
                                                                },
                                                                message: {
                                                                    type: "string",
                                                                    description: "Error message.",
                                                                    example: "Invalid title."
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
                    }).put("/update/:id", ({ body, params, set }) => {
                        const category = CategoryModel.findById(Number(params.id)) as Category;

                        if (!category) {
                            set.status = 404;

                            return {
                                success: false,
                                message: "Category not found."
                            }
                        }

                        CategoryModel.updateOrCreate(body.title, Number(params.id));

                        return {
                            success: true,
                            message: "Category updated successfully.",
                        }
                    },
                        {
                            body: t.Object({
                                title: t.String({
                                    required: true,
                                    examples: ["Category 1"]
                                })
                            }),
                            params: t.Object({
                                id: t.String({
                                    required: true,
                                })
                            }),
                            error({ code, error }) {
                                switch (code) {
                                    case 'VALIDATION':
                                        const fields = [
                                            { path: '/title', field: 'title', message: 'Invalid title.' },
                                            { path: '/title', field: 'title', message: 'Title is required.' }
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
                                summary: "Update Category",
                                description: "Update an existing category.",
                                tags: ["Categories"],
                                security: [{ JwtAuth: [] }],
                                requestBody: {
                                    content: {
                                        "application/json": {
                                            schema: {
                                                type: "object",
                                                properties: {
                                                    title: {
                                                        type: "string",
                                                        description: "Category title.",
                                                        examples: ["Category 1"]
                                                    }
                                                },
                                                required: ["title"]
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
                                        description: "Category ID.",
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
                                                            example: "Category updated successfully."
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
                                                                        example: "title"
                                                                    },
                                                                    message: {
                                                                        type: "string",
                                                                        description: "Error message.",
                                                                        example: "Invalid title."
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
                                                            example: "Category not found."
                                                        }
                                                    },
                                                    required: ["success", "message"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    ).delete("/delete/:id", ({ params, set }) => {
                        const category = CategoryModel.findById(Number(params.id)) as Category;

                        if (!category) {
                            set.status = 404;

                            return {
                                success: false,
                                message: "Category not found."
                            }
                        }

                        CategoryModel.delete(Number(params.id));

                        return {
                            success: true,
                            message: "Category deleted successfully."
                        }
                    },
                        {
                            params: t.Object({
                                id: t.String({
                                    required: true,
                                })
                            }),
                            detail: {
                                summary: "Delete Category",
                                description: "Delete an existing category.",
                                tags: ["Categories"],
                                security: [{ JwtAuth: [] }],
                                parameters: [
                                    {
                                        name: "id",
                                        in: "path",
                                        required: true,
                                        schema: {
                                            type: "string"
                                        },
                                        description: "Category ID.",
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
                                                            example: "Category deleted successfully."
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
                                                            example: "Category not found."
                                                        }
                                                    },
                                                    required: ["success", "message"]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    )
                )
            );
    };
}

export default new CategoryController().init();