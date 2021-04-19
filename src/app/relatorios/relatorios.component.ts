import { Component, OnInit, Input } from '@angular/core'
import { Relatorio } from '../../models/relatorio'
import { Arquivos } from '../../models/arquivos'
import { ActivatedRoute } from '@angular/router'
import { RelatorioService } from '../service/relatorio.service'
import { AnexoService } from '../service/anexo.service'
import { PdfService } from '../service/pdf.service'
import { FormGroup, Validators, FormControl } from '@angular/forms'
import { Email } from '../../models/email'
import { EmailService } from '../service/email.service'
import * as $ from 'jquery'

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  emailForm: FormGroup; email: Email
  public idrelatorio
  @Input() pdf; statusRel = false; loadingTable = false;
  @Input() relatorio: Relatorio = {} as Relatorio;
  arquivo: Arquivos[] = [];
  base64textString: string[] = [];
  titulo = 'Sem anexos cadastrado';
  item: Arquivos
  loading = true; id_Estabelecimento
  constructor (private route: ActivatedRoute, private relatorioService: RelatorioService,
    private anexoService: AnexoService, private pdfservice: PdfService,
    private emailservice: EmailService) { }

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
    this.route.queryParams.toPromise().then(
      queryParams => {
        this.idrelatorio = queryParams.id
        if (this.idrelatorio != null) {
          window.scrollTo(0, 0)
          this.relatorioService.listRelatorioeById(this.idrelatorio).toPromise().then((relatorio) => {
            this.relatorio = relatorio
            this.relatorio.situacao = this.formatarSituacao(this.relatorio.situacao)
            this.relatorio.tipo_inspecao = this.formatarTipoInspecao(this.relatorio.tipo_inspecao)
            this.relatorio.irregularidades = JSON.stringify(this.relatorio.irregularidades)
            this.statusRel = true
          }, () => {
          })
        }
      }
    )
  }
  formatarTipoInspecao (situacao) {
    switch (situacao) {
      case 'inicial':
        return 'Inicial'
      case 'alteracoes':
        return 'Alterações'
      case 'sistematica':
        return 'Sistemática'
      case 'emergencial':
        return 'Emergencial'
    }
  }
  formatarSituacao (situacao) {
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
    }
  }

  pegaAnexos () {
    this.anexoService.listFilesByModel('estabelecimento', this.id_Estabelecimento).toPromise().then((arg) => {
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
  verAnexo (item) {
    this.item = item
  }
  relatorioPdf () {
    this.loading = false
    if (this.idrelatorio != null) {
      this.pdfservice.downloadFileRelatorio(this.idrelatorio).toPromise().then(response => {
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
          const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n')
          alert(' \n' + errorMsg)
        }

      }))
    }
  }
  EnviarEmail () {
    this.email = this.emailForm.value
    if (this.emailForm.valid === false) {
      alert('Campo destinatário é obrigatório')
    } else {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idrelatorio),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        }
        this.emailservice.sendRelatorioByEmail(dataSend).toPromise().then((data) => {
          resolve(data)
          $('.modal-header .close').click()
          window.scrollTo(0, 0)
          if (data !== null && data['code'] === 'EENVELOPE') {
            this.mostraDialogo2('Erro ao  enviar relatório', 'danger', 5000)
          } else {
            this.mostraDialogo2('Relatório enviado com Sucesso', 'success', 5000)
          }
        }, (err) => {
          window.scrollTo(0, 0)
          $('.modal-header .close').click()
          this.mostraDialogo2('Erro ao  enviar  relatório', 'danger', 5000)
          reject(err)
        })

      })
    }
  }
  mostraDialogo2 (mensagem, tipo, tempo) {
    const cssMessage = 'position: absolute;display: block;top: 27%; left: 20%; right: 20%; width: 60%; margin-top: 15px;'
    const cssInner = 'margin: 0 auto; box-shadow: 1px 1px 5px black;'
    let dialogo = ''
    dialogo += '<div id="message" style="' + cssMessage + '">'
    dialogo += '    <div class="alert alert-' + tipo + ' alert-dismissable" style="' + cssInner + '">'
    dialogo += '    <button type="button" class="close" data-dismiss="alert" aria-label="Close">'
    dialogo += '        <span aria-hidden="true">&times;</span>'
    dialogo += '    </button>'
    dialogo += mensagem
    dialogo += '    </div>'
    dialogo += '</div>'
    $('.body').append(dialogo)
    window.setTimeout(() => {
      $('#message').fadeTo(1500, 0).slideDown(tempo, () => {
        $('.alert').hide()
      })
    }, 2000)
  }
}
