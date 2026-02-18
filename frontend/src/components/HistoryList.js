import React from 'react';

export default function HistoryList({ items, onRerun }) {
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id}>
                    <td><span className="badge bg-dark">{item.method}</span></td>
                    <td className="text-truncate" style={{ maxWidth: '260px' }}>{item.url}</td>
                    <td>{item.status_code}</td>
                    <td>{item.response_time_ms} ms</td>
                    <td>{new Date(item.created_at).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => onRerun(item)}>
                        Re-run
                      </button>
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
