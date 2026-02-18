import React from 'react';

const getStatusBadgeClass = (code) => {
  if (!code || code === 0) return 'bg-secondary';
  if (code >= 200 && code < 300) return 'bg-success';
  if (code >= 300 && code < 400) return 'bg-info';
  if (code >= 400 && code < 500) return 'bg-warning';
  return 'bg-danger';
};

const ResponseViewer = ({ response }) => {
  if (!response) return null;

  const formatJson = (data) => {
    try {
      if (typeof data === 'string') {
        return JSON.stringify(JSON.parse(data), null, 2);
      }
      return JSON.stringify(data, null, 2);
    } catch {
      return String(data);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h5 className="mb-0">Response</h5>
        <div className="d-flex gap-3 align-items-center">
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
          {formatJson(response.response_data)}
        </pre>
      </div>
    </div>
  );
};

export default ResponseViewer;
