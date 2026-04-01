var Usuarios = []
var OpcoesLVEs = [];
var TiposLVE = [];
var ItemsLVEVerificacao = [];
var NomeEtapa = "Correção de Documento";
$( document ).ready(async function() {
TiposLVE = await PreencherTiposLVEAs();
        RetornaUsuariosECarregarJanelaArquivos();


    IDAtividade = $("#IDAtiv").html();
    CarregarComentarios(IDAtividade);





     $(':disabled').css({
        color:'#495057'
    });
      PreencherSelectLVES();
        PreencherSelectVerificacoes();
});
$('input:file').change(
    function(e){
    $('#id_NomeDoArquivo').val(e.target.files[0].name);
    $('#id_NomeDoArquivolbl').html(e.target.files[0].name);

});
var OpcoesLVEs = [];
var TiposLVE = [];
var ItemsLVEVerificacao = [];

  function MostrarModalAdicionarArquivo()
{
    $('#AdicionarArquivoModal').modal("show");
}


resultElement = document.getElementById('progress-bar-message');

const uploadForm = document.getElementById("upload-form")

const input = document.getElementById("ArquivoUploadInput")

const alertBox = document.getElementById("alert-box")

const progressBox = document.getElementById("progress-box")

const cancelBox = document.getElementById("cancel-box")

const cancelBtn = document.getElementById("cancel-btn")

const csrf = document.getElementsByName("csrfmiddlewaretoken")


function EnviarArquivo()
{
    $("#loaderUploadArquivo").show()

        const input = document.getElementById("ArquivoUploadInput")
        const progressBox = document.getElementById("progress-box")
        const fd = new FormData()
        const file_data = input.files[0]
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Arquivo", file_data)
        fd.append("Descricao", $.trim($("#DescricaoArquivo").val()))
        fd.append("Status", $("#StatusItemIntegracao").val())
        fd.append("Etapa", NomeEtapa)
        fd.append("IDAtividade", $("#IDAtiv").html())

        $.ajax({
            type: 'POST',
            url: "/app/civil/UploadArquivo/",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){


            },
            xhr: function (){
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', e=>{
                   // console.log(e)
                   if(e.lengthComputable){
                       const percent = e.loaded / e.total * 100
                       //console.log(percent)
                       progressBox.innerHTML = `<div class="progress" style="width: 100%; padding-left: 10px; padding-right: 10px">
                        <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p>${percent.toFixed(1)}%<p>
                        `


                   }
                })
                return xhr
            },
            success: function(response){
                        $("#progress-box").html()
                        document.getElementById("loaderUploadArquivo").style.display = "none";
                        CarregarArquivosEtapa();
                        $('#AdicionarArquivoModal').modal("hide");
                        $('#DescricaoArquivo').val("");
                        $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
                          document.getElementById("progress-box").style.display = "none";


            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })
}


function RetornaUsuariosECarregarJanelaArquivos(){

      Usuarios = [];
         var request = $.ajax({
      url: "/app/civil/RetornarUsuarios/",
      method: "GET",
      data: { }
    });

    request.done(function( dt ) {
            dt.forEach((Arq) =>{
                Usuarios.push(Arq);
            })
             CarregarArquivosEtapa();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });

}
function ExcluirArquivo(ID)
{
    $('#IDArquivoExcluir').html(ID);
    $('#ConfirmarExcluirArquivoModal').modal("show");
}
function ExcluirArquivoConfirmado()
{
    var IDExcluir =  $('#IDArquivoExcluir').html();
    $('#loaderExcluirArquivo').show();
      const fd = new FormData()
        const file_data = input.files[0]
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("IDArquivo", IDExcluir)
        fd.append("Excluir", true)
    $.ajax({
            type: 'POST',
            url: "/app/civil/UploadArquivo/",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){


            },
            success: function(response){
                        $("#progress-box").html()
                        document.getElementById("loaderExcluirArquivo").style.display = "none";
                        CarregarArquivosEtapa();
                        $('#ConfirmarExcluirArquivoModal').modal("hide");

            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })

}

