import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { Usuario } from '../../../../../models/usuario'
import { AutenticarService } from '../../../../services/autenticar.service'
import swal from 'sweetalert2'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuarioForm!: FormGroup
  showLogin = false;
  constructor (public autenticar: AutenticarService, private router: Router) { }

  get formControl () { return this.usuarioForm.controls }

  ngOnInit () {
    this.autenticar.checkToken().then((result) => {
      this.showLogin = this.autenticar.authenticationState['_value']
    })
    this.createForm(new Usuario())
    this.verificar()
  }

  verificar () {
    return new Promise((resolve, reject) => {
      this.autenticar.checkToken().then((data) => {
        if (this.autenticar.authenticationState.value === true) {
          this.router.navigate(['home'])
        }
      })
    })
  }

  createForm (usuario: Usuario) {
    this.usuarioForm = new FormGroup({
      matricula: new FormControl(usuario.matricula, [Validators.required]),
      password: new FormControl(usuario.password, [Validators.required])
    })
  }
  didTapLogin () {
    this.autenticar.login(this.usuarioForm.value)
  }

}
