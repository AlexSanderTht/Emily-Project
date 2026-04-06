
var EstudoChart;
var DataEstudoChart;
var CalculosChart;
var DataCalculosChart;
var ModelosChart;
var DataModelosChart;
var DocumentosChart;
var DataDocumentosChart;
var VerificacoesChart;
var DataVerificacoesChart;
var IntegracoesChart;
var DataIntegracoesChart;
var EmissoesChart;
var DataEmissoesChart;
var ProgressoEtapasChart;
var DataProgressoEtapasChart;
var IDOS = "";
var ResultadoStatusEstudo = false;
var StatusEstudos = [];
var StatusCalculo = [];
var StatusCalculoNomes = [];
var ResultadoStatusCalculo = false;
var StatusCalculo = [];
var ResultadoStatusModelo = false;
var StatusModelo = [];
var ResultadoStatusDocumento = false;
var StatusDocumento = [];
var ResultadoStatusVerificacao = false;
var StatusVerificacao = [];
var TodosEstudosOS = [];
var ResultadoTodosEstudos = false;
var TodosCalculosOS= [];
var ResultadoTodosCalculos = false;
var TodosModelosOS = [];
var TodasVerificacoesOS = [];
var TodasIntegracoesOS = [];
var TodosItensIntegracaoOS= [];
var StatusItensIntegracao= [];
var ResultadoItensIntegracao = false;
var TodasOSs = []
var DadosCalculo = [];
var TodasEmissoesOS = [];
var StatusEmissao = [];
Usuario = " ";
$( document ).ready(function() {
GetStatusEtapas();
SelectOSChanged();
});

async function GetStatusEtapas()
{
    StatusEstudos = await RetornaStatusEstudoAsync();
    StatusCalculo = await RetornaStatusCalculoAsync();
    StatusModelo = await RetornaStatusModeloAsync();
    StatusDocumento = await RetornaStatusDocumentoAsync();
    StatusVerificacao = await RetornaStatusVerificacaoAsync();
    StatusItensIntegracao = await RetornaStatusItemIntegracaoAsync();
    StatusEmissao = await RetornaStatusEmissao();
    document.getElementById("SelectOS").removeAttribute("disabled");
}

$('#SelectOS').change(function() {
 SelectOSChanged();
});

function CriarGraficos()
{

    CriarDadosEstudo();
    CriarDadosCalculos();
    CriarDadosModelos();
    CriarDadosDocumentos();
    CriarDadosVerificacoes();
    CriarDadosIntegracoes();
    CriarDadosEtapas();
    CriarDadosEmissao();
    $("#loaderProgressoEtapas").hide();
}
async function RetornarTodosItensIntegracao(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarItensIntegracaoPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;
}

async function RetornarTodasIntegracoes(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornaIntegracaoPorOS/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;


}
async function RetornarTodosCalculos(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarCalculosPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;
}
async function RetornarTodasEmissoes(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarEmissaoPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;
}

async function RetornarTodosDocumentos(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarDocumentosPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;
}
async function RetornarTodosEstudos(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarEstudosPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;


}
async function RetornarTodosModelos(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarModelosPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;


}

