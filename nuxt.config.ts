// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'nuxt-auth-utils'],
    css: ['~/assets/css/main.css'],
    auth: {
        secret: process.env.NUXT_AUTH_SECRET || 'fairylied-secret-key-2024'
    },
    ui: {
        colorMode: true,
    },
    components: [
        {
            path: '~/components',
            pathPrefix: false,
        },
    ],
    app: {
        head: {
            title: 'Fairy Lied',
            meta: [
                {charset: 'utf-8'},
                {name: 'viewport', content: 'width=device-width, initial-scale=1'},
                {
                    name: 'description',
                    content: 'Fairy Lied - A Symphonic Metal Band'
                }
            ],
            link: [
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap'
                }
            ]
        }
    }
})
