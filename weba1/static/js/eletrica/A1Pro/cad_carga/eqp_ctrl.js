var element_load_wheel = null
function load_element_load_wheel() {
    /**
     *Função para carregar o modal da load wheel
     */
    element_load_wheel = new bootstrap.Modal(document.getElementById("ModalLoadWheel"), {
        backdrop: 'static',
        keyboard: true
    });
}

var element_sim_nao_modal = null
function load_element_sim_nao_modal(Title, Body, YesButonFunction, NoButonFunction) {

document.getElementById('SimNaoModalTitle').innerHTML = Title;
document.getElementById('SimNaoModalBody').innerHTML = Body;
document.getElementById('SimNaoModalBotalSim').onclick = YesButonFunction
document.getElementById('SimNaomodalBotalNao').onclick = NoButonFunction
element_sim_nao_modal = new bootstrap.Modal(document.getElementById('SimNaoModal'), {
    backdrop: 'static',
    keyboard: true
});

}

async function RetornaEquipOs(tipo) {
    /**
     * Função assincrona que faz a busca dos equipamentos por os Busca na tabela de ligação e pega a origem
     * @param {string} tipo - Tipo do equipamento
     * @return {*} - Retorna uma procedure
     */
    const osnum = document.getElementById('OS').title;
    const area = document.getElementById('Area').title;

    let request = await $.ajax({
        url: "/app/eletrica/a1pro/RetornaEquipOs/",
        method: "GET",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPOEQUIP': tipo}
    })
    return request
}

function onload_page_eqp(){
    /**
     * Executa as funções abaixo ao carregar a pagina html
     */
    verify_hierarchy_in_screen('eqp');
    load_element_load_wheel();
    ClearCarga();
    ShowOrHideTipoAli(false)
}

async function FillSearchEquip(TipoEquip, TipoGeral) {
        /**
         * Função que preenche as tags dos equipamentos selecionados no campo de origem
         * @param {String} TipoEquip - Tipo de equipamento
         * @param {String} TipoGeral - Tipo geral -> mais referente a tela
         */

        //ClearFields(true)
        ClearFieldsEquip(true)
        disabled_radios_carga(false)
        if(!element_load_wheel){
            load_element_load_wheel()
        }
        document.querySelectorAll("div.position-relative > *")[0].style.visibility=''
        document.querySelectorAll("div.position-relative > *")[0].classList.add('animate__zoomIn')
        try {
            var Equip = ''
            if (TipoEquip === 'Motores') {
                Equip = 'MO';
            } else if (TipoEquip === 'Transformadores') {
                Equip = 'TR';
            } else if (TipoEquip === 'Paineis') {
                Equip = 'PN';
            } else if (TipoEquip === 'Barramento'){
                Equip = 'BR'
            } else {
                Equip = 'CA';
            }
            let InfoEquip = await RetornaEquipOs(Equip);
            let EquipValues = ''
            document.getElementById('eqps_content_motor').hidden = Equip === 'MO'?false:true
            InfoEquip = InfoEquip['Equips']
            for (var i = 0; i < InfoEquip.length; i++) {
                EquipValues += `<option onclick="FillInfoEquip(${InfoEquip[i]['id']})" value=${InfoEquip[i]['id']}> ${InfoEquip[i]['tag']}</option>`
            }
            document.getElementById(`${TipoGeral}SearchSelect`).innerHTML = EquipValues
        } catch (erro) {
            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            swalAlert(false, 'é necessário ajustar o tipo de partida do motor!.', 'error', false)
        }
        setTimeout(()=>{
            document.querySelectorAll("div.position-relative > *")[0].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[0].classList.remove('animate__zoomIn')
        }, 500)
    }

function disabled_radios_carga(disabled){
    let inputs_radio_carga = document.querySelectorAll('[name="eqp-datas-carga-type"]')
    for(let i = 0; i < inputs_radio_carga.length; i++){
       inputs_radio_carga[i].disabled=disabled
    }
}

async function FillInfoEquip(IdEqp) {
        /**
         * Função para preencher todas as informações do Equipamento e também do Destino
         * @param {Int} IdLicacao - Id da tabela TbLicacao
         */
        debugger;
        document.querySelectorAll("div.position-relative > *")[0].style.visibility=''
        document.querySelectorAll("div.position-relative > *")[0].classList.add('animate__zoomIn')
        LimitFieldsEqp(false, true)
        ClearCarga()
        try {
            let InfoEqp = await RetornaEqpInfo(IdEqp);
            let inputs_radio_carga = document.querySelectorAll('[name="eqp-datas-carga-type"]')
            var Equip = InfoEqp['Eqp']['tipo_equip']
            for(let i = 0; i < inputs_radio_carga.length; i++){
               if(Equip == inputs_radio_carga[i].value){
                   inputs_radio_carga[i].checked=true
               }
               else{
                   inputs_radio_carga[i].checked=false
               }
               inputs_radio_carga[i].disabled=true
            }
            //////////////////// DADOS CARGA /////////////////////////////////////////
            await FillFieldsEqp(InfoEqp, true, IdEqp)
            WorkingWithAux(InfoEqp, Equip)
            WorkingWithSaidasTrafo(InfoEqp, Equip)
            CheckTypeLig('PRIN', 'TypesAliInEqp')
         } catch (e) {
            console.log(e)
             // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            swalAlert(false, 'é necessário ajustar o tipo de partida do motor!.', 'error', false)
        }
        setTimeout(()=>{
            document.querySelectorAll("div.position-relative > *")[0].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[0].classList.remove('animate__zoomIn')
        }, 500)
}

function WorkingWithSaidasTrafo(datas_eqp, tipo_eqp){
    if(tipo_eqp === 'TR'){
        document.getElementById('eqps_content_trafo').hidden = false
        FillSaidasExistsTrafo(datas_eqp['saidas'])
    }
    else{
        document.getElementById('eqps_content_trafo').hidden = true
        ClearSaidasTrafo()
    }
}