function CarregarArquivosEtapa()
{
    var Arquivos = [];
         var request = $.ajax({
      url: "/app/civil/RetornaArquivosAtividade/",
      method: "GET",
      data: { IDAtividade: $("#IDAtiv").html(), Etapa: NomeEtapa}
    });

    request.done(function( dt ) {
            dt.forEach((Arq) =>{
                Arquivos.push(Arq);
            })

               $('#MensagemArquivos').html();
               if($( "#TabelaArquivos" ).html() != "")
                {
                    $('#TabelaArquivos').DataTable().clear().destroy(false);
                    $('#TabelaArquivos').empty();
                    $("#TabelaArquivos tbody").empty();
                    $("#TabelaArquivos thead").empty();
                }
                var DataArquivos = [];
                for(var i = 0; i < Arquivos.length; i++)
                {
                    var Extensao = Arquivos[i].Arquivo.split('.').pop().toUpperCase();
                    var UsuarioNome = "";
                    for(var j = 0; i < Usuarios.length; j++)
                    {
                        if(Usuarios[j].UsuarioLoginA1 == Arquivos[i].Responsavel)
                        {
                            UsuarioNome = Usuarios[j].Nome;
                            break;
                        }
                    }
                      var date = new Date(Arquivos[i].DataUpload);
                        date.setDate(date.getDate() + 1)
                       var Data = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                        var NomeArquivo = Arquivos[i].Arquivo.split(/(\\|\/)/g).pop();

                                          var Path = "ArquivosAtividades" + Arquivos[i].Arquivo.split("ArquivosAtividades")[1];
                    var BotaoDownload = `<a href="/app/civil/Download/${Path}" download target="_blank"><button type="button" title="Download ${NomeArquivo}" style="height:32px; font-size:75%"
                        class="subscribe btn btn-warning  rounded-pill shadow-sm flex-item" id="download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                         class="bi bi-download" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"></path>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"></path>
                    </svg>
                </button></a>`;
                    var BotaoExcluir = `<button type="button" title="Excluir Arquivo" onclick="ExcluirArquivo(${Arquivos[i].id})" style="height:32px; font-size:75%; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important"
                        class="subscribe btn btn-danger  rounded-pill shadow-sm flex-item" id="download">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square" viewBox="0 0 16 16">
                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                    </svg>
                    </button>`;
                    DataArquivos.push([Arquivos[i].DescricaoArquivo, UsuarioNome, Data, Extensao, BotaoDownload, BotaoExcluir])
                }
                $('#TabelaArquivos').DataTable( {
                    data: DataArquivos,
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
                          "info":           "Mostrando arquivos _START_ à _END_ de um total de _TOTAL_",
                          "infoEmpty":      "Sem arquivos",
                          "infoFiltered":   "(Filtrando de um total de _MAX_)",
                    }


                    } );
                    table = $('#TabelaArquivos').DataTable();
                    $('#button').click( function () {
                        table.row('.selected').remove().draw( false );
                    } );


    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });

}
function PreencherItemsLVEVerificacao(){
            var request = $.ajax({
              url: "/app/civil/RetornaItensLVE/",
              method: "GET",
            });
            request.done(function(dt) {
                        dt.forEach((ItemLVE) => {
                               ItemsLVEVerificacao.push(ItemLVE);
                         })
            });


}
function csrfSafeMethod(method) {
// these HTTP methods do not require CSRF protection
return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function SalvaPreenchimentoLVE(IDItemLVE, Funcao, valor)
{
    const csrftoken = jQuery("[name=csrfmiddlewaretoken]").val();
    $.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }});
    $.ajax({
            headers:{'X-CSRFToken': csrf[0].value},
            url : "/app/civil/PreenchimentoLVEView/", // the endpoint
            type : "POST", // http method
            data : { SalvarUnitario : true, IDPreenchimentoLVE : IDItemLVE, Funcao: Funcao, Valor: valor}, // data sent with the post request

            // handle a successful response
            success : function(json) {


            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
    });
}
function AlterarValorLVE(Elemento, ID, valor, NomeBotao, Funcao)
{
             SalvaPreenchimentoLVE(ID, Funcao, valor);
            if(valor == "Х")
            {
                $("#TituloAV"+NomeBotao).css("background-color", "#c8233366");
                $("#TituloAV"+NomeBotao).css("border-color", "#c82333");
                $("#BotaoNA"+NomeBotao).css("background-color", "#6c757d66");
                $("#BotaoOK"+NomeBotao).css("background-color", "#6c757d66");
                $("#BotaoNOK"+NomeBotao).css("background-color", "#c82333");
                $("#TituloAV"+NomeBotao).prop('title', `Correção - Com Erros`);
            }
            else if(valor == "✓")
            {
                $("#TituloAV"+NomeBotao).css("background-color", "#28a74566");
                $("#TituloAV"+NomeBotao).css("border-color", "#28a745");
                $("#BotaoNA"+NomeBotao).css("background-color", "#6c757d66");
                $("#BotaoOK"+NomeBotao).css("background-color", "#28a745");
                $("#BotaoNOK"+NomeBotao).css("background-color", "#6c757d66");
                 $("#TituloAV"+NomeBotao).prop('title', `Correção - OK`);
            }
            else
            {
                $("#TituloAV"+NomeBotao).css("background-color", "#cbc3ba");
                $("#TituloAV"+NomeBotao).css("border-color", "#6c757d");
                $("#BotaoNA"+NomeBotao).css("background-color", "#cbc3ba");
                $("#BotaoOK"+NomeBotao).css("background-color", "#6c757d66");
                $("#BotaoNOK"+NomeBotao).css("background-color", "#6c757d66");
                 $("#TituloAV"+NomeBotao).prop('title', `Correção - Não se Aplica`);

            }

}

