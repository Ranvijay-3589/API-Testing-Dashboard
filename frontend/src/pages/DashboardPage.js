import React, { useEffect, useState } from 'react';
import client from '../api/client';
import RequestBuilder from '../components/RequestBuilder';
import ResponseViewer from '../components/ResponseViewer';
import HistoryList from '../components/HistoryList';
import { useAuth } from '../contexts/AuthContext';

const INITIAL_FORM = {
  method: 'GET',
  url: '',
  headers: '{\n  "Content-Type": "application/json"\n}',
  body: '{\n\n}'
};

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState(INITIAL_FORM);
  const [response, setResponse] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadHistory = async () => {
    try {
      const { data } = await client.get('/request/history');
      setHistory(data.items || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.');
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const sendRequest = async () => {
    setError('');
    setLoading(true);

    try {
      const { data } = await client.post('/request/send', form);
      setResponse(data);
      await loadHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Request failed.');
    } finally {
      setLoading(false);
    }
  };

  const rerunFromHistory = (item) => {
    setForm({
      method: item.method,
      url: item.url,
      headers: JSON.stringify(item.headers || {}, null, 2),
      body: JSON.stringify(item.body || {}, null, 2)
    });
  };

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="mb-1">API Testing Dashboard</h2>
          <div className="text-muted small">Logged in as {user?.email}</div>
        </div>
        <button className="btn btn-outline-danger" onClick={logout}>
          Logout
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <RequestBuilder form={form} onChange={setForm} onSubmit={sendRequest} loading={loading} />
      <ResponseViewer response={response} />
      <HistoryList items={history} onRerun={rerunFromHistory} />
    </div>
  );
}
