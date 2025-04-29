
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Location, Report, StatusType, CreateUserData } from "@/types";
import { mockUsers, mockLocations, mockReports } from "@/utils/mockData";
import { useToast } from "@/components/ui/use-toast";

interface AppContextType {
  // Auth
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  
  // Users
  users: User[];
  addUser: (user: CreateUserData) => Promise<User>;
  updateUser: (id: string, userData: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<boolean>;
  
  // Locations
  locations: Location[];
  addLocation: (location: Omit<Location, "id" | "createdAt" | "updatedAt">) => Promise<Location>;
  updateLocation: (id: string, locationData: Partial<Location>) => Promise<Location>;
  deleteLocation: (id: string) => Promise<boolean>;
  
  // Reports
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "createdAt" | "updatedAt">) => Promise<Report>;
  updateReport: (id: string, reportData: Partial<Report>) => Promise<Report>;
  deleteReport: (id: string) => Promise<boolean>;
  updateReportStatus: (id: string, status: StatusType) => Promise<Report>;
  
  // Filters
  statusFilter: StatusType | "all";
  setStatusFilter: (status: StatusType | "all") => void;
  dateFilter: { start: Date | null; end: Date | null };
  setDateFilter: (filter: { start: Date | null; end: Date | null }) => void;
  
  // Loading state
  isLoading: boolean;
}

