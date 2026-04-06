var Usuarios;
$( document ).ready(function() {

});
document.addEventListener("DOMContentLoaded", async function(){
    Usuarios = await PegarUsuarios()
    document.getElementById("SelectOS").removeAttribute("disabled");
});
$('#SelectOS').change(function() {
 SelectOSChanged();
});
async function SelectOSChanged()
{
    $("#loaderProgresso").show();
    var IDOS = $("#SelectOS").val()
    var Verificacoes = await RetornarTodasVerificacoesOS(IDOS)
    var Atividades = await RetornarTodasAtividadesOS(IDOS)


     if($( "#TabelaAtividades" ).html() != "")
    {
       $('#TabelaAtividades').DataTable().clear().destroy(false);
       $('#TabelaAtividades').empty();
        $("#TabelaAtividades tbody").empty();
        $("#TabelaAtividades thead").empty();
    }
    var Dados = []
    var AtividadesCadastradas = []
    for(var i = 0; i < Verificacoes.length; i++)
    {
        if(!AtividadesCadastradas.includes(Verificacoes[i].Atividade))
        {
            if(Verificacoes[i].NotaAutomaticaAtv != null)
            {
                AtividadesCadastradas.push(Verificacoes[i].Atividade)
            }
        }
    }
    var DadosExportar = [];
    for(var i = 0; i < AtividadesCadastradas.length; i++)
    {
        var NotaModelo = null;
        var NotaDocumento = null;
        var RespModelo = null;
        var RespDocumento = null;
        var CodDoc = "";
        for(var j = 0; j < Verificacoes.length; j++)
        {
            if(Verificacoes[j].Atividade == AtividadesCadastradas[i])
            {
                if(Verificacoes[j].Modelo )
                {
                     RespModelo = Verificacoes[j].Responsavel;
                     if(Verificacoes[j].NotaAutomaticaAtv)
                     {
                        NotaModelo = Verificacoes[j].NotaAutomaticaAtv;
                     }
                }
                if(Verificacoes[j].Documento)
                {
                    RespDocumento = Verificacoes[j].Responsavel;
                    if(Verificacoes[j].NotaAutomaticaAtv)
                    {
                        NotaDocumento = Verificacoes[j].NotaAutomaticaAtv;
                    }
                }
            }
            if(NotaModelo == null) {NotaModelo="Não Verificado";}
            if(NotaDocumento == null) {NotaDocumento="Não Verificado";}
            if(RespModelo == null)
             {
                RespModelo="Sem Modelo";
             }
             else
             {
                for(var k = 0; k < Usuarios.length; k++)
                {
                    if(Usuarios[k].Usuario == RespModelo)
                    {
                        RespModelo = Usuarios[k].Nome;
                        break;
                    }
                }
             }
            if(RespDocumento == null)
             {
                RespDocumento="Sem Documento";
             }
             else
             {
                for(var k = 0; k < Usuarios.length; k++)
                {
                    if(Usuarios[k].Usuario == RespDocumento)
                    {
                        RespDocumento = Usuarios[k].Nome;
                        break;
                    }
                }
             }

        }

        for(var j = 0; j < Atividades.length; j++)
        {
            if(Atividades[j].id == AtividadesCadastradas[i])
            {
                CodDoc = Atividades[j].CodigoDocumento;
                break;
            }
        }
         var HTMLAcessar =`<p style="display: none">${AtividadesCadastradas[i]}</p><button value="" onclick="window.location='/app/civil/DetalhesAtividade/${AtividadesCadastradas[i]}'" class="centerbtn shadow-sm btn btn-secondary btn-sm" style="padding: 2px; font-size:75%;" title="Acessar Atividade">Acessar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg></button>`;
         DadosExportar.push([CodDoc, RespModelo, NotaModelo, RespDocumento, NotaDocumento, HTMLAcessar]);
    }
     $('#TabelaAtividades').DataTable( {
            data: DadosExportar,
            columns: [
                { title: "Código Documento" },
                { title: "Responsavel Modelo" },
                { title: "Nota Modelo" },
                { title: "Responsavel Documento" },
                { title: "Nota Documento" },
                { title: "Acessar" }

            ],
            columnDefs: [
                        // Center align the header content of column 1
                       { className: "dt-center", targets: [ 0, 1, 2, 3, 4 ] },

                    ],
               "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
             "pageLength": 50,
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
                  "info":           "Mostrando atividade _START_ à _END_ de um total de _TOTAL_",
                  "infoEmpty":      "Sem atividades",
                  "infoFiltered":   "(Filtrando de um total de _MAX_)",
            }


        } );
        table = $('#TabelaAtividades').DataTable();

        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );


    $("#loaderProgresso").hide();
}

async function PegarUsuarios(){

    let request;
      request = await $.ajax({
      url: "/app/civil/RetornarUsuariosLista/",
      method: "GET",
      data: { }
    });

   return request;
}
async function RetornarTodasVerificacoesOS(IDOS){

    let request;
      request = await $.ajax({
      url: "/app/civil/RetornarVerificacoesPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos", "CalcularNota": true }
    });

   return request;
}
async function RetornarTodasAtividadesOS(IDOS){

    let request;
      request = await $.ajax({
      url: "/app/civil/RetornarAtividadesPorOSeUsuario/",
      method: "GET",
      data: {"OS": IDOS, "Usuario": "Todos" }
    });

   return request;
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