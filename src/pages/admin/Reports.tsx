
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
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  Edit, 
  Trash, 
  Search, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/routes";

const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusProps = {
    pending: { variant: "outline", className: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200" },
    completed: { variant: "outline", className: "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" },
    rejected: { variant: "outline", className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" }
  } as const;
  
  return <Badge variant="outline" className={statusProps[status].className}>{status}</Badge>;
};

const Reports = () => {
  const { 
    reports, 
    deleteReport, 
    updateReportStatus, 
    statusFilter, 
    setStatusFilter, 
    isLoading 
  } = useAppContext();
  
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [statusToUpdate, setStatusToUpdate] = useState<StatusType | null>(null);
  const navigate = useNavigate();
  
  // Filter reports based on status filter and search term
  useEffect(() => {
    let filtered = [...reports];
    
    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(report => report.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(report => 
        report.technicianName.toLowerCase().includes(term) ||
        report.badgeNumber.toLowerCase().includes(term) ||
        report.unitId.toLowerCase().includes(term) ||
        report.locationName.toLowerCase().includes(term) ||
        report.deviceId.toLowerCase().includes(term) ||
        report.cardNumber.toLowerCase().includes(term)
      );
    }
    
    // Sort reports by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    setFilteredReports(filtered);
  }, [reports, statusFilter, searchTerm]);
  
  const handleViewReport = (report: Report) => {
    navigate(`${ROUTES.REPORTS}/${report.id}`);
  };
  
  const handleDeleteClick = (report: Report) => {
    setSelectedReport(report);
    setIsDeleteDialogOpen(true);
  };
  
  const handleStatusClick = (report: Report, status: StatusType) => {
    setSelectedReport(report);
    setStatusToUpdate(status);
    setIsStatusDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (selectedReport) {
      await deleteReport(selectedReport.id);
      setIsDeleteDialogOpen(false);
      setSelectedReport(null);
    }
  };
  
  const confirmStatusUpdate = async () => {
    if (selectedReport && statusToUpdate) {
      await updateReportStatus(selectedReport.id, statusToUpdate);
      setIsStatusDialogOpen(false);
      setSelectedReport(null);
      setStatusToUpdate(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search reports..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
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
              <TableHead>Technician</TableHead>
              <TableHead>Badge Number</TableHead>
              <TableHead>Unit ID</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device ID</TableHead>
              <TableHead>Card Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">Loading...</TableCell>
              </TableRow>
            ) : filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">No reports found</TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.technicianName}</TableCell>
                  <TableCell>{report.badgeNumber}</TableCell>
                  <TableCell>{report.unitId}</TableCell>
                  <TableCell>{report.locationName}</TableCell>
                  <TableCell>{report.deviceId}</TableCell>
                  <TableCell>{report.cardNumber}</TableCell>
                  <TableCell><StatusBadge status={report.status} /></TableCell>
                  <TableCell>{format(new Date(report.date), "MMM dd, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewReport(report)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </DropdownMenuItem>
                        {report.status !== "completed" && (
                          <DropdownMenuItem onClick={() => handleStatusClick(report, "completed")}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Mark as Completed
                          </DropdownMenuItem>
                        )}
                        {report.status !== "rejected" && (
                          <DropdownMenuItem onClick={() => handleStatusClick(report, "rejected")}>
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                        {report.status !== "pending" && (
                          <DropdownMenuItem onClick={() => handleStatusClick(report, "pending")}>
                            <Eye className="mr-2 h-4 w-4" />
                            Mark as Pending
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600" 
                          onClick={() => handleDeleteClick(report)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
            <DialogDescription>
              {statusToUpdate === "completed" && "Mark this report as completed?"}
              {statusToUpdate === "rejected" && "Reject this report?"}
              {statusToUpdate === "pending" && "Mark this report as pending?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStatusDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant={statusToUpdate === "rejected" ? "destructive" : "default"}
              onClick={confirmStatusUpdate}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;
