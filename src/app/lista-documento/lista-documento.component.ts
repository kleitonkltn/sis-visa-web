import { Component, OnInit, Input } from '@angular/core'
import * as moment from 'moment'
import { Documentos } from '../../models/documento'
import { DocumentoService } from '../service/documento.service'
declare var $: any

@Component({
  selector: 'app-lista-documento',
  templateUrl: './lista-documento.component.html',
  styleUrls: ['./lista-documento.component.css']
})
export class ListaDocumentoComponent implements OnInit {
  @Input() documentos: Documentos[] = [];
  textSearch = ''; statusEst = false; loading = false;
  listItems = [];
  dataAtual = new Date();
  public paginaAtual = 1;

  constructor (private documentoService: DocumentoService) {
  }
  subirTela () {
    window.scrollTo(0, 0)
  }

  ngOnInit () {
    this.subirTela()
    this.getListaLicenca()
  }
  getListaLicenca () {
    this.documentoService.listAllDocumentos()
      .subscribe((documentos: Documentos[]) => {
        this.statusEst = true
        this.documentos = documentos
        this.initList()
      }, () => {
      })
  }
  initList () {
    this.listItems = this.documentos
  }

  search () {
    if (this.textSearch.length > 0) {
      let val = this.textSearch
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
