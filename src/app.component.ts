import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/nav.component';
import { PlayerManagementComponent } from './components/player-management/player-management.component';
import { PlayerRegistrationComponent } from './components/player-registration/player-registration.component';
import { Auction } from './app/aution/aution';
import { AuthService } from './services/auth.service';
import { DataService } from './services/data.service';
import { User } from './models/user.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NavbarComponent, 
    PlayerManagementComponent, 
    PlayerRegistrationComponent,
    Auction
  ],
  template: `
    <div class="app-container">
      <app-navbar></app-navbar>
      <main class="main-content" [class.collapsed]="isNavCollapsed">
        
        <!-- Dashboard View (Default) -->
        <div class="dashboard-view" *ngIf="currentView === 'dashboard'">
          <div class="dashboard-header">
            <div class="header-content">
              <div class="league-logo">
                <span class="logo-icon">🏏</span>
                <span class="crown-icon">👑</span>
              </div>
              <div class="header-text">
                <h1 class="league-title">Rajput Cricket Premier League</h1>
                <p class="league-subtitle">Season 2024 • The Ultimate Cricket Championship</p>
              </div>
            </div>
            <div class="user-welcome" *ngIf="currentUser">
              <p class="welcome-text">Welcome back, <strong>{{ currentUser.name }}</strong></p>
              <p class="role-text">{{ currentUser.role | titlecase }} Dashboard</p>
            </div>
          </div>

          <div class="dashboard-grid">
            <div class="dashboard-card players">
              <div class="card-header">
                <div class="card-icon">👥</div>
                <h3>Total Players</h3>
              </div>
              <p class="stat-number">{{ totalPlayers }}</p>
              <p class="stat-subtitle">Registered for auction</p>
            </div>
            
            <div class="dashboard-card teams">
              <div class="card-header">
                <div class="card-icon">🏆</div>
                <h3>Active Teams</h3>
              </div>
              <p class="stat-number">{{ totalTeams }}</p>
              <p class="stat-subtitle">Participating franchises</p>
            </div>
            
            <div class="dashboard-card matches">
              <div class="card-header">
                <div class="card-icon">📅</div>
                <h3>Upcoming Matches</h3>
              </div>
              <p class="stat-number">{{ upcomingMatches }}</p>
              <p class="stat-subtitle">Scheduled fixtures</p>
            </div>
            
            <div class="dashboard-card auction">
              <div class="card-header">
                <div class="card-icon">💰</div>
                <h3>Auction Value</h3>
              </div>
              <p class="stat-number">₹{{ auctionValue }}Cr</p>
              <p class="stat-subtitle">Total player value</p>
            </div>
          </div>
          
          <div class="quick-actions-section">
            <h2 class="section-title">Quick Actions</h2>
            <div class="action-grid">
              <button 
                class="action-card" 
                *ngIf="currentUser?.role === 'player'"
                (click)="setView('player-registration')">
                <div class="action-icon">👤</div>
                <h3>Update Profile</h3>
                <p>Manage your player information</p>
              </button>
              
              <button 
                class="action-card" 
                *ngIf="currentUser?.role === 'admin'"
                (click)="setView('player-management')">
                <div class="action-icon">🎯</div>
                <h3>Manage Players</h3>
                <p>View and export player data</p>
              </button>
              
              <button 
                class="action-card" 
                (click)="setView('auction')">
                <div class="action-icon">💰</div>
                <h3>Auction Center</h3>
                <p>Live player auction</p>
              </button>
              
              <button class="action-card">
                <div class="action-icon">📊</div>
                <h3>Live Scores</h3>
                <p>Real-time match updates</p>
              </button>
            </div>
          </div>

          <div class="recent-activity">
            <h2 class="section-title">Recent Activity</h2>
            <div class="activity-list">
              <div class="activity-item">
                <div class="activity-icon">🏏</div>
                <div class="activity-content">
                  <p class="activity-title">New player registered</p>
                  <p class="activity-time">2 hours ago</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">💰</div>
                <div class="activity-content">
                  <p class="activity-title">Auction scheduled for tomorrow</p>
                  <p class="activity-time">5 hours ago</p>
                </div>
              </div>
              <div class="activity-item">
                <div class="activity-icon">🏆</div>
                <div class="activity-content">
                  <p class="activity-title">Match result updated</p>
                  <p class="activity-time">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Player Management View -->
        <app-player-management *ngIf="currentView === 'player-management'"></app-player-management>
        
        <!-- Player Registration View -->
        <app-player-registration *ngIf="currentView === 'player-registration'"></app-player-registration>
        
        <!-- Auction View -->
        <app-auction *ngIf="currentView === 'auction'"></app-auction>

      </main>
    </div>
  `,
  styles: [`
    .app-container {
      display: flex;
      min-height: 100vh;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    }

    .main-content {
      flex: 1;
      margin-left: 320px;
      transition: margin-left 0.4s ease;
      overflow: auto;
    }

    .main-content.collapsed {
      margin-left: 80px;
    }

    .dashboard-view {
      padding: 32px;
    }

    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      padding: 32px;
      background: linear-gradient(135deg, #DC2626 0%, #B91C1C 50%, #991B1B 100%);
      border-radius: 20px;
      box-shadow: 0 8px 24px rgba(220, 38, 38, 0.3);
      color: white;
      position: relative;
      overflow: hidden;
    }

    .dashboard-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.1) 3px, transparent 3px),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 2px, transparent 2px);
      background-size: 60px 60px, 80px 80px;
      opacity: 0.6;
      pointer-events: none;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 20px;
      position: relative;
      z-index: 2;
    }

    .league-logo {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .logo-icon {
      font-size: 64px;
      filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
      animation: logoSpin 10s linear infinite;
    }

    .crown-icon {
      position: absolute;
      top: -12px;
      right: -12px;
      font-size: 24px;
      animation: crownFloat 3s ease-in-out infinite;
      filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6));
    }

    @keyframes logoSpin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes crownFloat {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(10deg); }
    }

    .header-text {
      flex: 1;
    }

    .league-title {
      font-size: 42px;
      font-weight: 900;
      margin: 0 0 8px 0;
      text-shadow: 0 3px 6px rgba(0, 0, 0, 0.4);
      background: linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    .league-subtitle {
      font-size: 16px;
      color: rgba(255, 255, 255, 0.9);
      margin: 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .user-welcome {
      text-align: right;
      position: relative;
      z-index: 2;
    }

    .welcome-text {
      font-size: 18px;
      margin: 0 0 4px 0;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }

    .role-text {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 24px;
      margin-bottom: 40px;
    }

    .dashboard-card {
      background: white;
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
      text-align: center;
      transition: all 0.4s ease;
      border: 2px solid transparent;
      position: relative;
      overflow: hidden;
    }

    .dashboard-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #DC2626, #FFD700, #DC2626);
      transform: scaleX(0);
      transition: transform 0.3s ease;
    }

    .dashboard-card:hover::before {
      transform: scaleX(1);
    }

    .dashboard-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 16px 32px rgba(220, 38, 38, 0.15);
      border-color: rgba(220, 38, 38, 0.2);
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .card-icon {
      font-size: 48px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      transition: transform 0.3s ease;
    }

    .dashboard-card:hover .card-icon {
      transform: scale(1.1) rotate(5deg);
    }

    .dashboard-card h3 {
      color: #374151;
      font-size: 18px;
      font-weight: 700;
      margin: 0;
    }

    .stat-number {
      font-size: 48px;
      font-weight: 900;
      color: #DC2626;
      margin: 8px 0;
      text-shadow: 0 2px 4px rgba(220, 38, 38, 0.2);
    }

    .stat-subtitle {
      color: #64748b;
      font-size: 14px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .quick-actions-section, .recent-activity {
      background: white;
      padding: 32px;
      border-radius: 20px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      margin-bottom: 32px;
      border: 1px solid rgba(220, 38, 38, 0.1);
    }

    .section-title {
      color: #1e293b;
      font-size: 24px;
      font-weight: 800;
      margin: 0 0 24px 0;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .section-title::before {
      content: '';
      width: 4px;
      height: 28px;
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      border-radius: 2px;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .action-card {
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
      border: 2px solid #e2e8f0;
      border-radius: 16px;
      padding: 24px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .action-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(220, 38, 38, 0.1), transparent);
      transition: left 0.5s ease;
    }

    .action-card:hover::before {
      left: 100%;
    }

    .action-card:hover {
      transform: translateY(-4px);
      border-color: #DC2626;
      box-shadow: 0 12px 24px rgba(220, 38, 38, 0.15);
    }

    .action-icon {
      font-size: 40px;
      margin-bottom: 16px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
      transition: transform 0.3s ease;
    }

    .action-card:hover .action-icon {
      transform: scale(1.1);
    }

    .action-card h3 {
      color: #1e293b;
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 8px 0;
    }

    .action-card p {
      color: #64748b;
      font-size: 14px;
      margin: 0;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 12px;
      border-left: 4px solid #DC2626;
    }

    .activity-icon {
      font-size: 24px;
      padding: 8px;
      background: rgba(220, 38, 38, 0.1);
      border-radius: 8px;
    }

    .activity-content {
      flex: 1;
    }

    .activity-title {
      color: #1e293b;
      font-weight: 600;
      margin: 0 0 4px 0;
    }

    .activity-time {
      color: #64748b;
      font-size: 12px;
      margin: 0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .main-content {
        margin-left: 0;
      }
      
      .dashboard-header {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
      
      .league-title {
        font-size: 28px;
      }
      
      .dashboard-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
      }
      
      .action-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  currentView = 'dashboard';
  currentUser: User | null = null;
  isNavCollapsed = false;
  
  // Dashboard stats
  totalPlayers = 0;
  totalTeams = 0;
  upcomingMatches = 34;
  auctionValue = 125.5;

  constructor(
    private authService: AuthService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.dataService.players$.subscribe(players => {
      this.totalPlayers = players.length;
    });

    this.dataService.teams$.subscribe(teams => {
      this.totalTeams = teams.length;
    });
  }

  setView(view: string) {
    this.currentView = view;
  }
}