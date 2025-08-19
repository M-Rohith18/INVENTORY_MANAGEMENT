import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule} from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterModule,NavbarComponent,NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-project';
   currentUrl: string = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      }
    });
  }

  isAuthRoute(): boolean {
    const hiddenRoutes = ['/login', '/register'];
    return hiddenRoutes.includes(this.currentUrl);
  }
}
