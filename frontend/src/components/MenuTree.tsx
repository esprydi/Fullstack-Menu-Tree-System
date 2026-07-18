"use client";

import React, { useState, useCallback } from 'react';
import { useMenu } from '../context/MenuContext';
import { ChevronRight, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { MenuData, menuApi } from '../services/api';
import toast from 'react-hot-toast';
import Modal from './Modal';

// Utility untuk mengecek apakah targetId adalah keturunan dari draggedId
const checkIsDescendant = (draggedId: string, targetId: string, trees: MenuData[]): boolean => {
  const findNode = (nodes: MenuData[]): MenuData | null => {
    for (const n of nodes) {
      if (n.id === draggedId) return n;
      if (n.children) {
        const found = findNode(n.children);
        if (found) return found;
      }
    }
    return null;
  };
  const draggedNode = findNode(trees);
  
  if (!draggedNode) return false;

  const searchChildren = (nodes: MenuData[]): boolean => {
    for (const n of nodes) {
      if (n.id === targetId) return true;
      if (n.children && searchChildren(n.children)) return true;
    }
    return false;
  };
  
  return searchChildren(draggedNode.children || []);
};

interface TreeNodeProps {
  node: MenuData;
  depth?: number;
  onAddChild: (node: MenuData) => void;
  onDeleteNode: (node: MenuData) => void;
}

const TreeNode = React.memo(({ node, depth = 0, onAddChild, onDeleteNode }: TreeNodeProps) => {
  const { selectedMenu, setSelectedMenu, refreshTrees, trees } = useMenu();
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isSelected = selectedMenu?.id === node.id;

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const draggedId = e.dataTransfer.getData('nodeId');
    if (!draggedId || draggedId === node.id) return;

    if (checkIsDescendant(draggedId, node.id, trees)) {
      toast.error('Tidak bisa memindahkan menu ke dalam sub-menunya sendiri!');
      return;
    }

    try {
      await menuApi.move(draggedId, node.id);
      await refreshTrees();
      toast.success('Berhasil memindahkan menu');
    } catch (err) {
      toast.error('Gagal memindahkan menu');
    }
  }, [node.id, trees, refreshTrees]);

  return (
    <div className="w-full">
      <div 
        draggable
        onDragStart={(e) => {
          e.stopPropagation();
          e.dataTransfer.setData('nodeId', node.id);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsDragOver(false);
        }}
        onDrop={handleDrop}
        className={`flex items-center py-2 px-2 rounded-lg cursor-pointer group transition-colors ${
          isDragOver ? 'bg-blue-100 ring-2 ring-blue-400' : isSelected ? 'bg-blue-50' : 'hover:bg-gray-100'
        }`}
        style={{ paddingLeft: `${depth * 24}px` }}
        onClick={() => setSelectedMenu(node)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="w-6 flex justify-center items-center mr-1 cursor-pointer text-gray-400 hover:text-gray-700"
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          {hasChildren ? (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />) : <span className="w-4" />}
        </div>
        
        <span className={`font-medium select-none ${isSelected ? 'text-[#1d4ed8]' : 'text-gray-700'}`}>
          {node.name}
        </span>

        {/* Action Buttons */}
        {(isHovered || isSelected) && (
          <div className="ml-4 flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node);
                setIsExpanded(true);
              }}
              className="w-6 h-6 rounded-full bg-[#1d4ed8] flex items-center justify-center text-white hover:bg-blue-800 transition-colors shadow-sm"
              title="Add Submenu"
            >
              <Plus size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node);
              }}
              className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 hover:bg-red-200 transition-colors"
              title="Delete Menu"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {isExpanded && hasChildren && (
        <div className="w-full relative">
          <div 
            className="absolute border-l border-gray-300"
            style={{ left: `${(depth * 24) + 11}px`, top: 0, bottom: '12px' }}
          />
          {node.children.map(child => (
            <div key={child.id} className="relative">
              <div 
                className="absolute border-t border-gray-300"
                style={{ left: `${(depth * 24) + 11}px`, top: '16px', width: '12px' }}
              />
              <TreeNode 
                node={child} 
                depth={depth + 1} 
                onAddChild={onAddChild} 
                onDeleteNode={onDeleteNode} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

TreeNode.displayName = 'TreeNode';

export default function MenuTree() {
  const { trees, isLoading, error, refreshTrees, selectedMenu, setSelectedMenu } = useMenu();

  // Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'addRoot' | 'addChild' | 'delete' | null;
    targetNode: MenuData | null;
  }>({ isOpen: false, type: null, targetNode: null });
  
  const [inputValue, setInputValue] = useState('');

  const openAddRoot = () => {
    setInputValue('');
    setModalConfig({ isOpen: true, type: 'addRoot', targetNode: null });
  };

  const openAddChild = useCallback((node: MenuData) => {
    setInputValue('');
    setModalConfig({ isOpen: true, type: 'addChild', targetNode: node });
  }, []);

  const openDeleteNode = useCallback((node: MenuData) => {
    setModalConfig({ isOpen: true, type: 'delete', targetNode: node });
  }, []);

  const handleModalConfirm = async () => {
    const { type, targetNode } = modalConfig;
    
    try {
      if (type === 'addRoot') {
        if (!inputValue.trim()) return toast.error('Nama tidak boleh kosong');
        await menuApi.create({ name: inputValue });
        toast.success('Root menu berhasil ditambahkan');
      } 
      else if (type === 'addChild' && targetNode) {
        if (!inputValue.trim()) return toast.error('Nama tidak boleh kosong');
        await menuApi.create({ name: inputValue, parentId: targetNode.id });
        toast.success('Submenu berhasil ditambahkan');
      } 
      else if (type === 'delete' && targetNode) {
        await menuApi.remove(targetNode.id);
        if (selectedMenu?.id === targetNode.id) setSelectedMenu(null);
        toast.success('Menu berhasil dihapus');
      }
      
      await refreshTrees();
      setModalConfig({ ...modalConfig, isOpen: false });
    } catch (err) {
      toast.error('Operasi gagal dilakukan');
    }
  };

  if (isLoading) return <div className="p-4 text-gray-500 animate-pulse">Memuat struktur pohon...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-700">Hierarchy</h3>
        <button 
          onClick={openAddRoot}
          className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center"
        >
          <Plus size={16} className="mr-1" />
          Add Root Menu
        </button>
      </div>

      {trees.length === 0 ? (
        <div className="text-gray-400 italic py-4">Belum ada menu. Silakan tambah root menu.</div>
      ) : (
        <div className="py-2 flex flex-col min-h-[300px]">
          <div className="flex-1">
            {trees.map(tree => (
              <TreeNode 
                key={tree.id} 
                node={tree} 
                onAddChild={openAddChild} 
                onDeleteNode={openDeleteNode} 
              />
            ))}
          </div>
          {/* Drop to Root Zone */}
          <div 
            className="w-full mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400 hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
            onDrop={async (e) => {
              e.preventDefault();
              const draggedId = e.dataTransfer.getData('nodeId');
              if (draggedId) {
                try {
                  await menuApi.move(draggedId, null);
                  await refreshTrees();
                  toast.success('Berhasil memindahkan ke root');
                } catch (err) {
                  toast.error('Gagal memindahkan ke root');
                }
              }
            }}
          >
            Drag & Drop menu here to move to Root Level
          </div>
        </div>
      )}

      {/* Global Modal for MenuTree */}
      <Modal 
        isOpen={modalConfig.isOpen} 
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={
          modalConfig.type === 'addRoot' ? 'Tambah Root Menu' :
          modalConfig.type === 'addChild' ? `Tambah Submenu untuk "${modalConfig.targetNode?.name}"` :
          'Hapus Menu'
        }
      >
        <div className="space-y-4">
          {modalConfig.type === 'delete' ? (
            <p className="text-gray-600">
              Apakah Anda yakin ingin menghapus <strong>"{modalConfig.targetNode?.name}"</strong> beserta seluruh sub-menunya?
            </p>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nama Menu</label>
              <input 
                type="text" 
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Masukkan nama menu..."
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleModalConfirm()}
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-3 mt-6">
            <button 
              onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
              className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors font-medium"
            >
              Batal
            </button>
            <button 
              onClick={handleModalConfirm}
              className={`px-4 py-2 text-white rounded-xl font-medium shadow-sm transition-colors ${
                modalConfig.type === 'delete' ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {modalConfig.type === 'delete' ? 'Hapus' : 'Simpan'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
