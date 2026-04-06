var SomenteNaoConcluidos = true;
var AreasIntegracao = []
var StatusIntegracao = []
var StatusEmissao = []
var Usuarios = []
$( document ).ready(function() {
PegarUsuarios();




      IDAtividade = $("#IDAtiv").html();



});
$(function() {
  var f = function() {
    $(this).next().text($(this).is(':checked') ? ':checked' : ':not(:checked)');
  };
  $('input').change(f).trigger('change');
});

$("#RemoverConcluídos").change(async function() {
    var Texto = $(this).next().text();
    if(Texto == "")
    {
        if(($(this).attr("checked")) != "checked")
        {
            Texto = ':checked';

        }
        else
        {
            Texto = ":not(:checked)";

        }


    }

    if(Texto == ":not(:checked)") {
        SomenteNaoConcluidos = true;
        await CarregarMinhasAtividades(true);
    }
    else
    {
            SomenteNaoConcluidos = false;
        await CarregarMinhasAtividades(false);
    }
});

async function CarregarMinhasAtividades(SemConcluidos)
{
    document.getElementById("TabelaAtivs").style.display = "none";
    $("#LoaderCarregar").show();
    var OSs = await RetornaOSs();
    var Atividades = await RetornarAtividades();
    var Estudos = await RetornaEstudos(SemConcluidos);
    var StatusEstudos = await RetornaStatusEstudos();
    var Calculos = await RetornaCalculos(SemConcluidos);
    var StatusCalculos = await RetornaStatusCalculos();
    var Modelos = await RetornaModelos(SemConcluidos);
    var StatusModelos = await RetornaStatusModelos();
    var Documentos = await RetornaDocumentos(SemConcluidos);
    var StatusDocumentos = await RetornaStatusDocumentos();
    var Verificacoes = await RetornaVerificacoes(SemConcluidos);
    var StatusVerificacoes = await RetornaStatusVerificacao();
    var ItensIntegracaoT = await RetornaItensIntegracao(SemConcluidos);
    var StatusIntegracao = await RetornaStatusIntegracao();
    var IntegracoesT = await RetornaIntegracoes(SemConcluidos);
    StatusEmissao = await RetornaStatusEmissao();
    var Integracoes = [];
    var ItensIntegracao = []
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

    //console.log(StatusEstudos)
    //console.log(StatusCalculos)
    //console.log(StatusModelos)
    //console.log(StatusDocumentos)
    //console.log(StatusVerificacoes)
    //console.log(StatusIntegracao)
    //console.log(Estudos)
    //console.log(Calculos);
    //console.log(Modelos);
    //console.log(Documentos);
    //console.log(Verificacoes);
    //console.log(ItensIntegracao);
    //console.log(Integracoes);



    if($( "#TabelaAtividades" ).html() != "")
    {
        $('#TabelaAtividades').DataTable().clear().destroy(false);
        $('#TabelaAtividades').empty();
        $("#TabelaAtividades tbody").empty();
        $("#TabelaAtividades thead").empty();
    }
    var DataArquivos = [];
    for(var i = 0; i < Estudos.length; i++)
    {



        var OBJ = Estudos[i];
        var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
            if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == Estudos[i].OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }
        for(var j = 0; j < StatusEstudos.length; j++)
        {
            if(StatusEstudos[j].id == Estudos[i].Status)
            {
                Status = StatusEstudos[j].NomeStatus;
                break;
            }
        }
         var date = new Date(OBJ.DataPlanejamentoInterno);
         date.setDate(date.getDate() + 1)
         var dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;

         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
          HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/Estudo/${OBJ.id}'" class="centerbtn shadow-sm btn btn-success btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Estudo">Estudo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Estudo/Conceito",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
    }
    for(var i = 0; i < Calculos.length; i++)
    {
        var OBJ = Calculos[i];
         var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
           if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }
        for(var j = 0; j < StatusCalculos.length; j++)
        {
            if(StatusCalculos[j].id == OBJ.Status)
            {
                Status = StatusCalculos[j].NomeStatus;
                break;
            }
        }
         var date = new Date(OBJ.DataPlanejamentoInterno);
         date.setDate(date.getDate() + 1)
         var dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;

         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
         HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/Calculo/${OBJ.id}'" class="centerbtn shadow-sm btn btn-warning btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Cálculo">Cálculo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Cálculo",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
    }
    for(var i = 0; i < Modelos.length; i++)
    {
        var OBJ = Modelos[i];
         var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
            if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }
        for(var j = 0; j < StatusModelos.length; j++)
        {
            if(StatusModelos[j].id == OBJ.Status)
            {
                Status = StatusModelos[j].NomeStatus;
                break;
            }
        }
         var date = new Date(OBJ.DataPlanejamentoInterno);
         date.setDate(date.getDate() + 1)
         var dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;

         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
          HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/Modelo/${OBJ.id}'" class="centerbtn shadow-sm btn btn-danger btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Modelo">Modelo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Modelo",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
    }
    for(var i = 0; i < Documentos.length; i++)
    {
        var OBJ = Documentos[i];
         var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
            if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }
        for(var j = 0; j < StatusDocumentos.length; j++)
        {
            if(StatusDocumentos[j].id == OBJ.Status)
            {
                Status = StatusDocumentos[j].NomeStatus;
                break;
            }
        }
         var date = new Date(OBJ.DataPlanejamentoInterno);
         date.setDate(date.getDate() + 1)
         var dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;

         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
          HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/Documento/${OBJ.id}'" class="centerbtn shadow-sm btn btn-info btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Documento">Documento <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Documento",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
    }
    for(var i = 0; i < Verificacoes.length; i++)
    {
        var OBJ = Verificacoes[i];
         var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
           if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }
        for(var j = 0; j < StatusVerificacoes.length; j++)
        {
            if(StatusVerificacoes[j].id == OBJ.Status)
            {
                Status = StatusVerificacoes[j].NomeStatus;
                break;
            }
        }
         var date = new Date(OBJ.DataPlanejamentoInterno);
         date.setDate(date.getDate() + 1)
         var dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;

         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
         if(OBJ.Modelo)
         {
          HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/VerificacaoModelo/${OBJ.id}'" class="centerbtn shadow-sm btn btn-outline-danger btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Verificação de Modelo">Verificação Modelo <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Verificação Modelo",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
        }
        else if(OBJ.Documento)
        {
          HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/VerificacaoDocumento/${OBJ.id}'" class="centerbtn shadow-sm btn btn-outline-info btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Verificação de Documento">Verificação Documento <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Verificação Documento",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
        }
    }
    for(var i = 0; i < Integracoes.length; i++)
    {
        var OBJ = Integracoes[i];
        var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
            if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        var OS = "";
        var Status = OBJ.StatusAutomatico;
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }

        var dtPlanej = "Data Não Especificada";
         if(OBJ.DataPrazoIntegracao)
         {
             var date = new Date(OBJ.DataPrazoIntegracao);
             date.setDate(date.getDate() + 1)
             dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;
         }
         var DataConclusao = "Não Concluído";
         if(OBJ.DataConclusao)
         {
           var date1 = new Date(OBJ.DataConclusao);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
         HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/Integracao/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-secondary btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Integração">Integração <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Controle Integração",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
    }
    for(var i = 0; i < ItensIntegracao.length; i++)
    {
        var OBJ = ItensIntegracao[i];
         var Atividade;
        for(var j = 0; j < Atividades.length; j++)
        {
            if(OBJ.Atividade == Atividades[j].id)
            {
                 Atividade = Atividades[j];
                break;
            }
        }
        //console.log(OBJ);
        var OS = "";
        var Status = "";
        for(var j = 0; j < OSs.length; j++)
        {
            if(OSs[j].id == OBJ.OS)
            {
                OS = OSs[j].OS;
                break;
            }
        }

           for(var j = 0; j < StatusIntegracao.length; j++)
        {
            if(StatusIntegracao[j].id == OBJ.StatusIntegracao)
            {
                Status = StatusIntegracao[j].Status;
                break;
            }
        }
        //console.log(Status);
        //console.log(SemConcluidos)

        var dtPlanej = "Data Não Especificada";
         if(OBJ.DataPrazoIntegracao)
         {
             var date = new Date(OBJ.DataPrazoIntegracao);
             date.setDate(date.getDate() + 1)
             dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;
         }
         var DataConclusao = "Não Analisado";
         if(OBJ.DataPreenchimento)
         {
           var date1 = new Date(OBJ.DataPreenchimento);
            date1.setDate(date.getDate() + 1)
            DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
         }
         HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${OBJ.Atividade}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
         HTMLBotao += `<button value="" onclick="window.location='/app/civil/ItemIntegracao/${OBJ.id}'" class="centerbtn shadow-sm btn btn-outline-dark btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Aprovação de Integração">Aprovação de Integração <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
        </svg></button>`;
        HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"
        DataArquivos.push(["Aprovação de Integração",OS, Atividade.CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])

    }

    var UserName = $("#UsuarioCheck").html();
    for(var n = 0; n < Atividades.length; n++)
        {
            if(Atividades[n].ResponsavelEmissao == UserName)
            {
                 if((SomenteNaoConcluidos==true && Atividades[n].DataEmitido == null) || SomenteNaoConcluidos==false)
                 {
                     var dtPlanej = "Data Não Especificada";
                     if(Atividades[n].DataPrazoEmissao)
                     {
                         var date = new Date(Atividades[n].DataPrazoEmissao);
                         date.setDate(date.getDate() + 1)
                         dtPlanej =  (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() ;
                     }
                     var DataConclusao = "Não Emitido";
                     if(Atividades[n].DataEmitido)
                     {
                       var date1 = new Date(Atividades[n].DataEmitido);
                        date1.setDate(date.getDate() + 1)
                        DataConclusao =  (date1.getDate()) + "/" + (date1.getMonth()+1) + "/" + date1.getFullYear() ;
                     }
                      var OS = "";
                    var Status = "";
                    for(var j = 0; j < OSs.length; j++)
                    {
                        if(OSs[j].id == Atividades[n].OS)
                        {
                            OS = OSs[j].OS;
                            break;
                        }
                    }
                    if(Atividades[n].StatusEmissao != null)
                    {
                         for(var y = 0; y < StatusEmissao.length; y++)
                        {
                            if(StatusEmissao[y].id == Atividades[n].StatusEmissao)
                            {
                                Status = StatusEmissao[y].NomeStatus;
                                break;
                            }
                        }
                    }
                    else
                    {
                        Status = "Não Iniciada"
                    }

                      HTMLBotao = `<button value="" onclick="window.location='/app/civil/DetalhesAtividade/${Atividades[n].id}'" class="centerbtn shadow-sm btn btn-primary btn-sm" style="padding: 2px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; margin-right: 5px" title="Acessar Atividade">Atividade <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                    </svg></button>`;
                     HTMLBotao += `<button value="" onclick="window.location='/app/civil/Emissao/${Atividades[n].id}'" class="centerbtn shadow-sm btn btn-outline-dark btn-sm" style="padding: 2px; font-size:100%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;" title="Acessar Aprovação de Integração">Emissão <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"></path>
                    </svg></button>`;
                    HTMLBotao = `<div style="display: inline-flex;">` + HTMLBotao + "</div>"

                    DataArquivos.push(["Emissão",OS, Atividades[n].CodigoDocumento, dtPlanej, DataConclusao, Status, HTMLBotao])
                }
            }
        }
    $('#TabelaAtividades').DataTable( {
        data: DataArquivos,
        columns: [
            { title: "Etapa" },
            { title: "OS" },
            { title: "Código Documento" },
            { title: "Data Planejamento" },
            { title: "Data Conclusão"  },
            { title: "Status" },
            { title: "Acessar" },
        ],
        columnDefs: [
            // Center align the header content of column 1
           { className: "dt-center", targets: [ 0, 1, 2, 3, 4, 5, 6 ] },

        ],
           "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
         "pageLength": 10,
              "language": {
          "emptyTable": "Nenhuma Atividade Encontrada.",
          "search": "Pesquisar",
            "paginate": {
            "first":      "Primeiro",
            "last":       "Último",
            "next":       "Próximo",
            "previous":   "Anterior"
            },
            "lengthMenu":     "Mostrar _MENU_ ",
              "info":           "Mostrando atividades _START_ à _END_ de um total de _TOTAL_",
              "infoEmpty":      "Sem atividades",
              "infoFiltered":   "(Filtrando de um total de _MAX_)",
        }


        } );
        table = $('#TabelaAtividades').DataTable();
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );


    $("#TabelaAtivs").show();
    document.getElementById("LoaderCarregar").style.display = "none";
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
async function RetornaStatusEmissao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEmissao/",
      method: "GET",
      data: { }
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
function CarregarMinhasAtividadesasd()
{
    var Atividades = [];
         var request = $.ajax({
      url: "/app/civil/RetornaMinhasAtividades/",
      method: "GET",
      data: { IDIntegracao: $("#SelectIntegracoes").val()}
    });

    request.done(function( dt ) {
            dt.forEach((Arq) =>{
                Atividades.push(Arq);
            })

               $('#MensagemAtividades').html();
               if($( "#TabelaAtividades" ).html() != "")
                {
                    $('#TabelaAtividades').DataTable().clear().destroy(false);
                    $('#TabelaAtividades').empty();
                    $("#TabelaAtividades tbody").empty();
                    $("#TabelaAtividades thead").empty();
                }
                var DataAtividades = [];
                for(var i = 0; i < Atividades.length; i++)
                {
                    var Extensao = Atividades[i].Arquivo.split('.').pop().toUpperCase();
                    var UsuarioNome = "";
                    for(var j = 0; j < Usuarios.length; j++)
                    {

                        if(Usuarios[j].Usuario == Atividades[i].Responsavel)
                        {
                            UsuarioNome = Usuarios[j].Nome;
                            break;
                        }
                    }
                      var date = new Date(Atividades[i].DataUpload);
                        date.setDate(date.getDate() + 1)
                       var Data = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                        var NomeArquivo = Atividades[i].Arquivo.split(/(\\|\/)/g).pop();

                                         var Path = "ArquivosAtividades" + Arquivos[i].Arquivo.split("ArquivosAtividades")[1];
                    var BotaoDownload = `<a href="/app/civil/Download/${Path}" download target="_blank"><button type="button" title="Download ${NomeArquivo}" style="height:32px; font-size:100%"
                        class="subscribe btn btn-warning  rounded-pill shadow-sm flex-item" id="download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
                    </svg>
                </button></a>`;
                    var BotaoExcluir = `<button type="button" title="Excluir Arquivo" onclick="ExcluirArquivo(${Atividades[i].id})" style="height:32px; font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important"
                        class="subscribe btn btn-danger  rounded-pill shadow-sm flex-item" id="download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    </button>`;
                    DataAtividades.push([Atividades[i].DescricaoArquivo, UsuarioNome, Data, Extensao, BotaoDownload, BotaoExcluir])
                }
                $('#TabelaAtividades').DataTable( {
                    data: DataAtividades,
                    columns: [
                        { title: "Descrição" },
                        { title: "Responsável", width: "200px" },
                        { title: "Data", width: "100px"  },
                        { title: "Extensão", width: "100px" },
                        { title: "Download", width: "40px" },
                        { title: "Excluir", width: "40px" },
                    ],
                    columnDefs: [
                        // Center align the header content of column 1
                       { className: "dt-center", targets: [ 1, 2, 3, 4, 5 ] },

                    ],
                       "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
                     "pageLength": 10,
                          "language": {
                      "emptyTable": "Nenhum Arquivo Encontrado.",
                      "search": "Pesquisar",
                        "paginate": {
                        "first":      "Primeiro",
                        "last":       "Último",
                        "next":       "Próximo",
                        "previous":   "Anterior"
                        },
                        "lengthMenu":     "Mostrar _MENU_ ",
                          "info":           "Mostrando Atividades _START_ à _END_ de um total de _TOTAL_",
                          "infoEmpty":      "Sem Atividades",
                          "infoFiltered":   "(Filtrando de um total de _MAX_)",
                    }


                    } );
                    table = $('#TabelaAtividades').DataTable();
                    $('#button').click( function () {
                        table.row('.selected').remove().draw( false );
                    } );


    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });

}



function PegarUsuarios()
{
     var request = $.ajax({
      url: "/app/civil/RetornarUsuariosLista/",
      method: "GET",
      data: { }
    });

    request.done(function( dt ) {
            dt.forEach((User) =>{
                Usuarios.push(User);
            })
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
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
