import React, { useState } from 'react';
import { Camera, X } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'semua' | 'kegiatan' | 'pesisir' | 'umkm'>('semua');
  const [lightboxImg, setLightboxImg] = useState<{ url: string; title: string } | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Penyambutan KKN di Kantor Kelurahan Manggar 2',
      category: 'kegiatan',
      url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 2,
      title: 'Pemetaan UMKM Olahan Laut di Pesisir RT 35',
      category: 'umkm',
      url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 3,
      title: 'Keindahan Pantai Manggar & Pesisir Balikpapan Timur',
      category: 'pesisir',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 4,
      title: 'Diskusi Bersama Tokoh Pemuda & Karang Taruna RT 35',
      category: 'kegiatan',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 5,
      title: 'Kunjungan Produk Kerajinan Warga RT 35',
      category: 'umkm',
      url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    },
    {
      id: 6,
      title: 'Sosialisasi Literasi Digital Bagi Anak-Anak RT 35',
      category: 'kegiatan',
      url: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
    },
  ];

  const filteredItems = galleryItems.filter(
    (item) => activeTab === 'semua' || item.category === activeTab
  );

  return (
    <section id="galeri" className="py-20 relative bg-[#EBF5FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#236F9E] text-white font-extrabold text-xs shadow-sm mb-3">
            <Camera className="w-3.5 h-3.5" />
            <span>Dokumentasi Lapangan & Pantai RT 35</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-900 tracking-tight">
            Galeri Kegiatan & Pesisir Manggar 2
          </h2>
          <p className="text-slate-700 text-sm font-semibold mt-2">
            Merekam jejak pengabdian mahasiswa dan keindahan alam Pantai Manggar 2.
          </p>
        </div>

        {/* TAB BUTTONS WITH SOLID CRISP HIGH CONTRAST */}
        <div className="flex justify-center gap-2.5 mb-10 flex-wrap">
          {[
            { id: 'semua', label: 'Semua Foto' },
            { id: 'kegiatan', label: 'Kegiatan KKN' },
            { id: 'umkm', label: 'UMKM Warga' },
            { id: 'pesisir', label: 'Pesisir Manggar 2' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all ${
                activeTab === tab.id
                  ? 'bg-[#236F9E] text-white shadow-md border-2 border-[#1C597E]'
                  : 'bg-white text-slate-800 border-2 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => setLightboxImg({ url: item.url, title: item.title })}
              className="bg-white rounded-2xl overflow-hidden border-2 border-slate-200 shadow-sm hover:shadow-md hover:border-[#236F9E] group cursor-pointer relative h-64 transition-all"
            >
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-85 group-hover:opacity-95 transition-opacity flex items-end p-5">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FBEED2] border border-amber-300 text-amber-950 text-[10px] font-black mb-1.5 shadow-sm">
                    {item.category}
                  </span>
                  <h4 className="font-black text-white text-sm line-clamp-2 leading-snug">{item.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* LIGHTBOX */}
      {lightboxImg && (
        <div
          onClick={() => setLightboxImg(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn"
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setLightboxImg(null)}
              className="absolute -top-12 right-0 text-white hover:text-amber-300 p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={lightboxImg.url}
              alt={lightboxImg.title}
              className="w-full max-h-[80vh] object-contain rounded-3xl border-2 border-white shadow-2xl"
            />
            <p className="text-center text-white text-base font-black mt-4">{lightboxImg.title}</p>
          </div>
        </div>
      )}
    </section>
  );
};
