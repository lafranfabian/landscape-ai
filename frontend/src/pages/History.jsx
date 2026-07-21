import React, { useEffect, useState } from 'react';
import { FiSearch, FiTrash2, FiStar, FiDownload, FiMapPin, FiPrinter, FiEye } from 'react-icons/fi';
import { predictionService } from '../services/api';

const PROVINCES = ["Banten", "DIY", "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatera Utara"];

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null); // for detail overlay modal

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await predictionService.getHistory(search, selectedProvince, favoritesOnly);
      setHistory(data);
    } catch (err) {
      console.error("Gagal memuat riwayat prediksi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search slightly or just trigger on dependencies
    const delayDebounce = setTimeout(() => {
      loadHistory();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, selectedProvince, favoritesOnly]);

  const handleToggleFavorite = async (id, e) => {
    e.stopPropagation();
    try {
      const res = await predictionService.toggleFavorite(id);
      setHistory(prev => prev.map(item => 
        item.id === id ? { ...item, is_favorite: res.is_favorite } : item
      ));
      if (favoritesOnly && !res.is_favorite) {
        // Remove from list if in favorites-only view
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Gagal mengubah status favorit", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Apakah Anda yakin ingin menghapus data prediksi ini dari riwayat?")) return;
    try {
      await predictionService.deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    } catch (err) {
      console.error("Gagal menghapus prediksi", err);
    }
  };

  const handleExportCSV = () => {
    if (history.length === 0) return;
    const headers = ["Tanggal", "Provinsi", "Kota", "Kecamatan", "Luas (m2)", "Lebar Jalan (m)", "Sertifikat", "Akses Jalan", "Harga per m2 (jt IDR)", "Harga Total (jt IDR)", "Favorit"];
    const rows = history.map(item => [
      item.created_at.substring(0, 10),
      `"${item.province}"`,
      `"${item.city}"`,
      `"${item.district}"`,
      item.land_area,
      item.road_width || 'N/A',
      item.certificate_type || 'N/A',
      item.road_access || 'N/A',
      item.predicted_price_per_m2.toFixed(2),
      item.predicted_price_total.toFixed(2),
      item.is_favorite ? "Ya" : "Tidak"
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `riwayat_harga_tanah_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPDF = (item) => {
    const formattedDate = new Date(item.created_at).toLocaleDateString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    const priceM2 = (item.predicted_price_per_m2 * 1_000_000).toLocaleString('id-ID');
    const priceTotal = (item.predicted_price_total * 1_000_000).toLocaleString('id-ID');

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Prediksi Harga Tanah - LandPriceAI</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
            .title { font-size: 26px; font-weight: bold; color: #1e3a8a; margin: 0; }
            .subtitle { font-size: 14px; color: #666; margin-top: 5px; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 16px; font-weight: bold; border-left: 4px solid #3b82f6; padding-left: 10px; margin-bottom: 15px; color: #1e3a8a; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 8px; }
            .card-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; }
            .card-value { font-size: 18px; font-weight: bold; color: #0f172a; margin-top: 5px; }
            .card-accent { color: #2563eb; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e2e8f0; padding: 12px; text-align: left; font-size: 13px; }
            th { background-color: #f1f5f9; font-weight: bold; }
            .footer { text-align: center; margin-top: 50px; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">LAPORAN PENAKSIRAN AI HARGA TANAH</div>
            <div class="subtitle">Dihasilkan secara otomatis oleh LandPriceAI pada ${formattedDate}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Hasil Prediksi Nilai Tanah</div>
            <div class="grid">
              <div class="card">
                <div class="card-label">Estimasi Harga Per Meter Persegi</div>
                <div class="card-value card-accent">Rp ${priceM2}/m²</div>
              </div>
              <div class="card">
                <div class="card-label">Estimasi Harga Total Properti</div>
                <div class="card-value">Rp ${priceTotal}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <div class="section-title">Spesifikasi Detail Properti</div>
            <table>
              <tr>
                <th>Parameter</th>
                <th>Detail Properti</th>
              </tr>
              <tr>
                <td>Provinsi</td>
                <td>${item.province}</td>
              </tr>
              <tr>
                <td>Kabupaten/Kota</td>
                <td>${item.city}</td>
              </tr>
              <tr>
                <td>Kecamatan / Wilayah Model</td>
                <td>${item.district}</td>
              </tr>
              <tr>
                <td>Luas Tanah</td>
                <td>${item.land_area} m²</td>
              </tr>
              <tr>
                <td>Lebar Jalan Depan</td>
                <td>${item.road_width ? item.road_width + ' meter' : 'N/A'}</td>
              </tr>
              <tr>
                <td>Tipe Sertifikat</td>
                <td>${item.certificate_type || 'N/A'}</td>
              </tr>
              <tr>
                <td>Akses Jalan</td>
                <td>${item.road_access || 'N/A'}</td>
              </tr>
              <tr>
                <td>Koordinat GPS</td>
                <td>${item.latitude && item.longitude ? `${item.latitude}, ${item.longitude}` : 'N/A'}</td>
              </tr>
              <tr>
                <td>Fasilitas Sekitar</td>
                <td>
                  ${[
                    item.near_toll ? 'Dekat Tol' : '',
                    item.near_hospital ? 'Dekat RS' : '',
                    item.near_school ? 'Dekat Sekolah' : '',
                    item.near_market ? 'Dekat Pasar' : '',
                    item.near_public_transportation ? 'Dekat Transportasi' : ''
                  ].filter(Boolean).join(', ') || 'Tidak ada fasilitas terdekat yang dicatat'}
                </td>
              </tr>
            </table>
          </div>

          <div class="footer">
            LandPriceAI - Laporan Prediksi Harga Tanah Indonesia menggunakan algoritma LightGBM.
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); }
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 space-y-4 md:space-y-0">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Riwayat Prediksi
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-semibold">
            Kelola, filter, dan unduh laporan prediksi harga tanah yang telah Anda lakukan.
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={handleExportCSV}
            className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all"
          >
            <FiDownload className="mr-2" /> Ekspor ke CSV
          </button>
        )}
      </div>

      {/* Filters Area */}
      <div className="glass-card p-5 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        
        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kota atau kecamatan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-800/80 rounded-xl text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Province Filter */}
        <div>
          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            className="w-full bg-gray-50 dark:bg-dark-950 border border-gray-200 dark:border-gray-800/80 rounded-xl px-3 py-2 text-xs text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="">Semua Provinsi</option>
            {PROVINCES.map(prov => (
              <option key={prov} value={prov}>{prov}</option>
            ))}
          </select>
        </div>

        {/* Favorite Switch */}
        <div className="flex items-center justify-start md:justify-center">
          <label className="flex items-center text-xs font-bold text-gray-500 dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              className="rounded border-gray-300 dark:border-gray-800 text-primary-600 focus:ring-primary-500 mr-2 h-4 w-4"
            />
            Hanya Tampilkan Favorit
          </label>
        </div>

        {/* Total stats */}
        <div className="text-right text-xs font-bold text-gray-400 dark:text-gray-500">
          Ditemukan: <span className="text-primary-600 dark:text-accent-400">{history.length} data</span>
        </div>
      </div>

      {/* Loading & Empty State */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 dark:bg-dark-900 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center flex flex-col justify-center items-center border-dashed border-2 border-gray-200 dark:border-gray-800/80">
          <FiSearch className="w-8 h-8 text-gray-300 mb-4 animate-pulse" />
          <h3 className="text-md font-bold text-gray-800 dark:text-white">Tidak Ada Riwayat Prediksi</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mt-2">
            Belum ada data prediksi yang cocok dengan kriteria filter Anda. Silakan buat prediksi baru di menu prediksi.
          </p>
        </div>
      ) : (
        /* History Table */
        <div className="glass-card rounded-3xl overflow-hidden shadow-sm border border-gray-200/50 dark:border-gray-800/40">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100 dark:divide-gray-800/40 text-xs">
              <thead className="bg-gray-50 dark:bg-dark-900 font-extrabold uppercase text-gray-400 dark:text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Tanggal</th>
                  <th className="px-6 py-4 text-left">Wilayah</th>
                  <th className="px-6 py-4 text-left">Luas</th>
                  <th className="px-6 py-4 text-left">Harga/m²</th>
                  <th className="px-6 py-4 text-left">Harga Total</th>
                  <th className="px-6 py-4 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800/20 text-gray-700 dark:text-gray-300">
                {history.map((item) => (
                  <tr 
                    key={item.id}
                    className="hover:bg-gray-100/30 dark:hover:bg-gray-800/10 transition-colors cursor-pointer"
                    onClick={() => setSelectedItem(item)}
                  >
                    <td className="px-6 py-4 font-semibold text-gray-500">
                      {item.created_at.substring(0, 10)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800 dark:text-white">{item.district}</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">{item.city}, {item.province}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      {item.land_area} m²
                    </td>
                    <td className="px-6 py-4 font-bold text-primary-600 dark:text-accent-400">
                      Rp {(item.predicted_price_per_m2 * 1_000_000).toLocaleString('id-ID')}/m²
                    </td>
                    <td className="px-6 py-4 font-black text-gray-800 dark:text-white">
                      Rp {(item.predicted_price_total * 1_000_000).toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 flex items-center justify-center space-x-2 h-full" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleToggleFavorite(item.id, e)}
                        className={`p-2 rounded-lg border transition-all ${
                          item.is_favorite 
                            ? 'bg-amber-500 border-amber-500 text-white' 
                            : 'border-gray-200 dark:border-gray-800 text-gray-400 hover:text-amber-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        title="Favorit"
                      >
                        <FiStar className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        onClick={() => handlePrintPDF(item)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-primary-600 dark:hover:text-accent-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        title="Cetak PDF"
                      >
                        <FiPrinter className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDelete(item.id, e)}
                        className="p-2 rounded-lg border border-gray-200 dark:border-gray-800 text-gray-400 hover:text-rose-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                        title="Hapus"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal Overlay */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-center items-center p-4">
          <div className="bg-white dark:bg-dark-900 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-900 border-b border-gray-100 dark:border-gray-800/40 flex justify-between items-center">
              <div>
                <h3 className="font-black text-gray-800 dark:text-white">Detail Rekam Prediksi</h3>
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider block">ID: #{selectedItem.id} | Dibuat: {selectedItem.created_at.substring(0, 10)}</span>
              </div>
              <button 
                onClick={() => setSelectedItem(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold p-2 text-lg focus:outline-none"
              >
                &times;
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-grow text-xs leading-relaxed">
              
              {/* Price Banner */}
              <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-100 dark:border-primary-900/30 p-5 rounded-2xl grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Harga Total</span>
                  <span className="text-xl font-black text-gray-800 dark:text-white">Rp {(selectedItem.predicted_price_total * 1_000_000).toLocaleString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider block">Harga Per Meter</span>
                  <span className="text-lg font-black text-primary-600 dark:text-accent-400">Rp {(selectedItem.predicted_price_per_m2 * 1_000_000).toLocaleString('id-ID')}/m²</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-1">Wilayah / Lokasi</h4>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{selectedItem.district}, {selectedItem.city}</p>
                  <p className="text-gray-400 text-[10px]">{selectedItem.province}</p>
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-1">Luas Tanah</h4>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{selectedItem.land_area} m²</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-1">Lebar Jalan & Akses</h4>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">
                    {selectedItem.road_width ? `${selectedItem.road_width}m` : 'N/A'} ({selectedItem.road_access || 'N/A'})
                  </p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-1">Tipe Sertifikat</h4>
                  <p className="text-gray-800 dark:text-gray-200 font-semibold">{selectedItem.certificate_type || 'SHM'}</p>
                </div>

                {selectedItem.latitude && selectedItem.longitude && (
                  <div className="col-span-2">
                    <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-1">Koordinat GPS</h4>
                    <p className="text-gray-700 dark:text-gray-300 font-mono font-semibold">{selectedItem.latitude}, {selectedItem.longitude}</p>
                  </div>
                )}
              </div>

              {/* Amenities checklist */}
              <div className="border-t border-gray-100 dark:border-gray-800/40 pt-4">
                <h4 className="font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-[9px] mb-2">Fasilitas Terdekat</h4>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  {selectedItem.near_toll && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold">Dekat Tol</span>}
                  {selectedItem.near_hospital && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold">Dekat Rumah Sakit</span>}
                  {selectedItem.near_school && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold">Dekat Sekolah</span>}
                  {selectedItem.near_market && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold">Dekat Pasar / Mal</span>}
                  {selectedItem.near_public_transportation && <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded font-bold">Dekat Transportasi</span>}
                  {!selectedItem.near_toll && !selectedItem.near_hospital && !selectedItem.near_school && !selectedItem.near_market && !selectedItem.near_public_transportation && (
                    <span className="text-gray-400 italic">Tidak ada fasilitas terdekat yang dicatat</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-dark-900 border-t border-gray-100 dark:border-gray-800/40 flex justify-end space-x-2">
              <button
                onClick={() => handlePrintPDF(selectedItem)}
                className="flex items-center px-4 py-2 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-950 border border-gray-200 dark:border-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <FiPrinter className="mr-1.5" /> Cetak Laporan PDF
              </button>
              <button
                onClick={() => setSelectedItem(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
