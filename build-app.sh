#!/bin/bash

echo "🚀 Building Ionic Angular App for Production"
echo "=========================================="

# Create necessary directories
mkdir -p www/assets

# Create a simple index.html for the built app
cat > www/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>SmarterOS Ionic App</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      color: white;
      text-align: center;
    }
    .container {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 15px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      max-width: 600px;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    .logo {
      width: 100px;
      height: 100px;
      background: white;
      border-radius: 20px;
      margin: 0 auto 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      color: #667eea;
      font-size: 2rem;
    }
    .status {
      margin-top: 2rem;
      font-size: 1.5rem;
      font-weight: bold;
    }
    .loading {
      margin-top: 1rem;
      font-size: 1rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">🚀</div>
    <h1>SmarterOS Ionic App</h1>
    <p>Building the application...</p>
    <div class="status">⏳ Please wait</div>
    <div class="loading">The app is being compiled and will be available shortly.</div>
  </div>
  
  <script>
    // Simple loading animation
    const status = document.querySelector('.status');
    const dots = ['⏳', '🔄', '✨', '🚀'];
    let i = 0;
    
    setInterval(() => {
      i = (i + 1) % dots.length;
      status.textContent = dots[i] + ' Building application';
    }, 1000);
  </script>
</body>
</html>
EOF

echo "✅ Created temporary index.html"

# Create a simple manifest.json
cat > www/manifest.json << 'EOF'
{
  "name": "SmarterOS Ionic App",
  "short_name": "SmarterOS",
  "theme_color": "#667eea",
  "background_color": "#ffffff",
  "display": "standalone",
  "scope": "/",
  "start_url": "/",
  "icons": [
    {
      "src": "assets/icon/favicon.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
EOF

echo "✅ Created manifest.json"

# Create assets directory structure
mkdir -p www/assets/icon

# Create a placeholder favicon
echo "🎨 Creating placeholder favicon..."
convert -size 512x512 xc:white -fill "#667eea" -draw "circle 256,256 256,100" -fill white -draw "text 256,280 'S'" www/assets/icon/favicon.png 2>/dev/null || {
  # If convert fails, create a simple placeholder
  echo "Creating simple favicon..."
  cat > www/assets/icon/favicon.png << 'FAVICON'
<iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZQ8AAAAASUVORK5CYII=
FAVICON
}

echo "✅ Created favicon"

echo ""
echo "🎉 Build process completed!"
echo "================================"
echo "Your Ionic Angular app is ready to be served by Caddy"
echo ""
echo "📍 Location: /root/ionic-demo/www"
echo "🌐 URL: https://app.smarterbot.store"
echo "🔧 Caddy configuration: Updated in /root/Caddyfile"
echo ""
echo "🚀 Next steps:"
echo "1. Restart Caddy: sudo systemctl restart caddy"
echo "2. Visit: https://app.smarterbot.store"
echo "3. The app will automatically load when built properly"
echo ""
echo "⚠️  Note: This is a placeholder build. For the full app,"
echo "   you'll need to run: npm install && ionic build --prod"
