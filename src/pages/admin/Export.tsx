
import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown, FileArchive } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const Export = () => {
  const { reports, locations } = useAppContext();
  const { toast } = useToast();
  
  const [uniqueUnitIds, setUniqueUnitIds] = useState<string[]>([]);
  const [selectedUnitId, setSelectedUnitId] = useState<string>("");
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
  
  const handleExportExcel = () => {
    setExportInProgress((prev) => ({ ...prev, excel: true }));
    
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
      
      let filteredReports = reports;
      if (selectedUnitId) {
        filteredReports = reports.filter(report => report.unitId === selectedUnitId);
      }
      
      const rows = filteredReports.map((report) => [
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
        description: "Reports have been exported to Excel format",
      });
    }, 1500);
  };
  
  const handleExportImages = () => {
    if (!selectedUnitId) {
      toast({
        title: "Unit ID Required",
        description: "Please select a Unit ID to export images",
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
        description: `Images for Unit ID ${selectedUnitId} have been exported`,
      });
    }, 2000);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Export</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Export Reports to Excel</CardTitle>
            <CardDescription>
              Export all reports or filter by Unit ID
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unitId">Filter by Unit ID (Optional)</Label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId}>
                <SelectTrigger id="unitId">
                  <SelectValue placeholder="Select Unit ID" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Units</SelectItem>
                  {uniqueUnitIds.map((unitId) => (
                    <SelectItem key={unitId} value={unitId}>
                      {unitId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleExportExcel}
              className="w-full"
              disabled={exportInProgress.excel}
            >
              <FileDown className="mr-2 h-4 w-4" />
              {exportInProgress.excel ? "Exporting..." : "Export to Excel"}
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Export Images</CardTitle>
            <CardDescription>
              Export all images for a specific Unit ID as a ZIP file
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unitIdImages">Select Unit ID</Label>
              <Select value={selectedUnitId} onValueChange={setSelectedUnitId} required>
                <SelectTrigger id="unitIdImages">
                  <SelectValue placeholder="Select Unit ID" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueUnitIds.map((unitId) => (
                    <SelectItem key={unitId} value={unitId}>
                      {unitId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button
              onClick={handleExportImages}
              className="w-full"
              disabled={!selectedUnitId || exportInProgress.images}
            >
              <FileArchive className="mr-2 h-4 w-4" />
              {exportInProgress.images ? "Exporting..." : "Export Images as ZIP"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Export;
