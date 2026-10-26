/**
 * Topic Image Service & AI Image Matching Agent
 * يوفر صوراً مطابقة 100% لمواضيع مقالات الروبوتات والتوحد والتربية الخاصة والشخصيات التاريخية
 * مع استهداف دقيق بالاسم: أينشتاين، إيلون ماسك، بيل غيتس، تيسلا، نيوتن، موزارت، التغذية، السباحة، الخ.
 */

export const TOPIC_IMAGE_LIBRARY = {
  // 1. شخصيات تاريخية وعظماء العالم (بورتريهات شخصية حقيقية 100%)
  einstein: {
    url: "https://upload.wikimedia.org/wikipedia/commons/2/28/Albert_Einstein_Head_cleaned.jpg",
    alt: "ألبرت أينشتاين - عبقري الفيزياء وتحدي التوحد وتأخر النطق - AMSED"
  },
  bill_gates: {
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Bill_Gates_at_the_European_Commission_-_P067383-987995_%28cropped%29_5.jpg",
    alt: "بيل غيتس - مؤسس مايكروسوفت وثورة البرمجة والتركيز الفائق - AMSED"
  },
  elon_musk: {
    url: "https://upload.wikimedia.org/wikipedia/commons/6/69/Elon_Musk_-_54820081119_%283x4_cropped%2C_Rule_of_thirds%29.jpg",
    alt: "إيلون ماسك - رائد الفضاء والسيارات الكهربائية ومتلازمة أسبرجر - AMSED"
  },
  nikola_tesla: {
    url: "https://upload.wikimedia.org/wikipedia/commons/7/79/Tesla_circa_1890.jpeg",
    alt: "نيكولا تيسلا - عبقري الكهرباء والتفكير البصري الخارق - AMSED"
  },
  isaac_newton: {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Portrait_of_Sir_Isaac_Newton%2C_1689_%28brightened%29.jpg",
    alt: "إسحاق نيوتن - مكتشف الجاذبية وقوانين الحركة والعزلة العلمية - AMSED"
  },
  mozart: {
    url: "https://upload.wikimedia.org/wikipedia/commons/a/ad/The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg",
    alt: "فولفغانغ أماديوس موزارت - عبقري الموسيقى الكلاسيكية والذاكرة السمعية - AMSED"
  },
  greta_thunberg: {
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f8/Greta_Thunberg_in_May_2026_%28cropped_3x4%29.jpg",
    alt: "غريتا ثونبرغ - الناشطة البيئية الملهمة وقوة طيف التوحد - AMSED"
  },
  satoshi_tajiri: {
    url: "https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&w=1200&q=80",
    alt: "ساتوشي تاجيري - مبتكر عالم البوكيمون وشغف الطفولة والتوحد - AMSED"
  },

  // 2. التغذية الصحية، الحميات وخلو الغلوتين والكازين (خضر وفواكه طازجة)
  nutrition_health: [
    {
      url: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80",
      alt: "خضروات وفواكه طازجة وتغذية صحية متوازنة لأطفال التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80",
      alt: "أغذية صحية وحمية خالية من الغلوتين لأطفال طيف التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
      alt: "وجبات متوازنة تعزز صحة الجهاز الهضمي والتركيز للأطفال - AMSED"
    }
  ],

  // 3. ورشات الطبخ وإعداد الحلويات
  cooking_pastry: [
    {
      url: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80",
      alt: "ورشة تحضير الحلويات والطبخ لتنمية استقلالية الشباب - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1507048821117-6573c20c5b51?auto=format&fit=crop&w=1200&q=80",
      alt: "مهارات المطبخ وإعداد الوجبات الخفيفة لأطفال التوحد - AMSED"
    }
  ],

  // 4. تمارين النطق، التخاطب، التواصل، اللغات، والجداول البصرية PECS
  speech_communication: [
    {
      url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
      alt: "جلسة تخاطب ونطق متخصصة مع أخصائي الترويض - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=1200&q=80",
      alt: "تطوير النطق والتواصل البصري عبر البطاقات المصورة PECS - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
      alt: "تمارين علاج المصاداة اللفظية واكتساب الكلمات الوظيفية - AMSED"
    }
  ],

  // 5. السباحة العلاجية والأنشطة المائية
  water_therapy: [
    {
      url: "https://images.unsplash.com/photo-1530549387789-4c1017266635?auto=format&fit=crop&w=1200&q=80",
      alt: "السباحة العلاجية وتناسق حركة الجسم لأطفال التوحد - AMSED"
    }
  ],

  // 6. العلاج بالخيول والحيوانات الأليفة (Equithérapie)
  horse_animal_therapy: [
    {
      url: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80",
      alt: "العلاج بالخيول (Equithérapie) وتحفيز المشاعر والتواصل - AMSED"
    }
  ],

  // 7. الورشات المهنية، الحرف اليدوية، الخياطة، النجارة
  vocational_crafts: [
    {
      url: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80",
      alt: "ورشة الحرف اليدوية والمهارات الحركية الدقيقة - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
      alt: "ورشات النجارة والمهارات قبل المهنية لليافعين - AMSED"
    }
  ],

  // 8. العلاج بالفن التشكيلي، الرسم والتلوين
  art_therapy: [
    {
      url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80",
      alt: "ورشة الرسم الحر والفنون التشكيلية للتعبير العاطفي - AMSED"
    }
  ],

  // 9. العلاج بالموسيقى والإيقاعات
  music_therapy: [
    {
      url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
      alt: "العلاج بالموسيقى والإيقاعات الهادئة لتطوير النطق والهدوء - AMSED"
    }
  ],

  // 10. الغرفة الحسية، التكامل الحسي، فرط الحركة ونوبات الغضب
  sensory_room: [
    {
      url: "https://images.unsplash.com/photo-1508873696983-2df5293cb395?auto=format&fit=crop&w=1200&q=80",
      alt: "أنشطة الغرفة الحسية وتهدئة نوبات الانهيار الحسي - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1596464716127-f2a829822301?auto=format&fit=crop&w=1200&q=80",
      alt: "ألعاب التركيز والمكعبات الهندسية للتحكم الحركي - AMSED"
    }
  ],

  // 11. الإدماج المدرسي، القسم المكيف، ومرافقة الحياة المدرسية AVS
  school_inclusion: [
    {
      url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
      alt: "قسم التعليم الأولي المكيف وبرامج الإدماج المدرسي - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80",
      alt: "مرافقة الحياة المدرسية AVS ومساندة الطفل في الصف - AMSED"
    }
  ],

  // 12. الدعم النفسي للأسرة والآباء والأمهات
  family_support: [
    {
      url: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&w=1200&q=80",
      alt: "حنان ورعاية الأسرة والأم لطفل التوحد - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1536640712-4d4c36ff0e4e?auto=format&fit=crop&w=1200&q=80",
      alt: "الدور التربوي والأسري للأب في مواكبة طفل التوحد - AMSED"
    }
  ],

  // 13. أبحاث الدماغ والمستجدات الطبية والفحوصات
  medical_science: [
    {
      url: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=1200&q=80",
      alt: "أبحاث علمية وطبية حول الدماغ وطيف التوحد لعام 2026 - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
      alt: "فحوصات طبية وتدخل مبكر لأطفال التوحد بالقنيطرة - AMSED"
    }
  ],

  // 14. علامات التوحد المبكرة عند الرضع والصغار
  early_signs_infants: [
    {
      url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=1200&q=80",
      alt: "طفل صغير يلعب بالمكعبات وتطور الذكاء والانتباه المشترك - AMSED"
    },
    {
      url: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=80",
      alt: "العلامات النمائية والتشخيص المبكر عند الرضع من 6 أشهر - AMSED"
    }
  ]
};

