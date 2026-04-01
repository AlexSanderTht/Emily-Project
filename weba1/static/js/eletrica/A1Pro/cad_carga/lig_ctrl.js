async function FillSearchFiled(TipoEquip, TipoGeral) {
    /**
     * Função que preenche as tags dos equipamentos selecionados no campo de origem
     * @param {String} TipoEquip - Tipo de equipamento
     * @param {String} TipoGeral - Tipo geral -> mais referente a tela
     */
    // ClearFields(false)

    if(!element_load_wheel){
        load_element_load_wheel()
    }
    document.getElementById(`DestinoSearchSelect`).innerHTML = ''
    document.querySelectorAll("div.position-relative > *")[0].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[0].classList.add('animate__zoomIn')
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    try {
        var Equip = ''
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
        let InfoEquip = await RetornaEquipOs(Equip);
        let EquipValues = ''
        InfoEquip = InfoEquip['Equips']
        setTimeout(()=>{
            document.querySelectorAll("div.position-relative > *")[0].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[0].classList.remove('animate__zoomIn')
            document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')
        }, 500)
        // A variável abaixo seta apenas as tags únicas através do método map.
        for (var i = 0; i < InfoEquip.length; i++) {
            EquipValues += `<option class="bg-${InfoEquip[i]['color']}-option-eqp" onclick="FillEquipsOrigAndFillDest(${InfoEquip[i]['id']}, '${Equip}')" value=${InfoEquip[i]['id']}> ${InfoEquip[i]['tag']}</option>`
        }
        document.getElementById(`${TipoGeral}SearchSelect`).innerHTML = EquipValues
    } catch (erro) {
        return swalAlert(false, `Houve um problema: ${erro.message} verifique FillSearchFiled()`, 'error', false)
    }

    element_load_wheel.hide();
}

async function FillInfoLigacao(IdLigacao) {
    /**
     * Função para preencher todas as informações do Equipamento e também do Destino
     * @param {Int} IdLicacao - Id da tabela TbLicacao
     */
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    try {
        let DatasReturned = await RetornaLigacaoInfo(IdLigacao);
        let InfoLig = DatasReturned['LigInfos']
        await AutoFillOrig(InfoLig)
        await WorkingFuncCubsGavs(InfoLig)
        document.getElementById('ligs_gerar_cabos').checked = InfoLig['gerar_cabos']

        document.getElementById('IdLig').value = IdLigacao

    } catch (e) {
        return swalAlert(false, `Houve um problema: ${e.message} verifique FillInfoLigacao()`, 'error', false)
    }
    setTimeout(()=>{
        document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
        document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')
    }, 500)
}

async function WorkingFuncCubsGavs(InfoLig){
    CheckTypeLig(InfoLig['Dest']['TypeLig'], 'TypesAliInLig')
    $('#FuncaoCarga').val(InfoLig['Dest']['Func'])
    await change_function()
    if(InfoLig['Dest']['TypesFunc']['SINAL']){
        $('#SinalAcessCarga').val(InfoLig['Dest']['TypesFunc']['SINAL'])
    }
    else if(InfoLig['Dest']['TypesFunc']['ACESSORIO']){
        try {
            $('#SinalAcessCarga').val(InfoLig['Dest']['TypesFunc']['ACESSORIO'])
        }
        catch (e) {
            return swalAlert(false, 'Equipamento com uma ligação de acessório mas sem um acessório cadastrado!', 'error', false)
        }
    }
    document.getElementById('CargaCubiculoOrigem').value = InfoLig['Orig']['Cub']
    document.getElementById('CargaGavetaOrigem').value = InfoLig['Orig']['Gav']

    document.getElementById('CargaGavetaDest').value = InfoLig['Dest']['Gav']
    document.getElementById('CargaCubiculoDest').value = InfoLig['Dest']['Cub']
}

function OpenModalExcludeLig(){
    if(document.getElementById('IdLig').value!=''){
        const header = 'Exclusão de Ligação!'
        const content = 'Você tem certeza que deseja excluir essa Ligação?'
        const FuncButtonSim = DeleteLigacao
        swal({
              title: header,
              icon: 'warning',
              dangerMode: true,
              buttons: {
                  confirm: {
                      text: "Sim",
                      value: "Sim",
                  },
                  cancel: "Não",
              },
              content: {
                  element: "span",
                  attributes: {
                      innerHTML: content
                  },
              },
                }).then((value) => {
                if (value === "Sim") {
                    FuncButtonSim()
                swal(
                  'Excluído!',
                  'Esta ligação foi excluída com sucesso!',
                  'success'
                )
              }
                else {
                    swal.Close()
                }
            })
    }
    else{
        return swalAlert(false, 'Selecione uma ligação existente para poder excluir!', 'error', false)
    }
}

