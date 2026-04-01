const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
CreateTablesCt()
function CreateTablesCt(){
     $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "ControleTipicosTables/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillTablesCt(data['tables'], data['mat_disc'])
        },
        failure: function (error) {
        },
    });
}

function FillTablesCt(datas_tables, material_desc){
    var table = ``
    var header = ``
    var body = ``
    for(let col in datas_tables) {
        header += `<th scope="col" class="text-nowrap">${col}</th>`
    }
    let json_mat_desc
    for(let i = 0; i < datas_tables['Materiais'].length; i++) {
        json_mat_desc = datas_tables['Materiais']
        let tr = ``
        let title_str
        for(let col in datas_tables){

            title_str = material_desc[datas_tables[col][i]]

            if(title_str === undefined){
                title_str = ''
            }
            title_str = title_str.toString().replace('"','').replace("<",'').replace(">",'')
            tr += `<td title="${title_str}" class="text-nowrap">${datas_tables[col][i]}</td>`
        }
        body += `<tr>${tr}</tr>`
    }
    table = `
        <style>
         table thead th{
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            letter-spacing: 1px;
            font-size: .65rem;
            color: #FFFFFF;
            text-transform: uppercase;
            vertical-align: bottom;
            background-color: #bbbbbb;
            border:transparent;
         }

        
        table td{
            font-size: .8125rem;
            white-space: nowrap;
            height: 40px;
            border:transparent;
        }
        </style>
        
        <div class="table-responsive" >
            <table  class=" table align-items-center table-flush  ">
              <thead  class="thead-flush border-0">
                <tr>  
                  ${header}
                </tr>
              </thead>
              <tbody>
                 ${body}
              </tbody>
            </table>
        </div>`
    document.getElementById('tables_controle_tipicos').innerHTML = table

}

function SwitchAlertCT(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}
//FUNÇÕES DO MODAL DE AREAS
async function FillAllAreas(){
    let areas = await RequestAllAreas()
    let str_html_areas = ``
    for(let id_area in areas){
        str_html_areas += `<option value="${id_area}" onclick="ClickAreasSelected(${id_area})">${areas[id_area]}</option>`
    }
    $('#all_areas_gt').html(str_html_areas)
}

async function ShowModalAreas(){
    await FillAllAreas()
    $('#modal_areas_ct').modal('show')
}

async function RequestAllAreas(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllAreasControleTipicos/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['areas']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function ClickAreasSelected(id_areas){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "DatasAreasSelected/" + id_areas + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('nome_areas_gt').value = data['area']['nome']
            document.getElementById('desc_areas_gt').value = data['area']['desc']
        },
        failure: function (error) {
        },
    });
}

function GetItemSelectedSelectMultiple(id_select_multiple){
    return $('#'+id_select_multiple).val()[0] !== undefined?$('#'+id_select_multiple).val()[0]:null
}

async function SendDatasAreas(){
    let nome = document.getElementById('nome_areas_gt').value
    let desc = document.getElementById('desc_areas_gt').value
    let id_areas_selected = GetItemSelectedSelectMultiple('all_areas_gt')
    if(nome.length > 0 && desc.length > 0){
        if(!VerifyAreasIfExists(nome, id_areas_selected)){
            await $.ajax({
                type: "POST",
                headers: {'X-CSRFToken': csrftoken},
                url: "DatasAreasSelected/",
                dataType: 'json',
                data: {'datas_front': JSON.stringify({
                        'nome': nome,
                        'id': id_areas_selected,
                        'desc': desc
                    })},
                success: function (data) {
                    SwitchAlertCT(data['return'])
                    FillAllAreas()
                },
                failure: function (error) {
                },
            });
        }
        else{
            SwitchAlertCT('Área ja existente!!', true)
        }
    }
    else{
        SwitchAlertCT('Preencha Todos os campos!', true)
    }
}

function VerifyAreasIfExists(nome, id){
    let all_areas = RequestAllAreas()
    var exists = false
    for(let id_areas in all_areas){
        if(id !== null){
            if(id !== id_areas){
                if(nome === all_areas[id_areas]){
                    exists = true
                    break
                }
            }
        }
        else{
            if(nome === all_areas[id_areas]){
                exists = true
                break
            }
        }
    }
    return exists
}

