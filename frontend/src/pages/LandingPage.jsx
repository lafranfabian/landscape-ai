import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiArrowRight, FiBarChart2, FiCpu, FiDatabase, FiLayers, FiMapPin, FiShield, FiZap } from 'react-icons/fi';
import { FiStar } from 'react-icons/fi';
import Hero from '../components/ui/Hero';
import SectionHeading from '../components/ui/SectionHeading';
import StatsCard from '../components/ui/StatsCard';

export default function LandingPage() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Prediksi terkirim', value: '14.8K+', icon: <FiDatabase className="h-5 w-5" />, hint: '+18% bulan ini' },
    { label: 'Akurasi model', value: '92.5%', icon: <FiShield className="h-5 w-5" />, hint: 'LightGBM terverifikasi' },
    { label: 'Provinsi tercover', value: '6+', icon: <FiMapPin className="h-5 w-5" />, hint: 'Indonesia modern' },
    { label: 'Kecepatan inferensi', value: '< 1s', icon: <FiZap className="h-5 w-5" />, hint: 'Real-time scoring' },
  ];

  const features = [
    { title: 'Prediksi AI presisi', description: 'Model LightGBM dilatih pada data real estate terstruktur untuk estimasi yang konsisten.', icon: <FiCpu className="h-6 w-6" /> },
    { title: 'Explainable insights', description: 'Lihat faktor yang mendorong harga, mulai dari lokasi hingga sertifikat.', icon: <FiLayers className="h-6 w-6" /> },
    { title: 'Dashboard premium', description: 'Pantau tren pasar, distribusi harga, dan performa model dalam satu layar.', icon: <FiBarChart2 className="h-6 w-6" /> },
    { title: 'Workflow cepat', description: 'Masukkan input, dapatkan hasil, dan simpan riwayat analisis dalam hitungan detik.', icon: <FiStar className="h-6 w-6" /> },
  ];

  const workflow = [
    'Kumpulkan preferensi lokasi dan properti.',
    'Jalankan model penilaian harga berbasis AI.',
    'Dapatkan rekomendasi, rentang harga, dan insight yang dapat ditindaklanjuti.',
  ];

  const faq = [
    { question: 'Apakah hasil ini bisa dipakai untuk keputusan investasi?', answer: 'Ya. Platform ini menyajikan estimasi berbasis model yang membantu mempercepat pemahaman pasar, meski tetap perlu validasi bisnis tambahan.' },
    { question: 'Model ini mencakup wilayah mana saja?', answer: 'Saat ini fokus pada wilayah Indonesia yang paling banyak ditangani pada dataset, termasuk Jabodetabek, Semarang, Solo, Yogyakarta, Surabaya, dan Medan.' },
    { question: 'Apa yang membedakan LandPriceAI?', answer: 'Kami menggabungkan prediksi AI, dashboard analitik, dan explainability untuk membuat penilaian harga lebih transparan dan dapat dipercaya.' },
  ];

  return (
    <div className="space-y-8 pb-8">
      <Hero
        badge="Next-gen valuation intelligence"
        title="Prediksi harga tanah Indonesia dengan kecerdasan buatan modern"
        subtitle="LandPriceAI menyatukan machine learning, penjelasan fitur, dan dashboard premium untuk membantu Anda menilai nilai tanah secara cepat, transparan, dan terukur."
        primaryAction={<button onClick={() => navigate('/predict')} className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900">Prediksi Sekarang <FiArrowRight className="h-4 w-4" /></button>}
        secondaryAction={<button onClick={() => navigate('/about')} className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary-300 hover:text-primary-600 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200">Pelajari Model</button>}
      >
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/80 p-5 shadow-[0_30px_90px_-35px_rgba(37,99,235,0.4)] backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-primary-600 via-blue-500 to-accent-500 p-6 text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-100">Real-time estimate</p>
            <p className="mt-3 text-3xl font-semibold">Rp 4,8 Miliar</p>
            <p className="mt-2 text-sm text-blue-100">Estimasi harga total untuk kawasan premium dengan confidence tinggi.</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100">Harga per m²</p>
                <p className="mt-1 text-lg font-semibold">Rp 15,2 juta</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-100">Confidence</p>
                <p className="mt-1 text-lg font-semibold">94%</p>
              </div>
            </div>
          </div>
        </div>
      </Hero>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => (
          <StatsCard key={stat.label} label={stat.label} value={stat.value} hint={stat.hint} icon={stat.icon} accent={index % 2 === 0 ? 'from-primary-500 to-blue-500' : 'from-emerald-500 to-accent-500'} />
        ))}
      </section>

      <section className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
        <SectionHeading eyebrow="Core capabilities" title="Arsitektur yang terasa seperti produk AI modern" description="Dari masukan pengguna hingga insight yang dapat dijalankan, setiap bagian dirancang untuk memberikan pengalaman premium dan cepat." />
        <div className="mt-8 grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <motion.div key={feature.title} whileHover={{ y: -6 }} className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50/80 p-5 dark:border-slate-800 dark:bg-slate-950/40">
              <div className="inline-flex rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 p-3 text-white">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[2rem] border border-slate-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70 sm:p-8">
          <SectionHeading eyebrow="AI workflow" title="Dari input hingga insight dalam satu alur" description="Setiap prediksi dibuat dengan alur yang jelas, cepat, dan mudah dipahami oleh tim bisnis maupun analis." />
          <div className="mt-8 space-y-4">
            {workflow.map((item, index) => (
              <div key={item} className="flex gap-3 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-950/40">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 text-sm font-semibold text-white">0{index + 1}</div>
                <p className="text-sm leading-7 text-slate-600 dark:text-slate-300">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-[2rem] border border-slate-200/70 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white shadow-[0_35px_100px_-35px_rgba(2,6,23,0.8)] sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-300">Frequently asked questions</p>
          <div className="mt-6 space-y-4">
            {faq.map((item) => (
              <div key={item.question} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="font-semibold">{item.question}</p>
                <p className="mt-2 text-sm leading-7 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
