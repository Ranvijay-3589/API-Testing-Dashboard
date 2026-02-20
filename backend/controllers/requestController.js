const requestService = require('../services/requestService');

const requestController = {
  async send(req, res, next) {
    try {
      const { method, url, headers, body } = req.body;

      if (!method || !url) {
        return res.status(400).json({ message: 'Method and URL are required' });
      }

      const validMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
      if (!validMethods.includes(method.toUpperCase())) {
        return res.status(400).json({ message: 'Invalid HTTP method' });
      }

      const result = await requestService.sendRequest(req.user.id, method, url, headers, body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async history(req, res, next) {
    try {
      const requests = await requestService.getHistory(req.user.id);
      res.json(requests);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const { id, method, url, headers, body } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Request ID is required' });
      }

      if (!method || !url) {
        return res.status(400).json({ message: 'Method and URL are required' });
      }

      let parsedHeaders = headers || {};
      if (typeof headers === 'string' && headers.trim()) {
        try {
          parsedHeaders = JSON.parse(headers);
        } catch {
          return res.status(400).json({ message: 'Headers must be valid JSON' });
        }
      }

      let parsedBody = body || null;
      if (typeof body === 'string' && body.trim()) {
        try {
          parsedBody = JSON.parse(body);
        } catch {
          return res.status(400).json({ message: 'Body must be valid JSON' });
        }
      }

      const result = await requestService.updateRequest(req.user.id, id, {
        method,
        url,
        headers: parsedHeaders,
        body: parsedBody,
      });
      res.json(result);
    } catch (error) {
      next(error);
    }
  },

  async remove(req, res, next) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ message: 'Request ID is required' });
      }

      const result = await requestService.deleteRequest(req.user.id, id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
};

module.exports = requestController;