async function DeleteAreas(){
    let areas_selected = GetItemSelectedSelectMultiple('all_areas_gt')
    if(areas_selected !== null){
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "DatasAreasSelected/" + areas_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertCT(data['return'])
                FillAllAreas()
            },
            failure: function (error) {
            },
        });
    }
    else{
        SwitchAlertCT('Selecione uma Área para excluir!!', true)
    }
}

function ClearFieldsAreas(){
    document.getElementById('nome_areas_gt').value = ''
    document.getElementById('desc_areas_gt').value = ''
    $('#all_areas_gt').val(0)
}


function FilterSelectsCt(value, id_select){
    let options_select = document.getElementById(id_select).options
    let value_upper = value.toUpperCase()
    for(let i = 0; i < options_select.length; i++){
        let value_option_upper = options_select[i].innerHTML.toUpperCase()
        let hidden = value_option_upper.includes(value_upper)?false:true
        options_select[i].hidden = hidden
    }
}

//FIM FUNÇÕES DO MODAL DE AREAS



//FUNÇÕES MODAL TIPO DE SUS/FIX
async function RequestAllGrupos(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasGrupos/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['return']['grupos']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function ShowModalGrupos(){
    let all_datas = await RequestAllGrupos()
    FillSelectAllGrupos(all_datas)
    ClearGrupos()
    $('#modal_grupos_gt').modal('show')
}

function FillSelectAllGrupos(all_grupos){
    var str_grupos_html = ``
    let title_str = ''
    for(let i = 0; i < all_grupos.length; i++){
        title_str = all_grupos[i]['nome'].toString().replace('"', '').replace('<', '').replace('>', '')
        str_grupos_html += `<option value="${all_grupos[i]['id']}" onclick="ClickGrupo(${all_grupos[i]['id']})" title="${title_str}">${all_grupos[i]['nome']}</option>`
    }
    document.getElementById('all_grupos_gt').innerHTML = str_grupos_html
}

function ChangeElementFilterAllDatas(id_select_all_datas, title_filter, id_element_search){
    let options_select = document.getElementById(id_select_all_datas).options
    let element_search = document.getElementById(id_element_search)
    for(let i = 0; i < options_select.length; i++){
        if(options_select[i].title === title_filter || title_filter === '0'){
            options_select[i].hidden = false
        }
        else{
            options_select[i].hidden = true
        }
    }
    element_search.disabled = title_filter === '0'?false:true
}

async function GetValuesGrupos(){
    let nome = document.getElementById('nome_grupo_gt').value
    let tipo_gp = document.getElementById('tipo_grupo_gt').value
    let tipo_selected = GetItemSelectedSelectMultiple('all_grupos_gt')
    var fields_error = []
    if(nome.length > 0 && nome.length <= 150){
        if(VerifyOptionExistsSelect('all_grupos_gt', nome, tipo_selected)){
            fields_error.push('Nome')
        }
    }
    else{
        fields_error.push('Nome')
    }
    if(fields_error.length === 0){
        return {
            'nome': nome,
            'selected': tipo_selected,
            'tipo_gp': tipo_gp
        }
    }
    else{
        return fields_error.join(' e ')
    }
}

function VerifyOptionExistsSelect(id_select, inner_html, value){
    let options_select = document.getElementById(id_select).options
    var exists = false
    for(let i = 0; i < options_select.length; i++){
        if(value === null){
            if(options_select[i].innerHTML === inner_html){
                exists = true
                break
            }
        }
        else{
            if(options_select[i].value !== value){
                if(options_select[i].innerHTML === inner_html){
                    exists = true
                    break
                }
            }
        }
    }
    return exists
}

async function SendValuesGrupos(){
    let values = await GetValuesGrupos()
    console.log(values)
    if(typeof values === "string"){
        return SwitchAlertCT('Campos inválidos: ' + values, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasGrupos/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                values
            })},
        success: function (data) {
            SwitchAlertCT(data['return'])
            FillAllGrupos()
        },
        failure: function (error) {
        },
    });
}

