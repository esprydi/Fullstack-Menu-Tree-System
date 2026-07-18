export const API_URL = process.env.NEXT_PUBLIC_API_URL;
if (!API_URL) {
  console.error("CRITICAL ERROR: NEXT_PUBLIC_API_URL is not defined in environment variables.");
}

export interface MenuData {
  id: string;
  name: string;
  order: number;
  children: MenuData[];
  parent?: MenuData | null;
}

export const menuApi = {
  getTrees: async (): Promise<MenuData[]> => {
    const res = await fetch(`${API_URL}/menus`);
    if (!res.ok) throw new Error('Failed to fetch menus');
    return res.json();
  },
  
  create: async (data: { name: string; parentId?: string | null; order?: number }) => {
    const res = await fetch(`${API_URL}/menus`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create menu');
    return res.json();
  },
  
  update: async (id: string, name: string) => {
    const res = await fetch(`${API_URL}/menus/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to update menu');
    return res.json();
  },
  
  remove: async (id: string) => {
    const res = await fetch(`${API_URL}/menus/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete menu');
    return res.json();
  },
  
  move: async (id: string, parentId: string | null) => {
    const res = await fetch(`${API_URL}/menus/${id}/move`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parentId }),
    });
    if (!res.ok) throw new Error('Failed to move menu');
    return res.json();
  },
  
  reorder: async (id: string, order: number) => {
    const res = await fetch(`${API_URL}/menus/${id}/reorder`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });
    if (!res.ok) throw new Error('Failed to reorder menu');
    return res.json();
  }
};
