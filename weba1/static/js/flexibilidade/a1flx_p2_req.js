var LinhasRevisar = []
var IDSys;
var SisFlex;
var RevA;
var IDAtual;

var OS = "";
var LinhasOS = []
var AreasSelecionadas = []
var Statuses = []
var SistemasOS = []
var WorkSystemFlex = []
var SystemFlexTime = []
var HourPersonFlex = []
var Person = []
var PersonTodas = []
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
var RemarkAntigo = "";
var PipeRemarkAtual;
var UsuariosFlex;
var NomesRetrabalho = ['NÃO', 'SIM - TUB', 'SIM - CLIENTE', 'SIM - FLEX']
var UsuarioAtual;
var StatusPendFlex;
var PendencyFlexLogsOS;
var PendencyFlexOS;
var ctrl;
var UsuariosRequisicao;
window.onload = async function () {
    ctrl = $("#ctrl").html()
    if (ctrl > 2)
    {
        $("#flex-tab").hide();
    }
    else
    {
        $('#flex-tab').tab('show')
    }
    OS = $("#OS").html();
    if (await CheckOSReadOnly() == true)
    {
        $("#tituloos").html(`<b>${OS}</b> - Somente Leitura`)
    }
    UsuariosFlex = await GetUsuariosFlex();
    UsuariosRequisicao = await GetUsuariosRequisicao();
    Statuses = await GetStatuses();
    Person = await GetPersons();
    PersonTodas = await GetPersonsTodas();
    StatusPendFlex = await RetornaStatusPendencyFlex();
    DefinirStatus();
    PreencheUsuarioAtual();
    await CarregarPagina();
};
function PreencheUsuarioAtual() {
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id_ldap == $("#usuarioatual").html())
        {
            UsuarioAtual = Person[i];
            break;
        }

    }
}
async function CarregarPagina() {
    //$("#LinhaLinhas").hide();
    //$("#LinhaSistemas").hide();
    $("#newRequisicao").hide();
    $("#loader").show();
    LinhasOS = await GetLinhasOS(OS);
    SistemasOS = await GetSistemasOS(OS);
    SystemFlexTime = await GetSystemFlexTimeOS(OS);
    WorkSystemFlex = await GetWorkSystemFlexOS(OS);
    //HourPersonFlex = await GetHourPersonFlexOS(OS);
    //PipeHistoryOS = await GetPipeHistoryOS(OS);
    PendencyFlexLogsOS = await GetPendencyFlexLogsOS(OS);
    PendencyFlexOS = await GetPendencyFlexOS(OS);
    CriarTabelaSistemas();
    //InicializarBotoesTabelaSistemas();
    //CriarListaLinhasCtrl(LinhasOS)
    //$("#LinhaLinhas").show();
    //$("#LinhaSistemas").show();
    $("#loader").hide();
    $("#newRequisicao").show()
}
function RetornaQtdLinhasSistema(IDSistema)
{
    var Qtd = 0;
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id_sf == IDSistema)
        {
            Qtd++;
        }
    }
    return Qtd;
}
function RetornaAreaSistema(IDSistema)
{
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id_sf == IDSistema)
        {
            return LinhasOS[i].tb_pf_area
        }
    }
}


