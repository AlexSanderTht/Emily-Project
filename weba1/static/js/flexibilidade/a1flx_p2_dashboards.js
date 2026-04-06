var tf;
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
var HourPersonAtividade

var PipeFlexTime = []
var StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4;
var TotalAtividadesMetas = 0;
var QtdCriteriosRealizados = QtdCriteriosMeta = QtdEstudosRealizados = QtdEstudosMeta = QtdListaMolasRealizados = QtdListaMolasMeta = QtdIndiceLinhasRealizados = QtIndiceLinhasMeta = QtdListaJuntasRealizados = QtdListaJuntasMeta = QtdMemoriaisRealizados = QtdMemoriaisMeta = 0
var chartGraficoProgresso
var chartStatusEavancos
var QtdLinhasF0 = QtdLinhasF1 = QtdLinhasF1R = QtdLinhasF2 = QtdLinhasF3 = QtdLinhasF4 = 0
var QtdLinhasF0SemFiltro = QtdLinhasF1SemFiltro = QtdLinhasF1RSemFiltro = QtdLinhasF2SemFiltro = QtdLinhasF3SemFiltro = QtdLinhasF4SemFiltro = 0
var PesoAvancoCriterios = 0.04
var PesoAvancoEstudos = 0.25
var PesoAvancoListaMolas = 0.04
var PesoAvancoListaLinhas = 0.04
var PesoAvancoListaJuntas = 0.04
var PesoAvancoMemoriais = 0.04
var PesoAvancoSistemas = 0.55
var ProgressoGlobal = 0
var DadosProg

