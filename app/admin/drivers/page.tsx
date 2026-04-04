"use client";

import React, { useState, useEffect } from "react";
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
  IconLoader2,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */


export default function DriversPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [drivers, setDrivers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "driver",
    vehicle: "",
    licenseType: "",
    price: "",
    bio: "",
    photo: "",
  });

  const fetchDrivers = async () => {
    try {
      const res = await fetch("/api/providers?category=driver");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setDrivers(data.providers || []);
    } catch (error) {
      console.error("Error fetching drivers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price) || 0,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create driver");
      }

      toast.success("Driver created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", category: "driver", vehicle: "", licenseType: "", price: "", bio: "", photo: "" });
      fetchDrivers(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrivers = drivers.filter((d) => {
    const matchesSearch =
      d.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.vehicle || "").toLowerCase().includes(searchTerm.toLowerCase());
    
    // Map statusFilter back to available boolean
    let matchesStatus = true;
    if (statusFilter === "on-duty") matchesStatus = d.available === true;
    if (statusFilter === "off-duty") matchesStatus = d.available === false;

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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm font-semibold">
              <IconPlus className="size-4" />
              Add Driver
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Driver</DialogTitle>
              <DialogDescription>
                Register a new driver to your fleet.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateDriver} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Driver Photo</Label>
                {formData.photo ? (
                  <div className="relative w-full h-32 bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.photo} alt="Uploaded driver profile" className="h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setFormData(p => ({ ...p, photo: "" }))}
                      className="absolute top-2 right-2 h-7 rounded-full text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border/50 border-dashed rounded-xl bg-muted/20 p-6 flex flex-col items-center justify-center">
                    <UploadDropzone
                      endpoint="providerPhoto"
                      onUploadBegin={() => {
                        setIsUploading(true);
                        console.log("📁 Driver photo upload started...");
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res && res[0]) {
                          console.log("✅ Driver photo uploaded:", res[0].url);
                          setFormData(p => ({ ...p, photo: res[0].url }));
                          toast.success("Photo uploaded!");
                        }
                      }}
                      onUploadError={(error) => {
                        setIsUploading(false);
                        console.error("❌ Driver photo upload error:", error);
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      config={{ mode: "auto" }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="E.g. Haile Gebreselassie" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="haile@example.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle Details</Label>
                  <Input 
                    id="vehicle" 
                    value={formData.vehicle}
                    onChange={(e) => setFormData(p => ({ ...p, vehicle: e.target.value }))}
                    placeholder="Toyota Land Cruiser" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="licenseType">License Type</Label>
                  <Input 
                    id="licenseType" 
                    value={formData.licenseType}
                    onChange={(e) => setFormData(p => ({ ...p, licenseType: e.target.value }))}
                    placeholder="Public transport / Class 5" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Base Rate (ETB/hr)</Label>
                <Input 
                  id="price" 
                  type="number" 
                  required 
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))}
                  placeholder="300" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Driver Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={3} 
                  value={formData.bio}
                  onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Experience or quick description..." 
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? (
                    <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                  ) : isUploading ? (
                    <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                  ) : "Create Driver"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    Loading drivers...
                  </TableCell>
                </TableRow>
              ) : filteredDrivers.length > 0 ? (
                filteredDrivers.map((d) => (
                  <TableRow
                    key={d._id}
                    className="group transition-colors hover:bg-muted/10 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{d.name}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          Rating: {d.rating || 0} ★
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                         <IconCar className="size-3.5 text-primary/60" />
                         <span className="font-medium">{d.vehicle || "No vehicle data"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-semibold text-[10px] uppercase border-border/50">
                        {d.licenseType || "Unknown"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <IconCircleFilled className={cn(
                           "size-2 animate-pulse transition-all",
                           d.available ? "text-emerald-500" : "text-slate-300"
                         )} />
                         <span className={cn(
                           "text-xs font-bold uppercase tracking-tight",
                           d.available ? "text-emerald-600" : "text-slate-500"
                         )}>
                            {d.available ? "On Duty" : "Off Duty"}
                         </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-black tracking-tight tabular-nums">
                      {d.totalBookings}
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
                <span className="text-lg font-black">{drivers.filter(d => d.available).length} Active</span>
             </CardContent>
          </Card>
      </div>
    </div>
  );
}
