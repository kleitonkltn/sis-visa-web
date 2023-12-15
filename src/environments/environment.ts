// const baseURL = 'http://127.0.0.1:3000/api/';
const baseURL = 'https://seden-sfaa-ebab87d01745.herokuapp.com/api/';
export const environment = {
  production: false,
  baseURL,
  apiUrl_Estabelecimento: `${baseURL}estabelecimentos`,
  apiUrl_cnae: `${baseURL}cnae`,
  apiUrl_Atividades: `${baseURL}atividades`,
  apiUrl_Protocolos: `${baseURL}protocolos`,
  apiUrl_pdfProtocolo: `${baseURL}getprotocolo/`,
  apiUrl_pdfRelatorio: `${baseURL}pdf/relatorios/`,
  apiUrl_pdfTermo: `${baseURL}pdf/termos/`,
  apiUrl_Login: `${baseURL}login`,
  apiUrl_pdfLicenca: `${baseURL}licenca/`,
  apiUrl_Denuncias: `${baseURL}denuncias`,
  apiUrl_Anexos: `${baseURL}files`,
  apiUrl_Licencas: `${baseURL}licencas`,
  apiUrl_LicencasPost: `${baseURL}licencas`,
  apiUrl_Embasamento: `${baseURL}embasamentos`,
  apiUrl_Documentos: `${baseURL}documentos`,
  apiUrl_Usuarios: `${baseURL}usuarios`,
  apiUrl_Termo: `${baseURL}termos`,
  apiUrl_Relatorio: `${baseURL}relatorios`,
  apiUrl_sendTermo: `${baseURL}pdf/email/termo`,
  apiUrl_sendLicenca: `${baseURL}pdf/email/licenca`,
  apiUrl_sendRelatorio: `${baseURL}pdf/email/relatorio`,
  apiUrl_sendProtocolo: `${baseURL}pdf/email/protocolo`,
  apiUrl_alterarSenha: `${baseURL}usuarios/password`,
  apiUrl_assinarLicenca: `${baseURL}assinaturas/licenca`,
};
