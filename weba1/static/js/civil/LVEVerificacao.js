$(document).ready(function() {
    $('#loaderAdicionarAutoVerificacao').hide();
    $('#loaderEditarVerificacao').hide();
    BotaoEditarReadOnly(false);
       $("#Tabela").on('click','.btnDelete',function(){
             $(this).closest('tr').remove();
                ReordenarNumerosTabela();
          });
});
var IDLVeSelecionada = 0;
function BotaoEditarReadOnly(Valor){
    if(Valor == false){
        $('#EditarLVEBotao').attr('readonly', true);
        $('#EditarLVEBotao').removeClass('btn-success').addClass('btn-secondary');

    }
    else
    {
        $('#EditarLVEBotao').attr('readonly', false);
        $('#EditarLVEBotao').addClass('btn-success').removeClass('btn-secondary');

    }
}

function CarregarItensAutoVerificacao(Disciplina, TipoVerifica){

PreencherSelectLVES(Disciplina, TipoVerifica);




}

function CheckSelections()
{
    $('#Tabela tr td').parents('tr').remove();
     BotaoEditarReadOnly(false);
    var Disciplina = $("#Disciplinas option:selected").text();
    var TipoVerifica = $("#TipoVerifica option:selected").text();
     $("#ListaAutoVerificacoes").empty();
    if(Disciplina != "---------" && TipoVerifica != "---------")
    {
        CarregarItensAutoVerificacao(Disciplina, TipoVerifica);
    }
    else
    {
      $("#ListaAutoVerificacoes").empty();
      var o = new Option("---------", "");
      $(o).html("---------");
      $("#ListaAutoVerificacoes").append(o);
    }
}

$('#Disciplinas').change(function() {
CheckSelections();

});
function PreencherTabela(){
 if($("#ListaAutoVerificacoes option:selected").text() != "---------")
    {

         $('#Tabela tr td').parents('tr').remove();

        IDLVeSelecionada= $("#ListaAutoVerificacoes option:selected").val();

            var request = $.ajax({
              url: "/app/civil/RetornaItemLVEPorID/",
              method: "GET",
             data : { id : IDLVeSelecionada },
            });
            request.done(function( dt ) {
             var table = document.getElementById("Tabela");
                        dt.forEach((ItemLVE) => {

                               var Linha = $('#Tabela tr').length;
                               var row = table.insertRow(Linha);
                               var cell1 = row.insertCell(0);
                               var cell2 = row.insertCell(1);
                               var cell3 = row.insertCell(2);
                               var cell4 = row.insertCell(3);
                               var cell5 = row.insertCell(4);
                               var cell6 = row.insertCell(5);
                               cell1.innerHTML = Linha;
                               cell2.innerHTML = `<input type="text" value="${ItemLVE.Selecao}" style="width: 150px">`;
                               cell3.innerHTML = `<input type="text" value="${ItemLVE.Grupo}" style="width: 150px">`;
                               cell4.innerHTML = `<input type="text" value="${ItemLVE.Nome}" style="width: 100%">`;
                               cell5.innerHTML = `<input type="number"  min="5" max="100" step="5" value=${ItemLVE.PesoItem} style="width: 150px">`;
                               cell6.innerHTML = `<button type="button" class="centerbtn shadow-sm btn btn-danger btn-sm btnDelete" style="float: right; padding: 2px; width: 34px" title="Apagar Linha"> [X]</button>`;
                               ReordenarNumerosTabela();
                         })

            });

        BotaoEditarReadOnly(true);
    }
    else
    {
     $('#Tabela tr td').parents('tr').remove();
     BotaoEditarReadOnly(false);

    }
}
document.getElementById("Disciplinas").addEventListener("change", (event)=> {
    PreencherTabela();

});
$('#ListaAutoVerificacoes').change(function() {
    PreencherTabela();

});
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

           cell1.innerHTML = Linha;
           if(table.rows[Linha-1].cells[1].firstChild.value)
                cell2.innerHTML = `<input type="text" style="width: 150px" value="${table.rows[Linha-1].cells[1].firstChild.value}">`;
           else
                  cell2.innerHTML = `<input type="text" style="width: 150px">`;

           if(table.rows[Linha-1].cells[2].firstChild.value)
                cell3.innerHTML = `<input type="text" style="width: 150px" value="${table.rows[Linha-1].cells[2].firstChild.value}">`;
           else
                 cell3.innerHTML = `<input type="text" style="width: 150px">`;


           cell4.innerHTML = `<input type="text" style="width: 100%">`;
           cell5.innerHTML = `<input type="number"  min="5" max="100" step="5" style="width: 150px"  value="5" >`;
           cell6.innerHTML = `<button type="button" class="centerbtn shadow-sm btn btn-danger btn-sm btnDelete" style="float: right; padding: 2px; width: 34px" title="Apagar Linha"> [X]</button>`;
           ReordenarNumerosTabela();
        }
}

