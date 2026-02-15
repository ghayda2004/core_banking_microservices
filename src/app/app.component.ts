import { Component } from '@angular/core';
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
      <app-sidebar (sidebarToggle)="onSidebarToggle($event)"></app-sidebar>

      <!-- Main Content -->
      <main class="flex-1 md:ml-64 overflow-y-auto">
        <!-- Header -->
        <header class="sticky top-0 z-40 bg-navy-light border-b border-navy-lighter">
          <div class="flex items-center justify-between px-6 py-4">
            <button (click)="toggleSidebar()" class="md:hidden text-white">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <div class="flex items-center space-x-4 ml-auto">
              <button class="relative">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                </svg>
                <span class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">3</span>
              </button>
              <div class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-semibold cursor-pointer hover:bg-blue-500 transition-colors">
                JD
              </div>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <div class="p-6 md:p-8">
          <router-outlet></router-outlet>
        </div>
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
  toggleSidebar() {
    // Emit to sidebar
  }

  onSidebarToggle(isOpen: boolean) {
    console.log('Sidebar toggled:', isOpen);
  }
}
