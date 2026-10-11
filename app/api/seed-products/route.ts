export const products = [
  { id: "1", name: "مركز أطفال التوحد - TSA & ABA", category: "التوحد", image: "/products/01_TSA_ABA.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "تشخيص وتأهيل أطفال التوحد ببرامج ABA المعتمدة" },
  { id: "2", name: "مركز التخاطب - Orthophonie", category: "التخاطب", image: "/products/02_Orthophonie.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "علاج تأخر النطق واضطرابات اللغة" },
  { id: "3", name: "المهارات الحركية - Psychomotricité", category: "حركية", image: "/products/03_Psychomotricite.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "تنمية المهارات الحركية الدقيقة والكبرى" },
  { id: "4", name: "الإرشاد النفسي - Soutien", category: "نفسي", image: "/products/04_Soutien.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "دعم نفسي للطفل والأسرة" },
  { id: "5", name: "المهارات الاجتماعية - Habiletés Sociales", category: "اجتماعية", image: "/products/05_Habiletes.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "تنمية التواصل والذكاء العاطفي" },
  { id: "6", name: "التأهيل للدمج - Intégration Scolaire", category: "الدمج", image: "/products/06_Integration.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "تأهيل الطفل للاندماج المدرسي" },
  { id: "7", name: "روض الأطفال - Crèche", category: "روض", image: "/products/07_Creche.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "روض متخصص مع عناية خاصة" },
  { id: "8", name: "دروس الدعم - Soutien Scolaire", category: "دعم", image: "/products/08_Soutien_Scolaire.jpg", price: "تواصل معنا", status: "published", isApproved: true, description: "دعم دراسي فردي وجماعي" }
];

export async function GET() {
  return new Response(JSON.stringify({ 
    success: true, 
    count: products.length, 
    message: "تم رفع وتفعيل الـ 8 خدمات بنجاح بدون الحاجة للموافقة",
    products 
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
