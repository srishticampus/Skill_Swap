import React, { useState, useEffect } from "react";
import axiosInstance from "../../../api/axios"; // Assuming this path is correct
import * as RechartsPrimitive from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"; // Assuming this is the correct import path based on user's file path

export default function Dashboard() {
  const [totalSwaps, setTotalSwaps] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalExchanges, setTotalExchanges] = useState(0); // New state for total exchanges
  const [requestsOverview, setRequestsOverview] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });
  const [exchangeRequestsOverview, setExchangeRequestsOverview] = useState({
    totalExchanges: 0,
    ongoingExchanges: 0,
    completedExchanges: 0,
    pendingExchanges: 0,
    rejectedExchanges: 0,
  });
  const [complaintsOverview, setComplaintsOverview] = useState({
    totalComplaints: 0,
    openComplaints: 0,
    resolvedComplaints: 0,
    pendingComplaints: 0,
  });
  const [swapTrends, setSwapTrends] = useState([]);

  // Derived data for the chart based on fetched requestsOverview
  const organizationStatusData = [
    { name: "total-requests", value: requestsOverview.totalRequests, label: "Total Requests", color: "#00c49f" }, // Green
    { name: "approved-requests", value: requestsOverview.approvedRequests, label: "Approved Requests", color: "#ADD8E6" }, // Light Blue
    { name: "pending-requests", value: requestsOverview.pendingRequests, label: "Pending Requests", color: "#ffbb28" }, // Yellow
  ];

  // Derived data for the complaints chart
  const complaintStatusData = [
    { name: "total-complaints", value: complaintsOverview.totalComplaints, label: "Total Complaints", color: "#00c49f" },
    { name: "open-complaints", value: complaintsOverview.openComplaints, label: "Open Complaints", color: "#ADD8E6" },
    { name: "resolved-complaints", value: complaintsOverview.resolvedComplaints, label: "Resolved Complaints", color: "#ffbb28" },
    { name: "pending-complaints", value: complaintsOverview.pendingComplaints, label: "Pending Complaints", color: "#FF6347" }, // Tomato
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Total Swaps
        const swapsResponse = await axiosInstance.get('/api/admin/stats/swaps/total');
        const swapsData = swapsResponse.data;
        setTotalSwaps(swapsData.totalSwaps);

        // Fetch Total Skill Swappers (Users)
        const usersResponse = await axiosInstance.get('/api/admin/stats/users/total');
        const usersData = usersResponse.data;
        setTotalUsers(usersData.totalUsers);

        // Fetch Total Exchanges
        const exchangesResponse = await axiosInstance.get('/api/admin/stats/exchanges/total');
        const exchangesData = exchangesResponse.data;
        setTotalExchanges(exchangesData.totalExchanges);

        // Fetch Organization Status Overview
        const requestsResponse = await axiosInstance.get('/api/admin/stats/requests/overview');
        const requestsData = requestsResponse.data;
        setRequestsOverview(requestsData);

        // Fetch Exchange Requests Overview
        const exchangeRequestsResponse = await axiosInstance.get('/api/admin/stats/exchanges/overview');
        const exchangeRequestsData = exchangeRequestsResponse.data;
        setExchangeRequestsOverview(exchangeRequestsData);

        // Fetch Complaints Overview
        const complaintsResponse = await axiosInstance.get('/api/admin/stats/complaints/overview');
        const complaintsData = complaintsResponse.data;
        setComplaintsOverview(complaintsData);

        // Fetch Swap Trends
        const swapTrendsResponse = await axiosInstance.get('/api/admin/stats/swaps/trends');
        const swapTrendsData = swapTrendsResponse.data.map(item => ({
          date: new Date(item.date).toLocaleDateString(), // Format date for display
          count: item.count,
        }));
        setSwapTrends(swapTrendsData);

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        setTotalSwaps(0);
        setTotalUsers(0);
        setTotalExchanges(0); // Reset total exchanges on error
        setRequestsOverview({ totalRequests: 0, approvedRequests: 0, pendingRequests: 0 });
        setExchangeRequestsOverview({ totalExchanges: 0, ongoingExchanges: 0, completedExchanges: 0, pendingExchanges: 0, rejectedExchanges: 0 }); // Reset exchange requests overview on error
        setComplaintsOverview({ totalComplaints: 0, openComplaints: 0, resolvedComplaints: 0, pendingComplaints: 0 });
        setSwapTrends([]);
      }
    };

    fetchStats();
  }, []);

  const organizationStatusConfig = {
    "total-requests": { label: "Total Requests", color: "#00c49f" }, // Green
    "approved-requests": { label: "Approved Requests", color: "#ADD8E6" }, // Light Blue
    "pending-requests": { label: "Pending Requests", color: "#ffbb28" }, // Yellow
  };

  const complaintStatusConfig = {
    "total-complaints": { label: "Total Complaints", color: "#00c49f" },
    "open-complaints": { label: "Open Complaints", color: "#ADD8E6" },
    "resolved-complaints": { label: "Resolved Complaints", color: "#ffbb28" },
    "pending-complaints": { label: "Pending Complaints", color: "#FF6347" },
  };

  const swapTrendsConfig = {
    count: {
      label: "Swap Requests",
      color: "hsl(var(--chart-1))",
    },
  };

  const exchangeRequestData = [
    { name: "ongoing", value: exchangeRequestsOverview.ongoingExchanges, label: "Ongoing", color: "#00c49f" }, // Green
    { name: "completed", value: exchangeRequestsOverview.completedExchanges, label: "Completed", color: "#ADD8E6" }, // Light Blue
    { name: "pending", value: exchangeRequestsOverview.pendingExchanges, label: "Pending", color: "#ffbb28" }, // Yellow
    { name: "rejected", value: exchangeRequestsOverview.rejectedExchanges, label: "Rejected", color: "#FF6347" }, // Tomato
  ];

  const exchangeRequestConfig = {
    "ongoing": { label: "Ongoing", color: "#00c49f" }, // Green
    "completed": { label: "Completed", color: "#ADD8E6" }, // Light Blue
    "pending": { label: "Pending", color: "#ffbb28" }, // Yellow
    "rejected": { label: "Rejected", color: "#FF6347" }, // Tomato
  };

  return (
    <main className="flex-1 px-6 pb-6">
      <div className="bg-white rounded-lg h-full p-6">
        {/* Top Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Card 1: Total Swaps */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Swaps
              </CardTitle>
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                {/* Icon goes here */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalSwaps}</div>
              {/* You might fetch the percentage change from the API too if needed */}
              <p className="text-xs text-gray-500">
                Data from API
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Total Exchanges */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Exchanges
              </CardTitle>
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                {/* Icon goes here */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExchanges}</div>
              <p className="text-xs text-gray-500">
                Data from API
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Total Skill Swapper */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Skill Swapper
              </CardTitle>
              {/* Icon placeholder */}
              <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
                {/* Icon goes here */}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              {/* You might fetch the percentage change from the API too if needed */}
              <p className="text-xs text-gray-500">
                Data from API
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart 1: Organization Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">Organization Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={organizationStatusConfig}
                className="min-h-[200px] w-full" // Adjust size as needed
              >
                <RechartsPrimitive.PieChart>
                  <RechartsPrimitive.Pie
                    data={organizationStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    cx="50%"
                    cy="50%"
                  >
                    {organizationStatusData.map((entry, index) => (
                      <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPrimitive.Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPrimitive.PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 2: Exchange Request Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">Exchange Request Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={exchangeRequestConfig}
                className="min-h-[200px] w-full" // Adjust size as needed
              >
                <RechartsPrimitive.PieChart>
                  <RechartsPrimitive.Pie
                    data={exchangeRequestData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    cx="50%"
                    cy="50%"
                  >
                    {exchangeRequestData.map((entry, index) => (
                      <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPrimitive.Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPrimitive.PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 3: Complaint Status Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">Complaint Status Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={complaintStatusConfig}
                className="min-h-[200px] w-full"
              >
                <RechartsPrimitive.PieChart>
                  <RechartsPrimitive.Pie
                    data={complaintStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    cx="50%"
                    cy="50%"
                  >
                    {complaintStatusData.map((entry, index) => (
                      <RechartsPrimitive.Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </RechartsPrimitive.Pie>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                </RechartsPrimitive.PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Chart 4: Swap Request Trends */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-800">Swap Request Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={swapTrendsConfig}
                className="min-h-[200px] w-full"
              >
                <RechartsPrimitive.LineChart
                  accessibilityLayer
                  data={swapTrends}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <RechartsPrimitive.XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={32}
                  />
                  <RechartsPrimitive.YAxis
                    dataKey="count"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    domain={[0, 'dataMax + 10']}
                  />
                  <RechartsPrimitive.Line
                    dataKey="count"
                    type="monotone"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                    dot={false}
                  />
                </RechartsPrimitive.LineChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
