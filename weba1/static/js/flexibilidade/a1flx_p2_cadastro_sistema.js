var DadosImportacao = [];
var LinhasOS;
var ValorProgressBar = 0;
var QtdTotalDados = 0;
var Erros = []

var OS;
window.onload = async function() {
    OS = $("#OS").html();
};
function voltar()
{
    $("#osenviar").val(OS)
    $("#num_os").val(OS).change();
 
    
}

$('#ArquivoUploadInput').attr('accept', ".xlsx");
$('input:file').change(
    function(e){
    $('#id_NomeDoArquivo').val(e.target.files[0].name);
    $('#id_NomeDoArquivolbl').html(e.target.files[0].name);
});
function AplicarAlteracoes()
{
    var QtdErrosNaoSolucionados = 0;
    for(var i = 0; i < DadosImportacao.length; i++)
    {
        for (let [key, value] of Object.entries(DadosImportacao[i].Erros))
        {
            if(value.Status == "Aguardando Aprovação")
            {
                QtdErrosNaoSolucionados++;
            }
        }
    }
    if(QtdErrosNaoSolucionados > 0)
    {
        $("#TituloErro").html("Solucione os erros!")
         $("#AvisoConclusao").html(`<div class="alert alert-danger" role="alert">
          Existem ${QtdErrosNaoSolucionados} pendência(s) não solucionada(s)!
          <div class="tenor-gif-embed" data-postid="12916526" data-share-method="host" data-width="100%" data-aspect-ratio="1.7719298245614032"><a href="https://tenor.com/view/fausto-silva-faustop-meme-errou-err%c3%b4-gif-12916526">Fausto Silva Faustop GIF</a> from <a href="https://tenor.com/search/faustosilva-gifs">Faustosilva GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>
        </div>`);
        $("#AvisoOK").modal('show')
    }
    else
    {
        var DadosImportacaoFiltrado = []
         for(var i = 0; i < DadosImportacao.length; i++)
        {
            if(Object.keys(DadosImportacao[i].Erros).length > 0)
            {
                DadosImportacaoFiltrado.push(DadosImportacao[i])
            }
        }
          $("#AvisosAplicar").html(`<center><div class="alert alert-warning alert-dismissible fade show" style="margin-top: 10px;" role="alert"><strong>Aplicando Alterações no Banco de Dados</strong></div></center>`);
          $("#BotaoAplicar").hide()
          var IDOS = $("#SelectOS option:selected").val();
          Erros = []
          var TaskID = makeid(10);
          var progressUrl = `/celery-progress/${TaskID}/`;

                CeleryProgressBar.initProgressBar(progressUrl, {
             onSuccess: processResult,
             onProgress: customProgress

                });
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        //console.log(DadosImportacaoFiltrado)
        document.getElementById('progress-bar-message').innerHTML = (
                "Inicializando..."
                );
                $("#ProgressCelery").show()
            $.ajax({

                url: `/app/flexibilidade/sistemas/cadastrar/${OS}/`, // the endpoint
                type : "POST", // http method
                dataType : "json",
                data: { Aplicar: true, "TaskID": TaskID, Itens: JSON.stringify(DadosImportacaoFiltrado), "IDOS": IDOS, 'csrfmiddlewaretoken': csrf[0].value}, // data sent with the post request

                // handle a successful response
                success : function(json) {
                        Erros = json['Erros']
                         $("#progress").html("");
                         $("#ProgressCelery").hide()
                        if(Erros.length > 0)
                        {
                            for(var i = 0; i < Erros.length; i++)
                            {
                                Erros.push(`<p>${Erros[i]}</p>`)
                            }
                              $("#TituloErro").html("Solucione os erros!")
                             $("#AvisoConclusao").html(`<div class="alert alert-danger" role="alert">
                              Ocorreram erros:
                              ${Erros}
                              <div class="tenor-gif-embed" data-postid="12916526" data-share-method="host" data-width="100%" data-aspect-ratio="1.7719298245614032"><a href="https://tenor.com/view/fausto-silva-faustop-meme-errou-err%c3%b4-gif-12916526">Fausto Silva Faustop GIF</a> from <a href="https://tenor.com/search/faustosilva-gifs">Faustosilva GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>
                            </div>`);
                             $("#BotaoAplicar").show()
                        }
                        else
                        {
                                 $("#AvisoConclusao").html(`<div class="alert alert-success" role="alert">
                              Dados Atualizados com Sucesso!!
                            <div class="tenor-gif-embed" data-postid="13729449" data-share-method="host" data-width="100%" data-aspect-ratio="1.0"><a href="https://tenor.com/view/faustop-faustao-fausto-silva-faust%c3%a3o-meme-gif-13729449">Faustop Faustao GIF</a> from <a href="https://tenor.com/search/faustop-gifs">Faustop GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>
                            </div>`);
                            $("#TituloErro").html("Processo Concluído!")
                        }
                             $("#AvisoOK").modal('show')
                             $("#AvisosAplicar").html('')
                             DadosImportacao = []
                    },

                // handle a non-successful response
                error : function(xhr,errmsg,err) {
                    $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                }
            });



    }
}

