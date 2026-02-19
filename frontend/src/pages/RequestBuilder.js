import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ResponseViewer from '../components/ResponseViewer';

const RequestBuilder = () => {
  const location = useLocation();
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.request) {
      const req = location.state.request;
      setMethod(req.method || 'GET');
      setUrl(req.url || '');
      setHeaders(
        req.headers && Object.keys(req.headers).length > 0
          ? JSON.stringify(req.headers, null, 2)
          : ''
      );
      setBody(req.body ? JSON.stringify(req.body, null, 2) : '');
    }
  }, [location.state]);

  const handleSend = async (e) => {
    e.preventDefault();
    setError('');
    setResponse(null);

    if (!url.trim()) {
      setError('URL is required');
      return;
    }

    let parsedHeaders = {};
    if (headers.trim()) {
      try {
        parsedHeaders = JSON.parse(headers);
      } catch {
        setError('Headers must be valid JSON');
        return;
      }
    }

    let parsedBody = null;
    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        setError('Body must be valid JSON');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await api.post('/request/send', {
        method,
        url: url.trim(),
        headers: parsedHeaders,
        body: parsedBody,
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const getMethodColor = (m) => {
    const colors = {
      GET: 'text-bg-success',
      POST: 'text-bg-primary',
      PUT: 'text-bg-warning',
      DELETE: 'text-bg-danger',
      PATCH: 'text-bg-info',
    };
    return colors[m] || 'text-bg-secondary';
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Request Builder</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSend}>
        <div className="row g-2 mb-3">
          <div className="col-auto">
            <select
              className={`form-select fw-bold ${getMethodColor(method)}`}
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter request URL (e.g. https://jsonplaceholder.typicode.com/posts/1)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                  Sending...
                </>
              ) : (
                'Send'
              )}
            </button>
          </div>
        </div>

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Headers (JSON)</label>
            <textarea
              className="form-control font-monospace"
              rows="5"
              placeholder='{"Content-Type": "application/json"}'
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">Body (JSON)</label>
            <textarea
              className="form-control font-monospace"
              rows="5"
              placeholder='{"key": "value"}'
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!['POST', 'PUT', 'PATCH'].includes(method)}
            />
          </div>
        </div>
      </form>

      <ResponseViewer response={response} />
    </div>
  );
};

export default RequestBuilder;
