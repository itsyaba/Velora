"use client";

import React, { useState } from "react";
import {
  IconSearch,
  IconPlus,
  IconLanguages,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconCertificate,
  IconCertificateOff,
  IconMail,
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
const initialTranslators = [
  {
    id: 1,
    name: "Selamawit Tadesse",
    languages: ["Amharic", "English", "French"],
    experience: "5 Years",
    status: "verified",
    email: "selam.t@example.com",
    bookings: 124,
  },
  {
    id: 2,
    name: "Daniel Ghebre",
    languages: ["Amharic", "German", "Arabic"],
    experience: "3 Years",
    status: "verified",
    email: "daniel.g@example.com",
    bookings: 89,
  },
  {
    id: 3,
    name: "Helen Yosef",
    languages: ["Amharic", "Italian"],
    experience: "2 Years",
    status: "in-review",
    email: "helen.y@example.com",
    bookings: 42,
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function TranslatorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const filteredTranslators = initialTranslators.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage =
      languageFilter === "all" || t.languages.includes(languageFilter);
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
        <Button className="gap-2 shadow-sm font-semibold">
          <IconPlus className="size-4" />
          Add Translator
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
              {filteredTranslators.length > 0 ? (
                filteredTranslators.map((t) => (
                  <TableRow
                    key={t.id}
                    className="group transition-colors hover:bg-muted/10 border-border/50 whitespace-nowrap"
                  >
                    <TableCell className="pl-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{t.name}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <IconMail className="size-2.5" /> {t.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1.5 min-w-[140px]">
                        {t.languages.map((lang) => (
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
                      {t.experience}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "border-transparent px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider",
                          t.status === "verified"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                        )}
                      >
                        <div className="flex items-center gap-1.5">
                           {t.status === "verified" ? (
                             <IconCircleCheckFilled className="size-3" />
                           ) : (
                             <IconCertificate className="size-3" />
                           )}
                           {t.status === "verified" ? "Verified" : "In Review"}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold tabular-nums">
                      {t.bookings}
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
                             <IconLanguages className="size-4" /> View proficiencies
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