async function GetLinhasOS(OrdemSer){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaLinhasOS/",
      method: "GET",
      data: { 'OS': OrdemSer }
    });

   return request;

}

function AtualizarProgressBar()
{
    ValorProgressBar+=1;
    var valor = parseInt(ValorProgressBar*100/QtdTotalDados)
    var cor = '';
    if(Erros.length > 0)
        cor = 'bg-danger';
    $("#progress").html(`<div class="progress">
        <div class="progress-bar ${cor}" role="progressbar" aria-valuenow="${valor}" aria-valuemin="0" aria-valuemax="100" style="width: ${valor}%">${ValorProgressBar}/${QtdTotalDados}</div>
    </div>`);
}
function ProcessarDadosArquivo(Dados)
{
    ValorProgressBar = 0;
    QtdTotalDados = Dados.length;
    $("#progress").html(`<div class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%">${ValorProgressBar}/${QtdTotalDados}</div>
    </div>`);
    for(var i = 0; i < Dados.length; i++)
    {
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        const fd = new FormData()
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Item", JSON.stringify(Dados[i]))
        fd.append("ValidarUnitario", true)

        $.ajax({
            type: 'post',

            url: `/app/flexibilidade/sistemas/cadastrar/${OS}/`,

            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){

            },
            success: function(response){
                AtualizarProgressBar()
                //console.log(response);
                //DadosImportacao = response["Dados"]
                var Erro = response["Erro"]
                DadosImportacao.push(Erro)
                if(DadosImportacao.length == Dados.length)
                {
                    PreencherTabelaDados();
                    $("#progress").html("");
                }
                 //var ID = response["id"]
                 //window.location.href = "/app/civil/RelatoriosProgressoCadastro/"+ID+"/";
            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })
    }
}


function processResult(resultElement, result) {
	 document.getElementById('progress-bar-message').innerHTML = (
        "Processo Concluído!"
        );
         $("#ProgressCelery").hide()
        //window.location.replace('/app/flexibilidade/DetalhesSistema/'+OS+'/'+Sistema+"/"+Rev);
	}

function customProgress(progressBarElement, progressBarMessageElement, progress) {
    progressBarElement.innerHTML = progress.percent + '%';
    progressBarMessageElement.innerHTML = (
     progress.description
    );
    progressBarElement.style.width = progress.percent + "%";
}

