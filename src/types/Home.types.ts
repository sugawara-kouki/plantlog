export interface Plant {
  id: string;
  name: string;
  type: string;
  registeredDate: string;
  lastRecord: string;
  status: 'watering_due' | 'healthy' | 'attention_needed';
  statusText: string;
}

export interface Activity {
  id: string;
  type: 'watering' | 'observation';
  plantName: string;
  timeAgo: string;
}

export interface Statistics {
  totalPlants: number;
  monthlyRecords: number;
  wateringDue: number;
}

export interface User {
  name: string;
  initial: string;
}

export interface HomeProps {
  user?: User;
  todaysTasks?: Plant[];
  myPlants?: Plant[];
  statistics?: Statistics;
  recentActivity?: Activity[];
  onRegisterPlant?: () => void;
  onAddRecord?: () => void;
  onManageWatering?: () => void;
  onCompleteTask?: (plantId: string) => void;
  onEditPlant?: (plantId: string) => void;
  onWaterPlant?: (plantId: string) => void;
}
