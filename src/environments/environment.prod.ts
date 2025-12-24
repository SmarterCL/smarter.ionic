// Production environment configuration
export const environment = {
  production: true,
  
  // Supabase Configuration
  supabaseUrl: 'https://rjfcmmzjlguiititkmyh.supabase.co',
  supabaseKey: 'sb_publishable_kEijPTO517V10LUFHx1_Pw_M4sAUNi1',
  
  // MCP Configuration
  mcpServerUrl: 'https://mcp.supabase.com/mcp?project_ref=rjfcmmzjlguiititkmyh',
  mcpFeatures: 'database,docs,account,debugging,functions,development,branching,storage',
  
  // App Configuration
  appName: 'SmarterOS Ionic App',
  appVersion: '1.0.0',
  
  // API Endpoints
  apiBaseUrl: 'https://api.smarteros.com/v1',
  
  // Feature Flags
  enableMCP: true,
  enableSupabaseAuth: true,
  enableAnalytics: false
};