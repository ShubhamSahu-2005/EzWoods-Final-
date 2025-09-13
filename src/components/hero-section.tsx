"use client";
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { products } from '@/data/products';
import { useEffect, useState } from 'react';
import type { EmblaCarouselType } from 'embla-carousel';

const HeroSection = () => {
  // Get first 5 featured products for the carousel
  const carouselProducts = products.filter(product => product.featured).slice(0, 5);

  const [api, setApi] = useState<EmblaCarouselType | null>(null);
  const [current, setCurrent] = useState(0);

  // Debug: products
  console.log("[HeroSection] Featured products:", carouselProducts);

  // Auto-play functionality
  useEffect(() => {
    if (!api) {
      console.log("[HeroSection] Autoplay skipped — API not ready.");
      return;
    }

    console.log("[HeroSection] Autoplay started.");

    const interval = setInterval(() => {
      console.log("[HeroSection] Autoplay → scrollNext()");
      try {
        api.scrollNext();
      } catch (err) {
        console.error("[HeroSection] scrollNext error:", err);
      }
    }, 4000);

    return () => {
      console.log("[HeroSection] Clearing autoplay interval");
      clearInterval(interval);
    };
  }, [api]);

  // Track current slide
  useEffect(() => {
    if (!api) {
      console.log("[HeroSection] Tracking skipped — API not ready.");
      return;
    }

    const initialIndex = api.selectedScrollSnap();
    console.log("[HeroSection] Initial slide index:", initialIndex);
    setCurrent(initialIndex);

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap();
      console.log("[HeroSection] Slide changed →", newIndex);
      setCurrent(newIndex);
    };

    api.on("select", onSelect);

    return () => {
      console.log("[HeroSection] Removing 'select' listener");
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="relative min-h-[600px] md:h-[700px] bg-gradient-to-br from-furniture-cream via-furniture-sand to-furniture-cream overflow-hidden">
      {/* Debug overlay */}
      

      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 md:top-20 left-5 md:left-10 w-20 md:w-32 h-20 md:h-32 bg-furniture-sage rounded-full animate-pulse blur-xl"></div>
        <div className="absolute bottom-10 md:bottom-20 right-5 md:right-10 w-24 md:w-40 h-24 md:h-40 bg-furniture-brown rounded-full animate-pulse blur-xl delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 md:left-1/3 w-16 md:w-24 h-16 md:h-24 bg-furniture-darkBrown rounded-full animate-pulse blur-xl delay-500"></div>
      </div>

      <div className="container mx-auto px-4 h-full py-8 md:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[500px] md:h-full">
          
          {/* Left Column - Text Content */}
          <div className="space-y-6 md:space-y-8 animate-fade-in order-2 lg:order-1">
            <div className="flex items-center space-x-2 text-furniture-sage">
              <Sparkles className="w-4 md:w-5 h-4 md:h-5 animate-pulse" />
              <span className="text-xs md:text-sm font-inter font-medium tracking-wider uppercase">
                Premium Collection
              </span>
            </div>
            
            <h1 className="font-playfair text-4xl md:text-6xl lg:text-7xl font-bold text-furniture-darkBrown leading-tight">
              <span className="block opacity-0 animate-[fade-in_0.8s_ease-out_0.2s_forwards]">Luxury</span>
              <span className="block text-furniture-brown opacity-0 animate-[fade-in_0.8s_ease-out_0.4s_forwards]">
                Furniture
              </span>
              <span className="block text-xl md:text-3xl lg:text-4xl font-inter font-light text-furniture-charcoal mt-2 opacity-0 animate-[fade-in_0.8s_ease-out_0.6s_forwards]">
                for Modern Living
              </span>
            </h1>
            
            <p className="font-inter text-base md:text-lg text-furniture-charcoal max-w-md leading-relaxed opacity-0 animate-[fade-in_0.8s_ease-out_0.8s_forwards]">
              Discover our curated collection of premium furniture pieces that combine 
              timeless design with contemporary comfort and unmatched craftsmanship.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 lg:space-x-6 opacity-0 animate-[fade-in_0.8s_ease-out_1s_forwards]">
              <Link href="/shop">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-furniture-brown hover:bg-furniture-darkBrown font-inter text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl group"
                  onClick={() => console.log("[HeroSection] Shop Collection clicked")}
                >
                  Shop Collection
                  <ArrowRight className="ml-2 w-4 lg:w-5 h-4 lg:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto font-inter border-2 border-furniture-brown text-furniture-brown hover:bg-furniture-brown hover:text-white px-6 lg:px-8 py-3 lg:py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-xl"
                  onClick={() => console.log("[HeroSection] Browse Categories clicked")}
                >
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
          
          
          {/* Right Column - Carousel */}
          <div className="relative opacity-0 animate-[fade-in_1s_ease-out_0.5s_forwards] order-1 lg:order-2">
            <Carousel
              className="w-full max-w-sm md:max-w-md lg:max-w-lg mx-auto"
              setApi={(api) => {
                console.log("[HeroSection] Carousel API initialized:", api);
                setApi(api as EmblaCarouselType | null);
              }}
              opts={{
                align: "start",
                loop: true,
              }}
            >
              <CarouselContent>
                {carouselProducts.map((product, index) => (
                  <CarouselItem key={product.id}>
                    <Link
                      href={`/product/${product.id}`}
                      className="block group cursor-pointer"
                      onClick={() =>
                        console.log(`[HeroSection] Product clicked: ${product.name}`)
                      }
                    >
                      <div className="relative">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="rounded-2xl md:rounded-3xl shadow-2xl w-full h-[300px] md:h-[400px] lg:h-[500px] object-cover transition-all duration-700 group-hover:scale-105 group-hover:shadow-3xl"
                        />
                        
                        {/* Product Info Overlay */}
                        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 bg-white/95 backdrop-blur-md p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                          <h3 className="font-inter font-semibold text-furniture-darkBrown mb-1 text-sm md:text-base">
                            {product.name}
                          </h3>
                          <p className="font-inter text-xs md:text-sm text-gray-600 mb-2">
                            {product.category}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="font-inter font-bold text-furniture-brown text-sm md:text-base">
                              ${product.price}
                            </span>
                            <span className="text-xs text-furniture-sage bg-furniture-sage/10 px-2 py-1 rounded-full">
                              Click to view
                            </span>
                          </div>
                        </div>
                        
                        {/* Badge */}
                        <div className="absolute top-3 md:top-4 right-3 md:right-4 bg-furniture-brown/95 backdrop-blur-md text-white p-2 md:p-3 rounded-xl md:rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-furniture-darkBrown">
                          <p className="font-inter text-xs font-medium">#{index + 1}</p>
                          <p className="font-playfair text-xs md:text-sm font-bold">Featured</p>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              {/* Navigation Buttons */}
              <CarouselPrevious className="hidden md:flex left-2 lg:left-4 bg-white/90 backdrop-blur-md border-furniture-sand hover:bg-furniture-cream transition-all duration-300" />
              <CarouselNext className="hidden md:flex right-2 lg:right-4 bg-white/90 backdrop-blur-md border-furniture-sand hover:bg-furniture-cream transition-all duration-300" />
            </Carousel>
            
            {/* Indicators */}
            <div className="flex justify-center mt-4 space-x-2">
              {carouselProducts.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    console.log("[HeroSection] Indicator clicked →", index);
                    api?.scrollTo?.(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    current === index 
                      ? 'bg-furniture-brown scale-125' 
                      : 'bg-furniture-brown/30 hover:bg-furniture-brown/60'
                  }`}
                />
              ))}
            </div>
            
            {/* Floating Shipping Info */}
            <div className="absolute -bottom-4 md:-bottom-8 -left-4 md:-left-8 bg-white/95 backdrop-blur-md p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-furniture-sand">
              <div className="flex items-center space-x-3">
                <div className="w-2 md:w-3 h-2 md:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="font-inter text-xs md:text-sm font-semibold text-furniture-charcoal">
                    Free Shipping
                  </p>
                  <p className="font-inter text-xs text-gray-600">
                    on orders over $500
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
