
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LabelComponent } from '../../form/label/label.component';
import { CheckboxComponent } from '../../form/input/checkbox.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputFieldComponent } from '../../form/input/input-field.component';
import { AuthService } from '../../../../services/auth.service';
import { LoginRequest } from '../../../../models/auth.models';

@Component({
  selector: 'app-signin-form',
  imports: [
    LabelComponent,
    CheckboxComponent,
    ButtonComponent,
    InputFieldComponent,
    RouterModule,
    FormsModule
],
  templateUrl: './signin-form.component.html',
  styles: ``
})
export class SigninFormComponent {
  private router = inject(Router);
  private auth = inject(AuthService);

  showPassword = false;
  isChecked = false;

  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSignIn() {
    this.auth.login(this.credentials).subscribe({
      next: () => {
        const role = this.auth.role();
        if (role === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (role === 'MEDECIN') {
          this.router.navigate(['/medecin']);
        } else if (role === 'INFIRMIER') {
          this.router.navigate(['/infirmier']);
        } else {
          this.router.navigate(['/signin']);
        }
      },
      error: (err: unknown) => console.error('Login failed', err)
    });
  }
}
