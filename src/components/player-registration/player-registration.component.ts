import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-player-registration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="registration-container">
      <div class="registration-header">
        <h1 class="page-title">
          <span class="title-icon">👤</span>
          Player Registration
        </h1>
        <p class="page-subtitle">Join the Rajput Cricket Premier League</p>
      </div>

      <form (ngSubmit)="onSubmit()" #registrationForm="ngForm" class="registration-form">
        <div class="form-section">
          <h2 class="section-title">Personal Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">Full Name *</label>
              <input 
                type="text" 
                id="name"
                [(ngModel)]="playerData.name" 
                name="name"
                required
                class="form-input"
                placeholder="Enter your full name">
            </div>
            <div class="form-group">
              <label for="email">Email Address *</label>
              <input 
                type="email" 
                id="email"
                [(ngModel)]="playerData.email" 
                name="email"
                required
                class="form-input"
                placeholder="your.email@example.com">
            </div>
            <div class="form-group">
              <label for="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone"
                [(ngModel)]="playerData.phone" 
                name="phone"
                class="form-input"
                placeholder="+91 9876543210">
            </div>
            <div class="form-group">
              <label for="dob">Date of Birth</label>
              <input 
                type="date" 
                id="dob"
                [(ngModel)]="playerData.dateOfBirth" 
                name="dob"
                class="form-input">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Cricket Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="position">Playing Position *</label>
              <select 
                id="position"
                [(ngModel)]="playerData.position" 
                name="position"
                required
                class="form-select">
                <option value="">Select Position</option>
                <option value="Batsman">Batsman</option>
                <option value="Bowler">Bowler</option>
                <option value="All-rounder">All-rounder</option>
                <option value="Wicket-keeper">Wicket-keeper</option>
                <option value="Captain">Captain</option>
              </select>
            </div>
            <div class="form-group">
              <label for="battingStyle">Batting Style</label>
              <select 
                id="battingStyle"
                [(ngModel)]="playerData.battingStyle" 
                name="battingStyle"
                class="form-select">
                <option value="">Select Batting Style</option>
                <option value="Right-handed">Right-handed</option>
                <option value="Left-handed">Left-handed</option>
              </select>
            </div>
            <div class="form-group">
              <label for="bowlingStyle">Bowling Style</label>
              <select 
                id="bowlingStyle"
                [(ngModel)]="playerData.bowlingStyle" 
                name="bowlingStyle"
                class="form-select">
                <option value="">Select Bowling Style</option>
                <option value="Right-arm fast">Right-arm fast</option>
                <option value="Left-arm fast">Left-arm fast</option>
                <option value="Right-arm spin">Right-arm spin</option>
                <option value="Left-arm spin">Left-arm spin</option>
                <option value="Wicket-keeper">Wicket-keeper</option>
              </select>
            </div>
            <div class="form-group">
              <label for="experience">Experience (Years)</label>
              <input 
                type="number" 
                id="experience"
                [(ngModel)]="playerData.experience" 
                name="experience"
                min="0"
                max="30"
                class="form-input"
                placeholder="Years of cricket experience">
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2 class="section-title">Auction Information</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="basePrice">Base Price (₹) *</label>
              <select 
                id="basePrice"
                [(ngModel)]="playerData.basePrice" 
                name="basePrice"
                required
                class="form-select">
                <option value="">Select Base Price</option>
                <option [value]="100000">₹1,00,000</option>
                <option [value]="200000">₹2,00,000</option>
                <option [value]="300000">₹3,00,000</option>
                <option [value]="500000">₹5,00,000</option>
                <option [value]="750000">₹7,50,000</option>
                <option [value]="1000000">₹10,00,000</option>
                <option [value]="1500000">₹15,00,000</option>
                <option [value]="2000000">₹20,00,000</option>
              </select>
            </div>
            <div class="form-group full-width">
              <label class="checkbox-label">
                <input 
                  type="checkbox" 
                  [(ngModel)]="agreedToTerms" 
                  name="agreedToTerms"
                  required
                  class="form-checkbox">
                <span class="checkmark"></span>
                I agree to the terms and conditions of RCPL auction
              </label>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button 
            type="button" 
            class="btn secondary"
            (click)="resetForm()">
            <span class="btn-icon">🔄</span>
            Reset Form
          </button>
          <button 
            type="submit" 
            class="btn primary"
            [disabled]="!registrationForm.valid || !agreedToTerms">
            <span class="btn-icon">🏏</span>
            Register for Auction
          </button>
        </div>
      </form>

      <div class="success-message" *ngIf="showSuccess">
        <div class="success-content">
          <span class="success-icon">🎉</span>
          <h3>Registration Successful!</h3>
          <p>Welcome to Rajput Cricket Premier League. Your registration has been submitted successfully.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .registration-container {
      padding: 32px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
    }

    .registration-header {
      text-align: center;
      margin-bottom: 40px;
      padding: 32px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(220, 38, 38, 0.1);
    }

    .page-title {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      font-size: 36px;
      font-weight: 800;
      color: #1e293b;
      margin: 0 0 8px 0;
    }

    .title-icon {
      font-size: 40px;
      filter: drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3));
    }

    .page-subtitle {
      font-size: 18px;
      color: #64748b;
      margin: 0;
    }

    .registration-form {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .form-section {
      padding: 32px;
      border-bottom: 1px solid #e2e8f0;
    }

    .form-section:last-child {
      border-bottom: none;
    }

    .section-title {
      font-size: 20px;
      font-weight: 700;
      color: #DC2626;
      margin: 0 0 24px 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-title::before {
      content: '';
      width: 4px;
      height: 24px;
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      border-radius: 2px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-group.full-width {
      grid-column: 1 / -1;
    }

    .form-group label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .form-input, .form-select {
      padding: 16px;
      border: 2px solid #e2e8f0;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.3s ease;
      background: white;
    }

    .form-input:focus, .form-select:focus {
      outline: none;
      border-color: #DC2626;
      box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.1);
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      font-size: 16px;
      color: #374151;
    }

    .form-checkbox {
      width: 20px;
      height: 20px;
      accent-color: #DC2626;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      padding: 32px;
      background: #f8fafc;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px 32px;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .btn.primary {
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
      box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
    }

    .btn.primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(220, 38, 38, 0.4);
    }

    .btn.primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn.secondary {
      background: rgba(100, 116, 139, 0.1);
      color: #64748b;
      border: 2px solid #e2e8f0;
    }

    .btn.secondary:hover {
      background: #64748b;
      color: white;
      transform: translateY(-2px);
    }

    .success-message {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
      text-align: center;
      z-index: 1000;
      border: 2px solid #10B981;
    }

    .success-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
    }

    .success-icon {
      font-size: 48px;
      animation: bounce 1s ease-in-out;
    }

    .success-content h3 {
      color: #10B981;
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .success-content p {
      color: #64748b;
      margin: 0;
      max-width: 300px;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.2); }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }

      .form-actions {
        flex-direction: column;
      }
    }
  `]
})
export class PlayerRegistrationComponent {
  playerData: Partial<User> = {
    role: 'player',
    auctionStatus: 'available'
  };
  agreedToTerms = false;
  showSuccess = false;

  constructor(private dataService: DataService) {}

  onSubmit() {
    if (this.agreedToTerms) {
      this.dataService.addPlayer(this.playerData as User);
      this.showSuccess = true;
      setTimeout(() => {
        this.showSuccess = false;
        this.resetForm();
      }, 3000);
    }
  }

  resetForm() {
    this.playerData = {
      role: 'player',
      auctionStatus: 'available'
    };
    this.agreedToTerms = false;
  }
}