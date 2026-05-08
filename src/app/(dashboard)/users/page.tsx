'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plus, User, UserPlus, Shield, Briefcase, Trash2 } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      fetchUsers();
      setIsModalOpen(false);
      setFormData({ name: '', username: '', password: '', role: 'pekerja_lapangan' });
    } else {
      alert('Gagal menambahkan user');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== id));
      } else {
        alert('Gagal menghapus user');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Manajemen User</h1>
          <p className="text-[var(--text-secondary)] mt-1">Kelola akses admin dan pekerja lapangan</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2 shadow-md">
          <UserPlus className="h-4 w-4" />
          Tambah User
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="overflow-hidden border border-[var(--border-light)] hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-green-100 text-green-600'}`}>
                    {user.role === 'admin' ? <Shield className="w-6 h-6" /> : <Briefcase className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-lg">{user.name}</h3>
                    <p className="text-[var(--text-secondary)] text-sm">@{user.username}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteUser(user.id)}
                  className="p-2 text-[var(--text-tertiary)] hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-light)]">
                {user.role === 'admin' ? 'Admin' : 'Pekerja Lapangan'}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[var(--bg-secondary)] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-[var(--border-light)] flex justify-between items-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Tambah User Baru</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[var(--text-tertiary)] hover:text-[var(--text-primary)]">
                &times;
              </button>
            </div>
            <form onSubmit={handleAddUser} className="p-6 space-y-4">
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
                <label className="text-sm font-semibold text-[var(--text-secondary)]">Password</label>
                <input 
                  type="password" required
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
                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>
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
