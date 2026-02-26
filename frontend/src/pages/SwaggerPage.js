import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

const SwaggerPage = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') === 'doc' ? 'doc' : 'ui';

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [swaggerDoc, setSwaggerDoc] = useState('');
  const [swaggerLoading, setSwaggerLoading] = useState(false);
  const [swaggerError, setSwaggerError] = useState('');

  const apiBase = process.env.REACT_APP_API_BASE_URL || '/mohit/api';

  const handleDocTab = useCallback(async () => {
    setActiveTab('doc');
    if (swaggerDoc || swaggerLoading) return;

    setSwaggerError('');
    setSwaggerLoading(true);
    try {
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
  }, [apiBase, swaggerDoc, swaggerLoading]);

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header">
          <h5 className="mb-3">API Documentation</h5>
          <div className="d-flex gap-2">
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'ui' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setActiveTab('ui')}
            >
              Swagger UI
            </button>
            <button
              type="button"
              className={`btn btn-sm ${activeTab === 'doc' ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={handleDocTab}
            >
              Swagger Doc
            </button>
          </div>
        </div>
        <div className="card-body">
          {activeTab === 'ui' && (
            <div className="bg-white rounded border p-2" style={{ maxHeight: '700px', overflow: 'auto' }}>
              <SwaggerUI url={`${apiBase}/openapi.json`} />
            </div>
          )}

          {activeTab === 'doc' && (
            <>
              {swaggerLoading && <p className="mb-0 text-muted">Loading OpenAPI JSON...</p>}
              {swaggerError && <div className="alert alert-danger mb-0">{swaggerError}</div>}
              {!swaggerLoading && !swaggerError && swaggerDoc && (
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
    </div>
  );
};

export default SwaggerPage;
