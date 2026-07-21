import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiCheckCircle, FiActivity, FiStar, FiAlertTriangle, FiTrendingUp, FiTarget } from 'react-icons/fi';
import { FiSun } from 'react-icons/fi';
import MapPicker from '../components/MapPicker';
import ShapExplanation from '../components/ShapExplanation';
import { predictionService } from '../services/api';
import PredictionForm from '../components/ui/PredictionForm';
import SectionHeading from '../components/ui/SectionHeading';
import Loading from '../components/ui/Loading';
import StatsCard from '../components/ui/StatsCard';

const LOCATION_DATA = {
  'DKI Jakarta': {
    'Jakarta Selatan': ['Kebayoran Senopati'],
    'Jakarta Barat': ['Puri Indah Kebon Jeruk'],
  },
  'Jawa Barat': {
    Bekasi: ['Bekasi Kota Summarecon Harapan Indah'],
    Bogor: ['Bogor Sentul City Bogor Kota'],
    Depok: ['Depok Margonda Cimanggis'],
  },
  Banten: {
    Tangerang: ['Tangerang BSD City Gading Serpong'],
  },
  'Jawa Tengah': {
    Semarang: [
      'Semarang Banyumanik',
      'Semarang Gajahmungkur Elit/Candi',
      'Semarang Ngaliyan',
      'Semarang Pedurungan',
      'Semarang Tembalang Kawasan UNDIP',
      'Semarang Tengah Simpang Lima',
    ],
    Solo: [
      'Solo Banjarsari',
      'Solo Colomadu Penyangga',
      'Solo Grogol Solo Baru',
      'Solo Jebres',
      'Solo Laweyan Slamet Riyadi',
      'Solo Serengan',
    ],
  },
  'DIY (Yogyakarta)': {
    Yogyakarta: [
      'Yogya Depok Sleman/Kawasan UGM',
      'Yogya Gedongtengen Malioboro',
      'Yogya Kasihan Bantul/UMY',
      'Yogya Kotagede',
      'Yogya Ngaglik Sleman',
      'Yogya Umbulharjo',
    ],
  },
  'Jawa Timur': {
    Surabaya: ['Surabaya (Default)'],
  },
  'Sumatera Utara': {
    Medan: ['Medan Amplas', 'Medan Baru', 'Medan Johor', 'Medan Petisah', 'Medan Polonia', 'Medan Selayang'],
  },
};

const ZONING_OPTIONS = ['Zona Perumahan', 'Zona Komersial', 'Zona Industri', 'Zona Pertanian'];
const CERTIFICATE_OPTIONS = ['SHM', 'HGB', 'Girik/Adat', 'Lainnya'];
const ROAD_ACCESS_OPTIONS = ['Mobil', 'Motor', 'Kaki (Gang)'];

