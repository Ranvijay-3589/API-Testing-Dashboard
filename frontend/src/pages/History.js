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

const detectContentType = (headers) => {
  if (!headers || typeof headers !== 'object') return 'application/json';
  const ct = headers['Content-Type'] || headers['content-type'] || '';
  if (ct.includes('xml')) return 'application/xml';
  if (ct.includes('text/plain')) return 'text/plain';
  return 'application/json';
};

const formatBodyForDisplay = (body) => {
  if (body == null) return '';
  if (typeof body === 'string') return body;
  return JSON.stringify(body, null, 2);
};

const History = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const navigate = useNavigate();

  // Edit modal state
  const [editItem, setEditItem] = useState(null);
  const [editForm, setEditForm] = useState({ method: 'GET', url: '', headers: '', body: '' });
  const [editContentType, setEditContentType] = useState('application/json');
  const [editLoading, setEditLoading] = useState(false);

  // Delete confirm state
  const [deleteItem, setDeleteItem] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/request/history');
      setRequests(res.data.items || res.data);
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

  // --- Edit handlers ---
  const openEditModal = (item) => {
    const ct = detectContentType(item.headers);
    setEditItem(item);
    setEditContentType(ct);

    // Filter out Content-Type from headers for display
    const filteredHeaders = { ...(item.headers || {}) };
    delete filteredHeaders['Content-Type'];
    delete filteredHeaders['content-type'];

    setEditForm({
      method: item.method,
      url: item.url,
      headers: Object.keys(filteredHeaders).length > 0 ? JSON.stringify(filteredHeaders, null, 2) : '',
      body: formatBodyForDisplay(item.body),
    });
    setError('');
    setSuccessMsg('');
  };

  const closeEditModal = () => {
    setEditItem(null);
    setEditForm({ method: 'GET', url: '', headers: '', body: '' });
    setEditContentType('application/json');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setError('');

    // Merge Content-Type into headers
    let headersToSend = editForm.headers;
    try {
      const parsed = editForm.headers.trim() ? JSON.parse(editForm.headers) : {};
      if (['POST', 'PUT', 'PATCH'].includes(editForm.method)) {
        parsed['Content-Type'] = editContentType;
      }
      headersToSend = JSON.stringify(parsed);
    } catch {
      setError('Headers must be valid JSON');
      setEditLoading(false);
      return;
    }

    try {
      await api.post('/request/history/update', {
        id: editItem.id,
        method: editForm.method,
        url: editForm.url,
        headers: headersToSend,
        body: editForm.body,
      });
      setSuccessMsg('Request updated successfully');
      closeEditModal();
      setLoading(true);
      await fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update request');
    } finally {
      setEditLoading(false);
    }
  };

  // --- Delete handlers ---
  const openDeleteConfirm = (item) => {
    setDeleteItem(item);
    setError('');
    setSuccessMsg('');
  };

  const closeDeleteConfirm = () => {
    setDeleteItem(null);
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setError('');
    try {
      await api.post('/request/history/delete', { id: deleteItem.id });
      setSuccessMsg('Request deleted successfully');
      closeDeleteConfirm();
      setRequests((prev) => prev.filter((r) => r.id !== deleteItem.id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete request');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Auto-dismiss success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const getBodyPlaceholder = () => {
    if (editContentType === 'application/xml') return '<?xml version="1.0"?>\n<root>...</root>';
    if (editContentType === 'text/plain') return 'Enter plain text body...';
    return '{"key": "value"}';
  };

  const getBodyLabel = () => {
    if (editContentType === 'application/xml') return 'Body (XML)';
    if (editContentType === 'text/plain') return 'Body (Text)';
    return 'Body (JSON)';
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Request History</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {successMsg && <div className="alert alert-success">{successMsg}</div>}

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
                <th>Actions</th>
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
                    <div className="btn-group btn-group-sm">
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => handleRerun(req)}
                        title="Re-run this request"
                      >
                        <i className="bi bi-arrow-repeat"></i> Re-run
                      </button>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => openEditModal(req)}
                        title="Edit this request"
                      >
                        <i className="bi bi-pencil"></i> Edit
                      </button>
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => openDeleteConfirm(req)}
                        title="Delete this request"
                      >
                        <i className="bi bi-trash"></i> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editItem && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeEditModal}>
          <div className="modal-dialog modal-lg" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Request</h5>
                <button type="button" className="btn-close" onClick={closeEditModal}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="row mb-3">
                    <div className="col-md-3">
                      <label className="form-label">Method</label>
                      <select
                        className="form-select"
                        name="method"
                        value={editForm.method}
                        onChange={handleEditChange}
                      >
                        <option value="GET">GET</option>
                        <option value="POST">POST</option>
                        <option value="PUT">PUT</option>
                        <option value="DELETE">DELETE</option>
                        <option value="PATCH">PATCH</option>
                      </select>
                    </div>
                    <div className="col-md-9">
                      <label className="form-label">URL</label>
                      <input
                        type="text"
                        className="form-control"
                        name="url"
                        value={editForm.url}
                        onChange={handleEditChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Content-Type selector in edit modal */}
                  {['POST', 'PUT', 'PATCH'].includes(editForm.method) && (
                    <div className="mb-3">
                      <label className="form-label fw-semibold me-3">Content-Type:</label>
                      <div className="btn-group" role="group">
                        {[
                          { value: 'application/json', label: 'JSON' },
                          { value: 'application/xml', label: 'XML' },
                          { value: 'text/plain', label: 'Text' },
                        ].map((ct) => (
                          <React.Fragment key={ct.value}>
                            <input
                              type="radio"
                              className="btn-check"
                              name="editContentType"
                              id={`edit-ct-${ct.value}`}
                              value={ct.value}
                              checked={editContentType === ct.value}
                              onChange={(e) => setEditContentType(e.target.value)}
                            />
                            <label className="btn btn-outline-secondary btn-sm" htmlFor={`edit-ct-${ct.value}`}>
                              {ct.label}
                            </label>
                          </React.Fragment>
                        ))}
                      </div>
                      <small className="text-muted ms-2">{editContentType}</small>
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label">Headers (JSON)</label>
                    <textarea
                      className="form-control font-monospace"
                      name="headers"
                      rows="3"
                      value={editForm.headers}
                      onChange={handleEditChange}
                      placeholder='{"Authorization": "Bearer token"}'
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">{getBodyLabel()}</label>
                    <textarea
                      className="form-control font-monospace"
                      name="body"
                      rows="4"
                      value={editForm.body}
                      onChange={handleEditChange}
                      placeholder={getBodyPlaceholder()}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={editLoading}>
                    {editLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteItem && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={closeDeleteConfirm}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button type="button" className="btn-close" onClick={closeDeleteConfirm}></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this request?</p>
                <div className="card bg-light">
                  <div className="card-body py-2">
                    <strong>
                      <span className={`badge ${getMethodBadge(deleteItem.method)} me-2`}>
                        {deleteItem.method}
                      </span>
                    </strong>
                    <span className="text-break">{deleteItem.url}</span>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeDeleteConfirm}>
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
