/** Coordonnées officielles — source unique de vérité pour tout le site. */
export const PHONE_DISPLAY = "+221 77 238 69 77";
export const PHONE_E164 = "+221772386977";
export const PHONE_TEL_HREF = "tel:+221772386977";
export const WHATSAPP_NUMBER = "221772386977";
export const CONTACT_EMAIL = "contact@welldonescompany.com";
export const COMPANY_ADDRESS = "Dakar, Sénégal";

export function whatsappHref(text: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}
