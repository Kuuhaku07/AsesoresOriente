import React from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
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
  Legend
);

const StatsChart = ({ type, data, options, title }) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'line':
        return <Line data={data} options={options} />;
      default:
        return <Bar data={data} options={options} />;
    }
  };

  return (
    <div style={{ padding: 'var(--spacing-md)', backgroundColor: 'var(--color-background-2)', borderRadius: 'var(--border-radius-md)', height: '100%' }}>
      <h4 style={{ textAlign: 'center', marginBottom: 'var(--spacing-md)' }}>{title}</h4>
      <div style={{ height: 'calc(100% - 40px)' }}>
        {renderChart()}
      </div>
    </div>
  );
};

export default StatsChart;
