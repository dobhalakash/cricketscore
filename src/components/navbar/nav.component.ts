import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  adminOnly?: boolean;
  playerOnly?: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed = false;
  currentUser: User | null = null;
  
  allNavItems: NavItem[] = [
    { label: 'Dashboard', icon: '🏏', route: '/dashboard' },
    { label: 'Player Registration', icon: '👤', route: '/player-registration', playerOnly: true },
    { label: 'Team Management', icon: '👥', route: '/team-management', adminOnly: true },
    { label: 'Player Management', icon: '🎯', route: '/player-management', adminOnly: true },
    { label: 'Tournaments', icon: '🏆', route: '/tournaments', badge: 3 },
    { label: 'Auction Center', icon: '💰', route: '/auction', badge: 12 },
    { label: 'Fixtures', icon: '📅', route: '/fixtures' },
    { label: 'Live Scores', icon: '⚡', route: '/live-scores' },
    { label: 'Results & Stats', icon: '📊', route: '/results' },
    { label: 'My Profile', icon: '👨‍💼', route: '/profile', playerOnly: true },
    { label: 'Reports', icon: '📋', route: '/reports', adminOnly: true },
    { label: 'Settings', icon: '⚙️', route: '/settings', adminOnly: true }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  get navItems(): NavItem[] {
    if (!this.currentUser) return [];
    
    return this.allNavItems.filter(item => {
      if (item.adminOnly && this.currentUser?.role !== 'admin') return false;
      if (item.playerOnly && this.currentUser?.role !== 'player') return false;
      return true;
    });
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }

  onNavItemClick(item: NavItem) {
    console.log(`Navigating to: ${item.route}`);
    // Add router navigation logic here
  }

  switchRole() {
    if (this.currentUser?.role === 'admin') {
      this.authService.switchToPlayer();
    } else {
      this.authService.switchToAdmin();
    }
  }

  logout() {
    this.authService.logout();
  }
}