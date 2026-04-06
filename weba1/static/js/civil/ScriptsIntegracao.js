
var AreasIntegracao = []
var StatusIntegracao = []
var Usuarios = []
$( document ).ready(function() {

PegarUsuarios();
PegarAreasIntegracao();
PegarStatusIntegracao();

    document.getElementById("loaderCriacaoIntegracao").style.display = "none";

      IDAtividade = $("#IDAtiv").html();

     $(':disabled').css({
        color:'#495057'
    });
      $('#BotaoRemoverIntegracao').css({
        color:'white'
    });
    PreencherSelectIntegracoes();
});

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
        fd.append("IDIntegracao", $("#SelectIntegracoes").val())
        fd.append("IDAtividade", $("#IDAtiv").html())

        $.ajax({
            type: 'POST',
            url: "/app/civil/UploadArquivoIntegracao/",
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
                        CarregarArquivosIntegracao();
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
$('input:file').change(
    function(e){
    $('#id_NomeDoArquivo').val(e.target.files[0].name);
    $('#id_NomeDoArquivolbl').html(e.target.files[0].name);

});
function ExcluirArquivoConfirmado()
{
    var IDExcluir =  $('#IDArquivoExcluir').html();
    $('#loaderExcluirArquivo').show();
      const fd = new FormData()
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("IDArquivo", IDExcluir)
        fd.append("Excluir", true)
    $.ajax({
            type: 'POST',
            url: "/app/civil/UploadArquivoIntegracao/",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){


            },
            success: function(response){
                        $("#progress-box").html()
                        document.getElementById("loaderExcluirArquivo").style.display = "none";
                         CarregarArquivosIntegracao();
                        $('#ConfirmarExcluirArquivoModal').modal("hide");

            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })

}
function ExcluirArquivo(ID)
{
    $('#IDArquivoExcluir').html(ID);
    $('#ConfirmarExcluirArquivoModal').modal("show");
}
function MostrarModalAdicionarArquivo()
{
    $('#AdicionarArquivoModal').modal("show");
}
function CarregarArquivosIntegracao()
{
    var Arquivos = [];
         var request = $.ajax({
      url: "/app/civil/RetornaArquivosIntegracao/",
      method: "GET",
      data: { IDIntegracao: $("#SelectIntegracoes").val()}
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
                    for(var j = 0; j < Usuarios.length; j++)
                    {

                        if(Usuarios[j].Usuario == Arquivos[i].Responsavel)
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
                    var BotaoDownload = `<a href="/app/civil/DownloadInt/${Path}" download target="_blank"><button type="button" title="Download ${NomeArquivo}" style="height:32px; font-size:75%"
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


resultElement = document.getElementById('progress-bar-message');

const uploadForm = document.getElementById("upload-form")

const input = document.getElementById("ArquivoPDF")

const alertBox = document.getElementById("alert-box")

const imageBox = document.getElementById("image-box")

const progressBox = document.getElementById("progress-box")

const cancelBox = document.getElementById("cancel-box")

const cancelBtn = document.getElementById("cancel-btn")

const csrf = document.getElementsByName("csrfmiddlewaretoken")




$('#SelectIntegracoes').change(function() {
   if($("#SelectIntegracoes option:selected").text() != "---------")
    {


        $('#Integracoes').html("");
          $('#BotaoRemoverIntegracao').prop("disabled", false);
      var request = $.ajax({
      url: "/app/civil/RetornaIntegracoesPorID/",
      method: "GET",
      data: { IDA : $("#SelectIntegracoes").val()  }
    });

    request.done(function( dt ) {
                var Observacao = "";
                if(dt[0].Observacao)
                    Observacao = dt[0].Observacao;
                    var HTMLDiv = ` <p class="lead">Preencha uma observação para ser enviada junto com a solicitação de aprovação.</p>
                            <div>
                                <div class="input-group" style="box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">Observação:</span>
                                    </div>
                                    <textarea id="ObservacaoInt" class="form-control" aria-label="With textarea">${Observacao}</textarea>

                                </div>
                                <div>
                                    <div class="loader" id="loaderSalvarObservacao" style="float: right;height: 40px; width:40px; margin-top: 10px; display: none"></div>
                                  <button type="button" class="subscribe btn btn-warning  rounded-pill shadow-sm" style="float: right;  margin-top: 10px;" id="SalvarItensLVE" onclick="SalvarObservacaoIntegracao()" title="Salvar a Observação">Salvar Observação</button>

                                  </div>
                            </div>
                            </br></br>

                            <hr class="my-4">
                               <div id="Arquivos">

                              <p class="lead">Arquivos para envio aos aprovadores</p>

                              <div id="MensagemArquivos"></div>
                                <table id="TabelaArquivos" class="display" style="padding: 0px; width:100%; font-size:75%; overflow-y: hidden;"></table>
                             <button type="button" style="float: right;  margin-top: 10px;" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="MostrarModalAdicionarArquivo()">Adicionar Arquivo</button>
                            </br></br>


                            </div>
                             <hr class="my-4">
                            <p class="lead">Defina abaixo quais serão as áreas mobilizadas para integração.</p>
                            <table id="Tabela">
                                <tr>
                                    <th style="width: 50px">N</th>
                                    <th>Área</th>
                                    <th>Responsável</th>
                                    <th style="width: 250px">Status</th>
                                    <th>Link</th>
                                    <th style="width: 34px">-</th>
                                </tr>

                            </table>
                            <div style="padding-top: 10px" id="ErrosCadastro"></div>
                             <div class="loader" id="LoaderCadastrarResponsaveis" style="float: right;height: 40px; width:40px; margin-top: 10px; display: none"></div>
                            <button type="button" class="subscribe btn btn-warning  rounded-pill shadow-sm" style="float: right;  margin-top: 10px;" onclick="CadastrarResponsaveisIntegracao()" title="Aplicar itens da tabela acima à LVE selecionada">Cadastrar/Atualizar Responsáveis</button>
                            <button type="button" class="subscribe btn btn-success  rounded-pill shadow-sm" style="float: right;  margin-top: 10px; margin-right: 10px; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.9) !important;"  onclick="AdicionarLinhaNaTabela()">Adicionar Linha</button>
                            <br/>
                            <div style="margin-top: 30px; " id="ErrosAdicionarLVE"> </div>`;

                              $('#Integracoes').html(HTMLDiv);
                                   $("#Tabela").on('click','.btnDelete',function(){
                             $(this).closest('tr').remove(); });
                                  PegarItensIntegracaoEPreencherTabela();
                                  CarregarArquivosIntegracao();

                });

                request.fail(function( jqXHR, textStatus ) {
                  console.log( "Request failed: " + textStatus );
                });
    }
    else
    {
           $('#Integracoes').html("");

     // $('#AlterarStatusBTN').prop("disabled", true);
        $('#BotaoRemoverIntegracao').prop("disabled", true);


   // document.getElementById("botoesPDF").style.display = "none";
   //  document.getElementById("the-canvas").style.display = "none";
//document.getElementById("ArquivoPDF").style.display = "none";
       jQuery(`<div class="flex"><button class="subscribe btn btn-warning  rounded-pill shadow-sm BotaoBorder flex-item" style="width: 50%; margin-top: 0px" onclick="CriarIntegracao()">Criar Nova Integração</button></div>`).appendTo('#Integracoes');
    }

});

function CadastrarResponsaveisIntegracao()
{
 $("#LoaderCadastrarResponsaveis").show()

var Responsaveis = [];
var table = document.getElementById("Tabela");
        var HTMLErro = "";
        for (let row of table.rows)
        {
            if(row.rowIndex > 0) //para evitar o header
            {
                if(row.cells[1].firstChild.value != "---------" && row.cells[2].firstChild.value != "---------")
                {
                   var Area = row.cells[1].firstChild.value;
                   var Responsavel = row.cells[2].firstChild.value;
                    Responsaveis.push({Area:Area ,Responsavel:Responsavel})
                }
                else
                {
                    HTMLErro+= `<p>A linha número ${row.rowIndex} não foi adicionada pois está sem responsável ou área!</p>`


                }
            }
        }

          $.ajax({
                      url : "/app/civil/Integracao/"+$("#IDAtiv").html()+"/", // the endpoint
                        type : "POST", // http method
                        dataType : "json",
                        data : { CadastrarResponsaveis: true, IDAtualizar: $("#SelectIntegracoes").val(), Itens: JSON.stringify(Responsaveis) }, // data sent with the post request

                        // handle a successful response
                        success : function(json) {

                                for(var i = 0; i < json["IDS"].length; i++)
                                {
                                    for (let row of table.rows)
                                    {
                                        if(row.rowIndex > 0) //para evitar o header
                                        {
                                            if(row.cells[1].firstChild.value == json["IDS"][i].Area && row.cells[2].firstChild.value == json["IDS"][i].Responsavel)
                                            {
                                                var CelulaLink = row.cells[4];
                                                var HTMLLink = `<a href="/app/civil/ItemIntegracao/${json["IDS"][i].ID}" style="width: 100%" class="btn btn-primary">Acessar</a>`
                                                CelulaLink.innerHTML = HTMLLink;
                                                break;
                                            }
                                        }
                                    }
                                }
                                if(HTMLErro != "")
                                {
                                    $("#ErrosCadastro").html(`<div class="alert alert-danger" role="alert">
                                        ${HTMLErro}
                                    </div>`);
                                }
                                else
                                {
                                      $("#ErrosCadastro").html(`<div class="alert alert-success" role="alert">
                                       Responsáveis atualizados com sucesso!
                                    </div>`);
                                }
                                document.getElementById("LoaderCadastrarResponsaveis").style.display = "none";
                        },

                        // handle a non-successful response
                        error : function(xhr,errmsg,err) {
                            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                        }
                    });


}

function SalvarObservacaoIntegracao(){
 $("#loaderSalvarObservacao").show()
  var OBS = $.trim($("#ObservacaoInt").val());

     $.ajax({
            url : "/app/civil/Integracao/"+$("#IDAtiv").html()+"/", // the endpoint
            type : "POST", // http method
            data : { SalvarObservacao : true, Observacao : OBS, IDIntegracao : $("#SelectIntegracoes").val() }, // data sent with the post request

            // handle a successful response
            success : function(json) {
                document.getElementById("loaderSalvarObservacao").style.display = "none";
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });
}
function CriarIntegracao(){
   $("#loaderCriacaoIntegracao").show()
     $.ajax({
            url : "/app/civil/Integracao/"+$("#IDAtiv").html()+"/", // the endpoint
            type : "POST", // http method
            data : { Cadastrar : true }, // data sent with the post request

            // handle a successful response
            success : function(json) {
                PreencherSelectIntegracoes();
                document.getElementById("loaderCriacaoIntegracao").style.display = "none";
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });
}
function PegarAreasIntegracao()
{
     var request = $.ajax({
      url: "/app/civil/RetornaAreasIntegracao/",
      method: "GET",
      data: { }
    });

    request.done(function( dt ) {
            dt.forEach((Area) =>{
                AreasIntegracao.push(Area);
            })
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
}

function PegarItensIntegracaoEPreencherTabela()
{
     var request = $.ajax({
      url: "/app/civil/RetornaItemIntegracoesPorIDItegracao/",
      method: "GET",
      data: { IDA: $("#SelectIntegracoes").val()}
    });

    request.done(function( dt ) {
            dt.forEach((Item) =>{
             var table = document.getElementById("Tabela");
              var Linha = $('#Tabela tr').length;
               var row = table.insertRow(Linha);
                   var cell1 = row.insertCell(0);
                   var cell2 = row.insertCell(1);
                   var cell3 = row.insertCell(2);
                   var cell4 = row.insertCell(3);
                   var cell5 = row.insertCell(4);
                   var cell6 = row.insertCell(5);


                    var HTMLOptions = "";
                    for(var i = 0; i < AreasIntegracao.length; i++)
                    {
                        if(AreasIntegracao[i].id == Item.DisciplinaIntegracao)
                        {
                            HTMLOptions += `<option selected value="${AreasIntegracao[i].id}">${AreasIntegracao[i].Disciplina}</option>`;
                        }
                        else
                        {
                            HTMLOptions += `<option value="${AreasIntegracao[i].id}">${AreasIntegracao[i].Disciplina}</option>`;
                        }
                    }
                   var HTMLSelect = `<select class="custom-select">

                                    ${HTMLOptions}
                                  </select>`;

                     var HtmlStatus = "";

                      for(var i = 0; i < StatusIntegracao.length; i++)
                    {

                        if(StatusIntegracao[i].id == Item.StatusIntegracao)
                        {
                             HtmlStatus += `<option selected value="${StatusIntegracao[i].id}">${StatusIntegracao[i].Status}</option>`;
                        }
                        else
                        {
                             HtmlStatus += `<option value="${StatusIntegracao[i].id}">${StatusIntegracao[i].Status}</option>`;
                        }
                    }
                        var HTMLSelectStatus = `<select disabled style="width: 250px" class="custom-select">
                                    ${HtmlStatus}
                                  </select>`;

                     var HTMLUsuarios = "";
                    for(var i = 0; i < Usuarios.length; i++)
                    {
                        if(Usuarios[i].Usuario == Item.Responsavel)
                        {
                             HTMLUsuarios += `<option selected value="${Usuarios[i].Usuario}">${Usuarios[i].Nome}</option>`;
                        }
                        else
                        {
                            HTMLUsuarios += `<option value="${Usuarios[i].Usuario}">${Usuarios[i].Nome}</option>`;
                        }
                    }
                    var HTMLSelectUsuarios = `<select class="custom-select">
                                    ${HTMLUsuarios}
                                  </select>`;
                     var HTMLLink = `<a href="/app/civil/ItemIntegracao/${Item.id}" style="width: 100%" class="btn btn-primary">Acessar</a>`
                   cell1.innerHTML = Linha;
                   cell2.innerHTML = HTMLSelect;
                   cell3.innerHTML = HTMLSelectUsuarios;
                   cell4.innerHTML = HTMLSelectStatus;
                   cell5.innerHTML = HTMLLink;
                   cell6.innerHTML = `<button type="button" class="centerbtn shadow-sm btn btn-danger btn-sm btnDelete" style="float: right; padding: 2px; width: 34px" title="Apagar Linha"> [X]</button>`;

            })
             ReordenarNumerosTabela();
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });
}

function RemoverIntegracaoModal(){

        $("#PreenchimentoCadastroPreenchimento").html(`<p>Tem certeza que deseja remover a integração selecionada?</p>`);
        $("#ConfirmacaoApagarIntegracao").modal("show");

}
function ApagarIntegracao()
{
     $("#loaderConfirmacaoApagarIntegracao").show();
 $.ajax({
            url : "/app/civil/Integracao/"+$("#IDAtiv").html()+"/", // the endpoint
            type : "POST", // http method
            data : { Apagar : true, IDIntegracao : $("#SelectIntegracoes").val() }, // data sent with the post request

            // handle a successful response
            success : function(json) {
                PreencherSelectIntegracoes();
                   $("#ConfirmacaoApagarIntegracao").modal("hide");
                    document.getElementById("loaderConfirmacaoApagarIntegracao").style.display = "none";
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {
                $('#resultsComentarios').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });

}
function PegarStatusIntegracao()
{
     var request = $.ajax({
      url: "/app/civil/RetornaStatusIntegracao/",
      method: "GET",
      data: { }
    });

    request.done(function( dt ) {
            dt.forEach((Status) =>{
                StatusIntegracao.push(Status);
            })
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

function PreencherSelectIntegracoes(Disciplina, TipoVerifica){

    var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornaIntegracoesPorIDAtividade/",
      method: "GET",
      data: {IDA : $('#IDAtiv').html()  }
    });

    request.done(function( dt ) {
       $("#SelectIntegracoes").empty();
        var o = new Option("---------", "");
                  $(o).html("---------");
                  $("#SelectIntegracoes").append(o);
              dt.forEach((Sist) => {
                        var date = new Date(Sist.DataCadastro);
                        date.setDate(date.getDate() + 1)
                        var Data = (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear();
                        var o = new Option("Solicitação do dia " + Data, Sist.id);
                              $(o).html( "Solicitação do dia " + Data);
                               $("#SelectIntegracoes").append(o);
                     })
                              $('#Integracoes').html("");

       jQuery(`<div class="flex"><button class="subscribe btn btn-warning  rounded-pill shadow-sm BotaoBorder flex-item" style="width: 50%; margin-top: 0px" onclick="CriarIntegracao()">Criar Nova Integração</button></div>`).appendTo('#Integracoes');
         $('#BotaoRemoverIntegracao').prop("disabled", true);
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });


}

function AdicionarLinhaNaTabela(){
 if($("#ListaAutoVerificacoes option:selected").text() != "---------")
    {
    var table = document.getElementById("Tabela");
      var Linha = $('#Tabela tr').length;
       var row = table.insertRow(Linha);
           var cell1 = row.insertCell(0);
           var cell2 = row.insertCell(1);
           var cell3 = row.insertCell(2);
           var cell4 = row.insertCell(3);
           var cell5 = row.insertCell(4);
           var cell6 = row.insertCell(5);


            var HTMLOptions = "";
            for(var i = 0; i < AreasIntegracao.length; i++)
            {
                HTMLOptions += `<option value="${AreasIntegracao[i].id}">${AreasIntegracao[i].Disciplina}</option>`;
            }
           var HTMLSelect = `<select class="custom-select">
                            <option selected>---------</option>
                            ${HTMLOptions}
                          </select>`;

             var HtmlStatus = "";
              for(var i = 0; i < StatusIntegracao.length; i++)
            {
                if(StatusIntegracao[i].Status == "Aguardando Resposta")
                {
                     HtmlStatus += `<option selected value="${StatusIntegracao[i].id}">${StatusIntegracao[i].Status}</option>`;
                }
                else
                {
                     HtmlStatus += `<option value="${StatusIntegracao[i].id}">${StatusIntegracao[i].Status}</option>`;
                }
            }
                var HTMLSelectStatus = `<select disabled style="width: 250px" class="custom-select">
                            ${HtmlStatus}
                          </select>`;

             var HTMLUsuarios = "";
            for(var i = 0; i < Usuarios.length; i++)
            {
                HTMLUsuarios += `<option value="${Usuarios[i].Usuario}">${Usuarios[i].Nome}</option>`;
            }
            var HTMLSelectUsuarios = `<select class="custom-select">
                            <option selected>---------</option>
                            ${HTMLUsuarios}
                          </select>`;

           cell1.innerHTML = Linha;
           cell2.innerHTML = HTMLSelect;
           cell3.innerHTML = HTMLSelectUsuarios;
           cell4.innerHTML = HTMLSelectStatus;
           cell5.innerHTML = "";
           cell6.innerHTML = `<button type="button" class="centerbtn shadow-sm btn btn-danger btn-sm btnDelete" style="float: right; padding: 2px; width: 34px" title="Apagar Linha"> [X]</button>`;
           ReordenarNumerosTabela();
        }
}
function ReordenarNumerosTabela()
{
     var table = document.getElementById("Tabela");
          for (let row of table.rows)
        {
            if(row.rowIndex > 0) //para evitar o header
            {
              row.cells[0].innerHTML = row.rowIndex;

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
