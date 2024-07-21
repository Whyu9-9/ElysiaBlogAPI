import db from "../db";

class CategoryModel {
    static getAll() {
        const query = db.query('SELECT * FROM catagories');

        return query.all();
    }

    static findById(id: number) {
        const query = db.query('SELECT * FROM catagories WHERE id = ?');

        return query.get(id);
    }

    static findByTitle(title: string) {
        const query = db.query('SELECT * FROM catagories WHERE title like %?%');

        return query.all(title);
    }

    static updateOrCreate(title: string, id?: number) {
        if (id) {
            const updatedAt = new Date().toISOString();
            const query = db.query('UPDATE catagories SET title = ?, updated_at = ? WHERE id = ?');

            return query.run(title, updatedAt, id);
        } else {
            const query = db.query('INSERT INTO catagories (title) VALUES (?)');

            return query.run(title);
        }
    }

    static delete(id: number) {
        const query = db.query('DELETE FROM catagories WHERE id = ?');

        return query.run(id);
    }
}

export default CategoryModel;