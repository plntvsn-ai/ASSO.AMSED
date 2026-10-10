import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { 
  X, Lock, KeyRound, Bell, HandHeart, Image, 
  Phone, Mail, MessageSquare, Settings, Plus, Trash2, 
  Edit2, Check, Download, Upload, RefreshCw, Star, 
  ExternalLink, Eye, AlertTriangle, ShieldCheck 
} from 'lucide-react';
import { YoutubeIcon } from './SocialIcons';

export const AdminModal = ({ isOpen, onClose }) => {
  const { lang, t, getLocalized } = useLanguage();
  const { 
    data,
    updateAssociation,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    addService,
    updateService,
    deleteService,
    addGalleryItem,
    deleteGalleryItem,
    addVideo,
    updateVideo,
    deleteVideo,
    setDailyFeaturedVideo,
    markMessageRead,
    deleteMessage,
    updateAdminPassword,
    resetToDefaults,
    exportDataJson,
    importDataJson
  } = useData();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('announcements'); // announcements, services, gallery, videos, contact, messages, settings
  const [notification, setNotification] = useState('');

  // Announcement Form State
  const [editingAnn, setEditingAnn] = useState(null);
  const [annForm, setAnnForm] = useState({
    titleAr: '', titleFr: '', titleEn: '',
    descAr: '', descFr: '', descEn: '',
    category: 'news',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  // Service Form State
  const [editingServ, setEditingServ] = useState(null);
  const [servForm, setServForm] = useState({
    titleAr: '', titleFr: '', titleEn: '',
    descAr: '', descFr: '', descEn: '',
    icon: 'HeartPulse'
  });

  // Gallery Form State
  const [galForm, setGalForm] = useState({
    titleAr: '', titleFr: '', titleEn: '',
    category: 'medical',
    image: ''
  });

  // Video Form State
  const [vidForm, setVidForm] = useState({
    youtubeId: '',
    titleAr: '', titleFr: '', titleEn: '',
    descAr: '', descFr: '', descEn: '',
    isDailyFeatured: false
  });

  // Contact Info State
  const [contactForm, setContactForm] = useState({ ...data.association });

  // Password change state
  const [newPass, setNewPass] = useState('');

  if (!isOpen) return null;

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === data.adminPassword || passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setLoginError(false);
      setPasswordInput('');
    } else {
      setLoginError(true);
    }
  };

  // --- Handlers: Announcements ---
  const handleSaveAnn = (e) => {
    e.preventDefault();
    if (editingAnn) {
      updateAnnouncement(editingAnn.id, annForm);
      showNotification(t('admin', 'savedSuccess'));
      setEditingAnn(null);
    } else {
      addAnnouncement(annForm);
      showNotification(t('admin', 'savedSuccess'));
    }
    setAnnForm({
      titleAr: '', titleFr: '', titleEn: '',
      descAr: '', descFr: '', descEn: '',
      category: 'news',
      image: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const startEditAnn = (ann) => {
    setEditingAnn(ann);
    setAnnForm({
      titleAr: ann.titleAr || '',
      titleFr: ann.titleFr || '',
      titleEn: ann.titleEn || '',
      descAr: ann.descAr || '',
      descFr: ann.descFr || '',
      descEn: ann.descEn || '',
      category: ann.category || 'news',
      image: ann.image || '',
      date: ann.date || ''
    });
  };

  // --- Handlers: Services ---
  const handleSaveServ = (e) => {
    e.preventDefault();
    if (editingServ) {
      updateService(editingServ.id, servForm);
      showNotification(t('admin', 'savedSuccess'));
      setEditingServ(null);
    } else {
      addService(servForm);
      showNotification(t('admin', 'savedSuccess'));
    }
    setServForm({
      titleAr: '', titleFr: '', titleEn: '',
      descAr: '', descFr: '', descEn: '',
      icon: 'HeartPulse'
    });
  };

  const startEditServ = (serv) => {
    setEditingServ(serv);
    setServForm({
      titleAr: serv.titleAr || '',
      titleFr: serv.titleFr || '',
      titleEn: serv.titleEn || '',
      descAr: serv.descAr || '',
      descFr: serv.descFr || '',
      descEn: serv.descEn || '',
      icon: serv.icon || 'HeartPulse'
    });
  };

  // --- Handlers: Gallery ---
  const handleAddGallery = (e) => {
    e.preventDefault();
    if (!galForm.image) return;
    addGalleryItem(galForm);
    showNotification(t('admin', 'savedSuccess'));
    setGalForm({
      titleAr: '', titleFr: '', titleEn: '',
      category: 'medical',
      image: ''
    });
  };

  // --- Handlers: Video ---
  const handleAddVideo = (e) => {
    e.preventDefault();
    if (!vidForm.youtubeId) return;

    // clean ID
    let cleanedId = vidForm.youtubeId;
    if (cleanedId.includes('youtu.be/')) {
      cleanedId = cleanedId.split('youtu.be/')[1].split('?')[0];
    } else if (cleanedId.includes('watch?v=')) {
      cleanedId = cleanedId.split('watch?v=')[1].split('&')[0];
    }

    addVideo({
      ...vidForm,
      youtubeId: cleanedId
    });
    showNotification(t('admin', 'savedSuccess'));
    setVidForm({
      youtubeId: '',
      titleAr: '', titleFr: '', titleEn: '',
      descAr: '', descFr: '', descEn: '',
      isDailyFeatured: false
    });
  };

  // --- Handlers: Contact info ---
  const handleSaveContact = (e) => {
    e.preventDefault();
    updateAssociation(contactForm);
    showNotification(t('admin', 'savedSuccess'));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white">
                {t('admin', 'loginTitle')}
              </h2>
              <span className="text-xs text-amber-400 font-medium">
                جمعية المبادرة المغربية للتكافل والتعاون
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-700 transition"
              >
                {t('admin', 'logout')}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Notification Toast */}
        {notification && (
          <div className="bg-emerald-600 text-white text-xs sm:text-sm font-bold py-2.5 px-6 text-center animate-fadeIn shrink-0 flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{notification}</span>
          </div>
        )}

        {/* BODY */}
        {!isAuthenticated ? (
          /* Login Screen */
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl max-w-md w-full text-center space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center shadow-inner">
                <KeyRound className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900">
                  {t('admin', 'loginTitle')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {t('admin', 'loginSubtitle')}
                </p>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{t('admin', 'wrongPass')}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <input
                    type="password"
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={t('admin', 'enterPass')}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none text-center"
                    autoFocus
                  />
                  <span className="text-[11px] text-slate-400 block mt-2">
                    كلمة المرور الافتراضية: <strong className="text-emerald-700 font-mono">admin123</strong>
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 rounded-xl shadow transition"
                >
                  {t('admin', 'loginBtn')}
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Logged In Dashboard */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-50">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-60 bg-white border-b md:border-b-0 md:border-e border-slate-200 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto flex md:flex-col">
              
              <button
                onClick={() => setActiveTab('announcements')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'announcements' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Bell className="w-4 h-4" />
                <span>{t('admin', 'tabAnnouncements')}</span>
                <span className="ms-auto bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {data.announcements.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('services')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'services' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <HandHeart className="w-4 h-4" />
                <span>{t('admin', 'tabServices')}</span>
                <span className="ms-auto bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {data.services.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'gallery' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Image className="w-4 h-4" />
                <span>{t('admin', 'tabGallery')}</span>
                <span className="ms-auto bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {data.gallery.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('videos')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'videos' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <YoutubeIcon className="w-4 h-4" />
                <span>{t('admin', 'tabVideos')}</span>
                <span className="ms-auto bg-black/20 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                  {data.videos.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'contact' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Phone className="w-4 h-4" />
                <span>{t('admin', 'tabContact')}</span>
              </button>

              <button
                onClick={() => setActiveTab('messages')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'messages' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('admin', 'tabMessages')}</span>
                {data.messages.filter(m => !m.read).length > 0 && (
                  <span className="ms-auto bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                    {data.messages.filter(m => !m.read).length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition shrink-0 ${
                  activeTab === 'settings' ? 'bg-emerald-700 text-white shadow' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>{t('admin', 'tabSettings')}</span>
              </button>

            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 overflow-y-auto">
              
              {/* TAB 1: ANNOUNCEMENTS */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>{editingAnn ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}</span>
                    </h3>

                    <form onSubmit={handleSaveAnn} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالعربية *</label>
                          <input
                            type="text"
                            required
                            value={annForm.titleAr}
                            onChange={(e) => setAnnForm({ ...annForm, titleAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Titre en Français</label>
                          <input
                            type="text"
                            value={annForm.titleFr}
                            onChange={(e) => setAnnForm({ ...annForm, titleFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Title in English</label>
                          <input
                            type="text"
                            value={annForm.titleEn}
                            onChange={(e) => setAnnForm({ ...annForm, titleEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">الوصف بالعربية *</label>
                          <textarea
                            rows={3}
                            required
                            value={annForm.descAr}
                            onChange={(e) => setAnnForm({ ...annForm, descAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Description (FR)</label>
                          <textarea
                            rows={3}
                            value={annForm.descFr}
                            onChange={(e) => setAnnForm({ ...annForm, descFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                            dir="ltr"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Description (EN)</label>
                          <textarea
                            rows={3}
                            value={annForm.descEn}
                            onChange={(e) => setAnnForm({ ...annForm, descEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                            dir="ltr"
                          ></textarea>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                          <select
                            value={annForm.category}
                            onChange={(e) => setAnnForm({ ...annForm, category: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                          >
                            <option value="urgent">عاجل وهام (Urgent)</option>
                            <option value="event">نشاط وقافلة (Event)</option>
                            <option value="news">بلاغ إخباري (News)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رابط الصورة (URL)</label>
                          <input
                            type="url"
                            value={annForm.image}
                            onChange={(e) => setAnnForm({ ...annForm, image: e.target.value })}
                            placeholder="https://..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">التاريخ</label>
                          <input
                            type="date"
                            value={annForm.date}
                            onChange={(e) => setAnnForm({ ...annForm, date: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        {editingAnn && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAnn(null);
                              setAnnForm({
                                titleAr: '', titleFr: '', titleEn: '',
                                descAr: '', descFr: '', descEn: '',
                                category: 'news', image: '', date: ''
                              });
                            }}
                            className="px-4 py-2 text-xs font-bold bg-slate-200 rounded-xl"
                          >
                            إلغاء التعديل
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow"
                        >
                          {editingAnn ? 'تحديث الإعلان' : 'نشر الإعلان الآن'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List */}
                  <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-800">
                      قائمة الإعلانات الحالية ({data.announcements.length})
                    </div>
                    <div className="divide-y divide-slate-100">
                      {data.announcements.map((ann) => (
                        <div key={ann.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
                          <div className="flex items-center gap-3">
                            {ann.image && (
                              <img src={ann.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                  {ann.category}
                                </span>
                                <span className="text-xs text-slate-400">{ann.date}</span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 mt-1">{ann.titleAr}</h4>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              onClick={() => startEditAnn(ann)}
                              className="p-2 text-slate-600 hover:text-emerald-700 rounded-lg hover:bg-slate-100"
                              title="تعديل"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(t('admin', 'confirmDelete'))) {
                                  deleteAnnouncement(ann.id);
                                  showNotification(t('admin', 'deletedSuccess'));
                                }
                              }}
                              className="p-2 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SERVICES */}
              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-emerald-700" />
                      <span>{editingServ ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}</span>
                    </h3>

                    <form onSubmit={handleSaveServ} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">اسم الخدمة (عربي) *</label>
                          <input
                            type="text"
                            required
                            value={servForm.titleAr}
                            onChange={(e) => setServForm({ ...servForm, titleAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Titre de Service (FR)</label>
                          <input
                            type="text"
                            value={servForm.titleFr}
                            onChange={(e) => setServForm({ ...servForm, titleFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Service Title (EN)</label>
                          <input
                            type="text"
                            value={servForm.titleEn}
                            onChange={(e) => setServForm({ ...servForm, titleEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">التفاصيل بالعربية *</label>
                          <textarea
                            rows={3}
                            required
                            value={servForm.descAr}
                            onChange={(e) => setServForm({ ...servForm, descAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Détails (FR)</label>
                          <textarea
                            rows={3}
                            value={servForm.descFr}
                            onChange={(e) => setServForm({ ...servForm, descFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                            dir="ltr"
                          ></textarea>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Details (EN)</label>
                          <textarea
                            rows={3}
                            value={servForm.descEn}
                            onChange={(e) => setServForm({ ...servForm, descEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                            dir="ltr"
                          ></textarea>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        {editingServ && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditingServ(null);
                              setServForm({ titleAr: '', titleFr: '', titleEn: '', descAr: '', descFr: '', descEn: '', icon: 'HeartPulse' });
                            }}
                            className="px-4 py-2 text-xs font-bold bg-slate-200 rounded-xl"
                          >
                            إلغاء
                          </button>
                        )}
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow"
                        >
                          {editingServ ? 'حفظ الخدمة' : 'إضافة الخدمة'}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of services */}
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                    {data.services.map((serv) => (
                      <div key={serv.id} className="p-4 flex items-center justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{serv.titleAr}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-1">{serv.descAr}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditServ(serv)}
                            className="p-2 text-slate-600 hover:text-emerald-700"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(t('admin', 'confirmDelete'))) {
                                deleteService(serv.id);
                                showNotification(t('admin', 'deletedSuccess'));
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">إضافة صورة جديدة للمعرض</h3>
                    <form onSubmit={handleAddGallery} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">رابط الصورة (Image URL) *</label>
                          <input
                            type="url"
                            required
                            value={galForm.image}
                            onChange={(e) => setGalForm({ ...galForm, image: e.target.value })}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">التصنيف</label>
                          <select
                            value={galForm.category}
                            onChange={(e) => setGalForm({ ...galForm, category: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm bg-white"
                          >
                            <option value="medical">القوافل الطبية (Medical)</option>
                            <option value="education">التعليم والدراسة (Education)</option>
                            <option value="social">المساعدات الاجتماعية (Social)</option>
                            <option value="activities">أنشطة وترفيه (Activities)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الصورة (عربي)</label>
                          <input
                            type="text"
                            value={galForm.titleAr}
                            onChange={(e) => setGalForm({ ...galForm, titleAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={galForm.titleFr}
                            onChange={(e) => setGalForm({ ...galForm, titleFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Title (EN)</label>
                          <input
                            type="text"
                            value={galForm.titleEn}
                            onChange={(e) => setGalForm({ ...galForm, titleEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow"
                        >
                          إضافة الصورة إلى المعرض
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Gallery Items Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.gallery.map((item) => (
                      <div key={item.id} className="relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                        <img src={item.image} alt="" className="w-full h-36 object-cover" />
                        <div className="p-2 bg-white">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{item.titleAr || item.category}</p>
                        </div>
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin', 'confirmDelete'))) {
                              deleteGalleryItem(item.id);
                              showNotification(t('admin', 'deletedSuccess'));
                            }
                          }}
                          className="absolute top-2 end-2 p-1.5 bg-red-600/90 hover:bg-red-700 text-white rounded-lg opacity-0 group-hover:opacity-100 transition shadow"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: VIDEOS & YOUTUBE */}
              {activeTab === 'videos' && (
                <div className="space-y-6">
                  {/* YouTube Channel Sync configuration */}
                  <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center">
                        <YoutubeIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">ربط مباشر بقناة يوتيوب الرسمية</h4>
                        <p className="text-xs text-slate-600">
                          القناة المربوطة حالياً: <span className="font-mono font-bold text-red-700">{data.association.youtubeUrl}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Add Video Form */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="text-base font-bold text-slate-900 mb-4">إضافة فيديو جديد أو فيديو يومي</h3>
                    <form onSubmit={handleAddVideo} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            معرّف يوتيوب أو رابط الفيديو (YouTube ID or URL) *
                          </label>
                          <input
                            type="text"
                            required
                            value={vidForm.youtubeId}
                            onChange={(e) => setVidForm({ ...vidForm, youtubeId: e.target.value })}
                            placeholder="Wv03U1h3C_c أو https://youtu.be/..."
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div className="flex items-center pt-5">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                            <input
                              type="checkbox"
                              checked={vidForm.isDailyFeatured}
                              onChange={(e) => setVidForm({ ...vidForm, isDailyFeatured: e.target.checked })}
                              className="w-4 h-4 text-emerald-600 rounded"
                            />
                            <span>تعيين كـ "فيديو اليوم المميز" (Daily Highlight)</span>
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">عنوان الفيديو (عربي) *</label>
                          <input
                            type="text"
                            required
                            value={vidForm.titleAr}
                            onChange={(e) => setVidForm({ ...vidForm, titleAr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Titre (FR)</label>
                          <input
                            type="text"
                            value={vidForm.titleFr}
                            onChange={(e) => setVidForm({ ...vidForm, titleFr: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Title (EN)</label>
                          <input
                            type="text"
                            value={vidForm.titleEn}
                            onChange={(e) => setVidForm({ ...vidForm, titleEn: e.target.value })}
                            className="w-full px-3 py-2 border rounded-xl text-sm"
                            dir="ltr"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">تفاصيل الفيديو (عربي)</label>
                        <textarea
                          rows={2}
                          value={vidForm.descAr}
                          onChange={(e) => setVidForm({ ...vidForm, descAr: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm resize-none"
                        ></textarea>
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow"
                        >
                          إضافة الفيديو لقائمة العرض
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List of Videos */}
                  <div className="bg-white rounded-2xl border border-slate-200 divide-y divide-slate-100">
                    {data.videos.map((vid) => (
                      <div key={vid.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://img.youtube.com/vi/${vid.youtubeId}/default.jpg`}
                            alt=""
                            className="w-16 h-12 object-cover rounded-lg bg-black"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              {vid.isDailyFeatured && (
                                <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                  ★ فيديو اليوم
                                </span>
                              )}
                              <span className="text-xs text-slate-400">{vid.publishedDate}</span>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mt-1">{vid.titleAr}</h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {!vid.isDailyFeatured && (
                            <button
                              onClick={() => {
                                setDailyFeaturedVideo(vid.id);
                                showNotification('تم تعيين فيديو اليوم بنجاح!');
                              }}
                              className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1"
                            >
                              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                              <span>اجعله فيديو اليوم</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (window.confirm(t('admin', 'confirmDelete'))) {
                                deleteVideo(vid.id);
                                showNotification(t('admin', 'deletedSuccess'));
                              }
                            }}
                            className="p-2 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: CONTACT & ASSOCIATION INFO */}
              {activeTab === 'contact' && (
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">بيانات التواصل والهوية الرسمية</h3>
                    <p className="text-xs text-slate-500 mt-1">تعديل الأرقام، البريد، الروابط الاجتماعية والحساب البنكي</p>
                  </div>

                  <form onSubmit={handleSaveContact} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الأول (الهاتف والواتساب) *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.phone1}
                          onChange={(e) => setContactForm({ ...contactForm, phone1: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">الرقم الثاني *</label>
                        <input
                          type="text"
                          required
                          value={contactForm.phone2}
                          onChange={(e) => setContactForm({ ...contactForm, phone2: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">البريد الإلكتروني الرسمي *</label>
                        <input
                          type="email"
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">شعار الجمعية المختصر</label>
                        <input
                          type="text"
                          value={contactForm.acronym}
                          onChange={(e) => setContactForm({ ...contactForm, acronym: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رابط صفحة فيسبوك (Facebook)</label>
                        <input
                          type="url"
                          value={contactForm.facebookUrl}
                          onChange={(e) => setContactForm({ ...contactForm, facebookUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رابط قناة يوتيوب (YouTube)</label>
                        <input
                          type="url"
                          value={contactForm.youtubeUrl}
                          onChange={(e) => setContactForm({ ...contactForm, youtubeUrl: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">العنوان بالعربية</label>
                        <input
                          type="text"
                          value={contactForm.addressAr}
                          onChange={(e) => setContactForm({ ...contactForm, addressAr: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Adresse en Français</label>
                        <input
                          type="text"
                          value={contactForm.addressFr}
                          onChange={(e) => setContactForm({ ...contactForm, addressFr: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">رقم الحساب البنكي (RIB)</label>
                        <input
                          type="text"
                          value={contactForm.rib}
                          onChange={(e) => setContactForm({ ...contactForm, rib: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                          dir="ltr"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">اسم البنك</label>
                        <input
                          type="text"
                          value={contactForm.bankName}
                          onChange={(e) => setContactForm({ ...contactForm, bankName: e.target.value })}
                          className="w-full px-3 py-2 border rounded-xl text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">رابط خريطة Google Maps (موقع الجمعية)</label>
                      <input
                        type="url"
                        value={contactForm.mapUrl || ''}
                        onChange={(e) => setContactForm({ ...contactForm, mapUrl: e.target.value })}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full px-3 py-2 border rounded-xl text-sm font-mono"
                        dir="ltr"
                      />
                    </div>


                    <div className="flex justify-end pt-3">
                      <button
                        type="submit"
                        className="px-6 py-2.5 text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow"
                      >
                        حفظ بيانات الجمعية
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 6: MESSAGES INBOX */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-900">
                      صندوق الرسائل وطلبات المساعدة ({data.messages.length})
                    </h3>
                  </div>

                  {data.messages.length === 0 ? (
                    <div className="bg-white p-12 text-center text-slate-400 rounded-2xl border border-slate-200">
                      لا توجد رسائل واردة حالياً
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data.messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-5 rounded-2xl border transition ${
                            msg.read ? 'bg-white border-slate-200' : 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                          }`}
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-slate-900">{msg.name}</span>
                                {!msg.read && (
                                  <span className="text-[10px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-full">
                                    جديد
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-slate-500 font-mono mt-0.5 block">{msg.phone} • {msg.email}</span>
                            </div>

                            <span className="text-xs text-slate-400">{msg.date}</span>
                          </div>

                          <div className="mt-2 text-xs font-bold text-slate-700">
                            الموضوع: {msg.subject}
                          </div>

                          <p className="mt-2 text-sm text-slate-800 bg-white/80 p-3 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                            {msg.message}
                          </p>

                          <div className="mt-3 flex items-center justify-end gap-2">
                            <a
                              href={`tel:${msg.phone}`}
                              className="text-xs bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-800"
                            >
                              اتصال
                            </a>
                            <a
                              href={`https://wa.me/212${msg.phone.replace(/\D/g, '').replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg font-bold hover:bg-emerald-700"
                            >
                              واتساب
                            </a>
                            {!msg.read && (
                              <button
                                onClick={() => markMessageRead(msg.id)}
                                className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-bold hover:bg-slate-300"
                              >
                                تعليم كمقروء
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (window.confirm('هل تريد حذف هذه الرسالة؟')) {
                                  deleteMessage(msg.id);
                                  showNotification('تم حذف الرسالة');
                                }
                              }}
                              className="p-1.5 text-red-600 hover:text-red-800 rounded-lg hover:bg-red-50"
                              title="حذف"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: SETTINGS & BACKUP */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Password Change */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">تغيير كلمة المرور السرية للأدمن</h3>
                    <div className="flex gap-3 max-w-md">
                      <input
                        type="password"
                        placeholder="كلمة المرور الجديدة"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                        className="flex-1 px-4 py-2 border rounded-xl text-sm"
                      />
                      <button
                        onClick={() => {
                          if (newPass.length < 4) {
                            alert('يرجى إدخال كلمة مرور تتكون من 4 أحرف أو أرقام على الأقل');
                            return;
                          }
                          updateAdminPassword(newPass);
                          setNewPass('');
                          showNotification('تم تغيير كلمة المرور بنجاح!');
                        }}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl text-xs font-bold"
                      >
                        تحديث
                      </button>
                    </div>
                  </div>

                  {/* Backup & Restore */}
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="text-base font-bold text-slate-900">النسخ الاحتياطي واستعادة البيانات</h3>
                    <p className="text-xs text-slate-500">
                      يمكنك تنزيل نسخة احتياطية كاملة من قاعدة بيانات الموقع (JSON) واسترجاعها في أي وقت بنقرة واحدة.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={exportDataJson}
                        className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition shadow"
                      >
                        <Download className="w-4 h-4" />
                        <span>تحميل نسخة احتياطية (JSON)</span>
                      </button>

                      <label className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2.5 rounded-xl text-xs font-bold transition border border-slate-300 cursor-pointer">
                        <Upload className="w-4 h-4 text-emerald-700" />
                        <span>استرجاع نسخة سابقة</span>
                        <input
                          type="file"
                          accept=".json"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const result = importDataJson(event.target.result);
                              if (result.success) {
                                showNotification('تم استرجاع النسخة الاحتياطية بنجاح!');
                              } else {
                                alert('فشل استرجاع الملف: ' + result.error);
                              }
                            };
                            reader.readAsText(file);
                          }}
                        />
                      </label>

                      <button
                        onClick={() => {
                          if (window.confirm('هل تريد إعادة تعيين كافة البيانات إلى الحالة الافتراضية الأولية؟')) {
                            resetToDefaults();
                            showNotification('تمت إعادة ضبط البيانات الافتراضية بنجاح');
                          }
                        }}
                        className="inline-flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-700 px-4 py-2.5 rounded-xl text-xs font-bold transition border border-red-200"
                      >
                        <RefreshCw className="w-4 h-4" />
                        <span>إعادة ضبط البيانات الأصلية</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