async function RetornarOSs(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornaOSs/",
      method: "GET",
      data: { }
    });

   return request;


}
async function RetornarTodasVerificacoes(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarVerificacoesPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;


}
function PreencherDadosCalculo()
{
   var DtCalculo = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusCalculo.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodosCalculoOS.length; j++)
              {

                  if(TodosCalculoOS[j].Status == StatusCalculo[i].id)
                  {
                        CountTotal++;
                        if(TodosCalculoOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtCalculo.push({"IDStatus":StatusCalculo[i].id, "NomeStatus": StatusCalculo[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtCalculo;
}
function PreencherDadosVerificacoes()
{
   var DtVerificacoes = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusVerificacao.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodasVerificacoesOS.length; j++)
              {

                  if(TodasVerificacoesOS[j].Status == StatusVerificacao[i].id)
                  {
                        CountTotal++;
                        if(TodasVerificacoesOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtVerificacoes.push({"IDStatus":StatusVerificacao[i].id, "NomeStatus": StatusVerificacao[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtVerificacoes;
}
function PreencherDadosCalculos()
{
   var DtCalculos = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusCalculo.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodosCalculosOS.length; j++)
              {

                  if(TodosCalculosOS[j].Status == StatusCalculo[i].id)
                  {
                        CountTotal++;
                        if(TodosCalculosOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtCalculos.push({"IDStatus":StatusCalculo[i].id, "NomeStatus": StatusCalculo[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtCalculos;
}
function PreencherDadosModelos()
{
   var DtModelos = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusModelo.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodosModelosOS.length; j++)
              {

                  if(TodosModelosOS[j].Status == StatusModelo[i].id)
                  {
                        CountTotal++;
                        if(TodosModelosOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtModelos.push({"IDStatus":StatusModelo[i].id, "NomeStatus": StatusModelo[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtModelos;
}
function PreencherDadosDocumentos()
{
   var DtDocumentos = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusDocumento.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodosDocumentosOS.length; j++)
              {

                  if(TodosDocumentosOS[j].Status == StatusDocumento[i].id)
                  {
                        CountTotal++;
                        if(TodosDocumentosOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtDocumentos.push({"IDStatus":StatusDocumento[i].id, "NomeStatus": StatusDocumento[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtDocumentos;
}
function PreencherDadosIntegracoes()
{
   var DtIntegracoes = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB
            var StausIntegracoes = ["Não Iniciado", "Aguard. Aprovações", "Integr. Reprovada", "Integr. Aprovadas"];
          for(var i = 0; i < StausIntegracoes.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodasIntegracoesOS.length; j++)
              {

                  if(TodasIntegracoesOS[j].StatusAutomatico == StausIntegracoes[i])
                  {
                        CountTotal++;
                        if(TodasIntegracoesOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtIntegracoes.push({"NomeStatus": StausIntegracoes[i], "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtIntegracoes;
}
function PreencherDadosProgressoEtapas()
{

    var ProgressoOSPercentual = 0.0;
    var ProgressoOSDias = 0;
    var ProgressoEstudo  = 0.0;
    var TotalEstudo  = 0;
    var ProgressoCalculo = 0.0;
    var TotalCalculo = 0;
    var ProgressoModelos = 0.0;
    var TotalModelos = 0;
    var ProgressoDocumentos = 0.0;
    var TotalDocumentos = 0;
    var ProgressoVerificacoes = 0.0;
    var TotalVerificacoes = 0;
    var ProgressoIntegracao = 0.0;
    var TotalIntegracao = 0;
     var ProgressoEmissao = 0.0;
    var TotalEmissao = 0;
    for(var i= 0; i < TodosEstudosOS.length; i++)
    {
        TotalEstudo++;
        for(var j = 0; j < StatusEstudos.length; j++)
        {
            if(StatusEstudos[j].id == TodosEstudosOS[i].Status)
            {
                ProgressoEstudo+=parseFloat(StatusEstudos[j].Progresso);
                break;
            }
        }
    }
    for(var i= 0; i < TodosCalculosOS.length; i++)
    {
        TotalCalculo++;
        for(var j = 0; j < StatusCalculo.length; j++)
        {
            if(StatusCalculo[j].id == TodosCalculosOS[i].Status)
            {
                ProgressoCalculo+=parseFloat(StatusCalculo[j].Progresso);
                break;
            }
        }
    }
    for(var i= 0; i < TodosModelosOS.length; i++)
    {
        TotalModelos++;
        for(var j = 0; j < StatusModelo.length; j++)
        {
            if(StatusModelo[j].id == TodosModelosOS[i].Status)
            {
                ProgressoModelos+=parseFloat(StatusModelo[j].Progresso);
                break;
            }
        }
    }
    for(var i= 0; i < TodosDocumentosOS.length; i++)
    {
        TotalDocumentos++;
        for(var j = 0; j < StatusDocumento.length; j++)
        {
            if(StatusDocumento[j].id == TodosDocumentosOS[i].Status)
            {
                ProgressoDocumentos+=parseFloat(StatusDocumento[j].Progresso);
                break;
            }
        }
    }
    for(var i= 0; i < TodasVerificacoesOS.length; i++)
    {
        TotalVerificacoes++;
        for(var j = 0; j < StatusVerificacao.length; j++)
        {
            if(StatusVerificacao[j].id == TodasVerificacoesOS[i].Status)
            {
                ProgressoVerificacoes+=parseFloat(StatusVerificacao[j].Progresso);
                break;
            }
        }
    }
    for(var i= 0; i < TodosItensIntegracaoOS.length; i++)
    {
        TotalIntegracao++;
        for(var j = 0; j < StatusItensIntegracao.length; j++)
        {
            if(StatusItensIntegracao[j].id == TodosItensIntegracaoOS[i].StatusIntegracao)
            {
                ProgressoIntegracao+=parseFloat(StatusItensIntegracao[j].Progresso);
                break;
            }
        }
    }
    for(var i = 0; i < TodasEmissoesOS.length; i++)
    {
        TotalEmissao++;

        if(TodasEmissoesOS[i].StatusEmissao)
        {
            for(var j = 0; j < TodasEmissoesOS.length; j++)
            {
                if(StatusEmissao[j].id == TodasEmissoesOS[i].StatusEmissao)
                {
                    ProgressoEmissao+=parseFloat(StatusEmissao[j].Progresso);
                    break;
                }
            }

        }

    }
    var IDOS = $("#SelectOS").val()
    for(var i = 0; i < TodasOSs.length;i++)
    {
        if(TodasOSs[i].id == IDOS)
        {
            const date1 = new Date(TodasOSs[i].DataInicio);
            const date2 = new Date(TodasOSs[i].DataFinalPlanejamento);
            const diffTime = date2 - date1;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            //console.log(diffDays)
            const date3 = new Date(TodasOSs[i].DataInicio);
            const date4 = Date.now();
            const diffTime2 = date4 - date3;
            const diffDays2 = Math.ceil(diffTime2 / (1000 * 60 * 60 * 24));
            ProgressoOSDias = diffDays2;
            ProgressoOSPercentual = Math.round10(parseFloat(diffDays2 * 100 / diffDays),-2);
            //console.log(ProgressoOSDias)
            //console.log(ProgressoOSPercentual)
            break;
        }
    }
    var SomaTotal = TotalEstudo + TotalCalculo + TotalModelos + TotalDocumentos + TotalVerificacoes + TotalIntegracao + TotalEmissao;
    var ProgressoTotal = ProgressoEstudo + ProgressoCalculo + ProgressoModelos + ProgressoDocumentos + ProgressoVerificacoes + ProgressoIntegracao + ProgressoEmissao;
   var DtProgressoEtapas = [];

   var PercentualTotal = Math.round10((ProgressoTotal/SomaTotal) * 100,-2);
   var PercentualEstudos = Math.round10(ProgressoEstudo/TotalEstudo * 100,-2);
   var PercentualCalculo = Math.round10(ProgressoCalculo/TotalCalculo * 100,-2);
   var PercentualModelo = Math.round10(ProgressoModelos/TotalModelos * 100,-2);
   var PercentualDocumento = Math.round10(ProgressoDocumentos/TotalDocumentos * 100,-2);
   var PercentualVerificacao = Math.round10(ProgressoVerificacoes/TotalVerificacoes * 100,-2) ;
   var PercentualIntegracao = Math.round10(ProgressoIntegracao/TotalIntegracao * 100,-2);
   var PercentualEmissao = Math.round10(ProgressoEmissao/TotalEmissao * 100,-2);
   if(isNaN(PercentualTotal)) PercentualTotal = 0;
   if(isNaN(PercentualEstudos)) PercentualEstudos = 0;
   if(isNaN(PercentualCalculo)) PercentualCalculo = 0;
   if(isNaN(PercentualModelo)) PercentualModelo = 0;
   if(isNaN(PercentualDocumento)) PercentualDocumento = 0;
   if(isNaN(PercentualVerificacao)) PercentualVerificacao = 0;
   if(isNaN(PercentualIntegracao)) PercentualIntegracao = 0;
    if(isNaN(ProgressoOSPercentual)) ProgressoOSPercentual = 0;
    if(isNaN(PercentualEmissao)) PercentualEmissao = 0;
    DtProgressoEtapas.push({"NomeStatus": "Avanço Até Data Entrega", "QtdTotal": ProgressoOSDias, "QtdProcesso": ProgressoOSDias, "ProgressoPercentual": ProgressoOSPercentual, "Cor": RetornaCor(ProgressoOSPercentual), "CorBorda": RetornaCorBorda(ProgressoOSPercentual)});
    DtProgressoEtapas.push({"NomeStatus": "Progresso Total", "QtdTotal": SomaTotal, "QtdProcesso": ProgressoTotal, "ProgressoPercentual": PercentualTotal, "Cor": RetornaCor(PercentualTotal), "CorBorda": RetornaCorBorda(PercentualTotal)});
    DtProgressoEtapas.push({"NomeStatus": "Estudo/Conceito", "QtdTotal": TotalEstudo, "QtdProcesso": ProgressoEstudo, "ProgressoPercentual": PercentualEstudos, "Cor": RetornaCor(PercentualEstudos), "CorBorda": RetornaCorBorda(PercentualEstudos) });
    DtProgressoEtapas.push({"NomeStatus": "Cálculo", "QtdTotal": TotalCalculo, "QtdProcesso": ProgressoCalculo, "ProgressoPercentual": PercentualCalculo, "Cor": RetornaCor(PercentualCalculo), "CorBorda": RetornaCorBorda(PercentualCalculo)  });
    DtProgressoEtapas.push({"NomeStatus": "Modelo", "QtdTotal": TotalModelos, "QtdProcesso": ProgressoModelos, "ProgressoPercentual": PercentualModelo, "Cor": RetornaCor(PercentualModelo), "CorBorda": RetornaCorBorda(PercentualModelo) });
    DtProgressoEtapas.push({"NomeStatus": "Documento", "QtdTotal": TotalDocumentos, "QtdProcesso": ProgressoDocumentos, "ProgressoPercentual": PercentualDocumento, "Cor": RetornaCor(PercentualDocumento), "CorBorda": RetornaCorBorda(PercentualDocumento) });
    DtProgressoEtapas.push({"NomeStatus": "Verificação", "QtdTotal": TotalVerificacoes, "QtdProcesso": ProgressoVerificacoes, "ProgressoPercentual": PercentualVerificacao, "Cor": RetornaCor(PercentualVerificacao), "CorBorda": RetornaCorBorda(PercentualVerificacao) });
    DtProgressoEtapas.push({"NomeStatus": "Integração", "QtdTotal": TotalIntegracao, "QtdProcesso": ProgressoIntegracao, "ProgressoPercentual": PercentualIntegracao, "Cor": RetornaCor(PercentualIntegracao), "CorBorda": RetornaCorBorda(PercentualIntegracao) });
    DtProgressoEtapas.push({"NomeStatus": "Emissão", "QtdTotal": TotalEmissao, "QtdProcesso": ProgressoEmissao, "ProgressoPercentual": PercentualEmissao, "Cor": RetornaCor(PercentualEmissao), "CorBorda": RetornaCorBorda(PercentualEmissao) });

    return DtProgressoEtapas;
}
function RetornaCor(valor){
var CorRetornar = "";
    if(valor == 100) CorRetornar = "#27ae60";
    else if(valor < 20) CorRetornar = "#cd6155";
    else if(valor < 40) CorRetornar = "#e59866";
    else if(valor < 60) CorRetornar = "#f9e79f";
    else if(valor < 80) CorRetornar = "#5499c7";
    else if(valor < 100) CorRetornar = "#82e0aa";
    return CorRetornar;
}
function RetornaCorBorda(valor){
var CorRetornar = "";
    if(valor == 100) CorRetornar = "#196f3d";
    else if(valor < 20) CorRetornar = "#7b241c";
    else if(valor < 40) CorRetornar = "#a04000";
    else if(valor < 60) CorRetornar = "#9a7d0a";
    else if(valor < 80) CorRetornar = "#154360";
    else if(valor < 100) CorRetornar = "#28b463 ";
    return CorRetornar;
}
function PreencherDadosData()
{
   var DtCalculo = [];
            var EstudoConcluidoStatus = "";
              for(var i = 0; i < StatusEstudos.length; i++)
              {
                    if(StatusEstudos[i].Progresso == 1)
                    {
                        EstudoConcluidoStatus = StatusEstudos[i].id;
                        break;
                    }
              }
              for(var j = 0; j < TodosEstudosOS.length; j++)
              {
                  if(TodosEstudosOS[j].Status == EstudoConcluidoStatus)
                  {
                       const date1 = new Date(TodosEstudosOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodosEstudosOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                       for(var k = 0; k < DtCalculo.length; k++)
                       {
                            if(DtCalculo[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtCalculo[k].QTD--;
                                }
                                else
                                {
                                    DtCalculo[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtCalculo.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtCalculo.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }

    return DtCalculo;
}
function PreencherDadosDataCalculos(Todos)
{
   var DtCalculos = [];
     var CalculoConcluidoStatus = "";
              for(var i = 0; i < StatusCalculo.length; i++)
              {
                    if(StatusCalculo[i].Progresso == 1)
                    {
                        CalculoConcluidoStatus = StatusCalculo[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodosCalculosOS.length; j++)
              {
                  if(TodosCalculosOS[j].Status == CalculoConcluidoStatus)
                  {
                       const date1 = new Date(TodosCalculosOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodosCalculosOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                       for(var k = 0; k < DtCalculos.length; k++)
                       {
                            if(DtCalculos[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtCalculos[k].QTD--;
                                }
                                else
                                {
                                    DtCalculos[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtCalculos.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtCalculos.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtCalculos;
}
function PreencherDadosDataVerificacoes(Todos)
{
   var DtVerificacoes = [];
     var VerificacoeConcluidoStatus = "";
              for(var i = 0; i < StatusVerificacao.length; i++)
              {
                    if(StatusVerificacao[i].Progresso == 1)
                    {
                        VerificacoeConcluidoStatus = StatusVerificacao[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodasVerificacoesOS.length; j++)
              {
                  if(TodasVerificacoesOS[j].Status == VerificacoeConcluidoStatus)
                  {
                       const date1 = new Date(TodasVerificacoesOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodasVerificacoesOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                        for(var k = 0; k < DtVerificacoes.length; k++)
                       {
                            if(DtVerificacoes[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtVerificacoes[k].QTD--;
                                }
                                else
                                {
                                    DtVerificacoes[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtVerificacoes.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtVerificacoes.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtVerificacoes;
}
function PreencherDadosDataModelos(Todos)
{
   var DtModelos = [];
     var ModeloConcluidoStatus = "";
              for(var i = 0; i < StatusModelo.length; i++)
              {
                    if(StatusModelo[i].Progresso == 1)
                    {
                        ModeloConcluidoStatus = StatusModelo[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodosModelosOS.length; j++)
              {
                  if(TodosModelosOS[j].Status == ModeloConcluidoStatus)
                  {
                       const date1 = new Date(TodosModelosOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodosModelosOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                        for(var k = 0; k < DtModelos.length; k++)
                       {
                            if(DtModelos[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtModelos[k].QTD--;
                                }
                                else
                                {
                                    DtModelos[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtModelos.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtModelos.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtModelos;
}
function PreencherDadosDataModelos(Todos)
{
   var DtModelos = [];
     var ModeloConcluidoStatus = "";
              for(var i = 0; i < StatusModelo.length; i++)
              {
                    if(StatusModelo[i].Progresso == 1)
                    {
                        ModeloConcluidoStatus = StatusModelo[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodosModelosOS.length; j++)
              {
                  if(TodosModelosOS[j].Status == ModeloConcluidoStatus)
                  {
                       const date1 = new Date(TodosModelosOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodosModelosOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                        for(var k = 0; k < DtModelos.length; k++)
                       {
                            if(DtModelos[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtModelos[k].QTD--;
                                }
                                else
                                {
                                    DtModelos[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtModelos.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtModelos.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtModelos;
}
function PreencherDadosDataIntegracao(Todos)
{
   var DtIntegracoes = [];
     var ConcluidoStatus = "Integr. Aprovadas";
             
              for(var j = 0; j < TodasIntegracoesOS.length; j++)
              {
                  if(TodasIntegracoesOS[j].StatusAutomatico == ConcluidoStatus)
                  {
                       const date1 = new Date(TodasIntegracoesOS[j].DataPrazoIntegracao);
                       const date2 = new Date(TodasIntegracoesOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                        for(var k = 0; k < DtIntegracoes.length; k++)
                       {
                            if(DtIntegracoes[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtIntegracoes[k].QTD--;
                                }
                                else
                                {
                                    DtIntegracoes[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtIntegracoes.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtIntegracoes.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                       }
                  }
              }


    return DtIntegracoes;
}
function PreencherDadosDataDocumentos(Todos)
{
   var DtDocumentos = [];
     var DocumentoConcluidoStatus = "";
              for(var i = 0; i < StatusDocumento.length; i++)
              {
                    if(StatusDocumento[i].Progresso == 1)
                    {
                        DocumentoConcluidoStatus = StatusDocumento[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodosDocumentosOS.length; j++)
              {
                  if(TodosDocumentosOS[j].Status == DocumentoConcluidoStatus)
                  {
                       const date1 = new Date(TodosDocumentosOS[j].DataPlanejamentoInterno);
                       const date2 = new Date(TodosDocumentosOS[j].DataConclusao);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                       for(var k = 0; k < DtDocumentos.length; k++)
                       {
                            if(DtDocumentos[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtDocumentos[k].QTD--;
                                }
                                else
                                {
                                    DtDocumentos[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtDocumentos.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtDocumentos.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtDocumentos;
}
function PreencherDadosDataEmissao(Todos)
{
   var DtEmissao = [];
     var EmissaoConcluidaStatus = "";
              for(var i = 0; i < StatusEmissao.length; i++)
              {
                    if(StatusEmissao[i].Progresso == 1)
                    {
                        EmissaoConcluidaStatus = StatusEmissao[i].id;
                        break;
                    }
              }


              for(var j = 0; j < TodasEmissoesOS.length; j++)
              {
                  if(TodasEmissoesOS[j].StatusEmissao == EmissaoConcluidaStatus)
                  {
                       const date1 = new Date(TodasEmissoesOS[j].DataPrazoEmissao);
                       const date2 = new Date(TodasEmissoesOS[j].DataEmitido);
                       const diffTime = date2 - date1;
                       const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                       var achou = 0;
                       for(var k = 0; k < DtEmissao.length; k++)
                       {
                            if(DtEmissao[k].NumeroDias == diffDays)
                            {
                                achou = 1;
                                if(diffDays < 0)
                                {
                                    DtEmissao[k].QTD--;
                                }
                                else
                                {
                                    DtEmissao[k].QTD++;
                                }
                            }
                       }
                       if(achou == 0)
                       {
                                if(diffDays < 0)
                                {
                                     DtEmissao.push({"NumeroDias": diffDays, "QTD": -1});
                                }
                                else
                                {
                                    DtEmissao.push({"NumeroDias": diffDays, "QTD": 1});
                                }
                            
                       }
                  }
              }


    return DtEmissao;
}
function PreencherDadosEstudo()
{
   var DtEstudos = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusEstudos.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodosEstudosOS.length; j++)
              {

                  if(TodosEstudosOS[j].Status == StatusEstudos[i].id)
                  {
                        CountTotal++;
                        if(TodosEstudosOS[j].Responsavel == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtEstudos.push({"IDStatus":StatusEstudos[i].id, "NomeStatus": StatusEstudos[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtEstudos;
}
function PreencherDadosEmissao()
{
   var DtEmissao = [];
        ///Nao precisa verificar se é todos pois caso for, vai retornar quantidade 0, pois não existe usuario "Todos" no DB

          for(var i = 0; i < StatusEmissao.length; i++)
          {
              var CountTotal = 0;
              var CountUsuario = 0;

              for(var j = 0; j < TodasEmissoesOS.length; j++)
              {

                  if(TodasEmissoesOS[j].StatusEmissao == StatusEmissao[i].id)
                  {
                        CountTotal++;
                        if(TodasEmissoesOS[j].ResponsavelEmissao == Usuario)
                        {
                            CountUsuario++;
                        }
                  }
              }

              DtEmissao.push({"IDStatus":StatusEmissao[i].id, "NomeStatus": StatusEmissao[i].NomeStatus, "QtdTodos": CountTotal, "QtdUsuario": CountUsuario });
          }

    return DtEmissao;
}
function CriarDadosEstudo(){

 document.getElementById("loaderEstudos").style.display = "block";
 document.getElementById("GraficoEstudos").style.display = "none";

var DtEstudo = PreencherDadosEstudo();

var data = {};

            var ctx = document.getElementById("EstudosChart");
            var DtEstCht = document.getElementById("DataEstudosChart");
            if(EstudoChart)
            {
                EstudoChart.destroy();
            }
            if(DataEstudoChart)
            {
                DataEstudoChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtEstudo.length; i++)
             {
                QTDTotal += DtEstudo[i].QtdTodos;
             }
            DtEstCht.height = 100;
            ctx.height = 100;
                for(var i = 0; i < DtEstudo.length; i++)
                 {
                        var Porc = Math.round10(DtEstudo[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtEstudo[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtEstudo[i].QtdUsuario);
                       QtdTodos.push(DtEstudo[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };

                  EstudoChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosData(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                       if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataEstudoChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });





                      document.getElementById("loaderEstudos").style.display = "none";
                      $("#GraficoEstudos").show()


}
function CriarDadosEmissao(){

 document.getElementById("loaderEmissoes").style.display = "block";
 document.getElementById("GraficoEmissoes").style.display = "none";

var DtEmissao = PreencherDadosEmissao();

var data = {};

            var ctx = document.getElementById("EmissoesChart");
            var DtEstCht = document.getElementById("DataEmissoesChart");
            if(EmissoesChart)
            {
                EmissoesChart.destroy();
            }
            if(DataEmissoesChart)
            {
                DataEmissoesChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtEmissao.length; i++)
             {
                QTDTotal += DtEmissao[i].QtdTodos;
             }
            DtEstCht.height = 100;
            ctx.height = 100;
                for(var i = 0; i < DtEmissao.length; i++)
                 {
                        var Porc = Math.round10(DtEmissao[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtEmissao[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtEmissao[i].QtdUsuario);
                       QtdTodos.push(DtEmissao[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };

                  EmissoesChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataEmissao(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                       if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataEmissoesChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });





                      document.getElementById("loaderEmissoes").style.display = "none";
                      $("#GraficoEmissoes").show()


}
function CriarDadosCalculos(){

 document.getElementById("loaderCalculos").style.display = "block";
 document.getElementById("GraficoCalculos").style.display = "none";

var DtCalculo = PreencherDadosCalculos();

var data = {};

            var ctx = document.getElementById("CalculosChart");
            var DtEstCht = document.getElementById("DataCalculosChart");
            if(CalculosChart)
            {
                CalculosChart.destroy();
            }
            if(DataCalculosChart)
            {
                DataCalculosChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtCalculo.length; i++)
             {
                QTDTotal += DtCalculo[i].QtdTodos;
             }
            DtEstCht.width = 300;
            ctx.width = 300;

                for(var i = 0; i < DtCalculo.length; i++)
                 {
                        var Porc = Math.round10(DtCalculo[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtCalculo[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtCalculo[i].QtdUsuario);
                       QtdTodos.push(DtCalculo[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };
                  CalculosChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataCalculos(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                       if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataCalculosChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });





                      document.getElementById("loaderCalculos").style.display = "none";
                      $("#GraficoCalculos").show()


}
function CriarDadosVerificacoes(){

 document.getElementById("loaderVerificacoes").style.display = "block";
 document.getElementById("GraficoVerificacoes").style.display = "none";

var DtCalculo = PreencherDadosVerificacoes();

var data = {};

            var ctx = document.getElementById("VerificacoesChart");
            var DtEstCht = document.getElementById("DataVerificacoesChart");
            if(VerificacoesChart)
            {
                VerificacoesChart.destroy();
            }
            if(DataVerificacoesChart)
            {
                DataVerificacoesChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtCalculo.length; i++)
             {
                QTDTotal += DtCalculo[i].QtdTodos;
             }
            DtEstCht.width = 300;
            ctx.width = 300;

                for(var i = 0; i < DtCalculo.length; i++)
                 {
                        var Porc = Math.round10(DtCalculo[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtCalculo[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtCalculo[i].QtdUsuario);
                       QtdTodos.push(DtCalculo[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen", " #dc7633 "],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df", " #edbb99 "],
                        borderWidth: 2
                    }
                  ]
                };
                  VerificacoesChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataVerificacoes(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                        if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataVerificacoesChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });





                      document.getElementById("loaderVerificacoes").style.display = "none";
                      $("#GraficoVerificacoes").show()


}
function CriarDadosModelos(){

 document.getElementById("loaderModelos").style.display = "block";
 document.getElementById("GraficoModelos").style.display = "none";

var DtModelos = PreencherDadosModelos();

var data = {};

            var ctx = document.getElementById("ModelosChart");
            var DtEstCht = document.getElementById("DataModelosChart");
            if(ModelosChart)
            {
                ModelosChart.destroy();
            }
            if(DataModelosChart)
            {
                DataModelosChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtModelos.length; i++)
             {
                QTDTotal += DtModelos[i].QtdTodos;
             }
            DtEstCht.width = 300;
            ctx.width = 300;

                for(var i = 0; i < DtModelos.length; i++)
                 {
                        var Porc = Math.round10(DtModelos[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtModelos[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtModelos[i].QtdUsuario);
                       QtdTodos.push(DtModelos[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };
                  ModelosChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataModelos(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                        if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataModelosChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });
                      document.getElementById("loaderModelos").style.display = "none";
                      $("#GraficoModelos").show()
}
function CriarDadosDocumentos(){

 document.getElementById("loaderDocumentos").style.display = "block";
 document.getElementById("GraficoDocumentos").style.display = "none";

var DtDocumentos = PreencherDadosDocumentos();

var data = {};

            var ctx = document.getElementById("DocumentosChart");
            var DtEstCht = document.getElementById("DataDocumentosChart");
            if(DocumentosChart)
            {
                DocumentosChart.destroy();
            }
            if(DataDocumentosChart)
            {
                DataDocumentosChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtDocumentos.length; i++)
             {
                QTDTotal += DtDocumentos[i].QtdTodos;
             }
            DtEstCht.width = 300;
            ctx.width = 300;

                for(var i = 0; i < DtDocumentos.length; i++)
                 {
                        var Porc = Math.round10(DtDocumentos[i].QtdTodos / QTDTotal * 100, -2);
                        if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtDocumentos[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtDocumentos[i].QtdUsuario);
                       QtdTodos.push(DtDocumentos[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };
                  DocumentosChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataDocumentos(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                        if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                                CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataDocumentosChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });
                      document.getElementById("loaderDocumentos").style.display = "none";
                      $("#GraficoDocumentos").show()
}
function CriarDadosEtapas(){

 document.getElementById("loaderProgressoEtapas").style.display = "block";
 document.getElementById("GraficoProgressoEtapas").style.display = "none";

var DtProgressoEtapas = PreencherDadosProgressoEtapas();//{"NomeStatus": "Integração", "QtdTotal": TotalIntegracao, "QtdProcesso": ProgressoIntegracao, "ProgressoPercentual": PercentualIntegracao, "Cor": RetornaCor(PercentualIntegracao)

var data = {};

            var ctx = document.getElementById("ProgressoEtapasChart");

            if(ProgressoEtapasChart)
            {
                ProgressoEtapasChart.destroy();
            }
            if(DataProgressoEtapasChart)
            {
                DataProgressoEtapasChart.destroy();
            }
            var NomesEtapas = [];
            var CoresFundo = [];
            var CoresBorda = [];
            var QTds = [];

            ctx.width = 300;

                for(var i = 0; i < DtProgressoEtapas.length; i++)
                 {
                       var Porc = DtProgressoEtapas[i].ProgressoPercentual;
                       if(isNaN(Porc)) Porc = 0;
                       NomesEtapas.push(DtProgressoEtapas[i].NomeStatus + `(${Porc}%)`);
                       QTds.push(DtProgressoEtapas[i].ProgressoPercentual);
                       CoresFundo.push(DtProgressoEtapas[i].Cor);
                       CoresBorda.push(DtProgressoEtapas[i].CorBorda);
                 }
                 data = {
                  labels: NomesEtapas,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QTds,
                       borderColor: CoresBorda,
                       backgroundColor: CoresFundo,
                        borderWidth: 2
                    }
                  ]
                };
                  ProgressoEtapasChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               indexAxis: 'y',
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Progresso'
                                  },


                                }
                              },
                            });


                      document.getElementById("loaderProgressoEtapas").style.display = "none";
                      $("#GraficoProgressoEtapas").show()
}
function CriarDadosIntegracoes(){

 document.getElementById("loaderIntegracoes").style.display = "block";
 document.getElementById("GraficoIntegracoes").style.display = "none";

var DtIntegracoes = PreencherDadosIntegracoes();

var data = {};

            var ctx = document.getElementById("IntegracoesChart");
            var DtEstCht = document.getElementById("DataIntegracoesChart");
            if(IntegracoesChart)
            {
                IntegracoesChart.destroy();
            }
            if(DataIntegracoesChart)
            {
                DataIntegracoesChart.destroy();
            }
            var NomesStatus = [];
            var QtdUsuario = [];
            var QtdTodos = [];
            var QTDTotal = 0;
             for(var i = 0; i < DtIntegracoes.length; i++)
             {
                QTDTotal += DtIntegracoes[i].QtdTodos;
             }
            DtEstCht.width = 300;
            ctx.width = 300;

                for(var i = 0; i < DtIntegracoes.length; i++)
                 {
                       var Porc = Math.round10(DtIntegracoes[i].QtdTodos / QTDTotal * 100, -2);
                       if(isNaN(Porc)) Porc = 0;
                       NomesStatus.push(DtIntegracoes[i].NomeStatus + `(${Porc}%)`);
                       QtdUsuario.push(DtIntegracoes[i].QtdUsuario);
                       QtdTodos.push(DtIntegracoes[i].QtdTodos);
                 }
                 data = {
                  labels: NomesStatus,
                  datasets: [
                 {
                      label: 'Todos',
                      data: QtdTodos,
                       borderColor: [" #a93226 ", " #dc7633 ", "#f7dc6f", "limegreen"],
                       backgroundColor: [" #e6b0aa ", " #edbb99 ", "#fef9e7", "#dff7df"],
                        borderWidth: 2
                    }
                  ]
                };
                  IntegracoesChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                                responsive: true,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },
                                  title: {
                                    display: true,
                                    text: 'Controle Avanço'
                                  },

                                }
                              },
                            });

                var DadosData = PreencherDadosDataIntegracao(true);
                sortByKey(DadosData, "NumeroDias" );
                var NomesDias = [];
                var QtdsDias = [];
                var CoresBorda = [];
                var CoresFundo = [];

                for(var i = 0; i < DadosData.length; i++)
                 {

                       NomesDias.push(DadosData[i].NumeroDias);
                       QtdsDias.push(DadosData[i].QTD);
                        if(DadosData[i].NumeroDias < -5)
                       {
                            CoresBorda.push("limegreen");
                            CoresFundo.push("#dff7df");

                       }
                       else
                       if(DadosData[i].NumeroDias < 0)
                       {
                            CoresBorda.push("#f7dc6f");
                            CoresFundo.push("#fef9e7");
                       }
                        else
                       if(DadosData[i].NumeroDias < 5)
                       {
                            CoresBorda.push("#dc7633");
                            CoresFundo.push("#edbb99");

                       }
                       else
                       {
                              CoresBorda.push("#a93226");
                              CoresFundo.push("#e6b0aa");
                       }

                 }


               if(NomesDias.length == 0) NomesDias.push("Sem dados para os itens selecionados");
             var dataDias = {
                  labels: NomesDias,
                  datasets: [
                    {
                      label: "Dias de atraso (números negativos são entrega antecipada)",
                      data: QtdsDias,
                      borderColor: CoresBorda,
                      backgroundColor: CoresFundo,
                        borderWidth: 2
                    }

                  ]};

              DataIntegracoesChart = new Chart(DtEstCht, {
                  type: 'bar',
                  data: dataDias,
                  options: {
                               scale: {
                                    ticks: {
                                      precision: 0
                                    }
                                  },
                        maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        display: false,
                      },
                      title: {
                        display: true,
                        text: 'Controle Data Entrega'
                      },

                    }
                  },
                });
                      document.getElementById("loaderIntegracoes").style.display = "none";
                      $("#GraficoIntegracoes").show()
}

async function RetornaStatusVerificacaoAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusVerificacoes/",
      method: "GET",
      data: { }
    });

   return request;
}

async function RetornaStatusEstudoAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEstudo/",
      method: "GET",
      data: { }
    });

   return request;
}
async function RetornaStatusDocumentoAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusDocumento/",
      method: "GET",
      data: { }
    });

   return request;
}

async function RetornaStatusCalculoAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusCalculo/",
      method: "GET",
      data: { }
    });

   return request;
}
async function RetornaStatusItemIntegracaoAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornaStatusIntegracao/",
      method: "GET",
      data: {}
    });

   return request;
}

async function RetornaStatusModeloAsync(){

let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusModelo/",
      method: "GET",
      data: {}
    });

   return request;
}
async function RetornaStatusEmissao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEmissao/",
      method: "GET",
      data: { }
    });

   return request;

}
async function SelectOSChanged()
{

     if($("#SelectOS option:selected").text() != "---------")
    {
     $("#loaderProgressoEtapas").show();
        IDOS = $("#SelectOS option:selected").val();
        TodosEstudosOS = await RetornarTodosEstudos();
        //console.log(TodosEstudosOS);
        TodasEmissoesOS = await RetornarTodasEmissoes();
        TodosCalculosOS = await RetornarTodosCalculos();
        TodosModelosOS = await RetornarTodosModelos();
        TodosDocumentosOS = await RetornarTodosDocumentos();
        TodasVerificacoesOS = await RetornarTodasVerificacoes();
        TodasIntegracoesOS = await RetornarTodasIntegracoes();
        TodosItensIntegracaoOS = await RetornarTodosItensIntegracao();
        TodasOSs = await RetornarOSs();
        CriarGraficos();
    }
    else
    {
            if(ProgressoEtapasChart)
            {
                ProgressoEtapasChart.destroy();
            }
            if(EstudoChart)
            {
                EstudoChart.destroy();
            }
            if(DataEstudoChart)
            {
                DataEstudoChart.destroy();
            }
            if(CalculosChart)
            {
                CalculosChart.destroy();
            }
            if(DataCalculosChart)
            {
                DataCalculosChart.destroy();
            }
             if(ModelosChart)
            {
                ModelosChart.destroy();
            }
             if(DataModelosChart)
            {
                DataModelosChart.destroy();
            }
             if(DocumentosChart)
            {
                DocumentosChart.destroy();
            }
             if(DataDocumentosChart)
            {
                DataDocumentosChart.destroy();
            }
             if(VerificacoesChart)
            {
                VerificacoesChart.destroy();
            }
             if(DataVerificacoesChart)
            {
                DataVerificacoesChart.destroy();
            }
            if(IntegracoesChart)
            {
                IntegracoesChart.destroy();
            }
            if(DataIntegracoesChart)
            {
                DataIntegracoesChart.destroy();
            }
              if(EmissoesChart)
            {
                EmissoesChart.destroy();
            }
            if(DataEmissoesChart)
            {
                DataEmissoesChart.destroy();
            }


    }
}


$(function() {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
function sortByKey(array, key) {
    return array.sort(function(a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}