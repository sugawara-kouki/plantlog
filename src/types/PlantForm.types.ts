export interface PlantFormData {
  name: string;
  plant_type_id: number;
  purchase_date: string;
  initial_height_cm?: number;
  watering_frequency_days: number;
  next_watering_date?: string;
  notes?: string;
  photo?: File | null;
}
