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
  const [requestsOverview, setRequestsOverview] = useState({
    totalRequests: 0,
    approvedRequests: 0,
    pendingRequests: 0,
  });

  // Derived data for the chart based on fetched requestsOverview
  const organizationStatusData = [
    { name: "total-requests", value: requestsOverview.totalRequests, label: "Total Requests", color: "#00c49f" }, // Green
    { name: "approved-requests", value: requestsOverview.approvedRequests, label: "Approved Requests", color: "#ADD8E6" }, // Light Blue
    { name: "pending-requests", value: requestsOverview.pendingRequests, label: "Pending Requests", color: "#ffbb28" }, // Yellow
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch Total Swaps
        const swapsResponse = await axiosInstance.get('/api/admin/stats/swaps/total'); // Replace with your actual API endpoint

          const swapsData = swapsResponse.data;
          setTotalSwaps(swapsData.totalSwaps); // Assuming the response has a \'totalSwaps\' field


        // Fetch Total Skill Swappers (Users)
        const usersResponse = await axiosInstance.get('/api/admin/stats/users/total'); // Replace with your actual API endpoint

          const usersData = usersResponse.data;
          setTotalUsers(usersData.totalUsers); // Assuming the response has a \'totalUsers\' field

        // Fetch Organization Status Overview
        const requestsResponse = await axiosInstance.get('/api/admin/stats/requests/overview'); // Replace with your actual API endpoint

          const requestsData = requestsResponse.data;
          setRequestsOverview(requestsData); // Assuming the response matches the state shape


      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        // Handle errors, potentially set state to indicate error
        setTotalSwaps(0);
        setTotalUsers(0);
        setRequestsOverview({ totalRequests: 0, approvedRequests: 0, pendingRequests: 0 });
      }
    };

    fetchStats();
  }, []); // Empty dependency array means this effect runs once on mount

  // Placeholder data - replace with actual data fetching logic

  const organizationStatusConfig = {
    "total-requests": { label: "Total Requests", color: "#00c49f" }, // Green
    "approved-requests": { label: "Approved Requests", color: "#ADD8E6" }, // Light Blue
    "pending-requests": { label: "Pending Requests", color: "#ffbb28" }, // Yellow
  };

  const exchangeRequestData = [
    { name: "ongoing", value: 33, label: "Ongoing", color: "#00c49f" }, // Green
    { name: "completed", value: 40, label: "Completed", color: "#ADD8E6" }, // Light Blue
    { name: "pending", value: 27, label: "Pending", color: "#ffbb28" }, // Yellow
  ];

  const exchangeRequestConfig = {
    "ongoing": { label: "Ongoing", color: "#00c49f" }, // Green
    "completed": { label: "Completed", color: "#ADD8E6" }, // Light Blue
    "pending": { label: "Pending", color: "#ffbb28" }, // Yellow
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
              <div className="text-2xl font-bold">1,254</div>
              {/* Keep placeholder data for now */}
              <p className="text-xs text-green-500">
                +8% since last month
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
        </div>
      </div>
    </main>
  );
}