async function CriarTabelaSistemas()
{
    var DivTabela = document.getElementById("TabelaSistemasTub");
    DivTabela.innerHTML = "";

    var LarguraSistema = 100;
    var LarguraArea = 200;
    var LarguraRev = 100;
    var LarguraHistorico = 100;
    var LarguraAcoes = 100;
    var fieldTitles = ["Sistema", "Rev", "Qtd Linhas", "Área", "Status Flex", "Status Requisição", "Histórico", "Ações"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "TabelaSistemasTubT";
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "height: 60vh;");
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
        if (fieldTitle == "Sistema")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Qtd Linhas")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Área")
            th.style.width = LarguraArea + "px"
        if (fieldTitle == "Rev")
            th.style.width = LarguraRev + "px"
        if (fieldTitle == "Histórico")
            th.style.width = LarguraHistorico + "px"
        if (fieldTitle == "Ações")
            th.style.width = LarguraAcoes + "px"
    });

    var SistemasFiltrados = []
    for (var i = 0; i < SistemasOS.length; i++)
    {
        var QtdLinhas = RetornaQtdLinhasSistema(SistemasOS[i].tb_sf_id)
        var StatusSistema = RetornaStatusSistema(SistemasOS[i].tb_sf_id)
        var StatusRequisicao = RetornaAprovacaoPendencyFlexSistema(SistemasOS[i].tb_sf_id)
        var AreaSistema = RetornaAreaSistema(SistemasOS[i].tb_sf_id)
        var Achou = false;
        for (var j = 0; j < SistemasFiltrados.length; j++)
        {
            if (SistemasFiltrados[j].Sistema == SistemasOS[i].tb_sf_name && SistemasFiltrados[j].Rev < SistemasOS[i].tb_sf_rev)
            {
                Achou = true;
                SistemasFiltrados[j].ID = SistemasOS[i].tb_sf_id;
                SistemasFiltrados[j].Rev = SistemasOS[i].tb_sf_rev;
                SistemasFiltrados[j].QtdLinhas = QtdLinhas;
                SistemasFiltrados[j].Area = AreaSistema;
                SistemasFiltrados[j].StatusFlex = StatusSistema;
                SistemasFiltrados[j].StatusRequisicao = StatusRequisicao;
                break;
            }
        }
        if (Achou == false)
        {
            SistemasFiltrados.push({ "ID": SistemasOS[i].tb_sf_id, "Sistema": SistemasOS[i].tb_sf_name, "Rev": SistemasOS[i].tb_sf_rev, "QtdLinhas": QtdLinhas, "Area":AreaSistema, "StatusFlex": StatusSistema, "StatusRequisicao": StatusRequisicao })
        }
    }
    thead.appendChild(thr)
    table.appendChild(thead)
    var tableBody = document.createElement('TBODY')
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody)
    var OSReadOnly = await CheckOSReadOnly()
    for (var i = 0; i < SistemasFiltrados.length; i++)
    {
        if(SistemasFiltrados[i].Rev > 0 && (SistemasFiltrados[i].StatusRequisicao == "Aguardando Aprovação da Flexibilidade" || SistemasFiltrados[i].StatusRequisicao == "Requisição REPROVADA pela Flexibilidade"))
        {   
            // Se é revisão com pendência vai ser mostrado a revisão anterior com status "F4" (Mesmo status da versão anterior). Apenas visual
            SistemasFiltrados[i].Rev -= 1
            SistemasFiltrados[i].StatusFlex = StatusF4.tb_st_work_status
        }
        if(!SistemasFiltrados[i].Sistema.toLowerCase().includes("cancelado")) // Se é um sistema cancelado não aparece na requisição
        {
            var tr = document.createElement('TR');
            tr.style.display = "table"
            tr.style.tableLayout = "fixed"
            tr.style.fontSize = "80%"
            if (!SistemasFiltrados[i].QtdLinhas) tr.style.textDecoration = "line-through"
            tableBody.appendChild(tr);

            tr.onmouseover = function () {
                this.style.backgroundColor = "#FF9A0080"
            }

            tr.onmouseleave = function () {
                this.style.backgroundColor = 'white'
            }

            var tdSistema = document.createElement('TD')
            if (SistemasFiltrados[i].Sistema)
            {
                tdSistema.appendChild(document.createTextNode(SistemasFiltrados[i].Sistema))
            }
            else
            {
                tdSistema.appendChild(document.createTextNode(''))
                tdSistema.dataset.valor = ''
            }
            tdSistema.style.width = LarguraSistema + "px"
            tr.appendChild(tdSistema);

            var tdRev = document.createElement('TD')
            if (SistemasFiltrados[i].Rev)
            {
                tdRev.appendChild(document.createTextNode(SistemasFiltrados[i].Rev))
            }
            else
            {
                tdRev.appendChild(document.createTextNode('0'))
            }
            tdRev.style.width = LarguraRev + "px"
            tr.appendChild(tdRev);

            var tdQtdLin = document.createElement('TD')
            if (SistemasFiltrados[i].QtdLinhas)
            {
                tdQtdLin.appendChild(document.createTextNode(SistemasFiltrados[i].QtdLinhas))
            }
            else
            {
                tdQtdLin.appendChild(document.createTextNode(''))
            }
            tdQtdLin.style.width = LarguraSistema + "px"
            tr.appendChild(tdQtdLin)

            var tdArea = document.createElement('TD')
            if (SistemasFiltrados[i].Area)
            {
                tdArea.appendChild(document.createTextNode(SistemasFiltrados[i].Area))
            }
            else
            {
                tdArea.appendChild(document.createTextNode(''))
            }
            tdArea.style.width = LarguraArea + "px"
            tr.appendChild(tdArea);

            var tdStatusFlex = document.createElement('TD')
            if (SistemasFiltrados[i].StatusFlex)
            {
                tdStatusFlex.appendChild(document.createTextNode(SistemasFiltrados[i].StatusFlex))
            }
            else
            {
                tdStatusFlex.appendChild(document.createTextNode(''))
            }
            tdStatusFlex.style.backgroundColor = RetornaCorStatus(SistemasFiltrados[i].StatusFlex)
            tr.appendChild(tdStatusFlex)
            var tdStatusReq = document.createElement('TD')
            if (SistemasFiltrados[i].StatusRequisicao)
            {
                tdStatusReq.appendChild(document.createTextNode(SistemasFiltrados[i].StatusRequisicao))
            }
            else
            {
                tdStatusReq.appendChild(document.createTextNode(''))
            }
            tr.appendChild(tdStatusReq);

            var tdHistorico = document.createElement('TD')
            if (SistemasFiltrados[i].QtdLinhas){
                var TxtHistorico = `<button type="button" onclick="MostrarModalHistorico(${SistemasFiltrados[i].ID})" class="btn btn-warning btn-block btnAcoes">Histórico</button>`
            }
            else{
                var TxtHistorico = `<button type="button" onclick="MostrarModalHistorico(${SistemasFiltrados[i].ID}, true)" class="btn btn-warning btn-block btnAcoes">Histórico</button>`
            }
            if (OSReadOnly == true)
            {
                TxtHistorico = `<button disabled type="button" onclick="MostrarModalHistorico(${SistemasFiltrados[i].ID})" class="btn btn-warning btn-block btnAcoes">Histórico</button>`
            }
            var DivHistorico = document.createElement("div")
            DivHistorico.innerHTML = TxtHistorico
            DivHistorico.style.overflow = "hidden"
            DivHistorico.style.maxHeight = "18px"
            DivHistorico.title = "Acessar histórico de requisições e status do sistema"
            DivHistorico.style.whiteSpace = "nowrap"
            tdHistorico.appendChild(DivHistorico)
            tdHistorico.style.width = LarguraHistorico + "px"
            tr.appendChild(tdHistorico)

            var tdAcoes = document.createElement('TD')
            if (SistemasFiltrados[i].QtdLinhas){
                var TxtAcoes = `<button type="button" onclick="MostrarModalAcoes(${SistemasFiltrados[i].ID})" class="btn btn-primary btn-block btnAcoes">Ações</button>`
            }
            else{
                var TxtAcoes = `<button type="button" onclick="MostrarModalAcoes(${SistemasFiltrados[i].ID}, true)" class="btn btn-primary btn-block btnAcoes">Ações</button>`
            }
            if (OSReadOnly == true)
            {
                TxtAcoes = `<button disabled type="button" onclick="MostrarModalAcoes(${SistemasFiltrados[i].ID})" class="btn btn-primary btn-block btnAcoes">Ações</button>`
            }
            var DivAcoes = document.createElement("div")
            DivAcoes.innerHTML = TxtAcoes
            DivAcoes.style.overflow = "hidden"
            DivAcoes.style.maxHeight = "18px"
            DivAcoes.title = "Acessar ações disponíveis para o sistema"
            DivAcoes.style.whiteSpace = "nowrap"
            tdAcoes.appendChild(DivAcoes)
            tdAcoes.style.width = LarguraAcoes + "px"
            tr.appendChild(tdAcoes)
        }
    }

    DivTabela.appendChild(table);

    $('#TabelaSistemasTubT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } })

    if (ctrl < 3)
    {
       await CriarTabelaSistemasFlex()
    }
    await CriarOpcoes()

}
async function CheckOSReadOnly() {
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
async function CriarTabelaSistemasFlex()
{
    var DivTabela = document.getElementById("TabelaSistemasFlex");
    DivTabela.innerHTML = "";

    var LarguraSistema = 100;
    var LarguraArea = 200;
    var LarguraRev = 100;
    var LarguraAcoes = 100;
    var fieldTitles = ["Sistema", "Rev", "Qtd Linhas", "Área", "Status Flex", "Status Requisição", "Ações"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "TabelaSistemasFlexT";
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "height: 60vh;");
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
        if (fieldTitle == "Sistema")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Qtd Linhas")
            th.style.width = LarguraSistema + "px"
        if (fieldTitle == "Área")
            th.style.width = LarguraArea + "px"
        if (fieldTitle == "Rev")
            th.style.width = LarguraRev + "px"
        if (fieldTitle == "Ações")
            th.style.width = LarguraAcoes + "px"
    });

    var SistemasFiltrados = []
    for (var i = 0; i < SistemasOS.length; i++)
    {
        var QtdLinhas = RetornaQtdLinhasSistema(SistemasOS[i].tb_sf_id)
        var StatusSistema = RetornaStatusSistema(SistemasOS[i].tb_sf_id)
        var StatusRequisicao = RetornaAprovacaoPendencyFlexSistema(SistemasOS[i].tb_sf_id);
        var AreaSistema = RetornaAreaSistema(SistemasOS[i].tb_sf_id)
        if (StatusRequisicao == "Aguardando Aprovação da Flexibilidade")
        {
            var Achou = false;
            for (var j = 0; j < SistemasFiltrados.length; j++)
            {
                if (SistemasFiltrados[j].Sistema == SistemasOS[i].tb_sf_name && SistemasFiltrados[j].Rev < SistemasOS[i].tb_sf_rev)
                {
                    Achou = true;
                    SistemasFiltrados[j].ID = SistemasOS[i].tb_sf_id;
                    SistemasFiltrados[j].Rev = SistemasOS[i].tb_sf_rev;
                    SistemasFiltrados[j].QtdLinhas = QtdLinhas;
                    SistemasFiltrados[j].Area = AreaSistema;
                    SistemasFiltrados[j].StatusFlex = StatusSistema;
                    SistemasFiltrados[j].StatusRequisicao = StatusRequisicao;
                    break;
                }
            }
            if (Achou == false)
            {
                SistemasFiltrados.push({ "ID": SistemasOS[i].tb_sf_id, "Sistema": SistemasOS[i].tb_sf_name, "Rev": SistemasOS[i].tb_sf_rev, "QtdLinhas": QtdLinhas, "Area":AreaSistema, "StatusFlex": StatusSistema, "StatusRequisicao": StatusRequisicao })
            }
        }
    }
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    var OSReadOnly = await CheckOSReadOnly();
    for (var i = 0; i < SistemasFiltrados.length; i++)
    {
        if(SistemasFiltrados[i].Rev > 0 && (SistemasFiltrados[i].StatusRequisicao == "Aguardando Aprovação da Flexibilidade" || SistemasFiltrados[i].StatusRequisicao == "Requisição REPROVADA pela Flexibilidade"))
        {   
            // Se é revisão com pendência vai ser mostrado a revisão anterior com status "F4" (Mesmo status da versão anterior). Apenas visual
            SistemasFiltrados[i].Rev -= 1
            SistemasFiltrados[i].StatusFlex = StatusF4.tb_st_work_status
        }
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
        if (SistemasFiltrados[i].Sistema)
        {
            tdSistema.appendChild(document.createTextNode(SistemasFiltrados[i].Sistema));
        }
        else
        {
            tdSistema.appendChild(document.createTextNode(''));
            tdSistema.dataset.valor = ''
        }
        tdSistema.style.width = LarguraSistema + "px"
        tr.appendChild(tdSistema);

        var tdRev = document.createElement('TD');
        if (SistemasFiltrados[i].Rev)
        {
            tdRev.appendChild(document.createTextNode(SistemasFiltrados[i].Rev));
        }
        else
        {
            tdRev.appendChild(document.createTextNode('0'));
        }
        tdRev.style.width = LarguraRev + "px"
        tr.appendChild(tdRev);

        var tdQtdLin = document.createElement('TD');
        if (SistemasFiltrados[i].QtdLinhas)
        {
            tdQtdLin.appendChild(document.createTextNode(SistemasFiltrados[i].QtdLinhas));
        }
        else
        {
            tdQtdLin.appendChild(document.createTextNode(''));
        }
        tdQtdLin.style.width = LarguraSistema + "px"
        tr.appendChild(tdQtdLin);

        var tdArea = document.createElement('TD');
            if (SistemasFiltrados[i].Area)
            {
                tdArea.appendChild(document.createTextNode(SistemasFiltrados[i].Area));
            }
            else
            {
                tdArea.appendChild(document.createTextNode(''));
            }
            tdArea.style.width = LarguraArea + "px"
            tr.appendChild(tdArea);

        var tdStatusFlex = document.createElement('TD');
        if (SistemasFiltrados[i].StatusFlex)
        {
            tdStatusFlex.appendChild(document.createTextNode(SistemasFiltrados[i].StatusFlex));
        }
        else
        {
            tdStatusFlex.appendChild(document.createTextNode(''));
        }
        tdStatusFlex.style.backgroundColor = RetornaCorStatus(SistemasFiltrados[i].StatusFlex)
        tr.appendChild(tdStatusFlex);

        var tdStatusReq = document.createElement('TD');
        if (SistemasFiltrados[i].StatusRequisicao)
        {
            tdStatusReq.appendChild(document.createTextNode(SistemasFiltrados[i].StatusRequisicao))
        }
        else
        {
            tdStatusReq.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdStatusReq);

        var tdAcoes = document.createElement('TD');
        var TxtAcoes = `<button type="button" onclick="MostrarModalAceitarRequisicao(${SistemasFiltrados[i].ID})" class="btn btn-primary btn-block btnAcoes">Ações</button>`
        if (OSReadOnly == true)
        {
            TxtAcoes = `<button disabled type="button" onclick="MostrarModalAceitarRequisicao(${SistemasFiltrados[i].ID})" class="btn btn-primary btn-block btnAcoes">Ações</button>`
        }
        var DivAcoes = document.createElement("div")
        DivAcoes.innerHTML = TxtAcoes
        DivAcoes.style.overflow = "hidden"
        DivAcoes.style.maxHeight = "18px"
        DivAcoes.title = "Acessar ações disponíveis para o sistema";
        DivAcoes.style.whiteSpace = "nowrap"
        tdAcoes.appendChild(DivAcoes);
        tdAcoes.style.width = LarguraAcoes + "px"
        tr.appendChild(tdAcoes);
    }
    if (SistemasFiltrados.length == 0)
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
        var TdSemSistemas = document.createElement('TD');
        TdSemSistemas.appendChild(document.createTextNode('Nenhum sistema para aprovação!'));
        TdSemSistemas.style.columnSpan = 6;
        tr.appendChild(TdSemSistemas);
    }
    DivTabela.appendChild(table);

    $('#TabelaSistemasFlexT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
}
async function CriarOpcoes()
{
    // TODO: 
    // [] Lista de pessoas da flex, filtrar só quem está na OS
    
    var Usuarios = await GetUsuariosActiveOS2(OS) // recebe os usuários ativos na OS atual
    var User
    var UsersFlexOS = []
    for (var i = 0; i < Usuarios.length; i++){
        if (UsuarioAtual.tb_per_id == Usuarios[i].tb_flx_uos_user){
            User = Usuarios[i] // User recebe o usuário e os dados associados para tal OS
        }
        for (var j = 0; j < UsuariosFlex.length; j++){
            if (UsuariosFlex[j].tb_per_id == Usuarios[i].tb_flx_uos_user){
                UsersFlexOS.push(UsuariosFlex[j])
            }
        }
    }
    if (ctrl < 3){
        // Verifica se é gestor ou admin
        var DivOpcoes = document.getElementById('Opcoes')
        DivOpcoes.innerHTML = ""
        for (var i = 0; i < 2 + UsersFlexOS.length; i++){
            var CheckBox = document.createElement('div')
            CheckBox.classList.add('custom-control', 'custom-checkbox', 'my-1')
            var inputCheck = document.createElement('input')
            inputCheck.classList.add('custom-control-input')
            inputCheck.setAttribute('type', 'checkbox')
            var labelCheck = document.createElement('label')
            labelCheck.classList.add('custom-control-label')
            if (i == 0){
                texto = 'quando eu <b>aceitar</b> uma requisição'
                inputCheck.id = 'aceitareqflex'
                labelCheck.setAttribute('for', 'aceitareqflex')
                if (User.tb_flx_uos_flex_req_ace == 1){
                    inputCheck.setAttribute('checked', true)
                }
                inputCheck.setAttribute('disabled', true)  // TEMPORÁRIO
                CheckBox.title = 'Em breve será liberado' // TEMPORÁRIO
                }
                else{
                    if (i == 1){
                        texto = 'quando eu <b>rejeitar</b> uma requisição<hr>'
                        inputCheck.id = 'rejeitareqflex'
                        labelCheck.setAttribute('for', 'rejeitareqflex')
                        if (User.tb_flx_uos_flex_req_rej == 1){
                            inputCheck.setAttribute('checked', true)
                        }
                        inputCheck.setAttribute('disabled', true)  // TEMPORÁRIO
                        CheckBox.title = 'Em breve será liberado' // TEMPORÁRIO
                    }
                    else{
                        if (User.tb_flx_uos_admin == 1){ // Se o usuário logado for admin do sistema flex ele pode escolher quem recebe e-mail a cada nova requisição
                            nome = UsersFlexOS[i-2].tb_per_name.split(' ')
                            texto = '<b>' + nome[0] + ' ' + nome[nome.length -1] + '</b>'
                            inputCheck.id = 'email-nova-req-' + UsersFlexOS[i-2].tb_per_initials
                            labelCheck.setAttribute('for', 'email-nova-req-' + UsersFlexOS[i-2].tb_per_initials)
                            for (var j = 0; j < Usuarios.length; j++){
                            if (UsersFlexOS[i-2].tb_per_id == Usuarios[j].tb_flx_uos_user){
                                if (Usuarios[j].tb_flx_uos_flex_req_email == 1){
                                    inputCheck.setAttribute('checked', true)
                                }
                                inputCheck.dataset.iduos = Usuarios[j].tb_flx_uos_id
                            }
                            }
                        }
                        else{
                            texto = 'a cada <b>nova requisição</b>'
                            inputCheck.id = 'email-nova-req-' + UsersFlexOS[i-2].tb_per_initials
                            labelCheck.setAttribute('for', 'email-nova-req-' + UsersFlexOS[i-2].tb_per_initials)
                            if (User.tb_flx_uos_flex_req_email == 1){
                                inputCheck.setAttribute('checked', true)
                            }
                            i = 2 + UsersFlexOS.length // para terminar o loop
                        }
                    }
                }
            labelCheck.innerHTML = 'Receber e-mail ' + texto
            if (User.tb_flx_uos_admin == 1 && i > 1){
                inputCheck.dataset.idusuario = UsersFlexOS[i-2].tb_per_id
                labelCheck.innerHTML = texto + ' receberá e-mail a cada nova requisição'
            }
            else{
                inputCheck.dataset.idusuario = User.tb_flx_uos_user
                inputCheck.dataset.iduos = User.tb_flx_uos_id
            }
            inputCheck.onclick = function () { EmailRequisicao(this); }
            CheckBox.append(inputCheck)
            CheckBox.append(labelCheck)
            DivOpcoes.append(CheckBox)
        }
    }
    else{
        // Se é guest ou operacional
        var DivOpcoes = document.getElementById('Opcoes')
        DivOpcoes.innerHTML = ""
        var areas = []
        for(var i = 0; i < LinhasOS.length; i++){
            // array que recebe todas as áreas do projeto, incluindo a área em branco se existir
            if(!areas.includes(LinhasOS[i].tb_pf_area)){
                areas.push(LinhasOS[i].tb_pf_area)
            }
        }   
        areas.sort(function(a, b) {return (a===null)-(b===null) || +(a>b)||-(a<b)})
        for (var i = 0; i < 2 + areas.length; i++){
            var CheckBox = document.createElement('div')
            CheckBox.classList.add('custom-control', 'custom-checkbox', 'my-1')
            var inputCheck = document.createElement('input')
            inputCheck.classList.add('custom-control-input')
            inputCheck.setAttribute('type', 'checkbox')
            var labelCheck = document.createElement('label')
            labelCheck.classList.add('custom-control-label')
            inputCheck.setAttribute('disabled', true)  // TEMPORÁRIO
            CheckBox.title = 'Em breve será liberado' // TEMPORÁRIO
            if (i == 0){
                texto = 'quando minhas requisições forem <b>aceitas</b>'
                inputCheck.id = 'aceitareqtub'
                labelCheck.setAttribute('for', 'aceitareqtub')
                if (User.tb_flx_uos_tub_req_ace == 1){
                    inputCheck.setAttribute('checked', true)
                }
            }
            else{
                if (i == 1){
                    texto = 'quando minhas requisições forem <b>rejeitadas</b><hr>'
                    inputCheck.id = 'rejeitareqtub'
                    labelCheck.setAttribute('for', 'rejeitareqtub')
                    if (User.tb_flx_uos_tub_req_rej == 1){
                    inputCheck.setAttribute('checked', true)
                }
                }
                else{
                    if(areas[i-2]){
                        var idArea = areas[i-2].normalize("NFD").replace(/[\u0300-\u036f]/g, "") // substitui os caracteres com acento
                        var id = idArea.replace(/\s/g, '-')
                        texto = 'quando os sistemas da área <b>"'+areas[i-2]+'</b>" forem calculados'
                        inputCheck.id = 'area-' + id.toLowerCase()
                        labelCheck.setAttribute('for', 'area-' + id.toLowerCase())
                        inputCheck.setAttribute('disabled', true) // TEMPORÁRIO
                        CheckBox.title = 'Em breve será liberado' // TEMPORÁRIO
                        if(User.tb_flx_uos_tub_req_areas){
                            if(User.tb_flx_uos_tub_req_areas.includes('area-' + id.toLowerCase() + ',')){
                            inputCheck.setAttribute('checked', true)
                            }
                        }
                    }
                    else{
                        // Se a área for null
                        texto = 'quando os sistemas da área "<b>(EM BRANCO)</b>" forem calculados'
                        inputCheck.id = "area-embranco"
                        labelCheck.setAttribute('for', "area-embranco")
                        inputCheck.setAttribute('disabled', true)  // TEMPORÁRIO
                        CheckBox.title = 'Em breve será liberado' // TEMPORÁRIO
                        if(User.tb_flx_uos_tub_req_areas){
                            if(User.tb_flx_uos_tub_req_areas.includes('area-embranco')){
                            inputCheck.setAttribute('checked', true)
                            }
                        }
                    }
                }
            }
            labelCheck.innerHTML = 'Receber e-mail ' + texto 
            inputCheck.dataset.idusuario = User.tb_flx_uos_user
            inputCheck.dataset.iduos = User.tb_flx_uos_id
            inputCheck.onclick = function () { EmailRequisicao(this); }
            CheckBox.append(inputCheck)
            CheckBox.append(labelCheck)
            DivOpcoes.append(CheckBox)
        }
    }
}
function EmailRequisicao(elemento)
{
    var IDUSER = elemento.dataset.iduos
    var operacao = elemento.id
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url: "/app/flexibilidade/A1FlexEmailRequisicao/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": operacao, "Status": elemento.checked, "IDUsuario": IDUSER, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {

        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function AceitarRequisicao(elemento)
{
    //$("#ModalConfirmacaoAprovacao").modal('hide')
    //$("#ModalAprovarRequisicao").modal('show')
    $("#loaderModalAprovarReq").show();
    var IDSistema = elemento.dataset.idsys;
    var Observacao = $("#ObsAprRequisicao").val()
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("IDSistema", IDSistema)
    fd.append("Observacao", Observacao)
    fd.append("Operacao", "Aceitar")
    document.getElementById("BotaoAceitarRequisicao").disabled = true;
    document.getElementById("BotaoRejeitarRequisicao").disabled = true;
    $.ajax({
        url: "/app/flexibilidade/AtualizarRequisicao/", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();

            $("#loaderModalAprovarReq").hide();
            document.getElementById("BotaoAceitarRequisicao").disabled = false;
            document.getElementById("BotaoRejeitarRequisicao").disabled = false;
            //$("#ModalAprovarRequisicao").modal("hide")
            $("#ModalConfirmacaoAprovacao").modal('hide')
        },
        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        },
        cache: false,
        contentType: false,
        processData: false
    });
}
function RejeitarRequisicao(elemento)
{
    $("#loaderModalAprovarReq").show();
    //$("#ModalConfirmacaoReprovacao").modal("hide")
    //$("#ModalAprovarRequisicao").modal("show")
    var IDSistema = elemento.dataset.idsys;
    var Observacao = $("#ObsAprRequisicao").val()
    if (Observacao == null || Observacao.trim() === '')
    {
        $("#ErroAprovacaoRequisicao").html(`<div class="alert alert-danger" role="alert">
          <strong>Quando a requisição é rejeitada, é obrigatório inserir uma observação.</strong>
        </div>`)
        $("#loaderModalAprovarReq").hide();
        return;
    }
    document.getElementById("BotaoAceitarRequisicao").disabled = true;
    document.getElementById("BotaoRejeitarRequisicao").disabled = true;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("IDSistema", IDSistema)
    fd.append("Observacao", Observacao)
    fd.append("Operacao", "Rejeitar")
    $.ajax({
        url: "/app/flexibilidade/AtualizarRequisicao/", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
          
            $("#loaderModalAprovarReq").hide();
            document.getElementById("BotaoAceitarRequisicao").disabled = false;
            document.getElementById("BotaoRejeitarRequisicao").disabled = false;
            //$("#ModalAprovarRequisicao").modal('hide')
            $("#ModalConfirmacaoReprovacao").modal("hide")
            
        },
        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        },
        cache: false,
        contentType: false,
        processData: false
    });
}
function RetornaLinhasSistema(IDSistema)
{
    var Linhas = []
    for (var i = 0; i < LinhasOS.length; i++)
    {
        if (LinhasOS[i].tb_pf_id_sf == IDSistema)
        {
            Linhas.push(LinhasOS[i])
        }
    }
    return Linhas;
}
async function CriarTabelaLinhasRevisar(IDSistema) {
    var DivTabela = document.getElementById("TabelaLinhasRevisar");
    DivTabela.innerHTML = "";

    var LinhasSistema = RetornaLinhasSistema(IDSistema);

    var LarguraLinha = 150;
    var fieldTitles = ["Linha", "Teve Alterações?"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "TabelaLinhasRevisarT";
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 150px;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead")
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    let thr = document.createElement('tr');



    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (fieldTitle == "Teve Alterações?")
            th.style.width = LarguraLinha + "px"
        if (fieldTitle == "Linha")
            th.classList.add("TabelaLinhasFiltrar")
    });

    
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    for (var i = 0; i < LinhasSistema.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        }

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        }

        var TdLinha = document.createElement('TD');
        if (LinhasSistema[i].tb_pf_tag_flex)
        {
            TdLinha.appendChild(document.createTextNode(LinhasSistema[i].tb_pf_tag_flex));
        }
        else
        {
            TdLinha.appendChild(document.createTextNode(''));
            TdLinha.dataset.valor = ''
        }
        tr.appendChild(TdLinha);

        var tdAlteracoes = document.createElement('TD');
        var TxtAlteracoes = `<input type="checkbox" class="CheckboxLinha" data-idlinha="${LinhasSistema[i].tb_pf_id}">`
        var DivAlteracoes = document.createElement("div")
        DivAlteracoes.innerHTML = TxtAlteracoes
        DivAlteracoes.title = "Indicar alteração na linha";
        tdAlteracoes.appendChild(DivAlteracoes);
        tdAlteracoes.style.width = LarguraLinha + "px";
        tr.appendChild(tdAlteracoes);

    }

    DivTabela.appendChild(table);

    $('#TabelaLinhasRevisarT').excelTableFilter({ columnSelector: '.TabelaLinhasFiltrar', captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });


}

