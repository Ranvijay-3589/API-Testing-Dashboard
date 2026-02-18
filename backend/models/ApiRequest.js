const pool = require('../config/db');

const ApiRequest = {
  async create(userId, method, url, headers, body, statusCode, responseTimeMs) {
    const result = await pool.query(
      `INSERT INTO api_requests (user_id, method, url, headers, body, status_code, response_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, method, url, JSON.stringify(headers), body ? JSON.stringify(body) : null, statusCode, responseTimeMs]
    );
    return result.rows[0];
  },

  async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM api_requests WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  },

  async findById(id, userId) {
    const result = await pool.query(
      'SELECT * FROM api_requests WHERE id = $1 AND user_id = $2',
      [id, userId]
    );
    return result.rows[0];
  },
};

module.exports = ApiRequest;
