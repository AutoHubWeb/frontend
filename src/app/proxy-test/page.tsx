'use client'

import { useEffect, useState } from 'react';
import { proxyService } from '@/lib/api/services/proxy.service';
import type { ProxyItem } from '@/lib/api/services/proxy.service';

export default function ProxyTestPage() {
  const [proxies, setProxies] = useState<ProxyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProxies = async () => {
      try {
        setLoading(true);
        const response = await proxyService.getProxies();
        setProxies(response.data?.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch proxies');
      } finally {
        setLoading(false);
      }
    };

    fetchProxies();
  }, []);

  if (loading) {
    return <div className="p-8">Loading proxies...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Proxy Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {proxies.map((proxy) => (
          <div key={proxy.id} className="border p-4 rounded">
            <h2 className="font-semibold">{proxy.name}</h2>
            <p>Price: {proxy.price.toLocaleString('vi-VN')}₫</p>
            <p>Status: {proxy.status === 1 ? 'Active' : 'Inactive'}</p>
            <p>Inventory: {proxy.inventory}</p>
            <p>{proxy.description}</p>
          </div>
        ))}
      </div>
      {proxies.length === 0 && (
        <p>No proxies found</p>
      )}
    </div>
  );
}