function RetornaAprovacaoPendencyFlexSistema(IDSistema) {
    var Pendency;
    var PendencyLog;
    var NomeStatus;
    var StatusSistema = RetornaStatusSistema(IDSistema);
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
        return "Aguardando Tubulação"
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
    if (StatusSistema == "Calculado (F3)" && NomeStatus == "ACEITO") NomeStatus = "Atender Comentários Flexibilidade"
    else if (NomeStatus == "NOVO") NomeStatus = "Aguardando Aprovação da Flexibilidade"
    else if (NomeStatus == "ACEITO") NomeStatus = "Requisição Aprovada pela Flexibilidade"
    else if (NomeStatus == "ATENDIDO") NomeStatus = "Comentários de Flexibilidade Atendidos"
    else if (NomeStatus == "REJEITADO") NomeStatus = "Requisição REPROVADA pela Flexibilidade"
    return NomeStatus;

}
function RetornaMotivoReprovacaoPendencyFlexSistema(IDSistema) {
    var Pendency;
    var PendencyLog;
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
        return "Aguardando Tubulação"
    }
    for (var i = 0; i < PendencyFlexLogsOS.length; i++)
    {
        if (PendencyFlexLogsOS[i].tb_pdf_log_id_pdf == Pendency.tb_pdf_id)
        {
            PendencyLog = PendencyFlexLogsOS[i];
            break;
        }
    }
    return PendencyLog.tb_pdf_log_obs_solver;
}
function RetornaPendencyFlexSistema(IDSistema) {
    var Pendency;
    var PendencyLog;
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
        return "Aguardando Tubulação"
    }
    for (var i = 0; i < PendencyFlexLogsOS.length; i++)
    {
        if (PendencyFlexLogsOS[i].tb_pdf_log_id_pdf == Pendency.tb_pdf_id)
        {
            PendencyLog = PendencyFlexLogsOS[i];
            break;
        }
    }
    return PendencyLog;
}
function RetornaHistoricoRequisicaoSistema(Sistema) {
    var Pendencies = []
    var PendencyLogs = []
    var IDsSistemas = []
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_name == Sistema)
        {
            IDsSistemas.push(SistemasOS[i].tb_sf_id)
        }
    }

    for (const IDSistema of IDsSistemas){
        for (var i = 0; i < PendencyFlexOS.length; i++) {
            if (PendencyFlexOS[i].tb_pdf_id_sf == IDSistema) {
                Pendencies.push(PendencyFlexOS[i].tb_pdf_id)
            }
        }
    }

    for (const pendency of Pendencies) {
        for (var i = 0; i < PendencyFlexLogsOS.length; i++) {
            if (PendencyFlexLogsOS[i].tb_pdf_log_id_pdf == pendency) {
                PendencyLogs.push(PendencyFlexLogsOS[i])
            }
        }
    }

    return PendencyLogs

}
function RetornaPerson(IDPerson)
{
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id == IDPerson)
        {
            return Person[i];
        }
    }
}
function RetornaPersonTodas(id) {
    for (var i = 0; i < PersonTodas.length; i++) {
        if (PersonTodas[i].tb_per_id == id) {
            return PersonTodas[i];
        }
    }
}
function ModalAceitarRequisicaoNAO()
{
    $("#ModalConfirmacaoAprovacao").modal('hide')
    $("#ModalAprovarRequisicao").modal('show')
}
function ModalReprovarRequisicaoNAO() {
    $("#ModalConfirmacaoReprovacao").modal('hide')
    $("#ModalAprovarRequisicao").modal('show')
}
function MostrarModalAceitarRequisicao(IDSistema)
{
    document.getElementById("BotaoSimAceitarRequisicao").dataset.idsys = IDSistema;
    document.getElementById("BotaoSimReprovarRequisicao").dataset.idsys = IDSistema;
    $("#ErroAprovacaoRequisicao").html("")
    $("#ObsAprRequisicao").val("")
    var PendencyFlex = RetornaPendencyFlexSistema(IDSistema);
    var ComentarioTubulacao = PendencyFlex.tb_pdf_log_obs_request;
    $("#ComentTub").val(ComentarioTubulacao);
    var PersonTub = RetornaPersonTodas(PendencyFlex.tb_pdf_log_id_per_request)
    $("#ResponsavelTub").val(PersonTub.tb_per_name)
    var Data = new Date(PendencyFlex.tb_pdf_log_time_request)
    var TxtData = Data.toLocaleDateString() + " " + Data.toLocaleTimeString()
    $("#DataTub").val(TxtData)
    document.getElementById("BotaoDownloadIsometricos").dataset.idsys = IDSistema;
    document.getElementById("BotaoDownloadCII").dataset.idsys = IDSistema;
    document.getElementById("BotaoAceitarRequisicao").dataset.idsys = IDSistema;
    document.getElementById("BotaoRejeitarRequisicao").dataset.idsys = IDSistema;
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    var StatusRequisicao = RetornaAprovacaoPendencyFlexSistema(IDSistema)
    $("#TituloModalAceitarRequisicao").html(`Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)

    if(Sistema.tb_sf_rev > 0 || RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)")
    {
        // Se é uma requisição de revisão mostra a revisão que sai para a nova [Sistema S001 - R0 → Sistema S001 - R1]
        $("#TituloModalAceitarRequisicao").html(`Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev - 1} \u2192 Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)
    }
    
    $("#ModalAprovarRequisicao").modal('show')
}