$('#TipoVerifica').change(function() {
    CheckSelections();

});

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

function AplicarItensALve()
{
     if($("#ListaAutoVerificacoes option:selected").text() != "---------")
    {
            var LVEsAdd = []
    var HTMLErro = "";
    var table = document.getElementById("Tabela");
        for (let row of table.rows)
        {
            if(row.rowIndex > 0) //para evitar o header
            {
                if(row.cells[1].firstChild.value && row.cells[2].firstChild.value && row.cells[3].firstChild.value && row.cells[4].firstChild.value)
                {
                   var Selecao = row.cells[1].firstChild.value;
                  // console.log(Selecao)

                   var Grupo = row.cells[2].firstChild.value;
                  // console.log(Grupo)

                   var Nome = row.cells[3].firstChild.value;
                 //  console.log(Nome)

                   var Peso = row.cells[4].firstChild.value;
                  // console.log(Peso)
                    LVEsAdd.push({Selecao:Selecao ,Grupo:Grupo, Nome:Nome, Peso:Peso })
                }
                else
                {
                    HTMLErro+= `<p>A linha número ${row.rowIndex} não foi adicionada pois possui valores inválidos!</p>`


                }
            }
        }
        if(HTMLErro != "")
        {
            var HTMLErroDiv = `<div class="alert alert-danger" role="alert">${HTMLErro}</div>`;
             $("#MensagemOKLve").html(HTMLErroDiv);
        }
        else
        {
            $("#MensagemOKLve").html("Itens da LVE cadastrados com sucesso!");
        }
         $.ajax({
                        url : "/app/civil/LVES/", // the endpoint
                        type : "POST", // http method
                        dataType : "json",
                        data : { IDAtualizar: IDLVeSelecionada, Itens: JSON.stringify(LVEsAdd) }, // data sent with the post request

                        // handle a successful response
                        success : function(json) {
                              $("#ModalOKItensLVE").modal('show');
                        },

                        // handle a non-successful response
                        error : function(xhr,errmsg,err) {
                            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
                        }
                    });

    }

}
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
function AdicionarLVE()
{
    var ValorDisc = $("#Disciplinas").val();
    var ValorTipo = $("#TipoVerifica").val();
    if(ValorDisc)
    {
        $("#DisciplinaAdicionar").val(ValorDisc);
    }
    else
    {
          $("#DisciplinaAdicionar").val("");

    }
    if(ValorTipo)
    {
        $("#TipoVerificacaoAdicionar").val(ValorTipo);
    }
    else
    {
      $("#TipoVerificacaoAdicionar").val("");

    }
    $('#AdicionarVerificacao').modal('show');

}
function EditarAtividade(){

 if($("#ListaAutoVerificacoes option:selected").text() != "---------")
    {
     var DataReturn = [];
    var request = $.ajax({
      url: "/app/civil/RetornarLVEVerificacao/",
      method: "GET",
     data : { ID : IDLVeSelecionada },
    });

    request.done(function( dt ) {
            if(dt.length > 0)
            {
               $("#DisciplinaEditar").val(dt[0].Disciplina);
                    $("#TipoVerificacaoEditar").val(dt[0].TipoVerificacao);
                    $("#TituloVerificacaoEditar").val(dt[0].Titulo);
                    $("#NumeroDocumentoVerificacaoEditar").val(dt[0].CodigoDocumento);
                   $('#EditarVerificacao').modal('show');
            }
    });



    }

}
$('#ApagarLVE').on('click', function(event){
    var Disciplina = $("#DisciplinaEditar option:selected").text();
    var TipoVerifica = $("#TipoVerificacaoEditar option:selected").text();
    var Titulo = $("#TituloVerificacaoEditar").val();
    var NumeroDocumento = $("#NumeroDocumentoVerificacaoEditar").val();

    $.ajax({
        url : "/app/civil/GerenciarLVEVerificacao/", // the endpoint
        type : "POST", // http method
        data : { IDAtualizar: IDLVeSelecionada, Disciplina : Disciplina, TipoVerifica : TipoVerifica, Titulo : Titulo, NumeroDocumento : NumeroDocumento, Apagar : true }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#TituloAutoVerificacao').val('');
             $('#NumeroDocumentoAutoVerificacao').val('');
             $('#AdicionarAutoVerificacao').modal('hide')
             BotaoEditarReadOnly(false);
              CheckSelections();
              $('#Tabela tr td').parents('tr').remove();
                BotaoEditarReadOnly(false);
             $('#EditarVerificacao').modal('hide')


        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
              console.log(errmsg);
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });


})
$('#EditarVerificacaoPost').on('submit', function(event){


     event.preventDefault();

    var Disciplina = $("#DisciplinaEditar option:selected").text();
    var TipoVerifica = $("#TipoVerificacaoEditar option:selected").text();
    var Titulo = $("#TituloVerificacaoEditar").val();
    var NumeroDocumento = $("#NumeroDocumentoVerificacaoEditar").val();

    $.ajax({
        url : "/app/civil/GerenciarLVEVerificacao/", // the endpoint
        type : "POST", // http method
        data : { IDAtualizar: IDLVeSelecionada, Disciplina : Disciplina, TipoVerifica : TipoVerifica, Titulo : Titulo, NumeroDocumento : NumeroDocumento }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#TituloAutoVerificacao').val('');
             $('#NumeroDocumentoAutoVerificacao').val('');
             $('#AdicionarAutoVerificacao').modal('hide')
             BotaoEditarReadOnly(false);
              CheckSelections();
            $('#Tabela tr td').parents('tr').remove();
                BotaoEditarReadOnly(false);
             $('#EditarVerificacao').modal('hide')


        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });


});


