import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';
import * as moment from 'moment';
import { Protocolo } from '../../../../../models/protocolo';
import { PdfService } from '../../../../services/pdf.service';
import { ProtocoloService } from '../../../../services/protocolo.service';

@Component({
  selector: 'app-lista-protocolo',
  templateUrl: './lista-protocolo.component.html',
  styleUrls: ['./lista-protocolo.component.css'],
})

export class ListaProtocoloComponent implements OnInit {
  @Input() protocolos: Protocolo[] = [];
  @Input() pdf; statusEst = false; loading = false;
  public paginaAtual = 1;
  textSearch = '';
  listItems = [];
  constructor (private protocoloService: ProtocoloService, private route: ActivatedRoute, private pdfService: PdfService) { }

  ngOnInit () {
    this.subirTela();
    this.getListaProtocolo();
  }
  subirTela () {
    window.scrollTo(0, 0);
  }

  getListaProtocolo () {
    this.protocoloService.ListarTodosProtocolos()
      .subscribe((protocolo: Protocolo[]) => {
        this.statusEst = true;
        this.protocolos = protocolo;
        this.initList();
      });
  }
  initList () {
    this.listItems = this.protocolos;
  }
  search () {
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.filtroPesquisa();
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.id).indexOf(val.toLowerCase()) > -1 ||
          String(item.requerido).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.requerente).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.endereco).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.contato).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.descricao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data).toLowerCase().indexOf(val.toLowerCase()) > -1
        );
      });
    } else {
      this.filtroPesquisa();
    }
  }
  formatDate (data) {
    return moment(data).format('DD/MM/YYYY');
  }
  filtroPesquisa () {
    const filtro = $('select').val();
    if (filtro === 'todos') {
      this.initList();
    } else {
      this.listItems = this.protocolos.filter((item) => {
        return (
          String((item.requerido)).toLowerCase().indexOf(filtro.toLowerCase()) > -1);
      });
    }
  }
}
