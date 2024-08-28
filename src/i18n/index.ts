import { Locales } from "./locales";
import { createI18n } from 'vue-i18n';

import es from "./es.json";
import pt from "./pt.json";

const messages      = {
        [Locales.ES]: es,
        [Locales.PT]: pt
      },
      defaultLocale = Locales.ES,
      i18n          = createI18n({
        legacy: false,
        locale: defaultLocale,
        globalInjection: true,
        fallbackLocale: defaultLocale,
        messages
      })

export default i18n