import React from 'react';

const METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export default function RequestBuilder({ form, onChange, onSubmit, loading }) {
  return (
    <div className="card shadow-sm mb-4">
      <div className="card-body">
        <h5 className="card-title">Request Builder</h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Method</label>
            <select
              className="form-select"
              value={form.method}
              onChange={(e) => onChange({ ...form, method: e.target.value })}
            >
              {METHODS.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-9">
            <label className="form-label">URL</label>
            <input
              className="form-control"
              value={form.url}
              onChange={(e) => onChange({ ...form, url: e.target.value })}
              placeholder="https://jsonplaceholder.typicode.com/posts/1"
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Headers (JSON)</label>
            <textarea
              className="form-control"
              rows="6"
              value={form.headers}
              onChange={(e) => onChange({ ...form, headers: e.target.value })}
              placeholder='{"Content-Type":"application/json"}'
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Body (JSON)</label>
            <textarea
              className="form-control"
              rows="6"
              value={form.body}
              onChange={(e) => onChange({ ...form, body: e.target.value })}
              placeholder='{"title":"hello"}'
            />
          </div>
          <div className="col-12 d-grid d-md-flex justify-content-md-end">
            <button className="btn btn-primary" onClick={onSubmit} disabled={loading}>
              {loading ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
