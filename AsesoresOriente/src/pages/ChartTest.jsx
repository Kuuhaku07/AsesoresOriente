import React from 'react';
import MangoTemplate from '../components/MangoTemplate';
import StatsChart from '../components/StatsChart';

const ChartTest = () => {
  // Hardcoded data for testing
  const barChartData = {
    labels: ['Casa', 'Apartamento', 'Terreno', 'Local', 'Oficina'],
    datasets: [
      {
        label: 'Propiedades por Tipo',
        data: [12, 19, 3, 5, 2],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Disponible', 'Vendido', 'Alquilado', 'En proceso'],
    datasets: [
      {
        label: 'Estado de Propiedades',
        data: [30, 15, 10, 5],
        backgroundColor: [
          'rgba(75, 192, 192, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Propiedades Registradas',
        data: [5, 8, 12, 6, 10, 15],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
      },
    },
  };

  return (
    <MangoTemplate>
      <div style={{ padding: 'var(--spacing-lg)' }}>
        <h2>Prueba de Gráficos</h2>
        <StatsChart 
          type="bar" 
          data={barChartData} 
          options={chartOptions} 
          title="Propiedades por Tipo" 
        />
        <StatsChart 
          type="pie" 
          data={pieChartData} 
          options={chartOptions} 
          title="Estado de Propiedades" 
        />
        <StatsChart 
          type="line" 
          data={lineChartData} 
          options={chartOptions} 
          title="Propiedades Registradas por Mes" 
        />
      </div>
    </MangoTemplate>
  );
};

export default ChartTest;
