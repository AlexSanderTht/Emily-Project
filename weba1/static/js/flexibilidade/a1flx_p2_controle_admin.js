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
var PipeSistemaAtual;
var ArquivosAtividades;
var Person;
var HourPersonAtividade;
var UserAtual;
var SistemasOS;
var StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4;
var Statuses;
var SystemFlexTime = []
var TextoCurtoF0 = "Ag. Tubulação (F0)"
var TextoCurtoF1 = "Lib. p/ Cálculo (F1)"
var TextoCurtoF4 = "Tub. ajustada (F4)"
var LinhasOS;
window.onload = async function () {
    OS = $("#OS").html();
    if (await CheckOSReadOnly() == true) {
        $("#tituloos").html(`<b>${OS}</b> - Somente Leitura`)
        $("#JanelaGeral").hide();
    }
    else
    {
        $("#tituloos").html(`<b>${OS}</b> - Acesso Admin!`)
        $("#JanelaGeral").show();
        Statuses = await GetStatuses();
        Person = await GetPersons();
        UserAtual = RetornaUsuarioAtual();
        DefinirStatus();
        await carregarPagina();
    }
};
async function GetStatuses() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaStatus/",
        method: "GET",
        data: {}
    });

    return request;

}
function convertUTCDateToLocalDate(date) {
    var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    return newDate;
}
function AlterarDatas()
{
    var DataF0 = null;
    var DataF1 = null;
    var DataF2 = null;
    var DataF3 = null;
    var DataF4 = null;

    var inputDataF0 = document.getElementById("DataF0");
    var inputDataF1 = document.getElementById("DataF1");
    var inputDataF2 = document.getElementById("DataF2");
    var inputDataF3 = document.getElementById("DataF3");
    var inputDataF4 = document.getElementById("DataF4");

    var IDF0 = inputDataF0.dataset.idDt;
    var IDF1 = inputDataF1.dataset.idDt;
    var IDF2 = inputDataF2.dataset.idDt;
    var IDF3 = inputDataF3.dataset.idDt;
    var IDF4 = inputDataF4.dataset.idDt;
    var IDSistema = document.getElementById("TituloModalSistema").dataset.idsistema;
 


    if (inputDataF0.value) {
        DataF0 = convertUTCDateToLocalDate(new Date(inputDataF0.value));
    }
    if (inputDataF1.value) {
        DataF1 = convertUTCDateToLocalDate(new Date(inputDataF1.value));
        DataF1.setMinutes(DataF1.getMinutes() + 1);
    }

    if (inputDataF2.value) {
        DataF2 = convertUTCDateToLocalDate(new Date(inputDataF2.value));
        DataF2.setMinutes(DataF2.getMinutes() + 2);
    }

    if (inputDataF3.value) {
        DataF3 = convertUTCDateToLocalDate(new Date(inputDataF3.value));
        DataF3.setMinutes(DataF3.getMinutes() + 3);
    }
    if (inputDataF4.value) {
        DataF4 = convertUTCDateToLocalDate(new Date(inputDataF4.value));
        DataF4.setMinutes(DataF4.getMinutes() + 4);
    }
    if (!DataF0) {

        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">
              A data <strong> F0 </strong> é obrigatória!!
            </div>`);
        return;
    }

    if (DataF0) {
        if (DataF1 && DataF0 > DataF1 ) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F0 </strong> não pode ser maior que a data <strong>F1</strong>!
            </div>`);
            return;
        }
        if (DataF2 && DataF0 > DataF2) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F0 </strong> não pode ser maior que a data <strong>F2</strong>!
            </div>`);
            return;
        }
        if (DataF3 && DataF0 > DataF3) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F0 </strong> não pode ser maior que a data <strong>F3</strong>!
            </div>`);
            return;
        }
        if (DataF4 && DataF0 > DataF4) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F0 </strong> não pode ser maior que a data <strong>F4</strong>!
            </div>`);
            return;
        }
    }

    if (DataF1) {
        if (!DataF0) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F0</strong>!
            </div>`);
            return;
        }
        if (DataF2 && DataF1 > DataF2) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F1 </strong> não pode ser maior que a data <strong>F2</strong>!
            </div>`);
            return;
        }
        if (DataF3 && DataF1 > DataF3) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F1 </strong> não pode ser maior que a data <strong>F3</strong>!
            </div>`);
            return;
        }
        if (DataF4 && DataF1 > DataF4) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F1 </strong> não pode ser maior que a data <strong>F4</strong>!
            </div>`);
            return;
        }
    }

    if (DataF2) {
        if (!DataF0) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F0</strong>!
            </div>`);
            return;
        }
        if (!DataF1) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F1</strong>!
            </div>`);
            return;
        }
        if (DataF3 && DataF2 > DataF3) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F2 </strong> não pode ser maior que a data <strong>F3</strong>!
            </div>`);
            return;
        }
        if (DataF4 && DataF2 > DataF4) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F2 </strong> não pode ser maior que a data <strong>F4</strong>!
            </div>`);
            return;
        }
    }
    if (DataF3) {
        if (!DataF0) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F0</strong>!
            </div>`);
            return;
        }
        if (!DataF1) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F1</strong>!
            </div>`);
            return;
        }
        if (!DataF2) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F2</strong>!
            </div>`);
            return;
        }
        if (DataF4 && DataF3 > DataF4) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              A data <strong> F3 </strong> não pode ser maior que a data <strong>F4</strong>!
            </div>`);
            return;
        }
    }

    if (DataF4) {
        if (!DataF0) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F0</strong>!
            </div>`);
            return;
        }
        if (!DataF1) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F1</strong>!
            </div>`);
            return;
        }
        if (!DataF2) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F2</strong>!
            </div>`);
            return;
        }
        if (!DataF3) {
            $("#ErrosDatas").html(`<div class="alert alert-warning" role="alert">
              Você precisa especificar uma data <strong>F3</strong>!
            </div>`);
            return;
        }
    }
    if (DataF0) DataF0 = DataF0.getTime() / 1000;
    if (DataF1) DataF1 = DataF1.getTime() / 1000;
    if (DataF2) DataF2 = DataF2.getTime() / 1000;
    if (DataF3) DataF3 = DataF3.getTime() / 1000;
    if (DataF4) DataF4 = DataF4.getTime() / 1000;
    $("#loaderSalvarDatas").show();

    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    //$("#ModalAdicionarAtividade").modal('hide');
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "Operacao": "AtualizarDatas",
            "IDSistema": IDSistema,
            "IDF0": IDF0,
            "IDF1": IDF1,
            "IDF2": IDF2,
            "IDF3": IDF3,
            "IDF4": IDF4,
            "DataF0": DataF0,
            "DataF1": DataF1,
            "DataF2": DataF2,
            "DataF3": DataF3,
            "DataF4": DataF4,
            'csrfmiddlewaretoken': csrf[0].value
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
           
            await carregarPagina();
            $("#loaderSalvarDatas").hide();
         
            ModalSistema(document.getElementById("TituloModalSistema"));
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

   
}
function DefinirStatus() {
    for (var i = 0; i < Statuses.length; i++) {
        if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Aguardando Tubulação (F0)") {
            StatusF0 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Liberado para cálculo (F1)") {
            StatusF1 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Para revisão (F1.1)") {
            StatusF1R = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Em análise (F2)") {
            StatusF2 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Calculado (F3)") {
            StatusF3 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Tubulação ajustada (F4)") {
            StatusF4 = Statuses[i];
        }
    }
}
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
async function GetSystemFlexTimeOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaSystemFlexTimeOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
}
async function carregarPagina()
{
   
    $("#loader").show();
    $("#JanelaGeral").hide();
    SystemFlexTime = await GetSystemFlexTimeOS(OS);
    SistemasOS = []
    var SistemasOST = await GetSistemasOS(OS)
    var SistemasControleRev = []
    for (var i = 0; i < SistemasOST.length; i++)
    {
        var Achou = false;
        for (var j = 0; j < SistemasControleRev.length; j++)
        {

            if (SistemasOST[i].tb_sf_name == SistemasControleRev[j].Nome && SistemasOST[i].tb_sf_rev > SistemasControleRev[j].Rev)
            {
                SistemasControleRev[j].ID = SistemasOST[i].tb_sf_id;
                SistemasControleRev[j].Rev = SistemasOST[i].tb_sf_rev;
                Achou = true;
                break;
            }
        }
        if (Achou == false)
        {
            SistemasControleRev.push({ "ID": SistemasOST[i].tb_sf_id, "Nome": SistemasOST[i].tb_sf_name, "Rev": SistemasOST[i].tb_sf_rev });
        }
    }

    for (var i = 0; i < SistemasControleRev.length; i++) {
        for (var j = 0; j < SistemasOST.length; j++) {

            if (SistemasOST[j].tb_sf_id == SistemasControleRev[i].ID)
            {
                SistemasOS.push(SistemasOST[j]);
                break;
            }
        }
       
    }

  
    LinhasOS = await GetLinhasOS(OS);
    await CriarTabelaSistemas();
    StatusAtividades = await GetStatusAtividadesFlex();
    CriarListaLinhasCtrl(LinhasOS);
   
    $("#JanelaGeral").show();
    $("#loader").hide();

}
function CriarListaLinhasCtrl(Pipes) {
    var myTableDiv = document.getElementById("TabelaLinhas");
    myTableDiv.innerHTML = "";
    var fieldTitles = ["Sistema", "Linha", "Temp. Proj (ºC)", "Temp. Oper (ºC)", "Press. Proj (bar.g)", "Press. Oper (bar.g)", "Press. Hid (bar.g)", "Remark", "Área", "Histórico", "Status"]
    var table = document.createElement('TABLE');
    table.style.boxShadow = "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
    table.id = "TabelaLinhasT";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    var TitulosDados = ["Temp. Proj (ºC)", "Temp. Oper (ºC)", "Press. Proj (bar.g)", "Press. Oper (bar.g)", "Press. Hid (bar.g)"]
    let thead = document.createElement('thead');
    var LarguraLinha = 250
    var LarguraDados = 75;
    var LarguraSistema = 100;
    var LarguraHist = 100;
    thead.classList.add("LarguraHead")
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"

    let thr = document.createElement('tr');
    thr.style.height = "50px"

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (fieldTitle == "Linha")
            th.style.width = LarguraLinha + "px"
        if (TitulosDados.includes(fieldTitle))
            th.style.width = LarguraDados + "px"
        if (fieldTitle == "Sistema")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Histórico")
            th.style.width = LarguraHist + "px"
    });
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    tableBody.setAttribute("style", "max-height: 300px; overflow-y: scroll;");
    Pipes.sort(function (a, b) {
        let x = RetornaSistemaFlx(a.tb_pf_id_sf).tb_sf_name.toUpperCase() + a.tb_pf_tag_flex.toUpperCase(),
            y = RetornaSistemaFlx(b.tb_pf_id_sf).tb_sf_name.toUpperCase() + b.tb_pf_tag_flex.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
    });
    for (var i = 0; i < Pipes.length; i++) {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        var Sistema = RetornaSistema(Pipes[i])
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }
        var tdSistema = document.createElement('TD')
        tdSistema.classList.add("mousechange")
        tdSistema.dataset.idpipe = Pipes[i].tb_pf_id;
        tdSistema.ondblclick = function () { MostrarModalAlteraSistema(this); }
        if (Sistema) {
            tdSistema.appendChild(document.createTextNode(Sistema));
        }
        else {
            tdSistema.appendChild(document.createTextNode(''));
        }
        tdSistema.style.width = LarguraSistema + "px"
        tr.appendChild(tdSistema);

        var tdLinha = document.createElement('TD');
        if (Pipes[i].tb_pf_tag_flex) {
            tdLinha.appendChild(document.createTextNode(Pipes[i].tb_pf_tag_flex));
        }
        else {
            tdLinha.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdLinha);
        tdLinha.style.width = LarguraLinha + "px"

        var tdTempProj = document.createElement('TD');
        if (Pipes[i].tb_pf_design_temperature) {
            tdTempProj.appendChild(document.createTextNode(Pipes[i].tb_pf_design_temperature));
        }
        else {
            tdTempProj.appendChild(document.createTextNode(''));
        }
        tdTempProj.width = LarguraDados + "px"
        tr.appendChild(tdTempProj);

        var tdTempOper = document.createElement('TD');
        if (Pipes[i].tb_pf_operation_temperature) {
            tdTempOper.appendChild(document.createTextNode(Pipes[i].tb_pf_operation_temperature));
        }
        else {
            tdTempOper.appendChild(document.createTextNode(''));
        }
        tdTempOper.width = LarguraDados + "px"
        tr.appendChild(tdTempOper);

        var tdPressDesign = document.createElement('TD');
        if (Pipes[i].tb_pf_design_pressure) {
            tdPressDesign.appendChild(document.createTextNode(Pipes[i].tb_pf_design_pressure));
        }
        else {
            tdPressDesign.appendChild(document.createTextNode(''));
        }
        tdPressDesign.width = LarguraDados + "px"
        tr.appendChild(tdPressDesign);

        var tdPressOper = document.createElement('TD');
        if (Pipes[i].tb_pf_operation_pressure) {
            tdPressOper.appendChild(document.createTextNode(Pipes[i].tb_pf_operation_pressure));
        }
        else {
            tdPressOper.appendChild(document.createTextNode(''));
        }
        tdPressOper.width = LarguraDados + "px"
        tr.appendChild(tdPressOper);

        var tdPressHyd = document.createElement('TD');
        if (Pipes[i].tb_pf_test_pressure) {
            tdPressHyd.appendChild(document.createTextNode(Pipes[i].tb_pf_test_pressure));
        }
        else {
            tdPressHyd.appendChild(document.createTextNode(''));
        }
        tdPressHyd.width = LarguraDados + "px"
        tr.appendChild(tdPressHyd);

        var tdRemark = document.createElement('TD');
        var TxtRemark = ""
        if (Pipes[i].tb_pf_remark)
            TxtRemark = Pipes[i].tb_pf_remark
        var DivRemark = document.createElement("div")
        DivRemark.innerHTML = TxtRemark
        DivRemark.style.overflow = "hidden"
        DivRemark.style.textOverflow = "Ellipsis"
        DivRemark.style.maxHeight = "18px"
        DivRemark.title = TxtRemark;
        DivRemark.style.whiteSpace = "nowrap"
        tdRemark.appendChild(DivRemark);
        tdRemark.dataset.idpipe = Pipes[i].tb_pf_id;
        tdRemark.ondblclick = function () { MostrarModalRemark(this); }
        tdRemark.classList.add("mousechange")
        tdRemark.classList.add("hoverbold")
        tr.appendChild(tdRemark);

        var tdArea = document.createElement('TD');
        var TxtArea = ""
        if (Pipes[i].tb_pf_area)
            TxtArea = Pipes[i].tb_pf_area
        var DivArea = document.createElement("div")
        DivArea.innerHTML = TxtArea
        DivArea.style.overflow = "hidden"
        DivArea.style.textOverflow = "Ellipsis"
        DivArea.style.maxHeight = "18px"
        DivArea.title = TxtArea;
        DivArea.style.whiteSpace = "nowrap"
        tdArea.appendChild(DivArea);
        tr.appendChild(tdArea);


        var tdHistorico = document.createElement('TD');
        var TxtHistorico = `<button disabled type="button" onclick="MostrarModalHistorico(${Pipes[i].tb_pf_id})" class="btnHist btn btn-primary btn-block ">Acessar</button>`
        var DivHistorico = document.createElement("div")
        DivHistorico.innerHTML = TxtHistorico
        DivHistorico.style.overflow = "hidden"
        DivHistorico.style.maxHeight = "18px"
        DivHistorico.title = "Mostrar histórico da linha";
        DivHistorico.style.whiteSpace = "nowrap"
        tdHistorico.appendChild(DivHistorico);
        tdHistorico.style.width = LarguraHist + "px"
        tr.appendChild(tdHistorico);

        var TdStatus = document.createElement('TD');
        var TxtStatus = ""
        if (Pipes[i].tb_pf_id_st)
            TxtStatus = RetornaStatuspp(Pipes[i]).tb_st_work_status
        TdStatus.classList.add("Status")
        var DivStatus = document.createElement("div")
        DivStatus.innerHTML = TxtStatus
        DivStatus.style.overflow = "hidden"
        DivStatus.style.textOverflow = "Ellipsis"
        DivStatus.style.maxHeight = "18px"
        DivStatus.title = TxtStatus;
        DivStatus.style.whiteSpace = "nowrap"
        TdStatus.style.backgroundColor = RetornaCorStatus(TxtStatus)
        TdStatus.appendChild(DivStatus);
        TdStatus.dataset.idpipe = Pipes[i].tb_pf_id;
        TdStatus.ondblclick = function () { MostrarModalAlterarStatus(this); }
        TdStatus.classList.add("mousechange")
        tr.appendChild(TdStatus);

    }

    myTableDiv.appendChild(table);
    $('#TabelaLinhasT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
}

