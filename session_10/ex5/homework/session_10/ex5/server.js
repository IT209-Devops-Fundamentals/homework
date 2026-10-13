const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 8080;

const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

app.get('/', async (req, res) => {
  try {
    const dbRes = await pool.query('SELECT NOW() as current_time');
    res.json({
      status: 'success',
      message: 'Hello from Docker Compose multi-service backend!',
      db_connected: true,
      db_time: dbRes.rows[0].current_time
    });
  } catch (err) {
    res.json({
      status: 'warning',
      message: 'Backend is running but database connection is initializing...',
      db_connected: false,
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
