import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Pagination } from '../components/ui/Pagination';
import { formatDate } from '../utils/formatDate';

interface Item {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface ItemsResponse {
  items: Item[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

export function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems(currentPage);
  }, [currentPage]);

  const fetchItems = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/v1/items?page=${page - 1}&size=10`);
      if (!response.ok) throw new Error('Failed to fetch items');
      const data: ItemsResponse = await response.json();
      setItems(data.items);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load items. Please try again.');
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
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Items</h1>
      </div>
      {items.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No items found.</p>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-gray-400 text-xs">
                  Created: {formatDate(item.createdAt)}
                </p>
              </Link>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}