import {createI18n, LocaleMessages, VueMessageType} from 'vue-i18n'

/**
 * Load locale messages
 *
 * The loaded `JSON` locale messages is pre-compiled by `@intlify/vue-i18n-loader`, which is integrated into `vue-cli-plugin-i18n`.
 * See: https://github.com/intlify/vue-i18n-loader#rocket-i18n-resource-pre-compilation
 */
function loadLocaleMessages(): { [x: string]: LocaleMessages<VueMessageType> } {
    const locales = require.context('./i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i)
    // const messages: LocaleMessages<VueMessageType> = {};
    const messages: { [x: string]: LocaleMessages<VueMessageType> } = {}

    locales.keys().forEach(key => {
        const matched: RegExpMatchArray | null = key.match(/([A-Za-z0-9-_]+)\./i)
        if (matched && matched.length > 1) {
            const locale = matched[1]
            messages[locale] = locales(key).default
        }
    })

    return messages
}

export default createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'es',
    fallbackLocale: 'es',
    messages: loadLocaleMessages()
})