$('#AdicionarAutoVerificacaoPost').on('submit', function(event){
    $('#loaderAdicionarAutoVerificacao').show();

     event.preventDefault();

    var Disciplina = $("#DisciplinaAdicionar option:selected").text();
    var TipoVerifica = $("#TipoVerificacaoAdicionar option:selected").text();
    var Titulo = $("#TituloAutoVerificacao").val();
    var NumeroDocumento = $("#NumeroDocumentoAutoVerificacao").val();

    AdicionarAutoVerificacao(Disciplina, TipoVerifica, Titulo, NumeroDocumento);

    $('#loaderAdicionarAutoVerificacao').hide();
});

function EnviarAutoVerificacao()
{
     $('#loaderAdicionarAutoVerificacao').show();

    var Disciplina = $("#DisciplinaAdicionar option:selected").text();
    var TipoVerifica = $("#TipoVerificacaoAdicionar option:selected").text();
    var Titulo = $("#TituloAutoVerificacao").val();
    var NumeroDocumento = $("#NumeroDocumentoAutoVerificacao").val();

    AdicionarAutoVerificacao(Disciplina, TipoVerifica, Titulo, NumeroDocumento);

    $('#loaderAdicionarAutoVerificacao').hide();
}

function AdicionarAutoVerificacao(Disciplina, TipoVerifica, Titulo, NumeroDocumento) {
const csrf = document.getElementsByName("csrfmiddlewaretoken")
     $.ajax({
        url : "/app/civil/GerenciarLVEVerificacao/", // the endpoint
        type : "POST", // http method
        data : { 'csrfmiddlewaretoken': csrf[0].value, Disciplina : Disciplina, TipoVerifica : TipoVerifica, Titulo : Titulo, NumeroDocumento : NumeroDocumento }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#TituloAutoVerificacao').val('');
             $('#NumeroDocumentoAutoVerificacao').val('');
               CheckSelections();
            $('#Tabela tr td').parents('tr').remove();
                BotaoEditarReadOnly(false);
             $('#AdicionarVerificacao').modal('hide')


        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
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