function MostrarModalAlterarStatus(El)
{

    var PipeID = El.dataset.idpipe;
    document.getElementById("IDLinhaAlterarStatus").dataset.idpipe = PipeID;
    var Pipe;
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id == PipeID)
        {
            Pipe = LinhasOS[i];
            break;
        }
    }
    $("#NomeLinhaAltStatus").html(Pipe.tb_pf_tag_flex);
    var TxtStatus = RetornaStatuspp(Pipe).tb_st_work_status
    var divstatus = document.getElementById("StatusAtualModal");
    divstatus.innerHTML = TxtStatus;
    divstatus.style.backgroundColor = RetornaCorStatus(TxtStatus)
    


    var StatusSistema = [];

    for (var i = 0; i < SystemFlexTime.length; i++) {
        if (SystemFlexTime[i].tb_sft_id_sf == Pipe.tb_pf_id_sf) {
              StatusSistema.push(SystemFlexTime[i]);
            }
        }
    //console.log(StatusSistema);
    StatusSistema.sort(function (a, b) {
        let x = RetornaStatusPipePorID(a.tb_sft_id_st).tb_st_weitgh,
            y = RetornaStatusPipePorID(b.tb_sft_id_st).tb_st_weitgh;
        return x == y ? 0 : x > y ? 1 : -1;
    });

    $("#StatusLinhaAlterar").empty();
    for (var i = 0; i < StatusSistema.length; i++)
    {
        var Status = RetornaStatusPipePorID(StatusSistema[i].tb_sft_id_st)
        if (Status.tb_st_id == StatusF1.tb_st_id) {
            var o = new Option(Status.tb_st_id, Status.tb_st_id);
            $(o).html(Status.tb_st_work_status);
            $("#StatusLinhaAlterar").append(o);
            var oa = new Option(StatusF1R.tb_st_id, StatusF1R.tb_st_id);
            $(oa).html(StatusF1R.tb_st_work_status);
            $("#StatusLinhaAlterar").append(oa);
        }
        else if (Status.tb_st_id == StatusF1R.tb_st_id)
        {
            var o = new Option(StatusF1.tb_st_id, StatusF1.tb_st_id);
            $(o).html(StatusF1.tb_st_work_status);
            $("#StatusLinhaAlterar").append(o);

            var oa = new Option(Status.tb_st_id, Status.tb_st_id);
            $(oa).html(Status.tb_st_work_status);
            $("#StatusLinhaAlterar").append(oa);
            
        }
        else
        {
            var o = new Option(Status.tb_st_id, Status.tb_st_id);
            $(o).html(Status.tb_st_work_status);
            $("#StatusLinhaAlterar").append(o);
        }
        
    }
    
    $("#ModalStatusLinha").modal('show');
}
function AlterarStatusPipe()
{
    var pipeID = document.getElementById("IDLinhaAlterarStatus").dataset.idpipe;
    var Pipe;
    for (var i = 0; i < LinhasOS.length; i++) {
        if (LinhasOS[i].tb_pf_id == pipeID) {
            Pipe = LinhasOS[i];
            break;
        }
    }
    var IDStatus = $("#StatusLinhaAlterar option:selected").val()
    $("#loaderAlterarStatus").show();

    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    //$("#ModalAdicionarAtividade").modal('hide');
    $.ajax({
        url: "", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "Operacao": "AtualizarStatusLinha",
            "pipeID": pipeID,
            "IDStatus": IDStatus,
            "IDSistema": Pipe.tb_pf_id_sf,
            'csrfmiddlewaretoken': csrf[0].value
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {

            await carregarPagina();
            $("#loaderAlterarStatus").hide();

            $("#ModalStatusLinha").modal('hide');
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

 
}
function RetornaStatuspp(Pipe) {
    if (Pipe.tb_pf_id_st == StatusF0.tb_st_id) {
        return StatusF0;
    }
    if (Pipe.tb_pf_id_st == StatusF1.tb_st_id) {
        return StatusF1;
    }
    if (Pipe.tb_pf_id_st == StatusF1R.tb_st_id) {
        return StatusF1R;
    }
    if (Pipe.tb_pf_id_st == StatusF2.tb_st_id) {
        return StatusF2;
    }
    if (Pipe.tb_pf_id_st == StatusF3.tb_st_id) {
        return StatusF3;
    }
    if (Pipe.tb_pf_id_st == StatusF4.tb_st_id) {
        return StatusF4;
    }
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

function RetornaStatusPipePorID(ID) {
    if (ID == StatusF0.tb_st_id) {
        return StatusF0;
    }
    if (ID == StatusF1.tb_st_id) {
        return StatusF1;
    }
    if (ID == StatusF1R.tb_st_id) {
        return StatusF1R;
    }
    if (ID == StatusF2.tb_st_id) {
        return StatusF2;
    }
    if (ID == StatusF3.tb_st_id) {
        return StatusF3;
    }
    if (ID == StatusF4.tb_st_id) {
        return StatusF4;
    }
}

async function CriarTabelaSistemas()
{
   
  
    SistemasOS.sort(function (a, b) {
        let x = a.tb_sf_name,
            y = b.tb_sf_name;
        return x == y ? 0 : x > y ? 1 : -1;
    });


    var myTableDiv = document.getElementById("TabelaSistemas");
    myTableDiv.innerHTML = "";



    var fieldTitles = ["Sistema", "Rev.", "Relatórios", "Status"]

    var table = document.createElement('TABLE');
    table.style.boxShadow = "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
    table.id = "TabelaAtividadesT";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead")
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    let thr = document.createElement('tr');
    thr.style.height = "50px"
   

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        //th.style.backgroundColor = CorIdentificacao
        //th.classList.add("Identificacao")
        thr.appendChild(th);
    });



    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    tableBody.setAttribute("style", "max-height: 300px; overflow-y: scroll;");

    if (SistemasOS.length == 0) {
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
        tdSemAtiv.appendChild(document.createTextNode("Sem Sistemas Cadastrados!"));
        tdSemAtiv.colSpan = 4;
        tr.appendChild(tdSemAtiv);
    }

    for (var i = 0; i < SistemasOS.length; i++) {
        var StatusSistema = RetornaStatusSistema(SistemasOS[i].tb_sf_id)
        var tr = document.createElement('TR');
        tr.classList.add("mousechange")
        tr.dataset.idsistema = SistemasOS[i].tb_sf_id;
        tr.ondblclick = function () { ModalSistema(this); }
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);
        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }
        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }

       
        var TdSistema = document.createElement('TD');
        var TxtSistema = ""
        if (SistemasOS[i].tb_sf_name)
            TxtSistema = SistemasOS[i].tb_sf_name
        TdSistema.classList.add("Sistema")
        var DivSistema = document.createElement("div")
        DivSistema.innerHTML = TxtSistema
        DivSistema.style.overflow = "hidden"
        DivSistema.style.textOverflow = "Ellipsis"
        DivSistema.style.maxHeight = "18px"
        DivSistema.title = TxtSistema;
        DivSistema.style.whiteSpace = "nowrap"
        TdSistema.appendChild(DivSistema);
        tr.appendChild(TdSistema);


        var tdRevisao = document.createElement('TD');
        tdRevisao.classList.add("Identificacao")
        tdRevisao.appendChild(document.createTextNode(SistemasOS[i].tb_sf_rev));
        tr.appendChild(tdRevisao);

       

        var tdLink = document.createElement('TD');
        tdLink.classList.add("Status")
        var TxtLink = `<button type="button" onclick="MostrarModalArquivosAtividades(${SistemasOS[i].tb_sf_id})" class="btn btn-primary btn-block btnReports" style="margin-bottom: 1px; padding: 0; font-size: 90%;border-radius: 0;">Acessar</button>`
        var DivLink = document.createElement("div")
        DivLink.innerHTML = TxtLink
        DivLink.style.overflow = "hidden"
        DivLink.style.maxHeight = "18px"
        DivLink.title = "Acessar Arquivos";
        tdLink.appendChild(DivLink);
        tr.appendChild(tdLink);

 

        var TdStatus = document.createElement('TD');
        var TxtStatus = ""
        TxtStatus = StatusSistema
        TdStatus.classList.add("Status")
        var DivStatus = document.createElement("div")
        DivStatus.innerHTML = TxtStatus
        DivStatus.style.overflow = "hidden"
        DivStatus.style.textOverflow = "Ellipsis"
        DivStatus.style.maxHeight = "18px"
        DivStatus.title = TxtStatus;
        DivStatus.style.whiteSpace = "nowrap"
        DivStatus.style.backgroundColor = RetornaCorStatus(StatusSistema)
        TdStatus.appendChild(DivStatus);
        tr.appendChild(TdStatus);
    }

    myTableDiv.appendChild(table);


    $('#TabelaAtividadesT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
}
function ModalSistema(elemento)
{

    var IDSistema = elemento.dataset.idsistema;
    var DadosSistema = RetornaSistemaPorId(IDSistema);
    //console.log(DadosSistema);
    var DadosDatas = RetornaDataStatusEHorasEditar(DadosSistema)

    $("#DataF0").val("");
    $("#DataF1").val("");
    $("#DataF2").val("");
    $("#DataF3").val("");
    $("#DataF4").val("");
    $("#ErrosDatas").html("");
    delete document.getElementById("DataF0").dataset.idDt;
    delete document.getElementById("DataF1").dataset.idDt;
    delete document.getElementById("DataF2").dataset.idDt;
    delete document.getElementById("DataF3").dataset.idDt;
    delete document.getElementById("DataF4").dataset.idDt;
    if (DadosDatas[0]["Data"] != null)
    {
        var DataT = new Date(Date.parse(DadosDatas[0]["Data"]))
        $("#DataF1").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF1").dataset.idDt = DadosDatas[0]["ID"];
    }
    if (DadosDatas[1]["Data"] != null)
    {
        var DataT = new Date(Date.parse(DadosDatas[1]["Data"]))
        $("#DataF1").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF1").dataset.idDt = DadosDatas[1]["ID"];

    }
    if (DadosDatas[2]["Data"] != null) {
        var DataT = new Date(Date.parse(DadosDatas[2]["Data"]))
        $("#DataF2").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF2").dataset.idDt = DadosDatas[2]["ID"];
    }
    if (DadosDatas[3]["Data"] != null) {
        var DataT = new Date(Date.parse(DadosDatas[3]["Data"]))
        $("#DataF3").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF3").dataset.idDt = DadosDatas[3]["ID"];
    }
    if (DadosDatas[4]["Data"] != null) {
        var DataT = new Date(Date.parse(DadosDatas[4]["Data"]))
        $("#DataF4").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF4").dataset.idDt = DadosDatas[4]["ID"];
    }
    if (DadosDatas[5]["Data"] != null) {
        var DataT = new Date(Date.parse(DadosDatas[5]["Data"]))
        $("#DataF0").val(DataT.toISOString().substring(0, 10));
        document.getElementById("DataF0").dataset.idDt = DadosDatas[5]["ID"];
    }
    //console.log(DadosDatas)
    var TituloModalSistema = document.getElementById("TituloModalSistema");
    TituloModalSistema.dataset.idsistema = IDSistema;
    $("#TituloModalSistema").html(DadosSistema.tb_sf_name + " - R" + DadosSistema.tb_sf_rev);
    $("#ModalAdicionarAtividade").modal('show');
}
function RetornaDataStatusEHorasEditar(Sistema) {
    var F0 = null;
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    var IDF0 = null;
    var IDF1 = null;
    var IDF2 = null;
    var IDF3 = null;
    var IDF4 = null;
    for (var i = 0; i < SystemFlexTime.length; i++) {
        if (SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id) {
            if (SystemFlexTime[i].tb_sft_id_st == StatusF0.tb_st_id) {
                F0 = SystemFlexTime[i].tb_sft_time_update;
                IDF0 = SystemFlexTime[i].tb_sft_id;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1.tb_st_id) {
                F1 = SystemFlexTime[i].tb_sft_time_update;
                IDF1 = SystemFlexTime[i].tb_sft_id;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1R.tb_st_id) {
                F1R = SystemFlexTime[i].tb_sft_time_update;
                IDF1 = SystemFlexTime[i].tb_sft_id;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF2.tb_st_id) {
                F2 = SystemFlexTime[i].tb_sft_time_update;
                IDF2 = SystemFlexTime[i].tb_sft_id;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF3.tb_st_id) {
                F3 = SystemFlexTime[i].tb_sft_time_update;
                IDF3 = SystemFlexTime[i].tb_sft_id;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF4.tb_st_id) {
                F4 = SystemFlexTime[i].tb_sft_time_update;
                IDF4 = SystemFlexTime[i].tb_sft_id;
            }
            if ((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null && F0 != null) {
                break;
            }

        }

    }
    return [{ "Data": F1, "ID": IDF1 }, { "Data": F1R, "ID": IDF1 }, { "Data": F2, "ID": IDF2 }, { "Data": F3, "ID": IDF3 }, { "Data": F4, "ID": IDF4 }, { "Data": F0, "ID": IDF0 }]

}
function RetornaDataStatusEHoras(Sistema) {
    var F0 = null;
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    for (var i = 0; i < SystemFlexTime.length; i++) {
        if (SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id) {
            if (SystemFlexTime[i].tb_sft_id_st == StatusF0.tb_st_id) {
                F0 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1.tb_st_id) {
                F1 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1R.tb_st_id) {
                F1R = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF2.tb_st_id) {
                F2 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF3.tb_st_id) {
                F3 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF4.tb_st_id) {
                F4 = SystemFlexTime[i].tb_sft_time_update;
            }
            if ((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null && F0 != null) {
                break;
            }

        }

    }
    return [F1, F1R, F2, F3, F4, F0]

}

function RetornaStatusSistema(IDSistema) {
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++) {
        if (SistemasOS[i].tb_sf_id == IDSistema) {
            Sistema = SistemasOS[i];
            break;
        }
    }
    var Datas = RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
    var StatusAtual = StatusF0.tb_st_work_status
    if (Datas[0] != null) {
        StatusAtual = StatusF1.tb_st_work_status
    }
    if (Datas[1] != null) {
        StatusAtual = StatusF1R.tb_st_work_status
    }
    if (Datas[2] != null) {
        StatusAtual = StatusF2.tb_st_work_status
    }
    if (Datas[3] != null) {
        StatusAtual = StatusF3.tb_st_work_status
    }
    if (Datas[4] != null) {
        StatusAtual = StatusF4.tb_st_work_status
    }
    return StatusAtual;

}
function RetornaCorStatus(StringStatus) {
    if (StringStatus == StatusF0.tb_st_work_status || StringStatus == TextoCurtoF0) {
        return CorF0;
    }
    if (StringStatus == StatusF1.tb_st_work_status || StringStatus == TextoCurtoF1) {
        return CorF1
    }
    if (StringStatus == StatusF1R.tb_st_work_status) {
        return CorF1R
    }
    if (StringStatus == StatusF2.tb_st_work_status) {
        return CorF2
    }
    if (StringStatus == StatusF3.tb_st_work_status) {
        return CorF3
    }
    if (StringStatus == StatusF4.tb_st_work_status || StringStatus == TextoCurtoF4) {
        return CorF4
    }

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

function voltar() {
    $("#osenviar").val(OS)
    $("#num_os").val(OS).change();
}
async function GetPersons() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaPerson/",
        method: "GET",
        data: {}
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

async function GetLinhasOS(OrdemSer) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaLinhasOS/",
        method: "GET",
        data: { 'OS': OrdemSer }
    });

    return request;

}
function RetornaSistemaFlx(IDSistema) {
    for (var i = 0; i < SistemasOS.length; i++) {
        if (SistemasOS[i].tb_sf_id == IDSistema) {
            return (SistemasOS[i]);
        }
    }
}
function RetornaSistema(Linha) {
    for (var i = 0; i < SistemasOS.length; i++) {
        if (SistemasOS[i].tb_sf_id == Linha.tb_pf_id_sf) {
            return SistemasOS[i].tb_sf_name
        }
    }
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
async function MostrarModalAlteraSistema(Elemento)
{
    if (await CheckOSReadOnly() == true)
    {
        document.getElementById("SistemaPreencher").readOnly = true
        document.getElementById("BotaoAlteraSistema").disabled = true
    }
    else
    {
        document.getElementById("SistemaPreencher").readOnly = false
        document.getElementById("BotaoAlteraSistema").disabled = false
    }
    var ID = Elemento.dataset.idpipe;
    ElementoAlterarSistema = Elemento;
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id == ID)
        {
            PipeSistemaAtual = LinhasOS[i];
            SistemaAtual = RetornaSistema(LinhasOS[i])
            break
        }
    }
    $("#TituloDadosLinhaTroca").html(PipeSistemaAtual.tb_pf_tag_flex)
    SistemaAntigo = SistemaAtual
    $("#SistemaPreencher").val(SistemaAtual)
    $("#ModalAlteraSistema").modal("show")
}
function SalvarSistema()
{
    var SistemaNovo = $("#SistemaPreencher").val();
    if (!SistemaAntigo) SistemaAntigo = "";
    if (SistemaNovo.trim() != SistemaAntigo.trim())
    {
        $("#loaderModalAlteraSistema").show();
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        $.ajax({
            url: "/app/flexibilidade/sistemas/AlterarSistema/", // the endpoint
            type: "POST", // http method
            dataType: "json",
            data: { "IDPipe": PipeSistemaAtual.tb_pf_id, "OS": OS, "SistemaNovo": SistemaNovo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
            // handle a successful response
            success: async function (json) {
                await carregarPagina();
                LinhasOS = await GetLinhasOS(OS);
                ElementoAlterarSistema.firstChild.innerHTML = SistemaNovo;
                $("#loaderModalAlteraSistema").hide();
                $("#ModalAlteraSistema").modal("hide")

            },

            // handle a non-successful response
            error: function (xhr, errmsg, err) {
                $('#results').html("<div class='alert-box alert radius' data-alert>Oops! We have encountered an error: " + errmsg +
                    " <a href='#' class='close'>&times;</a></div>"); // add the error to the dom
            }
        });

    }
    else
    {
        $("#ModalAlteraSistema").modal("hide")
    }
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

