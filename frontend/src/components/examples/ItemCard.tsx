/**
 * EXAMPLE COMPONENT - Demonstrates card display patterns.
 * DELETE this file and create your own domain components.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import type { Item } from '../../types/examples';
import { formatDate } from '../../utils/formatDate';

interface ItemCardProps {
  item: Item;
}

export const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <Link to={`/items/${item.id}`}>
        <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors">
          {item.title}
        </h3>
      </Link>
      {item.description && (
        <p className="mt-2 text-gray-600 text-sm line-clamp-2">{item.description}</p>
      )}
      {item.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span
              key={tag.id}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      <p className="mt-3 text-xs text-gray-400">{formatDate(item.created_at)}</p>
    </div>
  );
};