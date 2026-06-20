const dateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

export const formatDateTime = (value?: string | Date) => {
  if (!value) {
    return 'No activity';
  }

  return dateFormatter.format(new Date(value));
};

export const formatTime = (value: string | Date) => timeFormatter.format(new Date(value));

export const formatDuration = (durationMs: number) => {
  if (durationMs < 1000) {
    return '< 1s';
  }

  const totalSeconds = Math.round(durationMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds}s`;
  }

  return `${minutes}m ${seconds}s`;
};

export const compactNumber = (value: number) =>
  new Intl.NumberFormat(undefined, { notation: 'compact' }).format(value);
