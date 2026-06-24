const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'password_analyzer',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL connected successfully');
    
    const [rows] = await connection.query('SELECT NOW() as now');
    console.log('📅 Server time:', rows[0].now);
    
    connection.release();
  } catch (err) {
    console.error('❌ MySQL connection error:', err.message);
    throw err;
  }
};

// Query helper
const query = async (sql, params) => {
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  pool,
  testConnection,
  query
};