async function FillAllGrupos(){
    let grupos = await RequestAllGrupos()
    FillSelectAllGrupos(grupos)
}

function ClickGrupo(id_grupo){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "DatasGrupos/" + id_grupo + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('nome_grupo_gt').value = data['nome_gp']
            document.getElementById('tipo_grupo_gt').value = data['tipo_gp']
        },
        failure: function (error) {
        },
    });
}

async function DeleteGrupo(){
    let grupo = GetItemSelectedSelectMultiple('all_grupos_gt')
    if(grupo !== null){
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "DatasGrupos/" + grupo + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertCT(data['return'])
                FillAllGrupos()
            },
            failure: function (error) {
            },
        });
    }
    else{
        SwitchAlertCT('Selecione um grupo para remover', true)
    }
}

function ClearGrupos(){
    $('#all_grupos_gt').val(0)
    document.getElementById('nome_grupo_gt').value = ''
}

//FIM FUNÇÕES MODAL TIPO DE SUS/FIX


//FUNÇÕES MODAL ITEMS SUS/FIX
async function RequestAllMatGt(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMateriaisGt/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['all_datas']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function FillSelectAllMats(all_items){
    var options_select_html = ``
    let title_str = ''
    for(let i = 0; i < all_items.length; i++){
        title_str = all_items[i]['nome'].toString().replace('"', '').replace('<', '').replace('>', '')
        options_select_html += `<option value="${all_items[i]['id']}" onclick="ClickIMatGt(${all_items[i]['id']})" title="${title_str}">${all_items[i]['nome']}</option>`
    }
    document.getElementById('all_mat_gt').innerHTML = options_select_html
}

async function ShowModalMatGt(){
    await FillAllMats()
    $('#modal_materiais_gt').modal('show')
}


async function GetValuesMateriais(){
    let nome = document.getElementById('nome_mat_gt').value
    let desc = document.getElementById('desc_mat_gt').value
    let item_selected = GetItemSelectedSelectMultiple('all_mat_gt')
    var fields_error = []
    if(nome.length > 0 && nome.length <= 150){
        if(VerifyOptionExistsSelect('all_mat_gt', nome, item_selected)){
            fields_error.push('Nome')
        }
    }
    else{
        fields_error.push('Nome')
    }

    if(desc.length === 0 || desc.length > 240){
        fields_error.push('Descrição')
    }

    if(fields_error.length === 0){
        return {
            'nome': nome,
            'desc': desc,
            'selected': item_selected
        }
    }
    else{
        return fields_error.join(' e ')
    }
}

async function FillAllMats(){
    let datas_mat = await RequestAllMatGt()
    FillSelectAllMats(datas_mat)
}

async function SendValuesMatGt(){
    let values = await GetValuesMateriais()
    if(typeof values === "string"){
        return SwitchAlertCT('Campos inválidos: ' + values, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMateriaisGt/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                values
            })},
        success: function (data) {
            SwitchAlertCT(data['return'])
            FillAllMats()
        },
        failure: function (error) {
        },
    });
}

function ClickIMatGt(id_mat){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "DatasMatGT/" + id_mat + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('nome_mat_gt').value = data['return']['nome']
            document.getElementById('desc_mat_gt').value = data['return']['desc']
        },
        failure: function (error) {
        },
    });
}

async function DeleteMatGt(){
    let id_mat = GetItemSelectedSelectMultiple('all_mat_gt')
    if(id_mat !== null){
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "DatasMatGT/" + id_mat + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertCT(data['return'])
                FillAllMats()
            },
            failure: function (error) {
            },
        });
    }
    else{
        SwitchAlertCT('Selecione um material para remover!!', true)
    }

}

function ClearModalMats(){
    document.getElementById('nome_mat_gt').value = ''
    document.getElementById('desc_mat_gt').value = ''
    $('#all_mat_gt').val(0)
}


//FIM FUNÇÕES MODAL ITEMS SUS/FIX



//FUNÇÕES MODAL MATERIAIS SUS/FIX

