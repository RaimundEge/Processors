import mariadb from "mariadb";
import "./env.js";

const pool = mariadb.createPool({
    host: process.env.MARIA_URL,
    database: process.env.MARIA_DB,
    user: process.env.MARIA_USER,
    password: process.env.MARIA_PASSWORD,
    connectionLimit: 2
});

async function check(poData) {
    // console.log('find: ', poData)
    let conn;
    let errors = [];
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM customers WHERE id = ?", [poData.custid]);
        if (rows.length > 0) {
            poData.name = rows[0].name;
            // console.log(poData.name);
        } else {
            errors = ["customer id not found"];
        }
    } catch (err) {
        errors = ["customer id not found"];
    } finally {
        if (conn) { conn.end(); }
    }
    return errors;
}

export { check };
