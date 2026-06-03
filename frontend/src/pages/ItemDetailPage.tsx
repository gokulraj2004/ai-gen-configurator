import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { formatDate } from '../utils/formatDate';

interface Item {
  id: string;
  name: string;
  description: string;
  configuration: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetchItem(id);
  }, [id]);

  const fetchItem = async (itemId: string) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/items/${itemId}`);
      if (!response.ok) {
        if (response.status === 404) {
          setError('Item not found.');
        } else {
          throw new Error('Failed to fetch item');
        }
        return;
      }
      const data: Item = await response.json();
      setItem(data);
    } catch {
      setError('Failed to load item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/items" className="text-primary-600 hover:underline">
          Back to Items
        </Link>
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <Link to="/items" className="text-primary-600 hover:underline text-sm mb-4 inline-block">
        &larr; Back to Items
      </Link>
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
        <p className="text-gray-600 mb-6">{item.description}</p>
        {item.configuration && Object.keys(item.configuration).length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-2">Configuration</h2>
            <pre className="bg-gray-50 p-4 rounded-lg text-sm overflow-auto">
              {JSON.stringify(item.configuration, null, 2)}
            </pre>
          </div>
        )}
        <div className="text-sm text-gray-400 space-y-1">
          <p>Created: {formatDate(item.createdAt)}</p>
          <p>Updated: {formatDate(item.updatedAt)}</p>
        </div>
      </div>
    </div>
  );
}