import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Initialize with demo admin user
    const demoAdmin: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@rajputcricket.com',
      role: 'admin',
      registrationDate: new Date()
    };
    this.currentUserSubject.next(demoAdmin);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isPlayer(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'player';
  }

  login(email: string, password: string): Observable<User> {
    // Demo login logic
    const user: User = {
      id: email.includes('admin') ? 'admin-1' : 'player-1',
      name: email.includes('admin') ? 'Admin User' : 'Player User',
      email: email,
      role: email.includes('admin') ? 'admin' : 'player',
      registrationDate: new Date()
    };
    
    this.currentUserSubject.next(user);
    return new BehaviorSubject(user).asObservable();
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  switchToPlayer(): void {
    const playerUser: User = {
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
    };
    this.currentUserSubject.next(playerUser);
  }

  switchToAdmin(): void {
    const adminUser: User = {
      id: 'admin-1',
      name: 'Admin User',
      email: 'admin@rajputcricket.com',
      role: 'admin',
      registrationDate: new Date()
    };
    this.currentUserSubject.next(adminUser);
  }
}