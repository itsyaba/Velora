"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconPlus,
  IconFilter,
  IconChevronDown,
  IconDotsVertical,
  IconUserPlus,
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
function formatCategory(category: string) {
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
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function ProvidersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [providers, setProviders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "tour_guide",
    price: "",
    bio: "",
    photo: "",
  });

  const fetchProviders = async () => {
    try {
      const res = await fetch("/api/providers");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setProviders(data.providers || []);
    } catch (error) {
      console.error("Error fetching providers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  const handleCreateProvider = async (e: React.FormEvent) => {
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
        throw new Error(errorData.error || "Failed to create provider");
      }

      toast.success("Provider created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", category: "tour_guide", price: "", bio: "", photo: "" });
      fetchProviders(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProviders = providers.filter((p) => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === "all" || formatCategory(p.category) === serviceFilter;
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <IconPlus className="size-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Provider</DialogTitle>
              <DialogDescription>
                Enter the details of the new service partner to add them to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateProvider} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo</Label>
                {formData.photo ? (
                  <div className="relative w-full h-32 bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.photo} alt="Uploaded preview" className="h-full object-cover" />
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setFormData(prev => ({ ...prev, photo: "" }))}
                      className="absolute top-2 right-2 h-7 rounded-full text-xs"
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border border-border/50 border-dashed rounded-xl bg-muted/20 p-6 flex flex-col items-center justify-center gap-2">
                    <UploadDropzone
                      endpoint="providerPhoto"
                      onUploadBegin={() => {
                        setIsUploading(true);
                        console.log("📁 Provider photo upload started...");
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res && res[0]) {
                          console.log("✅ Provider photo uploaded:", res[0].url);
                          setFormData(prev => ({ ...prev, photo: res[0].url }));
                          toast.success("Photo uploaded!");
                        }
                      }}
                      onUploadError={(error) => {
                        setIsUploading(false);
                        console.error("❌ Provider photo upload error:", error);
                        toast.error(`Upload failed: ${error.message}`);
                      }}
                      config={{ mode: 'auto' }}
                      appearance={{
                        button: "bg-primary text-primary-foreground text-sm font-medium",
                        label: "text-muted-foreground",
                      }}
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
                    placeholder="E.g. Abebe Bekele" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="abebe@example.com" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Service Category</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(val) => setFormData(p => ({ ...p, category: val }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select one" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tour_guide">Tour Guide</SelectItem>
                      <SelectItem value="translator">Translator</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                      <SelectItem value="resort_guide">Resort Guide</SelectItem>
                    </SelectContent>
                  </Select>
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
                    placeholder="400" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio / Description (Optional)</Label>
                <Textarea 
                  id="bio" 
                  rows={3} 
                  value={formData.bio}
                  onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Professional summary..." 
                  className="resize-none"
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
                  ) : "Create Provider"}
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
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    Loading providers...
                  </TableCell>
                </TableRow>
              ) : filteredProviders.length > 0 ? (
                filteredProviders.map((provider) => (
                  <TableRow
                    key={provider._id}
                    className="group transition-colors hover:bg-muted/20 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4 font-medium">
                      <div className="flex flex-col">
                        <span>{provider.name}</span>
                        <span className="text-xs font-normal text-muted-foreground block md:hidden">
                          {provider.email || "No email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-medium bg-secondary/50">
                        {formatCategory(provider.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-0.5 text-xs font-medium",
                          provider.available
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400"
                        )}
                      >
                        <span className={cn(
                          "size-1.5 rounded-full mr-2",
                          provider.available ? "bg-emerald-500" : "bg-slate-400"
                        )} />
                        {provider.available ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(provider.createdAt)}
                    </TableCell>
                    <TableCell className="text-right font-medium tabular-nums font-mono">
                      {provider.totalBookings}
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
