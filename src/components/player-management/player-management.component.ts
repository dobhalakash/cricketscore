import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-player-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="player-management-container">
      <div class="header-section">
        <h1 class="page-title">
          <span class="title-icon">🎯</span>
          Player Management
        </h1>
        <div class="header-actions">
          <button class="export-btn excel" (click)="exportToExcel()">
            <span class="btn-icon">📊</span>
            Export Excel
          </button>
          <button class="export-btn pdf" (click)="exportToPDF()">
            <span class="btn-icon">📄</span>
            Export PDF
          </button>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Total Players</h3>
            <p class="stat-number">{{ players.length }}</p>
          </div>
        </div>
        <div class="stat-card available">
          <div class="stat-icon">✅</div>
          <div class="stat-content">
            <h3>Available for Auction</h3>
            <p class="stat-number">{{ getAvailablePlayers() }}</p>
          </div>
        </div>
        <div class="stat-card sold">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Sold Players</h3>
            <p class="stat-number">{{ getSoldPlayers() }}</p>
          </div>
        </div>
        <div class="stat-card value">
          <div class="stat-icon">💎</div>
          <div class="stat-content">
            <h3>Total Value</h3>
            <p class="stat-number">₹{{ getTotalValue() }}L</p>
          </div>
        </div>
      </div>

      <div class="players-section">
        <div class="section-header">
          <h2>Registered Players</h2>
          <div class="filters">
            <select [(ngModel)]="selectedFilter" (change)="applyFilter()" class="filter-select">
              <option value="all">All Players</option>
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="unsold">Unsold</option>
            </select>
            <input 
              type="text" 
              [(ngModel)]="searchTerm" 
              (input)="applyFilter()"
              placeholder="Search players..."
              class="search-input">
          </div>
        </div>

        <div class="players-grid">
          <div 
            *ngFor="let player of filteredPlayers" 
            class="player-card"
            [class]="player.auctionStatus">
            <div class="player-header">
              <div class="player-avatar">
                <span class="avatar-text">{{ getInitials(player.name) }}</span>
              </div>
              <div class="player-info">
                <h3 class="player-name">{{ player.name }}</h3>
                <p class="player-position">{{ player.position }}</p>
              </div>
              <div class="status-badge" [class]="player.auctionStatus">
                {{ player.auctionStatus | titlecase }}
              </div>
            </div>
            
            <div class="player-details">
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">{{ player.email }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Phone:</span>
                <span class="detail-value">{{ player.phone || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Experience:</span>
                <span class="detail-value">{{ player.experience || 0 }} years</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Batting:</span>
                <span class="detail-value">{{ player.battingStyle || 'N/A' }}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Bowling:</span>
                <span class="detail-value">{{ player.bowlingStyle || 'N/A' }}</span>
              </div>
            </div>

            <div class="player-pricing">
              <div class="price-info">
                <span class="price-label">Base Price:</span>
                <span class="price-value base">₹{{ (player.basePrice || 0).toLocaleString() }}</span>
              </div>
              <div class="price-info" *ngIf="player.soldPrice">
                <span class="price-label">Sold Price:</span>
                <span class="price-value sold">₹{{ player.soldPrice.toLocaleString() }}</span>
              </div>
            </div>

            <div class="player-actions">
              <button class="action-btn view" (click)="viewPlayer(player)">
                <span class="btn-icon">👁️</span>
                View Profile
              </button>
              <button class="action-btn edit" (click)="editPlayer(player)">
                <span class="btn-icon">✏️</span>
                Edit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .player-management-container {
      padding: 32px;
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      min-height: 100vh;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 32px;
      padding: 24px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(220, 38, 38, 0.1);
    }

    .page-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 32px;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .title-icon {
      font-size: 36px;
      filter: drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3));
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .export-btn.excel {
      background: linear-gradient(135deg, #10B981, #059669);
      color: white;
      box-shadow: 0 4px 8px rgba(16, 185, 129, 0.3);
    }

    .export-btn.excel:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(16, 185, 129, 0.4);
    }

    .export-btn.pdf {
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
      box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
    }

    .export-btn.pdf:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px rgba(220, 38, 38, 0.4);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      gap: 16px;
      transition: all 0.3s ease;
      border-left: 4px solid;
    }

    .stat-card.total { border-left-color: #3B82F6; }
    .stat-card.available { border-left-color: #10B981; }
    .stat-card.sold { border-left-color: #F59E0B; }
    .stat-card.value { border-left-color: #8B5CF6; }

    .stat-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    }

    .stat-icon {
      font-size: 32px;
      padding: 12px;
      border-radius: 12px;
      background: rgba(220, 38, 38, 0.1);
    }

    .stat-content h3 {
      font-size: 14px;
      color: #64748b;
      margin: 0 0 4px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 28px;
      font-weight: 800;
      color: #1e293b;
      margin: 0;
    }

    .players-section {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px;
      border-bottom: 1px solid #e2e8f0;
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      color: white;
    }

    .section-header h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }

    .filters {
      display: flex;
      gap: 12px;
    }

    .filter-select, .search-input {
      padding: 8px 12px;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.1);
      color: white;
      backdrop-filter: blur(10px);
    }

    .filter-select option {
      background: #1e293b;
      color: white;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.7);
    }

    .players-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
      padding: 24px;
    }

    .player-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      border: 2px solid transparent;
      overflow: hidden;
    }

    .player-card.available {
      border-color: #10B981;
    }

    .player-card.sold {
      border-color: #F59E0B;
    }

    .player-card.unsold {
      border-color: #EF4444;
    }

    .player-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
    }

    .player-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    }

    .player-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #DC2626, #B91C1C);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 8px rgba(220, 38, 38, 0.3);
    }

    .avatar-text {
      color: white;
      font-size: 20px;
      font-weight: 700;
    }

    .player-info {
      flex: 1;
    }

    .player-name {
      font-size: 18px;
      font-weight: 700;
      color: #1e293b;
      margin: 0 0 4px 0;
    }

    .player-position {
      color: #64748b;
      font-size: 14px;
      margin: 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .status-badge.available {
      background: #DCFCE7;
      color: #166534;
    }

    .status-badge.sold {
      background: #FEF3C7;
      color: #92400E;
    }

    .status-badge.unsold {
      background: #FEE2E2;
      color: #991B1B;
    }

    .player-details {
      padding: 20px;
    }

    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .detail-label {
      color: #64748b;
      font-weight: 500;
    }

    .detail-value {
      color: #1e293b;
      font-weight: 600;
    }

    .player-pricing {
      padding: 16px 20px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
    }

    .price-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .price-label {
      color: #64748b;
      font-weight: 500;
    }

    .price-value {
      font-weight: 700;
    }

    .price-value.base {
      color: #3B82F6;
    }

    .price-value.sold {
      color: #10B981;
    }

    .player-actions {
      display: flex;
      gap: 8px;
      padding: 16px 20px;
      background: #f1f5f9;
    }

    .action-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 14px;
    }

    .action-btn.view {
      background: #3B82F6;
      color: white;
    }

    .action-btn.view:hover {
      background: #2563EB;
      transform: translateY(-1px);
    }

    .action-btn.edit {
      background: #F59E0B;
      color: white;
    }

    .action-btn.edit:hover {
      background: #D97706;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-actions {
        justify-content: center;
      }

      .players-grid {
        grid-template-columns: 1fr;
      }

      .filters {
        flex-direction: column;
        gap: 8px;
      }
    }
  `]
})
export class PlayerManagementComponent implements OnInit {
  players: User[] = [];
  filteredPlayers: User[] = [];
  selectedFilter = 'all';
  searchTerm = '';

  constructor(
    private dataService: DataService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.dataService.players$.subscribe(players => {
      this.players = players;
      this.applyFilter();
    });
  }

  applyFilter() {
    let filtered = this.players;

    // Apply status filter
    if (this.selectedFilter !== 'all') {
      filtered = filtered.filter(player => player.auctionStatus === this.selectedFilter);
    }

    // Apply search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(player => 
        player.name.toLowerCase().includes(term) ||
        player.email.toLowerCase().includes(term) ||
        (player.position && player.position.toLowerCase().includes(term))
      );
    }

    this.filteredPlayers = filtered;
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getAvailablePlayers(): number {
    return this.players.filter(p => p.auctionStatus === 'available').length;
  }

  getSoldPlayers(): number {
    return this.players.filter(p => p.auctionStatus === 'sold').length;
  }

  getTotalValue(): string {
    const total = this.players
      .filter(p => p.soldPrice)
      .reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    return (total / 100000).toFixed(1);
  }

  exportToExcel() {
    this.dataService.exportPlayersToExcel();
  }

  exportToPDF() {
    this.dataService.exportPlayersToPDF();
  }

  viewPlayer(player: User) {
    console.log('Viewing player:', player);
    // Implement player view modal
  }

  editPlayer(player: User) {
    console.log('Editing player:', player);
    // Implement player edit modal
  }
}