function getDeterministicIndex(str = '', length = 1) {
  if (!length || length <= 1) return 0;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

/**
 * اختيار ذكي وصارم 100% لصورة مطابقة لموضوع المقال
 * @param {string} topicOrTitle عنوان أو موضوع المقال
 * @param {Array<string>} keywords كلمات مفتاحية إضافية
 * @returns {{url: string, alt: string}}
 */
export function getTopicMatchedImage(topicOrTitle = '', keywords = []) {
  const combined = (String(topicOrTitle) + ' ' + (Array.isArray(keywords) ? keywords.join(' ') : '')).toLowerCase();

  // 1. شخصيات محددة بعينها - صورة الشخص الحقيقية 100%
  if (combined.includes('أينشتاين') || combined.includes('اينشتاين') || combined.includes('einstein')) {
    return TOPIC_IMAGE_LIBRARY.einstein;
  }
  if (combined.includes('بيل غيتس') || combined.includes('غيتس') || combined.includes('gates') || combined.includes('مايكروسوفت')) {
    return TOPIC_IMAGE_LIBRARY.bill_gates;
  }
  if (combined.includes('إيلون ماسك') || combined.includes('ايلون ماسك') || combined.includes('ماسك') || combined.includes('musk') || combined.includes('سبيس اكس') || combined.includes('spacex')) {
    return TOPIC_IMAGE_LIBRARY.elon_musk;
  }
  if (combined.includes('نيكولا تيسلا') || combined.includes('تيسلا') || combined.includes('tesla')) {
    return TOPIC_IMAGE_LIBRARY.nikola_tesla;
  }
  if (combined.includes('إسحاق نيوتن') || combined.includes('اسحاق نيوتن') || combined.includes('نيوتن') || combined.includes('newton')) {
    return TOPIC_IMAGE_LIBRARY.isaac_newton;
  }
  if (combined.includes('موزارت') || combined.includes('mozart')) {
    return TOPIC_IMAGE_LIBRARY.mozart;
  }
  if (combined.includes('غريتا') || combined.includes('ثونبرغ') || combined.includes('greta')) {
    return TOPIC_IMAGE_LIBRARY.greta_thunberg;
  }
  if (combined.includes('تاجيري') || combined.includes('بوكيمون') || combined.includes('pokemon')) {
    return TOPIC_IMAGE_LIBRARY.satoshi_tajiri;
  }

  // 2. التغذية، الأكل، الحمية الغذائية، الغلوتين، الكازين، الفواكه والخضار
  if (combined.includes('تغذي') || combined.includes('أكل') || combined.includes('حمية') || 
      combined.includes('طعام') || combined.includes('غلوتين') || combined.includes('كازين') || 
      combined.includes('nutrition') || combined.includes('diet') || combined.includes('فيتامين')) {
    const list = TOPIC_IMAGE_LIBRARY.nutrition_health;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 3. ورشات الطبخ والحلويات والمطبخ
  if (combined.includes('حلويات') || combined.includes('طبخ') || combined.includes('مطبخ') || 
      combined.includes('طهي') || combined.includes('pastry') || combined.includes('cooking')) {
    const list = TOPIC_IMAGE_LIBRARY.cooking_pastry;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 4. السباحة العلاجية والأنشطة المائية والماء
  if (combined.includes('سباح') || combined.includes('مائ') || combined.includes('ماء') || combined.includes('مسبح') || combined.includes('swimming')) {
    return TOPIC_IMAGE_LIBRARY.water_therapy[0];
  }

  // 5. العلاج بالخيول والحيوانات الأليفة (Equithérapie)
  if (combined.includes('خيل') || combined.includes('خيول') || combined.includes('فروسية') || 
      combined.includes('حيوان') || combined.includes('equith') || combined.includes('horse')) {
    return TOPIC_IMAGE_LIBRARY.horse_animal_therapy[0];
  }

  // 6. النطق، التخاطب، التواصل، اللسان، الكلام، PECS، المصاداة
  if (combined.includes('نطق') || combined.includes('تخاطب') || combined.includes('تواصل') || 
      combined.includes('كلام') || combined.includes('صوت') || combined.includes('مصاداه') || 
      combined.includes('echolalia') || combined.includes('speech') || combined.includes('pecs')) {
    const list = TOPIC_IMAGE_LIBRARY.speech_communication;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 7. العلاج بالفن التشكيلي، الرسم، التلوين
  if (combined.includes('رسم') || combined.includes('فنون') || combined.includes('تشكيلي') || 
      combined.includes('تلوين') || combined.includes('art') || combined.includes('painting')) {
    return TOPIC_IMAGE_LIBRARY.art_therapy[0];
  }

  // 8. العلاج بالموسيقى والإيقاعات
  if (combined.includes('موسيق') || combined.includes('إيقاع') || combined.includes('music')) {
    return TOPIC_IMAGE_LIBRARY.music_therapy[0];
  }

  // 9. الورشات المهنية، النجارة، الخياطة، الحرف
  if (combined.includes('ورش') || combined.includes('حرف') || combined.includes('خياط') || 
      combined.includes('نجار') || combined.includes('مهارات') || combined.includes('تأهيل مهني') || combined.includes('حرفي')) {
    const list = TOPIC_IMAGE_LIBRARY.vocational_crafts;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 10. الحواس، حركي، sensory، ترويض، توازن، نوبات غضب، انهيار حسي
  if (combined.includes('حس') || combined.includes('حرك') || combined.includes('ترويض') || 
      combined.includes('توازن') || combined.includes('غرفة') || combined.includes('sensory') || 
      combined.includes('غضب') || combined.includes('انهيار') || combined.includes('meltdown') || combined.includes('فرط')) {
    const list = TOPIC_IMAGE_LIBRARY.sensory_room;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 11. الدعم النفسي للأسرة، الأب، الأم، الوالدين
  if (combined.includes('أسرة') || combined.includes('أم') || combined.includes('أب') || 
      combined.includes('والد') || combined.includes('نفسي') || combined.includes('إرهاق') || combined.includes('دعم')) {
    const list = TOPIC_IMAGE_LIBRARY.family_support;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 12. المدرسة، الإدماج المدرسي، القسم المكيف، الروض، AVS
  if (combined.includes('مدرس') || combined.includes('دمج') || combined.includes('قسم') || 
      combined.includes('روض') || combined.includes('تعليم أولي') || combined.includes('avs') || combined.includes('school')) {
    const list = TOPIC_IMAGE_LIBRARY.school_inclusion;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 13. مستجدات علمية، أبحاث، دواء، مخ، علاج، طب
  if (combined.includes('علم') || combined.includes('بحث') || combined.includes('علاج') || 
      combined.includes('دماغ') || combined.includes('طبي') || combined.includes('medical') || combined.includes('طبيب')) {
    const list = TOPIC_IMAGE_LIBRARY.medical_science;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // 14. علامات التوحد، الرضع، التشخيص، الصغار
  if (combined.includes('علامات') || combined.includes('رضع') || combined.includes('مبكر') || 
      combined.includes('تشخيص') || combined.includes('طفل') || combined.includes('infant') || combined.includes('signs')) {
    const list = TOPIC_IMAGE_LIBRARY.early_signs_infants;
    return list[getDeterministicIndex(topicOrTitle, list.length)];
  }

  // الافتراضي الأكثر ملاءمة لأطفال التوحد (صورة طفل حقيقية سعيدة تلعب وتتواصل)
  return TOPIC_IMAGE_LIBRARY.early_signs_infants[getDeterministicIndex(topicOrTitle, TOPIC_IMAGE_LIBRARY.early_signs_infants.length)];
}

export default getTopicMatchedImage;
