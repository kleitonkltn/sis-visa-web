import { Component, OnInit, Input } from '@angular/core'
import { Embasamentos } from '../../models/embasamentos'
import { EmbasamentoService } from '../service/embasamento.service'

@Component({
  selector: 'app-lista-embasamento',
  templateUrl: './lista-embasamento.component.html',
  styleUrls: ['./lista-embasamento.component.css']
})
export class ListaEmbasamentoComponent implements OnInit {

  @Input() embasamentos: Embasamentos[] = [];
  textSearch = ''; statusEst = false; loading = false;
  listItems = [];
  dataAtual = new Date();
  public paginaAtual = 1;

  constructor (private embasmentoService: EmbasamentoService) {
  }
  subirTela () {
    window.scrollTo(0, 0)
  }

  ngOnInit () {
    this.getListaLicenca()
  }
  getListaLicenca () {
    this.subirTela()
    this.embasmentoService.listAllEmbasamentos()
      .toPromise().then((embasamentos: Embasamentos[]) => {
        this.statusEst = true
        this.embasamentos = embasamentos
        this.initList()
      }, () => {
      })
  }
  initList () {
    this.listItems = this.embasamentos
  }
  search () {
    if (this.textSearch.length > 0) {
      const val = this.textSearch
      this.initList()
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.descricao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.descricao_completa).toLowerCase().indexOf(val.toLowerCase()) > -1)
      })
    } else {
      this.initList()
    }
  }
}
