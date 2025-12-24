# Ionic Angular Supabase + MCP Template

🚀 **A comprehensive Ionic Angular template with Supabase authentication and Mistral Control Plane (MCP) integration**

[![Ionic](https://img.shields.io/badge/Ionic-7.0.0-blue)](https://ionicframework.com/)
[![Angular](https://img.shields.io/badge/Angular-17.0.0-red)](https://angular.io/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0.0-green)](https://supabase.com/)
[![MCP](https://img.shields.io/badge/MCP-Ready-orange)](https://mcp.supabase.com/)

## 📋 Overview

This template provides a complete starter kit for building Ionic Angular applications with:

- ✅ **Supabase Authentication** (Magic Link, Email/Password)
- ✅ **Mistral Control Plane (MCP) Integration**
- ✅ **Complete Database Schema** with Row Level Security
- ✅ **User Profile Management** with avatar uploads
- ✅ **MCP Access Control System**
- ✅ **Production-Ready Configuration**

## 🔧 Features

### Authentication
- Email-based magic link authentication
- Session management
- Auth state persistence

### User Management
- Profile creation and updates
- Avatar upload with Capacitor Camera
- MCP access request system

### Database
- Complete Supabase schema with RLS policies
- Profiles table with extended user data
- MCP logs table for event tracking
- Sessions table for user activity monitoring

### MCP Integration
- Event logging to MCP server
- Access control system
- Admin approval workflow

### UI Components
- Professional login page
- Complete account management page
- Responsive design
- Ionic UI components

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+ or yarn
- Ionic CLI: `npm install -g @ionic/cli`
- Capacitor CLI: `npm install -g @capacitor/cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/tu-usuario/ionic-supabase-mcp-template.git
cd ionic-supabase-mcp-template

# Install dependencies
npm install

# Start the development server
ionic serve
```

### Configuration

Edit `src/environments/environment.ts` to configure your Supabase and MCP settings:

```typescript
export const environment = {
  production: false,
  
  // Supabase Configuration
  supabaseUrl: 'YOUR_SUPABASE_URL',
  supabaseKey: 'YOUR_SUPABASE_KEY',
  
  // MCP Configuration
  mcpServerUrl: 'YOUR_MCP_SERVER_URL',
  mcpFeatures: 'database,docs,account,debugging,functions,development,branching,storage',
  
  // App Configuration
  appName: 'Your App Name',
  appVersion: '1.0.0'
};
```

## 📁 Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── login/          # Login page with magic link auth
│   │   └── account/        # Account management page
│   ├── services/
│   │   └── supabase-mcp.service.ts  # Main service with Supabase + MCP
│   ├── app.component.ts    # Main app component
│   ├── app.module.ts       # Main app module
│   └── app-routing.module.ts # App routing
│
├── environments/          # Environment configurations
│   └── environment.ts
│
├── assets/                # Static assets
└── theme/                 # Global styles

supabase/
└── database-schema.sql    # Complete database schema

.gitignore                # Git ignore rules
package.json              # Project dependencies
README.md                 # This file
```

## 🔑 Supabase Setup

### 1. Create Database Schema

Run the SQL from `supabase/database-schema.sql` in your Supabase SQL editor.

### 2. Configure Authentication

Enable email authentication in Supabase Auth settings.

### 3. Set Up Storage

Create a storage bucket named `avatars` for user profile pictures.

### 4. Configure RLS Policies

The schema includes comprehensive Row Level Security policies for data protection.

## 🤖 MCP Integration

### Event Logging

The service automatically logs events to MCP:

```typescript
// Example: Log a custom event
await this.supabaseMcp.logMcpEvent('custom_event', { 
  data: 'your payload'
});
```

### Access Control

```typescript
// Check if user has MCP access
const hasAccess = await this.supabaseMcp.hasMcpAccess();

// Request MCP access
await this.supabaseMcp.requestMcpAccess();
```

## 📱 Mobile Setup

### Capacitor Configuration

```bash
# Add platforms
ionic build
npx cap add android
npx cap add ios

# Sync with native projects
npx cap sync

# Open in Android Studio
npx cap open android

# Open in Xcode
npx cap open ios
```

## 🎨 Customization

### Themes

Edit `src/theme/variables.scss` to customize colors and styles.

### Pages

- **Login Page**: `src/app/pages/login/`
- **Account Page**: `src/app/pages/account/`

### Services

- **SupabaseMcpService**: `src/app/services/supabase-mcp.service.ts`

## 🚀 Deployment

### Web Deployment

```bash
# Build for production
ionic build --prod

# Deploy to Firebase
firebase deploy

# Deploy to Netlify
netlify deploy --prod

# Deploy to Vercel
vercel --prod
```

### Mobile Deployment

```bash
# Android
ionic build
npx cap sync android
npx cap run android --prod

# iOS
ionic build
npx cap sync ios
npx cap run ios --prod
```

## 📖 Documentation

- [Ionic Framework](https://ionicframework.com/docs)
- [Angular Documentation](https://angular.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Capacitor Documentation](https://capacitorjs.com/docs)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## 📝 License

MIT License. See `LICENSE` for more information.

## 🙏 Acknowledgements

- [Ionic Framework](https://ionicframework.com/)
- [Supabase](https://supabase.com/)
- [Angular](https://angular.io/)
- [Capacitor](https://capacitorjs.com/)

---

🌟 **Ready to build amazing apps with Ionic, Supabase, and MCP!** 🌟