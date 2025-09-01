// const sql = require('mssql');
const sql = require("mssql");



const config = {
  user: 'sa',
  password: 'Ph@hoenix#g',
  server: '137.97.174.51',
  database: 'casedairy',
  options: {
    encrypt: false,
    trustServerCertificate: true
  }
};

// const config = {
//   server: 'AMIT-PC',
//   database: 'casedairy',
//   driver: 'msnodesqlv8',
//   options: {
//     trustedConnection: true
//   }
// };

const poolPromise = new sql.ConnectionPool(config)
  .connect()
  .then(pool => {
    console.log('Connected to SQL Server');
    return pool;
  })
  .catch(err => {
    console.error('DB Connection Failed:', err.message || err);
    return null;  
  });

module.exports = { sql, poolPromise };