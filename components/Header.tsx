"use client";

import Image from "next/image";
import { useState } from "react";
import logo from "./assets/houZeboysLogo.webp";

const navLinks = [
  { label: "Listen & Follow", href: "#socials" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#0f0f0f]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="/" aria-label="Houseboys home" className="shrink-0">
          <Image
            src={logo}
            alt="Houseboys logo"
            height={40}
            width={40}
            className="rounded-xl object-contain"
            priority
          />
        </a>

        {/* Desktop nav — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 ml-auto">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="relative text-sm font-semibold tracking-wide text-[#9ca3af] transition-colors duration-200 hover:text-white
                         after:absolute after:bottom-[-3px] after:left-0 after:h-px after:w-0 after:bg-white
                         after:transition-all after:duration-300 hover:after:w-full"
            >
              {label}
            </a>
          ))}

          {/* CTA */}
          <a
            href="#join"
            className="text-sm font-extrabold bg-white text-[#0f0f0f] px-5 py-2 rounded-full
                       hover:bg-[#d1d5db] transition-colors duration-200 active:scale-95"
          >
            Join Us
          </a>
        </nav>

        {/* Hamburger — visible on mobile only */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="md:hidden ml-auto p-2 -mr-2 text-[#9ca3af] hover:text-white transition-colors"
        >
          {open ? <XIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="border-t border-white/[0.06] bg-[#0f0f0f] flex flex-col px-6 pb-5 pt-3 gap-0">
          {navLinks.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-[#9ca3af] hover:text-white py-4 border-b border-white/[0.06] transition-colors"
            >
              {label}
            </a>
          ))}
          <a
            href="#join"
            onClick={() => setOpen(false)}
            className="mt-4 text-center text-sm font-extrabold bg-white text-[#0f0f0f] py-3 rounded-full
                       hover:bg-[#d1d5db] transition-colors active:scale-95"
          >
            Join Us
          </a>
        </nav>
      </div>
    </header>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
