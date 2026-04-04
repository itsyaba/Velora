"use client";

import React, { useState } from "react";
import {
  IconTrendingUp,
  IconTrendingDown,
  IconUsers,
  IconMapPin,
  IconCalendarCheck,
  IconCash,
  IconArrowRight,
  IconCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const metricsData = [
  {
    label: "Total Providers",
    value: "12",
    description: "Active partners",
    icon: IconUsers,
    trend: "+5%",
    trendUp: true,
  },
  {
    label: "Total Places",
    value: "8",
    description: "Listed locations",
    icon: IconMapPin,
    trend: "Steady",
    trendUp: null,
  },
  {
    label: "Bookings Today",
    value: "34",
    description: "New requests",
    icon: IconCalendarCheck,
    trend: "+12.5%",
    trendUp: true,
  },
  {
    label: "Total Revenue",
    value: "ETB 15,400",
    description: "Daily earnings",
    icon: IconCash,
    trend: "+8.2%",
    trendUp: true,
  },
];

const recentBookings = [
  {
    user: "Abebe K.",
    provider: "Dawit Bekele",
    service: "Tour Guide",
    status: "confirmed",
    time: "10 mins ago",
  },
  {
    user: "Sara M.",
    provider: "Yonas Haile",
    service: "Driver",
    status: "pending",
    time: "25 mins ago",
  },
  {
    user: "Liya T.",
    provider: "Sara Tadesse",
    service: "Translator",
    status: "confirmed",
    time: "1 hour ago",
  },
  {
    user: "Kedir A.",
    provider: "Meron Alemu",
    service: "Resort Guide",
    status: "cancelled",
    time: "2 hours ago",
  },
  {
    user: "Hana B.",
    provider: "Dawit Bekele",
    service: "Tour Guide",
    status: "confirmed",
    time: "3 hours ago",
  },
];

const topServices = [
  { label: "Tour Guide", count: 48, growth: "+12%" },
  { label: "Bilingual Driver", count: 32, growth: "+8%" },
  { label: "Historical Translator", count: 24, growth: "-2%" },
  { label: "Resort Concierge", count: 18, growth: "+15%" },
];

const chartData = [
  { date: "2024-03-01", bookings: 12, revenue: 4500 },
  { date: "2024-03-05", bookings: 18, revenue: 6200 },
  { date: "2024-03-10", bookings: 15, revenue: 5100 },
  { date: "2024-03-15", bookings: 25, revenue: 8400 },
  { date: "2024-03-20", bookings: 22, revenue: 7600 },
  { date: "2024-03-25", bookings: 30, revenue: 12100 },
  { date: "2024-03-30", bookings: 34, revenue: 15400 },
];

const chartConfig = {
  bookings: {
    label: "Bookings",
    color: "var(--primary)",
  },
  revenue: {
    label: "Revenue",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

/* ------------------------------------------------------------------ */
/*  Components                                                        */
/* ------------------------------------------------------------------ */

function MetricCard({ metric }: { metric: (typeof metricsData)[0] }) {
  return (
    <Card className="@container/card shadow-xs transition-all hover:shadow-md">
      <CardHeader>
        <CardDescription>{metric.label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {metric.value}
        </CardTitle>
        <CardAction>
          {metric.trendUp !== null && (
            <Badge variant="outline" className="gap-1 font-medium">
              {metric.trendUp ? <IconTrendingUp className="size-3" /> : <IconTrendingDown className="size-3" />}
              {metric.trend}
            </Badge>
          )}
          {metric.trendUp === null && (
            <Badge variant="outline" className="text-muted-foreground whitespace-nowrap">
              Stable
            </Badge>
          )}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          {metric.trendUp ? "Trending up this month" : metric.trendUp === false ? "Down this period" : "Steady performance"} 
          {metric.trendUp ? <IconTrendingUp className="size-4" /> : metric.trendUp === false ? <IconTrendingDown className="size-4" /> : null}
        </div>
        <div className="text-muted-foreground">
          {metric.description}
        </div>
      </CardFooter>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="outline" className="border-emerald-200 bg-emerald-50/50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400">
           Confirmed
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="outline" className="border-amber-200 bg-amber-50/50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400">
           Pending
        </Badge>
      );
    case "cancelled":
      return (
        <Badge variant="outline" className="border-rose-200 bg-rose-50/50 text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-400">
           Cancelled
        </Badge>
      );
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function AdminDashboardPage() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("90d");

  return (
    <>
      <section className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-bl *:data-[slot=card]:shadow-xs sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        {metricsData.map((m, idx) => (
          <MetricCard key={idx} metric={m} />
        ))}
      </section>

      <div className="px-4 lg:px-6">
        <Card className="@container/card shadow-xs">
          <CardHeader>
            <CardTitle>Bookings Overview</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">
                Total for the last 3 months
              </span>
              <span className="@[540px]/card:hidden">Last 3 months</span>
            </CardDescription>
            <CardAction>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={(v) => v && setTimeRange(v)}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              >
                <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
                <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
                <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Last 3 months" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="90d" className="rounded-lg">
                    Last 3 months
                  </SelectItem>
                  <SelectItem value="30d" className="rounded-lg">
                    Last 30 days
                  </SelectItem>
                  <SelectItem value="7d" className="rounded-lg">
                    Last 7 days
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="fillBookings" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-bookings)"
                      stopOpacity={1.0}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-bookings)"
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
                <ChartTooltip
                  cursor={false}
                  defaultIndex={isMobile ? -1 : 6}
                  content={
                    <ChartTooltipContent
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        });
                      }}
                      indicator="dot"
                    />
                  }
                />
                <Area
                  dataKey="bookings"
                  type="natural"
                  fill="url(#fillBookings)"
                  stroke="var(--color-bookings)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <section className="grid grid-cols-1 gap-6 px-4 lg:grid-cols-3 lg:px-6">
        {/* Recent Bookings Table */}
        <Card className="lg:col-span-2 shadow-xs flex flex-col justify-between h-auto">
          <div>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Recent Bookings</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs h-8">
                   View all <IconArrowRight className="size-3 ml-1" />
                </Button>
              </div>
              <CardDescription>Most recent user requests</CardDescription>
            </CardHeader>
            <CardContent className="p-0 border-t">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="pl-6">User</TableHead>
                    <TableHead>Provider</TableHead>
                    <TableHead className="hidden sm:table-cell">Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right pr-6">Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((b, i) => (
                    <TableRow key={i} className="group transition-colors hover:bg-muted/20 border-none">
                      <TableCell className="font-medium pl-6 py-3">{b.user}</TableCell>
                      <TableCell className="text-muted-foreground">{b.provider}</TableCell>
                      <TableCell className="hidden sm:table-cell">{b.service}</TableCell>
                      <TableCell>
                        <StatusBadge status={b.status} />
                      </TableCell>
                      <TableCell className="text-right pr-6 text-xs text-muted-foreground whitespace-nowrap">
                        {b.time}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </div>
          <CardFooter className="border-t py-3 justify-center">
            <p className="text-xs text-muted-foreground">Showing the last 5 transactions</p>
          </CardFooter>
        </Card>

        {/* Top Requested Services */}
        <Card className="shadow-xs flex flex-col h-auto">
          <CardHeader>
            <CardTitle className="text-xl">Top Services</CardTitle>
            <CardDescription>Trending requests this week</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            {topServices.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold tracking-tight">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.count} requests</p>
                </div>
                <Badge variant="outline" className={cn(
                  "rounded-full px-2 text-[10px] font-medium transition-none border-none",
                  s.growth.startsWith("+") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                )}>
                  {s.growth}
                </Badge>
              </div>
            ))}
          </CardContent>
          <CardFooter className="mt-auto border-t py-4">
            <Button className="w-full text-xs" variant="outline" size="sm">
              Detailed Analytics
            </Button>
          </CardFooter>
        </Card>
      </section>
    </>

  );
}
