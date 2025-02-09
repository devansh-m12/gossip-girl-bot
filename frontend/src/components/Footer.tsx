"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter } from "lucide-react"

export function Footer() {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  return (
    <footer className="relative border-t border-pink-500/20 bg-black text-white transition-colors duration-300">
      <div className="container mx-auto px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold tracking-tight bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Stay Connected</h2>
            <p className="mb-6 text-gray-400">
              Join our newsletter for the latest Upper East Side gossip and exclusive secrets.
            </p>
            <form className="relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm bg-black/40 border-pink-500/20"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8 rounded-full bg-pink-500 text-white transition-transform hover:scale-105"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full bg-pink-500/10 blur-2xl" />
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Quick Links</h3>
            <nav className="space-y-2 text-sm">
              <a href="/" className="block transition-colors hover:text-pink-500">
                Home
              </a>
              <a href="/chat" className="block transition-colors hover:text-pink-500">
                Gossip Chat
              </a>
              <a href="/collection" className="block transition-colors hover:text-pink-500">
                NFT Collection
              </a>
              <a href="/privy" className="block transition-colors hover:text-pink-500">
                Privy Wallet
              </a>
              <a href="/feed" className="block transition-colors hover:text-pink-500">
                Feed
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Contact Us</h3>
            <address className="space-y-2 text-sm not-italic text-gray-400">
              <p>1136 Fifth Avenue</p>
              <p>New York, NY 10128</p>
              <p>Phone: (212) 555-0001</p>
              <p>Email: tips@gossipgirl.com</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">Follow Us</h3>
            <div className="mb-6 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://facebook.com/gossipgirl" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full border-pink-500/20 hover:border-pink-500/40">
                        <Facebook className="h-4 w-4 text-pink-500" />
                        <span className="sr-only">Facebook</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://twitter.com/gossipgirl" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full border-pink-500/20 hover:border-pink-500/40">
                        <Twitter className="h-4 w-4 text-pink-500" />
                        <span className="sr-only">Twitter</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://instagram.com/gossipgirl" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full border-pink-500/20 hover:border-pink-500/40">
                        <Instagram className="h-4 w-4 text-pink-500" />
                        <span className="sr-only">Instagram</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a href="https://linkedin.com/company/gossipgirl" target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="icon" className="rounded-full border-pink-500/20 hover:border-pink-500/40">
                        <Linkedin className="h-4 w-4 text-pink-500" />
                        <span className="sr-only">LinkedIn</span>
                      </Button>
                    </a>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4 text-pink-500" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4 text-pink-500" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-pink-500/20 pt-8 text-center md:flex-row">
          <p className="text-sm text-gray-400">
            © 2024 Gossip Girl. XOXO
          </p>
          <nav className="flex gap-4 text-sm">
            <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
              Terms of Service
            </a>
            <a href="#" className="text-gray-400 transition-colors hover:text-pink-500">
              Cookie Settings
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
} 