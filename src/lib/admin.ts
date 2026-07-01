export const ADMIN_EMAILS = [
  "clientes@maxrico.es",
  "maxrico@maxrico.es",
  "alvarodavid3062@gmail.com",
  "exododigital21@gmail.com",
];

export function isAdminEmail(email?: string | null) {
  return Boolean(email && ADMIN_EMAILS.includes(email.toLowerCase()));
}