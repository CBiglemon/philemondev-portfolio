// api/check-env.js - Quick environment check
export default async function handler(req, res) {
  return res.status(200).json({
    timestamp: new Date().toISOString(),
    environment: process.env.VERCEL_ENV || "unknown",
    hasServiceId: !!process.env.EMAILJS_SERVICE_ID,
    hasTemplateId: !!process.env.EMAILJS_TEMPLATE_ID,
    hasPublicKey: !!process.env.EMAILJS_PUBLIC_KEY,
    serviceIdPrefix:
      process.env.EMAILJS_SERVICE_ID?.substring(0, 8) || "missing",
    templateIdPrefix:
      process.env.EMAILJS_TEMPLATE_ID?.substring(0, 9) || "missing",
    publicKeyPrefix:
      process.env.EMAILJS_PUBLIC_KEY?.substring(0, 8) || "missing",
    serviceIdLength: process.env.EMAILJS_SERVICE_ID?.length || 0,
    templateIdLength: process.env.EMAILJS_TEMPLATE_ID?.length || 0,
    publicKeyLength: process.env.EMAILJS_PUBLIC_KEY?.length || 0,
  });
}
