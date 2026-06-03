/**
 * EXAMPLE TYPES - Demonstrates TypeScript interface patterns.
 * DELETE this file and create your own domain types.
 */

export interface Item {
  id: string;
  title: string;
  description: string | null;
  user_id: string;
  tags: Tag[];
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface CreateItemRequest {
  title: string;
  description?: string;
  tag_ids?: string[];
}

export interface UpdateItemRequest {
  title?: string;
  description?: string;
  tag_ids?: string[];
}

export interface CreateTagRequest {
  name: string;
}