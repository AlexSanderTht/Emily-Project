
var InfoSistemas = []
window.onload = async function() {
$.noConflict();
 InfoSistemas = await GetInfoImports();
 PreencherOS();


 /*jspreadsheet(document.getElementById('spreadsheet'), {
    data:data,
    columns: [
        { type: 'text', title:'Car', width:120 },
        { type: 'dropdown', title:'Make', width:200, source:[ "Alfa Romeo", "Audi", "Bmw" ] },
        { type: 'calendar', title:'Available', width:200 },
        { type: 'image', title:'Photo', width:120 },
        { type: 'checkbox', title:'Stock', width:80 },
        { type: 'numeric', title:'Price', width:100, mask:'$ #.##,00', decimal:',' },
        { type: 'color', width:100, render:'square', }
     ]
});*/
};
var data = [
    ['Jazz', 'Honda', '2019-02-12', '', true, '$ 2.000,00', '#777700'],
    ['Civic', 'Honda', '2018-07-11', '', true, '$ 4.000,01', '#007777'],
];



   var TableBackgroundNormalColor = "#343a40";
    var TableBackgroundMouseoverColor = "#6c757d";

    // These two functions need no customization.
    function ChangeBackgroundColor(row) {
        row.style.backgroundColor = TableBackgroundMouseoverColor;
    }

    function RestoreBackgroundColor(row) {
        row.style.backgroundColor = TableBackgroundNormalColor;
    }

function PreencherOS()
{
    var OSs = [];
    for(var i = 0; i < InfoSistemas.length; i++)
    {
        if(!OSs.includes(InfoSistemas[i].os))
        {
            OSs.push(InfoSistemas[i].os);
        }
    }
      var o = new Option("---------", "");
                  $(o).html("---------");
                  $("#SelectOS").append(o);
      var oSist = new Option("---------", "");
                  $(oSist).html("---------");
                  $("#SelectSistema").append(oSist);
      var oRev = new Option("---------", "");
                  $(oRev).html("---------");
                  $("#SelectRev").append(oRev);
    OSs.sort();
    for(var i = 0; i < OSs.length; i++)
    {
         var o = new Option(OSs[i]);
                          $(o).html(OSs[i]);
                           $("#SelectOS").append(o);

    }

}

$('#SelectOS').change(function() {
$("#SelectRev").empty();
$("#SelectSistema").empty();
  var oRev = new Option("---------", "");
                  $(oRev).html("---------");
                  $("#SelectRev").append(oRev);
     var oSist = new Option("---------", "");
                  $(oSist).html("---------");
                  $("#SelectSistema").append(oSist);
   if($("#SelectOS option:selected").text() != "---------")
    {
        var Sistemas = [];
        for(var i = 0; i < InfoSistemas.length; i++)
        {
            if(InfoSistemas[i].os == $("#SelectOS option:selected").text() && !Sistemas.includes(InfoSistemas[i].sistema))
            {
                Sistemas.push(InfoSistemas[i].sistema);
            }
        }
         Sistemas.sort();
           for(var i = 0; i < Sistemas.length; i++)
        {
             var o = new Option(Sistemas[i]);
                              $(o).html(Sistemas[i]);
                               $("#SelectSistema").append(o);

        }
    }
VerificarBotao();
});

