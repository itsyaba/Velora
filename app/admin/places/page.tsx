"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconPlus,
  IconMapPin,
  IconStarFilled,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconLayoutGrid,
  IconList,
  IconLoader2,
  IconX,
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
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { UploadDropzone } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Helper Functions                                                  */
/* ------------------------------------------------------------------ */
function formatCategory(category: string) {
  if (!category) return "Other";
  return category
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
/* ------------------------------------------------------------------ */

export default function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [places, setPlaces] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "cultural_site",
    description: "",
    address: "",
    openingHours: "",
    photos: [] as string[],
  });

  const fetchPlaces = async () => {
    try {
      const res = await fetch("/api/places");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setPlaces(data.places || []);
    } catch (error) {
      console.error("Error fetching places:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const handleCreatePlace = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create place");
      }

      toast.success("Place created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", type: "cultural_site", description: "", address: "", openingHours: "", photos: [] });
      fetchPlaces();
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredPlaces = places.filter((p) => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.type === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 px-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Places</h2>
          <p className="text-muted-foreground">
            Manage your destinations, attractions, and landmarks.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm">
              <IconPlus className="size-4" />
              Add Place
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Place</DialogTitle>
              <DialogDescription>
                Register a new destination for your users to discover.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePlace} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Photos Repository</Label>
                {formData.photos.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {formData.photos.map((url, i) => (
                      <div key={i} className="relative size-24 bg-muted rounded-xl border border-border overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="Place photo" className="h-full w-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => setFormData(p => ({ ...p, photos: p.photos.filter((_, idx) => idx !== i) }))}
                          className="absolute top-1 right-1 size-6 rounded-full"
                        >
                          <IconX className="size-3" />
                        </Button>
                      </div>
                    ))}
                    {formData.photos.length < 5 && (
                      <div className="w-full flex items-center justify-center p-4 border border-dashed border-border/50 rounded-xl bg-muted/5">
                        <div className="flex flex-col items-center gap-2">
                           <UploadDropzone
                             endpoint="placePhotos"
                             onUploadBegin={() => {
                               setIsUploading(true);
                               console.log("📁 Uploading started...");
                             }}
                             onClientUploadComplete={(res) => {
                               setIsUploading(false);
                               if (res) {
                                 console.log("✅ Upload complete:", res);
                                 setFormData(p => ({ ...p, photos: [...p.photos, ...res.map(r => r.url)] }));
                                 toast.success("Photos added!");
                               }
                             }}
                             onUploadError={(error) => {
                               setIsUploading(false);
                               console.error("❌ Upload error:", error);
                               toast.error(`Upload failed: ${error.message}`);
                             }}
                             config={{ mode: 'auto' }}
                           />
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="border border-border/50 border-dashed rounded-xl bg-muted/20">
                    <UploadDropzone
                      endpoint="placePhotos"
                      onUploadBegin={() => {
                        setIsUploading(true);
                        console.log("📁 Uploading started...");
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res) {
                           console.log("✅ Upload complete:", res);
                           setFormData(p => ({ ...p, photos: res.map(r => r.url) }));
                           toast.success("Photos uploaded!");
                        }
                      }}
                      onUploadError={(error) => {
                        setIsUploading(false);
                        console.error("❌ Upload error:", error);
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
                  <Label htmlFor="name">Place Name</Label>
                  <Input 
                    id="name" 
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                    placeholder="E.g. National Museum" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Category Type</Label>
                  <Select 
                    value={formData.type} 
                    onValueChange={(val) => setFormData(p => ({ ...p, type: val }))}
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="restaurant">Restaurant</SelectItem>
                      <SelectItem value="hotel">Hotel</SelectItem>
                      <SelectItem value="cultural_site">Cultural Site</SelectItem>
                      <SelectItem value="nightlife">Nightlife</SelectItem>
                      <SelectItem value="nature">Nature</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address / Location</Label>
                <Input 
                  id="address" 
                  value={formData.address}
                  onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                  placeholder="Street context or Google Maps link..." 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hours">Opening Hours</Label>
                <Input 
                  id="hours" 
                  value={formData.openingHours}
                  onChange={(e) => setFormData(p => ({ ...p, openingHours: e.target.value }))}
                  placeholder="E.g. Mon-Fri 9:00 AM - 5:00 PM" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea 
                  id="desc" 
                  rows={3} 
                  value={formData.description}
                  onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))}
                  placeholder="Tell visitors about this destination..." 
                  className="resize-none"
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || isUploading}>
                  {isSubmitting ? (
                    <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</>
                  ) : isUploading ? (
                    <><IconLoader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...</>
                  ) : "Create Place"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Main Content Card */}
      <Card className="shadow-xs border-border/50 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter places..."
                  className="pl-9 h-9 border-border/50 bg-background focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] h-9 border-border/50 bg-background">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="cultural_site">Cultural Sites</SelectItem>
                  <SelectItem value="nature">Nature & Parks</SelectItem>
                  <SelectItem value="restaurant">Restaurants</SelectItem>
                  <SelectItem value="hotel">Hotels & Resorts</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="h-9 px-3 border-border/50 font-medium">
                {filteredPlaces.length} Destinations
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">Place Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead className="w-[50px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    Loading destinations...
                  </TableCell>
                </TableRow>
              ) : filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <TableRow
                    key={place._id}
                    className="group transition-colors hover:bg-muted/20 border-border/50"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-lg border border-border/50 bg-muted shrink-0">
                           <img 
                             src={place.photos?.[0] || 'https://via.placeholder.com/100'} 
                             alt={place.name} 
                             className="size-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0" 
                           />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-semibold text-sm">{place.name}</span>
                           <span className="text-xs text-muted-foreground">
                             ID: PLC-{place._id.toString().slice(-6).toUpperCase()}
                           </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium border-border/50 px-2 py-0.5">
                        {formatCategory(place.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconMapPin className="size-3 text-primary/60" />
                        {place.address || "Unknown Location"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-0.5 text-xs font-medium",
                          "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        )}
                      >
                        <span className={cn("size-1.5 rounded-full mr-2", "bg-emerald-500")} />
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <IconStarFilled className="size-3 text-amber-400" />
                        <span className="text-sm font-bold tabular-nums">{place.rating || "N/A"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="pr-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 rounded-xl">
                          <DropdownMenuLabel>Manage Place</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                             <IconEye className="size-4" /> View live page
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                             <IconEdit className="size-4" /> Edit details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                             <IconTrash className="size-4" /> Unpublish place
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No destinations found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Territory Summary Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary/5 to-transparent border-border/50 shadow-none">
          <CardHeader className="p-5">
             <CardTitle className="text-lg">Visibility Summary</CardTitle>
             <CardDescription>Published vs Draft items</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0">
             <div className="flex items-center gap-6">
                <div className="flex flex-col">
                   <span className="text-2xl font-bold">75%</span>
                   <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Published</span>
                </div>
                <Separator orientation="vertical" className="h-10" />
                <div className="flex flex-col">
                   <span className="text-2xl font-bold">25%</span>
                   <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">In Draft</span>
                </div>
             </div>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/10 border-border/50 shadow-none">
          <CardHeader className="p-5">
             <CardTitle className="text-lg">Average Rating</CardTitle>
             <CardDescription>Overall user sentiment</CardDescription>
          </CardHeader>
          <CardContent className="p-5 pt-0 flex items-center gap-3">
             <span className="text-3xl font-black italic tracking-tighter">4.75</span>
             <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((i) => (
                   <IconStarFilled key={i} className={cn("size-4", i <= 4 ? "text-amber-400" : "text-muted")} />
                ))}
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