async function RequestAllMateriaisCodGt(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMateriaisCodGt/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['return']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function FillSelectAreasInMateriaisCod(areas){
    let options_areas_html = `<option value="0">Selecione uma Área</option>`
    for(let id_area in areas){
        options_areas_html += `<option value="${id_area}">${areas[id_area]}</option>`
    }
    document.getElementById('area_mat_gt').innerHTML = options_areas_html
}

function FillSelectMateriaisInMateriaisCod(materiais){
    let options_mats_html = `<option value="0">Selecione um Material</option>`
    for(let i = 0; i < materiais.length; i++){
        options_mats_html += `<option value="${materiais[i]['id']}">${materiais[i]['nome']}</option>`
    }
    document.getElementById('mats_mat_cdg_gt').innerHTML = options_mats_html
}

async function ShowModalMateriasCodGt(){
    let datas_materiais = await RequestAllMateriaisCodGt()
    FillSelectAreasInMateriaisCod(datas_materiais['areas'])
    FillSelectMateriaisInMateriaisCod(datas_materiais['mats'])
    $('#modal_materiais_codigos_gt').modal('show')
}

function VerifyCodeMaterialOk(code){
    let ok = true
    if(code.length === 0 || code.length > 60){
        ok = false
    }
    return ok
}

function GetAndVerifyDatasMateriaisCod(){
    let areas = $('#area_mat_gt').val()
    let mat = $('#mats_mat_cdg_gt').val()
    let code = document.getElementById('cods_mat_cdg_gt')
    let fields_error = []
    if(areas === '0'){
        fields_error.push('Área')
    }

    if(mat === '0'){
        fields_error.push('Materiais')
    }

    if(VerifyCodeMaterialOk(code.value) === false){
        fields_error.push('Código Material')
    }
    else{
        if(code.title === '0'){
            fields_error.push('Código Material (Código não encontrado no banco)')
        }
    }


    if(fields_error.length === 0){
        return {
            'areas': areas,
            'mat': mat,
            'code': code.value,
        }
    }
    else{
        return fields_error.join(', ')
    }
}

function SendDatasMaterialCod(){
    let values = GetAndVerifyDatasMateriaisCod()
    if(typeof values === "string"){
        return SwitchAlertCT('Campos Inválidos: ' + values, true)
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMateriaisCodGt/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                values
            })},
        success: function (data) {
            SwitchAlertCT(data['return'])
        },
        failure: function (error) {
        },
    });

}

function ClearMateriaisCodGt(){
    $('#area_mat_gt').val('0')
    $('#mats_mat_cdg_gt').val('0')
    document.getElementById('cods_mat_cdg_gt').value = ''
    document.getElementById('cods_mat_cdg_gt').title = ''
    document.getElementById('cods_mat_cdg_gt_desc').value = ''
    RemoveClassIsInvalid('cods_mat_cdg_gt')
}

function ChangeAreasAndMatInMateriaisCod(){
    let area = $('#area_mat_gt').val()
    let mat = $('#mats_mat_cdg_gt').val()
    if(area !== '0' && mat !== '0'){
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "ReturnDatasMateriaiCodeExists/",
            dataType: 'json',
            data: {'id_area': area, 'id_mat': mat},
            success: function (data) {
                let datas_return = data['datas_material']
                document.getElementById('cods_mat_cdg_gt').value = datas_return['code']
                VerifyMaterialCode(document.getElementById('cods_mat_cdg_gt'), 'cods_mat_cdg_gt_desc')
            },
            failure: function (error) {
            },
        });
    }
    else{
        document.getElementById('cods_mat_cdg_gt').value = ''
    }
}

function GetDatasForDeleteMaterialCod(){
    let area = $('#area_mat_gt').val()
    let mat = $('#mats_mat_cdg_gt').val()
    let fields_error = []
    if(area === '0'){
        fields_error.push('Áreas')
    }
    if(mat === '0'){
        fields_error.push('Items')
    }
    if(fields_error.length === 0){
        return {
            'id_area': area,
            'id_mat': mat
        }
    }
    else{
        return fields_error.join(' e ')
    }
}

