module.exports = [
    'strapi::errors',
    {
        name: 'strapi::security',
        config: {
            contentSecurityPolicy: {
                useDefaults: true,
                directives: {
                    'connect-src': ["'self'", 'https:', 'http:'],
                    'img-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        'res.cloudinary.com',
                        '*.cloudinary.com',
                    ],
                    'media-src': [
                        "'self'",
                        'data:',
                        'blob:',
                        'dl.airtable.com',
                        'res.cloudinary.com',
                        '*.cloudinary.com',
                    ],
                    upgradeInsecureRequests: null,
                },
            },
        },
    },
    'strapi::cors',
    'strapi::poweredBy',
    // Disable logger in production to avoid Railway rate limits
    ...(process.env.NODE_ENV === 'production' ? [] : ['strapi::logger']),
    'strapi::query',
    {
        name: 'strapi::body',
        config: {
            formLimit: '256mb', // Increase form limit
            jsonLimit: '256mb', // Increase JSON limit
            textLimit: '256mb', // Increase text limit
            formidable: {
                maxFileSize: 200 * 1024 * 1024, // 200mb in bytes
            },
        },
    },
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
];