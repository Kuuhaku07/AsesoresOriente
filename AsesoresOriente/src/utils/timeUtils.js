export function formatRelativeTime(dateString) {
  if (!dateString) return 'Nunca';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;

  const seconds = Math.floor(diffMs / 1000);
  if (seconds < 60) return `hace ${seconds} segundos`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `hace ${minutes} minutos`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} horas`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `hace ${days} días`;

  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} meses`;

  const years = Math.floor(months / 12);
  return `hace ${years} años`;
}

