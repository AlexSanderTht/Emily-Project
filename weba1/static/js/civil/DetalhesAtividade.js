var StatusEstudo = []
var StatusCalculo = []
var StatusModelo = []
var StatusDocumento = []
var StatusVerificacoes = []
var Usuarios = []
var StatusEmissao = []


$( document ).ready(async function() {

    var IDAtividade = $("#IDAtiv").html();
   var Loaders =  document.getElementsByClassName("loader");
   for (var i = 0; i < Loaders.length; i++) {
        Loaders.item(i).style.display = "none";
    }
    $('#FormNaoEnviar').hide();
    document.getElementById("loader").style.display = "block";
     StatusEstudo = await RetornaStatusEstudos();
    StatusModelo = await RetornaStatusModelo();
    StatusCalculo = await RetornaStatusCalculo();
    StatusDocumento = await RetornaStatusDocumento();
    StatusVerificacoes = await RetornaStatusVerificacoes();
    StatusEmissao = await RetornaStatusEmissao()
    Usuarios = await RetornaUsuarios();
   CarregarProjetoReferencia(IDAtividade);
   CarregarComentarios(IDAtividade);
   CarregarHolds(IDAtividade);
   AjustarValoresDetalhes();
 document.getElementById("loader").style.display = "none";
 $(':disabled').css({
    color:'#495057'
});
AjustarStatusPorID();
 $('#FormNaoEnviar').show();
});

async function RetornaStatusCalculo(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusCalculo/",
      method: "GET",
      data: { }
    });

   return request;

}

async function RetornaStatusModelo(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusModelo/",
      method: "GET",
      data: { }
    });

   return request;


}

async function RetornaStatusVerificacoes(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusVerificacoes/",
      method: "GET",
      data: { }
    });

   return request;

}

async function RetornaStatusDocumento(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusDocumento/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaStatusEstudos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEstudo/",
      method: "GET",
      data: { }
    });

   return request;

}
$('#AdicionarReferenciaProjetoPost').on('submit', function(event){
     document.getElementById("loader").style.display = "block";
        event.preventDefault();
        CriarProjetoRefForm();
     document.getElementById("loader").style.display = "none";
});

$('#AdicionarComentarioPost').on('submit', function(event){
        event.preventDefault();
        CriarComentarioForm();
});
$('#FormNaoEnviar').on('submit', function(event){
        event.preventDefault();

});

$('#AdicionarHold').on('submit', function(event){
        event.preventDefault();
        CriarHoldForm();
});

