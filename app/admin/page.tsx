'use client';

import { Users, Calendar, DollarSign, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const metrics = [
    {
      title: 'Total Providers',
      value: '24',
      change: '+4 this month',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Total Bookings',
      value: '156',
      change: '+12 this week',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Active Today',
      value: '8',
      change: '2 more than yesterday',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/20'
    },
    {
      title: 'Revenue',
      value: '$4,280',
      change: '+18% from last month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-card rounded-lg border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                <metric.icon className={`w-6 h-6 ${metric.color}`} />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-1">{metric.value}</h3>
            <p className="text-sm text-muted-foreground mb-2">{metric.title}</p>
            <p className="text-xs text-green-600">{metric.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: 'New booking', user: 'John Doe', time: '2 minutes ago' },
              { action: 'Provider registered', user: 'Sara Tadesse', time: '15 minutes ago' },
              { action: 'Payment received', user: 'Mike Johnson', time: '1 hour ago' },
              { action: 'Tour completed', user: 'Emily Chen', time: '2 hours ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Average Rating</span>
              <span className="font-semibold">4.8/5.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Response Time</span>
              <span className="font-semibold">2.3 hours</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Completion Rate</span>
              <span className="font-semibold">94%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Active Providers</span>
              <span className="font-semibold">18/24</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">New Users Today</span>
              <span className="font-semibold">12</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