export default function PredictionPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isFav, setIsFav] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Kebayoran Senopati',
      land_area: 100,
      zoning: 'Zona Perumahan',
      road_width: 6,
      certificate_type: 'SHM',
      road_access: 'Mobil',
      near_toll: false,
      near_hospital: false,
      near_school: false,
      near_market: false,
      near_public_transportation: false,
      latitude: -6.2297,
      longitude: 106.8006,
      year: 2026,
    },
  });

  const selectedProvince = watch('province');
  const selectedCity = watch('city');
  const selectedDistrict = watch('district');
  const latitude = watch('latitude');
  const longitude = watch('longitude');

  useEffect(() => {
    const cities = Object.keys(LOCATION_DATA[selectedProvince] || {});
    if (cities.length > 0) {
      setValue('city', cities[0]);
    } else {
      setValue('city', '');
    }
  }, [selectedProvince, setValue]);

  useEffect(() => {
    if (selectedProvince && selectedCity) {
      const districts = LOCATION_DATA[selectedProvince][selectedCity] || [];
      if (districts.length > 0) {
        setValue('district', districts[0]);
      } else {
        setValue('district', '');
      }
    } else {
      setValue('district', '');
    }
  }, [selectedProvince, selectedCity, setValue]);

  const handleMapCoordinateChange = (lat, lng) => {
    setValue('latitude', lat);
    setValue('longitude', lng);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    setResult(null);
    setError(null);
    setIsFav(false);
    try {
      const res = await predictionService.predict(data);
      setResult(res);
    } catch (err) {
      setError(err.response?.data?.detail || 'Terjadi kesalahan sistem saat menghubungi server prediksi.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!result?.id) return;
    try {
      const favRes = await predictionService.toggleFavorite(result.id);
      setIsFav(favRes.is_favorite);
    } catch (err) {
      console.error('Gagal mengubah status favorit', err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="AI valuation studio"
          title="Prediksi Harga Tanah AI"
          description="Masukkan spesifikasi properti, pilih lokasi pada peta, dan dapatkan estimasi harga yang terinformasi secara cepat."
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <FiSun className="text-primary-500" />
          Model LightGBM + explainable AI
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <PredictionForm onSubmit={handleSubmit(onSubmit)} title="Spesifikasi Tanah" subtitle="Setiap variabel membantu menilai potensi nilai properti Anda.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Provinsi</label>
              <select
                {...register('province')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              >
                {Object.keys(LOCATION_DATA).map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Kabupaten / Kota</label>
              <select
                {...register('city')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              >
                {Object.keys(LOCATION_DATA[selectedProvince] || {}).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Kecamatan / Wilayah Model</label>
            <select
              {...register('district')}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
            >
              {(LOCATION_DATA[selectedProvince]?.[selectedCity] || []).map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Luas Tanah (m²)</label>
              <input
                type="number"
                {...register('land_area', { required: true, min: 1 })}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              />
              {errors.land_area ? <span className="mt-1 block text-[11px] font-medium text-rose-500">Luas tanah minimal 1 m²</span> : null}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Peruntukan (Zoning)</label>
              <select
                {...register('zoning')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              >
                {ZONING_OPTIONS.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Lebar Jalan (meter)</label>
              <input
                type="number"
                step="0.5"
                {...register('road_width')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Akses Jalan</label>
              <select
                {...register('road_access')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              >
                {ROAD_ACCESS_OPTIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tipe Sertifikat</label>
              <select
                {...register('certificate_type')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              >
                {CERTIFICATE_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tahun Analisis</label>
              <input
                type="number"
                {...register('year')}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-100 dark:focus:border-accent-400 dark:focus:ring-accent-500/20"
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Fasilitas Terdekat</p>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" {...register('near_toll')} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Dekat tol
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" {...register('near_hospital')} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Dekat rumah sakit
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" {...register('near_school')} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Dekat sekolah
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input type="checkbox" {...register('near_market')} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Dekat pasar / mal
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 md:col-span-2">
                <input type="checkbox" {...register('near_public_transportation')} className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                Dekat transportasi publik
              </label>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-950/40">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Peta Lokasi</p>
            <MapPicker
              latitude={latitude}
              longitude={longitude}
              onChange={handleMapCoordinateChange}
              province={selectedProvince}
              city={selectedCity}
              district={selectedDistrict}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-primary-600 to-accent-500 px-4 py-3.5 font-semibold text-white shadow-[0_20px_60px_-20px_rgba(37,99,235,0.55)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? (
              <>
                <svg className="mr-3 h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Memproses Analisis...
              </>
            ) : (
              'Proses Prediksi AI'
            )}
          </button>
        </PredictionForm>

        <div className="space-y-6">
          {loading ? (
            <Loading label="Menganalisis pasar properti ..." />
          ) : null}

          {error ? (
            <div className="rounded-[2rem] border border-rose-200/70 bg-rose-50/70 p-6 shadow-sm dark:border-rose-900/50 dark:bg-rose-950/20">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-rose-100 p-2 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400">
                  <FiAlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Gagal melakukan prediksi</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{error}</p>
                </div>
              </div>
            </div>
          ) : null}

          {!loading && !result && !error ? (
            <div className="flex min-h-[520px] flex-col items-center justify-center rounded-[2rem] border border-dashed border-slate-300/80 bg-white/70 p-8 text-center shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
              <div className="rounded-full bg-slate-100 p-4 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                <FiMapPin className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Menunggu formulir diisi</h3>
              <p className="mt-2 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300">
                Isi detail properti dan klik tombol prediksi untuk melihat estimasi nilai tanah dan penjelasan AI yang dipersonalisasi.
              </p>
            </div>
          ) : null}

          {result ? (
            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${result.status === 'High Growth' ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400' : result.status === 'Premium Access' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400' : 'bg-primary-100 text-primary-700 dark:bg-primary-950/40 dark:text-primary-400'}`}>
                      Status: {result.status}
                    </span>
                    <h3 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">Estimasi Harga Tanah</h3>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Nilai pasar yang diproyeksikan untuk lokasi dan karakteristik yang Anda pilih.</p>
                  </div>
                  <button
                    onClick={handleToggleFavorite}
                    className={`rounded-full border p-2.5 transition ${isFav ? 'border-amber-500 bg-amber-500 text-white' : 'border-slate-200 text-slate-400 hover:border-amber-400 hover:text-amber-500 dark:border-slate-700 dark:text-slate-500'}`}
                    title="Simpan ke favorit"
                  >
                    <FiStar className="h-4 w-4 fill-current" />
                  </button>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <StatsCard label="Harga Total" value={result.predicted_price_total_formatted} hint="Estimasi keseluruhan properti" icon={<FiTrendingUp className="h-5 w-5" />} />
                  <StatsCard label="Harga per m²" value={result.predicted_price_per_m2_formatted} hint="Nilai pasar per meter persegi" icon={<FiTarget className="h-5 w-5" />} accent="from-accent-500 to-primary-500" />
                </div>

                <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-4 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-950/40 dark:text-slate-300 md:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Rentang estimasi total</p>
                    <p className="mt-2 font-semibold text-slate-900 dark:text-white">{result.confidence_range_total_lower_formatted} - {result.confidence_range_total_upper_formatted}</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Skor keyakinan</p>
                    <p className="mt-2 flex items-center gap-2 font-semibold text-emerald-500">
                      <FiCheckCircle /> {result.confidence_score}% confidence
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
                <h4 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                  <FiCheckCircle className="text-emerald-500" /> Rekomendasi Investasi AI
                </h4>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{result.ai_recommendation}</p>
              </div>

              <ShapExplanation
                shapContributions={result.shap_contributions}
                naturalLanguageExplanation={result.natural_language_explanation}
                featureImportance={result.feature_importance}
                predictedPricePerM2Formatted={result.predicted_price_per_m2_formatted}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
