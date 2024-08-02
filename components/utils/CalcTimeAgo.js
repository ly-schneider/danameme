export default function CalcTimeAgo(date) {
  // Return date from utc to locale in format "vor x Minuten/Stunden/Tagen"
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) {
    return `vor ${days} Tag${days > 1 ? "en" : ""}`;
  }
  if (hours > 0) {
    return `vor ${hours} Stunde${hours > 1 ? "n" : ""}`;
  }
  if (minutes > 0) {
    return `vor ${minutes} Minute${minutes > 1 ? "n" : ""}`;
  }
  return `vor ${seconds} Sekunde${seconds > 1 ? "n" : ""}`;
}
