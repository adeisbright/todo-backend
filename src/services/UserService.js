const pool = require("../loaders/PostgresLoader");

class UserService {
    async getUsers() {
        let result = await pool.query("SELECT * FROM users ORDER BY id ASC");
        return result.rows;
    }
    async getUser(id) {
        let { rows } = await pool.query(
            "SELECT * FROM users WHERE id = $1 ORDER BY id ASC",
            [id]
        );

        return rows[0];
    }
    async findUser(field, value) {
        const { rows } = await pool.query(
            `SELECT name , email , password  , id, google_calender_token FROM users WHERE ${field} = $1`,
            [value]
        );
        return rows[0];
    }
    async addUser(content) {
        let user = await pool.query(
            "INSERT INTO users (name , email , password) VALUES ($1 , $2 , $3)",
            content
        );
        return user.rowCount;
    }
    async removeUser(id) {
        await pool.query("DELETE FROM users WHERE id = $1", [id]);
        return `User with ${id} removed from the table`;
    }
    async updateUser(field, value, id) {
        let result = await pool.query(
            `UPDATE users SET ${field} = $1  WHERE id = $2`,
            [value, id]
        );
        return result.rowCount;
    }

    async transaction(content) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const queryText = "INSERT INTO users(name , email) VALUES($1 , $2)";
            await client.query(queryText, content);
            let n = await client.query("COMMIT");
            return n;
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async createTable() {
        const queryText = `
        CREATE TABLE IF NOT EXISTS people(
            id SERIAL PRIMARY KEY ,
            data JSONB
        )`;
        await pool.query(queryText);
        const person = {
            name: "Adebright of Bigjara",
            email: "adenababanla@gmail.com",
            age: 27,
            created_at: 111111111,
        };
        await pool.query("INSERT INTO people(data) VALUES($1)", [person]);
        const { rows } = await pool.query("SELECT * FROM people");
        return rows;
    }

    async addColumn(table, column, cType) {
        const client = await pool.connect();
        try {
            await client.query("BEGIN");
            const text = `ALTER TABLE ${table} ADD ${column} ${cType}`;
            await client.query(text);
            return await client.query("COMMIT");
        } catch (error) {
            await client.query("ROLLBACK");
            throw error;
        } finally {
            client.release();
        }
    }

    async updateColumn(table, column, value, id) {
        let { rows } = await pool.query(
            `UPDATE ${table} SET ${column} = $1  WHERE id = $2`,
            [value, id]
        );
        return rows[0];
    }

    async retrieveData(table, field, id) {
        const { rows } = await pool.query(
            `SELECT ${field}  FROM ${table} WHERE id = $1`,
            [id]
        );
        return rows[0];
    }
}

module.exports = new UserService();
