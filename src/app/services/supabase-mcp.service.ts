import { Injectable } from '@angular/core';
import { LoadingController, ToastController, Platform } from '@ionic/angular';
import { AuthChangeEvent, createClient, Session, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Profile {
  id?: string;
  username: string;
  email?: string;
  website?: string;
  avatar_url?: string;
  mcp_access?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface MCPResponse {
  success: boolean;
  data?: any;
  error?: string;
  status?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SupabaseMcpService {
  private supabase: SupabaseClient;
  private currentUser: BehaviorSubject<any> = new BehaviorSubject(null);
  private currentSession: BehaviorSubject<Session | null> = new BehaviorSubject(null);
  
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private platform: Platform,
    private http: HttpClient
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.initializeAuthListener();
  }
  
  // Initialize authentication state listener
  private initializeAuthListener(): void {
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentSession.next(session);
      if (session?.user) {
        this.currentUser.next(session.user);
        this.logMcpEvent('auth_state_change', { event, user_id: session.user.id });
      } else {
        this.currentUser.next(null);
      }
    });
  }
  
  // Get current user observable
  get user$(): Observable<any> {
    return this.currentUser.asObservable();
  }
  
  // Get current session observable
  get session$(): Observable<Session | null> {
    return this.currentSession.asObservable();
  }
  
  // Get current user promise
  async getUser(): Promise<any> {
    const { data: { user } } = await this.supabase.auth.getUser();
    return user;
  }
  
  // Get current session promise
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session;
  }
  
  // Get user profile
  async getProfile(userId?: string): Promise<Profile | null> {
    const currentUser = userId || (await this.getUser())?.id;
    if (!currentUser) return null;
    
    const { data, error } = await this.supabase
      .from(environment.dbTables.profiles)
      .select('*')
      .eq('id', currentUser)
      .single();
    
    if (error) {
      await this.logMcpEvent('profile_fetch_error', { error: error.message });
      throw error;
    }
    
    return data;
  }
  
  // Sign in with magic link
  async signIn(email: string): Promise<MCPResponse> {
    try {
      const { error } = await this.supabase.auth.signInWithOtp({ email });
      
      if (error) {
        throw error;
      }
      
      await this.logMcpEvent('user_signin_attempt', { email });
      
      return {
        success: true,
        data: { message: 'Magic link sent successfully. Check your email!' }
      };
    } catch (error: any) {
      await this.logMcpEvent('user_signin_error', { 
        email, 
        error: error.message 
      });
      
      return {
        success: false,
        error: error.error_description || error.message
      };
    }
  }
  
  // Sign out
  async signOut(): Promise<MCPResponse> {
    try {
      const { error } = await this.supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      const user = await this.getUser();
      await this.logMcpEvent('user_signout', { user_id: user?.id });
      
      return {
        success: true,
        data: { message: 'Signed out successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Update user profile
  async updateProfile(profile: Profile): Promise<MCPResponse> {
    try {
      const user = await this.getUser();
      if (!user) {
        throw new Error('No authenticated user');
      }
      
      const updateData = {
        ...profile,
        id: user.id,
        updated_at: new Date().toISOString(),
        email: user.email
      };
      
      const { error } = await this.supabase
        .from(environment.dbTables.profiles)
        .upsert(updateData);
      
      if (error) {
        throw error;
      }
      
      await this.logMcpEvent('profile_updated', { 
        user_id: user.id, 
        changes: Object.keys(profile)
      });
      
      return {
        success: true,
        data: { message: 'Profile updated successfully' }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Upload avatar to Supabase storage
  async uploadAvatar(filePath: string, file: File): Promise<MCPResponse> {
    try {
      const { error } = await this.supabase
        .storage
        .from(environment.storageBucket)
        .upload(filePath, file);
      
      if (error) {
        throw error;
      }
      
      const user = await this.getUser();
      await this.logMcpEvent('avatar_uploaded', { 
        user_id: user?.id,
        file_path: filePath,
        file_size: file.size
      });
      
      return {
        success: true,
        data: { path: filePath }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Download image from Supabase storage
  async downloadImage(path: string): Promise<{ success: boolean; data?: Blob; error?: string }> {
    try {
      const { data, error } = await this.supabase
        .storage
        .from(environment.storageBucket)
        .download(path);
      
      if (error) {
        throw error;
      }
      
      return {
        success: true,
        data: data
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // MCP Integration - Log events to MCP server
  async logMcpEvent(eventType: string, payload: any = {}): Promise<void> {
    if (!environment.enableMCP) return;
    
    try {
      const user = await this.getUser();
      const session = await this.getSession();
      
      const eventData = {
        timestamp: new Date().toISOString(),
        event_type: eventType,
        user_id: user?.id || 'anonymous',
        session_id: session?.access_token || 'no-session',
        platform: this.platform.platforms().join(', '),
        app_version: environment.appVersion,
        ...payload
      };
      
      // In a real implementation, this would send to the MCP server
      // For now, we'll log to console and could store in Supabase
      console.log('[MCP Event]', eventData);
      
      if (environment.enableMCP) {
        // Store in Supabase for now (MCP server integration would go here)
        await this.supabase
          .from(environment.dbTables.mcp_logs)
          .insert([eventData]);
      }
    } catch (error) {
      console.error('MCP Event Logging Error:', error);
    }
  }
  
  // MCP Integration - Get MCP server status
  async getMcpServerStatus(): Promise<MCPResponse> {
    try {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'X-MCP-Project': 'rjfcmmzjlguiititkmyh'
      });
      
      const response = await this.http.get(environment.mcpServerUrl, { headers }).toPromise();
      
      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        status: error.status
      };
    }
  }
  
  // Create notification toast
  async createNotice(message: string, duration: number = 5000): Promise<void> {
    const toast = await this.toastCtrl.create({ 
      message, 
      duration,
      position: 'top'
    });
    await toast.present();
  }
  
  // Create loading indicator
  async createLoader(message: string = 'Loading...'): Promise<HTMLIonLoadingElement> {
    const loader = await this.loadingCtrl.create({ 
      message,
      spinner: 'crescent'
    });
    return loader;
  }
  
  // Check if user has MCP access
  async hasMcpAccess(): Promise<boolean> {
    try {
      const profile = await this.getProfile();
      return profile?.mcp_access || false;
    } catch (error) {
      return false;
    }
  }
}