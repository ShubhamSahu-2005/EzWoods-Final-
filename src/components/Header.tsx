"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Clerk imports
import { useUser, SignInButton, SignOutButton } from "@clerk/nextjs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const { state } = useCart();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`border-b border-furniture-sand/50 sticky top-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-white/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="font-playfair text-3xl font-bold text-furniture-darkBrown hover:text-furniture-brown transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative">
              Luxe Home
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-furniture-brown to-furniture-sage transform scale-x-0 hover:scale-x-100 transition-transform duration-300"></div>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-inter text-sm font-medium transition-all duration-300 hover:text-furniture-brown relative group ${
                  isActive(item.path)
                    ? "text-furniture-brown"
                    : "text-furniture-charcoal"
                }`}
              >
                {item.name}
                <span
                  className={`absolute -bottom-1 left-0 w-full h-0.5 bg-furniture-brown transform transition-transform duration-300 ${
                    isActive(item.path)
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                ></span>
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Auth */}
            <div className="hidden md:block">
              {isSignedIn && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-muted transition-all duration-300 rounded-full"
                    >
                      <User className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-xs text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account" className="w-full">
                        <User className="w-4 h-4 mr-2" />
                        My Account
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <SignOutButton>
                        <Button variant="ghost" className="w-full text-red-600 flex items-center space-x-2">
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </Button>
                      </SignOutButton>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-muted transition-all duration-300"
                    >
                      Sign In
                    </Button>
                  </SignInButton>
                  <SignInButton mode="modal">
                    <Button
                      size="sm"
                      className="bg-furniture-brown hover:bg-furniture-darkBrown"
                    >
                      Sign Up
                    </Button>
                  </SignInButton>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-muted transition-all duration-300 rounded-full"
              >
                <ShoppingCart className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                {state.itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {state.itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden hover:bg-muted transition-all duration-300 rounded-full"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-4 h-4 rotate-180 transition-transform duration-300" />
              ) : (
                <Menu className="w-4 h-4 transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100 py-6" : "max-h-0 opacity-0 py-0"
          } overflow-hidden border-t border-furniture-sand/50`}
        >
          <nav className="flex flex-col space-y-6">
            {navItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.path}
                className={`font-inter text-sm font-medium transition-all duration-300 hover:text-furniture-brown transform hover:translate-x-2 ${
                  isActive(item.path)
                    ? "text-furniture-brown"
                    : "text-furniture-charcoal"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {isSignedIn && user ? (
              <>
                <div className="px-3 py-2 bg-furniture-cream/50 rounded-lg">
                  <p className="text-sm font-medium text-furniture-darkBrown">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.emailAddresses[0].emailAddress}</p>
                </div>
                <Link
                  href="/account"
                  className="font-inter text-sm font-medium transition-all duration-300 hover:text-furniture-brown transform hover:translate-x-2 text-furniture-charcoal flex items-center space-x-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>My Account</span>
                </Link>
                <SignOutButton>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="font-inter text-sm font-medium transition-all duration-300 hover:text-red-600 transform hover:translate-x-2 text-furniture-charcoal flex items-center space-x-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </SignOutButton>
              </>
            ) : (
              <div className="flex flex-col space-y-4 pt-4 border-t border-furniture-sand">
                <SignInButton mode="modal">
                  <Button
                    size="sm"
                    className="bg-furniture-brown hover:bg-furniture-darkBrown text-white px-4 py-2 rounded-md text-center w-full"
                  >
                    Sign In / Sign Up
                  </Button>
                </SignInButton>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
