import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SupabaseMcpService } from './services/supabase-mcp.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private platform: Platform,
    private supabaseMcp: SupabaseMcpService,
    private router: Router
  ) {
    this.initializeApp();
  }

  ngOnInit() {
    this.setupAuthListener();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      console.log('✅ Platform ready');
      this.supabaseMcp.logMcpEvent('app_initialized', {
        platform: this.platform.platforms(),
        timestamp: new Date().toISOString()
      });
    });
  }

  setupAuthListener() {
    this.supabaseMcp.user$.subscribe(user => {
      if (user) {
        console.log('🔑 User authenticated:', user.email);
        this.router.navigate(['/account']);
      } else {
        console.log('🔓 No user authenticated');
        this.router.navigate(['/login']);
      }
    });
  }
}