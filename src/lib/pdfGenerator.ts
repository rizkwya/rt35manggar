import { jsPDF } from 'jspdf';
import { RTSuratRequest } from '../types/database';
import { formatIndonesianDate } from './crypto';

/**
 * Builds the official PDF document for Surat Pengantar RT 35
 */
export function buildSuratPDF(surat: RTSuratRequest, qrCodeDataUrl: string): jsPDF {
  // A4 size: 210 x 297 mm
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // 1. KOP SURAT (LETTERHEAD)
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('PEMERINTAH KOTA BALIKPAPAN', pageWidth / 2, 22, { align: 'center' });
  doc.text('KECAMATAN BALIKPAPAN TIMUR', pageWidth / 2, 28, { align: 'center' });
  doc.text('KELURAHAN MANGGAR', pageWidth / 2, 34, { align: 'center' });
  doc.setFontSize(15);
  doc.text('RUKUN TETANGGA (RT) 35', pageWidth / 2, 41, { align: 'center' });

  doc.setFont('times', 'normal');
  doc.setFontSize(9);
  doc.text('Sekretariat: Kawasan Pesisir RT 35 Kelurahan Manggar, Balikpapan Timur - Kode Pos: 76116', pageWidth / 2, 47, { align: 'center' });

  // Double Divider Line
  doc.setLineWidth(0.8);
  doc.line(margin, 51, pageWidth - margin, 51);
  doc.setLineWidth(0.2);
  doc.line(margin, 52.2, pageWidth - margin, 52.2);

  // 2. JUDUL SURAT
  const noSurat = surat.nomor_surat || '045/RT35/MGR/BPT/X/2026';
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  const judulSurat = (surat.jenis_surat || 'SURAT PENGANTAR').toUpperCase();
  doc.text(judulSurat, pageWidth / 2, 63, { align: 'center' });
  
  // Underline Judul
  const textWidth = doc.getTextWidth(judulSurat);
  doc.setLineWidth(0.3);
  doc.line((pageWidth - textWidth) / 2, 64.5, (pageWidth + textWidth) / 2, 64.5);

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Nomor: ${noSurat}`, pageWidth / 2, 70, { align: 'center' });

  // 3. KALIMAT PEMBUKA
  doc.setFontSize(10.5);
  let y = 80;
  const pembuka = 'Yang bertanda tangan di bawah ini Ketua Rukun Tetangga (RT) 35 Kelurahan Manggar, Kecamatan Balikpapan Timur, Kota Balikpapan, menerangkan dengan sebenarnya bahwa:';
  const splitPembuka = doc.splitTextToSize(pembuka, contentWidth);
  doc.text(splitPembuka, margin, y);
  y += splitPembuka.length * 6 + 4;

  // 4. BIODATA PEMOHON (TABLE DATA)
  const fields = [
    { label: 'Nama Lengkap', value: surat.nama_pemohon || '-' },
    { label: 'NIK (No. KTP)', value: surat.nik || '-' },
    { label: 'Tempat / Tgl Lahir', value: `${surat.tempat_lahir || 'Balikpapan'}, ${formatIndonesianDate(surat.tanggal_lahir)}` },
    { label: 'Jenis Kelamin', value: surat.jenis_kelamin || '-' },
    { label: 'Agama', value: surat.agama || 'Islam' },
    { label: 'Pekerjaan', value: surat.pekerjaan || 'Wiraswasta' },
    { label: 'Alamat Domisili', value: surat.alamat || 'RT 35 Kelurahan Manggar' },
    { label: 'Maksud / Keperluan', value: surat.keperluan || 'Pengurusan administrasi kependudukan' },
    { label: 'Keterangan Lain', value: 'Orang tersebut di atas adalah benar-benar warga yang berdomisili di lingkungan RT 35 Kelurahan Manggar dan berkelakuan baik.' }
  ];

  const labelX = margin + 5;
  const colonX = margin + 48;
  const valueX = margin + 52;
  const valueWidth = contentWidth - 52;

  fields.forEach(f => {
    doc.setFont('times', 'normal');
    doc.text(f.label, labelX, y);
    doc.text(':', colonX, y);
    
    // Bold specific key fields
    if (f.label === 'Nama Lengkap' || f.label === 'NIK (No. KTP)') {
      doc.setFont('times', 'bold');
    }
    
    const splitVal = doc.splitTextToSize(f.value, valueWidth);
    doc.text(splitVal, valueX, y);
    y += Math.max(splitVal.length * 5.2, 6.2);
  });

  // 5. KALIMAT PENUTUP
  y += 4;
  const penutup = 'Demikian surat pengantar ini dibuat dengan sebenarnya agar dapat dipergunakan sebagaimana mestinya oleh yang bersangkutan.';
  const splitPenutup = doc.splitTextToSize(penutup, contentWidth);
  doc.text(splitPenutup, margin, y);

  // 6. TANDA TANGAN & QR CODE VERIFIKASI (BAGIAN BAWAH KANAN)
  const ttdY = 195;
  const rightColumnX = 145;

  doc.setFont('times', 'normal');
  doc.setFontSize(10.5);
  doc.text(`Balikpapan, ${formatIndonesianDate(surat.approved_at || surat.created_at || new Date())}`, rightColumnX, ttdY, { align: 'center' });
  doc.text('Ketua RT 35 Kelurahan Manggar,', rightColumnX, ttdY + 6, { align: 'center' });

  // Tanam Gambar QR Code
  if (qrCodeDataUrl) {
    doc.addImage(qrCodeDataUrl, 'PNG', rightColumnX - 16, ttdY + 10, 32, 32);
  }

  // Label Kriptografi di bawah QR Code
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(11, 86, 101);
  doc.text('DOKUMEN RESMI TERVERIFIKASI', rightColumnX, ttdY + 46, { align: 'center' });
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text('Digital Signature: HMAC-SHA256', rightColumnX, ttdY + 49.5, { align: 'center' });

  // Nama Ketua RT
  doc.setFont('times', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text('H. AMIR', rightColumnX, ttdY + 57, { align: 'center' });
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text('Ketua Rukun Tetangga', rightColumnX, ttdY + 61.5, { align: 'center' });

  // FOOTER CATATAN KELURAHAN
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 140);
  doc.text('* Dokumen ini diterbitkan secara sah dan terlacak digital melalui Portal RT 35 Manggar (www.rt35manggar.my.id)', margin, 282);
  doc.text('Scan QR Code untuk verifikasi integritas berkas di tingkat Kelurahan Manggar.', margin, 286);

  return doc;
}

/**
 * Trigger immediate browser download of the PDF file
 */
export function downloadSuratPDF(surat: RTSuratRequest, qrCodeDataUrl: string): void {
  const doc = buildSuratPDF(surat, qrCodeDataUrl);
  const cleanName = (surat.nama_pemohon || 'Warga').replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Surat_Pengantar_RT35_${cleanName}_${surat.nik || 'document'}.pdf`;
  doc.save(filename);
}