async function ChangeArea(IdElementArea, IdElementSubArea){
    var Area = $('#'+IdElementArea).val()
    if(Area != "none"){
        document.getElementById(IdElementSubArea).disabled=false
        let SubAreas = await GetSubAreasPerOs(Area)
        create_options_sub_area_in_eqps(SubAreas['sub_areas'], IdElementSubArea)
    }
    else {
        $('#'+IdElementSubArea).html(`<option value="none">---</option>`)
        document.getElementById(IdElementSubArea).disabled=true
    }
}

function DeleteLigacao(){
    $.ajax({
        url: `/app/eletrica/a1pro/DeleteLigacao/` + document.getElementById('IdLig').value + '/',
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    }).done(function (data) {
        // manipuling_modal_a1pro('Sucesso!', data['data'])
    })
}
async function FillCubsGavs(type, value, GavOrCub) {
    let Tag = null;
    let IdList
    let CubValues = ''

    if (type === 'Orig') {
        Tag = $('#CargaTagOrigem').val()
        CubValues = document.getElementById('CargaCubiculoOrigem').value

        if (GavOrCub === 'Cub') {
            IdList = 'CubOrigem'
        } else {
            IdList = 'GavOrigem'
        }
    }
    else {
        if (GavOrCub === 'Cub') {
            IdList = 'CubDest'
        } else {
            IdList = 'GavDest'
        }
        Tag = $('#CargaTag').val()
        CubValues = document.getElementById('CargaCubiculoDest').value
    }
    if (Tag!="none"){
        if (GavOrCub === 'Cub') {
            try {
                let ListCubs = await SearchCub(Tag, value)
                ListCubs = ListCubs['data']
                let ListActualCubs = ``
                for (let i = 0; i < ListCubs.length; i++) {
                    ListActualCubs += `<option>${ListCubs[i]}</option>`
                }
                document.getElementById(IdList).innerHTML = ListActualCubs
            } catch (e) {
                swalAlert(false, 'Houve um problema na pesquisa dos cubiculos!', 'error', false)
                return null
            }

        } else {
            try {
                let ListGavs = await SearchGav(Tag, CubValues, value)
                ListGavs = ListGavs['data']
                let ListActualGavs = ``
                for (let i = 0; i < ListGavs.length; i++) {
                    ListActualGavs += `<option>${ListGavs[i]}</option>`
                }
                document.getElementById(IdList).innerHTML = ListActualGavs
            } catch (e) {
                swalAlert(false, 'Houve um problema na pesquisa das gavetas!', 'error', false)
                return null
            }
        }
    }
}

async function SearchCub(Tag, value) {

    if (!value) {
        value = ' '
    }
    return $.ajax({
        url: `/app/eletrica/a1pro/SearchCub/${Tag}/${value}/`,
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    });
}

async function SearchGav(Tag, CubValue, value) {
    if (!value) {
        value = ' '
    }
    if (!CubValue) {
        CubValue = ' '
    }
    return $.ajax({
        url: `/app/eletrica/a1pro/SearchGav/${Tag}/${CubValue}/${value}/`,
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    });
}

async function ClearFieldsEqpOrigem(All){
    /**
     * Função para limpar as informações do Alimentador
     */
    if (All == true){
        document.getElementById('CargaCBPainelOrigem').checked = false;
        document.getElementById('CargaCBTrafoOrigem').checked = false;
        document.getElementById('CargaCBBarramentoOrigem').checked = false;
        $('#CargaTagOrigem').html(`<option value="none">Selecione um Tipo de equipamento!!</option>`)
    }
    document.getElementById('IdLig').value = ''
    document.getElementById('TensaoOrigem').value = ''
    document.getElementById('CargaCubiculoOrigem').value = ''
    document.getElementById('CargaGavetaOrigem').value = ''
    $('#CargaAreaOrigem').val("none")
    await ChangeArea('CargaAreaOrigem', 'CargaSubAreaOrigem')
}

