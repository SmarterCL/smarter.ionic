import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseMcpService, Profile } from '../../services/supabase-mcp.service';
import { Camera, CameraResultType } from '@capacitor/camera';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit {
  profileForm: FormGroup;
  profile: Profile = {
    username: '',
    email: '',
    website: '',
    avatar_url: '',
    mcp_access: false
  };
  
  isLoading = false;
  avatarUrl: string | null = null;
  hasMcpAccess = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private supabaseMcp: SupabaseMcpService,
    private router: Router
  ) {
    this.profileForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      website: ['', [Validators.pattern('https?://.+')]]
    });
  }
  
  async ngOnInit() {
    await this.loadProfile();
    this.checkMcpAccess();
  }
  
  async loadProfile() {
    this.isLoading = true;
    
    try {
      const profile = await this.supabaseMcp.getProfile();
      
      if (profile) {
        this.profile = profile;
        this.avatarUrl = profile.avatar_url || null;
        
        this.profileForm.patchValue({
          username: profile.username || '',
          email: profile.email || '',
          website: profile.website || ''
        });
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    } finally {
      this.isLoading = false;
    }
  }
  
  async checkMcpAccess() {
    this.hasMcpAccess = await this.supabaseMcp.hasMcpAccess();
  }
  
  async updateProfile() {
    if (this.profileForm.invalid) {
      await this.supabaseMcp.createNotice('Please fill in all required fields');
      return;
    }
    
    this.isLoading = true;
    const loader = await this.supabaseMcp.createLoader('Updating profile...');
    await loader.present();
    
    try {
      const updatedProfile: Profile = {
        ...this.profile,
        username: this.profileForm.value.username,
        email: this.profileForm.value.email,
        website: this.profileForm.value.website
      };
      
      const result = await this.supabaseMcp.updateProfile(updatedProfile);
      
      if (result.success) {
        await this.supabaseMcp.createNotice('Profile updated successfully!');
        await this.loadProfile();
      } else {
        await this.supabaseMcp.createNotice(result.error || 'Failed to update profile');
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    } finally {
      this.isLoading = false;
      await loader.dismiss();
    }
  }
  
  async uploadAvatar() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl
      });
      
      if (photo.dataUrl) {
        const loader = await this.supabaseMcp.createLoader('Uploading avatar...');
        await loader.present();
        
        const file = await this.dataUrlToFile(photo.dataUrl, 'avatar.jpg');
        const filePath = `avatars/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        
        const result = await this.supabaseMcp.uploadAvatar(filePath, file);
        
        if (result.success) {
          // Update profile with new avatar URL
          const profileUpdate = await this.supabaseMcp.updateProfile({
            ...this.profile,
            avatar_url: filePath
          });
          
          if (profileUpdate.success) {
            this.avatarUrl = filePath;
            await this.supabaseMcp.createNotice('Avatar updated successfully!');
          }
        } else {
          await this.supabaseMcp.createNotice(result.error || 'Failed to upload avatar');
        }
        
        await loader.dismiss();
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    }
  }
  
  private async dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  }
  
  async signOut() {
    const loader = await this.supabaseMcp.createLoader('Signing out...');
    await loader.present();
    
    try {
      const result = await this.supabaseMcp.signOut();
      
      if (result.success) {
        this.router.navigate(['/login'], { replaceUrl: true });
      } else {
        await this.supabaseMcp.createNotice(result.error || 'Failed to sign out');
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    } finally {
      await loader.dismiss();
    }
  }
  
  async requestMcpAccess() {
    const loader = await this.supabaseMcp.createLoader('Requesting MCP access...');
    await loader.present();
    
    try {
      // In a real implementation, this would call an admin function
      const result = await this.supabaseMcp.updateProfile({
        ...this.profile,
        mcp_access: true
      });
      
      if (result.success) {
        this.hasMcpAccess = true;
        await this.supabaseMcp.createNotice('MCP access requested! Admin approval required.');
      }
    } catch (error: any) {
      await this.supabaseMcp.createNotice(error.message);
    } finally {
      await loader.dismiss();
    }
  }
}