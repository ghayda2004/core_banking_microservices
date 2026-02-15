import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule } from 'lucide-angular';
import { Send, CheckCircle, AlertCircle } from 'lucide-angular';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-slideInUp max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold gradient-text mb-3">Effectuer un virement</h1>
        <p class="text-gray-400 text-lg">Envoyez de l'argent en toute sécurité</p>
      </div>

      <!-- Success Message with animation -->
      <div *ngIf="transferSuccess" 
           class="flex items-start space-x-4 glass-card rounded-2xl p-6 border border-green-500/50 bg-green-500/10 animate-scaleIn">
        <div class="p-2 bg-green-500/20 rounded-xl">
          <i-lucide [img]="checkIcon" class="w-6 h-6 text-green-400"></i-lucide>
        </div>
        <div class="flex-1">
          <p class="font-bold text-green-400 text-lg mb-1">Virement effectué avec succès !</p>
          <p class="text-sm text-green-300">Votre virement de {{ lastTransferAmount | number:'1.2-2' }} EUR a été envoyé et sera traité sous 1-2 jours ouvrables.</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="transferError" 
           class="flex items-start space-x-4 glass-card rounded-2xl p-6 border border-red-500/50 bg-red-500/10 animate-scaleIn">
        <div class="p-2 bg-red-500/20 rounded-xl">
          <i-lucide [img]="alertIcon" class="w-6 h-6 text-red-400"></i-lucide>
        </div>
        <div class="flex-1">
          <p class="font-bold text-red-400 text-lg mb-1">Erreur lors du virement</p>
          <p class="text-sm text-red-300">{{ transferError }}</p>
        </div>
      </div>

      <!-- Transfer Form -->
      <form [formGroup]="transferForm" (ngSubmit)="onSubmit()" class="space-y-5">
        
        <!-- From Account -->
        <div class="glass-card rounded-2xl p-6 hover-lift">
          <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span class="text-blue-400">1</span>
            </div>
            <span>Compte source</span>
          </label>
          <select formControlName="fromAccount" 
                  class="input-primary">
            <option value="" disabled selected>Sélectionnez un compte</option>
            <option value="FR1420041010050500013M02606">💳 Mon compte courant - Solde: 15,420.50 TND</option>
            <option value="FR1420041010050500013M02607">💰 Mon compte épargne - Solde: 8,250.00 TND</option>
          </select>
          <p *ngIf="isFieldInvalid('fromAccount')" class="text-red-400 text-sm mt-2 flex items-center space-x-1">
            <span>⚠️</span><span>Veuillez sélectionner un compte</span>
          </p>
        </div>

        <!-- Recipient & Amount in Grid -->
        <div class="grid md:grid-cols-2 gap-5">
          <!-- Recipient IBAN -->
          <div class="glass-card rounded-2xl p-6 hover-lift">
            <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
              <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span class="text-blue-400">2</span>
              </div>
              <span>RIB bénéficiaire</span>
            </label>
            <input type="text" 
                   formControlName="toIban"
                   placeholder="TN59 1000 6035 1838 8567 1999"
                   class="input-primary">
            <p *ngIf="isFieldInvalid('toIban')" class="text-red-400 text-sm mt-2 flex items-center space-x-1">
              <span>⚠️</span><span>Format RIB invalide</span>
            </p>
          </div>

          <!-- Recipient Name -->
          <div class="glass-card rounded-2xl p-6 hover-lift">
            <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
              <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <span class="text-blue-400">3</span>
              </div>
              <span>Nom du bénéficiaire</span>
            </label>
            <input type="text" 
                   formControlName="recipientName"
                   placeholder="Prénom Nom"
                   class="input-primary">
            <p *ngIf="isFieldInvalid('recipientName')" class="text-red-400 text-sm mt-2 flex items-center space-x-1">
              <span>⚠️</span><span>Le nom est requis</span>
            </p>
          </div>
        </div>

        <!-- Amount Card with Summary -->
        <div class="glass-card rounded-2xl p-6 hover-lift border-2" 
             [ngClass]="amount > 0 ? 'border-blue-500/50' : 'border-transparent'">
          <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span class="text-blue-400">4</span>
            </div>
            <span>Montant du virement</span>
          </label>
          
          <div class="flex items-center space-x-3 mb-4">
            <input type="number" 
                   formControlName="amount"
                   placeholder="0.00"
                   step="0.01"
                   min="0.01"
                   class="input-primary flex-1 text-2xl font-bold">
            <span class="text-2xl font-bold text-gray-300">TND</span>
          </div>
          
          <div *ngIf="amount && amount > 0" class="mt-4 p-4 bg-navy-lighter/70 rounded-xl space-y-2 border border-blue-500/20 animate-scaleIn">
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Montant:</span>
              <span class="text-white font-semibold">{{ amount | number:'1.2-2' }} TND</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-400">Frais de transaction:</span>
              <span class="text-green-400 font-semibold">Gratuit ✓</span>
            </div>
            <div class="h-px bg-white/10 my-2"></div>
            <div class="flex justify-between text-lg font-bold">
              <span class="text-blue-400">Total:</span>
              <span class="text-white">{{ amount | number:'1.2-2' }} TND</span>
            </div>
          </div>
          
          <p *ngIf="isFieldInvalid('amount')" class="text-red-400 text-sm mt-2 flex items-center space-x-1">
            <span>⚠️</span><span>Montant invalide (min: 0.01 TND)</span>
          </p>
        </div>

        <!-- Description -->
        <div class="glass-card rounded-2xl p-6 hover-lift">
          <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span class="text-blue-400">5</span>
            </div>
            <span>Motif du virement (optionnel)</span>
          </label>
          <textarea formControlName="description"
                    placeholder="Ex: Remboursement loyer, Cadeau anniversaire..."
                    rows="3"
                    class="input-primary resize-none"></textarea>
          <p class="text-xs text-gray-500 mt-2">{{ transferForm.get('description')?.value?.length || 0 }}/140 caractères</p>
        </div>

        <!-- Date -->
        <div class="glass-card rounded-2xl p-6 hover-lift">
          <label class="flex items-center space-x-2 text-sm font-semibold text-gray-300 mb-4">
            <div class="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <span class="text-blue-400">6</span>
            </div>
            <span>Date d'exécution</span>
          </label>
          <input type="date" 
                 formControlName="transactionDate"
                 class="input-primary">
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col md:flex-row gap-4 pt-6">
          <button type="submit" 
                  [disabled]="!transferForm.valid || isLoading"
                  class="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 group">
            <i-lucide *ngIf="!isLoading" [img]="sendIcon" class="w-5 h-5 group-hover:translate-x-1 transition-transform"></i-lucide>
            <div *ngIf="isLoading" class="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
            <span *ngIf="!isLoading" class="font-bold">Envoyer le virement</span>
            <span *ngIf="isLoading" class="font-bold">Traitement en cours...</span>
          </button>
          <button type="button" 
                  (click)="resetForm()"
                  class="flex-1 btn-secondary">
            Annuler et réinitialiser
          </button>
        </div>
      </form>

      <!-- Security Info Section -->
      <div class="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-blue-500/20 rounded-xl">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-400 mb-3">🔒 Informations de sécurité</h3>
            <ul class="space-y-2 text-sm text-gray-300">
              <li class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">✓</span>
                <span>Toutes les transactions sont cryptées avec SSL 256-bit</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">✓</span>
                <span>Les virements nationaux sont gratuits et traités sous 1-2 jours ouvrables</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">✓</span>
                <span>Vérifiez toujours le RIB du bénéficiaire avant de confirmer</span>
              </li>
              <li class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">✓</span>
                <span>Vous recevrez une notification par SMS et email après chaque virement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
})
export class TransferComponent {
  transferForm: FormGroup;
  transferSuccess = false;
  transferError: string | null = null;
  isLoading = false;
  lastTransferAmount: number = 0;

  sendIcon = Send;
  checkIcon = CheckCircle;
  alertIcon = AlertCircle;

  constructor(private fb: FormBuilder, private accountService: AccountService) {
    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toIban: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/)]],
      recipientName: ['', [Validators.required, Validators.minLength(2)]],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.maxLength(140)],
      transactionDate: [this.getTodayDate(), Validators.required]
    });
  }

  get amount() {
    return this.transferForm.get('amount')?.value;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transferForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getTodayDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onSubmit() {
    if (this.transferForm.valid) {
      this.isLoading = true;
      this.transferError = null;
      this.transferSuccess = false;

      const formData = this.transferForm.value;
      this.lastTransferAmount = formData.amount;

      this.accountService.transferMoney(formData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.transferSuccess = true;
          this.resetForm();
          setTimeout(() => {
            this.transferSuccess = false;
          }, 5000);
        },
        error: (error) => {
          this.isLoading = false;
          this.transferError = 'Une erreur est survenue lors du virement. Veuillez réessayer.';
          console.error('Erreur lors du virement:', error);
        }
      });
    }
  }

  resetForm() {
    this.transferForm.reset({
      transactionDate: this.getTodayDate()
    });
  }
}
