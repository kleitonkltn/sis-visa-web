import { Component, OnInit } from '@angular/core';
import { LicencaService } from '../service/licenca.service';
import { Licencas } from '../licencas';
import * as moment from 'moment';
import { EstabelecimentoService } from '../service/estabelecimento.service';
import { Estabelecimento } from '../estabelecimento';
declare var $: any;

@Component({
  selector: 'app-lista-licenca',
  templateUrl: './lista-licenca.component.html',
  styleUrls: ['./lista-licenca.component.css']
})
export class ListaLicencaComponent implements OnInit {
  licencas: Licencas[] = []; listItems; textSearch; paginaAtual = 0;
  li: Licencas = {} as Licencas; statusEst = false; loading = false;
  constructor(private licencaservice: LicencaService, private estabelecimentoservice: EstabelecimentoService) { }

  ngOnInit() {
    this.subirTela();
    this.getListaLicenca();
  }

  subirTela() {
    window.scrollTo(0, 0);
  }

  getListaLicenca() {
    this.licencaservice.ListarTodosLicencas()
      .subscribe((licencas: Licencas[]) => {
        this.statusEst = true;
        this.licencas = licencas;
        this.initList();
      }, () => {
      });
  }

  initList() {
    this.listItems = this.licencas;
  }
  search() {
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.filtroPesquisa();
      this.listItems = this.listItems.filter((item: Licencas) => {
        return (
          String(item.id).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.solicitado_por).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento_data.fantasia).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.estabelecimento_data.razao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.status_gerente).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.status_fiscal).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data_emissao).toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.filtroPesquisa();
    }
  }
  formatDate(data) {
    return moment(data).format('DD/MM/YYYY');
  }
  filtroPesquisa() {
    const filtro = $('select').val();
    if (filtro === 'todos') {
      this.initList();
    } else {
      this.listItems = this.licencas.filter((item) => {
        if (filtro === 'pendente') {
          if ((item.status_fiscal == 'aguardando' && item.status_gerente == 'aguardando')
            || (item.status_fiscal == 'aguardando' && item.status_segundo_fiscal == 'aguardando')) {
            return item;
          }
        } else
          if (filtro === 'autorizada') {
            if ((item.status_fiscal == 'autorizada' && item.status_gerente == 'autorizada')
              || (item.status_fiscal == 'autorizada' && item.status_segundo_fiscal == 'autorizada')) {
              return item;
            }
          } else
              if (filtro === 'observacao') {
                if (item.status_gerente === 'observacao' || item.status_fiscal === 'observacao') {
                  return item;
                }
              }

      });
    }
  }


}