function FillSaidasExistsTrafo(saidas){
    var html_all_saidas_exists = ``
    for(let i = 0; i < saidas.length; i++){
        html_all_saidas_exists += `<div class="col-8 bg-secondary rounded-pill mt-2 saidas_existentes">
                                        <div class="row">
                                            <div class="col-9">
                                                <input value="${saidas[i]}" class="bg-secondary" readonly name="eqp_tensao_saida_exists">
                                            </div>
                                            <div class="col-3">
                                                <i class="fa-solid fa-xmark" onclick="DeleteSaidaExist(this)"></i>
                                            </div>
                                        </div>
                                    </div>`
    }
    document.getElementById('eqps_all_saidas_exists').innerHTML = html_all_saidas_exists

}
function WorkingWithAux(InfoEqp, Equip){
    var DatasEqp = InfoEqp['Eqp']
    if(Equip === 'PN' || Equip === 'CA' || Equip === 'TR'){
        ShowOrHideTipoAli(true)
        CreateButtonsTipoAli(DatasEqp['auxiliares'])
    }
    else{
        ShowOrHideTipoAli(false)
        CreateButtonsTipoAli({})
    }
}

function CreateButtonsTipoAli(DatasForButoon){
    var btns_html = `<button type="button" class="btn btn-warning btn-sm ml-1" value="PRIN" name="TypesAliInEqp" onclick="OnclickButtonsAux('PRIN');">PRIN</button>`
    for(let id in DatasForButoon){
        btns_html += `<button type="button" value="${DatasForButoon[id]}" class="btn btn-warning btn-sm ml-1" name="TypesAliInEqp" onclick="OnclickButtonsAux('${DatasForButoon[id]}');">${DatasForButoon[id]}</button>`
    }
    $('#btns-aux-exist').html(btns_html)
}
function ShowOrHideTipoAli(Show){
    if(Show === true){
        $('#btn-adc-tipo-ali').show()
    }
    else {
        $('#btn-adc-tipo-ali').hide()
    }
}

function LimitFieldsEqp(block, checked_pn){
    let inputs_radio_carga = document.querySelectorAll('[name="eqp-datas-carga-type"]')
    for(let i = 0; i < inputs_radio_carga.length; i++){
        if (checked_pn == true){
            if('PN' == inputs_radio_carga[i].value){
                inputs_radio_carga[i].checked=true
            }
            else{
                inputs_radio_carga[i].checked=false
            }
        }
        inputs_radio_carga[i].disabled=true
    }
    document.getElementById('btn-eqp-acess').disabled=block
    document.getElementById('CargaTagCliente').disabled=block
    document.getElementById('CargaFluxograma').disabled=block
    document.getElementById('CargaLocalPlanta').disabled=block
    document.getElementById('CargaTagEqp').disabled=block
    document.getElementById('CargaProtecao').disabled=block
    document.getElementById('CargaFornecedor').disabled=block
    document.getElementById('CargaArea').disabled=block
    document.getElementById('CargaSubArea').disabled=block
    document.getElementById('CargaStatus').disabled=block
    document.getElementById('CargaCormaConstru').disabled=block
    document.getElementById('CargaFabricante').disabled=block
    document.getElementById('CargaRevisao').disabled=block
    document.getElementById('CargaDescEN').disabled=block
    document.getElementById('CargaObservacao').disabled=block
}
function CreateAcessInEqp(Acessorios){
    let options_acess_exists = ``
    for(id_key in Acessorios){
        options_acess_exists += `<option value="${id_key}" draggable="true" ondragstart="DragAcessForTrash(event, ${id_key})">${Acessorios[id_key]}</option>`
    }
    $('#AcessInEquip').html(options_acess_exists)
}

async function FillFieldsEqp(InfoEqp, All, IdEqp){
    debugger;
    const DadosEqp = InfoEqp['Eqp']
    CreateAcessInEqp(DadosEqp['acessorios'])
    document.getElementById('CargaTagCliente').value = DadosEqp['tag_cliente']
    document.getElementById('CargaFluxograma').value = DadosEqp['fluxograma']
    document.getElementById('CargaLocalPlanta').value = DadosEqp['local_planta']
    document.getElementById('CargaPotencia').value = DadosEqp['pot_kw'] ? DadosEqp['pot_kw'].toString().replace(/\./g, ",") : DadosEqp['pot_kw'];
    document.getElementById('CargaPotenciaAparente').value = DadosEqp['pot_kva'] ? DadosEqp['pot_kva'].toString().replace(/\./g, ",") : DadosEqp['pot_kva'];
    document.getElementById('CargaPotenciaCavalos').value = DadosEqp['pot_cv'] ? DadosEqp['pot_cv'].toString().replace(/\./g, ",") : DadosEqp['pot_cv'];
    document.getElementById('CargaCorrente').value = DadosEqp['corrente'] ? DadosEqp['corrente'].toString().replace(/\./g, ",") : DadosEqp['corrente'];
    document.getElementById('CargaTagEqp').value = DadosEqp['tag_eqp']
    document.getElementById('CargaTensao').value = DadosEqp['tensao']
    document.getElementById('CargaProtecao').value = DadosEqp['grau_prot']
    document.getElementById('CargaFornecedor').value = DadosEqp['fornecedor']
    document.getElementById('code_tipico').value = DadosEqp['code_tipico']
    document.getElementById('IdEquip').value = IdEqp
    if(All == true){
        $('#CargaStatus').val(DadosEqp['status'])
    }
    //document.getElementById('CargaAcessorios').value = DadosEqp['acessorio']
    document.getElementById('CargaCormaConstru').value = DadosEqp['forma_construtiva']
    document.getElementById('CargaFabricante').value = DadosEqp['fabricante']
    document.getElementById('CargaRevisao').value = DadosEqp['rev']
    document.getElementById('CargaDescPT').value = DadosEqp['desc_pt']
    document.getElementById('CargaDescEN').value = DadosEqp['desc_en']
    document.getElementById('CargaObservacao').value = DadosEqp['obs']
    document.getElementById('code_tipico').value = DadosEqp['code_tipico']
    document.getElementById('IdEquip').value = IdEqp
    if(All == true){
        $('#CargaArea').val(DadosEqp['area'])
        await change_area_eqps()
        $('#CargaSubArea').val(DadosEqp['sub_area'])
    }
    document.getElementById('eqps_gerar_cabos').checked = !DadosEqp['gerar_cabo']

    ///////////////////////// MOTOR ///////////////////////////////////////////
    if (InfoEqp['Motor']){
        let event = new Event('change')
        const DadosMotor = InfoEqp['Motor']
        document.getElementById('CargRPM').value = DadosMotor['rotacao']
        document.getElementById('CargaPolos').value = DadosMotor['npolos']
        document.getElementById('CargaTipoRotor').value = DadosMotor['tipo_rotor']
        document.getElementById('CargaTipoMotor').value = DadosMotor['tipo_motor']
        document.getElementById('CargaCarcaca').value = DadosMotor['carcaca']
        document.getElementById('CargaIpIn').value = DadosMotor['ip_in'] ? DadosMotor['ip_in'].toString().replace(/\./g, ",") : DadosMotor['ip_in']
        document.getElementById('CargaFpPartida').value = DadosMotor['fp_partida']

        $('#CargaTipoPartida').val(DadosMotor['Partida'])
        change_tipo_partida()
        document.getElementById('CargaIpIn').dispatchEvent(event);
    }
    else{
        ClearMotor();
    }
}

