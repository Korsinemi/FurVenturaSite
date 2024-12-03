import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import webpack from 'webpack';

const require = createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
    mode: 'development', // O 'production'
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        assetModuleFilename: '[path][name][ext]',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                // Extensiones a ignorar
                test: /\.(mp3)$/,
                use: 'ignore-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        fallback: {
            assert: require.resolve('assert/'),
            crypto: require.resolve('crypto-browserify'),
            path: require.resolve('path-browserify'),
            stream: require.resolve('stream-browserify'),
            url: require.resolve('url/'),
            buffer: require.resolve('buffer/'),
            vm: require.resolve('vm-browserify'),
            process: require.resolve('process/browser')
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser'
        })
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 5050,
        historyApiFallback: true
    }
};