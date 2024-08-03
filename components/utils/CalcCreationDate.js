export default function CalcCreationDate(date) {
  // Return date from utc to locale in format "01. Januar 2000"
  return new Date(date).toLocaleString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
