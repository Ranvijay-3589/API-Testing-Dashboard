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

module.exports = {
  executeAndSaveRequest,
  getRequestHistory
};
