
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Package, Heart, Trash2 } from 'lucide-react';
import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import { IProduct } from '@/models/product';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
 

const Account = () => {
  const { wishlist, removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [wishlistProducts, setWishlistProducts] = useState<Array<{
    _id: string;
    name: string;
    images: string[];
    price: {
      original: number;
      discounted?: number;
    };
  }>>([]);

  // Fetch wishlist products
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      try {
        const response = await fetch('/api/wishlist');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setWishlistProducts(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching wishlist products:', error);
      }
    };

    fetchWishlistProducts();
  }, [wishlist]);

  const handleAddToCart = (product: {
    _id: string;
    name: string;
    images: string[];
    price: {
      original: number;
      discounted?: number;
    };
  }) => {
    // Create a minimal IProduct-compatible object
    const productForCart = {
      _id: product._id,
      name: product.name,
      description: '',
      category: '',
      categoryName: '',
      price: product.price,
      stock: 1,
      dimensions: { height: 0, width: 0, depth: 0, unit: 'cm' },
      material: [],
      images: product.images,
      status: 'active' as const,
      reviews: []
    };
    addItem(productForCart as unknown as IProduct, 1);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleRemoveFromWishlist = async (productId: string) => {
    await removeFromWishlist(productId);
  };

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
              {wishlistLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading wishlist...</p>
                </div>
              ) : wishlistProducts.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Your wishlist is empty</p>
                  <Link href="/shop">
                    <Button className="bg-furniture-brown hover:bg-furniture-darkBrown">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wishlistProducts.map((product) => (
                    <div key={product._id} className="border border-furniture-sand rounded-lg p-4">
                      <Link href={`/products/${product._id}`}>
                        <Image
                          src={product.images[0] || '/placeholder-image.svg'}
                          alt={product.name}
                          width={300}
                          height={192}
                          className="w-full h-48 object-cover rounded-lg mb-4 hover:opacity-90 transition-opacity"
                        />
                      </Link>
                      <h3 className="font-inter font-semibold mb-2">{product.name}</h3>
                      <p className="font-playfair font-bold text-furniture-darkBrown mb-4">
                        ₹{product.price.original}
                        {product.price.discounted && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{product.price.discounted}
                          </span>
                        )}
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          className="flex-1 bg-furniture-brown hover:bg-furniture-darkBrown"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleRemoveFromWishlist(product._id)}
                          disabled={wishlistLoading}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        
      </Tabs>
      </SignedIn>
    </div>
  );
};

export default Account;
