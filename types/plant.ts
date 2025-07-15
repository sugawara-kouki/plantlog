export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  lastWatered: Date;
  nextWatering: Date;
  status: 'healthy' | 'needs_attention' | 'critical';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WateringLog {
  id: string;
  plantId: string;
  wateredAt: Date;
  amount?: number; // in milliliters
  notes?: string;
  createdAt: Date;
}

export interface JournalEntry {
  id: string;
  plantId: string;
  title: string;
  content: string;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type PlantStatus = Plant['status'];