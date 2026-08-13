// api/visit.js

export default async function handler(req, res) {
  // تنظیم CORS برای دسترسی فرانت‌اند
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const DB_URL = "https://paradoxshop-202f8-default-rtdb.firebaseio.com";

  // محاسبه تاریخ امروز بر اساس منطقه زمانی پاکستان (Asia/Karachi - UTC+5)
  const now = new Date();
  const pktDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Karachi' }); // فرمت: YYYY-MM-DD

  try {
    if (req.method === 'POST') {
      // 1. افزایش بازدید کل
      const totalRes = await fetch(`${DB_URL}/stats/total.json`);
      const currentTotal = (await totalRes.json()) || 0;
      const newTotal = currentTotal + 1;
      await fetch(`${DB_URL}/stats/total.json`, {
        method: 'PUT',
        body: JSON.stringify(newTotal),
      });

      // 2. افزایش بازدید روزانه مربوط به تاریخ امروز پاکستان
      const dailyRes = await fetch(`${DB_URL}/stats/daily/${pktDateStr}.json`);
      const currentDaily = (await dailyRes.json()) || 0;
      const newDaily = currentDaily + 1;
      await fetch(`${DB_URL}/stats/daily/${pktDateStr}.json`, {
        method: 'PUT',
        body: JSON.stringify(newDaily),
      });

      return res.status(200).json({
        total: newTotal,
        daily: newDaily
      });
    } else {
      // دریافت آمار بدون افزایش (در صورت نیاز)
      const totalRes = await fetch(`${DB_URL}/stats/total.json`);
      const total = (await totalRes.json()) || 0;

      const dailyRes = await fetch(`${DB_URL}/stats/daily/${pktDateStr}.json`);
      const daily = (await dailyRes.json()) || 0;

      return res.status(200).json({
        total,
        daily
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
