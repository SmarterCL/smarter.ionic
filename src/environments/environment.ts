// Supabase + MCP Environment Configuration
// This file contains the configuration for both Supabase and MCP services
export const environment = {
  production: false,
  
  // Supabase Configuration
  supabaseUrl: 'https://rjfcmmzjlguiititkmyh.supabase.co',
  supabaseKey: 'sb_publishable_kEijPTO517V10LUFHx1_Pw_M4sAUNi1',
  
  // MCP (Mistral Control Plane) Configuration
  mcpServerUrl: 'https://mcp.supabase.com/mcp?project_ref=rjfcmmzjlguiititkmyh',
  mcpFeatures: 'database,docs,account,debugging,functions,development,branching,storage',
  
  // App Configuration
  appName: 'SmarterOS Ionic Template',
  appVersion: '1.0.0',
  
  // API Endpoints
  apiBaseUrl: 'https://api.smarteros.com/v1',
  
  // Feature Flags
  enableMCP: true,
  enableSupabaseAuth: true,
  enableAnalytics: false,
  
  // Storage Configuration
  storageBucket: 'avatars',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  
  // Database Tables
  dbTables: {
    profiles: 'profiles',
    users: 'users',
    sessions: 'sessions',
    mcp_logs: 'mcp_logs'
  }
};