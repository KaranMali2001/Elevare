"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip";
import { Clock, Info, Mail, Users } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Mock data (combine and extend the data from both files)

export function EmailAnalyticsDashboard({
  threadAnalysis,
  totalGeneratedEmails,
  totalSummerizedEmails,
  totalSentEmails,
  categoryData,
  emailVolumeDataByDay,
  topContactsData,
  sentimentAnalysis,
  emailVolumeByHour,
  emailActivityHeatmap,
}: any) {
  const mockData = {
    totalSummarized: totalSummerizedEmails,
    totalGenerated: totalGeneratedEmails,
    totalSent: totalSentEmails,
    threadAnalysis: threadAnalysis,
    emailCategoryData: categoryData,
    emailVolumeData: emailVolumeDataByDay,
    responseTimeData: [
      { category: "< 1 hour", percentage: 30 },
      { category: "1-3 hours", percentage: 40 },
      { category: "3-6 hours", percentage: 20 },
      { category: "6-12 hours", percentage: 7 },
      { category: "> 12 hours", percentage: 3 },
    ],
    topContactsData: topContactsData,
    emailActivityHeatmap: emailActivityHeatmap,

    emailVolumeByHour: emailVolumeByHour,

    sentimentAnalysis: sentimentAnalysis,
  };

  const [dateRange, setDateRange] = useState("7");

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-50 min-h-screen overflow-scroll">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-wider">
          Email Analytics Dashboard
        </h1>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Summarized Emails"
          value={mockData.totalSummarized}
          icon={<Mail className="h-4 w-4 text-muted-foreground" />}
          description="Number of emails automatically summarized by the system"
        />
        <MetricCard
          title="Total Generated Emails"
          value={mockData.totalGenerated}
          icon={<Clock className="h-4 w-4 text-muted-foreground" />}
          description="Number of AI-generated replies created"
        />
        <MetricCard
          title="Total Sent Emails"
          value={mockData.totalSent}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total number of emails sent through the system"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">
              Email Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.emailCategoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mockData.emailCategoryData.map(
                      (entry: any, index: any) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      )
                    )}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">
              Email Volume by Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.emailVolumeData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">
              Response Time Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.responseTimeData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="category" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">Top Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] overflow-y-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left pb-2">Name</th>
                    <th className="text-right pb-2">Email Count</th>
                  </tr>
                </thead>
                <tbody>
                  {mockData.topContactsData.map((contact: any, index: any) => (
                    <tr key={index} className="border-t">
                      <td className="py-2">{contact.name}</td>
                      <td className="text-right py-2">{contact.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="tracking-wider">
            Email Activity Heatmap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.emailActivityHeatmap}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="00-04"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
                <Area
                  type="monotone"
                  dataKey="04-08"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                />
                <Area
                  type="monotone"
                  dataKey="08-12"
                  stackId="1"
                  stroke="#ffc658"
                  fill="#ffc658"
                />
                <Area
                  type="monotone"
                  dataKey="12-16"
                  stackId="1"
                  stroke="#ff8042"
                  fill="#ff8042"
                />
                <Area
                  type="monotone"
                  dataKey="16-20"
                  stackId="1"
                  stroke="#00C49F"
                  fill="#00C49F"
                />
                <Area
                  type="monotone"
                  dataKey="20-24"
                  stackId="1"
                  stroke="#FFBB28"
                  fill="#FFBB28"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">Thread Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockData.threadAnalysis}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {mockData.threadAnalysis.map((entry: any, index: any) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="tracking-wider">
              Email Volume by Hour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockData.emailVolumeByHour}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hours" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="tracking-wider">Sentiment Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.sentimentAnalysis} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="sentiment" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="_count.sentiment" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ title, value, icon, description }: any) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium tracking-wider">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-wider">{value}</div>
        <TooltipProvider>
          <UITooltip>
            <TooltipTrigger asChild>
              <Info className="h-4 w-4 text-muted-foreground mt-1" />
            </TooltipTrigger>
            <TooltipContent>
              <p>{description}</p>
            </TooltipContent>
          </UITooltip>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
