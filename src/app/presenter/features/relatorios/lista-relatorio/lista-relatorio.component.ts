import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Relatorio } from '../../../../../models/relatorio';
import { RelatorioService } from '../../../../services/relatorio.service';

@Component({
  selector: 'app-lista-relatorio',
  templateUrl: './lista-relatorio.component.html',
  styleUrls: ['./lista-relatorio.component.css']
})

export class ListaRelatorioComponent implements OnInit {
  @Input() relatorios: Relatorio[] = [];
  textSearch: string = '';
  statusEst: boolean = false;
  loading: boolean = false;
  listItems: Relatorio[] = [];
  dataAtual = new Date();
  public paginaAtual = 1;

  constructor (private relatorioService: RelatorioService) { }

  subirTela () {
    window.scrollTo(0, 0);
  }

  ngOnInit () {
    this.subirTela();
    this.getListaLicenca();
  }

  getListaLicenca () {
    this.relatorioService.listAllRelatorio()
      .subscribe((relatorio: Relatorio[]) => {
        this.statusEst = true;
        this.relatorios = relatorio;
        this.relatorios.forEach(element => {
          element.situacao = this.formatarSituacao(element.situacao);
        });

        this.initList();
      });
  }

  initList () {
    this.listItems = this.relatorios;
  }

  formatarSituacao (situacao: string) {
    switch (situacao) {
      case 'satisfatorio':
        return 'Satisfatório';
      case 'satisfatorio_restricoes':
        return 'Satisfatório com restrições';
      case 'insatisfatorio':
        return 'Insatisfatório';
      case 'insatisfatorio_interdicao_parcial':
        return 'Insatisfatório com interdição parcial';
      case 'insatisfatorio_interdicao_total':
        return 'Insatisfatório com interdição total';
    }
  }

  search () {
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.initList();
      this.listItems = this.listItems.filter((item: Relatorio) => {
        return (
          String(item.razao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.cnpj).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.id).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(moment(item.data_relatorio).format('DD/MM/YYYY')).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.initList();
    }
  }
}