function DeleteMaterialCod(){
    let datas = GetDatasForDeleteMaterialCod()
    if (typeof datas === "string"){
        return SwitchAlertCT('Selecione os campos: ' + datas + ' para verificar a possibilidade de remoção!!', true)
    }
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "DeleteMaterialCod/",
        dataType: 'json',
        data: {'datas_front':JSON.stringify(datas)},
        success: function (data) {
            SwitchAlertCT(data['msg_return'], data['error'])
        },
        failure: function (error) {
        },
    });

}

function VerifyMaterialCode(element_material_code, id_input_html=null){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "VerifyMaterialCodeArea/",
        dataType: 'json',
        data: {'datas_front':JSON.stringify({'code': element_material_code.value})},
        success: function (data) {
            let ok = data['ok']
            let matcode = data['matcode']
            let title = '0'
            if(ok){
                RemoveClassIsInvalid(element_material_code.id)
                title = '1'
                if(~id_input_html){
                    document.getElementById(`${id_input_html}`).value = matcode
                }

            }
            else{
                document.getElementById(`${id_input_html}`).value = '-'
                ClassIsInvalid(element_material_code.id)
            }
            element_material_code.title = title
        },
        failure: function (error) {
        },
    });
}


function VerifyMaterialCodeDesc(element_material_code, id_input_html){
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "VerifyMaterialCodeArea/",
        dataType: 'json',
        data: {'datas_front':JSON.stringify({'code': element_material_code.value})},
        success: function (data) {
            let matcode = data['matcode']
            let title = '0'
            document.getElementById(id_input_html).value = matcode
        },
        failure: function (error) {
        },
    });
}


function ClassIsInvalid(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(!class_list.includes('is-invalid')){
        i.classList.add('is-invalid')
    }
}

// --------------------- Função Remove validação ---------------------//
function RemoveClassIsInvalid(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(class_list.includes('is-invalid')){
        i.classList.remove('is-invalid')
    }
}

function ReloadPageCloseModal(){
    window.location.reload()
}
function CopyMateriaisOs(){
    let os_copy_selected = $('#ct_select_copy_os').val()
    if(os_copy_selected !== '0'){
       $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "CopyOsControleTipicos/" + os_copy_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertCT(data['return'])
                document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = ReloadPageCloseModal
            },
            failure: function (error) {
            },
        });
    }
    else{
        SwitchAlertCT('Selecione uma OS para copiar!!', true)
    }

}

async function ShowModalGruposBand(){
    await FillGruposBand()
    $('#modal_grupos_band_gt').modal('show')
}
async function FillGruposBand(){
    let grupos_band = await RequestAllGruposBand()
    FillSelectGruposBand(grupos_band)
}

async function RequestAllGruposBand(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "GruposBandGT/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['return']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function FillSelectGruposBand(datas_grupos_band){
    var str_options = ``
    let title_str = ''
    for(let i = 0; i < datas_grupos_band.length; i++){
        title_str = datas_grupos_band[i]['nome'].toString().replace('"', '').replace('<', '').replace('>', '')
        str_options += `<option value="${datas_grupos_band[i]['id']}" title="${title_str}" onclick="ClickGrupoBand(${datas_grupos_band[i]['id']})">${datas_grupos_band[i]['nome']}</option>`
    }
    document.getElementById('all_grupos_band_gt').innerHTML = str_options
}

async function ClickGrupoBand(id_gp_band){
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "DatasGruposBandGT/" + id_gp_band + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            FillFormsGrupoBand(data['return'])
        },
        failure: function (error) {
        },
    });
}

function FillFormsGrupoBand(datas_gp_band){
    document.getElementById('nome_grupo_band_gt').value = datas_gp_band['nome']
    $('#tipo_grupo_band_gt').val(datas_gp_band['tipo'])
    $('#tipo_grupo_fixacao').val(datas_gp_band['fixacao'])
    document.getElementById('vp_grupo_band_gt').checked = datas_gp_band['vista_planta']
}

