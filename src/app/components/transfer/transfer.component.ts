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
    <div class="space-y-6 animate-slideInUp max-w-2xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-white mb-2">Effectuer un virement</h1>
        <p class="text-gray-400">Envoyez de l'argent vers un autre compte</p>
      </div>

      <!-- Success Message -->
      <div *ngIf="transferSuccess" class="flex items-center space-x-3 bg-green-600/20 border border-green-600 rounded-xl p-4">
        <i-lucide [img]="checkIcon" class="w-5 h-5 text-green-400"></i-lucide>
        <div>
          <p class="font-semibold text-green-400">Virement effectué avec succès</p>
          <p class="text-sm text-green-300">Votre virement de {{ lastTransferAmount }} EUR a été envoyé</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="transferError" class="flex items-center space-x-3 bg-red-600/20 border border-red-600 rounded-xl p-4">
        <i-lucide [img]="alertIcon" class="w-5 h-5 text-red-400"></i-lucide>
        <div>
          <p class="font-semibold text-red-400">Erreur lors du virement</p>
          <p class="text-sm text-red-300">{{ transferError }}</p>
        </div>
      </div>

      <!-- Transfer Form -->
      <form [formGroup]="transferForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- From Account -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Compte source</label>
          <select formControlName="fromAccount" 
                  class="w-full bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
            <option value="" disabled selected>Sélectionnez un compte</option>
            <option value="FR1420041010050500013M02606">Mon compte courant (4...6)</option>
            <option value="FR1420041010050500013M02607">Mon compte épargne (4...7)</option>
          </select>
          <span *ngIf="isFieldInvalid('fromAccount')" class="text-red-400 text-sm mt-2">Veuillez sélectionner un compte</span>
        </div>

        <!-- Recipient IBAN -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">RIB du bénéficiaire</label>
          <input type="text" 
                 formControlName="toIban"
                 placeholder="FR1420041010050500013M02606"
                 class="w-full bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors">
          <span *ngIf="isFieldInvalid('toIban')" class="text-red-400 text-sm mt-2">RIB invalide (format: FR...)</span>
        </div>

        <!-- Recipient Name -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Nom du bénéficiaire</label>
          <input type="text" 
                 formControlName="recipientName"
                 placeholder="Jean Dupont"
                 class="w-full bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors">
          <span *ngIf="isFieldInvalid('recipientName')" class="text-red-400 text-sm mt-2">Le nom est requis</span>
        </div>

        <!-- Amount -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Montant</label>
          <div class="flex items-center space-x-2">
            <input type="number" 
                   formControlName="amount"
                   placeholder="1000"
                   step="0.01"
                   min="0.01"
                   class="flex-1 bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors">
            <span class="text-gray-300 font-semibold">EUR</span>
          </div>
          <div *ngIf="amount" class="mt-3 p-3 bg-navy-lighter rounded-lg">
            <p class="text-sm text-gray-400">Montant: <span class="text-white font-semibold">{{ amount | number:'1.2-2' }} EUR</span></p>
            <p class="text-sm text-gray-400 mt-1">Frais: <span class="text-white font-semibold">0,00 EUR</span></p>
            <p class="text-sm text-blue-400 mt-2">Total: <span class="font-semibold">{{ (amount | number:'1.2-2') }}</span> EUR</p>
          </div>
          <span *ngIf="isFieldInvalid('amount')" class="text-red-400 text-sm mt-2">Montant invalide</span>
        </div>

        <!-- Description -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Motif du virement</label>
          <textarea formControlName="description"
                    placeholder="Ex: Remboursement loyer..."
                    rows="3"
                    class="w-full bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"></textarea>
        </div>

        <!-- Date -->
        <div class="bg-navy-light rounded-xl p-6 border border-navy-lighter">
          <label class="block text-sm font-semibold text-gray-300 mb-3">Date du virement</label>
          <input type="date" 
                 formControlName="transactionDate"
                 class="w-full bg-navy-lighter border border-navy-lighter rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors">
        </div>

        <!-- Buttons -->
        <div class="flex flex-col md:flex-row gap-4 pt-4">
          <button type="submit" 
                  [disabled]="!transferForm.valid || isLoading"
                  class="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-xl py-3 font-semibold transition-colors">
            <i-lucide *ngIf="!isLoading" [img]="sendIcon" class="w-5 h-5"></i-lucide>
            <span *ngIf="!isLoading">Envoyer le virement</span>
            <span *ngIf="isLoading">Traitement en cours...</span>
          </button>
          <button type="button" 
                  (click)="resetForm()"
                  class="flex-1 border border-navy-lighter rounded-xl py-3 font-semibold hover:border-blue-500 transition-colors">
            Annuler
          </button>
        </div>
      </form>

      <!-- Info Section -->
      <div class="bg-blue-600/10 border border-blue-600/30 rounded-xl p-6">
        <h3 class="text-lg font-semibold text-blue-400 mb-3">Informations importantes</h3>
        <ul class="space-y-2 text-sm text-gray-300">
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-1">•</span>
            <span>Les virements sont gratuits vers les comptes en France</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-1">•</span>
            <span>Délai de traitement: 1-2 jours ouvrables</span>
          </li>
          <li class="flex items-start space-x-2">
            <span class="text-blue-400 mt-1">•</span>
            <span>Assurez-vous que le RIB est correct avant de confirmer</span>
          </li>
        </ul>
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
