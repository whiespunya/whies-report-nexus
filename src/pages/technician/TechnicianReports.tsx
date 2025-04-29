
import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Report, StatusType } from "@/types";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Eye, ClipboardPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/routes";

const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusProps = {
    pending: { variant: "outline", className: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200" },
    completed: { variant: "outline", className: "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" },
    rejected: { variant: "outline", className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" },
  } as const;
  
  return <Badge variant="outline" className={statusProps[status].className}>{status}</Badge>;
};

const TechnicianReports = () => {
  const { reports, currentUser, isLoading } = useAppContext();
  const navigate = useNavigate();
  
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusType | "all">("all");
  
  // Filter reports based on technician ID, status filter, and search term
  useEffect(() => {
    if (!currentUser) return;
    
    let filtered = reports.filter((report) => report.technicianId === currentUser.id);
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.unitId.toLowerCase().includes(term) ||
          report.locationName.toLowerCase().includes(term) ||
          report.deviceId.toLowerCase().includes(term) ||
          report.cardNumber.toLowerCase().includes(term)
      );
    }
    
    // Sort reports by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredReports(filtered);
  }, [reports, statusFilter, searchTerm, currentUser]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Reports</h1>
        <Button onClick={() => navigate(ROUTES.TECHNICIAN_SUBMIT_REPORT)}>
          <ClipboardPlus className="mr-2 h-4 w-4" />
          Submit New Report
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search reports..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Tabs defaultValue={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusType | "all")}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Unit ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device ID</TableHead>
              <TableHead>Card Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">No reports found</TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{format(new Date(report.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell>{report.unitId}</TableCell>
                  <TableCell>{report.locationName}</TableCell>
                  <TableCell>{report.deviceId}</TableCell>
                  <TableCell>{report.cardNumber}</TableCell>
                  <TableCell><StatusBadge status={report.status} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => navigate(`${ROUTES.TECHNICIAN_REPORTS}/${report.id}`)}>
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TechnicianReports;
