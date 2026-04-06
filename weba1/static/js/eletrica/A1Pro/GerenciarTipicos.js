
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

function SwitchAlertGt(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })

}


function ClearDropzonesInsert(id_dropzone){
    let items_dropzone = document.getElementById(id_dropzone).children
    for (let i = 0; i <items_dropzone.length;i++){
        if(!Array.from(items_dropzone[i].classList).includes('dwgs_insert')){
            items_dropzone[i].remove()
        }
    }
}

function ParametrosEventDropzones(){
    return [{key_id_dropzone: 'cardzone_block_header', key_id_file: 'arquivo_dwg_header', key_formdata: 'block_header'},
    {key_id_dropzone: 'cardzone_block_celula', key_id_file: 'arquivo_dwg_celula', key_formdata: 'block_celula'},
    {key_id_dropzone: 'cardzone_block_tag', key_id_file: 'arquivo_dwg_tag', key_formdata: 'block_tag'}]
}

function DeleteFileDwg(button_del, input_file){
    button_del.parentElement.parentElement.parentElement.remove()
    document.getElementById(input_file).value = ''
}

function SendFileBlock(formData, key){
    formData.append('key', key)
    $.ajax({
        url: "/app/eletrica/GerenciarTipicos/", // Caminho do Ajax
        type: "POST", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: formData, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            InitProgressGerenciarTipicos(data['task_id'])

        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}

function SendTamanhosBlocksInsert(id_block_insert, bloco_for_ids){
    let largura = document.getElementById('gt_insert_' + bloco_for_ids + '_larg').value !== ''?document.getElementById('gt_insert_' + bloco_for_ids + '_larg').value:null
    let altura = document.getElementById('gt_insert_' + bloco_for_ids + '_alt').value !== ''?document.getElementById('gt_insert_' + bloco_for_ids + '_alt').value:null
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/SaveMedidasBlocksInsert/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'alt': altura,
                'larg': largura,
                'id_block': id_block_insert
            })},
        success: function (data) {
            SwitchAlertGt(data['return'])
        },
        failure: function (error) {
        },
    });
}

function ShowDwgInScreen(id_block){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/ShowDwgInScreen/" + id_block + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('img_dwg').src = `data:image/png;base64,${data['dwg']}`
        },
        failure: function (error) {
        },
    });
}

function DeleteBlock(id_block){
    $.ajax({
        type: "DELETE",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/ShowDwgInScreen/" + id_block + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            swal({
                text: data['return'],
                icon: "success",
                button: 'Fechar'
            })
            $('div.swal-modal').addClass('bordas')
            $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
            $('button.swal-button').click(function() {
              window.location.reload()
            });
            $('div.swal-text').addClass('text-center')
            $('div.swal-footer').addClass('d-flex justify-content-center')
        },
        failure: function (error) {
        },
    });
}

function HideModalLoadCelery(){
    $('#modal_load_celery').modal('hide')
}

