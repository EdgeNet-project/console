
@include('node.setup.os')

@include('node.setup.packages')

@include('node.setup.modules')

@include('node.setup.swap')

@include('node.setup.selinux')

@include('boot.setup.network')

@include('boot.setup.firewall')

@include('boot.setup.kubelet')

@include('boot.setup.kubernetes')