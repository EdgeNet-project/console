const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/console.js', 'public/js')
    .react()
    // .sass('resources/sass/app.scss', 'public/css')
    // .copy('node_modules/flag-icon-css/css/flag-icons.min.css', 'public/css')
    // .copyDirectory('node_modules/flag-icon-css/flags', 'public/flags');

mix.version()