async function RetornaEqpInfo(id_eqp){
    /**
     * Função que faz a busca das informações do equipamento selecionado
     * @param {int} id_eqp - Id da tabela TbEquipEletric
     * @return {*} - Retorna uma procedure
     */
    let request = await $.ajax({
        url: `/app/eletrica/a1pro/RetornaEqpInfo/${id_eqp}/`,
        method: "GET",
        data: {}
    })
    return request
}

async function SendDatasEqp(tipo) {
    /**
     * Função que faz a busca das informações do equipamento selecionado na parte de destino
     * @param {String} Opcao - Opção de seleção (Alterar ou Adicionar)
     * @return {*} - Retorna uma procedure
     */
    const DatasEqp = VerifyAndGetDatasEqp();
    if(typeof (DatasEqp) == 'string'){
        return manipuling_modal_a1pro('Dados inválidos!!', DatasEqp)
    }
    try {
        // Adiciona o tipo
        DatasEqp['tipo'] = tipo;

        const response = await $.ajax({
          url: `/app/eletrica/a1pro/DatasEqp/`,
          method: "GET",
          data: { 'data': JSON.stringify(DatasEqp) },
          contentType: "application/json; charset=utf-8",
        });
        manipuling_modal_a1pro('Aviso!!', response['data']);
    } catch (error) {
        console.error("Erro durante a execução do AJAX:", error);
    }
}

