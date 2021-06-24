import { Component, OnInit } from '@angular/core'
import { FormControl, Validators, FormGroup } from '@angular/forms'
import { Termos } from '../../models/termos'
import { Arquivos } from '../../models/arquivos'
import { AnexoService } from '../service/anexo.service'
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router'
import * as moment from 'moment'
import { EmbasamentoService } from '../service/embasamento.service'
import { AutenticarService } from '../service/autenticar.service'
import { Usuario } from '../../models/usuario'
import { AtividadeService } from '../service/atividade.service'
import { DocumentoService } from '../service/documento.service'
import { UsuarioService } from '../service/usuario.service'
import { TermoService } from '../service/termo.service'
import { EstabelecimentoService } from '../service/estabelecimento.service'
import { Estabelecimento } from '../../models/estabelecimento'
import swal from 'sweetalert2'

declare let $: any

@Component({
  selector: 'app-cadastro-termos',
  templateUrl: './cadastro-termos.component.html',
  styleUrls: ['./cadastro-termos.component.css']
})

export class CadastroTermosComponent implements OnInit {
  termosForm: FormGroup; public idupdate: number
  loading: boolean[] = []; loadingRemove: boolean[] = []; loadingNumvem = true; loadingCadastro = true;
  base64textString = []; descricao = []; arq = []; nomeArquivo = [];
  arquivos: Arquivos = {} as Arquivos; listaArq: Arquivos[] = [];
  anexo: Arquivos; indice; status = 'abrir'; index; id_termo; doc
  item: Arquivos; itemCarregado = {} as Arquivos;
  date: Date; formSubmitted = false; expanded = false; estabelecimento: Estabelecimento
  embasamentos; usuario: Usuario; textSearch; desc; fiscais: Usuario[]; fiscalResponsavel: Usuario; listfiscais
  titulo = 'Cadastrar Termo'; atividades; documentos; listdoc = []; fiscaispresente

