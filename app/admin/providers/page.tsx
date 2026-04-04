"use client";

import React, { useState } from "react";
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconChevronDown,
  IconDotsVertical,
  IconUserPlus,
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
const initialProviders = [
  {
    id: 1,
    name: "Dawit Bekele",
    service: "Tour Guide",
    status: "active",
    joined: "Jan 12, 2024",
    bookings: 45,
    email: "dawit.b@example.com",
  },
  {
    id: 2,
    name: "Sara Tadesse",
    service: "Translator",
    status: "active",
    joined: "Feb 05, 2024",
    bookings: 32,
    email: "sara.t@example.com",
  },
  {
    id: 3,
    name: "Yonas Haile",
    service: "Driver",
    status: "inactive",
    joined: "Mar 10, 2024",
    bookings: 18,
    email: "yonas.h@example.com",
  },
  {
    id: 4,
    name: "Meron Alemu",
    service: "Resort Guide",
    status: "active",
    joined: "Apr 22, 2024",
    bookings: 27,
    email: "meron.a@example.com",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");

  const filteredProviders = initialProviders.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === "all" || p.service === serviceFilter;
    return matchesSearch && matchesService;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 px-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Providers</h2>
          <p className="text-muted-foreground">
            Manage your service partners and their status.
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <IconPlus className="size-4" />
          Add Provider
        </Button>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-xs border-border/50">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search and Filters */}
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or email..."
                  className="pl-9 h-9 border-border/50 bg-background focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 border-border/50 bg-background">
                  <SelectValue placeholder="All Services" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Tour Guide">Tour Guide</SelectItem>
                  <SelectItem value="Translator">Translator</SelectItem>
                  <SelectItem value="Driver">Driver</SelectItem>
                  <SelectItem value="Resort Guide">Resort Guide</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-3 border-border/50 font-normal">
                {filteredProviders.length} Total
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">Name</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Joined Date</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="w-[50px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <TableRow
                    key={provider.id}
                    className="group transition-colors hover:bg-muted/20 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4 font-medium">
                      <div className="flex flex-col">
                        <span>{provider.name}</span>
                        <span className="text-xs font-normal text-muted-foreground block md:hidden">
                          {provider.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium bg-secondary/50">
                        {provider.service}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-0.5 text-xs font-medium",
                          provider.status === "active"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
                        )}
                      >
                        <span className={cn(
                          "size-1.5 rounded-full mr-2",
                          provider.status === "active" ? "bg-emerald-500" : "bg-slate-400"
                        )} />
                        {provider.status.charAt(0).toUpperCase() + provider.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {provider.joined}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums font-mono">
                      {provider.bookings}
                    </TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>View profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit details</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Suspend partner
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No providers found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Stats/Summary Section (Optional but adds value) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-muted/10 border-border/50 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Active Partners</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
             <span className="text-xl font-bold">75%</span>
          </CardContent>
        </Card>
        <Card className="bg-muted/10 border-border/50 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Avg. Bookings</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
             <span className="text-xl font-bold">30.5</span>
          </CardContent>
        </Card>
        <Card className="bg-muted/10 border-border/50 shadow-none">
          <CardHeader className="p-4 pb-2">
            <CardDescription className="text-xs">Top Territory</CardDescription>
          </CardHeader>
          <CardContent className="px-4 pb-4">
             <span className="text-xl font-bold">Addis Ababa</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
