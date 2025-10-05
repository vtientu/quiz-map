import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Apple, Play } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Product Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Product
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Solutions
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Education
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Team plans
                </a>
              </li>
            </ul>
          </div>

          {/* About us Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              About us
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Branding
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Newsroom
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Partnerships
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Affiliates
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Help and support Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Help and support
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Help center
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Contact us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Privacy & Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Safety information
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Sitemap
                </a>
              </li>
            </ul>
          </div>

          {/* Community Column */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Community
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Agencies
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Freelancers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-600 hover:text-red-800 transition-colors"
                >
                  Engineers
                </a>
              </li>
            </ul>
          </div>

          {/* App Download Buttons */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Download Apps
            </h3>
            <div className="space-y-3">
              <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2">
                <Apple className="h-5 w-5" />
                <span className="text-sm">Download on the App Store</span>
              </Button>
              <Button className="w-full bg-black hover:bg-gray-800 text-white flex items-center justify-center space-x-2">
                <Play className="h-5 w-5" />
                <span className="text-sm">GET IT ON Google Play</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div className="bg-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            {/* Copyright */}
            <div className="text-white text-sm">© Copyright TuDev</div>

            {/* Legal Links */}
            <div className="flex space-x-6">
              <a
                href="#"
                className="text-white hover:text-gray-300 text-sm transition-colors"
              >
                Help
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 text-sm transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-white hover:text-gray-300 text-sm transition-colors"
              >
                Terms
              </a>
            </div>

            {/* Social Media and Language */}
            <div className="flex items-center space-x-4">
              <div className="flex space-x-3">
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="text-white hover:text-gray-300 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
