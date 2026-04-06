
var Usuarios = []
$( document ).ready(function() {
        RetornaUsuariosECarregarJanelaArquivos();
        $('#FormNaoEnviar').hide();
        document.getElementById("loaderDetalhes").style.display = "block";
        IDAtividade = $("#IDAtiv").html();
        CarregarComentarios(IDAtividade);
        $('#FormNaoEnviar').show();
        document.getElementById("loaderDetalhes").style.display = "none";
        $(':disabled').css({
            color:'#495057'
        });

});
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
var NomeEtapa = "Emissão";
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







$('#ArquivoPDF').attr('accept', ".pdf");
$('input:file').change(
    function(e){
    $('#id_NomeDoArquivo').val(e.target.files[0].name);
    $('#id_NomeDoArquivolbl').html(e.target.files[0].name);

});



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
                     `<button type="button" class="btn btn-secondary" style="padding: 2px; font-size:75%;float: right" title="Remover Comentário" onclick="ApagarComentarioForm(${Comentarios[i].id})">
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

function AlterarStatusEstudo(){
var IDSelecionado = $( "#StatusEmissao option:selected" ).text();
var Data = $("#DataEmissaoInput").val();
var NumeroGR = $("#NumeroGR").val();
var ValidacaoEmitido = true; //inicializa em verdadeiro pois só vai ser falso caso seja emitido sem data e numero gr
if(IDSelecionado == "Emitido")
{
    if(Data && NumeroGR)
    {
        ValidacaoEmitido = true;
    }
    else
    {
        ValidacaoEmitido = false;
    }

}



if(IDSelecionado != "---------" && ValidacaoEmitido)
{

        document.getElementById("loaderStatus").style.display = "block";

    var StatusNovo = $("#StatusEmissao").val();
      $.ajax({
            url : "/app/civil/Emissao/"+IDAtividade+"/", // the endpoint
            type : "POST", // http method
            data : { IDAtividade : IDAtividade, "IDStatus" : StatusNovo, DataEmissao: Data, "NumeroGR": NumeroGR}, // data sent with the post request

            // handle a successful response
            success : function(json) {
                 $('#AvisoAlteracaoStatusEstudo').modal('hide')
                  document.getElementById("loaderStatus").style.display = "none";
                   $("#ErrorAlteracaoStatus").html(" ")
                   $("#NumeroGrTitulo").val(NumeroGR)
                   if(IDSelecionado != "Emitido")
                   {
                        $("#NumeroGrTitulo").val("Sem Número Cadastrado")
                   }
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
            $("#ErrorAlteracaoStatus").html(`<div class="alert alert-danger" role="alert">
  Todos os campos devem ser preenchidos!
</div>`)
    }
}
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

function MostrarModalAlteracaoStatus(){
     $("#ErrorAlteracaoStatus").html(" ");
var NovoStatusTexto = $("#StatusEmissao option:selected").text();

if(NovoStatusTexto != "---------")
{
if(NovoStatusTexto == "Emitido")
{
    $("#DataEmissaoDiv").show();
}
else
{
    $("#DataEmissaoDiv").hide();
}
        var HTML = `Tem certeza que deseja alterar o status para <b style="color: orange">${NovoStatusTexto}</b>?`;
    $("#AvisoErroAtividades").html(HTML);

     $('#AvisoAlteracaoStatusEstudo').modal('show')
 }
}

function CriarComentarioForm() {
     $.ajax({
        url : "/app/civil/CriarComentario/", // the endpoint
        type : "POST", // http method
        data : { Comentario : $('#observacao-comentario').val(), AtividadeID : $('#IDAtiv').html(), Origem: "Emissão" }, // data sent with the post request

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
