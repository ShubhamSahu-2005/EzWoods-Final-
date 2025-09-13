
import { Product } from '@/types/product';

export const products: Product[] = [
  {
    id: '1',
    name: 'Modern Sectional Sofa',
    price: 1299,
    originalPrice: 1599,
    description: 'A luxurious modern sectional sofa with premium fabric upholstery and ergonomic design. Perfect for contemporary living spaces.',
    category: 'Living Room',
    subCategory: 'Sofas',
    images: [
      'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: true,
    rating: 4.8,
    reviewCount: 24,
    dimensions: { width: 240, height: 85, depth: 160 },
    materials: ['Premium Fabric', 'Hardwood Frame', 'High-Density Foam'],
    colors: ['Charcoal', 'Beige', 'Navy'],
    featured: true
  },
  {
    id: '2',
    name: 'Rustic Dining Table',
    price: 899,
    description: 'Handcrafted solid wood dining table with rustic finish. Seats up to 6 people comfortably.',
    category: 'Dining Room',
    subCategory: 'Tables',
    images: [
      'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: true,
    rating: 4.6,
    reviewCount: 18,
    dimensions: { width: 180, height: 75, depth: 90 },
    materials: ['Solid Oak Wood', 'Natural Oil Finish'],
    colors: ['Natural', 'Dark Walnut'],
    featured: true
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    price: 449,
    originalPrice: 549,
    description: 'Professional ergonomic office chair with lumbar support and breathable mesh back.',
    category: 'Office',
    subCategory: 'Chairs',
    images: [
      'https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: true,
    rating: 4.7,
    reviewCount: 32,
    dimensions: { width: 65, height: 120, depth: 65 },
    materials: ['Mesh', 'Aluminum Base', 'Memory Foam'],
    colors: ['Black', 'Gray', 'White'],
    featured: false
  },
  {
    id: '4',
    name: 'King Size Platform Bed',
    price: 1099,
    description: 'Minimalist platform bed with built-in nightstands and LED lighting.',
    category: 'Bedroom',
    subCategory: 'Beds',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: true,
    rating: 4.9,
    reviewCount: 15,
    dimensions: { width: 200, height: 35, depth: 210 },
    materials: ['Engineered Wood', 'LED Strips', 'Metal Hardware'],
    colors: ['White', 'Black', 'Walnut'],
    featured: true
  },
  {
    id: '5',
    name: 'Vintage Armchair',
    price: 649,
    description: 'Classic vintage-style armchair with button tufting and wooden legs.',
    category: 'Living Room',
    subCategory: 'Chairs',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: false,
    rating: 4.5,
    reviewCount: 12,
    dimensions: { width: 75, height: 95, depth: 80 },
    materials: ['Velvet Upholstery', 'Solid Wood Legs', 'Button Tufting'],
    colors: ['Emerald', 'Navy', 'Burgundy'],
    featured: false
  },
  {
    id: '6',
    name: 'Glass Coffee Table',
    price: 399,
    description: 'Modern glass coffee table with chrome legs and tempered glass top.',
    category: 'Living Room',
    subCategory: 'Tables',
    images: [
      'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&crop=center',
      'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=800&h=600&fit=crop&crop=center'
    ],
    inStock: true,
    rating: 4.3,
    reviewCount: 8,
    dimensions: { width: 120, height: 45, depth: 60 },
    materials: ['Tempered Glass', 'Chrome Steel'],
    colors: ['Clear', 'Smoked'],
    featured: false
  }
];

export const categories = [
  'All',
  'Living Room',
  'Dining Room',
  'Bedroom',
  'Office',
  'Storage'
];

export const priceRanges = [
  { label: 'Under $500', min: 0, max: 500 },
  { label: '$500 - $1000', min: 500, max: 1000 },
  { label: '$1000 - $1500', min: 1000, max: 1500 },
  { label: 'Over $1500', min: 1500, max: Infinity }
];
