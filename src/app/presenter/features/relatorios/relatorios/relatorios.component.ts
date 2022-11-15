import { Component, Input, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute } from '@angular/router'
import * as $ from 'jquery'
import swal from 'sweetalert2'
import { Arquivos } from '../../../../../models/arquivos'
import { Email } from '../../../../../models/email'
import { Relatorio } from '../../../../../models/relatorio'
import { AnexoService } from '../../../../services/anexo.service'
import { EmailService } from '../../../../services/email.service'
import { PdfService } from '../../../../services/pdf.service'
import { RelatorioService } from '../../../../services/relatorio.service'

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html'
})
export class RelatoriosComponent implements OnInit {
  emailForm!: FormGroup
  email!: Email
  public idRelatorio: any
  @Input() pdf: any
  statusRel = false;
  loadingTable = false;
  @Input() relatorio: Relatorio = {} as Relatorio;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item!: Arquivos
  loading = true;
  idEstabelecimento: any
  constructor (private route: ActivatedRoute, private relatorioService: RelatorioService,
    private anexoService: AnexoService, private pdfService: PdfService,
    private emailService: EmailService) { }

  ngOnInit () {
    this.createForm(new Email())
    this.pegaId()
  }

  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    })
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idRelatorio = queryParams.id
        if (this.idRelatorio != null) {
          window.scrollTo(0, 0)
          this.relatorioService.listRelatoriosById(this.idRelatorio).subscribe((relatorio) => {
            this.relatorio = relatorio
            this.relatorio.situacao = this.formatarSituacao(this.relatorio.situacao)
            this.relatorio.tipo_inspecao = this.formatarTipoInspecao(this.relatorio.tipo_inspecao)
            this.relatorio.irregularidades = JSON.stringify(this.relatorio.irregularidades)
            this.statusRel = true
          })
        }
      }
    )
  }
  formatarTipoInspecao (situacao: string): string {
    switch (situacao) {
      case 'inicial':
        return 'Inicial'
      case 'alteracoes':
        return 'Alterações'
      case 'sistematica':
        return 'Sistemática'
      case 'emergencial':
        return 'Emergencial'
      default:
        return ''
    }
  }
  formatarSituacao (situacao: string): string {
    switch (situacao) {
      case 'satisfatorio':
        return 'Satisfatório'
      case 'satisfatorio_restricoes':
        return 'Satisfatório com restrições'
      case 'insatisfatorio':
        return 'Insatisfatório'
      case 'insatisfatorio_interdicao_parcial':
        return 'Insatisfatório com interdição parcial'
      case 'insatisfatorio_interdicao_total':
        return 'Insatisfatório com interdição total'
      default:
        return ''
    }
  }

  pegaAnexos () {
    this.anexoService.listFilesByModel('estabelecimento', this.idEstabelecimento).subscribe((arg) => {
      if (arg.length > 0) {
        this.titulo = 'Anexos da Licença'
        this.arquivo = arg.filter((item) => {
          return (
            String(item.descricao).indexOf('Pedido:' + this.relatorio.id) > -1
          )
        })
      }
    })
  }

  verAnexo (item: Arquivos) {
    this.item = item
  }

  relatorioPdf () {
    this.loading = false
    if (this.idRelatorio != null) {
      this.pdfService.downloadFileRelatorio(this.idRelatorio).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' })
        const fileURL = URL.createObjectURL(file)
        this.loading = true
        window.open(fileURL)
      }, (async (err) => {
        const file = new Blob([err.error], { type: 'application/json' })
        const reader = new FileReader()
        reader.readAsText(file)
        reader.onloadend = () => {
          this.loading = true
          const errorMsg = String(reader.result).replace(/"|"/gi, '').replace(',', '\n')
          swal.fire({
            icon: 'warning',
            title: errorMsg,
            showConfirmButton: false,
            timer: 2000
          })
        }

      }))
    }
  }
  enviarEmail (): Promise<unknown> | undefined {
    this.email = this.emailForm.value
    if (this.emailForm.valid === false) {
      alert('Campo destinatário é obrigatório')
    } else {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idRelatorio),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        }
        this.emailService.sendRelatorioByEmail(dataSend).subscribe((data: any) => {
          resolve(data)
          $('.modal-header .close').click()
          window.scrollTo(0, 0)
          if (data !== null && data['code'] === 'EENVELOPE') {
            swal.fire({
              icon: 'error',
              title: 'Erro ao  enviar  relatório',
              showConfirmButton: false,
              timer: 2000
            })
          } else {
            swal.fire({
              icon: 'success',
              title: 'Relatório enviado com Sucesso',
              showConfirmButton: false,
              timer: 2000
            })
          }
        }, (err) => {
          window.scrollTo(0, 0)
          $('.modal-header .close').click()
          swal.fire({
            icon: 'error',
            title: 'Erro ao  enviar  relatório',
            showConfirmButton: false,
            timer: 2000
          })
          reject(err)
        })

      })
    }
  }
}
