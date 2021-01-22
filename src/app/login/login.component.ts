import { Component, OnInit } from '@angular/core';
import { AutenticarService } from '../service/autenticar.service';
import { Usuario } from './usuario';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  usuarioForm: FormGroup;
  usuario: Usuario = new Usuario();
  submitted;  loading = true;
  showLogin = false;
  constructor(public autenticar: AutenticarService, private router: Router) { }

  ngOnInit() {
    this.autenticar.checkToken().then((result) => {
      this.showLogin = this.autenticar.authenticationState['_value'];
    });
    this.createForm(new Usuario());
    this.verificar();
  }

  verificar() {
    return new Promise((resolve, reject) => {
      this.autenticar.checkToken().then((data) => {
        if (this.autenticar.authenticationState.value === true) {
          this.router.navigate(['home']);
        }
      });
    });
  }

  createForm(usuario: Usuario) {
    this.usuarioForm = new FormGroup({
      matricula: new FormControl(usuario.matricula),
      password: new FormControl(usuario.password)
    });
  }
  fazerlogin() {
    this.autenticar.login(this.usuario);
  }

}
