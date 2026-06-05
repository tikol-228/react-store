const PHONE_TEL = "+375296894693";

/** Telegram по номеру (без @username): https://t.me/+375296894693 */
export function telegramUrlFromPhone(phone: string): string {
  const digits = phone.replace(/[^\d]/g, "");
  return `https://t.me/+${digits}`;
}

export const TELEGRAM_URL =
  import.meta.env.VITE_TELEGRAM_URL || telegramUrlFromPhone(PHONE_TEL);

/** Профиль Instagram (переопределите через VITE_INSTAGRAM_URL) */
export const INSTAGRAM_URL =
  import.meta.env.VITE_INSTAGRAM_URL || "https://www.instagram.com/yulia_kosmetologestet/";

export const companyInfo = {
  name: "ООО Арткапитал",
  phoneTel: PHONE_TEL,
  phoneDisplay: "+375(29)6894693 (A1)",
  telegram: TELEGRAM_URL,
  instagram: INSTAGRAM_URL,
  taxNumber: "УНП 191587568",
  legal: {
    name: "ООО Арткапитал",
    unp: "УНП 191587568",
    legalAddress: "220113, Беларусь, г. Минск, ул. Амураторская д.4 ком.103",
    registration:
      "Свидетельство о государственной регистрации 191587568 выдано Минским горисполкомом 01.08.2011",
    tradeRegistry: "Интернет-магазин включён в Торговый реестр Республики Беларусь.",
  },
  pickupAddress: {
    country: "Беларусь",
    city: "г. Минск",
    street: "ул. Амураторская д.4 ком.103",
  },
  emails: {
    primary: "zubjul81@gmail.com",
    secondary: "artkapital@bk.ru",
  },
  bankDetails: {
    bank: "ЗАО «РРБ-Банк»",
    accountNumber: "BY14REDJ30121005187010000933",
    bic: "REDJBY22",
  },
  workingHours: {
    weekday: "Пн-Пт: 9:00-19:00",
    saturday: "Сб: 10:00-16:00",
    sunday: "Вс: выходной",
  },
};
