"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@aquantica/ui/button";

export function PortalHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/10 bg-navy/95 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="lg:hidden text-white">
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link href="/portal" className="flex items-center gap-2">
          <svg className="w-8 h-8" viewBox="0 0 44 44" fill="none">
            <polygon
              points="22,4 38,36 6,36"
              fill="none"
              stroke="#c9a84c"
              strokeWidth="2"
            />
            <polygon
              points="22,10 34,32 10,32"
              fill="rgba(201,168,76,.1)"
              stroke="#c9a84c"
              strokeWidth="1"
            />
          </svg>
          <span className="font-serif text-lg font-bold text-gold hidden sm:block">
            AQUANTICA
          </span>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-white/60 hover:text-white relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-gold rounded-full" />
          </Button>
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9 border-2 border-gold/30",
              },
            }}
          />
        </div>
      </div>
    </header>
  );
}
