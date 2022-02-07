import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { Arquivos } from '../../../../../models/arquivos';
import { Estabelecimento } from '../../../../../models/estabelecimento';
import { Licencas } from '../../../../../models/licencas';
import { Usuario } from '../../../../../models/usuario';
import { AnexoService } from '../../../../services/anexo.service';
import { AutenticarService } from '../../../../services/autenticar.service';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';
import { LicencaService } from '../../../../services/licenca.service';
declare let $: any;

@Component({
  selector: 'app-cadastro-licenca',
  templateUrl: './cadastro-licenca.component.html',
  styleUrls: ['./cadastro-licenca.component.css']
})
export class CadastroLicencaComponent implements OnInit {
  formLicenca: FormGroup;

  licenca: Licencas = {} as Licencas; titulo;
  usuario: Usuario; user; isDisabled = true;
  userNomeInput; idEstabelecimento; idLicenca;
  razao; loadingCadastro = true; formSubmitted = false;
  dataEstabelecimento;
  base64textString = []; descricao = []; arq = []; nomeArquivo = [];
  arquivos: Arquivos = {} as Arquivos; listaArq: Arquivos[] = [];
  anexo: Arquivos; indice; item: Arquivos; itemCarregado = {} as Arquivos;
  loading: boolean[] = []; loadingRemove: boolean[] = []; loadingNuvem = true;
  status = 'abrir'; index;

  constructor (private route: ActivatedRoute, private authService: AutenticarService,
    private estabelecimentosService: EstabelecimentoService, private licencaService: LicencaService,
    private anexoService: AnexoService, private router: Router) {

    this.usuario = this.authService._user['params'];
    this.user = this.usuario.nivel_acesso;
  }

  get alterouStatusPrimeiroFiscal (): boolean {
    return this.f.status_fiscal.value === 'autorizada' && this.f.fiscal.value === this.usuario.matricula;
  }
  get isFiscal (): boolean {
    return this.usuario.nivel_acesso === 'fiscal';
  }
  get isGerente (): boolean {
    return this.usuario.nivel_acesso === 'gerente';
  }
  get statusFiscalAguardando (): boolean {
    return this.f.status_fiscal.value === 'aguardando';
  }
  get isFiscalAutorizada (): boolean {
    return this.f.status_fiscal.value === 'autorizada';
  }
  get isSegundoFiscalAutorizada (): boolean {
    return this.f.status_segundo_fiscal.value === 'autorizada';
  }
  get statusSegundoFiscalAguardando (): boolean {
    return this.f.status_segundo_fiscal.value === 'aguardando';
  }
  get statusGerenteAguardando (): boolean {
    return this.f.status_gerente.value === 'aguardando';
  }

  get statusGerenteFiscalAutorizado (): boolean {
    return this.f.status_fiscal.value === 'autorizada' && this.f.status_segundo_fiscal.value === 'autorizada';
  }
  get statusFiscaisAguardando (): boolean {
    return this.f.status_fiscal.value === 'aguardando' && this.f.status_segundo_fiscal.value === 'aguardando';
  }
  get autorizadaPorOutroFiscal (): boolean {
    return this.f.status_fiscal.value === 'autorizada' && this.f.fiscal.value !== this.usuario.matricula;
  }
  get usuarioAtualAutorizouFiscal (): boolean {
    return this.f.status_fiscal.value === 'autorizada' && this.f.fiscal.value === this.usuario.matricula;
  }
  get usuarioFiscalAtualAutorizouSegundoFiscal (): boolean {
    return this.f.status_segundo_fiscal.value === 'autorizada' && this.f.segundo_fiscal.value === this.usuario.matricula;
  }

