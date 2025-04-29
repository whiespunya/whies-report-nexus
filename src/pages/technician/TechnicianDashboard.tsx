
import { useState, useEffect } from "react";
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusType } from "@/types";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { ClipboardPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/utils/routes";
import { format } from "date-fns";

const TechnicianDashboard = () => {
  const { currentUser, reports } = useAppContext();
  const navigate = useNavigate();
  
  const [technicianReports, setTechnicianReports] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  
  useEffect(() => {
    if (currentUser) {
      // Filter reports for the current technician
      const filteredReports = reports.filter(
        (report) => report.technicianId === currentUser.id
      );
      
      setTechnicianReports(filteredReports);
      
      // Generate status distribution data
      const statusCounts = filteredReports.reduce(
        (acc, report) => {
          acc[report.status] = (acc[report.status] || 0) + 1;
          return acc;
        },
        {} as Record<StatusType, number>
      );
      
      setStatusData([
        { name: "Pending", value: statusCounts.pending || 0 },
        { name: "Completed", value: statusCounts.completed || 0 },
        { name: "Rejected", value: statusCounts.rejected || 0 },
      ]);
      
      // Get recent reports (sort by date, newest first)
      const sorted = [...filteredReports].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setRecentReports(sorted.slice(0, 5)); // Take the 5 most recent reports
    }
  }, [currentUser, reports]);
  
  // Generate monthly report data
  const monthlyReportData = (() => {
    if (!technicianReports.length) return [];
    
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    
    const months = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date(sixMonthsAgo);
      month.setMonth(month.getMonth() + i);
      months.push({
        month: format(month, "MMM"),
        date: month,
      });
    }
    
    return months.map(({ month, date }) => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
      
      const count = technicianReports.filter(
        (report) => {
          const reportDate = new Date(report.date);
          return reportDate >= startOfMonth && reportDate <= endOfMonth;
        }
      ).length;
      
      return {
        month,
        count,
      };
    });
  })();
  
  const COLORS = ["#3B82F6", "#10B981", "#EF4444"];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Button onClick={() => navigate(ROUTES.TECHNICIAN_SUBMIT_REPORT)}>
          <ClipboardPlus className="mr-2 h-4 w-4" />
          Submit New Report
        </Button>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Total Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{technicianReports.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Pending Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">
              {technicianReports.filter((r) => r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">
              Completed Reports
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">
              {technicianReports.filter((r) => r.status === "completed").length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Report Submission</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyReportData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Reports" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-3 text-left font-medium">Date</th>
                  <th className="py-3 text-left font-medium">Unit ID</th>
                  <th className="py-3 text-left font-medium">Location</th>
                  <th className="py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500">
                      No reports submitted yet
                    </td>
                  </tr>
                ) : (
                  recentReports.map((report) => (
                    <tr key={report.id} className="border-b">
                      <td className="py-3">
                        {format(new Date(report.date), "MMM dd, yyyy")}
                      </td>
                      <td className="py-3">{report.unitId}</td>
                      <td className="py-3">{report.locationName}</td>
                      <td className="py-3">
                        <span
                          className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                            report.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : report.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {recentReports.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.TECHNICIAN_REPORTS)}
              >
                View All Reports
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicianDashboard;
