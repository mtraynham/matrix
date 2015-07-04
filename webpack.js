import pkg from './package';
import {readFileSync} from 'fs';
import {merge, template} from 'lodash';
import {optimize, BannerPlugin} from 'webpack';

const date = new Date();

const banner = template(readFileSync(__dirname + '/LICENSE_BANNER', 'utf8'))({
    pkg: pkg,
    date: date,
    year: date.getFullYear()
});

const base = {
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    output: {
        libraryTarget: 'umd',
        devtoolModuleFilenameTemplate: 'webpack:///matrix/[resource-path]'
    },
    module: {
        preLoaders: [{test: /\.js$/, loader: 'source-map-loader'}],
        loaders: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader!babel-loader?optional[]=runtime'
            }
        ]
    },
    devtool: 'source-map'
};

export const build = merge({
    entry: './index.ts',
    output: {
        filename: 'matrix.js',
        library: 'm'
    },
    plugins: [
        new BannerPlugin(banner, {raw: true})
    ]
}, base);

export const uglify = merge({
    entry: './index.ts',
    output: {
        filename: 'matrix.min.js',
        library: 'm'
    },
    plugins: [
        new optimize.UglifyJsPlugin(),
        new BannerPlugin(banner, {raw: true})
    ]
}, base);

export const test = merge({
    externals: {
        'chai': 'chai',
    },
    output: {
        filename: 'test.js'
    }
}, base);
