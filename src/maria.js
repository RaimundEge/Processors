import mariadb from "mariadb";
import "./env.js";

const pool = mariadb.createPool({
    host: process.env.MARIA_URL,
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
        const rows = await conn.query("SELECT * FROM csci467.customers WHERE id = ?", [poData.custid]);
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

async function getLogRecords(recent) {
    let conn;
    try {
        conn = await pool.getConnection();

        var where = 'where timestamp > now() - INTERVAL ' + recent + ' MONTH ';
        var query = 'select id, timestamp, groupName, type, IP, port from csci350.logrecords ' + where + 'ORDER BY id DESC';

        const rows = await conn.query(query);
        return rows;
    } catch (err) {
        return err;
    } finally {
        if (conn) { conn.end(); }
    }
}

export { check, getLogRecords };
