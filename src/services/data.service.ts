import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, Team, Match, AuctionPlayer } from '../models/user.model';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private playersSubject = new BehaviorSubject<User[]>([]);
  private teamsSubject = new BehaviorSubject<Team[]>([]);
  private matchesSubject = new BehaviorSubject<Match[]>([]);
  private auctionPlayersSubject = new BehaviorSubject<AuctionPlayer[]>([]);

  public players$ = this.playersSubject.asObservable();
  public teams$ = this.teamsSubject.asObservable();
  public matches$ = this.matchesSubject.asObservable();
  public auctionPlayers$ = this.auctionPlayersSubject.asObservable();

  constructor() {
    this.initializeDemoData();
  }

  private initializeDemoData(): void {
    // Demo players
    const demoPlayers: User[] = [
      {
        id: 'player-1',
        name: 'Virat Sharma',
        email: 'virat@rajputcricket.com',
        role: 'player',
        phone: '+91 9876543210',
        dateOfBirth: new Date('1995-08-15'),
        position: 'Batsman',
        battingStyle: 'Right-handed',
        bowlingStyle: 'Right-arm fast',
        experience: 8,
        basePrice: 500000,
        auctionStatus: 'available',
        registrationDate: new Date('2024-01-15')
      },
      {
        id: 'player-2',
        name: 'Rohit Rajput',
        email: 'rohit@rajputcricket.com',
        role: 'player',
        phone: '+91 9876543211',
        dateOfBirth: new Date('1993-04-30'),
        position: 'All-rounder',
        battingStyle: 'Right-handed',
        bowlingStyle: 'Right-arm spin',
        experience: 10,
        basePrice: 750000,
        auctionStatus: 'sold',
        teamId: 'team-1',
        soldPrice: 1200000,
        registrationDate: new Date('2024-01-10')
      },
      {
        id: 'player-3',
        name: 'Arjun Singh',
        email: 'arjun@rajputcricket.com',
        role: 'player',
        phone: '+91 9876543212',
        dateOfBirth: new Date('1997-12-22'),
        position: 'Bowler',
        battingStyle: 'Left-handed',
        bowlingStyle: 'Left-arm fast',
        experience: 5,
        basePrice: 300000,
        auctionStatus: 'available',
        registrationDate: new Date('2024-01-20')
      }
    ];

    // Demo teams
    const demoTeams: Team[] = [
      {
        id: 'team-1',
        name: 'Rajput Warriors',
        captain: 'Rohit Rajput',
        coach: 'MS Dhoni',
        homeGround: 'Rajput Stadium',
        foundedYear: 2020,
        budget: 10000000,
        remainingBudget: 8800000,
        players: [demoPlayers[1]]
      },
      {
        id: 'team-2',
        name: 'Desert Kings',
        captain: 'TBD',
        coach: 'Rahul Dravid',
        homeGround: 'Desert Arena',
        foundedYear: 2021,
        budget: 10000000,
        remainingBudget: 10000000,
        players: []
      }
    ];

    // Demo matches
    const demoMatches: Match[] = [
      {
        id: 'match-1',
        team1Id: 'team-1',
        team2Id: 'team-2',
        team1Name: 'Rajput Warriors',
        team2Name: 'Desert Kings',
        date: new Date('2024-03-15'),
        venue: 'Rajput Stadium',
        status: 'completed',
        team1Score: '185/6 (20)',
        team2Score: '178/8 (20)',
        winner: 'Rajput Warriors',
        manOfTheMatch: 'Rohit Rajput'
      }
    ];

    this.playersSubject.next(demoPlayers);
    this.teamsSubject.next(demoTeams);
    this.matchesSubject.next(demoMatches);
  }

  // Player management
  addPlayer(player: User): void {
    const players = this.playersSubject.value;
    players.push({ ...player, id: this.generateId(), registrationDate: new Date() });
    this.playersSubject.next(players);
  }

  getPlayers(): User[] {
    return this.playersSubject.value;
  }

  // Team management
  addTeam(team: Omit<Team, 'id' | 'players'>): void {
    const teams = this.teamsSubject.value;
    teams.push({ ...team, id: this.generateId(), players: [] });
    this.teamsSubject.next(teams);
  }

  getTeams(): Team[] {
    return this.teamsSubject.value;
  }

  // Match management
  addMatch(match: Omit<Match, 'id'>): void {
    const matches = this.matchesSubject.value;
    matches.push({ ...match, id: this.generateId() });
    this.matchesSubject.next(matches);
  }

  updateMatchScore(matchId: string, team1Score: string, team2Score: string, winner?: string): void {
    const matches = this.matchesSubject.value;
    const matchIndex = matches.findIndex(m => m.id === matchId);
    if (matchIndex !== -1) {
      matches[matchIndex] = {
        ...matches[matchIndex],
        team1Score,
        team2Score,
        winner,
        status: 'completed'
      };
      this.matchesSubject.next(matches);
    }
  }

  // Export functionality
  exportPlayersToExcel(): void {
    const players = this.getPlayers();
    const worksheet = XLSX.utils.json_to_sheet(players.map(player => ({
      'Name': player.name,
      'Email': player.email,
      'Phone': player.phone || 'N/A',
      'Position': player.position || 'N/A',
      'Batting Style': player.battingStyle || 'N/A',
      'Bowling Style': player.bowlingStyle || 'N/A',
      'Experience (Years)': player.experience || 0,
      'Base Price (₹)': player.basePrice || 0,
      'Auction Status': player.auctionStatus || 'N/A',
      'Registration Date': player.registrationDate.toLocaleDateString()
    })));

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Players');
    XLSX.writeFile(workbook, 'Rajput_Cricket_Players.xlsx');
  }

  exportPlayersToPDF(): void {
    const players = this.getPlayers();
    const doc = new jsPDF();
    
    // Add header
    doc.setFontSize(20);
    doc.setTextColor(220, 38, 38);
    doc.text('Rajput Cricket Premier League', 20, 20);
    doc.setFontSize(16);
    doc.text('Registered Players List', 20, 35);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45);
    
    let yPosition = 60;
    doc.setTextColor(0, 0, 0);
    
    players.forEach((player, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${player.name}`, 20, yPosition);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Email: ${player.email}`, 30, yPosition + 8);
      doc.text(`Phone: ${player.phone || 'N/A'}`, 30, yPosition + 16);
      doc.text(`Position: ${player.position || 'N/A'}`, 30, yPosition + 24);
      doc.text(`Base Price: ₹${player.basePrice?.toLocaleString() || 'N/A'}`, 30, yPosition + 32);
      
      yPosition += 45;
    });
    
    doc.save('Rajput_Cricket_Players.pdf');
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}