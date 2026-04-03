'use client';

import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye, Check, X } from 'lucide-react';

export default function BookingsPage() {
  const bookings = [
    {
      id: 1,
      customer: 'John Doe',
      provider: 'Dawit Bekele',
      service: 'Tour Guide',
      date: '2024-04-05',
      time: '10:00 AM',
      status: 'confirmed',
      price: '$50'
    },
    {
      id: 2,
      customer: 'Emily Chen',
      provider: 'Sara Tadesse',
      service: 'Translator',
      date: '2024-04-06',
      time: '2:00 PM',
      status: 'pending',
      price: '$30'
    },
    {
      id: 3,
      customer: 'Mike Johnson',
      provider: 'Yonas Haile',
      service: 'Driver',
      date: '2024-04-04',
      time: '8:00 AM',
      status: 'completed',
      price: '$20'
    },
    {
      id: 4,
      customer: 'Sarah Williams',
      provider: 'Meron Alemu',
      service: 'Resort Guide',
      date: '2024-04-07',
      time: '11:00 AM',
      status: 'confirmed',
      price: '$75'
    },
    {
      id: 5,
      customer: 'David Brown',
      provider: 'Dawit Bekele',
      service: 'Tour Guide',
      date: '2024-04-08',
      time: '3:00 PM',
      status: 'pending',
      price: '$50'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      completed: 'outline'
    };
    
    const colors = {
      confirmed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>
      
      <div className="bg-card rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {booking.customer.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{booking.customer}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {booking.provider.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span>{booking.provider}</span>
                  </div>
                </TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>
                  <div>
                    <div>{booking.date}</div>
                    <div className="text-sm text-muted-foreground">{booking.time}</div>
                  </div>
                </TableCell>
                <TableCell>{booking.price}</TableCell>
                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    {booking.status === 'pending' && (
                      <>
                        <Button variant="outline" size="sm" className="text-green-600">
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    )}
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
