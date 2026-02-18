import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const getMethodBadge = (method) => {
  const colors = {
    GET: 'bg-success',
    POST: 'bg-primary',
    PUT: 'bg-warning',
    DELETE: 'bg-danger',
    PATCH: 'bg-info',
  };
  return colors[method] || 'bg-secondary';
};

const getStatusBadge = (code) => {
  if (!code || code === 0) return 'bg-secondary';
  if (code >= 200 && code < 300) return 'bg-success';
  if (code >= 300 && code < 400) return 'bg-info';
  if (code >= 400 && code < 500) return 'bg-warning';
  return 'bg-danger';
};

const History = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/request/history');
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch history');
    } finally {
      setLoading(false);
    }
  };

  const handleRerun = (request) => {
    navigate('/', {
      state: {
        request: {
          method: request.method,
          url: request.url,
          headers: request.headers,
          body: request.body,
        },
      },
    });
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Request History</h3>
      {error && <div className="alert alert-danger">{error}</div>}

      {requests.length === 0 ? (
        <div className="text-center text-muted mt-5">
          <h5>No requests yet</h5>
          <p>Send your first API request to see it here.</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>Method</th>
                <th>URL</th>
                <th>Status</th>
                <th>Time</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <span className={`badge ${getMethodBadge(req.method)}`}>
                      {req.method}
                    </span>
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '300px' }}>
                    {req.url}
                  </td>
                  <td>
                    <span className={`badge ${getStatusBadge(req.status_code)}`}>
                      {req.status_code || 'Error'}
                    </span>
                  </td>
                  <td>{req.response_time_ms}ms</td>
                  <td className="text-nowrap">{formatDate(req.created_at)}</td>
                  <td>
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleRerun(req)}
                    >
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
  );
};

export default History;