function InitProgressGerenciarTipicos(task_id){
    var progressUrl = `/celery-progress/${task_id}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
          onSuccess: customSucess,
          onError: customError,
          onProgress: customProgress,
        })

        function customSucess(progressBarElement, progressBarMessageElement, result){
            progressBarElement.style.backgroundColor = '#76ce60';
            setTimeout(HideModalLoadCelery, 8000)
            SwitchAlertGt(result)
            document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = FecharModalReturnDeleteTemplate
        }

        function customError(progressBarElement, progressBarMessageElement, excMessage){
            progressBarElement.style.backgroundColor = '#dc4f63';
            progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
            + progressUrl;
            setTimeout(HideModalLoadCelery, 8000)
        }

        function customProgress(progressBarElement, progressBarMessageElement, progress){
            progressBarElement.style.backgroundColor = '#68a9ef';
            progressBarElement.style.width = progress.percent + "%";
            var description = progress.description || "";
            progressBarMessageElement.innerHTML = description
        }
}


function NavMenuTipicos(id_show, id_active){
    const all_ids = ['content_insert_blocks', 'content_templates', 'template_tipicos_band_eletro', 'content_talas', 'content_chumbs', 'content_bandeja_eletrocalhas', 'content_alimentacao_equips', 'content_fixacao_forca', 'content_suporte_forca', 'content_derivacao_forca', 'content_acessorio_forca', 'content_fixleito_forca', 'content_insercao']
    const idsActive = ['nav_link_insert', 'nav_link_sups_band']
    if(id_show === 'content_templates'){
        document.getElementById('div_all_templates').hidden = false
    }else{
        document.getElementById('div_all_templates').hidden = true
    }
    for (let i = 0; i <all_ids.length;i++){
        document.getElementById(all_ids[i]).hidden = !(all_ids[i] === id_show)

    }

    for (let i = 0; i <idsActive.length;i++){
        if(idsActive[i] === id_active){
            $('#' + idsActive[i]).addClass('active')
        }
        else{
            $('#' + idsActive[i]).removeClass('active')
        }
    }
}


async function AddGroupInTemplate(id_template=null){
    let gp = $('#grupos_files_templates').val()
    if(gp !== '0'){
        if(!VerifyGpTemplateExists(gp)){
            let mats_in_gp
            let datas_gp = await RequestMaterialFromGrupos(gp, true)
            if(id_template === null){
                mats_in_gp = datas_gp['all_sus']
            }
            else{
                let datas_request = await RequestMateriaisExistsInTemplates(gp, id_template)
                mats_in_gp = datas_request['mats']
            }
            let container_mats_gp = ``
            let quant_gp = null
            for (let i = 0; i <mats_in_gp.length;i++){
                let id_mat = mats_in_gp[i][0]
                let nome_mat = mats_in_gp[i][1]
                //let qtde_material = mats_in_gp[i][2]
                //console.log(qtde_material)
                let num_item = id_template === null ? '':mats_in_gp[i][2]
                quant_gp = id_template === null ? null : mats_in_gp[i][3]
                let quantidade_material_gp =  mats_in_gp[i][4]
                container_mats_gp += `<div class="row d-flex justify-content-end mt-1" title="${id_mat}">
                                            
                                            <div class="col-2">
                                                N° Item:
                                                <input type="number" class="form-control form-control-sm" placeholder="Item" value="${num_item}">
                                            </div>
                                            <div class="col-8 radius_10 bg-secondary">
                                                <div class="row d-flex justify-content-center">
                                                    ${nome_mat}
                                                </div>
                                            </div>
                                            <div class="col-1 radius_10 bg-secondary">
                                                qtde
                                                <div class="row d-flex justify-content-center">
                                                    ${quantidade_material_gp}
                                                </div>
                                            </div>
                                      </div>`
            }
            let value_quant_gp = quant_gp === null ? '': quant_gp
            let content_html_tipo_gp = datas_gp['tipo_gp'] === 'FIXACAO' || datas_gp['tipo_gp'] === 'NORMAL' ? `<input type="number" class="form-control form-control-sm" title="${datas_gp['tipo_gp']}" value="${value_quant_gp}">`:datas_gp['tipo_gp']
            let tipo_grupo
            if(datas_gp['tipo_gp'] === 'NORMAL'){
                tipo_grupo = 'MULTIPLICADOR'
            }else{
                tipo_grupo = datas_gp['tipo_gp']
            }
            document.getElementById('templates_groups_add').insertAdjacentHTML(
                'beforeend',`<div class="container-fluid mt-1">
                                                                                        <div class="row col-12 radius_10 ${ReturnClassBgGpTemplates(datas_gp['tipo_gp'])} ml-3" title="${gp}">
                                                                                            <div class="col-1 d-flex align-items-center">
                                                                                                <i class="fa-solid fa-xmark hover_dwgs_talas_chumbs_os" onclick="DeleteGroupInTemplate(this)"></i>
                                                                                            </div>
                                                                                            <div class="col-7 d-flex align-items-center text-truncate">
                                                                                                ${datas_gp['gp_name']}  - (Tipo: ${tipo_grupo})
                                                                                            </div>
                                                                                            <div class="col-1 d-flex align-items-center">
                                                                                                
                                                                                            </div>
                                                                                            <div class="col-3 d-flex justify-content-end my-2" title="${datas_gp['tipo_gp']}">
                                                                                                ${content_html_tipo_gp}
                                                                                            </div>
                                                                                        </div>
                                                            
                                                                                        <div class="container">
                                                                                            ${container_mats_gp}
                                                                                        </div>
                                                                                    </div>`
            );

        }else {
            SwitchAlertGt("Já existe esse grupo no template!!", true)
        }
    }
}


async function AddGroupInBandElet(id_template=null){
    let gp = $('#grupos_files_band_elet').val()
    console.log(gp)
    if(gp !== '0'){

        let mats_in_gp
        let datas_gp = await RequestMaterialFromGroupSubBand(gp, true)
        if(id_template === null){
            mats_in_gp = datas_gp['all_sus']
        }
        else{
            let datas_request = await RequestMateriaisExistsInTemplates(gp, id_template)
            mats_in_gp = datas_request['mats']
        }
        let container_mats_gp = ``
        let quant_gp = null
        for (let i = 0; i <mats_in_gp.length;i++){
            let id_mat = mats_in_gp[i][0]
            let nome_mat = mats_in_gp[i][1]
            //let qtde_material = mats_in_gp[i][2]
            //console.log(qtde_material)
            let num_item = id_template === null ? '':mats_in_gp[i][2]
            quant_gp = id_template === null ? null : mats_in_gp[i][3]
            let quantidade_material_gp =  mats_in_gp[i][4]
            container_mats_gp += `<div class="row d-flex justify-content-end mt-1" title="${id_mat}">
                                        <div class="col-2">
                                            N° Item:
                                            <input id="id_band_elet_${id_mat}" type="number" class="form-control form-control-sm" placeholder="Item" value="${num_item}">
                                        </div>
                                        <div class="col-8 radius_10 bg-secondary">
                                            <div class="row d-flex justify-content-center">
                                                ${nome_mat}
                                            </div>
                                        </div>
                                        <div class="col-1 radius_10 bg-secondary">
                                            qtde
                                            <div class="row d-flex justify-content-center">
                                                ${quantidade_material_gp}
                                            </div>
                                        </div>
                                  </div>`
        }
        let value_quant_gp = quant_gp === null ? '': quant_gp
        let content_html_tipo_gp = datas_gp['tipo_gp'] === 'FIXACAO' || datas_gp['tipo_gp'] === 'NORMAL' ? `<input type="number" class="form-control form-control-sm" title="${datas_gp['tipo_gp']}" value="${value_quant_gp}">`: datas_gp['tipo_gp']
        let tipo_grupo
        if(datas_gp['tipo_gp'] === 'NORMAL'){
            tipo_grupo = 'MULTIPLICADOR'
        }else{
            tipo_grupo = datas_gp['tipo_gp']
        }
        document.getElementById('grupo_content').innerHTML = `
                                                                        <div class="container-fluid mt-1">
                                                                            <div class="row col-12 radius_10 ${ReturnClassBgGpTemplates(datas_gp['tipo_gp'])} ml-3" title="${gp}">
                                                                                <div class="col-1 d-flex align-items-center">
                                                                                    <i class="fa-solid fa-xmark hover_dwgs_talas_chumbs_os" onclick="DeleteGroupInTemplate(this)"></i>
                                                                                </div>
                                                                                <div class="col-7 d-flex align-items-center text-truncate">
                                                                                    ${datas_gp['gp_name']}  - (Tipo: ${tipo_grupo})
                                                                                </div>
                                                                                <div class="col-1 d-flex align-items-center">
                                                                                    
                                                                                </div>
                                                                                <div class="col-3 d-flex justify-content-end my-2" title="${datas_gp['tipo_gp']}">
                                                                                    ${content_html_tipo_gp}
                                                                                </div>
                                                                            </div>
                                                                            <div class="container">
                                                                                ${container_mats_gp}
                                                                            </div>
                                                                        </div>`
    }
}

async function FillDatasInTemplateExists(id_template){
    ClearDropZoneTemplate()
    let all_datas_template = await RequestAllGrpsInTemplate(id_template)
    let all_grps = all_datas_template['all_gps']
    $('#chumbadores_templates').val(all_datas_template['id_chumb'])
    document.getElementById('quant_chumbs_templates').value = all_datas_template['quant_chumb']
    if(all_datas_template['fix_band'] === 'PERFILADO'){
        document.getElementById('tamplates_radio_perfilado').checked = true
    }
    else{
        document.getElementById('tamplates_radio_perfil').checked = true
    }
    document.getElementById('template_vista_em_planta').checked = all_datas_template['vista_planta']
    for (let i = 0; i <all_grps.length;i++){
        $('#grupos_files_templates').val(all_grps[i])
        await AddGroupInTemplate(id_template)
        $('#grupos_files_templates').val('0')
    }
    document.getElementById('filetemplate').hidden = false
}


async function FillDatasInTemplateExistsBandElet(id_template){
    ClearDropZoneTemplateBandElet()
    let all_datas_template = await RequestAllGrpsInTemplateBandElet(id_template)
    console.log(all_datas_template)
    $('#grupos_files_band_elet').val(all_datas_template['gp_mat'])
    await AddGroupInBandElet()
    // inputElement = document.getElementById('grupos_files_band_elet')
    // const changeEvent = new Event('change');
    // inputElement.dispatchEvent(changeEvent);
    if(all_datas_template['gp_itens'].length !== 0){
        for(const dictionary of all_datas_template['gp_itens']){

            Object.entries(dictionary).forEach(([key, value]) => {
                document.getElementById(`id_band_elet_${key}`).value = value
            });
            // document.getElementById(`id_band_elet_${dictonary.key}`).value = dictonary.value
        }
    }


}

async function RequestAllGrpsInTemplate(id_template){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: `GroupsInTemplate/${id_template}/`,
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function RequestAllGrpsInTemplateBandElet(id_template){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: `GroupsInTemplateBandElet/${id_template}/`,
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function DeleteGroupInTemplate(btn_del){
    btn_del.parentElement.parentElement.parentElement.remove()
}

function VerifyGpTemplateExists(gp){
    let all_cards_gps = document.getElementById('templates_groups_add').children
    var exists = false
    for (let i = 0; i <all_cards_gps.length;i++){
        if(all_cards_gps[i].title === gp){
            exists = true
            break
        }
    }
    return exists
}

async function RequestAllGrupos(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "AllSusGerenciarTipicosGrupos/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['all_sus']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function RequestMaterialFromGrupos(id_grupo, screen_templates=false){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: `MaterialFromTipicosGrupos/${id_grupo}/`,
        dataType: 'json',
        data: {},
        success: function (data) {
            if(!screen_templates){
                datas_return = data['all_sus']
            }
            else{
                datas_return = data
            }
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function RequestMaterialFromGroupSubBand(id_grupo, screen_templates=false){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: `RequestMaterialFromGroupSubBand/${id_grupo}/`,
        dataType: 'json',
        data: {},
        success: function (data) {
            if(!screen_templates){
                datas_return = data['all_sus']
            }
            else{
                datas_return = data
            }
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function RequestMateriaisExistsInTemplates(id_gp, id_template){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: `MatsInTemplate/${id_gp}/${id_template}/`,
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data
        },
        failure: function (error) {
        },
    });
    return datas_return
}
async function CreateStrHtmlOptionsSelectGrupos(){
    let list_sus = await RequestAllGrupos() //retorna tupla onde a posição 0 é o id e a posição 1 é o nome
    let str_options = `<option value="0">---</option>`
    for (let i = 0; i <list_sus.length;i++){
        str_options += `<option value="${list_sus[i][0]}">${list_sus[i][1]}</option>`
    }
    return str_options
}

async function CreateStrHtmlOptionsSelectMateriaisGrupos(num_item, id_grupo){
    let select_material = document.getElementById(`materiais_grupos_band_eletr_${num_item}`)
    let str_options = `<option value="0">---</option>`
    if(id_grupo === '0' || id_grupo === 0){

        select_material.innerHTML = str_options
        return false
    }
    let list_sus = await RequestMaterialFromGrupos(id_grupo) //retorna tupla onde a posição 0 é o id e a posição 1 é o nome
    for (let i = 0; i <list_sus.length;i++){
        str_options += `<option value="${list_sus[i][0]}">${list_sus[i][1]}</option>`
    }
    select_material.innerHTML = str_options
    return true
}

function DeleteCardItemTemplatesGt(item){
    document.getElementById(`card_item_${item}`).remove()
}

function DeleteFileTemplate(btn_del){
    btn_del.parentElement.parentElement.parentElement.remove()
    FilesTemplate.delete('FileTemplate')
    document.getElementById('arquivo_dwg_templates').value = ''
}


function ClassIsInvalidGt(item){
    let class_list = Array.from(item.classList)
    if(!class_list.includes('is-invalid')){
        item.classList.add('is-invalid')
    }
}

// --------------------- Função Remove validação ---------------------//
function RemoveClassIsInvalidGt(item){
    let class_list = Array.from(item.classList)
    if(class_list.includes('is-invalid')){
        item.classList.remove('is-invalid')
    }
}

function VerifyCodeCardOk(input){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ControleTipicos/VerifyMaterialCodeArea/",
        dataType: 'json',
        data: {'datas_front':JSON.stringify({'code': input.value})},
        success: function (data) {
            let ok = data['ok']
            let title = '0'
            if(ok){
                RemoveClassIsInvalidGt(input)
                title = '1'
            }
            else{
                ClassIsInvalidGt(input)
            }
            input.title = title
        },
        failure: function (error) {
        },
    });
}

function SendFileDwgTemplate(){
    let datas_file = GetAndVerifyDatasMatsTemplates()
    if(typeof datas_file === "string"){
        return SwitchAlertGt('Atenção: ' + datas_file, true)
    }
    FilesTemplate.append('datas_file', JSON.stringify(datas_file))
    if(FilesTemplate.get('FileTemplate')!==null){
        $.ajax({
            url: "/app/eletrica/GerenciarTipicos/Templates/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrftoken},
            dataType: "json",
            data: FilesTemplate, // Envia form pela solicitação do POST
            processData: false,
            contentType: false,
            success: function (data) {
                $('#modal_load_celery').modal('show')
                localStorage.setItem("screen_load", "content_templates")
                InitProgressGerenciarTipicos(data['task_id'])
            },
            failure: function () {
                alert('Algo deu errado! verifique e tente novamente.')
            }
        })
    }
    else{
        SwitchAlertGt('Envie um arquivo para Inserir ou Atualizar um template!!', true)
    }

}


function GetArrayAllCardsTemplates(){
    let list_of_itens = []
    let list_of_cards =  document.querySelectorAll("[id^='card_item_id_']")
    for(let i =0; i < list_of_cards.length; i++){
        list_of_itens.push(list_of_cards[i].value)
    }
    let obj_itens = {}
    let id_grupo = 0
    let id_materiais = 0
    let quantidade = 0
    let num_item = 0
    for(let j =0; j < list_of_itens.length; j++){
        num_item = list_of_itens[j]

        id_grupo = document.getElementById(`grupos_band_eletr_${list_of_itens[j]}`).selectedOptions[0].value
        id_materiais = document.getElementById(`materiais_grupos_band_eletr_${list_of_itens[j]}`).selectedOptions[0].value
        quantidade = document.getElementById(`materiais_grupos_band_eletr_quant_${list_of_itens[j]}`).value

        obj_itens[num_item] = {'id_grupo': id_grupo, 'id_materiais': id_materiais, 'quantidade': quantidade}
    }
    return obj_itens
}


function GetDatasFileDwgTemplates(){
    let items = GetArrayAllCardsTemplates()
    let dict_erros = {}
    let template_selected = document.getElementById('template_exists_selected').value !== ''?document.getElementById('template_exists_selected').value:null
    if(items !== null){
        let x_footer = document.getElementById('templates_x_footer').value
        let y_footer = document.getElementById('templates_y_footer').value
        let x_table = document.getElementById('templates_x_table').value
        let y_table = document.getElementById('templates_y_table').value
        let x_logo = document.getElementById('templates_x_logo').value
        let y_logo = document.getElementById('templates_y_logo').value
        let vista_em_planta = document.getElementById('tamplates_vista_em_planta').checked
        let fixacao_em_perfil = document.getElementById('tamplates_radio_perfil').checked
        let list_errors = []

        for (let key in items){

            if(items[key]['id_grupo'] === '0'){
                list_errors.push(`Erro no item ${key} -> Grupo não selecionado\n`)
            }
            if(items[key]['id_materiais'] === '0'){
                list_errors.push(`Erro no item ${key} -> Material não selecionado\n`)
            }
        }

        if(list_errors.length > 0){
            let  str_erros = 'Items inválidos:\n'
            for(let i=0;i < list_errors.length; i++){
                str_erros += list_errors[i]
            }
            return str_erros
        }
        else{
            return {
                'items': items,
                'template_selected': template_selected,
                'x_footer': x_footer,
                'y_footer': y_footer,
                'x_table': x_table,
                'y_table': y_table,
                'x_logo': x_logo,
                'y_logo': y_logo,
                'vista_em_planta': vista_em_planta,
                'fixacao_em_perfil': fixacao_em_perfil,
            }
        }
    }
    else{
        return 'Envie algum arquivo para que possamos salvar!!'
    }

}

async function ClickTemplatesSaveGt(id_template){
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/TemplateDwgImage/" + id_template + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('img_dwg_template').src = `data:image/png;base64,${data['dwg']}`
        },
        failure: function (error) {
        },
    });
}

function changeCheckboxSelectAllChecks(checked, classQuerySelector){
    const allTemplatesExists = document.getElementsByClassName(classQuerySelector)
    for (let i = 0; i <allTemplatesExists.length;i++){
        let checkTemplate = allTemplatesExists[i]
        checkTemplate.checked = checked
    }
}

function swal_deleta_templates(id_template){
    swal({
        title: "Você tem certeza?",
        text: "Não é possivel recuperar esse arquivo após a ação!",
        type: "warning",
        buttons:{
            yes:{
                text: 'SIM',
                value: 'SIM'
            },
            no:{
                text: 'NÃO',
                value: 'NÃO'
            }
        }
     }).then((result)=>{
         if(result === 'SIM'){
             DeleteTemplateSaveGt(id_template)
         }
     }
    );

}

function swal_deleta_all_templates(){
    swal({
        title: "Você tem certeza que quer deletar os arquivos selecionados?",
        text: "Não é possivel recuperar esses arquivos após a ação!",
        type: "warning",
        buttons:{
            yes:{
                text: 'SIM',
                value: 'SIM'
            },
            no:{
                text: 'NÃO',
                value: 'NÃO'
            }
        }
     }).then((result)=>{
         if(result === 'SIM'){
             deleteTemplatesSelecteds()
         }
     }
    );
}


async function deleteTemplatesSelecteds(){
    const allTemplatesSelecteds = Array.from(document.getElementsByClassName('check_in_templates_exists')).filter(check=>check.checked).map(check=>{return check.value})
    if(allTemplatesSelecteds.length > 0){
        await DeleteTemplateSaveGt(allTemplatesSelecteds)
    }
    else{
        SwitchAlertGt("Selecione pelo menos um template para remover!!", true)
    }
}

async function DeleteTemplateSaveGt(arrayIdsTemplates){
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/DeleteTemplatesExists/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'idsTemplatesDelete': arrayIdsTemplates
            })},
        success: function (data) {
            SwitchAlertGt(data['return'])
            localStorage.setItem("screen_load", "content_templates")
            changeCheckboxSelectAllChecks(false, 'check_in_templates_exists')
            document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = FecharModalReturnDeleteTemplate
        },
        failure: function (error) {
        },
    });
}

function FecharModalReturnDeleteTemplate(){
    window.location.reload()
}


async function GetDatasTemplateExistsGt(id_template){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/DatasTemplateSelectedGt/" + id_template + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['items']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function CreateItemsHtmlInTemplateFileExists(dict_item){
    let num_item = dict_item['num_item']
    let quant = dict_item['quantidade']
    //let options_select = await CreateSelectCardExistTemplates(dict_item['SUS'])
    let options_select = await CreateStrHtmlOptionsSelectGrupos()

    let card_html = `<div id="card_item_${num_item}" class="col-5 bg-secondary radius_10 h-100 d-flex align-items-center mb-2 mx-1 animate__animated animate__zoomInDown">
                            <div class="col-2">
                                <b>${num_item}</b>
                                <input hidden id="card_item_id_${num_item}" value="${num_item}">
                            </div>

                            <div class="col-10 mb-2">
                                <div class="col-12">
                                    <button onclick="DeleteCardItemTemplatesGt(${num_item})" title="Remove Card" class="btn btn-outline-danger rounded-pill px-2 border-0 position-absolute" type="button" style="right:-26px;top:0px;"><i class="fas fa-times-circle fa-xl"></i></button>
                                    <br>
                                    <label class="text-right w-100">Grupos:</label>
                                    <select class="form-control form-control-sm" id="grupos_band_eletr_${num_item}" onclick="CreateStrHtmlOptionsSelectMateriaisGrupos(${num_item}, this.selectedOptions[0].value)">
                                        ${options_select}
                                    </select>
                                    <label class="text-right w-100">Materiais:</label>
                                    <select class="form-control form-control-sm" id="materiais_grupos_band_eletr_${num_item}" >
                                        <option value="0">---</option>
                                    </select>
                                </div>

                                <div class="col-12" >
                                    <label class="text-right w-100">Quantidade:</label>
                                    <input class="form-control form-control-sm" type="number" id="materiais_grupos_band_eletr_quant_${num_item}" value="${quant}">
                                </div>
                            </div>
                        </div>`

    return card_html
}

function ClearDropZoneTemplate(){
    document.getElementById('cards_file_template').innerHTML = ''
    document.getElementById('arquivo_dwg_templates').value = ''
    $('#grupos_files_templates').val('0')
    $('#chumbadores_templates').val('0')
    document.getElementById('quant_chumbs_templates').value = ''
    document.getElementById('tamplates_radio_perfil').checked = false
    document.getElementById('template_vista_em_planta').checked = false
    document.getElementById('tamplates_radio_perfilado').checked = false
    document.getElementById('templates_groups_add').innerHTML = ''
    FilesTemplate.delete('FileTemplate')
    document.getElementById('templates_groups_add').innerHTML = ''
    document.getElementById('filetemplate').hidden = true
}

function ClearDropZoneTemplateBandElet(){
    document.getElementById('grupo_content').innerHTML = ''
    $('#grupos_files_band_elet').val('0')
}
var FilesTalasChumbs = new FormData()
function DropArquivosTalasChumbs(talas_chumbs, dwg_image, file_drop=null){
    let ids_elements
    if(talas_chumbs === 'TALAS'){
        ids_elements = {'input': 'arquivo_dwg_tala', 'forms_file': 'forms_files_talas', 'key_form_data': 'FilesTala', 'content_files': 'content_files_talas', 'value_data_name_file': 'name_file_tala'}
    }else if(talas_chumbs === 'CHUMBADORES'){
        ids_elements = {'input': 'arquivo_dwg_chumbs', 'forms_file': 'forms_files_chumbs', 'key_form_data': 'FilesChumbs', 'content_files': 'content_files_chumbs', 'value_data_name_file': 'name_file_chumbs'}
    }else{
        ids_elements = {'input': 'arquivo_dwg_band_elet', 'forms_file': 'forms_files_band_elet', 'key_form_data': 'FilesBandElet', 'content_files': 'content_files_band_elet', 'value_data_name_file': 'name_file_band_elet'}
    }
    let form_file = document.getElementById(ids_elements['forms_file']);
    let input_file = document.getElementById(ids_elements['input']);
    let element_content_files = document.getElementById(ids_elements['content_files'])
    let content_element_content = ``
    let files = file_drop === null ? input_file.files : file_drop.files
    let id_selected = GetIdSelectedTalasChumbs(talas_chumbs)
    let error_file;
    let name_file_splited;
    let extension ;
    let list_files_error = []

    for (let i = 0; i <files.length;i++){
        let file = files[i]
        error_file = false
        name_file_splited = file.name.split('.')
        extension = name_file_splited[name_file_splited.length - 1]
        extension = extension.toUpperCase()
        if(extension !== 'DWG'){
            error_file = true
        }
        if(id_selected === null){

        }
        if(!error_file) {
            let str_file_html = `
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mx-auto input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown hover_dwgs_gerenciar_tipicos mb-2">
                                    <div class="input-group-prepend my-auto px-1">
                                        <img class="imgdwg" src="${dwg_image}">
                                    </div>
                                    <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate" data-name-file="${ids_elements['value_data_name_file']}">${file.name}</span>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger rounded-pill px-2 my-1 mb-2 border-0" type="button">
                                            <i class="fas fa-times-circle fa-lg" onclick="DeleteFileInLstFilesTalasChumbs(this)"></i>
                                        </button>
                                    </div>
                                </div>`
            if(id_selected === null){
                content_element_content += str_file_html
                FilesTalasChumbs.append(ids_elements['key_form_data'], file)
                form_file.hidden = false
            }
            else{
                if(i === files.length - 1){
                    content_element_content += str_file_html
                    FilesTalasChumbs.append(ids_elements['key_form_data'], file)
                }
            }

        }
        else{
            if(id_selected === null){
                list_files_error.push(file.name)
            }
            else{
                if(i === files.length - 1){
                    list_files_error.push(file.name)
                }
            }

        }
    }
    if(list_files_error.length > 0){
        return SwitchAlertCT('Arquivo(s) inválido(s): ' + list_files_error.join(', '), true)
    }
    else{
        element_content_files.innerHTML = content_element_content
    }
}

function DeleteFileInLstFilesTalasChumbs(btn_del){
    btn_del.parentElement.parentElement.parentElement.remove()
}


function SendFilesDwgTalasChumbs(talas_chumbs){
    let datas_talas = GetAndVerifDatasFilesTalasChumbs(talas_chumbs)
    if(typeof datas_talas === "string"){
        return SwitchAlertGt(datas_talas, true)
    }
    if (talas_chumbs === 'BAND_ELET'){
        let result_itens_band_elet = GetNumberOfMaterialBandElet()
        if(typeof result_itens_band_elet == "string"){
            return SwitchAlertGt(result_itens_band_elet, true)
        }else{
            FilesTalasChumbs.append('data_band_elet', JSON.stringify(result_itens_band_elet))
        }
    }
    FilesTalasChumbs.delete('datas_forms')
    FilesTalasChumbs.append('datas_forms', JSON.stringify(datas_talas))
    $.ajax({
        url: "/app/eletrica/GerenciarTipicos/TalasChumbs/", // Caminho do Ajax
        type: "POST", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: FilesTalasChumbs, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            localStorage.setItem("screen_load", ReturnIdContainerTalasChumbs(talas_chumbs))
            InitProgressGerenciarTipicos(data['task_id'])
        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}


function GetNumberOfMaterialBandElet(){
    let mat_band_elet = GetMatsInTemplatesBandElet()
    if(mat_band_elet[0] === false){

        return  mat_band_elet[1].join(',\n')
    }else{
        return mat_band_elet[1]
    }
}

function GetMatsInTemplatesBandElet(){
    let dict_return = {}
    let elements_gp = document.getElementById('grupo_content').children
    let list_of_itens = {}
    let num_item
    let nome_mat
    let list_of_erros = []
    let list_of_errors = []
    let gp
    for (let i = 0; i <elements_gp.length;i++){
        gp = elements_gp[i].children[0].title
        console.log(gp)
        dict_return[gp] = []
        // pegar o form de quant
        let col_tipo_gp = elements_gp[i].children[0].children[3]
        let quant_gp = null
        let all_mats_in_gp = elements_gp[i].children[1].children
        for (let j = 0; j <all_mats_in_gp.length;j++){
            num_item = all_mats_in_gp[j].children[0].children[0].value
            nome_mat = all_mats_in_gp[j].children[1].children[0].innerText
            console.log(num_item, nome_mat)
            dict_return[gp].push({ 'gp_band_elet_id': gp, 'id_mat': all_mats_in_gp[j].title,
                'num_item': num_item, 'quant_gp': quant_gp})
            if (isNaN(parseInt(num_item))){
                 list_of_errors.push(`ERROR: item ${nome_mat} Está vázio ou com um valor que não é número!`)
            }else{
                list_of_itens[num_item] =  nome_mat
            }
        }
    }
    if(elements_gp.length === 0)
    {
       return [false, ['Não há Grupos']]
    }else if(list_of_errors.length === 0 ){
        return [true, dict_return]
    }else{
        return [false, list_of_errors]
    }

}


function ReturnKeyInFormData(talas_chumbs){
    if(talas_chumbs === 'TALAS'){
        return 'FilesTala'
    }else if(talas_chumbs === 'CHUMBADORES'){
        return 'FilesChumbs'
    }else{
        return 'FilesBandElet'
    }
}

function GetAndVerifDatasFilesTalasChumbs(talas_chumbs){
    let key_in_form_data = ReturnKeyInFormData(talas_chumbs)
    let word_patterns_in_ids
    let value_data_name_file
    let errors = []
    if(talas_chumbs === 'TALAS'){
        word_patterns_in_ids = 'tala'
        value_data_name_file = 'name_file_tala'
    }else if(talas_chumbs === 'CHUMBADORES'){
        word_patterns_in_ids = 'chumbs'
        value_data_name_file = 'name_file_chumbs'
    }else{
        word_patterns_in_ids = 'band_elet'
        value_data_name_file = 'name_file_band_elet'
    }
    let group_talas = ''
    // if(talas_chumbs === 'TALAS'){
    //     group_talas = document.getElementById('grupos_files_talas').value
    //     if(group_talas === "0"){
    //         errors.push("É necessário selecionar o grupo de talas!")
    //     }
    // }
    let x_rodape = document.getElementById(word_patterns_in_ids + '_x_footer').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_footer').value
    let y_rodape = document.getElementById(word_patterns_in_ids + '_y_footer').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_footer').value
    let x_table = document.getElementById(word_patterns_in_ids + '_x_table').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_table').value
    let y_table = document.getElementById(word_patterns_in_ids + '_y_table').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_table').value
    let x_logo = document.getElementById(word_patterns_in_ids + '_x_logo').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_logo').value
    let y_logo = document.getElementById(word_patterns_in_ids + '_y_logo').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_logo').value
    let names_files = ReturnListNameFilesInDropZone(value_data_name_file)
    let id_file_selected = GetIdSelectedTalasChumbs(talas_chumbs)

    if(FilesTalasChumbs.get(key_in_form_data) === null){
        errors.push('Arquivo DWG')
    }
    else{
        if(names_files.length === 0){
            errors.push('Arquivo DWG')
        }
    }
    if(errors.length === 0){
        return {
            'names_files': names_files,
            'x_rodape': x_rodape,
            'y_rodape': y_rodape,
            'x_table': x_table,
            'y_table': y_table,
            'x_logo': x_logo,
            'y_logo': y_logo,
            'key_form_data': key_in_form_data,
            'tala_chumbs': talas_chumbs,
            'id_file_selected': id_file_selected,
            'group_talas': group_talas
        }
    }
    else{
        return 'Tem algo de errado com: ' + errors.join(', ')
    }

}

function ClickTalasChumbsExists(id_talas_chumbs, img_jinja){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/TalasChumbs/" + id_talas_chumbs + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            ClearDropzoneTalasChumbs(data['tipo'])
            ShowImgDwgInTalasChumbs(data['img'], data['tipo'])
            FillDatasFileTalasChumbsInDropzone(data['medidas'], data['name_file'], data['tipo'], img_jinja, id_talas_chumbs)
        },
        failure: function (error) {
        },
    });
}

function MarkIdSelectedTalasChumbs(talas_chumbs, id){
    let id_input
    if(talas_chumbs === 'TALAS'){
        id_input = 'tala_exists_selected'
    }else if(talas_chumbs === 'CHUMBADORES'){
        id_input = 'chumbs_exists_selected'
    }else{
        id_input = 'band_elet_exists_selected'
    }
    document.getElementById(id_input).value = id
}

function GetIdSelectedTalasChumbs(talas_chumbs){
    let id_input
    if(talas_chumbs === 'TALAS'){
        id_input = 'tala_exists_selected'
    }else if(talas_chumbs === 'CHUMBADORES'){
        id_input = 'chumbs_exists_selected'
    }else{
        id_input = 'band_elet_exists_selected'
    }
    return document.getElementById(id_input).value === '' ? null : document.getElementById(id_input).value
}
function ReturnListNameFilesInDropZone(value_data_name_file){
    let elements_names_files = document.querySelectorAll("[data-name-file="+value_data_name_file+"]")
    let names_files = []
    for (let i = 0; i <elements_names_files.length;i++){
        names_files.push(elements_names_files[i].innerText)
    }
    return names_files
}

function ShowImgDwgInTalasChumbs(img_base_64, talas_chumbs){
    let id_element_img
    if(talas_chumbs === 'TALAS'){
        id_element_img = 'img_dwg_tala'
    }else if(talas_chumbs === 'CHUMBADORES'){
        id_element_img = 'img_dwg_chumbs'
    }else{
        id_element_img = 'img_dwg_band_elet'
    }
    document.getElementById(id_element_img).src = `data:image/png;base64,${img_base_64}`
}

function FillDatasFileTalasChumbsInDropzone(medidas, name_file, talas_chumbs, img_jinja, id_selected){
    MarkIdSelectedTalasChumbs(talas_chumbs, id_selected)
    let dict_aux
    if(talas_chumbs === 'TALAS'){
        document.getElementById('grupos_files_talas').value = medidas['group_talas']
        dict_aux = {'pattern_in_id': 'tala', 'value_data_name_file': 'name_file_tala', 'id_element_files': 'content_files_talas', 'form_files': 'forms_files_talas'}
    }else if(talas_chumbs === 'CHUMBADORES'){
        dict_aux = {'pattern_in_id': 'chumbs', 'value_data_name_file': 'name_file_chumbs', 'id_element_files': 'content_files_chumbs', 'form_files': 'forms_files_chumbs'}
    }else{
        dict_aux = {'pattern_in_id': 'band_elet', 'value_data_name_file': 'name_file_band_elet', 'id_element_files': 'content_files_band_elet', 'form_files': 'forms_files_band_elet'}
    }
    let inner_html_file = `
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mx-auto input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown hover_dwgs_gerenciar_tipicos mb-2">
                            <div class="input-group-prepend my-auto px-1">
                                <img class="imgdwg" src="${img_jinja}">
                            </div>
                            <span type="text" title="${name_file}" class="col border-0 input-group-text bg-white text-truncate" data-name-file="${dict_aux['value_data_name_file']}">${name_file}</span>
                            <div class="input-group-append">
                                <button class="btn btn-outline-danger rounded-pill px-2 my-1 mb-2 border-0" type="button">
                                    <i class="fas fa-times-circle fa-lg" onclick=""></i>
                                </button>
                            </div>
                        </div>`
    document.getElementById(dict_aux['pattern_in_id'] + '_x_footer').value = medidas['x_footer']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_footer').value = medidas['y_footer']
    document.getElementById(dict_aux['pattern_in_id'] + '_x_table').value = medidas['x_table']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_table').value = medidas['y_table']
    document.getElementById(dict_aux['pattern_in_id'] + '_x_logo').value = medidas['x_logo']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_logo').value = medidas['y_logo']
    document.getElementById(dict_aux['form_files']).hidden = false
    // document.getElementById(dict_aux['id_element_files']).innerHTML = inner_html_file
}

function ClearDropzoneTalasChumbs(talas_chumbs){
    let dict_aux = talas_chumbs === 'TALAS' ? {'pattern_in_id': 'tala', 'form_files': 'forms_files_talas', 'id_element_files': 'content_files_talas', 'id_element_img': 'img_dwg_tala'} : {'pattern_in_id': 'chumbs', 'form_files': 'forms_files_chumbs', 'id_element_files': 'content_files_chumbs', 'id_element_img': 'img_dwg_chumbs'}
    let key_form_data = ReturnKeyInFormData(talas_chumbs)
    document.getElementById(dict_aux['id_element_img']).src = ''
    FilesTalasChumbs.delete(key_form_data)
    document.getElementById(dict_aux['form_files']).hidden = true
    document.getElementById(dict_aux['id_element_files']).innerHTML = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_footer').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_footer').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_table').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_table').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_logo').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_logo').value = ''
    document.getElementById('grupos_files_talas').value = 0
    MarkIdSelectedTalasChumbs(talas_chumbs, '')

}

function DeleteFileTalasChumbsExists(arrayIds, tipo){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/DeleteTalasChumbs/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({'arrayIds': arrayIds})},
        success: function (data) {
            SwitchAlertGt(data['return'])
            changeCheckboxSelectAllChecks(false, returnClassInCheckbox(tipo))
            localStorage.setItem("screen_load", ReturnIdContainerTalasChumbs(tipo))
            document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = FecharModalReturnDeleteTemplate
        },
        failure: function (error) {
        },
    });
}

function clickBtnDelTalasChumbsSelecteds(tipo){
    const idsDel = Array.from(document.getElementsByClassName(returnClassInCheckbox(tipo))).filter(check=>check.checked).map(check=>{return check.value})
    if(idsDel.length > 0){
        confirmDeleteTalasChumbs(idsDel, tipo)
    }
}

function confirmDeleteTalasChumbs(arrayIds, tipo){
    swal({
            title: "Você tem certeza?",
            text: "Não é possivel recuperar esse arquivo após a ação!",
            type: "warning",
            buttons:{
                yes:{
                    text: 'SIM',
                    value: 'SIM'
                },
                no:{
                    text: 'NÃO',
                    value: 'NÃO'
                }
            }
         }).then((result)=>{
             if(result === 'SIM'){
                 DeleteFileTalasChumbsExists(arrayIds, tipo)
             }
         }
     );
}

function returnClassInCheckbox(tipo){
    if(tipo === 'TALAS'){
        return 'check_in_tala_exists'
    }
    else if(tipo === 'CHUMBADORES'){
        return 'check_in_chumbs_exists'
    }
    else{
        return 'check_in_band_elet_exists'
    }
}



function ReturnIdContainerTalasChumbs(talas_chumbs){

    if(talas_chumbs === 'TALAS'){
        return 'content_talas'
    }else if(talas_chumbs === 'CHUMBADORES'){
        return 'content_chumbs'
    }else{
        return "content_bandeja_eletrocalhas"
    }
}

function FilterFilesExistsTalasChumbs(id_content_files, value_input){
    let elements_files = document.getElementById(id_content_files).children
    for (let i = 0; i <elements_files.length;i++){
        let name_file = elements_files[i].title.toUpperCase()
        if(name_file.includes(value_input.toUpperCase())){
            elements_files[i].hidden = false
        }
        else{
            elements_files[i].hidden = true
        }
    }
}

function HideShowMedidas(list_ids_containers_medidas){
    for (let i = 0; i <list_ids_containers_medidas.length;i++){
        document.getElementById(list_ids_containers_medidas[i]).hidden = !document.getElementById(list_ids_containers_medidas[i]).hidden
    }
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


function contains(arr, key, val) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][key] === val) return true;
  }
  return false;
}


function GetMatsInTemplates(){
    let dict_return = {}
    let elements_gp = document.getElementById('templates_groups_add').children
    let list_of_itens = {}
    let num_item
    let nome_mat
    let list_of_erros = []
    let list_of_errors = []
    let gp
    for (let i = 0; i <elements_gp.length;i++){
        gp = elements_gp[i].children[0].title
        console.log(gp)
        dict_return[gp] = []
        // pegar o form de quant
        let col_tipo_gp = elements_gp[i].children[0].children[3]
        let quant_gp = null
        if(col_tipo_gp.title === 'FIXACAO' || col_tipo_gp.title === 'NORMAL'){
            quant_gp = col_tipo_gp.children[0].value
        }
        let all_mats_in_gp = elements_gp[i].children[1].children
        for (let j = 0; j <all_mats_in_gp.length;j++){
            num_item = all_mats_in_gp[j].children[0].children[0].value
            nome_mat = all_mats_in_gp[j].children[1].children[0].innerText
            dict_return[gp].push({'id_mat': all_mats_in_gp[j].title,
                'num_item': num_item,
                'quant_gp': quant_gp, 'nome_mat': nome_mat})
            if (num_item in list_of_itens){
                if(list_of_itens[num_item] !== nome_mat){
                     list_of_errors.push(`ERROR: item ${num_item} associado a materiais diferentes: ${list_of_itens[num_item]}---${nome_mat}`)
                }

            }else{
                list_of_itens[num_item] =  nome_mat
            }

        }
    }
    if(elements_gp.length === 0)
    {
       return [false, ['Não há Grupos']]
    }else if(list_of_errors.length === 0 ){
        return [true, dict_return]
    }else{
        return [false, list_of_errors]
    }

}

function GetAndVerifyDatasMatsTemplates(){
    let datas_mats = GetMatsInTemplates()
    if(datas_mats[0] === false){

        return  datas_mats[1].join(',\n')
    }else{
        datas_mats = datas_mats[1]
    }

    let id_chumb = $('#chumbadores_templates').val()
    let quant_chumbs = document.getElementById('quant_chumbs_templates').value
    let x_footer = document.getElementById('templates_x_footer').value === '' ? 0 : document.getElementById('templates_x_footer').value
    let y_footer = document.getElementById('templates_y_footer').value
    let x_table = document.getElementById('templates_x_table').value
    let y_table = document.getElementById('templates_y_table').value
    let x_logo = document.getElementById('templates_x_logo').value
    let y_logo = document.getElementById('templates_y_logo').value
    let medidas = {'x_footer': x_footer, 'y_footer': y_footer, 'x_table': x_table, 'y_table': y_table, 'x_logo': x_logo,
                   'y_logo': y_logo}
    let fixacao_perfil = document.getElementById('tamplates_radio_perfil').checked
    let vista_planta = document.getElementById('template_vista_em_planta').checked
    let fixacao_perfilado = document.getElementById('tamplates_radio_perfilado').checked
    let lst_names_files_use = GetNamesFilesInCardsTemplates()
    var all_msgs_errors = []
    if(Array.from(Object.keys(datas_mats)).length > 0){
        for(let id_gp in datas_mats){
            let mats_in_gp = datas_mats[id_gp]
            for (let i = 0; i <mats_in_gp.length;i++){
                if(mats_in_gp[i]['quant_gp'] === ''){
                    all_msgs_errors.push(mats_in_gp[i]['nome_mat'] + ': Grupo desse material sem quantidade inserida')
                }
                else{
                    if(mats_in_gp[i]['num_item'] === ''){
                        all_msgs_errors.push(mats_in_gp[i]['nome_mat'] + ': Material sem número de item')
                    }
                }
            }
        }
    }
    else{
        all_msgs_errors.push('Adicione Grupos nesse template')
    }

    if(quant_chumbs === ''){
        all_msgs_errors.push('Quantidade de Chumbador inválida')
    }
    if(!fixacao_perfil && !fixacao_perfilado){
        all_msgs_errors.push('Selecione uma fixação em bandeja')
    }
    if(all_msgs_errors.length === 0){
        return {'medidas': medidas,
                'id_chumb': id_chumb,
                'quant_chumb': quant_chumbs,
                'fix_perfil': fixacao_perfil,
                'datas_mats': datas_mats,
                'lst_names_files': lst_names_files_use,
                'vista_planta': vista_planta}
    }
    else{
        return all_msgs_errors.join(',\n')
    }
}

function GetNamesFilesInCardsTemplates(){
    let cards_files = document.getElementById('cards_file_template').children
    let lst_names = []
    for (let i = 0; i <cards_files.length;i++){
        let name_file = cards_files[i].title
        lst_names.push(name_file)
    }
    return lst_names
}

function ClickForcaMotoresExists(id_tipico, img_jinja) {
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/GtTemplatesForca/" + id_tipico + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            ClearDropzoneTalasChumbs(data['tipo'])
            ShowImgDwgInForca(data['img'], data['tipo'])
            FillDatasFileForcaInDropzone(data['medidas'], data['name_file'], data['tipo'], img_jinja, id_tipico)
        },
        failure: function (error) {
        },
    });
}

function ShowImgDwgInForca(img_base_64, id_tipico){
    let id_element_img
    if(id_tipico === 'MOTOR'){
        id_element_img = 'img_dwg_motor_forca'
    } else if(id_tipico === 'SUPORTE'){
        id_element_img = 'img_dwg_suporte_forca'
    } else if(id_tipico === 'FIXACAO'){
        id_element_img = 'img_dwg_fixacao_forca'
    } else if(id_tipico === 'DERIVACAO'){
        id_element_img = 'img_dwg_derivacao_forca'
    } else if(id_tipico === 'ACESSORIO'){
        id_element_img = 'img_dwg_acessorio_forca'
    } else if(id_tipico === 'FIX LEITO'){
        id_element_img = 'img_dwg_fixleito_forca'
    }
    document.getElementById(id_element_img).src = `data:image/png;base64,${img_base_64}`
}

function ClearDropzoneTipicosForca(tipo){
    let dict_aux = tipo === 'TALAS' ? {'pattern_in_id': 'tala', 'form_files': 'forms_files_talas', 'id_element_files': 'content_files_talas', 'id_element_img': 'img_dwg_tala'} : {'pattern_in_id': 'chumbs', 'form_files': 'forms_files_chumbs', 'id_element_files': 'content_files_chumbs', 'id_element_img': 'img_dwg_chumbs'}
    let key_form_data = ReturnKeyInFormData(talas_chumbs)
    document.getElementById(dict_aux['id_element_img']).src = ''
    FilesTalasChumbs.delete(key_form_data)
    document.getElementById(dict_aux['form_files']).hidden = true
    document.getElementById(dict_aux['id_element_files']).innerHTML = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_footer').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_footer').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_table').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_table').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_x_logo').value = ''
    document.getElementById(dict_aux['pattern_in_id'] + '_y_logo').value = ''
    MarkIdSelectedTalasChumbs(talas_chumbs, '')

}

function FillDatasFileForcaInDropzone(medidas, name_file, tipo_tipico, img_jinja, id_selected){
debugger;
    let dict_aux
    if(tipo_tipico === 'SUPORTE'){
        //document.getElementById('grupos_files_motores_forca').value = medidas['group_talas']
        dict_aux = {'pattern_in_id': 'suporte_forca', 'value_data_name_file': 'name_file_suporte_forca', 'id_element_files': 'content_files_suporte_forca', 'form_files': 'forms_files_suporte_forca'}
    } else if(tipo_tipico === 'MOTOR'){
        dict_aux = {'pattern_in_id': 'motor_forca', 'value_data_name_file': 'name_file_motor_forca', 'id_element_files': 'content_files_motor_forca', 'form_files': 'forms_files_motor_forca'}
    } else if(tipo_tipico === 'FIXACAO'){
        dict_aux = {'pattern_in_id': 'fixacao_forca', 'value_data_name_file': 'name_file_fixacao_forca', 'id_element_files': 'content_files_fixacao_forca', 'form_files': 'forms_files_fixacao_forca'}
    } else if(tipo_tipico === 'DERIVACAO'){
        dict_aux = {'pattern_in_id': 'derivacao_forca', 'value_data_name_file': 'name_file_derivacao_forca', 'id_element_files': 'content_files_derivacao_forca', 'form_files': 'forms_files_derivacao_forca'}
    } else if(tipo_tipico === 'ACESSORIO'){
        dict_aux = {'pattern_in_id': 'acessorio_forca', 'value_data_name_file': 'name_file_acessorio_forca', 'id_element_files': 'content_files_acessorio_forca', 'form_files': 'forms_files_acessorio_forca'}
    } else if(tipo_tipico === 'FIX LEITO'){
        dict_aux = {'pattern_in_id': 'fixleito_forca', 'value_data_name_file': 'name_file_fixleito_forca', 'id_element_files': 'content_files_fixleito_forca', 'form_files': 'forms_files_fixleito_forca'}
    }
    let inner_html_file = `
                        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mx-auto input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown hover_dwgs_gerenciar_tipicos mb-2">
                            <div class="input-group-prepend my-auto px-1">
                                <img class="imgdwg" src="${img_jinja}">
                            </div>
                            <span type="text" title="${name_file}" class="col border-0 input-group-text bg-white text-truncate" data-name-file="${dict_aux['value_data_name_file']}">${name_file}</span>
                            <div class="input-group-append">
                                <button class="btn btn-outline-danger rounded-pill px-2 my-1 mb-2 border-0" type="button">
                                    <i class="fas fa-times-circle fa-lg" onclick=""></i>
                                </button>
                            </div>
                        </div>`
    document.getElementById(dict_aux['pattern_in_id'] + '_x_footer').value = medidas['x_footer']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_footer').value = medidas['y_footer']
    document.getElementById(dict_aux['pattern_in_id'] + '_x_table').value = medidas['x_table']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_table').value = medidas['y_table']
    document.getElementById(dict_aux['pattern_in_id'] + '_x_logo').value = medidas['x_logo']
    document.getElementById(dict_aux['pattern_in_id'] + '_y_logo').value = medidas['y_logo']
    document.getElementById(dict_aux['form_files']).hidden = false
}

function SendFilesDwgForca(talas_chumbs){
    debugger;
    let datas_talas = GetAndVerifDatasFilesForca(talas_chumbs)
    if(typeof datas_talas === "string"){
        return SwitchAlertGt(datas_talas, true)
    }
    FilesTalasChumbs.delete('datas_forms')
    FilesTalasChumbs.append('datas_forms', JSON.stringify(datas_talas))
    $.ajax({
        url: "/app/eletrica/GerenciarTipicos/GtTemplatesForca/", // Caminho do Ajax
        type: "POST", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: FilesTalasChumbs, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            localStorage.setItem("screen_load", ReturnIdContainerForca(talas_chumbs))
            InitProgressGerenciarTipicos(data['task_id'])
        },
        error: function (xhr, status, error) {
        console.error("Error: ", status, error);
        console.error("Response: ", xhr.responseText);
        alert('Algo deu errado! Verifique e tente novamente.');
        }
    })

}

function GetAndVerifDatasFilesForca(tipo_tipico){
    let key_in_form_data = ReturnKeyInFormDataForca(tipo_tipico)
    let word_patterns_in_ids
    let value_data_name_file
    let errors = []
    if(tipo_tipico === 'SUPORTE'){
        word_patterns_in_ids = 'suporte_forca'
        value_data_name_file = 'name_file_suporte_forca'
    } else if(tipo_tipico === 'MOTOR'){
        word_patterns_in_ids = 'motor_forca'
        value_data_name_file = 'name_file_motor_forca'
    } else if(tipo_tipico === 'FIXACAO'){
        word_patterns_in_ids = 'fixacao_forca'
        value_data_name_file = 'name_file_fixacao_forca'
    } else if(tipo_tipico === 'DERIVACAO'){
        word_patterns_in_ids = 'derivacao_forca'
        value_data_name_file = 'name_file_derivacao_forca'
    } else if(tipo_tipico === 'ACESSORIO'){
        word_patterns_in_ids = 'acessorio_forca'
        value_data_name_file = 'name_file_acessorio_forca'
    } else if(tipo_tipico === 'FIX LEITO'){
        word_patterns_in_ids = 'fixleito_forca'
        value_data_name_file = 'name_file_fixleito_forca'
    }

    let x_rodape = document.getElementById(word_patterns_in_ids + '_x_footer').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_footer').value
    let y_rodape = document.getElementById(word_patterns_in_ids + '_y_footer').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_footer').value
    let x_table = document.getElementById(word_patterns_in_ids + '_x_table').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_table').value
    let y_table = document.getElementById(word_patterns_in_ids + '_y_table').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_table').value
    let x_logo = document.getElementById(word_patterns_in_ids + '_x_logo').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_x_logo').value
    let y_logo = document.getElementById(word_patterns_in_ids + '_y_logo').value === '' ? 0 : document.getElementById(word_patterns_in_ids + '_y_logo').value
    let names_files = ReturnListNameFilesInDropZone(value_data_name_file)
    let id_file_selected = GetIdSelectedMotorForca(tipo_tipico)
    pasta_destino = BuscaPastaDestino(tipo_tipico)

        return {
            'names_files': names_files,
            'x_rodape': x_rodape,
            'y_rodape': y_rodape,
            'x_table': x_table,
            'y_table': y_table,
            'x_logo': x_logo,
            'y_logo': y_logo,
            'key_form_data': key_in_form_data,
            'pasta_destino': pasta_destino,
            'id_file_selected': id_file_selected,
            'tipo_tipico': tipo_tipico
        }


}

function BuscaPastaDestino(tipo_tipico) {
debugger;
    if (tipo_tipico === 'SUPORTE'){
        pasta_destino = 'SUPORTES EQUIPAMENTO'
        return pasta_destino
    }
    else if (tipo_tipico === 'MOTOR'){
        pasta_destino = 'MOTORES'
        return pasta_destino
    }
    else if (tipo_tipico === 'FIXACAO'){
        pasta_destino = 'FIXACAO INFRA'
        return pasta_destino
    }
    else if (tipo_tipico === 'FIX LEITO'){
        pasta_destino = 'FIXACAO LEITO'
        return pasta_destino
    } else if (tipo_tipico === 'DERIVACAO'){
        pasta_destino = 'DERIVACOES'
        return pasta_destino
    } else if (tipo_tipico === 'ACESSORIO'){
        pasta_destino = 'ACESSORIO MOTORES'
        return pasta_destino
    }
}

function DropArquivosForcaControle(tipo_tipico, dwg_image, file_drop=null){
    let ids_elements
    if(tipo_tipico === 'SUPORTE'){
        ids_elements = {'input': 'arquivo_dwg_suporte_forca', 'forms_file': 'forms_files_suporte_forca', 'key_form_data': 'FilesSuporteForca', 'content_files': 'content_files_suporte_forca', 'value_data_name_file': 'name_file_suporte_forca'}
    } else if(tipo_tipico === 'MOTOR'){
        ids_elements = {'input': 'arquivo_dwg_motor_forca', 'forms_file': 'forms_files_motor_forca', 'key_form_data': 'FilesMotorForca', 'content_files': 'content_files_motor_forca', 'value_data_name_file': 'name_file_motor_forca'}
    } else if(tipo_tipico === 'FIXACAO'){
        ids_elements = {'input': 'arquivo_dwg_fixacao_forca', 'forms_file': 'forms_files_fixacao_forca', 'key_form_data': 'FilesFixacaoForca', 'content_files': 'content_files_fixacao_forca', 'value_data_name_file': 'name_file_fixacao_forca'}
    } else if(tipo_tipico === 'DERIVACAO'){
        ids_elements = {'input': 'arquivo_dwg_derivacao_forca', 'forms_file': 'forms_files_derivacao_forca', 'key_form_data': 'FilesDerivacaoForca', 'content_files': 'content_files_derivacao_forca', 'value_data_name_file': 'name_file_derivacao_forca'}
    } else if(tipo_tipico === 'ACESSORIO'){
        ids_elements = {'input': 'arquivo_dwg_acessorio_forca', 'forms_file': 'forms_files_acessorio_forca', 'key_form_data': 'FilesAcessorioForca', 'content_files': 'content_files_acessorio_forca', 'value_data_name_file': 'name_file_acessorio_forca'}
    } else if(tipo_tipico === 'FIX LEITO'){
        ids_elements = {'input': 'arquivo_dwg_fixleito_forca', 'forms_file': 'forms_files_fixleito_forca', 'key_form_data': 'FilesFixleitoForca', 'content_files': 'content_files_fixleito_forca', 'value_data_name_file': 'name_file_fixleito_forca'}
    }
    let form_file = document.getElementById(ids_elements['forms_file']);
    let input_file = document.getElementById(ids_elements['input']);
    let element_content_files = document.getElementById(ids_elements['content_files'])
    let content_element_content = ``
    let files = file_drop === null ? input_file.files : file_drop.files
    debugger;
    let id_selected = GetIdSelectedMotorForca(tipo_tipico)
    let error_file;
    let name_file_splited;
    let extension ;
    let list_files_error = []

    for (let i = 0; i <files.length;i++){
        let file = files[i]
        error_file = false
        name_file_splited = file.name.split('.')
        extension = name_file_splited[name_file_splited.length - 1]
        extension = extension.toUpperCase()
        if(extension !== 'DWG'){
            error_file = true
        }
        if(id_selected === null){

        }
        if(!error_file) {
            let str_file_html = `
                                <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 mx-auto input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown hover_dwgs_gerenciar_tipicos mb-2">
                                    <div class="input-group-prepend my-auto px-1">
                                        <img class="imgdwg" src="${dwg_image}">
                                    </div>
                                    <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate" data-name-file="${ids_elements['value_data_name_file']}">${file.name}</span>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger rounded-pill px-2 my-1 mb-2 border-0" type="button">
                                            <i class="fas fa-times-circle fa-lg" onclick="DeleteFileInLstFilesTalasChumbs(this)"></i>
                                        </button>
                                    </div>
                                </div>`
            if(id_selected === null){
                content_element_content += str_file_html
                FilesTalasChumbs.append(ids_elements['key_form_data'], file)
                form_file.hidden = false
            }
            else{
                if(i === files.length - 1){
                    content_element_content += str_file_html
                    FilesTalasChumbs.append(ids_elements['key_form_data'], file)
                }
            }

        }
        else{
            if(id_selected === null){
                list_files_error.push(file.name)
            }
            else{
                if(i === files.length - 1){
                    list_files_error.push(file.name)
                }
            }

        }
    }
    if(list_files_error.length > 0){
        return SwitchAlertCT('Arquivo(s) inválido(s): ' + list_files_error.join(', '), true)
    }
    else{
        element_content_files.innerHTML = content_element_content
    }
}

function GetIdSelectedMotorForca(tipo_tipico){
    let id_input
    if(tipo_tipico === 'SUPORTE'){
        id_input = 'suporte_forca_exists_selected'
    } else if(tipo_tipico === 'MOTOR'){
        id_input = 'motor_forca_exists_selected'
    } else if(tipo_tipico === 'DERIVACAO'){
        id_input = 'derivacao_forca_exists_selected'
    } else if(tipo_tipico === 'ACESSORIO'){
        id_input = 'acessorio_forca_exists_selected'
    } else if(tipo_tipico === 'FIXACAO'){
        id_input = 'fixacao_forca_exists_selected'
    } else if(tipo_tipico === 'FIX LEITO'){
        id_input = 'fixleito_forca_exists_selected'
    }
    return document.getElementById(id_input).value === '' ? null : document.getElementById(id_input).value
}

function ReturnKeyInFormDataForca(tipo_tipico){
    if(tipo_tipico === 'SUPORTE'){
        return 'FilesSuporteForca'
    } else if(tipo_tipico === 'MOTOR'){
        return 'FilesMotorForca'
    } else if(tipo_tipico === 'FIXACAO'){
        return 'FilesFixacaoForca'
    } else if(tipo_tipico === 'DERIVACAO'){
        return 'FilesDerivacaoForca'
    } else if(tipo_tipico === 'ACESSORIO'){
        return 'FilesAcessorioForca'
    } else if(tipo_tipico === 'FIX LEITO'){
        return 'FilesFixleitoForca'
    }
}

function ReturnIdContainerForca(tipo_tipico){
    if(tipo_tipico === 'MOTOR'){
        return 'content_alimentacao_equips'
    } else if(tipo_tipico === 'SUPORTE'){
        return 'content_suporte_forca'
    } else if(tipo_tipico === 'FIXACAO'){
        return 'content_fixacao_forca'
    } else if(tipo_tipico === 'DERIVACAO'){
        return 'content_derivacao_forca'
    } else if(tipo_tipico === 'ACESSORIO'){
        return 'content_acessorio_forca'
    }
}

function DeleteFileTipicoForcaExists(id){
    $.ajax({
        type: "DELETE",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicos/GtTemplatesForca/" + id + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            SwitchAlertGt(data['return'])
            localStorage.setItem("screen_load", ReturnIdContainerForca(data['tipo']))
            document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = FecharModalReturnDeleteTemplate
        },
        failure: function (error) {
        },
    });
}
var FilesInsercaoBlocos = new FormData()
async function DeletaTipicoForca(id, nome_tipico) {
  const resposta = await AlertaConfirmacao(`Deseja deletar o detalhe típico ${nome_tipico}?`);
  if (resposta) {
    DeleteFileTipicoForcaExists(id);
  }
}

function AlertaConfirmacao(text_swal) {
  return swal({
    icon: 'warning',
    buttons: {
      confirm: {
        text: "Sim",
        value: true,
        className: "swal-button swal-button--confirm bg-danger"
      },
      cancel: "Não",
    },
    content: {
      element: "span",
      attributes: {
        innerHTML: text_swal,
      },
    },
  }).then((value) => value);
}

function ShowImgBloco(tipo_bloco) {
    if (document.getElementById(`status_${tipo_bloco}`).innerText === 'Não cadastrado') {
    document.getElementById("box_dimencao_bloco").setAttribute("hidden", true);
    document.getElementById("box_posicao_bloco").setAttribute("hidden", true);
    document.getElementById('img_dwg_template_bloco').src = ''; // Se você quiser limpar a imagem
    return;
    }
    $.ajax({
        type: "GET",
        url: "/app/eletrica/GerenciarTipicos/TemplatesBlocos/",
        dataType: 'json',
        data: {'TIPO BLOCO': tipo_bloco},
        success: function (data) {
            document.getElementById('img_dwg_template_bloco').src = `data:image/png;base64,${data['img']}`
            document.getElementById("box_dimencao_bloco").removeAttribute("hidden");
            document.getElementById('comprimento_bloco').value = data['medidas']['comprimento']
            document.getElementById('altura_bloco').value = data['medidas']['altura']
            document.getElementById("box_posicao_bloco").removeAttribute("hidden");
            document.getElementById('insercao_x_bloco').value = data['medidas']['insercao_x']
            document.getElementById('insercao_y_bloco').value = data['medidas']['insercao_y']
        },
        failure: function (error) {
        },
    });
}


function StatusBlocos() {
    $.ajax({
        type: "GET",
        url: "/app/eletrica/GerenciarTipicos/StatusBlocos/",
        dataType: 'json',
        success: function (data) {
            for(let cadastrado of data['LISTA CADASTRADOS']) {
                document.getElementById(`status_${cadastrado}`).innerText = 'Cadastrado';
                document.getElementById(`status_${cadastrado}`).classList.remove("ms-auto", "text-danger");
                document.getElementById(`status_${cadastrado}`).classList.add("ms-auto", "text-success");
            }
        },
    });
}

function DropArquivosBlocos(dwg_image, file_drop=null){

    debugger;
    id_selected = 'teste'
    let ids_elements
        ids_elements = {'input': 'arquivo_dwg_insercao_blocos', 'forms_file': 'forms_files_insercao_blocos', 'key_form_data': 'FilesInsercaoBlocos', 'content_files': 'content_files_insercao_blocos', 'value_data_name_file': 'name_file_insercao_blocos'}


    let input_file = document.getElementById('arquivo_dwg_insercao_blocos');
    let element_content_files = document.getElementById('content_files_insercao_blocos')
    let content_element_content = ``
    let files = file_drop === null ? input_file.files : file_drop.files
    //let id_selected = GetIdSelectedMotorForca(tipo_tipico)
    let error_file;
    let name_file_splited;
    let extension ;
    let list_files_error = []

    for (let i = 0; i <files.length;i++){
        let file = files[i]
        error_file = false
        name_file_splited = file.name.split('.')
        extension = name_file_splited[name_file_splited.length - 1]
        extension = extension.toUpperCase()
        if(extension !== 'DWG'){
            error_file = true
        }

        if(!error_file) {
            let str_file_html = `
                                <div class="col-xs-7 col-sm-7 col-md-7 col-lg-7 mx-auto input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown hover_dwgs_gerenciar_tipicos mb-2">
                                    <div class="input-group-prepend my-auto px-1">
                                        <img class="imgdwg" src="${dwg_image}">
                                    </div>
                                    <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate" data-name-file="${ids_elements['value_data_name_file']}">${file.name}</span>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger rounded-pill px-2 my-1 mb-2 border-0" type="button">
                                            <i class="fas fa-times-circle fa-lg" onclick="DeleteFileInLstFilesTalasChumbs(this)"></i>
                                        </button>
                                    </div>
                                </div>`
            if(id_selected != null){
                content_element_content = str_file_html
                debugger;
                FilesInsercaoBlocos.append(ids_elements['key_form_data'], file)
                //form_file.hidden = false
            }


        }
        else{
            if(id_selected === null){
                list_files_error.push(file.name)
            }
            else{
                if(i === files.length - 1){
                    list_files_error.push(file.name)
                }
            }

        }
    }
    if(list_files_error.length > 0){
        return SwitchAlertCT('Arquivo(s) inválido(s): ' + list_files_error.join(', '), true)
    }
    else{
        element_content_files.innerHTML = content_element_content
        document.getElementById('box_dimencao_bloco').hidden = false
        document.getElementById('box_posicao_bloco').hidden = false
    }
}

function selecionarItem(elemento) {
    // Remove o estilo de seleção de todos os itens

    document.querySelectorAll(".item-backgroud-soft-blue").forEach(item => {
        item.classList.remove('item-backgroud-soft-blue')
        item.classList.add('bg-white');
        item.classList.remove('border-primary')
    });
    elemento.classList.add('border-primary')
    elemento.classList.remove('bg-white')
    elemento.classList.add('item-backgroud-soft-blue')
    // Aplica o estilo de seleção ao elemento clicado

    document.getElementById('img_dwg_template_bloco').src = '';
    document.getElementById('content_files_insercao_blocos').innerHTML = ''
    document.getElementById('box_dimencao_bloco').hidden = false
    document.getElementById('box_posicao_bloco').hidden = false
}

function SalvarTemplateBloco() {
    const cardSelecionado = document.querySelectorAll(".item-backgroud-soft-blue")[0];
    // Verifica se algum card foi selecionado
    if (!cardSelecionado) {
        return SwitchAlertGt('Selecione qual bloco deseja cadastrar!', true)
    }

    // Seleciona o span com id que começa com 'nome_' e obtém a chave do id
    const spanId = cardSelecionado.querySelector("span[id^='nome_']").id;
    const chaveId = spanId.replace('nome_', '');
     console.log(chaveId)// Remove o prefixo 'nome_' para obter apenas a chave

    // Verifica se os cards estão aparecendo
    const boxDimensao = document.getElementById("box_dimencao_bloco");
    const boxPosicao = document.getElementById("box_posicao_bloco");

    if (boxDimensao.hidden && boxPosicao.hidden === true) {
        return SwitchAlertGt('Selecione qual bloco deseja cadastrar!', true)
    }

     comprimento_bloco = document.getElementById('comprimento_bloco').value
     altura_bloco = document.getElementById('altura_bloco').value
     insercao_x_bloco = document.getElementById('insercao_x_bloco').value
     insercao_y_bloco = document.getElementById('insercao_y_bloco').value
     let names_files = ReturnListNameFilesInDropZone('name_file_insercao_blocos')
     var infos_save = {'chaveId': chaveId, 'names_files': names_files, 'comprimento_bloco': comprimento_bloco, 'altura_bloco': altura_bloco, 'insercao_x_bloco': insercao_x_bloco, 'insercao_y_bloco': insercao_y_bloco, 'key_form_data': 'FilesInsercaoBlocos'}
     if (infos_save['names_files'].length === 0) {
        return SwitchAlertCT('Selecione o arquivo antes de continuar!', true)
    }
     FilesInsercaoBlocos.delete('datas_forms')
     FilesInsercaoBlocos.append('datas_forms', JSON.stringify(infos_save))
     $.ajax({
        url: "/app/eletrica/GerenciarTipicos/TemplatesBlocos/", // Caminho do Ajax
        type: "POST", // http method
        headers:{'X-CSRFToken': csrftoken},
        dataType: "json",
        data: FilesInsercaoBlocos, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            localStorage.setItem("screen_load", 'content_insercao')

            InitProgressGerenciarTipicos(data['task_id'])
            StatusBlocos()
        },
        error: function (xhr, status, error) {
        console.error("Error: ", status, error);
        console.error("Response: ", xhr.responseText);
        return SwitchAlertGt('Algo deu errado! Verifique e tente novamente.', true)
        }
    })
}

document.addEventListener("DOMContentLoaded", function() {
    StatusBlocos()
});

NavMenuTipicos(localStorage.getItem("screen_load") !== null?localStorage.getItem("screen_load"):'content_insert_blocks')
