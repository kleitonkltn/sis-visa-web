/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Component, OnInit } from '@angular/core';
import { Denuncias } from '../../../../../models/denuncias';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DenunciaService } from '../../../../service/denuncia.service';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Arquivos } from '../../../../../models/arquivos';
import { AnexoService } from '../../../../service/anexo.service';
import * as moment from 'moment';
import swal from 'sweetalert2';

export class Procedimentos {
  descricao: string;
  data: string;
}


@Component({
  selector: 'app-cadastro-denuncias',
  templateUrl: './cadastro-denuncias.component.html',
  styleUrls: ['./cadastro-denuncias.component.css']
})
export class CadastroDenunciasComponent implements OnInit {
  titulo = 'Cadastrar Denúncia';

  DenuciasForm: FormGroup; ArquivosForm: FormGroup;
  denuncia: Denuncias;
  public idupdate: number;
  data: Date;
  procedimentos = [];
  formProcedimento: FormGroup;
  submitted: boolean;
  base64textString = []; descricao = []; arq = []; nomeArquivo = [];
  arquivos: Arquivos = {} as Arquivos; listaArq: Arquivos[] = [];
  anexo: Arquivos; indice: string | number; item: Arquivos; itemCarregado = {} as Arquivos;
  loading: boolean[] = []; loadingRemove: boolean[] = []; loadingNumvem = true; loadingCadastro = true;
  loadingProcedimento = true;
  status = 'abrir'; index: number; formSubmitted = false;

