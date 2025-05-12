import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';

const data = [
  { name: 'Total', value: 100, color: '#6b48ff' },
  { name: 'Ongoing', value: 54.1, color: '#00c49f' },
  { name: 'Completed', value: 8.3, color: '#ffbb28' },
  { name: 'Pending', value: 8.3, color: '#ff8042' },
];

const COLORS = ['#6b48ff', '#00c49f', '#ffbb28', '#ff8042'];

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Members
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">100</div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Total Complaints
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Pending Swaps
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
          </CardContent>
        </Card>

        <Card className="bg-primary text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">
              Completed Swaps
            </CardTitle>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">30</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Task Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={{
              Total: { color: '#6b48ff' },
              Ongoing: { color: '#00c49f' },
              Completed: { color: '#ffbb28' },
              Pending: { color: '#ff8042' },
            }} className="min-h-[300px] w-full">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  strokeWidth={5}
                  paddingAngle={5}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                <ChartLegend content={<ChartLegendContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-bold text-primary mt-4">Best Performers</h2>
      <Separator className="my-4" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <img src="/client/src/assets/pfp.jpeg" alt="Akshay" className="w-24 h-24 rounded-full mb-4" />
            <h3 className="text-lg font-semibold">Akshay</h3>
            <p className="text-sm text-gray-500">Python, Java</p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              123 city, trivandrum
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.259c0 1.094-.787 2.036-1.872 2.036l-1.08-.18a9.776 9.776 0 01-7.071 0l-1.08.18c-1.085 0-1.872-.942-1.872-2.036V14.15M2.25 10.5h19.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H2.25A2.25 2.25 0 000 6.75v1.5a2.25 2.25 0 002.25 2.25zm0 0h19.5" />
              </svg>
              3+ years Experience
            </div>
            <div className="flex mt-2">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <img src="/client/src/assets/profile-pic.png" alt="Abhila" className="w-24 h-24 rounded-full mb-4" />
            <h3 className="text-lg font-semibold">Abhila</h3>
            <p className="text-sm text-gray-500">Python, Java</p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              123 city, trivandrum
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.259c0 1.094-.787 2.036-1.872 2.036l-1.08-.18a9.776 9.776 0 01-7.071 0l-1.08.18c-1.085 0-1.872-.942-1.872-2.036V14.15M2.25 10.5h19.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H2.25A2.25 2.25 0 000 6.75v1.5a2.25 2.25 0 002.25 2.25zm0 0h19.5" />
              </svg>
              3+ years Experience
            </div>
            <div className="flex mt-2">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col items-center p-6">
            <img src="/client/src/assets/pfp.jpeg" alt="Nipeesh" className="w-24 h-24 rounded-full mb-4" />
            <h3 className="text-lg font-semibold">Nipeesh</h3>
            <p className="text-sm text-gray-500">Python, Java</p>
            <div className="flex items-center text-gray-500 text-sm mt-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              123 city, trivandrum
            </div>
            <div className="flex items-center text-gray-500 text-sm mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.259c0 1.094-.787 2.036-1.872 2.036l-1.08-.18a9.776 9.776 0 01-7.071 0l-1.08.18c-1.085 0-1.872-.942-1.872-2.036V14.15M2.25 10.5h19.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H2.25A2.25 2.25 0 000 6.75v1.5a2.25 2.25 0 002.25 2.25zm0 0h19.5" />
              </svg>
              3+ years Experience
            </div>
            <div className="flex mt-2">
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
              <svg className="w-5 h-5 text-gray-300 fill-current" viewBox="0 0 24 24"> </svg>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
