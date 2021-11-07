import { Component, Input, OnInit } from '@angular/core';
import * as $ from 'jquery';

import * as moment from 'moment';
import { DenunciaService } from 'src/app/services/denuncia.service';
import { Denuncias } from 'src/models/denuncias';

@Component({
  selector: 'app-lista-denuncias',
  templateUrl: './lista-denuncias.component.html',
  styleUrls: ['./lista-denuncias.component.css']
})
export class ListaDenunciasComponent implements OnInit {
  @Input() denuncias: Denuncias[] = []; statusEst = false;
  public paginaAtual = 1; loading = false;
  textSearch = '';
  listItems = [];

  constructor (private denunciasService: DenunciaService) { }

  ngOnInit () {
    this.subirTela();
    this.getListaDenuncias();
  }
  subirTela () {
    window.scrollTo(0, 0);
  }
  search () {
    this.initList();
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.filtroPesquisa();
      this.listItems = this.listItems.filter((item: Denuncias) => {
        return (
          String(item.id).indexOf(val.toLowerCase()) > -1 ||
          String(item.status).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.endereco).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.bairro).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.ponto_de_referencia).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.reclamante).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.denunciado).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
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

  formatarStatusDenuncia (tipoTermo) {
    switch (tipoTermo) {
      case 'notificada':
        return 'Notificada';
      case 'providenciasDiversas':
        return 'Providencia Diversas';
      case 'arquivada':
        return 'Arquivada';
      case 'aguardandoConstatacao':
        return 'Aguardando Constatação';
      case 'publicadoEmEdital':
        return 'Publicado em Edital';
      case 'infracionada':
        return 'Infracionada';
    }
  }

  getListaDenuncias () {
    this.denunciasService.ListarTodasDenuncias()
      .subscribe((denuncias: Denuncias[]) => {
        this.denuncias = denuncias;
        this.statusEst = true;
        this.denuncias.forEach(element => {
          element.status = this.formatarStatusDenuncia(element.status);
        });

        this.initList();
      });
  }
  initList () {
    this.listItems = this.denuncias;
  }

  filtroPesquisa () {
    const filtro = $('select').val();
    if (filtro === 'Todas') {
      this.initList();
    } else {
      this.listItems = this.denuncias.filter((item) => {
        return (
          String(item.status).toLowerCase().indexOf(filtro.toLowerCase()) > -1
        );
      });
    }
  }
}
