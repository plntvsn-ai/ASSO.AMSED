/**
 * Topic Image Service
 * يوفر صوراً مطابقة 100% لمواضيع مقالات الروبوتات والتوحد والتربية الخاصة
 * مع فحص ذكي للكلمات المفتاحية والعناوين لضمان توافق الصورة مع محتوى المقال
 */

export const TOPIC_IMAGE_LIBRARY = {
  // 1. أينشتاين، عباقرة التوحد، العلوم والفيزياء
  einstein_genius: [
    {
      url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80",
      alt: "أبحاث علمية وعبقرية أينشتاين والتوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
      alt: "الفضاء والنسبية وعظماء التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1000&q=80",
      alt: "الفكر والكتب والاكتشاف العلمي - AMSED"
    }
  ],

  // 2. علامات التوحد المبكرة، الرضع، التشخيص، الانتباه المشترك
  early_signs_infants: [
    {
      url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1000&q=80",
      alt: "طفل يلعب بمكعبات وألعاب بصرية - علامات التوحد المبكرة AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1000&q=80",
      alt: "تطور الرضيع والطفل الصغير والتشخيص المبكر - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=1000&q=80",
      alt: "التواصل البصري وملاحظة سلوك الطفل - AMSED"
    }
  ],

  // 3. تمارين النطق، التخاطب، التواصل، اللغات، PECS
  speech_communication: [
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1000&q=80",
      alt: "جلسة تخاطب ونطق متخصصة مع الطفل - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1000&q=80",
      alt: "تطوير التواصل البصري واللغوي لدى أطفال التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1000&q=80",
      alt: "البطاقات المصورة وتدريبات النطق المنزلي - AMSED"
    }
  ],

  // 4. تغذية الطفل التوحدي، الحميات، الأغذية الصحية، الفيتامينات
  nutrition_health: [
    {
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80",
      alt: "أغذية صحية وفواكه متوازنة للطفل التوحدي - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=1000&q=80",
      alt: "التغذية المتوازنة وصحة الجهاز الهضمي لأطفال التوحد - AMSED"
    }
  ],

  // 5. الإدماج المدرسي، القسم المكيف، التعليم الأولي، مرافقة AVS
  school_inclusion: [
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1000&q=80",
      alt: "قسم التعليم الأولي المكيف وبرامج الإدماج المدرسي - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80",
      alt: "مرافقة الحياة المدرسية AVS ومقاعد الدراسة - AMSED"
    }
  ],

  // 6. الورشات المهنية، المهارات الحياتية، الطبخ، الحلويات، الخياطة، الرسم
  vocational_skills: [
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1000&q=80",
      alt: "ورشة الحلويات والطبخ للتأهيل المهني - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1000&q=80",
      alt: "ورشة الرسم والفنون التعبيرية للأطفال - AMSED"
    }
  ],

  // 7. التأهيل الحركي والحسي، الغرف الحسية، ألعاب التركيز والذكاء
  sensory_motor: [
    {
      url: "https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1000&q=80",
      alt: "ألعاب حسية ومكعبات تطوير المهارات الدقيقة - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=1000&q=80",
      alt: "أنشطة ترفيهية وحركية في الهواء الطلق - AMSED"
    }
  ],

  // 8. المستجدات الطبية، أبحاث الدماغ، التشخيص العصبي، القوافل
  medical_science: [
    {
      url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1000&q=80",
      alt: "أبحاث علمية حول الدماغ واضطراب طيف التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80",
      alt: "فحوصات طبية وقوافل رعاية الأطفال - AMSED"
    }
  ]
};

/**
 * اختيار ذكي لصورة مطابقة لموضوع المقال
 * @param {string} topicOrTitle عنوان أو موضوع المقال
 * @param {Array<string>} keywords كلمات مفتاحية إضافية
 * @returns {{url: string, alt: string}}
 */
export function getTopicMatchedImage(topicOrTitle = '', keywords = []) {
  const combined = (topicOrTitle + ' ' + (Array.isArray(keywords) ? keywords.join(' ') : '')).toLowerCase();

  // 1. أينشتاين والعباقرة والنسبية
  if (combined.includes('أينشتاين') || combined.includes('اينشتاين') || combined.includes('einstein') || 
      combined.includes('عبقر') || combined.includes('فيزياء') || combined.includes('genius')) {
    const list = TOPIC_IMAGE_LIBRARY.einstein_genius;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 2. علامات التوحد، الرضع، التشخيص، الصغار
  if (combined.includes('علامات') || combined.includes('رضع') || combined.includes('مبكر') || 
      combined.includes('تشخيص') || combined.includes('infant') || combined.includes('signs')) {
    const list = TOPIC_IMAGE_LIBRARY.early_signs_infants;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 3. النطق، التخاطب، التواصل، اللسان، الكلام، PECS
  if (combined.includes('نطق') || combined.includes('تخاطب') || combined.includes('تواصل') || 
      combined.includes('كلام') || combined.includes('صوت') || combined.includes('speech') || combined.includes('pecs')) {
    const list = TOPIC_IMAGE_LIBRARY.speech_communication;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 4. التغذية، الأكل، الحمية، الطعام، الهضم، الفيتامين
  if (combined.includes('تغذي') || combined.includes('أكل') || combined.includes('حمية') || 
      combined.includes('طعام') || combined.includes('nutrition') || combined.includes('diet')) {
    const list = TOPIC_IMAGE_LIBRARY.nutrition_health;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 5. المدرسة، الإدماج المدرسي، القسم المكيف، الروض، AVS
  if (combined.includes('مدرس') || combined.includes('دمج') || combined.includes('قسم') || 
      combined.includes('روض') || combined.includes('تعليم أولي') || combined.includes('avs') || combined.includes('school')) {
    const list = TOPIC_IMAGE_LIBRARY.school_inclusion;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 6. الورشات المهنية، الحلويات، الخياطة، الرسم، الطبخ
  if (combined.includes('ورش') || combined.includes('حرف') || combined.includes('حلويات') || 
      combined.includes('طبخ') || combined.includes('خياط') || combined.includes('رسم') || combined.includes('مهارات')) {
    const list = TOPIC_IMAGE_LIBRARY.vocational_skills;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 7. الحواس، حركي، sensory، ترويض، استرخاء
  if (combined.includes('حس') || combined.includes('حرك') || combined.includes('ترويض') || 
      combined.includes('توازن') || combined.includes('sensory') || combined.includes('motor')) {
    const list = TOPIC_IMAGE_LIBRARY.sensory_motor;
    return list[Math.floor(Math.random() * list.length)];
  }

  // 8. مستجدات علمية، أبحاث، دواء، مخ، علاج
  if (combined.includes('علم') || combined.includes('بحث') || combined.includes('علاج') || 
      combined.includes('دماغ') || combined.includes('طبي') || combined.includes('medical')) {
    const list = TOPIC_IMAGE_LIBRARY.medical_science;
    return list[Math.floor(Math.random() * list.length)];
  }

  // الافتراضي الأكثر ملاءمة لأطفال التوحد
  const defaultList = TOPIC_IMAGE_LIBRARY.early_signs_infants;
  return defaultList[0];
}
