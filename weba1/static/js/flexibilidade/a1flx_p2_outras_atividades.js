var OS;
var CoresCrescentes = ["rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)"]
var CorIdentificacao = "#1E90FF";
var CorDatas = "#32CD32";
var CorHoras = "#000080";
var CorTecnico = "#D2691E";
var CorStatus = "#FF6347";
var CorF0 = "#e7eb9d"
var CorF1 = "#f8b65e"
var CorF1R = "#cea774"
var CorF2 = "#ff6060"
var CorF3 = "#6efa75"
var CorF4 = "#6e90fa"
var Identificadores;
var StatusAtividades;
var AtividadesFlex;
var ArquivosAtividades;
var Person;
var HourPersonAtividade;
var UserAtual;
var SistemasOS;
window.onload = async function () {
    $("#style_switcher").hide();
    OS = $("#OS").html();
    if (await CheckOSReadOnly() == true)
    {
        $("#tituloos").html(`<b>${OS}</b> - Somente Leitura`)
        $("#BotaoAdicionarAtividade").hide();
    }
    InicializarBotoesTabelaSistemas();
    Person = await GetPersons();
    UserAtual = RetornaUsuarioAtual();

    await carregarPagina();
};
$('#SelectTipoArquivo').change(function ()
{
    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    $('#ArquivoUploadInput').val("")
    if ($("#SelectTipoArquivo option:selected").text() == "Arquivo Normal")
    {
        $("#IGDescricao").show();
        $('#ArquivoUploadInput').attr('accept', "*");
    }
    else if ($("#SelectTipoArquivo option:selected").text() == "Arquivo de Report 3D")
    {
        $("#IGDescricao").hide();
        $('#ArquivoUploadInput').attr('accept', ".mdb");
    }

});
async function EnviarArquivoReport()
{
    $("#ErroArquivo").html("")
    var DescricaoArq = $("#DescricaoArquivo").val()
    const input = document.getElementById("ArquivoUploadInput")
    var IDAtiv = document.getElementById("TituloModalReportSistema").dataset.idativ;
    var Atividade = RetornaAtividade(IDAtiv);
    if (input.files.length == 0)
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Selecione um arquivo!
        </div>`);
        return;
    }
    if (!DescricaoArq && $("#SelectTipoArquivo option:selected").text() == "Arquivo Normal")
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Insira uma descrição!
        </div>`);
        return;
    }
    var progressBox = document.getElementById("ProgressEnvioArquivo");
    progressBox.innerHTML = ""

    if ($("#SelectTipoArquivo option:selected").text() == "Arquivo Normal")
    {
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        const fd = new FormData()
        const file_data = input.files[0]
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Arquivo", file_data)
        fd.append("Descricao", DescricaoArq)
        fd.append("IDAtividade", IDAtiv)
        fd.append("EnviarArquivo", true)
        $.ajax({
            type: 'post',
            url: "",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function ()
            {

            },
            xhr: function ()
            {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', e =>
                {
                    // console.log(e)
                    if (e.lengthComputable)
                    {
                        const percent = e.loaded / e.total * 100
                        progressBox.innerHTML = `<center><div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p>${percent.toFixed(1)}%<p></center>
                    `
                    }
                })
                return xhr
            },
            success: async function (response)
            {
                await CarregarTabelaArquivos(IDAtiv);
                progressBox.innerHTML = ""
                input.value = ""
            },
            fail: function (error)
            {

            },
            cache: false,
            contentType: false,
            processData: false
        })
    }
    else
    {
        if (Atividade.tb_atvflex_id_inim)
        {
            $("#ModalArquivosAtividades").modal('hide')
            $("#ModalConfirmarSubstituirReport3D").modal('show')
        }
        else
        {
            EnviarArquivoReport3DConfirmado();
        }
    }
}
function CancelarEnvioReport3D()
{
    $("#ModalConfirmarSubstituirReport3D").modal('hide')
    $("#ModalArquivosAtividades").modal('show')

}
async function SubstituirReport3DConfirmado()
{
    $("#ModalConfirmarSubstituirReport3D").modal('hide')
    $("#ModalArquivosAtividades").modal('show')
    await EnviarArquivoReport3DConfirmado();

}
async function EnviarArquivoReport3DConfirmado()
{
    const input = document.getElementById("ArquivoUploadInput")
    var IDAtiv = document.getElementById("TituloModalReportSistema").dataset.idativ;
    var Atividade = RetornaAtividade(IDAtiv);
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    const file_data = input.files[0]
    var TaskID = makeid(10);
    document.getElementById('progress-bar-message').innerHTML = (
        "Inicializando..."
    );
    var progressUrl = `/celery-progress/${TaskID}/`;
    var progressBox = document.getElementById("ProgressEnvioArquivo");
    progressBox.innerHTML = ""
    CeleryProgressBar.initProgressBar(progressUrl, {
        onSuccess: processResult,
        onProgress: customProgress
    });

    $("#ProgressCelery").show()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("Arquivo", file_data)
    fd.append("IDAtividade", IDAtiv)
    fd.append("TaskID", TaskID)
    fd.append("ArquivoReport3D", true)
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json)
        {
            OS = $("#OS").html();
            AtividadesFlex = await GetAtividadesFlex();
            AtualizarDisponibilidadeModelo3DAtividade(IDAtiv);
            progressBox.innerHTML = ""
            input.value = ""
            await CarregarTabelaArquivos(IDAtiv)
        },
        xhr: function ()
        {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e =>
            {
                // console.log(e)
                if (e.lengthComputable)
                {
                    const percent = e.loaded / e.total * 100
                    progressBox.innerHTML = `<center><div class="progress">
                    <div class="progress-bar" role="progressbar" style="width: ${percent}%" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <p>${percent.toFixed(1)}%<p></center>
                    `
                }
            })
            return xhr
        },
        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        },
        cache: false,
        contentType: false,
        processData: false
    });
}

function makeid(length)
{
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++)
    {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}
function processResult(resultElement, result)
{
    document.getElementById('progress-bar-message').innerHTML = (
        "Processo Concluído!"
    );
    $("#ProgressCelery").hide()
    //window.location.replace('/app/flexibilidade/DetalhesSistema/'+OS+'/'+Sistema+"/"+Rev);
}

function customProgress(progressBarElement, progressBarMessageElement, progress)
{
    progressBarElement.innerHTML = progress.percent + '%';
    progressBarMessageElement.innerHTML = (
        progress.description
    );
    progressBarElement.style.width = progress.percent + "%";
}

async function CheckOSReadOnly()
{
    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaStatusActiveOS/",
        method: "GET",
        data: { 'os': OS }
    });
    resultado = request[0]
    if (resultado.tb_flex_so_st_stt == "Somente Leitura")
        return true;
    else
        return false;
}
function RetornaUsuarioAtual()
{
    var UserAtual = $("#usuarioatual").html();
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id_ldap == UserAtual)
        {
            return Person[i];
        }
    }
}

