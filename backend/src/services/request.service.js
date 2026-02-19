const axios = require('axios');
const db = require('../config/db');

async function executeAndSaveRequest({ userId, method, url, headers, body }) {
  const start = Date.now();

  let response;
  try {
    response = await axios({
      method,
      url,
      headers: headers || undefined,
      data: method === 'GET' || method === 'DELETE' ? undefined : body,
      validateStatus: () => true,
      timeout: 15000
    });
  } catch (error) {
    const responseTimeMs = Date.now() - start;

    const statusCode = error.response?.status || 0;
    const responseData = error.response?.data || { error: error.message };

    await db.query(
      `INSERT INTO api_requests (user_id, method, url, headers, body, status_code, response_time_ms)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, method, url, headers || {}, body || null, statusCode, responseTimeMs]
    );

    return {
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      data: responseData
    };
  }

  const responseTimeMs = Date.now() - start;

  await db.query(
    `INSERT INTO api_requests (user_id, method, url, headers, body, status_code, response_time_ms)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [userId, method, url, headers || {}, body || null, response.status, responseTimeMs]
  );

  return {
    status_code: response.status,
    response_time_ms: responseTimeMs,
    data: response.data
  };
}

async function getRequestHistory(userId) {
  const result = await db.query(
    `SELECT id, method, url, headers, body, status_code, response_time_ms, created_at
     FROM api_requests
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT 50`,
    [userId]
  );

  return result.rows;
}

async function updateRequest(id, userId, { method, url, headers, body }) {
  const result = await db.query(
    `UPDATE api_requests
     SET method = $1, url = $2, headers = $3, body = $4
     WHERE id = $5 AND user_id = $6
     RETURNING *`,
    [method, url, headers || {}, body || null, id, userId]
  );
  return result.rows[0];
}

async function deleteRequest(id, userId) {
  const result = await db.query(
    'DELETE FROM api_requests WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0];
}

module.exports = {
  executeAndSaveRequest,
  getRequestHistory,
  updateRequest,
  deleteRequest
};
