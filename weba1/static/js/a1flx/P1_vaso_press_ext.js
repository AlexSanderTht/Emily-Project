function openInNewTab(url)
{
 window.open(url, '_blank').focus();
}
function abrirtabela()
{
 openInNewTab("tabelaval")
}
var temperaturasmateriais = []
$( document ).ready(async function()
{
    temperaturasmateriais = await RetornaTemps()
});

$('input:file').change(
    function(e){
    $('#id_NomeDoArquivo').val(e.target.files[0].name);
    $('#id_NomeDoArquivolbl').html(e.target.files[0].name);
    $('#divCalcularPlanilhaInput').show()
});

async function RetornaTemps()
{
 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/vasoext/temperaturas/",
      method: "GET",
      data: { }
    });

   return request;
}
function limpaerro(elemento) { // função para limpar a mensagem de erro
    $('#erro' + elemento.id).html('')
    if(elemento.id == 'diametro' || elemento.id == 'espessura'){
        $('#errodot').html('')
    }
}
function habilitarpressao(){
    if($('#pressaomanual').is(":checked")){
        $('#pressaoform').show()
    }
    else{
        $('#pressaoform').hide()
        $('#pressao').val(103.42)
    }
}
function calcular()
{
var temperatura = $("#temperatura").val().replace(",",".") //id="errotemperatura"
var pressao = $("#pressao").val().replace(",",".") //id="erropressao"
var diametro = $("#diametro").val().replace(",",".") //id="errodiametro"
var comprimento = $("#comprimento").val().replace(",",".") //id="errocomprimento"
var espessura = $("#espessura").val().replace(",",".") //id="erroespessura"
var material = $("#material option:selected").text() //id="erromaterial"


// TODO: verificações de todos os campos de uma vez só
if (material == "Selecionar material")
{
    $("#erromaterial").html(
    `<div class="alert alert-danger" role="alert">
      Material Inválido! Por favor, selecionar um material da lista.
    </div>`)
    return;
}
else
{
    $("#erromaterial").html("")
}

var tempmin = 40 ; var tempmax = 0 ;
// Temperatura limitada para 40 °C (temperatura mínima na tabela 1A - tensão admissível máxima de materiais ferrosos ASME II, Part D, Subpart 1) 
    for (var i = 0; i < temperaturasmateriais.length;i++)
    {
        if (temperaturasmateriais[i].nome == material)
        {
            // tempmin=temperaturasmateriais[i].tempmin
            tempmax=temperaturasmateriais[i].tempmax
            break
        }
    }

if (isNaN(temperatura)||temperatura<tempmin||temperatura>tempmax)
{
    $("#errotemperatura").html(
    `<div class="alert alert-danger" role="alert">
      Temperatura precisa ser um número entre ${tempmin} e ${tempmax}!
    </div>`)
    return;
}
else
{
    $("#errotemperatura").html("")
}

if (isNaN(pressao)||pressao == "") //
{
    $("#erropressao").html(
    `<div class="alert alert-danger" role="alert">
      Pressão precisa ser um número!
    </div>`)
    return;
}
else
{
    $("#erropressao").html("")
}

if (isNaN(diametro)||diametro == "")
{
    $("#errodiametro").html(
    `<div class="alert alert-danger" role="alert">
      Diâmetro precisa ser um número!
    </div>`)
    return;
}
else
{
    $("#errodiametro").html("")
}

if (isNaN(espessura)||espessura == "")
{
    $("#erroespessura").html(
    `<div class="alert alert-danger" role="alert">
      Espessura precisa ser um número!
    </div>`)
    return;
}
else
{
    $("#erroespessura").html("")
}

if (isNaN(comprimento)||comprimento == "")
{
    $("#errocomprimento").html(
    `<div class="alert alert-danger" role="alert">
      Comprimento precisa ser um número!
    </div>`)
    return;
}
else
{
    $("#errocomprimento").html("")
}

if ((diametro/espessura)>1000)
{
    $("#errodot").html(
    `<div class="alert alert-danger" role="alert">
      A razão Do/t deve ser menor ou igual a 1000!
    </div>`)
    return;
}
else
{
    $("#errodot").html("")
}

$("#Loader").show()
$("#BotaoCalc").prop("disabled", true)
$.ajax({
        type: "GET",
        url: "/app/flexibilidade/vasoext/resultado/",
        dataType: 'json',
        data: {'do': diametro, 't': espessura, 'temperatura': temperatura, 'material': material, 'l': comprimento, 'p':pressao},
    }).done(function (data) {
        resultado = data[0]
        var MensagemComprimentoReforcos = resultado.lotimo
        if (resultado.lotimo != "Não Converge")
            {
            MensagemComprimentoReforcos = resultado.lotimo + "mm"
            }
            else
            {
            MensagemComprimentoReforcos = resultado.lotimo
            }
        var MensagemEspessura = resultado.totimo
        if (resultado.totimo != "Não Converge")
            {
            MensagemEspessura = resultado.totimo + "mm"
            }
            else
            {
            MensagemEspessura = resultado.totimo
            }
        resultado.a < 1e-3 ? a = resultado.a.toExponential() : a = resultado.a 
        resultado.b < 1e-3 ? b = resultado.b.toExponential() : b = resultado.b 
        $("#pa").val(resultado.pa)
        $("#totimo").val(resultado.totimo)
        $("#lotimo").val(resultado.lotimo)
        $("#Loader").hide()
        $("#BotaoCalc").prop("disabled", false)
        $("#TeladeResultado").modal("show")
        $("#comprimento1").val(comprimento)
        $("#pressao1").val(pressao)
        $("#espessura1").val(espessura)
        $("#diametro1").val(diametro)
        $("#mensagem").val(`Diâmetro externo entrado pelo usuário: ${diametro} mm
        \nPressão admissível na espessura entrada: ${resultado.pa} KPa
        \nPressão requerida entrada pelo usuário: ${pressao} KPa
        \nEspessura ótima para os dados entrados: ${MensagemEspessura}
        \nEspessura entrada pelo usuário: ${espessura} mm
        \nComprimento ótimo para os dados entrados: ${MensagemComprimentoReforcos}
        \nComprimento entrado: ${comprimento} mm
        \nFator A: ${a} 
        \nFator B: ${b} 
        \nTabela: ${resultado.tabela}
        `)
    })
}

