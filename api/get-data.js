export default async function handler(req, res) {
  // تنظیم CORS برای دسترسی بدون مشکل فرانت‌اند
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const FIREBASE_DB_URL = "https://paradoxshop-202f8-default-rtdb.firebaseio.com/shopInfo.json";

  try {
    const firebaseRes = await fetch(FIREBASE_DB_URL);
    if (!firebaseRes.ok) {
      throw new Error('خطا در برقراری ارتباط با فایربیس');
    }
    const data = await firebaseRes.json();
    return res.status(200).json(data || {});
  } catch (error) {
    return res.status(500).json({ error: "عدم توانایی در دریافت اطلاعات" });
  }
}
