var Person = []
var OSStatus = []
var ActiveOS = []
var TodasOS = []
var PersonTodas = []
var AtividadesFlex
var criterios, estudos, listaMolas, indiceLinhas, listaJuntas, memorial
window.onload = async function () {
    $("#style_switcher").hide()
    Person = await GetPersons();
    OSStatus = await GetOSStatus();
    PersonTodas = await GetPersonsTodas();
    await RecarregarPagina();
};


window.onbeforeunload = function (e) { $("#style_switcher").show()};
async function RecarregarPagina()
{   
    $("#loader").show()
    $("#OsAtivas").hide()

    $("#SelectOS").empty();
    TodasOS = await GetTodasOS();
    ActiveOS = await GetActiveOS();
    // console.log(ActiveOS);
    CriarTabelaActiveOS();
    PreencherSelectOS();

    $("#loader").hide()
    $("#OsAtivas").show()
}
function PesquisarSeActiveOSExiste(OS)
{
    var Achou = false;
    for (var j = 0; j < ActiveOS.length; j++)
    {
        if (ActiveOS[j].tb_faso_os == OS.tb_so_id)
        {
            Achou = true;
            break;
        }
    }
    return Achou;
}
function PreencherSelectOS()
{
    for (var i = 0; i < TodasOS.length; i++)
    {
        if (PesquisarSeActiveOSExiste(TodasOS[i])==false)
        {
            var o = new Option(TodasOS[i].tb_so_type + TodasOS[i].tb_so_num, TodasOS[i].tb_so_id);
            $(o).html(TodasOS[i].tb_so_type + TodasOS[i].tb_so_num);
            o.title = TodasOS[i].tb_so_type + TodasOS[i].tb_so_num;
            $("#SelectOS").append(o);
        }
    }
}
function AdicionarOS()
{
    $("#loaderAdicionarOS").show();
    var OSAdicionar = $("#SelectOS option:selected").val()
    const csrf = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "CadastrarOS", "IDOS": OSAdicionar,  'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await RecarregarPagina();
            $("#loaderAdicionarOS").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function RetornaUsuario(id)
{
    for (var i = 0; i < Person.length; i++)
    {
        if (Person[i].tb_per_id == id)
        {
            return Person[i];
        }
    }
}
function RetornaUsuarioTodas(id) {
    for (var i = 0; i < PersonTodas.length; i++) {
        if (PersonTodas[i].tb_per_id == id) {
            return PersonTodas[i];
        }
    }
}
async function AdicionarUsuario(elemento)
{
    $("#loaderAdicionarUser").show();
    var idActOS = elemento.dataset.idactive;
    var IDUser = $("#SelectUser").val();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "CadastrarUsuario", "IDOSActive": idActOS, "IDUsuario": IDUser, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await RecarregarPagina();
            await CriarTabelaUsuariosEAtualizarSelect(idActOS)
            $("#loaderAdicionarUser").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
async function SalvarMetas(elemento)
{
    $("#ErrosMetas").html("");
    var idActOS = elemento.dataset.idactive;
    var HorasLinha = $("#metas_linhas").val();
    var IndicadorQualidade = $("#metas_qualidade").val();
    var FrequenciaMinima = $("#metas_frequencia").val();
    if (isNaN(HorasLinha) || isNaN(IndicadorQualidade) || isNaN(FrequenciaMinima) || HorasLinha == "" || IndicadorQualidade == "" || FrequenciaMinima == "") // isNaN("") retorna false
    {
        $("#ErrosMetas").html(`<div class="alert alert-danger" role="alert">Preencha os valores de metas corretamente antes de salvar!</div>`)
        return;
    }
    $("#loaderMetas").show();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "SalvarMetas", "IDOSActive": idActOS, "HorasLinha": HorasLinha, "IndicadorQualidade": IndicadorQualidade, "FrequenciaMinima": FrequenciaMinima,  'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json)
        {
            await RecarregarPagina();
            $("#loaderMetas").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err)
        {

        }
    });
}
async function MostrarModalAlteraStatus(elemento)
{

    $("#ErrosMetas").html("");
    $("#ErrosAtividades").html("")
    $('#criterios').removeClass('aviso_erro')[0].offsetWidth // Para reiniciar a animação da borda
    $('#estudos').removeClass('aviso_erro')[0].offsetWidth 
    $('#listaMolas').removeClass('aviso_erro')[0].offsetWidth 
    $('#indiceLinhas').removeClass('aviso_erro')[0].offsetWidth 
    $('#listaJuntas').removeClass('aviso_erro')[0].offsetWidth 
    $('#memorial').removeClass('aviso_erro')[0].offsetWidth 
    var id = elemento.dataset.idactive;
    document.getElementById("BotaoAdicionarUsuarioOS").dataset.idactive = id;
    document.getElementById("BotaoAlterarStatusOS").dataset.idactive = id;
    document.getElementById("BotaoSalvarMetas").dataset.idactive = id;
    document.getElementById("BotaoSalvarAtividades").dataset.idactive = id;
    var ActiveOSSelecionada;
    for (var i = 0; i < ActiveOS.length; i++)
        {
            if (ActiveOS[i].tb_faso_id == id)
                {
                    ActiveOSSelecionada = ActiveOS[i];
                    break;
                }
        }
    var OS = getOS(ActiveOS[i].tb_faso_os)
    $("#TituloOS").text("Atualização OS" + OS.tb_so_num)
    $("#metas_linhas").val(ActiveOSSelecionada.tb_faso_meta_horas_linha);
    $("#metas_qualidade").val(ActiveOSSelecionada.tb_faso_meta_qualidade);
    $("#metas_frequencia").val(ActiveOSSelecionada.tb_faso_meta_frequencia);
    $("#SelectStatus").empty();
    for (var i = 0; i < OSStatus.length; i++)
    {
        var o = new Option(OSStatus[i].tb_flex_so_st_id, OSStatus[i].tb_flex_so_st_id);
        $(o).html(OSStatus[i].tb_flex_so_st_stt);
        o.title = OSStatus[i].tb_flex_so_st_desc;
        $("#SelectStatus").append(o);
        if (OSStatus[i].tb_flex_so_st_id == ActiveOSSelecionada.tb_faso_id_stt_os)
        {
            $("#SelectStatus").val(OSStatus[i].tb_flex_so_st_id).change();
        }
    }

    // TODO:
    // [X] Listar quantidade de atividades já desenvolvidas
    // [X] Selecionar automaticamente checkbox das atividades já desenvolvidas
    // [X] Criar tabelas no banco para lidar com as atividades os checkboxes e atividades que serão desenvolvidas. (Isso afeta o cálculo de avanço no dashboard)

    // Por padrão desativa todos os campos de atividades.
    // Mais a frente é verificado para quais atividades esse campo está liberado. 
    DesativaAtividades()

    // Desmarcar todos os checkboxes por padrão. Mais a frente é feita a verificação e marca-se os checkbox com atividades já desenvolvidas
    $("#criteriosControl").prop('checked', false).parent().attr('title', null)
    $("#estudosControl").prop('checked', false).parent().attr('title', null)
    $("#indiceLinhasControl").prop('checked', false).parent().attr('title', null)
    $("#listaMolasControl").prop('checked', false).parent().attr('title', null)
    $("#listaJuntasControl").prop('checked', false).parent().attr('title', null)
    $("#memorialControl").prop('checked', false).parent().attr('title', null)

    // Por padrão, ativar o botão de salvar as atividades
    $("#BotaoSalvarAtividades").prop('disabled', false)
    $("#BotaoSalvarAtividades").on('click', () => SalvarAtividades())
    
    var os = getOS(ActiveOSSelecionada.tb_faso_os)
    AtividadesFlex = await GetAtividadesFlexControlOS(os.tb_so_num)

    const [criterios_limite, estudos_limite, listaMolas_limite, indiceLinhas_limite, listaJuntas_limite, memorial_limite] = RetornaNumeroAtividadesDesenvolvidas(AtividadesFlex)

    criterios = criterios_limite
    estudos = estudos_limite
    listaMolas = listaMolas_limite
    indiceLinhas = indiceLinhas_limite
    listaJuntas = listaJuntas_limite
    memorial = memorial_limite

    LiberaAtividades(ActiveOSSelecionada)

    if(ActiveOSSelecionada.tb_faso_id_stt_os == 2 || ActiveOSSelecionada.tb_faso_id_stt_os == 3){
        // Se o Status da OS é "Desativada" ou "Somente Leitura", todos checkboxes, inputs e botões devem ser desativados.
        DesativaAtividades()        
    }
    
    $("#ModalAtualizarStatusActiveOS").modal('show')
    await CriarTabelaUsuariosEAtualizarSelect(id);
 
}
function DesativaAtividades(){
    // Desativando checkboxes
    $("#criteriosControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)
    $("#estudosControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)
    $("#indiceLinhasControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)
    $("#listaMolasControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)
    $("#listaJuntasControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)
    $("#memorialControl").prop('disabled', true).prop('onclick', null).off('click').parent().attr('title', null)

    // Desativando inputs
    $("#criterios").prop('disabled', true)
    $("#estudos").prop('disabled', true)
    $("#listaMolas").prop('disabled', true)
    $("#indiceLinhas").prop('disabled', true)
    $("#listaJuntas").prop('disabled', true)
    $("#memorial").prop('disabled', true)

    // Desativando botoes
    $("#criteriosBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#criteriosBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#estudosBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#estudosBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#listaMolasBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#listaMolasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#indiceLinhasBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#indiceLinhasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#listaJuntasBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#listaJuntasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#memorialBotao_menos").prop('disabled', true).prop('onclick', null).off('click')
    $("#memorialBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
    $("#BotaoSalvarAtividades").prop('disabled', true)
    $("#BotaoSalvarAtividades").prop('onclick', null).off("click")

}
function LiberaAtividades (ActiveOSSelecionada){

    // Marcar os checkboxes quando já exisitir atividade desenvolvida ou indicada no banco de dados, caso contrário, libera o checkbox para marcação.
    
    if (criterios || ActiveOSSelecionada.tb_faso_meta_criterios){  
        $("#criteriosControl").prop('checked', true).prop('onclick', null).off('click') // marca o checkbox da atividade
        $("#criterios").prop('disabled', false) // libera campo numérico
        $("#criteriosBotao_mais").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
        $("#criteriosBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#criterios")[0], 'mais')) // Ativa o botão de aumentar atividade
        
        if (criterios > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#criteriosControl").prop('disabled', true) // desabilita o checkbox da atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        } else if (criterios > 0 && ActiveOSSelecionada.tb_faso_meta_criterios > criterios) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#criteriosBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#criteriosBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#criterios")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        } else if (criterios == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#criteriosControl").prop('disabled', false).on('click', () => verificaCheckBox($("#criteriosControl")[0])) // Habilita o checkbox da atividade
            $("#criteriosControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.') // titulo indicando que ainda não foi desenvolvida nenhuma atividade.
            $("#criteriosBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#criteriosBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#criterios")[0], 'menos')) // Ativa o botão de diminuir atividade
        
        }

    } else {
        $("#criteriosControl").prop('disabled', false).on('click', () => verificaCheckBox($("#criteriosControl")[0])) // habilita o checkbox da atividade
    }
    
    if (estudos || ActiveOSSelecionada.tb_faso_meta_estudos){
        $("#estudosControl").prop('checked', true).prop('onclick', null).off('click')
        $("#estudos").prop('disabled', false)
        $("#estudosBotao_mais").prop('onclick', null).off('click')
        $("#estudosBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#estudos")[0], 'mais'))
        
        if (estudos > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#estudosControl").prop('disabled', true)
            $("#estudosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.')
        } else if (estudos > 0 && ActiveOSSelecionada.tb_faso_meta_estudos > estudos) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#estudosBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#estudosBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#estudos")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        }  else if (estudos == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#estudosControl").prop('disabled', false).on('click', () => verificaCheckBox($("#estudosControl")[0]))
            $("#estudosControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.')
            $("#estudosBotao_menos").prop('onclick', null).off('click')
            $("#estudosBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#estudos")[0], 'menos'))

        } 
    } else {
        $("#estudosControl").prop('disabled', false).on('click', () => verificaCheckBox($("#estudosControl")[0]))
    }

    if (indiceLinhas || ActiveOSSelecionada.tb_faso_meta_lista_linhas){
        $("#indiceLinhasControl").prop('checked', true).prop('onclick', null).off('click')
        $("#indiceLinhas").prop('disabled', false)    
        $("#indiceLinhasBotao_mais").prop('onclick', null).off('click')
        $("#indiceLinhasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#indiceLinhas")[0], 'mais'))
        
        if (indiceLinhas > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#indiceLinhasControl").prop('disabled', true)
            $("#indiceLinhasControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.')
        } else if (indiceLinhas > 0 && ActiveOSSelecionada.tb_faso_meta_lista_linhas > indiceLinhas) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#indiceLinhasBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#indiceLinhasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#indiceLinhas")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        }   else if (indiceLinhas == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#indiceLinhasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#indiceLinhasControl")[0]))
            $("#indiceLinhasControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.')
            $("#indiceLinhasBotao_menos").prop('onclick', null).off('click')
            $("#indiceLinhasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#indiceLinhas")[0], 'menos'))

        }
    } else {
        $("#indiceLinhasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#indiceLinhasControl")[0]))
    }
    if (listaJuntas || ActiveOSSelecionada.tb_faso_meta_lista_juntas){
        $("#listaJuntasControl").prop('checked', true).prop('onclick', null).off('click')
        $("#listaJuntas").prop('disabled', false)
        $("#listaJuntasBotao_mais").prop('onclick', null).off('click')
        $("#listaJuntasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaJuntas")[0], 'mais'))
        
        if (listaJuntas > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#listaJuntasControl").prop('disabled', true)
            $("#listaJuntasControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.')
        } else if (listaJuntas > 0 && ActiveOSSelecionada.tb_faso_meta_lista_juntas > listaJuntas) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#listaJuntasBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#listaJuntasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaJuntas")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        } else if (listaJuntas == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#listaJuntasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#listaJuntasControl")[0]))
            $("#listaJuntasControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.')
            $("#listaJuntasBotao_menos").prop('onclick', null).off('click')
            $("#listaJuntasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaJuntas")[0], 'menos'))

        }
    } else {
        $("#listaJuntasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#listaJuntasControl")[0]))
    }
    
    if (listaMolas || ActiveOSSelecionada.tb_faso_meta_lista_molas){
        $("#listaMolasControl").prop('checked', true).prop('onclick', null).off('click')
        $("#listaMolas").prop('disabled', false) 
        $("#listaMolasBotao_mais").prop('onclick', null).off('click')
        $("#listaMolasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaMolas")[0], 'mais'))
        
        if (listaMolas > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#listaMolasControl").prop('disabled', true)
            $("#listaMolasControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.')
        } else if (listaMolas > 0 && ActiveOSSelecionada.tb_faso_meta_lista_molas > listaMolas) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#listaMolasBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#listaMolasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaMolas")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        } else if (listaMolas == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#listaMolasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#listaMolasControl")[0]))
            $("#listaMolasControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.')
            $("#listaMolasBotao_menos").prop('onclick', null).off('click')
            $("#listaMolasBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaMolas")[0], 'menos'))

        }
    } else {
        $("#listaMolasControl").prop('disabled', false).on('click', () => verificaCheckBox($("#listaMolasControl")[0]))
    }
    
    if (memorial || ActiveOSSelecionada.tb_faso_meta_memoriais){
        $("#memorialControl").prop('checked', true).prop('onclick', null).off('click')
        $("#memorial").prop('disabled', false)
        $("#memorialBotao_mais").prop('onclick', null).off('click')
        $("#memorialBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#memorial")[0], 'mais'))
        
        if (memorial > 0){
            // Se já foi desenvolvida alguma atividade.
            $("#memorialControl").prop('disabled', true)
            $("#memorialControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.')
        } else if (memorial > 0  && ActiveOSSelecionada.tb_faso_meta_memoriais > memorial) {
            // Se o número de atividades desenvolvidas é menor que o número de atividades que serão desenvolvidas ao longo do projeto (meta)
            $("#memorialBotao_menos").prop('onclick', null).off('click') // limpa eventos no botão de aumentar atividade
            $("#memorialBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#memorial")[0], 'menos')) // Ativa o botão de aumentar atividade
            $("#criteriosControl").parent().attr('title', 'Não é possível desmarcar porque já foi desenvolvida pelo menos uma atividade.') // titulo indicando que não é possivel desativar porque já foram desenvolvidas algumas atividades
        } else if (memorial == 0) {
            // Se ainda não foi desenvolvida desenvolvida nenhuma atividade.
            $("#memorialControl").prop('disabled', false).on('click', () => verificaCheckBox($("#criteriosControl")[0]))
            $("#memorialControl").parent().attr('title', 'Nenhuma atividade desenvolvida até o momento.')
            $("#memorialBotao_menos").prop('onclick', null).off('click')
            $("#memorialBotao_menos").prop('disabled', false).on('click', () => alteraNumAtividades($("#memorial")[0], 'menos'))
            
        }
    } else {
        $("#memorialControl").prop('disabled', false).on('click', () => verificaCheckBox( $("#memorialControl")[0]))
    }

    // Verificações se as atividades já criadas é maior que a indicada no banco de dados.
    $("#criterios").val(criterios > ActiveOSSelecionada.tb_faso_meta_criterios ? criterios : ActiveOSSelecionada.tb_faso_meta_criterios)
    $("#estudos").val(estudos > ActiveOSSelecionada.tb_faso_meta_estudos ? estudos : ActiveOSSelecionada.tb_faso_meta_estudos)
    $("#listaMolas").val(listaMolas > ActiveOSSelecionada.tb_faso_meta_lista_molas ? listaMolas : ActiveOSSelecionada.tb_faso_meta_lista_molas)
    $("#indiceLinhas").val(indiceLinhas > ActiveOSSelecionada.tb_faso_meta_lista_linhas ? indiceLinhas : ActiveOSSelecionada.tb_faso_meta_lista_linhas)
    $("#listaJuntas").val(listaJuntas > ActiveOSSelecionada.tb_faso_meta_lista_juntas ? listaJuntas : ActiveOSSelecionada.tb_faso_meta_lista_juntas)
    $("#memorial").val(memorial > ActiveOSSelecionada.tb_faso_meta_memoriais ? memorial : ActiveOSSelecionada.tb_faso_meta_memoriais)

}
function RetornaNumeroAtividadesDesenvolvidas(AtividadesFlex) {

    let criterios = 0
    let estudos = 0
    let listaMolas = 0
    let indiceLinhas = 0
    let listaJuntas = 0
    let memorial = 0

    for (var i = 0; i < AtividadesFlex.length; i++){
        // Verificar e popular o número de atividades já desenvolvidas

        let testVar = AtividadesFlex[i].tb_atvflex_identificador
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
            testVar == 14 ||
            testVar == 20){
                estudos += 1
            
        } else if (testVar == 13 || testVar == 22){
            indiceLinhas += 1       
            
        } else if (testVar == 15 || testVar == 19){
            criterios += 1       
            
        } else if (testVar == 16 || testVar == 23){
            listaJuntas += 1
            
        } else if (testVar == 17 || testVar == 21){
            listaMolas += 1
            
        } else if (testVar == 18 || testVar == 24){
            memorial += 1
        }

    }

    return [criterios, estudos, listaMolas, indiceLinhas, listaJuntas, memorial]

}
async function CriarTabelaUsuariosEAtualizarSelect(idActOS)
{
    $("#loaderCarregarUsuarios").show();
    var Usuarios = await GetUsuariosActiveOS(idActOS);
    //console.log(Usuarios);
    Usuarios.sort(function (a, b) {
        var User1 = RetornaUsuarioTodas(a.tb_flx_uos_user);
        var User2 = RetornaUsuarioTodas(b.tb_flx_uos_user);
        if (User1.tb_per_name < User2.tb_per_name) { return -1; }
        if (User1.tb_per_name > User2.tb_per_name) { return 1; }
        return 0;
    })
    $("#SelectUser").empty();
    for (var i = 0; i < Person.length; i++)
    {
        var achou = false;
        for (var j = 0; j < Usuarios.length; j++)
        {   
            if (Usuarios[j].tb_flx_uos_user == Person[i].tb_per_id)
            {
                achou = true;
                //Usuarios[j].tb_per_status = 1
                break;
            }
        }
        if (achou == false)
        {
            var o = new Option(Person[i].tb_per_name, Person[i].tb_per_id);
            $(o).html(Person[i].tb_per_name);
            o.title = Person[i].tb_per_name;
            $("#SelectUser").append(o); 
        }
    }

    var DivTabela = document.getElementById("TabelaUsuariosOS");
    DivTabela.innerHTML = "";
    var table = document.createElement('TABLE');
    var LarguraApagar = 100;
    table.id = "TabelaUsuariosOST";

    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 130px;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead");
    thead.style.display = "table";
    thead.style.tableLayout = "fixed";
    let thr = document.createElement('tr');

    let thNome = document.createElement('th');
    thNome.appendChild(document.createTextNode("Nome"));
    thNome.classList.add("TabelaFiltrar");
    thr.appendChild(thNome);

    let thAdmin = document.createElement('th');
    thAdmin.appendChild(document.createTextNode("Admin"));
    thAdmin.style.width = LarguraApagar + "px"
    thr.appendChild(thAdmin);

    let thApagar = document.createElement('th');
    thApagar.appendChild(document.createTextNode("Apagar"));
    thApagar.style.width = LarguraApagar + "px"
    thr.appendChild(thApagar);

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.style.minHeight = "35px"
    tableBody.classList.add("tbodyTab");
    table.appendChild(tableBody);
    if (Usuarios.length == 0)
    {
        var tr = document.createElement('TR');

        tr.style.display = "table";
        tr.style.tableLayout = "fixed";

        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        };
        let thSemUsuarios = document.createElement('td');
        thSemUsuarios.appendChild(document.createTextNode("Nenhum Usuário Cadastrado"));
        thSemUsuarios.colSpan = 3
        tr.appendChild(thSemUsuarios)
    }
    for (var i = 0; i < Usuarios.length; i++)
    {
        var User = RetornaUsuarioTodas(Usuarios[i].tb_flx_uos_user)
        if (User)
        {
            var tr = document.createElement('TR');
            tr.style.display = "table";
            tr.style.tableLayout = "fixed";
            tableBody.appendChild(tr);

            tr.onmouseover = function () {
                this.style.backgroundColor = "#FF9A0080";
            };

            tr.onmouseleave = function () {
                this.style.backgroundColor = 'white';
            };

            var tdUser = document.createElement('TD');
            var TxtUser = User.tb_per_name;
            var DivUser = document.createElement("div");
            DivUser.innerHTML = TxtUser;
            if (User.tb_per_status == 0)
            {
                DivUser.style.textDecoration = "line-through";
            }
            DivUser.style.overflow = "hidden";
            DivUser.style.textOverflow = "Ellipsis";
            DivUser.style.maxHeight = "18px";
            DivUser.title = TxtUser;
            DivUser.style.whiteSpace = "nowrap";
            tdUser.appendChild(DivUser);
            tr.appendChild(tdUser);

            var tdAdminUser = document.createElement('TD');
            tdAdminUser.classList.add("mousechange")
            var DivAdminUser = document.createElement("div");

            var newCheckBox = document.createElement('input');
            newCheckBox.type = 'checkbox';
            newCheckBox.id = User.tb_per_id;
            newCheckBox.dataset.idactive = idActOS;
            newCheckBox.dataset.idusuario = User.tb_per_id;
            newCheckBox.dataset.iduos = Usuarios[i].tb_flx_uos_id
            if (Usuarios[i].tb_flx_uos_admin == 1)
            {
                newCheckBox.checked = true;
            }
            //newCheckBox.value = check_value[count] + '<br/>';
            DivAdminUser.appendChild(newCheckBox);

            //DivAdminUser.innerHTML = "X";
            DivAdminUser.style.overflow = "hidden";
            DivAdminUser.style.textOverflow = "Ellipsis";
            DivAdminUser.style.maxHeight = "18px";
            DivAdminUser.style.whiteSpace = "nowrap";
            DivAdminUser.title = "Definir usuário como administrador de OS na janela de controle";
            newCheckBox.onclick = function () { SetUsuarioAdmin(this); }
            tr.dataset.idactive = "IDCHECK" + idActOS;
            tr.dataset.idusuario = User.tb_per_id;
            tdAdminUser.appendChild(DivAdminUser);
            tdAdminUser.style.width = LarguraApagar + "px"
            tr.appendChild(tdAdminUser);

            var tdApagarUser = document.createElement('TD');
            tdApagarUser.classList.add("mousechange")
            var DivApagarUser = document.createElement("div");
            DivApagarUser.innerHTML = "X";
            DivApagarUser.style.overflow = "hidden";
            DivApagarUser.style.textOverflow = "Ellipsis";
            DivApagarUser.style.maxHeight = "18px";
            DivApagarUser.style.whiteSpace = "nowrap";
            DivApagarUser.title = "Excluir Usuário da Lista";
            tdApagarUser.dataset.idactive = idActOS;
            tdApagarUser.dataset.idusuario = User.tb_per_id;
            tdApagarUser.dataset.iduos = Usuarios[i].tb_flx_uos_id
            tdApagarUser.onclick = function () { MostrarModalConfirmarExcluirUsuario(this); }
            tdApagarUser.dataset.idactive = idActOS;
            tdApagarUser.dataset.idusuario = User.tb_per_id;
            tdApagarUser.appendChild(DivApagarUser);
            tdApagarUser.style.width = LarguraApagar + "px"
            tr.appendChild(tdApagarUser);    
        }  
    }
    DivTabela.appendChild(table);

    $('#TabelaUsuariosOST').excelTableFilter({ columnSelector: '.TabelaFiltrar',captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });
    $("#loaderCarregarUsuarios").hide();
}
function SetUsuarioAdmin(elemento) {
    var IDUSER = elemento.dataset.iduos;
    //console.log(IDUSER);
    //if (elemento.checked) {
    //    console.log("Adicionar admin");
    //}
    //else
    //{
    //    console.log("Remover admin");
    //}
    
    //console.log(elemento);


    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "MudarAdmin", "Status": elemento.checked, "IDUsuario": IDUSER, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            //await RecarregarPagina();
            //await CriarTabelaUsuariosEAtualizarSelect(idActOS)
            //$("#loaderExcluir").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function MostrarModalConfirmarExcluirUsuario(elemento)
{
    idActOS = elemento.dataset.idactive
    idUser = elemento.dataset.idusuario
    document.getElementById("BotaoSimExcluirUsuario").dataset.idactive = idActOS;
    document.getElementById("BotaoSimExcluirUsuario").dataset.idusuario = idUser;
    $("#ModalAtualizarStatusActiveOS").modal("hide");
    $("#ModalConfirmarExcluirUsuario").modal("show");
}
function CancelarExclusao()
{
    $("#ModalConfirmarExcluirUsuario").modal("hide");
    $("#ModalAtualizarStatusActiveOS").modal("show");
}
function ExcluirUsuarioConfirmado(elemento)
{
    $("#ModalConfirmarExcluirUsuario").modal("hide");
    $("#ModalAtualizarStatusActiveOS").modal("show");
    idActOS = elemento.dataset.idactive
    idUser = elemento.dataset.idusuario
    $("#loaderExcluir").show();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "ExcluirUsuario", "IDOSActive": idActOS, "IDUsuario": idUser, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await RecarregarPagina();
            await CriarTabelaUsuariosEAtualizarSelect(idActOS)
            $("#loaderExcluir").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
async function AlterarStatus(elemento)
{
    $("#loaderAlteraStats").show();
    var id = elemento.dataset.idactive;
    var IDStatusNovo = $("#SelectStatus").val();
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    
    // TODO:
    // [X] Fazer a verificação se já foram desenvolvidas certas atividades, caso positivo marcar checkbox com verdadeiro e desativar
    // - CASOS:
    //      [X] OS está "Somente Leitura" ou "Desativada" e passa para "Editável":
    //          [X] Libera botão salvar atividades
    //          [X] Libera input de atividades já desenvolvidas ou já assinaladas 
    //          [X] Libera botões de mais "+"" de atividades já desenvolvidas ou já assinaladas 
    //          [X] Libera edição checkboxes de atividades sem nenhum registro
    // 
    //      [X] OS está passa para "Somente Leitura" ou "Desativada":
    //          [X] Desativar todos os botões, checkboxes e inputs. 

    
    
    if(IDStatusNovo == 1){
        // Se o status é alterado para "Editável"

        var ActiveOSSelecionada;
        for (var i = 0; i < ActiveOS.length; i++)
            {
                if (ActiveOS[i].tb_faso_id == id)
                    {
                        ActiveOSSelecionada = ActiveOS[i];
                        break;
                    }
            }

        // Ativa o botão de salvar atividades
        $("#BotaoSalvarAtividades").prop('disabled', false)
        $("#BotaoSalvarAtividades").on('click', () => SalvarAtividades())

        // Libera inputs e botão de adicionar atividade se já tem atividade listada
        // Libera checkboxes se não tem atividade listada


        // $("#criterios").prop('disabled', $("#criterios").val() > 0 ?  false : true)
        // if ($("#criterios").val() > 0){
        //     $("#criteriosBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#criterios")[0], 'mais'))
        //     $("#criteriosControl").prop('disabled', true).prop('onclick', null).off('click')
        // } else {
        //     $("#criteriosBotao_mais").prop('disabled', true).prop('onclick', null).off('click')
        //     $("#criteriosControl").prop('disabled', false)

        // }
        
        // $("#estudos").prop('disabled', $("#estudos").val() > 0 ?  false : true)
        // if ($("#estudos").val() > 0){
        //     $("#estudosBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades(($("#estudos")[0], 'mais')))
        // } else {
        //     $("#estudosBotao_mais").prop('disabled', true).prop('onclick', null).off('click')

        // }

        // $("#indiceLinhas").prop('disabled', $("#indiceLinhas").val() > 0 ?  false : true)
        // if ( $("#indiceLinhas").val() > 0){
        //     $("#indiceLinhasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades( $("#indiceLinhas")[0], 'mais'))
        // } else {
        //     $("#indiceLinhasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')

        // }

        // $("#listaMolas").prop('disabled', $("#listaMolas").val() > 0 ?  false : true)
        // if ($("#listaMolas").val() > 0){
        //     $("#listaMolasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#listaMolas")[0], 'mais'))
        // } else {
        //     $("#listaMolasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')

        // }

        // $("#listaJuntas").prop('disabled', $("#listaJuntas").val() > 0 ?  false : true)
        // if ( $("#listaJuntas").val() > 0){
        //     $("#listaJuntasBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades( $("#listaJuntas")[0], 'mais'))
        // } else {
        //     $("#listaJuntasBotao_mais").prop('disabled', true).prop('onclick', null).off('click')

        // }

        // $("#memorial").prop('disabled', $("#memorial").val() > 0 ?  false : true)
        // if ($("#memorial").val() > 0){
        //     $("#memorialBotao_mais").prop('disabled', false).on('click', () => alteraNumAtividades($("#memorial")[0], 'mais'))
        // } else {
        //     $("#memorialBotao_mais").prop('disabled', true).prop('onclick', null).off('click')

        // }

                     
        
        // $("#estudosControl").prop('disabled', $("#estudos").val() > 0 ?  true : false)
        // $("#indiceLinhasControl").prop('disabled', $("#indiceLinhas").val() > 0 ?  true : false)
        // $("#listaMolasControl").prop('disabled', $("#listaMolas").val() > 0 ?  true : false)
        // $("#listaJuntasControl").prop('disabled', $("#listaJuntas").val() > 0 ?  true : false)
        // $("#memorialControl").prop('disabled', $("#memorial").val() > 0 ?  true : false)

        // Libera inputs e botão de adicionar atividade se já tem atividade listada
        // Libera checkboxes se não tem atividade listada 

        LiberaAtividades(ActiveOSSelecionada)
            
    } else {
        // Se o status é alterado para "Somente Leitura" ou "Desativada"
        DesativaAtividades()
    }

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "AlterarStatusOS", "IDOSActive": id, "IDStatusNovo": IDStatusNovo, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
        // handle a successful response
        success: async function (json) {
            await RecarregarPagina();
            $("#loaderAlteraStats").hide();
        },

        // handle a non-successful response
        error: function (xhr, errmsg, err) {

        }
    });
}
function CriarTabelaActiveOS()
{
    var DivTabela = document.getElementById("TabelaActiveOS");
    DivTabela.innerHTML = "";
    var fieldTitles = ["OS", "Status", "Meta Horas/Linha", "Meta Qualidade (%)", "Meta Frequência (Hz)", "Data Abertura", "Data Fechamento"];
    var table = document.createElement('TABLE');

    table.id = "TabelaActiveOST";

    table.classList.add("TabelaFlex");
    table.setAttribute("style", "max-height: 70vh;");
    let thead = document.createElement('thead');
    thead.classList.add("LarguraHead");
    thead.style.display = "table";
    thead.style.tableLayout = "fixed";
    let thr = document.createElement('tr');

    fieldTitles.forEach((fieldTitle) => {
        let th = document.createElement('th');
        th.appendChild(document.createTextNode(fieldTitle));
        thr.appendChild(th);
    });

    thead.appendChild(thr);
    table.appendChild(thead);
    var tableBody = document.createElement('TBODY');
    tableBody.style.minHeight = "35px"
    tableBody.classList.add("tbodyTab");
    table.appendChild(tableBody);
    if (ActiveOS.length == 0)
    {
        var tr = document.createElement('TR');
       
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
       
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        };
        let thTecnico = document.createElement('td');
        thTecnico.appendChild(document.createTextNode("Nenhuma Ordem de Serviço Controlada"));
        thTecnico.colSpan = fieldTitles.length;
        tr.appendChild(thTecnico)
    }
    ActiveOS.sort(function (a, b)
    {
        let x = b.tb_faso_os,
            y = a.tb_faso_os;
        return x == y ? 0 : x > y ? 1 : -1;
    });
    for (var i = 0; i < ActiveOS.length; i++)
    {
        var tr = document.createElement('TR');
        tr.style.display = "table";
        tr.style.tableLayout = "fixed";
        tr.classList.add("mousechange")
        tr.ondblclick = async function () { await MostrarModalAlteraStatus(this); }
        tr.dataset.idactive = ActiveOS[i].tb_faso_id;
        tableBody.appendChild(tr);

        tr.onmouseover = function () {
            this.style.backgroundColor = "#FF9A0080";
        };

        tr.onmouseleave = function () {
            this.style.backgroundColor = 'white';
        };

        var OS = getOS(ActiveOS[i].tb_faso_os)
        var Status = getStatusOS(ActiveOS[i].tb_faso_id_stt_os)

        var tdOS = document.createElement('TD');
        var TxtOS = OS.tb_so_type+ OS.tb_so_num;
        var DivOS = document.createElement("div");
        DivOS.innerHTML = TxtOS;
        DivOS.style.overflow = "hidden";
        DivOS.style.textOverflow = "Ellipsis";
        DivOS.style.maxHeight = "18px";
        DivOS.title = TxtOS;
        DivOS.style.whiteSpace = "nowrap";
        tdOS.appendChild(DivOS);
        tdOS.dataset.valor = TxtOS;
        tr.appendChild(tdOS);

        var tdStatusOS = document.createElement('TD');
        var txtStatusOS = Status.tb_flex_so_st_stt;
        var DivStatusOS = document.createElement("div");
        DivStatusOS.innerHTML = txtStatusOS;
        DivStatusOS.style.overflow = "hidden";
        DivStatusOS.style.textOverflow = "Ellipsis";
        DivStatusOS.style.maxHeight = "18px";
        DivStatusOS.title = Status.tb_flex_so_st_desc;
        DivStatusOS.style.whiteSpace = "nowrap";
        tdStatusOS.appendChild(DivStatusOS);
        tdStatusOS.dataset.valor = txtStatusOS;
        tr.appendChild(tdStatusOS);

        var tdMetaHorasOS = document.createElement('TD');
        var txtMetaHorasOS = ActiveOS[i].tb_faso_meta_horas_linha;
        var DivMetaHorasOS = document.createElement("div");
        DivMetaHorasOS.innerHTML = txtMetaHorasOS;
        DivMetaHorasOS.style.overflow = "hidden";
        DivMetaHorasOS.style.textOverflow = "Ellipsis";
        DivMetaHorasOS.style.maxHeight = "18px";
        DivMetaHorasOS.title = ActiveOS[i].tb_faso_meta_horas_linha;
        DivMetaHorasOS.style.whiteSpace = "nowrap";
        tdMetaHorasOS.appendChild(DivMetaHorasOS);
        tdMetaHorasOS.dataset.valor = txtMetaHorasOS;
        tr.appendChild(tdMetaHorasOS);

        var tdMetaQualidadeOS = document.createElement('TD');
        var txtMetaQualidadeOS = ActiveOS[i].tb_faso_meta_qualidade;
        var DivMetaQualidadeOS = document.createElement("div");
        DivMetaQualidadeOS.innerHTML = txtMetaQualidadeOS;
        DivMetaQualidadeOS.style.overflow = "hidden";
        DivMetaQualidadeOS.style.textOverflow = "Ellipsis";
        DivMetaQualidadeOS.style.maxHeight = "18px";
        DivMetaQualidadeOS.title = ActiveOS[i].tb_faso_meta_qualidade;
        DivMetaQualidadeOS.style.whiteSpace = "nowrap";
        tdMetaQualidadeOS.appendChild(DivMetaQualidadeOS);
        tdMetaQualidadeOS.dataset.valor = txtMetaQualidadeOS;
        tr.appendChild(tdMetaQualidadeOS);

        var tdMetaFrequenciaOS = document.createElement('TD');
        var txtMetaFrequenciaOS = ActiveOS[i].tb_faso_meta_frequencia;
        var DivMetaFrequenciaOS = document.createElement("div");
        DivMetaFrequenciaOS.innerHTML = txtMetaFrequenciaOS;
        DivMetaFrequenciaOS.style.overflow = "hidden";
        DivMetaFrequenciaOS.style.textOverflow = "Ellipsis";
        DivMetaFrequenciaOS.style.maxHeight = "18px";
        DivMetaFrequenciaOS.title = ActiveOS[i].tb_faso_meta_frequencia;
        DivMetaFrequenciaOS.style.whiteSpace = "nowrap";
        tdMetaFrequenciaOS.appendChild(DivMetaFrequenciaOS);
        tdMetaFrequenciaOS.dataset.valor = txtMetaFrequenciaOS;
        tr.appendChild(tdMetaFrequenciaOS);

        var tdDtInicialOS = document.createElement('TD');
        var txtDtInicialOS = "";
        if (OS.tb_so_open_date)
        {
            var Data = new Date(OS.tb_so_open_date)
            txtDtInicialOS = Data.toLocaleDateString()
        }
        var DivDtInicialOS = document.createElement("div");
        DivDtInicialOS.innerHTML = txtDtInicialOS;
        DivDtInicialOS.style.overflow = "hidden";
        DivDtInicialOS.style.textOverflow = "Ellipsis";
        DivDtInicialOS.style.maxHeight = "18px";
        DivDtInicialOS.title = txtDtInicialOS;
        DivDtInicialOS.style.whiteSpace = "nowrap";
        tdDtInicialOS.appendChild(DivDtInicialOS);
        tdDtInicialOS.dataset.valor = txtDtInicialOS;
        tr.appendChild(tdDtInicialOS);

        var tdDtFinalOS = document.createElement('TD');
        var txtDtFinalOS = "";
        if (ActiveOS[i].tb_faso_dt_fim)
        {
            var Data = new Date(ActiveOS[i].tb_faso_dt_fim)
            txtDtFinalOS = Data.toLocaleDateString()
        }
        var DivDtFinalOS = document.createElement("div");
        DivDtFinalOS.innerHTML = txtDtFinalOS;
        DivDtFinalOS.style.overflow = "hidden";
        DivDtFinalOS.style.textOverflow = "Ellipsis";
        DivDtFinalOS.style.maxHeight = "18px";
        DivDtFinalOS.title = txtDtFinalOS;
        DivDtFinalOS.style.whiteSpace = "nowrap";
        tdDtFinalOS.appendChild(DivDtFinalOS);
        tdDtFinalOS.dataset.valor = txtDtFinalOS;
        tr.appendChild(tdDtFinalOS);

        
    }
    DivTabela.appendChild(table);

    $('#TabelaActiveOST').excelTableFilter({ captions: { a_to_z: 'A à Z', z_to_a: 'Z à A', search: 'Pesquisar', select_all: 'Selecionar Todos' } });

}
function verificarNumAtividade(elemento) { // função para verificar se é número inteiro, maior que zero e não quebra as regras iniciais
    //TODO:
    // [X] Quando número de atividades chegar no limite inferior, desativar botão menos "-"
    // [X] Se já existir atividades não deixar o número escolhido ser menor do que as atividades existentes
    // [X] Se entrar com um valor inválido, resetar para o número de atividades já criadas

    elemento.classList.remove('invalido')
    let inputID = $('#' + elemento.id.replace('Control', ''))
    let botaoMenosID = $('#' + elemento.id.replace('Control', '') + 'Botao_menos')

    let limiteInferior = 0

    switch (elemento.id){
        case 'criterios':
            limiteInferior = criterios
            break
            
        case 'estudos':
            limiteInferior = estudos
            break

        case 'listaMolas':
            limiteInferior = listaMolas
            break

        case 'indiceLinhas':
            limiteInferior = indiceLinhas
            break

        case 'listaJuntas':
            limiteInferior = listaJuntas
            break

        case 'memorial':
            limiteInferior = memorial
            break
    }

    if(Number.isInteger(parseInt(elemento.value))){
        if (parseInt(elemento.value) > 0 && parseInt(elemento.value) > limiteInferior){
            elemento.value = parseInt(elemento.value)
            if (botaoMenosID.prop('disabled')){
                botaoMenosID.prop('onclick', null).off('click')
                botaoMenosID.prop('disabled', false).on('click', () => alteraNumAtividades(inputID[0], 'menos'))
            }
        }
        else if (parseInt(elemento.value) == limiteInferior){
            // desativa o botão de menos
            botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
        } else {
            elemento.value = limiteInferior
            botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
        }
    } else {
        elemento.value = limiteInferior
        botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
    }
}
function alteraNumAtividades(elemento, acao){
    // TODO:
    // INFO: O limite inferior é o número de atividades já executadas
    // [X] Verificar se o número de atividades de entrada é menor que o limite inferior
    // [X] Sempre que adicionar uma atividade, liberar o botão de menos se esse já não estiver liberado
    // [X] Quando chegar no limite inferior desativar o botão de menos   
    
    let inputID = $('#' + elemento.id.replace('Control', ''))
    let botaoMenosID = $('#' + elemento.id.replace('Control', '') + 'Botao_menos')
    
    let limiteInferior = 0

    switch (elemento.id){
        case 'criterios':
            limiteInferior = criterios
            break
            
        case 'estudos':
            limiteInferior = estudos
            break

        case 'listaMolas':
            limiteInferior = listaMolas
            break

        case 'indiceLinhas':
            limiteInferior = indiceLinhas
            break

        case 'listaJuntas':
            limiteInferior = listaJuntas
            break

        case 'memorial':
            limiteInferior = memorial
            break
    }
    
    if(Number.isInteger(parseInt(elemento.value)) && parseInt(elemento.value) >= 0 && parseInt(elemento.value) >= limiteInferior){
        // checagem se o número no input é um inteiro, maior que 0 e maior que o limite inferior
        switch (acao){
            case 'mais':
                elemento.value =  parseInt(elemento.value) + 1
                
                if (botaoMenosID.prop('disabled')){
                    botaoMenosID.prop('onclick', null).off('click')
                    botaoMenosID.prop('disabled', false).on('click', () => alteraNumAtividades(inputID[0], 'menos'))
                }

                break
                
            case 'menos':
                if (parseInt(elemento.value) == 0 || parseInt(elemento.value) == limiteInferior){
                    botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
                    
                    break
                }

                if (parseInt(elemento.value) == 1){
                    elemento.value = parseInt(elemento.value) - 1
                    botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
                    
                    break
                }

                elemento.value = parseInt(elemento.value) - 1

                break
        }
    } else {
        elemento.value = limiteInferior
    }

}
function verificaCheckBox(elemento){
    // Função para tratar quando o usuário muda o checkbox.
    // Comportamento:
    //      1 - Se está desmarcado, significa que o número de atividades atual é zero (número de atividades desenvolvidas tem que ser zero) ou não foi indicada nenhuma atividade no banco (atividades no banco tem que ser zero, também)
    // TODO:
    //          [X] Liberar input quando for marcado
    //          [X] Liberar botão mais "+"
    //          [X] Colocar função onclick no botão +
    // 
    //      2 - Se está marcado, ou tem atividades indicadas no banco, ou já foi desenvolvida alguma ativida, ou ambos.
    // TODO:
    //          [X] Se nenhuma atividade foi desenvolvida (ainda), ter a opção de desmarcar.
    //              [X] Quando desmarcar, alterar o input para zero
    //              [X] Quando desmarcar, desativar o input e botões
    //          [X] Se já há atividade desenvolvida, colocar nota flutuante avisando que já foi desenvolvida atividade "X" por isso não pode desmarcar.



    let checked = elemento.checked
    let inputID = $('#' + elemento.id.replace('Control', ''))
    let botaoMenosID = $('#' + elemento.id.replace('Control', '') + 'Botao_menos')
    let botaoMaisID = $('#' + elemento.id.replace('Control', '') + 'Botao_mais')

    if (checked) {
        inputID.prop('disabled', false)
        botaoMaisID.prop('onclick', null).off('click')
        botaoMaisID.prop('disabled', false).on('click', () => alteraNumAtividades(inputID[0], 'mais'))
    } else{
        botaoMenosID.prop('disabled', true).prop('onclick', null).off('click')
        inputID.prop('disabled', true)
        botaoMaisID.prop('disabled', true).prop('onclick', null).off('click')
        inputID.val(0)
    }
}
function SalvarAtividades() {

    $("#loaderAtividades").show()
    var idActOS = $('#BotaoSalvarAtividades')[0].dataset.idactive

    // TODO: 
    // [X] checar se o número de atividades nos campos são menores que as atividades já desenvolvidas

    $('#criterios').removeClass('aviso_erro')[0].offsetWidth // Para reiniciar a animação da borda
    $('#estudos').removeClass('aviso_erro')[0].offsetWidth 
    $('#listaMolas').removeClass('aviso_erro')[0].offsetWidth 
    $('#indiceLinhas').removeClass('aviso_erro')[0].offsetWidth 
    $('#listaJuntas').removeClass('aviso_erro')[0].offsetWidth 
    $('#memorial').removeClass('aviso_erro')[0].offsetWidth 

    $("#ErrosAtividades").html("")
    // Recebe o número de atividades desenvolvidas
    let [criterios, estudos, listaMolas, indiceLinhas, listaJuntas, memorial] = RetornaNumeroAtividadesDesenvolvidas(AtividadesFlex)

    // Verifica se o número de atividades informado é menor que o número de atividades já desenvolvidas.
    let erro = false
    // TODO:
    // [X] Indicar os campos com erros. Ver tratativa de erro da ferramenta de pressão interna.
    
    if ($("#criterios").val() < criterios){
        $('#criterios').addClass('aviso_erro')
        erro = true
    }
    if ($("#estudos").val() < estudos){
        $('#estudos').addClass('aviso_erro')
        erro = true
    }
    if ($("#listaMolas").val() < listaMolas){
        $('#listaMolas').addClass('aviso_erro')
        erro = true
    }
    if ($("#indiceLinhas").val() < indiceLinhas){
        $('#indiceLinhas').addClass('aviso_erro')
        erro = true
    }
    if ($("#listaJuntas").val() < listaJuntas){
        $('#listaJuntas').addClass('aviso_erro')
        erro = true
    }
    if ($("#memorial").val() < memorial){
        $('#memorial').addClass('aviso_erro')
        
        erro = true
    }
    if(erro){
        // Se há algum campo com o número de atividades menor do que o número de atividades já realizadas
        $("#ErrosAtividades").html(`<div class="alert alert-danger" role="alert">O número(s) de atividades informado(s) é(são) menor(es) que os já executados!</div>`)
        setTimeout(() => {
            $("#ErrosAtividades").html('')
        }, 3000)

        $("#loaderAtividades").hide()
        return
    }
    // Caso contrário ou o número informado é igual ou maior
    // Checar se o valor é "", no devel funciona (considerado 0 - zero), em produção da erro para converter para int.
    criterios = $("#criterios").val() == false ? 0 : $("#criterios").val()
    estudos = $("#estudos").val() == false ? 0 : $("#estudos").val()
    listaMolas = $("#listaMolas").val() == false ? 0 : $("#listaMolas").val()
    indiceLinhas = $("#indiceLinhas").val() == false ? 0 : $("#indiceLinhas").val()
    listaJuntas = $("#listaJuntas").val() == false ? 0 : $("#listaJuntas").val()
    memorial = $("#memorial").val() == false ? 0 : $("#memorial").val()

    const csrf = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/flexibilidade/ControleOS/", // the endpoint
        type: "POST", // http method
        dataType: "json",
        data: { "Operacao": "AtualizarAtividades", "IDOSActive": idActOS, "metaCriterios": criterios, "metaEstudos": estudos, "metaListaMolas": listaMolas, "metaListaLinhas": indiceLinhas, "metaListaJuntas": listaJuntas, "metaMemoriais": memorial, 'csrfmiddlewaretoken': csrf[0].value }, // data sent with the post request
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
function getStatusOS(idStatus)
{
    for (var i = 0; i < OSStatus.length; i++)
    {
        if (OSStatus[i].tb_flex_so_st_id == idStatus)
        {
            return OSStatus[i]
        }
    }
}
function getOS(idOS)
{
    for (var i = 0; i < TodasOS.length; i++)
    {
        if (TodasOS[i].tb_so_id == idOS)
        {
            return TodasOS[i];
        }
    }
}
async function GetUsuariosActiveOS(actosId) {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/UsersActOS/",
        method: "GET",
        data: { "actos": actosId }
    });

    return request;

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
async function GetTodasOS() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/TodasOS/",
        method: "GET",
        data: {}
    });

    return request;

}
async function GetOSStatus() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/SoStatusFlex/",
        method: "GET",
        data: {}
    });

    return request;

}
async function GetActiveOS() {

    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/flxdash/ActiveOSFlex/",
        method: "GET",
        data: {}
    });

    return request;

}

async function GetAtividadesFlexControlOS(OS) {
    let request;
    request = await $.ajax({
        url: "/app/flexibilidade/sistemas/api/AtividadesFlexControlOS/",
        method: "GET",
        data: { "os": OS}
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
