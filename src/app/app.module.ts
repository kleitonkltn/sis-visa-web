import { DatePipe, registerLocaleData } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localeBr from '@angular/common/locales/br';
import localeBrExtra from '@angular/common/locales/extra/br';
import { APP_BOOTSTRAP_LISTENER, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { JWT_OPTIONS, JwtHelperService, JwtModule } from '@auth0/angular-jwt';
import { TextMaskModule } from 'angular2-text-mask';
import { ChartsModule } from 'ng2-charts';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppComponent } from './app.component';
import { BarChartComponent } from './components/bar-chart/bar-chart.component';
import { MenuComponent } from './components/menu/menu.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { AuthGuard } from './guards/auth-guard';
import { HomeComponent } from './home/home.component';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { LoginComponent } from './presenter/features/authentication/login/login.component';
import { CadastroDenunciasComponent } from './presenter/features/denuncias/cadastro-denuncias/cadastro-denuncias.component';
// tslint:disable-next-line: max-line-length
import { CadastroEstabelecimentoComponent } from './presenter/features/estabelecimentos/cadastro-estabelecimento/cadastro-estabelecimento.component';
import { EstabelecimentosComponent } from './presenter/features/estabelecimentos/estabelecimentos/estabelecimentos.component';
import { ListaEstabelecimentoComponent } from './presenter/features/estabelecimentos/lista-estabelecimento/lista-estabelecimento.component';
import { CadastroProtocoloComponent } from './presenter/features/protocolos/cadastro-protocolo/cadastro-protocolo.component';
import { ListaProtocoloComponent } from './presenter/features/protocolos/lista-protocolo/lista-protocolo.component';
import { ProtocoloComponent } from './presenter/features/protocolos/protocolo/protocolo.component';
import { LoginProviderService } from './providers/login-provider-service';
import { AutenticarService } from './services/autenticar.service';
import { EstabelecimentoService } from './services/estabelecimento.service';
import { PdfService } from './services/pdf.service';
import { ProtocoloService } from './services/protocolo.service';
import { StorageService } from './services/storage.service';

import { MatAutocompleteModule, MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { CadastroAtividadeComponent } from './presenter/features/atividades/cadastro-atividade/cadastro-atividade.component';
import { ListaAtividadeComponent } from './presenter/features/atividades/lista-atividade/lista-atividade.component';
import { DenunciasComponent } from './presenter/features/denuncias/denuncias/denuncias.component';
import { ListaDenunciasComponent } from './presenter/features/denuncias/lista-denuncias/lista-denuncias.component';
import { CadastroDocumentoComponent } from './presenter/features/documentos/cadastro-documento/cadastro-documento.component';
import { ListaDocumentoComponent } from './presenter/features/documentos/lista-documento/lista-documento.component';
import { CadastroEmbasamentoComponent } from './presenter/features/embasamentos/cadastro-embasamento/cadastro-embasamento.component';
import { ListaEmbasamentoComponent } from './presenter/features/embasamentos/lista-embasamento/lista-embasamento.component';
import { CadastroLicencaComponent } from './presenter/features/licencas/cadastro-licenca/cadastro-licenca.component';
import { LicencaComponent } from './presenter/features/licencas/licenca/licenca.component';
import { ListaLicencaComponent } from './presenter/features/licencas/lista-licenca/lista-licenca.component';
import { CadastroRelatorioComponent } from './presenter/features/relatorios/cadastro-relatorio/cadastro-relatorio.component';
import { ListaRelatorioComponent } from './presenter/features/relatorios/lista-relatorio/lista-relatorio.component';
import { RelatoriosComponent } from './presenter/features/relatorios/relatorios/relatorios.component';
import { CadastroTermosComponent } from './presenter/features/termos/cadastro-termo/cadastro-termo.component';
import { ListaTermoComponent } from './presenter/features/termos/lista-termo/lista-termo.component';
import { TermosComponent } from './presenter/features/termos/termos/termo.component';
import { AtividadeService } from './services/atividade.service';
import { LicencaService } from './services/licenca.service';

export function jwtOptionsFactory (tokenService) {
  return {
    tokenGetter: () => {
      return tokenService.getStorageToken();
    }
  };
}

const appRoute: Routes = [
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'lista-estabelecimentos', component: ListaEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'estabelecimento', component: EstabelecimentosComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-estabelecimento', component: CadastroEstabelecimentoComponent, canActivate: [AuthGuard] },
  { path: 'cadastroProtocolo', component: CadastroProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'listarProtocolo', component: ListaProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'Protocolo', component: ProtocoloComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-denuncias', component: CadastroDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'ListarDenuncias', component: ListaDenunciasComponent, canActivate: [AuthGuard] },
  { path: 'Denuncia', component: DenunciasComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-licenca', component: CadastroLicencaComponent, canActivate: [AuthGuard] },
  { path: 'licenca', component: LicencaComponent, canActivate: [AuthGuard] },
  { path: 'lista_licenca', component: ListaLicencaComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-termo', component: CadastroTermosComponent, canActivate: [AuthGuard] },
  { path: 'lista-termos', component: ListaTermoComponent, canActivate: [AuthGuard] },
  { path: 'termo', component: TermosComponent, canActivate: [AuthGuard] },
  { path: 'CadastroDocumento', component: CadastroDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'ListaDocumento', component: ListaDocumentoComponent, canActivate: [AuthGuard] },
  { path: 'CadastroEmbasamento', component: CadastroEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'ListaEmbasamento', component: ListaEmbasamentoComponent, canActivate: [AuthGuard] },
  { path: 'CadastroAtividade', component: CadastroAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'ListaAtividade', component: ListaAtividadeComponent, canActivate: [AuthGuard] },
  { path: 'cadastro-relatorio', component: CadastroRelatorioComponent, canActivate: [AuthGuard] },
  { path: 'lista-relatorios', component: ListaRelatorioComponent, canActivate: [AuthGuard] },
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
