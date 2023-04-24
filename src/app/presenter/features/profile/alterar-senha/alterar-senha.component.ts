import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { AutenticarService } from 'src/app/services/autenticar.service'
import { UsuarioService } from 'src/app/services/usuario.service'
import { AlterarSenhaRequest } from 'src/models/alterar-senha-request'
import swal from 'sweetalert2'
import { Usuario } from '../../../../../models/usuario'

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.component.html',
  styleUrls: ['./alterar-senha.component.css']
})
export class AlterarSenhaComponent implements OnInit {

  titulo = 'Alterar Senha';
  alterarSenhaForm!: FormGroup
  loadingForm: boolean = false;
  formSubmitted: boolean = false;
  showConfirmPassword: boolean = false;
  showPassword: boolean = false;
  passwordIsValid = false;
  confirmPasswordIsValid = false;
  usuario: Usuario
  bar0: string
  bar1: string
  bar2: string
  bar3: string
  get alterarSenhaFormControl() {
    return this.alterarSenhaForm.controls
  }
  get newPassword() { return this.alterarSenhaForm.controls.newPassword }
  get confirmNewPassword() { return this.alterarSenhaForm.controls.confirmNewPassword }
  get validPassword() { return this.newPassword.invalid }
  get validConfirmPassword() { return this.confirmNewPassword.invalid }
  get isDifPasswords() {
    return (this.confirmNewPassword.value != null && this.confirmNewPassword.value.length >= 8)
      && this.confirmNewPassword.value !== this.newPassword.value
  }

  constructor(private userService: UsuarioService, private router: Router, private authService: AutenticarService,
  ) {
    this.usuario = this.authService._user['params']
  }

  ngOnInit() {
    this.createForm(new AlterarSenhaRequest())
  }

  createForm(atividades: AlterarSenhaRequest) {
    this.alterarSenhaForm = new FormGroup({
      matricula: new FormControl(atividades.matricula),
      password: new FormControl(atividades.password, Validators.required),
      newPassword: new FormControl(atividades.newPassword,
        [Validators.required, Validators.maxLength(20), Validators.minLength(8), noWhitespaceValidator]),
      confirmNewPassword: new FormControl(atividades.confirmNewPassword,
        [Validators.required, Validators.maxLength(20), Validators.minLength(8), noWhitespaceValidator])
    })
  }

  salvar() {
    this.loadingForm = true
    this.formSubmitted = true
    if (this.alterarSenhaForm.valid === false) {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios.',
        showConfirmButton: false,
        timer: 2000
      })
      this.loadingForm = false
    } else {
      this.alterarSenhaFormControl.matricula.setValue(this.usuario.matricula)

      this.userService.alterarSenha(this.alterarSenhaForm.value).subscribe((_) => {
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'success',
          title: 'Senha alterada com sucesso!',
          showConfirmButton: false,
          timer: 2000
        })
        this.loadingForm = false
        setTimeout(() => {
          this.router.navigate(['/home'])
        }, 3000)
      }, (error) => {
        window.scrollTo(0, 0)
        this.loadingForm = false
        swal.fire({
          icon: 'warning',
          title: 'Ooops! Ocorreu uma falha ao alterar senha.',
          text: error['error'].msg || '',
          showConfirmButton: false,
          timer: 2000
        })
      })
    }
  }

  passwordValid(event) {
    this.passwordIsValid = event
  }
  confirmPasswordValid(event) {
    this.confirmPasswordIsValid = event
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword
  }
  togglePassword() {
    this.showPassword = !this.showPassword
  }
}
export function noWhitespaceValidator(control: FormControl) {
  const isSpace = (control.value || '').match(/\s/g)

  return isSpace ? { whitespace: true } : null
}