async function carregarPagina()
{
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    $("#loader").show();
    $("#JanelaGeral").hide();
    Identificadores = await GetIdentificadoresAtividadesFlex();
    StatusAtividades = await GetStatusAtividadesFlex();
    AtividadesFlex = await GetAtividadesFlex();
    ArquivosAtividades = await GetArquivosAtividadesFlex();
    HourPersonAtividade = await GetHourPersonAtividade();
    SistemasOS = await GetSistemasOS(OS)

    await CriarTabelaAtividades();

    CheckButtons();
    $("#JanelaGeral").show();
    $("#loader").hide();

}
function CancelarFinalizarAtividade()
{
    $("#ModalConfirmarFinalizarAtividade").modal("hide");
    $("#ModalAdicionarAtividade").modal("show");
}
function FinalizarAtividade()
{
    if(!$("#DataA0").attr("readonly")){
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">
          Você precisa salvar a nova data primeiro!
        </div>`)
        return
    }
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    if ($("#TotalHorasAtividade").val() == "0")
    {
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">
                                  <strong>Adicione Horas</strong> à atividade <strong>e salve</strong> antes de finalizar.
                                </div>`)
        return;
    }
    $("#ModalAdicionarAtividade").modal("hide");
    $("#ModalConfirmarFinalizarAtividade").modal("show");
  
}
function FinalizarAtividadeConfirmado()
{
    $("#ModalConfirmarFinalizarAtividade").modal("hide");
    $("#ModalAdicionarAtividade").modal("show");
    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderFinalizarAtividade").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "FinalizarAtividade": true, "IDAtividade": IDAtiv, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await carregarPagina();
            var AtividadeFlex = RetornaAtividade(IDAtiv);
            var DataFinalDt = new Date(AtividadeFlex.tb_atvflex_dt_final)
            DataFinalDt.setTime(DataFinalDt.getTime() + (3 * 60 * 60 * 1000))
            DataFinalFormatada = ("0" + DataFinalDt.getDate()).slice(-2) + '/' + ("0" + (DataFinalDt.getMonth() + 1)).slice(-2) + "/" + DataFinalDt.getFullYear()
            $("#DataA1").val(DataFinalFormatada)
            $("#loaderFinalizarAtividade").hide();
            BloquearModalAtividades();
            document.getElementById("botaoSubirRevisao").disabled = false;
            document.getElementById("botaoSubirRevisao").title = "Subir Revisão";
           
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
    //FinalizarAtividade
}
async function AtualizarDisponibilidadeModelo3DAtividade(IDAtividade)
{
    var AtividadeFlex = RetornaAtividade(IDAtividade);
    var BotaoMostrar3D = document.getElementById("BotaoAcessarReport3D")
    var InputDisponibilidade = document.getElementById("StatusReport3D")

    
    if (AtividadeFlex.tb_atvflex_id_inim)
    {
        BotaoMostrar3D.disabled = false;
        InputDisponibilidade.value = "Disponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DNAO")
        InputDisponibilidade.classList.add("InputDisponibilidade3DSIM")
        var Identificador = RetornaIdentificador(AtividadeFlex.tb_atvflex_identificador);
        var IdentSerial = Identificador.tb_atv_ident_identif + ('000' + AtividadeFlex.tb_atvflex_serialnumber).slice(-3)
        var Link = `/app/flexibilidade/DetalhesSistemaID/${AtividadeFlex.tb_atvflex_id_inim}/`
        document.getElementById("BotaoAcessarReport3D").onclick = function () { window.open(Link, '_blank') }
        
        //document.getElementById("BotaoAcessarReport3D").onclick = function () { window.open(`/app/flexibilidade/DetalhesSistema/${}`, '_blank') }
        //contem 3d
    }
    else
    {
        BotaoMostrar3D.disabled = true;
        InputDisponibilidade.value = "Indisponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DSIM")
        InputDisponibilidade.classList.add("InputDisponibilidade3DNAO")

        //não contém 3D
    }

}
async function MostrarModalArquivosAtividades(IDAtividade)
{
    var DivTabela = document.getElementById("ModalReportsSistemaTabela");
    DivTabela.innerHTML = "";
    var AtividadeFlex = RetornaAtividade(IDAtividade)
    document.getElementById("TituloModalReportSistema").dataset.idativ = IDAtividade;
    AtualizarDisponibilidadeModelo3DAtividade(IDAtividade);
    document.getElementById("BotaoEnviarReport").dataset.idativ = IDAtividade;
    var Identificador = RetornaIdentificador(AtividadeFlex.tb_atvflex_identificador);
    var IdentSerial = Identificador.tb_atv_ident_identif + ('000' + AtividadeFlex.tb_atvflex_serialnumber).slice(-3)
    $("#TituloModalReportSistema").html(`${IdentSerial}_R${AtividadeFlex.tb_atvflex_revisao} - Arquivos`)
    $("#ModalArquivosAtividades").modal('show')
    await CarregarTabelaArquivos(IDAtividade);
}
async function GetArquivosAtividade(IDAtividade)
{
    ArquivosAtividades = await GetArquivosAtividadesFlex();
    var Arquivos = []
    for (var i = 0; i < ArquivosAtividades.length; i++)
    {
        if (ArquivosAtividades[i].tb_atvflex_arq_id_atvflex == IDAtividade)
        {
            Arquivos.push(ArquivosAtividades[i])
        }
    }
    return Arquivos;
}
async function CarregarTabelaArquivos(IDAtividade)
{

    var AtividadeFlex = RetornaAtividade(IDAtividade)
    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    
    var Arquivos = await GetArquivosAtividade(IDAtividade);
    if (Arquivos.length == 0)
    {
        Arquivos.push({ "tb_atvflex_arq_desc": "Sem arquivos cadastrados!" });
    }
    var DivTabela = document.getElementById("ModalReportsSistemaTabela");
    DivTabela.innerHTML = "";
    var LarguraDados = 75;
    var LarguraData = 120;
    var LarguraResponsavel = 120;
    var fieldTitles = ["Descrição", "Responsável", "Data", "Extensão", "Download"];
    if (!AtividadeFlex.tb_atvflex_dt_final && await CheckOSReadOnly() == false)
    {
        fieldTitles.push("Excluir")
        $("#UploadArquivoReport").show()
    }
    else
    {
        $("#UploadArquivoReport").hide()
    }
    var table = document.createElement('TABLE');
    var TitulosDados = ["Extensão", "Data", "Download", "Excluir"];
    var TitulosFiltrar = ["Descrição", "Responsável", "Data", "Extensão",];

    table.border = '0.1';
    table.id = "TabelaArquivosReportsT";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 130px;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead");
    thead.style.display = "table";
    thead.style.tableLayout = "fixed";
    thead.style.fontSize = "80%";
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) =>
    {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (TitulosDados.includes(fieldTitle))
            th.style.width = LarguraDados + "px";
        if (fieldTitle == "Responsável")
            th.style.width = LarguraResponsavel + "px";
        if (fieldTitle == "Data")
            th.style.width = LarguraData + "px";
        if (TitulosFiltrar.includes(fieldTitle))
            th.classList.add("TabelaArquivoFiltrar");

    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab");
    table.appendChild(tableBody);
    for (var i = 0; i < Arquivos.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
        tr.style.fontSize = "80%";
        tableBody.appendChild(tr);

        tr.onmouseover = function ()
        {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function ()
        {
            this.style.backgroundColor = 'white';
        };



        var tdDesc = document.createElement('TD');
        var TxtDesc = "";
        if (Arquivos[i].tb_atvflex_arq_desc)
            TxtDesc = Arquivos[i].tb_atvflex_arq_desc;
        var DivDesc = document.createElement("div");
        DivDesc.innerHTML = TxtDesc;
        DivDesc.style.overflow = "hidden";
        DivDesc.style.textOverflow = "Ellipsis";
        DivDesc.style.maxHeight = "18px";
        DivDesc.title = TxtDesc;
        DivDesc.style.whiteSpace = "nowrap";
        tdDesc.appendChild(DivDesc);
        tdDesc.dataset.valor = TxtDesc;
        tr.appendChild(tdDesc);

        var tdResp = document.createElement('TD');
        if (Arquivos[i].tb_atvflex_arq_pers)
        {
            tdResp.appendChild(document.createTextNode(RetornaInicialUser(Arquivos[i].tb_atvflex_arq_pers)));
        }

        else
        {
            tdResp.appendChild(document.createTextNode(''));
        }
        tdResp.width = LarguraResponsavel + "px";
        tr.appendChild(tdResp);

        var TdData = document.createElement('TD');
        var TxtData = "";
        if (Arquivos[i].tb_atvflex_arq_dt_upload)
        {
            var Data = new Date(Arquivos[i].tb_atvflex_arq_dt_upload);
            TxtData = Data.toLocaleDateString();
        }
        TdData.classList.add("Status");
        var DivData = document.createElement("div");
        DivData.innerHTML = TxtData;
        DivData.style.overflow = "hidden";
        DivData.style.textOverflow = "Ellipsis";
        DivData.style.maxHeight = "18px";
        DivData.title = TxtData;
        DivData.style.whiteSpace = "nowrap";
        TdData.appendChild(DivData);
        TdData.style.width = LarguraData + "px";
        tr.appendChild(TdData);

        var TdExt = document.createElement('TD');
        if (Arquivos[i].tb_atvflex_arq_arquivo)
        {
            var Extensao = Arquivos[i].tb_atvflex_arq_arquivo.split('.').pop().toUpperCase();
            TdExt.appendChild(document.createTextNode(Extensao));
        }

        else
        {
            TdExt.appendChild(document.createTextNode(''));
        }
        TdExt.width = LarguraDados + "px";
        tr.appendChild(TdExt);


        if (Arquivos[i].tb_atvflex_arq_arquivo && await CheckOSReadOnly() == false)
        {
            var tdDownload = document.createElement('TD');
            var txtDownload = `<a href="/app/flexibilidade/DownloadArquivoAtividade/${Arquivos[i].tb_atvflex_arq_id}/" download target="_blank" style="margin-top: 1px">Download</a>`
            var DivDownload = document.createElement("div")
            DivDownload.innerHTML = txtDownload
            DivDownload.style.overflow = "hidden"
            DivDownload.style.maxHeight = "18px"
            DivDownload.title = "Baixar Arquivo";
            DivDownload.style.whiteSpace = "nowrap"
            DivDownload.style.marginLeft = "5px"
            DivDownload.style.marginRight = "5px"
            tdDownload.appendChild(DivDownload);
            tdDownload.style.width = LarguraDados + "px"
            tr.appendChild(tdDownload);
        }
        else
        {
            var tdDownload = document.createElement('TD');
            tdDownload.appendChild(document.createTextNode(''));
            tdDownload.width = LarguraDados + "px";
            tr.appendChild(tdDownload);
        }
        if (!AtividadeFlex.tb_atvflex_dt_final && await CheckOSReadOnly() == false)
        {
            if (Arquivos[i].tb_atvflex_arq_id)
            {
                var tdExcluir = document.createElement('TD');
                var TxtExcluir = `<button type="button" onclick="ExcluirArquivo(${Arquivos[i].tb_atvflex_arq_id}, ${IDAtividade})" class="btn btn-danger btn-block btnHist">Excluir</button>`
                var DivExcluir = document.createElement("div")
                DivExcluir.innerHTML = TxtExcluir
                DivExcluir.style.overflow = "hidden"
                DivExcluir.style.maxHeight = "18px"
                DivExcluir.title = "Excluir Arquivo";
                DivExcluir.style.whiteSpace = "nowrap"
                DivExcluir.style.marginLeft = "5px"
                DivExcluir.style.marginRight = "5px"
                tdExcluir.appendChild(DivExcluir);
                tdExcluir.style.width = LarguraDados + "px"
                tr.appendChild(tdExcluir);
            }
            else
            {
                var tdExcluir = document.createElement('TD');
                tdExcluir.appendChild(document.createTextNode(''));
                tdExcluir.width = LarguraDados + "px";
                tr.appendChild(tdExcluir);
            }
        }
    }
    DivTabela.appendChild(table);

    $('#TabelaArquivosReportsT').excelTableFilter({ columnSelector: '.TabelaArquivoFiltrar', captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });



}
function ExcluirArquivo(IDArquivo, IDAtividade)
{
    document.getElementById("BotaoSimExcluirArquivo").dataset.idarquivo = IDArquivo
    document.getElementById("BotaoSimExcluirArquivo").dataset.idativ = IDAtividade
    $("#ModalArquivosAtividades").modal('hide')
    $("#ModalConfirmarExcluirArquivo").modal('show')

}
function CancelarExclusao()
{
    $("#ModalConfirmarExcluirArquivo").modal('hide')
    $("#ModalArquivosAtividades").modal('show')

}
$('input:file').change(
    function (e)
    {
        $('#id_NomeDoArquivo').val(e.target.files[0].name);
        $('#id_NomeDoArquivolbl').html(e.target.files[0].name);
    });
function ExcluirArquivoConfirmado(elemento)
{
    var IDArquivo = document.getElementById("BotaoSimExcluirArquivo").dataset.idarquivo
    var IDAtiv = document.getElementById("BotaoSimExcluirArquivo").dataset.idativ
    $("#loaderExcluir").show();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "ExcluirArquivo": true, "IDArquivo": IDArquivo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            CarregarTabelaArquivos(IDAtiv);
            $("#ModalConfirmarExcluirArquivo").modal('hide')
            $("#ModalArquivosAtividades").modal('show')
            $("#loaderExcluir").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        }
    });
}
function CheckButtons()
{
    var BotaoID = document.getElementById("BtnIdentificacao");
    var BotaoDatas = document.getElementById("BtnDatas");
    var BotaoHoras = document.getElementById("BtnHoras");
    var BotaoTecnico = document.getElementById("BtnTecnico");
    var BotaoStatus = document.getElementById("BtnStatus");
    if (BotaoID.dataset.mostrar == 'false') {
        BotaoID.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoID.style.backgroundColor = CorIdentificacao;
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }

    if (BotaoDatas.dataset.mostrar == 'false') {
        BotaoDatas.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoDatas.style.backgroundColor = CorDatas;
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
    if (BotaoHoras.dataset.mostrar == 'false') {
        BotaoHoras.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Horas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoHoras.style.backgroundColor = CorHoras;
        var Elementos = document.getElementsByClassName("Horas")
        if (Elementos.length > 1) {
            for (var i = 0; i < Elementos.length; i++) {
                Elementos[i].style.display = "table-cell"
            }
        }
    }
    if (BotaoTecnico.dataset.mostrar == 'false') {
        BotaoTecnico.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoTecnico.style.backgroundColor = CorTecnico;
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
    if (BotaoStatus.dataset.mostrar == 'false') {
        BotaoStatus.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoStatus.style.backgroundColor = CorStatus;
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
}
function RetornaInicialUser(ID) {
    for (var i = 0; i < Person.length; i++) {
        if (Person[i].tb_per_id == ID) {
            return Person[i].tb_per_initials
        }

    }
}
function RetornaIdentificador(ID) {
    for (var i = 0; i < Identificadores.length; i++) {
        if (Identificadores[i].tb_atv_ident_id == ID) {
            return Identificadores[i]
        }
    }
}
function RetornaHorasUsuariosAtividades(IDAtividade, Usuarios)
{

    var Horas = [];
    for (var i = 0; i < Usuarios.length; i++)
    {
        var TotalHoras = 0;
        for (var j = 0; j < HourPersonAtividade.length; j++)
        {
            if (HourPersonAtividade[j].tb_atvflex_hper_per == Usuarios[i] && HourPersonAtividade[j].tb_atvflex_hper_atividade == IDAtividade)
            {
                TotalHoras += HourPersonAtividade[j].tb_atvflex_hper_hour;
                // break;
            }
        }
        Horas.push({ "ID": Usuarios[i], "Horas": TotalHoras })
    }
    return Horas;

}
function RetornaStatus(ID)
{
    for (var i = 0; i < StatusAtividades.length; i++)
    {
        if (StatusAtividades[i].tb_atvfl_st_id == ID) {
            return StatusAtividades[i];
        }
    }
}
async function CriarTabelaAtividades()
{
   
    var Usuarios = []
    for (var i = 0; i < HourPersonAtividade.length; i++) {
        if (!Usuarios.includes(HourPersonAtividade[i].tb_atvflex_hper_per)) {
            Usuarios.push(HourPersonAtividade[i].tb_atvflex_hper_per)
        }
    }
    Usuarios.sort(function (a, b) {
        let x = RetornaInicialUser(a),
            y = RetornaInicialUser(b);
        return x == y ? 0 : x > y ? 1 : -1;
    });
    DadosDetalhesAtividades = []
    for (var i = 0; i < AtividadesFlex.length; i++)
    {
        // Lógica para atualizar o identificador das atividades criadas antes da revisão 9 da A1-002-ITE-020.
        // Exemplo:
        // DE (Atividade antiga)                            -->      PARA (nova atividade)
        // G - Planejamento                                 -->      E - Estudos
        // G - Contratação de apoio externo                 -->      E - Estudos
        // G - Estimativas extra-escopos                    -->      E - Estudos
        // R - Reunião de kick-off                          -->      E - Estudos
        // R - Reunião técnica                              -->      E - Estudos
        // R - Reunião semanal                              -->      E - Estudos
        // E - Estudo - Layout                              -->      E - Estudos
        // E - Estudo - Estimativa cargas                   -->      E - Estudos
        // E - Estudo - Critérios, consultoria, pesquisa    -->      E - Estudos
        // A - Apoio time de projeto                        -->      E - Estudos
        // A - Verificação de sistemas                      -->      E - Estudos
        // A - Análise visual                               -->      E - Estudos
        // F - Análise de elementos finitos                 -->      E - Estudos
        // I - Índice de linhas para análise de flex        -->      I - Índice de Linhas para Análise de Flexibilidade
        // D - Critérios de flexibilidade                   -->      C - Critérios
        // D - Lista de juntas de expansão                  -->      J - Lista de Juntas de Expansão
        // D - Lista de suportes mola                       -->      H - Lista de Suportes de Mola
        // D - Memorial de cálculo                          -->      M - Memorial de Cálculo
        let testVar = AtividadesFlex[i].tb_atvflex_identificador
        let identificador_novo = null
        if (testVar == 1 ||
            testVar == 2 ||
            testVar == 3 ||
            testVar == 4 ||
            testVar == 5 ||
            testVar == 6 ||
            testVar == 7 ||
            testVar == 8 ||
            testVar == 9 ||
            testVar == 10 ||
            testVar == 11 ||
            testVar == 12 ||
            testVar == 14){
            identificador_novo = 20
            
        } else if (AtividadesFlex[i].tb_atvflex_identificador == 13){
            identificador_novo = 22
            
        } else if (AtividadesFlex[i].tb_atvflex_identificador == 15){
            identificador_novo = 19
            
        } else if (AtividadesFlex[i].tb_atvflex_identificador == 16){
            identificador_novo = 23
            
        } else if (AtividadesFlex[i].tb_atvflex_identificador == 17){
            identificador_novo = 21
            
        } else if (AtividadesFlex[i].tb_atvflex_identificador == 18){
            identificador_novo = 24
        }
        
        
        var Identificador = RetornaIdentificador(AtividadesFlex[i].tb_atvflex_identificador);
        var IdentSerial = Identificador.tb_atv_ident_identif + ('000' + AtividadesFlex[i].tb_atvflex_serialnumber).slice(-3)
        var Tipo = Identificador.tb_atv_ident_descritivo;
        
        if (identificador_novo) {
            var Identificador_rev9_ITE020 = RetornaIdentificador(identificador_novo)
            IdentSerial += (`* (${Identificador_rev9_ITE020.tb_atv_ident_identif})`)
            $('#RodapeAtividades').html("* Atividades criadas antes da Revisão 9 da A1-002-ITE-020.").prop("title",
                ` 
                Exemplo:
                DE (Atividade antiga)                             -->      PARA (nova atividade)
                _______________________________________________________________________________
                G - Contratação de apoio externo                  -->      E - Estudos
                R - Reunião semanal                               -->      E - Estudos
                E - Estudo - Estimativa cargas                    -->      E - Estudos
                E - Estudo - Critérios, consultoria, pesquisa     -->      E - Estudos
                A - Verificação de sistemas                       -->      E - Estudos
                F - Análise de elementos finitos                  -->      E - Estudos
                D - Critérios de flexibilidade                    -->      C - Critérios
                D - Lista de juntas de expansão                   -->      J - Lista de Juntas de Expansão
                D - Lista de suportes mola                        -->      H - Lista de Suportes de Mola
                D - Memorial de cálculo                           -->      M - Memorial de Cálculo
                `)

            Tipo = Identificador_rev9_ITE020.tb_atv_ident_descritivo
        }

        var Titulo = AtividadesFlex[i].tb_atvflex_titulo;
        var Rev = AtividadesFlex[i].tb_atvflex_revisao;
        var DataInicio = AtividadesFlex[i].tb_atvflex_dt_inicio;
        var DataFinal = "";
        if (AtividadesFlex[i].tb_atvflex_dt_final)
            DataFinal = AtividadesFlex[i].tb_atvflex_dt_final;
        var ObsEntrada = "";
        if (AtividadesFlex[i].tb_atvflex_obs_entr) {
            ObsEntrada = AtividadesFlex[i].tb_atvflex_obs_entr;
        }
        var ObsSaida = "";
        if (AtividadesFlex[i].tb_atvflex_obs_said) {
            ObsSaida = AtividadesFlex[i].tb_atvflex_obs_said;
        }
        var Vinculos = "";
        if (AtividadesFlex[i].tb_atvflex_sistema) {
            Vinculos = AtividadesFlex[i].tb_atvflex_sistema;
        }
        var hyd = "";
        var sus = "";
        var ope = "";
        var exp = "";
        var f1 = "";
        if (AtividadesFlex[i].tb_atvflex_hyd) {
            hyd = AtividadesFlex[i].tb_atvflex_hyd;
        }
        if (AtividadesFlex[i].tb_atvflex_sus) {
            sus = AtividadesFlex[i].tb_atvflex_sus;
        }
        if (AtividadesFlex[i].tb_atvflex_ope) {
            ope = AtividadesFlex[i].tb_atvflex_ope;
        }
        if (AtividadesFlex[i].tb_atvflex_exp) {
            exp = AtividadesFlex[i].tb_atvflex_exp;
        }
        if (AtividadesFlex[i].tb_atvflex_f1) {
            f1 = AtividadesFlex[i].tb_atvflex_f1;
        }
        var StatusAtual = RetornaStatus(AtividadesFlex[i].tb_atvflex_status).tb_atvfl_st_nome;

       
        DadosDetalhesAtividades.push({
            "ID": AtividadesFlex[i].tb_atvflex_id,
            "IdentSerial": IdentSerial,
            "Tipo": Tipo,
            "Titulo": Titulo,
            "Revisao": Rev,
            "DataInicio": DataInicio,
            "DataFinal": DataFinal,
            "HorasUsuarios": RetornaHorasUsuariosAtividades(AtividadesFlex[i].tb_atvflex_id, Usuarios),
            "ObsEntrada": ObsEntrada,
            "ObsSaida": ObsSaida,
            "Vinculos": Vinculos,
            "hyd": hyd,
            "sus": sus,
            "ope": ope,
            "exp": exp,
            "f1": f1,
            "StatusAtual": StatusAtual
        })            
        
    }


    var myTableDiv = document.getElementById("TabelaAtividades");
    myTableDiv.innerHTML = "";
    var fieldTitlesIdentificacao = ["Identificador", "Revisão", "Tipo", "Título"]
    var fieldTitlesDatas = ["Iniciado", "Finalizado"]
    var fieldTitlesHoras = []
    for (var i = 0; i < Usuarios.length; i++) {
        fieldTitlesHoras.push({ "Iniciais": RetornaInicialUser(Usuarios[i]), "ID": Usuarios[i] })
    }
    var fieldTitlesTecnico = ["Obs Entrada", "Obs Saída","Vínculos", "Hyd(%)", "Ope(%)", "Sus(%)", "Exp(%)", "F1(Hz)"]
    var fieldTitlesStatus = ["Vínculos", "Arquivos", "Status"]

    var table = document.createElement('TABLE');
    table.style.boxShadow = "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
    table.id = "TabelaAtividadesT";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead")
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"

    let thIdentificacao = document.createElement('td');
    thIdentificacao.appendChild(document.createTextNode("Identificação"));
    thIdentificacao.colSpan = fieldTitlesIdentificacao.length;
    thIdentificacao.style.backgroundColor = CorIdentificacao
    thIdentificacao.style.color = 'white';
    thIdentificacao.style.fontSize = "16px"
    thIdentificacao.style.maxWidth = '60vw'
    thIdentificacao.style.fontWeight = "bold"
    thIdentificacao.classList.add("Identificacao")
    thead.appendChild(thIdentificacao)

    let thDatas = document.createElement('td');
    thDatas.appendChild(document.createTextNode("Datas"));
    thDatas.colSpan = fieldTitlesDatas.length
    thDatas.style.backgroundColor = CorDatas
    thDatas.style.color = 'white';
    thDatas.style.fontSize = "16px" 
    thDatas.style.maxWidth = '10vw'
    thDatas.style.fontWeight = "bold"
    thDatas.classList.add("Datas")
    thead.appendChild(thDatas)

    let thHoras = document.createElement('td');
    thHoras.appendChild(document.createTextNode("Horas"));
    thHoras.colSpan = fieldTitlesHoras.length
    thHoras.style.backgroundColor = CorHoras
    thHoras.style.color = 'white';
    thHoras.style.fontSize = "16px"
    thHoras.style.maxWidth = '30vw'
    thHoras.style.fontWeight = "bold"
    thHoras.classList.add("Horas")
    thead.appendChild(thHoras)

    let thTecnico = document.createElement('td');
    thTecnico.appendChild(document.createTextNode("Técnico"));
    thTecnico.colSpan = fieldTitlesTecnico.length
    thTecnico.style.backgroundColor = CorTecnico
    thTecnico.style.color = 'white';
    thTecnico.style.fontSize = "16px"
    thTecnico.style.maxWidth = '50vw'
    thTecnico.style.fontWeight = "bold"
    thTecnico.classList.add("Tecnico")
    thead.appendChild(thTecnico)

    let thStatus = document.createElement('td');
    thStatus.appendChild(document.createTextNode("Status"));
    thStatus.colSpan = fieldTitlesStatus.length
    thStatus.style.backgroundColor = CorStatus
    thStatus.style.color = 'white';
    thStatus.style.fontSize = "16px"
    thStatus.style.maxWidth = '30vw'
    thStatus.style.fontWeight = "bold"
    thStatus.classList.add("Status")
    thead.appendChild(thStatus)

    let thr = document.createElement('tr');

    fieldTitlesIdentificacao.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        th.style.backgroundColor = CorIdentificacao
        th.classList.add("Identificacao")
        thr.appendChild(th);
    });



    fieldTitlesDatas.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        th.style.backgroundColor = CorDatas
        th.classList.add("Datas")
        thr.appendChild(th);
    });

    fieldTitlesHoras.forEach((fieldTitle) => {
        var NomeUsuario = "";
        for (var k = 0; k < Person.length; k++) {
            if (Person[k].tb_per_id == fieldTitle.ID) {
                NomeUsuario = Person[k].tb_per_name;
                break;
            }
        }
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle.Iniciais));
        th.style.backgroundColor = CorHoras
        th.classList.add("Horas")
        th.title = NomeUsuario
        thr.appendChild(th);
    });

    fieldTitlesTecnico.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        th.style.backgroundColor = CorTecnico
        th.classList.add("Tecnico")
        thr.appendChild(th);
    });

    fieldTitlesStatus.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        th.style.backgroundColor = CorStatus
        th.classList.add("Status")
        thr.appendChild(th);
    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    tableBody.setAttribute("style", "max-height: 70vh; overflow-y: scroll;");

    if (DadosDetalhesAtividades.length == 0) {
        var tr = document.createElement('TR');
        tr.classList.add("mousechange")
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);
        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }
        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }
        var tdSemAtiv = document.createElement('TD');
        tdSemAtiv.classList.add("Identificacao")
        tdSemAtiv.appendChild(document.createTextNode("Sem Atividades Cadastradas!"));
        tdSemAtiv.colSpan = 5;
        tr.appendChild(tdSemAtiv);
    }

    for (var i = 0; i < DadosDetalhesAtividades.length; i++) {
        var tr = document.createElement('TR');
        tr.classList.add("mousechange")
        tr.dataset.idativ = DadosDetalhesAtividades[i]["ID"];
        tr.ondblclick = function () { ModalAtividade(this); }
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);
        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }
        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }

        var tdIdentSerial = document.createElement('TD');
        tdIdentSerial.classList.add("Identificacao")
        tdIdentSerial.appendChild(document.createTextNode(DadosDetalhesAtividades[i]["IdentSerial"]));
        tr.appendChild(tdIdentSerial);
        
        var tdRevisao = document.createElement('TD');
        tdRevisao.classList.add("Identificacao")
        tdRevisao.appendChild(document.createTextNode(DadosDetalhesAtividades[i]["Revisao"]));
        tr.appendChild(tdRevisao);

        var TdTipo = document.createElement('TD');
        var TxtTipo = ""
        if (DadosDetalhesAtividades[i]["Tipo"])
            TxtTipo = DadosDetalhesAtividades[i]["Tipo"]
        TdTipo.classList.add("Tipo")
        var DivTipo = document.createElement("div")
        DivTipo.innerHTML = TxtTipo
        DivTipo.style.overflow = "hidden"
        DivTipo.style.textOverflow = "Ellipsis"
        DivTipo.style.maxHeight = "18px"
        DivTipo.title = TxtTipo;
        DivTipo.style.whiteSpace = "nowrap"
        TdTipo.appendChild(DivTipo);
        tr.appendChild(TdTipo);

        var TdTitulo = document.createElement('TD');
        var TxtTitulo = ""
        if (DadosDetalhesAtividades[i]["Titulo"])
            TxtTitulo = DadosDetalhesAtividades[i]["Titulo"]
        TdTitulo.classList.add("Titulo")
        var DivTitulo = document.createElement("div")
        DivTitulo.innerHTML = TxtTitulo
        DivTitulo.style.overflow = "hidden"
        DivTitulo.style.textOverflow = "Ellipsis"
        DivTitulo.style.maxHeight = "18px"
        DivTitulo.title = TxtTitulo;
        DivTitulo.style.whiteSpace = "nowrap"
        TdTitulo.appendChild(DivTitulo);
        tr.appendChild(TdTitulo);

        var tdDataInicio = document.createElement('TD');
        var TxtDataInicio = ""
        if (DadosDetalhesAtividades[i]["DataInicio"]) {
            var Data = new Date(new Date(DadosDetalhesAtividades[i]["DataInicio"]))
            Data.setTime(Data.getTime() + (3 * 60 * 60 * 1000))
            var DataFormatadaF0 = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
            TxtDataInicio = DataFormatadaF0
        }
        tdDataInicio.classList.add("Datas")
        var DivDataInicio = document.createElement("div")
        DivDataInicio.innerHTML = TxtDataInicio
        DivDataInicio.style.overflow = "hidden"
        DivDataInicio.style.textOverflow = "Ellipsis"
        DivDataInicio.style.maxHeight = "18px"
        DivDataInicio.title = "Data F1: " + TxtDataInicio;
        DivDataInicio.style.whiteSpace = "nowrap"
        tdDataInicio.appendChild(DivDataInicio);
        tdDataInicio.style.fontSize = "80%"
        tr.appendChild(tdDataInicio);

        var tdDataFinal = document.createElement('TD');
        var TxtDataFinal = ""
        if (DadosDetalhesAtividades[i]["DataFinal"]) {
            var DataFinal = new Date(DadosDetalhesAtividades[i]["DataFinal"])
            DataFinal.setTime(DataFinal.getTime() + (3 * 60 * 60 * 1000))
            var DataFormatadaF2 = ("0" + DataFinal.getDate()).slice(-2) + '/' + ("0" + (DataFinal.getMonth() + 1)).slice(-2) + "/" + DataFinal.getFullYear()
            TxtDataFinal = DataFormatadaF2
        }
        tdDataFinal.classList.add("Datas")
        var DivDataFinal = document.createElement("div")
        DivDataFinal.innerHTML = TxtDataFinal
        DivDataFinal.style.overflow = "hidden"
        DivDataFinal.style.textOverflow = "Ellipsis"
        DivDataFinal.style.maxHeight = "18px"
        DivDataFinal.title = "Data F2: " + TxtDataFinal;
        DivDataFinal.style.whiteSpace = "nowrap"
        tdDataFinal.appendChild(DivDataFinal);
        tdDataFinal.style.fontSize = "80%"
        tr.appendChild(tdDataFinal);
        for (var j = 0; j < Usuarios.length; j++) {
            var QtdHorasUsr = 0;
            if (DadosDetalhesAtividades[i].HorasUsuarios)
            {
                for (var k = 0; k < DadosDetalhesAtividades[i].HorasUsuarios.length; k++) {
                    if (DadosDetalhesAtividades[i].HorasUsuarios[k].ID == Usuarios[j]) {
                        QtdHorasUsr = DadosDetalhesAtividades[i].HorasUsuarios[k].Horas;
                    }
                }
            }
            var TdHorasUser = document.createElement('TD');
            TdHorasUser.classList.add("Horas")
            TdHorasUser.appendChild(document.createTextNode(QtdHorasUsr));
            tr.appendChild(TdHorasUser);
        }

        var TDObsEntrada = document.createElement('TD');
        var TxtObsEntrada = ""
        if (DadosDetalhesAtividades[i]["ObsEntrada"])
            TxtObsEntrada = DadosDetalhesAtividades[i]["ObsEntrada"]
        var DivObsEntrada = document.createElement("div")
        DivObsEntrada.innerHTML = TxtObsEntrada
        DivObsEntrada.style.overflow = "hidden"
        DivObsEntrada.style.textOverflow = "Ellipsis"
        DivObsEntrada.style.maxHeight = "18px"
        DivObsEntrada.title = TxtObsEntrada;
        DivObsEntrada.style.whiteSpace = "nowrap"
        TDObsEntrada.classList.add("Tecnico")
        TDObsEntrada.appendChild(DivObsEntrada);
        tr.appendChild(TDObsEntrada);

        var TDObsSaida = document.createElement('TD');
        var TxtObsSaida = ""
        if (DadosDetalhesAtividades[i]["ObsSaida"])
            TxtObsSaida = DadosDetalhesAtividades[i]["ObsSaida"]
        var DivObsSaida = document.createElement("div")
        DivObsSaida.innerHTML = TxtObsSaida
        DivObsSaida.style.overflow = "hidden"
        DivObsSaida.style.textOverflow = "Ellipsis"
        DivObsSaida.style.maxHeight = "18px"
        DivObsSaida.title = TxtObsSaida;
        DivObsSaida.style.whiteSpace = "nowrap"
        TDObsSaida.classList.add("Tecnico")
        TDObsSaida.appendChild(DivObsSaida);
        tr.appendChild(TDObsSaida);

        var TDVinculos = document.createElement('TD');
        var TxtVinculos = ""
        if (DadosDetalhesAtividades[i]["Vinculos"])
            TxtVinculos = DadosDetalhesAtividades[i]["Vinculos"]
        var DivVinculos = document.createElement("div")
        DivVinculos.innerHTML = TxtVinculos
        DivVinculos.style.overflow = "hidden"
        DivVinculos.style.textOverflow = "Ellipsis"
        DivVinculos.style.maxHeight = "18px"
        DivVinculos.title = TxtVinculos;
        DivVinculos.style.whiteSpace = "nowrap"
        TDVinculos.classList.add("Tecnico")
        TDVinculos.appendChild(DivVinculos);
        tr.appendChild(TDVinculos);

        var TdHyd = document.createElement('TD');
        var TxtHyd = ""
        if (DadosDetalhesAtividades[i]["hyd"])
            TxtHyd = DadosDetalhesAtividades[i]["hyd"]
        TdHyd.classList.add("Tecnico")
        TdHyd.appendChild(document.createTextNode(TxtHyd));
        tr.appendChild(TdHyd);

        var TdOpe = document.createElement('TD');
        var TxtOpe = ""
        if (DadosDetalhesAtividades[i]["ope"])
            TxtOpe = DadosDetalhesAtividades[i]["ope"]
        TdOpe.classList.add("Tecnico")
        TdOpe.appendChild(document.createTextNode(TxtOpe));
        tr.appendChild(TdOpe);

        var TdSus = document.createElement('TD');
        var TxtSus = ""
        if (DadosDetalhesAtividades[i]["sus"])
            TxtSus = DadosDetalhesAtividades[i]["sus"]
        TdSus.classList.add("Tecnico")
        TdSus.appendChild(document.createTextNode(TxtSus));
        tr.appendChild(TdSus);

        var TdExp = document.createElement('TD');
        var TxtExp = ""
        if (DadosDetalhesAtividades[i]["exp"])
            TxtExp = DadosDetalhesAtividades[i]["exp"]
        TdExp.classList.add("Tecnico")
        TdExp.appendChild(document.createTextNode(TxtExp));
        tr.appendChild(TdExp);

        var TdFreq = document.createElement('TD');
        var TxtFreq = ""
        if (DadosDetalhesAtividades[i]["f1"])
            TxtFreq = DadosDetalhesAtividades[i]["f1"]
        TdFreq.classList.add("Tecnico")
        TdFreq.appendChild(document.createTextNode(TxtFreq));
        tr.appendChild(TdFreq);

        var tdLink = document.createElement('TD');
        tdLink.classList.add("Status")
        var TxtLink = `<button type="button" onclick="MostrarModalVinculosAtividades(${DadosDetalhesAtividades[i]["ID"]})" class="btn btn-info btn-block btnReports" style="margin-bottom: 1px; padding: 0; font-size: 90%;border-radius: 0;">Modificar</button>`
        var DivLink = document.createElement("div")
        DivLink.innerHTML = TxtLink
        DivLink.style.overflow = "hidden"
        DivLink.style.maxHeight = "18px"
        DivLink.title = "Acessar Vínculos";
        tdLink.appendChild(DivLink);
        tr.appendChild(tdLink);

        var tdLink = document.createElement('TD');
        tdLink.classList.add("Status")
        var TxtLink = `<button type="button" onclick="MostrarModalArquivosAtividades(${DadosDetalhesAtividades[i]["ID"]})" class="btn btn-primary btn-block btnReports" style="margin-bottom: 1px; padding: 0; font-size: 90%;border-radius: 0;">Acessar</button>`
        var DivLink = document.createElement("div")
        DivLink.innerHTML = TxtLink
        DivLink.style.overflow = "hidden"
        DivLink.style.maxHeight = "18px"
        DivLink.title = "Acessar Arquivos";
        tdLink.appendChild(DivLink);
        tr.appendChild(tdLink);

        var TdStatus = document.createElement('TD');
        var TxtStatus = ""
        if (DadosDetalhesAtividades[i]["StatusAtual"])
            TxtStatus = DadosDetalhesAtividades[i]["StatusAtual"]
        TdStatus.classList.add("Status")
        var DivStatus = document.createElement("div")
        DivStatus.innerHTML = TxtStatus
        DivStatus.style.overflow = "hidden"
        DivStatus.style.textOverflow = "Ellipsis"
        DivStatus.style.maxHeight = "18px"
        DivStatus.title = TxtStatus;
        DivStatus.style.whiteSpace = "nowrap"
        DivStatus.style.backgroundColor = RetornaCorStatus(TxtStatus)
        TdStatus.appendChild(DivStatus);
        tr.appendChild(TdStatus);
    }

    myTableDiv.appendChild(table);


    $('#TabelaAtividadesT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
}
async function MostrarModalVinculosAtividades(idAtividade)
{
    document.getElementById("TituloModalVinculoAtividades").dataset.idativ = idAtividade;
    

    var AtividadeFlex = RetornaAtividade(idAtividade);
    if (!AtividadeFlex.tb_atvflex_dt_final && await CheckOSReadOnly() == false)
    {
        $("#SelectAdicionarVinculo").show();
    }
    else
    {
        $("#SelectAdicionarVinculo").hide();
    }
    
    var Identificador = RetornaIdentificador(AtividadeFlex.tb_atvflex_identificador);
    var IdentSerial = Identificador.tb_atv_ident_identif + ('000' + AtividadeFlex.tb_atvflex_serialnumber).slice(-3)
    $("#TituloModalVinculoAtividades").html(`${IdentSerial}_R${AtividadeFlex.tb_atvflex_revisao} - Vínculos`)
    await CarregarTabelaVinculos(idAtividade);
    $("#ModalVinculosAtividades").modal('show');
}
async function CarregarTabelaVinculos(IDAtividade)
{
    var Vinculos = await GetVinculosAtividade(IDAtividade);
    var SistemasSelectTodos = await GetSistemasR0();
    var SistemasSelectFiltrados = [];
    for (var i = 0; i < SistemasSelectTodos.length; i++)
    {
        var achou = false;
        for (var j = 0; j < Vinculos.length; j++)
        {
            if (Vinculos[j].tb_vc_at_sis_sistema_id == SistemasSelectTodos[i].tb_sf_id)
            {
                achou = true;
                break;
            }
        }
        if (achou == false)
        {
            SistemasSelectFiltrados.push(SistemasSelectTodos[i]);
        }
    }
    SistemasSelectFiltrados.sort(function (a, b)
    {
        let x = a.tb_sf_name,
            y = b.tb_sf_name;
        return x == y ? 0 : x > y ? 1 : -1;
    });
    $("#SelectSistema").empty();
    for (var i = 0; i < SistemasSelectFiltrados.length; i++)
    {
        var o = new Option(SistemasSelectFiltrados[i].tb_sf_id, SistemasSelectFiltrados[i].tb_sf_id);
        $(o).html(SistemasSelectFiltrados[i].tb_sf_name);
        $("#SelectSistema").append(o);
    }

    if (SistemasSelectFiltrados.length == 0)
    {
        document.getElementById("ButtonAdicionarVinculoOS").disabled = true;
    }
    else
    {
        document.getElementById("ButtonAdicionarVinculoOS").disabled = false;
    }

    $("#ModalVinculosAtividadesTabela").html("");
    var AtividadeFlex = RetornaAtividade(IDAtividade)
    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    
    
    var DivTabela = document.getElementById("ModalVinculosAtividadesTabela");
    DivTabela.innerHTML = "";
    var fieldTitles = ["Sistema"];
    if (!AtividadeFlex.tb_atvflex_dt_final && await CheckOSReadOnly() == false)
    {
        fieldTitles.push("Excluir");
    }
    var table = document.createElement('TABLE');


    table.border = '0.1';
    table.id = "TabelaVinculosAtividadesT";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 130px;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead");
    thead.style.display = "table";
    thead.style.tableLayout = "fixed";
    thead.style.fontSize = "80%";
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) =>
    {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (fieldTitle == "Sistema")
        {
            th.classList.add("TabelaVinculoFiltrar");
        }
        if (fieldTitle == "Excluir")
        {
            th.style.width = "120px";
        }

    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab");
    table.appendChild(tableBody);

    Vinculos.sort(function (a, b)
    {
        let x = RetornaSistemaPorId(a.tb_vc_at_sis_sistema_id).tb_sf_name,
            y = RetornaSistemaPorId(b.tb_vc_at_sis_sistema_id).tb_sf_name;
        return x == y ? 0 : x > y ? 1 : -1;
    });

    if (Vinculos.length == 0)
    {
        var tr = document.createElement('TR');
        tr.classList.add("mousechange")
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);
        tr.onmouseover = function ()
        {
            this.style.backgroundColor = "#FF9A0080";
        }
        tr.onmouseleave = function ()
        {
            this.style.backgroundColor = 'white';
        }
        var tdSemAtiv = document.createElement('TD');
        //tdSemAtiv.classList.add("Identificacao")
        tdSemAtiv.style.fontSize = "80%";
        tdSemAtiv.appendChild(document.createTextNode("Sem Vínculos Cadastrados!"));
        tr.appendChild(tdSemAtiv);
    }

    for (var i = 0; i < Vinculos.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
        tr.style.fontSize = "80%";
        tableBody.appendChild(tr);

        tr.onmouseover = function ()
        {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function ()
        {
            this.style.backgroundColor = 'white';
        };

        var Sistema = RetornaSistemaPorId(Vinculos[i].tb_vc_at_sis_sistema_id)

        var tdSistema = document.createElement('TD');
        var TxtSistema = Sistema.tb_sf_name;
        var DivSistema = document.createElement("div");
        DivSistema.innerHTML = TxtSistema;
        DivSistema.style.overflow = "hidden";
        DivSistema.style.textOverflow = "Ellipsis";
        DivSistema.style.maxHeight = "18px";
        DivSistema.title = TxtSistema;
        DivSistema.style.whiteSpace = "nowrap";
        tdSistema.appendChild(DivSistema);
        tdSistema.dataset.valor = TxtSistema;
        tr.appendChild(tdSistema);

        if (!AtividadeFlex.tb_atvflex_dt_final)
        {
            var tdExcluir = document.createElement('TD');
            var TxtExcluir = `<button type="button" onclick="ExcluirVinculo(${Vinculos[i].tb_vc_at_sis_id}, ${AtividadeFlex.tb_atvflex_id})" class="btn btn-danger btn-block btnHist">Excluir</button>`
            var DivExcluir = document.createElement("div")
            DivExcluir.innerHTML = TxtExcluir
            DivExcluir.style.overflow = "hidden"
            DivExcluir.style.maxHeight = "18px"
            DivExcluir.title = "Remover Vínculo";
            DivExcluir.style.whiteSpace = "nowrap"
            DivExcluir.style.marginLeft = "5px"
            DivExcluir.style.marginRight = "5px"
            tdExcluir.appendChild(DivExcluir);
            tdExcluir.style.width = "120px"
            tr.appendChild(tdExcluir);
           
        }
        
    }
    DivTabela.appendChild(table);

    $('#TabelaVinculosAtividadesT').excelTableFilter({ columnSelector: '.TabelaVinculoFiltrar', captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });



}
function ExcluirVinculo(IDVinculo, IDAtividade)
{
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderAdicionarVinculo").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "RemoverVinculo": true, "IDVinculo": IDVinculo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            await carregarPagina();
            await CarregarTabelaVinculos(IDAtividade)
            $("#loaderAdicionarVinculo").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        }
    });
}
function RetornaSistemaPorId(IDSistema)
{
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            return SistemasOS[i]
        }
    }
}
async function AdicionarVinculo()
{
    var IDAtividade = document.getElementById("TituloModalVinculoAtividades").dataset.idativ;
    var IDSistema = $("#SelectSistema option:selected").val();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderAdicionarVinculo").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "CriarVinculo": true, "IDAtividade": IDAtividade, "IDSistema": IDSistema, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            await carregarPagina();
            await CarregarTabelaVinculos(IDAtividade)
            $("#loaderAdicionarVinculo").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        }
    });
}
function RetornaAtividade(ID)
{
    for (var i = 0; i < AtividadesFlex.length; i++)
    {
        if (AtividadesFlex[i].tb_atvflex_id == ID)
        {
            return AtividadesFlex[i];
        }
    }
    return null;
}
async function ModalAtividade(elemento)
{
    $("#BotaoSalvarDataA0").addClass("d-none") // para desaparecer o botão de salvar data
    $("#BotaoSalvarDataA1").addClass("d-none") // para desaparecer o botão de salvar data
    $("#DataA0").attr("readonly", true) // fechar o campo de edição de data. Pode acontecer do usuário abrir para editar a data de uma atividade, apertar esc e abrir outra atividade. Com isso evita erros de editar datas que ainda não foram fechadas
    $("#DataA1").attr("readonly", true)
    $("#botaoExcluirAtividade").removeClass("d-none")
    var IDAtiv = elemento.dataset.idativ;
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    $("#SelectIdentificadorAtiv").empty();
    for (var i = 0; i < Identificadores.length; i++) {
        if (Identificadores[i].tb_atv_ident_id >= 19) {
            // Lógica para apresentar somente as atividades a partir do id 19. Isto é, as atividades de acordo com a revisão 9 da A1-002-ITE-020.
            var o = new Option(Identificadores[i].tb_atv_ident_descritivo, Identificadores[i].tb_atv_ident_id);
            $(o).html(Identificadores[i].tb_atv_ident_identif + " - " + Identificadores[i].tb_atv_ident_descritivo);
            $("#SelectIdentificadorAtiv").append(o);
        }

    }

    if (!IDAtiv) // Quando o botão de "Adicionar Atividade" é apertado
    {
        $("#botaoExcluirAtividade").addClass("d-none") // Para não aparecer o botão de excluir a atividade

        $("#ModalHoras").hide();
        $("#TituloModalAtividade").html("Adicionar Atividade")
        document.getElementById("SelectIdentificadorAtiv").disabled = false;

        $("#TituloAtiv").val("");
        $("#RevisaoAtiv").val("0");
        $("#HydModal").val("");
        $("#SusModal").val("");
        $("#OpeModal").val("");
        $("#ExpModal").val("");
        $("#F1Modal").val("");
        $("#ModalObs").val("");
        $("#ModalNotes").val("");
        $("#ModalConexao").val("");
        $("#BotaoSalvarAtividade").show();
        document.getElementById("modalContainerIdentificacao").style.marginRight = 'auto';
        document.getElementById("ModalTecnico").style.marginRight = 'auto';
        document.getElementById("containerDatas").style.marginRight = "auto";
        document.getElementById("containerDatas").style.marginLeft = "auto";
        

        $("#containerDatas").hide();
        $("#BotaoSalvarTecnico").hide();
        $("#BotaoSalvarIdentificacao").hide();
        $("#BotaoSalvarHoras").hide();
        $("#BotaoFinalizar").hide();
        $("#botaoSubirRevisao").hide();
    }
    else
    {
        $("#BotaoSalvarHoras").show();
        $("#BotaoSalvarIdentificacao").show();
        $("#BotaoSalvarTecnico").show();
        $("#containerDatas").show();
        $("#BotaoFinalizar").show();
        $("#botaoSubirRevisao").show();
        document.getElementById("modalContainerIdentificacao").style.marginRight = 0;
        document.getElementById("ModalTecnico").style.marginRight = 0;
        document.getElementById("containerDatas").style.marginRight = "0";
        document.getElementById("containerDatas").style.marginLeft = "5px";


        $("#BotaoSalvarAtividade").hide();
        document.getElementById("SelectIdentificadorAtiv").disabled = true;
        $("#ModalHoras").show();
        var AtividadeFlex = RetornaAtividade(IDAtiv);
        var DadosIdentificador = RetornaIdentificador(AtividadeFlex.tb_atvflex_identificador);
        var Identificador = DadosIdentificador.tb_atv_ident_identif + ('000' + AtividadeFlex.tb_atvflex_serialnumber).slice(-3) + "_R" + AtividadeFlex.tb_atvflex_revisao;
        var HorasUsuario = RetornaHorasTotaisAtividadeUsuario(IDAtiv)
        document.getElementById("TituloModalAtividade").dataset.idativ = IDAtiv;
        $("#IniciaisUsuario").html("Total Horas - " + UserAtual.tb_per_initials);
        $("#TituloModalAtividade").html(Identificador + " - Editar Atividade")
        $("#TituloAtiv").val(AtividadeFlex.tb_atvflex_titulo);
        $("#SelectIdentificadorAtiv").val(AtividadeFlex.tb_atvflex_identificador);
        $("#RevisaoAtiv").val(AtividadeFlex.tb_atvflex_revisao);
        $("#HydModal").val(AtividadeFlex.tb_atvflex_hyd);
        $("#SusModal").val(AtividadeFlex.tb_atvflex_sus);
        $("#OpeModal").val(AtividadeFlex.tb_atvflex_ope);
        $("#ExpModal").val(AtividadeFlex.tb_atvflex_exp);
        $("#F1Modal").val(AtividadeFlex.tb_atvflex_f1);
        $("#ModalObs").val(AtividadeFlex.tb_atvflex_obs_entr);
        $("#ModalNotes").val(AtividadeFlex.tb_atvflex_obs_said);
        $("#ModalConexao").val(AtividadeFlex.tb_atvflex_sistema);
        $("#TotalHorasAtividade").val(RetornaHorasTotaisAtividade(IDAtiv));
        $("#TotalHorasUsuario").val(HorasUsuario);

        var DataInicioDt = new Date(AtividadeFlex.tb_atvflex_dt_inicio)
        DataInicioDt.setTime(DataInicioDt.getTime() + (3 * 60 * 60 * 1000))
        var DataInicioFormatada = ("0" + DataInicioDt.getDate()).slice(-2) + '/' + ("0" + (DataInicioDt.getMonth() + 1)).slice(-2) + "/" + DataInicioDt.getFullYear()
        
        var DataFinalFormatada = "";
        if (AtividadeFlex.tb_atvflex_dt_final)
        { 
            var DataFinalDt = new Date(AtividadeFlex.tb_atvflex_dt_final)
            DataFinalDt.setTime(DataFinalDt.getTime() + (3 * 60 * 60 * 1000))
            DataFinalFormatada = ("0" + DataFinalDt.getDate()).slice(-2) + '/' + ("0" + (DataFinalDt.getMonth() + 1)).slice(-2) + "/" + DataFinalDt.getFullYear()
        }
           
        $("#DataA0").val(DataInicioFormatada)
        $("#DataA1").val(DataFinalFormatada)

        if(HorasUsuario)
        {
            $("#IniciaisUsuario")[0].classList.add("mousechange")
            $("#IniciaisUsuario")[0].setAttribute("onclick", "ModalEditarHoras()")
            
        } else{
            $("#IniciaisUsuario")[0].classList.remove("mousechange")
            $("#IniciaisUsuario")[0].setAttribute("onclick", "")
        }
    }
    document.getElementById("botaoSubirRevisao").disabled = true;
    if (!IDAtiv)
    {
        LiberarModalAtividades();
        document.getElementById("botaoSubirRevisao").title = "Você precisa finalizar a atividade para subir revisão.";
    }
    else
    {
        var Atividade = RetornaAtividade(IDAtiv);
        if (Atividade.tb_atvflex_dt_final) {
            BloquearModalAtividades();
            var IDR0 = Atividade.tb_atvflex_idr0;
            var AtividadeRevisaoMaisAlta;
            var RevisaoMaior = -1;
            for (var i = 0; i < AtividadesFlex.length; i++)
            {
                if (AtividadesFlex[i].tb_atvflex_idr0 == IDR0 && AtividadesFlex[i].tb_atvflex_revisao > RevisaoMaior)
                {
                    RevisaoMaior = AtividadesFlex[i].tb_atvflex_revisao;
                    AtividadeRevisaoMaisAlta = AtividadesFlex[i];
                    // console.log(IDR0)
                }
            }
            if (AtividadeRevisaoMaisAlta.tb_atvflex_id == Atividade.tb_atvflex_id) {
                document.getElementById("botaoSubirRevisao").disabled = false;
                document.getElementById("botaoSubirRevisao").title = "Subir Revisão";
            }
            else 
            {
                document.getElementById("botaoSubirRevisao").title = "Não é possível subir a revisão pois essa não é a revisão mais atual";
            }
        }
        else 
        {
            LiberarModalAtividades();
            document.getElementById("botaoSubirRevisao").title = "Você precisa finalizar a atividade para subir revisão.";
            
        }

        
        
    }
    if (await CheckOSReadOnly() == true)
    {
        BloquearModalAtividades();
        document.getElementById("BotaoSalvarHoras").disabled = true;
    }
    else
    {
        document.getElementById("BotaoSalvarHoras").disabled = false;
    }

    $("#ModalAdicionarAtividade").modal("show");
}
function SubirRevisao() 
{
    $("#ModalAdicionarAtividade").modal("hide");
    $("#ModalConfirmarSubirRevisao").modal("show");
    
}
function CancelarSubirRevisao()
{
    $("#ModalConfirmarSubirRevisao").modal("hide");
    $("#ModalAdicionarAtividade").modal("show");
   
}
function SubirRevisaoConfirmado()
{

    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderSubirRev").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "SubirRevisao": true, "IDAtividade": IDAtiv, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            await carregarPagina();
            $("#loaderSubirRev").hide();
            var IDNova = json['IDNova'];
            var TituloModal = document.getElementById("TituloModalAtividade");
            TituloModal.dataset.idativ = IDNova;
            $("#ModalConfirmarSubirRevisao").modal("hide");
            ModalAtividade(TituloModal);
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        }
    });
}
function BloquearModalAtividades() {
    var CamposAlterar = ['TituloAtiv', 'BotaoSalvarIdentificacao', 'BotaoFinalizar', 'BotaoSalvarTecnico', 'HydModal', 'OpeModal', 'SusModal', 'ExpModal', 'F1Modal', 'ModalObs', 'ModalNotes', 'ModalConexao']
    for (var i = 0; i < CamposAlterar.length; i++) {
        document.getElementById(CamposAlterar[i]).disabled = true;
    }
   
}
function LiberarModalAtividades() {
    var CamposAlterar = ['TituloAtiv', 'BotaoSalvarIdentificacao', 'BotaoFinalizar', 'BotaoSalvarTecnico', 'HydModal', 'OpeModal', 'SusModal', 'ExpModal', 'F1Modal', 'ModalObs', 'ModalNotes', 'ModalConexao']
    for (var i = 0; i < CamposAlterar.length; i++) {
        document.getElementById(CamposAlterar[i]).disabled = false;
    }
}
function SalvarTecnico() {
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    var ValorHyd = $("#HydModal").val().replace(',', '.')
    var ValorOpe = $("#OpeModal").val().replace(',', '.')
    var ValorSus = $("#SusModal").val().replace(',', '.')
    var ValorExp = $("#ExpModal").val().replace(',', '.')
    var ValorF1 = $("#F1Modal").val().replace(',', '.')

    if (ValorHyd != "" && isNaN(ValorHyd))
    {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: O Valor de <strong>Hyd</strong> precisa ser um número ou estar em branco!
                                </div>`)
        return;
    }
    if (ValorOpe != "" && isNaN(ValorOpe)) {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: O Valor de <strong>Ope</strong> precisa ser um número ou estar em branco!
                                </div>`)
        return;
    }
    if (ValorSus != "" && isNaN(ValorSus)) {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: O Valor de <strong>Sus</strong> precisa ser um número ou estar em branco!
                                </div>`)
        return;
    }
    if (ValorExp != "" && isNaN(ValorExp)) {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: O Valor de <strong>Exp</strong> precisa ser um número ou estar em branco!
                                </div>`)
        return;
    }
    if (ValorF1 != "" && isNaN(ValorF1)) {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: O Valor de <strong>F1</strong> precisa ser um número ou estar em branco!
                                </div>`)
        return;
    }
    
    var Obs = $("#ModalObs").val() //entrada
    var Notes = $("#ModalNotes").val() //sauda
    var Conexao = $("#ModalConexao").val()
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderTecnico").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "SalvarTecnico": true, "IDAtividade": IDAtiv, "ValorHyd": ValorHyd, "ValorOpe": ValorOpe, "ValorSus": ValorSus, "ValorExp": ValorExp, "ValorF1": ValorF1, "ObsEntrada": Obs, "ObsSaida": Notes, "Conexao": Conexao, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await carregarPagina();
            $("#loaderTecnico").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

}
function SalvarModalHoras()
{
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    var HorasAdicionar = $("#HorasAdicionarUsuario").val().replace(',', '.')
    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    if (isNaN(HorasAdicionar) || HorasAdicionar <= 0) {
        $("#ErrosHoras").html(`<div class="alert alert-danger" role="alert">Erro de Validação: O valor da hora precisa ser um número maior que zero</div>`)
        return;
    }
    $("#loaderHoras").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "SalvarHoras": true, "IDAtividade": IDAtiv, "HorasAdicionar": HorasAdicionar, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await carregarPagina();
            $("#TotalHorasAtividade").val(RetornaHorasTotaisAtividade(IDAtiv));
            $("#TotalHorasUsuario").val(RetornaHorasTotaisAtividadeUsuario(IDAtiv));
            $("#HorasAdicionarUsuario").val("")
            $("#loaderHoras").hide()
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function SalvarModalIdentificacao()
{
    $("#ErrosDatas").html("")
    $("#ErrosIdentificacao").html("")
    $("#ErrosHoras").html("")
    $("#ErrosTecnico").html("")
    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    var Titulo = $("#TituloAtiv").val();
    var Titulo = $("#TituloAtiv").val();
    if (Titulo.trim() == "" || Titulo == null) {
        $("#ErrosIdentificacao").html(`<div class="alert alert-danger" role="alert"><strong>Digite um título!</strong></div>`)
        return;
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderIdentificacao").show();
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "SalvarTitulo": true,
            "Titulo": Titulo,
            'csrfmiddlewaretoken': csrf[0].value,
            "IDAtividade": IDAtiv
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await carregarPagina();
            $("#loaderIdentificacao").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}

function RetornaHorasTotaisAtividade(ID) {
    var TotalHoras = 0;
    for (var i = 0; i < HourPersonAtividade.length; i++) {
        if (HourPersonAtividade[i].tb_atvflex_hper_atividade == ID) {
            TotalHoras += HourPersonAtividade[i].tb_atvflex_hper_hour;
        }
    }
    return TotalHoras;
}
function RetornaHorasTotaisAtividadeUsuario(ID) {
    var TotalHoras = 0;
    for (var i = 0; i < HourPersonAtividade.length; i++) {
        if (HourPersonAtividade[i].tb_atvflex_hper_atividade == ID && HourPersonAtividade[i].tb_atvflex_hper_per == UserAtual.tb_per_id)
        {
            TotalHoras += HourPersonAtividade[i].tb_atvflex_hper_hour;
        }
    }
    return TotalHoras;
}
function SalvarAtividade(elemento)
{
    var IDAtividade = elemento.dataset.idativ;
    //ErrosDatas
    var Titulo = $("#TituloAtiv").val();
    if (Titulo.trim() == "" || Titulo == null) {
        $("#ErrosIdentificacao").html(`<div class="alert alert-danger" role="alert"><strong>Digite um título!</strong></div>`)
        return;
    }
    if (IDAtividade)
    {
        //salvar
    }
    else
    {
        //criar
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        $("#loaderTecnico").show();
        $.ajax({
            url: "", // the endpoint
            type: "POST", // http method
            dataType: "json",
            data: {
                "Novo": true,
                "Identificador": $("#SelectIdentificadorAtiv option:selected").val(),
                "Titulo": Titulo,
                "Hyd": $("#HydModal").val().replace(',', '.'),
                "Ope": $("#OpeModal").val().replace(',', '.'),
                "Sus": $("#SusModal").val().replace(',', '.'),
                "Exp": $("#ExpModal").val().replace(',', '.'),
                "F1": $("#F1Modal").val().replace(',', '.'),
                "ComentariosEntrada": $("#ModalObs").val(),
                "ComentariosSaida": $("#ModalNotes").val(),
                "Vinculo": $("#ModalConexao").val(),
                'csrfmiddlewaretoken': csrf[0].value,
                "OS": OS
            }, // data sent with the post request
            // handle a successful response
            success: async function (json) {
                await carregarPagina();
                $("#loaderTecnico").hide();
            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {

            }
        });
    }
}
function RetornaCorStatus(StringStatus) {
    
    if (StringStatus == "(A0) Em aberto")
    {
        return CorF2
    }
    if (StringStatus == "(A1) Concluído") {
        return CorF4
    }

}
function InicializarBotoesTabelaSistemas() {

    var BotaoIdent = document.getElementById("BtnIdentificacao");
    BotaoIdent.style.backgroundColor = CorIdentificacao;
    BotaoIdent.style.textAlign = "center"
    BotaoIdent.style.color = "white"
    BotaoIdent.dataset.mostrar = true;
    $("#BtnIdentificacao").show()

    var BotaoDatas = document.getElementById("BtnDatas");
    BotaoDatas.style.backgroundColor = CorDatas;
    BotaoDatas.style.textAlign = "center"
    BotaoDatas.style.color = "white"
    BotaoDatas.dataset.mostrar = true;
    BotaoDatas.style.backgroundColor = "gray"
    $("#BtnDatas").show()

    var BotaoHoras = document.getElementById("BtnHoras");
    BotaoHoras.style.backgroundColor = CorHoras;
    BotaoHoras.style.textAlign = "center"
    BotaoHoras.style.color = "white"
    BotaoHoras.dataset.mostrar = false;
    BotaoHoras.style.backgroundColor = "gray"
    $("#BtnHoras").show()

    var BotaoTecnico = document.getElementById("BtnTecnico");
    BotaoTecnico.style.backgroundColor = CorTecnico;
    BotaoTecnico.style.textAlign = "center"
    BotaoTecnico.style.color = "white"
    BotaoTecnico.dataset.mostrar = false;
    BotaoTecnico.style.backgroundColor = "gray"
    $("#BtnTecnico").show()

    var BotaoStatus = document.getElementById("BtnStatus");
    BotaoStatus.style.backgroundColor = CorStatus;
    BotaoStatus.style.textAlign = "center"
    BotaoStatus.style.color = "white"
    BotaoStatus.dataset.mostrar = true;
    $("#BtnStatus").show()
}
function voltar() {
    $("#osenviar").val(OS)
    $("#num_os").val(OS).change();
}
async function GetPersons() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaPersonTodas/",
        method: "GET",
        data: {}
    });

    return request;

}
async function GetArquivosAtividadesFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/ArquivosAtividadeFlex/",
        method: "GET",
        data: { "os": OS}
    });

    return request;
}

async function GetAtividadesFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadesFlex/",
        method: "GET",
        data: { "os": OS}
    });

    return request;
}
async function GetSistemasOS(OS)
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaSistemasOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
}
async function GetIdentificadoresAtividadesFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/IdentificadorAtividadeFlex/",
        method: "GET",
        data: {}
    });

    return request;
}

async function GetStatusAtividadesFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/StatusAtividadeFlex/",
        method: "GET",
        data: {}
    });

    return request;
}
async function GetHourPersonAtividade() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadeFlexHourPerson/",
        method: "GET",
        data: {"os": OS}
    });

    return request;
}
async function GetSistemasR0()
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadeFlexSistemasR0/",
        method: "GET",
        data: { "os": OS }
    });

    return request;
}
async function GetVinculosAtividade(IDAtividade)
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadeFlexVinculoPorAtividade/",
        method: "GET",
        data: { "IDAtividade": IDAtividade }
    });

    return request;
}
function MostrarEsconderID(BotaoID) {
    if (BotaoID.dataset.mostrar == 'true') {
        BotaoID.dataset.mostrar = false;
        BotaoID.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoID.dataset.mostrar = true
        BotaoID.style.backgroundColor = CorIdentificacao;
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function MostrarEsconderDatas(BotaoDatas) {
    if (BotaoDatas.dataset.mostrar == 'true') {
        BotaoDatas.dataset.mostrar = false;
        BotaoDatas.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoDatas.dataset.mostrar = true
        BotaoDatas.style.backgroundColor = CorDatas;
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
}
function MostrarEsconderHoras(BotaoHoras) {
    if (BotaoHoras.dataset.mostrar == 'true') {
        BotaoHoras.dataset.mostrar = false;
        BotaoHoras.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Horas")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoHoras.dataset.mostrar = true
        BotaoHoras.style.backgroundColor = CorHoras;
        var Elementos = document.getElementsByClassName("Horas")
        if (Elementos.length > 1) {
            for (var i = 0; i < Elementos.length; i++) {
                Elementos[i].style.display = "table-cell"
            }
        }
    }
}

function MostrarEsconderTecnico(BotaoTecnico) {
    if (BotaoTecnico.dataset.mostrar == 'true') {
        BotaoTecnico.dataset.mostrar = false;
        BotaoTecnico.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoTecnico.dataset.mostrar = true
        BotaoTecnico.style.backgroundColor = CorTecnico;
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function MostrarEsconderStatus(BotaoStatus) {
    if (BotaoStatus.dataset.mostrar == 'true') {
        BotaoStatus.dataset.mostrar = false;
        BotaoStatus.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "none"
        }
    }
    else {
        BotaoStatus.dataset.mostrar = true
        BotaoStatus.style.backgroundColor = CorStatus;
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++) {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function AlterarData (elemento) {
    $("#ErrosDatas").html("")
    var id = elemento.id
    var dataAntiga = $("#"+id).val()
    var id2 = id.slice(-2, id.length) // Identificador de qual data está sendo alterada "A0" ou "A1"
    if(dataAntiga){ // se existe a data pode editar (precisa desse para o caso em que a atividade não tem data de "finalizado")
        $("#"+id).attr("readonly", false) // torna o campo editável
        $("#BotaoSalvarData"+id2).removeClass("d-none") // o botão de salvar a nova data aparece
        $("#"+id).focus()
    } else{
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">
          A atividade ainda não foi finalizada!
        </div>`)

    }
}

