
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { User, Settings, LogOut, ShoppingBag, Heart, CreditCard } from 'lucide-react';

const UserProfile = () => {
  // Demo user data - in a real app, this would come from authentication
  const user = {
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80',
    joined: 'January 2023',
  };

  const handleLogout = () => {
    // In a real app, this would handle actual logout logic
    toast.success('Logged out successfully');
  };

  return (
    <div className="pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* User sidebar */}
          <Card className="bg-card/50 backdrop-blur-sm border border-white/10 lg:col-span-1">
            <CardHeader className="items-center text-center pb-2">
              <Avatar className="h-24 w-24 mb-2">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-2xl font-display">{user.name}</CardTitle>
              <CardDescription>{user.email}</CardDescription>
              <p className="text-sm text-muted-foreground">Member since {user.joined}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mt-4">
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <User className="mr-2 h-4 w-4" />
                  My Account
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Orders
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Heart className="mr-2 h-4 w-4" />
                  Wishlist
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Payment Methods
                </Button>
                <Button variant="outline" className="w-full justify-start" size="lg">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-destructive hover:text-destructive" 
                  size="lg"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* User main content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="dashboard">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="orders">Recent Orders</TabsTrigger>
                <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle>Welcome back, {user.name}</CardTitle>
                    <CardDescription>
                      Here's an overview of your account activity and status
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h3 className="font-medium mb-1">Total Orders</h3>
                        <p className="text-3xl font-display">4</p>
                      </div>
                      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                        <h3 className="font-medium mb-1">Wishlist Items</h3>
                        <p className="text-3xl font-display">7</p>
                      </div>
                    </div>
                    
                    <h3 className="font-medium text-lg mb-4">Recently Viewed</h3>
                    <p className="text-muted-foreground">You haven't viewed any products yet.</p>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="orders">
                <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle>Your Orders</CardTitle>
                    <CardDescription>
                      View and track your recent orders
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                    <Button>Browse Products</Button>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="wishlist">
                <Card className="bg-card/50 backdrop-blur-sm border border-white/10">
                  <CardHeader>
                    <CardTitle>Your Wishlist</CardTitle>
                    <CardDescription>
                      Products you've saved for later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                    <Button>Explore Products</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
