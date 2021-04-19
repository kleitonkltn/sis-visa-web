import { Component, OnInit, Input } from '@angular/core'
import { Termos } from '../../models/termos'
import { TermoService } from '../service/termo.service'
import * as $ from 'jquery'
import * as moment from 'moment'

@Component({
  selector: 'app-lista-termo',
  templateUrl: './lista-termo.component.html',
  styleUrls: ['./lista-termo.component.css']
})
export class ListaTermoComponent implements OnInit {
  @Input() termos: Termos[] = [];
  public paginaAtual = 1; statusEst = false; loading = false;
  textSearch = '';
  listItems = [];

  constructor (private termoService: TermoService) { }

  ngOnInit () {
    this.subirTela()
    this.getListaDenuncias()
  }
  subirTela () {
    window.scrollTo(0, 0)
  }

  formatDate (data) {
    return moment(data).format('DD/MM/YYYY')
  }
  search () {
    this.initList()
    if (this.textSearch.length > 0) {
      const val = this.textSearch
      this.filtroPesquisa()
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.id).indexOf(val.toLowerCase()) > -1 ||
          String((item.tipo_termo)).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String((item.razao)).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String((item.fantasia)).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String((item.endereco)).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data).toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    } else {
      this.filtroPesquisa()
    }
  }

  getListaDenuncias () {
    this.termoService.ListarTodosTermos()
      .toPromise().then((termos: Termos[]) => {
        this.statusEst = true
        this.termos = termos
        this.initList()
      }, () => {
      })
  }
  initList () {
    this.listItems = this.termos
  }

  filtroPesquisa () {
    const filtro = $('select').val()
    if (filtro === 'Todas') {
      this.initList()
    } else {
      this.listItems = this.termos.filter((item) => {
        return (
          String(item.tipo_termo).toLowerCase() === filtro.toLowerCase()
        )
      })
    }
  }
}
