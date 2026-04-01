var QuantidadeAtividades = 0;
var Contagem = 0;
window.onload = async function() {
console.log("OI1");
$("#LoaderLeituraExcel").show()
 var ID = $("#IDCadastro").html()
console.log("OI2");
 var DadosPlanilha = await RetornaDadosPlanilha(ID)
    console.log("OI3");
 QuantidadeAtividades = DadosPlanilha.length;
 Contagem = 0;
 console.log("OI3");
  $("#LoaderLeituraExcel").hide()
 CriarTabelaDados();
PreencherPlanilha(DadosPlanilha);

};
function PreencherPlanilha(DadosPlanilha)
{
    console.log(DadosPlanilha)
    for(var i = 0; i < DadosPlanilha.length; i++)
    {
        console.log(DadosPlanilha[i]);
        AdicionarAtividade(DadosPlanilha[i]);

    }

}
function CriarTabelaDados(DadosPlanilha){
var DataSet = []


    $('#TabelaDados').DataTable( {
            data: DataSet,
            columns: [
                { title: "Linha" },
                { title: "Disciplina" },
                { title: "Status", width: "100px" },
                { title: "Código Doc" },
                { title: "Revisão" },
                { title: "Tag Referência" },
                { title: "Área Projeto" },
                { title: "Tipo Documento"},
                { title: "Finalidade" },
                { title: "Erros", width: "350px" },
            ],
              columnDefs: [
                        // Center align the header content of column 1
                       { className: "dt-center", targets: [ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ] },

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
        table = $('#TabelaDados').DataTable();
       /*  $('#TabelaDados tbody').on('click', 'tr', function () {
            var data = table.row( this ).data();
            console.log("selecionar elemento " + data[0]);

        } );*/
    //     $('#TabelaAtividades tbody').on( 'click', 'tr', function () {
    //
    //            table.$('tr.selected').removeClass('selected');
    //            $(this).removeClass('selected');
    //            $(this).addClass('selected');
    //              var data = table.row( this ).data();
    //
    //
    //    } );
        /*
        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );
        */

}
function AdicionarAtividade(Atividade)
{
            var t = $('#TabelaDados').DataTable();
            console.log(t)
            var row = t.row.add( [
                Atividade.Nlinha,
                Atividade.Disciplina,
                Atividade.Status,
                Atividade.CodDoc,
                Atividade.Rev,
                Atividade.TagRefe,
                Atividade.AreaProjeto,
                Atividade.TipoDoc,
                Atividade.Finalidade,
                Atividade.Erros_Insert
            ] ).draw( false );
        /*
        $.ajax({
            type: 'post',
            url: "/app/civil/CadastroAtividadeLoteUnico/",
            dataType : "json",
            data: { "Atividade": JSON.stringify(Atividade), "IDCad":  $("#IDCadastro").html()  },
            success: function(response){
                AtualizarProgress();

                row.data()[9] = response["Erros"];
                row.data( row.data()).draw()
            },
            fail: function(error){

            },
        })*/

}

function AtualizarProgress()
{
    Contagem++;
    var DadosPorc = Math.round10(Contagem*100/QuantidadeAtividades,0);
    var Color = "";
    if(DadosPorc < 25) Color = "bg-danger";
    else if(DadosPorc < 50) Color = "bg-warning";
    else if(DadosPorc < 75) Color="bg-info"
    else Color = "bg-success";
    var HTML = `<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated ${Color}" role="progressbar" aria-valuenow="${DadosPorc}" aria-valuemin="0" aria-valuemax="100" style="width: ${DadosPorc}%">${DadosPorc}%</div>
</div>`;
$("#ProgressBar").html(HTML);

}

async function RetornaDadosPlanilha(ID){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaDadosCadastroLote/" + ID + "/",
      method: "GET",
      data: {  }
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
