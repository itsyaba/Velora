"use client";

import React, { useState, useEffect } from "react";
import {
  IconSearch,
  IconPlus,
  IconLanguage,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconCertificate,
  IconCertificateOff,
  IconMail,
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


export default function TranslatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [translators, setTranslators] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "translator",
    languagesStr: "",
    experience: "",
    price: "",
    bio: "",
    photo: "",
  });

  const fetchTranslators = async () => {
    try {
      const res = await fetch("/api/providers?category=translator");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTranslators(data.providers || []);
    } catch (error) {
      console.error("Error fetching translators:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTranslators();
  }, []);

  const handleCreateTranslator = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const languagesArray = formData.languagesStr
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          languages: languagesArray,
          price: Number(formData.price) || 0,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create translator");
      }

      toast.success("Translator created successfully!");
      setIsDialogOpen(false);
      setFormData({ name: "", email: "", category: "translator", languagesStr: "", experience: "", price: "", bio: "", photo: "" });
      fetchTranslators(); // Refresh list
    } catch (error: any) {
      toast.error(error.message || "An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTranslators = translators.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.email || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage =
      languageFilter === "all" || (t.languages && t.languages.includes(languageFilter));
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="flex flex-col gap-6 pb-10 px-4 lg:px-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Translators</h2>
          <p className="text-muted-foreground">
            Manage certified language specialists and their verification status.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-sm font-semibold">
              <IconPlus className="size-4" />
              Add Translator
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Translator</DialogTitle>
              <DialogDescription>
                Register a new language specialist into the Velora system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateTranslator} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo</Label>
                {formData.photo ? (
                  <div className="relative w-full h-32 bg-muted rounded-xl border border-border flex items-center justify-center overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={formData.photo} alt="Uploaded profile" className="h-full object-cover" />
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
                        console.log("📁 Translator photo upload started...");
                      }}
                      onClientUploadComplete={(res) => {
                        setIsUploading(false);
                        if (res && res[0]) {
                          console.log("✅ Translator photo uploaded:", res[0].url);
                          setFormData(p => ({ ...p, photo: res[0].url }));
                          toast.success("Photo uploaded!");
                        }
                      }}
                      onUploadError={(error) => {
                        setIsUploading(false);
                        console.error("❌ Translator photo upload error:", error);
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
                    placeholder="E.g. Selamawit Tadesse" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="selam@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="langs">Languages (Comma separated)</Label>
                <Input 
                  id="langs" 
                  required 
                  value={formData.languagesStr}
                  onChange={(e) => setFormData(p => ({ ...p, languagesStr: e.target.value }))}
                  placeholder="Amharic, English, French" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exp">Experience</Label>
                  <Input 
                    id="exp" 
                    value={formData.experience}
                    onChange={(e) => setFormData(p => ({ ...p, experience: e.target.value }))}
                    placeholder="E.g. 5 Years" 
                  />
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
                    placeholder="500" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  rows={3} 
                  value={formData.bio}
                  onChange={(e) => setFormData(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Summary of expertise..." 
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
                  ) : "Create Translator"}
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
                  placeholder="Search by name or email..."
                  className="pl-9 h-9 border-border/50 bg-background focus-visible:ring-primary/20"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={languageFilter} onValueChange={setLanguageFilter}>
                <SelectTrigger className="w-full sm:w-[150px] h-9 border-border/50 bg-background">
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  <SelectItem value="Amharic">Amharic</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-9 px-3 border-border/50 font-medium">
                {filteredTranslators.length} Specialists
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="pl-6 py-4">Name</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Verification</TableHead>
                <TableHead className="text-right">Bookings</TableHead>
                <TableHead className="w-[50px] pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    Loading language specialists...
                  </TableCell>
                </TableRow>
              ) : filteredTranslators.length > 0 ? (
                filteredTranslators.map((t) => (
                  <TableRow
                    key={t._id}
                    className="group transition-colors hover:bg-muted/10 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{t.name}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <IconMail className="size-2.5" /> {t.email || "No email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 min-w-[140px]">
                        {(t.languages || []).map((lang: string) => (
                          <Badge 
                            key={lang} 
                            variant="secondary" 
                            className="bg-secondary/40 text-[10px] uppercase font-bold py-0.5 px-2 tracking-tight"
                          >
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-xs text-muted-foreground">
                      {t.experience || "Not listed"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                          t.isVerified
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                           {t.isVerified ? (
                             <IconCircleCheckFilled className="size-3" />
                           ) : (
                             <IconCertificate className="size-3" />
                           )}
                           {t.isVerified ? "Verified" : "In Review"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      {t.totalBookings}
                    </TableCell>
                    <TableCell className="pr-6 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="size-8">
                            <IconDotsVertical className="size-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuLabel>Translator Menu</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2">
                             <IconLanguage className="size-4" /> View proficiencies
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                             <IconCertificate className="size-4" /> Update certification
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive gap-2">
                             <IconCertificateOff className="size-4" /> Revoke status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-48 text-center text-muted-foreground">
                    No language specialists found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Language Breakdown (Small Summary) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="bg-muted/10 border-border/50 shadow-none">
             <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-bold tracking-widest text-primary/70">Top Dialect</CardDescription>
             </CardHeader>
             <CardContent className="px-4 pb-4">
                <span className="text-lg font-black">Amharic (100%)</span>
             </CardContent>
          </Card>
          <Card className="bg-muted/10 border-border/50 shadow-none">
             <CardHeader className="p-4 pb-2">
                <CardDescription className="text-xs uppercase font-bold tracking-widest text-primary/70">Multilingual</CardDescription>
             </CardHeader>
             <CardContent className="px-4 pb-4">
                <span className="text-lg font-black">82%</span>
             </CardContent>
          </Card>
      </div>
    </div>
  );
}
