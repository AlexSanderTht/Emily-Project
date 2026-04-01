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


    $("#loaderProgresso").hide();
}
$('#Disciplinas').change(function() {
CheckSelections();

});
$('#TipoVerifica').change(function() {
    CheckSelections();

});
function PreencherSelectLVES(Disciplina, TipoVerifica){

  var Disc = $("#Disciplinas option:selected").text();
    var Tip = $("#TipoVerifica option:selected").text();
    var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornarLVEVerificacao/",
      method: "GET",
      data: { Disciplina : Disc, TipoVerifica: Tip }
    });

    request.done(function( dt ) {

                $("#ListaAutoVerificacoes").empty();
             var o = new Option("---------", "");
                  $(o).html("---------");
                  $("#ListaAutoVerificacoes").append(o);
              dt.forEach((Sist) => {
                    var o = new Option(Sist.Titulo, Sist.id);
                          $(o).html(Sist.CodigoDocumento + " - " + Sist.Titulo);
                           $("#ListaAutoVerificacoes").append(o);
                     })
    });

    request.fail(function( jqXHR, textStatus ) {
      console.log( "Request failed: " + textStatus );
    });


}
const checkbox = document.getElementById('TodasAsDatas')

checkbox.addEventListener('change', (event) => {
  if (event.currentTarget.checked) {
    document.getElementById("DataFrom").removeAttribute("disabled");
    document.getElementById("DataTo").removeAttribute("disabled");
  } else {
       document.getElementById("DataFrom").setAttribute("disabled", "disabled");
           document.getElementById("DataTo").setAttribute("disabled", "disabled");
  }
})

