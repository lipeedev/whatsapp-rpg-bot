export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);

  const days = Math.floor(totalSeconds / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const timeParts: string[] = [];

  if (days > 0) {
    timeParts.push(`${days} ${days === 1 ? 'dia' : 'dias'}`);
  }

  if (hours > 0) {
    timeParts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`);
  }

  if (minutes > 0) {
    timeParts.push(`${minutes} ${minutes === 1 ? 'min' : 'min'}`);
  }

  if (seconds > 0 || timeParts.length === 0) {
    timeParts.push(`${seconds} ${seconds === 1 ? 'seg' : 'seg'}`);
  }

  return timeParts.join(' ');
}


