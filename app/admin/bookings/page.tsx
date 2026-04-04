"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconCalendar,
  IconDotsVertical,
  IconCheck,
  IconClock,
  IconX,
  IconFileText,
  IconTrash,
  IconArrowsLeftRight,
  IconCreditCard,
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */
function formatCategory(category: string) {
  if (!category) return "Unknown";
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
/* ------------------------------------------------------------------ */

export default function BookingsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      try {
        const res = await fetch("/api/bookings");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter((b) => {
    const bookingId = b._id.toString();
    const userName = b.userId?.name || "";
    const providerName = b.providerId?.name || "";
    
    const matchesSearch =
      bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      providerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 px-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Bookings</h2>
          <p className="text-muted-foreground">
            Monitor and manage all service requests and transactions.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 shadow-sm h-9">
              <IconFileText className="size-4" />
              Export Report
            </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-xs border-border/50">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="ID, User or Provider..."
                  className="pl-9 h-9 border-border/50 bg-background focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 border-border/50 bg-background">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-3 border-border/50 font-normal">
                {filteredBookings.length} Total requests
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">Booking ID</TableHead>
                <TableHead>User / Customer</TableHead>
                <TableHead>Assigned Provider</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="w-[50px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length > 0 ? (
                filteredBookings.map((booking) => (
                  <TableRow
                    key={booking._id}
                    className="group transition-colors hover:bg-muted/20 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4">
                        <div className="flex flex-col">
                           <span className="font-bold text-primary tracking-tight">
                              BK-{booking._id.toString().slice(-6).toUpperCase()}
                           </span>
                           <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                               <IconCalendar className="size-2.5" /> {formatDate(booking.scheduledAt || booking.createdAt)}
                           </span>
                        </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{booking.userId?.name || "Unknown User"}</span>
                        <span className="text-xs text-muted-foreground">{booking.userId?.email || "No email"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-muted-foreground">
                      {booking.providerId?.name || "Unknown Provider"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium bg-secondary/50">
                        {formatCategory(booking.providerId?.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-0.5 text-xs font-semibold",
                          booking.status === "confirmed"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : booking.status === "pending"
                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                            : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                           {booking.status === "confirmed" && <IconCheck className="size-3" />}
                           {booking.status === "pending" && <IconClock className="size-3" />}
                           {booking.status === "cancelled" && <IconX className="size-3" />}
                           {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      ETB {booking.providerId?.price || 0}
                    </TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuLabel>Manage Booking</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                             <IconFileText className="size-4" /> View full invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                             <IconArrowsLeftRight className="size-4" /> Re-assign provider
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                             <IconTrash className="size-4" /> Cancel booking
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="h-48 text-center text-muted-foreground">
                    No bookings matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
         <Card className="bg-muted/10 border-border/50 shadow-none">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Total Volume</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="flex items-baseline gap-2">
                   <span className="text-2xl font-black">ETB 6,750</span>
                   <span className="text-[10px] text-emerald-600 font-bold">+12% vs last month</span>
                </div>
            </CardContent>
         </Card>
         <Card className="bg-muted/10 border-border/50 shadow-none">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Pending Amount</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <span className="text-2xl font-black">ETB 850</span>
            </CardContent>
         </Card>
         <Card className="bg-muted/10 border-border/50 shadow-none">
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Payout Rate</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex items-center gap-3">
                <span className="text-2xl font-black">94%</span>
                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                   <div className="w-[94%] h-full bg-emerald-500 rounded-full" />
                </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
