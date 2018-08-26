const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { IgnorePlugin, DefinePlugin } = require('webpack')
const OfflinePlugin = require('offline-plugin')
const withSass = require('@zeit/next-sass')

module.exports = withSass({
  webpack: (config, { dev, buildId, isServer }) => {
    const prod = !dev

    if (!dev) {
      config.devtool = 'source-map'
    }

    config.plugins.push(new IgnorePlugin(/^\.\/locale$/, /moment$/))
    config.plugins.push(
      new DefinePlugin({
        'process.env': {
          // flag to indicate this is for browser-side
          BROWSER: !isServer
        }
      })
    )

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            outputPath: 'images/',
            publicPath: '/_next/',
            name: dev ? '[name]-[hash].[ext]' : '[hash].[ext]',
            limit: 4000,
          },
        },
      ],
    })

//      module.exports = {
//   webpack: (config, { dev }) => {
//     config.module.rules.push({ test: /\.scss$/, loader: ['style-loader', 'css-loader', 'sass-loader'] });
//     return config;
//   }
// } 



    if (process.env.ANALYZE_BUILD) {
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true
        })
      )
    }

    if (prod && process.env.OFFLINE_SUPPORT) {
      config.plugins.push(
        new OfflinePlugin({
          publicPath: '/',
          relativePaths: false,
          externals: ['/', '/manifest.html'],
          excludes: ['.htaccess'],
          safeToUseOptionalCaches: true,
          caches: 'all',
          rewrites: function rewrites (asset) {
            if (
              asset.indexOf('.hot-update.js') > -1 ||
              asset.indexOf('build-stats.json') > -1 ||
              asset === 'BUILD_ID' ||
              asset.indexOf('dist/') === 0
            ) {
              return null
            }

            if (asset[0] === '/') {
              return asset
            }

            if (asset.indexOf('bundles/pages/') === 0) {
              return `/_next/-/${asset
                .replace('bundles/pages', 'page')
                .replace('index.js', '')
                .replace(/\.js$/, '')}`
            }

            return `/_next/-/${asset}`
          },
          autoUpdate: 1000 * 60 * 5,
          __tests: dev ? { ignoreRuntime: true } : {},
          ServiceWorker: {
            events: true,
            navigateFallbackURL: '/'
          },
          AppCache: {
            directory: './',
            events: true
          }
        })
      )
    }

    return config
  },
  useFileSystemPublicRoutes: false
})
