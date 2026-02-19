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
};

module.exports = requestController;
