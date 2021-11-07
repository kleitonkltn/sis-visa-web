import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Estabelecimento } from '../../../../../models/estabelecimento';
import { AnexoService } from '../../../../services/anexo.service';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';

declare let $: any;
@Component({
  selector: 'app-cadastro-estabelecimento',
  templateUrl: './cadastro-estabelecimento.component.html',
  styleUrls: ['./cadastro-estabelecimento.component.css']
})

export class CadastroEstabelecimentoComponent implements OnInit {
  estabelecimentoForm: FormGroup;

  estabelecimento: Estabelecimento;
  titulo = 'Cadastrar Estabelecimento';
  @Input() CNAE;
  @Input() Atividade;
  anexo: Arquivos; indice; item: Arquivos; itemCarregado = {} as Arquivos;
  base64textString = []; descricao = []; arq = []; nomeArquivo = [];
  arquivos: Arquivos = {} as Arquivos; listaArq: Arquivos[] = [];
  loading: boolean[] = []; loadingRemove: boolean[] = []; loadingNuvem = true; loadingCadastro = true;
  status = 'abrir'; index = 0; textSearch;
  formSubmitted = false; licencaValueMax;

  public celular = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public telefone = ['(', /[1-9]/, /\d/, ')', ' ', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public cep = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  public currentIdUpdate: number;

  constructor (private route: ActivatedRoute, private estabelecimentoService: EstabelecimentoService,
    private anexoService: AnexoService, private router: Router) {
  }

  ngOnInit () {
    this.createForm(new Estabelecimento());
    this.pegaId();
    this.retornaCnae();
    this.retornaAtividade();
  }

  createForm (estabelecimento: Estabelecimento) {
    this.estabelecimentoForm = new FormGroup({
      id: new FormControl(estabelecimento.id),
      atividade: new FormControl(estabelecimento.atividade, Validators.required),
      bairro: new FormControl(estabelecimento.bairro, Validators.required),
      celular: new FormControl(estabelecimento.celular),
      insc: new FormControl(estabelecimento.insc),
      cnae: new FormControl(estabelecimento.cnae, Validators.required),
      licenca: new FormControl(estabelecimento.licenca),
      fantasia: new FormControl(estabelecimento.fantasia, Validators.required),
      pessoa: new FormControl(estabelecimento.pessoa, Validators.required),
      cep: new FormControl(estabelecimento.cep),
      razao: new FormControl(estabelecimento.razao, Validators.required),
      endereco: new FormControl(estabelecimento.endereco, Validators.required),
      status: new FormControl(estabelecimento.status, Validators.required),
      cnpj: new FormControl(estabelecimento.cnpj, Validators.required),
      obs: new FormControl(estabelecimento.obs),
      obs_licenca: new FormControl(estabelecimento.obs_licenca),
      pref: new FormControl(estabelecimento.pref),
      telefone: new FormControl(estabelecimento.telefone),
      ieourg: new FormControl(estabelecimento.ieourg),
      data_inspecao: new FormControl(estabelecimento.data_inspecao),
      data_retorno: new FormControl(estabelecimento.data_retorno),
      data_licenca: new FormControl(estabelecimento.data_licenca),
      email: new FormControl(estabelecimento.email)

    });
  }
  salvar () {
    this.loadingCadastro = false;
    if (this.estabelecimentoForm.valid === false) {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else {
      this.estabelecimentoService.cadastrarEstabelecimento(this.estabelecimentoForm.value).subscribe((data: Estabelecimento) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Estabelecimento cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: data.id
          }
        };
        setTimeout(() => {
          this.router.navigate(['/estabelecimento/'], navigationExtras);
        }, 3000);
      }, (error) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'warning',
          title: 'Falha ao cadastrar estabelecimento',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  atualizar () {
    this.loadingCadastro = false;
    if (this.estabelecimentoForm.valid === false) {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else {
      this.estabelecimentoService.atualizarEstabelecimento(this.estabelecimentoForm.value,
        this.currentIdUpdate.toString()).subscribe(() => {
          this.loadingCadastro = true;
          window.scrollTo(0, 0);
          swal.fire({
            icon: 'success',
            title: 'Estabelecimento atualizado com sucesso',
            showConfirmButton: false,
            timer: 2000
          });
          const navigationExtras: NavigationExtras = {
            queryParams: {
              id: this.currentIdUpdate
            }
          };
          setTimeout(() => {
            this.router.navigate(['/estabelecimento/'], navigationExtras);
          }, 3000);
        }, (error) => {
          this.loadingCadastro = true;
          window.scrollTo(0, 0);
          swal.fire({
            icon: 'warning',
            title: 'Falha na atualização do estabelecimento',
            showConfirmButton: false,
            timer: 2000
          });
        });
    }
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.currentIdUpdate = queryParams.id;
        if (this.currentIdUpdate != null) {
          window.scrollTo(0, 0);
          this.titulo = 'Atualizar Estabelecimento';
          this.estabelecimentoService.listarEstabelecimentoPorID(this.currentIdUpdate.toString()).subscribe((estabelecimentos) => {
            this.estabelecimento = estabelecimentos;
            estabelecimentos.status = '' + estabelecimentos.status;
            this.createForm(this.estabelecimento);
            this.formatWithCNPJorCPF();
            this.estabelecimentoForm.value.cnpj = estabelecimentos.cnpj;
          });
        } else {
          window.scrollTo(0, 0);
          this.titulo = 'Cadastrar Estabelecimento';
          this.createForm(new Estabelecimento());
        }
      }
    );
  }

  retornaCnae () {
    this.estabelecimentoService.listarTodosCnae()
      .subscribe((cnae) => {
        this.CNAE = cnae;
      });
  }

  async retornaAtividade () {
    const atividade = await this.estabelecimentoService.ListarTodasAtividades().toPromise();
    if (atividade) {
      this.Atividade = atividade;
    }

  }
  numLicenca () {
    const val = (this.textSearch);
    this.estabelecimentoService.getValueMaxLicenca().subscribe(async (itens: Estabelecimento) => {
      if (itens.licenca < val) {
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'warning',
          title: 'Número da Licenca Incorreto',
          showConfirmButton: false,
          timer: 2000
        });
        this.textSearch = '';
      }
    });

  }

  formatWithCNPJorCPF () {
    if (this.estabelecimentoForm.value.cnpj != null && this.estabelecimentoForm.value.pessoa != null) {
      if (this.estabelecimentoForm.value.pessoa.toString() === '1') {
        this.cnpj = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
      } else {
        this.cnpj = [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
      }
    }
  }

  dados (item, i) {
    this.anexo = item;
    this.indice = i;
  }

  ListaArq () {
    this.loadingNuvem = false;
    if (this.status === 'abrir') {
      this.status = 'fechar';
      this.anexoService.listFilesByModel('estabelecimento', this.currentIdUpdate.toString()).subscribe((arq: Arquivos[]) => {
        console.log(arq);
        this.listaArq = arq;
        this.loadingNuvem = true;
        for (let i = 0; i < this.listaArq.length; i++) {
          this.loadingRemove[i] = true;
        }
      });
    } else {
      this.loadingNuvem = true;
      this.status = 'abrir';
      this.listaArq.splice(0);
    }
  }

  onUploadChange (evt: Event) {
    const target = evt.target as HTMLInputElement;
    const files = target.files as FileList;
    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        const file = files[key];
        const reader = new FileReader();
        reader.onload = ((theFile) => {
          return (e) => {
            this.arq.push(escape(theFile.type));
            console.log(this.arq);
            this.nomeArquivo.push(theFile.name);
            let url = e.target.result;
            const index = Number(url.toLowerCase().indexOf(',') + 1);
            url = url.slice(index);
            this.base64textString.push(url);
            this.inicializaLoading();
          };
        })
          (file);
        reader.readAsDataURL(file);
      }
    }
  }
  inicializaLoading () {
    for (let i = 0; i < this.base64textString.length; i++) {
      this.loading[i] = true;
    }
  }
  removeTudoDaLista (i) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  removerDaLista (i) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  formatType (doc) {
    if (doc === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx';
    } else if (doc === 'pdf') {
      return 'pdf';
    } else {
      return '';
    }
  }
  enviar (src, i) {
    if (this.estabelecimentoForm.value.id != null) {
      this.arquivos.descricao = this.nomeArquivo[i];
      this.arquivos.descricao_completa = this.descricao[i];
      this.arquivos.id_estabelecimento = this.estabelecimentoForm.value.id;
      this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
      this.arquivos.path = src;
      this.loading[i] = false;
      this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
        this.loading[i] = true;
        this.removerDaLista(i);
      }, (error) => {
        swal.fire({
          icon: 'warning',
          title: 'Falha na Criação do Anexo',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um estabelecimento, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  enviarTodos () {
    if (this.estabelecimentoForm.value.id != null) {
      for (let i = 0; i < this.base64textString.length; i++) {
        this.loading[i] = false;
        this.arquivos.path = this.base64textString[i];
        this.arquivos.descricao = this.nomeArquivo[i];
        this.arquivos.descricao_completa = this.descricao[i];
        this.arquivos.id_estabelecimento = this.estabelecimentoForm.value.id;
        this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
        this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
          this.removeTudoDaLista(this.index);
          this.loading[i] = true;
        }, (error) => {
          this.index += 1;
          swal.fire({
            icon: 'warning',
            title: 'Falha na Criação do Anexo',
            showConfirmButton: false,
            timer: 2000
          });
        });
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um estabelecimento, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  apagarArquivo () {
    this.loadingRemove[this.indice] = false;
    this.anexoService.deleteFileByKey(this.anexo.key).subscribe(
      () => {
        for (let i = 0; i <= this.listaArq.length; i++) {
          if (this.listaArq[i].key === this.anexo.key) {
            this.listaArq.splice(i, 1);
            this.loadingRemove.splice(i, 1);
          }
        }
        this.loadingRemove[this.indice] = true;
      },
      error => {
        swal.fire({
          icon: 'warning',
          title: 'Falha ao remover Anexo',
          showConfirmButton: false,
          timer: 2000
        });
      }
    );
  }

  async solicitarNumeroLicenca () {
    swal.fire({
      title: 'Você tem certeza que deseja solicitar um número de Licença?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Solicitar!'
    }).then((result) => {
      if (result.value) {
        this.getValueMaxLicenca();
      }
    });
  }

  getValueMaxLicenca () {
    this.estabelecimentoService.getValueMaxLicenca().subscribe(async (itens: Estabelecimento) => {
      this.licencaValueMax = itens.licenca += 1;
      this.textSearch = this.licencaValueMax;
      swal.fire(
        'Adicionado!',
        'Número da licenca adicionado com sucesso.',
        'success'
      );
    }, (error) => {
      swal.fire({
        icon: 'warning',
        title: 'Falha ao adicionar número da licença',
        showConfirmButton: false,
        timer: 2000
      });
    });
  }
  verAnexoCarregado (i) {
    this.itemCarregado.descricao = this.nomeArquivo[i];
    this.itemCarregado.url_location = 'data:image/png;base64,' + this.base64textString[i];
    this.itemCarregado.descricao_completa = this.descricao[i];
    this.item = this.itemCarregado;
  }
  verAnexo (item) {
    this.item = item;
  }
}