function MostrarModalHistorico(IDSistema)
{
    var HistoricoSistemas = {}
    var PendencyLogs = []
    var Sistema
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i]
            break
        }
    }
    PendencyLogs = RetornaHistoricoRequisicaoSistema(Sistema.tb_sf_name)

    var DivTabela = document.getElementById("ModalHistoricoTabela")
    DivTabela.innerHTML = "";

    var LarguraAcao = 120
    var LarguraComent = 120
    var LarguraRev = 50
    var LarguraObs = 200
    var LarguraResp= 50
    var LarguraData = 100
    var fieldTitles = ["Ação", "Comentário", "Rev", "Observação", "Responsável", "Data"]
    var table = document.createElement('TABLE');

    table.border = '0.1';
    table.id = "ModalHistoricoSistemaTabela";
    table.style.minHeight = "80px"
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 250px;");
    let thead = document.createElement('thead');
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    thead.style.fontSize = "80%"
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
        if (fieldTitle == "Ação")
            th.style.width = LarguraAcao + "px"
        if (fieldTitle == "Comentário")
            th.style.width = LarguraComent + "px"
        if (fieldTitle == "Rev")
            th.style.width = LarguraRev + "px"
        if (fieldTitle == "Observação")
            th.style.width = LarguraObs + "px"
        if (fieldTitle == "Responsável")
            th.style.width = LarguraResp + "px"
        if (fieldTitle == "Data")
            th.style.width = LarguraData + "px"
    })
    
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);

    // FAZER:
    // DADOS GERAIS (OBJETO HistoricoSistemas) COM POSSÍVEIS AÇÕES:
    //     Requisição de cálculo
    //     Alteração de status do sistema
    //     Alteração de revisão do sistema
    //     Aprovação de requisição
    //     Reprovação de requisição

    for (var i = 0; i < PendencyLogs.length; i++) {
        // Hoje (13/01/2024) não temos os registros antigos de recusa de requisição de cálculo. Quando uma requisição é recusada, depois refeita e aceita, as informações são de quando foi recusada são sobreescrita pelas novas informações de aceitação.
        // Talvez para mudar isso deva-se mudar a lógica de como registrar as alterações dos status criando novos registros com PendencyLog = TbPendencyFlexLogs()
        
        for (var j = 0; j < PendencyFlexOS.length; j++) {
                
            var Sistema
            var id_sistema
            var rev_sistema
            if (PendencyFlexOS[j].tb_pdf_id == PendencyLogs[i].tb_pdf_log_id_pdf) {
                id_sistema = PendencyFlexOS[j].tb_pdf_id_sf
                for (var n = 0; n < SistemasOS.length; n++) {
                    if (SistemasOS[n].tb_sf_id == id_sistema)
                    {
                        Sistema = SistemasOS[n]
                        rev_sistema = Sistema.tb_sf_rev
                        break
                    }
                }
                break
            }
        }     
        if (PendencyLogs[i].tb_pdf_log_id_spf == 1) {
            // Se o status é igual a "NOVO"

            // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = JSON.parse(JSON.stringify(PendencyLogs[i]))
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Requisição'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Nova requisição de cálculo'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_request
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_request

        }
        if (PendencyLogs[i].tb_pdf_log_id_spf == 2) {
            // Se o status é igual a "REJEITADO"

            // requisição de cálculo do projetista
            // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = JSON.parse(JSON.stringify(PendencyLogs[i]))
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Requisição'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Nova requisição de cálculo'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_request
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_request

            // requisição de cálculo reprovada pela flexibilidade
            // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = JSON.parse(JSON.stringify(PendencyLogs[i]))
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = Object()
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Acao'] = 'Requisição'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Comentario'] = 'Reprovação da requisição de cálculo'
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_solver
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Rev'] = rev_sistema
            HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_solver
        } else if (PendencyLogs[i].tb_pdf_log_id_spf == 3) {
            // Se o status é igual a "ACEITO"

            if (rev_sistema === 1 && !PendencyLogs[i].tb_pdf_log_time_solver) {
                // Essa condição acontece quando a Flexibilidade sobe a revisão do sistema de R0 para R1

                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()          
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Alteração de revisão do sistema'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Avanço de R0 para R1'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = '-'
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_solver

            } else {

                // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = JSON.parse(JSON.stringify(PendencyLogs[i]))
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()          
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Requisição'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Nova requisição de cálculo'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_request
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_request    
    
                // requisição de cálculo aprovada pela flexibilidade
                // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = JSON.parse(JSON.stringify(PendencyLogs[i]))
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = Object() 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Acao'] = 'Requisição' 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Comentario'] = 'Aprovação da requisição de cálculo'
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_solver
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Rev'] = rev_sistema
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_solver
            }


        } else if (PendencyLogs[i].tb_pdf_log_id_spf == 4) {
            // Se o status é igual a "ATENDIDO"

            if (rev_sistema === 1 && !PendencyLogs[i].tb_pdf_log_time_solver) {
                // Essa condição acontece quando a Flexibilidade sobe a revisão do sistema de R0 para R1

                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()          
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Alteração de revisão do sistema'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Avanço de R0 para R1'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = '-'
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_solver

            } else {

                // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = JSON.parse(JSON.stringify(PendencyLogs[i]))
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = Object()          
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Acao'] = 'Requisição'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Comentario'] = 'Nova requisição de cálculo'            
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_request
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Rev'] = rev_sistema 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_request    
    
                // requisição de cálculo aprovada pela flexibilidade
                // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = JSON.parse(JSON.stringify(PendencyLogs[i]))
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver] = Object() 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Acao'] = 'Requisição' 
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Comentario'] = 'Aprovação da requisição de cálculo'
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Obs'] = PendencyLogs[i].tb_pdf_log_obs_solver
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Rev'] = rev_sistema
                HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_solver]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_solver
    
            }
            
            // comentários atendidos pelo do projetista
            // HistoricoSistemas[PendencyLogs[i].tb_pdf_log_time_request] = JSON.parse(JSON.stringify(PendencyLogs[i]))
            var Datas = RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
            var chave = Datas[4] ? Datas[4] : PendencyLogs[i].tb_pdf_log_time_request

            HistoricoSistemas[chave] = Object() 
            HistoricoSistemas[chave]['Acao'] = 'Alteração de status do sistema' 
            HistoricoSistemas[chave]['Comentario'] = 'Avanço de F3 para F4' 
            HistoricoSistemas[chave]['Obs'] = 'Comentários de Flexibilidade Atendidos' 
            HistoricoSistemas[chave]['Rev'] = rev_sistema
            HistoricoSistemas[chave]['Resp'] = PendencyLogs[i].tb_pdf_log_id_per_request
        }
    }

    for (const data of Object.keys(HistoricoSistemas))
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

        var tdAcao = document.createElement('TD');
        if (HistoricoSistemas[data].Acao)
        {
            tdAcao.appendChild(document.createTextNode(HistoricoSistemas[data].Acao));
        }
        else
        {
            tdAcao.appendChild(document.createTextNode('-'));
        }

        tdAcao.style.width = LarguraAcao + "px"
        tr.appendChild(tdAcao)
   
        var tdComent = document.createElement('TD');
        if (HistoricoSistemas[data].Comentario)
        {
            tdComent.appendChild(document.createTextNode(HistoricoSistemas[data].Comentario));
        }
        else
        {
            tdComent.appendChild(document.createTextNode('-'));
        }

        tdComent.style.width = LarguraComent + "px"
        tr.appendChild(tdComent)
        
        var tdRev = document.createElement('TD');
        if (!isNaN(HistoricoSistemas[data].Rev))
        {
            tdRev.appendChild(document.createTextNode(HistoricoSistemas[data].Rev));
        }
        else
        {
            tdRev.appendChild(document.createTextNode('-'));
        }

        tdRev.style.width = LarguraRev + "px"
        tr.appendChild(tdRev)
        
        var tdObs = document.createElement('TD');
        if (HistoricoSistemas[data].Obs)
        {
            tdObs.appendChild(document.createTextNode(HistoricoSistemas[data].Obs));
        }
        else
        {
            tdObs.appendChild(document.createTextNode('-'));
        }

        tdObs.style.width = LarguraObs + "px"
        tr.appendChild(tdObs)
        
        var tdResp = document.createElement('TD')
        if (HistoricoSistemas[data].Resp)
        {
            tdResp.appendChild(document.createTextNode(RetornaInicialUser(HistoricoSistemas[data].Resp)));
        }
        else
        {
            tdResp.appendChild(document.createTextNode('-'));
        }

        tdResp.style.width = LarguraResp + "px"
        tr.appendChild(tdResp)
        
        var TdData = document.createElement('TD')
        var TxtData = ""
        if (HistoricoSistemas[data])
        {
            var Data = new Date(data)
            TxtData = Data.toLocaleDateString() + " " + Data.toLocaleTimeString()
        }
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

    $('#TabelaHistoricoT').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });

    $("#TituloHistoricoRequisicao").html(`Histórico de requisições e status do sistema ${Sistema.tb_sf_name}`)
    $("#ModalHistoricoRequisicao").modal("show")
}

