export interface Area {
  id: string;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateAreaDTO {
  name: string;
  description: string;
}

export interface UpdateAreaDTO {
  name?: string;
  description?: string;
}