function CalcularArquivo()
{
    //$("#loaderTabelaSistema").show();
    // $("#MensagemloaderTabelaSistema").show();
    var url = "/app/flexibilidade/vasoext/DownloadTabelaCalculada/"
    const input = document.getElementById("ArquivoUploadInput")
    if(input.files.length == 0)
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Selecione um arquivo!
        </div>`);
        return;
    }
    $("#ErroArquivo").html("");
    
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    const file_data = input.files[0]
    var TaskID = makeid(10);
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append('Tabela', file_data)
    fd.append('TaskID', TaskID)
    var progressUrl = `/celery-progress/${TaskID}/`;

    CeleryProgressBar.initProgressBar(progressUrl, {onSuccess: processResult, onProgress: customProgress});
    $('#progress-bar-message').innerHTML = ("Inicializando...");
    // $("#Loader").show()
    $.ajax({
        type: 'post',
        url: "/app/flexibilidade/vasoext/CalcularTabela/",
        enctype: 'multipart/form-data',
        data: fd,

        beforeSend: function(){
            $("#ProgressCelery").show()                
        },
        success: function(response){
            $("#ProgressCelery").hide()
            // $("#Loader").hide()
            window.location = url
        },
        fail: function(error){

        },
        cache: false,
        contentType: false,
        processData: false
    })
}
function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}
function processResult(resultElement, result) {
	$('#progress-bar-message').innerHTML = ("Processo Concluído!");
    $("#ProgressCelery").hide()
	}

function customProgress(progressBarElement, progressBarMessageElement, progress) {
    progressBarElement.innerHTML = progress.percent + '%';
    progressBarMessageElement.innerHTML = (progress.description);
    progressBarElement.style.width = progress.percent + "%";
}