function CriarHoldForm() {
     $.ajax({
        url : "/app/civil/CriarHold/", // the endpoint
        type : "POST", // http method
        data : { TituloHold: $('#titulo-hold').val(), Comentarios : $('#comentario-hold').val(), AtividadeID : $('#IDAtiv').html() }, // data sent with the post request

        // handle a successful response
        success : function(json) {
             $('#titulo-hold').val('');
             $('#comentario-hold').val('');
             $('#CadastrarHold').modal('hide')
             var IDAtividade = $("#IDAtiv").html();
            CarregarHolds(IDAtividade);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#resultsHold').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};

function CriarComentarioForm() {
     $.ajax({
        url : "/app/civil/CriarComentario/", // the endpoint
        type : "POST", // http method
        data : { Comentario : $('#observacao-comentario').val(), AtividadeID : $('#IDAtiv').html() }, // data sent with the post request

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

function JanelaEditarHold(IdHold){
   var Hold = RetornarHoldPorID(IdHold);
  // console.log(Hold);
  $('#titulo-hold-editar').val(Hold.TituloHold.trim());
   $('#comentario-hold-editar').val(Hold.Comentarios.trim());
   if(Hold.ComentariosEmitidoComHold)
   {
     $('#comentario-emitido-hold-editar').val(Hold.ComentariosEmitidoComHold.trim());
   }
   if(Hold.ComentariosHoldResolvido)
   {
     $('#comentario-hold-resolvido-editar').val(Hold.ComentariosHoldResolvido.trim());
   }
    $('#EditarHold').modal('show')

    $('#AlterarHold').off('submit');
    $('#ExcluirHold').off('click');
   $('#AlterarHold').on('submit', function(event){
        event.preventDefault();
        var NovoValorTitulo = "|&%Não%&|";
        var NovoValorComentarios = "|&%Não%&|";
        var NovoValorComentariosEmitidoComHold = "|&%Não%&|";
        var NovoValorComentariosHoldResolvido = "|&%Não%&|";
      //  console.log($('#titulo-hold-editar').val().trim() + " - " + Hold.TituloHold)
        if( $('#titulo-hold-editar').val().trim() != Hold.TituloHold)
        {
           NovoValorTitulo = $('#titulo-hold-editar').val().trim();
        }
         if( $('#comentario-hold-editar').val().trim() != Hold.Comentarios)
        {
           NovoValorComentarios = $('#comentario-hold-editar').val().trim();
        }
        if( $('#comentario-emitido-hold-editar').val().trim() != Hold.ComentariosEmitidoComHold)
        {
            NovoValorComentariosEmitidoComHold = $('#comentario-emitido-hold-editar').val().trim();
        }
         if( $('#comentario-hold-resolvido-editar').val().trim() != Hold.ComentariosHoldResolvido)
        {
            NovoValorComentariosHoldResolvido = $('#comentario-hold-resolvido-editar').val().trim();
        }
    //    console.log("NV TIT " + NovoValorTitulo + " NV COMT " + NovoValorComentarios + " NV CM EM HLD " + NovoValorComentariosEmitidoComHold + " NV CM RSLV " + NovoValorComentariosHoldResolvido);
        EditarHoldForm(NovoValorTitulo, NovoValorComentarios, NovoValorComentariosEmitidoComHold, NovoValorComentariosHoldResolvido, IdHold);
       // CriarHoldForm();

    });
    $('#ExcluirHold').on('click', function(event){
        ApagarHold(IdHold);
    });

}

function ApagarHold(ID) {
     $.ajax({
        url : "/app/civil/ApagarHold/", // the endpoint
        type : "POST", // http method
        data : { ID : ID }, // data sent with the post request

        // handle a successful response
        success : function(json) {

            var IDAtividade = $("#IDAtiv").html();
            CarregarHolds(IDAtividade);
             $('#comentario-hold-editar').val('');
             $('#comentario-emitido-hold-editar').val('');
             $('#comentario-hold-resolvido-editar').val('');
             $('#EditarHold').modal('hide')
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};

function EditarHoldForm(NovoValorTitulo, NovoValorComentarios, NovoValorComentariosEmitidoComHold, NovoValorComentariosHoldResolvido, IDhold) {
     $.ajax({
        url : "/app/civil/EditarHold/", // the endpoint
        type : "POST", // http method
        data : { TituloHold: NovoValorTitulo, IdHold : IDhold, Comentarios : NovoValorComentarios, ComentariosEmitidoComHold: NovoValorComentariosEmitidoComHold, ComentariosHoldResolvido: NovoValorComentariosHoldResolvido }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#comentario-hold-editar').val('');
             $('#comentario-emitido-hold-editar').val('');
             $('#comentario-hold-resolvido-editar').val('');
              $('#titulo-hold').val('');
             $('#EditarHold').modal('hide')
             var IDAtividade = $("#IDAtiv").html();
            CarregarHolds(IDAtividade);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};
function CriarProjetoRefForm() {
     $.ajax({
        url : "/app/civil/CriarProjetoReferencia/", // the endpoint
        type : "POST", // http method
        data : { Titulo : $('#titulo-referencia').val(), Descricao : $('#descricao-referencia').val(), AtividadeID : $('#IDAtiv').html() }, // data sent with the post request

        // handle a successful response
        success : function(json) {
            $('#titulo-referencia').val('');
             $('#descricao-referencia').val('');
             $('#CadastrarProjReferencia').modal('hide')
             var IDAtividade = $("#IDAtiv").html();
            CarregarProjetoReferencia(IDAtividade);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
};

function ApagarProjetoRefForm(ID) {
  document.getElementById("loader"+ID).style.display = "block";
     $.ajax({
        url : "/app/civil/ApagarProjetoReferencia/", // the endpoint
        type : "POST", // http method
        data : { ID : ID }, // data sent with the post request

        // handle a successful response
        success : function(json) {

             var IDAtividade = $("#IDAtiv").html();
            CarregarProjetoReferencia(IDAtividade);
        },

        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: "+errmsg+
                " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
        }
    });
      document.getElementById("loader"+ID).style.display = "none";
};




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

async function CarregarProjetoReferencia(IDAtividade){

var ProjetosReferencia = await RetornaProjetoReferencia(IDAtividade);

   if(ProjetosReferencia.length == 0)
   {
        var HTML = `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Não existem referências cadastradas!</h5>
              <small></small>
            </div>
            <p class="mb-1"></p>
            <small></small>
          </a>`;

         $("#ListGroupProjRef").html(HTML);
   }
   else
   {
    var HTML = "";
       for(var i = 0; i < ProjetosReferencia.length; i++)
       {
             var Botao =
             `<button type="button" class="btn btn-secondary" style="padding: 2px; font-size:75%;float: right" title="Remover Projeto de Referência" onclick="ApagarProjetoRefForm(${ProjetosReferencia[i].id})">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-excel" viewBox="0 0 16 16">
                  <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"></path>
                  <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"></path>
                </svg>
              </button>
              <div class="loader" id="loader${ProjetosReferencia[i].id}" style="height: 20px; width:20px; display:none"></div>
              `;
             var date = new Date(ProjetosReferencia[i].DataObservacao);
             date.setDate(date.getDate() + 1)
               var Data = '<div style="float: left"><p>' + (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() +"</p>"+ Botao +"</div>";
            HTML+= ` <a class="list-group-item list-group-item-action flex-column align-items-start" style="border: 3px inset black">
                        <div class="d-flex w-100 justify-content-between">
                          <h5 class="mb-1">${ProjetosReferencia[i].Titulo}</h5>
                          <small class="text-muted">${Data} </small>
                        </div>
                        <p class="mb-1" style="white-space: pre-wrap;">${ProjetosReferencia[i].Descricao}</p>
                        <small class="text-muted">${ProjetosReferencia[i].Nome}</small>
                      </a>`;
       }
       $("#ListGroupProjRef").html(HTML);
   }


}

async function CarregarHolds(IDAtividade){

var Holds = await RetornaHolds(IDAtividade);

   if(Holds.length == 0)
   {
        var HTML = `<a href="#" class="list-group-item list-group-item-action flex-column align-items-start">
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">Não existem holds cadastrados!</h5>
              <small></small>
            </div>
            <p class="mb-1"></p>
            <small></small>
          </a>`;

         $("#ListGroupHolds").html(HTML);
   }
   else
   {
    var HTML = "";
       for(var i = 0; i < Holds.length; i++)
       {
                var StatusHold = "Não Resolvido";
                var cor = 'red';
                if(Holds[i].ComentariosEmitidoComHold && Holds[i].ComentariosEmitidoComHold.trim().length > 0)
                {
                    StatusHold = "Seguindo processo mesmo com Hold";
                    cor = 'orange';
                }
                if(Holds[i].ComentariosHoldResolvido && Holds[i].ComentariosHoldResolvido.trim().length > 0)
                {
                    StatusHold = "Hold Resolvido";
                    cor = '#006600';
                }
                var Botao =
                 `<button type="button" class="btn btn-secondary" style="padding: 2px; font-size:75%;float: right" title="Editar Hold" onclick="JanelaEditarHold(${Holds[i].id})">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-diff" viewBox="0 0 16 16">
                      <path d="M8 5a.5.5 0 0 1 .5.5V7H10a.5.5 0 0 1 0 1H8.5v1.5a.5.5 0 0 1-1 0V8H6a.5.5 0 0 1 0-1h1.5V5.5A.5.5 0 0 1 8 5zm-2.5 6.5A.5.5 0 0 1 6 11h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z"/>
                      <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
                  </svg>
                  </button>`;
                 var date = new Date(Holds[i].DataHold);
                 date.setDate(date.getDate() + 1)
                 var Data = '<div style="float: left"><p>' + (date.getDate()) + "/" + (date.getMonth()+1) + "/" + date.getFullYear() +"</p></div>";
                 HTML+= ` <a class="list-group-item list-group-item-action flex-column align-items-start" style="border: 3px inset black">
                        <p class="mb-1" style="white-space: pre-wrap;"><b><center style="color: ${cor}">Status do Hold: ${StatusHold}  ${Botao} </center></b></p>
                        <div class="d-flex w-100 justify-content-between">
                          <p class="mb-1" style="white-space: pre-wrap;"><b style="font-size:125%;">${Holds[i].TituloHold}</b></p>
                          <small class="text-muted">${Data}</small>

                        </div>

                        <p class="mb-1" style="white-space: pre-wrap;">${Holds[i].Comentarios}</p>
                        <small class="text-muted">${Holds[i].ResponsavelHold}</small>
                     `;
                if(Holds[i].ComentariosEmitidoComHold && Holds[i].ComentariosEmitidoComHold.trim().length > 0)
                {
                 var dateEmitHold = new Date(Holds[i].DataEmitidoComHold);
                 dateEmitHold.setDate(dateEmitHold.getDate() + 1)
                var DataEmitHold = '<p>' + (dateEmitHold.getDate()) + "/" + (dateEmitHold.getMonth()+1) + "/" + dateEmitHold.getFullYear()+"</p>";
                 HTML+= `<hr/><div>

                          <p class="mb-1" style="white-space: pre-wrap; color: orange"><b>Detalhes da Autorização de Seguir com hold</b></p>
                          <small class="text-muted" style="float: right">${DataEmitHold}</small>

                        <p class="mb-1" style="white-space: pre-wrap;">${Holds[i].ComentariosEmitidoComHold}</p>
                        <small class="text-muted">${Holds[i].ResponsavelEmitidoComHold}</small>
                      </div>`;
                }
                  if(Holds[i].ComentariosHoldResolvido && Holds[i].ComentariosHoldResolvido.trim().length > 0)
                {
                 var dateHoldResolv = new Date(Holds[i].DataHoldResolvido);
                 dateHoldResolv.setDate(dateHoldResolv.getDate() + 1)
                var DataHoldResolv = '<p>' + (dateHoldResolv.getDate()) + "/" + (dateHoldResolv.getMonth()+1) + "/" + dateHoldResolv.getFullYear()+"</p>";
                 HTML+= `<hr/><div>

                          <p class="mb-1" style="white-space: pre-wrap; color: #006600"><b>Hold Resolvido</b></p>
                          <small class="text-muted" style="float: right">${DataHoldResolv}</small>

                        <p class="mb-1" style="white-space: pre-wrap;">${Holds[i].ComentariosHoldResolvido}</p>
                        <small class="text-muted">${Holds[i].ResponsavelHoldResolvido}</small>
                      </div>`;
                }
                HTML+= '</a>';
       }
       AjustarStatusPorID();

       $("#ListGroupHolds").html(HTML);
   }


}

async function AjustarValoresDetalhes(){
    var OS = $("#AtividadeOS").val();

    var Disciplina = $("#AtividadeDisciplina").val();

    var Status = $("#AtividadeStatus").val();

    var TipoDocumento = $("#AtividadeTipoDocumento").val();
    var Finalidade = $("#AtividadeFinalidade").val();
    var IDAtividade = $("#IDAtiv").html();
 //  AjustarOSPorID(OS);
   //AjustarDisciplinaPorID(Disciplina);
   //AjustarStatusPorID();
   //AjustarTipoDocumentoPorID(TipoDocumento);
   //AjustarFinalidadePorID(Finalidade);
   await PreencherValoresProcesso(IDAtividade);
}
async function PreencherValoresProcesso(IDAtividade){
var HTMLLoader = `<div class="loader" style="border: 8px solid #A1A1A1; border-top: 8px solid #f6801e;">`;
    $("#InformacoesProcesso").html(HTMLLoader);
    var StatusInt = (await RetornaStatusIntegracao(IDAtividade))[0].Status;
    var Estudos = await RetornaEstudosPorIdAtividade(IDAtividade);
    var Calculos = await RetornaCalculosPorIdAtividade(IDAtividade);
    var Modelos = await RetornaModelosPorIdAtividade(IDAtividade);
    var Documentos = await RetornaDocumentosPorIdAtividade(IDAtividade);
    var Verificacoes = await RetornaVerificacoesPorIdAtividade(IDAtividade);
    var Atividade = (await RetornaAtividadePorId(IDAtividade))[0];
    var Integracoes = (await RetornaIntegracaoPorId(IDAtividade));

    var EstudoMaisAtual;
    for(var i = 0; i < Estudos.length; i++)
    {
        if(EstudoMaisAtual)
        {
            if(Estudos[i].DataCadastro > EstudoMaisAtual.DataCadastro)
            {
                EstudoMaisAtual = Estudos[i];
            }
        }
        else
        {
            EstudoMaisAtual = Estudos[i];
        }
    }
    var CalculoMaisAtual;
    for(var i = 0; i < Calculos.length; i++)
    {
        if(CalculoMaisAtual)
        {
            if(Calculos[i].DataCadastro > CalculoMaisAtual.DataCadastro)
            {
                CalculoMaisAtual = Calculos[i];
            }
        }
        else
        {
            CalculoMaisAtual = Calculos[i];
        }
    }

    var ModeloMaisAtual;
    for(var i = 0; i < Modelos.length; i++)
    {
        if(ModeloMaisAtual)
        {
            if(Modelos[i].DataCadastro > ModeloMaisAtual.DataCadastro)
            {
                ModeloMaisAtual = Modelos[i];
            }
        }
        else
        {
            ModeloMaisAtual = Modelos[i];
        }
    }

    var DocumentoMaisAtual;
    for(var i = 0; i < Documentos.length; i++)
    {
        if(DocumentoMaisAtual)
        {
            if(Documentos[i].DataCadastro > DocumentoMaisAtual.DataCadastro)
            {
                DocumentoMaisAtual = Documentos[i];
            }
        }
        else
        {
            DocumentoMaisAtual = Documentos[i];
        }
    }

    var VerificacaoDocumentoMaisAtual;
    var VerificacaoModeloMaisAtual;
    for(var i = 0; i < Verificacoes.length; i++)
    {
        if(Verificacoes[i].Modelo)
        {
             if(VerificacaoModeloMaisAtual)
            {
                if(Verificacoes[i].DataCadastro > VerificacaoModeloMaisAtual.DataCadastro)
                {
                    VerificacaoModeloMaisAtual = Verificacoes[i];
                }
            }
            else
            {
                VerificacaoModeloMaisAtual = Verificacoes[i];
            }

        }
        if(Verificacoes[i].Documento)
        {
            if(VerificacaoDocumentoMaisAtual)
            {
                if(Verificacoes[i].DataCadastro > VerificacaoDocumentoMaisAtual.DataCadastro)
                {
                    VerificacaoDocumentoMaisAtual = Verificacoes[i];
                }
            }
            else
            {
                VerificacaoDocumentoMaisAtual = Verificacoes[i];
            }
        }
    }

    var HTML = "";

    if(EstudoMaisAtual)
    {
        var Status;
        var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusEstudo.length; i++)
        {
            if(StatusEstudo[i].id == EstudoMaisAtual.Status)
            {
                Status = StatusEstudo[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == EstudoMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(EstudoMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(EstudoMaisAtual.DataConclusao)
                {
                    var Data = new Date(EstudoMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                    const diffInMs   = new Date(EstudoMaisAtual.DataPlanejamentoInterno) - new Date(EstudoMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {
                    const date1 = new Date(EstudoMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




         HTML += `
            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Estudo/${EstudoMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Estudo/Conceito:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}" style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
              <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>

        </button>
        `;
    }
    if(CalculoMaisAtual)
    {
        var Status;
        var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusCalculo.length; i++)
        {
            if(StatusCalculo[i].id == CalculoMaisAtual.Status)
            {
                Status = StatusCalculo[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == CalculoMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(CalculoMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(CalculoMaisAtual.DataConclusao)
                {
                    var Data = new Date(CalculoMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                     const diffInMs   = new Date(CalculoMaisAtual.DataPlanejamentoInterno) - new Date(CalculoMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }

                }
                else
                {
                    const date1 = new Date(CalculoMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




         HTML += `
            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Calculo/${CalculoMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Cálculo:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}" style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
            <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>
        `;
    }
    if(ModeloMaisAtual)
    {
        var Status;
        var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusModelo.length; i++)
        {
            if(StatusModelo[i].id == ModeloMaisAtual.Status)
            {
                Status = StatusModelo[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == ModeloMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(ModeloMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(ModeloMaisAtual.DataConclusao)
                {
                    var Data = new Date(ModeloMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                     const diffInMs   = new Date(ModeloMaisAtual.DataPlanejamentoInterno) - new Date(ModeloMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {
                    const date1 = new Date(ModeloMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




        HTML += `
            <div class="input-group" >
             <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Modelo/${ModeloMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Modelo:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}" style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
            <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>
        `;
    }

     if(VerificacaoModeloMaisAtual)
    {
        var Status;
       var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusVerificacoes.length; i++)
        {
            if(StatusVerificacoes[i].id == VerificacaoModeloMaisAtual.Status)
            {
                Status = StatusVerificacoes[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == VerificacaoModeloMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(VerificacaoModeloMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(VerificacaoModeloMaisAtual.DataConclusao)
                {
                    var Data = new Date(VerificacaoModeloMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                       const diffInMs   = new Date(VerificacaoModeloMaisAtual.DataPlanejamentoInterno) - new Date(VerificacaoModeloMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {
                    const date1 = new Date(VerificacaoModeloMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




        HTML += `
            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm"  onclick="window.location='/app/civil/VerificacaoModelo/${VerificacaoModeloMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Verificação Modelo:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}"  style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
            <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>
        `;
    }

  if(DocumentoMaisAtual)
    {
        var Status;
        var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusDocumento.length; i++)
        {
            if(StatusDocumento[i].id == DocumentoMaisAtual.Status)
            {
                Status = StatusDocumento[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {

            if(Usuarios[i].UsuarioLoginA1 == DocumentoMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(DocumentoMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(DocumentoMaisAtual.DataConclusao)
                {
                    var Data = new Date(DocumentoMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                        const diffInMs   = new Date(DocumentoMaisAtual.DataPlanejamentoInterno) - new Date(DocumentoMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {
                    const date1 = new Date(DocumentoMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




        HTML += `
            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Documento/${DocumentoMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Documento:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}"  style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
           <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>
        `;
    }

      if(VerificacaoDocumentoMaisAtual)
    {
        var Status;
        var NomePessoa = "Não Atribuído";
        var DataPrazo;
        for(var i = 0; i < StatusVerificacoes.length; i++)
        {
            if(StatusVerificacoes[i].id == VerificacaoDocumentoMaisAtual.Status)
            {
                Status = StatusVerificacoes[i].NomeStatus;
                break;
            }
        }
        for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == VerificacaoDocumentoMaisAtual.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }
        var cor = '#006600';
        var Estado = "";


            var Data = new Date(VerificacaoDocumentoMaisAtual.DataPlanejamentoInterno);
            Data.setDate(Data.getDate() + 1)
            DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
              if(VerificacaoDocumentoMaisAtual.DataConclusao)
                {
                    var Data = new Date(VerificacaoDocumentoMaisAtual.DataConclusao);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                        const diffInMs   = new Date(VerificacaoDocumentoMaisAtual.DataPlanejamentoInterno) - new Date(VerificacaoDocumentoMaisAtual.DataConclusao);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {
                    const date1 = new Date(VerificacaoDocumentoMaisAtual.DataPlanejamentoInterno);
                    const date2 = Date.now();
                    const diffTime = date1 - date2;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    if(diffDays < 0)
                    {
                        Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                        cor = "red";
                    }
                    else
                    {
                          Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                    }
                }




        HTML += `

            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/VerificacaoDocumento/${VerificacaoDocumentoMaisAtual.id}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Verificação Documento:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}"  style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
             <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">

            </div>
        `;
    }
    {
    if(Integracoes.length > 0)
    {
        var Integracao = Integracoes[0];
         for(var i = 0; i < Usuarios.length; i++)
        {
            if(Usuarios[i].UsuarioLoginA1 == Integracao.Responsavel)
            {
                NomePessoa = Usuarios[i].Nome;
                break;
            }
        }

        Data = new Date(Integracao.DataPrazoIntegracao);
        Data.setDate(Data.getDate() + 1)
        DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
        cor = '#006600';
        const date1 = new Date(Integracao.DataPrazoIntegracao);
        const date2 = Date.now();
        const diffTime = date1 - date2;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if(diffDays < 0)
        {
            Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
            cor = "red";
        }
        else
        {
              Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

        }
          HTML += `
            <div class="input-group" >
            <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Integracao/${IDAtividade}'">Acessar</button>
              <div class="input-group-prepend" >
                <span style="height:34px; width: 200px" class="input-group-text" ><b>Integração:</b></span>
                 <span style="height:34px" class="input-group-text" >Responsável:</span>
              </div>
              <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}"  style="width: 300px">
                <div class="input-group-prepend" >
                <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
              </div>
           <input readonly type="text" class="form-control" value="${StatusInt}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
              <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">
            </div>
        `;
            }
    }
            {
                 cor = '#006600';
                  Data = new Date(Atividade.DataPrazoEmissao);
                        Data.setDate(Data.getDate() + 1)
                 DataPrazo = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                if(Atividade.DataEmitido)
                {
                    var Data = new Date(Atividade.DataEmitido);
                    Data.setDate(Data.getDate() + 1)
                    var DataConc = (Data.getDate()) + "/" + (Data.getMonth()+1) + "/" + Data.getFullYear();
                        const diffInMs   = new Date(Atividade.DataPrazoEmissao) - new Date(Atividade.DataEmitido);
                    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
                    if(diffInDays == 0)
                    {
                        Estado = "Concluído em " + DataConc + " (Na data limite)";
                    }
                    else
                    if(diffInDays < 0)
                    {
                        cor = "orange";
                        Estado = "Concluído em " + DataConc + " (Atrasado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                    else
                    {
                         Estado = "Concluído em " + DataConc + " (Adiantado em " + Math.abs(diffInDays) + " dia(s))";
                    }
                }
                else
                {



                        const date1 = new Date(Atividade.DataPrazoEmissao);
                        const date2 = Date.now();
                        const diffTime = date1 - date2;
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                  if(diffDays < 0)
                        {
                            Estado = "Atrasado em " + Math.abs(diffDays) + " dias";
                            cor = "red";
                        }
                        else
                        {
                              Estado = "Dentro do prazo, falta(m) " + Math.abs(diffDays) + " dia(s)";

                        }
                }

              for(var i = 0; i < Usuarios.length; i++)
                {
                    if(Usuarios[i].UsuarioLoginA1 == Atividade.ResponsavelEmissao)
                    {
                        NomePessoa = Usuarios[i].Nome;
                        break;
                    }
                }
                for(var n = 0; n < StatusEmissao.length; n++)
                {
                    if(StatusEmissao[n].id == Atividade.StatusEmissao )
                    {
                         Status = StatusEmissao[n].NomeStatus
                         break;
                    }
                }

              HTML += `
                    <div class="input-group" >
                    <button type="button" style="height:32px; margin:1px 5px;font-size:75%" class="subscribe btn btn-warning  rounded-pill shadow-sm" onclick="window.location='/app/civil/Emissao/${IDAtividade}'">Acessar</button>
                      <div class="input-group-prepend" >
                        <span style="height:34px; width: 200px" class="input-group-text" ><b>Emissão:</b></span>
                         <span style="height:34px" class="input-group-text" >Responsável:</span>
                      </div>
                      <input readonly type="text" class="form-control" value="${NomePessoa}" title="${NomePessoa}" style="width: 300px">
                        <div class="input-group-prepend" >
                        <span style="height:34px;width: 100px" class="input-group-text">Status:</span>
                      </div>
            <input readonly type="text" class="form-control" value="${Status}" style="width:170px">
                 <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text">Data Estimada:</span>
              </div>
              <input readonly type="text" class="form-control" value="${DataPrazo}" style="width: 100px">
               <div class="input-group-prepend" >
                <span style="height:34px" class="input-group-text" >Prazo:</span>
              </div>
                      <input readonly type="text" class="form-control" style="color: ${cor}; font-weight: bold; width:250px" value="${Estado}">
                    </div>
                `;

            }
     $("#InformacoesProcesso").html(HTML);

}

async function RetornaStatusIntegracao(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaStatusFiltradoIntegracao/"+IDAtividade+"/",
      method: "GET",
      data: {  }
    });

   return request;

}

async function RetornaIntegracaoPorId(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaIntegracoesPorIDAtividade/",
      method: "GET",
      data: { IDA: IDAtividade }
    });

   return request;

}


async function RetornaAtividadePorId(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaAtividadesPorID/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;

}
async function RetornaVerificacoesPorIdAtividade(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarVerificacoesPorAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;


}
async function RetornaDocumentosPorIdAtividade(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarDocumentosPorAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;

}
async function RetornaModelosPorIdAtividade(IDAtividade){


 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarModelosPorAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;


}

async function RetornaCalculosPorIdAtividade(IDAtividade){


 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarCalculosPorAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;


}

async function RetornaEstudosPorIdAtividade(IDAtividade){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarEstudosPorAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;

}
function AjustarTipoDocumentoPorID(ID){
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornarTipoDocumentoID/?id='+ID, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            $("#AtividadeTipoDocumento").val(Sist.TipoDocumento);


        })
        // console.log(RestraintsTemp);

    };
    request.send();
}

function AjustarFinalidadePorID(ID){
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornarFinalidadesID/?id='+ID, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            $("#AtividadeFinalidade").val(Sist.Finalidade);


        })
        // console.log(RestraintsTemp);

    };
    request.send();
}

function AjustarOSPorID(IDOS){
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
function AjustarDisciplinaPorID(ID){
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornarDisciplinaID/?id='+ID, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            $("#AtividadeDisciplina").val(Sist.Nome);


        })
        // console.log(RestraintsTemp);

    };
    request.send();
}
function ExcluirAtividade()
{
        $("#loaderExcluirAtividade").show();

     $.ajax({
            url : "/app/civil/RemoverAtividade/"+$('#IDAtiv').html()+"/", // the endpoint
            type : "POST", // http method
            data : { }, // data sent with the post request

            // handle a successful response
            success : function(json) {

                $("#loaderExcluirAtividade").hide()
                window.location.href = "/app/civil/ListaAtividades/";
            },

            // handle a non-successful response
            error : function(xhr,errmsg,err) {

            }
        });



}
function ModalExcluirAtividade()
{
    $("#ExcluirAtividadeModal").modal('show');
}
function AjustarStatusPorID(){
     var AtividadeID = $("#IDAtiv").html();
      var ID = $("#IDStatus").html();
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornarStatusAtividade/?id='+ID+'&atividade='+AtividadeID, true);
    request.onload = function () {
        var data = JSON.parse(this.response);
             data.forEach((Sist) => {
            $("#AtividadeStatus").val(Sist.Status);
        })
    };
    request.send();
}

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
                          <path d="M5.884 6.68a.5.5 0 1 0-.768.64L7.349 10l-2.233 2.68a.5.5 0 0 0 .768.64L8 10.781l2.116 2.54a.5.5 0 0 0 .768-.641L8.651 10l2.233-2.68a.5.5 0 0 0-.768-.64L8 9.219l-2.116-2.54z"/>
                          <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>
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


async function RetornaProjetoReferencia(IDAtividade){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarProjetosReferenciaAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;


}

async function RetornaHolds(IDAtividade){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarHoldsAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;



}
function RetornarHoldPorID(IDHold){
var DataReturn = [];
  var request = new XMLHttpRequest();
    request.open('GET', '/app/civil/RetornarHoldsPorID/?id='+IDHold, false);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);
        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn[0];
}
async function RetornaUsuarios(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarUsuarios/",
      method: "GET",
      data: { }
    });

   return request;
}

async function RetornaStatusEmissao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEmissao/",
      method: "GET",
      data: { }
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