import React, { useEffect, useState } from 'react';
import { Line, Bar, Doughnut, Pie } from 'react-chartjs-2';
import { FiTrendingUp, FiActivity, FiMap, FiAward, FiColumns } from 'react-icons/fi';
import { FiSun } from 'react-icons/fi';
import { predictionService } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SectionHeading from '../components/ui/SectionHeading';
import StatsCard from '../components/ui/StatsCard';
import ChartCard from '../components/ui/ChartCard';
import Loading from '../components/ui/Loading';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend);

const MOCK_STATS = {
  total_predictions: 186,
  avg_price: 3650.0,
  highest_price: 24500.0,
  lowest_price: 180.0,
  avg_price_per_m2: 24.2,
  province_stats: [
    { province: 'DKI Jakarta', count: 52, avg_total_price: 8400.0, avg_price_per_m2: 56.0 },
    { province: 'DI Yogyakarta', count: 38, avg_total_price: 2200.0, avg_price_per_m2: 14.6 },
    { province: 'Banten', count: 28, avg_total_price: 3400.0, avg_price_per_m2: 22.5 },
    { province: 'Jawa Barat', count: 32, avg_total_price: 2900.0, avg_price_per_m2: 19.3 },
    { province: 'Jawa Tengah', count: 24, avg_total_price: 1100.0, avg_price_per_m2: 7.4 },
    { province: 'Jawa Timur', count: 12, avg_total_price: 1800.0, avg_price_per_m2: 12.0 },
  ],
  certificate_stats: [
    { certificate_type: 'SHM', count: 124 },
    { certificate_type: 'HGB', count: 42 },
    { certificate_type: 'Girik/Adat', count: 15 },
    { certificate_type: 'Lainnya', count: 5 },
  ],
  trend_stats: [
    { date: '2026-07-10', avg_price: 2800.0, count: 5 },
    { date: '2026-07-11', avg_price: 3200.0, count: 8 },
    { date: '2026-07-12', avg_price: 3100.0, count: 6 },
    { date: '2026-07-13', avg_price: 3900.0, count: 12 },
    { date: '2026-07-14', avg_price: 3600.0, count: 10 },
    { date: '2026-07-15', avg_price: 3800.0, count: 15 },
    { date: '2026-07-16', avg_price: 3500.0, count: 9 },
    { date: '2026-07-17', avg_price: 4100.0, count: 14 },
    { date: '2026-07-18', avg_price: 4300.0, count: 18 },
  ],
  road_width_stats: [
    { width_group: '< 4m', count: 32 },
    { width_group: '4m - 8m', count: 114 },
    { width_group: '> 8m', count: 40 },
  ],
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoData, setIsDemoData] = useState(false);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await predictionService.getDashboardStats();
        if (data.total_predictions === 0) {
          setStats(MOCK_STATS);
          setIsDemoData(true);
        } else {
          setStats(data);
          setIsDemoData(false);
        }
      } catch (err) {
        console.error('Gagal memuat statistik dashboard, memuat mock stats', err);
        setStats(MOCK_STATS);
        setIsDemoData(true);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const formatCurrencyIDR = (millions) => {
    const value = millions * 1_000_000;
    if (value >= 1_000_000_000) return `Rp ${(value / 1_000_000_000).toFixed(2)} Miliar`;
    return `Rp ${(value / 1_000_000).toFixed(1)} Juta`;
  };

  const formatPerM2 = (millions) => `Rp ${(millions * 1_000_000).toLocaleString('id-ID')}/m²`;

  const trendData = {
    labels: stats?.trend_stats ? stats.trend_stats.map((t) => t.date) : [],
    datasets: [
      {
        label: 'Rata-rata harga tanah (Miliar Rp)',
        data: stats?.trend_stats ? stats.trend_stats.map((t) => (t.avg_price * 1_000_000) / 1_000_000_000) : [],
        fill: true,
        borderColor: 'rgba(72, 125, 151, 1)',
        backgroundColor: 'rgba(72, 125, 151, 0.1)',
        tension: 0.3,
        pointBackgroundColor: 'rgba(46, 163, 153, 1)',
        borderWidth: 2,
      },
    ],
  };

  const provData = {
    labels: stats?.province_stats ? stats.province_stats.map((p) => p.province) : [],
    datasets: [
      {
        label: 'Harga rata-rata per m² (Juta Rp)',
        data: stats?.province_stats ? stats.province_stats.map((p) => p.avg_price_per_m2) : [],
        backgroundColor: ['rgba(72, 125, 151, 0.75)', 'rgba(46, 163, 153, 0.75)', 'rgba(143, 155, 176, 0.75)', 'rgba(114, 218, 206, 0.75)', 'rgba(55, 100, 125, 0.75)', 'rgba(34, 131, 123, 0.75)'],
        borderWidth: 0,
        borderRadius: 8,
      },
    ],
  };

  const certData = {
    labels: stats?.certificate_stats ? stats.certificate_stats.map((c) => c.certificate_type) : [],
    datasets: [
      {
        data: stats?.certificate_stats ? stats.certificate_stats.map((c) => c.count) : [],
        backgroundColor: ['rgba(46, 163, 153, 0.8)', 'rgba(72, 125, 151, 0.8)', 'rgba(234, 179, 8, 0.8)', 'rgba(244, 63, 94, 0.8)'],
        borderWidth: 1,
        borderColor: 'transparent',
      },
    ],
  };

  const roadData = {
    labels: stats?.road_width_stats ? stats.road_width_stats.map((r) => r.width_group) : [],
    datasets: [
      {
        data: stats?.road_width_stats ? stats.road_width_stats.map((r) => r.count) : [],
        backgroundColor: ['rgba(244, 63, 94, 0.8)', 'rgba(46, 163, 153, 0.8)', 'rgba(72, 125, 151, 0.8)'],
        borderWidth: 1,
        borderColor: 'transparent',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#8f9bb0',
          font: { family: 'Outfit, sans-serif', size: 10 },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#8f9bb0', font: { family: 'Outfit, sans-serif', size: 10 } },
      },
      y: {
        grid: { color: 'rgba(156, 163, 175, 0.08)' },
        ticks: { color: '#8f9bb0', font: { family: 'Outfit, sans-serif', size: 10 } },
      },
    },
  };

  if (loading || !stats) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="market intelligence" title="Analisis Real Estate" description="Mengumpulkan data pasar terkini dan mempersiapkan visualisasi performa prediksi." />
        <div className="mt-8">
          <Loading label="Menyiapkan dashboard ..." />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          eyebrow="market intelligence"
          title="Analisis Real Estate"
          description="Ringkasan performa model, tren harga, dan distribusi pasar dalam satu tampilan yang lebih premium."
        />
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/70 px-4 py-2 text-sm font-medium text-slate-600 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300">
          <FiSun className="text-primary-500" />
          Dashboard AI real estate
        </div>
      </div>

      {isDemoData ? (
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-400">
          <FiActivity className="animate-pulse" />
          Mode demo: menggunakan data simulasi pasar
        </div>
      ) : null}

      <div className="mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <StatsCard label="Total prediksi" value={stats.total_predictions.toLocaleString('id-ID')} hint="Data terkini" icon={<FiActivity className="h-5 w-5" />} />
        <StatsCard label="Rata-rata harga" value={formatCurrencyIDR(stats.avg_price)} hint="Perkiraan pasar" icon={<FiTrendingUp className="h-5 w-5" />} accent="from-accent-500 to-primary-500" />
        <StatsCard label="Harga tertinggi" value={formatCurrencyIDR(stats.highest_price)} hint="Nilai puncak" icon={<FiAward className="h-5 w-5" />} accent="from-primary-500 to-accent-500" />
        <StatsCard label="Harga terendah" value={formatCurrencyIDR(stats.lowest_price)} hint="Lintasan bawah" icon={<FiMap className="h-5 w-5" />} accent="from-emerald-500 to-teal-500" />
        <StatsCard label="Rata-rata per m²" value={formatPerM2(stats.avg_price_per_m2)} hint="Nilai per area" icon={<FiColumns className="h-5 w-5" />} accent="from-violet-500 to-indigo-500" />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="Tren nilai penaksiran harga tanah" description="Perkembangan rata-rata nilai properti dari waktu ke waktu.">
          <div className="h-[320px]">
            <Line data={trendData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard title="Perbandingan harga per m² per provinsi" description="Pemetaan daya saing pasar di berbagai wilayah Indonesia.">
          <div className="h-[320px]">
            <Bar data={provData} options={chartOptions} />
          </div>
        </ChartCard>

        <ChartCard title="Distribusi tipe sertifikat" description="Komposisi legalitas kepemilikan yang sering muncul pada data prediksi.">
          <div className="h-[300px]">
            <Doughnut data={certData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }} />
          </div>
        </ChartCard>

        <ChartCard title="Distribusi lebar jalan" description="Kondisi aksesibilitas yang memengaruhi valuasi properti.">
          <div className="h-[300px]">
            <Pie data={roadData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, legend: { ...chartOptions.plugins.legend, position: 'bottom' } } }} />
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
