
var AreasIntegracao = []
var StatusIntegracao = []
var Usuarios = []
$( document ).ready(function() {
PegarUsuarios();
PegarAreasIntegracao();
PegarStatusIntegracao();
CarregarArquivosIntegracao();


      IDAtividade = $("#IDAtiv").html();

     $(':disabled').css({
        color:'#495057'
    });
if($("#ArquivoInt").html() != "")
{
    $("#DownloadA").attr("href", "/app/civil/DownloadAnex/" + $("#ArquivoInt").html());
}
else
{
    document.getElementById("DownloadA").style.display = "none";
}


});





resultElement = document.getElementById('progress-bar-message');

const uploadForm = document.getElementById("upload-form")

const input = document.getElementById("ArquivoPDF")

const alertBox = document.getElementById("alert-box")

const imageBox = document.getElementById("image-box")

const progressBox = document.getElementById("progress-box")

const cancelBox = document.getElementById("cancel-box")

const cancelBtn = document.getElementById("cancel-btn")

const csrf = document.getElementsByName("csrfmiddlewaretoken")





function SalvarAprovacao(){
$("#loaderSalvarIntegracao").show()
    var OBS = $.trim($("#ObservacaoAprovador").val());
         const input = document.getElementById("id_NomeDoArquivoIn")
        const progressBox = document.getElementById("progress-box")
        const fd = new FormData()
        const file_data = input.files[0]
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Arquivo", file_data)
        fd.append("Observacao", OBS)
        fd.append("Status", $("#StatusItemIntegracao").val())

        $.ajax({
            type: 'POST',
            url: "/app/civil/ItemIntegracao/"+$("#IDItemIntegracao").html()+"/",
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
                       progressBox.innerHTML = `<div class="progress">
                        <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                        </div>
                        <p>${percent.toFixed(1)}%<p>
                        `


                   }
                })
                return xhr
            },
            success: function(response){
                        $("#progress-box").html("")
                                $("#ResultadoSalvar").html(`<div class="alert alert-success" role="alert">
                                       Dados atualizados com sucesso!
                                    </div>`);
                                  document.getElementById("loaderSalvarIntegracao").style.display = "none";
                                  if(response["Arquivo"] != "")
                                    {
                                        $("#DownloadA").attr("href", "/app/civil/DownloadAnex/" + response["Arquivo"]);
                                        $("#DownloadA").show();



                                    }
                                    else
                                    {
                                        document.getElementById("DownloadA").style.display = "none";
                                        $("#DownloadA").attr("href", "");
                                    }



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
function CarregarArquivosIntegracao()
{
    var Arquivos = [];
         var request = $.ajax({
      url: "/app/civil/RetornaArquivosIntegracao/",
      method: "GET",
      data: { IDIntegracao: $("#IDIntegracao").html()}
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
                    DataArquivos.push([Arquivos[i].DescricaoArquivo, UsuarioNome, Data, Extensao, BotaoDownload])
                }
                $('#TabelaArquivos').DataTable( {
                    data: DataArquivos,
                    columns: [
                        { title: "Descrição" },
                        { title: "Responsável", width: "200px" },
                        { title: "Data", width: "100px"  },
                        { title: "Extensão", width: "100px" },
                        { title: "Download", width: "40px" },
                    ],
                    columnDefs: [
                        // Center align the header content of column 1
                       { className: "dt-center", targets: [ 1, 2, 3, 4 ] },

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
