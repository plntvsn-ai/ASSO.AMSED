'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const menuItems = [
  { label: 'نظرة عامة (Overview)', href: '/admin', icon: '🏠', badge: null },
  { label: 'المقالات والأخبار', href: '/admin/articles', icon: '📄', badge: null },
  { label: 'إعدادات الخدمات', href: '/admin/services', icon: '🤝', badge: null },
  { label: 'النشر الأوتوماتيكي ⚡', href: '/admin/auto', icon: '🤖', badge: null },
  { label: 'خزان المواضيع', href: '/admin/topics', icon: '📚', badge: null },
  { label: 'مراجعة المقالات', href: '/admin/review', icon: '✅', badge: null },
  { label: 'المحررون والباحثون', href: '/admin/researchers', icon: '👥', badge: null },
  { label: 'رسائل الزوار 💬', href: '/admin/messages', icon: '💬', badge: null },
  { label: 'إعدادات الموقع الأساسية', href: '/admin/settings', icon: '⚙️', badge: null },
  { label: 'إعدادات متقدمة', href: '/admin/settings/advanced', icon: '⚙️', badge: null },
  { label: 'تعديل القوائم', href: '/admin/menus', icon: '📋', badge: null },
  { label: 'تعديل الأزرار', href: '/admin/buttons', icon: '🖱️', badge: null },
  { label: 'فيديو الـ Hero', href: '/admin/hero', icon: '🎬', badge: null },
  { label: 'الأرقام والإحصائيات', href: '/admin/stats', icon: '📊', badge: null },
  { label: 'معرض الصور', href: '/admin/gallery', icon: '🖼️', badge: null },
  { label: 'معلومات الاتصال', href: '/admin/contact', icon: '📞', badge: null }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-slate-950 text-white min-h-screen p-4 flex flex-col space-y-2 shrink-0" dir="rtl">
      <div className="p-3 border-b border-slate-800 mb-2">
        <h2 className="font-extrabold text-sm text-white">لوحة تحكم AMSED</h2>
        <span className="text-[11px] text-emerald-400 font-medium">إدارة الجمعية والمحتوى</span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950/50'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
