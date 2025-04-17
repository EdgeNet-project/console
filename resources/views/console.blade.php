<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ env('APP_NAME', 'EdgeNet Console') }}</title>

    <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="shortcut icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    <meta name="apple-mobile-web-app-title" content="{{env('APP_NAME', 'EdgeNet Console')}}" />
    <link rel="manifest" href="/site.webmanifest" />

    <script>
        var console_app = {
            url: '{{url('/')}}',
            name: '{{env('CONSOLE_NAME', 'EdgeNet')}}',
            logo: {
                login: '{{env('CONSOLE_LOGO', '/images/edgenet-logo.png')}}',
                navigation: '{{env('CONSOLE_LOGO', '/images/edgenet-logo.png')}}',
                navigation_height: 60
            },
            support: '{{env('CONSOLE_SUPPORT', 'support@edge-net.org')}}'
        }

    </script>
    @viteReactRefresh
    @vite(['resources/js/console.jsx'])
</head>
<body>
<div id="console"></div>
</body>
</html>
