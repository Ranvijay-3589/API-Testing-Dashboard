const axios = require('axios');
const ApiRequest = require('../models/ApiRequest');

const requestService = {
  async sendRequest(userId, method, url, headers, body) {
    const axiosConfig = {
      method: method.toLowerCase(),
      url,
      headers: headers || {},
      timeout: 30000,
      validateStatus: () => true,
    };

    if (['post', 'put', 'patch'].includes(method.toLowerCase()) && body) {
      axiosConfig.data = body;
    }

    const startTime = Date.now();
    let statusCode;
    let responseData;

    try {
      const response = await axios(axiosConfig);
      statusCode = response.status;
      responseData = response.data;
    } catch (error) {
      if (error.response) {
        statusCode = error.response.status;
        responseData = error.response.data;
      } else {
        statusCode = 0;
        responseData = { error: error.message };
      }
    }

    const responseTimeMs = Date.now() - startTime;

    const savedRequest = await ApiRequest.create(
      userId,
      method.toUpperCase(),
      url,
      headers || {},
      body || null,
      statusCode,
      responseTimeMs
    );

    return {
      id: savedRequest.id,
      status_code: statusCode,
      response_time_ms: responseTimeMs,
      response_data: responseData,
    };
  },

  async getHistory(userId) {
    return ApiRequest.findByUserId(userId);
  },
};

module.exports = requestService;
