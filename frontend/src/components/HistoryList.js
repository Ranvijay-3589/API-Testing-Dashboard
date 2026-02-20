import React from 'react';

const getMethodBadge = (method) => {
  const colors = {
    GET: 'bg-success',
    POST: 'bg-primary',
    PUT: 'bg-warning',
    DELETE: 'bg-danger',
    PATCH: 'bg-info',
  };
  return colors[method] || 'bg-dark';
};

export default function HistoryList({ items, onRerun, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h5 className="card-title">Request History</h5>
        {items.length === 0 ? (
          <p className="text-muted mb-0">No requests yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-sm align-middle mb-0">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className={`badge ${getMethodBadge(item.method)}`}>{item.method}</span>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: '260px' }}>{item.url}</td>
                    <td>{item.status_code}</td>
                    <td>{item.response_time_ms} ms</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>
                      <div className="btn-group btn-group-sm">
                        <button
                          className="btn btn-outline-primary"
                          onClick={() => onRerun(item)}
                          title="Re-run"
                        >
                          Re-run
                        </button>
                        {onEdit && (
                          <button
                            className="btn btn-outline-warning"
                            onClick={() => onEdit(item)}
                            title="Edit"
                          >
                            Edit
                          </button>
                        )}
                        {onDelete && (
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => onDelete(item)}
                            title="Delete"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
