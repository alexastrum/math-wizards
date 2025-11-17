{ pkgs }: {
  channel = "stable-24.11"; # or "unstable"
  packages = [
    pkgs.nodejs_22
  ];
  # Sets environment variables in the workspace
  env = {
    FRONTEND_HOST = "https://9000-$WEB_HOST";
    DOMAIN = "https://9000-$WEB_HOST";
  };
  idx = {
    # Search for the extensions on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      "Google.gemini-cli-vscode-ide-companion"
    ];
    workspace = {
      onCreate = {
        npm-install = "npm install";
        default.openFiles = [ "App.tsx" ];
      };
    };
    # Enable previews and customize configuration
    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" "--" "--port" "$PORT" ];
          manager = "web";
        };
      };
    };
  };
}
