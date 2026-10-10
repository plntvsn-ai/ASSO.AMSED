import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { 
  defaultCmsData, 
  loadLocalCmsData, 
  saveLocalCmsData, 
  extractYouTubeId, 
  fetchYouTubeInfo 
} from '../services/cmsService';
import { executeAutoPublish } from '../services/autoPublisher';
import { db, isFirebaseConfigured, initFirebase, getStoredFirebaseConfig } from '../services/firebase';
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';

const CmsContext = createContext();

export const CmsProvider = ({ children }) => {
  const [cmsData, setCmsData] = useState(() => loadLocalCmsData());
  const [firebaseStatus, setFirebaseStatus] = useState(isFirebaseConfigured);
  const [loading, setLoading] = useState(false);

  // Real-time synchronization with Firestore (Online & Offline cache)
  useEffect(() => {
    if (!db || !firebaseStatus) return;

    setLoading(true);
    const unsubscribe = onSnapshot(
      doc(db, "settings", "cmsConfig"),
      (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          setCmsData(prev => {
            const merged = { ...prev, ...remoteData };
            saveLocalCmsData(merged);
            return merged;
          });
        }
        setLoading(false);
      },
      (err) => {
        console.warn('Firestore real-time sync notice:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [firebaseStatus]);

  // Synchronize across open windows / tabs on the same device
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'amsed_cms_database_v3' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setCmsData(parsed);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Helper to persist updates to both state, local storage, and Firestore
  const persistUpdate = async (key, value) => {
    setCmsData(prev => {
      const updated = { ...prev, [key]: value };
      saveLocalCmsData(updated);
      return updated;
    });

    // Save to Firestore if available
    if (db) {
      try {
        await setDoc(doc(db, "settings", "cmsConfig"), { [key]: value }, { merge: true });
        // Also save specific subcollections if needed
        if (key === 'articles') {
          await setDoc(doc(db, "content", "articles"), { list: value }, { merge: true });
        } else if (key === 'menus') {
          await setDoc(doc(db, "content", "menus"), value, { merge: true });
        } else if (key === 'buttons') {
          await setDoc(doc(db, "content", "buttons"), value, { merge: true });
        }
      } catch (err) {
        console.warn(`Failed to save ${key} to Firestore:`, err);
      }
    }
  };

  // --- 1. Articles Operations ---
  const addArticle = (newArticle) => {
    const article = {
      ...newArticle,
      id: 'art-' + Date.now(),
      createdAt: newArticle.createdAt || new Date().toISOString().split('T')[0],
      published: newArticle.published !== undefined ? newArticle.published : true
    };
    const updated = [article, ...cmsData.articles];
    persistUpdate('articles', updated);
    return article;
  };

  const updateArticle = (id, updatedFields) => {
    const updated = cmsData.articles.map(art => 
      art.id === id ? { ...art, ...updatedFields } : art
    );
    persistUpdate('articles', updated);
  };

  const deleteArticle = (id) => {
    const updated = cmsData.articles.filter(art => art.id !== id);
    persistUpdate('articles', updated);
  };

  const toggleArticlePublish = (id) => {
    const updated = cmsData.articles.map(art => 
      art.id === id ? { ...art, published: !art.published } : art
    );
    persistUpdate('articles', updated);
  };

  // --- 2. Menus Operations ---
  const updateHeaderMenus = (headerMenus) => {
    const updated = { ...cmsData.menus, headerMenus };
    persistUpdate('menus', updated);
  };

  const updateFooterMenus = (footerMenus) => {
    const updated = { ...cmsData.menus, footerMenus };
    persistUpdate('menus', updated);
  };

  // --- 3. Buttons Operations ---
  const updateButtons = (newButtons) => {
    const updated = { ...cmsData.buttons, ...newButtons };
    persistUpdate('buttons', updated);
  };

  // --- 4. Pages Operations ---
  const updatePageSection = (pageKey, sectionId, sectionData) => {
    const pageObj = cmsData.pages[pageKey] || { sections: [] };
    const updatedSections = pageObj.sections.map(sec => 
      sec.id === sectionId ? { ...sec, ...sectionData } : sec
    );
    const updatedPages = {
      ...cmsData.pages,
      [pageKey]: {
        ...pageObj,
        sections: updatedSections
      }
    };
    persistUpdate('pages', updatedPages);
  };

  const addPageSection = (pageKey, sectionData) => {
    const pageObj = cmsData.pages[pageKey] || { sections: [] };
    const newSection = {
      ...sectionData,
      id: 'sec-' + Date.now(),
      visible: true
    };
    const updatedPages = {
      ...cmsData.pages,
      [pageKey]: {
        ...pageObj,
        sections: [...pageObj.sections, newSection]
      }
    };
    persistUpdate('pages', updatedPages);
  };

  const deletePageSection = (pageKey, sectionId) => {
    const pageObj = cmsData.pages[pageKey] || { sections: [] };
    const updatedPages = {
      ...cmsData.pages,
      [pageKey]: {
        ...pageObj,
        sections: pageObj.sections.filter(sec => sec.id !== sectionId)
      }
    };
    persistUpdate('pages', updatedPages);
  };

  // --- 5. Hero Config Operations ---
  const updateHero = (heroData) => {
    const updated = { ...cmsData.hero, ...heroData };
    persistUpdate('hero', updated);
  };

  // --- 6. Stats Config Operations ---
  const updateStats = (statsData) => {
    const updated = { ...cmsData.stats, ...statsData };
    persistUpdate('stats', updated);
  };

  // --- 7. Videos Operations ---
  const addVideo = async (videoData) => {
    const cleanedId = extractYouTubeId(videoData.youtubeId || videoData.url || '');
    let info = { title: videoData.title, thumbnail_url: '' };
    if (!videoData.title && cleanedId) {
      info = await fetchYouTubeInfo(`https://www.youtube.com/watch?v=${cleanedId}`);
    }

    const newVid = {
      id: 'vid-' + Date.now(),
      youtubeId: cleanedId,
      title: videoData.title || info.title || 'فيديو أنشطة الجمعية',
      desc: videoData.desc || '',
      publishedDate: videoData.publishedDate || new Date().toISOString().split('T')[0],
      isDailyFeatured: videoData.isDailyFeatured || false,
      views: videoData.views || '10K+'
    };

    const updated = [newVid, ...cmsData.videos];
    persistUpdate('videos', updated);
    return newVid;
  };

  const updateVideo = (id, videoData) => {
    const cleanedId = extractYouTubeId(videoData.youtubeId || videoData.url || '');
    const updated = cmsData.videos.map(v => 
      v.id === id ? { ...v, ...videoData, youtubeId: cleanedId || v.youtubeId } : v
    );
    persistUpdate('videos', updated);
  };

  const deleteVideo = (id) => {
    const updated = cmsData.videos.filter(v => v.id !== id);
    persistUpdate('videos', updated);
  };

  const setFeaturedVideo = (id) => {
    const updated = cmsData.videos.map(v => ({
      ...v,
      isDailyFeatured: v.id === id
    }));
    persistUpdate('videos', updated);
  };

  // --- 8. Gallery Operations ---
  const addGalleryItem = (item) => {
    const newItem = {
      id: 'gal-' + Date.now(),
      ...item
    };
    const updated = [newItem, ...cmsData.gallery];
    persistUpdate('gallery', updated);
  };

  const deleteGalleryItem = (id) => {
    const updated = cmsData.gallery.filter(g => g.id !== id);
    persistUpdate('gallery', updated);
  };

  // --- 9. Archives (PDFs) Operations ---
  const addArchive = (archiveData) => {
    const newArch = {
      id: 'arch-' + Date.now(),
      ...archiveData,
      date: archiveData.date || new Date().toISOString().split('T')[0]
    };
    const updated = [newArch, ...cmsData.archives];
    persistUpdate('archives', updated);
  };

  const deleteArchive = (id) => {
    const updated = cmsData.archives.filter(a => a.id !== id);
    persistUpdate('archives', updated);
  };

  // --- 10. Contact Info ---
  const updateContact = (contactData) => {
    const updated = { ...cmsData.contact, ...contactData };
    persistUpdate('contact', updated);
  };

  // --- 11. Logo Config ---
  const updateLogo = (logoData) => {
    const updated = { ...cmsData.logo, ...logoData };
    persistUpdate('logo', updated);
  };

  // --- 12. Firebase Settings ---
  const saveFirebaseConfig = (config) => {
    try {
      localStorage.setItem('amsed_firebase_config', JSON.stringify(config));
      const initResult = initFirebase(config);
      setFirebaseStatus(initResult.isConfigured);
      return { success: true, isConfigured: initResult.isConfigured };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  // --- Reset All CMS Data to Defaults ---
  const resetCmsDefaults = () => {
    setCmsData(defaultCmsData);
    saveLocalCmsData(defaultCmsData);
    if (db) {
      try {
        setDoc(doc(db, "settings", "cmsConfig"), defaultCmsData);
      } catch (err) {
        console.warn('Failed to reset Firestore:', err);
      }
    }
  };

  // --- 13. Autonomous Publisher Operations ---
  const updateMultipleCmsData = (updates) => {
    setCmsData(prev => {
      const updated = { ...prev, ...updates };
      saveLocalCmsData(updated);
      return updated;
    });

    if (db) {
      try {
        setDoc(doc(db, "settings", "cmsConfig"), updates, { merge: true });
        if (updates.autoSettings) {
          setDoc(doc(db, "autoSettings", "main"), updates.autoSettings, { merge: true });
        }
        if (updates.autoTopics) {
          setDoc(doc(db, "autoTopics", "list"), { topics: updates.autoTopics }, { merge: true });
        }
        if (updates.articles) {
          setDoc(doc(db, "content", "articles"), { list: updates.articles }, { merge: true });
        }
      } catch (err) {
        console.warn('Failed to save batch updates to Firestore:', err);
      }
    }
  };

  const updateAutoSettings = (settingsData) => {
    const updated = { ...(cmsData.autoSettings || {}), ...settingsData };
    persistUpdate('autoSettings', updated);
    if (db) {
      setDoc(doc(db, "autoSettings", "main"), updated, { merge: true }).catch(() => {});
    }
  };

  const updateAutoTopics = (topicsList) => {
    persistUpdate('autoTopics', topicsList);
    if (db) {
      setDoc(doc(db, "autoTopics", "list"), { topics: topicsList }, { merge: true }).catch(() => {});
    }
  };

  const bulkAddAutoTopics = (textLines) => {
    const lines = textLines
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    const newTopics = lines.map((title, idx) => ({
      id: 'top-' + Date.now() + '-' + idx,
      title,
      category: 'التعليم والإدماج',
      used: false,
      createdAt: new Date().toISOString()
    }));

    const updated = [...(cmsData.autoTopics || []), ...newTopics];
    updateAutoTopics(updated);
    return newTopics.length;
  };

  const toggleTopicUsed = (id) => {
    const updated = (cmsData.autoTopics || []).map(t => 
      t.id === id ? { ...t, used: !t.used } : t
    );
    updateAutoTopics(updated);
  };

  const deleteAutoTopic = (id) => {
    const updated = (cmsData.autoTopics || []).filter(t => t.id !== id);
    updateAutoTopics(updated);
  };

  const triggerAutoPublish = async () => {
    return await executeAutoPublish({
      cmsData,
      updateCmsData: updateMultipleCmsData
    });
  };

  // Automated background runner (Checks if nextRun arrived)
  const isPublishingRef = useRef(false);

  useEffect(() => {
    const checkSchedule = async () => {
      if (!cmsData.autoSettings?.enabled || isPublishingRef.current) return;
      
      const nextRunStr = cmsData.autoSettings?.nextRun;
      const now = new Date();
      
      // If nextRun has arrived
      if (nextRunStr && new Date(nextRunStr) <= now) {
        isPublishingRef.current = true;
        try {
          await executeAutoPublish({
            cmsData,
            updateCmsData: updateMultipleCmsData
          });
        } catch (e) {
          console.error("Auto publish error:", e);
        } finally {
          isPublishingRef.current = false;
        }
      }
    };

    checkSchedule();
    const interval = setInterval(checkSchedule, 60000);
    return () => clearInterval(interval);
  }, [cmsData.autoSettings, cmsData.autoTopics]);

  return (
    <CmsContext.Provider value={{
      cmsData,
      loading,
      firebaseStatus,
      // Articles
      addArticle,
      updateArticle,
      deleteArticle,
      toggleArticlePublish,
      // Auto Publisher
      updateAutoSettings,
      updateAutoTopics,
      bulkAddAutoTopics,
      toggleTopicUsed,
      deleteAutoTopic,
      triggerAutoPublish,
      updateMultipleCmsData,
      // Menus
      updateHeaderMenus,
      updateFooterMenus,
      // Buttons
      updateButtons,
      // Pages
      updatePageSection,
      addPageSection,
      deletePageSection,
      // Hero
      updateHero,
      // Stats
      updateStats,
      // Videos
      addVideo,
      updateVideo,
      deleteVideo,
      setFeaturedVideo,
      // Gallery
      addGalleryItem,
      deleteGalleryItem,
      // Archives
      addArchive,
      deleteArchive,
      // Contact
      updateContact,
      // Logo
      updateLogo,
      // Firebase
      saveFirebaseConfig,
      resetCmsDefaults
    }}>
      {children}
    </CmsContext.Provider>
  );
};

export const useCms = () => useContext(CmsContext);
