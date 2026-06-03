/**
 * EXAMPLE COMPONENT - Demonstrates list with pagination patterns.
 * DELETE this file and create your own domain components.
 */
import React from 'react';
import type { Item } from '../../types/examples';
import { ItemCard } from './ItemCard';
import { Spinner } from '../ui/Spinner';
import { Pagination } from '../ui/Pagination';

interface ItemListProps {
  items: Item[];
  loading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ItemList: React.FC<ItemListProps> = ({ items, loading, page, totalPages, onPageChange }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No items found.</p>
        <p className="text-gray-400 text-sm mt-1">Create your first item to get started.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
};