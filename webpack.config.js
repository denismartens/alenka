module.exports = {
    entry: './app.js',
    mode: 'production',
    output: {
        path: `${__dirname}/dist`,
        filename: 'bundle.js',
    },
    resolve: {
        alias: {
            jquery: `${__dirname}/assets/js/jquery.min.js`
        }
    },
    module: {
        rules: [
            {
                test: require.resolve(`${__dirname}/assets/js/jquery.min.js`),
                loader: 'expose-loader',
                options: {
                    exposes: ['$', 'jQuery']
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(svg|png)$/,
                use: {
                    loader: 'url-loader'
                }
            }
        ]
    }
};