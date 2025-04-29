
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusType } from "@/types";
import { ArrowLeft, FileDown } from "lucide-react";
import { format } from "date-fns";
import { ROUTES } from "@/utils/routes";

const StatusBadge = ({ status }: { status: StatusType }) => {
  const statusProps = {
    pending: { variant: "outline", className: "bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200" },
    completed: { variant: "outline", className: "bg-green-50 text-green-700 hover:bg-green-50 border-green-200" },
    rejected: { variant: "outline", className: "bg-red-50 text-red-700 hover:bg-red-50 border-red-200" }
  } as const;
  
  return <Badge variant="outline" className={statusProps[status].className}>{status}</Badge>;
};

const TechnicianReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { reports, currentUser, isLoading } = useAppContext();
  const navigate = useNavigate();
  
  const [report, setReport] = useState<any>(null);
  const [isOwnReport, setIsOwnReport] = useState(false);

  useEffect(() => {
    const foundReport = reports.find(r => r.id === id);
    setReport(foundReport);
    
    if (foundReport && currentUser) {
      setIsOwnReport(foundReport.technicianId === currentUser.id);
    }
  }, [id, reports, currentUser]);

  const handleBack = () => {
    navigate(ROUTES.TECHNICIAN_REPORTS);
  };

  const handleDownload = () => {
    // Mock download functionality
    const element = document.createElement("a");
    const file = new Blob(
      [
        `Report ID: ${report.id}\nTechnician: ${report.technicianName}\nBadge Number: ${report.badgeNumber}\nUnit ID: ${report.unitId}\nLocation: ${report.locationName}\nDevice ID: ${report.deviceId}\nCard Number: ${report.cardNumber}\nStatus: ${report.status}\nDate: ${format(new Date(report.date), "PPP")}\nDescription: ${report.description || "N/A"}\nNotes: ${report.notes || "N/A"}`,
      ],
      { type: "text/plain" }
    );
    element.href = URL.createObjectURL(file);
    element.download = `Report_${report.id}.txt`;
    document.body.appendChild(element);
    element.click();
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-96">Loading...</div>;
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Report Not Found</h2>
        <p className="text-gray-600 mb-4">The report you are looking for does not exist or has been deleted.</p>
        <Button onClick={handleBack}>Back to Reports</Button>
      </div>
    );
  }

  if (!isOwnReport) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-4">You do not have permission to view this report.</p>
        <Button onClick={handleBack}>Back to Reports</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Report Details</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleDownload}>
            <FileDown className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Report Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Report ID</h3>
                <p className="font-medium">{report.id.substring(0, 8).toUpperCase()}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <StatusBadge status={report.status} />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                <p>{format(new Date(report.date), "PPP")}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <p>{report.locationName}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Unit ID</h3>
                <p>{report.unitId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Device ID</h3>
                <p>{report.deviceId}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Card Number</h3>
                <p>{report.cardNumber}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{report.description || "No description provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
              <p className="text-gray-700">{report.notes || "No notes provided"}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Images</h3>
              {report.images && report.images.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {report.images.map((image: string, index: number) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={image}
                        alt={`Report image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No images attached</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Technician Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
              <p className="font-medium">{report.technicianName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Badge Number</h3>
              <p>{report.badgeNumber}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicianReportDetail;
