"use client";

import React, { useState, useEffect } from 'react';
import { useMenu } from '../context/MenuContext';
import { menuApi } from '../services/api';
import toast from 'react-hot-toast';

export default function MenuForm() {
  const { selectedMenu, refreshTrees } = useMenu();
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (selectedMenu) {
      setName(selectedMenu.name);
    } else {
      setName('');
    }
  }, [selectedMenu]);

  const handleSave = async () => {
    if (!selectedMenu || !name.trim()) return;
    setIsSaving(true);
    try {
      await menuApi.update(selectedMenu.id, name);
      await refreshTrees();
      toast.success('Berhasil disimpan!');
    } catch (err) {
      toast.error('Gagal menyimpan menu');
    } finally {
      setIsSaving(false);
    }
  };

  const calculateDepth = (menu: any, depth = 1): number => {
    if (!menu.parent) return depth;
    return calculateDepth(menu.parent, depth + 1);
  };

  if (!selectedMenu) {
    return (
      <div className="w-full md:w-[450px] flex items-center justify-center p-8 bg-white rounded-3xl shadow-sm border border-gray-100 min-h-[300px]">
        <p className="text-gray-400 italic">Pilih menu dari pohon di sebelah kiri untuk melihat detail.</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[450px]">
      <div className="space-y-5">
        <div>
          <label className="block text-sm text-gray-500 mb-2 font-medium">Menu ID</label>
          <input 
            type="text" 
            disabled 
            className="w-full p-3.5 bg-gray-50/80 rounded-2xl text-gray-500 border-none outline-none font-mono text-sm" 
            value={selectedMenu.id || ''}
          />
        </div>
        
        <div>
          <label className="block text-sm text-gray-500 mb-2 font-medium">Depth</label>
          <input 
            type="text" 
            disabled 
            className="w-full md:w-2/3 p-3.5 bg-gray-100 rounded-2xl text-gray-700 border-none outline-none font-semibold" 
            value={calculateDepth(selectedMenu)}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2 font-medium">Parent Data</label>
          <input 
            type="text" 
            disabled 
            className="w-full p-3.5 bg-gray-50 rounded-2xl text-gray-700 border-none outline-none" 
            value={selectedMenu.parent?.name || 'Root'}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-500 mb-2 font-medium">Name</label>
          <input 
            type="text" 
            className="w-full p-3.5 bg-white rounded-2xl text-gray-700 border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all" 
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="w-full md:w-2/3 mt-4 px-6 py-4 bg-[#1d4ed8] text-white font-bold rounded-full hover:bg-blue-800 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
}
