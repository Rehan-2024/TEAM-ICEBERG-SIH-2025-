import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Users, 
  Building, 
  CreditCard, 
  UserCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  Settings,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Shield,
  BarChart3,
  Calendar,
  MapPin,
  Star,
  Clock,
  DollarSign
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Mock admin data
  const stats = [
    { title: 'Total Users', value: '15,247', change: '+12%', icon: Users, color: 'text-blue-600' },
    { title: 'Active Centers', value: '156', change: '+8%', icon: Building, color: 'text-green-600' },
    { title: 'Monthly Revenue', value: '₹4.2L', change: '+23%', icon: DollarSign, color: 'text-purple-600' },
    { title: 'Doctors', value: '432', change: '+15%', icon: UserCheck, color: 'text-orange-600' }
  ];

  const recentUsers = [
    { id: 1, name: 'Priya Sharma', email: 'priya@email.com', joinDate: '2024-12-20', status: 'active', therapy: 'Virechana' },
    { id: 2, name: 'Amit Patel', email: 'amit@email.com', joinDate: '2024-12-19', status: 'active', therapy: 'Basti' },
    { id: 3, name: 'Meera Gupta', email: 'meera@email.com', joinDate: '2024-12-18', status: 'pending', therapy: 'Nasya' },
    { id: 4, name: 'Rajesh Kumar', email: 'rajesh@email.com', joinDate: '2024-12-17', status: 'active', therapy: 'Vamana' }
  ];

  const centers = [
    {
      id: 1,
      name: 'Ayurveda Wellness Center',
      location: 'New Delhi',
      doctors: 12,
      patients: 245,
      rating: 4.8,
      revenue: '₹85,000',
      status: 'active'
    },
    {
      id: 2,
      name: 'Panchakarma Healing Center',
      location: 'Mumbai',
      doctors: 8,
      patients: 189,
      rating: 4.6,
      revenue: '₹67,000',
      status: 'active'
    },
    {
      id: 3,
      name: 'Traditional Ayurveda Clinic',
      location: 'Bangalore',
      doctors: 10,
      patients: 156,
      rating: 4.7,
      revenue: '₹72,000',
      status: 'active'
    }
  ];

  const monthlyData = [
    { month: 'Jan', users: 1200, revenue: 320000, bookings: 450 },
    { month: 'Feb', users: 1350, revenue: 380000, bookings: 520 },
    { month: 'Mar', users: 1180, revenue: 350000, bookings: 480 },
    { month: 'Apr', users: 1420, revenue: 420000, bookings: 580 },
    { month: 'May', users: 1380, revenue: 410000, bookings: 560 },
    { month: 'Jun', users: 1520, revenue: 470000, bookings: 620 }
  ];

  const therapyDistribution = [
    { name: 'Virechana', value: 35, color: '#8b5cf6' },
    { name: 'Basti', value: 28, color: '#06b6d4' },
    { name: 'Vamana', value: 20, color: '#10b981' },
    { name: 'Nasya', value: 12, color: '#f59e0b' },
    { name: 'Raktamokshan', value: 5, color: '#ef4444' }
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="card-3d hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`w-12 h-12 rounded-full bg-muted/20 flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="card-3d">
          <CardHeader>
            <CardTitle>Monthly Growth</CardTitle>
            <CardDescription>User registrations and revenue trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#8b5cf6" name="New Users" />
                  <Line type="monotone" dataKey="bookings" stroke="#06b6d4" name="Bookings" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle>Therapy Distribution</CardTitle>
            <CardDescription>Popular therapy types across platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={therapyDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {therapyDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="card-3d">
          <CardHeader>
            <CardTitle>Recent User Registrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.therapy}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-3d">
          <CardHeader>
            <CardTitle>System Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">High Booking Volume</p>
                  <p className="text-sm text-yellow-700">Delhi center approaching capacity</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">New Doctor Application</p>
                  <p className="text-sm text-blue-700">3 applications pending review</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Revenue Milestone</p>
                  <p className="text-sm text-green-700">Crossed ₹5L monthly target</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search users..." className="pl-10 w-64" />
          </div>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {recentUsers.map((user) => (
          <Card key={user.id} className="card-3d hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-xs text-muted-foreground">Joined: {new Date(user.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{user.therapy}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCenters = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Center Management</h2>
        <Button className="bg-gradient-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Center
        </Button>
      </div>

      <div className="grid gap-6">
        {centers.map((center) => (
          <Card key={center.id} className="card-3d hover-lift">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{center.name}</h3>
                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {center.location}
                  </p>
                </div>
                <Badge variant={center.status === 'active' ? 'default' : 'secondary'}>
                  {center.status}
                </Badge>
              </div>

              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{center.doctors}</div>
                  <div className="text-sm text-muted-foreground">Doctors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{center.patients}</div>
                  <div className="text-sm text-muted-foreground">Patients</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-lg font-bold">{center.rating}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{center.revenue}</div>
                  <div className="text-sm text-muted-foreground">Monthly Revenue</div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">
                  <Eye className="w-3 h-3 mr-1" />
                  View Details
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button size="sm" variant="outline">
                  <BarChart3 className="w-3 h-3 mr-1" />
                  Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gradient-primary mb-2 flex items-center gap-3">
                <Shield className="w-8 h-8" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage users, centers, and monitor platform performance
              </p>
            </div>
            <div className="flex gap-3 mt-4 lg:mt-0">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button className="bg-gradient-primary">
                <BarChart3 className="w-4 h-4 mr-2" />
                Reports
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="space-x-1 bg-muted p-1 rounded-lg inline-flex">
            {[
              { id: 'overview', label: 'Overview', icon: TrendingUp },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'centers', label: 'Centers', icon: Building },
              { id: 'payments', label: 'Payments', icon: CreditCard },
              { id: 'doctors', label: 'Doctors', icon: UserCheck }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'ghost'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'centers' && renderCenters()}
          {activeTab === 'payments' && (
            <div className="text-center py-12">
              <CreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Payment Management</h3>
              <p className="text-muted-foreground">Payment processing and financial reports coming soon</p>
            </div>
          )}
          {activeTab === 'doctors' && (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Doctor Management</h3>
              <p className="text-muted-foreground">Doctor verification and management system coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

