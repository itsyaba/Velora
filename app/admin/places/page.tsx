"use client";

import React, { useState } from "react";
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
/*  Mock Data                                                          */
/* ------------------------------------------------------------------ */
const initialPlaces = [
  {
    id: 1,
    name: "Unity Park",
    category: "Museum",
    location: "Addis Ababa, ET",
    status: "published",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 2,
    name: "Entoto Park",
    category: "Park",
    location: "Addis Ababa, ET",
    status: "published",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 3,
    name: "National Museum",
    category: "Museum",
    location: "Addis Ababa, ET",
    status: "draft",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1518998053502-53cc83e9c5ec?auto=format&fit=crop&w=100&q=80",
  },
  {
    id: 4,
    name: "Red Terror Museum",
    category: "Museum",
    location: "Addis Ababa, ET",
    status: "published",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=100&q=80",
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredPlaces = initialPlaces.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || p.category === categoryFilter;
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
        <Button className="gap-2 shadow-sm">
          <IconPlus className="size-4" />
          Add Place
        </Button>
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
                  <SelectItem value="Museum">Museums</SelectItem>
                  <SelectItem value="Park">Parks</SelectItem>
                  <SelectItem value="Restaurant">Restaurants</SelectItem>
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
              {filteredPlaces.length > 0 ? (
                filteredPlaces.map((place) => (
                  <TableRow
                    key={place.id}
                    className="group transition-colors hover:bg-muted/20 border-border/50"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 overflow-hidden rounded-lg border border-border/50 bg-muted shrink-0">
                           <img src={place.image} alt={place.name} className="size-full object-cover grayscale-[0.2] transition-all group-hover:grayscale-0" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-semibold text-sm">{place.name}</span>
                           <span className="text-xs text-muted-foreground">ID: PLC-{place.id}00{place.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-medium border-border/50 px-2 py-0.5">
                        {place.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <IconMapPin className="size-3 text-primary/60" />
                        {place.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-0.5 text-xs font-medium",
                          place.status === "published"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                      >
                        <span className={cn(
                          "size-1.5 rounded-full mr-2",
                          place.status === "published" ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        {place.status.charAt(0).toUpperCase() + place.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1.5">
                        <IconStarFilled className="size-3 text-amber-400" />
                        <span className="text-sm font-bold tabular-nums">{place.rating}</span>
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
                    No destinations found.
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
