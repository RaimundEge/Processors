"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mariadb_1 = __importDefault(require("mariadb"));
const pool = mariadb_1.default.createPool({ host: "er7lx9km02rjyf3n.cbetxkdyhwsb.us-east-1.rds.amazonaws.com", database: "b25oudnru9u3blk4", user: "rs0czd6o8w8e8r3j", password: "w1ffboir25orrcs4", connectionLimit: 5 });
function check(poData) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log('find: ', poData)
        let conn;
        let errors = [];
        try {
            conn = yield pool.getConnection();
            const rows = yield conn.query("SELECT * FROM customers WHERE id = ?", [poData.custid]);
            if (rows.length > 0) {
                poData.name = rows[0].name;
                // console.log(poData.name);
            }
            else {
                errors = ["customer id not found"];
            }
        }
        catch (err) {
            errors = ["customer id not found"];
        }
        finally {
            if (conn) {
                conn.end();
            }
        }
        return errors;
    });
}
exports.check = check;
//# sourceMappingURL=maria.js.map