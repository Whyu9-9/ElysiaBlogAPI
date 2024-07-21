import { Elysia } from "elysia";
import { jwt } from "@elysiajs/jwt";
import UserModel from "../databases/models/User";

export const isAdminMiddleware = (app: Elysia) => {
    return app.use(
        jwt({
            name: 'jwt',
            secret: Bun.env.JWT_SECRET!
        })
    ).derive(async ({ jwt, set, headers }) => {
        const bearer = headers.authorization?.split(' ')[1];

        if (!bearer) {
            set.status = 401;

            return {
                authorized: false
            }
        }

        const jwtPayload = await jwt.verify(bearer);

        if (!jwtPayload) {
            set.status = 401;

            return {
                authorized: false
            }
        }

        const id = jwtPayload.id;
        const user = UserModel.findById(id as number) as User;

        if (!user.isAdmin) {
            set.status = 403;

            return {
                isAdmin: false
            }
        }

        return {
            isAdmin: true
        }
    });
};