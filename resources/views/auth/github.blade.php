<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <title>GitHub Login</title>
</head>
<body>
<script>
    window.opener?.postMessage(
        {
            type: 'GitHub-auth-success',
            token: @json($token),
            user: @json($user),
        },
        @json($origin)
    );

    window.close();
</script>
</body>
</html>