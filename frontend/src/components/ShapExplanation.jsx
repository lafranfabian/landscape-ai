import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiInfo, FiCpu } from 'react-icons/fi';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ShapExplanation({ shapContributions, naturalLanguageExplanation, featureImportance, predictedPricePerM2Formatted }) {
  
  // Format data for Feature Importance horizontal bar chart
  const topImportances = featureImportance ? featureImportance.slice(0, 8) : [];
  
  const chartData = {
    labels: topImportances.map(item => item.name),
    datasets: [
      {
        label: 'Skor Kepentingan Fitur (Split)',
        data: topImportances.map(item => item.importance),
        backgroundColor: 'rgba(72, 125, 151, 0.75)',
        borderColor: 'rgba(72, 125, 151, 1)',
        borderWidth: 1,
        borderRadius: 4,
        hoverBackgroundColor: 'rgba(46, 163, 153, 0.85)',
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `Kepentingan: ${context.raw} split`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
        ticks: {
          color: '#8f9bb0',
          font: { family: 'Outfit, sans-serif' },
        },
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#8f9bb0',
          font: { family: 'Outfit, sans-serif', size: 11 },
        },
      },
    },
  };

  // Separate positive and negative contributions (ignoring baseline base_value or sorting by direction)
  const positiveContribs = shapContributions
    ? shapContributions.filter(c => c.contribution > 0).sort((a, b) => b.contribution - a.contribution)
    : [];
    
  const negativeContribs = shapContributions
    ? shapContributions.filter(c => c.contribution < 0).sort((a, b) => a.contribution - b.contribution)
    : [];

  return (
    <div className="space-y-6">
      
      {/* 1. Natural Language Explanation Panel */}
      <div className="glass-card p-6 rounded-2xl border-l-4 border-l-primary-500 dark:border-l-accent-500">
        <div className="flex items-center space-x-2 mb-3">
          <FiCpu className="w-5 h-5 text-primary-500 dark:text-accent-400" />
          <h3 className="text-md font-bold tracking-tight text-gray-800 dark:text-white">
            Analisis Penjelasan AI (Explainable AI)
          </h3>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm" 
           dangerouslySetInnerHTML={{ __html: naturalLanguageExplanation || 'Memuat analisis...' }}>
        </p>
      </div>

      {/* 2. Contributions Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Positive Contributions */}
        <div className="glass-card p-5 rounded-2xl flex flex-col h-fit">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 dark:border-gray-800/40 pb-2">
            <FiTrendingUp className="w-5 h-5 text-emerald-500" />
            <h4 className="font-bold text-sm text-gray-800 dark:text-white">Faktor Penaik Harga (+)</h4>
          </div>
          {positiveContribs.length > 0 ? (
            <div className="space-y-3">
              {positiveContribs.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium max-w-[70%]">
                    {item.description.split(' dari ')[1] || item.feature}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded">
                    +{item.contribution.toFixed(2)} jt/m²
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Tidak ada kontribusi positif yang signifikan</span>
          )}
        </div>

        {/* Negative Contributions */}
        <div className="glass-card p-5 rounded-2xl flex flex-col h-fit">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 dark:border-gray-800/40 pb-2">
            <FiTrendingDown className="w-5 h-5 text-rose-500" />
            <h4 className="font-bold text-sm text-gray-800 dark:text-white">Faktor Penekan Harga (-)</h4>
          </div>
          {negativeContribs.length > 0 ? (
            <div className="space-y-3">
              {negativeContribs.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-xs">
                  <span className="text-gray-500 dark:text-gray-400 font-medium max-w-[70%]">
                    {item.description.split(' dari ')[1] || item.feature}
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 font-bold whitespace-nowrap bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded">
                    {item.contribution.toFixed(2)} jt/m²
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400 dark:text-gray-500">Tidak ada kontribusi negatif yang signifikan</span>
          )}
        </div>
      </div>

      {/* 3. Global Feature Importance Chart */}
      {topImportances.length > 0 && (
        <div className="glass-card p-5 rounded-2xl">
          <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 dark:border-gray-800/40 pb-2">
            <FiInfo className="w-4 h-4 text-primary-500 dark:text-accent-400" />
            <h4 className="font-bold text-sm text-gray-800 dark:text-white">Struktur Kepentingan Fitur Global</h4>
          </div>
          <div className="h-[240px]">
            <Bar data={chartData} options={chartOptions} />
          </div>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 text-center">
            Menunjukkan seberapa sering setiap fitur dipilih untuk membuat keputusan pemisahan (split) di semua pohon keputusan LightGBM.
          </p>
        </div>
      )}
    </div>
  );
}
