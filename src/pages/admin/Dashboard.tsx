
import { useAppContext } from "@/contexts/AppContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusType } from "@/types";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const { reports, users } = useAppContext();
  const [statusData, setStatusData] = useState<{ name: string; value: number }[]>([]);
  const [technicianData, setTechnicianData] = useState<{ name: string; reports: number }[]>([]);
  const [unitData, setUnitData] = useState<{ name: string; count: number }[]>([]);
  
  useEffect(() => {
    // Status chart data
    const statusCounts = reports.reduce((acc, report) => {
      acc[report.status] = (acc[report.status] || 0) + 1;
      return acc;
    }, {} as Record<StatusType, number>);
    
    const statusChartData = [
      { name: "Pending", value: statusCounts.pending || 0 },
      { name: "Completed", value: statusCounts.completed || 0 },
      { name: "Rejected", value: statusCounts.rejected || 0 },
    ];
    
    setStatusData(statusChartData);
    
    // Technician report counts
    const technicianCounts: Record<string, number> = {};
    const technicianNames: Record<string, string> = {};
    
    reports.forEach(report => {
      technicianCounts[report.technicianId] = (technicianCounts[report.technicianId] || 0) + 1;
      technicianNames[report.technicianId] = report.technicianName;
    });
    
    const technicianChartData = Object.keys(technicianCounts).map(techId => ({
      name: technicianNames[techId],
      reports: technicianCounts[techId]
    }));
    
    // Sort by report count (descending)
    technicianChartData.sort((a, b) => b.reports - a.reports);
    
    setTechnicianData(technicianChartData);
    
    // Unit counts
    const unitCounts: Record<string, number> = {};
    
    reports.forEach(report => {
      unitCounts[report.unitId] = (unitCounts[report.unitId] || 0) + 1;
    });
    
    const unitChartData = Object.keys(unitCounts).map(unitId => ({
      name: unitId,
      count: unitCounts[unitId]
    }));
    
    // Sort by count (descending)
    unitChartData.sort((a, b) => b.count - a.count);
    
    // Limit to top 5
    setUnitData(unitChartData.slice(0, 5));
  }, [reports]);
  
  const COLORS = ["#3B82F6", "#10B981", "#EF4444"];
  const techColors = ["#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE"];
  
  const totalReports = reports.length;
  const totalTechnicians = users.filter(u => u.role === "technician").length;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Total Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalReports}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Total Technicians</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">{totalTechnicians}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-500">Pending Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-gray-800">
              {reports.filter(r => r.status === "pending").length}
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Report Status Distribution */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
            <CardDescription>Overview of report statuses</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
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
        
        {/* Top Technicians */}
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Reports by Technician</CardTitle>
            <CardDescription>Top technicians by report count</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={technicianData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} />
                <Tooltip />
                <Legend />
                <Bar dataKey="reports" fill="#3B82F6" name="Reports Submitted" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* Top Units */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Top 5 Units by Report Count</CardTitle>
            <CardDescription>Most frequently serviced units</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={unitData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3B82F6" name="Report Count" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
