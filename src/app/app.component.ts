import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-screen bg-navy text-white overflow-hidden">
      <!-- Sidebar -->
      <app-sidebar #sidebar (sidebarToggle)="onSidebarToggle($event)"></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 md:ml-72 overflow-y-auto transition-all duration-300">
        <!-- Header with glassmorphism -->
        <header class="sticky top-0 z-40 glass-card backdrop-blur-xl border-b border-white/10">
          <div class="flex items-center justify-between px-6 py-4">
            <div class="flex items-center space-x-4">
              <button (click)="toggleSidebar()" 
                      class="md:hidden p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
              </button>
              <!-- Search bar -->
              <div class="hidden md:flex items-center space-x-2 bg-navy-lighter rounded-xl px-4 py-2 min-w-[300px]">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
                <input type="text" 
                       placeholder="Rechercher..." 
                       class="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full">
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- Quick actions -->
              <button class="hidden md:flex items-center space-x-2 btn-primary px-4 py-2 text-sm">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span>Nouveau virement</span>
              </button>
              
              <!-- Notifications -->
              <button class="relative p-2 hover:bg-white/10 rounded-xl transition-all group">
                <svg class="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span class="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-gradient-to-br from-red-500 to-red-600 rounded-full border-2 border-navy animate-pulse">
                  3
                </span>
              </button>
              
              <!-- User menu -->
              <div class="relative group">
                <button class="flex items-center space-x-2 hover:bg-white/10 rounded-xl p-2 transition-all">
                  <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center font-bold text-sm shadow-lg group-hover:scale-105 transition-transform">
                    JD
                  </div>
                  <div class="hidden md:block text-left">
                    <p class="text-sm font-semibold">Jean Dupont</p>
                    <p class="text-xs text-gray-400">Premium</p>
                  </div>
                  <svg class="w-4 h-4 text-gray-400 hidden md:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content with padding -->
        <div class="p-6 md:p-8 min-h-screen">
          <router-outlet></router-outlet>
        </div>
        
        <!-- Footer -->
        <footer class="border-t border-white/10 glass-card backdrop-blur-xl p-6 mt-12">
          <div class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-glow">
                <span class="text-lg font-bold">B</span>
              </div>
              <span class="text-gray-400 text-sm">© 2026 BankHub. Tous droits réservés.</span>
            </div>
            <div class="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" class="hover:text-blue-400 transition-colors">Conditions d'utilisation</a>
              <a href="#" class="hover:text-blue-400 transition-colors">Confidentialité</a>
              <a href="#" class="hover:text-blue-400 transition-colors">Support</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  toggleSidebar() {
    this.sidebar.toggleSidebar();
  }

  onSidebarToggle(isOpen: boolean) {
    console.log('Sidebar toggled:', isOpen);
  }
}
