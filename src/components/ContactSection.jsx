import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import { useCms } from '../context/CmsContext';
import { 
  Phone, Mail, MapPin, Send, MessageSquare, 
  CheckCircle2, Clock, ShieldCheck, Compass, ExternalLink, Navigation 
} from 'lucide-react';
import { FacebookIcon, YoutubeIcon } from './SocialIcons';

export const ContactSection = () => {
  const { lang, dir, t, getLocalized } = useLanguage();
  const { data, addMessage } = useData();
  const { cmsData } = useCms();
  const [siteSettings, setSiteSettings] = useState(() => {
    try {
      const cached = localStorage.getItem('site_settings');
      if (cached) return JSON.parse(cached);
    } catch {}
    return {};
  });

  React.useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(d => {
        if (d?.data) setSiteSettings(d.data);
      })
      .catch(() => {});
  }, []);

  const association = { 
    ...data.association, 
    ...(cmsData?.contact || {}), 
    ...siteSettings,
    phone1: siteSettings.phone1 || cmsData?.contact?.phone1 || data.association?.phone1 || '06 54 24 05 23',
    phone2: siteSettings.phone2 || cmsData?.contact?.phone2 || data.association?.phone2 || '06 63 78 01 07',
    phone3: siteSettings.phone3 || '',
    working_hours: siteSettings.working_hours || 'الإثنين - الجمعة: 08:30 إلى 17:00 | السبت: 09:00 إلى 13:00'
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;

    setLoading(true);

    try {
      const { addDoc, collection, serverTimestamp } = await import("firebase/firestore");
      const { db } = await import("../firebase");
      if (db) {
        await addDoc(collection(db, "contacts"), {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          status: "new",
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      console.warn("Could not save to Firestore contacts collection:", err);
    }

    try {
      addMessage({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject || (lang === 'ar' ? 'مثال: استفسار، اقتراح' : 'General Inquiry'),
        message: formData.message,
      });
    } catch (e) {}

    setLoading(false);
    setSubmitted(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    });

    setTimeout(() => setSubmitted(false), 6000);
  };

  // Convert 0663780107 to Moroccan international WhatsApp format
  const getWhatsappUrl = () => {
    const raw = (association.phone1 || '0663780107').replace(/\D/g, '');
    const intl = raw.startsWith('0') ? '212' + raw.substring(1) : raw;
    const text = encodeURIComponent(
      lang === 'ar' 
        ? 'السلام عليكم، أتواصل معكم بخصوص جمعية المبادرة المغربية للتعاون والتكافل لرعاية الأطفال في وضعية صعبة - AMSED.'
        : 'Bonjour, je vous contacte concernant l\'Association Initiative Marocaine pour la Solidarité et la Coopération - AMSED.'
    );
    return `https://wa.me/${intl}?text=${text}`;
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 border border-emerald-200">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>{t('contact', 'badge')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('contact', 'title')}
          </h2>
          <p className="mt-3 text-slate-600 text-base sm:text-lg">
            {t('contact', 'subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details & Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Phone Numbers Card */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3 text-emerald-800 font-bold text-base">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                  <Phone className="w-5 h-5" />
                </div>
                <span>{t('contact', 'phoneNumbers')}</span>
              </div>

              <div className={`grid grid-cols-1 ${association.phone3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-3 pt-2`}>
                <a
                  href={`tel:${association.phone1}`}
                  className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition block text-center"
                >
                  <span className="text-xs text-slate-500 block mb-1">
                    {lang === 'ar' ? 'الرقم الأول (واتساب)' : 'Ligne 1 (WhatsApp)'}
                  </span>
                  <span className="text-sm font-extrabold text-emerald-800 inline-block font-mono" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                    {association.phone1}
                  </span>
                </a>

                {association.phone2 && (
                  <a
                    href={`tel:${association.phone2}`}
                    className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition block text-center"
                  >
                    <span className="text-xs text-slate-500 block mb-1">
                      {lang === 'ar' ? 'الرقم الثاني' : 'Ligne 2'}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-800 inline-block font-mono" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                      {association.phone2}
                    </span>
                  </a>
                )}

                {association.phone3 && (
                  <a
                    href={`tel:${association.phone3}`}
                    className="p-3 bg-white hover:bg-emerald-50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition block text-center"
                  >
                    <span className="text-xs text-slate-500 block mb-1">
                      {lang === 'ar' ? 'الرقم الثالث' : 'Ligne 3'}
                    </span>
                    <span className="text-sm font-extrabold text-emerald-800 inline-block font-mono" dir="ltr" style={{ unicodeBidi: 'isolate' }}>
                      {association.phone3}
                    </span>
                  </a>
                )}
              </div>

              {/* Direct WhatsApp Action Button */}
              <a
                href={getWhatsappUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl shadow transition"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t('contact', 'whatsappDirect')}</span>
              </a>
            </div>

            {/* Email & Address Card */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-500 font-semibold mb-1">
                    {t('contact', 'emailAddress')}
                  </h4>
                  <a
                    href={`mailto:${association.email}`}
                    className="text-sm font-bold text-slate-900 hover:text-emerald-700 transition"
                  >
                    {association.email}
                  </a>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4 pt-3 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs text-slate-500 font-semibold mb-1">
                    {t('contact', 'address')}
                  </h4>
                  <p className="text-sm text-slate-800 leading-snug">
                    {lang === 'ar' ? association.addressAr : lang === 'fr' ? association.addressFr : association.addressEn}
                  </p>
                </div>
              </div>
            </div>

            {/* Working Hours Card (أوقات وساعات العمل والاستقبال) */}
            <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center gap-3 text-emerald-800 font-bold text-base">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                  <Clock className="w-5 h-5" />
                </div>
                <span>
                  {lang === 'ar' ? 'أوقات العمل والاستقبال' : lang === 'fr' ? "Horaires d'ouverture" : 'Working Hours'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-800 font-semibold whitespace-pre-line leading-relaxed bg-white p-3.5 rounded-2xl border border-slate-200">
                {association.working_hours || (
                  lang === 'ar' 
                    ? 'الإثنين - الجمعة: 08:30 إلى 17:00\nالسبت: 09:00 إلى 13:00\nالأحد: مغلق' 
                    : lang === 'fr'
                    ? 'Lundi - Vendredi: 08h30 - 17h00\nSamedi: 09h00 - 13h00\nDimanche: Fermé'
                    : 'Monday - Friday: 08:30 - 17:00\nSaturday: 09:00 - 13:00\nSunday: Closed'
                )}
              </p>
            </div>

            {/* Social Links Card */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white mb-1">
                  {t('contact', 'socialMedia')}
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' ? 'تابع أنشطتنا وقنواتنا الرسمية' : lang === 'fr' ? 'Suivez-nous sur les réseaux' : 'Follow us on social channels'}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {association.facebookUrl && (
                  <a
                    href={association.facebookUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition shadow"
                    title="Facebook"
                  >
                    <FacebookIcon className="w-5 h-5" />
                  </a>
                )}
                {association.youtubeUrl && (
                  <a
                    href={association.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-11 h-11 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center justify-center transition shadow"
                    title="YouTube"
                  >
                    <YoutubeIcon className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>

          </div>

          {/* Interactive Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-slate-50 rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm relative">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-slate-900">
                {t('contact', 'sendMessage')}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                {lang === 'ar' 
                  ? 'املأ النموذج وسيقوم مسؤول الجمعية بالتواصل معك مباشرة.' 
                  : lang === 'fr'
                  ? 'Remplissez le formulaire et notre équipe prendra contact avec vous.'
                  : 'Fill out the form and our team will get in touch with you shortly.'}
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 flex items-center gap-3 animate-fadeIn">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <p className="text-xs sm:text-sm font-semibold">
                  {t('contact', 'successMsg')}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('contact', 'formName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={lang === 'ar' ? 'محمد بناني' : 'Mohamed Bennani'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('contact', 'formPhone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="06XXXXXXXX"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('contact', 'formEmail')}
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="example@mail.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('contact', 'formSubject')}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={lang === 'ar' ? 'مثال: استفسار، اقتراح' : lang === 'fr' ? 'Ex: Information, suggestion' : 'E.g.: Inquiry, proposal'}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {t('contact', 'formMessage')} *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={lang === 'ar' ? 'اكتب تفاصيل طلبك أو رسالتك هنا...' : lang === 'fr' ? 'Écrivez votre message ici...' : 'Write your message or inquiry here...'}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-slate-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? t('contact', 'sending') : t('contact', 'sendBtn')}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Official Google Maps Location Card */}
        <div className="mt-14 bg-slate-50 rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900 to-emerald-950 text-white">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
                <Navigation className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'مقر الجمعية الميداني' : lang === 'fr' ? 'Siège Opérationnel' : 'Operational Headquarters'}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {lang === 'ar' ? 'موقعنا على الخريطة (القنيطرة)' : lang === 'fr' ? 'Notre Localisation sur la Carte (Kénitra)' : 'Our Location on Google Maps (Kenitra)'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                📍 {lang === 'ar' ? association.addressAr : lang === 'fr' ? association.addressFr : association.addressEn}
              </p>
            </div>

            {(() => {
              const mapLat = siteSettings?.lat || association?.lat || '34.250676';
              const mapLng = siteSettings?.lng || association?.lng || '-6.540316';
              return (
                <a
                  href={`https://www.google.com/maps?q=${mapLat},${mapLng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:-translate-y-0.5 shrink-0"
                >
                  <Compass className="w-5 h-5" />
                  <span>{lang === 'ar' ? 'فتح الموقع في تطبيق Google Maps' : lang === 'fr' ? 'Ouvrir dans Google Maps' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              );
            })()}
          </div>

          {/* Interactive Map Iframe */}
          <div className="relative w-full h-80 sm:h-96 bg-slate-100">
            {(() => {
              const mapLat = siteSettings?.lat || association?.lat || '34.250676';
              const mapLng = siteSettings?.lng || association?.lng || '-6.540316';
              return (
                <iframe
                  title={lang === 'ar' ? "موقع جمعية المبادرة المغربية للتكافل والتعاون بالقنيطرة" : "AMSED Association Location Kenitra"}
                  src={`https://maps.google.com/maps?q=${mapLat},${mapLng}&hl=${lang}&z=17&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              );
            })()}

            {/* Float badge over map */}
            <div className="absolute top-4 start-4 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-slate-200 max-w-xs pointer-events-none">
              <div className="flex items-center gap-2 text-xs font-black text-emerald-800">
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{lang === 'ar' ? 'جمعية المبادرة المغربية (الساكنية)' : 'AMSED (Saknia)'}</span>
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                {lang === 'ar' ? 'تجزئة الحزام، رقم د 25، القنيطرة' : 'Lotissement El Hizam, N° D 25, Kénitra'}
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
