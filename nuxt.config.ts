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
    modules: ['@nuxt/ui', 'nuxt-auth-utils'],
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
                },
                // 优化：预连接 Google Fonts DNS，消除握手延迟
                {
                    rel: 'preconnect',
                    href: 'https://fonts.googleapis.com',
                    crossorigin: ''
                },
                {
                    rel: 'preconnect',
                    href: 'https://fonts.gstatic.com',
                    crossorigin: ''
                },
                // 优化：异步加载字体，不阻塞首屏渲染
                {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Roboto:wght@300;400;500;700&family=Noto+Sans+SC:wght@300;400;500;700&display=swap',
                    media: 'print',
                    onload: "this.media='all'; this.onload=null;"
                }
            ]
        }
    }
})
