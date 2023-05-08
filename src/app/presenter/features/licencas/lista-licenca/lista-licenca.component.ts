import { Component, OnInit } from '@angular/core'
import * as moment from 'moment'
import { Estabelecimento } from '../../../../../models/estabelecimento'
import ILicenca from '../../../../../models/licencas'
import { EstabelecimentoService } from '../../../../services/estabelecimento.service'
import { LicencaService } from '../../../../services/licenca.service'
declare let $: any

@Component({
  selector: 'app-lista-licenca',
  templateUrl: './lista-licenca.component.html',
  styleUrls: ['./lista-licenca.component.css']
})
export class ListaLicencaComponent implements OnInit {
  licencas: ILicenca[] = [];
  listItems: ILicenca[];
  textSearch;
  paginaAtual = 0;
  li: ILicenca = {} as ILicenca; statusEst = false; loading = false;
  constructor(private licencaService: LicencaService) { }

  ngOnInit() {
    this.subirTela()
    this.getListaLicenca()
  }

  subirTela() {
    window.scrollTo(0, 0)
  }

  getListaLicenca() {
    this.licencaService.fetchAllLicences()
      .subscribe((licencas: ILicenca[]) => {
        this.statusEst = true
        this.licencas = licencas
        this.initList()
      })
  }

  initList() {
    this.listItems = this.licencas
  }
  search() {
    if (this.textSearch.length > 0) {
      const val = this.textSearch
      this.filtroPesquisa()
      this.listItems = this.listItems.filter((item: ILicenca) => {
        return (
          String(item.id).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.solicitado_por).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento_data.fantasia).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento_data.razao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.status_gerente).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.status_fiscal).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data_emissao).toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    } else {
      this.filtroPesquisa()
    }
  }
  formatDate(data) {
    return moment(data).format('DD/MM/YYYY')
  }
  filtroPesquisa() {
    const filtro = $('select').val()
    if (filtro === 'todos') {
      this.initList()
    } else {
      this.listItems = this.licencas.filter((item) => {
        if (filtro === 'pendente') {
          if (((item.status_fiscal === 'aguardando' && item.status_gerente === 'aguardando')
            || (item.status_fiscal === 'aguardando' && item.status_segundo_fiscal === 'aguardando')) && !(item.assinaturas_data.length >= 2 &&
              item.assinaturas_data.filter((e) => e.responsavel_data.nivel_acesso === 'gerente'
                || e.responsavel_data.nivel_acesso === 'fiscal').length >= 2)) {
            return item
          }
        } else if (filtro === 'autorizada') {
          if ((item.status_fiscal === 'autorizada' && item.status_gerente === 'autorizada')
            || (item.status_fiscal === 'autorizada' && item.status_segundo_fiscal === 'autorizada') || (item.assinaturas_data.length >= 2 &&
              item.assinaturas_data.filter((e) => e.responsavel_data.nivel_acesso === 'gerente'
                || e.responsavel_data.nivel_acesso === 'fiscal').length >= 2)) {
            return item
          }
        } else if (filtro === 'observacao') {
          if (item.status_gerente === 'observacao' || item.status_fiscal === 'observacao') {
            return item
          }
        }

      })
    }
  }

  isAprovved(licenca: ILicenca): boolean {
    return licenca.assinaturas_data.length >= 2 &&
      licenca.assinaturas_data.filter((e) => e.responsavel_data.nivel_acesso === 'gerente'
        || e.responsavel_data.nivel_acesso === 'fiscal').length >= 2

  }

}
