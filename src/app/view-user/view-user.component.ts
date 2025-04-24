import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-view-user',
  standalone: false,
  templateUrl: './view-user.component.html',
  styleUrl: './view-user.component.css',
})
export class ViewUserComponent implements OnInit {
  user: any;
  userId!: number;

  constructor(
    private userService: AuthenticationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get userId from route parameters
    this.userId = +this.route.snapshot.paramMap.get('id')!;

    // Fetch user data
    this.userService.getUserById(this.userId).subscribe((user) => {
      this.user = user;
    });
  }
}