function RetornaItemLVE(Id)
{

    for(var i = 0; i < ItemsLVEVerificacao.length; i++)
    {
        if(ItemsLVEVerificacao[i].id == Id)
        {
            return ItemsLVEVerificacao[i];
        }
    }
}

function PreencherLVE(ItemsLVE){
OpcoesLVEs = [];
    var Selecoes = [];
    var ItemsSelecionados = [];
    for(var i = 0; i < ItemsLVE.length; i++)
    {
       // console.log(ItemsLVE[i])
        //var LVE = RetornaItemLVE(ItemsLVE[i].ItemLVEVerificacao);
         if(!Selecoes.includes(ItemsLVE[i].Selecao))
        {
            Selecoes.push(ItemsLVE[i].Selecao);
        }
         ItemsSelecionados.push( ItemsLVE[i]);

    }



      var HTMLLista= "";
    for(var i = 0; i < Selecoes.length; i++)
    {
        jQuery('<div/>', {
            id: 'Selecoes'+i,
            "class": 'row',
            "style": "margin-left:25px; margin-right:25px; margin-top: 25px; margin-bottom: 25px"
        }).appendTo('#AutoVerificacao');

        jQuery('<div/>', {
            id: 'ColDiv'+i,
            "class": 'col-sm LVESelect'
        }).appendTo('#Selecoes'+i);

        jQuery('<p class="alert"><strong>'+Selecoes[i]+"</strong></p>", {
            id: 'ColP'+i,
            "style": 'margin: auto;'
        }).appendTo('#ColDiv'+i);

        var Grupos = [];

        for(var j = 0; j < ItemsSelecionados.length; j++)
        {
            if(ItemsSelecionados[j].Selecao == Selecoes[i] && !Grupos.includes(ItemsSelecionados[j].Grupo))
            {
                Grupos.push(ItemsSelecionados[j].Grupo);
            }
        }

        Grupos.sort();

         for(var j = 0; j < Grupos.length; j++){
                       jQuery('<div/>', {
                        id: 'Grupos'+i+j,
                        "class": 'row',
                        }).appendTo('#ColDiv'+i);

                        jQuery('<div/>', {
                            id: 'ColDivGRP'+i+j,
                            "class": 'col-8 col-sm LVEOpcao'
                        }).appendTo('#Grupos'+i+j);

                        jQuery('<p class="alert" style="margin-bottom: 0px !important"><strong>'+Grupos[j]+"</strong></p>", {
                            id: 'ColP'+i+j,
                            "style": 'margin: auto;'
                        }).appendTo('#ColDivGRP'+i+j);




                var DivAtual = "";
                var QtdElementos = 0;
                 for(var k = 0; k < ItemsSelecionados.length; k++){
                   if(ItemsSelecionados[k].Grupo == Grupos[j] && ItemsSelecionados[k].Selecao == Selecoes[i])
                   {
                        if(QtdElementos == 0)
                        {
                           jQuery('<div/>', {
                            id: 'LVEVerif'+i+j+k,
                            "class": 'row',
                            }).appendTo('#ColDivGRP'+i+j);
                            DivAtual = '#LVEVerif'+i+j+k;

                        }
                       if(QtdElementos == 2)
                       {
                            QtdElementos = 0;
                       }
                       else
                       {
                             QtdElementos++;
                       }


                        jQuery('<div/>', {
                            id: 'ColDivLVEVerif'+i+j+k,
                            "class": 'col-3 col-sm LVEItem3',
                        }).appendTo(DivAtual);




                        var el = jQuery('<div style="display: table-cell; vertical-align: middle;"><p class="TextoLVE" >'+ItemsSelecionados[k].Nome+"</p></div>", {
                            id: 'ColPDivLveVerif'+i+j+k,

                        }).appendTo('#ColDivLVEVerif'+i+j+k);

                             var el = jQuery('<div></div>', {
                            id: 'GridBts'+i+j+k,
                            "class": 'grid-titulo3',
                        }).appendTo('#ColDivLVEVerif'+i+j+k);

                            var HTMLHeader = "";
                            if(ItemsSelecionados[k].ValorAutoVerificacao == "" || !ItemsSelecionados[k].ValorAutoVerificacao)
                            {
                                    var el = jQuery(`<div class="tituloAV" style="background-color: #6c757d66" title="Auto Verificação - Não Preenchido"><center>AV<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);
                                //HTMLHeader = `<button disabled class="btn btn-secondary  BotaoLVE" style="width: 30px" type="button" id="dropdownMenu${i}${j}${k}"  aria-haspopup="true" aria-expanded="false" title="Não escolhido">-</button>`;
                            }
                            else
                            if(ItemsSelecionados[k].ValorAutoVerificacao == "✓")
                            {
                                    var el = jQuery(`<div class="tituloAV" style="background-color: #28a74566" title="Auto Verificação - OK"><center>AV<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);
                                //HTMLHeader = `<button disabled class="btn btn-success  BotaoLVE" style="width: 30px" type="button" id="dropdownMenu${i}${j}${k}"  aria-haspopup="true" aria-expanded="false" title="OK">✓</button>`;
                            }
                             else
                            if(ItemsSelecionados[k].ValorAutoVerificacao == "Х")
                            {
                                    var el = jQuery(`<div class="tituloAV" style="background-color: #c8233366" title="Auto Verificação - Com Erros"><center>AV<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);
                                //HTMLHeader = `<button disabled class="btn btn-danger  BotaoLVE" style="width: 30px" type="button" id="dropdownMenu${i}${j}${k}"  aria-haspopup="true" aria-expanded="false" title="Não OK">Х</button>`;
                            }
                            else
                            {
                                    var el = jQuery(`<div class="tituloAV" style="background-color: #cbc3ba" title="Auto Verificação - Não se Aplica"><center>AV<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);
                                //HTMLHeader = `<button disabled class="btn btn-secondary  BotaoLVE" style="width: 30px" type="button" id="dropdownMenu${i}${j}${k}"  aria-haspopup="true" aria-expanded="false" title="Não se aplica">Ⱥ</button>`;
                            }

                        /*    var el = jQuery(`
                                  ${HTMLHeader}
                                `, {
                            id: 'Select'+i+j+k
                        }).appendTo('#GridBts'+i+j+k);*/

                         var HTMLHeader = "";

                            if(ItemsSelecionados[k].ValorVerificacao == "" || !ItemsSelecionados[k].ValorVerificacao)
                            {
                                   var el = jQuery(`<div class="tituloAV"  style="background-color: #6c757d66" title="Verificação - Não Preenchido"><center>V<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);

                            }
                            else
                            if(ItemsSelecionados[k].ValorVerificacao == "✓")
                            {
                                   var el = jQuery(`<div class="tituloAV"  style=" background-color: #28a74566" title="Verificação - OK"><center>V<center></div>`, {
                                    }).appendTo('#GridBts'+i+j+k);

                            }
                             else
                            if(ItemsSelecionados[k].ValorVerificacao == "Х")
                            {
                                    var el = jQuery(`<div class="tituloAV"  style=" background-color: #c8233366" title="Verificação - Com Erros"><center>V<center></div>`, {
                                    }).appendTo('#GridBts'+i+j+k);

                            }
                            else
                            {
                                   var el = jQuery(`<div class="tituloAV"  style=" background-color: #6c757d66" title="Verificação - Não se Aplica"><center>V<center></div>`, {
                                }).appendTo('#GridBts'+i+j+k);

                            }


                            var CorBotaoOK = "#6c757d66";
                             var CorBotaoNOK = "#6c757d66";
                             var CorBotaoNA = "#6c757d66";

                            if(ItemsSelecionados[k].ValorCorrecao == "" || !ItemsSelecionados[k].ValorCorrecao)
                            {
                                   var el = jQuery(`<div class="tituloAV" id="TituloAV${i}${j}${k}" style="background-color: #6c757d66" title="Correção - Não Preenchido"><center>C<center></div>`, {
                                 }).appendTo('#GridBts'+i+j+k);

                            }
                            else
                            if(ItemsSelecionados[k].ValorCorrecao == "✓")
                            {
                                   var el = jQuery(`<div class="tituloAV" id="TituloAV${i}${j}${k}" style=" background-color: #28a74566" title="Correção - OK"><center>C<center></div>`, {
                                    }).appendTo('#GridBts'+i+j+k);
                                       CorBotaoOK = "#28a745";
                            }
                             else
                            if(ItemsSelecionados[k].ValorCorrecao == "Х")
                            {
                                    var el = jQuery(`<div class="tituloAV" id="TituloAV${i}${j}${k}" style=" background-color: #c8233366" title="Correção - Com Erros"><center>C<center></div>`, {
                                    }).appendTo('#GridBts'+i+j+k);
                                    CorBotaoNOK = "#c82333";
                            }
                            else
                            {
                                   var el = jQuery(`<div class="tituloAV" id="TituloAV${i}${j}${k}" style=" background-color: #6c757d66" title="Verificação - Não se Aplica"><center>C<center></div>`, {
                                }).appendTo('#GridBts'+i+j+k);
                                CorBotaoNA = "#6c757d";
                            }

                            var el = jQuery(`
                                  ${HTMLHeader}

                                </div>
                                <div class="grid-titulo3" style="height: 35px">
                                    <button class="btn-danger" id="BotaoNOK${i}${j}${k}" style="background-color: ${CorBotaoNOK}; color: white; width: 30px" type="button" onclick="AlterarValorLVE(this,'${ItemsSelecionados[k].id}', 'Х', '${i}${j}${k}', 'Correcao')" title="Com Erros">Х</button>
                                    <button class="btn-success" id="BotaoOK${i}${j}${k}" type="button" style="background-color: ${CorBotaoOK}; color: white; width: 30px" onclick="AlterarValorLVE(this,'${ItemsSelecionados[k].id}', '✓', '${i}${j}${k}', 'Correcao')" title="OK">✓</button>
                                    <button class="btn-secondary" id="BotaoNA${i}${j}${k}" type="button" style="background-color: ${CorBotaoNA}; color: white; width: 30px" onclick="AlterarValorLVE(this,'${ItemsSelecionados[k].id}', 'Ⱥ', '${i}${j}${k}', 'Correcao')" title="Não se Aplica">N/A</button>
                                </div>`, {
                            id: 'SelectV'+i+j+k
                        }).appendTo('#GridBts'+i+j+k);






                     }
                 }

         }
    }



}
function PreencherTabela(){
 if($("#SelectDetalhesPreenchimento option:selected").text() != "---------")
    {
    var ItemsLVE = [];
        IDLVeSelecionada= $("#SelectDetalhesPreenchimento option:selected").val();
        var IDPreenchimento= $("#SelectDetalhesPreenchimento option:selected").data('IDSist')

            var request = $.ajax({
              url: "/app/civil/RetornaPreenchimentosLVE/",
              method: "GET",
             data : { id : IDPreenchimento },
            });
            request.done(function(dt) {
             var table = document.getElementById("Tabela");
                        dt.forEach((ItemLVE) => {
                               ItemsLVE.push(ItemLVE);
                         })
                PreencherLVE(ItemsLVE);
            });
    }
    else
    {
     $('#AutoVerificacao').html("");


    }
}
$('#SelectLVE').change(function() {
  //  PreencherTabela();

});

$('#SelectDetalhesPreenchimento').change(function() {
   if($("#SelectDetalhesPreenchimento option:selected").text() != "---------")
    {
        $('#AutoVerificacao').html("");
        $('#BotaoRemoverVerificacao').prop("disabled", false);

        PreencherTabela();
    }
    else
    {


        $('#BotaoRemoverVerificacao').prop("disabled", true);
            $('#AutoVerificacao').html("");


      //  jQuery(`<div class="flex"><button class="subscribe btn btn-warning  rounded-pill shadow-sm BotaoBorder flex-item" style="width: 50%; margin-top: 0px" data-toggle="modal" data-target="#CadastroPreenchimento"  data-target="#md-fade-scale">Criar Nova Auto Verificação</button></div>`).appendTo('#AutoVerificacao');
    }

});

function RemoverVerificacaoModal(){
    $('#RemoverVerificacaoSelecionada').modal('show');
}
function RemoverVerificacao(){
$("#loaderVerificacao").show();

var ID =  $("#SelectDetalhesPreenchimento").val();
  $.ajax({
            url : "/app/civil/PreenchimentoLVEView/", // the endpoint
            type : "POST", // http method
            data : { RemoverPreenchimento : true, IDPreenchimento : ID}, // data sent with the post request

            // handle a successful response
            success : function(json) {
                 $('#CadastroPreenchimento').modal('hide')
                PreencherSelectVerificacoes();
                $("#loaderVerificacao").hide();
                $('#RemoverVerificacaoSelecionada').modal('hide');

            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });
PreencherTabela();


}

function PreencherSelectLVES(Disciplina, TipoVerifica){

    var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornarLVEVerificacao/",
      method: "GET",
      data: { Disciplina : $('#IDDisciplina').html(), TipoVerifica: 'Documento', VerificarDisc: true }
    });

    request.done(function( dt ) {
                $("#SelectLVE").empty();
             var o = new Option("---------", "");
                  $(o).html("---------");
                  $("#SelectLVE").append(o);
              dt.forEach((Sist) => {
                    var o = new Option(Sist.Titulo, Sist.id);
                          $(o).html(Sist.CodigoDocumento + " - " + Sist.Titulo);
                           $("#SelectLVE").append(o);
                     })
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });


}
async function PreencherTiposLVEAs(){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarLVEVerificacao/",
      method: "GET",
      data: {Disciplina : $('#IDDisciplina').html(), TipoVerifica: 'Documento'  }
    });

   return request;


}
function PreencherTiposLVE(Disciplina, TipoVerifica){

    var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornarLVEVerificacao/",
      method: "GET",
      data: {Disciplina : $('#IDDisciplina').html(), TipoVerifica: 'Documento'  }
    });

    request.done(function( dt ) {
              dt.forEach((Sist) => {
                        TiposLVE.push(Sist);
                     })
                        PreencherSelectLVES();
                    PreencherSelectVerificacoes();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });


}


function RetornaLVECorreta(idLVE)
{


    var LVERetornar;
    for(var i = 0; i < TiposLVE.length; i++)
    {

        if(TiposLVE[i].id == idLVE)
        {
            LVERetornar = TiposLVE[i];
            break;

        }
    }
    return LVERetornar;
}
function PreencherSelectVerificacoes(){
    var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornaDetalhesPreenchimentoPorIDAtividade/",
      method: "GET",
      data: { id : IDAtividade, IDDocumento: $("#IDDocumento").html() }
    });

    request.done(function( dt ) {
                $("#SelectDetalhesPreenchimento").empty();
             var o = new Option("---------", "");
                  $(o).html("---------");
                  $("#SelectDetalhesPreenchimento").append(o);
              dt.forEach((Sist) => {
                    var LVE = RetornaLVECorreta(Sist.LVEVerificacao);
                    var date = new Date(Sist.DataCadastro);
                    date.setDate(date.getDate() + 1)
                    var Data = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                    var o = new Option(LVE.Titulo, Sist.id);
                          $(o).html(LVE.CodigoDocumento + " - " + LVE.Titulo + " - " + Data);
                          $(o).data("IDSist", Sist.id);
                           $("#SelectDetalhesPreenchimento").append(o);
                     })
                   //   $('#AutoVerificacao').html(`<div class="flex"><button class="subscribe btn btn-warning  rounded-pill shadow-sm BotaoBorder flex-item" style="width: 50%; margin-top: 0px" data-toggle="modal" data-target="#CadastroPreenchimento"  data-target="#md-fade-scale">Criar Nova Auto Verificação</button></div>`);
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });


}

function CadastrarPreenchimento(){
    if($("#SelectLVE option:selected").text() != "---------" && $("#CadastrarPreenchimentoSelect option:selected").text() != "---------"    )
    {
        var IDLVeSelecionadaCad= $("#SelectLVE option:selected").val();
        var ResponsavelCad = $("#CadastrarPreenchimentoSelect option:selected").val();

        //IDAtividade = IDAtividade
        //IDVerificacao

        $.ajax({
            url : "/app/civil/PreenchimentoLVEView/", // the endpoint
            type : "POST", // http method
            data : { Cadastrar : true, IDLve : IDLVeSelecionadaCad, IDPessoa: ResponsavelCad, IDAtividade: IDAtividade, IDDocumento: $("#IDDocumento").html() }, // data sent with the post request

            // handle a successful response
            success : function(json) {
                 $('#CadastroPreenchimento').modal('hide')
                PreencherSelectVerificacoes();
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });
    }
    else
    {
        var Erro = "";
         if($("#SelectLVE option:selected").text() == "---------" )
         {
            Erro += '<p>Você precisa selecionar uma LVE!</p>';
         }
           if($("#CadastrarPreenchimentoSelect option:selected").text() == "---------" )
         {
            Erro += '<p>Você precisa selecionar um Responsável!</p>';
         }
        $("#ErroNoPreenchimento").html(`<div class="alert alert-danger" role="alert">
            ${Erro}
        </div>`);
    }
}



function AjustarOSPorID(){
IDOS = $("#AtividadeOS").val();
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornaOSPorID/?id='+IDOS, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            $("#AtividadeOS").val(Sist.OS);


        })
        // console.log(RestraintsTemp);

    };
    request.send();
}
var IDComentarioApagar;
function RemoverComentarioBD()
{
    if(IDComentarioApagar)
    {
      $("#loaderExcluirComentario").show()
      $.ajax({
        url : "/app/civil/ApagarComentario/", // the endpoint
        type : "POST", // http method
        data : { ID : IDComentarioApagar }, // data sent with the post request

        // handle a successful response
        success : function(json) {

             var IDAtividade = $("#IDAtiv").html();
            CarregarComentarios(IDAtividade);
            IDComentarioApagar = null;
             document.getElementById("loaderExcluirComentario").style.display = "none";
              $("#ExcluirComentario").modal("hide");
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
    }
}

function ApagarComentarioForm(ID) {

   IDComentarioApagar = ID;
   $("#ExcluirComentario").modal("show");

};
var IDAtividade;
function CarregarComentarios(IDAtividade){
var Comentarios = []


     $.ajax({
        url : "/app/civil/RetornarComentariosAtividade/?id="+IDAtividade, // the endpoint
        type : "GET", // http method
        data : {  }, // data sent with the post request

        // handle a successful response
        success : function(data) {

                data.forEach((Sist) => {
                Comentarios.push(Sist);

            })


           if(Comentarios.length == 0)
           {
                var HTML = `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
                    <div class="d-flex w-100 justify-content-between">
                      <h5 class="mb-1">Não existem comentários cadastrados!</h5>
                      <small></small>
                    </div>
                    <p class="mb-1"></p>
                    <small></small>
                  </a>`;

                 $("#ListGroupComentarios").html(HTML);
           }
           else
           {
            var HTML = "";
               for(var i = 0; i < Comentarios.length; i++)
               {
                     var Botao =
                     `<button  type="button" class="btn btn-secondary" style="padding: 2px; font-size:75%;float: right" title="Remover Comentário" onclick="ApagarComentarioForm(${Comentarios[i].id})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
                          <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"></path>
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>
                        </svg>
                      </button>
                      `;
                     var date = new Date(Comentarios[i].DataComentario);
                     date.setDate(date.getDate() + 1)
                     var Data = '<div style="float: left"><p>' + (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() +"</p>"+ Botao +"</div>";
                    HTML+= ` <a class="list-group-item list-group-item-action flex-column align-items-start" style="border: 3px inset black">
                                 <div class="d-flex w-100 justify-content-between">
                                  <h5 class="mb-1">Origem do Comentário: <b>${Comentarios[i].TipoComentario}</b></h5>
                                </div>

                                <div class="d-flex w-100 justify-content-between">
                                 <p class="mb-1" style="white-space: pre-wrap;">${Comentarios[i].Comentario}</p>

                                  <small class="text-muted" >${Data} </small>
                                </div>
                                 <small class="text-muted">${Comentarios[i].ResponsavelComentario}</small>

                              </a>`;
               }
               $("#ListGroupComentarios").html(HTML);
           }
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });


}

$('#AdicionarComentarioPost').on('submit', function(event){
        event.preventDefault();
        CriarComentarioForm();
});
async function RetornaEtapasArquivos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaEtapasArquivos/"+IDAtividade+"/",
      method: "GET",
      data: { }
    });

   return request;
}
async function CheckAlteracaoStatus()
{
    var StatusNovo = $("#Status option:selected").text();
    if(StatusNovo == "Não Iniciada" || "Ajuste de projeto")
       return true;

    var Etapas = await RetornaEtapasArquivos()
    if(StatusNovo == "Verificado")
    {
        var Achou = false;
        for(var i = 0; i < Etapas.length; i++)
        {
            if(Etapas[i].Etapa == "Verificação de Documento")
            {
                Achou = true;
                break;
            }
        }
        return Achou;
    }
    if(StatusNovo == "Corrigido" )
    {
         var Achou = false;
        for(var i = 0; i < Etapas.length; i++)
        {
            if(Etapas[i].Etapa == "Correção de Documento")
            {
                Achou = true;
                break;
            }
        }
        return Achou;
    }
    if(StatusNovo == "Concluido" || StatusNovo == "Correção Reprovada")
    {
         var Achou = false;
        for(var i = 0; i < Etapas.length; i++)
        {
            if(Etapas[i].Etapa == "Verificação da Correção de Documento")
            {
                Achou = true;
                break;
            }
        }
        return Achou;
    }
}

async function AlterarStatus(){
var IDSelecionado = $( "#ResponsavelVerificacao option:selected" ).text();
var Data = $("#DataVlrForm").val();

    if(IDSelecionado != "---------")
    {
        var CheckAlteracaoStatusEtapa = await CheckAlteracaoStatus();
        if(CheckAlteracaoStatusEtapa == true)
        {

            document.getElementById("loaderStatus").style.display = "block";
            var IDPree =  $("#SelectDetalhesPreenchimento").val();
            var StatusNovo = $("#Status").val();
            var IDVerificacao = $("#IDVerificacao").html();

          $.ajax({
                url : "/app/civil/VerificacaoDocumento/"+IDVerificacao+"/", // the endpoint
                type : "POST", // http method
                data : { IDVerificacao : IDVerificacao, IDStatus : StatusNovo, IDPessoa: IDSelecionado, DataOp: Data, IDPreenchimento: IDPree }, // data sent with the post request

                // handle a successful response
                success : function(json) {

                     $('#AvisoAlteracaoStatus').modal('hide')
                      document.getElementById("loaderStatus").style.display = "none";


                },

                // handle a non-successful response
                error : function(xhr,errmsg,err) {
                    $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                        " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                }
            });
            }
            else
            {
                  var NomeStatusAlterar = $("#Status option:selected").text();
                var EtapaAlterar = "";
                if(NomeStatusAlterar=="Verificado") EtapaAlterar = "Verificação de Documento";
                else if(NomeStatusAlterar=="Corrigido") EtapaAlterar = "Correção de Documento";
                else EtapaAlterar = "Verificação de Correção de Documento";
                $("#ErrorAlteracaoStatus").html(`<div class="alert alert-danger" role="alert">

              <h4 class="alert-heading">Não é possível alterar o status para <b>${NomeStatusAlterar}</b>!</h4>
              <p>Para alterar o status, é necessário cadastrar um arquivo de comprovação de conclusão </p>
              <hr>
              <p class="mb-0">Por favor, cadastre o arquivo na <b>${EtapaAlterar}</b> antes de mudar o status</p>
            </div>`)

            }
    }
      else
    {
            $("#ErrorAlteracaoStatus").html(`<div class="alert alert-danger" role="alert">
            Todos os campos devem ser preenchidos!
        </div>`)
    }
}

function MostrarModalAlteracaoStatus(){
     $("#ErrorAlteracaoStatus").html(" ");
var NovoStatusTexto = $("#Status option:selected").text();




var NovoStatusTexto = $("#Status option:selected").text();
    var HTML = `Tem certeza que deseja alterar o status para <b style="color: orange">${NovoStatusTexto}</b>?`;
$("#AvisoErroAtividades").html(HTML);

 $('#AvisoAlteracaoStatus').modal('show')
}

function CriarComentarioForm() {
     $.ajax({
        url : "/app/civil/CriarComentario/", // the endpoint
        type : "POST", // http method
        data : { Comentario : $('#observacao-comentario').val(), AtividadeID : $('#IDAtiv').html(), Origem: "Correção Documento" }, // data sent with the post request

        // handle a successful response
        success : function(json) {
             $('#observacao-comentario').val('');
             $('#CadastrarComentario').modal('hide')
             var IDAtividade = $("#IDAtiv").html();
            CarregarComentarios(IDAtividade);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};


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
