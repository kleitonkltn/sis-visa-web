import { Component, OnInit, Input } from '@angular/core'
import { Estabelecimento } from '../../models/estabelecimento'
import { EstabelecimentoService } from '../service/estabelecimento.service'
import { Protocolo } from '../../models/protocolo'
import { DenunciaService } from '../service/denuncia.service'
import { TermoService } from '../service/termo.service'
import { LicencaService } from '../service/licenca.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @Input() protocolo: Protocolo[] = [];
  estabelecimento: Estabelecimento

  // estabelecimento: Estabelecimento = <Estabelecimento>{};
  prot: Protocolo
  public cont = 0; public denu = 0; contEst = 0; contDen = 0; contTer = 0;
  constructor (private licencaservice: LicencaService, private estbelecimentoService: EstabelecimentoService,
    private denunciaService: DenunciaService, private termoService: TermoService) { }

  ngOnInit () {
    this.subirTela()
    this.getListaLicenca()
  }

  subirTela () {
    window.scrollTo(0, 0)
  }
  getListaLicenca () {
    this.licencaservice.ListarTodosLicencas()
      .toPromise().then((licenca) => {
        this.cont = licenca.length
      }, () => {
      })

    this.estbelecimentoService.ListarTodosEstabelecimentos()
      .toPromise().then((estabelecimento) => {
        this.contEst = estabelecimento.length
      }, () => {
      })

    this.denunciaService.ListarTodasDenuncias()
      .toPromise().then((denuncias) => {
        this.contDen = denuncias.length
      }, () => {
      })

    this.termoService.ListarTodosTermos()
      .toPromise().then((termos) => {
        this.contTer = termos.length
      }, () => {
      })
  }

}

