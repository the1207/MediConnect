
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AdminUserService } from '../../../../services/admin-user.service';
import { UserDTO } from '../../../../models/mediconnect.models';

@Component({
  selector: 'app-signup-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signup-form.component.html',
  styles: ``
})
export class SignupFormComponent {
  private adminUserService = inject(AdminUserService);
  private router = inject(Router);

  showPassword = false;
  isChecked = false;

  user: Omit<UserDTO, 'password'> & { password: string } = {
    fullName: '',
    username: '',
    password: '',
    roles: 'INFIRMIER',
    enable: true,
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignUp() {
    this.adminUserService.createUser(this.user).subscribe({
      next: () => this.router.navigate(['/signin']),
      error: (err: unknown) => console.error('Sign up failed', err)
    });
  }
}
