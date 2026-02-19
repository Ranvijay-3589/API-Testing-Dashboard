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

async function updateHistory(req, res, next) {
  try {
    const { id, method, url, headers, body } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Request id is required' });
    }
    if (!method || !url) {
      return res.status(400).json({ message: 'Method and URL are required' });
    }

    const parsedHeaders = parseJsonInput(headers, 'headers') || {};
    const parsedBody = parseJsonInput(body, 'body');

    const updated = await requestService.updateRequest(id, req.user.id, {
      method: method.toUpperCase(),
      url,
      headers: parsedHeaders,
      body: parsedBody
    });

    if (!updated) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({ message: 'Request updated', item: updated });
  } catch (error) {
    return next(error);
  }
}

async function deleteHistory(req, res, next) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'Request id is required' });
    }

    const deleted = await requestService.deleteRequest(id, req.user.id);

    if (!deleted) {
      return res.status(404).json({ message: 'Request not found' });
    }

    return res.status(200).json({ message: 'Request deleted' });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  sendRequest,
  getHistory,
  updateHistory,
  deleteHistory
};