async function CleanFieldsEqpDest(All) {
    /**
     *Função para limpar as informações da Origem
     */
    if(All == true){
        document.getElementById('CargaCBMotor').checked = false;
        document.getElementById('CargaCBPainel').checked = false;
        document.getElementById('CargaCBCargaAuxiliar').checked = false;
        document.getElementById('CargaCBTrafo').checked = false;
        document.getElementById('CargaCBBarramento').checked = false;
        $('#CargaTag').html(`<option value="none">Selecione um Tipo de equipamento!!</option>`)
    }
    $('#FuncaoCarga').val("none")
    document.getElementById('FuncaoCarga').disabled = true
    $('#CargaStatus').val("none")
    document.getElementById('IdLig').value = ''
    document.getElementById('CargaCubiculoDest').value = ''
    document.getElementById('CargaGavetaDest').value = ''
    document.getElementById('TensaoCarga').value = ''
    $('#SinalAcessCarga').html(``)
    document.getElementById('SinalAcessCarga').disabled=true
    $('#CargaArea').val("none")
    await ChangeArea('CargaArea', 'CargaSubArea')
    document.getElementById('TipoFuncaoCarga').value = ''
}

async function ClearFields(all) {
    /**
     * Função que limpa todos os campos e pelo parametro consegue-se limpar também os campos de busca
     * @param {boolean} all - Se true limpa tudo, Se false Limpa apenas as informações da ligação
     */
    if (all === true) {
        document.getElementById(`CargasSearchSelect`).innerHTML = ''
        document.getElementById(`DestinoSearchSelect`).innerHTML = ''
    }
    await CleanFieldsEqpDest(true)
    await ClearFieldsEqpOrigem(true)
    ShowOrHideButtonsTipoAliInLig(false)
}

async function CreateSelectDestino(TipoEquip){
    var AllEquips = await RetornaEquipOs(TipoEquip)
    await CleanFieldsEqpDest(false)
    FillSelectEqpDest(AllEquips['Equips'], TipoEquip)
}

function FillSelectEqpDest(Equips, TipoEquip){
    var options_eqps_dest = `<option value="none" selected>Selecione o Equipamento</option>`
    for(let i = 0; i < Equips.length; i++){
        options_eqps_dest += `<option value="${Equips[i]['id']}" onclick="ChangeEqpDest(${Equips[i]['id']}, '${TipoEquip}')">${Equips[i]['tag']}</option>`
    }
    $('#CargaTag').html(options_eqps_dest)
}

async function ChangeEqpDest(IdEquip, TypeEquip){
    var DatasEqp = await GetDatasEqpDest(IdEquip)
    if(TypeEquip === 'PN' || TypeEquip === 'CA' || TypeEquip === 'TR'){
        CreateButtonsTipoAliInLig(DatasEqp['DatasEqp']['auxiliares'])
        ShowOrHideButtonsTipoAliInLig(true)
        CheckTypeLig('PRIN', 'TypesAliInLig')
    }
    else{
        ShowOrHideButtonsTipoAliInLig(false)
    }
    await CleanFieldsEqpDest(false)
    await FillFieldsEqpDest(DatasEqp['DatasEqp'])
}

function ShowOrHideButtonsTipoAliInLig(show){
    if(show === true){
        $('#btns-aux-lig').show()
    }
    else{
        $('#btns-aux-lig').hide()
    }
}
function CreateButtonsTipoAliInLig(DatasForButoon){
    var btns_html = `<button class="btn btn-secondary btn-sm" value="PRIN" name="TypesAliInLig" type="button" onclick="CheckTypeLig('PRIN', 'TypesAliInLig')">
                      PRIN
                    </button>`
    for(let TypeAlim in DatasForButoon){
        let content_btn = TypeAlim
        if (DatasForButoon[TypeAlim]!=null){
            content_btn = TypeAlim + '/' + DatasForButoon[TypeAlim]
        }
        btns_html += `<button type="button" value="${TypeAlim}" class="btn btn-warning btn-sm" name="TypesAliInLig" onclick="CheckTypeLig('${TypeAlim}', 'TypesAliInLig')">${content_btn}</button>`
    }
    $('#btns-aux-lig').html(btns_html)
}

async function GetDatasEqpDest(IdEquip){
    return $.ajax({
        url: `/app/eletrica/a1pro/DatasEqpDest/` + IdEquip + '/',
        method: "GET",
        data: {},
        contentType: "application/json; charset=utf-8"
    });
}

async function FillFieldsEqpDest(DatasEqp){
    document.getElementById('TensaoCarga').value = DatasEqp['tensao']
    $('#CargaStatus').val(DatasEqp['status'])
    $('#CargaArea').val(DatasEqp['area'])
    await ChangeArea('CargaArea', 'CargaSubArea')
    $('#CargaSubArea').val(DatasEqp['subarea'])
    document.getElementById('FuncaoCarga').disabled=false
}

