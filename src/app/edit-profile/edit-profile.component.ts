import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-edit-profile',
  standalone: false,
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent {
  authorId!: number;
  author: any;

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const tauthorId = this.route.snapshot.paramMap.get('id')!;
    this.loadAuthorData();
  }

  // Load author data to pre-populate the form
  loadAuthorData() {
    this.authorService.getUserById(this.authorId).subscribe((data) => {
      this.author = data;
    });
  }

  // Save the updated profile data
  // onSave() {
  //   this.authorService.updateAuthor(this.author).subscribe(() => {
  //     this.router.navigate(['/admin/profile', this.authorId]); // Redirect to profile page
  //   });
  // }
}
