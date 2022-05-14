import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as $ from 'jquery';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Email } from '../../../../../models/email';
import { Estabelecimento } from '../../../../../models/estabelecimento';
import { Usuario } from '../../../../../models/usuario';
import { AnexoService } from '../../../../services/anexo.service';
import { AutenticarService } from '../../../../services/autenticar.service';
import { EmailService } from '../../../../services/email.service';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';
import { PdfService } from '../../../../services/pdf.service';

@Component({
  selector: 'app-estabelecimentos',
  templateUrl: './estabelecimentos.component.html',
  styleUrls: ['./estabelecimentos.component.css']
})

export class EstabelecimentosComponent implements OnInit {
  emailForm: FormGroup;
  estabelecimentos: Estabelecimento = {} as Estabelecimento;
  public currentIdUpdate: number; usuario: Usuario; user;
  @Input() pdf; @Input() Atividade; @Input() CNAE;
  loading = true; statusEst = false; loadingTable = false; loadingEmail = true;
  arquivo: Arquivos[] = []; base64textString: string[] = [];
  titulo = 'Sem Anexos Cadastrado'; formSubmitted = false;
  item: Arquivos; licencaValueMax;
  mensagem; email: Email; destinatario = {} as Email;

  constructor (private route: ActivatedRoute, private estabelecimentosService: EstabelecimentoService,
    private pdfService: PdfService, private anexoService: AnexoService,
    private router: Router, private authService: AutenticarService,
    private emailService: EmailService) {
    this.usuario = this.authService._user['params'];
  }
  ngOnInit () {
    this.pegaId();
    this.createForm(new Email());
  }

  toggleSidebar () {
    document.getElementById('btn-principal').classList.toggle('active');
  }

  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    });
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.currentIdUpdate = queryParams.id;
        if (this.currentIdUpdate != null) {
          window.scrollTo(0, 0);
          this.estabelecimentosService.listarEstabelecimentoPorID(this.currentIdUpdate.toString()).subscribe((estabelecimentos) => {
            this.estabelecimentos = estabelecimentos;
            this.retornaCampos();
            this.statusEst = true;
          });
        }
      }
    );
    this.anexoService.listFilesByModel('estabelecimento', this.currentIdUpdate.toString())
      .subscribe((arq: Arquivos[]) => {
        this.arquivo = arq;
        if (this.arquivo.length > 0) {
          this.titulo = 'Anexos do Estabelecimento';
        }
      });
  }

  verAnexo (item) {
    this.item = item;
    if (item.type === 'pdf' || item.type === 'docx') {
      window.open(item.url_location);
    }
  }

  retornaCampos () {
    this.estabelecimentosService.ListarAtividadesPorID(this.estabelecimentos.atividade)
      .subscribe((atividade) => {
        this.Atividade = atividade;
        this.estabelecimentos.atividade = this.Atividade.atividade;
      });
    this.estabelecimentosService.listarCnaePorID(this.estabelecimentos.cnae)
      .subscribe((cnae) => {
        this.CNAE = cnae;
        this.estabelecimentos.cnae = this.CNAE.descricao;
      });

    if (Number(this.estabelecimentos.status) < 0) {
      this.estabelecimentos.status = 'Ativo';
    } else if (Number(this.estabelecimentos.status) === 1) {
      this.estabelecimentos.status = 'Documentação Pendente';
    } else {
      this.estabelecimentos.status = 'Inativo';
    }

    if (Number(this.estabelecimentos.pessoa) < 1) {
      this.estabelecimentos.pessoa = 'Pessoa Física';
    } else {
      this.estabelecimentos.pessoa = 'Pessoa Juridica';
    }
  }

  licencaPdf () {
    this.loading = false;
    if (this.currentIdUpdate != null) {
      this.pdfService.downloadFile(this.currentIdUpdate.toString()).subscribe(response => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        this.loading = true;
        window.open(fileURL);
      }, (async (err) => {
        const file = new Blob([err.error], { type: 'application/json' });
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onloadend = () => {
          this.loading = true;
          const errorMsg = reader.result.toString().replace(/"|"/gi, '').replace(',', '\n');
          swal.fire({
            icon: 'error',
            title: 'Estabelecimento Não Licenciado',
            text: errorMsg,
            showConfirmButton: false,
            timer: 2000
          });
        };
      }));
    }

  }
  get f () { return this.estabelecimentos; }

  verificaLicenca () {
    if (this.estabelecimentos.licenca !== null) {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id_est: this.estabelecimentos.id
        }
      };
      this.router.navigate(['/cadastro-licenca/'], navigationExtras);
    } else {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Estabelecimento sem número de licença',
        showConfirmButton: false,
        timer: 2000
      });
    }

  }

  verificaUser () {
    if (this.usuario.nivel_acesso === 'gerente' || this.usuario.nivel_acesso === 'fiscal') {
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id_est: this.estabelecimentos.id
        }
      };
      this.router.navigate(['/cadastro-relatorio/'], navigationExtras);
    } else {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Somente usuário Fiscal e Gerente podem gerar relatório',
        showConfirmButton: false,
        timer: 2000
      });
    }

  }
  VerificaEmail () {
    if (this.estabelecimentos.email) {
      this.destinatario.destinatario = this.estabelecimentos.email;
      this.createForm(this.destinatario);
    }
  }
  enviarEmail () {
    this.loadingEmail = false;
    this.email = this.emailForm.value;
    if (this.emailForm.valid === false) {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      });
      this.loadingEmail = true;
    } else {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.currentIdUpdate),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        };
        this.emailService.sendLicencaByEmail(dataSend).subscribe((data) => {
          resolve(data);
          $('.modal-header .close').click();
          window.scrollTo(0, 0);
          console.log(data);
          if (data !== null && data['code'] === 'EENVELOPE') {
            this.loadingEmail = true;
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar licença',
              showConfirmButton: false,
              timer: 4000
            });
          } else {
            swal.fire({
              icon: 'success',
              title: 'Licença Enviada com Sucesso',
              showConfirmButton: false,
              timer: 4000
            });
            this.loadingEmail = true;
          }
        }, (err) => {
          window.scrollTo(0, 0);
          $('.modal-header .close').click();
          this.loadingEmail = true;
          swal.fire({
            icon: 'warning',
            title: 'Erro ao  enviar licença',
            showConfirmButton: false,
            timer: 4000
          });
          reject(err);
        });

      });
    }
  }
}