function ValidarData(element)
{
    var date = Date.parse(element.value.toString());
    if (isNaN(date))
        return null
    else
        return date
}
function CheckSelections()
{
    var Disciplina = $("#Disciplinas option:selected").text();
    var TipoVerifica = $("#TipoVerifica option:selected").text();
     $("#ListaAutoVerificacoes").empty();
    if(Disciplina != "---------" && TipoVerifica != "---------")
    {
        PreencherSelectLVES(Disciplina, TipoVerifica);
    }
    else
    {
      $("#ListaAutoVerificacoes").empty();
      var o = new Option("---------", "");
      $(o).html("---------");
      $("#ListaAutoVerificacoes").append(o);
    }
}
async function Buscar()
{
    $("#loaderDetalhes").show();
    var LVE = $("#ListaAutoVerificacoes option:selected").text();
    var OS = $("#SelectOS option:selected").text();
    var TodasASDatas = false;
    var DatasValidas = false;
    const cb = document.getElementById('TodasAsDatas');
    if(cb.checked)
    {
        TodasASDatas = false;
        DatasValidas = false;
        const DataFrom = document.getElementById('DataFrom');
        const DataTo = document.getElementById('DataTo');
        var dataFrom = ValidarData(DataFrom)
        var dataTo = ValidarData(DataTo)
        if(dataFrom == null || dataTo == null)
        {
            var HTML = `<div class="alert alert-danger" role="alert">
              Utilize datas válidas!
            </div>`;
             $("#error-Data").html(HTML);
             DatasValidas = false;
        }
        else
        if(dataTo < dataFrom)
        {
             var HTML = `<div class="alert alert-danger" role="alert">
              A data <b>Até</b> deve ser maior que a data <b>De</b>!
            </div>`;
             $("#error-Data").html(HTML);
             DatasValidas = false;
        }
        else
        {
          $("#error-Data").html("");
          DatasValidas = true;
        }
    }
    else
    {
        TodasASDatas = true;
        DatasValidas = true;
        $("#error-Data").html("");
    }
    if(LVE == "---------")
    {
        var HTML = `<div class="alert alert-danger" role="alert">
          Selecione uma LVE!
        </div>`;
        $("#error-LVE").html(HTML);
    }
    else
    {
        $("#error-LVE").html("");
    }
    if(OS == "---------")
    {
        var HTML = `<div class="alert alert-danger" role="alert">
          Selecione uma OS!
        </div>`;
        $("#error-OS").html(HTML);
    }
    else
    {
        $("#error-OS").html("");
    }

    if(DatasValidas && LVE != "---------" && OS != "---------")
    {
        var Filtrar = !TodasASDatas;
        var IDOS = $("#SelectOS option:selected").val();
        var IDLVE = $("#ListaAutoVerificacoes option:selected").val();
        var Usuario = $("#SelectUsuario option:selected").val();
        var Dados = await PegarInfo(IDOS, IDLVE, Usuario, Filtrar, document.getElementById('DataFrom').value, document.getElementById('DataTo').value);
        console.log(Dados)
        CriarTabelas(Dados, Usuario);

    }
    $("#loaderDetalhes").hide();
}
function CriarTabelas(ItemsLVE, Usuario)
{
    $("#ResultadoPesquisa").html("")
    var Selecoes = [];
    var ItemsSelecionados = [];
    for(var i = 0; i < ItemsLVE.length; i++)
    {
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
            "style": "margin-left:0px; margin-right:0px; margin-top: 25px; margin-bottom: 25px"
        }).appendTo('#ResultadoPesquisa');

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
                       if(QtdElementos == 3)
                       {
                            QtdElementos = 0;
                       }
                       else
                       {
                             QtdElementos++;
                       }


                        jQuery('<div/>', {
                            id: 'ColDivLVEVerif'+i+j+k,
                            "class": 'col LVEItemSemDiv',
                            "style": 'height: 250px;'
                        }).appendTo(DivAtual);




                        var el = jQuery(`<div style="display: table-cell; vertical-align: middle;">
                        <p class="" >${ItemsSelecionados[k].Nome}</p>
                        <div class="TextoHiddenGrafico">${ItemsSelecionados[k].QuantidadeErrosTodos};${ItemsSelecionados[k].QuantidadeErrosUser};${ItemsSelecionados[k].QuantidadeTotalTodos};${ItemsSelecionados[k].QuantidadeTotalUser};Chart-${i}-${j}-${k}</div>
                        <canvas id="Chart-${i}-${j}-${k}" width="250" height="150" ></canvas>
                        </div>`, {
                            id: 'ColPDivLveVerif'+i+j+k,

                        }).appendTo('#ColDivLVEVerif'+i+j+k);

                     }
                 }

         }
    }
    CriarGraficos(Usuario);
}
function CriarGraficos(Usuario)
{
    var TodosItens = $(".TextoHiddenGrafico").map(function() {
        return this;
    }).get();
    for(var i = 0; i < TodosItens.length; i++)
    {
         var Elemento = TodosItens[i];
         var Dados = Elemento.innerHTML.split(';')
         var QuantidadeErrosTodos = Dados[0];
         var QuantidadeErrosUser = Dados[1];
         var QuantidadeTotalTodos = Dados[2];
         var QuantidadeTotalUser = Dados[3];
         var IDCanvas = Dados[4];
        if(Usuario == "Todos")
        {
            var corTodos = "";
            var Divisor = Math.round10(parseFloat(QuantidadeErrosTodos/QuantidadeTotalTodos),-1);

            if(Divisor < 0.25) corTodos = "#01ff10";
            else if(Divisor < 0.50) corTodos = "#01f7ff";
            else if(Divisor < 0.75) corTodos = "#ffa601";
            else corTodos = "#ff0101";
            var ctx = document.getElementById(IDCanvas).getContext('2d');
                 data = {
                  labels: ["Erros(Todos)"],
                  datasets: [
                 {
                      label: 'Erros Por Item',
                      data: [Divisor],
                       borderColor: [ corTodos ],
                       backgroundColor: [ corTodos+"66"],
                        borderWidth: 3
                    }
                  ]
                };

                 var DataChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                              responsive: false,
                              maintainAspectRatio: false,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },

                                }
                              },
                            });

        }
        else
        {

            var Divisor = Math.round10(parseFloat(QuantidadeErrosTodos/QuantidadeTotalTodos),-1);
            var DivisorUsuario = Math.round10(parseFloat(QuantidadeErrosUser/QuantidadeTotalUser),-1);

            var corTodos = "";
            if(Divisor < 0.25) corTodos = "#01ff10";
            else if(Divisor < 0.50) corTodos = "#01f7ff";
            else if(Divisor < 0.75) corTodos = "#ffa601";
            else corTodos = "#ff0101";

             var corUsuario = "";
            if(DivisorUsuario < 0.25) corUsuario = "#01ff10";
            else if(DivisorUsuario < 0.50) corUsuario = "#01f7ff";
            else if(DivisorUsuario < 0.75) corUsuario = "#ffa601";
            else corUsuario = "#ff0101";

            var ctx = document.getElementById(IDCanvas).getContext('2d');
                 data = {
                  labels: ["Erros(Usuario)", "Erros(Todos)"],
                  datasets: [
                 {
                      label:'Erros por Item',
                      data: [DivisorUsuario, Divisor],
                       borderColor: [ corUsuario, corTodos ],
                       backgroundColor: [corUsuario+"66", corTodos+"66"],
                        borderWidth: 3
                    }
                  ]
                };

                 var DataChart = new Chart(ctx, {
                              type: 'bar',
                              data: data,
                              options: {
                               responsive: false,
                                plugins: {
                                  legend: {
                                    position: 'top',
                                    display: false,
                                  },

                                }
                              },
                            });
        }
         Elemento.innerHTML = "";
         Elemento.classList.remove("TextoHiddenGrafico");
    }


}
async function PegarInfo(IDOS, IDLVE, Usuario, Filtrar, dataDe, dataAte){

    let request;
      request = await $.ajax({
      url: "/app/civil/RetornaDadosNota/",
      method: "GET",
      data: { "IDOS" : IDOS, "IDLVE": IDLVE, "Usuario": Usuario, "Filtrar": Filtrar, "DataDe": dataDe, "DataAte": dataAte }
    });

   return request;
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