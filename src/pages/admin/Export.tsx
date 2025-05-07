
import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, FileArchive, Filter, Calendar, Search, Check } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format, isAfter, isBefore, isWithinInterval, startOfDay, endOfDay, subDays, subWeeks, subMonths } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Report } from "@/types";

const Export = () => {
  const { reports, locations } = useAppContext();
  const { toast } = useToast();
  
  // Filter states
  const [uniqueUnitIds, setUniqueUnitIds] = useState<string[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [timePeriod, setTimePeriod] = useState<string>("");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Selected reports with checkboxes
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);
  const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  // Export states
  const [exportInProgress, setExportInProgress] = useState<{
    excel: boolean;
    images: boolean;
  }>({
    excel: false,
    images: false,
  });
  
  // Extract unique unit IDs from reports
  useEffect(() => {
    const unitIds = [...new Set(reports.map((report) => report.unitId))];
    unitIds.sort();
    setUniqueUnitIds(unitIds);
  }, [reports]);
  
  // Apply filters to reports
  useEffect(() => {
    let result = [...reports];
    
    // Filter by unit ID
    if (selectedUnitId && selectedUnitId !== "all") {
      result = result.filter(report => report.unitId === selectedUnitId);
    }
    
    // Filter by location
    if (selectedLocation && selectedLocation !== "all") {
      result = result.filter(report => report.locationId === selectedLocation);
    }
    
    // Filter by date range
    if (startDate && endDate) {
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        return isWithinInterval(reportDate, {
          start: startOfDay(startDate),
          end: endOfDay(endDate)
        });
      });
    } else if (startDate) {
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        return isAfter(reportDate, startOfDay(startDate)) || reportDate.getTime() === startOfDay(startDate).getTime();
      });
    } else if (endDate) {
      result = result.filter(report => {
        const reportDate = new Date(report.date);
        return isBefore(reportDate, endOfDay(endDate)) || reportDate.getTime() === endOfDay(endDate).getTime();
      });
    }
    
    // Filter by time period
    if (timePeriod) {
      const today = new Date();
      let periodStartDate;
      
      switch (timePeriod) {
        case "daily":
          periodStartDate = startOfDay(today);
          break;
        case "weekly":
          periodStartDate = startOfDay(subDays(today, 7));
          break;
        case "monthly":
          periodStartDate = startOfDay(subMonths(today, 1));
          break;
        default:
          periodStartDate = null;
      }
      
      if (periodStartDate) {
        result = result.filter(report => {
          const reportDate = new Date(report.date);
          return isAfter(reportDate, periodStartDate!) || reportDate.getTime() === periodStartDate!.getTime();
        });
      }
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(report => 
        report.technicianName?.toLowerCase().includes(query) ||
        report.locationName?.toLowerCase().includes(query) ||
        report.unitId?.toLowerCase().includes(query) ||
        report.deviceId?.toLowerCase().includes(query) ||
        report.cardNumber?.toLowerCase().includes(query) ||
        report.description?.toLowerCase().includes(query) ||
        report.notes?.toLowerCase().includes(query)
      );
    }
    
    setFilteredReports(result);
    
    // Reset selected reports when filters change
    setSelectedReportIds([]);
    setSelectAll(false);
  }, [reports, selectedUnitId, selectedLocation, startDate, endDate, timePeriod, searchQuery]);
  
  // Handle "Select All" checkbox change
  useEffect(() => {
    if (selectAll) {
      setSelectedReportIds(filteredReports.map(report => report.id));
    } else {
      setSelectedReportIds([]);
    }
  }, [selectAll, filteredReports]);
  
  const toggleReportSelection = (reportId: string) => {
    setSelectedReportIds(prev => 
      prev.includes(reportId) 
        ? prev.filter(id => id !== reportId) 
        : [...prev, reportId]
    );
  };
  
  const resetFilters = () => {
    setSelectedUnitId("");
    setSelectedLocation("");
    setStartDate(undefined);
    setEndDate(undefined);
    setTimePeriod("");
    setSearchQuery("");
  };
  
  const handleExportExcel = () => {
    if (selectedReportIds.length === 0) {
      toast({
        title: "No Reports Selected",
        description: "Please select at least one report to export",
        variant: "destructive",
      });
      return;
    }
    
    setExportInProgress(prev => ({ ...prev, excel: true }));
    
    // Simulate export delay
    setTimeout(() => {
      // Generate CSV data
      const headers = [
        "Report ID",
        "Technician",
        "Badge Number",
        "Unit ID",
        "Location",
        "Device ID",
        "Card Number",
        "Status",
        "Date",
        "Description",
        "Notes",
      ];
      
      const selectedReports = reports.filter(report => selectedReportIds.includes(report.id));
      
      const rows = selectedReports.map((report) => [
        report.id,
        report.technicianName,
        report.badgeNumber,
        report.unitId,
        report.locationName,
        report.deviceId,
        report.cardNumber,
        report.status,
        format(new Date(report.date), "yyyy-MM-dd"),
        report.description || "",
        report.notes || "",
      ]);
      
      const csvContent =
        "data:text/csv;charset=utf-8," +
        [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
      
      // Create download link
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `reports_export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setExportInProgress((prev) => ({ ...prev, excel: false }));
      toast({
        title: "Export Successful",
        description: `${selectedReports.length} reports have been exported to Excel format`,
      });
    }, 1500);
  };
  
  const handleExportImages = () => {
    if (selectedReportIds.length === 0) {
      toast({
        title: "No Reports Selected",
        description: "Please select at least one report to export images",
        variant: "destructive",
      });
      return;
    }
    
    setExportInProgress((prev) => ({ ...prev, images: true }));
    
    // Simulate export delay
    setTimeout(() => {
      // In a real application, this would create a ZIP file with images
      // For this demo, we'll simulate a successful export
      
      setExportInProgress((prev) => ({ ...prev, images: false }));
      toast({
        title: "Images Exported",
        description: `Images for ${selectedReportIds.length} reports have been exported as ZIP`,
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Export</h1>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </Button>
      </div>
      
      {/* Filter Section */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle>Filter Reports</CardTitle>
            <CardDescription>
              Apply filters to narrow down your export data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Search Query */}
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    id="search"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Date Range Filter */}
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "yyyy-MM-dd") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {endDate ? format(endDate, "yyyy-MM-dd") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              {/* Time Period */}
              <div className="space-y-2">
                <Label htmlFor="timePeriod">Time Period</Label>
                <Select value={timePeriod} onValueChange={setTimePeriod}>
                  <SelectTrigger id="timePeriod">
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Time</SelectItem>
                    <SelectItem value="daily">Today</SelectItem>
                    <SelectItem value="weekly">Last 7 Days</SelectItem>
                    <SelectItem value="monthly">Last 30 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Unit ID Filter */}
              <div className="space-y-2">
                <Label htmlFor="unitId">Unit ID</Label>
                <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                  <SelectTrigger id="unitId">
                    <SelectValue placeholder="Select Unit ID" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Units</SelectItem>
                    {uniqueUnitIds.map((unitId) => (
                      <SelectItem key={unitId} value={unitId}>
                        {unitId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Location Filter */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Reset Filters Button */}
              <div className="flex items-end">
                <Button variant="secondary" onClick={resetFilters} className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Report Selection Section */}
      <Card>
        <CardHeader>
          <CardTitle>Select Reports</CardTitle>
          <CardDescription>
            Select the reports you want to export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2 pb-4 border-b">
              <Checkbox 
                id="selectAll" 
                checked={selectAll} 
                onCheckedChange={(checked) => setSelectAll(checked as boolean)}
              />
              <Label htmlFor="selectAll" className="font-bold">Select All Reports ({filteredReports.length})</Label>
              
              <div className="ml-auto text-sm text-muted-foreground">
                {selectedReportIds.length} of {filteredReports.length} selected
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {filteredReports.length > 0 ? (
                <div className="space-y-2">
                  {filteredReports.map((report) => (
                    <div key={report.id} className="flex items-center space-x-2 p-2 border rounded hover:bg-accent/10">
                      <Checkbox 
                        id={`report-${report.id}`}
                        checked={selectedReportIds.includes(report.id)}
                        onCheckedChange={() => toggleReportSelection(report.id)}
                      />
                      <div className="flex-1">
                        <Label htmlFor={`report-${report.id}`} className="font-medium cursor-pointer">
                          {report.unitId} - {report.locationName}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(report.date), "yyyy-MM-dd")} | {report.technicianName}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {report.status}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No reports found with the current filters
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Export Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Reports to Excel</CardTitle>
            <CardDescription>
              Export selected reports to Excel format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportExcel}
              className="w-full"
              disabled={selectedReportIds.length === 0 || exportInProgress.excel}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {exportInProgress.excel 
                ? "Exporting..." 
                : `Export ${selectedReportIds.length} Reports to Excel`}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Report Images</CardTitle>
            <CardDescription>
              Export images from selected reports as ZIP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleExportImages}
              className="w-full"
              disabled={selectedReportIds.length === 0 || exportInProgress.images}
            >
              <FileArchive className="mr-2 h-4 w-4" />
              {exportInProgress.images 
                ? "Exporting..." 
                : `Export Images for ${selectedReportIds.length} Reports`}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;
