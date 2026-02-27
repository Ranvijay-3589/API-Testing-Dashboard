import React, { useState, useEffect, useCallback } from 'react';
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
  const [swaggerSpec, setSwaggerSpec] = useState(null);
  const [specLoading, setSpecLoading] = useState(true);
  const [specError, setSpecError] = useState('');

  const apiBase = process.env.REACT_APP_API_BASE_URL || '/mohit/api';

  // Fetch the OpenAPI spec on mount and pass it directly to SwaggerUI
  // This ensures the correct server URL is used instead of Swagger UI resolving it incorrectly
  useEffect(() => {
    const fetchSpec = async () => {
      try {
        const res = await fetch(`${apiBase}/openapi.json`);
        if (!res.ok) {
          throw new Error(`Failed to load OpenAPI spec (${res.status})`);
        }
        const data = await res.json();
        // Ensure the server URL points to the correct /mohit/api path
        data.servers = [
          {
            url: 'https://ranvijay.capricorn.online/mohit/api',
            description: 'Production API Server',
          },
        ];
        setSwaggerSpec(data);
      } catch (error) {
        setSpecError(error.message || 'Failed to load OpenAPI spec');
      } finally {
        setSpecLoading(false);
      }
    };
    fetchSpec();
  }, [apiBase]);

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
              {specLoading && <p className="text-muted">Loading Swagger UI...</p>}
              {specError && <div className="alert alert-danger">{specError}</div>}
              {!specLoading && !specError && swaggerSpec && (
                <SwaggerUI
                  spec={swaggerSpec}
                  requestInterceptor={(req) => {
                    // Fix base URL: ensure all requests go through /mohit/api/ not /api/
                    if (req.url) {
                      const url = new URL(req.url, window.location.origin);
                      // If the path starts with /api/ but not /mohit/api/, fix it
                      if (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/mohit/api/')) {
                        url.pathname = '/mohit' + url.pathname;
                        req.url = url.toString();
                      }
                      // Also handle if the full URL has the wrong base
                      const wrongBase = 'https://ranvijay.capricorn.online/api/';
                      const correctBase = 'https://ranvijay.capricorn.online/mohit/api/';
                      if (req.url.startsWith(wrongBase)) {
                        req.url = req.url.replace(wrongBase, correctBase);
                      }
                    }
                    return req;
                  }}
                />
              )}
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
