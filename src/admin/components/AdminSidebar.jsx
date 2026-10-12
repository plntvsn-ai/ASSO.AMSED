import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const ADMIN_SIDEBAR_MENU = [
  { icon: '🤖', label: 'إعدادات الروبوت', path: '/am-ctrl-9k2l8x-2026-secure-panel-77', badge: '8', className: 'bg-yellow-100' }
];

export default function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-slate-900 text-white p-4 space-y-2">
      {ADMIN_SIDEBAR_MENU.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center justify-between p-3 rounded-xl transition ${
              isActive ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className="font-bold text-sm">{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-xs bg-amber-400 text-black font-extrabold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </aside>
  );
}
