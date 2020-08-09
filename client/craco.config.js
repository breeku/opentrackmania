const CracoAlias = require('craco-alias')

module.exports = {
    plugins: [
        {
            plugin: CracoAlias,
            options: {
                source: 'options',
                baseUrl: './',
                aliases: {
                    '@components': './src/components',
                    '@redux': './src/redux',
                    '@services': './src/services',
                    '@utils': './src/utils',
                },
            },
        },
    ],
}