  contatomask = (rawValue) => {
    const numbers = rawValue.match(/\d/g)
    let numberLength = 0
    if (numbers) {
      numberLength = numbers.join('').length
    }
    if (numberLength <= 10) {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
    } else {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/]
    }
  }

  cnpjmask = (rawValue) => {
    const numbers = rawValue.match(/\d/g)
    let numberLength = 0
    if (numbers) {
      numberLength = numbers.join('').length
    }
    if (numberLength <= 11) {
      return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    } else {
      return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/]
    }
  }

  constructor (private anexoService: AnexoService, private route: ActivatedRoute, private embasamentoservice: EmbasamentoService,
    private authService: AutenticarService, private atividadeservice: AtividadeService,
    private documentosService: DocumentoService, private usuarios: UsuarioService,
    private termoservice: TermoService, private estabelecimentoservice: EstabelecimentoService,
    private router: Router) {
    this.usuario = this.authService._user['params']
  }

  ngOnInit () {
    this.fiscalResponsavel = this.authService._user['params']
    setTimeout(() => {
      if (this.fiscalResponsavel.nivel_acesso === 'administrativo') {
        swal.fire({
          icon: 'warning',
          title: 'A criação de Auto Termos somente é permitida a Fiscais e Gerentes',
          showConfirmButton: false,
          timer: 2000
        })
      }
    }, 2000)
    this.createForm(new Termos())
    this.pegaId()
    this.pegaEmbasamentos()
    this.pegaListAtividades()
    this.pegaDocumentos()
    this.getListFiscais()
    $(window).on('load', () => {
      this.carregaSelect()
    })

  }
  newDate () {
    return moment().format('YYYY-MM-DD')
  }
  newTime () {
    return moment().format('HH:mm')
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id
        this.id_termo = queryParams.id_termo
        this.carregaSelect()
        if (this.idupdate != null) {
          window.scrollTo(0, 0)
          this.titulo = 'Cadastrar Termo'
          window.scrollTo(0, 0)
          this.estabelecimentoservice.listarEstabelecimentoPorID(this.idupdate).subscribe((est) => {
            this.estabelecimento = est
            this.f.estabelecimento.setValue(this.idupdate)
            this.f.cnpj.setValue(this.estabelecimento.cnpj)
            this.f.fantasia.setValue(this.estabelecimento.fantasia)
            this.f.razao.setValue(this.estabelecimento.razao)
            this.f.insc.setValue(this.estabelecimento.insc)
            this.f.endereco.setValue(this.estabelecimento.endereco)
            this.f.bairro.setValue(this.estabelecimento.bairro)
            this.f.telefone.setValue(this.estabelecimento.telefone)
            this.f.ramo.setValue(this.estabelecimento.atividade)
          })
        } else if (this.id_termo != null) {
          window.scrollTo(0, 0)
          this.titulo = 'Atualizar Termo'
          this.termoservice.ListarTermoPorID(this.id_termo).subscribe((data: Termos) => {
            this.doc = ' ' + data.doc_solicitados
            this.fiscaispresente = String(data.fiscais_presentes)
            this.createForm(data)

          })
        } else {
          window.scrollTo(0, 0)
          this.titulo = 'Cadastrar Termo'
          window.scrollTo(0, 0)
          this.createForm(new Termos())
        }
      }
    )
  }

  createForm (termo: Termos) {
    if (termo['atividade']) {
      termo.ramo = termo['atividade']
    }
    this.termosForm = new FormGroup({
      id: new FormControl(termo.id),
      ramo: new FormControl(String(termo.ramo)),
      bairro: new FormControl(termo.bairro, Validators.required),
      insc: new FormControl(termo.insc),
      fantasia: new FormControl(termo.fantasia, Validators.required),
      razao: new FormControl(termo.razao, Validators.required),
      endereco: new FormControl(termo.endereco, Validators.required),
      tipo_termo: new FormControl(termo.tipo_termo, Validators.required),
      cnpj: new FormControl(termo.cnpj, Validators.required),
      telefone: new FormControl(termo.telefone),
      estabelecimento: new FormControl(termo.estabelecimento),
      denuncia: new FormControl(termo.denuncia),
      municipio: new FormControl(termo.municipio, Validators.required),
      proprietario_nome: new FormControl(termo.proprietario_nome),
      proprietario_rg: new FormControl(termo.proprietario_rg),
      proprietario_classe: new FormControl(termo.proprietario_classe),
      responsavel_nome: new FormControl(termo.responsavel_nome),
      responsavel_rg: new FormControl(termo.responsavel_rg),
      responsavel_classe: new FormControl(termo.responsavel_classe),
      embasamento_legal: new FormControl(termo.embasamento_legal, Validators.required),
      descricao: new FormControl(termo.descricao, Validators.required),
      data: new FormControl(termo.data || this.newDate(), Validators.required),
      hora: new FormControl(termo.hora || this.newTime(), Validators.required),
      fiscal_responsavel: new FormControl(termo.fiscal_responsavel || this.fiscalResponsavel.nome, Validators.required),
      fiscais_presentes: new FormControl(termo.fiscais_presentes),
      email: new FormControl(termo.email, Validators.email),
      doc_solicitados: new FormControl(termo.doc_solicitados)
    })
  }

  get f () { return this.termosForm.controls }

  carregaSelect () {
    $('.js-example-basic-multiple').select2({
      placeholder: 'Selecione uma opção',
      llowClear: true
    })

    $('.select-doc').select2({
      placeholder: 'Selecione uma opção',
      llowClear: true
    })
    $('.select-fiscais').select2({
      placeholder: 'Selecione uma opção',
      llowClear: true
    })


    $('.js-example-basic-multiple').on('change', (e) => {
      this.selectEmbasamento()
    })
    $('.select-doc').on('change', () => {
      this.selectDoc()
    })
    $('.select-fiscais').on('change', () => {
      this.selectfiscais()
    })
  }

  selectDoc () {
    this.listdoc = []
    const opcao = $('.select-doc').find(':selected')

    for (let i = 0;i < opcao.length;i++) {
      this.listdoc[i] = opcao[i].value
    }
    const documentos = this.listdoc.join(', ')

    let text = ' '
    if (this.f.descricao.value != null &&
      String(this.f.descricao.value).indexOf('Apresentar cópia dos seguintes documentos:') >= 1) {
      text = String(this.f.descricao.value).split(' Apresentar cópia dos seguintes documentos:')[0]
    } else {
      text = this.f.descricao.value != null ? this.f.descricao.value : ' '
    }
    this.f.descricao.setValue(text + ' Apresentar cópia dos seguintes documentos: '
      + documentos)
    if (opcao.length === 0) {
      this.f.descricao.setValue(text.split(' Apresentar cópia dos seguintes documentos:')[0])
    }
  }
  selectEmbasamento () {
    const listEmbasamento = []
    const opcao = $('.js-example-basic-multiple').find(':selected')
    if (opcao.length === 0) {
      this.textSearch = ''
    }
    for (let i = 0;i < opcao.length;i++) {
      listEmbasamento[i] = opcao[i].value
    }
    const embasamentos = listEmbasamento.join(', ')
    if (opcao.length > 0) {
      this.f.embasamento_legal.setValue(embasamentos)
    }
  }
  selectfiscais () {
    const fiscais = []
    const opcao = $('.select-fiscais').find(':selected')
    for (let i = 0;i < opcao.length;i++) {
      fiscais[i] = opcao[i].value
    }
    this.listfiscais = fiscais.join(', ')
  }


  salvar () {
    this.loadingCadastro = false
    if (this.fiscalResponsavel.nivel_acesso === 'gerente' || this.fiscalResponsavel.nivel_acesso === 'fiscal') {
      this.termosForm.value.doc_solicitados = this.listdoc
      this.termosForm.value.fiscais_presentes = this.listfiscais
      this.termosForm.value.fiscal_responsavel = this.fiscalResponsavel.matricula
      if ((this.termosForm.valid === false) || (!this.termosForm.value.fiscais_presentes)
        || (this.termosForm.value.fiscais_presentes === 'undefined')) {
        window.scrollTo(0, 0)
        swal.fire({
          icon: 'warning',
          title: 'Preencha todos os campos obrigatórios',
          showConfirmButton: false,
          timer: 2000
        })
        this.formSubmitted = true
        this.loadingCadastro = true
      } else {
        this.termoservice.cadastrarTermo(this.termosForm.value).subscribe((data: Termos) => {
          window.scrollTo(0, 0)
          swal.fire({
            icon: 'success',
            title: 'Termo Cadastrado com sucesso',
            showConfirmButton: false,
            timer: 2000
          }).then(() => {
            this.loadingCadastro = true
            const navigationExtras: NavigationExtras = {
              queryParams: {
                id: data.id
              }
            }
            this.router.navigate(['/termo/'], navigationExtras)
          })
        }, (error) => {
          this.loadingCadastro = true
          console.log(error.error)
          window.scrollTo(0, 0)
          swal.fire({
            icon: 'warning',
            title: `<span>${error.error.msg}</span>`,
            showConfirmButton: false,
            timer: 4000
          })
        })
      }
    } else {
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'A criação de Auto Termos somente é permitida a Fiscais e Gerentes',
        showConfirmButton: false,
        timer: 2000
      })
    }

  }

  atualizar () {
    this.loadingCadastro = false
    this.termosForm.value.fiscais_presentes = this.fiscaispresente
    console.log(this.termosForm.value)
    this.termoservice.atualizarTermo(this.termosForm.value).subscribe(() => {
      this.loadingCadastro = true
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'success',
        title: 'Termo atualizado com sucesso',
        showConfirmButton: false,
        timer: 2000
      })
      const navigationExtras: NavigationExtras = {
        queryParams: {
          id: this.id_termo
        }
      }
      setTimeout(() => {
        this.router.navigate(['/termo/'], navigationExtras)
      }, 3000)
    }, (error) => {
      this.loadingCadastro = true
      window.scrollTo(0, 0)
      swal.fire({
        icon: 'warning',
        title: 'Falha na atualização do Termo',
        showConfirmButton: false,
        timer: 2000
      })
    })
  }

  pegaListAtividades () {
    this.atividadeservice.listAllAtividades().subscribe(itens => {
      this.atividades = itens
    })
  }


  pegaEmbasamentos () {
    this.embasamentoservice.listAllEmbasamentos().subscribe(itens => {
      console.log(this.embasamentos)
      this.embasamentos = itens
    })
  }

  pegaDocumentos () {
    this.documentosService.listAllDocumentos().subscribe(itens => {
      this.documentos = itens
    })
  }

  getListFiscais () {
    this.usuarios.ListarTodosUsuarios().subscribe(items => {
      this.fiscais = items.filter(item => {
        return (
          item.nivel_acesso.toLowerCase().indexOf('fiscal') > -1
          && item.matricula !== this.fiscalResponsavel.matricula
        )
      })
    })
  }

  dados (item, i) {
    this.anexo = item
    this.indice = i
  }
  ListaArq () {
    this.loadingNumvem = false
    if (this.status === 'abrir') {
      this.status = 'fechar'
      this.anexoService.listFilesByModel('termo', this.id_termo).subscribe((arq: Arquivos[]) => {
        this.listaArq = arq
        this.loadingNumvem = true
        for (let i = 0;i < this.listaArq.length;i++) {
          this.loadingRemove[i] = true
        }
      })
    } else {
      this.loadingNumvem = true
      this.status = 'abrir'
      this.listaArq.splice(0)
    }
  }

  onUploadChange (evt) {
    const files = evt.target.files
    for (let i = 0, f;f = files[i];i++) {
      const reader = new FileReader()
      reader.onload = ((theFile) => {
        return (e) => {
          this.arq.push(escape(theFile.type))
          this.nomeArquivo.push(theFile.name)
          let url = e.target.result
          const index = Number(url.toLowerCase().indexOf(',') + 1)
          url = url.slice(index)
          this.base64textString.push(url)
          this.inicializaLoding()
        }
      })
        (f)
      reader.readAsDataURL(f)
    }
  }
  inicializaLoding () {
    for (let i = 0;i < this.base64textString.length;i++) {
      this.loading[i] = true
    }
  }
  removeTudoDaLista (i) {
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1)
    this.loading.splice(i, 1); this.descricao.splice(i, 1)
  }
  removerDaLista (i) {
    console.log(i)
    this.base64textString.splice(i, 1); this.arq.splice(i, 1); this.nomeArquivo.splice(i, 1)
    this.loading.splice(i, 1); this.descricao.splice(i, 1)
  }
  formatType (doc) {
    if (doc === 'vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return 'docx'
    } else if (doc === 'pdf') {
      return 'pdf'
    } else {
      return ''
    }
  }
  enviar (src, i) {
    if (this.termosForm.value.id != null) {
      this.arquivos.descricao = this.nomeArquivo[i]
      this.arquivos.descricao_completa = this.descricao[i]
      this.arquivos.id_termo = this.termosForm.value.id
      this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1))
      this.arquivos.path = src
      this.loading[i] = false
      this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
        this.loading[i] = true
        this.removerDaLista(i)
      }, (error) => {
        console.log(error)
        this.loading[i] = true
        swal.fire({
          icon: 'warning',
          title: 'Falha na Criação do Anexo',
          showConfirmButton: false,
          timer: 2000
        })
      })
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um Termo, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }
  enviarTodos () {
    if (this.termosForm.value.id != null) {
      for (let i = 0;i < this.base64textString.length;i++) {
        this.loading[i] = false
        this.arquivos.descricao = this.nomeArquivo[i]
        this.arquivos.path = this.base64textString[i]
        this.arquivos.descricao_completa = this.descricao[i]
        this.arquivos.id_termo = this.termosForm.value.id
        this.arquivos.type = this.formatType(this.arq[i].slice(String(this.arq[i]).indexOf('/') + 1))
        this.anexoService.salvarAnexo(this.arquivos).subscribe((data: Arquivos) => {
          this.removeTudoDaLista(this.index)
          this.loading[i] = true
        }, (error) => {
          this.index += 1
          swal.fire({
            icon: 'warning',
            title: 'Falha na Criação do Anexo',
            showConfirmButton: false,
            timer: 2000
          })
        })
      }
    } else {
      swal.fire({
        icon: 'warning',
        title: 'Cadastre um Termo, ou atualize um existente',
        showConfirmButton: false,
        timer: 2000
      })
    }
  }
  apagarArquivo () {
    this.loadingRemove[this.indice] = false
    this.anexoService.deleteFileByKey(this.anexo.key).subscribe(
      () => {
        for (let i = 0;i <= this.listaArq.length;i++) {
          if (this.listaArq[i].key === this.anexo.key) {
            this.listaArq.splice(i, 1)
            this.loadingRemove.splice(i, 1)
          }
        }
        this.loadingRemove[this.indice] = true
      },
      error => {
        this.loadingRemove[this.indice] = true
        return swal.fire({
          icon: 'warning',
          title: 'Falha ao remover Anexo',
          showConfirmButton: false,
          timer: 2000
        })
      }
    )
  }
  verAnexoCarregado (i) {
    this.itemCarregado.descricao = this.nomeArquivo[i]
    this.itemCarregado.url_location = 'data:image/png;base64,' + this.base64textString[i]
    this.itemCarregado.descricao_completa = this.descricao[i]
    this.item = this.itemCarregado

  }
  verAnexo (item) {
    this.item = item
  }

}