async function MostrarModalAcoes(IDSistema, SistemaCancelado=false)
{
    document.getElementById("ConfirmacaoAtendComentariosCheck").checked = false;
    document.getElementById("BotaoComentariosAtendidos").disabled = false;
    $("#formreprovacao").hide();
    $("#ErroComentariosAtendidos").html("");
    document.getElementById("ProgressEnvioArquivo").innerHTML = ""
    document.getElementById("BotaoCriarRequisicao").dataset.idsys = IDSistema;
    document.getElementById("BotaoComentariosAtendidos").dataset.idsys = IDSistema;
    
    $("#ErroRequisicao").html("")
    $("#loaderModalAcoes").show()
    $("#SelectRetrabalho").val("NÃO")
    $("#ObservacoesReqMod").val("")
    $("#id_NomeDoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    $('#ArquivoUploadInput').val("")
    $("#id_NomeDoArquivoCii").val("")
    $('#id_NomeDoArquivoCiilbl').html("Selecione um arquivo");
    $('#ArquivoUploadCiiInput').val("")
    var StatusReq = RetornaAprovacaoPendencyFlexSistema(IDSistema);
    if (StatusReq == "Requisição REPROVADA pela Flexibilidade")
    {
        var MotivoRepr = RetornaMotivoReprovacaoPendencyFlexSistema(IDSistema);
        $("#MotivoReprovacao").html(`A requisição anterior foi <strong>reprovada</strong> pelo seguinte motivo: <strong>${MotivoRepr}</strong>`)
        $("#formreprovacao").show();
    }
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i]
            break
        }
    }
    var StatusRequisicao = RetornaAprovacaoPendencyFlexSistema(IDSistema)
    $("#TituloModalAcoes").html(`Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)

    // console.log(RetornaStatusSistema(Sistema.tb_sf_id), Sistema)
    if((Sistema.tb_sf_rev > 0 || RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)") && (StatusRequisicao == "Aguardando Aprovação da Flexibilidade" || StatusRequisicao == "Requisição REPROVADA pela Flexibilidade"))
    {
        // Se é uma requisição de revisão de um sistema com pendência mostra a revisão que sai para a nova [Sistema S003 - R2 → Sistema S003 - R3]
        $("#TituloModalAcoes").html(`Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev - 1} \u2192 Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)
    }
    else
    {
        if((Sistema.tb_sf_rev == 0 && RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)") || (Sistema.tb_sf_rev > 0 || RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)"))
        {
            // Se é uma requisição de revisão de um sistema que foi aprovado no R0 ou a primeira revisão (sem pendência)
            $("#TituloModalAcoes").html(`Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev} \u2192 Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev + 1}`)
        }
    }
    if (Sistema.tb_sf_rev > 0 || RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)")
    {
        CriarTabelaLinhasRevisar(IDSistema)
        $("#DivTabLins").show();
    }
    else
    {
        $("#DivTabLins").hide();
    }
    $("#ModalAcaoRequisicao").modal("show")
    if (SistemaCancelado){
        $("#SistemaCancelado").show()
        $("#CriarRequisicaoMod").hide()
        $("#ConfirmarAtenderComentários").hide()
        $("#AguardarFlexibilidade").hide()
    }
    else{    
        if (StatusRequisicao == "Comentários de Flexibilidade Atendidos" || StatusRequisicao == "Aguardando Tubulação" || StatusRequisicao == "Requisição REPROVADA pela Flexibilidade")
        {
            
            //Criar Modal Nova Requisição
            $("#SelectRepsonsavelTubulacao").empty()
            var o = new Option("", "");
            $(o).html("");
            $("#SelectRepsonsavelTubulacao").append(o);
            
            //Mostrar somente os membros ativos na OS
            var Usuarios = await GetUsuariosActiveOS2(OS) // recebe os usuários ativos na OS atual
            for (var i = 0; i < Usuarios.length ; i++){
                var pessoa = RetornaPerson(Usuarios[i].tb_flx_uos_user)
                var o = new Option(pessoa.tb_per_name, pessoa.tb_per_id);
                $(o).html(pessoa.tb_per_name);
                $("#SelectRepsonsavelTubulacao").append(o);
                
            }
            // for (var i = 0; i < Person.length; i++)
            // {
            //     if (Person[i].tb_per_status == '1')
            //     {
            //         var o = new Option(Person[i].tb_per_name, Person[i].tb_per_id);
            //         $(o).html(Person[i].tb_per_name);
            //         $("#SelectRepsonsavelTubulacao").append(o);
            //     }
            // }
            $("#AguardarFlexibilidade").hide();
            $("#CriarRequisicaoMod").show();
            $("#ConfirmarAtenderComentários").hide();
            $("#SistemaCancelado").hide()
        }
        else if (StatusRequisicao == "Atender Comentários Flexibilidade")
        {
            //Modal Atender Comentários
            await AtualizarDisponibilidadeModelo3D(IDSistema)
            $("#ConfirmarAtenderComentários").show();
            $("#AguardarFlexibilidade").hide();
            $("#CriarRequisicaoMod").hide();
            $("#SistemaCancelado").hide()
        }
        else
        {
            $("#AguardarFlexibilidade").show();
            $("#CriarRequisicaoMod").hide();
            $("#ConfirmarAtenderComentários").hide();
            var PendencyFlex = RetornaPendencyFlexSistema(IDSistema);
            var Data = new Date(PendencyFlex.tb_pdf_log_time_request)
            var TxtData = Data.toLocaleDateString() + " " + Data.toLocaleTimeString()
            var PersonTub = RetornaPersonTodas(PendencyFlex.tb_pdf_log_id_per_request)
            var ComentarioTubulacao = PendencyFlex.tb_pdf_log_obs_request;
            $("#ComentTubt").val(ComentarioTubulacao);
            $("#ResponsavelTubt").val(PersonTub.tb_per_name)
            $("#DataTubt").val(TxtData)
            $("#SistemaCancelado").hide()
        }
    }

    $("#loaderModalAcoes").hide()

}
async function AtualizarDisponibilidadeModelo3D(IDSistema) {
    var TodosInfoImports = await RetornaTodosInfoImports()
    var Sistema;
    var BotaoMostrar3D = document.getElementById("BotaoAcessarReport3D")
    var InputDisponibilidade = document.getElementById("StatusReport3D")
    await CarregarTabelaArquivos(IDSistema)
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
        BotaoMostrar3D.disabled = false;
        InputDisponibilidade.value = "Disponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DNAO")
        InputDisponibilidade.classList.add("InputDisponibilidade3DSIM")



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
        BotaoMostrar3D.disabled = true;
        InputDisponibilidade.value = "Indisponível"
        InputDisponibilidade.classList.remove("InputDisponibilidade3DSIM")
        InputDisponibilidade.classList.add("InputDisponibilidade3DNAO")


        //não contém 3D
    }

}
async function ComentariosAtendidosTub(elemento)
{
    $("#ErroComentariosAtendidos").html("")
    var IDSistema = elemento.dataset.idsys;
    var CheckBoxComentarios = document.getElementById("ConfirmacaoAtendComentariosCheck")
    if (!CheckBoxComentarios.checked)
    {
        $("#ErroComentariosAtendidos").html(`<div class="alert alert-danger" role="alert">
            Para enviar você deve clicar <strong>confirmando</strong> que aplicou todos os comentários!
        </div>`)
        return;
    }
    $("#loaderComentariosAtendidos").show();
    document.getElementById("BotaoComentariosAtendidos").disabled = true;
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("IDSistema", IDSistema)
    $.ajax({
        url: "/app/flexibilidade/ComentariosAtendidos/", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json) {
            await CarregarPagina();
            $("#ModalAcaoRequisicao").modal("hide")
            $("#loaderComentariosAtendidos").hide();
        },
        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        },
        cache: false,
        contentType: false,
        processData: false
    });
}
async function CarregarTabelaArquivos(IDSistema) {


    $("#id_NomeDoArquivo").val("")
    $("#DescricaoArquivo").val("")
    $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
    var StatusSistema = RetornaStatusSistema(IDSistema);
    var Arquivos = await GetArquivosSistema(IDSistema);
    if (Arquivos.length == 0)
    {
        Arquivos.push({ "tb_frf_desc": "Sem arquivos cadastrados!" });
    }
    var DivTabela = document.getElementById("ModalReportsSistemaTabela");
    DivTabela.innerHTML = "";
    var LarguraDados = 75;
    var LarguraData = 120;
    var LarguraResponsavel = 120;
    var fieldTitles = ["Descrição", "Responsável", "Data", "Extensão", "Download"];
    if (!StatusSistema.includes("F3") && !StatusSistema.includes("F4"))
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
    for (var i = 0; i < Arquivos.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
        tr.style.fontSize = "80%";
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function () {
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
        if (Arquivos[i].tb_frf_pers)
        {
            tdResp.appendChild(document.createTextNode(RetornaInicialUser(Arquivos[i].tb_frf_pers)));
        }

        else
        {
            tdResp.appendChild(document.createTextNode(''));
        }
        tdResp.width = LarguraResponsavel + "px";
        tr.appendChild(tdResp);

        var TdData = document.createElement('TD');
        var TxtData = "";
        if (Arquivos[i].tb_frf_dt_up)
        {
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

        else
        {
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
        if (!StatusSistema.includes("F3") && !StatusSistema.includes("F4"))
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
function RetornaStatusSistema(IDSistema) {
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
function RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4) {
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    for (var i = 0; i < SystemFlexTime.length; i++)
    {
        if (SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id)
        {
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1.tb_st_id)
            {
                F1 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1R.tb_st_id)
            {
                F1R = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF2.tb_st_id)
            {
                F2 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF3.tb_st_id)
            {
                F3 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF4.tb_st_id)
            {
                F4 = SystemFlexTime[i].tb_sft_time_update;
            }
            if ((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null)
            {
                break;
            }

        }

    }
    return [F1, F1R, F2, F3, F4]

}

async function NovaRequisicao(id_sys_flex,sis_flex, rev)
{

    if(IDAtual != id_sys_flex)
    {
        LinhasRevisar = []
    }
    IDAtual= id_sys_flex
    IDSys = id_sys_flex;
    SisFlex = sis_flex;
    RevA = rev;
    if (id_sys_flex) // Se existe ID para aquele sistema de flexibilidade
    {
        var Linhas = await GetDadosLinhaSistema(id_sys_flex)
        // console.log(Linhas)
        if(rev == 0)
        {
            LinhasRevisar = []
            for(var i = 0; i < Linhas.length; i++)
            {
                LinhasRevisar.push({"IDLinha":Linhas[i].IDLinha, "Operacao": "Calculo Novo"})
            }
            await AtualizarSistema(id_sys_flex,sis_flex, rev, LinhasRevisar)
        }
        else
        {
            if($( "#TabelaLinhasDoSistema" ).html() != "")
            {
                $('#TabelaLinhasDoSistema').DataTable().clear().destroy(false);
                $('#TabelaLinhasDoSistema').empty();
                $("#TabelaLinhasDoSistema tbody").empty();
                $("#TabelaLinhasDoSistema thead").empty();
            }
            var ListaDeLinhas = [];
             if(LinhasRevisar.length > 0)
             {
                for(var i = 0; i < LinhasRevisar.length; i++)
                 {
                    var CheckBox;
                    if(LinhasRevisar[i].Operacao == "Revisar Linha")
                    {
                        CheckBox = `<input type="checkbox" class="CheckLinhas" data-id-Linha="${LinhasRevisar[i].IDLinha}" checked>`
                    }
                    else
                    {
                        CheckBox = `<input type="checkbox" class="CheckLinhas" data-id-Linha="${LinhasRevisar[i].IDLinha}">`
                    }
                    ListaDeLinhas.push([LinhasRevisar[i].TagLinha, CheckBox]);

                 }
             }
             else
             {
                 for(var i = 0; i < Linhas.length; i++)
                 {
                    var CheckBox = `<input type="checkbox" class="CheckLinhas" data-id-Linha="${Linhas[i].IDLinha}">`
                    ListaDeLinhas.push([Linhas[i].Tag, CheckBox]);

                 }
             }
            $('#TabelaLinhasDoSistema').DataTable( {
                data: ListaDeLinhas,
                "autoWidth": false,
                 "columnDefs": [
                    { "width": "20%", "targets": 1 }
                  ],
                columns: [
                    { title: "Tag" },
                    { title: "Selecionar", width: "50px" },

                ],
                columnDefs: [
                    // Center align the header content of column 1
                   { className: "dt-center", targets: [ 0, 1 ] },

                ],
                   "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
                 "pageLength": 10,
                      "language": {
                  "emptyTable": "Nenhuma Linha Encontrada.",
                  "zeroRecords": "Nenhuma Linha Encontrada.",
                  "search": "Pesquisar",
                    "paginate": {
                    "first":      "Primeira",
                    "last":       "Última",
                    "next":       "Próxima",
                    "previous":   "Anterior",

                    },
                    "lengthMenu":     "Mostrar _MENU_ ",
                      "info":           "Mostrando _START_ à _END_ de _TOTAL_",
                      "infoEmpty":      "Sem linhas",
                      "infoFiltered":   "(de _MAX_)",
                }


                } );
                table = $('#TabelaLinhasDoSistema').DataTable();
                $('#button').click( function () {
                    table.row('.selected').remove().draw( false );
                } );

                var Els = document.getElementsByName("TabelaLinhasDoSistema_length");
                for(var i = 0; i < Els.length; i++)
                {
                    Els[i].style.width = "75px"
                }

            $("#ModalSelecionarLinhas").modal("show")
        }


    }
    else
    {
        return alert('Sistema não encontrado, revise os campos "Sistema" e "revisão"')
    }

}
async function AtualizarSistemaLinhasFiltradas()
{
    var id_sys_flex = IDSys;
    var sis_flex = SisFlex;
    var rev = RevA;
    LinhasRevisar = []

    var LinhasSelect = document.getElementsByClassName("CheckLinhas")
    var tableLinhas = $('#TabelaLinhasDoSistema').DataTable();
    tableLinhas.rows().every(function(index, element) {
      var row = $(this.node());
      var LinhaTag = row.find('td').eq(0)[0].innerText;
      var statusElement = row.find('td').eq(1); // Index 6 - the 7th column in the table
      //console.log(statusElement[0].firstChild)
      var isChecked = statusElement[0].firstChild.checked;
      var IDLinha = statusElement[0].firstChild.getAttribute('data-id-linha')
      if(isChecked == true)
      {
         LinhasRevisar.push({"TagLinha":LinhaTag, "IDLinha":IDLinha, "Operacao": "Revisar Linha"})
      }
      else
      {
         LinhasRevisar.push({"TagLinha":LinhaTag, "IDLinha":IDLinha, "Operacao": "Sem Alterações"})
      }
    });

    var isometrico = document.getElementById('arq-iso').value;
                    var arquivo_pd2c = document.getElementById('arq-pd2').value;
                    let observacao = document.getElementById('observacao').value;
                    let demanda = document.getElementById('demanda').value;
                    if (!(isometrico) || !(arquivo_pd2c))
                    {
                        return alert('Os Campos de arquivo são obrigatórios')
                    }
                     else
                     {
                        let nw_req = [id_sys_flex, isometrico, arquivo_pd2c, observacao, demanda, login];
                        let form = new FormData($("#form")[0]);
                        form.append("LinhasRevisar", JSON.stringify(LinhasRevisar))
                        await $.ajax({
                            type: "POST",
                            url: "atualizar/",
                            dataType: 'json',
                            data: form,
                            contentType: false,
                            processData: false,

                        }).done(function (data){ alert(data['response']) })
                    }

}
async function AtualizarSistema(id_sys_flex,sis_flex, rev, LinhasRevisar)
{
                    var isometrico = document.getElementById('arq-iso').value;
                    var arquivo_pd2c = document.getElementById('arq-pd2').value;
                    let observacao = document.getElementById('observacao').value;
                    let demanda = document.getElementById('demanda').value;
                    if (!(isometrico) || !(arquivo_pd2c))
                    {
                        return alert('Os Campos de arquivo são obrigatórios')
                    }
                     else
                     {
                        let nw_req = [id_sys_flex, isometrico, arquivo_pd2c, observacao, demanda, login];
                        let form = new FormData($("#form")[0]);
                        form.append("LinhasRevisar", JSON.stringify(LinhasRevisar))
                        await $.ajax({
                            type: "POST",
                            url: "atualizar/",
                            dataType: 'json',
                            data: form,
                            contentType: false,
                            processData: false,

                        }).done(function (data){ alert(data['response']) })
                    }

}
async function GetDadosLinhaSistema(IDSistema){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/requisicao/RetornaLinhasSistema/",
      method: "GET",
      data: { ID: IDSistema }
    });

   return request;

}
function RetornaCorStatus(StringStatus) {
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
function DefinirStatus() {
    for (var i = 0; i < Statuses.length; i++)
    {
        if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Aguardando Tubulação (F0)")
        {
            StatusF0 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Liberado para cálculo (F1)")
        {
            StatusF1 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Para revisão (F1.1)")
        {
            StatusF1R = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Em análise (F2)")
        {
            StatusF2 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Calculado (F3)")
        {
            StatusF3 = Statuses[i];
        }
        else if (Statuses[i].tb_st_id_disc == 3 && Statuses[i].tb_st_work_status == "Tubulação ajustada (F4)")
        {
            StatusF4 = Statuses[i];
        }
    }
}
function RetornaHorasSistema(Sistema) {
    var Horas = 0;
    for (var i = 0; i < HourPersonFlex.length; i++)
    {
        if (HourPersonFlex[i].tb_hpf_id_sf == Sistema.tb_sf_id)
        {
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
    return Horas;
}
function RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4) {
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    for (var i = 0; i < SystemFlexTime.length; i++)
    {
        if (SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id)
        {
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1.tb_st_id)
            {
                F1 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF1R.tb_st_id)
            {
                F1R = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF2.tb_st_id)
            {
                F2 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF3.tb_st_id)
            {
                F3 = SystemFlexTime[i].tb_sft_time_update;
            }
            if (SystemFlexTime[i].tb_sft_id_st == StatusF4.tb_st_id)
            {
                F4 = SystemFlexTime[i].tb_sft_time_update;
            }
            if ((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null)
            {
                break;
            }

        }

    }
    return [F1, F1R, F2, F3, F4]

}
function RetornaInicialUser(ID) {
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id == ID)
        {
            return Person[i].tb_per_initials
        }

    }
}
function RetornaDadosWorkSystem(Sistema) {
    for (var i = 0; i < WorkSystemFlex.length; i++)
    {
        if (WorkSystemFlex[i].tb_wsf_id_sf == Sistema.tb_sf_id)
        {
            return WorkSystemFlex[i];
        }
    }

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
async function GetPersonsTodas() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaPersonTodas/",
        method: "GET",
        data: {}
    });

    return request;

}
async function GetHourPersonFlexOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaHourPersonFlexOS/",
        method: "GET",
        data: { os: OS }
    });

    return request;
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
async function GetSistemasOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaSistemasOS/",
        method: "GET",
        data: { os: OS }
    });
    request.sort(function (a, b) {
        let y = a.tb_sf_name,
            x = b.tb_sf_name;
        return x == y ? 0 : x < y ? 1 : -1;
    });;
    return request
}
async function GetStatuses() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaStatus/",
        method: "GET",
        data: {}
    });

    return request;

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
async function GetPipeHistoryOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaHistoricosOS/",
        method: "GET",
        data: { OS: OS }
    });

    return request;
}
async function GetWorkSystemFlexOS(OS) {

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
        data: {}
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
        data: {}
    });

    return request;
}
async function GetArquivosSistema(IDSistema) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaArquivosReportSistema/",
        method: "GET",
        data: { IDSIS: IDSistema }
    });

    return request;
}
function BaixarIsometricos(elemento)
{
    var IDSistema = elemento.dataset.idsys;
    window.open(`/app/flexibilidade/DownloadIsometrico/${IDSistema}/`, "_self")
}
function BaixarCII(elemento)
{
    var IDSistema = elemento.dataset.idsys;
    window.open(`/app/flexibilidade/DownloadCII/${IDSistema}/`, "_self")
}
function MostrarConfirmacaoAprovacaoRequisicao()
{
    $("#ModalAprovarRequisicao").modal('hide');
    $("#ModalConfirmacaoAprovacao").modal('show');
    
}
function MostrarConfirmacaoReprovacaoRequisicao() {
    $("#ModalAprovarRequisicao").modal('hide');
    $("#ModalConfirmacaoReprovacao").modal('show');

}
function CriarRequisicao(elemento)
{
    $("#loaderModalAcoes").show();
    $("#ErroRequisicao").html("")
    var LinhasRevisar = []
    var IDSistema = document.getElementById("BotaoCriarRequisicao").dataset.idsys;
    var Sistema;
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_id == IDSistema)
        {
            Sistema = SistemasOS[i];
            break;
        }
    }
    var Retrabalho = $("#SelectRetrabalho").val();
    var Observacao = $("#ObservacoesReqMod").val();
    var ArquivoIsometricos = $("#ArquivoUploadInput").prop('files')[0]
    var ArquivoCII = $("#ArquivoUploadCiiInput").prop('files')[0]
    var ResponsavelProj = $("#SelectRepsonsavelTubulacao option:selected").val()
    if (ResponsavelProj.trim() == "" || ResponsavelProj == null)
    {
        $("#ErroRequisicao").html(`<div class="alert alert-danger" role="alert">Erro de Validação: Responsável pelo projeto não selecionado!</div>`)
        $("#loaderModalAcoes").hide();
        return;
    }
    if (!ArquivoIsometricos || !ArquivoCII)
    {
        $("#ErroRequisicao").html(`<div class="alert alert-danger" role="alert">
        Você deve selecionar os arquivos para criar a requisição!
        </div>`)
        $("#loaderModalAcoes").hide();
        return;
    }

    if (Sistema.tb_sf_rev > 0 || RetornaStatusSistema(Sistema.tb_sf_id) == "Tubulação ajustada (F4)")
    {
        var Checkboxes = document.getElementsByClassName("CheckboxLinha")
        for (var i = 0; i < Checkboxes.length; i++)
        {
            if (Checkboxes[i].checked)
            {
                LinhasRevisar.push(Checkboxes[i].dataset.idlinha)
            }
        }
        if (LinhasRevisar.length == 0)
        {
            $("#ErroRequisicao").html(`<div class="alert alert-danger" role="alert">
            Selecione as linhas que sofreram alteração
            </div>`)
            $("#loaderModalAcoes").hide();
            return;
        }
        if (Observacao == null || Observacao.trim() === '')
        {
            $("#ErroRequisicao").html(`<div class="alert alert-danger" role="alert">
              É necessário indicar as alterações no campo observação
            </div>`)
            $("#loaderModalAcoes").hide();
            return;
        }
    }
    else
    {
        var Linhas = RetornaLinhasSistema(Sistema.tb_sf_id);
        for (var i = 0; i < Linhas.length; i++)
        {
            LinhasRevisar.push(Linhas[i].tb_pf_id)
        }
    }
    var progressBox = document.getElementById("ProgressEnvioArquivo");
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    fd.append("ArquivoIsometrico", ArquivoIsometricos)
    fd.append("ArquivoCII", ArquivoCII)
    fd.append("IDSistema", IDSistema)
    fd.append("Retrabalho", Retrabalho)
    fd.append("Observacao", Observacao)
    fd.append("StatusReq", RetornaAprovacaoPendencyFlexSistema(IDSistema))
    fd.append("LinhasRevisar", JSON.stringify(LinhasRevisar))
    fd.append("RespProj", ResponsavelProj)
    $.ajax({
        url: "/app/flexibilidade/CriarRequisicao/", // the endpoint
        type: "POST", // http method
        data: fd,
        enctype: 'multipart/form-data',
        // handle a successful response
        success: async function (json) {
            OS = $("#OS").html();
            progressBox.innerHTML = ""
            await CarregarPagina();
            $("#ModalAcaoRequisicao").modal("hide")
            $("#loaderModalAcoes").hide();
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
async function GetUsuariosRequisicao() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/RetornaUsuariosRequisicao/",
        method: "GET",
        data: {}
    });

    return request;
}
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

