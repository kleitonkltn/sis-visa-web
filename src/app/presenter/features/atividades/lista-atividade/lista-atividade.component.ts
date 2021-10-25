import { Component, Input, OnInit } from '@angular/core';
import { Atividades } from '../../../../../models/atividade';
import { AtividadeService } from '../../../../services/atividade.service';

@Component({
  selector: 'app-lista-atividade',
  templateUrl: './lista-atividade.component.html',
  styleUrls: ['./lista-atividade.component.css']
})
export class ListaAtividadeComponent implements OnInit {
  @Input() atividade: Atividades[] = [];
  textSearch = ''; statusEst = false; loading = false;
  listItems = [];
  dataAtual = new Date();
  public paginaAtual = 1;

  constructor (private atividadeService: AtividadeService) {
  }
  subirTela () {
    window.scrollTo(0, 0);
  }

  ngOnInit () {
    this.subirTela();
    this.getListaLicenca();
  }
  getListaLicenca () {
    this.atividadeService.listAllAtividades()
      .subscribe((atividade: Atividades[]) => {
        this.statusEst = true;
        this.atividade = atividade;
        this.initList();
      });
  }
  initList () {
    this.listItems = this.atividade;
  }

  search () {
    if (this.textSearch.length > 0) {
      const val = this.textSearch;
      this.initList();
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.descricao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.atividade).toLowerCase().indexOf(val.toLowerCase()) > -1);
      });
    } else {
      this.initList();
    }
  }
}
