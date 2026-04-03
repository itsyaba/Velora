'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { providers as initialProviders } from '@/data/mockData';
import AvailabilityToggle from '@/components/admin/AvailabilityToggle';

export default function ProvidersPage() {
  const [providers, setProviders] = useState(initialProviders);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);

  const [newProvider, setNewProvider] = useState({
    name: '',
    category: '',
    languages: '',
    price: '',
    description: '',
    available: true
  });

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleAvailability = (id: number) => {
    setProviders(prev => prev.map(provider =>
      provider.id === id ? { ...provider, available: !provider.available } : provider
    ));
  };

  const handleAddProvider = () => {
    const provider = {
      id: Date.now(),
      name: newProvider.name,
      category: newProvider.category,
      languages: newProvider.languages.split(',').map(lang => lang.trim()),
      price: parseInt(newProvider.price),
      description: newProvider.description,
      available: newProvider.available,
      photo: '/placeholder.jpg'
    };
    
    setProviders(prev => [...prev, provider]);
    setNewProvider({
      name: '',
      category: '',
      languages: '',
      price: '',
      description: '',
      available: true
    });
    setIsAddDialogOpen(false);
  };

  const handleDeleteProvider = (id: number) => {
    setProviders(prev => prev.filter(provider => provider.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Providers</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Provider</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newProvider.name}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Provider name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewProvider(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Tour Guide">Tour Guide</SelectItem>
                    <SelectItem value="Translator">Translator</SelectItem>
                    <SelectItem value="Driver">Driver</SelectItem>
                    <SelectItem value="Resort Guide">Resort Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="languages">Languages (comma separated)</Label>
                <Input
                  id="languages"
                  value={newProvider.languages}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, languages: e.target.value }))}
                  placeholder="English, Amharic, French"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price per hour ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={newProvider.price}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="50"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProvider.description}
                  onChange={(e) => setNewProvider(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of services"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="available"
                  checked={newProvider.available}
                  onCheckedChange={(checked) => setNewProvider(prev => ({ ...prev, available: checked }))}
                />
                <Label htmlFor="available">Available</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProvider}>
                Add Provider
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search providers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Provider</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Languages</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProviders.map((provider) => (
              <TableRow key={provider.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={provider.photo} />
                      <AvatarFallback>
                        {provider.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{provider.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{provider.category}</Badge>
                </TableCell>
                <TableCell>{provider.languages.join(', ')}</TableCell>
                <TableCell>${provider.price}/hr</TableCell>
                <TableCell>
                  <AvailabilityToggle
                    available={provider.available}
                    onChange={() => handleToggleAvailability(provider.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteProvider(provider.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
