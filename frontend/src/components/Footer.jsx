import React from 'react'
import { Github, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">B</span>
              </div>
              <span className="font-bold text-lg text-white">CineNova</span>
            </div>
            <p className="text-sm">Your favorite movie booking platform. Book tickets instantly.</p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-white transition">
                  Home
                </a>
              </li>
              <li>
                <a href="/auth" className="hover:text-white transition">
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="hover:text-rose-600 transition"
                title="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-rose-600 transition"
                title="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="hover:text-rose-600 transition"
                title="Github"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 pt-8">
          <p className="text-sm text-center">
            © {new Date().getFullYear()} CineNova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
