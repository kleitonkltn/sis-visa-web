import { Component, OnInit, Input } from '@angular/core';
import { Termos } from '../../../../../models/termos';
import { Arquivos } from '../../../../../models/arquivos';
import { ActivatedRoute, Router } from '@angular/router';
import { TermoService } from '../../../../service/termo.service';
// import * as $ from 'jquery';
import { AnexoService } from '../../../../service/anexo.service';
import { EmailService } from '../../../../service/email.service';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Email } from '../../../../../models/email';
declare let $: any;
import swal from 'sweetalert2';
import { PdfService } from '../../../../service/pdf.service';

@Component({
  selector: 'app-termo',
  templateUrl: './termo.component.html',
  styleUrls: ['./termo.component.css']
})
export class TermosComponent implements OnInit {
  emailForm: FormGroup;
  termos: Termos = {} as Termos;
  public idupdate: number; statusTer = false; loadingTable = false;
  @Input() pdf; @Input() Atividade; @Input() CNAE;
  loading = true; email: Email; destinario = {} as Email;
  arquivo: Arquivos[] = []; base64textString: string[] = [];
  titulo = 'Sem Anexos Cadastrado';
  item: Arquivos; licencaValueMax;

  constructor (private route: ActivatedRoute, private termoservice: TermoService,
    private pdfService: PdfService,
    private anexoService: AnexoService, private router: Router,
    private emailservice: EmailService) {
  }
  ngOnInit () {
    this.createForm(new Email());
    this.pegaId();
  }
  createForm (email: Email) {
    this.emailForm = new FormGroup({
      destinatario: new FormControl(email.destinatario, Validators.required),
      mensagem: new FormControl(email.mensagem)
    });
  }

  async pegaId () {
    this.route.queryParams.subscribe((data) => {
      this.idupdate = data['id'];
      if (this.idupdate != null)
      {
        window.scrollTo(0, 0);
        this.termoservice.ListarTermoPorID(this.idupdate).subscribe((termos) => {
          console.log(termos);
          this.termos = termos;
          this.statusTer = true;
        }).add(() => {
          this.anexoService.listFilesByModel('termo', this.idupdate).subscribe((arq: Arquivos[]) => {
            this.arquivo = arq;
            if (this.arquivo.length > 0)
            {
              this.titulo = 'Anexos do Termo';
            }
          }, () => {
          });
        });
      }
    });


  }
  verAnexo (item) {
    this.item = item;
    if (item.type === 'pdf' || item.type === 'docx')
    {
      window.open(item.url_location);
    }
  }
  get f () { return this.termos; }

  VerificaEmail () {
    if (this.termos.email)
    {
      this.destinario.destinatario = this.termos.email;
      this.createForm(this.destinario);
    }
  }
  termoPDF () {
    this.loading = false;
    if (this.idupdate != null)
    {
      this.pdfService.downloadFileTermo(this.idupdate).subscribe(response => {
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
          console.log(errorMsg);
          alert('Falha ao gerar termo' + errorMsg);
        };

      }));
    }
  }
  EnviarEmail () {
    this.email = this.emailForm.value;
    if (this.emailForm.valid === false)
    {
      swal.fire({
        icon: 'warning',
        title: 'Campo destinatário é obrigatório',
        showConfirmButton: false,
        timer: 2000
      });
    } else
    {
      return new Promise((resolve, reject) => {
        const dataSend = {
          id: Number(this.idupdate),
          email: this.email.destinatario,
          texthtml: this.email.mensagem
        };
        this.emailservice.sendTermoByEmail(dataSend).subscribe((data) => {
          resolve(data);
          $('.modal-header .close').click();
          window.scrollTo(0, 0);
          if (data !== null && data['code'] === 'EENVELOPE')
          {
            swal.fire({
              icon: 'warning',
              title: 'Erro ao  enviar termo',
              showConfirmButton: false,
              timer: 4000
            });
          } else
          {
            swal.fire({
              icon: 'success',
              title: 'Termo enviado com Sucesso',
              showConfirmButton: false,
              timer: 4000
            });
          }
        }, (err) => {
          window.scrollTo(0, 0);
          $('.modal-header .close').click();
          swal.fire({
            icon: 'warning',
            title: 'Erro ao  enviar termo',
            showConfirmButton: false,
            timer: 4000
          });
          reject(err);
        });

      });
    }
  }
}
