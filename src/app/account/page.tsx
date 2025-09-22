
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, Heart } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import Image from 'next/image';
 

const Account = () => {
 

  const orders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
      status: 'Delivered',
      total: 1299.99,
      items: ['Modern Sectional Sofa', 'Glass Coffee Table']
    },
    {
      id: 'ORD-002',
      date: '2024-01-20',
      status: 'Shipped',
      total: 899.99,
      items: ['Rustic Dining Table']
    },
    {
      id: 'ORD-003',
      date: '2024-01-25',
      status: 'Processing',
      total: 449.99,
      items: ['Ergonomic Office Chair']
    }
  ];

  const wishlistItems = [
    {
      id: '5',
      name: 'Vintage Armchair',
      price: 649,
      image: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=200&h=200&fit=crop&crop=center'
    },
    {
      id: '6',
      name: 'Glass Coffee Table',
      price: 399,
      image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=200&h=200&fit=crop&crop=center'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SignedOut>
        <div className="text-center py-16">
          <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">Please sign in to view your account</h1>
          <SignInButton mode="modal">
            <Button className="bg-furniture-brown hover:bg-furniture-darkBrown">Sign In</Button>
          </SignInButton>
        </div>
      </SignedOut>
      <SignedIn>
      <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-8">
        My Account
      </h1>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Wishlist</span>
          </TabsTrigger>
        </TabsList>

        {/* Orders Tab */}
        <TabsContent value="orders">
          <Card className="border-furniture-sand">
            <CardHeader>
              <CardTitle className="font-inter">Order History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {orders.map((order) => (
                  <div key={order.id} className="border border-furniture-sand rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-inter font-semibold">Order {order.id}</h3>
                        <p className="text-sm text-gray-600">Placed on {order.date}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                        <p className="font-playfair font-bold text-lg mt-1">
                          ₹{order.total}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Items:</p>
                      <ul className="text-sm">
                        {order.items.map((item, index) => (
                          <li key={index} className="font-inter">• {item}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button variant="outline" size="sm">View Details</Button>
                      {order.status === 'Delivered' && (
                        <Button variant="outline" size="sm">Reorder</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Wishlist Tab */}
        <TabsContent value="wishlist">
          <Card className="border-furniture-sand">
            <CardHeader>
              <CardTitle className="font-inter">My Wishlist</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="border border-furniture-sand rounded-lg p-4">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={300}
                      height={192}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="font-inter font-semibold mb-2">{item.name}</h3>
                    <p className="font-playfair font-bold text-furniture-darkBrown mb-4">
                      ₹{item.price}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-furniture-brown hover:bg-furniture-darkBrown">
                        Add to Cart
                      </Button>
                      <Button variant="outline" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        
      </Tabs>
      </SignedIn>
    </div>
  );
};

export default Account;
