"use client";

import React, { useState } from "react";
import {
  IconSearch,
  IconPlus,
  IconCar,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconSteeringWheel,
  IconMapPinFilled,
  IconPhoneCall,
  IconCircleFilled,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const initialDrivers = [
  {
    id: 1,
    name: "Tariku Lema",
    vehicle: "Toyota Corolla 2023",
    license: "B-Class",
    status: "on-duty",
    email: "tariku.l@example.com",
    rating: 4.9,
    trips: 342,
  },
  {
    id: 2,
    name: "Elias Worku",
    vehicle: "Hyundai Elantra 2022",
    license: "B-Class",
    status: "off-duty",
    email: "elias.w@example.com",
    rating: 4.7,
    trips: 215,
  },
  {
    id: 3,
    name: "Mulugeta Belay",
    vehicle: "Suzuki Dzire 2023",
    license: "A-Class",
    status: "on-duty",
    email: "mulu.b@example.com",
    rating: 4.8,
    trips: 128,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredDrivers = initialDrivers.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 px-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Drivers</h2>
          <p className="text-muted-foreground">
            Monitor and manage your fleet and driver availability.
          </p>
        </div>
        <Button className="gap-2 shadow-sm font-semibold">
          <IconPlus className="size-4" />
          Add Driver
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-xs border-border/50">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by name or vehicle..."
                  className="pl-9 h-9 border-border/50 bg-background focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 border-border/50 bg-background">
                  <SelectValue placeholder="All Drivers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="on-duty">On-Duty</SelectItem>
                  <SelectItem value="off-duty">Off-Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-3 border-border/50 font-medium">
                {filteredDrivers.length} Registered Drivers
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">Driver Name</TableHead>
                <TableHead>Vehicle & Plate</TableHead>
                <TableHead>License Type</TableHead>
                <TableHead>Availability</TableHead>
                <TableHead className="text-right">Total Trips</TableHead>
                <TableHead className="w-[50px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDrivers.length > 0 ? (
                filteredDrivers.map((d) => (
                  <TableRow
                    key={d.id}
                    className="group transition-colors hover:bg-muted/10 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{d.name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          Rating: {d.rating} ★
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                         <IconCar className="size-3.5 text-primary/60" />
                         <span className="font-medium">{d.vehicle}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold text-[10px] uppercase border-border/50">
                        {d.license}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <IconCircleFilled className={cn(
                           "size-2 animate-pulse transition-all",
                           d.status === "on-duty" ? "text-emerald-500" : "text-slate-300"
                         )} />
                         <span className={cn(
                           "text-xs font-bold uppercase tracking-tight",
                           d.status === "on-duty" ? "text-emerald-600" : "text-slate-500"
                         )}>
                            {d.status === "on-duty" ? "On Duty" : "Off Duty"}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black tracking-tight tabular-nums">
                      {d.trips}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuLabel>Fleet Manager</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                             <IconMapPinFilled className="size-4" /> Live location
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                             <IconPhoneCall className="size-4" /> Contact driver
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                             <IconSteeringWheel className="size-4" /> Update vehicle
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No drivers matched the search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Fleet Stats (Small Cards) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-muted/10 border-border/50 shadow-none">
             <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-bold tracking-widest text-primary/70">Operating</CardDescription>
             </CardHeader>
             <CardContent className="px-4 pb-4">
                <span className="text-lg font-black">{initialDrivers.filter(d => d.status === 'on-duty').length} Active</span>
             </CardContent>
          </Card>
      </div>
    </div>
  );
}
