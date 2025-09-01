export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'player';
  phone?: string;
  dateOfBirth?: Date;
  position?: string;
  battingStyle?: 'Right-handed' | 'Left-handed';
  bowlingStyle?: 'Right-arm fast' | 'Left-arm fast' | 'Right-arm spin' | 'Left-arm spin' | 'Wicket-keeper';
  experience?: number;
  basePrice?: number;
  auctionStatus?: 'available' | 'sold' | 'unsold';
  teamId?: string;
  soldPrice?: number;
  registrationDate: Date;
  profileImage?: string;
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  captain?: string;
  coach?: string;
  homeGround?: string;
  foundedYear?: number;
  budget: number;
  remainingBudget: number;
  players: User[];
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  team1Name: string;
  team2Name: string;
  date: Date;
  venue: string;
  status: 'scheduled' | 'live' | 'completed';
  team1Score?: string;
  team2Score?: string;
  winner?: string;
  manOfTheMatch?: string;
}

export interface AuctionPlayer {
  playerId: string;
  playerName: string;
  basePrice: number;
  currentBid: number;
  biddingTeams: string[];
  status: 'upcoming' | 'active' | 'sold' | 'unsold';
}