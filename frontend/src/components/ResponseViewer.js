import React, { useMemo, useState, useCallback } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const getStatusBadgeClass = (code) => {
  if (!code || code === 0) return 'bg-secondary';
  if (code >= 200 && code < 300) return 'bg-success';
  if (code >= 300 && code < 400) return 'bg-info';
  if (code >= 400 && code < 500) return 'bg-warning';
  return 'bg-danger';
};

const formatXml = (xml) => {
  try {
    let formatted = '';
    let indent = 0;
    const nodes = xml.replace(/(>)\s*(<)/g, '$1\n$2').split('\n');

    nodes.forEach((node) => {
      node = node.trim();
      if (!node) return;

      if (node.match(/^<\/\w/)) {
        indent = Math.max(0, indent - 1);
      }

      formatted += '  '.repeat(indent) + node + '\n';

      if (
        node.match(/^<\w([^>]*[^/])?>/) &&
        !node.match(/^<\w[^>]*\/>/) &&
        !node.match(/<\/\w/)
      ) {
        indent++;
      }
    });

    return formatted.trim();
  } catch {
    return xml;
  }
};

const isXml = (data) => {
  if (typeof data !== 'string') return false;
  const trimmed = data.trim();
  return trimmed.startsWith('<') && trimmed.endsWith('>');
};

const URL_REGEX = /https?:\/\/[^\s"'`,<>}\])+]+(?:[)\]](?=[^\w]|$))?/g;

const renderTextWithLinks = (text) => {
  const parts = [];
  let lastIndex = 0;
  let match;

  URL_REGEX.lastIndex = 0;
  while ((match = URL_REGEX.exec(text)) !== null) {
    const url = match[0];
    const startIdx = match.index;

    if (startIdx > lastIndex) {
      parts.push(text.slice(lastIndex, startIdx));
    }

    parts.push(
      <a
        key={startIdx}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#58a6ff', textDecoration: 'underline', wordBreak: 'break-all' }}
      >
        {url}
      </a>
    );

    lastIndex = startIdx + url.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};

const getFileExtension = (type) => {
  if (type === 'json') return 'json';
  if (type === 'xml') return 'xml';
  return 'txt';
};

const getMimeType = (type) => {
  if (type === 'json') return 'application/json';
  if (type === 'xml') return 'application/xml';
  return 'text/plain';
};

const ResponseViewer = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const [activeView, setActiveView] = useState('response');
  const [swaggerDoc, setSwaggerDoc] = useState('');
  const [swaggerLoading, setSwaggerLoading] = useState(false);
  const [swaggerError, setSwaggerError] = useState('');

  const formatResponse = useCallback((data) => {
    try {
      if (typeof data === 'string') {
        const parsed = JSON.parse(data);
        return { text: JSON.stringify(parsed, null, 2), type: 'json' };
      }
      if (typeof data === 'object' && data !== null) {
        return { text: JSON.stringify(data, null, 2), type: 'json' };
      }
    } catch {
      // Not JSON
    }

    if (isXml(data)) {
      return { text: formatXml(data), type: 'xml' };
    }

    return { text: String(data), type: 'text' };
  }, []);

  const { text, type } = useMemo(
    () => (response ? formatResponse(response.response_data) : { text: '', type: 'text' }),
    [response, formatResponse]
  );

  const linkedContent = useMemo(() => renderTextWithLinks(text), [text]);

  const handleDownload = useCallback(() => {
    const ext = getFileExtension(type);
    const mime = getMimeType(type);
    const blob = new Blob([text], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `response-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [text, type]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  const handleSwaggerDocView = useCallback(async () => {
    setActiveView('swaggerDoc');
    if (swaggerDoc || swaggerLoading) {
      return;
    }

    setSwaggerError('');
    setSwaggerLoading(true);
    try {
      const apiBase = process.env.REACT_APP_API_BASE_URL || '/mohit/api';
      const res = await fetch(`${apiBase}/openapi.json`);
      if (!res.ok) {
        throw new Error(`Failed to load OpenAPI JSON (${res.status})`);
      }
      const data = await res.json();
      setSwaggerDoc(JSON.stringify(data, null, 2));
    } catch (error) {
      setSwaggerError(error.message || 'Failed to load OpenAPI JSON');
    } finally {
      setSwaggerLoading(false);
    }
  }, [swaggerDoc, swaggerLoading]);

  if (!response) return null;

  const getTypeLabel = () => {
    if (type === 'xml') return 'XML';
    if (type === 'json') return 'JSON';
    return 'Text';
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h5 className="mb-0">Response</h5>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          {activeView === 'response' && (
            <>
              <span className="badge bg-secondary">
                {getTypeLabel()}
              </span>
              <span className={`badge ${getStatusBadgeClass(response.status_code)}`}>
                Status: {response.status_code || 'Error'}
              </span>
              <span className="badge bg-primary">
                Time: {response.response_time_ms}ms
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={handleCopy}
                title="Copy response to clipboard"
              >
                <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`}></i>
                {copied ? ' Copied!' : ' Copy'}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-light"
                onClick={handleDownload}
                title={`Download as .${getFileExtension(type)} file`}
              >
                <i className="bi bi-download"></i>
                {' Download'}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="card-body">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'response' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveView('response')}
          >
            Response JSON
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'swaggerUi' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setActiveView('swaggerUi')}
          >
            Swagger UI
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeView === 'swaggerDoc' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={handleSwaggerDocView}
          >
            Swagger Doc
          </button>
        </div>

        {activeView === 'response' && (
          <pre
            className="bg-dark text-light p-3 rounded"
            style={{ maxHeight: '500px', overflow: 'auto', fontSize: '0.875rem' }}
          >
            {linkedContent}
          </pre>
        )}

        {activeView === 'swaggerUi' && (
          <div className="bg-white rounded border p-2" style={{ maxHeight: '700px', overflow: 'auto' }}>
            <SwaggerUI url={`${process.env.REACT_APP_API_BASE_URL || '/mohit/api'}/openapi.json`} />
          </div>
        )}

        {activeView === 'swaggerDoc' && (
          <>
            {swaggerLoading && <p className="mb-0 text-muted">Loading OpenAPI JSON...</p>}
            {swaggerError && <div className="alert alert-danger mb-0">{swaggerError}</div>}
            {!swaggerLoading && !swaggerError && (
              <pre
                className="bg-dark text-light p-3 rounded"
                style={{ maxHeight: '500px', overflow: 'auto', fontSize: '0.875rem' }}
              >
                {swaggerDoc}
              </pre>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
