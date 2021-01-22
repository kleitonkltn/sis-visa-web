import { Component, OnInit } from '@angular/core';
import { AutenticarService } from './service/autenticar.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit{
  title = 'HOME-VISA';
  mostrarMenu = true;

  constructor(public autenticar: AutenticarService, private aroute: ActivatedRoute) {

  }

  ngOnInit() {
    this.autenticar.checkToken().then((result) => {
      this.mostrarMenu = this.autenticar.authenticationState['_value']
    })
  }

}
