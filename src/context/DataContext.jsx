import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialData } from '../data/initialData';

const DataContext = createContext();

const STORAGE_KEY = 'amsed_association_database_v2';

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          association: { ...initialData.association, ...(parsed.association || {}) },
          announcements: parsed.announcements || initialData.announcements,
          services: parsed.services || initialData.services,
          gallery: parsed.gallery || initialData.gallery,
          videos: parsed.videos || initialData.videos,
          messages: parsed.messages || initialData.messages,
          adminPassword: parsed.adminPassword || 'admin123'
        };
      }
    } catch (e) {
      console.error('Failed to load local data', e);
    }
    return {
      ...initialData,
      adminPassword: 'admin123'
    };
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save data to localStorage', e);
    }
  }, [data]);

  // --- Association Info ---
  const updateAssociation = (updatedInfo) => {
    setData(prev => ({
      ...prev,
      association: { ...prev.association, ...updatedInfo }
    }));
  };

  // --- Announcements ---
  const addAnnouncement = (item) => {
    const newItem = {
      ...item,
      id: 'ann-' + Date.now(),
      date: item.date || new Date().toISOString().split('T')[0],
      active: true
    };
    setData(prev => ({
      ...prev,
      announcements: [newItem, ...prev.announcements]
    }));
    return newItem;
  };

  const updateAnnouncement = (id, updated) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(ann => ann.id === id ? { ...ann, ...updated } : ann)
    }));
  };

  const deleteAnnouncement = (id) => {
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.filter(ann => ann.id !== id)
    }));
  };

  // --- Services ---
  const addService = (item) => {
    const newItem = {
      ...item,
      id: 'serv-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      services: [...prev.services, newItem]
    }));
    return newItem;
  };

  const updateService = (id, updated) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, ...updated } : s)
    }));
  };

  const deleteService = (id) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  // --- Gallery ---
  const addGalleryItem = (item) => {
    const newItem = {
      ...item,
      id: 'gal-' + Date.now()
    };
    setData(prev => ({
      ...prev,
      gallery: [newItem, ...prev.gallery]
    }));
    return newItem;
  };

  const deleteGalleryItem = (id) => {
    setData(prev => ({
      ...prev,
      gallery: prev.gallery.filter(g => g.id !== id)
    }));
  };

  // --- Videos ---
  const addVideo = (item) => {
    const newItem = {
      ...item,
      id: 'vid-' + Date.now(),
      publishedDate: item.publishedDate || new Date().toISOString().split('T')[0],
    };
    setData(prev => ({
      ...prev,
      videos: [newItem, ...prev.videos]
    }));
    return newItem;
  };

  const updateVideo = (id, updated) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(v => v.id === id ? { ...v, ...updated } : v)
    }));
  };

  const deleteVideo = (id) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.filter(v => v.id !== id)
    }));
  };

  const setDailyFeaturedVideo = (id) => {
    setData(prev => ({
      ...prev,
      videos: prev.videos.map(v => ({
        ...v,
        isDailyFeatured: v.id === id
      }))
    }));
  };

  // --- Messages ---
  const addMessage = (msg) => {
    const newMsg = {
      ...msg,
      id: 'msg-' + Date.now(),
      date: new Date().toLocaleString(),
      read: false
    };
    setData(prev => ({
      ...prev,
      messages: [newMsg, ...prev.messages]
    }));
    return newMsg;
  };

  const markMessageRead = (id) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, read: true } : m)
    }));
  };

  const deleteMessage = (id) => {
    setData(prev => ({
      ...prev,
      messages: prev.messages.filter(m => m.id !== id)
    }));
  };

  // --- Password ---
  const updateAdminPassword = (newPass) => {
    setData(prev => ({
      ...prev,
      adminPassword: newPass
    }));
  };

  // --- Backup & Restore ---
  const resetToDefaults = () => {
    const defaults = {
      ...initialData,
      adminPassword: 'admin123'
    };
    setData(defaults);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
  };

  const exportDataJson = () => {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `amsed_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importDataJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.association) {
        setData(parsed);
        return { success: true };
      }
      return { success: false, error: 'Invalid JSON format' };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return (
    <DataContext.Provider value={{
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
      addMessage,
      markMessageRead,
      deleteMessage,
      updateAdminPassword,
      resetToDefaults,
      exportDataJson,
      importDataJson,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
