var OS = "";
var Areas = []
var TextoEmBranco = "(Em Branco)";
var LinhasOS = []
var AreasSelecionadas = []
var Statuses = []
var SistemasOS = []
var WorkSystemFlex = []
var SystemFlexTime = []
var HourPersonFlex = []
var Person = []
var PipeFlexTime = []
var StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4;
var CoresCrescentes = ["rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)"]
var CorIdentificacao = "#1E90FF";
var CorDatas = "#32CD32";
var CorHoras = "#000080";
var CorTecnico = "#D2691E";
var CorStatus = "#FF6347";
var DadosDetalhesSistemas = [];
var CorF0 = "#e7eb9d"
var CorF1 = "#f8b65e"
var CorF1R = "#cea774"
var CorF2 = "#ff6060"
var CorF3 = "#6efa75"
var CorF4 = "#6e90fa"
var TextoCurtoF0 = "Ag. Tubulação (F0)"
var TextoCurtoF1 = "Lib. p/ Cálculo (F1)"
var TextoCurtoF4 = "Tub. ajustada (F4)"
var PipeHistoryOS = []
var ElementoRemarkAlterar;
var ElementokAlterarSistema;
var RemarkAntigo = "";
var PipeRemarkAtual;
var UsuariosFlex;
var NomesRetrabalho = ['NÃO', 'SIM - TUB', 'SIM - CLIENTE', 'SIM - FLEX']
var UsuarioAtual;
var StatusPendFlex;
var PendencyFlexLogsOS;
var PendencyFlexOS;
var UsuariosRequisicao;
var Identificadores;
var AtividadesFlex;
var InfoImportsOS;
var InfoImportsAgenda;
var UsuariosAdminOS;
window.onload = async function () {
    $("#style_switcher").hide();
    $('#ArquivoUploadInputExcelPrimarios').attr('accept', ".xlsx");
    OS = $("#OS").html();
    if (await CheckOSReadOnly() == true)
    {
        $("#tituloos").html(`<b>${OS}</b> - Somente Leitura`)
    }
    UsuariosAdminOS = await GetUsuariosAdminOS(OS);

    Identificadores = await GetIdentificadoresAtividadesFlex();
    UsuariosFlex = await GetUsuariosFlex();
    InicializarBotoesTabelaSistemas();
    Statuses = await GetStatuses();
    Person = await GetPersons();
    PersonTodas = await GetPersonsTodas();
    UsuariosRequisicao = await GetUsuariosRequisicao();
    StatusPendFlex = await RetornaStatusPendencyFlex();
    DefinirStatus();
    PreencheUsuarioAtual();

   
    await CarregarPagina();
};
$("#InputsReports").on('dblclick', function ()
{
    var elemento = document.getElementById("InputsReports")
    MostrarArquivosReportsHideSistemas(elemento)
});
function CheckAcessoUsuario()
{
    var IDUsuarioAtual = $("#usuarioatual").html();
    
    var achou = false;
    for (var i = 0; i < UsuariosAdminOS.length; i++)
    {
        var Responsavel = RetornaPerson(UsuariosAdminOS[i].tb_flx_uos_user);
        if (Responsavel.tb_per_id_ldap == IDUsuarioAtual)
        {
            achou = true;
            $("#BotaoAdmin").show();
        }
    }
    if (achou == false)
    {
        $("#BotaoAdmin").remove();
    }
}
function SalvarModalDatas(elemento)
{
    $("#ErrosStatus").html("")
    $("#ErrosDatas").html("")
    $("#ErrosTitulo").html("")
    var ValorLinhasCalculadas = $("#QtdLinhasCalculadasModal").val()
    var ResponsavelCalculo = $("#RespCalculoModal option:selected").val()
    var ResponsavelProj = $("#ProjetoModal option:selected").val()
    var Retrabalho = $("#SelectRetrabalho option:selected").val()
    var IDSistema = elemento.dataset.idsys;
    if (isNaN(ValorLinhasCalculadas) || ValorLinhasCalculadas <= 0)
    {
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Número de linhas calculadas precisa ser um número maior que zero!</div>`)
        return;
    }
    if (ResponsavelCalculo.trim() == "" || ResponsavelCalculo == null)
    {
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Responsável pelo cálculo não selecionado!</div>`)
        return;
    }
    if (ResponsavelProj.trim() == "" || ResponsavelProj == null)
    {
        $("#ErrosDatas").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Responsável pelo projeto não selecionado!</div>`)
        return;
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderIdentificacao").show();
    $.ajax({
        url: "/app/flexibilidade/AtualizarIdentificacao/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDSistema": IDSistema, "LinhasCalculadas": ValorLinhasCalculadas, "RespCalculo": ResponsavelCalculo, "Retrabalho": Retrabalho, 'csrfmiddlewaretoken': csrf[0].value, "RespProjeto": ResponsavelProj }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            $("#loaderIdentificacao").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {
           
        }
    });
}
function RetornaQtdLinhasCalculadasSistema(IDSistema)
{
    for (var i = 0; i < WorkSystemFlex.length; i++)
    {
        if (WorkSystemFlex[i].tb_wsf_id_sf == IDSistema)
        {
            return WorkSystemFlex[i].tb_wsf_calc_lines;
        }
    }
}
function SalvarModalHoras(elemento) {
    $("#ErrosHoras").html("");
    $("#ErrosStatus").html("");
    $("#ErrosTitulo").html("");
    var HorasAdicionar = $("#HorasAdicionarUsuario").val().replace(',','.')
    var IDSistema = elemento.dataset.idsys;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    if (isNaN(HorasAdicionar) || HorasAdicionar <= 0)
    {
        $("#ErrosHoras").html(`<div class="alert alert-danger" role="alert">Erro de Validação: O valor da hora precisa ser um <strong>número maior que zero</strong></div>`)
        return;
    }
    $("#loaderHoras").show();
    $.ajax({
        url: "/app/flexibilidade/AtualizarHoras/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDSistema": IDSistema, "HorasAdicionar": HorasAdicionar, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            var QtdHorasSistema = RetornaHorasSistemaID(IDSistema)
            var QtdLinhasCalculadasSistema = RetornaQtdLinhasCalculadasSistema(IDSistema)
            var HorasLinhaSistema = Math.round(QtdHorasSistema * 100 / QtdLinhasCalculadasSistema) / 100;
            var HorasUsuario = RetornaHorasSistemaPorUsuario(IDSistema, UsuarioAtual)
            $("#HorasAdicionarUsuario").val("")
            $("#HorasPorLinhaCalculadaSistema").val(HorasLinhaSistema)
            $("#TotalHorasUsuario").val(HorasUsuario)
            $("#loaderHoras").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function PreencheUsuarioAtual()
{
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id_ldap == $("#usuarioatual").html())
        {
            UsuarioAtual = Person[i];
            break;
        }

    }
}
function RetornaSistemaPorId(IDSistema) {
    for (var i = 0; i < SistemasOS.length; i++) {
        if (SistemasOS[i].tb_sf_id == IDSistema) {
            return SistemasOS[i]
        }
    }
}
async function AgendarImportacao()
{
    $("#ErrosAgendarImportacao").html("");

    document.getElementById("botaoAplicarVincPDMS").disabled = true;
    document.getElementById("botaoAgendarVincPDMS").disabled = true;
    var NohCaesar = $("#NohCII").val().replace(',', '.')
    var CoordXNavis = $("#CoordXNavis").val().replace(',', '.')
    var CoordYNavis = $("#CoordYNavis").val().replace(',', '.')
    var CoordZNavis = $("#CoordZNavis").val().replace(',', '.')
    var CasoOpe = $("#inputGroupCasoOpe option:selected").text()
    var IDSistema = document.getElementById("TituloModalReportSistema").dataset.idsys;
    var Sistema = RetornaSistemaPorId(IDSistema);

    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderAplicarVinculo").show();
    $.ajax({
        url: "/app/flexibilidade/VinculoPDMS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "Funcao": 'ConfsGerais',
            "NohCaesar": NohCaesar,
            "CoordXNavis": CoordXNavis,
            "CoordYNavis": CoordYNavis,
            "CoordZNavis": CoordZNavis,
            "CasoOpe": CasoOpe,
            "IDInim": Sistema.tb_sf_id_inim,
            'csrfmiddlewaretoken': csrf[0].value
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
           
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
    $.ajax({
        url: "/app/flexibilidade/VinculoPDMS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "Funcao": 'AgendarImportacao',
            "IDSistema": IDSistema,
            "IDInim": Sistema.tb_sf_id_inim,
            'csrfmiddlewaretoken': csrf[0].value
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            document.getElementById("botaoAplicarVincPDMS").disabled = false;
            document.getElementById("botaoAgendarVincPDMS").disabled = false;
            $("#loaderAplicarVinculo").hide();

            AtualizarStatusImportacaoSistema();
            var Erros = json['Erros'];
            if (Erros.length > 0)
            {
                $("#ErrosAgendarImportacao").html(`<div id="ErrosAgDgr" style="margin-top: 15px;" class="alert alert-danger" role="alert">
                    <strong>Não foi possível agendar importação devido aos seguintes erros: </strong>
                    </div>`);
                var $ul = $('<ul style="margin-left: 40px">');
                for (var i = 0; i < Erros.length; i++)
                {
                    var $li = $('<li>').text(Erros[i]);
                    $ul.append($li);
                }
            }
            $("#ErrosAgDgr").append($ul);

        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });




   
}
async function AplicarVinculoPDMS()
{
    $("#ErrosAgendarImportacao").html("");
    document.getElementById("botaoAplicarVincPDMS").disabled = true;
    document.getElementById("botaoAgendarVincPDMS").disabled = true;
    var NohCaesar = $("#NohCII").val().replace(',', '.')
    var CoordXNavis = $("#CoordXNavis").val().replace(',', '.')
    var CoordYNavis = $("#CoordYNavis").val().replace(',', '.')
    var CoordZNavis = $("#CoordZNavis").val().replace(',', '.')
    var CasoOpe = $("#inputGroupCasoOpe option:selected").text()
    var IDSistema = document.getElementById("TituloModalReportSistema").dataset.idsys;
    var Sistema = RetornaSistemaPorId(IDSistema);

    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderAplicarVinculo").show();
    $.ajax({
        url: "/app/flexibilidade/VinculoPDMS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: {
            "Funcao": 'ConfsGerais',
            "NohCaesar": NohCaesar,
            "CoordXNavis": CoordXNavis,
            "CoordYNavis": CoordYNavis,
            "CoordZNavis": CoordZNavis,
            "CasoOpe": CasoOpe,
            "IDInim": Sistema.tb_sf_id_inim,
            'csrfmiddlewaretoken': csrf[0].value
        }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            document.getElementById("botaoAplicarVincPDMS").disabled = false;
            document.getElementById("botaoAgendarVincPDMS").disabled = false;
            $("#loaderAplicarVinculo").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

}
async function CarregarPagina()
{
    $("#BotaoCadastrarSistemas").hide();
    $("#BotaoOutrosTiposAtividades").hide();
    $("#LinhaLinhas").hide();
    $("#LinhaSistemas").hide();
    $("#loader").show();
    LinhasOS = await GetLinhasOS(OS);
    SistemasOS = await GetSistemasOS(OS);
    SystemFlexTime = await GetSystemFlexTimeOS(OS);
    WorkSystemFlex = await GetWorkSystemFlexOS(OS);
    HourPersonFlex = await GetHourPersonFlexOS(OS);
    PipeHistoryOS = await GetPipeHistoryOS(OS);
    PendencyFlexLogsOS = await GetPendencyFlexLogsOS(OS);
    PendencyFlexOS = await GetPendencyFlexOS(OS);
    InfoImportsOS = await GetInfoImports(OS);
    InfoImportsAgenda = await GetInfoImportsAgenda();
    CriarTabelaSistemas();

    CriarListaLinhasCtrl(LinhasOS)
    CheckButtons();
    $("#LinhaLinhas").show();
    $("#LinhaSistemas").show();
    $("#BotaoCadastrarSistemas").show();
    $("#BotaoOutrosTiposAtividades").show();
    CheckAcessoUsuario();
    $("#loader").hide();
}
function AtualizarStatusImportacaoSistema()
{
    //StatusVinculoPDMS
    var IDSistema = document.getElementById("TituloModalReportSistema").dataset.idsys;
    var Sistema = RetornaSistemaPorId(IDSistema);
    var Achou = false;
    if (Sistema)
    {
        for (var i = 0; i < InfoImportsAgenda.length; i++)
        {
            if (InfoImportsAgenda[i].InfoImportsAgenda_id_sf == Sistema.tb_sf_id && InfoImportsAgenda[i].InfoImportsAgenda_id_inim == Sistema.tb_sf_id_inim)
            {
                if (InfoImportsAgenda[i].InfoImportsAgenda_DataEfetuado) {
                    var Data = new Date(Date.parse(InfoImportsAgenda[i].InfoImportsAgenda_DataEfetuado));
                    var DataFormatada = ("0" + (Data.getDate() + 1)).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
                    $("#StatusVinculoPDMS").val("Modelo importado em " + DataFormatada + ".");
                }
                else
                {
                    $("#StatusVinculoPDMS").val("Importação na fila, aguardando execução.");
                }


                Achou = true;
                break;
            }
        }
        if (Achou == false)
        {
            $("#StatusVinculoPDMS").val("Não importado/Não Agendado");
        }
    }

}

function RetornaAprovacaoPendencyFlexSistema(IDSistema)
{
    var Pendency;
    var PendencyLog;
    var NomeStatus;
    for (var i = 0; i < PendencyFlexOS.length; i++)
    {
        if (PendencyFlexOS[i].tb_pdf_id_sf == IDSistema)
        {
            Pendency = PendencyFlexOS[i];
            break;
        }
    }
    if (!Pendency)
    {
        return "Pend não encontrada"
    }
    for (var i = 0; i < PendencyFlexLogsOS.length; i++)
    {
        if (PendencyFlexLogsOS[i].tb_pdf_log_id_pdf == Pendency.tb_pdf_id)
        {
            PendencyLog = PendencyFlexLogsOS[i];
            break;
        }
    }
    for (var i = 0; i < StatusPendFlex.length; i++)
    {
        if (StatusPendFlex[i].tb_spf_id == PendencyLog.tb_pdf_log_id_spf)
        {
            NomeStatus = StatusPendFlex[i].tb_spf_name;
            break;
        }
    }
    return NomeStatus;

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
    BotaoDatas.dataset.mostrar = false;
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
function RetornaHorasUsuariosSistema(IDSistema, Usuarios)
{
    var DadosUsuarios = []
    for (var i = 0; i < Usuarios.length; i++)
    {
        var Iniciais = RetornaInicialUser(Usuarios[i])
        DadosUsuarios.push({ "Iniciais": Iniciais, "Horas": 0, "IDUsuario": Usuarios[i] })

    }
    for (var i = 0; i < HourPersonFlex.length; i++)
    {
        for (var j = 0; j < DadosUsuarios.length; j++)
        {
            if (HourPersonFlex[i].tb_hpf_id_per == DadosUsuarios[j].IDUsuario && HourPersonFlex[i].tb_hpf_id_sf == IDSistema)
            {
                DadosUsuarios[j].Horas += HourPersonFlex[i].tb_hpf_hour;
            }
        }
    }
    return DadosUsuarios;
}
async function MostrarModalRemark(Elemento)
{
    if (await CheckOSReadOnly() == true)
    {
        document.getElementById("RemarkPreencher").readOnly = true;
        document.getElementById("BotaoAlterarRemark").disabled = true;
    }
    else
    {
        document.getElementById("RemarkPreencher").readOnly = false;
        document.getElementById("BotaoAlterarRemark").disabled = false;
    }
    var ID = Elemento.dataset.idpipe;
    ElementoRemarkAlterar = Elemento;
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id == ID)
        {
            PipeRemarkAtual = LinhasOS[i];
            break;
        }

    }
    $("#TituloDadosLinha").html(PipeRemarkAtual.tb_pf_tag_flex)
    RemarkAntigo = PipeRemarkAtual.tb_pf_remark;
    $("#RemarkPreencher").val(PipeRemarkAtual.tb_pf_remark)
    $("#ModalAtualizarRemark").modal("show")
}
function SalvarRemark()
{
    var RemarkNovo = $("#RemarkPreencher").val();
    if (!RemarkAntigo) RemarkAntigo = "";
    if (RemarkNovo.trim() != RemarkAntigo.trim())
    {
        $("#loaderUpdateRemark").show();
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        $.ajax({
            url: "/app/flexibilidade/sistemas/AtualizarRemark/", // the endpoint
            type: "POST", // http method
            dataType: "json",
            data: { "IDPipe": PipeRemarkAtual.tb_pf_id, "NovoRemark": RemarkNovo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
            // handle a successful response
            success: async function (json) {
                PipeHistoryOS = await GetPipeHistoryOS(OS);
                LinhasOS = await GetLinhasOS(OS);
                ElementoRemarkAlterar.firstChild.innerHTML = RemarkNovo;
                $("#loaderUpdateRemark").hide();
                $("#ModalAtualizarRemark").modal("hide")

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
        $("#ModalAtualizarRemark").modal("hide")
    }
}
function RetornaSistema(Linha) {
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == Linha.tb_pf_id_sf)
        {
            return SistemasOS[i].tb_sf_name
        }
    }
}
function RetornaHistoricosLinha(IDLinha)
{
    var Historicos = []
    for (var i = 0; i < PipeHistoryOS.length; i++)
    {
        if (PipeHistoryOS[i].PipeFlex == IDLinha)
        {
            Historicos.push(PipeHistoryOS[i])
        }
    }
    Historicos.sort(function (a, b) {
        let x = Date.parse(a.DataAlteracao),
            y = Date.parse(b.DataAlteracao);
        return x == y ? 0 : x < y ? 1 : -1;
    });
    return Historicos;
}
function convertDateToUTC(date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }

function MostrarModalHistorico(IDLinha)
{
    var Linha;
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id == IDLinha)
        {
            Linha = LinhasOS[i];
            break;
        }
    }
    var Historicos = RetornaHistoricosLinha(IDLinha);
    $("#TituloDadosLinhaHist").html(Linha.tb_pf_tag_flex)
    var DivTabela = document.getElementById("ModalHistoricoTabela");
    DivTabela.innerHTML = "";

    var LarguraResponsavel = 100
    var LarguraDados = 75;
    var LarguraSistema = 100;
    var LarguraHist = 100;
    var LarguraData = 120;
    var fieldTitles = ["Sistema", "Temp. Proj (ºC)", "Temp. Oper (ºC)", "Press. Proj (bar.g)", "Press. Oper (bar.g)", "Press. Hid (bar.g)", "Remark", "Área", "Responsável", "Data"]
    var table = document.createElement('TABLE');
    var TitulosDados = ["Temp. Proj (ºC)", "Temp. Oper (ºC)", "Press. Proj (bar.g)", "Press. Oper (bar.g)", "Press. Hid (bar.g)"]

    table.border = '0.1';
    table.id = "TabelaHistoricoT";
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
        if (TitulosDados.includes(fieldTitle))
            th.style.width = LarguraDados + "px"
        if (fieldTitle == "Sistema")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Histórico")
            th.style.width = LarguraHist + "px"
        if (fieldTitle == "Responsável")
            th.style.width = LarguraResponsavel + "px"
        if (fieldTitle == "Data")
            th.style.width = LarguraData + "px"
    });
    
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    for (var i = 0; i < Historicos.length; i++)
    {
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

        var tdSistema = document.createElement('TD');
        if (Historicos[i].Sistema)
        {
            tdSistema.appendChild(document.createTextNode(Historicos[i].Sistema));
            tdSistema.dataset.valor = Historicos[i].Sistema
        }
        else
        {
            tdSistema.appendChild(document.createTextNode(''));
            tdSistema.dataset.valor = ''
        }

        tdSistema.style.width = LarguraSistema + "px"
        tr.appendChild(tdSistema);

        var tdTempProj = document.createElement('TD');
        if (Historicos[i].TemperaturaProjeto)
        {
            tdTempProj.appendChild(document.createTextNode(Historicos[i].TemperaturaProjeto));
            tdTempProj.dataset.valor = Historicos[i].TemperaturaProjeto
        }
        else
        {
            tdTempProj.appendChild(document.createTextNode(''));
            tdTempProj.dataset.valor = ""
        }

        tdTempProj.width = LarguraDados + "px"
        tr.appendChild(tdTempProj);

        var tdTempOper = document.createElement('TD');
        if (Historicos[i].TemperaturaOperacao)
        {
            tdTempOper.appendChild(document.createTextNode(Historicos[i].TemperaturaOperacao));
            tdTempOper.dataset.valor = Historicos[i].TemperaturaOperacao
        }
        else
        {
            tdTempOper.appendChild(document.createTextNode(''));
            tdTempOper.dataset.valor = ""
        }

        tdTempOper.width = LarguraDados + "px"
        tr.appendChild(tdTempOper);

        var tdPressDesign = document.createElement('TD');
        if (Historicos[i].PressaoProjeto)
        {
            tdPressDesign.appendChild(document.createTextNode(Historicos[i].PressaoProjeto));
            tdPressDesign.dataset.valor = Historicos[i].PressaoProjeto
        }
        else
        {
            tdPressDesign.appendChild(document.createTextNode(''));
            tdPressDesign.dataset.valor = ""
        }

        tdPressDesign.width = LarguraDados + "px"
        tr.appendChild(tdPressDesign);

        var tdPressOper = document.createElement('TD');
        if (Historicos[i].PressaoOperacao)
        {
            tdPressOper.appendChild(document.createTextNode(Historicos[i].PressaoOperacao));
            tdPressOper.dataset.valor = Historicos[i].PressaoOperacao
        }
        else
        {
            tdPressOper.appendChild(document.createTextNode(''));
            tdPressOper.dataset.valor = ''
        }

        tdPressOper.width = LarguraDados + "px"
        tr.appendChild(tdPressOper);

        var tdPressHyd = document.createElement('TD');
        if (Historicos[i].PressaoHidrostatica)
        {
            tdPressHyd.appendChild(document.createTextNode(Historicos[i].PressaoHidrostatica));
            tdPressHyd.dataset.valor = Historicos[i].PressaoHidrostatica
        }
        else
        {
            tdPressHyd.appendChild(document.createTextNode(''));
            tdPressHyd.dataset.valor = ''
        }
        tdPressHyd.width = LarguraDados + "px"
        tr.appendChild(tdPressHyd);

        var tdRemark = document.createElement('TD');
        var TxtRemark = ""
        if (Historicos[i].Remark)
            TxtRemark = Historicos[i].Remark
        var DivRemark = document.createElement("div")
        DivRemark.innerHTML = TxtRemark
        DivRemark.style.overflow = "hidden"
        DivRemark.style.textOverflow = "Ellipsis"
        DivRemark.style.maxHeight = "18px"
        DivRemark.title = TxtRemark;
        DivRemark.style.whiteSpace = "nowrap"
        tdRemark.appendChild(DivRemark);
        tdRemark.dataset.valor = TxtRemark
        tr.appendChild(tdRemark);

        var tdArea = document.createElement('TD');
        var TxtArea = ""
        if (Historicos[i].Area)
            TxtArea = Historicos[i].Area
        var DivArea = document.createElement("div")
        DivArea.innerHTML = TxtArea
        DivArea.style.overflow = "hidden"
        DivArea.style.textOverflow = "Ellipsis"
        DivArea.style.maxHeight = "18px"
        DivArea.title = TxtArea;
        DivArea.style.whiteSpace = "nowrap"
        tdArea.appendChild(DivArea);
        tdArea.dataset.valor = TxtArea
        tr.appendChild(tdArea);

        var tdResponsavel = document.createElement('TD');
        var TxtResponsavel = ""
        var NomeUsuario = "";
        for (var k = 0; k < Person.length; k++)
        {
            if (Person[k].tb_per_id == Historicos[i].Responsavel)
            {
                NomeUsuario = Person[k].tb_per_name;
                break;
            }
        }
        if (Historicos[i].Responsavel)
            TxtResponsavel = RetornaInicialUser(Historicos[i].Responsavel)
        var DivResponsavel = document.createElement("div")
        DivResponsavel.innerHTML = TxtResponsavel
        DivResponsavel.style.overflow = "hidden"
        DivResponsavel.style.maxHeight = "18px"
        DivResponsavel.title = NomeUsuario
        DivResponsavel.style.whiteSpace = "nowrap"
        tdResponsavel.appendChild(DivResponsavel);
        tdResponsavel.style.width = LarguraResponsavel + "px";
        tr.appendChild(tdResponsavel);

        var TdData = document.createElement('TD');
        var TxtData = ""
        if (Historicos[i].DataAlteracao)
        {
            var Data = new Date(Historicos[i].DataAlteracao)
            TxtData = Data.toLocaleDateString() + " " + Data.toLocaleTimeString()
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

    }

    DivTabela.appendChild(table);
    if (Historicos.length > 1)
    {
        for (var i = 0; i < tableBody.childElementCount -1; i++)
        {
            var Linha = tableBody.children[i];
            for (var j = 0; j < Linha.childElementCount - 2; j++)
            {
                var ValorAtual = Linha.children[j].dataset.valor
                var ValorAntigo = tableBody.children[i + 1].children[j].dataset.valor
                if (ValorAtual != ValorAntigo)
                {
                    Linha.children[j].style.backgroundColor = "#f7dc6f"
                }
            }
        }

    }

    $('#TabelaHistoricoT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });




    $("#ModalHistoricoLinha").modal('show')
}
function RetornaSistemaFlx(IDSistema)
{
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            return (SistemasOS[i]);
        }
    }
}
function CriarListaLinhasCtrl(Pipes)
{
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

    var Linhas = []
    var LinhasCanceladas = []
    for (var i = 0; i < Pipes.length; i++) // Laço para organizar o array de pipes com os sistemas cancelados por último
    {
        var Sistema = RetornaSistema(Pipes[i])
        if (Sistema.toLowerCase() == "cancelado"){
            LinhasCanceladas.push(Pipes[i])
        }
        else{
            Linhas.push(Pipes[i])
        }
    }
    Pipes = Linhas.concat(LinhasCanceladas)
    for (var i = 0; i < Pipes.length; i++)
    {
        // TODO: Linhas canceladas deixar taxadas?
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
        var tdSistema = document.createElement('TD');
        if (Sistema)
        {
            tdSistema.appendChild(document.createTextNode(Sistema));
        }
        else
        {
            tdSistema.appendChild(document.createTextNode(''));
        }
        tdSistema.style.width = LarguraSistema + "px"
        tdSistema.dataset.idpipe = Pipes[i].tb_pf_id;
        tr.appendChild(tdSistema);

        var tdLinha = document.createElement('TD');
        if (Pipes[i].tb_pf_tag_flex)
        {
            tdLinha.appendChild(document.createTextNode(Pipes[i].tb_pf_tag_flex));
        }
        else
        {
            tdLinha.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdLinha);
        tdLinha.style.width = LarguraLinha + "px"

        var tdTempProj = document.createElement('TD');
        if (Pipes[i].tb_pf_design_temperature)
        {
            tdTempProj.appendChild(document.createTextNode(Pipes[i].tb_pf_design_temperature));
        }
        else
        {
            tdTempProj.appendChild(document.createTextNode(''));
        }
        tdTempProj.width = LarguraDados + "px"
        tr.appendChild(tdTempProj);

        var tdTempOper = document.createElement('TD');
        if (Pipes[i].tb_pf_operation_temperature)
        {
            tdTempOper.appendChild(document.createTextNode(Pipes[i].tb_pf_operation_temperature));
        }
        else
        {
            tdTempOper.appendChild(document.createTextNode(''));
        }
        tdTempOper.width = LarguraDados + "px"
        tr.appendChild(tdTempOper);

        var tdPressDesign = document.createElement('TD');
        if (Pipes[i].tb_pf_design_pressure)
        {
            tdPressDesign.appendChild(document.createTextNode(Pipes[i].tb_pf_design_pressure));
        }
        else
        {
            tdPressDesign.appendChild(document.createTextNode(''));
        }
        tdPressDesign.width = LarguraDados + "px"
        tr.appendChild(tdPressDesign);

        var tdPressOper = document.createElement('TD');
        if (Pipes[i].tb_pf_operation_pressure)
        {
            tdPressOper.appendChild(document.createTextNode(Pipes[i].tb_pf_operation_pressure));
        }
        else
        {
            tdPressOper.appendChild(document.createTextNode(''));
        }
        tdPressOper.width = LarguraDados + "px"
        tr.appendChild(tdPressOper);

        var tdPressHyd = document.createElement('TD');
        if (Pipes[i].tb_pf_test_pressure)
        {
            tdPressHyd.appendChild(document.createTextNode(Pipes[i].tb_pf_test_pressure));
        }
        else
        {
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
        var TxtHistorico = `<button type="button" onclick="MostrarModalHistorico(${Pipes[i].tb_pf_id})" class="btnHist btn btn-primary btn-block ">Acessar</button>`
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
            TxtStatus = RetornaStatus(Pipes[i]).tb_st_work_status
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
        tr.appendChild(TdStatus);
        
    }

    myTableDiv.appendChild(table);
    $('#TabelaLinhasT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
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
function RetornaStatus(Pipe)
{
    if (Pipe.tb_pf_id_st == StatusF0.tb_st_id)
    {
        return StatusF0;
    }
    if (Pipe.tb_pf_id_st == StatusF1.tb_st_id)
    {
        return StatusF1;
    }
    if (Pipe.tb_pf_id_st == StatusF1R.tb_st_id)
    {
        return StatusF1R;
    }
    if (Pipe.tb_pf_id_st == StatusF2.tb_st_id)
    {
        return StatusF2;
    }
    if (Pipe.tb_pf_id_st == StatusF3.tb_st_id)
    {
        return StatusF3;
    }
    if (Pipe.tb_pf_id_st == StatusF4.tb_st_id)
    {
        return StatusF4;
    }
}
function RetornaStatusSistema(IDSistema)
{
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    var Datas = RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
    var StatusAtual = StatusF0.tb_st_work_status
    if (Datas[0] != null)
    {
        StatusAtual = StatusF1.tb_st_work_status
    }
    if (Datas[1] != null)
    {
        StatusAtual = StatusF1R.tb_st_work_status
    }
    if (Datas[2] != null)
    {
        StatusAtual = StatusF2.tb_st_work_status
    }
    if (Datas[3] != null)
    {
        StatusAtual = StatusF3.tb_st_work_status
    }
    if (Datas[4] != null)
    {
        StatusAtual = StatusF4.tb_st_work_status
    }
    return StatusAtual;
    
}
function AvancarStatusNao()
{
    $("#ModalConfirmacaoAvancarStatus").modal("hide")
    $("#ModalSistema").modal("show")
    $("#loaderAvancarStatus").hide();
}
function AvancarRevisaoNao() {
    $("#ModalConfirmacaoAvancarR1").modal("hide")
    $("#ModalSistema").modal("show")
}
function ConfirmacaoAvancarStatus() {

    $("#ModalConfirmacaoAvancarStatus").modal("hide")
    $("#ModalSistema").modal("show")
    $("#loaderAvancarStatus").show();
    $("#ErrosStatus").html("");
    var BotaoAvancarstatus = document.getElementById("BotaoAvancarStatus")
    var IDSistema = BotaoAvancarstatus.dataset.idsys;
    var Sistema;
    
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    var DadosWork = RetornaDadosWorkSystem(Sistema)
    if (!DadosWork.tb_wsf_id_per_resp_analyze)
    {
        $("#ErrosStatus").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Responsável pelo cálculo não selecionado, selecione o responsável <strong>e clique no botão salvar</strong>!</div>`)
        $("#loaderAvancarStatus").hide();
        return;
    }

    var StatusAtual = $("#StatusSistemaModal").val()
    if (StatusAtual.includes("F2"))
    {
        var DadosWSF = RetornaDadosWorkSystem(Sistema);
        if (isNaN(DadosWSF.tb_wsf_hyd) || isNaN(DadosWSF.tb_wsf_ope) || isNaN(DadosWSF.tb_wsf_sus) || isNaN(DadosWSF.tb_wsf_exp) || isNaN(DadosWSF.tb_wsf_freq_1) || DadosWSF.tb_wsf_hyd == 0 || DadosWSF.tb_wsf_ope == 0 || DadosWSF.tb_wsf_sus == 0 || DadosWSF.tb_wsf_exp == 0 || DadosWSF.tb_wsf_freq_1 == 0)
        {
            $("#ErrosStatus").html(`<div class="alert alert-danger" role="alert">
                                Erro de Validação: Os valores de <strong>Hyd, Ope, Sus, Exp e F1</strong> precisam ser <strong>números</strong> e estarem salvos!
                            </div>`)
            $("#loaderAvancarStatus").hide();
            return;
        }
        var StatusArquivos = $("#StatusArquivosReportSist").val()
        if (Sistema.tb_sf_rev > 0 && StatusArquivos == "Nenhum Arquivo Encontrado")
        {
            $("#ErrosStatus").html(`<div class="alert alert-danger" role="alert">
                            Você precisa incluir os arquivos de relatórios!
                        </div>`)
            $("#loaderAvancarStatus").hide();
            return;
        }
        if (Sistema.tb_sf_rev == 0 && StatusArquivos == "Nenhum Arquivo Encontrado" && document.getElementById("ConfirmacaoR0SemArquivoNao").checked == true)
        {
            $("#ConfirmacaoR0SemArquivo").show();
            $("#loaderAvancarStatus").hide();
            return;
        }
        var QtdHoras = $("#TotalHorasUsuario").val();
        if (QtdHoras=="0")
        {
            $("#ErrosStatus").html(`<div class="alert alert-danger" role="alert">
                            Adicione horas antes de avançar o status
                        </div>`)
            $("#loaderAvancarStatus").hide();
            return;
        }
    }
    $("#ModalSistema").modal("hide")
    $("#ModalConfirmacaoAvancarStatus").modal("show")
}
async function AvancarStatusSistema(elemento)
{
    $("#ModalConfirmacaoAvancarStatus").modal("hide")
    $("#ModalSistema").modal("show")
    $("#loaderAvancarStatus").show();
    $("#ErrosStatus").html("");
    
  
    var IDSistema = elemento.dataset.idsys;
    var Sistema;
   
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    var StatusAtual = $("#StatusSistemaModal").val()
    var sys_rev = Sistema.tb_sf_name + "_" + Sistema.tb_sf_rev;
    if (StatusAtual.includes("F1"))
    {
        $.ajax({
            type: "POST",
            url: "avancar/",
            dataType: 'json',
            data: {
                'dict_edit_flx': JSON.stringify({ 'dict_flx': sys_rev, 'os': OS }),
                'csrfmiddlewaretoken': csrf[0].value
            },
            success: async function (json) {

                await CarregarPagina();
                //$("#ModalSistema").modal('hide');
                await MostrarModalSistemaNovo(elemento);
                $("#ModalSistema").modal('show');
                $("#loaderAvancarStatus").hide();

            },
            //success: window.location.reload(1),
        })
    }
    else
    if (StatusAtual.includes("F2"))
    {
       
        var StatusArquivos = $("#StatusArquivosReportSist").val()
        if (Sistema.tb_sf_rev > 0 && StatusArquivos == "Nenhum Arquivo Encontrado")
        {
            $("#ErrosStatus").html(`<div class="alert alert-danger" role="alert">
                            Você precisa incluir os arquivos de relatórios!
                        </div>`)
            $("#loaderAvancarStatus").hide();
            return;
        }
        

        $.ajax({
            type: "POST",
            url: "avancar/",
            dataType: 'json',
            data: {
                'dict_edit_flx': JSON.stringify({ 'dict_flx': sys_rev, 'os': OS }),
                'csrfmiddlewaretoken': csrf[0].value
            },
            success: async function (json) {
                await CarregarPagina();
                //$("#ModalSistema").modal('hide');
                await MostrarModalSistemaNovo(elemento);
                $("#ModalSistema").modal('show');
                $("#loaderAvancarStatus").hide();
            },
            //success: window.location.reload(1),
        })
    }
}
function RetornaQtdSistemasMesmoNome(Sistema)
{
    var Qtd = 0;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_name == Sistema.tb_sf_name)
        {
            Qtd++;
        }
    }
    return Qtd;
}
async function MostrarArquivosReportsHideSistemas(elemento)
{
    var IDSistema = elemento.dataset.idsys;
    $("#ModalSistema").modal('hide')
    await MostrarModalReportsSistema(IDSistema);
}
async function MostrarModalSistemaNovo(elemento)
{
    $("#loaderTitulo").hide();
    $("#ErrosTitulo").html('')
    $("#ErrosStatus").html(``)
    $("#loaderAvancarStatus").hide();
    $("#ErrosDatas").html("")
    $("#ErrosHoras").html("")
    $("#ErrosHorasEditadas").html("")
    $("#ErrosTecnico").html("")
    $("#HorasAdicionarUsuario").val("")
    $("#HydModal").val("")
    $("#SusModal").val("")
    $("#ExpModal").val("")
    $("#F1Modal").val("")
    $("#OpeModal").val("")
    $("#DataF1").val("")
    $("#DataF2").val("")
    $("#DataF3").val("")
    $("#DataF4").val("")
    $("#ModalObs").val("")
    $("#ModalNotes").val("")
    $("#ModalConexao").val("")
    $("#ConfirmacaoR0SemArquivo").hide();
    $('#dados-sistema-tab').tab('show')
    document.getElementById("ConfirmacaoR0SemArquivoSim").checked = false;
    document.getElementById("ConfirmacaoR0SemArquivoNao").checked = true;
    var IDSistema = elemento.dataset.idsys;
    document.getElementById("linkIsometrico").setAttribute("href", `/app/flexibilidade/DownloadIsometrico/${IDSistema}/`);
    document.getElementById("linkPD2").setAttribute("href", `/app/flexibilidade/DownloadCII/${IDSistema}/`);
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    if (Sistema.tb_sf_rev == 0 && RetornaQtdSistemasMesmoNome(Sistema)==1)
    {
        document.getElementById('AvancarR0R1').disabled = false;
    }
    else
    {
        document.getElementById('AvancarR0R1').disabled = true;
    }

   
    var DadosSist;
    for (var i = 0; i < DadosDetalhesSistemas.length; i++)
    {
        if (DadosDetalhesSistemas[i].ID == IDSistema)
        {
            DadosSist = DadosDetalhesSistemas[i];
            break;
        }
    }
    AtualizarDisponibilidadeModelo3D(IDSistema)
    /*
    "ID": SistemasOS[i].tb_sf_id,
    "Sistema": NomeSistema,
    "Revisao": Rev,
    "QtdLinhasTot": QtdLinhas,
    "QtdLinhasCalc": QtdLinhasCalculadas,
    "RespProj": RespProjetista,
    "RespFlex": RespFlex,
    "Retrabalho": Retrabalho,
    "DataF1": DataF1,
    "DataF2": DataF2,
    "DataF3": DataF3,
    "DataF4": DataF4,
    "StatusAtual": StatusAtual,
    "Horas": Horas,
    "Conexao": Conexao,
    "Link": Link,
    "HorasUsuarios": RetornaHorasUsuariosSistema(SistemasOS[i].tb_sf_id, Usuarios),
    "OBS": WorkSysFlex.tb_wsf_observ,
    "HYD": WorkSysFlex.tb_wsf_hyd,
    "OPE": WorkSysFlex.tb_wsf_ope,
    "SUS": WorkSysFlex.tb_wsf_sus,
    "EXP": WorkSysFlex.tb_wsf_exp,
    "FREQ": WorkSysFlex.tb_wsf_freq_1,
    "Notes": WorkSysFlex.tb_wsf_notes
    */
    //Título
    $("#TituloModalSistema").html(`OS${OS} - ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)
    document.getElementById("BotaoSalvarIdentificacao").dataset.idsys = DadosSist.ID;
    document.getElementById("BotaoSalvarHoras").dataset.idsys = DadosSist.ID;
    document.getElementById("BotaoSalvarTecnico").dataset.idsys = DadosSist.ID;
    document.getElementById("BotaoAvancarStatus").dataset.idsys = DadosSist.ID;
    document.getElementById("BotaoSimAvancarStatus").dataset.idsys = DadosSist.ID;
    document.getElementById('AvancarR0R1').dataset.idsys = DadosSist.ID;
    document.getElementById('BotaoSimAvancarRevisao').dataset.idsys = DadosSist.ID;
    document.getElementById('InputsReports').dataset.idsys = DadosSist.ID;
    
    //Identificação
    $("#QtdTotalLinhasModal").val(DadosSist.QtdLinhasTot)
    $("#QtdLinhasCalculadasModal").val(DadosSist.QtdLinhasCalc)
    document.getElementById("QtdLinhasCalculadasModal").max = DadosSist.QtdLinhasTot;
    if (DadosSist.DataF3 || (Sistema.tb_sf_rev == 0 && RetornaQtdSistemasMesmoNome(Sistema) > 1) || await CheckOSReadOnly() == true)
    {
        document.getElementById("BotaoAvancarStatus").disabled = true;
        document.getElementById('QtdLinhasCalculadasModal').readOnly = true;
        document.getElementById('RespCalculoModal').disabled = true;
        document.getElementById('ProjetoModal').disabled = true;
        document.getElementById('SelectRetrabalho').disabled = true;
        document.getElementById('BotaoSalvarTecnico').disabled = true;
        document.getElementById('BotaoSalvarIdentificacao').disabled = true;
        document.getElementById('HydModal').readOnly = true;
        document.getElementById('SusModal').readOnly = true;
        document.getElementById('ExpModal').readOnly = true;
        document.getElementById('OpeModal').readOnly = true;
        document.getElementById('F1Modal').readOnly = true;
        document.getElementById('ModalObs').readOnly = true;
        document.getElementById('ModalNotes').readOnly = true;
        document.getElementById('ModalConexao').readOnly = true;
        //document.getElementById('HorasAdicionarUsuario').readOnly = true;
        //document.getElementById("BotaoSalvarHoras").disabled = true;
    }
    else
    {
        document.getElementById("BotaoAvancarStatus").disabled = false;
        document.getElementById('QtdLinhasCalculadasModal').readOnly = false;
        document.getElementById('RespCalculoModal').disabled = false;
        document.getElementById('ProjetoModal').disabled = false;
        document.getElementById('SelectRetrabalho').disabled = false;
        document.getElementById('BotaoSalvarIdentificacao').disabled = false;
        document.getElementById('HydModal').readOnly = false;
        document.getElementById('SusModal').readOnly = false;
        document.getElementById('ExpModal').readOnly = false;
        document.getElementById('OpeModal').readOnly = false;
        document.getElementById('F1Modal').readOnly = false;
        document.getElementById('ModalObs').readOnly = false;
        document.getElementById('ModalNotes').readOnly = false;
        document.getElementById('ModalConexao').readOnly = false;
        document.getElementById('BotaoSalvarTecnico').disabled = false;
        //document.getElementById('HorasAdicionarUsuario').readOnly = false;
        //document.getElementById("BotaoSalvarHoras").disabled = false;
    }
    var Dadoswork = RetornaDadosWorkSystem(Sistema);
    $("#ProjetoModal").empty()
    $("#RespCalculoModal").empty()
    var IDResponsavelFlexibilidade;
    var IDResponsavelProjeto;
    for (var i = 0; i < UsuariosFlex.length; i++)
    {
        var o = new Option(UsuariosFlex[i].tb_per_initials, UsuariosFlex[i].tb_per_id);
        $(o).html(UsuariosFlex[i].tb_per_initials);
        o.title = UsuariosFlex[i].tb_per_name;
        $("#RespCalculoModal").append(o);
        if (UsuariosFlex[i].tb_per_id == Dadoswork.tb_wsf_id_per_resp_analyze)
        {
            IDResponsavelFlexibilidade = UsuariosFlex[i].tb_per_id
        }
    }
    if (IDResponsavelFlexibilidade)
    {
        $("#RespCalculoModal").val(IDResponsavelFlexibilidade).change();
    }
    else
    {
        for (var i = 0; i < Person.length; i++)
        {
            if (Person[i].tb_per_id == Dadoswork.tb_wsf_id_per_resp_analyze)
            {
                var o = new Option(Person[i].tb_per_initials, Person[i].tb_per_id);
                $(o).html(Person[i].tb_per_initials);
                o.title = Person[i].tb_per_name;
                $("#RespCalculoModal").append(o);
                $("#RespCalculoModal").val(Person[i].tb_per_initials).change();
                break;
            }
        }
    }
    if (!Dadoswork.tb_wsf_id_per_resp_analyze)
    {
        var o = new Option("", "");
        $(o).html("");
        $("#RespCalculoModal").append(o);
        $("#RespCalculoModal").val("").change();
    }
    // TODO: MOSTRAR SOMENTE AS PESSOAS DO PROJETO
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_status == '1')
        {
            var o = new Option(Person[i].tb_per_initials, Person[i].tb_per_id);
            $(o).html(Person[i].tb_per_initials);
            o.title = Person[i].tb_per_name;
            $("#ProjetoModal").append(o);

            if (Person[i].tb_per_id == Dadoswork.tb_wsf_id_per_request)
            {
                IDResponsavelProjeto = Person[i].tb_per_id
            }
        }
    }
    if (IDResponsavelProjeto)
    {
        $("#ProjetoModal").val(IDResponsavelProjeto).change()
    }
    else
    {
        for (var i = 0; i < PersonTodas.length; i++)
        {
            if (PersonTodas[i].tb_per_id == Dadoswork.tb_wsf_id_per_request)
            {
                var o = new Option(PersonTodas[i].tb_per_initials, PersonTodas[i].tb_per_id);
                $(o).html(PersonTodas[i].tb_per_initials);
                o.title = PersonTodas[i].tb_per_name;
                $("#ProjetoModal").append(o);
                $("#ProjetoModal").val(PersonTodas[i].tb_per_id).change()
                break;
            }
        }
    }

    $("#SelectRetrabalho").empty()
    for (var i = 0; i < NomesRetrabalho.length; i++)
    {
        
        var o = new Option(NomesRetrabalho[i], NomesRetrabalho[i]);
        $(o).html(NomesRetrabalho[i]);
        $("#SelectRetrabalho").append(o);
        if (DadosSist.Retrabalho && NomesRetrabalho[i].toLowerCase() == DadosSist.Retrabalho.toLowerCase())
        {
            $("#SelectRetrabalho").val(NomesRetrabalho[i]).change();
        }
    }

    //Datas
    if (DadosSist.DataF1)
    {
        var Data = new Date(DadosSist.DataF1)
        var DataFormatada = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
        $("#DataF1").val(DataFormatada)
    }
    if (DadosSist.DataF2)
    {
        var Data = new Date(DadosSist.DataF2)
        var DataFormatada = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
        $("#DataF2").val(DataFormatada)
    }
    if (DadosSist.DataF3)
    {
        var Data = new Date(DadosSist.DataF3)
        var DataFormatada = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
        $("#DataF3").val(DataFormatada)
    }
    if (DadosSist.DataF4)
    {
        var Data = new Date(DadosSist.DataF4)
        var DataFormatada = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
        $("#DataF4").val(DataFormatada)
    }
    //Horas
    var HorasUsuario = RetornaHorasSistemaPorUsuario(DadosSist.ID, UsuarioAtual)
    $("#IniciaisUsuario").html("Total Horas - " + UsuarioAtual.tb_per_initials)
    $("#TotalHorasUsuario").val(HorasUsuario)
    var TotalHoras = RetornaHorasSistemaID(DadosSist.ID)
    var HorasPorLinha = Math.round(TotalHoras * 100 / DadosSist.QtdLinhasCalc) / 100;
    $("#HorasPorLinhaCalculadaSistema").val(HorasPorLinha)
    $("#ModalSistema").modal('show')
    //Tecnico
    if (!isNaN(DadosSist.HYD))
    {
        $("#HydModal").val(DadosSist.HYD)
    }
    if (!isNaN(DadosSist.SUS))
    {
        $("#SusModal").val(DadosSist.SUS)
    }
    if (!isNaN(DadosSist.EXP))
    {
        $("#ExpModal").val(DadosSist.EXP)
    }
    if (!isNaN(DadosSist.FREQ))
    {
        $("#F1Modal").val(DadosSist.FREQ)
    }
    if (!isNaN(DadosSist.OPE))
    {
        $("#OpeModal").val(DadosSist.OPE)
    }
    if (DadosSist.OBS)
    {
        $("#ModalObs").val(DadosSist.OBS)
    }
    if (DadosSist.Notes)
    {
        $("#ModalNotes").val(DadosSist.Notes)
    }
    if (DadosSist.Conexao)
    {
        $("#ModalConexao").val(DadosSist.Conexao)
    }
    //Status
    $("#StatusSistemaModal").val(DadosSist.StatusAtual)
    var Arquivos = await GetArquivosSistema(IDSistema);
    var InputStatusReportsArquivos = document.getElementById("StatusArquivosReportSist")
    if (Arquivos.length == 0)
    {
        InputStatusReportsArquivos.value = "Nenhum Arquivo Encontrado"
        InputStatusReportsArquivos.classList.remove("InputDisponibilidade3DSIM")
        InputStatusReportsArquivos.classList.add("InputDisponibilidade3DNAO")
    }
    else
    {
        InputStatusReportsArquivos.value = "Arquivos Disponíveis"
        InputStatusReportsArquivos.classList.remove("InputDisponibilidade3DNAO")
        InputStatusReportsArquivos.classList.add("InputDisponibilidade3DSIM")
    }

    if(HorasUsuario)
    {
        $("#IniciaisUsuario")[0].classList.add("mousechange")
        $("#IniciaisUsuario")[0].setAttribute("onclick", "ModalEditarHoras()")
        
    } else{
        $("#IniciaisUsuario")[0].classList.remove("mousechange")
        $("#IniciaisUsuario")[0].setAttribute("onclick", "")
    }

    CarregarTabelaArquivosVinculos(IDSistema);
    
  
}
async function CarregarTabelaArquivosVinculos(IDSistema)
{
    AtividadesFlex = await GetAtividadesFlex();
    var ArquivosVinculos = await GetArquivosVinculos(IDSistema);

    var DivTabela = document.getElementById("ModalArquivosAtividadesVinculadasTabela");
    DivTabela.innerHTML = "";
    var fieldTitles = ["Atividade", "Titulo", "Descrição Arquivo", "Download"];
   
    var table = document.createElement('TABLE');

    
    table.border = '0.1';
    table.id = "ModalArquivosAtividadesVinculadasTabelaT";
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
        if (fieldTitle == "Atividade")
        {
            th.classList.add("TabelaArquivoFiltrar");
            th.style.width = "120px";
        }
        if (fieldTitle == "Download")
        {
            th.style.width = "120px";
        }
        if (fieldTitle == "Titulo")
        {
            th.classList.add("TabelaArquivoFiltrar");
        }
        if (fieldTitle == "Descrição Arquivo")
        {
            th.classList.add("TabelaArquivoFiltrar");
        }
    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab");
    table.appendChild(tableBody);
    if (ArquivosVinculos.length == 0)
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
        tdSemAtiv.classList.add("Identificacao")
        tdSemAtiv.appendChild(document.createTextNode("Nenhum Arquivo Encontrado!"));
        tdSemAtiv.colSpan = 5;
        tr.appendChild(tdSemAtiv);
    }
    for (var i = 0; i < ArquivosVinculos.length; i++)
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

        var AtividadeFlex = RetornaAtividade(ArquivosVinculos[i].tb_atvflex_arq_id_atvflex);
        var Identificador = RetornaIdentificador(AtividadeFlex.tb_atvflex_identificador);
        var IdentSerial = Identificador.tb_atv_ident_identif + ('000' + AtividadeFlex.tb_atvflex_serialnumber).substr(-3)

        var tdIdentSerial = document.createElement('TD');
        var TxtIdentSerial = IdentSerial;
        var DivIdentSerial = document.createElement("div");
        DivIdentSerial.innerHTML = TxtIdentSerial;
        DivIdentSerial.style.overflow = "hidden";
        DivIdentSerial.style.textOverflow = "Ellipsis";
        DivIdentSerial.style.maxHeight = "18px";
        DivIdentSerial.title = TxtIdentSerial;
        DivIdentSerial.style.whiteSpace = "nowrap";
        tdIdentSerial.appendChild(DivIdentSerial);
        tdIdentSerial.dataset.valor = TxtIdentSerial;
        tdIdentSerial.style.width = "120px";
        tr.appendChild(tdIdentSerial);

        var tdTitulo = document.createElement('TD');
        var TxtTitulo = AtividadeFlex.tb_atvflex_titulo;
        var DivTitulo = document.createElement("div");
        DivTitulo.innerHTML = TxtTitulo;
        DivTitulo.style.overflow = "hidden";
        DivTitulo.style.textOverflow = "Ellipsis";
        DivTitulo.style.maxHeight = "18px";
        DivTitulo.title = TxtTitulo;
        DivTitulo.style.whiteSpace = "nowrap";
        tdTitulo.appendChild(DivTitulo);
        tdTitulo.dataset.valor = TxtTitulo;
        tr.appendChild(tdTitulo);

        var tdDescArquivo = document.createElement('TD');
        var TxtDescArquivo = ArquivosVinculos[i].tb_atvflex_arq_desc;
        var DivDescArquivo = document.createElement("div");
        DivDescArquivo.innerHTML = TxtDescArquivo;
        DivDescArquivo.style.overflow = "hidden";
        DivDescArquivo.style.textOverflow = "Ellipsis";
        DivDescArquivo.style.maxHeight = "18px";
        DivDescArquivo.title = TxtDescArquivo;
        DivDescArquivo.style.whiteSpace = "nowrap";
        tdDescArquivo.appendChild(DivDescArquivo);
        tdDescArquivo.dataset.valor = TxtDescArquivo;
        tr.appendChild(tdDescArquivo);

        var tdDownload = document.createElement('TD');
        var txtDownload = `<a href="/app/flexibilidade/DownloadArquivoAtividade/${ArquivosVinculos[i].tb_atvflex_arq_id}/" download target="_blank" style="margin-top: 1px">Download</a>`
        var DivDownload = document.createElement("div")
        DivDownload.innerHTML = txtDownload
        DivDownload.style.overflow = "hidden"
        DivDownload.style.maxHeight = "18px"
        DivDownload.title = "Baixar Arquivo";
        DivDownload.style.whiteSpace = "nowrap"
        DivDownload.style.marginLeft = "5px"
        DivDownload.style.marginRight = "5px"
        tdDownload.appendChild(DivDownload);
        tdDownload.style.width = "120px";
        tr.appendChild(tdDownload);
    }
    DivTabela.appendChild(table);

    $('#ModalArquivosAtividadesVinculadasTabelaT').excelTableFilter({ columnSelector: '.TabelaArquivoFiltrar', captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });



}
function RetornaIdentificador(ID)
{
    for (var i = 0; i < Identificadores.length; i++)
    {
        if (Identificadores[i].tb_atv_ident_id == ID)
        {
            return Identificadores[i]
        }
    }
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
function AvancarR0ParaR1Confirmado(elemento)
{
    $("#ModalConfirmacaoAvancarR1").modal("hide")
    $("#ModalSistema").modal("show")
    $("#loaderTitulo").show();
    $("#ErrosTitulo").html('')
    var IDSistema = elemento.dataset.idsys;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderTitulo").show();
    $.ajax({
        url: "/app/flexibilidade/AvancarR0R1/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDSistema": IDSistema, 'csrfmiddlewaretoken': csrf[0].value, "StatusAtual": $("#StatusSistemaModal").val() }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            $("#ModalSistema").modal("hide")
            await MostrarModalSistemaNovo(elemento)
            $("#loaderTitulo").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function AvancarDeR0ParaR1(elemento)
{
    $("#loaderTitulo").show();
    $("#ErrosTitulo").html('')
    var IDSistema = elemento.dataset.idsys;
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }

    var DadosWSF = RetornaDadosWorkSystem(Sistema);
    if (!DadosWSF.tb_wsf_id_per_resp_analyze)
    {
        $("#ErrosTitulo").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Responsável pelo cálculo não selecionado, selecione o responsável <strong>e clique no botão salvar</strong>!</div>`)
        $("#loaderTitulo").hide();
        return;
    }
    var QtdHoras = $("#TotalHorasUsuario").val();
    if (QtdHoras == "0")
    {
        $("#ErrosTitulo").html(`<div class="alert alert-danger" role="alert">
                            Adicione horas antes de avançar o status
                        </div>`)
        $("#loaderTitulo").hide();
        return;
    }
    if (isNaN(DadosWSF.tb_wsf_hyd) || isNaN(DadosWSF.tb_wsf_ope) || isNaN(DadosWSF.tb_wsf_sus) || isNaN(DadosWSF.tb_wsf_exp) || isNaN(DadosWSF.tb_wsf_freq_1) || DadosWSF.tb_wsf_hyd == 0 || DadosWSF.tb_wsf_ope == 0 || DadosWSF.tb_wsf_sus == 0 || DadosWSF.tb_wsf_exp == 0 || DadosWSF.tb_wsf_freq_1 == 0)
    {
        $("#ErrosTitulo").html(`<div class="alert alert-danger" role="alert">
                                Erro de Validação: Os valores de <strong>Hyd, Ope, Sus, Exp e F1</strong> precisam ser <strong>números</strong> e estarem salvos!
                            </div>`)
        $("#loaderTitulo").hide();
        return;
    }
   
    $("#ModalConfirmacaoAvancarR1").modal("show")
    $("#ModalSistema").modal("hide")
    //const csrf = document.getElementsByName("csrfmiddlewaretoken")
    //$("#loaderTitulo").show();
    //$.ajax({
    //    url: "/app/flexibilidade/AvancarR0R1/", // the endpoint
    //    type: "POST", // http method
    //    dataType: "json",
    //    data: { "IDSistema": IDSistema, 'csrfmiddlewaretoken': csrf[0].value, "StatusAtual": $("#StatusSistemaModal").val() }, // data sent with the post request
    //    // handle a successful response
    //    success: async function (json) {
    //        await CarregarPagina();
    //        $("#loaderTitulo").hide();
    //    },

    //    // handle a non-successful response
    //    error: function (xhr, errmsg, err) {

    //    }
    //});
}
function MostrarModalSistema(elemento)
{
    MostrarModalSistemaNovo(elemento)
    //cria_modal(elemento.dataset.sistema + "_" + elemento.dataset.rev)
    $("#Modal_Edit_Flex").modal("show")
}
function MostrarEsconderID(BotaoID)
{
    if (BotaoID.dataset.mostrar == 'true')
    {
        BotaoID.dataset.mostrar = false;
        BotaoID.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "none"
        }
    }
    else
    {
        BotaoID.dataset.mostrar = true
        BotaoID.style.backgroundColor = CorIdentificacao;
        var Elementos = document.getElementsByClassName("Identificacao")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function MostrarEsconderDatas(BotaoDatas) {
    if (BotaoDatas.dataset.mostrar == 'true')
    {
        BotaoDatas.dataset.mostrar = false;
        BotaoDatas.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "none"
        }
    }
    else
    {
        BotaoDatas.dataset.mostrar = true
        BotaoDatas.style.backgroundColor = CorDatas;
        var Elementos = document.getElementsByClassName("Datas")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "table-cell"
        }
    }
}
function SalvarTecnico(elemento)
{
    $("#ErrosTitulo").html("")
    $("#ErrosTecnico").html("")
    $("#ErrosStatus").html("")
    var IDSistema = elemento.dataset.idsys;
    if (!$("#HydModal").val() || !$("#OpeModal").val() || !$("#SusModal").val() || !$("#ExpModal").val() || !$("#F1Modal").val())
    {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: Os valores de <strong>Hyd, Ope, Sus, Exp e F1</strong> precisam ser <strong>números</strong>!
                                </div>`)
        return;
    }
    var ValorHyd = $("#HydModal").val().replace(',', '.')
    var ValorOpe = $("#OpeModal").val().replace(',', '.')
    var ValorSus = $("#SusModal").val().replace(',', '.')
    var ValorExp = $("#ExpModal").val().replace(',', '.')
    var ValorF1 = $("#F1Modal").val().replace(',', '.')
    var Obs = $("#ModalObs").val()
    var Notes = $("#ModalNotes").val()
    var Conexao = $("#ModalConexao").val()
    if (isNaN(ValorHyd) || isNaN(ValorOpe) || isNaN(ValorSus) || isNaN(ValorExp) || isNaN(ValorF1))
    {
        $("#ErrosTecnico").html(`<div class="alert alert-danger" role="alert">
                                  Erro de Validação: Os valores de <strong>Hyd, Ope, Sus, Exp e F1</strong> precisam ser <strong>números</strong>!
                                </div>`)
        return;
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderSalvar").show();
    $.ajax({
        url: "/app/flexibilidade/AtualizarTecnicoSistema/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDSistema": IDSistema, "ValorHyd": ValorHyd, "ValorOpe": ValorOpe, "ValorSus": ValorSus, "ValorExp": ValorExp, "ValorF1": ValorF1, "Obs": Obs, "Notes": Notes, "Conexao": Conexao, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            $("#loaderSalvar").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
    
}
function MostrarEsconderHoras(BotaoHoras) {
    if (BotaoHoras.dataset.mostrar == 'true')
    {
        BotaoHoras.dataset.mostrar = false;
        BotaoHoras.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Horas")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "none"
        }
    }
    else
    {
        BotaoHoras.dataset.mostrar = true
        BotaoHoras.style.backgroundColor = CorHoras;
        var Elementos = document.getElementsByClassName("Horas")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function MostrarEsconderTecnico(BotaoTecnico) {
    if (BotaoTecnico.dataset.mostrar == 'true')
    {
        BotaoTecnico.dataset.mostrar = false;
        BotaoTecnico.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "none"
        }
    }
    else
    {
        BotaoTecnico.dataset.mostrar = true
        BotaoTecnico.style.backgroundColor = CorTecnico;
        var Elementos = document.getElementsByClassName("Tecnico")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "table-cell"
        }
    }
}

function MostrarEsconderStatus(BotaoStatus) {
    if (BotaoStatus.dataset.mostrar == 'true')
    {
        BotaoStatus.dataset.mostrar = false;
        BotaoStatus.style.backgroundColor = "gray"
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "none"
        }
    }
    else
    {
        BotaoStatus.dataset.mostrar = true
        BotaoStatus.style.backgroundColor = CorStatus;
        var Elementos = document.getElementsByClassName("Status")
        for (var i = 0; i < Elementos.length; i++)
        {
            Elementos[i].style.display = "table-cell"
        }
    }
}
function CheckButtons() {
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
function CriarTabelaSistemas()
{
    SistemasOS.sort(function (a, b) {
        let x = a.tb_sf_name.toUpperCase(),
            y = b.tb_sf_name.toUpperCase();
        return x == y ? 0 : x > y ? 1 : -1;
    });
    var Usuarios = []
    for (var i = 0; i < HourPersonFlex.length; i++)
    {
        if (!Usuarios.includes(HourPersonFlex[i].tb_hpf_id_per))
        {
            Usuarios.push(HourPersonFlex[i].tb_hpf_id_per)
        }
    }
    Usuarios.sort(function (a, b) {
        let x = RetornaInicialUser(a),
            y = RetornaInicialUser(b);
        return x == y ? 0 : x > y ? 1 : -1;
    });
    DadosDetalhesSistemas = []
    for (var i = 0; i < SistemasOS.length; i++)
    {
        var StatusAprovacaoPendency = RetornaAprovacaoPendencyFlexSistema(SistemasOS[i].tb_sf_id)
        if ((StatusAprovacaoPendency == "ACEITO" || StatusAprovacaoPendency == "ATENDIDO"))
        {
            var WorkSysFlex = RetornaDadosWorkSystem(SistemasOS[i])
            if (WorkSysFlex) {
                var NomeSistema = SistemasOS[i].tb_sf_name;
                var Rev = SistemasOS[i].tb_sf_rev;
                var QtdLinhas = WorkSysFlex.tb_wsf_total_lines
                var QtdLinhasCalculadas = WorkSysFlex.tb_wsf_calc_lines
                var RespProjetista = RetornaInicialUserTodas(WorkSysFlex.tb_wsf_id_per_request) // Todas as pessoas para manter o histório quando a pessoa sair da empresa
                var RespFlex = RetornaInicialUserTodas(WorkSysFlex.tb_wsf_id_per_resp_analyze) // Todas as pessoas para manter o histório quando a pessoa sair da empresa
                var Retrabalho = WorkSysFlex.tb_wsf_rework
                var Datas = RetornaDataStatusEHoras(SistemasOS[i], StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
                var StatusAtual = StatusF0.tb_st_work_status
                var DataF1 = null;
                var DataF2 = null;
                var DataF3 = null;
                var DataF4 = null;
                if (Datas[0] != null) {
                    DataF1 = Datas[0]
                    StatusAtual = StatusF1.tb_st_work_status
                }
                if (Datas[1] != null) {
                    DataF1 = Datas[1]
                    StatusAtual = StatusF1R.tb_st_work_status
                }
                if (Datas[2] != null) {
                    DataF2 = Datas[2]
                    StatusAtual = StatusF2.tb_st_work_status
                }
                if (Datas[3] != null) {
                    DataF3 = Datas[3]
                    StatusAtual = StatusF3.tb_st_work_status
                }
                if (Datas[4] != null) {
                    DataF4 = Datas[4]
                    StatusAtual = StatusF4.tb_st_work_status
                }
                if (StatusAtual == "Aguardando Tubulação (F0)") StatusAtual = TextoCurtoF0
                if (StatusAtual == "Liberado para cálculo (F1)") StatusAtual = TextoCurtoF1
                if (StatusAtual == "Tubulação ajustada (F4)") StatusAtual = TextoCurtoF4

                var Horas = RetornaHorasSistema(SistemasOS[i])
                var Conexao = WorkSysFlex.tb_wsf_conn_sf
                var Link = WorkSysFlex.tb_wsf_link
                DadosDetalhesSistemas.push({
                    "ID": SistemasOS[i].tb_sf_id,
                    "Sistema": NomeSistema,
                    "Revisao": Rev,
                    "QtdLinhasTot": QtdLinhas,
                    "QtdLinhasCalc": QtdLinhasCalculadas,
                    "RespProj": RespProjetista,
                    "RespFlex": RespFlex,
                    "Retrabalho": Retrabalho,
                    "DataF1": DataF1,
                    "DataF2": DataF2,
                    "DataF3": DataF3,
                    "DataF4": DataF4,
                    "StatusAtual": StatusAtual,
                    "Horas": Horas,
                    "Conexao": Conexao,
                    "Link": Link,
                    "HorasUsuarios": RetornaHorasUsuariosSistema(SistemasOS[i].tb_sf_id, Usuarios),
                    "OBS": WorkSysFlex.tb_wsf_observ,
                    "HYD": WorkSysFlex.tb_wsf_hyd,
                    "OPE": WorkSysFlex.tb_wsf_ope,
                    "SUS": WorkSysFlex.tb_wsf_sus,
                    "EXP": WorkSysFlex.tb_wsf_exp,
                    "FREQ": WorkSysFlex.tb_wsf_freq_1,
                    "Notes": WorkSysFlex.tb_wsf_notes
                })
            }
        }
    }


    var myTableDiv = document.getElementById("TabelaSistemas");
    myTableDiv.innerHTML = "";
    var fieldTitlesIdentificacao = ["Sistema", "Rev", "Linhas Totais", "Linhas Cálculo", "Projeto", "Cálculo", "Retrabalho"]
    var fieldTitlesDatas = ["Liberado F1", "Análise F2", "Calculado F3", "Tub. Ajustada F4"]
    var fieldTitlesHoras = []
    for (var i = 0; i < Usuarios.length; i++)
    {
        fieldTitlesHoras.push({ "Iniciais": RetornaInicialUser(Usuarios[i]), "ID": Usuarios[i] })
    }
    var fieldTitlesTecnico = ["Conexão", "Obs", "Hyd(%)", "Ope(%)", "Sus(%)", "Exp(%)", "F1(Hz)", "Notes"]
    var fieldTitlesStatus = ["Relatórios", "Status"]

    var table = document.createElement('TABLE');
    table.style.boxShadow = "rgba(6, 24, 44, 0.4) 0px 0px 0px 2px, rgba(6, 24, 44, 0.65) 0px 4px 6px -1px, rgba(255, 255, 255, 0.08) 0px 1px 0px inset"
    table.id = "TabelaSistemasT";
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
    thIdentificacao.style.fontWeight = "bold"
    thIdentificacao.classList.add("Identificacao")
    thead.appendChild(thIdentificacao)

    let thDatas = document.createElement('td');
    thDatas.appendChild(document.createTextNode("Datas"));
    thDatas.colSpan = "4"
    thDatas.style.backgroundColor = CorDatas
    thDatas.style.color = 'white';
    thDatas.style.fontSize = "16px"
    thDatas.style.fontWeight = "bold"
    thDatas.classList.add("Datas")
    thead.appendChild(thDatas)

    let thHoras = document.createElement('td');
    thHoras.appendChild(document.createTextNode("Horas"));
    thHoras.colSpan = fieldTitlesHoras.length
    thHoras.style.backgroundColor = CorHoras
    thHoras.style.color = 'white';
    thHoras.style.fontSize = "16px"
    thHoras.style.fontWeight = "bold"
    thHoras.classList.add("Horas")
    thead.appendChild(thHoras)

    let thTecnico = document.createElement('td');
    thTecnico.appendChild(document.createTextNode("Técnico"));
    thTecnico.colSpan = fieldTitlesTecnico.length
    thTecnico.style.backgroundColor = CorTecnico
    thTecnico.style.color = 'white';
    thTecnico.style.fontSize = "16px"
    thTecnico.style.fontWeight = "bold"
    thTecnico.classList.add("Tecnico")
    thead.appendChild(thTecnico)

    let thStatus = document.createElement('td');
    thStatus.appendChild(document.createTextNode("Status"));
    thStatus.colSpan = fieldTitlesStatus.length
    thStatus.style.backgroundColor = CorStatus
    thStatus.style.color = 'white';
    thStatus.style.fontSize = "16px"
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
        for (var k = 0; k < Person.length; k++)
        {
            if (Person[k].tb_per_id == fieldTitle.ID)
            {
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
    tableBody.setAttribute("style", "max-height: 300px; overflow-y: scroll;");

    for (var i = 0; i < DadosDetalhesSistemas.length; i++) 
    {
        var tr = document.createElement('TR');
        tr.classList.add("mousechange")
        tr.dataset.idsys = DadosDetalhesSistemas[i]["ID"];
        tr.dataset.sistema = DadosDetalhesSistemas[i]["Sistema"];
        tr.dataset.rev = DadosDetalhesSistemas[i]["Revisao"];
        tr.ondblclick = function () { MostrarModalSistema(this); }
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        // if(DadosDetalhesSistemas[i]["QtdLinhasCalc"] == 0) tr.style.textDecoration = "line-through" // Aplicar quando ajustar a questão dos sistemas com linhas negativas
        tableBody.appendChild(tr);
        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }
        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }
        /*          "Sistema": NomeSistema,
                    "Revisao": Rev,
                    "QtdLinhasTot": QtdLinhas,
                    "QtdLinhasCalc":QtdLinhasCalculadas,
                    "RespProj": RespProjetista,
                    "RespFlex": RespFlex,
                    "Retrabalho":Retrabalho,
                    "DataF1": DataF1,
                    "DataF2": DataF2,
                    "DataF3": DataF3,
                    "DataF4": DataF4,
                    "StatusAtual": StatusAtual,
                    "Horas": Horas,
                    "Conexao": Conexao,
                    "Link": Link})*/

        var tdSistema = document.createElement('TD');
        tdSistema.classList.add("Identificacao")
        tdSistema.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Sistema"]));
        tr.appendChild(tdSistema);

        var tdRevisao = document.createElement('TD');
        tdRevisao.classList.add("Identificacao")
        tdRevisao.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Revisao"]));
        tr.appendChild(tdRevisao);

        var tdQtdLinhasTot = document.createElement('TD');
        tdQtdLinhasTot.classList.add("Identificacao")
        tdQtdLinhasTot.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["QtdLinhasTot"]));
        tr.appendChild(tdQtdLinhasTot);

        var tdQtdLinhasCalc = document.createElement('TD');
        tdQtdLinhasCalc.classList.add("Identificacao")
        tdQtdLinhasCalc.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["QtdLinhasCalc"]));
        tr.appendChild(tdQtdLinhasCalc);
        
        var tdRespProjetista = document.createElement('TD');
        tdRespProjetista.classList.add("Identificacao")
        if (DadosDetalhesSistemas[i]["RespProj"]) {
            tdRespProjetista.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["RespProj"]));
        }
        else {
            tdRespProjetista.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRespProjetista);

        var tdRespFlex = document.createElement('TD');
        tdRespFlex.classList.add("Identificacao")
        if (DadosDetalhesSistemas[i]["RespFlex"]) {
            tdRespFlex.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["RespFlex"]));
        }
        else {
            tdRespFlex.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRespFlex);

        var tdRetrabalho = document.createElement('TD');
        tdRetrabalho.classList.add("Identificacao")
        var TxtRetr = ""
        if (DadosDetalhesSistemas[i]["Retrabalho"])
        {
            TxtRetr = DadosDetalhesSistemas[i]["Retrabalho"]
        }
        var DivRetr = document.createElement("div")
        DivRetr.innerHTML = TxtRetr
        DivRetr.style.overflow = "hidden"
        DivRetr.style.textOverflow = "Ellipsis"
        DivRetr.style.maxHeight = "18px"
        DivRetr.title = TxtRetr;
        DivRetr.style.whiteSpace = "nowrap"
        tdRetrabalho.appendChild(DivRetr)
        tr.appendChild(tdRetrabalho);


        var tdDataF1 = document.createElement('TD');
        var TxtDataF1 = ""
        if (DadosDetalhesSistemas[i]["DataF1"])
        {
            var Data = new Date(DadosDetalhesSistemas[i]["DataF1"])
            var DataFormatadaF0 = ("0" + Data.getDate()).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
            TxtDataF1 = DataFormatadaF0
        }
        tdDataF1.classList.add("Datas")
        var DivDataF1 = document.createElement("div")
        DivDataF1.innerHTML = TxtDataF1
        DivDataF1.style.overflow = "hidden"
        DivDataF1.style.textOverflow = "Ellipsis"
        DivDataF1.style.maxHeight = "18px"
        DivDataF1.title = "Data F1: " + TxtDataF1;
        DivDataF1.style.whiteSpace = "nowrap"
        tdDataF1.appendChild(DivDataF1);
        tdDataF1.style.fontSize = "80%"
        tr.appendChild(tdDataF1);

        var tdDataF2 = document.createElement('TD');
        var TxtDataF2 = ""
        if (DadosDetalhesSistemas[i]["DataF2"])
        {
            var DataF2 = new Date(DadosDetalhesSistemas[i]["DataF2"])
            var DataFormatadaF2 = ("0" + DataF2.getDate()).slice(-2) + '/' + ("0" + (DataF2.getMonth() + 1)).slice(-2) + "/" + DataF2.getFullYear()
            TxtDataF2 = DataFormatadaF2
        }
        tdDataF2.classList.add("Datas")
        var DivDataF2 = document.createElement("div")
        DivDataF2.innerHTML = TxtDataF2
        DivDataF2.style.overflow = "hidden"
        DivDataF2.style.textOverflow = "Ellipsis"
        DivDataF2.style.maxHeight = "18px"
        DivDataF2.title = "Data F2: " + TxtDataF2;
        DivDataF2.style.whiteSpace = "nowrap"
        tdDataF2.appendChild(DivDataF2);
        tdDataF2.style.fontSize = "80%"
        tr.appendChild(tdDataF2);

        var tdDataF3 = document.createElement('TD');
        var TxtDataF3 = ""
        if (DadosDetalhesSistemas[i]["DataF3"])
        {
            var DataF3 = new Date(DadosDetalhesSistemas[i]["DataF3"])
            var DataFormatadaF3 = ("0" + DataF3.getDate()).slice(-2) + '/' + ("0" + (DataF3.getMonth() + 1)).slice(-2) + "/" + DataF3.getFullYear()
            TxtDataF3 = DataFormatadaF3
        }
        tdDataF3.classList.add("Datas")
        var DivDataF3 = document.createElement("div")
        DivDataF3.innerHTML = TxtDataF3
        DivDataF3.style.overflow = "hidden"
        DivDataF3.style.textOverflow = "Ellipsis"
        DivDataF3.style.maxHeight = "18px"
        DivDataF3.title = "Data F3: " + TxtDataF3;
        DivDataF3.style.whiteSpace = "nowrap"
        tdDataF3.appendChild(DivDataF3);
        tdDataF3.style.fontSize = "80%"
        tr.appendChild(tdDataF3);

        var tdDataF4 = document.createElement('TD');
        var TxtDataF4 = ""
        if (DadosDetalhesSistemas[i]["DataF4"])
        {
            var DataF4 = new Date(DadosDetalhesSistemas[i]["DataF4"])
            var DataFormatadaF4 = ("0" + DataF4.getDate()).slice(-2) + '/' + ("0" + (DataF4.getMonth() + 1)).slice(-2) + "/" + DataF4.getFullYear()
            TxtDataF4 = DataFormatadaF4
        }
        tdDataF4.classList.add("Datas")
        var DivDataF4 = document.createElement("div")
        DivDataF4.innerHTML = TxtDataF4
        DivDataF4.style.overflow = "hidden"
        DivDataF4.style.textOverflow = "Ellipsis"
        DivDataF4.style.maxHeight = "18px"
        DivDataF4.title = "Data F4: " + TxtDataF4;
        DivDataF4.style.whiteSpace = "nowrap"
        tdDataF4.appendChild(DivDataF4);
        tdDataF4.style.fontSize = "80%"
        tr.appendChild(tdDataF4);


        for (var j = 0; j < Usuarios.length; j++)
        {
            var QtdHorasUsr = 0;
            for (var k = 0; k < DadosDetalhesSistemas[i].HorasUsuarios.length; k++)
            {
                if (DadosDetalhesSistemas[i].HorasUsuarios[k].IDUsuario == Usuarios[j])
                {
                    QtdHorasUsr = Math.round(DadosDetalhesSistemas[i].HorasUsuarios[k].Horas*100)/100;
                }
            }

            var TdHorasUser = document.createElement('TD');
            TdHorasUser.classList.add("Horas")
            TdHorasUser.appendChild(document.createTextNode(QtdHorasUsr));
            tr.appendChild(TdHorasUser);
        }


        //"OBS": WorkSysFlex.tb_wsf_observ,
        //"HYD": WorkSysFlex.tb_wsf_hyd,
        //"OPE": WorkSysFlex.tb_wsf_ope,
        //"SUS": WorkSysFlex.tb_wsf_sus,
        //"EXP": WorkSysFlex.tb_wsf_exp,
        //"FREQ": WorkSysFlex.tb_wsf_freq_1,
        //"Notes": WorkSysFlex.tb_wsf_notes

        var tdDataF1 = document.createElement('TD');
        var TxtDataF1 = ""
        if (DadosDetalhesSistemas[i]["Conexao"])
            TxtDataF1 = DadosDetalhesSistemas[i]["Conexao"]
        tdDataF1.classList.add("Tecnico")
        var DivDataF1 = document.createElement("div")
        DivDataF1.innerHTML = TxtDataF1
        DivDataF1.style.overflow = "hidden"
        DivDataF1.style.textOverflow = "Ellipsis"
        DivDataF1.style.maxHeight = "18px"
        DivDataF1.title = TxtDataF1;
        DivDataF1.style.whiteSpace = "nowrap"
        tdDataF1.appendChild(DivDataF1);
        tr.appendChild(tdDataF1);

        var TDObs = document.createElement('TD');
        var TxtObs = ""
        if (DadosDetalhesSistemas[i]["OBS"])
            TxtObs = DadosDetalhesSistemas[i]["OBS"]
        var DivObs = document.createElement("div")
        DivObs.innerHTML = TxtObs
        DivObs.style.overflow = "hidden"
        DivObs.style.textOverflow = "Ellipsis"
        DivObs.style.maxHeight = "18px"
        DivObs.title = TxtObs;
        DivObs.style.whiteSpace = "nowrap"

        TDObs.classList.add("Tecnico")

        TDObs.appendChild(DivObs);
        tr.appendChild(TDObs);

        var TdHyd = document.createElement('TD');
        var TxtHyd = ""
        if (DadosDetalhesSistemas[i]["HYD"])
            TxtHyd = DadosDetalhesSistemas[i]["HYD"]
        TdHyd.classList.add("Tecnico")
        TdHyd.appendChild(document.createTextNode(TxtHyd));
        tr.appendChild(TdHyd);

        var TdOpe = document.createElement('TD');
        var TxtOpe = ""
        if (DadosDetalhesSistemas[i]["OPE"])
            TxtOpe = DadosDetalhesSistemas[i]["OPE"]
        TdOpe.classList.add("Tecnico")
        TdOpe.appendChild(document.createTextNode(TxtOpe));
        tr.appendChild(TdOpe);

        var TdSus = document.createElement('TD');
        var TxtSus = ""
        if (DadosDetalhesSistemas[i]["SUS"])
            TxtSus = DadosDetalhesSistemas[i]["SUS"]
        TdSus.classList.add("Tecnico")
        TdSus.appendChild(document.createTextNode(TxtSus));
        tr.appendChild(TdSus);

        var TdExp = document.createElement('TD');
        var TxtExp = ""
        if (DadosDetalhesSistemas[i]["EXP"])
            TxtExp = DadosDetalhesSistemas[i]["EXP"]
        TdExp.classList.add("Tecnico")
        TdExp.appendChild(document.createTextNode(TxtExp));
        tr.appendChild(TdExp);

        var TdFreq = document.createElement('TD');
        var TxtFreq = ""
        if (DadosDetalhesSistemas[i]["FREQ"])
            TxtFreq = DadosDetalhesSistemas[i]["FREQ"]
        TdFreq.classList.add("Tecnico")
        TdFreq.appendChild(document.createTextNode(TxtFreq));
        tr.appendChild(TdFreq);

        var TdNotes = document.createElement('TD');
        var TxtNotes = ""
        if (DadosDetalhesSistemas[i]["Notes"])
            TxtNotes = DadosDetalhesSistemas[i]["Notes"]
        TdNotes.classList.add("Tecnico")
        var DivNotes = document.createElement("div")
        DivNotes.innerHTML = TxtNotes
        DivNotes.style.overflow = "hidden"
        DivNotes.style.textOverflow = "Ellipsis"
        DivNotes.style.maxHeight = "18px"
        DivNotes.title = TxtNotes;
        DivNotes.style.whiteSpace = "nowrap"
        TdNotes.appendChild(DivNotes);
        tr.appendChild(TdNotes);

        var tdLink = document.createElement('TD');
        tdLink.classList.add("Status")
        var TxtLink = `<button type="button" onclick="MostrarModalReportsSistema(${DadosDetalhesSistemas[i]["ID"]})" class="btn btn-primary btn-block btnReports" style="margin-bottom: 1px">Acessar</button>`
        var DivLink = document.createElement("div")
        DivLink.innerHTML = TxtLink
        DivLink.style.overflow = "hidden"
        DivLink.style.maxHeight = "18px"
        DivLink.title = "Acessar Reports";
        tdLink.appendChild(DivLink);
        tr.appendChild(tdLink);

        var TdStatus = document.createElement('TD');
        var TxtStatus = ""
        if (DadosDetalhesSistemas[i]["StatusAtual"])
            TxtStatus = DadosDetalhesSistemas[i]["StatusAtual"]
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

    
    $('#TabelaSistemasT').excelTableFilter({captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' }});
}
async function EnviarArquivoReport(elemento)
{
    $("#ErroArquivo").html("")
    var DescricaoArq = $("#DescricaoArquivo").val()
    const input = document.getElementById("ArquivoUploadInput")
    var IDSistema = document.getElementById("BotaoEnviarReport").dataset.idsys;
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    if (input.files.length == 0)
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Selecione um arquivo!
        </div>`);
        return;
    }
    if (!DescricaoArq && $("#SelectTipoArquivo option:selected").text() == "Arquivo Normal de Report")
    {
        $("#ErroArquivo").html(`<div class="alert alert-danger" role="alert">
          Insira uma descrição!
        </div>`);
        return;
    }
    var progressBox = document.getElementById("ProgressEnvioArquivo");
    progressBox.innerHTML = ""
   
    if ($("#SelectTipoArquivo option:selected").text() == "Arquivo Normal de Report")
    {
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        const fd = new FormData()
        const file_data = input.files[0]
        fd.append('csrfmiddlewaretoken', csrf[0].value)
        fd.append("Arquivo", file_data)
        fd.append("Descricao", DescricaoArq)
        fd.append("IDSistema", IDSistema)
        $.ajax({
            type: 'post',
            url: "/app/flexibilidade/CadastrarArquivoReport/",
            enctype: 'multipart/form-data',
            data: fd,
            beforeSend: function () {

            },
            xhr: function () {
                const xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener('progress', e => {
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
            success: async function (response) {
                await CarregarTabelaArquivos(IDSistema);
                progressBox.innerHTML = ""
                input.value = ""
            },
            fail: function (error) {

            },
            cache: false,
            contentType: false,
            processData: false
        })
    }
    else
    {
        if (Sistema.tb_sf_id_inim)
        {
            $("#ModalReportsSistema").modal('hide')
            $("#ModalConfirmarSubstituirReport3D").modal('show')
        }
        else
        {
            EnviarArquivoReport3DConfirmado();
        }
    }
}
async function CarregarExcelReport(elemento) {
    $("#ErroArquivoExcelReport").html("")
    const input = document.getElementById("ArquivoUploadInputExcelPrimarios")
    var IDSistema = document.getElementById("TituloModalReportSistema").dataset.idsys;
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++) {
        if (SistemasOS[i].tb_sf_id == IDSistema) {
            Sistema = SistemasOS[i];
            break;
        }
    }
    if (input.files.length == 0) {
        $("#ErroArquivoExcelReport").html(`<div class="alert alert-danger" role="alert">
          Selecione um arquivo!
        </div>`);
        return;
    }
    var progressBox = document.getElementById("ProgressEnvioArquivoExcelReport");
    progressBox.innerHTML = ""

    
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    const file_data = input.files[0]
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("Arquivo", file_data)
    fd.append("Funcao", 'ProcessarArquivoExcel')
    fd.append("IDSistema", IDSistema)
    $.ajax({
        type: 'post',
        url: "/app/flexibilidade/VinculoPDMS/",
        enctype: 'multipart/form-data',
        data: fd,
        beforeSend: function () {

        },
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => {
                // console.log(e)
                if (e.lengthComputable) {
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
        success: async function (response) {
            //await CarregarTabelaArquivos(IDSistema);
            progressBox.innerHTML = ""
            input.value = ""
            $("#id_NomeDoArquivolblExcelPrimarios").html("Selecione um arquivo");
            await CarregarTabelaPrimarios();
        },
        fail: function (error) {

        },
        cache: false,
        contentType: false,
        processData: false
    })
    
   
}
async function CarregarTabelaPrimarios()
{
    var IDSistema = document.getElementById("TituloModalReportSistema").dataset.idsys;
    //var Sistema;
    //for (var i = 0; i < SistemasOS.length; i++) {
    //    if (SistemasOS[i].tb_sf_id == IDSistema) {
    //        Sistema = SistemasOS[i];
    //        break;
    //    }
    //}
    var Primarios = await GetPrimariosTabela(IDSistema);
    //console.log(Primarios);
    var DivTabela = document.getElementById("TabelaPrimariosSistema");
    DivTabela.innerHTML = "";

    var LarguraResponsavel = 100
    var LarguraDados = 75;
    var LarguraSistema = 100;
    var LarguraHist = 100;
    var LarguraData = 120;
    var fieldTitles = ["ID", "Rev.", "Nó CII", "Comentário", "Típ. Sugerido", "Observação", "Resp.", "Data Atendido"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "TabelaPrimariosSistemaT";
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
        if (fieldTitle == "ID") th.style.width = "50px"
        if (fieldTitle == "Rev.") th.style.width = "50px"
        if (fieldTitle == "Img.") th.style.width = "50px"
        if (fieldTitle == "Típ. Sugerido")
        {
            th.style.width = "100px"
            th.title = "Típico Sugerido";
        }

        if (fieldTitle == "Resp.")
        {
            th.style.width = "75px"
            th.title = "Responsável";
        }

        if (fieldTitle == "Nó CII")
        {
            th.style.width = "75px"
            th.title = "Nó referente a esse suporte no Caesar II";
        }
        if (fieldTitle == "Data Atendido")
        {
            th.style.width = "120px"
        }
        thr.appendChild(th);
    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    for (var i = 0; i < Primarios.length; i++) {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tr.style.fontSize = "80%"
        tr.dataset.id_dados_tabela = Primarios[i].tb_itr_id;
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }

        var tdIdRelatorio = document.createElement('TD');
        if (Primarios[i].tb_itr_id_relatorio) {
            tdIdRelatorio.appendChild(document.createTextNode(Primarios[i].tb_itr_id_relatorio));
        }
        else {
            tdIdRelatorio.appendChild(document.createTextNode(''));
        }
        tdIdRelatorio.style.width = "50px"
        tr.appendChild(tdIdRelatorio);


        var tdRevisao = document.createElement('TD');
        if (Primarios[i].tb_itr_rev_flex) {
            tdRevisao.appendChild(document.createTextNode(Primarios[i].tb_itr_rev_flex));
        }
        else {
            tdRevisao.appendChild(document.createTextNode(''));
        }
        tdRevisao.width = "50px"
        tr.appendChild(tdRevisao);

        var tdNohCII = document.createElement('TD');
        if (Primarios[i].tb_itr_node_caesar)
        {
            tdNohCII.appendChild(document.createTextNode(Primarios[i].tb_itr_node_caesar));
        }
        else
        {
            tdNohCII.appendChild(document.createTextNode(''));
        }
        tdNohCII.width = "75px"
        tr.appendChild(tdNohCII);

        //var tdImagem = document.createElement('TD');
        //if (Primarios[i].tb_itr_n_imagem) {
        //    tdImagem.appendChild(document.createTextNode(Primarios[i].tb_itr_n_imagem));
        //}
        //else {
        //    tdImagem.appendChild(document.createTextNode(''));
        //}
        //tdImagem.width = "50px"
        //tr.appendChild(tdImagem);


        //var tdDisciplina = document.createElement('TD');
        //if (Primarios[i].tb_itr_disciplina) {
        //    tdDisciplina.appendChild(document.createTextNode(Primarios[i].tb_itr_disciplina));
        //}
        //else {
        //    tdDisciplina.appendChild(document.createTextNode(''));
        //}
        ////tdDisciplina.width = LarguraDados + "px"
        //tr.appendChild(tdDisciplina);

        var tdComentario = document.createElement('TD');
        var TxtComentario = ""
        if (Primarios[i].tb_itr_comentario)
            TxtComentario = Primarios[i].tb_itr_comentario
        var DivComentario = document.createElement("div")
        DivComentario.innerHTML = TxtComentario
        DivComentario.style.overflow = "hidden"
        DivComentario.style.textOverflow = "Ellipsis"
        DivComentario.style.maxHeight = "18px"
        DivComentario.title = TxtComentario;
        DivComentario.style.whiteSpace = "nowrap"
        tdComentario.appendChild(DivComentario);
        tdComentario.dataset.valor = TxtComentario
        tr.appendChild(tdComentario);

        var tdTipicoSugerido = document.createElement('TD');
        var TxtTipicoSugerido = ""
        if (Primarios[i].tb_itr_tipico_sugerido)
            TxtTipicoSugerido = Primarios[i].tb_itr_tipico_sugerido
        var DivTipicoSugerido = document.createElement("div")
        DivTipicoSugerido.innerHTML = TxtTipicoSugerido
        DivTipicoSugerido.style.overflow = "hidden"
        DivTipicoSugerido.style.textOverflow = "Ellipsis"
        DivTipicoSugerido.style.maxHeight = "18px"
        DivTipicoSugerido.title = TxtTipicoSugerido;
        DivTipicoSugerido.style.whiteSpace = "nowrap"
        tdTipicoSugerido.appendChild(DivTipicoSugerido);
        tdTipicoSugerido.dataset.valor = TxtTipicoSugerido
        tdTipicoSugerido.style.width = "100px"
        tr.appendChild(tdTipicoSugerido);


        //var tdPrioridade = document.createElement('TD');
        //if (Primarios[i].tb_itr_prioridade) {
        //    tdPrioridade.appendChild(document.createTextNode(Primarios[i].tb_itr_prioridade));
        //}
        //else {
        //    tdPrioridade.appendChild(document.createTextNode(''));
        //}
        ////tdPrioridade.width = LarguraDados + "px"
        //tr.appendChild(tdPrioridade);


        var tdObservacao = document.createElement('TD');
        var TxtObservacao = ""
        if (Primarios[i].tb_itr_observacao)
            TxtObservacao = Primarios[i].tb_itr_observacao
        var DivObservacao = document.createElement("div")
        DivObservacao.innerHTML = TxtObservacao
        DivObservacao.style.overflow = "hidden"
        DivObservacao.style.textOverflow = "Ellipsis"
        DivObservacao.style.maxHeight = "18px"
        DivObservacao.title = TxtObservacao;
        DivObservacao.style.whiteSpace = "nowrap"
        tdObservacao.appendChild(DivObservacao);
        tdObservacao.dataset.valor = TxtObservacao
        tr.appendChild(tdObservacao);

        
        var tdResponsavel = document.createElement('TD');
        if (Primarios[i].tb_itr_responsavel_id) {
            var Responsavel = RetornaPerson(Primarios[i].tb_itr_responsavel_id);

            tdResponsavel.appendChild(document.createTextNode(Responsavel.tb_per_initials));
            tdResponsavel.title = Responsavel.tb_per_name;
        }
        else
        {
            tdResponsavel.appendChild(document.createTextNode(''));
        }
        tdResponsavel.style.width = "75px"
        tr.appendChild(tdResponsavel);

        var tdDataAtendido = document.createElement('TD');
        if (Primarios[i].tb_itr_data_atendido)
        {
            var Data = new Date(Date.parse(Primarios[i].tb_itr_data_atendido));
            var DataFormatada = ("0" + (Data.getDate() + 1)).slice(-2) + '/' + ("0" + (Data.getMonth() + 1)).slice(-2) + "/" + Data.getFullYear()
            tdDataAtendido.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataAtendido.appendChild(document.createTextNode(''));
        }
        tdDataAtendido.width = "120px"
        tr.appendChild(tdDataAtendido);

        

    }

    DivTabela.appendChild(table);
    

    $('#TabelaPrimariosSistemaT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });


}
function RetornaPerson(IDPerson) {
    for (var i = 0; i < Person.length; i++) {
        if (Person[i].tb_per_id == IDPerson) {
            return Person[i];
        }
    }
}
function CancelarEnvioReport3D()
{
    $("#ModalConfirmarSubstituirReport3D").modal('hide')
    $("#ModalReportsSistema").modal('show')
    
}
async function SubstituirReport3DConfirmado()
{
    $("#ModalConfirmarSubstituirReport3D").modal('hide')
    $("#ModalReportsSistema").modal('show')
    await EnviarArquivoReport3DConfirmado();

}
async function EnviarArquivoReport3DConfirmado()
{
    const input = document.getElementById("ArquivoUploadInput")
    var IDSistema = document.getElementById("BotaoEnviarReport").dataset.idsys;
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
    fd.append("IDSistema", IDSistema)
    fd.append("TaskID", TaskID)
    $.ajax({
        url: "/app/flexibilidade/CadastrarArquivoReport3D/", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json) {
            OS = $("#OS").html();
            SistemasOS = await GetSistemasOS(OS);
            AtualizarDisponibilidadeModelo3D(IDSistema);
            progressBox.innerHTML = ""
            input.value = ""
            await CarregarTabelaArquivos(IDSistema)
            var Sist = RetornaSistemaPorId(IDSistema)
            await MostrarDadosVinculoPDMS(Sist);
            await CarregarTabelaPrimarios();
            await AtualizarStatusImportacaoSistema();
        },
        xhr: function () {
            const xhr = new window.XMLHttpRequest();
            xhr.upload.addEventListener('progress', e => {
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
        error: function (xhr, errmsg, err) {

        },
        cache: false,
        contentType: false,
        processData: false
    });
}
async function MostrarModalReportsSistema(IDSistema)
{
    $("#ErrosAgendarImportacao").html("");
    InfoImportsOS = await GetInfoImports(OS);
    InfoImportsAgenda = await GetInfoImportsAgenda();
    var DivTabela = document.getElementById("ModalReportsSistemaTabela");
    DivTabela.innerHTML = "";
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    $("#reports-tab").tab("show");
    AtualizarDisponibilidadeModelo3D(IDSistema);
    document.getElementById("BotaoEnviarReport").dataset.idsys = IDSistema;
    $("#TituloModalReportSistema").html(`Reports do Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)
    document.getElementById("TituloModalReportSistema").dataset.idsys = IDSistema;
    $("#ModalReportsSistema").modal('show')
    AtualizarStatusImportacaoSistema();
    await CarregarTabelaArquivos(IDSistema);
    await CarregarTabelaPrimarios();

}
$('#SelectTipoArquivo').change(function () {
    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    $('#ArquivoUploadInput').val("")
    if ($("#SelectTipoArquivo option:selected").text() == "Arquivo Normal de Report")
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
async function AtualizarDisponibilidadeModelo3D(IDSistema)
{
    var TodosInfoImports = await RetornaTodosInfoImports()
    var Sistema;
    var BotaoMostrar3D = document.getElementById("BotaoAcessarReport3D")
    var InputDisponibilidade = document.getElementById("StatusReport3D")
    var InputDisponibilidadeModalSistema = document.getElementById("StatusReport3DSist")
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    if (Sistema.tb_sf_id_inim)
    {
        await MostrarDadosVinculoPDMS(Sistema);
        BotaoMostrar3D.disabled = false;
        InputDisponibilidade.value = "Disponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DNAO")
        InputDisponibilidade.classList.add("InputDisponibilidade3DSIM")
        InputDisponibilidadeModalSistema.value = "Disponível"
        InputDisponibilidadeModalSistema.classList.remove("InputDisponibilidade3DNAO")
        InputDisponibilidadeModalSistema.classList.add("InputDisponibilidade3DSIM")


        for (var i = 0; i < TodosInfoImports.length; i++)
        {
            if (TodosInfoImports[i].id == Sistema.tb_sf_id_inim)
            {
                var Link = `/app/flexibilidade/DetalhesSistema/${TodosInfoImports[i].os}/${TodosInfoImports[i].sistema}/${TodosInfoImports[i].revisão}/`
                document.getElementById("BotaoAcessarReport3D").onclick = function () { window.open(Link, '_blank') }
            }
        }
        //document.getElementById("BotaoAcessarReport3D").onclick = function () { window.open(`/app/flexibilidade/DetalhesSistema/${}`, '_blank') }
        //contem 3d
    }
    else
    {
        $("#VincPDMSLi").hide();
        BotaoMostrar3D.disabled = true;
        InputDisponibilidade.value = "Indisponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DSIM")
        InputDisponibilidade.classList.add("InputDisponibilidade3DNAO")
        InputDisponibilidadeModalSistema.value = "Indisponível"
        InputDisponibilidadeModalSistema.classList.remove("InputDisponibilidade3DSIM")
        InputDisponibilidadeModalSistema.classList.add("InputDisponibilidade3DNAO")
        
        //não contém 3D
    }

}

async function MostrarDadosVinculoPDMS(Sistema)
{
    $("#VincPDMSLi").show();
    var Casos = await GetCasoCarga(Sistema.tb_sf_id_inim);
    var InfoImport;
    InfoImportsOS = await GetInfoImports(OS);
    for (var i = 0; i < InfoImportsOS.length; i++)
    {
        if (InfoImportsOS[i].id == Sistema.tb_sf_id_inim)
        {
            InfoImport = InfoImportsOS[i];
            break;
        }
    }
    $("#inputGroupCasoOpe").empty();
    for (var i = 0; i < Casos.length; i++) {
        var o = new Option(Casos[i].Caso.case, Casos[i].Caso);
        $(o).html(Casos[i].Caso);
        $("#inputGroupCasoOpe").append(o);
        if (InfoImport.CasoOperacaoSelecionado == Casos[i].Caso)
        {
            $("#inputGroupCasoOpe").val(Casos[i].Caso);
        }
    }
    $("#NohCII").val(InfoImport.NodeReferenciaDeslocamento)
    $("#CoordXNavis").val(InfoImport.ReferenciaDeslocamentoX)
    $("#CoordYNavis").val(InfoImport.ReferenciaDeslocamentoY)
    $("#CoordZNavis").val(InfoImport.ReferenciaDeslocamentoZ)



}
async function CarregarTabelaArquivos(IDSistema) {
    
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    var StatusSistema = RetornaStatusSistema(IDSistema);
    var Arquivos = await GetArquivosSistema(IDSistema);
    if (Arquivos.length == 0) {
        Arquivos.push({ "tb_frf_desc": "Sem arquivos cadastrados!" });
    }
    var DivTabela = document.getElementById("ModalReportsSistemaTabela");
    DivTabela.innerHTML = "";
    var LarguraDados = 75;
    var LarguraData = 120;
    var LarguraResponsavel = 120;
    var fieldTitles = ["Descrição", "Responsável", "Data", "Extensão", "Download"];
    if (!StatusSistema.includes("F3") && !StatusSistema.includes("F4") && !(Sistema.tb_sf_rev == 0 && RetornaQtdSistemasMesmoNome(Sistema) > 1) && await CheckOSReadOnly() == false)
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

    fieldTitles.forEach((fieldTitle) => {
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
    for (var i = 0; i < Arquivos.length; i++) {
        var tr = document.createElement('TR');
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
        tr.style.fontSize = "80%";
        tableBody.appendChild(tr);

        tr.onmouseover = function() {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function() {
            this.style.backgroundColor = 'white';
        };



        var tdDesc = document.createElement('TD');
        var TxtDesc = "";
        if (Arquivos[i].tb_frf_desc)
            TxtDesc = Arquivos[i].tb_frf_desc;
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
        if (Arquivos[i].tb_frf_pers) {
            tdResp.appendChild(document.createTextNode(RetornaInicialUser(Arquivos[i].tb_frf_pers)));
        }

        else {
            tdResp.appendChild(document.createTextNode(''));
        }
        tdResp.width = LarguraResponsavel + "px";
        tr.appendChild(tdResp);

        var TdData = document.createElement('TD');
        var TxtData = "";
        if (Arquivos[i].tb_frf_dt_up) {
            var Data = new Date(Arquivos[i].tb_frf_dt_up);
            TxtData = Data.toLocaleDateString() + " " + Data.toLocaleTimeString();
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
        if (Arquivos[i].tb_frf_file)
        {
            var Extensao = Arquivos[i].tb_frf_file.split('.').pop().toUpperCase();
            TdExt.appendChild(document.createTextNode(Extensao));
        }

        else {
            TdExt.appendChild(document.createTextNode(''));
        }
        TdExt.width = LarguraDados + "px";
        tr.appendChild(TdExt);


        if (Arquivos[i].tb_frf_file)
        {
            var tdDownload = document.createElement('TD');
            var txtDownload = `<a href="/app/flexibilidade/DownloadArquivoReport/${Arquivos[i].tb_frf_id}/" download target="_blank" style="margin-top: 1px">Download</a>`
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
        if (!StatusSistema.includes("F3") && !StatusSistema.includes("F4") && !(Sistema.tb_sf_rev == 0 && RetornaQtdSistemasMesmoNome(Sistema) > 1) && await CheckOSReadOnly() == false)
        {
            if (Arquivos[i].tb_frf_file)
            {
                var tdExcluir = document.createElement('TD');
                var TxtExcluir = `<button type="button" onclick="ExcluirArquivo(${Arquivos[i].tb_frf_id}, ${IDSistema})" class="btn btn-danger btn-block btnHist">Excluir</button>`
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
function ExcluirArquivo(IDArquivo, IDSistema)
{
    document.getElementById("BotaoSimExcluirArquivo").dataset.idarquivo = IDArquivo
    document.getElementById("BotaoSimExcluirArquivo").dataset.idsistema = IDSistema
    $("#ModalReportsSistema").modal('hide')
    $("#ModalConfirmarExcluirArquivo").modal('show')
    
}
function CancelarExclusao()
{
    $("#ModalConfirmarExcluirArquivo").modal('hide')
    $("#ModalReportsSistema").modal('show')

}
function ExcluirArquivoConfirmado(elemento)
{
    var IDArquivo = document.getElementById("BotaoSimExcluirArquivo").dataset.idarquivo
    var IDSistema = document.getElementById("BotaoSimExcluirArquivo").dataset.idsistema
    $("#loaderExcluir").show();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url: "/app/flexibilidade/ExcluirArquivoReport/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDArquivo": IDArquivo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            CarregarTabelaArquivos(IDSistema);
            $("#ModalConfirmarExcluirArquivo").modal('hide')
            $("#ModalReportsSistema").modal('show')
            $("#loaderExcluir").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function RetornaCorStatus(StringStatus)
{
    if (StringStatus == StatusF0.tb_st_work_status || StringStatus == TextoCurtoF0)
    {
        return CorF0;
    }
    if (StringStatus == StatusF1.tb_st_work_status || StringStatus == TextoCurtoF1)
    {
        return CorF1
    }
    if (StringStatus == StatusF1R.tb_st_work_status)
    {
        return CorF1R
    }
    if (StringStatus == StatusF2.tb_st_work_status)
    {
        return CorF2
    }
    if (StringStatus == StatusF3.tb_st_work_status)
    {
        return CorF3
    }
    if (StringStatus == StatusF4.tb_st_work_status || StringStatus == TextoCurtoF4)
    {
        return CorF4
    }

}
function DefinirStatus()
{
    for(var i = 0; i < Statuses.length; i++)
    {
        if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Aguardando Tubulação (F0)")
        {
            StatusF0 = Statuses[i];
        }
        else if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Liberado para cálculo (F1)")
        {
            StatusF1 = Statuses[i];
        }
        else if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Para revisão (F1.1)")
        {
            StatusF1R = Statuses[i];
        }
        else if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Em análise (F2)")
        {
            StatusF2 = Statuses[i];
        }
        else if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Calculado (F3)")
        {
            StatusF3 = Statuses[i];
        }
         else if(Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status=="Tubulação ajustada (F4)")
        {
            StatusF4 = Statuses[i];
        }
    }
}
function RetornaHorasSistema(Sistema) {
    var Horas = 0;
    for (var i = 0; i < HourPersonFlex.length; i++) {
        if (HourPersonFlex[i].tb_hpf_id_sf == Sistema.tb_sf_id) {
            Horas += HourPersonFlex[i].tb_hpf_hour
        }
    }
    return Horas;
}
function RetornaHorasSistemaID(IDSistema) {
    var Horas = 0;
    for (var i = 0; i < HourPersonFlex.length; i++)
    {
        if (HourPersonFlex[i].tb_hpf_id_sf == IDSistema)
        {
            Horas += HourPersonFlex[i].tb_hpf_hour
        }
    }
    return Horas;
}
function RetornaHorasSistemaPorUsuario(IDSistema, Usuario) {
    var Horas = 0;
    for (var i = 0; i < HourPersonFlex.length; i++)
    {
        if (HourPersonFlex[i].tb_hpf_id_sf == IDSistema && HourPersonFlex[i].tb_hpf_id_per == Usuario.tb_per_id)
        {
            Horas += HourPersonFlex[i].tb_hpf_hour
        }
    }
    Horas = Math.round(Horas*100) / 100;
    return Horas;
}
function ModalEditarHoras()
{
    var idSistema = $("#BotaoSalvarHoras")[0].dataset.idsys
    PreencheUsuarioAtual()

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
    for (var i = 0; i < HourPersonFlex.length; i++){
        if (HourPersonFlex[i].tb_hpf_id_per == UsuarioAtual.tb_per_id && HourPersonFlex[i].tb_hpf_id_sf == idSistema){

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
            if (HourPersonFlex[i].tb_hpf_dt_insert)
            {
                var Data = new Date(HourPersonFlex[i].tb_hpf_dt_insert)
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
            if (HourPersonFlex[i].tb_hpf_hour)
            {
                TxtHora = HourPersonFlex[i].tb_hpf_hour
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
    $("#ErrosHorasEditadas").html("")
    var idSistema = $("#BotaoSalvarHoras")[0].dataset.idsys
    PreencheUsuarioAtual()

    var horas = []
    var ids = []
    var count = 0
    for(var i = 0; i < HourPersonFlex.length; i++){
        if (HourPersonFlex[i].tb_hpf_id_per == UsuarioAtual.tb_per_id && HourPersonFlex[i].tb_hpf_id_sf == idSistema){
            hora = $("#hora" + count).text().replace(',','.')

            if (isNaN(hora) || hora <= 0)
            {
                $("#ErrosHorasEditadas").html(`<div class="alert alert-danger" role="alert">Erro de Validação: O valor da hora precisa ser um <strong>número e maior que zero</strong></div>`)
                return
            }
            horas.push(hora)
            ids.push(HourPersonFlex[i].tb_hpf_id)
            count++
        }
    }
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $("#loaderEditarHoras").modal("show")
    $.ajax({
        url: "/app/flexibilidade/EditarHoras/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "IDSistema": idSistema, 'dados': JSON.stringify({"Horas": horas, "Ids": ids}), 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            $("#loaderEditarHoras").modal("hide")
            $("#ModalEditarHoras").modal('hide')
            var QtdHorasSistema = RetornaHorasSistemaID(idSistema)
            var QtdLinhasCalculadasSistema = RetornaQtdLinhasCalculadasSistema(idSistema)
            var HorasLinhaSistema = Math.round(QtdHorasSistema * 100 / QtdLinhasCalculadasSistema) / 100;
            var HorasUsuario = RetornaHorasSistemaPorUsuario(idSistema, UsuarioAtual)
            $("#HorasAdicionarUsuario").val("")
            $("#HorasPorLinhaCalculadaSistema").val(HorasLinhaSistema)
            $("#TotalHorasUsuario").val(HorasUsuario)
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });

}
async function GetIdentificadoresAtividadesFlex()
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/IdentificadorAtividadeFlex/",
        method: "GET",
        data: {}
    });

    return request;
}
async function GetAtividadesFlex()
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadesFlex/",
        method: "GET",
        data: { "os": OS }
    });

    return request;
}
function RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4) {
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    for (var i = 0; i < SystemFlexTime.length; i++) {
        if (SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id) {
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
            if ((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null) {
                break;
            }

        }

    }
    return [F1, F1R, F2, F3, F4]

}
function RetornaInicialUser(ID) {
    for (var i = 0; i < Person.length; i++) {
        if (Person[i].tb_per_id == ID) {
            return Person[i].tb_per_initials
        }

    }
}
function RetornaInicialUserTodas(ID) {
    for (var i = 0; i < PersonTodas.length; i++) {
        if (PersonTodas[i].tb_per_id == ID) {
            return PersonTodas[i].tb_per_initials
        }

    }
}
function RetornaDadosWorkSystem(Sistema) {
    for (var i = 0; i < WorkSystemFlex.length; i++) {
        if (WorkSystemFlex[i].tb_wsf_id_sf == Sistema.tb_sf_id) {
            return WorkSystemFlex[i];
        }
    }

}
async function GetCasoCarga(IDInim) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/CasoDeCargaInim/",
        method: "GET",
        data: { IDInim: IDInim }
    });

    return request;
}
async function GetPersons(){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaPerson/",
      method: "GET",
      data: {  }
    });

   return request;

}
async function GetPersonsTodas() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaPersonTodas/",
        method: "GET",
        data: {}
    });

    return request;

}
async function GetHourPersonFlexOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaHourPersonFlexOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;
}
async function GetUsuariosAdminOS(OrdemSer) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/P2RetornaFlexUserOSIDOS/",
        method: "GET",
        data: { 'OS': OrdemSer }
    });

    return request;

}
async function GetLinhasOS(OrdemSer){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaLinhasOS/",
      method: "GET",
      data: { 'OS': OrdemSer }
    });

   return request;

}
async function GetSistemasOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaSistemasOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;
}
async function GetStatuses(){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaStatus/",
      method: "GET",
      data: {  }
    });

   return request;

}
async function GetSystemFlexTimeOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaSystemFlexTimeOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;
}
async function GetPipeHistoryOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaHistoricosOS/",
        method: "GET",
        data: { OS: OS }
    });

    return request;
}
async function GetWorkSystemFlexOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaWorkSystemFlexOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;
}
async function GetPendencyFlexLogsOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/PendencyFlexLogsOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
}
async function GetInfoImports(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/PesquisarSistemas/InfoImportsViewSetPorOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
}
async function GetInfoImportsAgenda() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/PesquisarSistemas/InfoImportsAgenda/",
        method: "GET",
        data: { }
    });

    return request;
}
async function GetPrimariosTabela(IDSistema) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/PesquisarSistemas/TbItensTabelaRelatorio/",
        method: "GET",
        data: { "IDSistema": IDSistema}
    });

    return request;
}
async function GetPendencyFlexOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/PendencyFlexOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
}
async function RetornaTodosInfoImports() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/TodosInfoImports/",
        method: "GET",
        data: {  }
    });

    return request;
}
async function RetornaStatusPendencyFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/StatusPendencyFlex/",
        method: "GET",
        data: {}
    });

    return request;
}
async function GetUsuariosFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaUsuariosFlex/",
        method: "GET",
        data: { }
    });

    return request;
}
async function GetUsuariosRequisicao() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaUsuariosRequisicao/",
        method: "GET",
        data: {}
    });

    return request;
}

async function GetArquivosSistema(IDSistema) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaArquivosReportSistema/",
        method: "GET",
        data: { IDSIS:IDSistema }
    });

    return request;
}
$('#ArquivoUploadInput').change(
    function (e) {
        $('#id_NomeDoArquivo').val(e.target.files[0].name);
        $('#id_NomeDoArquivolbl').html(e.target.files[0].name);
    });

$('#ArquivoUploadInputExcelPrimarios').change(
    function (e) {
        $('#id_NomeDoArquivolblExcelPrimarios').html(e.target.files[0].name);
        $('#id_NomeDoArquivoExcelPrimarios').val(e.target.files[0].name);
    });
function makeid(length) {
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
function processResult(resultElement, result) {
    document.getElementById('progress-bar-message').innerHTML = (
        "Processo Concluído!"
    );
    $("#ProgressCelery").hide()
    //window.location.replace('/app/flexibilidade/DetalhesSistema/'+OS+'/'+Sistema+"/"+Rev);
}
async function GetArquivosVinculos(IDSistema)
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/ArquivosAtividadeFlexPorSistema/",
        method: "GET",
        data: { IDSistema: IDSistema }
    });

    return request;
}
function customProgress(progressBarElement, progressBarMessageElement, progress) {
    progressBarElement.innerHTML = progress.percent + '%';
    progressBarMessageElement.innerHTML = (
        progress.description
    );
    progressBarElement.style.width = progress.percent + "%";
}
$(function () {


    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '')
        {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++)
            {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '='))
                {
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
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url))
            {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
