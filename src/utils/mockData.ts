
import { User, Location, Report } from "@/types";

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock Users
export const mockUsers: User[] = [
  {
    id: generateId(),
    email: "admin@whiesindustri.com",
    name: "admin",
    fullName: "Admin User",
    badgeNumber: "A001",
    role: "admin",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "tech1@whiesindustri.com",
    name: "tech1",
    fullName: "Technician One",
    badgeNumber: "T001",
    role: "technician",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    email: "tech2@whiesindustri.com",
    name: "tech2",
    fullName: "Technician Two",
    badgeNumber: "T002",
    role: "technician",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Mock Locations
export const mockLocations: Location[] = [
  {
    id: generateId(),
    name: "Jakarta HQ",
    description: "Main headquarters in Jakarta",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Bandung Office",
    description: "Branch office in Bandung",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    name: "Surabaya Plant",
    description: "Production plant in Surabaya",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

// Generate mock reports
export const mockReports: Report[] = [
  {
    id: generateId(),
    technicianId: mockUsers[1].id,
    technicianName: mockUsers[1].fullName,
    badgeNumber: mockUsers[1].badgeNumber,
    unitId: "UNIT-001",
    locationId: mockLocations[0].id,
    locationName: mockLocations[0].name,
    deviceId: "DEV-001",
    cardNumber: "CARD-001",
    status: "pending",
    date: new Date().toISOString(),
    description: "Regular maintenance check completed",
    images: ["/placeholder.svg", "/placeholder.svg"],
    notes: "No issues found during inspection",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    technicianId: mockUsers[2].id,
    technicianName: mockUsers[2].fullName,
    badgeNumber: mockUsers[2].badgeNumber,
    unitId: "UNIT-002",
    locationId: mockLocations[1].id,
    locationName: mockLocations[1].name,
    deviceId: "DEV-002",
    cardNumber: "CARD-002",
    status: "completed",
    date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    description: "Replaced faulty component",
    images: ["/placeholder.svg", "/placeholder.svg"],
    notes: "Component was showing signs of wear",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    technicianId: mockUsers[1].id,
    technicianName: mockUsers[1].fullName,
    badgeNumber: mockUsers[1].badgeNumber,
    unitId: "UNIT-003",
    locationId: mockLocations[2].id,
    locationName: mockLocations[2].name,
    deviceId: "DEV-003",
    cardNumber: "CARD-003",
    status: "rejected",
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    description: "Emergency repair",
    images: ["/placeholder.svg"],
    notes: "Insufficient details provided",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
  }
];

// Add more mock reports for better data visualization
for (let i = 0; i < 15; i++) {
  const techIndex = Math.floor(Math.random() * 2) + 1; // Either tech1 or tech2
  const locIndex = Math.floor(Math.random() * 3); // Any of the 3 locations
  const statuses = ["pending", "completed", "rejected"] as const;
  const statusIndex = Math.floor(Math.random() * 3); // Any status
  
  const daysAgo = Math.floor(Math.random() * 30); // Random day in the last month
  const date = new Date(Date.now() - daysAgo * 86400000);
  
  mockReports.push({
    id: generateId(),
    technicianId: mockUsers[techIndex].id,
    technicianName: mockUsers[techIndex].fullName,
    badgeNumber: mockUsers[techIndex].badgeNumber,
    unitId: `UNIT-${i + 10}`,
    locationId: mockLocations[locIndex].id,
    locationName: mockLocations[locIndex].name,
    deviceId: `DEV-${i + 10}`,
    cardNumber: `CARD-${i + 10}`,
    status: statuses[statusIndex],
    date: date.toISOString(),
    description: `Routine check ${i + 1}`,
    images: ["/placeholder.svg"],
    notes: `Notes for report ${i + 1}`,
    createdAt: date.toISOString(),
    updatedAt: date.toISOString(),
  });
}
