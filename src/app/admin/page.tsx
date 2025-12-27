"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ClipboardList, 
  ExternalLink, 
  FileText, 
  Image as ImageIcon,
  LogOut,
  ChevronRight,
  User,
  Calendar,
  DollarSign,
  Database,
  Trash2,
  Plus
} from 'lucide-react';
import { toast } from 'sonner';

type ProjectRequest = {
  id: string;
  customer_name: string;
  budget: string;
  description: string;
  notes: string;
  brief_url: string;
  image_urls: string[];
  status: string;
  created_at: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type KBDocument = {
  id: string;
  title: string;
  source: string;
  chunk_count: number;
  created_at: string;
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'requests' | 'messages' | 'kb'>('requests');
  const [requests, setRequests] = useState<ProjectRequest[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [kbDocs, setKBDocs] = useState<KBDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [showAddKB, setShowAddKB] = useState(false);
  const [newKB, setNewKB] = useState({ title: '', content: '', source: '' });
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        toast.error('Unauthorized access');
        router.push('/');
        return;
      }

      setUser(user);
      fetchData();
    };
    checkUser();
  }, [router]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: reqData } = await supabase
        .from('project_requests')
        .select('*')
        .order('created_at', { ascending: false });
      setRequests(reqData || []);

      const { data: msgData } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      setMessages(msgData || []);

      const kbRes = await fetch('/api/kb/documents');
      const kbData = await kbRes.json();
      setKBDocs(kbData || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKB = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsActionLoading(true);
    try {
      const res = await fetch('/api/kb/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newKB),
      });
      if (!res.ok) throw new Error('Failed to add document');
      toast.success('Document added and indexed');
      setNewKB({ title: '', content: '', source: '' });
      setShowAddKB(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDeleteKB = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document? All associated chunks will be removed.')) return;
    setIsActionLoading(true);
    try {
      const res = await fetch(`/api/kb/documents/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete document');
      toast.success('Document deleted');
      fetchData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center font-mono">
        <div className="animate-pulse tracking-[0.3em] uppercase text-xs">Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-mono text-foreground flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-border flex flex-col">
        <div className="p-8 border-b border-border">
          <h1 className="text-xl font-bold tracking-tighter uppercase">5+1 ADMIN</h1>
          <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Management Portal</p>
        </div>

        <nav className="flex-grow p-4 space-y-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-all ${
              activeTab === 'requests' 
                ? 'bg-black text-white' 
                : 'hover:bg-muted text-muted-foreground'
            }`}
          >
            <ClipboardList size={16} />
            Project Requests
          </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-all ${
                activeTab === 'messages' 
                  ? 'bg-black text-white' 
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <MessageSquare size={16} />
              Contact Messages
            </button>
            <button
              onClick={() => setActiveTab('kb')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest transition-all ${
                activeTab === 'kb' 
                  ? 'bg-black text-white' 
                  : 'hover:bg-muted text-muted-foreground'
              }`}
            >
              <Database size={16} />
              Knowledge Base
            </button>

        </nav>

        <div className="p-4 mt-auto border-t border-border">
          <div className="flex items-center gap-3 px-4 py-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User size={14} />
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase font-bold truncate">{user?.email}</p>
              <p className="text-[8px] opacity-40 uppercase">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-8 md:p-12 overflow-y-auto max-h-screen">
          <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl font-bold uppercase tracking-tight mb-2">
                {activeTab === 'requests' ? 'Project Requests' : activeTab === 'messages' ? 'Contact Messages' : 'Knowledge Base'}
              </h2>
              <p className="text-xs opacity-50 uppercase tracking-[0.2em]">
                {activeTab === 'kb' 
                  ? 'Manage training data for the AI Assistant'
                  : `Overview of all incoming ${activeTab === 'requests' ? 'client vision submissions' : 'inquiries'}`}
              </p>
            </div>
            <div className="flex gap-4">
              {activeTab === 'kb' && (
                <button
                  onClick={() => setShowAddKB(!showAddKB)}
                  className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-primary transition-colors"
                >
                  <Plus size={16} />
                  Add Document
                </button>
              )}
              <div className="bg-white border border-border px-6 py-3 text-center min-w-[120px]">
                <p className="text-[8px] opacity-40 uppercase mb-1">Total {activeTab === 'requests' ? 'Requests' : activeTab === 'messages' ? 'Messages' : 'Documents'}</p>
                <p className="text-xl font-bold">
                  {activeTab === 'requests' ? requests.length : activeTab === 'messages' ? messages.length : kbDocs.length}
                </p>
              </div>
            </div>
          </header>

          {activeTab === 'kb' && showAddKB && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 bg-white border border-black p-8"
            >
              <h3 className="text-xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
                <Database size={20} /> New Knowledge Document
              </h3>
              <form onSubmit={handleAddKB} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Document Title</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Studio Philosophy 2025"
                      className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                      value={newKB.title}
                      onChange={e => setNewKB({...newKB, title: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Source (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. philosophy.pdf"
                      className="w-full bg-transparent border-b border-border py-2 focus:border-black outline-none transition-colors"
                      value={newKB.source}
                      onChange={e => setNewKB({...newKB, source: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest opacity-40">Content</label>
                  <textarea
                    required
                    rows={8}
                    placeholder="Paste your knowledge base content here..."
                    className="w-full bg-muted/30 border border-border p-4 focus:border-black outline-none transition-colors text-sm leading-relaxed"
                    value={newKB.content}
                    onChange={e => setNewKB({...newKB, content: e.target.value})}
                  />
                  <p className="text-[10px] opacity-40 uppercase italic">Document will be automatically chunked for optimal AI retrieval.</p>
                </div>
                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddKB(false)}
                    className="px-6 py-3 text-xs uppercase tracking-widest hover:bg-muted transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isActionLoading}
                    className="bg-black text-white px-8 py-3 text-xs uppercase tracking-widest hover:bg-primary transition-colors disabled:opacity-50"
                  >
                    {isActionLoading ? 'Indexing...' : 'Index Document'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'kb' ? (
            <div className="space-y-4">
              {kbDocs.length === 0 ? (
                <div className="border border-dashed border-border p-20 text-center uppercase text-xs opacity-40">
                  No knowledge base documents indexed
                </div>
              ) : (
                <div className="bg-white border border-border overflow-hidden">
                  <table className="w-full text-left text-xs uppercase tracking-widest">
                    <thead className="bg-muted border-b border-border">
                      <tr>
                        <th className="px-6 py-4 font-bold">Document</th>
                        <th className="px-6 py-4 font-bold">Source</th>
                        <th className="px-6 py-4 font-bold text-center">Chunks</th>
                        <th className="px-6 py-4 font-bold">Created</th>
                        <th className="px-6 py-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {kbDocs.map((doc) => (
                        <tr key={doc.id} className="hover:bg-[#F9F9F9] transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-bold">{doc.title}</div>
                            <div className="text-[8px] opacity-40 mt-1 uppercase truncate max-w-[200px]">{doc.id}</div>
                          </td>
                          <td className="px-6 py-4 opacity-60 italic">{doc.source || 'No source'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="bg-black text-white px-2 py-1 text-[10px] font-bold">
                              {doc.chunk_count}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-[10px] opacity-60">{formatDate(doc.created_at)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteKB(doc.id)}
                              disabled={isActionLoading}
                              className="text-red-500 hover:text-red-700 p-2 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : activeTab === 'requests' ? (

          <div className="space-y-6">
            {requests.length === 0 ? (
              <div className="border border-dashed border-border p-20 text-center uppercase text-xs opacity-40">
                No project requests found
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white border border-border group hover:border-black transition-colors overflow-hidden">
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    <div className="flex-grow space-y-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-bold uppercase tracking-tight mb-1">
                            {req.customer_name || 'Anonymous Client'}
                          </h3>
                          <div className="flex items-center gap-4 text-[10px] opacity-50 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {formatDate(req.created_at)}</span>
                            <span className="flex items-center gap-1 font-bold text-black"><DollarSign size={12}/> {req.budget || 'N/A'}</span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 text-[8px] uppercase font-bold tracking-widest border ${
                          req.status === 'pending' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-green-200 bg-green-50 text-green-700'
                        }`}>
                          {req.status}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-border">
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Description</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{req.description}</p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Notes</h4>
                          <p className="text-sm leading-relaxed whitespace-pre-wrap italic">{req.notes || 'No additional notes provided.'}</p>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-64 space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-40">Attachments</h4>
                      {req.brief_url ? (
                        <a 
                          href={req.brief_url} 
                          target="_blank" 
                          className="flex items-center justify-between p-3 border border-border hover:bg-black hover:text-white transition-all group/link"
                        >
                          <span className="flex items-center gap-2 text-[10px] uppercase font-bold">
                            <FileText size={14} /> View Brief
                          </span>
                          <ExternalLink size={12} className="opacity-0 group-hover/link:opacity-100 transition-opacity" />
                        </a>
                      ) : (
                        <div className="p-3 border border-dashed border-border text-[8px] uppercase opacity-40 text-center">No PDF provided</div>
                      )}

                      <div className="grid grid-cols-3 gap-2">
                        {req.image_urls?.map((url, i) => (
                          <a key={i} href={url} target="_blank" className="aspect-square border border-border overflow-hidden hover:opacity-80 transition-opacity relative group/img">
                            <img src={url} alt="" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                              <ImageIcon size={14} className="text-white" />
                            </div>
                          </a>
                        ))}
                      </div>
                      {(!req.image_urls || req.image_urls.length === 0) && (
                        <div className="p-8 border border-dashed border-border text-[8px] uppercase opacity-40 text-center flex flex-col items-center gap-2">
                          <ImageIcon size={16} />
                          No images
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="border border-dashed border-border p-20 text-center uppercase text-xs opacity-40">
                No contact messages found
              </div>
            ) : (
              <div className="bg-white border border-border overflow-hidden">
                <table className="w-full text-left text-xs uppercase tracking-widest">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-6 py-4 font-bold">Date</th>
                      <th className="px-6 py-4 font-bold">Name</th>
                      <th className="px-6 py-4 font-bold">Email</th>
                      <th className="px-6 py-4 font-bold">Message</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {messages.map((msg) => (
                      <tr key={msg.id} className="hover:bg-[#F9F9F9] transition-colors">
                        <td className="px-6 py-4 text-[10px] opacity-60 whitespace-nowrap">{formatDate(msg.created_at)}</td>
                        <td className="px-6 py-4 font-bold">{msg.name}</td>
                        <td className="px-6 py-4 lowercase tracking-tight opacity-80">{msg.email}</td>
                        <td className="px-6 py-4">
                          <div className="max-w-md normal-case tracking-normal py-2 text-sm leading-relaxed">
                            {msg.message}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