function customProgress(progressBarElement, progressBarMessageElement, progress) {
    progressBarElement.innerHTML = progress.percent + '%';
    progressBarMessageElement.innerHTML = (
        progress.description
    );
    progressBarElement.style.width = progress.percent + "%";
}
var ExtensoesIso = ['pdf', 'zip', 'dwg', 'dxf', 'rar']
$('#ArquivoUploadInput').change(
    function (e) {
        var Extensao = e.target.files[0].name.split('.').pop().toLowerCase();
        if (ExtensoesIso.includes(Extensao))
        {
            $('#id_NomeDoArquivo').val(e.target.files[0].name);
            $('#id_NomeDoArquivolbl').html(e.target.files[0].name);
            $("#ErroRequisicao").html("")
        }
        else
        {
            $("#ErroRequisicao").html(`<div class="alert alert-warning" role="alert">
                  O arquivo de isométricos precisa ser do tipo: <strong>PDF, ZIP, DWG, DXF, RAR</strong>
                </div>`)
            $('#id_NomeDoArquivolbl').html("Selecione um arquivo");
            $('#ArquivoUploadInput').val("")
        }
    });
var ExtensoesCII = ['zip', 'rar', 'cii']
$('#ArquivoUploadCiiInput').change(
    function (e) {
        var Extensao = e.target.files[0].name.split('.').pop().toLowerCase();
        if (ExtensoesCII.includes(Extensao))
        {
            $('#id_NomeDoArquivoCii').val(e.target.files[0].name);
            $('#id_NomeDoArquivoCiilbl').html(e.target.files[0].name);
            $("#ErroRequisicao").html("")
        }
        else
        {
            $("#ErroRequisicao").html(`<div class="alert alert-warning" role="alert">
                  O arquivo de isométricos precisa ser do tipo: <strong>ZIP, RAR, CII</strong>
                </div>`)
            $('#id_NomeDoArquivoCiilbl').html("Selecione um arquivo");
            $('#id_NomeDoArquivoCii').val("")
        }
       
    });
async function GetUsuariosActiveOS2(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/UsersActOS2/",
        method: "GET",
        data: { "OS": OS }
    });

    return request;

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
if (!String.prototype.endsWith)
    String.prototype.endsWith = function (searchStr, Position) {
        // This works much better than >= because
        // it compensates for NaN:
        if (!(Position < this.length))
            Position = this.length;
        else
            Position |= 0; // round position
        return this.substr(Position - searchStr.length,
            searchStr.length) === searchStr;
    };
