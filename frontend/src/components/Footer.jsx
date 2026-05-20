import React from 'react'
import { Github, Twitter, Instagram } from 'lucide-react'
import logo from "./img.png";
export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-12 transition-all duration-300">
      <div className="app-container px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Branding */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="Logo"
                className="w-8 h-8 object-cover rounded-md opacity-90 brightness-115"
              />
              <span className="font-black text-lg text-white uppercase tracking-wider">CineNova</span>
            </div>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed font-semibold">
              Experience the perfect movie booking platform. Seamless, minimal, and fast.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-[10px]">Quick Links</h4>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <a href="/" className="text-slate-400 hover:text-pink-500 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/auth" className="text-slate-400 hover:text-pink-500 transition-colors">
                  Sign In
                </a>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-extrabold text-white mb-4 tracking-wider uppercase text-[10px]">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="p-2 -ml-2 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-full transition-all" title="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-full transition-all" title="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="p-2 text-slate-400 hover:text-pink-500 hover:bg-white/5 rounded-full transition-all" title="Github">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 font-semibold text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} CineNova. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