function VerifyAndGetDatasMotor(){
    var datas_with_error = []
    var TPartida = $('#CargaTipoPartida').val()
    var IpIn = document.getElementById('CargaIpIn').value.replace(',', '.')
    var Carcaca = document.getElementById('CargaCarcaca').value
    var TMotor = document.getElementById('CargaTipoMotor').value
    var TRotor = document.getElementById('CargaTipoRotor').value
    var NPolos = document.getElementById('CargaPolos').value
    var RPM = document.getElementById('CargRPM').value
    var fp_partida = document.getElementById('CargaFpPartida').value

    if(TPartida=="none"){
        datas_with_error.push('Selecione um Tipo de partida')
    }
    if(IpIn.length>30 || IpIn === ''){
        datas_with_error.push('IP/IN está incorrente ou não foi cadastrado.')
    }
    if(Carcaca.length>100){
        datas_with_error.push('Carcaça atingiu a quantidade maxima de caracteres')
    }
    if(TMotor.length>30){
        datas_with_error.push('Tipo Motor atingiu a quantidade maxima de caracteres')
    }
    if(TRotor.length>30){
        datas_with_error.push('Tipo Rotor atingiu a quantidade maxima de caracteres')
    }
    if(isNaN(Number(NPolos))==false){
        if(NPolos.length>11){
            datas_with_error.push('N°Polos inválido')
        }
    }
    else {
        datas_with_error.push('N°Polos precisa ser numérico')
    }
    if(isNaN(Number(RPM))==false){
        if(RPM.length>11){
            datas_with_error.push('Rotação inválida')
        }
    }
    else {
        datas_with_error.push('Rotação precisa ser numérica')
    }

    if(datas_with_error.length>0){
        return datas_with_error.join(', ')
    }
    else{
        return {
            'TPartida': TPartida,
            'IpIn': IpIn,
            'Carcaca': Carcaca,
            'TMotor': TMotor,
            'TRotor': TRotor,
            'NPolos': NPolos,
            'Rot': RPM,
            'FpPartida': fp_partida
        }
    }
}
function VerifyAndGetDatasEqp() {
    /**
     *  Função para enviar as informações alteradas para o backend com o intuito de atualizar os dados
     */
        ///////////////////////////////////// CAMPOS OBRIGATORIOS /////////////////////////////////
    var datas_with_error = []
    var checkbox_type_equip = document.querySelectorAll('[name="eqp-datas-carga-type"]')
    var type_selected = ''
    for(let i = 0; i < checkbox_type_equip.length; i++){
        if(checkbox_type_equip[i].checked){
            type_selected = checkbox_type_equip[i].value
        }
    }
    const TagEquip = document.getElementById('CargaTagEqp').value
    const Status = $('#CargaStatus').val()
    const Area = $('#CargaArea').val()
    const SubArea = $('#CargaSubArea').val()
    const IdEqp = $('#CargasSearchSelect').val()
    ////////////////////// FIM CAMPOS OBRIGATORIOS /////////////////////////////

    ////////////////////// CAMPOS NÃO OBRIGATORIOS /////////////////////////////
    const TagCliente = document.getElementById('CargaTagCliente').value
    const Fluxograma = document.getElementById('CargaFluxograma').value
    const LocalPlanta = document.getElementById('CargaLocalPlanta').value
    const PotKW = document.getElementById('CargaPotencia').value
    const PotKVA = document.getElementById('CargaPotenciaAparente').value
    const PotCV = document.getElementById('CargaPotenciaCavalos').value
    const PotA = document.getElementById('CargaCorrente').value
    const Tensao = document.getElementById('CargaTensao').value
    const GrProt = document.getElementById('CargaProtecao').value
    const Fornecedor = document.getElementById('CargaFornecedor').value
    const FormaConstru = document.getElementById('CargaCormaConstru').value
    const Fabricante = document.getElementById('CargaFabricante').value
    const Rev = document.getElementById('CargaRevisao').value
    const DescPT = document.getElementById('CargaDescPT').value
    const DescEN = document.getElementById('CargaDescEN').value
    const Obs = document.getElementById('CargaObservacao').value
    let gerar_cabo = !document.getElementById('eqps_gerar_cabos').checked ? true : false
    const Acessorios = PickAcessInEquip()
    let PotKWFormatado = PotKW
    let PotKVAFormatado = PotKVA
    let PotCVFormatado = PotCV
    let PotAFormatado = PotA
    console.log(PotKWFormatado, PotKVAFormatado, PotCVFormatado, PotAFormatado)
    var TypePn = 'PRIN'
    //-----------------VERIFICANDO CADA CAMPO CONFORME SEU TIPO NO BANCO ---------------------------------//
    if (type_selected == ''){
        datas_with_error.push('Selecione um Tipo de equipamento')
    }
    if(type_selected==='PN' || type_selected==='CA' || type_selected === 'TR'){
        TypePn = pick_type_pn_selected()
    }
    if(TypePn == 'PRIN'){
        if(TagEquip.length == 0 || TagEquip.length >99){
        datas_with_error.push('Tag inválida')
        }
        if(Status=="none"){
            datas_with_error.push('Selecione um Status')
        }
        if(Area=="none"){
            datas_with_error.push('Selecione uma Area')
        }
        if(SubArea=="none"){
            datas_with_error.push('Selecione uma SubArea')
        }
        if(TagCliente.length>99){
            datas_with_error.push('Tag Cliente inválida')
        }
        if(Fluxograma.length>50){
            datas_with_error.push('Fluxograma inválido')
        }
        if(LocalPlanta.length>50){
            datas_with_error.push('Local Planta inválido')
        }
        if(GrProt.length>50){
            datas_with_error.push('Grau Proteção inválido')
        }
        if(Fornecedor.length>100){
            datas_with_error.push('Fornecedor inválido')
        }
        if(FormaConstru.length>50){
            datas_with_error.push('Forma construtiva inválida')
        }
        if(Fabricante.length>50){
            datas_with_error.push('Fabricante inválido')
        }
        if(isNaN(Number(Rev))==false){
            if(Rev.length>11){
                datas_with_error.push('Revisão inválida')
            }
        }
        else {
            datas_with_error.push('Revisão precisa ser numérica')
        }
        if(Obs.length>50){
            datas_with_error.push('Observação inválida')
        }
    }
    if(isNaN(Number(PotKW))==true){
        datas_with_error.push('Potencia(KW) inválida')
    }
    if(isNaN(Number(PotKVA))==true){
        datas_with_error.push('Potencia(KVA) inválida')
    }
    if(isNaN(Number(PotCV))==true){
        datas_with_error.push('Potencia(CV) inválida')
    }
    if(isNaN(Number(PotA))==true){
        datas_with_error.push('Corrente(A) inválida')
    }
    if(isNaN(Number(Tensao))==true){
        datas_with_error.push('Tensão(V) inválida')
    }
    //-----------------------FIM DA VERIFICAÇÃO------------------------------//

    if(datas_with_error.length>0){
        return datas_with_error.join(', ')
    }
    else{
        var DadosMotor = ''
        var saidas_trafo = []
        if(type_selected=='MO'){
            DadosMotor = VerifyAndGetDatasMotor()
            if(typeof (DadosMotor) == 'string'){
                return DadosMotor
            }
        }
        if(type_selected=='TR'){
            saidas_trafo = GetSaidasTrafo()
        }

        return {
            'Eqp': {
                'Acessorios': Acessorios,
                'IdEqp': IdEqp,
                'TagEqp': TagEquip,
                'TipoEqp': type_selected,
                'Status': Status,
                'Area': Area,
                'SubArea': SubArea,
                'TagCliente': TagCliente,
                'Fluxograma': Fluxograma,
                'LocalPlanta': LocalPlanta,
                'PotKW': PotKWFormatado,
                'PotKVA': PotKVAFormatado,
                'PotCV': PotCVFormatado,
                'PotA': PotAFormatado,
                'Tensao': Tensao,
                'GrProt': GrProt,
                'Fornecedor': Fornecedor,
                'FConst': FormaConstru,
                'Fabricante': Fabricante,
                'Rev': Rev,
                'DescPT': DescPT,
                'DescEN': DescEN,
                'Obs': Obs,
                'TypePn': TypePn,
                'saidas': saidas_trafo,
                'gerar_cabo': gerar_cabo
            },
            'Motor': DadosMotor
        }
    }
}

function pick_type_pn_selected(){
    var list_elements = document.querySelectorAll('[name="TypesAliInEqp"]')
    var type_selected = 'PRIN'
    for(let i = 0; i < list_elements.length; i++){
        if(list_elements[i].className.includes('secondary')){
            type_selected = list_elements[i].value
            break
        }
    }
    return type_selected
}

function GetSaidasTrafo(){
    let saidas = []
    let elements_saidas = document.getElementsByName('eqp_tensao_saida_exists')
    for(let i = 0; i < elements_saidas.length; i++){
        saidas.push(elements_saidas[i].value)
    }
    return saidas
}

function OpenModalAreYouSureExclude() {
    debugger;
    const id_eqp = $('#CargasSearchSelect').val()
    if (id_eqp.length == 1) {
        const Title = 'Exclusão!'
        const Body = 'Você tem certeza que deseja excluir esse equipamento ?\nDeletando ele você perdera tudo relacionado ao mesmo'
        const YesButonFunction = DeleteEqp;
        load_element_sim_nao_modal(Title, Body, YesButonFunction, null);
        element_sim_nao_modal.show()
    } else {
        manipuling_modal_a1pro('Se liga!!', 'Selecione um único equipamento!!')
    }
}

