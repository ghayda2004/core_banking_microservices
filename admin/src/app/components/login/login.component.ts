import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.service';
import { LucideAngularModule } from 'lucide-angular';
import { Lock, Mail, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-navy flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="text-4xl font-bold text-blue-400 mb-2">🏦</div>
          <h1 class="text-3xl font-bold text-white mb-2">Core Banking Admin</h1>
          <p class="text-gray-400">Plateforme de gestion bancaire</p>
        </div>

        <!-- Error Message -->
        <div *ngIf="error" class="flex items-center space-x-2 bg-red-600/20 border border-red-600 rounded-lg p-4 mb-6">
          <i-lucide [img]="alertIcon" class="w-5 h-5 text-red-400"></i-lucide>
          <p class="text-red-400 text-sm">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" 
              class="bg-navy-light rounded-2xl p-8 border border-navy-lighter space-y-6">
          
          <!-- Email -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">Email</label>
            <div class="relative">
              <i-lucide [img]="mailIcon" class="absolute left-3 top-3 w-5 h-5 text-gray-500"></i-lucide>
              <input type="email" 
                     formControlName="email"
                     placeholder="admin&#64;banking.com"
                     class="w-full pl-10 pr-4 py-3 bg-navy-lighter border border-navy-lighter rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors">
            </div>
            <p class="text-xs text-gray-500 mt-2">Essayez: admin&#64;banking.com</p>
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-semibold text-gray-300 mb-3">Mot de passe</label>
            <div class="relative">
              <i-lucide [img]="lockIcon" class="absolute left-3 top-3 w-5 h-5 text-gray-500"></i-lucide>
              <input type="password" 
                     formControlName="password"
                     placeholder="••••••••"
                     class="w-full pl-10 pr-4 py-3 bg-navy-lighter border border-navy-lighter rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors">
            </div>
            <p class="text-xs text-gray-500 mt-2">Essayez: admin123</p>
          </div>

          <!-- Submit Button -->
          <button type="submit" 
                  [disabled]="!loginForm.valid || isLoading"
                  class="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg py-3 font-semibold text-white transition-colors">
            {{ isLoading ? 'Connexion...' : 'Se connecter' }}
          </button>
        </form>

        <!-- Info Box -->
        <div class="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mt-6 text-xs text-gray-300">
          <p class="font-semibold text-blue-400 mb-2">Comptes de test :</p>
          <div class="space-y-1">
            <p><strong>Admin :</strong> admin&#64;banking.com / admin123</p>
            <p><strong>Client :</strong> client&#64;banking.com / client123</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-gray-500 text-sm">Core Banking Platform © 2026</p>
          <p class="text-gray-600 text-xs mt-2">Currency: TND (Dinar Tunisien)</p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  mailIcon = Mail;
  lockIcon = Lock;
  alertIcon = AlertCircle;

  constructor(
    private fb: FormBuilder,
    private adminService: AdminService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.error = null;

      const { email, password } = this.loginForm.value;
      this.adminService.login(email, password).subscribe({
        next: (response) => {
          this.adminService.setToken(response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error?.error || 'Erreur de connexion';
        }
      });
    }
  }
}
