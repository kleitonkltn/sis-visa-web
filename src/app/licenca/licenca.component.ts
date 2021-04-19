import { Component, OnInit, Input } from '@angular/core'
import { Licencas } from '../../models/licencas'
import { Arquivos } from '../../models/arquivos'
import { ActivatedRoute } from '@angular/router'
import { LicencaService } from '../service/licenca.service'
import { AnexoService } from '../service/anexo.service'
import { PdfService } from '../service/pdf.service'
import { EstabelecimentoService } from '../service/estabelecimento.service'
import swal from 'sweetalert2'


@Component({
  selector: 'app-licenca',
  templateUrl: './licenca.component.html',
  styleUrls: ['./licenca.component.css']
})
export class LicencaComponent implements OnInit {

  public idlicenca
  @Input() pdf; statusLi = false; loadingTable = false;
  @Input() licenca: Licencas = {} as Licencas;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos
  loadingPdf = true;
  loading = true; id_Estabelecimento
  dataEstabelecimento

  constructor (private route: ActivatedRoute, private licencaService: LicencaService,
    private anexoService: AnexoService, private pdfservice: PdfService, private estabelecimentoServce: EstabelecimentoService) { }

  ngOnInit () {
    this.pegaId()
  }
  licencaPdf () {
    this.loadingPdf = false
    if ((this.licenca.status_fiscal === 'autorizada' && this.licenca.status_gerente === 'autorizada') || (this.licenca.status_fiscal === 'autorizada' && this.licenca.status_segundo_fiscal === 'autorizada')) {
      if (this.licenca.estabelecimento != null) {
        this.pdfservice.downloadFile(this.licenca.estabelecimento).toPromise().then(response => {
          const file = new Blob([response], { type: 'application/pdf' })
          const fileURL = URL.createObjectURL(file)
          this.loadingPdf = true
          window.open(fileURL)
        }, (async (err) => {
          const file = new Blob([err.error], { type: 'application/json' })
          const reader = new FileReader()
          reader.readAsText(file)
          reader.onloadend = () => {
            this.loadingPdf = true
            const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n')
            alert('Estabelecimento Não Licenciado\n' + errorMsg)
          }
        }))
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Licença com Autorizações Pendente',
        showConfirmButton: false,
        timer: 2000
      })
      this.loadingPdf = true
    }


  }
  pegaId () {
    this.route.queryParams.toPromise().then(
      queryParams => {
        this.idlicenca = queryParams.id
        if (this.idlicenca != null) {
          window.scrollTo(0, 0)
          this.licencaService.ListarLicencaPorID(this.idlicenca).toPromise().then((licenca) => {
            this.licenca = licenca
            this.id_Estabelecimento = this.licenca.estabelecimento
            this.statusLi = true
            this.pegaAnexos()
            this.getDataEstabelecimentos()
          }, () => {
          })
        }
      }
    )
  }
  getDataEstabelecimentos () {
    this.estabelecimentoServce.listarEstabelecimentoPorID(this.id_Estabelecimento).toPromise().then((arg) => {
      this.dataEstabelecimento = arg
    })
  }
  pegaAnexos () {
    this.anexoService.listFilesByModel('estabelecimento', this.id_Estabelecimento).toPromise().then((arg) => {
      if (arg.length > 0) {
        this.titulo = 'Anexos da Licença'
        this.arquivo = arg.filter((item) => {
          return (
            String(item.descricao).indexOf('Pedido:' + this.licenca.id) > -1
          )
        })
      }
    })
  }
  verAnexo (item) {
    this.item = item
  }
}

