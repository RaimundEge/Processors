import mariadb from "mariadb";

const pool = mariadb.createPool({ host: "er7lx9km02rjyf3n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com", database: "b25oudnru9u3blk4", user: "rs0czd6o8w8e8r3j", password: "w1ffboir25orrcs4", connectionLimit: 5 });

async function check(poData: any) {
    // console.log('find: ', poData)
    let conn;
    let errors: string[] = [];
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