async function OnloadPageLig(){
    await CleanFieldsEqpDest(true)
    await ClearFieldsEqpOrigem(true)
}

function CheckButtonsTypePn(id, DestOrig){
    var list_ids_buttons = ['TypePrin'+DestOrig+'Check', 'TypeAux'+DestOrig+'Check', 'TypeCom'+DestOrig+'Check']
    var class_name = 'input-group-text'
    for(let i = 0; i < list_ids_buttons.length; i++){
        if (list_ids_buttons[i] == id){
            document.getElementById(list_ids_buttons[i]).className = class_name + ' bg-secondary'
        }
        else{
            document.getElementById(list_ids_buttons[i]).className = class_name + ' bg-warning'
        }
    }
}

async function CreateSelectOrigem(TypeEquip){
    var AllEquips = await RetornaEquipDestOS(TypeEquip)
    await ClearFieldsEqpOrigem(false)
    FillSelectEqpOrigem(AllEquips['Equips'])
}

async function RetornaEquipDestOS(Tipo){
    const osnum = document.getElementById('OS').title;
    let request = await $.ajax({
        url: "/app/eletrica/a1pro/RetornaEquipDestOS/",
        method: "GET",
        data: {'OSA1PRO': osnum, 'TIPOEQUIP': Tipo}
    })
    return request
}
function FillSelectEqpOrigem(Equips){
    var options_eqp_orig = `<option value="none" selected>Selecione o Equipamento</option>`
    for(let i = 0; i < Equips.length; i++){
        options_eqp_orig += `<option value="${Equips[i]['id']}" onclick="ChangeEqpOrigem(${Equips[i]['id']})">${Equips[i]['tag']}</option>`
    }
    $('#CargaTagOrigem').html(options_eqp_orig)
}

async function ChangeEqpOrigem(IdEquip){
    var DatasEqp = await GetDatasEqpDest(IdEquip)
    await ClearFieldsEqpOrigem(false)
    await FillFieldsEqpOrigem(DatasEqp['DatasEqp'])
}
async function SendDatasLig(){
    var DatasLig = GetDatasLig()
    if(typeof DatasLig == "string"){
        return swalAlert(false, DatasLig, 'warning', false)
    }
    else{
        await $.ajax({
          type: "POST",
          url: `/app/eletrica/a1pro/LigEqps/`,
          data: {'data': JSON.stringify(DatasLig)},
          success: function(data){
              if (data['success'] === true){
                return swalAlert(false, 'Cadastrado com sucesso!', 'success', false)
            }
              else{
                  return swalAlert(false, 'Já existe uma ligação com esses equipamentos e essa função!', 'error', false)
              }
          },
          error: function(error){
              return swalAlert(false, 'Houve um erro inesperado!', 'error', false)
          }
        });
    }
}


async function UpdateDatasLig(){
    var DatasLig = GetDatasLig()
    if(typeof DatasLig == "string"){
        return swalAlert(false, DatasLig, 'warning', false)
    }
    else{
        await $.ajax({
          type: "PUT",
          url: `/app/eletrica/a1pro/LigEqps/`,
          data: {'data': JSON.stringify(DatasLig)},
          success: function(data){
              if (data['success'] === true){
                return swalAlert(false, 'Atualizado com sucesso!', 'success', false)
            }
              else{
                  return swalAlert(false, 'Já existe uma ligação com esses equipamentos e essa função!', 'error', false)
              }
          },
          error: function(error){
              return swalAlert(false, 'Houve um erro inesperado!', 'error', false)
          }
        });
    }
}

