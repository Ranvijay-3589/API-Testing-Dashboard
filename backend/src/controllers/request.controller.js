const requestService = require('../services/request.service');
const { parseJsonInput, validateRequestPayload } = require('../utils/validators');

async function sendRequest(req, res, next) {
  try {
    const { errors, method } = validateRequestPayload(req.body);
    if (errors.length) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const headers = parseJsonInput(req.body.headers, 'headers') || {};
    const body = parseJsonInput(req.body.body, 'body');

    const result = await requestService.executeAndSaveRequest({
      userId: req.user.id,
      method,
      url: req.body.url,
      headers,
      body
    });

    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await requestService.getRequestHistory(req.user.id);
    return res.status(200).json({ items: history });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  sendRequest,
  getHistory
};