function DeleteEqp() {
    $.ajax({
        url: `/app/eletrica/a1pro/DeleteEqp/` + $('#CargasSearchSelect').val() + '/',
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        manipuling_modal_a1pro('Sucesso!', data['data'])
    })
}

function ClearMotor() {
    /**
     * Função para limpar as informações do motor
     */
    document.getElementById('CargRPM').value = ''
    document.getElementById('CargaPolos').value = ''
    document.getElementById('CargaTipoRotor').value = ''
    document.getElementById('CargaTipoMotor').value = ''
    document.getElementById('CargaCarcaca').value = ''
    document.getElementById('CargaIpIn').value = ''
    document.getElementById('CargaPartidaDescricao').value = ''
    document.getElementById('CargaPartidaTipo').value = ''
    $('#CargaTipoPartida').val('none')
}

function ClearCarga() {
    /**
     *Função para limpar as informações do Equipamento
     */
    let inputs_radio_carga = document.querySelectorAll('[name="eqp-datas-carga-type"]')
    for(let i = 0; i < inputs_radio_carga.length; i++){
        inputs_radio_carga[i].checked=false
    }
    disabled_radios_carga(false)
    document.getElementById('CargaTagCliente').value = ''
    document.getElementById('CargaFluxograma').value = ''
    document.getElementById('CargaLocalPlanta').value = ''
    document.getElementById('CargaPotencia').value = ''
    document.getElementById('CargaPotenciaAparente').value = ''
    document.getElementById('CargaPotenciaCavalos').value = ''
    document.getElementById('CargaCorrente').value = ''
    document.getElementById('CargaTensao').value = ''
    document.getElementById('CargaProtecao').value = ''
    document.getElementById('code_tipico').value = ''
    document.getElementById('CargaTagEqp').value = ''
    document.getElementById('CargaFornecedor').value = ''
    $('#CargaStatus').val("none")
    document.getElementById('CargaCormaConstru').value = ''
    document.getElementById('CargaFabricante').value = ''
    document.getElementById('CargaRevisao').value = ''
    document.getElementById('CargaDescPT').value = ''
    document.getElementById('CargaDescEN').value = ''
    document.getElementById('CargaObservacao').value = ''
    $('#CargaSubArea').html(``)
    document.getElementById('CargaSubArea').disabled=true
    $('#CargaArea').val("none")
    $('#AcessInEquip').html(``)

}

function ClearFieldsEquip(all) {
    /**
     * Função que limpa todos os campos e pelo parametro consegue-se limpar também os campos de busca
     * @param {boolean} all - Se true limpa tudo, Se false Limpa apenas as informações da ligação
     */
    if (all === true) {
        document.getElementById(`CargasSearchSelect`).innerHTML = ''
    }
    WorkingWithAux({}, null)
    LimitFieldsEqp(false, false)
    ClearCarga()
    ClearMotor()
    ClearSaidasTrafo()
    document.getElementById('eqps_content_motor').hidden=true
    document.getElementById('eqps_content_trafo').hidden=true
}

async function change_area_eqps(){
    var area = $('#CargaArea').val()
    if (area!='none'){
        let DatasReturn = await GetSubAreasPerOs(area)
        create_options_sub_area_in_eqps(DatasReturn['sub_areas'], 'CargaSubArea')
    }
}

function create_options_sub_area_in_eqps(sub_areas, IdElementSubArea){
    $('#'+IdElementSubArea).html(``)
    if(sub_areas.length>0){
        document.getElementById(IdElementSubArea).disabled=false
        var options_sub_area = `<option value="none">Selecione a Sub Area</option>`
        for(let i = 0; i < sub_areas.length; i++){
            options_sub_area += `<option value="${sub_areas[i]}">${sub_areas[i]}</option>`
        }
        $('#'+IdElementSubArea).html(options_sub_area)

    }
    else{
        $('#'+IdElementSubArea).html(`<option value="none">Nenhuma Sub Area nessa Area</option>`)
    }
}
async function GetSubAreasPerOs(area){
    var datas = {}
    await $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/SubAreasPerArea/" + area,
        dataType: 'json',
        success: function (data){
            datas = data
        },
        failure: function(error){
            alert("erro")
        },
    })
    return datas
}

function countItems() {
    setTimeout(()=>{
            document.getElementById("itemCount").innerText = $('#CargasSearchSelect option').length
        }, 1000)
}


function BtnTypeEqpChecked(id, name, color_checked, color_default){
    var list_elements = document.querySelectorAll("[name=" + name + "]")
    var class_list= 'mr-2 tablinks btn btn-'
    if (id!='not-id') {
        for (let i = 0; i < list_elements.length; i++) {
            if (list_elements[i].id == id) {
                document.getElementById(list_elements[i].id).className = class_list + color_checked
            } else {
                document.getElementById(list_elements[i].id).className = class_list + color_default
            }
        }
    }
    else{
        for (let i = 0; i < list_elements.length; i++) {
            document.getElementById(list_elements[i].id).className = class_list + color_default
        }
    }
}

// Ao clicar na carga busca os acessórios e equipamentos
document.getElementById('CargasSearchSelect').addEventListener('click', OnclickAcessEquip)

async function OnclickAcessEquip(){
    // $('#ModalAcessEquip').modal('show')
    var AllAcess = await GetAllAcessEquip()
    FillAllAcessEquip(AllAcess['AllAcess'])
    FillAcessInEquip(AllAcess['AcessInEquip'])
}

function FillAllAcessEquip(AllAcessOs){
    $('#AllAcessInEquip').html('')
    var OptionAllAcess = ''
    for(IdAcess in AllAcessOs){
        OptionAllAcess += `<option value="${IdAcess}" draggable="true" ondragstart="DragStartAdcAcess(event, ${IdAcess}, '${AllAcessOs[IdAcess]}')">${AllAcessOs[IdAcess]}</option>`
    }
    $('#AllAcessInEquip').html(OptionAllAcess)
}

