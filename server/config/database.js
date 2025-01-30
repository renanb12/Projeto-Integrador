import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: '3d_manager',
  port: '3306'
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0
});

export default pool;