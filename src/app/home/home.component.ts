import { Component, Input, OnInit } from '@angular/core';
import { Estabelecimento } from '../../models/estabelecimento';
import { Protocolo } from '../../models/protocolo';
import { DenunciaService } from '../services/denuncia.service';
import { EstabelecimentoService } from '../services/estabelecimento.service';
import { LicencaService } from '../services/licenca.service';
import { TermoService } from '../services/termo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() protocolo: Protocolo[] = [];
  estabelecimento: Estabelecimento;

  // estabelecimento: Estabelecimento = <Estabelecimento>{};
  prot: Protocolo;
  public cont = 0; public denuncias = 0; contEst = 0; contDen = 0; contTer = 0;
  constructor (private licencaService: LicencaService, private estabelecimentoService: EstabelecimentoService,
    private denunciaService: DenunciaService, private termoService: TermoService) { }

  ngOnInit () {
    this.subirTela();
    this.getListaLicenca();
  }

  subirTela () {
    window.scrollTo(0, 0);
  }
  getListaLicenca () {
    this.licencaService.ListarTodosLicencas()
      .subscribe((licenca) => {
        this.cont = licenca.length;
      });

    this.estabelecimentoService.ListarTodosEstabelecimentos()
      .subscribe((estabelecimento) => {
        this.contEst = estabelecimento.length;
      });

    this.denunciaService.ListarTodasDenuncias()
      .subscribe((denuncias) => {
        this.contDen = denuncias.length;
      });

    this.termoService.ListarTodosTermos()
      .subscribe((termos) => {
        this.contTer = termos.length;
      });
  }

}
