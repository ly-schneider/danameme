export default function Now() {
  const localDate = new Date();
  const nowUtc = localDate.toISOString();
  const now = new Date(nowUtc);
  return now;
}