function FillAcessInEquip(AllAcessInEquip){
    $('#AcessInEquip').html('')
    var OptionsAcessInEquip = ''
    for(IdAcess in AllAcessInEquip){
        OptionsAcessInEquip += `<option value="${IdAcess}" draggable="true" ondragstart="DragAcessForTrash(event, ${IdAcess})">${AllAcessInEquip[IdAcess]}</option>`
    }
    $('#AcessInEquip').html(OptionsAcessInEquip)
}

async function GetAllAcessEquip(){
    var IdEqp = $('#CargasSearchSelect').val()
    if(IdEqp.length === 0){
        IdEqp = ''
    }
    else{
        IdEqp = IdEqp[0]
    }
    return $.ajax({
        url: `/app/eletrica/a1pro/AcessEquipOs/`,
        method: "GET",
        data: {'IdEqp': IdEqp},
        contentType: "application/json; charset=utf-8"
    });
}

function DragStartAdcAcess(event, id_acess, name_acess){
    event.dataTransfer.setData('id_acess', id_acess+'#'+name_acess)
}

function DropAdcAcess(event){
    event.preventDefault()
    let acess = event.dataTransfer.getData('id_acess').split('#')
    var AllAcessExists = PickAcessInEquip()
    let id_acess = acess[0]
    if(AllAcessExists.includes(id_acess)){
        alert('Acessório ja existente nesse equipamento')
    }
    else{
        let name_acess = acess[1]
        let option_new_acess = `<option value="${id_acess}" draggable="true" ondragstart="DragAcessForTrash(event, ${id_acess})">${name_acess}</option>`
        document.getElementById('AcessInEquip').innerHTML += option_new_acess
    }
    changecolor_gerents(event, 'white', 'AcessInEquip')
}

function PickAcessInEquip(){
    var AllOptionEqps = document.getElementById('AcessInEquip').children
    var ListIdsAcessAdc = []
    for (let i = 0; i < AllOptionEqps.length; i++){
        ListIdsAcessAdc.push(AllOptionEqps[i].value)
    }
    return ListIdsAcessAdc
}

function DragAcessForTrash(event, id_acess){
    event.dataTransfer.setData('TrashAcess', id_acess)
}

function DropAcessForTrash(event){
    event.preventDefault()
    var IdAcess = event.dataTransfer.getData('TrashAcess')
    var AllOptionEqps = document.getElementById('AcessInEquip').children
    for (let i = 0; i < AllOptionEqps.length; i++){
        if(IdAcess == AllOptionEqps[i].value){
            AllOptionEqps[i].remove()
            SendDatasEqp('Alterar')
        }
    }
}

function clickDropAccesForTrash(event) {
    event.preventDefault()
    let element_select = document.getElementById('AcessInEquip')
    let option_select = element_select.options[element_select.selectedIndex]

    if (option_select) {
        option_select.remove()
        SendDatasEqp('Alterar')

        // Argumentos possíveis (tipo, mesagem, timeout(milisegundos))
        messageNotification('success','Acessório removido com sucesso!')

    } else {
        // Argumentos possíveis (tipo, mesagem, timeout(milisegundos))
        messageNotification('error','Selecione algum acessório para continuar!')
    }
}

function messageNotification(tipo, message, time) {
    toastr.options = {
      "closeButton": false,
      "debug": false,
      "newestOnTop": false,
      "progressBar": true,
      "positionClass": "toast-top-center",
      "preventDuplicates": true,
      "onclick": null,
      "showDuration": "300",
      "hideDuration": "1000",
      "timeOut": time ? time.toString() : "5000",
      "extendedTimeOut": "1000",
      "showEasing": "swing",
      "hideEasing": "linear",
      "showMethod": "fadeIn",
      "hideMethod": "fadeOut"
    }
    toastr[tipo](message)
}

function HandleIdEqpSelected(){
    var HandleEqpSelected = $('#CargasSearchSelect').val()
    var IdSelected = null
    if(HandleEqpSelected.length>0){
        IdSelected = HandleEqpSelected[0]
    }
    return IdSelected
}


async function OnclickButtonAdcTipoAli(OpenModal){
    var IdEqpSelected = HandleIdEqpSelected()
    if(IdEqpSelected!=null){
        var AllDatas = await GetAllTiposAliAndTiposAliInEquip(IdEqpSelected)
        ListAllTiposAli(AllDatas['AllTiposAli'])
        ListTiposAliEquip(AllDatas['TipoAliEqp'])
        if(OpenModal === true){
            $('#ModalAdcTipoAli').modal('show')
        }
    }
}

function ListAllTiposAli(AllTiposAli){
    var ButtonsAllTiposAli = ``
    for(let Id in AllTiposAli){
        ButtonsAllTiposAli += `
            <div class="row mx-2 mt-2">
                <div class="input-group mb-2 mr-sm-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text bg-success" title="${Id}" href="#" onclick="AdcOrDelTipoAliInEquip(${Id}, 'GET')">+</div>
                  </div>
                  <input type="text" class="form-control" disabled value="${AllTiposAli[Id]}">
                </div>
            </div>
        `
    }
    $('#append-types-ali').html(ButtonsAllTiposAli)
}
async function RequestRegisterOrDelTipoAliInEqp(IdTipoAli, IdEqp, Method){
    let request = await $.ajax({
        url: `/app/eletrica/a1pro/RegisterOrDeleteTiposAliInEqp/` + IdTipoAli + `/` + IdEqp + `/`,
        method: Method,
        data: {},
        contentType: "application/json; charset=utf-8"
    });
    return request
}

async function AdcOrDelTipoAliInEquip(IdTipoAli, Method){
    var IdEqp = HandleIdEqpSelected()
    var Request = await RequestRegisterOrDelTipoAliInEqp(IdTipoAli, IdEqp, Method)
    alert(Request['return'])
    await OnclickButtonAdcTipoAli(false)
}

