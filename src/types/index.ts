
export interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  badgeNumber: string;
  role: 'admin' | 'technician';
  createdAt: string;
  updatedAt: string;
}

export interface Location {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Report {
  id: string;
  technicianId: string;
  technicianName: string;
  badgeNumber: string;
  unitId: string;
  locationId: string;
  locationName: string;
  deviceId: string;
  cardNumber: string;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  description?: string;
  images?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusType = 'pending' | 'completed' | 'rejected';
