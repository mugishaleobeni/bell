import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import heroSlide1 from '@/assets/hero-slide-1.jpg';
import heroSlide2 from '@/assets/hero-slide-2.jpg';
import heroSlide3 from '@/assets/hero-slide-3.jpg';

const heroSlides = [
  {
    id: 1,
    title: 'Summer Fashion Collection',
    subtitle: 'Discover the latest trends',
    description: 'Up to 50% off on selected items',
    image: heroSlide1,
    cta: 'Shop Now',
    link: '/category/fashion',
    gradient: 'from-pink-500/80 to-purple-600/80'
  },
  {
    id: 2,
    title: 'Tech Gadgets Sale',
    subtitle: 'Latest smartphones & laptops',
    description: 'Free shipping on orders over $100',
    image: heroSlide2,
    cta: 'Explore Tech',
    link: '/category/electronics',
    gradient: 'from-blue-600/80 to-cyan-500/80'
  },
  {
    id: 3,
    title: 'Home & Kitchen Essentials',
    subtitle: 'Transform your living space',
    description: 'Premium quality at unbeatable prices',
    image: heroSlide3,
    cta: 'Shop Home',
    link: '/category/home-kitchen',
    gradient: 'from-green-500/80 to-teal-600/80'
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const currentHero = heroSlides[currentSlide];

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden rounded-2xl">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={currentHero.image}
          alt={currentHero.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-in-out"
        />
        <div className={`absolute inset-0 bg-gradient-to-r ${currentHero.gradient}`} />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-2xl">
            <div className="glass-heavy rounded-2xl p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-warning" />
                <span className="text-sm font-medium text-warning uppercase tracking-wide">
                  {currentHero.subtitle}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {currentHero.title}
              </h1>
              
              <p className="text-xl text-white/90 mb-8">
                {currentHero.description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={currentHero.link}>
                  <Button size="xl" variant="hero" className="group">
                    <ShoppingBag className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    {currentHero.cta}
                  </Button>
                </Link>
                <Button size="xl" variant="glass" className="text-white border-white/30">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="glass"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 text-white border-white/30"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        variant="glass"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 text-white border-white/30"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}