var Cores = ["#00e676", "#689f38", "#00bfa5", "#00e5ff", "#0091ea",  "#0d47a1","#6200ea", "#d500f9", "#880e4f", "#d50000", "#ff6f00", "#3e2723", "#212121", "#c6ff00", "#4db6ac"]
var CoresCrescentes = ["rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)", "rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)", "rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)", "rgb(253, 244, 51)", "rgb(167, 252, 62)", "rgb(51, 183, 170)", "rgb(52, 169, 220)", "rgb(52, 117, 181)", "rgb(138, 106, 174)", "rgb(184, 104, 175)", "rgb(234, 101, 173)", "rgb(242, 71, 81)", "rgb(247, 140, 81)", "rgb(251, 164, 80)", "rgb(255, 205, 68)"]
var ActiveOS;
var StatusPendFlex
window.onload = async function ()
{
    $("#style_switcher").hide();
    var Hoje = new Date()
    var Data4Semanas = new Date()
    Data4Semanas.setDate(Data4Semanas.getDate() - 28)
    $("#DataInicial").val(Data4Semanas.toISOString().split('T')[0])
    $("#DataFinal").val(Hoje.toISOString().split('T')[0])
    OS = $("#OS").html();
    ActiveOS = (await GetActiveOSFilt())[0];
    LinhasOS = await GetLinhasOS(OS)
    PreencherFiltroArea(LinhasOS);
    SistemasOS = await GetSistemasOS(OS)
    Statuses = await GetStatuses();
    SystemFlexTime = await GetSystemFlexTimeOS(OS)
    WorkSystemFlex = await GetWorkSystemFlexOS(OS)
    HourPersonFlex = await GetHourPersonFlexOS(OS)
    Person = await GetPersons()
    PipeFlexTime = await GetPipeFlexTime(OS)
    PendencyFlexOS = await GetPendencyFlexOS(OS)
    PendencyFlexLogsOS = await GetPendencyFlexLogsOS(OS)
    StatusPendFlex = await RetornaStatusPendencyFlex()
    HourPersonAtividade = await GetHourPersonAtividade()
    AtividadesFlex = (await GetAtividadesDash(OS))[0]
    
    AplicarFiltro();
    
    $("#loaderGERAL").hide();
    $("#PaginaToda").show();
    AplicarFiltro();
};
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
function RetornaSistema(Linha)
{
    for(var i= 0; i < SistemasOS.length; i++)
    {
        if(SistemasOS[i].tb_sf_id == Linha.tb_pf_id_sf)
        {
            return SistemasOS[i].tb_sf_name
        }
    }
}
async function MostrarModalGraficoIndiceQualidade()
{
    var Hoje = new Date()
    var Data4Semanas = new Date()
    Data4Semanas.setDate(Data4Semanas.getDate() - 28)
    $("#DataInicialQualidade").val(Data4Semanas.toISOString().split('T')[0])
    $("#DataFinalQualidade").val(Hoje.toISOString().split('T')[0])
    await CriarGraficoIndiceQualidade(global=true);

    $("#ModalGraficosQualidade").modal("show");
}
async function MostrarModalGraficoIndiceQualidadeFiltro()
{
    var Hoje = new Date()
    var Data4Semanas = new Date()
    Data4Semanas.setDate(Data4Semanas.getDate() - 28)
    $("#DataInicialQualidade").val(Data4Semanas.toISOString().split('T')[0])
    $("#DataFinalQualidade").val(Hoje.toISOString().split('T')[0])
    await CriarGraficoIndiceQualidade();

    $("#ModalGraficosQualidade").modal("show");
}
async function CriarGraficoIndiceQualidade(global=false)
{
    $("#ErrosDataQualidade").html("");
    
    $("#loaderGraficosIndicadores").show();
    var DataInicial = convertDateToUTC(new Date($("#DataInicialQualidade").val()))
    var DataFinal = convertDateToUTC(new Date($("#DataFinalQualidade").val()))
    if (DataFinal < DataInicial)
    {
        $("#ErrosDataQualidade").html(`<div class="alert alert-danger" role="alert">
            A data final deve ser maior que a inicial!
            </div>`)
        $("#loaderGraficosIndicadores").hide();
    }
    else
    {
        var SistemasFiltro = []
        if (AreasSelecionadas.length == 0 || global) // nenhum filtro aplicado ou está calculando o índice global
        {
            for (var i = 0; i < LinhasOS.length; i++)
            // laço por todas as linhas de Flexibilidade de OS
            {
                Sistema = RetornaSistema(LinhasOS[i])                
                if (!SistemasFiltro.includes(Sistema) && !Sistema.toLowerCase().includes('cancelado')) SistemasFiltro.push(Sistema)
                    // Carrega os sistemas filtrados, mas não o sistema "Cancelado"
            }
        }
        else
        {
            for (var i = 0; i < LinhasOS.length; i++)
            {
                if (AreasSelecionadas.includes(LinhasOS[i].tb_pf_area) || (!LinhasOS[i].tb_pf_area) && AreasSelecionadas.includes(TextoEmBranco))
                {
                    Sistema = RetornaSistema(LinhasOS[i])
                    if (!SistemasFiltro.includes(Sistema) && !Sistema.toLowerCase().includes('cancelado')) SistemasFiltro.push(Sistema)
                        // Carrega os sistemas filtrados, mas não o sistema "Cancelado"
                }
            }
        }

        var Datas = RetornaDatasMenosSeteDias(DataInicial, DataFinal);

        var NotasQualidadePorData = []
        for (var i = 0; i < Datas.length; i++)
        {
            var Dados = { "Data": Datas[i], "Nota": RetornaNotaPorData(Datas[i], SistemasFiltro) };
            NotasQualidadePorData.push(Dados);
        }


        var ValoresNota = []
        var ValoresMeta = []
        for (var i = 0; i < NotasQualidadePorData.length; i++)
        {
            ValoresNota.push({ x: NotasQualidadePorData[i].Data, y: NotasQualidadePorData[i].Nota })
            ValoresMeta.push({ x: NotasQualidadePorData[i].Data, y: ActiveOS.tb_faso_meta_qualidade })
            
        }

        var SFNota = {
            label: 'Nota',
            data: ValoresNota,
            backgroundColor: "rgba(0,255,128,0.5)",
            borderColor: "#009900",
            fill: true,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth: '2'
        }
        var SFMeta = {
            label: 'Meta',
            data: ValoresMeta,
            backgroundColor: "rgba(255,71,71,0.61)",
            borderColor: "#FF4747",
            fill: true,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth: '2'
        }

        var ContainerGrafico = document.getElementById("GraficoIndicadoresQualidade")
        ContainerGrafico.innerHTML = ""
        var Canvas = document.createElement('canvas');
        Canvas.style.width = "50%"
        Canvas.style.height = "250px"
        Canvas.height = "250px"
        ContainerGrafico.append(Canvas)


        var chart = new Chart(Canvas, {
            type: 'line',
            data: { datasets: [SFNota, SFMeta ] },
            options:
            {
                interaction: {
                    intersect: false,
                    mode: 'index',
                },
                plugins:
                {
                    title:
                    {
                        display: true,
                        text: global ? "Evolução do Índice Global de Qualidade" : "Evolução do Índice de Qualidade das Áreas Filtradas",
                        font: {
                            size: 14
                        },
                        color: "#000000"
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItems, data)
                            {
                               
                                    return (tooltipItems.dataset.label + ": " + tooltipItems.formattedValue + "%")
                                
                            },
                            title: function (tooltipItems, data)
                            {
                                var DataDados = tooltipItems[0].dataset.data[tooltipItems[0].dataIndex].x
                                return DataDados.getUTCDate() + "/" + parseInt(DataDados.getUTCMonth() + 1) + "/" + DataDados.getUTCFullYear()
                            },
                        }
                    },
                },

                scales:
                {
                    x:
                    {
                        type: 'timeseries',
                        ticks: {
                            source: 'data'
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });

    }
    $("#loaderGraficosIndicadores").hide();
}
function RetornaNotaPorData(Data, SistemasFiltro)
{
    var WorkSystems = [];
    for (var i = 0; i < SistemasFiltro.length; i++)
    {
        //Procurar o sistema calculado com a revisão mais alta abaixo desta data
        var SistemaUltimaRev = RetornaSistemaUltimaRevisao(SistemasFiltro[i], Data);
        if (SistemaUltimaRev)
        {
            var DadosWSF = RetornaDadosWorkSystemIDSistema(SistemaUltimaRev.tb_sf_id);
            if (DadosWSF)
            {
                WorkSystems.push(DadosWSF);
            }
        }
    }
    var TotalNota = 0;
    for (var i = 0; i < WorkSystems.length; i++)
    {
        var NotaSUS = 0;
        var NotaEXP = 0;
        var NotaF1 = 0;
        var PesoSUS = 3;
        var PesoEXP = 2;
        var PesoF1 = 1;
        if (WorkSystems[i].tb_wsf_sus <= 60)
        {
            NotaSUS = 2;
        }
        else if (WorkSystems[i].tb_wsf_sus < 70 && WorkSystems[i].tb_wsf_sus > 60)
        {
            NotaSUS = 1;
        }

        if (WorkSystems[i].tb_wsf_exp <= 90)
        {
            NotaEXP = 2;
        }
        else if (WorkSystems[i].tb_wsf_exp < 95 && WorkSystems[i].tb_wsf_exp > 90)
        {
            NotaEXP = 1;
        }

        if (WorkSystems[i].tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia)
        {
            NotaF1 = 2;
        }
        else if (WorkSystems[i].tb_wsf_freq_1 < ActiveOS.tb_faso_meta_frequencia && WorkSystems[i].tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia - 1)
        {
            NotaF1 = 1;
        }
        NotaSUS *= PesoSUS;
        NotaEXP *= PesoEXP;
        NotaF1 *= PesoF1;
        TotalNota += (NotaSUS + NotaEXP + NotaF1) / 12;
    }
    var NotaQualidade = (Math.round(TotalNota * 1000 / WorkSystems.length) / 10);
    if (isNaN(NotaQualidade)) NotaQualidade = 0;
    return NotaQualidade;
}
function RetornaSistemaUltimaRevisao(NomeSistema, Data)
{
    var SistemasRetornar = [];
    for (var i = 0; i < SistemasOS.length; i++)
    {
        if (SistemasOS[i].tb_sf_name == NomeSistema)
        {
            SistemasRetornar.push(SistemasOS[i]);
        }
    }
    SistemasRetornar.sort(function (a, b)
    {
        let x = b.tb_sf_rev,
            y = a.tb_sf_rev;
        return x == y ? 0 : x > y ? 1 : -1;
    });
    for (var i = 0; i < SistemasRetornar.length; i++)
    {
        var Status = RetornaDataStatusEHoras(SistemasRetornar[i], StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4);
        if (Status[3])
        {
            var DataCalc = new Date(new Date(Status[3]).toUTCString());
            if (DataCalc <= Data)
            {
                return SistemasRetornar[i];
            }
        }
    }
    return null;
    
}
function RetornaDatasMenosSeteDias(DataInicial, DataFinal)
{
    var DatasRetornar = []
    DatasRetornar.push(DataFinal);
    var DataNova = new Date(new Date(DataFinal).toUTCString());
    DataNova.setDate(DataNova.getDate() - 7);
    while (DataNova > DataInicial)
    {
        DatasRetornar.push(new Date(DataNova));
        DataNova.setDate(DataNova.getDate() - 7)
    }
    if (DatasRetornar[DatasRetornar.length - 1] != DataInicial)
    {
        DatasRetornar.push(DataInicial)
    }
    return DatasRetornar;
    
}
function PreencherDados()
{
 $("#loaderFiltros").show();
    QtdLinhasF0 = 0;
    QtdLinhasF1 = 0;
    QtdLinhasF1R = 0;
    QtdLinhasF2 = 0;
    QtdLinhasF3 = 0;
    QtdLinhasF4 = 0;
    QtdLinhasF0SemFiltro = 0;
    QtdLinhasF1SemFiltro = 0;
    QtdLinhasF1RSemFiltro = 0;
    QtdLinhasF2SemFiltro = 0;
    QtdLinhasF3SemFiltro = 0;
    QtdLinhasF4SemFiltro = 0;


    var LinhasFiltradas = []
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
    var SistemasFiltro = []
    var SistemasCancelados = []
    var LinhasCanceladas = []
    if(AreasSelecionadas.length == 0) // nenhum filtro aplicado
    {
        for(var i = 0;i < LinhasOS.length; i++)
        {
            var Sistema = RetornaSistema(LinhasOS[i])
            if(!Sistema.toLowerCase().includes("cancelado")) // Se a linha não estiver no sistema cancelado [Sistemas com as linhas que foram canceladas]
            {
                Sistema = RetornaSistema(LinhasOS[i])
                LinhasFiltradas.push(LinhasOS[i])
                if(!SistemasFiltro.includes(Sistema)) SistemasFiltro.push(Sistema);
                if(LinhasOS[i].tb_pf_id_st == StatusF0.tb_st_id) QtdLinhasF0++;
                if(LinhasOS[i].tb_pf_id_st == StatusF1.tb_st_id) QtdLinhasF1++;
                if(LinhasOS[i].tb_pf_id_st == StatusF1R.tb_st_id) QtdLinhasF1R++;
                if(LinhasOS[i].tb_pf_id_st == StatusF2.tb_st_id) QtdLinhasF2++;
                if(LinhasOS[i].tb_pf_id_st == StatusF3.tb_st_id) QtdLinhasF3++;
                if (LinhasOS[i].tb_pf_id_st == StatusF4.tb_st_id) QtdLinhasF4++;
            }
            else  // linhas canceladas
            {
                LinhasCanceladas.push(LinhasOS[i])
            }
        }
        // Laço para mapear os sistemas que foram cancelados
        // Sistemas cancelados só aparecem quando não está aplicado nenhum filtro de área
        // Procurar última revisão do sistema e ver quantas linhas tem, se for zero é um sistema cancelado. Marcar as revisões anteriores (se tiver) como canceladas também.
        var SistemasCanceladosTemp = []
        var SistemasCancelados = []
        var SistemasUltimaRev = []
        for (var i = 0; i < SistemasOS.length; i++)
        {
            // for para pegar a última revisão de cada sistema
            var QtdLinhas = RetornaQtdLinhasSistema(SistemasOS[i].tb_sf_id)
            var Achou = false
            for (var j = 0; j < SistemasUltimaRev.length; j++)
            {
                if (SistemasUltimaRev[j].Sistema == SistemasOS[i].tb_sf_name && SistemasUltimaRev[j].Rev < SistemasOS[i].tb_sf_rev)
                {
                    Achou = true
                    SistemasUltimaRev[j].Rev = SistemasOS[i].tb_sf_rev
                    SistemasUltimaRev[j].QtdLinhas = QtdLinhas
                    break
                }
            }
            if (Achou == false)
            {
                SistemasUltimaRev.push({"Sistema": SistemasOS[i].tb_sf_name, "Rev": SistemasOS[i].tb_sf_rev, "QtdLinhas": QtdLinhas})
            }
        }
        for (var i = 0; i < SistemasUltimaRev.length; i++){
            if (SistemasUltimaRev[i].QtdLinhas == 0){
                // Se a última revisão do sistema não tem linhas associadas significa que foi cancelado.
                if(!SistemasCanceladosTemp.includes(SistemasUltimaRev[i].Sistema)) {
                    SistemasCanceladosTemp.push(SistemasUltimaRev[i].Sistema)
                }
            }
        }
        for (var i = 0; i < SistemasOS.length; i++){
            // Laço para criar lista de sistemas cancelados completa, incluindo revisões anteriores
            if (SistemasCanceladosTemp.includes(SistemasOS[i].tb_sf_name)){
                SistemasCancelados.push(SistemasOS[i])
            }
        }
    }
    else
    {
        for(var i = 0;i < LinhasOS.length; i++)
        {
            if((AreasSelecionadas.includes(LinhasOS[i].tb_pf_area) || (!LinhasOS[i].tb_pf_area) && AreasSelecionadas.includes(TextoEmBranco)))
            {
                Sistema = RetornaSistema(LinhasOS[i])
                if(!Sistema.toLowerCase().includes("cancelado")) // Se a linha não estiver no sistema cancelado [Sistemas com as linhas que foram canceladas]
                {
                    LinhasFiltradas.push(LinhasOS[i])
                    if(!SistemasFiltro.includes(Sistema)) SistemasFiltro.push(Sistema);
                    if(LinhasOS[i].tb_pf_id_st == StatusF0.tb_st_id) QtdLinhasF0++;
                    if(LinhasOS[i].tb_pf_id_st == StatusF1.tb_st_id) QtdLinhasF1++;
                    if(LinhasOS[i].tb_pf_id_st == StatusF1R.tb_st_id) QtdLinhasF1R++;
                    if(LinhasOS[i].tb_pf_id_st == StatusF2.tb_st_id) QtdLinhasF2++;
                    if(LinhasOS[i].tb_pf_id_st == StatusF3.tb_st_id) QtdLinhasF3++;
                    if(LinhasOS[i].tb_pf_id_st == StatusF4.tb_st_id) QtdLinhasF4++;
                }
                else  // linhas canceladas
                {
                    LinhasCanceladas.push(LinhasOS[i])
                }
            }
        }
    }

    var LinhasSemFiltros = []
    // Total de linhas do projeto sem as linhas canceladas. Usadas para calcular o índice global de qualidade key: globals=true
    for(var i = 0;i < LinhasOS.length; i++)
        {
            var Sistema = RetornaSistema(LinhasOS[i])
            if(!Sistema.toLowerCase().includes("cancelado")) // Se a linha não estiver no sistema cancelado [Sistemas com as linhas que foram canceladas]
            {
                Sistema = RetornaSistema(LinhasOS[i])
                LinhasSemFiltros.push(LinhasOS[i])
                if(LinhasOS[i].tb_pf_id_st == StatusF0.tb_st_id) QtdLinhasF0SemFiltro++;
                if(LinhasOS[i].tb_pf_id_st == StatusF1.tb_st_id) QtdLinhasF1SemFiltro++;
                if(LinhasOS[i].tb_pf_id_st == StatusF1R.tb_st_id) QtdLinhasF1RSemFiltro++;
                if(LinhasOS[i].tb_pf_id_st == StatusF2.tb_st_id) QtdLinhasF2SemFiltro++;
                if(LinhasOS[i].tb_pf_id_st == StatusF3.tb_st_id) QtdLinhasF3SemFiltro++;
                if (LinhasOS[i].tb_pf_id_st == StatusF4.tb_st_id) QtdLinhasF4SemFiltro++;

            }
        }
    // Pegar quantidades de estudos realizados e meta

    QtdCriteriosRealizados = AtividadesFlex.criterios
    QtdEstudosRealizados = AtividadesFlex.estudos
    QtdListaMolasRealizados = AtividadesFlex.lista_molas
    QtdIndiceLinhasRealizados = AtividadesFlex.lista_linhas
    QtdListaJuntasRealizados = AtividadesFlex.lista_juntas
    QtdMemoriaisRealizados = AtividadesFlex.memoriais
    QtdCriteriosMeta = ActiveOS.tb_faso_meta_criterios
    QtdEstudosMeta = ActiveOS.tb_faso_meta_estudos
    QtdListaMolasMeta = ActiveOS.tb_faso_meta_lista_molas
    QtdIndiceLinhasMeta = ActiveOS.tb_faso_meta_lista_linhas
    QtdListaJuntasMeta = ActiveOS.tb_faso_meta_lista_juntas
    QtdMemoriaisMeta = ActiveOS.tb_faso_meta_memoriais

    // TODO:
    // [X] Verificar se número de atividades é maior que meta. Caso positivo, atualizar a meta
    let MetasAtualizar = false

    if (QtdCriteriosRealizados > QtdCriteriosMeta){
        QtdCriteriosMeta =  QtdCriteriosRealizados
        MetasAtualizar = true
    }
    if (QtdEstudosRealizados > QtdEstudosMeta){
        QtdEstudosMeta = QtdEstudosRealizados
        MetasAtualizar = true
    }
    if (QtdListaMolasRealizados > QtdListaMolasMeta){
        QtdListaMolasMeta = QtdListaMolasRealizados
        MetasAtualizar = true
    }
    if (QtdIndiceLinhasRealizados > QtdIndiceLinhasMeta){
        QtdIndiceLinhasMeta = QtdIndiceLinhasRealizados
        MetasAtualizar = true
    }
    if (QtdListaJuntasRealizados > QtdListaJuntasMeta){
        QtdListaJuntasMeta = QtdListaJuntasRealizados
        MetasAtualizar = true
    }
    if (QtdMemoriaisRealizados > QtdMemoriaisMeta){
        QtdMemoriaisMeta = QtdMemoriaisRealizados
        MetasAtualizar = true
    }

    if (MetasAtualizar){
        AtualizarMetas()

    }


    TotalAtividadesMetas = QtdLinhasF0 + QtdLinhasF1 + QtdLinhasF1R + QtdLinhasF2 +  QtdLinhasF3 + QtdLinhasF4;
    PreencherTabelaStatusLinhas(QtdLinhasF0, QtdLinhasF1,QtdLinhasF1R, QtdLinhasF2, QtdLinhasF3, QtdLinhasF4, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4, LinhasSemFiltros.length);
    PreencherGraficoProgresso(QtdLinhasF0, QtdLinhasF1,QtdLinhasF1R, QtdLinhasF2, QtdLinhasF3, QtdLinhasF4);
    CriarTabelaDetalhesSistemas(SistemasFiltro, SistemasCancelados, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
    CriarGraficoHorasLinhaRev(SistemasFiltro, SistemasCancelados, StatusF3, StatusF4, LinhasFiltradas)
    CriarListaLinhas(LinhasFiltradas, LinhasCanceladas, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
    CriarIndicadorQualidade(LinhasFiltradas, StatusF3, StatusF4)
    CriarIndicadorQualidade(LinhasSemFiltros, StatusF3, StatusF4, global=true) // Cria o indicador de qualidade para todas as linhas calculadas independente do filtro aplicado
    $("#AtividadeRealizada").html(QtdLinhasF3 + QtdLinhasF4)
    $("#AtividadeRealizadaTexto").html('Linhas Calculadas')
    $("#TotalAtividades").html(QtdLinhasF0 + QtdLinhasF1 + QtdLinhasF1R + QtdLinhasF2 + QtdLinhasF3 + QtdLinhasF4)
    $("#TotalAtividadesTexto").html('Total de Linhas')
    $("#loaderFiltros").hide();
    CriarGraficoStatusSemana()
}
function AtualizarMetas(){
    // Função para atualizar o número de MetasAtualizar, caso o número de atividades realizadas for maior
    const csrf = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "AtualizarAtividades", "IDOSActive": ActiveOS.tb_faso_id, "metaCriterios": QtdCriteriosMeta, "metaEstudos": QtdEstudosMeta, "metaListaMolas": QtdListaMolasMeta, "metaListaLinhas": QtdIndiceLinhasMeta, "metaListaJuntas": QtdListaJuntasMeta, "metaMemoriais": QtdMemoriaisMeta, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await RecarregarPagina()
            $("#loaderAtividades").hide()
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {
            erro = xhr.responseJSON.error
            erro.forEach(item => {
                $('#' + item).addClass('aviso_erro')
            })

            $("#ErrosAtividades").html(`<div class="alert alert-danger" role="alert">O número(s) de atividades informado(s) é(são) menor(es) que os já executados!</div>`)
            setTimeout(() => {
                $("#ErrosAtividades").html('')
            }, 3000)

            $("#loaderAtividades").hide()

        }
    });

}

function AtualizarGraficos(botao) {

    // TODO:
    // [X] fazer o update do gráfico
    // [X] Atualizar gráfico Staus e avanços
     
    // Loop pelos filhos (apenas elementos)
    for (let filho of botao.parentElement.parentElement.children) {
        filho.children[0].classList.remove('btn-light-mod-clicado')
    }
    botao.classList.add('btn-light-mod-clicado')
    
    let atividade = botao.title
    let atividades_realizadas = 0
    let atividades_meta = 0
    let atividades_realizadas_texto = ''
    let atividades_meta_texto = ''
    let grafico_texto = ''
    
    switch (atividade){
        // Atualizar gráficos com base nos botões apertados
        case 'Critérios':   
            atividades_realizadas = QtdCriteriosRealizados
            atividades_meta = QtdCriteriosMeta
            grafico_texto = "Critérios"
            atividades_realizadas_texto = "Critérios Desenvolvidos"
            atividades_meta_texto = "Total de Critérios"
            break
        case 'Estudos':
            atividades_realizadas = QtdEstudosRealizados
            atividades_meta = QtdEstudosMeta
            grafico_texto = "Estudos"
            atividades_realizadas_texto = "Estudos Realizados"
            atividades_meta_texto = "Total de Estudos"
                break
        case 'Lista de Suporte de Mola':
            atividades_realizadas = QtdListaMolasRealizados
            atividades_meta = QtdListaMolasMeta
            grafico_texto = "Lista de Sup. de Molas"
            atividades_realizadas_texto = "Lista de Sup. de Molas Desenvolvidas"
            atividades_meta_texto = "Total de Listas de Suporte de Molas"
            break
        case 'Índice de Linhas para Análise de Flexibilidade':
            atividades_realizadas = QtdIndiceLinhasRealizados
            atividades_meta = QtdIndiceLinhasMeta
            atividades_realizadas_texto = "Índices de Linhas Desenvolvidos"
            grafico_texto = "Índices de Linhas"
            atividades_meta_texto = "Total de Índices de Linhas"
            break
        case 'Lista de Juntas de Expansão':
            atividades_realizadas = QtdListaJuntasRealizados
            atividades_meta = QtdListaJuntasMeta
            grafico_texto = "Listas de Juntas"
            atividades_realizadas_texto = "Listas de Juntas Desenvolvidas"
            atividades_meta_texto = "Total de Listas de Juntas de Expansão"
            break
        case 'Memorial de Cálculo':
            atividades_realizadas = QtdMemoriaisRealizados
            atividades_meta = QtdMemoriaisMeta
            grafico_texto = "Memoriais de Cálculo"
            atividades_realizadas_texto = "Memoriais de Cálculo Desenvolvidos"
            atividades_meta_texto = "Total de Memoriais de Cálculos"
            break
        case 'Análise de Flexibilidade':
            document.getElementById('graficoProgressoTexto').innerHTML = "Análise de Flexibilidade"
            PreencherDados()
            return

    }
    
    chartGraficoProgresso.reset('')

    document.getElementById('AtividadeRealizada').innerHTML = atividades_realizadas
    document.getElementById('TotalAtividades').innerHTML = atividades_meta
    document.getElementById('graficoProgressoTexto').innerHTML = grafico_texto
    document.getElementById('AtividadeRealizadaTexto').innerHTML = atividades_realizadas_texto
    document.getElementById('TotalAtividadesTexto').innerHTML = atividades_meta_texto
    chartGraficoProgresso.config.data.datasets[0].data = [atividades_realizadas, atividades_meta - atividades_realizadas]
    chartGraficoProgresso.config.data.datasets[0].label = atividades_meta_texto
    chartGraficoProgresso.config.data.labels = [atividades_realizadas_texto, grafico_texto + ' Faltantes']
    TotalAtividadesMetas = atividades_meta
    
    chartGraficoProgresso.update('')

    chartStatusEavancos.reset()

    var CoresBackground = ["#e7eb9d", "#6e90fa", "#444e4a", "#f58c32"]

    chartStatusEavancos.data.datasets[0].backgroundColor = CoresBackground
    chartStatusEavancos.config.data.labels = [grafico_texto + ' Faltantes', atividades_realizadas_texto, 'Avanço ' + grafico_texto, 'Avanço Global']
    DadosProg = [
        // Verificar se os valores são nulo (0), caso positivo colocar um número bem pequeno para aparecer no gráfico.
        (atividades_meta - atividades_realizadas) > 0 ? atividades_meta - atividades_realizadas : 0.0001, 
        atividades_realizadas > 0 ? atividades_realizadas : 0.0001, 
        (atividades_realizadas / atividades_meta) > 0 ? (atividades_realizadas / atividades_meta) * 100 : 0.0001, 
        ProgressoGlobal > 0 ? ProgressoGlobal : 0.0001
    ]


    // O valor máximo para o eixo Y (100% é o máximo para a porcentagem)
    var maxPercentageValue = 100;

    // Max value de número absoluto (como "número de linhas")
    var maxAbsoluteValue = Math.max(...DadosProg, maxPercentageValue);  // Pegando o maior valor absoluto

    // Criando os dados normalizados para o gráfico (0-100)
    var normalizedData = DadosProg.map(function(value) {
        if (value <= 100) {
            // Se for porcentagem (menor ou igual a 100), não precisa normalizar
            return value;
        } else {
            // Se for valor absoluto maior que 100, normaliza para uma escala de 0 a 100
            return (value / maxAbsoluteValue) * 100;
        }
    });
    chartStatusEavancos.config.data.datasets[0].data = normalizedData    

    chartStatusEavancos.config.data.datasets[0].barThickness = 20

    chartStatusEavancos.update()


}

function CriarIndicadorQualidade(LinhasFiltradas, StatusF3, StatusF4, global=false)
{
    var WorkSystems = [];
    var IDsWSFProcessados = [];
    for (var i = 0; i < LinhasFiltradas.length; i++)
    {
        var SistemaRef = RetornaSistemaPorId(LinhasFiltradas[i].tb_pf_id_sf);
        var NomeSistema = SistemaRef.tb_sf_name;
        var RevisaoAtual = SistemaRef.tb_sf_rev;
        while (RevisaoAtual >= 0)
        {
            var Sistema;
            for (var j = 0; j < SistemasOS.length; j++)
            {
                if (SistemasOS[j].tb_sf_name == NomeSistema && SistemasOS[j].tb_sf_rev == RevisaoAtual)
                {
                    Sistema = SistemasOS[j];
                    break;
                }
            }

            var Status = RetornaIDStatusSistema(Sistema.tb_sf_id);
            if (Status == StatusF3.tb_st_id || Status == StatusF4.tb_st_id)
            {
                var DadosWSF = RetornaDadosWorkSystemIDSistema(Sistema.tb_sf_id);
                if (!IDsWSFProcessados.includes(DadosWSF.tb_wsf_id))
                {
                    IDsWSFProcessados.push(DadosWSF.tb_wsf_id);
                    WorkSystems.push(DadosWSF);
                }
                break;
            }
            else
            {
                RevisaoAtual -= 1;
                continue;
               
            }
        }
    }
    var TotalNota = 0;
    for (var i = 0; i < WorkSystems.length; i++)
    {
        var NotaSUS = 0;
        var NotaEXP = 0;
        var NotaF1 = 0;
        var PesoSUS = 3;
        var PesoEXP = 2;
        var PesoF1 = 1;
        if (WorkSystems[i].tb_wsf_sus <= 60)
        {
            NotaSUS = 2;
        }

        else if (WorkSystems[i].tb_wsf_sus < 70 && WorkSystems[i].tb_wsf_sus > 60)

        {
            NotaSUS = 1;
        }

        if (WorkSystems[i].tb_wsf_exp <= 90)
        {
            NotaEXP = 2;
        }

        else if (WorkSystems[i].tb_wsf_exp < 95 && WorkSystems[i].tb_wsf_exp > 90)
        {
            NotaEXP = 1;
        }



        if (WorkSystems[i].tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia)
        {
            NotaF1 = 2;
        }
        else if (WorkSystems[i].tb_wsf_freq_1 < ActiveOS.tb_faso_meta_frequencia && WorkSystems[i].tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia - 1)
        {
            NotaF1 = 1;
        }
        NotaSUS *= PesoSUS;
        NotaEXP *= PesoEXP;
        NotaF1 *= PesoF1;
        TotalNota += (NotaSUS + NotaEXP + NotaF1) / 12;
    }
    var NotaQualidade = (Math.round(TotalNota * 1000 / WorkSystems.length) / 10);
    //var MetaQualidade = ActiveOS.tb_faso_meta_qualidade;
    if (isNaN(NotaQualidade)) NotaQualidade = 0;

    if (global){
        var IndiceQualidadeCardTitulo = document.getElementById("IndiceQualidadeCard");
        $("#IndiceQualidadeCard").html(NotaQualidade + "%")
        $("#IndiceQualidadeCard").prop('title', "");
        if (NotaQualidade > ActiveOS.tb_faso_meta_qualidade)
        {
            IndiceQualidadeCardTitulo.style.color = "#42d100";
            $("#IndiceQualidadeCard").prop('title', `Índice de qualidade acima da meta de ${ActiveOS.tb_faso_meta_qualidade}%`);
        }
        else
        {
            IndiceQualidadeCardTitulo.style.color = "#e32705";
            $("#IndiceQualidadeCard").prop('title', `Índice de qualidade abaixo da meta de ${ActiveOS.tb_faso_meta_qualidade}%`);
        }
    } else{
        var IndiceQualidadeCardFiltroTitulo = document.getElementById("IndiceQualidadeCardFiltro");
        $("#IndiceQualidadeCardFiltro").html(NotaQualidade + "%")
        $("#IndiceQualidadeCardFiltro").prop('title', "");
        if (NotaQualidade > ActiveOS.tb_faso_meta_qualidade)
        {
            IndiceQualidadeCardFiltroTitulo.style.color = "#42d100";
            $("#IndiceQualidadeCardFiltro").prop('title', `Índice de qualidade acima da meta de ${ActiveOS.tb_faso_meta_qualidade}%`);
        }
        else
        {
            IndiceQualidadeCardFiltroTitulo.style.color = "#e32705";
            $("#IndiceQualidadeCardFiltro").prop('title', `Índice de qualidade abaixo da meta de ${ActiveOS.tb_faso_meta_qualidade}%`);
        }
    }
}

function convertDateToUTC(date) { return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()); }
function weeksBetween(d1, d2) {
    return Math.round((d2 - d1) / (7 * 24 * 60 * 60 * 1000));
}
function FiltrarStatusXSemana()
{
    CriarGraficoStatusSemana()
}
function ProcessarData(PipeFlexFiltrado, DataAtual)
{
    DataAtual = new Date(DataAtual.getTime() + 24 * 60* 60 * 1000)
    var Linhas = []
    for(var i = 0; i < PipeFlexFiltrado.length; i++)
    {
        var Status = RetornaStatus(PipeFlexFiltrado[i].tb_pft_id_st)
        var Data = new Date(PipeFlexFiltrado[i].tb_pft_time_update)
        Data = new Date(Data.toUTCString())
        var DataUpdate = new Date(PipeFlexFiltrado[i].tb_pft_time_update);
        DataUpdate = new Date(DataUpdate.toUTCString());
        if (Data <= (DataAtual))
        // TODO: SE CONTINUAR COM DIVERGÊNCIA ENTRE AVANÇOS FAZER LÓGICA PARA VERIFICAR STATUS ESTÁ NA ÚLTIMA DATA DISPONÍVEL NO BD
        {
            var Achou = false;
            for(var j= 0; j < Linhas.length; j++)
            {
                if(Linhas[j].IDLinha == PipeFlexFiltrado[i].tb_pft_id_pf)
                {
                    Achou = true;
                    if (Linhas[j].Data < DataUpdate)
                    {
                        Linhas[j].Status = Status;
                        Linhas[j].Data = DataUpdate;
                    }
                    //if(Linhas[j].Status.tb_st_weitgh < Status.tb_st_weitgh)
                    //{
                    //    Linhas[j].Status = Status;
                    //}
                    //break;
                }
            }
            if(Achou == false)
            {
                Linhas.push({ "IDLinha": PipeFlexFiltrado[i].tb_pft_id_pf, "Status": Status, "Data": DataUpdate })
            }

        }

    }
    var QTDF0 = 0;
    var QTDF1 = 0;
    var QTDF1R = 0;
    var QTDF2 = 0;
    var QTDF3 = 0;
    var QTDF4 = 0;
    for(var i = 0; i < Linhas.length; i++)
    {
        if(Linhas[i].Status.tb_st_id == StatusF0.tb_st_id) QTDF0++;
        if(Linhas[i].Status.tb_st_id == StatusF1.tb_st_id) QTDF1++;
        if(Linhas[i].Status.tb_st_id == StatusF1R.tb_st_id) QTDF1R++;
        if(Linhas[i].Status.tb_st_id == StatusF2.tb_st_id) QTDF2++;
        if(Linhas[i].Status.tb_st_id == StatusF3.tb_st_id) QTDF3++;
        if(Linhas[i].Status.tb_st_id == StatusF4.tb_st_id) QTDF4++;
    }
    return {"Data": new Date(DataAtual), "F0": QTDF0, "F1": QTDF1, "F1R": QTDF1R, "F2": QTDF2, "F3": QTDF3, "F4": QTDF4}
}
function CriarGraficoStatusSemana()
{
    $("#ErrosData").html('')
    if($("#DataInicial").val() && $("#DataFinal").val())
    {

        var DataInicial = convertDateToUTC(new Date($("#DataInicial").val()))
        var DataFinal = convertDateToUTC(new Date($("#DataFinal").val()))
        if(DataFinal < DataInicial)
        {
            $("#ErrosData").html(`<div class="alert alert-danger" role="alert">
            A data final deve ser maior que a inicial!
            </div>`)
        }
        else
        {
            var PipeFlexFiltrado = [];
            if(AreasSelecionadas.length == 0) // nenhum filtro aplicado
            {
                for(var i = 0; i < PipeFlexTime.length; i++)
                {
                    for(var j = 0; j < LinhasOS.length; j++)
                    {
                        if(PipeFlexTime[i].tb_pft_id_pf == LinhasOS[j].tb_pf_id)
                        {
                            var Sistema = RetornaSistema(LinhasOS[j])
                            if(!Sistema.toLowerCase().includes("cancelado"))
                            {
                                PipeFlexFiltrado.push(PipeFlexTime[i])
                            }
                            break
                        }
                    }
                }
            }
            else
            {
                for(var i = 0; i < PipeFlexTime.length; i++)
                {
                    for(var j = 0; j < LinhasOS.length; j++)
                    {
                        if(PipeFlexTime[i].tb_pft_id_pf == LinhasOS[j].tb_pf_id)
                        {
                            var Sistema = RetornaSistema(LinhasOS[j])
                            if((AreasSelecionadas.includes(LinhasOS[j].tb_pf_area) || (!LinhasOS[j].tb_pf_area) && AreasSelecionadas.includes(TextoEmBranco)) && !Sistema.toLowerCase().includes("cancelado"))
                            {
                                PipeFlexFiltrado.push(PipeFlexTime[i])
                            }
                            break
                        }
                    }
                }
            }
            var Semanas = []
            if(DataInicial.getDay() != 1)
            {
                Semanas.push(ProcessarData(PipeFlexFiltrado, DataInicial))
                while(DataInicial.getDay() != 1)
                {
                    DataInicial.setDate(DataInicial.getDate() + 1)
                }
            }
            var DataAtual = new Date(DataInicial.getTime());

            while(DataAtual <= DataFinal)
            {
                Semanas.push(ProcessarData(PipeFlexFiltrado, DataAtual))
                DataAtual.setDate(DataAtual.getDate() + 7)

            }
            if(DataFinal.getDay() != 1)
            {
                Semanas.push(ProcessarData(PipeFlexFiltrado, DataFinal))
            }
            var DadosF0 = []
            var DadosF1 = []
            var DadosF1R = []
            var DadosF2 = []
            var DadosF3 = []
            var DadosF4 = []
            var ValoresF0 = []
            var ValoresF1 = []
            var ValoresF1R = []
            var ValoresF2 = []
            var ValoresF3 = []
            var ValoresF4 = []
            var ValoresProgresso = []
            var ValoresTotalLinhas = []
            for(var i = 0; i < Semanas.length; i++)
            {
                ValoresF0.push({x: Semanas[i].Data, y: Semanas[i].F0})
                ValoresF1.push({x: Semanas[i].Data, y: Semanas[i].F1})
                ValoresF1R.push({x: Semanas[i].Data, y: Semanas[i].F1R})
                ValoresF2.push({x: Semanas[i].Data, y: Semanas[i].F2})
                ValoresF3.push({x: Semanas[i].Data, y: Semanas[i].F3})
                ValoresF4.push({x: Semanas[i].Data, y: Semanas[i].F4})
                ValoresProgresso.push({x: Semanas[i].Data,y: (Semanas[i].F0 * StatusF0.tb_st_weitgh) + (Semanas[i].F1 * StatusF1.tb_st_weitgh) + (Semanas[i].F1R * StatusF1R.tb_st_weitgh) + (Semanas[i].F2 * StatusF2.tb_st_weitgh) + (Semanas[i].F3 * StatusF3.tb_st_weitgh) + (Semanas[i].F4 * StatusF4.tb_st_weitgh)})
                ValoresTotalLinhas.push({x: Semanas[i].Data, y: Semanas[i].F0 + Semanas[i].F1 + Semanas[i].F1R + Semanas[i].F2 + Semanas[i].F3 + Semanas[i].F4})
                DadosF0.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F0})
                DadosF1.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F1})
                DadosF1R.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F1R})
                DadosF2.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F2})
                DadosF3.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F3})
                DadosF4.push({"Semana": Semanas[i].Data, "Data": Semanas[i].F4})
            }

         var SF0 = {
            label: 'F0',
            data: ValoresF0,
            backgroundColor: "#e7eb9d",
            borderColor: "#e7eb9d",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SF1 = {
            label: 'F1',
            data: ValoresF1,
            backgroundColor: "#f8b65e",
            borderColor: "#f8b65e",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SF1R = {
            label: 'F1.1',
            data: ValoresF1R,
            backgroundColor: "#cea774",
            borderColor: "#cea774",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SF2 = {
            label: 'F2',
            data: ValoresF2,
            backgroundColor: "#ff6060",
            borderColor: "#ff6060",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SF3 = {
            label: 'F3',
            data: ValoresF3,
            backgroundColor: "#6efa75",
            borderColor: "#6efa75",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SF4 = {
            label: 'F4',
            data: ValoresF4,
            backgroundColor: "#6e90fa",
            borderColor: "#6e90fa",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var SFProgresso = {
            label: 'Avanço Sistemas',
            data: ValoresProgresso,
            backgroundColor: "#444e4a",
            borderColor: "#444e4a",
            fill: false,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: 'white',
            hoverBorderWidth : '5'
         }
         var ContainerGrafico = document.getElementById("GraficoStatusSemana")
         ContainerGrafico.innerHTML = ""
         var Canvas = document.createElement('canvas');
         Canvas.style.width = "50%"
         Canvas.style.height = "250px"
         Canvas.height = "250px"
         ContainerGrafico.append(Canvas)
         var chart = new Chart(Canvas, {
            type: 'line',
            data: {datasets: [SFProgresso, SF0, SF1, SF1R, SF2, SF3, SF4]},
            options:
            {
                interaction: {
                  intersect: false,
                  mode: 'index',
                },
                plugins:
                {
                    title:
                    {
                        display: true,
                        text: "Status X Semanas",
                        font: {
                            size: 14
                        },
                        color: "#000000"
                    },
                    tooltip: {
                        callbacks: {
                          label: function(tooltipItems, data) {
                                if(tooltipItems.datasetIndex === 0)
                                {
                                    // Calculo do avanço geral usando o total de linhas na data avaliada
                                    var Porcentagem = (Math.round((parseFloat(tooltipItems.formattedValue.replace(',','.'))*10000/ValoresTotalLinhas[tooltipItems.dataIndex].y))/100)
                                    if (isNaN(Porcentagem)){
                                        Porcentagem = 0
                                    }
                                    return SFProgresso.label + ": " + Porcentagem + "%"
                                }
                                else
                                {
                                    if(tooltipItems.formattedValue == 1){
                                        return(tooltipItems.dataset.label + ": " + tooltipItems.formattedValue + " Linha")
                                    }
                                    else{
                                        return(tooltipItems.dataset.label + ": " + tooltipItems.formattedValue + " Linhas")
                                    }
                                }
                            },
                            title: function(tooltipItems, data) {
                                    var DataDados = tooltipItems[0].dataset.data[tooltipItems[0].dataIndex].x
                                return DataDados.getUTCDate() + "/" + parseInt(DataDados.getUTCMonth()+1) + "/" + DataDados.getUTCFullYear()
                            },
                            footer: function(tooltipItems, data){
                                // Número total de linhas na data específica
                                if(ValoresTotalLinhas[tooltipItems[0].dataIndex].y == 1){
                                    return 'Total : ' + ValoresTotalLinhas[tooltipItems[0].dataIndex].y + ' Linha'
                                }
                                else{
                                    return 'Total : ' + ValoresTotalLinhas[tooltipItems[0].dataIndex].y + ' Linhas'
                                }
                            },
                        }
                      },
                },

                scales:
                {
                    x:
                    {
                        type: 'timeseries',
                        ticks:{
                            source: 'data'
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
            }
        });

            //console.log(Semanas)
            /*console.log(DadosF0)
            console.log(DadosF1)
            console.log(DadosF1R)
            console.log(DadosF2)
            console.log(DadosF3)
            console.log(DadosF4)*/

        }
    }
    else
    {
        $("#ErrosData").html(`<div class="alert alert-danger" role="alert">
        Preencha as datas corretamente!
        </div>`)
    }

}
function RetornaStatus(ID)
{
    for(var i = 0; i < Statuses.length; i++)
    {
        if(Statuses[i].tb_st_id == ID)
        {
            return Statuses[i];
        }

    }
    return null
}
function CriarListaLinhas(Pipes, PipesCanceladas, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
{

    var TabLinhas = document.getElementById("TabelaLinhas");
    TabLinhas.innerHTML = "";
    var myTableDiv = document.getElementById("TabelaLinhas");
    var fieldTitles = ["Sistema", "Linha", "Remark", "Status", "Area"  ]
    var table = document.createElement('TABLE');
    table.id = "TabelaLinhasT";
    table.classList.add("TabelaFlex");
    table.style.height="250px"
    let thead = document.createElement('thead');
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    let thr = document.createElement('tr');
    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
    });
    // let DivScr = document.createElement('td');
    // DivScr.appendChild(document.createTextNode(""));
    // thr.appendChild(DivScr);
    // DivScr.style.width = "16.5px"
    // DivScr.style.backgroundColor = "#343a40"
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);
    tableBody.setAttribute("style", "max-height: 380px; overflow-y: scroll;");

    //console.log(Pipes)

    for (var i = 0; i < Pipes.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        var Sistema = RetornaSistema(Pipes[i])
        tableBody.appendChild(tr);

        tr.onmouseover = function ()
        {
            this.style.backgroundColor = "#FF9A0080";
        }

        tr.onmouseleave = function ()
        {
            this.style.backgroundColor = 'white';
        }

        var tdSistema = document.createElement('TD');
        if(Sistema)
        {
            tdSistema.appendChild(document.createTextNode(Sistema));
        }
        else
        {
            tdSistema.appendChild(document.createTextNode(''));
        }

        tr.appendChild(tdSistema);

        var tdLinha = document.createElement('TD');
        if(Pipes[i].tb_pf_tag_flex)
        {
            tdLinha.appendChild(document.createTextNode(Pipes[i].tb_pf_tag_flex));
        }
        else
        {
            tdLinha.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdLinha);

        var tdRemark = document.createElement('TD');
        if(Pipes[i].tb_pf_remark)
        {
            tdRemark.appendChild(document.createTextNode(Pipes[i].tb_pf_remark));
        }
        else
        {
            tdRemark.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRemark);

        var Status = RetornaStatus(Pipes[i].tb_pf_id_st)

        var tdStatus = document.createElement('TD');

        if (Status)
        {
            tdStatus.appendChild(document.createTextNode(Status.tb_st_work_status));
        }
        else
        {
            tdStatus.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdStatus);

        var tdArea = document.createElement('TD');
        if(Pipes[i].tb_pf_area)
        {
            tdArea.appendChild(document.createTextNode(Pipes[i].tb_pf_area));
        }
        else
        {
            tdArea.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdArea);
    }
    if (PipesCanceladas){
        for (var i = 0; i < PipesCanceladas.length; i++)
        {
            var tr = document.createElement('TR');
            tr.style.display = "table"
            tr.style.tableLayout = "fixed"
            tr.style.color = "grey"
            tr.style.textDecoration = "line-through"
            var Sistema = RetornaSistema(PipesCanceladas[i])
            tableBody.appendChild(tr);

            tr.onmouseover = function ()
            {
                this.style.backgroundColor = "#FF9A0080";
            }

            tr.onmouseleave = function ()
            {
                this.style.backgroundColor = 'white';
            }

            var tdSistema = document.createElement('TD');
            if(Sistema)
            {
                tdSistema.appendChild(document.createTextNode(Sistema));
            }
            else
            {
                tdSistema.appendChild(document.createTextNode(''));
            }

            tr.appendChild(tdSistema);

            var tdLinha = document.createElement('TD');
            if(PipesCanceladas[i].tb_pf_tag_flex)
            {
                tdLinha.appendChild(document.createTextNode(PipesCanceladas[i].tb_pf_tag_flex));
            }
            else
            {
                tdLinha.appendChild(document.createTextNode(''));
            }
            tr.appendChild(tdLinha);

            var tdRemark = document.createElement('TD');
            if(PipesCanceladas[i].tb_pf_remark)
            {
                tdRemark.appendChild(document.createTextNode(PipesCanceladas[i].tb_pf_remark));
            }
            else
            {
                tdRemark.appendChild(document.createTextNode(''));
            }
            tr.appendChild(tdRemark);

            var Status = RetornaStatus(PipesCanceladas[i].tb_pf_id_st)

            var tdStatus = document.createElement('TD');

            if (Status)
            {
                tdStatus.appendChild(document.createTextNode(Status.tb_st_work_status));
            }
            else
            {
                tdStatus.appendChild(document.createTextNode(''));
            }
            tr.appendChild(tdStatus);

            var tdArea = document.createElement('TD');
            if(PipesCanceladas[i].tb_pf_area)
            {
                tdArea.appendChild(document.createTextNode(PipesCanceladas[i].tb_pf_area));
            }
            else
            {
                tdArea.appendChild(document.createTextNode(''));
            }
            tr.appendChild(tdArea);
        }
    }
    myTableDiv.appendChild(table);
        $('#TabelaLinhasT').excelTableFilter({captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' }});

}
function CriarTabelaDetalhesSistemas(SistemasFiltro, SistemasCancelados, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
{
    // TODO: 
    // [X] Mostrar sistemas cancelados (sem linhas) na tabela, fazer taxado indicando que o sistema não existe mais.
    // [X] Não mostrar sistemas cancelados quando aplicado filtro
    // [X] Mostrar sistemas com notas 0%

    $("#TabelaSistemas").html("")
    var SistemasFiltroRevisoes = []
    for(var i = 0; i < SistemasOS.length; i++)
    {
        var StatusAprovacaoPendency = RetornaAprovacaoPendencyFlexSistema(SistemasOS[i].tb_sf_id)
        if (StatusAprovacaoPendency == "ACEITO" || StatusAprovacaoPendency == "ATENDIDO" || SistemasOS[i].tb_sf_rev == 0){
            // Se é revisão com pendência não aparece no dashboard. Se é um sistema que nunca foi calculado aparece.
            if(SistemasFiltro.includes(SistemasOS[i].tb_sf_name))
            {
                SistemasFiltroRevisoes.push(SistemasOS[i])
            }
        }
    }
    SistemasFiltroRevisoes.sort(function (a, b) {
    let x = a.tb_sf_name.toUpperCase(),
        y = b.tb_sf_name.toUpperCase();
    return x == y ? 0 : x > y ? 1 : -1;
    });
    SistemasCancelados.sort(function (a, b) {
    let x = a.tb_sf_name.toUpperCase(),
        y = b.tb_sf_name.toUpperCase();
    return x == y ? 0 : x > y ? 1 : -1;
    });
    var DadosDetalhesSistemas = []
    var DadosDetalhesSistemasCancelados = []
    for(var i = 0; i < SistemasFiltroRevisoes.length; i++)
    {
        var WorkSysFlex = RetornaDadosWorkSystem(SistemasFiltroRevisoes[i])
        if(WorkSysFlex)
        {
           
            var NomeSistema = SistemasFiltroRevisoes[i].tb_sf_name;
            var Rev = SistemasFiltroRevisoes[i].tb_sf_rev;
            var QtdLinhas = WorkSysFlex.tb_wsf_total_lines
            var QtdLinhasCalculadas = WorkSysFlex.tb_wsf_calc_lines
            var RespProjetista = RetornaInicialUser(WorkSysFlex.tb_wsf_id_per_request)
            var RespFlex = RetornaInicialUser(WorkSysFlex.tb_wsf_id_per_resp_analyze)
            var Retrabalho = WorkSysFlex.tb_wsf_rework
            var Datas = RetornaDataStatusEHoras(SistemasFiltroRevisoes[i], StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
            var StatusAtual = StatusF0.tb_st_work_status
            var DataF1 = null;
            var DataF2 = null;
            var DataF3 = null;
            var DataF4 = null;
            if(Datas[0] != null)
            {
                DataF1 = Datas[0]
                StatusAtual = StatusF1.tb_st_work_status
            }
            if(Datas[1] != null)
            {
                DataF1 = Datas[1]
                StatusAtual = StatusF1R.tb_st_work_status
            }
              if(Datas[2] != null)
            {
                DataF2 = Datas[2]
                StatusAtual = StatusF2.tb_st_work_status
            }
               if(Datas[3] != null)
            {
                DataF3 = Datas[3]
                StatusAtual = StatusF3.tb_st_work_status
            }
               if(Datas[4] != null)
            {
                DataF4 = Datas[4]
                StatusAtual = StatusF4.tb_st_work_status
            }

            // Cálculo da nota do sistema
            if (QtdLinhas > 0 && StatusAtual == StatusF4.tb_st_work_status || StatusAtual == StatusF3.tb_st_work_status){
                var NotaSUS = 0
                var NotaEXP = 0
                var NotaF1 = 0
                var PesoSUS = 3
                var PesoEXP = 2
                var PesoF1 = 1
                if (WorkSysFlex.tb_wsf_sus <= 60)
                {
                    NotaSUS = 2
                }
                else if (WorkSysFlex.tb_wsf_sus < 70 && WorkSysFlex.tb_wsf_sus > 60)
                {
                    NotaSUS = 1
                }
    
                if (WorkSysFlex.tb_wsf_exp <= 90)
                {
                    NotaEXP = 2
                }
                else if (WorkSysFlex.tb_wsf_exp < 95 && WorkSysFlex.tb_wsf_exp > 90)
                {
                    NotaEXP = 1
                }
    
                if (WorkSysFlex.tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia)
                {
                    NotaF1 = 2
                }
                else if (WorkSysFlex.tb_wsf_freq_1 < ActiveOS.tb_faso_meta_frequencia && WorkSysFlex.tb_wsf_freq_1 >= ActiveOS.tb_faso_meta_frequencia - 1)
                {
                    NotaF1 = 1
                }
                NotaSUS *= PesoSUS;
                NotaEXP *= PesoEXP;
                NotaF1 *= PesoF1;
                var Qualidade = (Math.round((NotaSUS + NotaEXP + NotaF1) * 1000 / 12) / 10)
            }
            else{
                var Qualidade = null
            }

            if (StatusAtual == "Aguardando Tubulação (F0)") StatusAtual = "Ag. Tubulação (F0)"
            if (StatusAtual == "Liberado para cálculo (F1)") StatusAtual = "Lib. p/ Cálculo (F1)"
            if (StatusAtual == "Tubulação ajustada (F4)") StatusAtual = "Tub. ajustada (F4)"

            var Horas = (Math.round(RetornaHorasSistema(SistemasFiltroRevisoes[i]) * 100) / 100);
            var Conexao = WorkSysFlex.tb_wsf_conn_sf
            var Link = WorkSysFlex.tb_wsf_link
            DadosDetalhesSistemas.push({

                "ID": SistemasFiltroRevisoes[i].tb_sf_id,
                "Sistema": NomeSistema,
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
                "Qualidade": Qualidade,
                "Conexao": Conexao,
                "Link": Link})
           }
    }
    for(var i = 0; i < SistemasCancelados.length; i++)
    {
        var WorkSysFlex = RetornaDadosWorkSystem(SistemasCancelados[i])
        if(WorkSysFlex)
        {
           
            var NomeSistema = SistemasCancelados[i].tb_sf_name;
            var Rev = SistemasCancelados[i].tb_sf_rev;
            var QtdLinhas = WorkSysFlex.tb_wsf_total_lines
            var QtdLinhasCalculadas = WorkSysFlex.tb_wsf_calc_lines
            var RespProjetista = RetornaInicialUser(WorkSysFlex.tb_wsf_id_per_request)
            var RespFlex = RetornaInicialUser(WorkSysFlex.tb_wsf_id_per_resp_analyze)
            var Retrabalho = WorkSysFlex.tb_wsf_rework
            var Datas = RetornaDataStatusEHoras(SistemasCancelados[i], StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
            var StatusAtual = StatusF0.tb_st_work_status
            var DataF1 = null;
            var DataF2 = null;
            var DataF3 = null;
            var DataF4 = null;
            if(Datas[0] != null)
            {
                DataF1 = Datas[0]
                StatusAtual = StatusF1.tb_st_work_status
            }
            if(Datas[1] != null)
            {
                DataF1 = Datas[1]
                StatusAtual = StatusF1R.tb_st_work_status
            }
              if(Datas[2] != null)
            {
                DataF2 = Datas[2]
                StatusAtual = StatusF2.tb_st_work_status
            }
               if(Datas[3] != null)
            {
                DataF3 = Datas[3]
                StatusAtual = StatusF3.tb_st_work_status
            }
               if(Datas[4] != null)
            {
                DataF4 = Datas[4]
                StatusAtual = StatusF4.tb_st_work_status
            }

            // Cálculo da nota do sistema
            var Qualidade = null

            if (StatusAtual == "Aguardando Tubulação (F0)") StatusAtual = "Ag. Tubulação (F0)"
            if (StatusAtual == "Liberado para cálculo (F1)") StatusAtual = "Lib. p/ Cálculo (F1)"
            if (StatusAtual == "Tubulação ajustada (F4)") StatusAtual = "Tub. ajustada (F4)"

            var Horas = (Math.round(RetornaHorasSistema(SistemasCancelados[i]) * 100) / 100);
            var Conexao = WorkSysFlex.tb_wsf_conn_sf
            var Link = WorkSysFlex.tb_wsf_link
            DadosDetalhesSistemasCancelados.push({

                "ID": SistemasCancelados[i].tb_sf_id,
                "Sistema": NomeSistema,
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
                "Qualidade": Qualidade,
                "Conexao": Conexao,
                "Link": Link})
           }
    }
    var myTableDiv = document.getElementById("TabelaSistemas");
    var fieldTitles = ["Sistema", "Revisão", "Qtd Linhas", "Qtd Linhas Calculadas", "Resp. Projetista", "Resp. Flex.", "Retrabalho",
        "Liberado (F1)", "Em Análise (F2)", "Calculado (F3)", "Ajustado (F4)","Status Atual", "Horas Totais", "Qualidade" ,  "Conexão", "Link"  ]
    var table = document.createElement('TABLE');
    table.border = '0.1';
    table.id = "TabelaSistemasT";
    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 250px;");
    let thead = document.createElement('thead');
    thead.style.display = "table"
    thead.style.tableLayout = "fixed"
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
           
    });
    // let DivScr = document.createElement('td');
    // DivScr.appendChild(document.createTextNode(""));
    // thr.appendChild(DivScr);
    // DivScr.style.width="16.5px"
    // DivScr.style.backgroundColor = "#343a40"
    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.classList.add("tbodyTab")
    table.appendChild(tableBody);

    for (var i = 0; i < DadosDetalhesSistemas.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tableBody.appendChild(tr);
        tr.onmouseover = function() {
                this.style.backgroundColor = "#FF9A0080";
            }
            tr.onmouseleave = function() {
                this.style.backgroundColor = 'white';
            }
/*                     "Sistema": NomeSistema,
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
        tdSistema.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Sistema"]));
        tr.appendChild(tdSistema);

        var tdRevisao = document.createElement('TD');
        tdRevisao.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Revisao"]));
        tr.appendChild(tdRevisao);

        var tdQtdLinhasTot = document.createElement('TD');
        tdQtdLinhasTot.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["QtdLinhasTot"]));
        tr.appendChild(tdQtdLinhasTot);

        var tdQtdLinhasCalc = document.createElement('TD');
        tdQtdLinhasCalc.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["QtdLinhasCalc"]));
        tr.appendChild(tdQtdLinhasCalc);

        var tdRespProjetista = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["RespProj"])
        {
            tdRespProjetista.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["RespProj"]));
        }
        else
        {
            tdRespProjetista.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRespProjetista);
            
        var tdRespFlex = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["RespFlex"])
        {
            tdRespFlex.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["RespFlex"]));
        }
        else
        {
            tdRespFlex.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRespFlex);
            
        var tdRetrabalho = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["Retrabalho"])
        {
            tdRetrabalho.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Retrabalho"]));
        }
        else
        {
            tdRetrabalho.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdRetrabalho);
            
            var tdDataF1 = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["DataF1"])
        {
            var Data = new Date(DadosDetalhesSistemas[i]["DataF1"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF1.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF1.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdDataF1);
            
            var tdDataF2 = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["DataF2"])
        {
            var Data = new Date(DadosDetalhesSistemas[i]["DataF2"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF2.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF2.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdDataF2);
            
            var tdDataF3 = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["DataF3"])
        {
            var Data = new Date(DadosDetalhesSistemas[i]["DataF3"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF3.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF3.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdDataF3);
            
            var tdDataF4 = document.createElement('TD');
        if(DadosDetalhesSistemas[i]["DataF4"])
        {
            var Data = new Date(DadosDetalhesSistemas[i]["DataF4"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF4.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF4.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdDataF4);

        var tdStatusAtual = document.createElement('TD');
        tdStatusAtual.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["StatusAtual"]));
        tr.appendChild(tdStatusAtual);

        var tdHoras = document.createElement('TD');
        tdHoras.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Horas"]));
        tr.appendChild(tdHoras);
        
        var tdQualidade = document.createElement('TD');
        if (DadosDetalhesSistemas[i]["Qualidade"])
        {
            tdQualidade.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Qualidade"] + "%"));
        }
        else if (DadosDetalhesSistemas[i]["Qualidade"] === 0) 
        {
            tdQualidade.appendChild(document.createTextNode(0 + "%"));
        }
        else{
            tdQualidade.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdQualidade)
        
        var tdConexao = document.createElement('TD');
        tdConexao.classList.add("text-truncate")
        if(DadosDetalhesSistemas[i]["Conexao"])
        {
            tdConexao.appendChild(document.createTextNode(DadosDetalhesSistemas[i]["Conexao"]))
            tdConexao.title = DadosDetalhesSistemas[i]["Conexao"]
        }
        else
        {
            tdConexao.appendChild(document.createTextNode(''));
        }
        tr.appendChild(tdConexao);

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
     
    }
    for (var i = 0; i < DadosDetalhesSistemasCancelados.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table"
        tr.style.tableLayout = "fixed"
        tr.style.color = "grey"
        tr.style.textDecoration = "line-through"
        tableBody.appendChild(tr)
        tr.onmouseover = function() {
                this.style.backgroundColor = "#FF9A0080";
            }
            tr.onmouseleave = function() {
                this.style.backgroundColor = 'white';
            }

        var tdSistema = document.createElement('TD');
        tdSistema.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["Sistema"]));
        tr.appendChild(tdSistema);

        var tdRevisao = document.createElement('TD');
        tdRevisao.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["Revisao"]));
        tr.appendChild(tdRevisao);

        var tdQtdLinhasTot = document.createElement('TD');
        tdQtdLinhasTot.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["QtdLinhasTot"]));
        tr.appendChild(tdQtdLinhasTot);

        var tdQtdLinhasCalc = document.createElement('TD');
        tdQtdLinhasCalc.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["QtdLinhasCalc"]));
        tr.appendChild(tdQtdLinhasCalc);

        var tdRespProjetista = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["RespProj"])
        {
            tdRespProjetista.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["RespProj"]));
        }
        else
        {
            tdRespProjetista.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdRespProjetista);
            
        var tdRespFlex = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["RespFlex"])
        {
            tdRespFlex.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["RespFlex"]));
        }
        else
        {
            tdRespFlex.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdRespFlex);
            
        var tdRetrabalho = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["Retrabalho"])
        {
            tdRetrabalho.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["Retrabalho"]));
        }
        else
        {
            tdRetrabalho.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdRetrabalho);
            
            var tdDataF1 = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["DataF1"])
        {
            var Data = new Date(DadosDetalhesSistemasCancelados[i]["DataF1"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF1.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF1.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdDataF1);
            
            var tdDataF2 = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["DataF2"])
        {
            var Data = new Date(DadosDetalhesSistemasCancelados[i]["DataF2"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF2.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF2.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdDataF2);
            
            var tdDataF3 = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["DataF3"])
        {
            var Data = new Date(DadosDetalhesSistemasCancelados[i]["DataF3"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF3.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF3.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdDataF3);
            
            var tdDataF4 = document.createElement('TD');
        if(DadosDetalhesSistemasCancelados[i]["DataF4"])
        {
            var Data = new Date(DadosDetalhesSistemasCancelados[i]["DataF4"])
            var DataFormatada = Data.getDate() + '/' + (Data.getMonth()+1) + "/" + Data.getFullYear()
            tdDataF4.appendChild(document.createTextNode(DataFormatada));
        }
        else
        {
            tdDataF4.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdDataF4);

        var tdStatusAtual = document.createElement('TD');
        tdStatusAtual.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["StatusAtual"]));
        tr.appendChild(tdStatusAtual);

        var tdHoras = document.createElement('TD');
        tdHoras.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["Horas"]));
        tr.appendChild(tdHoras);
        
        var tdQualidade = document.createElement('TD');
        tdQualidade.appendChild(document.createTextNode('-'));
        tr.appendChild(tdQualidade)
        
        var tdConexao = document.createElement('TD');
        tdConexao.classList.add("text-truncate")
        if(DadosDetalhesSistemasCancelados[i]["Conexao"])
        {
            tdConexao.appendChild(document.createTextNode(DadosDetalhesSistemasCancelados[i]["Conexao"]));
            tdConexao.title = DadosDetalhesSistemasCancelados[i]["Conexao"]
        }
        else
        {
            tdConexao.appendChild(document.createTextNode('-'));
        }
        tr.appendChild(tdConexao);

        var tdLink = document.createElement('TD');
        tdLink.classList.add("Status")
        var TxtLink = `<button type="button" onclick="MostrarModalReportsSistema(${DadosDetalhesSistemasCancelados[i]["ID"]}, true)" class="btn btn-primary btn-block btnReports" style="margin-bottom: 1px">Acessar</button>`
        var DivLink = document.createElement("div")
        DivLink.innerHTML = TxtLink
        DivLink.style.overflow = "hidden"
        DivLink.style.maxHeight = "18px"
        DivLink.title = "Acessar Reports";
        tdLink.appendChild(DivLink);
        tr.appendChild(tdLink);
    }
    myTableDiv.appendChild(table);


 $('#TabelaSistemasT').excelTableFilter({captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' }});
     InicializarRodape(true);
    //console.log(DadosDetalhesSistemas)
}
async function MostrarModalReportsSistema(IDSistema, SistemaCancelado=false) {
    $("#loaderTabelaReports").show()
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
    $("#TituloModalReportSistema").html(`Reports do Sistema ${Sistema.tb_sf_name} - R${Sistema.tb_sf_rev}`)
    $("#ModalReportsSistema").modal('show')
    $("#loaderTabelaReports").hide()
    if (SistemaCancelado){
        $("#SistemaCancelado").show()
        $("#ModalReport3DSistema").hide()
    }
    else{
        AtualizarDisponibilidadeModelo3D(IDSistema);
        await CarregarTabelaArquivos(IDSistema);
        $("#SistemaCancelado").hide()
        $("#ModalReport3DSistema").show()
    }


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
async function AtualizarDisponibilidadeModelo3D(IDSistema) {
    var TodosInfoImports = await RetornaTodosInfoImports()
    var Sistema;
    var BotaoMostrar3D = document.getElementById("BotaoAcessarReport3D")
    var InputDisponibilidade = document.getElementById("StatusReport3D")
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

function RetornaHorasSistema(Sistema)
{
    var Horas = 0;
    for(var i = 0; i < HourPersonFlex.length; i++)
    {
        if(HourPersonFlex[i].tb_hpf_id_sf == Sistema.tb_sf_id)
        {
            Horas += HourPersonFlex[i].tb_hpf_hour
        }
    }
    return Horas;
}
function RetornaDataStatusEHoras(Sistema, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4)
{
    var F1 = null;
    var F1R = null;
    var F2 = null;
    var F3 = null;
    var F4 = null;
    for(var i = 0; i < SystemFlexTime.length; i++)
    {
        if(SystemFlexTime[i].tb_sft_id_sf == Sistema.tb_sf_id)
        {
            if(SystemFlexTime[i].tb_sft_id_st == StatusF1.tb_st_id)
            {
                F1 = SystemFlexTime[i].tb_sft_time_update;
            }
            if(SystemFlexTime[i].tb_sft_id_st == StatusF1R.tb_st_id)
            {
                F1R = SystemFlexTime[i].tb_sft_time_update;
            }
            if(SystemFlexTime[i].tb_sft_id_st == StatusF2.tb_st_id)
            {
                F2 = SystemFlexTime[i].tb_sft_time_update;
            }
            if(SystemFlexTime[i].tb_sft_id_st == StatusF3.tb_st_id)
            {
                F3 = SystemFlexTime[i].tb_sft_time_update;
            }
            if(SystemFlexTime[i].tb_sft_id_st == StatusF4.tb_st_id)
            {
                F4 = SystemFlexTime[i].tb_sft_time_update;
            }
            if((F1 != null || F1R != null) && F2 != null && F3 != null && F4 != null)
            {
                break;
            }

        }

    }
    return [F1, F1R, F2, F3, F4]

}
function RetornaInicialUser(ID)
{
    for(var i = 0; i < Person.length; i++)
    {
        if(Person[i].tb_per_id == ID)
        {
            return Person[i].tb_per_initials
        }

    }
}
function RetornaDadosWorkSystem(Sistema)
{
    for(var i = 0; i < WorkSystemFlex.length; i++)
    {
        if(WorkSystemFlex[i].tb_wsf_id_sf == Sistema.tb_sf_id)
        {
            return WorkSystemFlex[i];
        }
    }

}
function RetornaDadosWorkSystemIDSistema(IDSistema)
{
    for (var i = 0; i < WorkSystemFlex.length; i++)
    {
        if (WorkSystemFlex[i].tb_wsf_id_sf == IDSistema)
        {
            return WorkSystemFlex[i];
        }
    }

}
function CriarGraficoHorasLinhaRev(SistemasFiltro, SistemasCancelados, StatusF3, StatusF4, LinhasFiltradas)
{
    // Cria o gráfico de produtividade: índice global de horas por linhas e índices específicos de horas por linhas

    // TODO:
    // [X] Calcular horas por linha com Total das (horas somando sistemas e estudos) / total de linhas
    // [X] Ajustar as horas por linha por área quando usar o filtro
    // [X] Menu com detalhes das horas, horas para R0 e R1, horas para R2+, horas totais por totais de linhas calculadas
    // [X] Ajustar horas por linhas do total calculado, R1 e R2+
    //      [X] Horas por total de linhas calculadas
    //      [X] Horas por total de linhas R0 + R1
    //      [X] Horas por total de linhas R2+

    var QtdLinhasR0R1 = 0
    var QtdLinhasDemais = 0
    var QtdHorasR0R1 = 0
    var QtdHorasDemais = 0
    var QtdLinhasTotalCalculadas = 0
    // var QtdHorasTotal = 0
    var SistemasFiltroRevisoes = []
    for(var i = 0; i < SistemasOS.length; i++)
    {
        if(SistemasFiltro.includes(SistemasOS[i].tb_sf_name))
        {
            SistemasFiltroRevisoes.push(SistemasOS[i])
            // Recebe os sistemas filtrados
        }
    }
    var RevLinhasHoras = []
    for(var i = 0; i < SistemasFiltroRevisoes.length; i++)
    {
        // Laço apenas nos sistemas filtrados
        var Rev = SistemasFiltroRevisoes[i].tb_sf_rev
        var QtdLinhas = 0;
        var Horas = 0;
        var MaiorStatus;
        var MaiorData = null;

        for(var j = 0; j < SystemFlexTime.length; j++)
        {
            if(SystemFlexTime[j].tb_sft_id_sf == SistemasFiltroRevisoes[i].tb_sf_id)
            {
                if(MaiorData == null || SystemFlexTime[j].tb_sft_time_update > MaiorData)
                {
                    MaiorData = SystemFlexTime[j].tb_sft_time_update
                    MaiorStatus = SystemFlexTime[j].tb_sft_id_st
                    // pega o status da data mais avançada (longe/velha/maior) do sistema
                }
            }
        }

        for(var j = 0; j < HourPersonFlex.length; j++)
        {
            // Laço para pegar a quantidade de horas dos sistema (independente do status), independente se mais de uma pessoal apontou horas no sistema.
            if(HourPersonFlex[j].tb_hpf_id_sf == SistemasFiltroRevisoes[i].tb_sf_id)
            {
                Horas += HourPersonFlex[j].tb_hpf_hour
            }
        }

        if(MaiorStatus == StatusF3.tb_st_id || MaiorStatus == StatusF4.tb_st_id)
        {
            // Somente as linhas calculadas (F3 ou F4) serão utilizadas para calcular os índices específicos

            for(var j = 0; j < WorkSystemFlex.length; j++)
            {
                // Laço para pegar a quantidade de linhas calculadas do sistema
                if(WorkSystemFlex[j].tb_wsf_id_sf == SistemasFiltroRevisoes[i].tb_sf_id)
                {
                    QtdLinhas = WorkSystemFlex[j].tb_wsf_calc_lines
                    break;
                }
            }

            // if(QtdLinhas > 0)
            // [2024/06/18] O If acima não fará mais sentido, será revisada a forma de obter as linhas calculadas. Não será mais possível ter linhas calculadas com valores negativos

            // QtdHorasTotal += Horas

            // if(Rev == 0 || Rev == 1){
            if(Rev == 0){
                // Quando for Rev == 0, verificar se existe uma revisão R1 desse sistema e, em caso positivo, verificar se as datas de F3 são idênticas. Caso isso seja verdadeiro significa que o sistema não foi aprovado no R0.  

                // Irá somar tanto as horas do R0 quanto do R1
                QtdHorasR0R1 += Horas
                
                // TODO: 
                // [X] SOMENTE PEGAR AS LINHAS CALCULADAS DO R1 (NÃO SOMAR COM R0); OU R0 (NO CASO DO SISTEMA "JÁ VIR CALCULADO PELA TUBULAÇÃO" [CASO IMPOSSÍVEL KKKKK])
                for(var j = 0; j < SistemasFiltroRevisoes.length; j++){
                    if(SistemasFiltroRevisoes[i].tb_sf_name == SistemasFiltroRevisoes[j].tb_sf_name && SistemasFiltroRevisoes[j].tb_sf_rev == 1){
                        // Encontrou a revisão R1 do sistema em questão
                        var dataF3R0 = null
                        var dataF3R1 = null

                        for (var k = 0; k <SystemFlexTime.length; k++){
                            if(SystemFlexTime[k].tb_sft_id_sf == SistemasFiltroRevisoes[i].tb_sf_id && SystemFlexTime[k].tb_sft_id_st == StatusF3.tb_st_id){
                                // Encontrou data do status F3 da revisão R0 do sistema em questão
                                dataF3R0 = SystemFlexTime[k].tb_sft_time_update
                            }
                            if(SystemFlexTime[k].tb_sft_id_sf == SistemasFiltroRevisoes[j].tb_sf_id && SystemFlexTime[k].tb_sft_id_st == StatusF3.tb_st_id){
                                // Encontrou data do status F3 da revisão R1 do sistema em questão
                                dataF3R1 = SystemFlexTime[k].tb_sft_time_update
                            }
                        }
                    }
                }
                if(dataF3R1 != null && dataF3R0 != dataF3R1){
                    // Se há uma data F3 para a revisão R1 e as datas F3 de R0 e R1 são diferentes. Ou seja, se o sistema em questão foi aprovado no R0
                    QtdLinhasR0R1 += QtdLinhas
                    QtdLinhasTotalCalculadas += QtdLinhas
                }
            }
            else if(Rev == 1){
                // Irá somar tanto as horas do R0 quanto do R1
                QtdHorasR0R1 += Horas
                
                // As linhas calculadas em R1
                QtdLinhasR0R1 += QtdLinhas
                QtdLinhasTotalCalculadas += QtdLinhas
    
            } else {
                // Se for revisão R2+
                QtdHorasDemais += Horas
                QtdLinhasDemais += QtdLinhas
                QtdLinhasTotalCalculadas += QtdLinhas
            
            }       

            var Achou = false;
            for(var j = 0; j < RevLinhasHoras.length; j++)
            {
                if(RevLinhasHoras[j].Rev == Rev)
                {
                    RevLinhasHoras[j].QtdLinhas += QtdLinhas
                    RevLinhasHoras[j].Horas += Horas
                    Achou = true;
                }
            }
            if(Achou == false)
            {
                var InfoNova = {"Rev":Rev, "QtdLinhas": QtdLinhas, "Horas": Horas}
                RevLinhasHoras.push(InfoNova);
            }
        }
    }

    // Cálculo de horas por linha considerando horas de sistemas + horas de estudos por total de linhas no projeto -> atualização ITE-020 Fevereiro de 2024
    var TotalLinhas = 0
    var QtdHorasTotal = 0
    var QtdHorasEstudosTotal = 0

    for(var i = 0; i < HourPersonFlex.length; i++)
    {
        QtdHorasTotal += HourPersonFlex[i].tb_hpf_hour
    }

    for(var i = 0; i < HourPersonAtividade.length; i++)
    {
        QtdHorasEstudosTotal += HourPersonAtividade[i].tb_atvflex_hper_hour
    }

    for(var i = 0;i < LinhasOS.length; i++)
    {
        // For para contar o total de linhas do projeto
        var Sistema = RetornaSistema(LinhasOS[i])
        if(!Sistema.toLowerCase().includes("cancelado")) // Se a linha não estiver no sistema cancelado [Sistemas com as linhas que foram canceladas]
        {
            TotalLinhas += 1
        }
    }

    var HorasTotaisPorLinhas = Math.round((QtdHorasTotal + QtdHorasEstudosTotal) / TotalLinhas * 100) / 100;
    var HorasLinhaGeralTotalCardTitulo = document.getElementById("HorasLinhaGeralTotalCard");
    $("#HorasLinhaGeralTotalCard").html(HorasTotaisPorLinhas)
    $("#HorasLinhaGeralTotalCard").prop('title', "");
    if (HorasTotaisPorLinhas < ActiveOS.tb_faso_meta_horas_linha * 0.75)
    {
        HorasLinhaGeralTotalCardTitulo.style.color = "#42d100";
        $("#HorasLinhaGeralTotalCard").prop('title', `Abaixo da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }
    else if (HorasTotaisPorLinhas < ActiveOS.tb_faso_meta_horas_linha)
    {
        HorasLinhaGeralTotalCardTitulo.style.color = "#e3c805";
        $("#HorasLinhaGeralTotalCard").prop('title', `Muito próximo da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }
    else
    {
        HorasLinhaGeralTotalCardTitulo.style.color = "#e32705";
        $("#HorasLinhaGeralTotalCard").prop('title', `Acima da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }

    // Cálculo das Horas por Linhas considerando os sistemas filtrados
    var QtdHorasFiltro = 0
    var QtdLinhasFiltro = TotalAtividadesMetas

    var table = document.getElementById("TabelaSistemasT");
    for(var i = 1; i < table.rows.length; i++)
    {
        if($(table.rows[i]).is(':visible'))
        {
            QtdHorasFiltro += parseFloat(table.rows[i].cells[12].textContent);
        }
    }

    var HorasFiltradasPorLinhas = Math.round((QtdHorasFiltro) / QtdLinhasFiltro * 100) / 100;
    var HorasLinhaSistemasFiltro = document.getElementById("HorasLinhaSistemasFiltro");
    $("#HorasLinhaSistemasFiltro").html(HorasFiltradasPorLinhas)
    $("#HorasLinhaSistemasFiltro").prop('title', "");
    if (HorasFiltradasPorLinhas < ActiveOS.tb_faso_meta_horas_linha * 0.75)
    {
        HorasLinhaSistemasFiltro.style.color = "#42d100";
        $("#HorasLinhaSistemasFiltro").prop('title', `Abaixo da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }
    else if (HorasFiltradasPorLinhas < ActiveOS.tb_faso_meta_horas_linha)
    {
        HorasLinhaSistemasFiltro.style.color = "#e3c805";
        $("#HorasLinhaSistemasFiltro").prop('title', `Muito próximo da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }
    else
    {
        HorasLinhaSistemasFiltro.style.color = "#e32705";
        $("#HorasLinhaSistemasFiltro").prop('title', `Acima da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
    }


    // RevLinhasHoras.sort(function(a,b){
    // var keyA = a.Rev,
    // keyB = b.Rev;
    // if (keyA < keyB) return -1;
    // if (keyA > keyB) return 1;
    // return 0;
    // });
    // var LabelsRevs = []
    // var DadosRevs = []
    // var CoresBackground = []
    // for(var i = 0; i < RevLinhasHoras.length; i++)
    // {
    // LabelsRevs.push("R" + RevLinhasHoras[i].Rev)
    // DadosRevs.push(Math.round(RevLinhasHoras[i].Horas/RevLinhasHoras[i].QtdLinhas*100)/100)
    // CoresBackground.push(CoresCrescentes[i+2])
    // }
    // if(DadosRevs.length == 0)
    // {
    // LabelsRevs.push("Sem Linhas Calculadas")
    // DadosRevs.push(1)
    // CoresBackground.push(CoresCrescentes[2])

    // }



    var HorasLinhaTotal = Math.round((QtdHorasFiltro) / QtdLinhasTotalCalculadas * 100) / 100;
    var HorasLinhasCard = document.getElementById("HorasLinhaGeralCard");
    if(HorasLinhaTotal)
    {
        $("#HorasLinhaGeralCard").html(HorasLinhaTotal)
        $("#HorasLinhaGeralCard").prop('title', "");
        if (HorasLinhaTotal < ActiveOS.tb_faso_meta_horas_linha *0.75)
        {
            HorasLinhasCard.style.color = "#42d100";
            $("#HorasLinhaGeralCard").prop('title', `Horas/Linha menor que a meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
        }
        else if (HorasLinhaTotal < ActiveOS.tb_faso_meta_horas_linha)
        {
            HorasLinhasCard.style.color = "#e3c805";
            $("#HorasLinhaGeralCard").prop('title', `Horas/Linha muito próximo da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
        }
        else
        {
            HorasLinhasCard.style.color = "#e32705";
            $("#HorasLinhaGeralCard").prop('title', `Horas/Linha acima da meta de ${ActiveOS.tb_faso_meta_horas_linha} horas por linha`);
        }
    }
    else
    {
        HorasLinhasCard.style.color = "black";
        $("#HorasLinhaGeralCard").html("0")
        $("#HorasLinhaGeralCard").prop('title', "Sem Linhas Calculadas");
    }

    var HorasLinhaR0R1 = Math.round(QtdHorasR0R1/QtdLinhasR0R1*100)/100
    if(HorasLinhaR0R1)
    {
        $("#HorasLinhaR0R1Card").html(HorasLinhaR0R1)
        $("#HorasLinhaR0R1Card").prop('title', "");
    }
    else
    {
        $("#HorasLinhaR0R1Card").html("0")
        $("#HorasLinhaR0R1Card").prop('title', "Sem Linhas Calculadas em R0 ou R1");

    }
    var HorasLinhasDemais = Math.round(QtdHorasDemais/QtdLinhasDemais*100)/100
    if(HorasLinhasDemais)
    {
        $("#HorasLinhaRS").html(HorasLinhasDemais)
        $("#HorasLinhaRS").prop('title', "");
    }
    else
    {
        $("#HorasLinhaRS").html("0")
        $("#HorasLinhaRS").prop('title', "Sem Linhas Calculadas em R2 ou Maior");
    }
    //console.log(DadosGrafico)
    //const data = {
    //      labels: LabelsRevs,
    //      datasets: [{
    //        label: 'Horas/Linha por Revisão',
    //        data: DadosRevs,
    //        backgroundColor: CoresBackground,
    //        hoverOffset: 10,
    //        hoverBorderWidth: 5
    //      }]
    //    };
    //var ContainerGrafico = document.getElementById("graficoHorasLinha")
    //     ContainerGrafico.innerHTML = ""
    //     var Canvas = document.createElement('canvas');
    //     Canvas.style.width = "50%"
    //     Canvas.style.height = "200px"
    //     Canvas.height = "200px"
    //     ContainerGrafico.append(Canvas)
    //     var chart = new Chart(Canvas, {
    //        type: 'pie',
    //        data: data,
    //        options:
    //        {
    //          responsive: true,
    //          maintainAspectRatio: false,
    //           layout: {
    //              padding: {
    //                   bottom: 10,
    //                   top: 10,
    //                   right: 10,
    //                   left: 10
    //              }
    //           },
    //        plugins:
    //        {
    //            tooltip: {
    //                callbacks: {
    //                    label: function (tooltipItems, data)
    //                    {
    //                        return (tooltipItems.label + ": " + tooltipItems.formattedValue + "h")
    //                    }
    //                }
    //            },
    //            title:
    //            {
    //                display: false,
    //                text: "Horas / Linha por revisão",
    //                font: {
    //                    size: 14
    //                },
    //                color: "#000000"
    //            },
    //              legend: {
    //                    display: false,
    //                    position: 'top',
    //                    labels: {
    //                        generateLabels: function(chartb) {
    //                            var data = chartb.data;
    //                            if (data.labels.length && data.datasets.length) {
    //                                return data.labels.map(function(label, i) {
    //                                    var ds = data.datasets[0];
    //                                    var meta = chartb.getDatasetMeta(0);
    //                                    // We get the value of the current label
    //                                    var value = chartb.config._config.data.datasets[0].data[i];
    //                                    var Porcentagem = (Math.round((parseFloat(value)*10000/TotalAtividadesMetas))/100)
    //                                    return {
    //                                        // Instead of `text: label,`
    //                                        // We add the value to the string
    //                                            text: label + ": " + value + "h ",
    //                                            fillStyle: CoresBackground[i],
    //                                            lineWidth: 0,
    //                                            hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
    //                                            index: i
    //                                    };
    //                                });
    //                            } else {
    //                                return [];
    //                            }
    //                        }
    //                    }
    //                }
    //          },
    //         }
    //    });

}
function PreencherGraficoProgresso(QtdLinhasF0, QtdLinhasF1,QtdLinhasF1R, QtdLinhasF2, QtdLinhasF3, QtdLinhasF4)
{
    // TODO:
    // [X] Pegar dados de todas as atividades

    var QtdNaoCalculadas = QtdLinhasF0 + QtdLinhasF1 + QtdLinhasF1R + QtdLinhasF2;
    var QtdCalculadas = QtdLinhasF3 + QtdLinhasF4;
    var LabelsProg = ["Linhas Calculadas", "Linhas Não Calculadas"]
    var DadosProg = [QtdCalculadas, QtdNaoCalculadas];
    var CoresBackground = [Cores[4], "#ff6060"]

             const data = {
          labels: LabelsProg,
          datasets: [{
            label: 'Total Linhas Calculadas',
            data: DadosProg,
            backgroundColor: CoresBackground,
            hoverOffset: 10,
            hoverBorderWidth: 5
          }]
        };
    var ContainerGrafico = document.getElementById("graficoProgresso")
         ContainerGrafico.innerHTML = ""
         var Canvas = document.createElement('canvas');
         Canvas.style.height = "200px"
         Canvas.height = "200px"
         ContainerGrafico.append(Canvas)
         
         chartGraficoProgresso = new Chart(Canvas, {
            type: 'doughnut',
            data: data,
            options:{
             cutout: 50,
              responsive: true,
              maintainAspectRatio: false,
              layout: {
                  padding: {
                      bottom: 10,
                      top: 10,
                      right: 10,
                      left: 10
                  }
               },
               plugins:
               {
                   tooltip: {
                       callbacks: {
                           label: function (tooltipItems, data) {

                               var value = tooltipItems.formattedValue;
                               var Porcentagem = (Math.round((parseFloat(value) * 10000 / TotalAtividadesMetas)) / 100)
                               return (tooltipItems.label + ": " + tooltipItems.formattedValue + " (" + Porcentagem + "%)")
                           },
                         
                       }
                   },
                  legend: {
                        display: false,
                        position: 'top',
                        labels: {
                            generateLabels: function(chartb) {
                                var data = chartb.data;
                                if (data.labels.length && data.datasets.length) {
                                    return data.labels.map(function(label, i) {
                                        var ds = data.datasets[0];
                                        var meta = chartb.getDatasetMeta(0);
                                        // We get the value of the current label
                                        var value = chartb.config._config.data.datasets[0].data[i];
                                        var Porcentagem = (Math.round((parseFloat(value)*10000/TotalAtividadesMetas))/100)
                                        return {
                                            // Instead of `text: label,`
                                            // We add the value to the string
                                                text: label + ": " + value + " (" + Porcentagem + "%)",
                                                fillStyle: CoresBackground[i],
                                                lineWidth: 0,
                                                hidden: isNaN(ds.data[i]) || meta.data[i].hidden,
                                                index: i
                                        };
                                    });
                                } else {
                                    return [];
                                }
                            }
                        }
                    }
              },


              }
        });
    /*$.plot('#graficoProgresso', Data, {

    series: {
        pie: {
            innerRadius: 0.7,
            show: true,


        },
    },
    legend: legendSettings,
    grid: {
        hoverable: true,

    },
     tooltip: {
        show: true,
        content: "%s"
      }


   }
   );*/
}
function calcularPesos(TotalLinhas){// Verificação dos pesos parciais (para o caso de alguma atividade não for vendida/executada no projeto)
    // Como essa função é executada na abertura da página, o check de atividades sem metas será feito aqui (remover botões sem atividades)

    // Filtragem de atividades a serem desnvolvidas (pelo meta de cada atividade, se for diferente de zero tem a atividade no projeto)
    if (QtdCriteriosMeta == 0){
        PesoAvancoCriterios = 0 
        document.getElementById('btn-criterios').hidden = true

    }
    if(QtdEstudosMeta == 0){
        PesoAvancoEstudos = 0
        document.getElementById('btn-estudos').hidden = true

    }
    if(QtdListaMolasMeta == 0){
        PesoAvancoListaMolas = 0
        document.getElementById('btn-mola').hidden = true

    }
    if(QtdIndiceLinhasMeta == 0){
        PesoAvancoListaLinhas = 0
        document.getElementById('btn-lista-linhas').hidden = true

    }
    if(QtdListaJuntasMeta == 0){
        PesoAvancoListaJuntas = 0
        document.getElementById('btn-juntas').hidden = true

    }
    if(QtdMemoriaisMeta == 0){
        PesoAvancoMemoriais = 0
        document.getElementById('btn-memorial').hidden = true

    }
    if(TotalLinhas == 0){
        PesoAvancoSistemas = 0
        document.getElementById('btn-sistemas').hidden = true
    }

    // Calcular a soma dos pesos das atividades a serem desenvolvidas
    let pesototal = (PesoAvancoCriterios) + 
    (PesoAvancoEstudos) + 
    (PesoAvancoListaMolas) + 
    (PesoAvancoListaLinhas) + 
    (PesoAvancoListaJuntas) + 
    (PesoAvancoMemoriais) + 
    (PesoAvancoSistemas)

    // Redistribuição dos pesos proporcionalmente para que a soma dos pesos seja 100%
    PesoAvancoCriterios = (PesoAvancoCriterios / pesototal)
    PesoAvancoEstudos = (PesoAvancoEstudos / pesototal)
    PesoAvancoListaMolas = (PesoAvancoListaMolas / pesototal)
    PesoAvancoListaLinhas = (PesoAvancoListaLinhas / pesototal)
    PesoAvancoListaJuntas = (PesoAvancoListaJuntas / pesototal)
    PesoAvancoMemoriais = (PesoAvancoMemoriais / pesototal)
    PesoAvancoSistemas = (PesoAvancoSistemas / pesototal)
}
function PreencherTabelaStatusLinhas(QtdLinhasF0, QtdLinhasF1,QtdLinhasF1R, QtdLinhasF2, QtdLinhasF3, QtdLinhasF4, StatusF0, StatusF1, StatusF1R, StatusF2, StatusF3, StatusF4, TotalLinhasSemFiltro)
{


    var TotalLinhas = QtdLinhasF0+QtdLinhasF1+QtdLinhasF1R+QtdLinhasF2+QtdLinhasF3+QtdLinhasF4
    var ProgressoF0 = (QtdLinhasF0 / TotalLinhas)
    var ProgressoF1 = (QtdLinhasF1  / TotalLinhas)
    var ProgressoF1R = (QtdLinhasF1R / TotalLinhas)
    var ProgressoF2 = (QtdLinhasF2  / TotalLinhas)
    var ProgressoF3 = (QtdLinhasF3  / TotalLinhas)
    var ProgressoF4 = (QtdLinhasF4 / TotalLinhas)
    if (QtdLinhasF0 == 0) QtdLinhasF0 = 0.0001;
    if (QtdLinhasF1 == 0) QtdLinhasF1 = 0.0001;
    if (QtdLinhasF1R == 0) QtdLinhasF1R = 0.0001;
    if (QtdLinhasF2 == 0) QtdLinhasF2 = 0.0001;
    if (QtdLinhasF3 == 0) QtdLinhasF3 = 0.0001;
    if (QtdLinhasF4 == 0) QtdLinhasF4 = 0.0001;
    if (QtdLinhasF0SemFiltro == 0) QtdLinhasF0SemFiltro = 0.0001;
    if (QtdLinhasF1SemFiltro == 0) QtdLinhasF1SemFiltro = 0.0001;
    if (QtdLinhasF1RSemFiltro == 0) QtdLinhasF1RSemFiltro = 0.0001;
    if (QtdLinhasF2SemFiltro == 0) QtdLinhasF2SemFiltro = 0.0001;
    if (QtdLinhasF3SemFiltro == 0) QtdLinhasF3SemFiltro = 0.0001;
    if (QtdLinhasF4SemFiltro == 0) QtdLinhasF4SemFiltro = 0.0001;
    var ProgressoSistemas = (QtdLinhasF0*StatusF0.tb_st_weitgh + QtdLinhasF1*StatusF1.tb_st_weitgh + QtdLinhasF1R*StatusF1R.tb_st_weitgh + QtdLinhasF2*StatusF2.tb_st_weitgh + QtdLinhasF3*StatusF3.tb_st_weitgh + QtdLinhasF4*StatusF4.tb_st_weitgh) * 100 / TotalLinhas

    var ProgressoSistemasSemFiltro = (QtdLinhasF0SemFiltro*StatusF0.tb_st_weitgh + QtdLinhasF1SemFiltro*StatusF1.tb_st_weitgh + QtdLinhasF1RSemFiltro*StatusF1R.tb_st_weitgh + QtdLinhasF2SemFiltro*StatusF2.tb_st_weitgh + QtdLinhasF3SemFiltro*StatusF3.tb_st_weitgh + QtdLinhasF4SemFiltro*StatusF4.tb_st_weitgh) * 100 / TotalLinhasSemFiltro

    // console.log(QtdLinhasF0, QtdLinhasF0SemFiltro)
    // console.log(QtdLinhasF1, QtdLinhasF1SemFiltro)
    // console.log(QtdLinhasF1R, QtdLinhasF1RSemFiltro)
    // console.log(QtdLinhasF2, QtdLinhasF2SemFiltro)
    // console.log(QtdLinhasF3, QtdLinhasF3SemFiltro)
    // console.log(QtdLinhasF4, QtdLinhasF4SemFiltro)


    calcularPesos(TotalLinhasSemFiltro)
    ProgressoGlobal = (
        ((QtdCriteriosMeta > 0 ? (QtdCriteriosRealizados / QtdCriteriosMeta) * 100 : 0) * PesoAvancoCriterios) + 
        ((QtdEstudosMeta > 0 ? (QtdEstudosRealizados / QtdEstudosMeta) * 100 : 0) * PesoAvancoEstudos) +
        ((QtdListaMolasMeta > 0 ? (QtdListaMolasRealizados / QtdListaMolasMeta) * 100 : 0) * PesoAvancoListaMolas) +
        ((QtdIndiceLinhasMeta > 0 ? (QtdIndiceLinhasRealizados / QtdIndiceLinhasMeta) * 100 : 0) * PesoAvancoListaLinhas) +
        ((QtdListaJuntasMeta > 0 ? (QtdListaJuntasRealizados / QtdListaJuntasMeta) * 100 : 0) * PesoAvancoListaJuntas) +
        ((QtdMemoriaisMeta > 0 ? (QtdMemoriaisRealizados / QtdMemoriaisMeta) * 100 : 0) * PesoAvancoMemoriais) +
        ((TotalLinhasSemFiltro > 0 ? (ProgressoSistemasSemFiltro) : 0) * PesoAvancoSistemas)
    );    

    DadosProg = [QtdLinhasF0, QtdLinhasF1, QtdLinhasF1R, QtdLinhasF2, QtdLinhasF3, QtdLinhasF4, ProgressoSistemas, ProgressoGlobal]
    var CoresBackground = ["#e7eb9d", "#f8b65e", "#cea774", "#ff6060", "#6efa75", "#6e90fa", "#444e4a", "#f58c32"]
    var LabelsProg = ["F0 (Ag. Tubulação)", "F1 (Lib. p/ cálculo)", "F1.1 (Para revisão)","F2 (Em análise)", "F3 (Calculado)","F4 (Tub. Ajustada)", "Avanço Sistemas", "Avanço Global"]

    // O valor máximo para o eixo Y (100% é o máximo para a porcentagem)
    var maxPercentageValue = 100;

    // Max value de número absoluto (como "número de linhas")
    var maxAbsoluteValue = Math.max(...DadosProg, maxPercentageValue);  // Pegando o maior valor absoluto

    // Criando os dados normalizados para o gráfico (0-100)
    var normalizedData = DadosProg.map(function(value) {
        if (value <= 100) {
            // Se for porcentagem (menor ou igual a 100), não precisa normalizar
            return value;
        } else {
            // Se for valor absoluto maior que 100, normaliza para uma escala de 0 a 100
            return (value / maxAbsoluteValue) * 100;
        }
    });
    const data = {
        labels: LabelsProg,
        datasets: [{
        data: normalizedData,
        backgroundColor: CoresBackground,
        hoverOffset: 10,
        hoverBorderWidth: 2
        }]
    };
    var ContainerGrafico = document.getElementById("StatusEavancos")
         ContainerGrafico.innerHTML = ""
         var Canvas = document.createElement('canvas');
         Canvas.style.height = "200px"
         Canvas.height = "200px"
         ContainerGrafico.append(Canvas)
         var btn_sistemas = document.getElementById('btn-sistemas')
         btn_sistemas.classList.add('btn-light-mod-clicado')
         
         chartStatusEavancos = new Chart(Canvas, {
            type: 'bar',
            data: data,
            options:
            {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        bottom: 10,
                        top: 10,
                        right: 30,
                        left: 5,
                    }
               },
                events: [],
                animation: {
                    duration: 1,
                    onComplete: function (chartInstance) {
                        var ctx = chartInstance.chart.ctx;
                        ctx.textAlign = 'left';
                        ctx.textBaseline = 'middle';
                        this.data.datasets.forEach(function(dataset, i) {
                        var meta = chartInstance.chart._metasets[i];
                        meta.data.forEach(function(bar, index) {
                            if (dataset.data[index] > 0) {
                                // Dados para exibição nas barras
                                var originalValue = DadosProg[index];  // Dados originais (não normalizados)
                                // var data = dataset.data[index];
                                var Porcentagem = 0;
                               if(index == DadosProg.length - 2)
                               {
                                    // Exibição de porcentagem no gráfico
                                    // var data = dataset.data[index];
                                    var Porcentagem = (Math.round((parseFloat(originalValue)*100))/100)
                                    ctx.fillText(Porcentagem + "%", meta.data[index].x + 4, meta.data[index].y + 1);
                               }
                               else if(index == DadosProg.length - 1)
                                {
                                    //  var data = dataset.data[index];
                                    var Porcentagem = (Math.round((parseFloat(originalValue)*100))/100)
                                    ctx.fillText(Porcentagem + "%", meta.data[index].x + 4, meta.data[index].y + 1);
                                } 
                                else
                               {
                                    // Para dados absolutos, mostra o valor original (não normalizado) no gráfico   
                                    // var data = Math.round(dataset.data[index]);
                                    var Porcentagem = (Math.round((parseFloat(originalValue)*10000/TotalAtividadesMetas))/100)
                                    // ctx.fillText(Math.round(originalValue) + " (" + Porcentagem + "%)", meta.data[index].x + 4, meta.data[index].y + 1);
                                    ctx.fillText(Math.round(originalValue), meta.data[index].x + 4, meta.data[index].y + 1);
                                }
                            }
                        });
                    })
                },
                },
                plugins:
                {
                    legend:
                    {
                        display: false,
                    },
                     tooltip: {
                        enabled: false,
                        callbacks: {
                          label: function(tooltipItems, data) {
                                // Exibindo os dados originais no tooltip
                                var originalValue = Math.round(DadosProg[tooltipItems.dataIndex]);  // Pegando o valor original
                                var value = parseFloat(tooltipItems.formattedValue.replace(',', '.'));
                                var Porcentagem = (Math.round((value * 10000 / TotalAtividadesMetas)) / 100);
                                if(tooltipItems.label == "Avanço Sistemas")
                                {
                                    // var Porcentagem = (Math.round((parseFloat(tooltipItems.formattedValue.replace(',','.'))*10000/TotalAtividadesMetas))/100)
                                    return Porcentagem + "%";
                                }
                                else
                                {
                                //     var Porcentagem = (Math.round((parseFloat(tooltipItems.formattedValue.replace(',','.'))*10000/TotalAtividadesMetas))/100)
                                //    return(tooltipItems.formattedValue + " Linhas ("+Porcentagem+"%)")
                                   return originalValue + " Linhas (" + Porcentagem + "%)";
                                }
                            },
                        }
                      },


                },
                 scales: {
                  x: {
                  suggestedMax: maxAbsoluteValue,
                  display: false,
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawOnChartArea: false,
                      drawTicks: false,
                    }
                  },
                   y: {
                    grid: {
                      display: false,
                      drawBorder: false,
                      drawOnChartArea: false,
                      drawTicks: false,
                    }
                  }},
                 indexAxis: 'y',
                 responsive: true,
                 maintainAspectRatio: false,
                 elements:
                {
                  bar:
                  {
                    borderWidth: 2,
                  }
                },
              }
        });

}

function AreaClicked(obj)
{
   //alert(obj.innerText)
   var Selecionado = obj.getAttribute('data-selecionado')
   if(Selecionado == 0)
   {
        obj.setAttribute('data-selecionado', 1);
        obj.classList.add("list-group-item-dark");
        //selecionar
        //mudar background para escuro
   }
   else
   {
         obj.setAttribute('data-selecionado', 0);
         obj.classList.remove("list-group-item-dark");
        //des-selecionar
        //mudar background para claro

   }

}
function PreencherFiltroArea(Pipes)
{
    for(var i = 0; i < Pipes.length; i++)
    {
        if(!Areas.includes(Pipes[i].tb_pf_area))
        {
            Areas.push(Pipes[i].tb_pf_area)
        }
    }

    var DivAreas = document.getElementById("AreasList")
    var DivParent = DivAreas.parentElement;
    var Colunas = 1;
    var Container = document.createElement("div")
    Container.classList.add("container")
    DivAreas.appendChild(Container)
    var Row;
    for(var i = 0; i < Areas.length; i++)
    {
        if(Colunas > 2 || i==0)
        {
            Row = document.createElement("div");
            Row.classList.add("row");
            Row.style["padding-top"] = "10px";
            Container.appendChild(Row);
            var Col = document.createElement("div");
            Col.classList.add("col-sm");
            Row.appendChild(Col);
            var A = document.createElement("a");
            A.className = "list-group-item list-group-item-action BotoesAreas CursPointer";
            A.setAttribute('data-selecionado', "0")
            A.setAttribute("onclick","AreaClicked(this)");
            Col.appendChild(A)
            if(Areas[i])
            {
                A.innerHTML = Areas[i];
            }
            else
            {
                 A.innerHTML = TextoEmBranco;
            }
            Colunas = 1;
        }
        else
        {

            var Col = document.createElement("div");
            Col.classList.add("col-sm");
            Row.appendChild(Col);
            Row.style["padding-top"] = "10px";
            var A = document.createElement("a");
            A.className = "list-group-item list-group-item-action BotoesAreas CursPointer";
            A.setAttribute('data-selecionado', "0")
            Col.appendChild(A)
            A.setAttribute("onclick","AreaClicked(this)");
            if(Areas[i])
            {
                A.innerHTML = Areas[i];
            }
            else
            {
                 A.innerHTML = TextoEmBranco;
            }
            Colunas++;
        }
    }
    var LinhaInferior = document.createElement("div");
    LinhaInferior.innerHTML=`<div class="list-group-item-warning card-footer CursPointer"><b>Aplicar Filtros</b>`;
    DivParent.append(LinhaInferior)
    LinhaInferior.setAttribute("onclick","AplicarFiltro()");

}
function AplicarFiltro()
{

    // Retirar classes botões status e avanços
    let botoes = document.getElementsByClassName('btn-light-mod-clicado')
    for (const botao of botoes) {
        botao.classList.remove('btn-light-mod-clicado')
    }

    AreasSelecionadas = []
    var Botoes = document.getElementsByClassName("BotoesAreas")
    for(var i = 0; i < Botoes.length; i++)
    {
        if(Botoes[i].getAttribute('data-selecionado') == 1)
        {
            AreasSelecionadas.push(Botoes[i].innerText);
        }
    }
    $("#collapseOne").collapse('hide')
    PreencherDados();

}
function InicializarRodape(PrimeiraExecucao = false)
{
    var table = document.getElementById("TabelaSistemasT");
    var Rodape = document.getElementById("RodapeSistemas")
    Rodape.innerHTML = "";
    let tb = document.createElement('table');
    tb.classList.add("TabelaFlex");
    let thead = document.createElement('thead');
    thead.style.display = "table"
    thead.style.border = "0"
    thead.style.tableLayout = "fixed"
    thead.style.fontSize = "80%"
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let td3 = document.createElement('td');
    let td4 = document.createElement('td');
    let td5 = document.createElement('td');
    let td6 = document.createElement('td');
    let td7 = document.createElement('td');
    let td8 = document.createElement('td');
    let td9 = document.createElement('td');
    let td10 = document.createElement('td');
    let td11 = document.createElement('td');
    let td12 = document.createElement('td');
    let td13 = document.createElement('td');
    let td14 = document.createElement('td');
    let td15 = document.createElement('td');
    let td16 = document.createElement('td');
    // let td17 = document.createElement('td');
    // let td18 = document.createElement('td');
    // td17.style.width = '8px'
    // td18.style.width = '8px'
    thead.appendChild(tr);
    tb.appendChild(thead);
    Rodape.appendChild(tb)
    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);
    tr.appendChild(td6);
    tr.appendChild(td7);
    tr.appendChild(td8);
    tr.appendChild(td9);
    tr.appendChild(td10);
    tr.appendChild(td11);
    tr.appendChild(td12);
    tr.appendChild(td13);
    tr.appendChild(td14);
    tr.appendChild(td15);
    tr.appendChild(td16);
    // tr.appendChild(td17);
    // tr.appendChild(td18);

    tr.style.backgroundColor = "gray";

    var LinhasTotais = 0;
    var LinhasCalculadas = 0;
    var TotalHoras = 0.0;
    var table = document.getElementById("TabelaSistemasT");
    for(var i = 1; i < table.rows.length; i++)
    {
        if($(table.rows[i]).is(':visible') || PrimeiraExecucao==true)
        {
            LinhasTotais += parseInt(table.rows[i].cells[2].textContent);
            LinhasCalculadas += parseInt(table.rows[i].cells[3].textContent);
            TotalHoras+= parseFloat(table.rows[i].cells[12].textContent);
        }
    }
    td1.innerHTML = "Total: ";
    td1.style.color = "white";
    td3.innerHTML = LinhasTotais;
    td3.style.color = "white";
    td4.innerHTML = LinhasCalculadas;
    td4.style.color = "white";
    td13.innerHTML = (Math.round(TotalHoras * 100) / 100);
    td13.style.color = "white";
    td1.onmouseover = function() {
                       this.style.color = "black";
                    }
    td1.onmouseleave = function() {
       this.style.color = 'white';
    }
    td3.onmouseover = function() {
                       this.style.color = "black";
                    }
    td3.onmouseleave = function() {
       this.style.color = 'white';
    }
    td4.onmouseover = function() {
                       this.style.color = "black";
                    }
    td4.onmouseleave = function() {
       this.style.color = 'white';
    }
    td13.onmouseover = function() {
                       this.style.color = "black";
                    }
    td13.onmouseleave = function() {
       this.style.color = 'white';
    }
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
function RetornaIDStatusSistema(IDSistema)
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
    var StatusAtual = StatusF0.tb_st_id
    if (Datas[0] != null)
    {
        StatusAtual = StatusF1.tb_st_id
    }
    if (Datas[1] != null)
    {
        StatusAtual = StatusF1R.tb_st_id
    }
    if (Datas[2] != null)
    {
        StatusAtual = StatusF2.tb_st_id
    }
    if (Datas[3] != null)
    {
        StatusAtual = StatusF3.tb_st_id
    }
    if (Datas[4] != null)
    {
        StatusAtual = StatusF4.tb_st_id
    }
    return StatusAtual;
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
async function GetSistemasOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaSistemasOS/",
      method: "GET",
      data: { os: OS }
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
async function GetHourPersonFlexOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaHourPersonFlexOS/",
      method: "GET",
      data: { os: OS }
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
async function GetSystemFlexTimeOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaSystemFlexTimeOS/",
      method: "GET",
      data: { os: OS }
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
async function RetornaTodosInfoImports() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/TodosInfoImports/",
        method: "GET",
        data: {}
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
async function GetPipesFlex(){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaPipeFlexPorOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}
async function GetSistemasFlex(){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/P2RetornaSistemasPorOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}

async function GetPipeFlexTime(OS){

 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/flxdash/RetornaPipeFlexTime/",
      method: "GET",
      data: { os: OS }
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
async function GetActiveOSFilt()
{

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/ActiveOSFlexFilt/",
        method: "GET",
        data: { 'os': OS}
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
async function GetPendencyFlexOS(OS) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/PendencyFlexOS/",
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
async function RetornaStatusPendencyFlex() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/StatusPendencyFlex/",
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

async function GetAtividadesDash(OS) {
    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadesFlexDash/",
        method: "GET",
        data: { "os": OS}
    });

    return request;
}