  ngOnInit () {
    this.dataEstabelecimento = '';
    this.createForm(new Licencas());
    this.pegaId();
  }
  createForm (licenca: Licencas) {
    this.formLicenca = new FormGroup({
      id: new FormControl(licenca.id),
      licenca: new FormControl(licenca.licenca),
      razao: new FormControl(this.razao),
      solicitado_por: new FormControl(licenca.solicitado_por),
      gerente: new FormControl(licenca.gerente),
      fiscal: new FormControl(licenca.fiscal),
      segundo_fiscal: new FormControl(licenca.segundo_fiscal),
      estabelecimento: new FormControl(Number(licenca.estabelecimento)),
      status_fiscal: new FormControl(String(licenca.status_fiscal), Validators.required),
      status_segundo_fiscal: new FormControl(String(licenca.status_segundo_fiscal), Validators.required),
      status_gerente: new FormControl(String(licenca.status_gerente), Validators.required),
      observacao_fiscal: new FormControl(licenca.observacao_fiscal),
      observacao_gerente: new FormControl(licenca.observacao_gerente),
      observacao_pedido: new FormControl(licenca.observacao_pedido),
      data_emissao: new FormControl(licenca.data_emissao || this.newDate()),
      data_validade: new FormControl(licenca.data_validade || this.newDatePlusOneYear())
    });
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idLicenca = queryParams.id;
        this.idEstabelecimento = queryParams.id_est;
        if (this.idLicenca != null) {
          this.licencaService.ListarLicencaPorID(this.idLicenca).subscribe((licenca: Licencas) => {
            this.titulo = 'Emitir Licença';
            window.scrollTo(0, 0);
            this.licenca = licenca;
            this.createForm(this.licenca);

            this.estabelecimentosService.listarEstabelecimentoPorID(
              licenca.estabelecimento.toString()).subscribe((est: Estabelecimento) => {
                this.dataEstabelecimento = est;
              });

          });
        }

        if (this.idEstabelecimento != null) {
          this.estabelecimentosService.listarEstabelecimentoPorID(this.idEstabelecimento).subscribe((est: Estabelecimento) => {
            this.titulo = 'Pedido de licença';
            window.scrollTo(0, 0);
            this.dataEstabelecimento = est;
            this.licenca.status_fiscal = 'aguardando';
            this.licenca.status_gerente = 'aguardando';
            this.licenca.status_segundo_fiscal = 'aguardando';
            this.licenca.solicitado_por = this.usuario.matricula;
            this.licenca.estabelecimento = est.id;
            this.licenca.licenca = Number(est.licenca);
            this.createForm(this.licenca);
          });
        }
      }
    );
  }

  newDate () {
    return moment().format('YYYY-MM-DD');
  }
  newDatePlusOneYear () {
    return moment().add('1', 'year').format('YYYY-MM-DD');
  }
  get f () { return this.formLicenca.controls; }

  cadastrar () {
    this.loadingCadastro = false;
    if (this.formLicenca.valid === false) {
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
      this.formLicenca.value['razao'] = null;
      this.licenca.status_fiscal = 'aguardando';
      this.licenca.status_gerente = 'aguardando';
      this.licenca.status_segundo_fiscal = 'aguardando';
      this.formLicenca.controls.solicitado_por.setValue(this.usuario.matricula);
      this.licencaService.createLicenca(this.formLicenca.value).subscribe((data: Licencas) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Pedido realizado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: data.id
          }
        };
        setTimeout(() => {
          this.router.navigate(['/licenca/'], navigationExtras);
        }, 3000);
      }, (error) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'warning',
          title: 'Falha ao realizar pedido de licença',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  Atualizar () {
    this.loadingCadastro = false;
    if (this.formLicenca.valid === false) {
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
      this.licencaService.updateLicenca(this.formLicenca.value).subscribe((data: Licencas) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Licença atualizada com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.idLicenca
          }
        };
        setTimeout(() => {
          this.router.navigate(['/licenca/'], navigationExtras);
        }, 3000);
      }, (error) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'warning',
          title: 'Falha ao atualizar licença',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }
  changeSegundoFiscal () {
    if (this.formLicenca.value.status_segundo_fiscal === 'autorizada') {
      this.f.segundo_fiscal.setValue(this.usuario.matricula);
    }
    if (this.formLicenca.value.status_segundo_fiscal === 'aguardando') {
      this.f.segundo_fiscal.setValue(null);
      this.f.fiscal.setValue(undefined);
      this.f.status_fiscal.setValue(undefined);
    }
  }

  changeFiscal () {
    if (this.formLicenca.value.status_fiscal === 'autorizada') {
      this.f.fiscal.setValue(this.usuario.matricula);
    }
    if (this.formLicenca.value.status_fiscal === 'aguardando') {
      this.f.fiscal.setValue(null);
      this.f.segundo_fiscal.setValue(undefined);
      this.f.status_segundo_fiscal.setValue(undefined);
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

      this.anexoService.listFilesByModel('estabelecimento', this.formLicenca.value.estabelecimento).subscribe((arg) => {
        this.loadingNuvem = true;
        if (arg.length > 0) {
          this.titulo = 'Anexos da Licença';
          this.listaArq = arg.filter((item: Arquivos) => {
            return (
              String(item.descricao).indexOf('Pedido:' + this.licenca.id) > -1 ||
              item.id_licenca === this.licenca.id
            );
          });
          for (let i = 0; i < this.listaArq.length; i++) {
            this.loadingRemove[i] = true;
          }
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
            this.arq.push(theFile.type);
            this.nomeArquivo.push(theFile.name);
            let url = e.target.result.toString();
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
  enviar (src, i) {
    if (this.formLicenca.value.id != null) {
      this.arquivos.descricao = this.nomeArquivo[i];
      this.arquivos.descricao_completa = this.descricao[i];
      this.arquivos.descricao = 'Pedido:' + this.formLicenca.value.id +
        '/Documentos Licença:' + (this.f.licenca.value) + '/' + new Date().getFullYear().toString();
      this.arquivos.id_estabelecimento = this.formLicenca.value.estabelecimento;
      this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
      this.arquivos.path = src;
      this.loading[i] = false;
      this.arquivos.id_licenca = this.formLicenca.value.id;
      this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
        this.loading[i] = true;
        this.removerDaLista(i);
      }, (error) => {
        console.error(error);
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
        title: 'Cadastre uma licença, ou atualize uma existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }
  enviarTodos () {
    if (this.formLicenca.value.id != null) {
      for (let i = 0; i < this.base64textString.length; i++) {
        this.loading[i] = false;
        this.arquivos.descricao = this.nomeArquivo[i];
        this.arquivos.path = this.base64textString[i];
        this.arquivos.descricao_completa = this.descricao[i];
        this.arquivos.id_estabelecimento = this.formLicenca.value.estabelecimento;
        this.arquivos.id_licenca = this.formLicenca.value.id;
        this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1));
        this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
          this.removeTudoDaLista(this.index);
          this.loading[i] = true;
        }, (error) => {
          console.log(error);
          this.index += 1;
          this.loading[i] = true;
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
        title: 'Cadastre uma licença, ou atualize uma existente',
        showConfirmButton: false,
        timer: 2000
      });
    }
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
