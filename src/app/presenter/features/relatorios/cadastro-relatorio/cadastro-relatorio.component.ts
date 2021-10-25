import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Estabelecimento } from '../../../../../models/estabelecimento';
import { Relatorio } from '../../../../../models/relatorio';
import { Usuario } from '../../../../../models/usuario';
import { AutenticarService } from '../../../../services/autenticar.service';
import { EstabelecimentoService } from '../../../../services/estabelecimento.service';
import { RelatorioService } from '../../../../services/relatorio.service';
import { UsuarioService } from '../../../../services/usuario.service';
declare let $: any;
import swal from 'sweetalert2';

@Component({
  selector: 'app-cadastro-relatorio',
  templateUrl: './cadastro-relatorio.component.html',
  styleUrls: ['./cadastro-relatorio.component.css']
})
export class CadastroRelatorioComponent implements OnInit {

  constructor (private usuarios: UsuarioService, private relatorioservice: RelatorioService,
    private router: Router, private route: ActivatedRoute,
    private estabelecimentoservice: EstabelecimentoService,
    private authService: AutenticarService) {
    this.usuario = this.authService._user['params'];
    this.user = this.usuario.nivel_acesso;
  }
  public cep = [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  relatorio: Relatorio; titulo = 'Cadastrar Relatório'; listfiscais; fiscais: Usuario[];
  relatorioForm: FormGroup; cont = 0; idestabelecimento; relatorioEst: Relatorio = {} as Relatorio;
  formSubmitted; public idupdate; loading = true; loadingCadastro = true;
  usuario: Usuario; user;
  itemsForm = [];
  name = '';
  ItemsForm = new FormArray([
    new FormGroup({
      id: new FormControl(''),
      recomendacoes: new FormControl(''),
      irregularidades: new FormControl(''),
      prazo: new FormControl('')
    })
  ]);

  IrregularidadeForm = new FormArray([
    new FormGroup({
      item_id: new FormControl(5.1),
      descricao_item: new FormControl(''),
      items: new FormArray([])
    })
  ]);

  FormGroupIrregularidades = new FormGroup({
    irregularidades: this.IrregularidadeForm
  });

  irregularidades = this.FormGroupIrregularidades.get('irregularidades') as FormArray;
  items = this.irregularidades.controls[0].get('items') as FormArray;

  cnpj = (rawValue) => {
    const numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 11) {
      return [/\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    } else {
      return [/\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
    }
  }

  contatomask = (rawValue) => {
    const numbers = rawValue.match(/\d/g);
    let numberLength = 0;
    if (numbers) {
      numberLength = numbers.join('').length;
    }
    if (numberLength <= 10) {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    } else {
      return ['(', /[0-9]/, /[0-9]/, ')', ' ', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/];
    }
  }

  ngOnInit () {
    this.createForm(new Relatorio());
    this.getListFiscais();
    this.pegaId();
    this.carregaSelect();
  }
  createForm (relatorio: Relatorio) {
    this.relatorioForm = new FormGroup({
      id: new FormControl(relatorio.id),
      fantasia: new FormControl(relatorio.fantasia, Validators.required),
      razao: new FormControl(relatorio.razao, Validators.required),
      cnpj: new FormControl(relatorio.cnpj, Validators.required),
      endereco: new FormControl(relatorio.endereco, Validators.required),
      cep: new FormControl(relatorio.cep),
      bairro: new FormControl(relatorio.bairro, Validators.required),
      municipio: new FormControl(relatorio.municipio, Validators.required),
      uf: new FormControl(relatorio.uf),
      telefone: new FormControl(relatorio.telefone),
      fax: new FormControl(relatorio.fax),
      tipo_inspecao: new FormControl(relatorio.tipo_inspecao),
      data_inspecao: new FormControl(relatorio.data_inspecao, Validators.required),
      data_relatorio: new FormControl(relatorio.data_relatorio, Validators.required),
      objetivo: new FormControl(relatorio.objetivo),
      pessoas_constatadas: new FormControl(relatorio.pessoas_constatadas),
      relato_situacao: new FormControl(relatorio.relato_situacao),
      providencias_tomadas: new FormControl(relatorio.providencias_tomadas),
      irregularidades: new FormControl(relatorio.irregularidades),
      orientacoes_gerais: new FormControl(relatorio.orientacoes_gerais),
      consideracoes: new FormControl(relatorio.consideracoes),
      situacao: new FormControl(relatorio.situacao),
      fiscal_responsavel: new FormControl(relatorio.fiscal_responsavel),
      fiscais_presentes: new FormControl(relatorio.fiscais_presentes)
    });
  }
  pegaId () {
    this.route.queryParams.subscribe(
      queryParams => {
        this.idupdate = queryParams.id;
        this.idestabelecimento = queryParams.id_est;
        if (this.idupdate != null) {
          window.scrollTo(0, 0);
          this.titulo = 'Atualizar Relatório';
          this.relatorioservice.listRelatorioeById(this.idupdate).subscribe((relatorio) => {
            this.relatorio = relatorio;

            this.relatorio.irregularidades.forEach(element => {
              this.addIrregularidades2(element);
            });

            this.createForm(this.relatorio);
          });
        }
        if (this.idestabelecimento != null) {
          this.estabelecimentoservice.listarEstabelecimentoPorID(this.idestabelecimento).subscribe((est: Estabelecimento) => {
            console.log(est);
            this.titulo = 'Cadastrar Relatório';
            window.scrollTo(0, 0);
            this.relatorioEst.razao = est.razao;
            this.relatorioEst.fantasia = est.fantasia;
            this.relatorioEst.cnpj = est.cnpj;
            this.relatorioEst.endereco = est.endereco;
            this.relatorioEst.bairro = est.bairro;
            this.relatorioEst.cep = est.cep;
            this.relatorioEst.telefone = est.telefone;
            this.createForm(this.relatorioEst);
          });
        }
      }
    );

  }
  selecFiscais () {
    let a = [];
    a = this.relatorioForm.value.fiscais_presentes.split(', ');
    $('#selectfiscais').val(a);
    $('#selectfiscais').trigger('change');
  }
  getListFiscais () {
    this.usuarios.ListarTodosUsuarios().subscribe(items => {
      this.fiscais = items.filter(item => {
        return (
          item.nivel_acesso.toLowerCase().indexOf('fiscal') > -1
        );
      });
    });

  }

  atualizar () {
    this.relatorioForm.value.irregularidades = this.FormGroupIrregularidades.value.irregularidades;
    this.relatorioForm.value.fiscais_presentes = this.listfiscais;
    this.loadingCadastro = false;
    if (this.relatorioForm.valid === false) {
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
      this.relatorioservice.updateRelatorios(this.relatorioForm.value).subscribe(() => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Relatório atualizado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: this.idupdate
          }
        };
        setTimeout(() => {
          this.router.navigate(['/relatorio/'], navigationExtras);
        }, 3000);
      }, (error) => {
        window.scrollTo(0, 0);
        this.loadingCadastro = true;
        swal.fire({
          icon: 'warning',
          title: 'Falha na atualização do Relatório',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }
  }

  salvar () {
    this.relatorioForm.value.irregularidades = this.FormGroupIrregularidades.value.irregularidades;
    this.relatorioForm.value.fiscais_presentes = this.listfiscais;
    this.loadingCadastro = false;
    if (this.relatorioForm.valid === false) {
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
      this.relatorioservice.createRelatorio(this.relatorioForm.value).subscribe((data: Relatorio) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'success',
          title: 'Relatório cadastrado com sucesso',
          showConfirmButton: false,
          timer: 2000
        });
        const navigationExtras: NavigationExtras = {
          queryParams: {
            id: data.id
          }
        };
        setTimeout(() => {
          this.router.navigate(['/relatorio/'], navigationExtras);
        }, 3000);
      }, (error) => {
        this.loadingCadastro = true;
        window.scrollTo(0, 0);
        swal.fire({
          icon: 'warning',
          title: 'Falha ao cadastrar relatório',
          showConfirmButton: false,
          timer: 2000
        });
      });
    }

  }
  carregaSelect () {
    $('.select-fiscais').select2({
      placeholder: 'Selecione um Inspertor',
      llowClear: true
    });

    $('.select-fiscais').on('change', () => {
      this.selectfiscais();
    });
  }
  selectfiscais () {
    const fiscais = [];
    const opcao = $('.select-fiscais').find(':selected');
    for (let i = 0; i < opcao.length; i++) {
      fiscais[i] = opcao[i].value;
    }
    this.listfiscais = fiscais.join(', ');
  }
  addIrregularidades2 (a) {
    if (this.cont > 0) {
      const group = new FormGroup({
        item_id: new FormControl(a.item_id),
        descricao_item: new FormControl(a.descricao_item),
        items: new FormArray([])
      });
      this.irregularidades.push(group);
    }
    a.items.forEach(element => {
      this.addItem2(this.cont, element);
    });

    this.cont++;
  }

