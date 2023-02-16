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

mix.copy('node_modules/flag-icon-css/css/flag-icons.min.css', 'public/css')
    .copyDirectory('node_modules/flag-icon-css/flags', 'public/flags')
    .js('resources/js/console.js', 'public/js')
    // .js('resources/js/test.js', 'public/js')
    // .js('resources/js/users.js', 'public/js')
    .react()
    // .sass('resources/sass/app.scss', 'public/css')

mix.version()