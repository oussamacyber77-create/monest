export const SALLA_CONFIG = {
  clientId: "7c5d1dd5-8230-4d1e-bb04-45517d4266bb",
  clientSecret: "9310fe81f9b09133883ccd1cb7f0ceec00d1d355c5dc2dc2b11a30a38127820f",
  redirectUri: "https://quickmeet-ochre.vercel.app/api/salla/callback",
  scope: "basic.customers.orders.carts.branches.categories.brands.products.webhooks.payments.taxes.dns.offers.countries.shipping.marketing.reviews.meta.financial.hold.settings.export.subscription.wallet",
  authUrl: "https://accounts.salla.sa/oauth2/auth",
  tokenUrl: "https://accounts.salla.sa/oauth2/token",
  apiBaseUrl: "https://api.salla.dev",
}

export function getSallaAuthUrl(): string {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: SALLA_CONFIG.clientId,
    redirect_uri: SALLA_CONFIG.redirectUri,
    scope: SALLA_CONFIG.scope,
  })
  return SALLA_CONFIG.authUrl + "?" + params.toString()
}