  addIrregularidades () {
    const group = new FormGroup({
      item_id: new FormControl('5.' + ((this.irregularidades.length + 1))),
      descricao_item: new FormControl(''),
      items: new FormArray([])
    });
    this.irregularidades.push(group);
  }

  addItem2 (i, item) {
    this.items = this.irregularidades.controls[i].get('items') as FormArray;
    this.itemsForm.push(this.items);
    const id = this.irregularidades.controls[i].get('item_id').value;
    const group = new FormGroup({
      id: new FormControl(item.id),
      recomendacoes: new FormControl(item.recomendacoes),
      irregularidades: new FormControl(item.irregularidades),
      prazo: new FormControl(item.prazo)
    });
    this.items.push(group);
  }

  addItem (i) {
    this.items = this.irregularidades.controls[i].get('items') as FormArray;
    this.itemsForm.push(this.items);
    const id = this.irregularidades.controls[i].get('item_id').value;
    const group = new FormGroup({
      id: new FormControl(id + '.' + (this.items.length + 1)),
      recomendacoes: new FormControl(''),
      irregularidades: new FormControl(''),
      prazo: new FormControl('')
    });
    this.items.push(group);
  }

  setItem (data, i, f) {
    this.irregularidades.controls[i].get('items')['controls'][f].setValue(data);
  }

  log (log) {
    console.log(log);
  }
}
