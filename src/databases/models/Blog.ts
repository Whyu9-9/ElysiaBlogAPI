import db from "../db";

class BlogModel {
    static getAll() {
        const query = db.query(
            `SELECT blogs.*, users.name AS author FROM blogs
            JOIN users ON blogs.userId = users.id
            WHERE users.isActive = TRUE`
        );

        return query.all();
    }

    static findById(id: number) {
        const query = db.query('SELECT * FROM blogs WHERE id = ?');

        return query.get(id);
    }

    static findByCategoryId(categoryId: number) {
        const query = db.query(
            `SELECT blogs.*, users.name AS author FROM blogs
            JOIN users ON blogs.userId = users.id
            WHERE categoryId = ? AND users.isActive = TRUE`
        );

        return query.all(categoryId);
    }

    static findByUserId(userId: number) {
        const query = db.query('SELECT * FROM blogs WHERE userId = ?');

        return query.all(userId);
    }

    static updateOrCreate(
        categoryId: number,
        title: string,
        imageUrl: string,
        content: string,
        userId?: number,
        id?: number
    ) {
        if (id) {
            const query = db.query('UPDATE blogs SET categoryId = ?, title = ?, imageUrl = ?, content = ? WHERE id = ?');

            return query.run(categoryId, title, imageUrl, content, id);
        } else {
            const query = db.query('INSERT INTO blogs (categoryId, title, imageUrl, content, userId) VALUES (?, ?, ?, ?, ?)');

            return query.run(categoryId, title, imageUrl, content, userId as number);
        }
    }

    static delete(id: number) {
        const query = db.query('DELETE FROM blogs WHERE id = ?');

        return query.run(id);
    }

}

export default BlogModel;