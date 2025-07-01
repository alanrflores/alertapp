export const formatNotificationTimestamp = (timestamp: number | string | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  // Verificar si la fecha es válida
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Si es de hoy, mostrar tiempo relativo o hora
  if (diffInDays === 0) {
    if (diffInMinutes < 1) {
      return 'Ahora mismo';
    } else if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
    }
  }
  
  // Si es de ayer
  if (diffInDays === 1) {
    return `Ayer a las ${date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }
  
  // Si es de esta semana (últimos 7 días)
  if (diffInDays < 7) {
    return `${date.toLocaleDateString('es-AR', { weekday: 'long' })} a las ${date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  }
  
  // Para fechas más antiguas, mostrar fecha completa
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Función para formato más detallado en la pantalla de detalle
export const formatDetailedTimestamp = (timestamp: number | string | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  return date.toLocaleString('es-AR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Función para formato breve en listas
export const formatBriefTimestamp = (timestamp: number | string | Date): string => {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  
  if (isNaN(date.getTime())) {
    return 'Fecha inválida';
  }

  const now = new Date();
  const diffInMilliseconds = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  // Si es de hoy, mostrar solo la hora
  if (diffInDays === 0) {
    if (diffInMinutes < 1) {
      return 'Ahora';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    } else {
      return date.toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
  
  // Si es de ayer
  if (diffInDays === 1) {
    return 'Ayer';
  }
  
  // Si es de esta semana
  if (diffInDays < 7) {
    return date.toLocaleDateString('es-AR', { weekday: 'short' });
  }
  
  // Para fechas más antiguas
  return date.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit'
  });
};
