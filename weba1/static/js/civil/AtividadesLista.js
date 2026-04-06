var Usuario = "";
var TotalItens = 0;
$( document ).ready(function() {
       Usuario = $("#UsuarioCheck").html();
        $("#QtdAtividades").html("(0)")
//PegarIntegracoes(Usuario);

});

async function PegarIntegracoes(Usuario)
{
    var SemConcluidos = true;
    var Estudos = await RetornaEstudos(SemConcluidos);
    var Calculos = await RetornaCalculos(SemConcluidos);
    var Modelos = await RetornaModelos(SemConcluidos);
    var Documentos = await RetornaDocumentos(SemConcluidos);
    var Verificacoes = await RetornaVerificacoes(SemConcluidos);
    var ItensIntegracaoT = await RetornaItensIntegracao(SemConcluidos);
    var IntegracoesT = await RetornaIntegracoes(SemConcluidos);
    var StatusIntegracao = await RetornaStatusIntegracao();
    var Integracoes = [];
    var ItensIntegracao = [];
    if(SemConcluidos)
    {

         for(var i = 0; i < ItensIntegracaoT.length; i++)
        {
             var StatusIInt;
            for(var j = 0; j < StatusIntegracao.length; j++)
            {
                if(StatusIntegracao[j].id == ItensIntegracaoT[i].StatusIntegracao)
                {
                    StatusIInt = StatusIntegracao[j].Status;
                    break;
                }
            }
            if(StatusIInt == "Aguardando Resposta")
            {
                ItensIntegracao.push(ItensIntegracaoT[i]);
            }
        }
    }
    else
    {
        ItensIntegracao = ItensIntegracaoT;
    }
    if(SemConcluidos)
    {
        for(var i = 0; i < IntegracoesT.length; i++)
        {
            if(IntegracoesT[i].StatusAutomatico != "Integr. Aprovadas")
            {
                Integracoes.push(IntegracoesT[i]);
            }
        }
    }
    else
    {
        Integracoes = IntegracoesT;
    }

    TotalItens = Estudos.length + Calculos.length + Modelos.length + Documentos.length + Verificacoes.length + Integracoes.length + ItensIntegracao.length;

              $("#QtdAtividades").html("(" + TotalItens + ")")


}
async function RetornarAtividades(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarTDAtividades/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaOSs(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaOSs/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusIntegracao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaStatusIntegracao/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusVerificacao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusVerificacoes/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusDocumentos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusDocumento/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusModelos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusModelo/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusEstudos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEstudo/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusCalculos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusCalculo/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaIntegracoes(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaIntegracaoPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}
async function RetornaItensIntegracao(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaItensIntegracaoPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}
async function RetornaVerificacoes(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaVerificacoesPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}
async function RetornaDocumentos(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaDocumentosPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}

async function RetornaEstudos(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaEstudosPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}
async function RetornaCalculos(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaCalculosPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}
async function RetornaModelos(SemConcluidos){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaModelosPorUsuario/",
      method: "GET",
      data: { Usuario: $("#UsuarioCheck").html(), SemConcluidos: SemConcluidos}
    });

   return request;
}