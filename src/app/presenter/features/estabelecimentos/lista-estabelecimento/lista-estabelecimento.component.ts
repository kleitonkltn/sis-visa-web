import { Component, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';
import { Estabelecimento } from '../../../../../models/estabelecimento';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';

declare let $: any;

@Component({
  selector: 'app-lista-estabelecimento',
  templateUrl: './lista-estabelecimento.component.html',
  styleUrls: ['./lista-estabelecimento.component.css']
})
export class ListaEstabelecimentoComponent implements OnInit {
  @Input() estabelecimentos: Estabelecimento[] = [];
  @Input() est: Estabelecimento;
  loading = false;
  statusEst = false;
  textSearch = '';
  listItems = [];
  dataAtual = new Date();
  public paginaAtual = 1;

  constructor (private estabelecimentoService: EstabelecimentoService) {
  }
  subirTela () {
    window.scrollTo(0, 0);
  }

  ngOnInit () {
    this.subirTela();
    this.getListaLicenca();
  }
  getListaLicenca () {
    this.estabelecimentoService.ListarTodosEstabelecimentos()
      .subscribe((estabelecimentos: Estabelecimento[]) => {
        this.statusEst = true;
        this.estabelecimentos = estabelecimentos;
        this.initList();
      });
  }
  initList () {
    this.listItems = this.estabelecimentos;
  }
  search () {
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.filtroPesquisa();
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.id).indexOf(val.toLowerCase()) > -1 ||
          String(item.razao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.fantasia).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.endereco).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.licenca).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.bairro).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data_licenca).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.status).toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.filtroPesquisa();
    }
  }
  formatDate (data) {
    return moment(data).format('DD/MM/YYYY');
  }
  listarTudo (id) {
    this.estabelecimentoService.listarEstabelecimentoPorID(id)
      .subscribe((licencas: Estabelecimento) => {
        this.est = licencas;
      });
  }
  filtroPesquisa () {
    const filtro = $('select').val();
    if (filtro === 'todos') {
      this.initList();
    } else {
      this.listItems = this.estabelecimentos.filter((item) => {
        const dataAtual = moment(this.dataAtual);
        const dataLicenca = moment(item.data_retorno);
        const diferencaEntreDatas = dataLicenca.diff(dataAtual, 'days');
        if ((filtro === 'vencida' && !item.data_retorno) || (!item.data_licenca && filtro === 'vencida')) {
          return item;
        } else if (filtro === 'vencida') {
          if (diferencaEntreDatas < 0) {
            return item;
          }
        } else if (filtro === 'aVencer') {
          if (diferencaEntreDatas >= 0 && diferencaEntreDatas <= 31) {
            return (item);
          }
        } else if (filtro === 'licenciado') {
          if (diferencaEntreDatas > 31) {
            return (item);
          }
        }
      });
    }
  }
}
