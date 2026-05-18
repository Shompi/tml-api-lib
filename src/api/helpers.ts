export const API_URL = "https://shompi-vpn.ddns.net" as const


export function buildUrl(
  base: string,
  params?: Record<string, string | number | boolean | undefined>
): string {
  if (!params) return base;

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const queryString = query.toString();
  return queryString ? `${base}?${queryString}` : base;
}
