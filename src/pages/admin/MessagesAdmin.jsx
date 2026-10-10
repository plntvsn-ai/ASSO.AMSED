import React, { useState, useEffect } from 'react';
import { 
  collection, getDocs, deleteDoc, doc, updateDoc, 
  query, orderBy, onSnapshot 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useData } from '../../context/DataContext';
import { 
  MessageSquare, Trash2, Phone, Mail, Clock, CheckCircle2, 
  RefreshCw, Send, AlertCircle, User, Search, MessageCircle
} from 'lucide-react';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const { data } = useData();

  useEffect(() => {
    let unsubscribe = null;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        if (db) {
          const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
          unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(d => ({
              id: d.id,
              ...d.data(),
              dateStr: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toLocaleString('ar-MA') : new Date().toLocaleDateString('ar-MA')
            }));
            setMessages(items);
            setLoading(false);
          }, async (err) => {
            console.warn("Firestore snapshot error, falling back to one-time getDocs:", err);
            try {
              const snap = await getDocs(collection(db, 'contacts'));
              const items = snap.docs.map(d => ({
                id: d.id,
                ...d.data(),
                dateStr: d.data().createdAt?.toDate ? d.data().createdAt.toDate().toLocaleString('ar-MA') : ''
              }));
              setMessages(items);
            } catch (e) {
              // fallback to local messages
              setMessages((data?.messages || []).map((m, i) => ({ id: `local-${i}`, ...m })));
            } finally {
              setLoading(false);
            }
          });
        } else {
          setMessages((data?.messages || []).map((m, i) => ({ id: `local-${i}`, ...m })));
          setLoading(false);
        }
      } catch (e) {
        console.error("Error loading messages:", e);
        setMessages((data?.messages || []).map((m, i) => ({ id: `local-${i}`, ...m })));
        setLoading(false);
      }
    };

    fetchMessages();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [data?.messages]);

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;
    setActionLoading(id);
    try {
      if (db && !id.startsWith('local-')) {
        await deleteDoc(doc(db, 'contacts', id));
      }
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert('خطأ أثناء الحذف: ' + e.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleStatus = async (msg) => {
    const nextStatus = msg.status === 'read' ? 'new' : 'read';
    try {
      if (db && !msg.id.startsWith('local-')) {
        await updateDoc(doc(db, 'contacts', msg.id), { status: nextStatus });
      }
      setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: nextStatus } : m));
    } catch (e) {
      console.error(e);
    }
  };

  const getWhatsappUrl = (phone, name, subject) => {
    if (!phone) return '#';
    const raw = phone.replace(/\D/g, '');
    const intl = raw.startsWith('0') ? '212' + raw.substring(1) : raw;
    const text = encodeURIComponent(
      `السلام عليكم ورحمة الله، الأستاذ(ة) ${name || ''}، معكم إدارة جمعية AMSED بخصوص رسالتكم الكريمة: "${subject || 'استفسار'}"`
    );
    return `https://wa.me/${intl}?text=${text}`;
  };

  const filteredMessages = messages.filter(m => {
    const q = searchTerm.toLowerCase();
    return (
      (m.name || '').toLowerCase().includes(q) ||
      (m.phone || '').includes(q) ||
      (m.email || '').toLowerCase().includes(q) ||
      (m.subject || '').toLowerCase().includes(q) ||
      (m.message || '').toLowerCase().includes(q)
    );
  });

  const unreadCount = messages.filter(m => m.status === 'new').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center" dir="rtl">
        <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mb-4" />
        <h3 className="text-lg font-bold text-slate-800">جاري تحميل رسائل الزوار...</h3>
        <p className="text-sm text-slate-500 mt-1">يرجى الانتظار لحظات</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900">رسائل الزوار وتواصل الجمهور</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                إدارة رسائل واستفسارات أولياء الأمور والمتبرعين والمتطوعين
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
            <span>إجمالي الرسائل:</span>
            <span className="font-mono text-sm">{messages.length}</span>
          </span>
          {unreadCount > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-500 text-white text-xs font-bold animate-pulse">
              <span>{unreadCount} جديدة</span>
            </span>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="absolute right-3.5 top-3.5 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم، رقم الهاتف، الإيميل، أو نص الرسالة..."
            className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
          />
        </div>
      </div>

      {/* Messages List */}
      {filteredMessages.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">لا توجد رسائل حالياً</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            عندما يقوم أي زائر بملء استمارة التواصل في الموقع، ستظهر رسالته هنا مباشرة مع إمكانية الرد السريع عبر الواتساب.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredMessages.map((msg) => {
            const isNew = msg.status === 'new';
            return (
              <div
                key={msg.id}
                className={`bg-white rounded-3xl p-6 border transition shadow-sm hover:shadow-md ${
                  isNew ? 'border-emerald-300 ring-2 ring-emerald-100' : 'border-slate-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Sender Info & Message */}
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-base text-slate-900 flex items-center gap-1.5">
                        <User className="w-4 h-4 text-emerald-600" />
                        {msg.name || 'بدون اسم'}
                      </span>

                      {isNew ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-bold">
                          رسالة جديدة
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-bold">
                          تم الاطلاع
                        </span>
                      )}

                      {msg.dateStr && (
                        <span className="text-xs text-slate-400 flex items-center gap-1 mr-auto font-mono">
                          <Clock className="w-3.5 h-3.5" />
                          {msg.dateStr}
                        </span>
                      )}
                    </div>

                    {/* Contact Details Tags */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                      {msg.phone && (
                        <a 
                          href={`tel:${msg.phone}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono font-bold transition"
                          dir="ltr"
                        >
                          <Phone className="w-3.5 h-3.5 text-emerald-600" />
                          {msg.phone}
                        </a>
                      )}
                      {msg.email && (
                        <a 
                          href={`mailto:${msg.email}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono transition"
                          dir="ltr"
                        >
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          {msg.email}
                        </a>
                      )}
                      {msg.subject && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                          الموضوع: {msg.subject}
                        </span>
                      )}
                    </div>

                    {/* Message Body */}
                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                      {msg.message || 'لا يوجد نص رسالة'}
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="flex md:flex-col items-center gap-2 shrink-0 pt-2 md:pt-0">
                    {/* WhatsApp Button */}
                    {msg.phone && (
                      <a
                        href={getWhatsappUrl(msg.phone, msg.name, msg.subject)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition"
                        title="مراسلة عبر واتساب"
                      >
                        <MessageCircle className="w-4 h-4 fill-white" />
                        <span>رد عبر واتساب</span>
                      </a>
                    )}

                    {/* Toggle Read/Unread */}
                    <button
                      onClick={() => handleToggleStatus(msg)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                      title={isNew ? 'تحديد كمقروء' : 'تحديد كجديد'}
                    >
                      <CheckCircle2 className={`w-4 h-4 ${isNew ? 'text-slate-400' : 'text-emerald-600'}`} />
                      <span>{isNew ? 'تحديد كمقروء' : 'تم الرد'}</span>
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={actionLoading === msg.id}
                      className="px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                      title="حذف الرسالة"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>حذف</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export { MessagesAdmin };
