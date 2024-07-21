import db from "../db";

class UserModel {
    static getAll() {
        const query = db.query('SELECT id, name, email, isAdmin, isActive, created_at, updated_at FROM users');

        return query.all();
    }

    static findById(id: number) {
        const query = db.query('SELECT id, name, email, isAdmin, isActive, created_at, updated_at FROM users WHERE id = ?');

        return query.get(id);
    }

    static findByEmail(email: string) {
        const query = db.query('SELECT * FROM users WHERE email = ?');

        return query.get(email);
    }

    static updateOrCreate(name: string, email: string, isAdmin: boolean, id?: number, password?: string) {
        if (id) {
            const updatedAt = new Date().toISOString();
            if (password !== undefined) {
                const query = db.query('UPDATE users SET password = ?, updated_at = ? WHERE id = ?');

                return query.run(password as string, updatedAt, id);
            } else {
                const query = db.query('UPDATE users SET name = ?, email = ?, isAdmin = ?, updated_at = ? WHERE id = ?');

                return query.run(name, email, isAdmin, updatedAt, id);
            }
        } else {
            const query = db.query('INSERT INTO users (name, email, password, isAdmin) VALUES (?, ?, ?, ?)');
            query.run(name, email, password as string, isAdmin);

            return db.query('SELECT id from users WHERE email = ?').get(email);
        }
    }

    static delete(id: number) {
        const query = db.query('UPDATE users SET isActive = FALSE WHERE id = ?');

        return query.run(id);
    }
}

export default UserModel;