function GetDatasLig(){
    var Errors = []
    var TypeFunc = document.getElementById('TipoFuncaoCarga').value
    // Dados do equipamento de destino
    var EqpDest = $('#CargaTag').val()
    var EqpDestStatus = $('#CargaStatus').val()
    var EqpDestArea = $('#CargaArea').val()
    var EqpDestSubArea = $('#CargaSubArea').val()
    var EqpDestLig = PickTypeLig()
    var EqpDestCub = document.getElementById('CargaCubiculoDest').value
    var EqpDestGav = document.getElementById('CargaGavetaDest').value

    // Função da ligação
    var Func = $('#FuncaoCarga').val()
    var SinalAcess = $('#SinalAcessCarga').val()

    // Dados do equipamento de origem
    var EqpOrig = $('#CargaTagOrigem').val()
    var EqpOrigArea = $('#CargaAreaOrigem').val()
    var EqpOrigSubArea = $('#CargaSubAreaOrigem').val()
    var EqpOrigCub = document.getElementById('CargaCubiculoOrigem').value
    var EqpOrigGav = document.getElementById('CargaGavetaOrigem').value
    let gera_cabos_lig = document.getElementById("ligs_gerar_cabos").checked
    //Verificação
    if(EqpDest == "none"){
        Errors.push('Selecione um Equipamento de Destino')
    }
    if(EqpOrig == "none"){
        Errors.push('Selecione um Equipamento de Origem')
    }
    if(Func == "none"){
        Errors.push('Selecione uma Função para fazer a ligação')
    }
    if(TypeFunc != "ALIMENTACAO"){
        if(SinalAcess == "none"){
            Errors.push('Selecione um Sinal/Acessórios!!')
        }
    }

    //Verificando a verificação bem verificadinho mesmo
    if(Errors.length>0){
        return Errors.join(', ')
    }
    else {
        let Destino = {
            'Eqp': EqpDest,
            'Status': EqpDestStatus,
            'Area': EqpDestArea,
            'SubArea': EqpDestSubArea,
            'Lig': EqpDestLig,
            'Cub': EqpDestCub,
            'Gav': EqpDestGav
        }

        let Origem = {
            'Eqp': EqpOrig,
            'Area': EqpOrigArea,
            'SubArea': EqpOrigSubArea,
            'Cub': EqpOrigCub,
            'Gav': EqpOrigGav
        }
        return {'Destino': Destino, 'Origem': Origem, 'Func': Func, 'SinalAcess': SinalAcess, 'IdLig': document.getElementById('IdLig').value, 'gera_cabo_lig': gera_cabos_lig }
    }
}

function PickTypeLig(){
    var AllButtonsLig = document.querySelectorAll('[name="TypesAliInLig"]')
    var LigSelected = 'PRIN'
    for(let i = 0; i < AllButtonsLig.length; i++){
        let ClassElement =AllButtonsLig[i].className
        if (ClassElement.includes('secondary')){
            LigSelected = AllButtonsLig[i].value
            break
        }
    }
    return LigSelected
}

async function FillFieldsEqpOrigem(Equip){
    $('#CargaAreaOrigem').val(Equip['area'])
    await ChangeArea('CargaAreaOrigem', 'CargaSubAreaOrigem')
    $('#CargaSubAreaOrigem').val(Equip['subarea'])
    document.getElementById('TensaoOrigem').value = Equip['tensao']
}

$(document).ready(function() {
    OnloadPageLig()
});

async function change_function() {
    let TipoFunc = document.getElementById('FuncaoCarga').selectedOptions[0].title;
    document.getElementById('TipoFuncaoCarga').value = TipoFunc
    if(TipoFunc == "SINAL" || TipoFunc == "ACESSORIO"){
        document.getElementById('SinalAcessCarga').disabled = false
    }
    else{
        document.getElementById('SinalAcessCarga').disabled = true
    }
    let SinaisAcess = await GetSinaisAcessPerFunc($('#CargaTag').val(), TipoFunc)
    CreateSelectSinaisAcess(SinaisAcess['finish'])
}

function CreateSelectSinaisAcess(Datas){
    var TypeFunc = ''
    for(type in Datas){
        if(Datas[type] != ""){
            TypeFunc = type
        }
    }
    if(TypeFunc!=''){
        if(Object.keys(Datas[TypeFunc]).length === 0){
            if(TypeFunc == "SINAL"){
                $('#SinalAcessCarga').html(`<option value="none">Crie um Sinal nessa OS!!</option>`)
            }
            else if(TypeFunc == "ACESSORIO"){
                $('#SinalAcessCarga').html(`<option value="none">Crie um Acessorio nesse Equipamento!!</option>`)
            }
        }
        else{
            var options_select = `<option value="none" selected>---${TypeFunc}---</option>`
            for(id in Datas[TypeFunc]){
                options_select += `<option value="${id}">${Datas[TypeFunc][id]}</option>`
            }
            $('#SinalAcessCarga').html(options_select)
        }
    }
    else{
        document.getElementById('SinalAcessCarga').disabled = true
        $('#SinalAcessCarga').html(``)
    }
}

async function GetSinaisAcessPerFunc(IdEquip, SinalAcess){
    return $.ajax({
        url: `/app/eletrica/a1pro/LigEqpsFunc/` + IdEquip + '/',
        method: "GET",
        data: {'Type': SinalAcess},
        contentType: "application/json; charset=utf-8"
    });
}

