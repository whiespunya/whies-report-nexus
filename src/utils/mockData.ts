
import { User, Location, Report } from "@/types";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Users with just the test users for login
export const mockUsers: User[] = [
  {
    id: "test-admin-id",
    email: "wh135@whies.com",
    name: "wh135",
    fullName: "Admin User",
    badgeNumber: "A001",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "test-tech-id",
    email: "hendra@whies.com",
    name: "hendra",
    fullName: "Hendra Abdi",
    badgeNumber: "T001",
    role: "technician",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Empty initial locations array
export const mockLocations: Location[] = [];

// Empty initial reports array
export const mockReports: Report[] = [];
