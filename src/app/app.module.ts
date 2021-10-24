import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule, APP_BOOTSTRAP_LISTENER, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';
import { EstabelecimentosComponent } from './estabelecimentos/estabelecimentos.component';
import { EstabelecimentoService } from './service/estabelecimento.service';
import { ListaEstabelecimentoComponent } from './lista-estabelecimento/lista-estabelecimento.component';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';
import { CadastroEstabelecimentoComponent } from './cadastro-estabelecimento/cadastro-estabelecimento.component';
import { TextMaskModule } from 'angular2-text-mask';
import { CadastroProtocoloComponent } from './cadastro-protocolo/cadastro-protocolo.component';
import { ProtocoloService } from './service/protocolo.service';
import { ListaProtocoloComponent } from './lista-protocolo/lista-protocolo.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ProtocoloComponent } from './protocolo/protocolo.component';
import { PdfService } from './service/pdf.service';
import { AutenticarService } from './service/autenticar.service';
import { HomeComponent } from './home/home.component';
import { ChartsModule } from 'ng2-charts';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { LoginComponent } from './login/login.component';
import { JwtHelperService, JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { LoginProviderService } from './providers/login-provider-service';
import { StorageService } from './service/storage.service';
import { AuthGuard } from './guards/auth-guard';
import { TokenInterceptorService } from './intercerptors/token-interceptor.service';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import localeBr from '@angular/common/locales/br';
import localeBrExtra from '@angular/common/locales/extra/br';
import { DatePipe, registerLocaleData } from '@angular/common';
import { CadastroDenunciasComponent } from './cadastro-denuncias/cadastro-denuncias.component';
import { ListaDenunciasComponent } from './lista-denuncias/lista-denuncias.component';
import { DenunciasComponent } from './denuncias/denuncias.component';
import { CadastroLicencaComponent } from './cadastro-licenca/cadastro-licenca.component';
import { ListaLicencaComponent } from './lista-licenca/lista-licenca.component';
import { LicencaService } from './service/licenca.service';
import { LicencaComponent } from './licenca/licenca.component';
import { CadastroTermosComponent } from './cadastro-termos/cadastro-termos.component';
import { AtividadeService } from './service/atividade.service';
import { ListaTermoComponent } from './lista-termo/lista-termo.component';
import { TermosComponent } from './termos/termos.component';
import { CadastroDocumentoComponent } from './cadastro-documento/cadastro-documento.component';
import { ListaDocumentoComponent } from './lista-documento/lista-documento.component';
import { CadastroEmbasamentoComponent } from './cadastro-embasamento/cadastro-embasamento.component';
import { ListaEmbasamentoComponent } from './lista-embasamento/lista-embasamento.component';
import { CadastroAtividadeComponent } from './cadastro-atividade/cadastro-atividade.component';
import { ListaAtividadeComponent } from './lista-atividade/lista-atividade.component';
import { CadastroRelatorioComponent } from './cadastro-relatorio/cadastro-relatorio.component';
import { ListaRelatorioComponent } from './lista-relatorio/lista-relatorio.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';



export function jwtOptionsFactory (tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getStorageToken();
    }
  };
}

const appRoute: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'listaEstabelecimentos', component: ListaEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'estabelecimento', component: EstabelecimentosComponent, canActivate: [AuthGuard] },
  { path: 'cadastrar', component: CadastroEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'cadastroProtocolo', component: CadastroProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'listarProtocolo', component: ListaProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'Protocolo', component: ProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'Cadastrodenuncias', component: CadastroDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'ListarDenuncias', component: ListaDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'Denuncia', component: DenunciasComponent, canActivate: [AuthGuard] },
  { path: 'Cadastrolicenca', component: CadastroLicencaComponent, canActivate: [AuthGuard] },
  { path: 'licenca', component: LicencaComponent, canActivate: [AuthGuard] },
  { path: 'lista_licenca', component: ListaLicencaComponent, canActivate: [AuthGuard] },
  { path: 'CadastroTermo', component: CadastroTermosComponent, canActivate: [AuthGuard] },
  { path: 'listatermo', component: ListaTermoComponent, canActivate: [AuthGuard] },
  { path: 'termo', component: TermosComponent, canActivate: [AuthGuard] },
  { path: 'CadastroDocumento', component: CadastroDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'ListaDocumento', component: ListaDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'CadastroEmbasamento', component: CadastroEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'ListaEmbasamento', component: ListaEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'CadastroAtividade', component: CadastroAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'ListaAtividade', component: ListaAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'CadastroRelatorio', component: CadastroRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'ListaRelatorio', component: ListaRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'relatorio', component: RelatoriosComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', resolve: { path: 'home' }, component: HomeComponent }


];
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

  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoute),
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    NgxPaginationModule,
    TextMaskModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
    PdfViewerModule,
    ChartsModule,
    MatSelectModule,
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
  }, EstabelecimentoService, ProtocoloService, PdfService, DatePipe,
    AutenticarService, StorageService, LoginProviderService, LicencaService, AtividadeService, JwtHelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
