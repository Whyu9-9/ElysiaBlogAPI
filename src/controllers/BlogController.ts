import { Elysia, t } from "elysia";
import BlogModel from "../databases/models/Blog";
import { authMiddleware } from "../middlewares/authMiddleware";
import CategoryModel from "../databases/models/Category";

class BlogController {
    public init() {
        return new Elysia({ prefix: "/api" })
            .group("/blogs", (app) => app
                .get("/", () => {
                    const blogs = BlogModel.getAll();

                    return {
                        success: true,
                        message: "Successfully retrieved blogs.",
                        data: blogs
                    }
                },
                    {
                        detail: {
                            summary: "Get All Blogs",
                            description: "Get all blogs.",
                            tags: ["Blogs"],
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
                                                        example: "Successfully retrieved blogs."
                                                    },
                                                    data: {
                                                        type: "array",
                                                        description: "Array of blogs.",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: {
                                                                    type: "number",
                                                                    description: "Blog ID.",
                                                                    example: 1
                                                                },
                                                                title: {
                                                                    type: "string",
                                                                    description: "Blog title.",
                                                                    example: "Blog 1"
                                                                },
                                                                imageUrl: {
                                                                    type: "string",
                                                                    description: "Blog image URL.",
                                                                    example: "https://example.com/image.jpg"
                                                                },
                                                                content: {
                                                                    type: "string",
                                                                    description: "Blog content.",
                                                                    example: "Blog content."
                                                                },
                                                                created_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the blog was created.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                updated_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the blog was last updated.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                author: {
                                                                    type: "string",
                                                                    description: "Blog author.",
                                                                    example: "John Doe"
                                                                }
                                                            },
                                                            required: ["id", "title", "content", "created_at", "updated_at"]
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
                ).get("/category/:id", ({ params }) => {
                    const category = CategoryModel.findById(Number(params.id));

                    if (!category) {
                        return {
                            success: false,
                            message: "Category not found."
                        }
                    }

                    const blogs = BlogModel.findByCategoryId(Number(params.id));

                    return {
                        success: true,
                        message: "Successfully retrieved blogs.",
                        data: blogs
                    }
                },
                    {
                        params: t.Object({
                            id: t.String({
                                required: true,
                            })
                        }),
                        detail: {
                            summary: "Get Blogs by Category",
                            description: "Get blogs by category.",
                            tags: ["Blogs"],
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
                                                        example: "Successfully retrieved blogs."
                                                    },
                                                    data: {
                                                        type: "array",
                                                        description: "Array of blogs.",
                                                        items: {
                                                            type: "object",
                                                            properties: {
                                                                id: {
                                                                    type: "number",
                                                                    description: "Blog ID.",
                                                                    example: 1
                                                                },
                                                                title: {
                                                                    type: "string",
                                                                    description: "Blog title.",
                                                                    example: "Blog 1"
                                                                },
                                                                imageUrl: {
                                                                    type: "string",
                                                                    description: "Blog image URL.",
                                                                    example: "https://example.com/image.jpg"
                                                                },
                                                                content: {
                                                                    type: "string",
                                                                    description: "Blog content.",
                                                                    example: "Blog content."
                                                                },
                                                                created_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the blog was created.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                updated_at: {
                                                                    type: "string",
                                                                    description: "Date and time when the blog was last updated.",
                                                                    example: "2023-01-01T00:00:00.000Z"
                                                                },
                                                                author: {
                                                                    type: "string",
                                                                    description: "Blog author.",
                                                                    example: "John Doe"
                                                                }
                                                            },
                                                            required: ["id", "title", "content", "created_at", "updated_at"]
                                                        }
                                                    }
                                                },
                                                required: ["success", "message", "data"]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                ).get("/:id", ({ params }) => {
                    const blog = BlogModel.findById(Number(params.id));

                    return {
                        success: true,
                        message: "Successfully retrieved blog.",
                        data: blog
                    }
                },
                    {
                        params: t.Object({
                            id: t.String({
                                required: true,
                            })
                        }),
                        detail: {
                            summary: "Get Blog by ID",
                            description: "Get a blog by ID.",
                            tags: ["Blogs"],
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
                                                        example: "Successfully retrieved blog."
                                                    },
                                                    data: {
                                                        type: "object",
                                                        properties: {
                                                            id: {
                                                                type: "number",
                                                                description: "Blog ID.",
                                                                example: 1
                                                            },
                                                            title: {
                                                                type: "string",
                                                                description: "Blog title.",
                                                                example: "Blog 1"
                                                            },
                                                            imageUrl: {
                                                                type: "string",
                                                                description: "Blog image URL.",
                                                                example: "https://example.com/image.jpg"
                                                            },
                                                            content: {
                                                                type: "string",
                                                                description: "Blog content.",
                                                                example: "Blog content."
                                                            },
                                                            created_at: {
                                                                type: "string",
                                                                description: "Date and time when the blog was created.",
                                                                example: "2023-01-01T00:00:00.000Z"
                                                            },
                                                            updated_at: {
                                                                type: "string",
                                                                description: "Date and time when the blog was last updated.",
                                                                example: "2023-01-01T00:00:00.000Z"
                                                            },
                                                            author: {
                                                                type: "string",
                                                                description: "Blog author.",
                                                                example: "John Doe"
                                                            }
                                                        },
                                                        required: ["id", "title", "content", "created_at", "updated_at"]
                                                    }
                                                },
                                                required: ["success", "message", "data"]
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
                                                        example: "Blog not found."
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
                .guard(app => app
                    .use(authMiddleware)
                    .onBeforeHandle(({ authorized }) => {
                        if (!authorized) {
                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }
                    }).post("/create", async ({ jwt, body, headers }) => {
                        const category = CategoryModel.findById(Number(body.categoryId)) as Category;

                        if (!category) {
                            return {
                                success: false,
                                message: "Category not found."
                            }
                        }

                        const bearer = headers.authorization?.split(' ')[1];
                        const jwtPayload = await jwt.verify(bearer);

                        if (!jwtPayload) {
                            return {
                                success: false,
                                message: "Unauthorized."
                            }
                        }

                        const id = jwtPayload.id;

                        BlogModel.updateOrCreate(category.id, body.title, body.imageUrl, body.content, id as number, undefined);

                        return {
                            success: true,
                            message: "Blog created successfully.",
                        }
                    }, {
                        body: t.Object({
                            categoryId: t.Number({
                                required: true,
                            }),
                            title: t.String({
                                required: true,
                                examples: ["Blog 1"]
                            }),
                            imageUrl: t.String({
                                required: true,
                                format: "url",
                                examples: ["https://example.com/image.jpg"]
                            }),
                            content: t.String({
                                required: true,
                                examples: ["Blog content."]
                            })
                        }),
                        error({ code, error }) {
                            switch (code) {
                                case 'VALIDATION':
                                    const fields = [
                                        { path: '/title', field: 'title', message: 'Title is required.' },
                                        { path: '/imageUrl', field: 'imageUrl', message: 'Image URL is required.' },
                                        { path: '/imageUrl', field: 'imageUrl', message: 'Invalid image URL.' },
                                        { path: '/content', field: 'content', message: 'Content is required.' },
                                        { path: '/categoryId', field: 'categoryId', message: 'Category ID is required.' }
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
                            summary: "Create Blog",
                            description: "Create a new blog.",
                            tags: ["Blogs"],
                            security: [{ JwtAuth: [] }],
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                categoryId: {
                                                    type: "number",
                                                    description: "Category ID.",
                                                    examples: [1]
                                                },
                                                title: {
                                                    type: "string",
                                                    description: "Blog title.",
                                                    examples: ["Blog 1"]
                                                },
                                                imageUrl: {
                                                    type: "string",
                                                    description: "Blog image URL.",
                                                    examples: ["https://example.com/image.jpg"]
                                                },
                                                content: {
                                                    type: "string",
                                                    description: "Blog content.",
                                                    examples: ["Blog content."]
                                                }
                                            },
                                            required: ["title", "imageUrl", "content", "categoryId"]
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
                                                        example: "Blog created successfully."
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
                                                                    example: "Title is required."
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
                        const findBlog = BlogModel.findById(Number(params.id) as number) as Blog;

                        if (!findBlog) {
                            set.status = 404;

                            return {
                                success: false,
                                message: "Blog not found."
                            }
                        }

                        if (findBlog.userId !== id) {
                            set.status = 403;

                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }

                        BlogModel.updateOrCreate(findBlog.categoryId, body.title, body.imageUrl, body.content, id as number, Number(params.id));

                        return {
                            success: true,
                            message: "Blog updated successfully.",
                        }
                    }, {
                        body: t.Object({
                            categoryId: t.Number({
                                required: true,
                            }),
                            title: t.String({
                                required: true,
                                examples: ["Blog 1"]
                            }),
                            imageUrl: t.String({
                                required: true,
                                format: "url",
                                examples: ["https://example.com/image.jpg"]
                            }),
                            content: t.String({
                                required: true,
                                examples: ["Blog content."]
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
                                        { path: '/title', field: 'title', message: 'Title is required.' },
                                        { path: '/imageUrl', field: 'imageUrl', message: 'Image URL is required.' },
                                        { path: '/imageUrl', field: 'imageUrl', message: 'Invalid image URL.' },
                                        { path: '/content', field: 'content', message: 'Content is required.' },
                                        { path: '/categoryId', field: 'categoryId', message: 'Category ID is required.' }
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
                            summary: "Update Blog",
                            description: "Update an existing blog.",
                            tags: ["Blogs"],
                            security: [{ JwtAuth: [] }],
                            requestBody: {
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object",
                                            properties: {
                                                categoryId: {
                                                    type: "number",
                                                    description: "Category ID.",
                                                    examples: [1]
                                                },
                                                title: {
                                                    type: "string",
                                                    description: "Blog title.",
                                                    examples: ["Blog 1"]
                                                },
                                                imageUrl: {
                                                    type: "string",
                                                    description: "Blog image URL.",
                                                    examples: ["https://example.com/image.jpg"]
                                                },
                                                content: {
                                                    type: "string",
                                                    description: "Blog content.",
                                                    examples: ["Blog content."]
                                                }
                                            },
                                            required: ["title", "imageUrl", "content", "categoryId"]
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
                                    description: "Blog ID.",
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
                                                        example: "Blog updated successfully."
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
                                                                    example: "Title is required."
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
                                                        example: "Blog not found."
                                                    }
                                                },
                                                required: ["success", "message"]
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }).delete("/delete/:id", async ({ jwt, params, set, headers }) => {
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
                        const findBlog = BlogModel.findById(Number(params.id) as number) as Blog;

                        if (!findBlog) {
                            set.status = 404;

                            return {
                                success: false,
                                message: "Blog not found."
                            }
                        }

                        if (findBlog.userId !== id) {
                            set.status = 403;

                            return {
                                success: false,
                                message: "Forbidden."
                            }
                        }

                        BlogModel.delete(Number(params.id));

                        return {
                            success: true,
                            message: "Blog deleted successfully."
                        }
                    }, {
                        params: t.Object({
                            id: t.String({
                                required: true,
                            })
                        }),
                        detail: {
                            summary: "Delete Blog",
                            description: "Delete an existing blog.",
                            tags: ["Blogs"],
                            security: [{ JwtAuth: [] }],
                            parameters: [
                                {
                                    name: "id",
                                    in: "path",
                                    required: true,
                                    schema: {
                                        type: "string"
                                    },
                                    description: "Blog ID.",
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
                                                        example: "Blog deleted successfully."
                                                    }
                                                },
                                                required: ["success", "message"]
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
                                                        example: "Blog not found."
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
            )
    }
}

export default new BlogController().init();

