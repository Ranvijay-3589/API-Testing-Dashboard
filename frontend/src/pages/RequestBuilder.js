import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ResponseViewer from '../components/ResponseViewer';

const CONTENT_TYPES = [
  { value: 'application/json', label: 'JSON' },
  { value: 'application/xml', label: 'XML' },
  { value: 'text/plain', label: 'Text' },
];

const detectContentType = (headers) => {
  if (!headers || typeof headers !== 'object') return 'application/json';
  const ct = headers['Content-Type'] || headers['content-type'] || '';
  if (ct.includes('xml')) return 'application/xml';
  if (ct.includes('text/plain')) return 'text/plain';
  return 'application/json';
};

const RequestBuilder = () => {
  const location = useLocation();
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [headers, setHeaders] = useState('');
  const [body, setBody] = useState('');
  const [contentType, setContentType] = useState('application/json');
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.request) {
      const req = location.state.request;
      setMethod(req.method || 'GET');
      setUrl(req.url || '');

      const detectedCt = detectContentType(req.headers);
      setContentType(detectedCt);

      // Set headers without Content-Type (we manage it via selector)
      if (req.headers && Object.keys(req.headers).length > 0) {
        const filteredHeaders = { ...req.headers };
        delete filteredHeaders['Content-Type'];
        delete filteredHeaders['content-type'];
        if (Object.keys(filteredHeaders).length > 0) {
          setHeaders(JSON.stringify(filteredHeaders, null, 2));
        } else {
          setHeaders('');
        }
      } else {
        setHeaders('');
      }

      // Set body: string for XML/text, JSON.stringify for objects
      if (typeof req.body === 'string') {
        setBody(req.body);
      } else if (req.body) {
        setBody(JSON.stringify(req.body, null, 2));
      } else {
        setBody('');
      }
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

    // Parse user-provided headers
    let parsedHeaders = {};
    if (headers.trim()) {
      try {
        parsedHeaders = JSON.parse(headers);
      } catch {
        setError('Headers must be valid JSON');
        return;
      }
    }

    // Merge Content-Type into headers for methods with body
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      parsedHeaders['Content-Type'] = contentType;
    }

    // Parse/validate body based on content type
    let requestBody = null;
    if (body.trim() && ['POST', 'PUT', 'PATCH'].includes(method)) {
      if (contentType === 'application/json') {
        try {
          requestBody = JSON.parse(body);
        } catch {
          setError('Body must be valid JSON');
          return;
        }
      } else {
        // XML or Text: send as raw string
        requestBody = body;
      }
    }

    setLoading(true);
    try {
      const res = await api.post('/request/send', {
        method,
        url: url.trim(),
        headers: parsedHeaders,
        body: requestBody,
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

  const getBodyPlaceholder = () => {
    if (contentType === 'application/xml') {
      return '<?xml version="1.0"?>\n<root>\n  <item>value</item>\n</root>';
    }
    if (contentType === 'text/plain') {
      return 'Enter plain text body...';
    }
    return '{"key": "value"}';
  };

  const getBodyLabel = () => {
    if (contentType === 'application/xml') return 'Body (XML)';
    if (contentType === 'text/plain') return 'Body (Text)';
    return 'Body (JSON)';
  };

  const hasBody = ['POST', 'PUT', 'PATCH'].includes(method);

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

        {/* Content-Type Selector */}
        {hasBody && (
          <div className="mb-3">
            <label className="form-label fw-semibold me-3">Content-Type:</label>
            <div className="btn-group" role="group">
              {CONTENT_TYPES.map((ct) => (
                <React.Fragment key={ct.value}>
                  <input
                    type="radio"
                    className="btn-check"
                    name="contentType"
                    id={`ct-${ct.value}`}
                    value={ct.value}
                    checked={contentType === ct.value}
                    onChange={(e) => setContentType(e.target.value)}
                  />
                  <label
                    className={`btn btn-outline-secondary btn-sm`}
                    htmlFor={`ct-${ct.value}`}
                  >
                    {ct.label}
                  </label>
                </React.Fragment>
              ))}
            </div>
            <small className="text-muted ms-2">{contentType}</small>
          </div>
        )}

        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Headers (JSON)</label>
            <textarea
              className="form-control font-monospace"
              rows="5"
              placeholder='{"Authorization": "Bearer token"}'
              value={headers}
              onChange={(e) => setHeaders(e.target.value)}
            />
          </div>
          <div className="col-md-6">
            <label className="form-label fw-semibold">{getBodyLabel()}</label>
            <textarea
              className="form-control font-monospace"
              rows="5"
              placeholder={getBodyPlaceholder()}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={!hasBody}
            />
          </div>
        </div>
      </form>

      <ResponseViewer response={response} />
    </div>
  );
};

export default RequestBuilder;
