import React from 'react';

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

const ResponseViewer = ({ response }) => {
  if (!response) return null;

  const formatResponse = (data) => {
    // Try JSON first
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

    // Check if XML
    if (isXml(data)) {
      return { text: formatXml(data), type: 'xml' };
    }

    // Fallback to string
    return { text: String(data), type: 'text' };
  };

  const { text, type } = formatResponse(response.response_data);

  const getTypeLabel = () => {
    if (type === 'xml') return 'XML';
    if (type === 'json') return 'JSON';
    return 'Text';
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Response</h5>
        <div className="d-flex gap-3 align-items-center">
          <span className="badge bg-secondary">
            {getTypeLabel()}
          </span>
          <span className={`badge ${getStatusBadgeClass(response.status_code)}`}>
            Status: {response.status_code || 'Error'}
          </span>
          <span className="badge bg-primary">
            Time: {response.response_time_ms}ms
          </span>
        </div>
      </div>
      <div className="card-body">
        <pre
          className="bg-dark text-light p-3 rounded"
          style={{ maxHeight: '500px', overflow: 'auto', fontSize: '0.875rem' }}
        >
          {text}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
