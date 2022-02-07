import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public countLicencas = 0;
  public countDenuncias = 0;
  public countEstabelecimentos = 0;
  public countTermos = 0;

  constructor (private utilsService: UtilsService) { }

  ngOnInit () {
    this.subirTela();
    this.initializeAllCounter();
  }

  subirTela () {
    window.scrollTo(0, 0);
  }

  initializeAllCounter () {
    this.utilsService.getInitialCounters().subscribe((values) => {
      this.countEstabelecimentos = values.estabelecimentos;
      this.countDenuncias = values.denuncias;
      this.countLicencas = values.licencas;
      this.countTermos = values.termos;
    });
  }
}
