// tslint:disable:import-spacing
// tslint:disable-next-line: max-line-length
import { DatePipe } from '@angular/common'
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatButtonModule } from '@angular/material/button'
import { MatCheckboxModule } from '@angular/material/checkbox'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatIconModule } from '@angular/material/icon'
import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { RouterModule, Routes } from '@angular/router'
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt'
import { TextMaskModule } from 'angular2-text-mask'
import { ChartsModule } from 'ng2-charts'
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search'
import { NgxPaginationModule } from 'ngx-pagination'
import { AppComponent } from './app.component'
import { BarChartComponent } from './components/bar-chart/bar-chart.component'
import { MenuComponent } from './components/menu/menu.component'
import { PieChartComponent } from './components/pie-chart/pie-chart.component'
import { AuthGuard } from './guards/auth-guard'
import { HomeComponent } from './home/home.component'
import { TokenInterceptorService } from './interceptors/token-interceptor.service'
import { TipoTermoPipe } from './pipes/tipo-termo.pipe'
import { TipoUsuarioPipe } from './pipes/tipo-usuario'
import { CadastroAtividadeComponent } from './presenter/features/atividades/cadastro-atividade/cadastro-atividade.component'
import { ListaAtividadeComponent } from './presenter/features/atividades/lista-atividade/lista-atividade.component'
import { LoginComponent } from './presenter/features/authentication/login/login.component'
import { CadastroDenunciasComponent } from './presenter/features/denuncias/cadastro-denuncias/cadastro-denuncias.component'
import { DenunciasComponent } from './presenter/features/denuncias/denuncias/denuncias.component'
import { ListaDenunciasComponent } from './presenter/features/denuncias/lista-denuncias/lista-denuncias.component'
import { CadastroDocumentoComponent } from './presenter/features/documentos/cadastro-documento/cadastro-documento.component'
import { ListaDocumentoComponent } from './presenter/features/documentos/lista-documento/lista-documento.component'
import { CadastroEmbasamentoComponent } from './presenter/features/embasamentos/cadastro-embasamento/cadastro-embasamento.component'
import { ListaEmbasamentoComponent } from './presenter/features/embasamentos/lista-embasamento/lista-embasamento.component'
import { CadastroEstabelecimentoComponent }
  from './presenter/features/estabelecimentos/cadastro-estabelecimento/cadastro-estabelecimento.component'
import { EstabelecimentosComponent } from './presenter/features/estabelecimentos/estabelecimentos/estabelecimentos.component'
import { ListaEstabelecimentoComponent } from './presenter/features/estabelecimentos/lista-estabelecimento/lista-estabelecimento.component'
import { CadastroLicencaComponent } from './presenter/features/licencas/cadastro-licenca/cadastro-licenca.component'
import { LicencaComponent } from './presenter/features/licencas/licenca/licenca.component'
import { ListaLicencaComponent } from './presenter/features/licencas/lista-licenca/lista-licenca.component'
import { AlterarSenhaComponent } from './presenter/features/profile/alterar-senha/alterar-senha.component'
import { PasswordStrengthComponent } from
  './presenter/features/profile/alterar-senha/component/password-strength/password-strength.component'
import { CadastroProtocoloComponent } from './presenter/features/protocolos/cadastro-protocolo/cadastro-protocolo.component'
import { ListaProtocoloComponent } from './presenter/features/protocolos/lista-protocolo/lista-protocolo.component'
import { ProtocoloComponent } from './presenter/features/protocolos/protocolo/protocolo.component'
import { CadastroRelatorioComponent } from './presenter/features/relatorios/cadastro-relatorio/cadastro-relatorio.component'
import { ListaRelatorioComponent } from './presenter/features/relatorios/lista-relatorio/lista-relatorio.component'
import { RelatoriosComponent } from './presenter/features/relatorios/relatorios/relatorios.component'
import { SupportComponent } from './presenter/features/support/support.component'
import { CadastroTermosComponent } from './presenter/features/termos/cadastro-termo/cadastro-termo.component'
import { ListaTermoComponent } from './presenter/features/termos/lista-termo/lista-termo.component'
import { TermosComponent } from './presenter/features/termos/termos/termo.component'
import { LoginProviderService } from './providers/login.provider'
import { AtividadeService } from './services/atividade.service'
import { AutenticarService } from './services/autenticar.service'
import { EstabelecimentoService } from './services/estabelecimento.service'
import { LicencaService } from './services/licenca.service'
import { PdfService } from './services/pdf.service'
import { ProtocoloService } from './services/protocolo.service'
import { StorageService } from './services/storage.service'
import { UtilsService } from './services/utils.service'

export function jwtOptionsFactory(tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getStorageToken()
    }
  }
}

const appRoute: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'lista-estabelecimentos', component: ListaEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'estabelecimento', component: EstabelecimentosComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-estabelecimento', component: CadastroEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'cadastroProtocolo', component: CadastroProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'listar-protocolo', component: ListaProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'protocolo', component: ProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-denuncias', component: CadastroDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'listar-denuncias', component: ListaDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'denuncia', component: DenunciasComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-licenca', component: CadastroLicencaComponent, canActivate: [AuthGuard] },
  { path: 'licenca', component: LicencaComponent, canActivate: [AuthGuard] },
  { path: 'lista-licenca', component: ListaLicencaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-termo', component: CadastroTermosComponent, canActivate: [AuthGuard] },
  { path: 'lista-termos', component: ListaTermoComponent, canActivate: [AuthGuard] },
  { path: 'termo', component: TermosComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-documento', component: CadastroDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'lista-documento', component: ListaDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-embasamento', component: CadastroEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'lista-embasamento', component: ListaEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-atividade', component: CadastroAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'lista-atividade', component: ListaAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-relatorio', component: CadastroRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'lista-relatorios', component: ListaRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'relatorio', component: RelatoriosComponent, canActivate: [AuthGuard] },
  { path: 'alterar-senha', component: AlterarSenhaComponent, canActivate: [AuthGuard] },
  { path: 'suporte', component: SupportComponent, canActivate: [AuthGuard] },
  // { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', resolve: { path: 'home' }, component: HomeComponent }

]
@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    EstabelecimentosComponent,
    ListaEstabelecimentoComponent,
    CadastroEstabelecimentoComponent,
    CadastroProtocoloComponent,
    ListaProtocoloComponent,
    ProtocoloComponent,
    HomeComponent,
    PieChartComponent,
    LoginComponent,
    BarChartComponent,
    CadastroDenunciasComponent,
    ListaDenunciasComponent,
    DenunciasComponent,
    CadastroLicencaComponent,
    ListaLicencaComponent,
    LicencaComponent,
    CadastroTermosComponent,
    ListaTermoComponent,
    TermosComponent,
    CadastroDocumentoComponent,
    ListaDocumentoComponent,
    CadastroEmbasamentoComponent,
    ListaEmbasamentoComponent,
    CadastroAtividadeComponent,
    ListaAtividadeComponent,
    CadastroRelatorioComponent,
    ListaRelatorioComponent,
    RelatoriosComponent,
    TipoTermoPipe,
    TipoUsuarioPipe,
    AlterarSenhaComponent,
    PasswordStrengthComponent,
    SupportComponent,

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute),
    BrowserAnimationsModule,
    FormsModule,
    NgxPaginationModule,
    TextMaskModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    ChartsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
        deps: [StorageService]
      }
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptorService,
    multi: true
  }, EstabelecimentoService, ProtocoloService, PdfService, DatePipe, TipoTermoPipe, UtilsService, TipoUsuarioPipe,
    AutenticarService, StorageService, LoginProviderService, LicencaService, AtividadeService, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
