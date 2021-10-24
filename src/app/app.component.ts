import { Component, OnInit } from '@angular/core';
import { AutenticarService } from './services/autenticar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  mostrarMenu = true;

  constructor (public autenticar: AutenticarService) { }

  ngOnInit () {
    this.autenticar.checkToken().then(_ => {
      this.mostrarMenu = this.autenticar.authenticationState['_value'];
    });
  }

}
