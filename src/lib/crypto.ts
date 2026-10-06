import CryptoJS from 'crypto-js';
import QRCode from 'qrcode';

// Secret salt key for HMAC-SHA256 digital signature
export const HMAC_SECRET_KEY = 
  (typeof import.meta !== 'undefined' && (import.meta as any).env && (
    (import.meta as any).env.PUBLIC_HMAC_SECRET || 
    (import.meta as any).env.VITE_HMAC_SECRET
  )) || 
  (typeof process !== 'undefined' && process.env && (
    process.env.PUBLIC_HMAC_SECRET || 
    process.env.VITE_HMAC_SECRET
  )) ||
  '';

/**
 * Generate cryptographic HMAC-SHA256 token (64-character hex string)
 * Combines letter metadata with secret key to guarantee authenticity.
 */
export function generateHMACSHA256(data: string, secretKey: string = HMAC_SECRET_KEY): string {
  const activeKey = secretKey || 'RT35_DEV_DEFAULT_HMAC_KEY';
  return CryptoJS.HmacSHA256(data, activeKey).toString(CryptoJS.enc.Hex);
}

/**
 * Generate high-resolution QR Code Data URL from verification URL/string
 */
export async function generateQRCodeDataURL(text: string): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: 320,
      margin: 1,
      color: {
        dark: '#063039',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    });
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    throw err;
  }
}

/**
 * Helper to format date into formal Indonesian string (e.g., "06 Oktober 2026")
 */
export function formatIndonesianDate(dateStr?: string | Date): string {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '-';
  
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}