$('#SelectSistema').change(function() {
$("#SelectRev").empty();
  var oRev = new Option("---------", "");
                  $(oRev).html("---------");
                  $("#SelectRev").append(oRev);

   if($("#SelectSistema option:selected").text() != "---------")
    {
        var Revs = [];
        for(var i = 0; i < InfoSistemas.length; i++)
        {
            if(InfoSistemas[i].os == $("#SelectOS option:selected").text() && InfoSistemas[i].sistema == $("#SelectSistema option:selected").text() && !Revs.includes(InfoSistemas[i].revisão))
            {
                Revs.push(InfoSistemas[i].revisão);
            }
        }
         Revs.sort();
           for(var i = 0; i < Revs.length; i++)
        {
             var o = new Option(Revs[i]);
                              $(o).html(Revs[i]);
                               $("#SelectRev").append(o);

        }
    }
VerificarBotao();

});
function VerificarBotao()
{
     if($("#SelectRev option:selected").text() != "---------")
    {
        $("#BotaoCarregar").removeAttr('disabled');
        $("#BotaoCarregar").removeClass( "btn-outline-secondary" ).addClass("btn-warning");
    }
    else
    {
        $("#BotaoCarregar").prop("disabled", true);
        $("#BotaoCarregar").removeClass("btn-warning").addClass("btn-outline-secondary");
    }
}
$('#SelectRev').change(function() {
VerificarBotao();





});
async function CarregarTabela()
{
    $('#loader').show();
    var IdDDs;
    for(var i = 0; i < InfoSistemas.length; i++)
    {
        if(InfoSistemas[i].os == $("#SelectOS option:selected").text() && InfoSistemas[i].sistema == $("#SelectSistema option:selected").text() && InfoSistemas[i].revisão == $("#SelectRev option:selected").text())
        {
            IdDDs = InfoSistemas[i].id;
            break;
        }
    }
    var SuportesInfo = await RetornaInfoSuportes(IdDDs);
    CriarTabela(SuportesInfo)

    $('#loader').hide();
}
function CriarTabela(SuportesInfo)
{
    console.log(SuportesInfo)


    $('div.dropdown-filter-dropdown').remove();
    $("#TabelaSuportes tbody tr").remove();
   var tbodyRef = document.getElementById('TabelaSuportes').getElementsByTagName('tbody')[0];


    if(SuportesInfo.length == 0)
    {
         var row = tbodyRef.insertRow(0);

          var cell1 = row.insertCell(0);
          cell1.colSpan = "9";
          cell1.innerHTML = "Sem Dados";


    }
    else
    {
        for(var i = 0; i < SuportesInfo.length; i++)
        {
          var row = tbodyRef.insertRow(i);

          var cell0 = row.insertCell(0);
          cell0.innerHTML = SuportesInfo[i].IDCaesar;

            var cell1 = row.insertCell(1);
          if(SuportesInfo[i].Nome) cell1.innerHTML = SuportesInfo[i].Nome;

           var cell2 = row.insertCell(2);
          if(SuportesInfo[i].Diametro) cell2.innerHTML = SuportesInfo[i].Diametro;

          var cell3 = row.insertCell(3);
          if(SuportesInfo[i].Imagem) cell3.innerHTML = `<input onchange="SalvarNumeroImagem(${SuportesInfo[i].id}, this.value)" class="inputTabela" value="${SuportesInfo[i].Imagem}"></input>` ;
          else
          cell3.innerHTML = `<input onchange="SalvarNumeroImagem(${SuportesInfo[i].id}, this.value)" class="inputTabela" value=""></input>` ;

           var cell4 = row.insertCell(4);
          if(SuportesInfo[i].Area) cell4.innerHTML = SuportesInfo[i].Area;

            var cell5 = row.insertCell(5);
          if(SuportesInfo[i].Comentario) cell5.innerHTML = SuportesInfo[i].Comentario;

            var cell6 = row.insertCell(6);
            cell6.innerHTML = "Típico Sugerido";

               var cell7 = row.insertCell(7);
            cell7.innerHTML = "Prioridade";

                var cell8 = row.insertCell(8);
          if(SuportesInfo[i].Observacao) cell8.innerHTML = SuportesInfo[i].Observacao;

                 var cell9 = row.insertCell(9);
          if(SuportesInfo[i].Responsavel) cell9.innerHTML = SuportesInfo[i].Responsavel;

                 var cell10 = row.insertCell(10);
          if(SuportesInfo[i].DataAtendido) cell10.innerHTML = SuportesInfo[i].DataAtendido;

        }
    }

    $('table').excelTableFilter();
}
const csrf = document.getElementsByName("csrfmiddlewaretoken")
function SalvarNumeroImagem(id, textoNumero)
{
        const fd = new FormData()
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("TextoNumero", textoNumero)
        fd.append("IdInfoSuporte", id)

        $.ajax({
            type: 'POST',
            url: "/app/flexibilidade/DefinicaoSuportes/",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function(){


            },
            success: function(response){
            },
            fail: function(error){

            },
            cache: false,
            contentType: false,
            processData: false
        })
}

async function GetInfoImports(){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/PesquisarSistemas/PesquisarSistema/",
      method: "GET",
      data: { os: '*', sistema: '*' }
    });

   return request;

}

async function RetornaInfoSuportes(IDDDs){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/PesquisarSistemas/RetornaInfoSuporte/",
      method: "GET",
      data: { IDSistema: IDDDs}
    });

   return request;

}

var tables = document.getElementsByTagName('table');
for (var i=0; i<tables.length;i++){
 resizableGrid(tables[i]);
}

function resizableGrid(table) {
 var row = table.getElementsByTagName('tr')[0],
 cols = row ? row.children : undefined;
 if (!cols) return;

 //table.style.overflow = 'hidden';

 var tableHeight = table.offsetHeight;

 for (var i=0;i<cols.length;i++){
  var div = createDiv(tableHeight);
  cols[i].appendChild(div);
  cols[i].style.position = 'relative';
  setListeners(div);
 }

 function setListeners(div){
  var pageX,curCol,nxtCol,curColWidth,nxtColWidth;

  div.addEventListener('mousedown', function (e) {
   curCol = e.target.parentElement;
   nxtCol = curCol.nextElementSibling;
   pageX = e.pageX;

   var padding = paddingDiff(curCol);

   curColWidth = curCol.offsetWidth - padding;
   if (nxtCol)
    nxtColWidth = nxtCol.offsetWidth - padding;
  });

  div.addEventListener('mouseover', function (e) {
   e.target.style.borderRight = '2px solid #ffc107';
  })

  div.addEventListener('mouseout', function (e) {
   e.target.style.borderRight = '';
  })

  document.addEventListener('mousemove', function (e) {
   if (curCol) {
    var diffX = e.pageX - pageX;

    if (nxtCol)
     nxtCol.style.width = (nxtColWidth - (diffX))+'px';

    curCol.style.width = (curColWidth + diffX)+'px';
   }
  });

  document.addEventListener('mouseup', function (e) {
   curCol = undefined;
   nxtCol = undefined;
   pageX = undefined;
   nxtColWidth = undefined;
   curColWidth = undefined
  });
 }

 function createDiv(height){
  var div = document.createElement('div');
  div.style.top = 0;
  div.style.right = 0;
  div.style.width = '5px';
  div.style.position = 'absolute';
  div.style.cursor = 'col-resize';
  div.style.userSelect = 'none';
  div.style.height = height + 'px';
  return div;
 }

 function paddingDiff(col){

  if (getStyleVal(col,'box-sizing') == 'border-box'){
   return 0;
  }

  var padLeft = getStyleVal(col,'padding-left');
  var padRight = getStyleVal(col,'padding-right');
  return (parseInt(padLeft) + parseInt(padRight));

 }

 function getStyleVal(elm,css){
  return (window.getComputedStyle(elm, null).getPropertyValue(css))
 }
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