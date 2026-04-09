// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Vercel 部署预设
    nitro: {
        preset: 'vercel',
        // Vercel 上传大小限制（默认 25MB，最大 50MB）
        experimental: {
            asyncContext: true
        }
    },
    devtools: {enabled: true},
    modules: ['@nuxt/ui', 'nuxt-auth-utils', '@vercel/speed-insights'],
    css: ['~/assets/css/main.css'],

    // 运行时配置（服务端可用）
    runtimeConfig: {
        // Supabase 配置（仅服务端）
        supabaseUrl: process.env.NUXT_SUPABASE_URL,
        supabaseServiceKey: process.env.NUXT_SUPABASE_SERVICE_KEY,

        // Auth 配置
        auth: {
            secret: process.env.NUXT_AUTH_SECRET || 'fairylied-secret-key-2024',
        },

        // 公共配置（客户端也可用）
        public: {
            uploadMaxSize: parseInt(process.env.NUXT_PUBLIC_UPLOAD_MAX_SIZE || '104857600')
        }
    },

    auth: {
        session: {
            maxAge: 60 * 60 * 24 * 7 // 7天
        }
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
                    rel: 'icon',
                    type: 'image/x-icon',
                    href: '/favicon.ico'
                }
            ]
        }
    },
    // 字体优化：@nuxt/fonts 自动子集化并自托管字体
    fonts: {
        // 禁用 Google Fonts，仅使用本地自托管（自动子集化）
        providers: {
            google: false
        }
    }
})
