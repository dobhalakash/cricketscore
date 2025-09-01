import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { User, Team, AuctionPlayer } from '../../models/user.model';

@Component({
  selector: 'app-auction',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './aution.html',
  styleUrls: ['./aution.css']
})
export class Auction implements OnInit {
  availablePlayers: User[] = [];
  soldPlayers: User[] = [];
  teams: Team[] = [];
  auctionQueue: AuctionPlayer[] = [];
  currentAuctionPlayer: AuctionPlayer | null = null;
  selectedTeam = '';
  bidAmount: number | null = null;
  auctionTimer = '02:45';

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.loadAuctionData();
    this.startTimer();
  }

  loadAuctionData() {
    this.dataService.players$.subscribe(players => {
      this.availablePlayers = players.filter(p => p.auctionStatus === 'available');
      this.soldPlayers = players.filter(p => p.auctionStatus === 'sold');
      this.setupAuctionQueue();
    });

    this.dataService.teams$.subscribe(teams => {
      this.teams = teams;
    });
  }

  setupAuctionQueue() {
    this.auctionQueue = this.availablePlayers.map(player => ({
      playerId: player.id,
      playerName: player.name,
      basePrice: player.basePrice || 100000,
      currentBid: player.basePrice || 100000,
      biddingTeams: [],
      status: 'upcoming'
    }));

    if (this.auctionQueue.length > 0) {
      this.currentAuctionPlayer = { ...this.auctionQueue[0], status: 'active' };
    }
  }

  getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  getPlayerDetails(playerId: string): string {
    const player = this.availablePlayers.find(p => p.id === playerId);
    if (!player) return '';
    return `${player.position} • ${player.battingStyle} • ${player.experience} years exp`;
  }

  getTotalSpent(): string {
    const total = this.soldPlayers.reduce((sum, p) => sum + (p.soldPrice || 0), 0);
    return (total / 100000).toFixed(1);
  }

  placeBid() {
    if (!this.selectedTeam || !this.bidAmount || !this.currentAuctionPlayer) return;
    
    this.currentAuctionPlayer.currentBid = this.bidAmount;
    if (!this.currentAuctionPlayer.biddingTeams.includes(this.selectedTeam)) {
      this.currentAuctionPlayer.biddingTeams.push(this.selectedTeam);
    }
    
    this.bidAmount = null;
    console.log('Bid placed:', this.currentAuctionPlayer);
  }

  markAsSold() {
    if (!this.currentAuctionPlayer) return;
    console.log('Player sold:', this.currentAuctionPlayer);
    this.nextPlayer();
  }

  markAsUnsold() {
    if (!this.currentAuctionPlayer) return;
    console.log('Player unsold:', this.currentAuctionPlayer);
    this.nextPlayer();
  }

  nextPlayer() {
    const currentIndex = this.auctionQueue.findIndex(p => p.playerId === this.currentAuctionPlayer?.playerId);
    if (currentIndex < this.auctionQueue.length - 1) {
      this.currentAuctionPlayer = { ...this.auctionQueue[currentIndex + 1], status: 'active' };
    } else {
      this.currentAuctionPlayer = null;
    }
  }

  selectPlayer(player: AuctionPlayer) {
    this.currentAuctionPlayer = { ...player, status: 'active' };
  }

  startTimer() {
    // Demo timer functionality
    setInterval(() => {
      // Update timer logic here
    }, 1000);
  }
}