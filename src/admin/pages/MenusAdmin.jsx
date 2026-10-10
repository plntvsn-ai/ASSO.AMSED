import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { 
  Menu, Plus, Trash2, ArrowUp, ArrowDown, 
  Check, Edit2, Link, Save, RefreshCw 
} from 'lucide-react';

export const MenusAdmin = () => {
  const { cmsData, updateHeaderMenus, updateFooterMenus } = useCms();
  const [headerList, setHeaderList] = useState(cmsData?.menus?.headerMenus || []);
  const [footerList, setFooterList] = useState(cmsData?.menus?.footerMenus || []);
  const [activeTab, setActiveTab] = useState('header'); // header, footer
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (cmsData?.menus) {
      setHeaderList(cmsData.menus.headerMenus || []);
      setFooterList(cmsData.menus.footerMenus || []);
    }
    setLoading(false);
  }, [cmsData?.menus]);

  // New item input
  const [newLabel, setNewLabel] = useState('');
  const [newLink, setNewLink] = useState('');

  const currentList = activeTab === 'header' ? headerList : footerList;
  const setCurrentList = activeTab === 'header' ? setHeaderList : setFooterList;

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }} className="text-slate-600 font-bold">جاري التحميل...</div>;
  }

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newLabel || !newLink) return;

    const newItem = {
      id: 'm-' + Date.now(),
      label: newLabel,
      link: newLink,
      order: currentList.length + 1
    };

    const updated = [...currentList, newItem];
    setCurrentList(updated);
    setNewLabel('');
    setNewLink('');
  };

  const handleDeleteItem = (id) => {
    const updated = currentList.filter(item => item.id !== id);
    setCurrentList(updated);
  };

  const handleMove = (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentList.length) return;

    const updated = [...currentList];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // re-assign order numbers
    updated.forEach((item, idx) => {
      item.order = idx + 1;
    });

    setCurrentList(updated);
  };

  const handleSaveAll = () => {
    if (activeTab === 'header') {
      updateHeaderMenus(headerList);
    } else {
      updateFooterMenus(footerList);
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Menu className="w-6 h-6 text-emerald-700" />
            <span>تعديل قوائم الموقع (/admin/menus)</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            إضافة وحذف وتعديل وإعادة ترتيب عناصر القائمة في الهيدر والفوتر مع حفظ فوري في Firestore
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-2xl shadow-md transition transform hover:-translate-y-0.5 shrink-0"
        >
          <Save className="w-5 h-5" />
          <span>حفظ التعديلات في Firestore</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs sm:text-sm font-bold rounded-2xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5 text-emerald-700" />
          <span>تم حفظ القوائم بنجاح وتحديثها في الموقع!</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setActiveTab('header')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'header'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          قائمة الهيدر الرئيسية (Header Menu)
        </button>
        <button
          onClick={() => setActiveTab('footer')}
          className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'footer'
              ? 'bg-slate-900 text-white shadow'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          قائمة الفوتر وروابط النهاية (Footer Menu)
        </button>
      </div>

      {/* Add New Item */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>إضافة عنصر جديد إلى {activeTab === 'header' ? 'الهيدر' : 'الفوتر'}</span>
        </h3>

        <form onSubmit={handleAddItem} className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            required
            placeholder="اسم الرابط (مثال: من نحن، الأنشطة...)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="w-full sm:w-1/3 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm"
          />
          <input
            type="text"
            required
            placeholder="الرابط (مثال: /about أو /#services)"
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono"
            dir="ltr"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-900 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl transition shrink-0"
          >
            إضافة للقائمة
          </button>
        </form>
      </div>

      {/* Menu Items List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        <div className="p-4 bg-slate-50 text-xs font-bold text-slate-500 uppercase flex items-center justify-between">
          <span>العناصر والترتيب الحالي ({currentList.length})</span>
          <span>الإجراءات</span>
        </div>

        {currentList.map((item, index) => (
          <div key={item.id || index} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {index + 1}
              </span>
              <div>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => {
                    const updated = [...currentList];
                    updated[index].label = e.target.value;
                    setCurrentList(updated);
                  }}
                  className="font-bold text-slate-900 text-sm bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1"
                />
                <input
                  type="text"
                  value={item.link}
                  onChange={(e) => {
                    const updated = [...currentList];
                    updated[index].link = e.target.value;
                    setCurrentList(updated);
                  }}
                  className="text-xs text-slate-400 font-mono bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none px-1 block mt-0.5"
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => handleMove(index, 'up')}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                title="تحريك لأعلى"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === currentList.length - 1}
                onClick={() => handleMove(index, 'down')}
                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30"
                title="تحريك لأسفل"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleDeleteItem(item.id)}
                className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                title="حذف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
