import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout(): void {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    this.router.navigate(['/logout']); // adjust route if needed
  }

}