function countItemsLigDest() {
    setTimeout(()=>{
        document.getElementById("itemCountLigDest").innerText = $('#DestinoSearchSelect option').length
    }, 100)
}

function countItemsLig() {
    setTimeout(()=>{
            document.getElementById("itemCountLig").innerText = $('#CargasSearchSelect option').length
        }, 1200)
}

async function FillEquipsOrigAndFillDest(TagOrig, TypeEqp) {
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    await ClearFields(false)
    var AllDatas = await RetornaEquipDestTag(TagOrig)
    FillSelectOrigem(AllDatas['EquipsMorrings'])
    await AutoFillDest(TypeEqp, TagOrig)
    setTimeout(()=>{
        document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
        document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')
    }, 500)
    countItemsLigDest()
}
async function AutoFillOrig(InfoLig){
    await CreateSelectOrigem(InfoLig['Orig']['TypeEqp'])
    var AllRadios = document.querySelectorAll('[name="CargaCBOrigem"]')
    for(let i = 0; i < AllRadios.length; i++){
        if(InfoLig['Orig']['TypeEqp'] == AllRadios[i].value){
            AllRadios[i].checked = true
        }
        else{
            AllRadios[i].checked = false
        }
    }
    $('#CargaTagOrigem').val(InfoLig['Orig']['Eqp'])
    await ChangeEqpOrigem(InfoLig['Orig']['Eqp'])

}
async function AutoFillDest(TypeEquip, IdEquip){
    var AllRadios = document.querySelectorAll('[name="CargaCBDest"]')
    for(let i = 0; i < AllRadios.length; i++){
        if(TypeEquip == AllRadios[i].value){
            AllRadios[i].checked = true
        }
        else{
            AllRadios[i].checked = false
        }
    }
    await CreateSelectDestino(TypeEquip)
    $('#CargaTag').val(IdEquip)
    await ChangeEqpDest(IdEquip, TypeEquip)
}

function FillSelectOrigem(EquipsOrigem){
    /**
     * Função que preenche as tags dos equipamentos selecionados no campo de Destino
     * @param {String} TagOrig - Tag selecionada na origem
     * @param {String} TipoEquip - Tipo do equipamento
     */
    try {
        var EquipOrigValues = ''
        for (var i = 0; i < EquipsOrigem.length; i++) {
            let AcessSin = ''
            if(EquipsOrigem[i]['sinal_acess']!=""){
                AcessSin = ' ('+EquipsOrigem[i]['sinal_acess']+')'
            }
            EquipOrigValues += `<option onclick="FillInfoLigacao(${EquipsOrigem[i]['id_lig']})" value=${EquipsOrigem[i]['id']}> ${EquipsOrigem[i]['tag']} / ${EquipsOrigem[i]['func']} - ${EquipsOrigem[i]['tipo_func']}${AcessSin}</option>`
        }
        document.getElementById(`DestinoSearchSelect`).innerHTML = EquipOrigValues
    } catch (e) {
        return swalAlert(false, `Houve um problema: ${e.message} verifique FillSelectOrigem()`, 'error', false)
    }
}

async function RetornaEquipDestTag(Tag) {
    /**
     * Fução assincrona que faz a busca dos equipamentos que estão linkados com a Origem selecionada.
     * @param {string} Tag - Tag do equipamento de origem
     * @param {string} TipoEquip - Tipo do equipamento
     * @return {*} - Retorna uma procedure
     */

    let request = await $.ajax({
        url: "/app/eletrica/a1pro/RetornaEquipOrigTag/" + Tag + "/",
        method: "GET",
        data: {}
    })
    return request
}

async function RetornaLigacaoInfo(IdLigacao) {
    /**
     * Função que faz a busca das informações do equipamento selecionado na parte de destino
     * @param {int} IdLigacao - Id da tabela TbLigacao
     * @return {*} - Retorna uma procedure
     */
    let request = await $.ajax({
        url: `/app/eletrica/a1pro/RetornaLigacaoInfo/${IdLigacao}/`,
        method: "GET",
        data: {}
    })
    return request
}


function countItemsListaDest() {
    setTimeout(()=>{
        document.getElementById("itemCountListaDest").innerText = $('#ListCabosCabosSearchSelect option').length
    }, 100)
}

function countItemsLista() {
    setTimeout(()=>{
            document.getElementById("itemCountLista").innerText = $('#ListCabosCargasSearchSelect option').length
        }, 2000)
}