function ListTiposAliEquip(TiposAliEquip){
    var ButtonsTiposAliEqp = ``
    for(let Id in TiposAliEquip){
        ButtonsTiposAliEqp += `
            <div class="row mx-2 mt-2">
                <div class="input-group mb-2 mr-sm-2">
                  <div class="input-group-prepend">
                    <div class="input-group-text bg-danger" title="${Id}" href="#" onclick="AdcOrDelTipoAliInEquip(${Id}, 'DELETE');">X</div>
                  </div>
                  <input type="text" class="form-control" disabled value="${TiposAliEquip[Id]}">
                </div>
            </div>
        `
    }
    $('#delete-types-ali').html(ButtonsTiposAliEqp)
}

async function GetAllTiposAliAndTiposAliInEquip(IdEqp){
    let request = await $.ajax({
        url: `/app/eletrica/a1pro/WorkingWithTiposAli/` + IdEqp + `/`,
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    });
    return request
}

async function GetDatasAux(IdEqp, TipoLig){
    let request = await $.ajax({
        url: `/app/eletrica/a1pro/GetDatasAux/` + IdEqp + `/` + TipoLig + `/`,
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    });
    return request
}

async function OnclickButtonsAux(TipoLig){
    CheckTypeLig(TipoLig, 'TypesAliInEqp')
    var IdEqp = HandleIdEqpSelected()
    if(IdEqp!=null){
        if(TipoLig!='PRIN'){
            await FillInfoEquipAux(IdEqp, TipoLig)
        }
        else{
            await FillInfoEquip(IdEqp)
        }
    }
}

async function FillInfoEquipAux(IdEqp, TipoLig){
    var DatasAux = await GetDatasAux(IdEqp, TipoLig)
    ClearCarga()
    LimitFieldsEqp(true, true)
    ClearSaidasTrafo()
    document.getElementById('eqps_content_trafo').hidden=true
    await FillFieldsEqp(DatasAux, false, '')
}


function CheckTypeLig(LigSelected, Name){
    var ClassNamePatern = 'warning'
    var ClassNameSelected = 'secondary'
    var AllButtonsLigsEqp = document.querySelectorAll("[name=" + Name + "]")
    for(let i = 0; i < AllButtonsLigsEqp.length; i++){
        if(LigSelected === AllButtonsLigsEqp[i].value){
            AllButtonsLigsEqp[i].className = 'btn btn-'+ClassNameSelected+' btn-sm ml-1'
        }
        else{
            AllButtonsLigsEqp[i].className = 'btn btn-'+ClassNamePatern+' btn-sm ml-1'
        }
    }
}

function AddSaidaInTrafo(){
    let all_saidas_in_trafo = document.getElementsByName('eqp_tensao_saida_exists')
    let msg_swal = ''
    if(all_saidas_in_trafo.length < 2){
        let new_saida = document.getElementById('eqps_tensao_nova_saida').value
        if(!isNaN(Number(new_saida))){
            let html_new_saida = `<div class="col-8 bg-secondary rounded-pill mt-2 saidas_existentes">
                                        <div class="row">
                                            <div class="col-9">
                                                <input value="${new_saida}" class="bg-secondary" readonly name="eqp_tensao_saida_exists">
                                            </div>
                                            <div class="col-3">
                                                <i class="fa-solid fa-xmark" onclick="DeleteSaidaExist(this)"></i>
                                            </div>
                                        </div>
                                    </div>`
            document.getElementById('eqps_all_saidas_exists').innerHTML += html_new_saida
            return null
        }
        else{
            msg_swal = "Tensão é numerica!!"
        }
    }
    else{
        msg_swal = "Não é permitido mais que 2 saidas por trafo"
    }
    return swal({
        title: "Atenção!",
        text: msg_swal,
        icon: "warning",
        button: "Fechar",
    })
}

function DeleteSaidaExist(element){
    element.parentElement.parentElement.parentElement.remove()
}

function ClearSaidasTrafo(){
    document.getElementById('eqps_tensao_nova_saida').value = ''
    document.getElementById('eqps_all_saidas_exists').innerHTML = ''
}

function ChangeFileConvertTemplate(){
    let file = document.getElementById('file_convert_template').files[0]
    if(file !== undefined){
        document.getElementById('label_file_convert_template').innerHTML = file.name
    }
    else{
        document.getElementById('label_file_convert_template').innerHTML = 'Selecione um arquivo'
    }
}

function ShowModalConvertTemplate(){
    ClearInputFileConvertTemplate()
    $('#modal_template_convert').modal('show')
}

function ClearInputFileConvertTemplate(){
    document.getElementById('file_convert_template').value=''
    ChangeFileConvertTemplate()
}

function SendFileConvertTemplate(){
    let file = document.getElementById('file_convert_template').files[0]
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(file !== undefined){
        if(file.name.includes('xlsx')){
            var Form = new FormData()
            Form.append('FileTemplateConvert', file)
            $.ajax({
                url: "/app/eletrica/a1pro/ConvertTemplates/", // Caminho do Ajax
                type: "POST", // http method
                headers:{'X-CSRFToken':csrftoken},
                dataType: "json",
                data: Form, // Envia form pela solicitação do POST
                processData: false,
                contentType: false,
                success: function (data) {
                    InitProgressConvertTemplate(data['task_id'])
                },
                failure: function () {
                    alert('Algo deu errado! verifique e tente novamente.')
                }
            })
        }
        else{
            SwalWarning('Só é aceito arquivos xlsx')
        }
    }
    else{
        SwalWarning('Envie algum arquivo primeiro!!')
    }
}

function ClearProgressBar(id_bar, id_bar_msg){
    document.getElementById(id_bar).style.width = '0%'
    document.getElementById(id_bar_msg).innerHTML = ''
}

