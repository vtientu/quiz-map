"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Lang Cham"
              width={70}
              height={70}
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
            >
              Home
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
            >
              Community
            </a>
          </nav>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              className="border-red-800 text-red-800 hover:bg-red-50"
            >
              Support
            </Button>
            {user ? (
              <>
                <span className="text-sm text-gray-700">
                  {user.displayName || user.email}
                </span>
                <Button
                  variant="outline"
                  className="border-red-800 text-red-800 hover:bg-red-50"
                  onClick={() => logout()}
                >
                  Đăng xuất
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  className="border-red-800 text-red-800 hover:bg-red-50"
                  onClick={() => router.push("/login")}
                >
                  Log in
                </Button>
                <Button
                  className="bg-red-800 hover:bg-red-900 text-white"
                  onClick={() => router.push("/register")}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50 rounded-lg mt-2">
              <a
                href="#"
                className="text-gray-700 hover:text-red-800 block px-3 py-2 text-base font-medium"
              >
                News
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-800 block px-3 py-2 text-base font-medium"
              >
                FAQ
              </a>
              <a
                href="#"
                className="text-gray-700 hover:text-red-800 block px-3 py-2 text-base font-medium"
              >
                Contact
              </a>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-800 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">LC</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      Lang Cham
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Button
                    variant="outline"
                    className="w-full border-red-800 text-red-800 hover:bg-red-50 mb-2"
                  >
                    Support
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-red-800 text-red-800 hover:bg-red-50 mb-2"
                    onClick={() => router.push("/login")}
                  >
                    Log in
                  </Button>
                  <Button
                    className="w-full bg-red-800 hover:bg-red-900 text-white"
                    onClick={() => router.push("/register")}
                  >
                    Sign Up
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
