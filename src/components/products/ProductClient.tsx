"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Star, Heart, Truck, Shield, RotateCcw, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/components/ui/use-toast';
import ReviewForm from '@/components/reviews/ReviewForm';
import ReviewDisplay from '@/components/reviews/ReviewDisplay';
import { IProduct } from '@/models/product';
import { Review } from '@/types/product';

// Define the shape of the data coming from the review form
interface ReviewFormData {
  rating: number;
  title: string;
  comment: string;
  images?: File[];
}

// Mock reviews data now uses the Review type for consistency
const mockReviews: Review[] = [
  { id: '1', userId: 'user_abc123', userName: 'Sarah J.', rating: 5, title: 'Absolutely love this piece!', comment: 'The quality is exceptional and it looks even better in person.', verified: true, helpful: 12, createdAt: '2025-01-15' },
  { id: '2', userId: 'user_def456', userName: 'Mike C.', rating: 4, title: 'Great quality, fast delivery', comment: 'Really impressed with the build quality. Assembly was straightforward.', verified: true, helpful: 8, createdAt: '2025-01-10' }
];

// This is the Client Component that receives product data as a prop
const ProductClient = ({ product }: { product: IProduct }) => {
  const { addItem } = useCart();
  const { toast } = useToast();
  
  // Helper function to safely get product price
  const getProductPrice = (product: IProduct): number => {
    if (product.price && typeof product.price === 'object' && 'original' in product.price && typeof product.price.original === 'number') {
      return product.price.original;
    }
    if (typeof product.price === 'number') {
      return product.price;
    }
    return 0;
  };
  
  // State for interactive elements
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.material ? product.material[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  const handleAddToCart = () => {
    addItem(product, quantity, selectedColor);
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  // FIX: Replaced 'any' with the specific 'ReviewFormData' type
  const handleReviewSubmit = (reviewData: ReviewFormData) => {
    console.log('Review submitted:', reviewData);
    // In a real app, this would be a Server Action or an API call to save the review
    toast({ title: "Review Submitted", description: "Thank you for your feedback!" });
  };
  
  const features = [
    { icon: Truck, text: 'Free shipping on orders over ₹500' },
    { icon: Shield, text: '5-year warranty included' },
    { icon: RotateCcw, text: '30-day return policy' }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-furniture-cream">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover transition-opacity duration-300"
              priority // Prioritize loading the main product image
            />
          </div>
          <div className="flex space-x-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-furniture-brown' : 'border-furniture-sand hover:border-furniture-brown/50'
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="font-inter text-sm text-furniture-sage mb-2">{product.categoryName}</p>
            <h1 className="font-playfair text-3xl font-bold text-furniture-darkBrown mb-4">{product.name}</h1>
            <div className="flex items-center space-x-2 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="font-inter text-sm text-gray-600">4.5 ({product.reviews?.length || 0} reviews)</span>
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <span className="font-playfair text-3xl font-bold text-furniture-darkBrown">₹{getProductPrice(product).toFixed(2)}</span>
              {product.price?.discounted && (
                <span className="text-xl text-gray-500 line-through">₹{product.price.discounted.toFixed(2)}</span>
              )}
            </div>
          </div>

          <div>
            <p className="font-inter text-furniture-charcoal leading-relaxed">{product.description}</p>
          </div>

          {product.material && product.material.length > 0 && (
            <div>
              <h3 className="font-inter font-semibold mb-3">Color</h3>
              <Select value={selectedColor} onValueChange={setSelectedColor}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select a color" /></SelectTrigger>
                <SelectContent>
                  {product.material.map((material) => (<SelectItem key={material} value={material}>{material}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <h3 className="font-inter font-semibold mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-inter font-medium w-12 text-center text-lg">{quantity}</span>
              <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-4 pt-2">
            <Button onClick={handleAddToCart} disabled={product.stock <= 0} className="flex-1 bg-furniture-brown hover:bg-furniture-darkBrown font-inter" size="lg">
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button variant="outline" size="lg" onClick={() => setIsLiked(!isLiked)} className="px-6">
              <Heart className={`w-5 h-5 transition-all duration-300 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} />
            </Button>
          </div>
          
          <div className="space-y-3 pt-6 border-t border-furniture-sand">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <feature.icon className="w-5 h-5 text-furniture-sage" />
                <span className="font-inter text-sm text-furniture-charcoal">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Product Information Tabs */}
      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockReviews.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="specifications">
             <Card className="border-furniture-sand">
               <CardContent className="p-6">
                 <h3 className="font-playfair text-xl font-semibold mb-4">Specifications</h3>
                 <div className="space-y-3 text-sm">
                   {product.dimensions && (
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-gray-600">Dimensions (cm):</span>
                       <span className="font-medium">{`${product.dimensions.width} W x ${product.dimensions.depth} D x ${product.dimensions.height} H`}</span>
                     </div>
                   )}
                    {product.material && (
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-gray-600">Materials:</span>
                        <span className="font-medium">{product.material.join(', ')}</span>
                     </div>
                   )}
                 </div>
               </CardContent>
             </Card>
        </TabsContent>
        <TabsContent value="reviews">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <h3 className="font-playfair text-xl font-semibold mb-6">Customer Reviews</h3>
                    <ReviewDisplay reviews={mockReviews} />
                </div>
                <div>
                    <ReviewForm onSubmit={handleReviewSubmit} />
                </div>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductClient;

