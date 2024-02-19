const { dbconfig } = require("../dbConnection");
const sql = require('mssql');

exports.getAllattendances = async (req, res) => {
    try {
        await sql.connect(dbconfig.GYM);
    
        const result = await sql.query(`
          SELECT a.userId, a.date, a.time, u.firstName, u.secondName, u.address, u.contact, u.height, u.weight, u.email, u.password, u.usertype, u.isActive, u.isDeleted
          FROM attendance AS a
          INNER JOIN users AS u ON a.userId = u.userId
        `);
    
        return result.recordset;
      } catch (error) {
        console.error('Error fetching attendance with user information:', error.message);
        throw error;
      } finally {
        sql.close();
      }
}