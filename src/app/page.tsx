
import HeroSection from '@/components/hero-section';
import ProductGrid from '@/components/products/ProductGrid';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/data/products';
import  Link  from 'next/link';
import { Truck, Shield, Headphones, RotateCcw } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.filter(product => product.featured);

  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $500'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '5-year warranty on all products'
    },
    {
      icon: RotateCcw,
      title: 'Easy Returns',
      description: '30-day return policy'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Customer support available anytime'
    }
  ];

  return (


    <div className="animate-fade-in">
      {/* Hero Section */}
      <HeroSection />
     


      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-white to-furniture-cream/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="text-center border-furniture-sand/50 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="p-8">
                  <div className="relative inline-block mb-6">
                    <feature.icon className="w-12 h-12 text-furniture-sage mx-auto group-hover:scale-110 transition-all duration-300 group-hover:text-furniture-brown" />
                    <div className="absolute inset-0 bg-furniture-sage/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500"></div>
                  </div>
                  <h3 className="font-inter font-semibold text-furniture-darkBrown mb-3 group-hover:text-furniture-brown transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 font-inter leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-b from-furniture-cream/30 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-sm font-inter font-medium tracking-wider uppercase text-furniture-sage bg-furniture-sage/10 px-4 py-2 rounded-full">
                Handpicked Selection
              </span>
            </div>
            <h2 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">
              Featured Products
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-furniture-brown to-furniture-sage mx-auto mb-6"></div>
            <p className="font-inter text-lg text-furniture-charcoal max-w-2xl mx-auto leading-relaxed">
              Discover our handpicked selection of premium furniture pieces crafted with 
              exceptional attention to detail and timeless design principles.
            </p>
          </div>
          
          <div className="opacity-0 animate-[fade-in_1s_ease-out_0.3s_forwards]">
            <ProductGrid products={featuredProducts} />
          </div>
          
          <div className="text-center mt-16">
            <Link href="/shop">
              <Button size="lg" className="bg-furniture-brown hover:bg-furniture-darkBrown font-inter px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group">
                View All Products
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-300">→</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-white to-furniture-cream/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-5xl font-bold text-furniture-darkBrown mb-6">
              Shop by Category
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-furniture-brown to-furniture-sage mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Living Room',
                image: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=500&h=400&fit=crop&crop=center',
                count: '45+ Items'
              },
              {
                name: 'Bedroom',
                image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=500&h=400&fit=crop&crop=center',
                count: '32+ Items'
              },
              {
                name: 'Dining Room',
                image: 'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=500&h=400&fit=crop&crop=center',
                count: '28+ Items'
              }
            ].map((category, index) => (
              <Link 
                key={index} 
                href={`/shop?category=${category.name}`}
                className="group block"
              >
                <Card className="overflow-hidden border-furniture-sand/50 group-hover:shadow-2xl transition-all duration-700 hover:-translate-y-3 bg-white/90 backdrop-blur-sm">
                  <div className="relative">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                    <div className="absolute bottom-8 left-8 text-white transform group-hover:translate-y-[-8px] transition-transform duration-500">
                      <h3 className="font-playfair text-3xl font-bold mb-2">
                        {category.name}
                      </h3>
                      <p className="font-inter text-sm opacity-90">
                        {category.count}
                      </p>
                      <div className="w-12 h-0.5 bg-white mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 delay-200"></div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
