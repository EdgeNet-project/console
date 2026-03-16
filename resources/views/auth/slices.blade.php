<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>Slices Login</title>
</head>
<body>
<script>
    window.opener?.postMessage(
        {
            type: 'Slices-auth-success',
            token: @json($token),
            user: @json($user),
        },
            @json($origin)
    );

    window.close();
</script>
</body>
</html>