function ValidarArquivo()
{
    //$("#loaderTabelaSistema").show();
    $("#MensagemloaderTabelaSistema").show();
    const input = document.getElementById("ArquivoUploadInput")
    if(input.files.length == 0)
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Selecione um arquivo!
        </div>`);
        return;
    }
    $("#ErroArquivo").html("");

        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        const fd = new FormData()
        const file_data = input.files[0]
        var TaskID = makeid(10);
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Arquivo", file_data)
        fd.append("Validar", true)
        fd.append("TaskID", TaskID)
        fd.append("IDOS", $("#SelectOS option:selected").val())
                var progressUrl = `/celery-progress/${TaskID}/`;

                CeleryProgressBar.initProgressBar(progressUrl, {
             onSuccess: processResult,
             onProgress: customProgress
           });

        document.getElementById('progress-bar-message').innerHTML = (
                "Inicializando..."
                );
        $.ajax({
            type: 'post',
            url: `/app/flexibilidade/sistemas/cadastrar/${OS}/`,
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){
                $("#ProgressCelery").show()
            },
            success: function(response){
                //console.log(response);
                DadosImportacao = response["Erros"]
                $("#ProgressCelery").hide()
                LinhasOSRev = response["Linhas"]
                LinhasOS = []
                for (var k = 0; k < LinhasOSRev.length; k++)
                {
                    var TodosFields = LinhasOSRev[k].fields;
                    TodosFields["tb_pf_id"] = LinhasOSRev[k].pk;
                    LinhasOS.push(TodosFields);
                }
                PreencherTabelaDados();
                 //var ID = response["id"]
                 //window.location.href = "/app/civil/RelatoriosProgressoCadastro/"+ID+"/";
            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })

}
function RetornaNomeErroFormatado(NomeErro)
{
    if(NomeErro == "TemperaturaProjeto") return "Temperatura de Projeto";
    if(NomeErro == "TemperaturaOperacao") return "Temperatura de Operação";
    if(NomeErro == "PressaoProjeto") return "Pressão de Projeto";
    if(NomeErro == "PressaoOperacao") return "Pressão de Operação";
    if(NomeErro == "PressaoHidro") return "Pressão Hidrostática";
    if(NomeErro == "Area") return "Área";
    if(NomeErro == "NomeLinha") return "Tag da Linha";
    return NomeErro;
}
async function PreencherDadosLinhaExistente(IDLinha, Index)
{

let request;
      request = await $.ajax({
      url: "/app/flexibilidade/sistemas/dados/P2RetornaDadosLinha/",
        type: 'GET',
        data: { ID: IDLinha },
    });
    var DadosLinha = request[0];
    //console.log(request);
   if(DadosImportacao[Index].Erros["Sistema"].ValorNovo != DadosLinha.Sistema)
   {
       DadosImportacao[Index].Erros["Sistema"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["Sistema"].ValorAntigo = DadosLinha.Sistema;
   }
   if(DadosImportacao[Index].Erros["TemperaturaProjeto"].ValorNovo != DadosLinha.TemperaturaProjeto)
   {
       DadosImportacao[Index].Erros["TemperaturaProjeto"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["TemperaturaProjeto"].ValorAntigo = DadosLinha.TemperaturaProjeto;
   }
    if(DadosImportacao[Index].Erros["TemperaturaOperacao"].ValorNovo != DadosLinha.TemperaturaOperacao)
   {
       DadosImportacao[Index].Erros["TemperaturaOperacao"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["TemperaturaOperacao"].ValorAntigo = DadosLinha.TemperaturaOperacao;
   }
     if(DadosImportacao[Index].Erros["PressaoProjeto"].ValorNovo != DadosLinha.PressaoProjeto)
   {
       DadosImportacao[Index].Erros["PressaoProjeto"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["PressaoProjeto"].ValorAntigo = DadosLinha.PressaoProjeto;
   }
     if(DadosImportacao[Index].Erros["PressaoOperacao"].ValorNovo != DadosLinha.PressaoOperacao)
   {
       DadosImportacao[Index].Erros["PressaoOperacao"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["PressaoOperacao"].ValorAntigo = DadosLinha.PressaoOperacao;
   }
     if(DadosImportacao[Index].Erros["PressaoHidro"].ValorNovo != DadosLinha.PressaoHidro)
   {
       DadosImportacao[Index].Erros["PressaoHidro"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["PressaoHidro"].ValorAntigo = DadosLinha.PressaoHidro;
   }
     if(DadosImportacao[Index].Erros["Area"].ValorNovo != DadosLinha.Area)
   {
       DadosImportacao[Index].Erros["Area"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["Area"].ValorAntigo = DadosLinha.Area;
   }
     if(DadosImportacao[Index].Erros["Remark"].ValorNovo != DadosLinha.Remark)
   {
       DadosImportacao[Index].Erros["Remark"].Status = "Aguardando Aprovação";
       DadosImportacao[Index].Erros["Remark"].ValorAntigo = DadosLinha.Remark;
   }

}

async function AlterarCorBotaoAprovacao(Status, IDOK, IDNOK, Index, Key)
{
    var Botao = document.getElementById("BotaoErro"+Index)
    var BotaoAprovado = document.getElementById(IDOK);
    var BotaoReprovado = document.getElementById(IDNOK);
    DadosImportacao[Index].Erros[Key].Status = Status;
    if(Status == "Aprovado")
    {
        BotaoAprovado.classList.remove('btn-outline-success');
        BotaoAprovado.classList.add('btn-success');
        BotaoReprovado.classList.add('btn-outline-danger');
        BotaoReprovado.classList.remove('btn-danger');
    }
    else
    if(Status == "Reprovado")
    {
        BotaoAprovado.classList.remove('btn-success');
        BotaoAprovado.classList.add('btn-outline-success');
        BotaoReprovado.classList.add('btn-danger');
        BotaoReprovado.classList.remove('btn-outline-danger');
    }
    else
    if(Status == "Linha Nova")
    {
        DadosImportacao[Index].Erros[Key].IDLinhaAnterior = "Linha Nova";
        DadosImportacao[Index].Erros[Key].TagLinhaAnterior = "Linha Nova";
        BotaoAprovado.classList.remove('btn-outline-info');
        BotaoAprovado.classList.add('btn-info');
        BotaoReprovado.classList.add('btn-outline-warning');
        BotaoReprovado.classList.remove('btn-warning');
        DadosImportacao[Index].Erros["Sistema"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["TemperaturaProjeto"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["TemperaturaOperacao"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["PressaoProjeto"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["PressaoOperacao"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["PressaoHidro"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["Area"].Status = "VerifLinhaNova";
        DadosImportacao[Index].Erros["Remark"].Status = "VerifLinhaNova";
        MostrarModalErros(Index, false);
    }
    else
    if(Status == "Trocar TAG")
    {
        var ParagLinha = document.getElementById("NomeNovaLinha");
        if(ParagLinha.getAttribute('data-id-linha') == "" || ParagLinha.getAttribute('data-id-linha') == "Linha Nova")
        {
            $("#ErroLinhaNaoEscolhida").html(`<div class="alert alert-danger" role="alert">
              Para trocar a TAG você deve escolher a tag antiga da linha!
            </div>`);
            DadosImportacao[Index].Erros[Key].Status = "Linha Nova";
        }
        else
        {
            DadosImportacao[Index].Erros[Key].IDLinhaAnterior = ParagLinha.getAttribute('data-id-linha')
            DadosImportacao[Index].Erros[Key].TagLinhaAnterior = ParagLinha.innerHTML;
            BotaoAprovado.classList.remove('btn-info');
            BotaoAprovado.classList.add('btn-outline-info');
            BotaoReprovado.classList.add('btn-warning');
            BotaoReprovado.classList.remove('btn-outline-warning');
            $("#ErroLinhaNaoEscolhida").html("");
            await PreencherDadosLinhaExistente(DadosImportacao[Index].Erros[Key].IDLinhaAnterior, Index)
            MostrarModalErros(Index, false);
        }
    }
    var QtdErros = 0;
    for (let [key, value] of Object.entries(DadosImportacao[Index].Erros))
    {
        if(value.Status == "Aguardando Aprovação")
        {
            QtdErros++;
        }
    }
    if(QtdErros == 0)
    {
        Botao.classList.remove('btn-danger');
        Botao.classList.add('btn-success');
        if(Status == "Trocar TAG" && (ParagLinha.getAttribute('data-id-linha') == "" || ParagLinha.getAttribute('data-id-linha') == "Linha Nova"))
        {
            Botao.innerHTML = "Linha Nova";
        }
        else
        {
            Botao.innerHTML = "Erros Solucionados";
        }
        var table = document.getElementById("TabelaInfoImportacao");
        var tableErros = $('#TabelaInfoImportacao').DataTable();
        var tableSemErros = $('#TabelaInfoImportacaoSemErros').DataTable();
        for (var i = 0; i < table.rows.length; i++)
        {
           let row = table.rows[i]
            if(row.cells[0].firstChild.innerHTML == Index)
            {
               tableSemErros.row.add([row.cells[0].innerHTML, row.cells[1].innerHTML, row.cells[2].innerHTML]).draw();
               tableErros.row(row._DT_RowIndex).remove().draw();
               break;
            }
        }
    }
    else
    {
        Botao.classList.add('btn-danger');
        Botao.classList.remove('btn-success');
        Botao.innerHTML = "Solucionar Erros (" + QtdErros + ")";
        var table = document.getElementById("TabelaInfoImportacaoSemErros");
        var tableErros = $('#TabelaInfoImportacaoSemErros').DataTable();
        var tableSemErros = $('#TabelaInfoImportacao').DataTable();
        for (var i = 0; i < table.rows.length; i++)
        {
            let row = table.rows[i]
            if(row.cells[0].firstChild.innerHTML == Index)
            {
               tableSemErros.row.add([row.cells[0].innerHTML, row.cells[1].innerHTML, row.cells[2].innerHTML]).draw();
               tableErros.row(row._DT_RowIndex).remove().draw();
               break;
            }
        }

    }

}
function LinhaAntigaSelecionada(IndexLinha)
{
    //NomeNovaLinha
    var LinhaSelecionada = LinhasOS[IndexLinha];
    var ParagLinha = document.getElementById("NomeNovaLinha");
    ParagLinha.innerHTML = LinhaSelecionada.tb_pf_tag_flex;
    //console.log(LinhaSelecionada)
    ParagLinha.setAttribute('data-id-linha', LinhaSelecionada.tb_pf_id);
      $("#ModalListaLinhas").modal("hide");
      $("#ModalSolucionarErros").modal("show");

}
function MostrarModalSelecionarLinha(Index)
{
    $("#ModalSolucionarErros").modal("hide");
    $("#NomeLinhaAtualRef").html(`<b>${DadosImportacao[Index].NomeLinha}</b>`)

     if($( "#TabelaListaDeLinhas" ).html() != "")
        {
            $('#TabelaListaDeLinhas').DataTable().clear().destroy(false);
            $('#TabelaListaDeLinhas').empty();
            $("#TabelaListaDeLinhas tbody").empty();
            $("#TabelaListaDeLinhas thead").empty();
        }
     var ListaDeLinhas = [];
     for(var i = 0; i < LinhasOS.length; i++)
     {
               var Botao =   `<button title="Utilizar Esta Linha" type="button" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="LinhaAntigaSelecionada(${i})"
               style=" font-size:75%;box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important; height: 34px; margin-left: 10px; padding-top: 0px; padding-bottom: 0px;"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-in-right" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M6 3.5a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 0-1 0v2A1.5 1.5 0 0 0 6.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-8A1.5 1.5 0 0 0 5 3.5v2a.5.5 0 0 0 1 0v-2z"></path>
              <path fill-rule="evenodd" d="M11.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H1.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"></path>
            </svg>
        </button>`
        ListaDeLinhas.push([LinhasOS[i].tb_pf_tag_flex, Botao]);

     }
    $('#TabelaListaDeLinhas').DataTable( {
        data: ListaDeLinhas,
        "autoWidth": false,
         "columnDefs": [
            { "width": "20%", "targets": 1 }
          ],
        columns: [
            { title: "Tag" },
            { title: "Selecionar", width:"50px"},
        ],
        columnDefs: [
            // Center align the header content of column 1
           { className: "dt-center", targets: [ 0, 1 ] },

        ],
           "lengthMenu": [[5], [5]],
         "pageLength": 5,
              "language": {
          "emptyTable": "Nenhuma Linha Encontrada.",
          "zeroRecords": "Nenhuma Linha Encontrada.",
          "search": "Pesquisar",
            "paginate": {
            "first":      "Primeira",
            "last":       "Última",
            "next":       "Próxima",
            "previous":   "Anterior",

            },
            "lengthMenu":     "Mostrar _MENU_ ",
              "info":           "Mostrando _START_ à _END_ de _TOTAL_",
              "infoEmpty":      "Sem linhas",
              "infoFiltered":   "(de _MAX_)",
        }


        } );
        table = $('#TabelaListaDeLinhas').DataTable();
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );
        $("#ModalListaLinhas").modal("show");

}

function MostrarModalErros(Index, AbrirModal=true)
{
    var ErrosDaLinha = [];
    $("#NomeLinhaAtual").html(`<b>${DadosImportacao[Index].NomeLinha}</b>`)
    for (let [key, value] of Object.entries(DadosImportacao[Index].Erros))
    {
        if(value.Status != "VerifLinhaNova")
        {
            if(key != "NomeLinha")
            {
                var BotaoAprovar;
                var BotaoReprovar;
                if(value.Status == "Aprovado")
                {
                     BotaoAprovar = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Aprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-success">Aprovar</button>`;
                     BotaoReprovar = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%;margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Reprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-danger">Reprovar</button>`;
                }
                else
                if(value.Status == "Reprovado")
                {
                     BotaoAprovar = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Aprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-success">Aprovar</button>`;
                     BotaoReprovar = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%;margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Reprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-danger">Reprovar</button>`;
                }
                else
                {
                     BotaoAprovar = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Aprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-success">Aprovar</button>`;
                     BotaoReprovar = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%;margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Reprovado', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-danger">Reprovar</button>`;
                }
                if (!value.ValorAntigo)
                {
                    value.ValorAntigo = ""
                }
                ErrosDaLinha.push([RetornaNomeErroFormatado(key), value.ValorAntigo, value.ValorNovo, BotaoAprovar + BotaoReprovar ])
            }
            else
            {
                var Botao = `<div class="row" style="padding-left: 5px; padding-right: 5px;"><div class="column" style="width: 85%; margin-left: 10px"><p id="NomeNovaLinha" style="margin-bottom: 0px; margin-top: 0px;" data-id-Linha="${value.IDLinhaAnterior}">${value.TagLinhaAnterior}</p></div><div class="column"><button type="submit" title="Pesquisar Tag Antiga" onclick="MostrarModalSelecionarLinha(${Index})"><i class="fa fa-search"></i></button></div></div>`
                var BotaoLinhaNova;
                var BotaoTrocarTAG;
                if(value.Status == "Linha Nova")
                {
                     BotaoLinhaNova = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Linha Nova', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-info">Linha Nova</button>`;
                     BotaoTrocarTAG = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%;margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Trocar TAG', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-warning">Trocar TAG</button>`;
                }
                else
                if(value.Status == "Trocar TAG")
                {
                     BotaoLinhaNova = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Linha Nova', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-info">Linha Nova</button>`;
                     BotaoTrocarTAG = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%; margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Trocar TAG', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-warning">Trocar TAG</button>`;
                }
                else
                {
                     BotaoLinhaNova = `<button type="button" id="${key}+${Index}-OK" style="font-size:100%; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Linha Nova', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-info">Linha Nova</button>`;
                     BotaoTrocarTAG = `<button type="button" id="${key}+${Index}-NOK" style="font-size:100%;margin-left: 5px; padding-top: 2px; padding-bottom: 2px;" onclick="AlterarCorBotaoAprovacao('Trocar TAG', '${key}+'+'${Index}'+'-OK', '${key}+'+'${Index}'+'-NOK', '${Index}', '${key}')" class="btn btn-outline-warning">Trocar TAG</button>`;
                    }

                ErrosDaLinha.push([RetornaNomeErroFormatado(key), Botao, value.ValorNovo,BotaoLinhaNova + BotaoTrocarTAG])
            }
        }

     }
     if($( "#TabelaErrosDaLinha" ).html() != "")
        {
            $('#TabelaErrosDaLinha').DataTable().clear().destroy(false);
            $('#TabelaErrosDaLinha').empty();
            $("#TabelaErrosDaLinha tbody").empty();
            $("#TabelaErrosDaLinha thead").empty();
        }
    $('#TabelaErrosDaLinha').DataTable( {
        data: ErrosDaLinha,
        columns: [
            { title: "Modificação", width: "50px" },
            { title: "Valor Antigo"},
            { title: "Valor Novo"},
            { title: "Solução", width: "200px"},
        ],
        columnDefs: [
            // Center align the header content of column 1
           { className: "dt-center", targets: [ 0, 1, 2, 3 ] },

        ],
           "lengthMenu": [[10, 15, -1], [10, 15, "Tudo"]],
         "pageLength": 10,
              "language": {
          "emptyTable": "Nenhum Erro Encontrado.",
          "search": "Pesquisar",
            "paginate": {
            "first":      "Primeira",
            "last":       "Última",
            "next":       "Próxima",
            "previous":   "Anterior"
            },
            "lengthMenu":     "Mostrar _MENU_ ",
              "info":           "Mostrando erros _START_ à _END_ de um total de _TOTAL_",
              "infoEmpty":      "Sem erros",
              "infoFiltered":   "(Filtrando de um total de _MAX_)",
        }


        } );
        table = $('#TabelaErrosDaLinha').DataTable();
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );
  if(AbrirModal == true)
  {
      $("#ModalSolucionarErros").modal("show");
    }
}
function PreencherTabelaDados()
{
        if($( "#TabelaInfoImportacao" ).html() != "")
        {
            $('#TabelaInfoImportacao').DataTable().clear().destroy(false);
            $('#TabelaInfoImportacao').empty();
            $("#TabelaInfoImportacao tbody").empty();
            $("#TabelaInfoImportacao thead").empty();
        }
        if($( "#TabelaInfoImportacaoSemErros" ).html() != "")
        {
            $('#TabelaInfoImportacaoSemErros').DataTable().clear().destroy(false);
            $('#TabelaInfoImportacaoSemErros').empty();
            $("#TabelaInfoImportacaoSemErros tbody").empty();
            $("#TabelaInfoImportacaoSemErros thead").empty();
        }
     var LinhasComErro = []
     var LinhasSemErro = []
     for(var i = 0; i < DadosImportacao.length; i++)
     {
          var TextoBotao = "Sem Erros";
          var QtdErros = 0;
          for (let [key, value] of Object.entries(DadosImportacao[i].Erros)) {
                if(value.Status == "Aguardando Aprovação")
                {
                    QtdErros++;
                }
                 if(value.Status == "Linha Nova")
                {
                    TextoBotao = "Linha Nova"
                }
            }
            if(QtdErros > 0)
            {
                var Botao = `  <button type="button" id="BotaoErro${i}" style="margin:1px 5px;font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;"
                            class="subscribe btn btn-danger  rounded-pill shadow-sm"
                            onclick="MostrarModalErros(${i})">Solucionar Erros (${QtdErros})
                    </button>`;
                LinhasComErro.push([`<p hidden>${i}</p>` + DadosImportacao[i].ID, DadosImportacao[i].NomeLinha, Botao])
            }
            else
            {


                 var Botao = `  <button type="button" id="BotaoErro${i}" style="margin:1px 5px;font-size:100%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;"
                            class="subscribe btn btn-success  rounded-pill shadow-sm"
                            onclick="MostrarModalErros(${i})">${TextoBotao}
                    </button>`;
                LinhasSemErro.push([`<p hidden>${i}</p>` + DadosImportacao[i].ID, DadosImportacao[i].NomeLinha, Botao])
            }


     }
     $('#TabelaInfoImportacao').DataTable( {
        data: LinhasComErro,
          "autoWidth": false,
        columns: [
            { title: "ID", width: "50px" },
            { title: "Linha"  },
            { title: "Erros", width: "50px" },
        ],
        columnDefs: [
            // Center align the header content of column 1
           { className: "dt-center", targets: [ 0, 1, 2 ] },

        ],
           "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
         "pageLength": 10,
              "language": {
          "emptyTable": "Nenhuma Linha Encontrada.",
          "search": "Pesquisar",
            "paginate": {
            "first":      "Primeira",
            "last":       "Última",
            "next":       "Próxima",
            "previous":   "Anterior"
            },
            "lengthMenu":     "Mostrar _MENU_ ",
              "info":           "Mostrando linhas _START_ à _END_ de um total de _TOTAL_",
              "infoEmpty":      "Sem linhas",
              "infoFiltered":   "(Filtrando de um total de _MAX_)",
        }


        } );
        table = $('#TabelaInfoImportacao').DataTable();
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );




       $('#TabelaInfoImportacaoSemErros').DataTable( {
        data: LinhasSemErro,
          "autoWidth": false,
        columns: [
            { title: "ID", width: "50px" },
            { title: "Linha"  },
            { title: "Erros", width: "50px"  },
        ],
        columnDefs: [
            // Center align the header content of column 1
           { className: "dt-center", targets: [ 0, 1, 2 ] },

        ],
           "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
         "pageLength": 10,
              "language": {
          "emptyTable": "Nenhuma Linha Encontrada.",
          "search": "Pesquisar",
            "paginate": {
            "first":      "Primeira",
            "last":       "Última",
            "next":       "Próxima",
            "previous":   "Anterior"
            },
            "lengthMenu":     "Mostrar _MENU_ ",
              "info":           "Mostrando linhas _START_ à _END_ de um total de _TOTAL_",
              "infoEmpty":      "Sem linhas",
              "infoFiltered":   "(Filtrando de um total de _MAX_)",
        }


        } );
        table = $('#TabelaInfoImportacaoSemErros').DataTable();
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );
        $("#loaderTabelaSistema").hide();
        $("#MensagemloaderTabelaSistema").hide();
        $("#Tabelas").show();
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
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
