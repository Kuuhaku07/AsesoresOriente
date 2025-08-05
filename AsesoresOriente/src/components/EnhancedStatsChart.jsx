import React from 'react';
import {
  Bar, Pie, Line, Doughnut, Radar, PolarArea, Scatter, Bubble
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ScatterController,
  BubbleController
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  RadialLinearScale,
  ScatterController,
  BubbleController
);

const EnhancedStatsChart = ({ type, data, options, title, height = 300 }) => {
  const renderChart = () => {
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 14,
            weight: 'bold'
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: '#ddd',
          borderWidth: 1,
          cornerRadius: 4,
          displayColors: true
        }
      },
      ...options
    };

    switch (type) {
      case 'bar':
        return <Bar data={data} options={chartOptions} />;
      case 'pie':
        return <Pie data={data} options={chartOptions} />;
      case 'doughnut':
        return <Doughnut data={data} options={chartOptions} />;
      case 'line':
        return <Line data={data} options={chartOptions} />;
      case 'radar':
        return <Radar data={data} options={chartOptions} />;
      case 'polarArea':
        return <PolarArea data={data} options={chartOptions} />;
      case 'scatter':
        return <Scatter data={data} options={chartOptions} />;
      case 'bubble':
        return <Bubble data={data} options={chartOptions} />;
      default:
        return <Bar data={data} options={chartOptions} />;
    }
  };

  return (
    <div style={{
      padding: 'var(--spacing-md)',
      backgroundColor: 'var(--color-background-2)',
      borderRadius: 'var(--border-radius-md)',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      height: `${height}px`,
      position: 'relative'
    }}>
      <div style={{ height: 'calc(100% - 20px)' }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default EnhancedStatsChart;
