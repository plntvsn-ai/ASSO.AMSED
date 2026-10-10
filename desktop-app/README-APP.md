# 🛡️ تطبيق لوحة التحكم المستقل - AMSED Admin Desktop & Mobile

تم عزل لوحة تحكم إدارة موقع جمعية AMSED بالكامل عن واجهة الزوار العامة، وحمايتها بـ **رابط سري ومفتاح مصادقة مشفر**:

---

## 🔑 بيانات الرابط السري ومفتاح الدخول
- **المسار السري (Secret Route):**  
  `/portal-amsed-secure-x98k21/admin`
- **مفتاح الحماية (Secret Key):**  
  `key=amsed_vault_secure_987654`
- **الرابط الكامل المباشر (محلياً):**  
  `http://localhost:5173/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654`
- **الرابط الكامل المباشر (عند الرفع على Vercel):**  
  `https://<YOUR_VERCEL_DOMAIN>/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654`

> ⚠️ **ملاحظة أمنية:** أي زائر عام يحاول الدخول للرابط التقليدي `/admin` بدون هذا المفتاح السري، سيتم طرده وتوجيهه تلقائياً إلى الصفحة الرئيسية فوراً.

---

## 💻 1. تشغيل التطبيق المكتبي المستقل (Desktop App للكمبيوتر)
تم إنشاء أيقونة تشغيل مباشرة على سطح المكتب لديك:
📁 **`C:\Users\d-a\Desktop\AMSED Admin Portal.lnk`**

أو يمكنك تشغيله من هذا المجلد:
- اضغط نقراً مزدوجاً على: **`launch-amsed-admin.bat`**
- سيفتح التطبيق في نافذة مكتبية مستقلة تماماً (Window Mode بدون شريط روابط أو أزرار متصفح، مثل أي برنامج .exe رسمي).

### 🌐 لتوجيه تطبيق سطح المكتب إلى رابط Vercel المنشور:
افتح ملف `desktop-app\launch-amsed-admin.bat` في أي محرر نصوص وغيّر السطر:
```bat
set "ADMIN_URL=https://<YOUR_VERCEL_DOMAIN>/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654"
```

---

## 📱 2. تثبيت التطبيق على الهواتف الذكية (Android / iOS) كـ تطبيق مستقل (.apk / PWA)
1. من هاتفك، افتح متصفح Chrome أو Safari وادخل إلى الرابط السري:  
   `https://<YOUR_DOMAIN>/portal-amsed-secure-x98k21/admin?key=amsed_vault_secure_987654`
2. اضغط على قائمة المتصفح (الثلاث نقاط في الأعلى).
3. اختر **"تثبيت التطبيق" (Install app)** أو **"إضافة إلى الشاشة الرئيسية" (Add to Home Screen)**.
4. سيظهر تطبيق AMSED Admin كأيقونة تطبيق مستقلة على هاتفك بدون شريط متصفح، تعمل بملء الشاشة مع حفظ تسجيل الدخول!
