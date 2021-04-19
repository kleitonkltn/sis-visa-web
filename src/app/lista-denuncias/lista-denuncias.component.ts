import { Component, OnInit, Input } from '@angular/core'
import * as $ from 'jquery'
import { DenunciaService } from '../service/denuncia.service'
import { Denuncias } from '../../models/denuncias'
import * as moment from 'moment'


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
    this.subirTela()
    this.getListaDenuncias()
  }
  subirTela () {
    window.scrollTo(0, 0)
  }
  search () {
    this.initList()
    if (this.textSearch.length > 0) {
      const val = this.textSearch
      this.filtroPesquisa()
      this.listItems = this.listItems.filter((item) => {
        return (
          String(item.id).indexOf(val.toLowerCase()) > -1 ||
          String(item.status).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.reclamante).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          String(item.descricao).toLowerCase().indexOf(val.toLowerCase()) > -1 ||
          this.formatDate(item.data).toLowerCase().indexOf(val.toLowerCase()) > -1
        )
      })
    } else {
      this.filtroPesquisa()
    }
  }
  formatDate (data) {
    return moment(data).format('DD/MM/YYYY')
  }

  formatarStatusDenuncia (tipoTermo) {
    switch (tipoTermo) {
      case 'notificada':
        return 'Notificada'
      case 'providenciasDiversas':
        return 'Providencia Diversas'
      case 'arquivada':
        return 'Arquivada'
      case 'aguardandoConstatacao':
        return 'Aguardando Constatação'
      case 'plubicadaEmEdital':
        return 'Plubicada em Edital'
      case 'infracionada':
        return 'Infracionada'
    }
  }


  getListaDenuncias () {
    this.denunciasService.ListarTodasDenuncias()
      .subscribe((denuncias: Denuncias[]) => {
        this.denuncias = denuncias
        this.statusEst = true
        for (let i = 0;i < this.denuncias.length;i++) {
          this.denuncias[i].status = this.formatarStatusDenuncia(this.denuncias[i].status)
        }
        this.initList()
      }, () => {
      })
  }
  initList () {
    this.listItems = this.denuncias
  }

  filtroPesquisa () {
    const filtro = $('select').val()
    if (filtro === 'Todas') {
      this.initList()
    } else {
      this.listItems = this.denuncias.filter((item) => {
        return (
          String(item.status).toLowerCase().indexOf(filtro.toLowerCase()) > -1
        )
      })
    }
  }
}
