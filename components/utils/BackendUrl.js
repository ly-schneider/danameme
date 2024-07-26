export default function BackendUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  return apiUrl;
}
