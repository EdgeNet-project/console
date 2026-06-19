#cloud-config
write_files:
  - path: /tmp/install.sh
    permissions: '0755'
    content: |
      #!/bin/bash
      #
      # Nodemanager installation script for cloud-init
      #
      # Install based on package manager
      if command -v apt > /dev/null; then
          # DEBIAN BASED
          echo "Installing for Debian-based system..."
          
          # Add the key
          curl -fsSL https://{{$repository_host}}/deb/{{$repository_name}}.gpg \
            | gpg --dearmor -o /usr/share/keyrings/{{$repository_name}}.gpg

          # Add the repo
          echo "deb [signed-by=/usr/share/keyrings/{{config('nodemanager.repository.name')}}.gpg] https://{{$repository_host}}/deb stable main" \
            | tee /etc/apt/sources.list.d/{{$repository_name}}.list

          # Install packages
          apt update
          apt install -y nodemanager
      elif command -v dnf > /dev/null; then
          # RPM BASED
          echo "RPM-based installation is not yet implemented."
          exit 1
      else
          echo "Error: Could not find a supported package manager (apt/dnf)."
          exit 1
      fi

runcmd:
  - /tmp/install.sh