  contatomask = (rawValue: string) => {
    const numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers)
    {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 10)
    {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    } else
    {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    }
  };

  constructor (private route: ActivatedRoute, private denunciasService: DenunciaService,
    private anexoService: AnexoService, private formBuilder: FormBuilder, private router: Router) {
  }
  ngOnInit () {
    this.createForm(new Denuncias());
    this.createFormArquivos(new Arquivos());
    this.setupForm(new Procedimentos());
    this.pegaId();
  }
  createForm (decuncias: Denuncias) {
    this.DenuciasForm = new FormGroup({
      id: new FormControl(decuncias.id),
      data: new FormControl(
        decuncias.data || this.newDate(),
        Validators.required
      ),
      hora: new FormControl(decuncias.hora),
      origem: new FormControl(decuncias.origem, Validators.required),
      status: new FormControl(decuncias.status, Validators.required),
      reclamante: new FormControl(decuncias.reclamante),
      contato_reclamante: new FormControl(decuncias.contato_reclamante),
      denunciado: new FormControl(decuncias.denunciado),
      contato_denunciado: new FormControl(decuncias.contato_denunciado),
      endereco: new FormControl(decuncias.endereco, Validators.required),
      bairro: new FormControl(decuncias.bairro, Validators.required),
      ponto_de_referencia: new FormControl(decuncias.ponto_de_referencia, Validators.required),
      descricao: new FormControl(decuncias.descricao, Validators.required),
    });
  }

  createFormArquivos (arquivos: Arquivos) {
    this.ArquivosForm = new FormGroup({
      id: new FormControl(arquivos.id),
      id_denuncia: new FormControl(arquivos.id_denuncia),
      path: new FormControl(arquivos.url_location),
      descricao: new FormControl(arquivos.descricao),
      descricao_completa: new FormControl(arquivos.descricao_completa),
      key: new FormControl(arquivos.key),
      type: new FormControl(arquivos.type),
      creadtAt: new FormControl(arquivos.creatdAt),
    });
  }
  salvar () {
    this.loadingCadastro = false;
    if (this.DenuciasForm.valid === false)
    {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else
    {
      this.denunciasService.createDenuncias(this.DenuciasForm.value).subscribe((data: Denuncias) => {
        this.loadingCadastro = true;
        this.createForm(data);
        this.denuncia = data;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Denúncia cadastrada com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: data.id
          }
        };
        setTimeout(() => {
          this.router.navigate(['/Denuncia/'], navigationExtras);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na criação da denúncia',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }
  atualizar () {
    this.loadingCadastro = false;
    if (this.DenuciasForm.valid === false)
    {
      window.scrollTo(0, 0);
      swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos obrigatórios',
        showConfirmButton: false,
        timer: 2000
      });
      this.formSubmitted = true;
      this.loadingCadastro = true;
    } else
    {
      this.denunciasService.atualizarDenuncia(this.DenuciasForm.value).subscribe(() => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Denúncia atualizada com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.idupdate
          }
        };
        setTimeout(() => {
          this.router.navigate(['/Denuncia/'], navigationExtras);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na atualização da denúncia',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id;
        if (this.idupdate != null)
        {
          window.scrollTo(0, 0);
          this.titulo = 'Atualizar Denúncia';
          this.getDenuncia();
        } else
        {
          window.scrollTo(0, 0);
          this.titulo = 'Cadastrar Denúncia';
          this.createForm(new Denuncias());
        }
      }
    );
  }
  getDenuncia () {
    this.denunciasService.ListarDenunciasPorID(this.idupdate).subscribe((denuncia) => {
      this.denuncia = denuncia;
      if (denuncia.procedimentos != null)
      {
        this.procedimentos.push(...denuncia.procedimentos);
      }

      denuncia.status = '' + denuncia.status;
      this.createForm(this.denuncia);
    });
  }
  setupForm (procedimentos: Procedimentos) {
    this.formProcedimento = new FormGroup({
      descricao: new FormControl(procedimentos.descricao || '', [Validators.required, Validators.maxLength(120)]),
      data: new FormControl(procedimentos.data || this.newDate())
    });
  }
  submitProcedimento () {
    this.loadingProcedimento = false;
    if (this.DenuciasForm.value.id != null)
    {
      this.submitted = true;
      if (this.formProcedimento.status !== 'INVALID')
      {
        this.formProcedimento.value.data = moment(this.formProcedimento.value.data).format('YYYY-MM-DD');
        this.procedimentos.push(...[this.formProcedimento.value]);
        this.updateProcedimento();
      } else
      {
        this.loadingProcedimento = true;
        this.formSubmitted = true;
        return swal.fire({
          icon: 'warning',
          title: 'Falha no Cadastro Preencha os campos Marcados com (*):',
          showConfirmButton: false,
          timer: 2000
        });

      }
    } else
    {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre uma denúncia, ou atualize uma existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  updateProcedimento () {
    const jsonNew = JSON.parse(JSON.stringify(this.procedimentos));
    console.log(this.denuncia.id + ' ' + JSON.stringify(jsonNew));
    const denuncia = new Denuncias();
    denuncia.procedimentos = jsonNew;
    denuncia.id = this.denuncia.id;
    this.denunciasService.atualizarDenuncia(denuncia).subscribe(
      () => {
        this.loadingProcedimento = true;
        this.ordernarPorData();
        this.setupForm(new Procedimentos());
        this.getDenuncia();
        return swal.fire({
          icon: 'success',
          title: 'Procedimento cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });

      },
      error => {
        this.loadingProcedimento = true;
        return swal.fire({
          icon: 'warning',
          title: 'Falha ao cadastrar procedimento',
          showConfirmButton: false,
          timer: 2000
        });
      }
    );
  }
  newDate () {
    return moment().format('YYYY-MM-DD');
  }
  ordernarPorData () {
    this.procedimentos.sort((a, b) => {
      return (a.data < b.data) ? 1 : ((b.data < a.data) ? -1 : 0);
    });
  }

  dados (item: Arquivos, i: any) {
    this.anexo = item;
    this.indice = i;
  }
  ListaArq () {
    this.loadingNumvem = false;
    if (this.status === 'abrir')
    {
      this.status = 'fechar';
      this.anexoService.listFilesByModel('denuncia', this.idupdate).subscribe((arq: Arquivos[]) => {
        this.loadingNumvem = true;
        this.listaArq = arq;
        for (let i = 0; i < this.listaArq.length; i++)
        {
          this.loadingRemove[i] = true;
        }
      });
    } else
    {
      this.loadingNumvem = true;
      this.status = 'abrir';
      this.listaArq.splice(0);
    }
  }

  onUploadChange (evt) {
    const files = evt.target.files;
    for (let i = 0, f; f = files[i]; i++)
    {
      const reader = new FileReader();
      reader.onload = ((theFile) => {
        return (e) => {
          this.arq.push(escape(theFile.type));
          this.nomeArquivo.push(theFile.name);
          let url = e.target.result;
          const index = Number(url.toLowerCase().indexOf(',') + 1);
          url = url.slice(index);
          this.base64textString.push(url);
          this.inicializaLoding();
        };
      })
        (f);
      reader.readAsDataURL(f);
    }
  }
  inicializaLoding () {
    for (let i = 0; i < this.base64textString.length; i++)
    {
      this.loading[i] = true;
    }
  }
  removeTudoDaLista (i: number) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  removerDaLista (i: number) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1);
    this.loading.splice(i, 1); this.descricao.splice(i, 1);
  }
  formatType (doc: string) {
    if (doc === 'vnd.openxmlformats-officedocument.wordprocessingml.document')
    {
      return 'docx';
    } else if (doc === 'pdf')
    {
      return 'pdf';
    } else
    {
      return '';
    }
  }
  enviar (src: string, i: string | number) {
    if (this.DenuciasForm.value.id != null)
    {
      this.arquivos.descricao = this.nomeArquivo[i];
      this.arquivos.descricao_completa = this.descricao[i];
      this.arquivos.id_denuncia = this.DenuciasForm.value.id;
      this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
      this.arquivos.path = src;
      this.loading[i] = false;
      this.anexoService.salvarAnexo(this.arquivos).subscribe(() => {
        this.loading[i] = true;
        this.removerDaLista(Number(i));
        return swal.fire({
          icon: 'success',
          title: 'Anexo cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
      }, (error) => {
        swal.fire({
          icon: 'warning',
          title: 'Falha na Criação do Anexo',
          showConfirmButton: false,
          timer: 2000
        });
      });
    } else
    {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre uma denúncia, ou atualize uma existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  enviarTodos () {
    if (this.DenuciasForm.value.id != null)
    {
      for (let i = 0; i < this.base64textString.length; i++)
      {
        this.loading[i] = false;
        this.arquivos.descricao = this.nomeArquivo[i];
        this.arquivos.path = this.base64textString[i];
        this.arquivos.descricao_completa = this.descricao[i];
        this.arquivos.id_denuncia = this.DenuciasForm.value.id;
        this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
        this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
          this.removeTudoDaLista(this.index);
          swal.fire({
            icon: 'success',
            title: 'Anexo cadastrado com sucesso',
            showConfirmButton: false,
            timer: 2000
          });
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
    } else
    {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre uma denúncia, ou atualize uma existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  apagarArquivo () {
    this.loadingRemove[this.indice] = false;
    this.anexoService.deleteFileByKey(this.anexo.key).subscribe(
      () => {
        for (let i = 0; i <= this.listaArq.length; i++)
        {
          if (this.listaArq[i].key === this.anexo.key)
          {
            this.listaArq.splice(i, 1);
            this.loadingRemove.splice(i, 1);
          }
        }
        this.loadingRemove[this.indice] = true;
      },
      error => {
        return swal.fire({
          icon: 'warning',
          title: 'Falha ao remover Anexo',
          showConfirmButton: false,
          timer: 2000
        });

      }
    );
  }

  verAnexoCarregado (i: string | number) {
    this.itemCarregado.descricao = this.nomeArquivo[i];
    this.itemCarregado.url_location = 'data:image/png;base64,' + this.base64textString[i];
    this.itemCarregado.descricao_completa = this.descricao[i];
    this.item = this.itemCarregado;
  }
  verAnexo (item: Arquivos) {
    this.item = item;
  }
}

