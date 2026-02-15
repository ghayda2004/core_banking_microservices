import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { Database, Lock, Users, CreditCard, ArrowRightLeft, Shield, Server, Cloud, Building2, UserCog, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-architecture',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-slideInUp">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-5xl font-bold gradient-text mb-3">Architecture Microservices</h1>
        <p class="text-gray-400 text-lg">Système bancaire distribué et modulaire</p>
      </div>

      <!-- Architecture Type Comparison -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Monolithic -->
        <div class="glass-card rounded-2xl p-6 border-2 border-red-500/30">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-3 bg-red-500/20 rounded-xl">
              <i-lucide [img]="serverIcon" class="w-6 h-6 text-red-400"></i-lucide>
            </div>
            <h3 class="text-xl font-bold text-red-400">Architecture Monolithique</h3>
          </div>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-start space-x-2">
              <span class="text-red-400 mt-1">⚠️</span>
              <span>Toutes les fonctionnalités dans une seule application</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 mt-1">⚠️</span>
              <span>Déploiement et maintenance complexes</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 mt-1">⚠️</span>
              <span>Scalabilité limitée - tout doit scaler ensemble</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-red-400 mt-1">⚠️</span>
              <span>Une panne affecte tout le système</span>
            </li>
          </ul>
        </div>

        <!-- Microservices -->
        <div class="glass-card rounded-2xl p-6 border-2 border-green-500/30">
          <div class="flex items-center space-x-3 mb-4">
            <div class="p-3 bg-green-500/20 rounded-xl">
              <i-lucide [img]="cloudIcon" class="w-6 h-6 text-green-400"></i-lucide>
            </div>
            <h3 class="text-xl font-bold text-green-400">Architecture Microservices</h3>
          </div>
          <ul class="space-y-3 text-sm text-gray-300">
            <li class="flex items-start space-x-2">
              <span class="text-green-400 mt-1">✓</span>
              <span>Services indépendants et autonomes</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-green-400 mt-1">✓</span>
              <span>Déploiement et mise à jour indépendants</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-green-400 mt-1">✓</span>
              <span>Scalabilité granulaire par service</span>
            </li>
            <li class="flex items-start space-x-2">
              <span class="text-green-400 mt-1">✓</span>
              <span>Isolation des pannes - résilience accrue</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Architecture Diagram -->
      <div class="glass-card rounded-2xl p-8">
        <h2 class="text-2xl font-bold mb-6 flex items-center space-x-3">
          <div class="p-2 bg-blue-500/20 rounded-xl">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
          </div>
          <span>Schéma d'Architecture Microservices Bancaire</span>
        </h2>

        <!-- Architecture Layers -->
        <div class="space-y-6">
          
          <!-- Layer 1: API Gateway -->
          <div class="text-center">
            <div class="inline-block glass-card rounded-2xl p-6 border-2 border-purple-500/50 hover-lift">
              <div class="flex items-center space-x-4">
                <div class="p-4 bg-purple-500/20 rounded-xl">
                  <svg class="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <h3 class="text-xl font-bold text-purple-400">API Gateway</h3>
                  <p class="text-sm text-gray-400">Point d'entrée unique - Routage & Authentification</p>
                  <div class="mt-2">
                    <span class="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs font-mono rounded-full border border-purple-500/30">localhost:8080</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Arrow Down -->
          <div class="flex justify-center">
            <svg class="w-8 h-8 text-blue-400 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>

          <!-- Layer 2: Microservices Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <!-- Service 1: IAM Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-blue-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-blue-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="shieldIcon" class="w-8 h-8 text-blue-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-blue-400 mb-1">1. IAM Service</h4>
                  <p class="text-xs text-gray-400">Identity & Access Management</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs font-mono rounded border border-blue-500/30">:3001</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB IAM</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service 2: Organization & User Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-green-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-green-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="buildingIcon" class="w-8 h-8 text-green-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-green-400 mb-1">2. Organization & User Service</h4>
                  <p class="text-xs text-gray-400">Gestion organisations</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-green-500/20 text-green-300 text-xs font-mono rounded border border-green-500/30">:3002</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Org</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service 3: Customer Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-yellow-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-yellow-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="usersIcon" class="w-8 h-8 text-yellow-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-yellow-400 mb-1">3. Customer Service</h4>
                  <p class="text-xs text-gray-400">Profils clients & KYC</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-yellow-500/20 text-yellow-300 text-xs font-mono rounded border border-yellow-500/30">:3003</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Customers</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service 4: Account & Card Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-purple-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-purple-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="creditCardIcon" class="w-8 h-8 text-purple-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-purple-400 mb-1">4. Account & Card Service</h4>
                  <p class="text-xs text-gray-400">Comptes & Cartes bancaires</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-xs font-mono rounded border border-purple-500/30">:3004</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Accounts</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Additional Services Row -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <!-- Service 5: Transaction Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-teal-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-teal-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="transactionIcon" class="w-8 h-8 text-teal-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-teal-400 mb-1">5. Transaction Service</h4>
                  <p class="text-xs text-gray-400">Virements & paiements</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-teal-500/20 text-teal-300 text-xs font-mono rounded border border-teal-500/30">:3005</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Transactions</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service 6: Credit Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-orange-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-orange-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="userCogIcon" class="w-8 h-8 text-orange-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-orange-400 mb-1">6. Credit Service</h4>
                  <p class="text-xs text-gray-400">Prêts & scoring crédit</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-orange-500/20 text-orange-300 text-xs font-mono rounded border border-orange-500/30">:3006</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Credit</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Service 7: Compliance & Communication Service -->
            <div class="glass-card rounded-xl p-5 hover-lift border border-pink-500/30 group">
              <div class="flex flex-col items-center text-center space-y-3">
                <div class="p-3 bg-pink-500/20 rounded-xl group-hover:scale-110 transition-transform">
                  <i-lucide [img]="messageIcon" class="w-8 h-8 text-pink-400"></i-lucide>
                </div>
                <div>
                  <h4 class="font-bold text-pink-400 mb-1">7. Compliance & Communication</h4>
                  <p class="text-xs text-gray-400">Conformité & Notifications</p>
                  <div class="mt-2">
                    <span class="px-2 py-0.5 bg-pink-500/20 text-pink-300 text-xs font-mono rounded border border-pink-500/30">:3007</span>
                  </div>
                </div>
                <div class="w-full border-t border-gray-700 pt-2">
                  <div class="text-xs text-gray-500 mb-1">📦 Backend séparé</div>
                  <div class="flex items-center justify-center space-x-1 text-xs">
                    <i-lucide [img]="databaseIcon" class="w-4 h-4 text-gray-500"></i-lucide>
                    <span class="text-gray-500">DB Compliance</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- Architecture Explanation -->
      <div class="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-cyan-500/5">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-cyan-500/20 rounded-xl flex-shrink-0">
            <svg class="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-cyan-400 mb-3">🔑 Point clé : Backends complètement séparés</h3>
            <div class="space-y-3 text-sm text-gray-300">
              <div class="flex items-start space-x-2">
                <span class="text-cyan-400 mt-0.5 font-bold">→</span>
                <span><strong class="text-white">Chaque microservice = 1 API indépendante</strong> avec son propre port (:3001, :3002, etc.)</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-cyan-400 mt-0.5 font-bold">→</span>
                <span><strong class="text-white">Base de données dédiée :</strong> Pas de partage de BD entre services - isolation totale des données</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-cyan-400 mt-0.5 font-bold">→</span>
                <span><strong class="text-white">Déploiement autonome :</strong> Chaque service peut être déployé, mis à jour ou redémarré sans affecter les autres</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-cyan-400 mt-0.5 font-bold">→</span>
                <span><strong class="text-white">Technologies différentes :</strong> Service IAM en Node.js, Transactions en Java, Analytics en Python - totalement possible !</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-cyan-400 mt-0.5 font-bold">→</span>
                <span><strong class="text-white">Communication via API Gateway :</strong> Les clients ne voient qu'une seule entrée (port 8080) qui route vers le bon service</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Key Benefits -->
      <div class="grid md:grid-cols-3 gap-4">
        <div class="glass-card rounded-xl p-6 hover-lift">
          <div class="flex items-start space-x-3">
            <div class="p-2 bg-green-500/20 rounded-lg">
              <svg class="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-2">Scalabilité Flexible</h4>
              <p class="text-sm text-gray-400">Chaque service peut scaler indépendamment selon la charge</p>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 hover-lift">
          <div class="flex items-start space-x-3">
            <div class="p-2 bg-blue-500/20 rounded-lg">
              <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-2">Déploiement Rapide</h4>
              <p class="text-sm text-gray-400">Mise à jour d'un service sans affecter les autres</p>
            </div>
          </div>
        </div>

        <div class="glass-card rounded-xl p-6 hover-lift">
          <div class="flex items-start space-x-3">
            <div class="p-2 bg-purple-500/20 rounded-lg">
              <svg class="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h4 class="font-bold text-white mb-2">Isolation & Résilience</h4>
              <p class="text-sm text-gray-400">Une panne n'affecte qu'un seul service, pas tout le système</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Communication Flow Example -->
      <div class="glass-card rounded-2xl p-6 border border-yellow-500/30 bg-yellow-500/5">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-yellow-400 flex items-center space-x-2">
            <span>💡</span>
            <span>Exemple de flux : Effectuer un virement</span>
          </h3>
        </div>
        <div class="bg-black/30 rounded-xl p-4 font-mono text-sm space-y-2">
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">1.</span>
            <span class="text-gray-400">Client (Frontend) →</span>
            <span class="text-purple-400">POST /api/transfer</span>
            <span class="text-gray-500">→ API Gateway (:8080)</span>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-gray-500">↓</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">2.</span>
            <span class="text-gray-400">API Gateway vérifie auth →</span>
            <span class="text-blue-400">IAM Service (:3001)</span>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-gray-500">↓</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">3.</span>
            <span class="text-gray-400">Route la requête →</span>
            <span class="text-teal-400">Transaction Service (:3005)</span>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-gray-500">↓</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">4.</span>
            <span class="text-gray-400">Service Transaction appelle →</span>
            <span class="text-purple-400">Account Service (:3004)</span>
            <span class="text-gray-500">(vérifier solde)</span>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-gray-500">↓</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">5.</span>
            <span class="text-gray-400">Si OK, notifie →</span>
            <span class="text-pink-400">Compliance Service (:3007)</span>
            <span class="text-gray-500">(envoi email)</span>
          </div>
          <div class="flex items-center space-x-3 ml-4">
            <span class="text-gray-500">↓</span>
          </div>
          <div class="flex items-center space-x-3">
            <span class="text-gray-500">6.</span>
            <span class="text-green-400">✓ Réponse au client</span>
          </div>
        </div>
        <div class="mt-4 text-xs text-gray-400 italic">
          Chaque service communique de manière indépendante via REST API ou message queues (RabbitMQ/Kafka)
        </div>
      </div>

      <!-- Migration Strategy -->
      <div class="glass-card rounded-2xl p-6 border border-blue-500/30 bg-blue-500/5">
        <div class="flex items-start space-x-4">
          <div class="p-3 bg-blue-500/20 rounded-xl">
            <svg class="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold text-blue-400 mb-3">🌍 Solutions Bancaires Internationales</h3>
            <p class="text-gray-300 mb-4">
              Les banques digitales et néo-banques ont déjà migré vers des architectures microservices pour bénéficier d'une agilité et d'une scalabilité maximales.
            </p>
            <div class="space-y-2 text-sm text-gray-300">
              <div class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">→</span>
                <span><strong>Migration progressive :</strong> Décomposition du monolithe en services indépendants</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">→</span>
                <span><strong>Approche Strangler Fig :</strong> Remplacer progressivement chaque module</span>
              </div>
              <div class="flex items-start space-x-2">
                <span class="text-blue-400 mt-0.5">→</span>
                <span><strong>DevOps & CI/CD :</strong> Automatisation complète du déploiement</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `
})
export class ArchitectureComponent {
  databaseIcon = Database;
  lockIcon = Lock;
  usersIcon = Users;
  creditCardIcon = CreditCard;
  transactionIcon = ArrowRightLeft;
  shieldIcon = Shield;
  serverIcon = Server;
  cloudIcon = Cloud;
  buildingIcon = Building2;
  userCogIcon = UserCog;
  messageIcon = MessageSquare;
}
