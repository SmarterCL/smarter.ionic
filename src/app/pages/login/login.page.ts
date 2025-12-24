import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseMcpService } from '../../services/supabase-mcp.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;
  isLoading = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private supabaseMcp: SupabaseMcpService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  async ionViewWillEnter() {
    // Check if user is already logged in
    const session = await this.supabaseMcp.getSession();
    if (session) {
      this.router.navigate(['/account']);
    }
  }
  
  async handleLogin() {
    if (this.loginForm.invalid) {
      await this.supabaseMcp.createNotice('Please enter a valid email address');
      return;
    }
    
    const email = this.loginForm.value.email;
    this.isLoading = true;
    
    const loader = await this.supabaseMcp.createLoader('Sending magic link...');
    await loader.present();
    
    try {
      const result = await this.supabaseMcp.signIn(email);
      
      if (result.success) {
        await this.supabaseMcp.createNotice('Magic link sent! Check your email to sign in.');
        this.loginForm.reset();
      } else {
        await this.supabaseMcp.createNotice(result.error || 'Failed to send magic link');
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message || 'An error occurred');
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }
  
  async signInWithGoogle() {
    this.isLoading = true;
    const loader = await this.supabaseMcp.createLoader('Signing in with Google...');
    await loader.present();
    
    try {
      // Note: This would require additional Supabase auth provider setup
      await this.supabaseMcp.createNotice('Google sign-in not yet configured');
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }
}