// Define a type for mock users that includes password
interface MockUser extends User {
  password?: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<StatusType | "all">("all");
  const [dateFilter, setDateFilter] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  });

  // Initialize data from mock data
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      // Add the requested test users to the mock data
      const testUsers: MockUser[] = [
        ...mockUsers,
        {
          id: "test-admin-id",
          email: "wh135@whies.com",
          name: "wh135",
          fullName: "Admin User",
          badgeNumber: "A001",
          role: "admin" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          password: "sembarangsaja" // This is just for the mock data, in real app this would be hashed
        },
        {
          id: "test-tech-id",
          email: "hendra@whies.com",
          name: "hendra",
          fullName: "Hendra Abdi",
          badgeNumber: "T001",
          role: "technician" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          password: "whies2025" // This is just for the mock data, in real app this would be hashed
        }
      ];
      
      // Filter out password field for User objects
      const usersWithoutPasswords = testUsers.map(({ password, ...user }) => user);
      
      setUsers(usersWithoutPasswords);
      setLocations(mockLocations);
      setReports(mockReports);
      setIsLoading(false);
      
      // Check for stored user session
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          setCurrentUser(user);
        } catch (error) {
          console.error("Failed to parse stored user:", error);
          localStorage.removeItem("currentUser");
        }
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Authentication methods
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // For demo, check both email and password
      const mockUserWithPassword = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && 'password' in u && u.password === password);
      
      // Check the test users we added
      if (email === "wh135@whies.com" && password === "sembarangsaja") {
        const adminUser: User = {
          id: "test-admin-id",
          email: "wh135@whies.com",
          name: "wh135",
          fullName: "Admin User",
          badgeNumber: "A001",
          role: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCurrentUser(adminUser);
        localStorage.setItem("currentUser", JSON.stringify(adminUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${adminUser.fullName}`,
        });
        setIsLoading(false);
        return true;
      }
      
      if (email === "hendra@whies.com" && password === "whies2025") {
        const techUser: User = {
          id: "test-tech-id",
          email: "hendra@whies.com",
          name: "hendra",
          fullName: "Hendra Abdi",
          badgeNumber: "T001",
          role: "technician",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        setCurrentUser(techUser);
        localStorage.setItem("currentUser", JSON.stringify(techUser));
        toast({
          title: "Login successful",
          description: `Welcome back, ${techUser.fullName}`,
        });
        setIsLoading(false);
        return true;
      }
      
      if (mockUserWithPassword) {
        const { password: _, ...userWithoutPassword } = mockUserWithPassword;
        setCurrentUser(userWithoutPassword);
        localStorage.setItem("currentUser", JSON.stringify(userWithoutPassword));
        toast({
          title: "Login successful",
          description: `Welcome back, ${userWithoutPassword.fullName}`,
        });
        setIsLoading(false);
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // User management methods
  const addUser = async (userData: CreateUserData): Promise<User> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { password, ...userWithoutPassword } = userData;
      
      const newUser: User = {
        ...userWithoutPassword,
        id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setUsers(prev => [...prev, newUser]);
      toast({
        title: "User added",
        description: `${newUser.fullName} has been added successfully`,
      });
      setIsLoading(false);
      return newUser;
    } catch (error) {
      console.error("Add user error:", error);
      toast({
        title: "Error adding user",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const updateUser = async (id: string, userData: Partial<User>): Promise<User> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedUsers = users.map(user => {
        if (user.id === id) {
          const updatedUser = {
            ...user,
            ...userData,
            updatedAt: new Date().toISOString(),
          };
          return updatedUser;
        }
        return user;
      });
      
      setUsers(updatedUsers);
      
      // If updating current user, update that too
      if (currentUser && currentUser.id === id) {
        const updatedCurrentUser = {
          ...currentUser,
          ...userData,
          updatedAt: new Date().toISOString(),
        };
        setCurrentUser(updatedCurrentUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
      }
      
      const updatedUser = updatedUsers.find(u => u.id === id);
      
      if (!updatedUser) {
        throw new Error("User not found after update");
      }
      
      toast({
        title: "User updated",
        description: `${updatedUser.fullName}'s information has been updated`,
      });
      
      setIsLoading(false);
      return updatedUser;
    } catch (error) {
      console.error("Update user error:", error);
      toast({
        title: "Error updating user",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const deleteUser = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if trying to delete current user
      if (currentUser && currentUser.id === id) {
        toast({
          title: "Cannot delete",
          description: "You cannot delete your own account while logged in",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      const userToDelete = users.find(u => u.id === id);
      if (!userToDelete) {
        throw new Error("User not found");
      }
      
      setUsers(users.filter(user => user.id !== id));
      
      toast({
        title: "User deleted",
        description: `${userToDelete.fullName} has been removed`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Delete user error:", error);
      toast({
        title: "Error deleting user",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Location management methods
  const addLocation = async (locationData: Omit<Location, "id" | "createdAt" | "updatedAt">): Promise<Location> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newLocation: Location = {
        ...locationData,
        id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setLocations(prev => [...prev, newLocation]);
      toast({
        title: "Location added",
        description: `${newLocation.name} has been added successfully`,
      });
      setIsLoading(false);
      return newLocation;
    } catch (error) {
      console.error("Add location error:", error);
      toast({
        title: "Error adding location",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const updateLocation = async (id: string, locationData: Partial<Location>): Promise<Location> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedLocations = locations.map(location => {
        if (location.id === id) {
          return {
            ...location,
            ...locationData,
            updatedAt: new Date().toISOString(),
          };
        }
        return location;
      });
      
      setLocations(updatedLocations);
      
      const updatedLocation = updatedLocations.find(l => l.id === id);
      
      if (!updatedLocation) {
        throw new Error("Location not found after update");
      }
      
      toast({
        title: "Location updated",
        description: `${updatedLocation.name} has been updated`,
      });
      
      setIsLoading(false);
      return updatedLocation;
    } catch (error) {
      console.error("Update location error:", error);
      toast({
        title: "Error updating location",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const deleteLocation = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const locationToDelete = locations.find(l => l.id === id);
      if (!locationToDelete) {
        throw new Error("Location not found");
      }
      
      // Check if any reports use this location
      const reportsUsingLocation = reports.some(report => report.locationId === id);
      if (reportsUsingLocation) {
        toast({
          title: "Cannot delete location",
          description: "This location is used in existing reports",
          variant: "destructive",
        });
        setIsLoading(false);
        return false;
      }
      
      setLocations(locations.filter(location => location.id !== id));
      
      toast({
        title: "Location deleted",
        description: `${locationToDelete.name} has been removed`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Delete location error:", error);
      toast({
        title: "Error deleting location",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Report management methods
  const addReport = async (reportData: Omit<Report, "id" | "createdAt" | "updatedAt">): Promise<Report> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newReport: Report = {
        ...reportData,
        id: Math.random().toString(36).substring(2, 15),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setReports(prev => [...prev, newReport]);
      toast({
        title: "Report added",
        description: `New report has been submitted successfully`,
      });
      setIsLoading(false);
      return newReport;
    } catch (error) {
      console.error("Add report error:", error);
      toast({
        title: "Error adding report",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const updateReport = async (id: string, reportData: Partial<Report>): Promise<Report> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReports = reports.map(report => {
        if (report.id === id) {
          return {
            ...report,
            ...reportData,
            updatedAt: new Date().toISOString(),
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      
      const updatedReport = updatedReports.find(r => r.id === id);
      
      if (!updatedReport) {
        throw new Error("Report not found after update");
      }
      
      toast({
        title: "Report updated",
        description: `Report #${updatedReport.id.substring(0, 8)} has been updated`,
      });
      
      setIsLoading(false);
      return updatedReport;
    } catch (error) {
      console.error("Update report error:", error);
      toast({
        title: "Error updating report",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const deleteReport = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const reportToDelete = reports.find(r => r.id === id);
      if (!reportToDelete) {
        throw new Error("Report not found");
      }
      
      setReports(reports.filter(report => report.id !== id));
      
      toast({
        title: "Report deleted",
        description: `Report #${reportToDelete.id.substring(0, 8)} has been removed`,
      });
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Delete report error:", error);
      toast({
        title: "Error deleting report",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
  };

  const updateReportStatus = async (id: string, status: StatusType): Promise<Report> => {
    setIsLoading(true);
    try {
      // Simulate API request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedReports = reports.map(report => {
        if (report.id === id) {
          return {
            ...report,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return report;
      });
      
      setReports(updatedReports);
      
      const updatedReport = updatedReports.find(r => r.id === id);
      
      if (!updatedReport) {
        throw new Error("Report not found after status update");
      }
      
      const statusMessages = {
        pending: "marked as pending",
        completed: "marked as completed",
        rejected: "rejected",
      };
      
      toast({
        title: "Status updated",
        description: `Report has been ${statusMessages[status]}`,
      });
      
      setIsLoading(false);
      return updatedReport;
    } catch (error) {
      console.error("Update report status error:", error);
      toast({
        title: "Error updating status",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setIsLoading(false);
      throw error;
    }
  };

  const value = {
    // Auth
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
    
    // Users
    users,
    addUser,
    updateUser,
    deleteUser,
    
    // Locations
    locations,
    addLocation,
    updateLocation,
    deleteLocation,
    
    // Reports
    reports,
    addReport,
    updateReport,
    deleteReport,
    updateReportStatus,
    
    // Filters
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter,
    
    // Loading state
    isLoading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