function InitProgressConvertTemplate(task_id){
    var progressUrl = `/celery-progress/${task_id}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
          progressBarId: 'progress-bar-ct',
          progressBarMessageId: 'progress-bar-message-ct',
          onSuccess: customSucess,
          onError: customError,
          onProgress: customProgress,
        })

        function customSucess(progressBarElement, progressBarMessageElement, result){
            progressBarElement.style.backgroundColor = '#76ce60';
            progressBarMessageElement.innerHTML = 'Sucesso!!'
            if(result.status === 'Success'){
                window.open('/app/eletrica/a1pro/ConvertTemplates/' + task_id + '/', '_self')
            }
            else{
                $('#modal_template_convert').modal('hide')
                $('#Modal_Load_Import_Carga').modal('show')
                AjaxTaskID(  `${task_id}` )
            }
            ClearProgressBar('progress-bar-ct', 'progress-bar-message-ct')
        }

        function customError(progressBarElement, progressBarMessageElement, excMessage){
            progressBarElement.style.backgroundColor = '#dc4f63';
            progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
            + progressUrl;
        }

        function customProgress(progressBarElement, progressBarMessageElement, progress){
            progressBarElement.style.backgroundColor = '#68a9ef';
            progressBarElement.style.width = progress.percent + "%";
            var description = progress.description || "";
            progressBarMessageElement.innerHTML = description
        }
}

function SwalWarning(msg_swal){
    return swal({
                title: "Atenção!",
                text: msg_swal,
                icon: "warning",
                button: "Fechar",
    })
}

// --------------------- Alert para notificar usuario ---------------------//
function swalAlert(titulo, texto, icone_img, btn){
    swal({
        title: titulo,
        text: texto,
        icon: icone_img,
        button: btn,
    })
    $('div.swal-modal').addClass('bordas')
    $('div.swal-title').addClass('h4')
    $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
    $('div.swal-text').addClass('text-center')
    $('div.swal-footer').addClass('d-flex justify-content-center')
}

const paginaA1pro = window.location.href.substring(window.location.href.indexOf('a1pro/')).split('/')[1];
if (paginaA1pro === 'TelaEquips'){
   const selectCargaEquipamentos = document.getElementById("CargasSearchSelect");
    selectCargaEquipamentos.addEventListener("keydown", (event) => {
        let id_equip = selectCargaEquipamentos.options[selectCargaEquipamentos.selectedIndex].value
        if (event.key === "ArrowUp" && id_equip !== '') {
            id_equip = selectCargaEquipamentos.options[selectCargaEquipamentos.selectedIndex-1].value
            FillInfoEquip(id_equip);
        } else if (event.key === "ArrowDown" && id_equip !== '') {
            id_equip = selectCargaEquipamentos.options[selectCargaEquipamentos.selectedIndex+1].value
            FillInfoEquip(id_equip);
        }
    });
} else if (paginaA1pro === 'TelaCarga'){
    const selectOrigemLigacoes = document.getElementById("CargasSearchSelect");
    selectOrigemLigacoes.addEventListener("keydown", (event) => {
        let id_lig = selectOrigemLigacoes.options[selectOrigemLigacoes.selectedIndex].value
        let Equip = ''
        let TipoEquip = document.getElementById('btn_ligacao_select').getElementsByClassName('btn-dark')[0].outerText
        if (TipoEquip === 'Motores') {
                Equip = 'MO';
            } else if (TipoEquip === 'Transformadores') {
                Equip = 'TR';
            } else if (TipoEquip === 'Paineis') {
                Equip = 'PN';
            } else if (TipoEquip === 'Barramento') {
                Equip = 'BR';
            } else{
                Equip = 'CA';
            }
        if (event.key === "ArrowUp" && id_lig !== '') {
            id_lig = selectOrigemLigacoes.options[selectOrigemLigacoes.selectedIndex-1].value
            FillEquipsOrigAndFillDest(id_lig, Equip);
        } else if (event.key === "ArrowDown" && id_lig !== '') {
            id_lig = selectOrigemLigacoes.options[selectOrigemLigacoes.selectedIndex+1].value
            FillEquipsOrigAndFillDest(id_lig, Equip);

        }
    });

    const selectDestinoLigacoes = document.getElementById("DestinoSearchSelect");
    selectDestinoLigacoes.addEventListener("keydown", (event) => {
        let id_carga = selectDestinoLigacoes.options[selectDestinoLigacoes.selectedIndex].value

        if (event.key === "ArrowUp" && id_carga !== '') {
            id_carga = selectDestinoLigacoes.options[selectDestinoLigacoes.selectedIndex-1].value
            FillInfoLigacao(id_carga);
        } else if (event.key === "ArrowDown" && id_carga !== '') {
            id_carga = selectDestinoLigacoes.options[selectDestinoLigacoes.selectedIndex+1].value
            FillInfoLigacao(id_carga);

        }
    });
}

function DownloadTemplateConvert(){
    window.open('/app/eletrica/a1pro/DownloadTemplateConvert/', '_self')
}

function VerifyCorrentePartidaEquip(this_element){
    let id_element = this_element.id
    let value = this_element.value.replace(',', '.')

    let title = ''
    if(value!==null){
        var tipo_partida = document.getElementById('CargaPartidaTipo').value
        if(isNaN(Number(value))){
            ClassIsInvalidEquip(id_element)
        }
        else{
            RemoveClassIsInvalidEquip(id_element)
            if(tipo_partida === 'DIRETA'){
                if(Number(value) >= 6){
                    this_element.classList.remove('bg-warning')
                }
                else{
                    this_element.classList.add('bg-warning')
                    title = 'O valor IP/IN bem aceito para esse tipo de partida é maior ou igual a 6'
                }
            }
            else{
                if(Number(value) <= 3){
                    this_element.classList.remove('bg-warning')
                }
                else{
                    this_element.classList.add('bg-warning')
                    title = 'O valor IP/IN bem aceito para esse tipo de partida é menor ou igual a 3'
                }
            }
        }
        this_element.title=title
    }
}

function ClassIsInvalidEquip(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(!class_list.includes('is-invalid')){
        i.classList.add('is-invalid')
    }
}

function RemoveClassIsInvalidEquip(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(class_list.includes('is-invalid')){
        i.classList.remove('is-invalid')
    }
}

function BtnExportTxtIdEquip(){

    debugger;
     const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

    $.ajax({
        url: "/app/eletrica/a1pro/ExportTxtIdEquip/", // Caminho do Ajax
        type: "GET", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: '', // Envia form pela solicitação do POST
        success: function (data) {
            InitProgressConvertTemplate(data['task_id'])
        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}