function GetAndVerifyDatasGrupoBand(){
    let grupo_selected = GetItemSelectedSelectMultiple('all_grupos_band_gt')
    let nome = document.getElementById('nome_grupo_band_gt').value
    let tipo = $('#tipo_grupo_band_gt').val()
    let fixacao = $('#tipo_grupo_fixacao').val()
    let vista_planta = document.getElementById('vp_grupo_band_gt').checked
    var fields_error = []
    if(nome.length > 0 && nome.length <= 80){
        if(VerifyOptionExistsSelect('all_grupos_band_gt', nome, grupo_selected)){
            fields_error.push('Nome')
        }
    }
    else{
        fields_error.push('Nome')
    }

    if(tipo === '0'){
        fields_error.push('Tipo')
    }

    if(fields_error.length === 0){
        return {
            'nome': nome,
            'tipo': tipo,
            'fixacao': fixacao,
            'vista_planta': vista_planta,
            'selected': grupo_selected
        }
    }
    else{
        return fields_error.join(' e ')
    }
}

async function SendDatasGruposBand(){
    let datas_grupo = GetAndVerifyDatasGrupoBand()
    if(typeof datas_grupo === "string"){
        return SwitchAlertCT("Campos inválidos: " + datas_grupo, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "GruposBandGT/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify(datas_grupo)},
        success: function (data) {
            FillGruposBand()
            SwitchAlertCT(data['return'])
        },
        failure: function (error) {
        },
    });
}

function ClearGruposBand(){
    document.getElementById('nome_grupo_band_gt').value = ''
    $('#tipo_grupo_band_gt').val('0')
    document.getElementById('vp_grupo_band_gt').checked = false
    $('#all_grupos_band_gt').val(0)
}

async function DeleteGrupoBand(){
    let grupo_selected = GetItemSelectedSelectMultiple('all_grupos_band_gt')
    if(grupo_selected !== null){
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "DatasGruposBandGT/" + grupo_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data){
                FillGruposBand()
                SwitchAlertCT(data['return'])
            },
            failure: function (error) {
            },
        });
    }
    else{
        return SwitchAlertCT('Selecione um Grupo para remover!!', true)
    }
}

async function WhatModalGp(){
    let tipo_gp = 'NORMAL'
    let checkbox = document.getElementById('checkbox_tipo_gp')
    if(checkbox.checked){
        tipo_gp = 'ELETROCALHA/BANDEJA'
    }
    $('#modal_tipos_gp_gt').modal('hide')
    if(tipo_gp === 'NORMAL'){
        return await ShowModalGrupos()
    }
    else{
        return await ShowModalGruposBand()
    }
}


async function ShowModalMatsGps(){
    await FillAllFormsMatsGps()
    $('#modal_mats_gps_gt').modal('show')
}

