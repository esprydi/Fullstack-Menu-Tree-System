import { Folder, Grid } from "lucide-react";
import MenuTree from "@/components/MenuTree";
import MenuForm from "@/components/MenuForm";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 w-full max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Image src="/folder.svg" alt="Icon Folder" width={21} height={21} className="mr-2" />
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium">Menus</span>
      </div>

      {/* Page Title */}
      <div className="flex items-center mb-8">
        <Image src="/icon-title.svg" alt="Icon Title" width={48} height={48} className="mr-4" />
        <h1 className="text-3xl font-extrabold text-slate-800">Menus</h1>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row gap-12 mt-6">
        
        {/* Left Column: Tree View */}
        <div className="flex-1">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-2">Menu</p>
            <select className="w-full md:w-80 p-3 bg-gray-50 border-none rounded-xl text-gray-700 focus:ring-2 focus:ring-blue-500 outline-none appearance-none cursor-pointer">
              <option>systemmanagement</option>
              <option>usersandgroups</option>
            </select>
          </div>

          <div className="flex gap-3 mb-8">
            <button className="px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-full hover:bg-slate-800 transition-colors">
              Expand All
            </button>
            <button className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 transition-colors shadow-sm">
              Collapse All
            </button>
          </div>

          {/* Tree Component */}
          <div className="pl-2">
            <MenuTree />
          </div>
        </div>

        {/* Right Column: Form Area */}
        <MenuForm />

      </div>
    </div>
  );
}
