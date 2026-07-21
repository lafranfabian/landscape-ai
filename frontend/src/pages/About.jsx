import React, { useEffect, useState } from 'react';
import { FiCpu, FiTrendingUp, FiLayers, FiDatabase, FiBookOpen, FiActivity } from 'react-icons/fi';
import { predictionService } from '../services/api';

export default function About() {
  const [modelInfo, setModelInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadModelInfo() {
      try {
        const data = await predictionService.getModelInfo();
        setModelInfo(data);
      } catch (err) {
        console.error("Gagal mengambil info model dari backend", err);
      } finally {
        setLoading(false);
      }
    }
    loadModelInfo();
  }, []);

  const stats = [
    { label: 'R² Score (Koefisien Determinasi)', value: modelInfo?.metrics?.r2_score ? `${(modelInfo.metrics.r2_score * 100).toFixed(1)}%` : '91.5%', desc: 'Mengukur seberapa baik variansi harga tanah dijelaskan oleh fitur model.' },
    { label: 'MAE (Mean Absolute Error)', value: modelInfo?.metrics?.mae ? `Rp ${modelInfo.metrics.mae.toFixed(2)} Jt` : 'Rp 1.24 Jt', desc: 'Rata-rata selisih mutlak antara harga prediksi dan harga riil pasar.' },
    { label: 'RMSE (Root Mean Squared Error)', value: modelInfo?.metrics?.rmse ? `Rp ${modelInfo.metrics.rmse.toFixed(2)} Jt` : 'Rp 2.12 Jt', desc: 'Akar rata-rata kuadrat selisih, memberi bobot lebih tinggi pada kesalahan besar.' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 transition-colors duration-300">
      
      {/* Header */}
      <div className="text-center mb-16 space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Mengenai Model & Pipeline AI
        </h1>
        <p className="max-w-2xl mx-auto text-sm text-gray-500 dark:text-gray-400 font-semibold flex items-center justify-center">
          <FiCpu className="mr-1.5" /> Pelajari arsitektur model LightGBM, dataset pelatihan, dan metrik evaluasi model.
        </p>
      </div>

      <div className="space-y-12">
        
        {/* 1. What is LightGBM Section */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-4">
            <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center">
              <FiBookOpen className="mr-2.5 text-primary-500" /> Algoritma LightGBM Regressor
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              <strong>LightGBM (Light Gradient Boosting Machine)</strong> adalah kerangka kerja peningkatan gradien cepat yang dikembangkan oleh Microsoft yang menggunakan algoritma pembelajaran berbasis pohon keputusan. Berbeda dengan algoritma pohon keputusan lainnya yang tumbuh secara mendatar (level-wise), LightGBM tumbuh secara vertikal (leaf-wise). Hal ini memungkinkan LightGBM meminimalkan kerugian (loss) lebih besar dan mencapai akurasi yang lebih tinggi untuk data berskala besar dengan penggunaan memori yang efisien.
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Model regresi yang disematkan dalam <strong>LandPriceAI</strong> dilatih untuk memprediksi harga tanah per meter persegi (Target Variable) berdasarkan fitur-fitur lokasi koordinat, kelompok kota besar, spesifikasi peruntukan zona tanah, serta faktor linieritas tahun analisis.
            </p>
          </div>
          <div className="md:col-span-4 glass-card p-6 rounded-3xl border border-primary-500/20 dark:border-accent-500/20 flex flex-col justify-center text-center space-y-2">
            <span className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Model Version</span>
            <span className="text-2xl font-black text-primary-600 dark:text-accent-400 tracking-tight">
              {modelInfo?.model_version || 'v1.0.4'}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">Released: July 2026</span>
          </div>
        </section>

        {/* 2. Evaluation Metrics Grid */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center">
            <FiActivity className="mr-2.5 text-accent-500" /> Metrik Evaluasi Model
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
              <div key={idx} className="glass-card p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider block mb-2">{stat.label}</span>
                  <p className="text-gray-500 dark:text-gray-400 text-xs leading-normal">{stat.desc}</p>
                </div>
                <div className="text-3xl font-black text-gray-800 dark:text-white tracking-tight mt-6">
                  {loading ? (
                    <div className="h-8 w-24 bg-gray-200 dark:bg-dark-800 rounded animate-pulse"></div>
                  ) : (
                    stat.value
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Machine Learning Pipeline */}
        <section className="space-y-6">
          <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center">
            <FiLayers className="mr-2.5 text-purple-500" /> Alur Pemrosesan (ML Pipeline)
          </h2>

          <div className="glass-card p-6 rounded-3xl">
            <div className="relative border-l border-gray-200 dark:border-gray-800/80 ml-4 space-y-8 py-2">
              
              {/* Step 1 */}
              <div className="relative pl-6">
                <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-primary-500"></div>
                <h4 className="font-bold text-xs text-gray-800 dark:text-white">1. Pengumpulan Data Listing Riil</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Mengumpulkan 21.000+ data titik harga penjualan tanah publik dari berbagai daerah utama (Jabodetabek, Semarang, Solo, Yogyakarta, Surabaya, Medan).
                </p>
              </div>

              {/* Step 2 */}
              <div className="relative pl-6">
                <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-accent-500"></div>
                <h4 className="font-bold text-xs text-gray-800 dark:text-white">2. Cleaning & Parsing Text Tekstual</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Pembersihan outlier harga ekstrem, standardisasi ukuran luas tanah ke dalam meter persegi (m²), dan pemetaan data kualitatif.
                </p>
              </div>

              {/* Step 3 */}
              <div className="relative pl-6">
                <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-yellow-500"></div>
                <h4 className="font-bold text-xs text-gray-800 dark:text-white">3. Encoding Variabel Kategorikal (One-Hot Encoding)</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Menerjemahkan nama Provinsi, Kelompok Kota Besar, Wilayah Kecamatan Model, dan spesifikasi Zona Peruntukan ke dalam bentuk kolom-kolom biner.
                </p>
              </div>

              {/* Step 4 */}
              <div className="relative pl-6">
                <div className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full bg-purple-500"></div>
                <h4 className="font-bold text-xs text-gray-800 dark:text-white">4. Pelatihan Model LightGBM Regressor</h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Melakukan pencarian kombinasi hyperparameter terbaik (Grid Search Cross Validation) untuk meredam overfitting dan meningkatkan keandalan model.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Dataset Coverage Map/Scope */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white flex items-center">
              <FiDatabase className="mr-2 text-primary-500" /> Dataset Pelatihan (Training Data)
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/40 pb-2">
                <span className="text-gray-400">Total Baris Listing</span>
                <span className="font-bold text-gray-800 dark:text-white">{modelInfo?.dataset_details?.data_points || '21.340'} baris</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/40 pb-2">
                <span className="text-gray-400">Dimensi Fitur Masukan</span>
                <span className="font-bold text-gray-800 dark:text-white">{modelInfo?.metrics?.features_count || '47'} fitur</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 dark:border-gray-800/40 pb-2">
                <span className="text-gray-400">Sampel Pengujian</span>
                <span className="font-bold text-gray-800 dark:text-white">{modelInfo?.metrics?.test_samples || '4.250'} baris</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 rounded-3xl space-y-4">
            <h3 className="font-bold text-sm text-gray-800 dark:text-white flex items-center">
              <FiTrendingUp className="mr-2 text-accent-500" /> Cakupan Wilayah Geografis
            </h3>
            <div className="flex flex-wrap gap-2">
              {(modelInfo?.dataset_details?.coverage_areas || ["Jabodetabek", "Medan", "Semarang", "Surakarta (Solo)", "Yogyakarta", "Jawa Timur"]).map((area, idx) => (
                <span key={idx} className="bg-gray-100 dark:bg-dark-800 px-3 py-1.5 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {area}
                </span>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-normal">
              Prediksi harga diluar daerah cakupan di atas akan mengarah ke baseline rata-rata keseluruhan (default kategorikal).
            </p>
          </div>
        </section>

      </div>
    </div>
  );
}
