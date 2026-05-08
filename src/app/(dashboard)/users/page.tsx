'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, User, UserPlus, Shield, Briefcase, Trash2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useData } from '@/contexts/DataContext';

interface UserData {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'pekerja_lapangan';
}

// Mock initial data
const initialUsers: UserData[] = [
  { id: '1', name: 'Administrator', username: 'admin', role: 'admin' },
  { id: '2', name: 'Pekerja Kebun', username: 'pekerja', role: 'pekerja_lapangan' },
];

export default function UsersPage() {
  const { t } = useSettings();
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'pekerja_lapangan' });

  const [editingData, setEditingData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const { withConfirm } = useData();

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    withConfirm(editingData ? 'edit' : 'add', async () => {
      const url = editingData ? `/api/users/${editingData.id}` : '/api/users';
      const method = editingData ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        import('react-hot-toast').then(({ default: toast }) => toast.success(`User berhasil ${editingData ? 'diperbarui' : 'ditambahkan'}!`));
        fetchUsers();
        setIsModalOpen(false);
        setEditingData(null);
        setFormData({ name: '', username: '', password: '', role: 'pekerja_lapangan' });
      } else {
        import('react-hot-toast').then(({ default: toast }) => toast.error(`Gagal ${editingData ? 'memperbarui' : 'menambahkan'} user`));
      }
    });
  };

  const handleDeleteUser = async (id: string) => {
    withConfirm('delete', async () => {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        import('react-hot-toast').then(({ default: toast }) => toast.success('User berhasil dihapus!'));
        setUsers(users.filter(u => u.id !== id));
      } else {
        import('react-hot-toast').then(({ default: toast }) => toast.error('Gagal menghapus user'));
      }
    });
  };

  const openEditModal = (user: UserData) => {
    setEditingData(user);
    setFormData({
      name: user.name,
      username: user.username,
      password: '', // Don't fill password
      role: user.role
    });
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingData(null);
    setFormData({ name: '', username: '', password: '', role: 'pekerja_lapangan' });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen User</h1>
          <p className="text-[var(--text-secondary)] mt-1">Kelola akses admin dan pekerja lapangan</p>
        </div>
        <Button onClick={openAddModal} className="gap-2 shadow-md">
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-light)] rounded-2xl p-4 sm:p-6 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[var(--text-secondary)] uppercase bg-[var(--bg-tertiary)] rounded-xl">
            <tr>
              <th className="px-6 py-4 font-semibold rounded-l-xl">Pengguna</th>
              <th className="px-6 py-4 font-semibold">Username</th>
              <th className="px-6 py-4 font-semibold">Role</th>
              <th className="px-6 py-4 font-semibold text-center rounded-r-xl" style={{ width: 100 }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[var(--border-light)] hover:bg-[var(--bg-tertiary)] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                      {user.role === 'admin' ? <Shield className="w-4 h-4" /> : <Briefcase className="w-4 h-4" />}
                    </div>
                    <span className="font-bold text-[var(--text-primary)]">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[var(--text-secondary)]">@{user.username}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-light)]">
                    {user.role === 'admin' ? 'Admin' : 'Pekerja Lapangan'}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => openEditModal(user)}
                      className="p-1.5 text-[var(--primary)] hover:bg-[var(--bg-primary)] rounded-md transition-colors"
                      title="Edit"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="p-1.5 text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-[var(--text-secondary)]">Belum ada pengguna</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit User Modal */}
      {(isModalOpen || editingData) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[var(--border-light)] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">{editingData ? 'Edit User' : 'Tambah User Baru'}</h2>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingData(null); }} 
                className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Nama Lengkap</label>
                <input 
                  type="text" required
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Username</label>
                <input 
                  type="text" required
                  value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Password {editingData && <span className="text-xs font-normal opacity-70">(Kosongkan jika tidak ingin diubah)</span>}</label>
                <input 
                  type="password" required={!editingData}
                  value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Role / Peran</label>
                <select 
                  value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-[var(--border-light)] bg-[var(--bg-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-[var(--text-primary)]"
                >
                  <option value="pekerja_lapangan">Pekerja Lapangan (Hanya Pembelian)</option>
                  <option value="admin">Admin (Akses Penuh)</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => { setIsModalOpen(false); setEditingData(null); }}>
                  Batal
                </Button>
                <Button type="submit" className="flex-1">
                  Simpan User
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
