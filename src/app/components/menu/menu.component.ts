import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../models/usuario';
import { AutenticarService } from '../../services/autenticar.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})

export class MenuComponent implements OnInit {
  showMenu = true;
  user: Usuario;
  constructor (public auth: AutenticarService) { }

  ngOnInit () {
    this.auth.checkToken().then((result) => {
      this.showMenu = this.auth.authenticationState['_value'];

      if (this.auth._user != null) {
        this.user = this.auth._user['params'];
      }
    });
  }

  toggleSidebar () {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('navbar').classList.toggle('active');
    document.getElementById('corpo').classList.toggle('active');
    document.getElementById('footer').classList.toggle('active');
  }
  logout () {
    console.log('sair');

    this.auth.logout();
  }

}
