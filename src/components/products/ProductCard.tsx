"use client"
import  Link  from 'next/link';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/types/product';
import { useCart } from '@/contexts/CartContext';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addItem(product);
    
    // Brief animation delay
    setTimeout(() => setIsAdding(false), 600);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    const wishlistData = {
      action: newLikedState ? 'ADD_TO_WISHLIST' : 'REMOVE_FROM_WISHLIST',
      productId: product.id,
      productName: product.name,
      productPrice: product.price,
      timestamp: new Date().toISOString()
    };

    console.log('Wishlist Action:', wishlistData);
  };

  return (
    <Card className="group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border-furniture-sand bg-white/80 backdrop-blur-sm">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-64 object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Sale Badge */}
          {product.originalPrice && (
            <div className="absolute top-3 left-3 bg-furniture-brown text-white px-3 py-1 text-xs font-medium rounded-full animate-pulse shadow-lg">
              Sale
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <Button
              variant="secondary"
              size="sm"
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 ${isLiked ? 'scale-110' : ''}`}
              onClick={handleLike}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-300 ${
                  isLiked 
                    ? 'fill-red-500 text-red-500 scale-110' 
                    : 'text-gray-600 hover:text-red-400'
                }`} 
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className={`w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 hover:scale-110 ${isAdding ? 'scale-95' : ''}`}
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <ShoppingCart className={`w-4 h-4 text-gray-600 transition-all duration-300 ${isAdding ? 'text-green-600' : 'hover:text-furniture-brown'}`} />
            </Button>
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-medium px-4 py-2 bg-black/30 rounded-full">Out of Stock</span>
            </div>
          )}
        </div>

        <CardContent className="p-6 bg-gradient-to-b from-white to-furniture-cream/10">
          <div className="flex items-center space-x-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 transition-all duration-300 ${
                  i < Math.floor(product.rating) 
                    ? 'fill-yellow-400 text-yellow-400 scale-110' 
                    : 'text-gray-300'
                }`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-2 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
              ({product.reviewCount})
            </span>
          </div>

          <h3 className="font-inter font-semibold text-furniture-charcoal mb-2 group-hover:text-furniture-brown transition-all duration-300 leading-tight">
            {product.name}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
            {product.category}
          </p>
          
          <div className="flex items-center space-x-3">
            <span className="font-playfair font-bold text-lg text-furniture-darkBrown group-hover:scale-105 transition-transform duration-300">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through opacity-60">
                ${product.originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
