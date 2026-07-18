"use client";

import Link from "next/link";
import { Folder, Grid, LayoutTemplate, Layers, Users, Trophy, Menu as MenuIcon, X } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDesktopClosed, setIsDesktopClosed] = useState(false);

  return (
    <>
      {/* Hamburger Button (Mobile always, Desktop if closed) */}
      <button 
        onClick={() => { setIsOpen(true); setIsDesktopClosed(false); }}
        className={`fixed top-6 left-6 lg:top-6 lg:left-8 z-[100] p-2 bg-[#0f52ba] text-white rounded-lg shadow-lg cursor-pointer ${
          isOpen ? 'hidden' : 'flex'
        } ${
          isDesktopClosed ? 'lg:flex' : 'lg:hidden'
        }`}
      >
        <Image src="/menu_open.svg" alt="Open Menu" width={24} height={24} />
      </button>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <div className={`fixed lg:sticky top-4 left-0 z-50 w-[280px] bg-[#0f52ba] text-white h-[calc(100vh-32px)] m-4 rounded-[24px] flex flex-col shadow-xl transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-[120%]'
      } ${
        isDesktopClosed ? 'lg:-translate-x-[120%] lg:w-0 lg:m-0 lg:opacity-0' : 'lg:translate-x-0'
      }`}>
        {/* Logo Area */}
        <div className="h-24 flex items-center px-8 justify-between">
            <Image src="/logo-stk.svg" alt="Logo STK" width={80} height={50} />
          <button onClick={() => { setIsOpen(false); setIsDesktopClosed(true); }} className="p-1 opacity-70 hover:opacity-100 transition-opacity">
            <Image src="/menu_open_24dp_FILL0_wght400_GRAD0_opsz24.svg" alt="Close Menu" width={24} height={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
          <SidebarItem icon={<Image src="/folder_24dp_FILL1_wght400_GRAD0_opsz24.svg" alt="Folder" width={24} height={24} />} text="Systems" />
          <SidebarItem icon={<Image src="/submenu.svg" alt="Menu" width={24} height={24} />} text="System Code" />
          <SidebarItem icon={<Image src="/submenu-2.svg" alt="Menu" width={20} height={20} />} text="Properties" />
          
          {/* Active Item */}
          <Link
            href="/"
            className="flex items-center gap-4 px-4 py-3 bg-white text-black rounded-2xl font-bold transition-all shadow-sm"
          >
            <Image src="/submenu-3.svg" alt="Menus" width={24} height={24} />
            Menus
          </Link>
          
          <SidebarItem icon={<Layers size={20} />} text="API List" />
          
          <div className="my-4 border-t border-blue-400/30 w-full"></div>
          
          <SidebarItem icon={<Users size={20} />} text="Users & Group" />
          <SidebarItem icon={<Trophy size={20} />} text="Competition" />
        </nav>
      </div>
    </>
  );
}

function SidebarItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <Link
      href="#"
      className="flex items-center px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-2xl font-medium transition-colors"
    >
      <div className="mr-4">{icon}</div>
      {text}
    </Link>
  );
}
