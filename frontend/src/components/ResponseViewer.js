import React from 'react';

function statusClass(statusCode) {
  if (statusCode >= 200 && statusCode < 300) return 'bg-success';
  if (statusCode >= 400) return 'bg-danger';
  return 'bg-secondary';
}

export default function ResponseViewer({ response }) {
  if (!response) {
    return null;
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h5 className="card-title mb-0">Response Viewer</h5>
          <div className="d-flex gap-2">
            <span className={`badge ${statusClass(response.status_code)}`}>Status: {response.status_code}</span>
            <span className="badge bg-info text-dark">{response.response_time_ms} ms</span>
          </div>
        </div>
        <pre className="bg-light p-3 rounded mb-0" style={{ maxHeight: '400px', overflow: 'auto' }}>
          {JSON.stringify(response.data, null, 2)}
        </pre>
      </div>
    </div>
  );
}