function SalvarData(){
    var data0 = $("#DataA0").val().trim()
    if($("#DataA1").val()) var data1 = $("#DataA1").val().trim()
    var dataInicial = moment.utc(data0, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")
    var dataFinal = moment.utc(data1, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss")
    var a = moment(dataInicial)
    var b = moment(dataFinal)
    if(data1 && validacaoData(data1) === true && validacaoData(data0) === true){ // Se existes as duas datas e as duas são válidas
        if(b.diff(a, 'days') >= 0){ // Verifica se a data final é posterior a data inicial
            $("#BotaoSalvarDataA0").addClass("d-none")
            $("#BotaoSalvarDataA1").addClass("d-none")
            $("#DataA0").attr("readonly", true)
            $("#DataA1").attr("readonly", true)
            $("#loaderSalvarData").show()
            var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ
            const csrf = document.getElementsByName("csrfmiddlewaretoken")
            $.ajax({
                url: "", // the endpoint
                type: "POST", // http method
                dataType: "json",
                data: { "SalvarData": true, "IDAtividade": IDAtiv, "DataInicial": dataInicial, "DataFinal": dataFinal,'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
                // handle a successful response
                success: async function (json) {
                    await carregarPagina();
                    $("#loaderSalvarData").hide();           
                },
        
                // handle a non-successful response
                error: function (xhr, errmsg, err) {
        
                }
            });
        } else{
            $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">
              A data de finalização deve ser igual ou maior que a data de início!
            </div>`)
        }
    } else{
        if(validacaoData(data0) === true && !data1){
            $("#BotaoSalvarDataA0").addClass("d-none")
            $("#BotaoSalvarDataA1").addClass("d-none")
            $("#DataA0").attr("readonly", true)
            $("#DataA1").attr("readonly", true)
            $("#loaderSalvarData").show();
            var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
            const csrf = document.getElementsByName("csrfmiddlewaretoken")
            $.ajax({
                url: "", // the endpoint
                type: "POST", // http method
                dataType: "json",
                data: { "SalvarData": true, "IDAtividade": IDAtiv, "DataInicial": dataInicial,'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
                // handle a successful response
                success: async function (json) {
                    await carregarPagina();
                    $("#loaderSalvarData").hide();          
                },
        
                // handle a non-successful response
                error: function (xhr, errmsg, err) {
        
                }
            });
        }
    }
}

function validacaoData(data){
    if((/[a-zA-Z]/).test(data)){ // verifica se não tem letras na string
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Você precisa escolher uma data válida (DD/MM/AAAA)</div>`)
        return false 
    } 
    var a = moment(moment.utc(data, "DD/MM/YYYY").format("YYYY-MM-DD HH:mm:ss"))
    var b = moment()
    if(moment(data, "DD/MM/YYYY", true).isValid()){ // se a data é válida
        if(a.diff(b, 'days') <= 0){ // verifica se a data entrada é anterior ou igual ao dia atual
            return true
        }
        else{
            $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Você precisa escolher uma data igual ou anterior ao dia de hoje</div>`)
            return false
        }
    } else{
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Você precisa escolher uma data válida (DD/MM/AAAA)</div>`)
        return false
    }
}

function ExcluirAtividade(){
    var TituloAtiv = $("#TituloAtiv").val()
    $("#TituloModalConfirmarExcluirAtividade").html(`<h5 id="TituloModalConfirmarExcluirAtividade" class="modal-title">Confirmação para excluir a atividade <strong>`+ TituloAtiv +`</strong></h5>`)
    $("#ModalAdicionarAtividade").modal("hide")
    $("#ModalConfirmarExcluirAtividade").modal("show")
}

function CancelarExcluirAtividadeConfirmado(){
    $("#ModalConfirmarExcluirAtividade").modal("hide")
    $("#ModalAdicionarAtividade").modal("show")
}

function ExcluirAtividadeConfirmado(){
    var IDAtiv = document.getElementById("TituloModalAtividade").dataset.idativ;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    var TituloAtiv = $("#TituloAtiv").val()
    $("#TituloModalConfirmacaoAtividadeExcluida").html(`<h5 id="TituloModalConfirmacaoAtividadeExcluida" class="modal-title">Atividade <strong>`+ TituloAtiv +`</strong> excluída com sucesso</h5>`)
    $("#loaderExcluirAtividade").modal("show")
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "ExcluirAtividade": true, "IDAtividade": IDAtiv, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            await carregarPagina();
            $("#loaderExcluirAtividade").modal("hide")
            $("#ModalConfirmarExcluirAtividade").modal("hide")
            $("#ModalConfirmacaoAtividadeExcluida").modal("show")
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {
            alert("Erro ao excluir atividade")
            window.location.reload()
        }
    });
}

function ModalEditarHoras()
{
    var idEstudo = document.getElementById("TituloModalAtividade").dataset.idativ;

    var DivTabela = document.getElementById("TabelaHorasLancadas");
    DivTabela.innerHTML = "";

    var LarguraData = 80;
    var LarguraHoras = 80;
    var fieldTitles = ["Data", "Horas"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "TabelaHoras";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 250px;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead")
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    thead.style.fontSize = "80%"
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (fieldTitle == "Data")
            th.style.width = LarguraData + "px"
        if (fieldTitle == "Horas")
            th.style.width = LarguraHoras + "px"
    });
    
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    var count = 0
    for (var i = 0; i < HourPersonAtividade.length; i++){
        if (HourPersonAtividade[i].tb_atvflex_hper_per == UserAtual.tb_per_id && HourPersonAtividade[i].tb_atvflex_hper_atividade == idEstudo){

            var tr = document.createElement('TR');
            tr.style.display = "table"
            tr.style.tableLayout = "fixed"
            tr.style.fontSize = "80%"
            tableBody.appendChild(tr);

            tr.onmouseover = function () {
                this.style.backgroundColor = "#FF9A0080";
            }

            tr.onmouseleave = function () {
                this.style.backgroundColor = 'white';
            }

            var TdData = document.createElement('TD');
            var TxtData = ""
            if (HourPersonAtividade[i].tb_atvflex_hper_dt_inser)
            {
                var Data = new Date(HourPersonAtividade[i].tb_atvflex_hper_dt_inser)
                TxtData = Data.toLocaleDateString()
            }
            TdData.classList.add("Status")
            var DivData = document.createElement("div")
            DivData.innerHTML = TxtData
            DivData.style.overflow = "hidden"
            DivData.style.textOverflow = "Ellipsis"
            DivData.style.maxHeight = "18px"
            DivData.title = TxtData;
            DivData.style.whiteSpace = "nowrap"
            TdData.appendChild(DivData);
            TdData.style.width = LarguraData + "px"
            tr.appendChild(TdData);

            var TdHora = document.createElement('TD');
            var TxtHora = ""
            if (HourPersonAtividade[i].tb_atvflex_hper_hour)
            {
                TxtHora = HourPersonAtividade[i].tb_atvflex_hper_hour
            }
            TdHora.classList.add("Status")
            TdHora.setAttribute("contenteditable", "true")
            var DivHora = document.createElement("div")
            DivHora.innerHTML = TxtHora
            DivHora.style.overflow = "hidden"
            DivHora.style.textOverflow = "Ellipsis"
            DivHora.style.maxHeight = "18px"
            DivHora.title = TxtHora
            DivHora.style.whiteSpace = "nowrap"
            DivHora.setAttribute("id", "hora" + count)
            TdHora.appendChild(DivHora);
            TdHora.style.width = LarguraHoras + "px"
            TdHora.dataset.valor = TxtHora
            tr.appendChild(TdHora)
            count++
        }
    }

    DivTabela.appendChild(table);
    $("#ErrosHorasEditadas").html("")
    $("#ModalEditarHoras").modal('show')
}
function SalvarEditarHoras()
{
    var idEstudo = document.getElementById("TituloModalAtividade").dataset.idativ;
    $("#ErrosHorasEditadas").html("")

    var horas = []
    var ids = []
    var count = 0
    for(var i = 0; i < HourPersonAtividade.length; i++){
        if (HourPersonAtividade[i].tb_atvflex_hper_per == UserAtual.tb_per_id && HourPersonAtividade[i].tb_atvflex_hper_atividade == idEstudo){
            let hora = $("#hora" + count).text().replace(',','.')

            if (isNaN(hora) || hora <= 0)
            {
                $("#ErrosHorasEditadas").html(`<div class="alert alert-danger" role="alert">Erro de Validação: O valor da hora precisa ser um <strong>número e maior que zero</strong></div>`)
                return
            }
            horas.push(hora)
            ids.push(HourPersonAtividade[i].tb_atvflex_hper_id)
            count++
        }
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderEditarHoras").modal("show")
    $.ajax({
        url: "/app/flexibilidade/EditarHorasAtividades/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDAtividade": idEstudo, 'dados': JSON.stringify({"Horas": horas, "Ids": ids}), 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await carregarPagina();
            $("#loaderEditarHoras").modal("hide")
            $("#ModalEditarHoras").modal('hide')
            $("#TotalHorasAtividade").val(RetornaHorasTotaisAtividade(idEstudo));
            $("#TotalHorasUsuario").val(RetornaHorasTotaisAtividadeUsuario(idEstudo));
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

}
$(function () {


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
        beforeSend: function (xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});

