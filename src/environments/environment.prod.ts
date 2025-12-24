// Production environment configuration
export const environment = {
  production: true,
  
  // Supabase Configuration - Now using VITE variables
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://rjfcmmzjlguiititkmyh.supabase.co',
  supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_kEijPTO517V10LUFHx1_Pw_M4sAUNi1',
  
  // MCP Configuration
  mcpServerUrl: import.meta.env.VITE_MCP_SERVER_URL || 'https://mcp.supabase.com/mcp?project_ref=rjfcmmzjlguiititkmyh',
  mcpFeatures: import.meta.env.VITE_MCP_FEATURES || 'database,docs,account,debugging,functions,development,branching,storage',
  
  // App Configuration
  appName: import.meta.env.VITE_APP_NAME || 'SmarterOS Ionic App',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // API Endpoints
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.smarteros.com/v1',
  
  // Feature Flags
  enableMCP: import.meta.env.VITE_ENABLE_MCP !== 'false',
  enableSupabaseAuth: true,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS !== 'false'
};