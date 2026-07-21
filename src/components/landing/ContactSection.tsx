import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setForm({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="kontak" className="py-20 relative bg-white border-t border-beach-sky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT: MAP & POSKO INFO */}
          <div className="space-y-6">
            <div className="beach-pill-sand inline-flex">
              <MapPin className="w-3.5 h-3.5 text-amber-700" />
              <span>Lokasi Posko KKN RT 35 Manggar 2</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-display font-black text-slate-800 tracking-tight">
              Posko KKN RT 35 & Layanan Warga
            </h2>

            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Posko KKN mahasiswa berlokasi di RT 35 Kelurahan Manggar 2 Balikpapan Timur. Warga, pelaku UMKM, maupun jajaran perangkat desa/RT dapat menghubungi kami kapan pun.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F8FF] border border-beach-sky">
                <MapPin className="w-5 h-5 text-beach-blue-dark shrink-0 mt-1" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Alamat Posko KKN</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">Jl. Mulawarman RT 04, Kelurahan Manggar 2, Kecamatan Balikpapan Timur, Kota Balikpapan, Kalimantan Timur.</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F8FF] border border-beach-sky">
                <Mail className="w-5 h-5 text-beach-blue-dark shrink-0 mt-1" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Email Resmi KKN</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">kkn.manggar2@fasilkom.ac.id</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-[#F0F8FF] border border-beach-sky">
                <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-1" />
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">Kontak Humas KKN</h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">+62 812-3456-7890 (Maya - Humas)</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: FEEDBACK FORM */}
          <div className="beach-card p-8 bg-gradient-to-b from-white to-[#F0F8FF] border-2 border-beach-sky shadow-beach">
            <h3 className="text-xl font-black text-slate-800 mb-1">Kirim Pesan / Masukan Warga</h3>
            <p className="text-xs text-slate-500 font-medium mb-6">Masukan dan saran dari warga Manggar 2 sangat berharga bagi keterberjalanan proker KKN kami.</p>

            {submitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-slate-800 text-base">Pesan Terkirim!</h4>
                <p className="text-xs text-slate-600 mt-1">Terima kasih atas masukan Anda. Tim Humas KKN akan membaca pesan Anda.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Nama Lengkap / Instansi</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda atau Pak RT 04..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-beach-blue font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">No. WhatsApp / Email (Opsional)</label>
                  <input
                    type="text"
                    placeholder="0812xxxx..."
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-beach-blue font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Isi Pesan / Saran Proker</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tuliskan masukan untuk program kerja KKN..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-beach-blue font-medium"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-2xl bg-beach-blue hover:bg-beach-blue-dark text-white font-extrabold text-xs shadow-beach transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Pesan Warga</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
