import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  constructor(private router: Router) {}

  onSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/upload']);
  }
}