async function RequestAllDatasMatsGps(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMatsGps/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['datas_return']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function FillSelectMatsInMatsGps(datas_mat){
    let options = ``
    for(let i = 0; i < datas_mat.length; i++){
        options += `<option value="${datas_mat[i]['id']}" draggable="true" ondragstart="DragStartMatInMatsGps(event, ${datas_mat[i]['id']})">${datas_mat[i]['nome']}</option>`
    }
    document.getElementById('mats_mats_gps_gt').innerHTML = options
}


function ReturnClassBgGpTemplates(tipo_gp){
    let class_return
    if(tipo_gp === 'FIXACAO'){
        class_return = 'bg-info'
    }else if(tipo_gp === 'NIVEIS'){
        class_return = 'bg-danger'
    }else if(tipo_gp === 'UNITARIO'){
        class_return = 'bg-warning'
    }else if(tipo_gp === 'TALAS'){
        class_return = 'bg-light'
    }else{
        class_return = 'bg-success'
    }
    return class_return
}


function FillDatasGpsNormaisEBand(datas_grps, id_element_gp, tipo_gp, tipo_grupo=null){
    let str_html = ``
    let title_str = ''
    let style_tipo_gp = ''
    let tipo_group_gp = ``
    let string_grupo = ''
    for(let gp in datas_grps){
        style_tipo_gp = 'bg-warning'

        if (tipo_grupo !== null){
            string_grupo = tipo_grupo[gp]
            if(string_grupo === 'NORMAL'){
                string_grupo = 'MULTIPLICADOR'
            }
            tipo_group_gp = `  -  (Tipo: ${string_grupo})`
            style_tipo_gp = ReturnClassBgGpTemplates(tipo_grupo[gp])
        }
        let mats_in_gp = datas_grps[gp]
        let str_html_mats_gp = ``
        let quant_mat_in_gp
        for(let i = 0; i < mats_in_gp.length; i++){
            title_str = mats_in_gp[i]['nome'].toString().replace('"', '').replace('<', '').replace('>', '')
            quant_mat_in_gp = String(mats_in_gp[i]['quant']).replace(".", ",")
            str_html_mats_gp += `<div class="row mx-1 d-flex justify-content-end mt-1">
                                    <div class="col-1 radius_10 bg-secondary">
                                        Qtd:
                                        <input value="${quant_mat_in_gp}" onchange="AddQuantInMat(this, ${mats_in_gp[i]['pk']})">
                                    </div>
                                    <div class="col-10 radius_10 bg-secondary">
                                      <div class="row">
                                        <div class="col-8" title="${title_str}">
                                          ${mats_in_gp[i]['nome']}
                                        </div>
                                        <div class="col-4 d-flex justify-content-end align-items-center">
                                          <i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DeleteMatInGp('${tipo_gp}', ${mats_in_gp[i]['id_gp']}, ${mats_in_gp[i]['id']})"></i>
                                        </div>
                                      </div>
                                    </div>
                                 </div>`
        }
        str_html += `<div class="container mt-2">
                        <div class="row radius_10 ${style_tipo_gp} mx-1" ondragover="DragOverInGp(event, this)" ondragleave="DragLeaveInGp(event, this)" ondrop="DropMatInGp(event, '${gp}', '${tipo_gp}')">
                          <span class="ml-1 text-truncate">
                            ${gp}${tipo_group_gp}
                          </span>
                        </div>
        
                        <div class="container">
                          ${str_html_mats_gp}
                        </div>
                     </div>`
    }
    document.getElementById(id_element_gp).innerHTML = str_html
}

function DragStartMatInMatsGps(event, id_mat){
    event.dataTransfer.setData('id_mat', id_mat)
}

async function FillAllFormsMatsGps(){
    let datas_mats_gps = await RequestAllDatasMatsGps()
    FillSelectMatsInMatsGps(datas_mats_gps['mats'])
    FillDatasGpsNormaisEBand(datas_mats_gps['mats_gp_normal'], 'gp_normal_mats_gps_gt', 'NORMAL', datas_mats_gps['mats_gp_tipo'])
    FillDatasGpsNormaisEBand(datas_mats_gps['mats_gp_band'], 'gp_band_mats_gps_gt', 'ELETROCALHA/BANDEJA')
}

function DragOverInGp(event, element){
    event.preventDefault()
    element.classList.add('drag_over_grps')
}

function DragLeaveInGp(event, element){
    event.preventDefault()
    element.classList.remove('drag_over_grps')
}

async function DeleteMatInGp(tipo_gp, id_gp, id_mat){
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllDatasMatsGps/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({'tipo_gp': tipo_gp,
                                                    'id_gp': id_gp,
                                                    'id_mat': id_mat})},
        success: function (data) {
            FillAllFormsMatsGps()
            SwitchAlertCT(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function AddQuantInMat(dom_js_input, id_group_material){
    let quant = parseFloat(dom_js_input.value.replace(",", "."))
    if(isNaN(quant)){
        dom_js_input.value = 0
        return SwitchAlertCT("Texto contido no campo não é Númerico!", true)
    }

    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "AlteraQuantGpsMat/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({'quant': quant,
                                                    'id_gp_mat': id_group_material,
                                                    })},
        success: function (data) {
            FillAllFormsMatsGps()
            SwitchAlertCT(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function DropMatInGp(event, name_gp, tipo){
    event.preventDefault()
    let id_mat = event.dataTransfer.getData('id_mat')
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "MatInGrp/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({'tipo_gp': tipo,
                                                    'name_gp': name_gp,
                                                    'id_mat': id_mat})},
        success: function (data) {
            FillAllFormsMatsGps()
            SwitchAlertCT(data['return']['msg'], data['return']['erro'])
        },
        failure: function (error) {
        },
    });
}