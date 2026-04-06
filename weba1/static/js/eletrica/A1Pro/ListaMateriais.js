const csrftokenlst_mat = document.getElementsByName('csrfmiddlewaretoken')[0].value

function ClickBtnAdcMatAdc(id_content){
    let content = document.getElementById(id_content)
    if(!content.hidden){
        content.hidden = true
    }
    else{
        content.hidden = false
    }
}


function AddFilterTalasLstMat(){
    let filter = document.getElementById('lst_mat_adc_filter').value
    if(filter.length > 0){
        if(!VerifyIfFilterTalaExists(filter)){
            let str_html_new_filter = `<div class="row">
                                            <div class="col-2">
                                                <i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DelFilterTalasLstMat(this)"></i>
                                            </div>
                                            <div class="col-10">
                                                ${filter}
                                            </div>
                                       </div>`
            document.getElementById('lst_mat_all_filters_adc').innerHTML += str_html_new_filter
        }

    }
}

function DelFilterTalasLstMat(btn_del){
    btn_del.parentElement.parentElement.remove()
}

function GetArrayWithAllFiltersTala(){
    let all_filters = document.getElementById('lst_mat_all_filters_adc')
    return Array.from($.map(all_filters.children, function(element) {return element.children[1].innerText}));
}

function VerifyIfFilterTalaExists(filter){
    let all_filters = GetArrayWithAllFiltersTala()
    let filter_exists = false
    if(all_filters.includes(filter)){
        filter_exists = true
    }
    return filter_exists
}

function AddMatAdcTalaListMat(id_code, id_num, id_content){
    let cod = document.getElementById(id_code).value
    let quant = document.getElementById(id_num).value
    if(cod.length > 0 && quant !== ''){
        if(!VerifyIfMatAdcLstMatExists(cod, id_content)){
            let str_html_new_mat = `<div class="row">
                                      <div class="col-9 pr-0 border-right text-center">
                                          <div class="row">
                                              <div class="col-2">
                                                  <i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DelMatAdcTalaListMat(this)"></i>
                                              </div>
                                              <div class="col-10 d-flex justify-content-start">
                                                  ${cod}
                                              </div>
                                          </div>
            
                                      </div>
            
                                      <div class="col-3 text-center">
                                          ${quant}
                                      </div>
                                  </div>`
            document.getElementById(id_content).innerHTML += str_html_new_mat
        }
    }
}

function DelMatAdcTalaListMat(btn_del){
    btn_del.parentElement.parentElement.parentElement.parentElement.remove()
}

function VerifyIfMatAdcLstMatExists(code, id_content){
    let all_mats = ReturnMatsAdcLstMat(id_content)
    var mat_exists = false
    for (let i = 0; i <all_mats.length;i++){
        if(all_mats[i]['CODE'] === code){
            mat_exists = true
            break
        }
    }
    return mat_exists
}

function ReturnMatsAdcLstMat(id_content){
    let content = document.getElementById(id_content)
    return Array.from($.map(content.children, function(element) {return {'CODE': element.children[0].children[0].children[1].innerText,
        'QUANT': element.children[1].innerText}}))
}

function ClearDropsZones(container){
    let dropzone_childrens = container.children
    for(let i = 0; i <dropzone_childrens.length;i++){
        if(dropzone_childrens[i].id === ""){
            dropzone_childrens[i].remove()
        }
    }
}

function SwitchAlertLstMat(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}

async function ShowModalTalasLstMat(tipo_tala, band_eletro){
    document.getElementById('lst_mat_band_ele_checkbox').value = band_eletro
    if(ReturnTipoMatSelectedLstMat() !== '0'){
        ClearModalTalasLstMat()
        await GetDatasInTala(tipo_tala, band_eletro)
        document.getElementById('tala_selected').innerHTML = tipo_tala
        $('#modal_filter_code_lst_mat').modal('show')
    }
    else{
        SwitchAlertLstMat('Selecione um tipo de material!!', true)
    }

}

async function ShowModalTiposMateriais(){
    await FillTiposMat()
    $('#modal_tipo_material').modal('show')
}

async function ShowModalTiposTampas(){
    await FillTiposTamp()
    $('#modal_tipo_tampa').modal('show')
}

async function SendDatasTiposMatLstMat(){
    let datas_tipo_mat = GetAndVerifyDatasTiposMatLstMat()
    if(typeof datas_tipo_mat === "string"){
        return SwitchAlertLstMat(datas_tipo_mat, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTiposMat/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify(datas_tipo_mat)},
        success: function (data) {
            SwitchAlertLstMat(data['return'])
            FillTiposMat()
        },
        failure: function (error) {
        },
    });
}

async function SendDatasTiposTampLstTamp(){
    let datas_tipo_mat = GetAndVerifyDatasTiposTampLstTamp()
    if(typeof datas_tipo_mat === "string"){
        return SwitchAlertLstMat(datas_tipo_mat, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTiposTamp/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify(datas_tipo_mat)},
        success: function (data) {
            SwitchAlertLstMat(data['return'])
            FillTiposTamp()
        },
        failure: function (error) {
        },
    });
}

function ClickTipoMatLstMatExists(id_tipo_mat){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatDatasTipoMat/" + id_tipo_mat + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillFormsTipoMatLstMat(data['return'])
        },
        failure: function (error) {
        },
    });
}

function ClickTipoMatLstTampExists(id_tipo_tamp){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatDatasTipoTamp/" + id_tipo_tamp + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillFormsTipoMatLstTamp(data['return'])
        },
        failure: function (error) {
        },
    });
}


function FillFormsTipoMatLstMat(dict_datas){
    document.getElementById('nome_tipo_material').value = dict_datas['nome']
    document.getElementById('desc_tipo_material').value = dict_datas['desc']
}

function FillFormsTipoMatLstTamp(dict_datas){
    document.getElementById('nome_tipo_tampa').value = dict_datas['nome']
    document.getElementById('desc_tipo_tampa').value = dict_datas['desc']
}

function GetAndVerifyDatasTiposMatLstMat(){
    let nome = document.getElementById('nome_tipo_material').value
    let desc = document.getElementById('desc_tipo_material').value
    let tipo_selected = $('#all_tipo_materiais').val()[0] !== undefined ? $('#all_tipo_materiais').val()[0] : null
    let errors = []

    if(nome.length === 0){
        errors.push('Nome')
    }
    else{
        if(VerifyTipoMatExists(nome)){
            errors.push('Nome')
        }
    }

    if(desc.length === 0){
        errors.push('Descrição')
    }

    if(errors.length === 0){
        return {
            'nome': nome,
            'desc': desc,
            'tipo_selected': tipo_selected
        }
    }
    else{
        return 'Campos inválidos: ' + errors.join(' e ')
    }
}

function GetAndVerifyDatasTiposTampLstTamp(){
    let nome = document.getElementById('nome_tipo_tampa').value
    let desc = document.getElementById('desc_tipo_tampa').value
    let tipo_selected = $('#all_tipo_tampas').val()[0] !== undefined ? $('#all_tipo_tampas').val()[0] : null
    let errors = []

    if(nome.length === 0){
        errors.push('Nome')
    }
    else{
        if(VerifyTipoMatExists(nome)){
            errors.push('Nome')
        }
    }

    if(desc.length === 0){
        errors.push('Descrição')
    }

    if(errors.length === 0){
        return {
            'nome': nome,
            'desc': desc,
            'tipo_selected': tipo_selected
        }
    }
    else{
        return 'Campos inválidos: ' + errors.join(' e ')
    }
}

function VerifyTipoMatExists(tipo_mat){
    let options_select = document.getElementById('all_tipo_materiais').options
    var exists = false
    for (let i = 0; i <options_select.length;i++){
        if(options_select[i].innerText === tipo_mat){
            exists = true
            break
        }
    }
    return exists
}

async function FillTiposMat(){
    let datas_tipos_mat = await RequestTiposMat()
    var str_select_html = ``
    for (let i = 0; i <datas_tipos_mat.length;i++){
        str_select_html += `<option value="${datas_tipos_mat[i]['id']}" onclick="ClickTipoMatLstMatExists(this.value)">${datas_tipos_mat[i]['nome']}</option>`
    }
    document.getElementById('all_tipo_materiais').innerHTML = str_select_html
}

async function FillTiposTamp(){
    let datas_tipos_mat = await RequestTiposTamp()
    var str_select_html = ``
    for (let i = 0; i <datas_tipos_mat.length;i++){
        str_select_html += `<option value="${datas_tipos_mat[i]['id']}" onclick="ClickTipoMatLstTampExists(this.value)">${datas_tipos_mat[i]['nome']}</option>`
    }
    document.getElementById('all_tipo_tampas').innerHTML = str_select_html
}

function FilterOptionsTipoMatInSelect(inner_html){
    let options_select = document.getElementById('all_tipo_materiais').options
    for (let i = 0; i <options_select.length;i++){
        let hidden = options_select[i].innerText.includes(inner_html) ? false : true
        options_select[i].hidden = hidden
    }
}

function FilterOptionsTipoTampInSelect(inner_html){
    let options_select = document.getElementById('all_tipo_tampas').options
    for (let i = 0; i <options_select.length;i++){
        let hidden = options_select[i].innerText.includes(inner_html) ? false : true
        options_select[i].hidden = hidden
    }
}

function ClearFormsTipoMatLstMat(){
    FillFormsTipoMatLstMat({'nome': '', 'desc': ''})
    $('#all_tipo_materiais').val(0)
}

function ClearFormsTipoTampLstTamp(){
    FillFormsTipoMatLstTamp({'nome': '', 'desc': ''})
    $('#all_tipo_tampas').val(0)
}
async function RequestTiposMat(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTiposMat/",
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

async function RequestTiposTamp(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTiposTamp/",
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

async function DeleteTipoMatLstMat(){
    let tipo_mat_selected = $('#all_tipo_materiais').val()[0]
    if(tipo_mat_selected === undefined){
        return SwitchAlertLstMat('Selecione um Tipo de Material para remover!!', true)
    }
    else{
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftokenlst_mat},
            url: "LstMatTiposMat/" + tipo_mat_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertLstMat(data['return'])
                FillTiposMat()
            },
            failure: function (error) {
            },
        });
    }
}

async function DeleteTipoTampLstTamp(){
    let tipo_mat_selected = $('#all_tipo_tampas').val()[0]
    if(tipo_mat_selected === undefined){
        return SwitchAlertLstMat('Selecione um Tipo de Tampa para remover!!', true)
    }
    else{
        await $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftokenlst_mat},
            url: "LstMatTiposTamp/" + tipo_mat_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertLstMat(data['return'])
                FillTiposTamp()
            },
            failure: function (error) {
            },
        });
    }
}

async function GetDatasInTala(tipo_tala, band_eletro){
    let datas_tala = await RequestDatasInTala(tipo_tala, band_eletro)
    let datas_filtros = datas_tala['filtros']
    let datas_mats_adc = datas_tala['mats_adc']
    let input_add_filter = document.getElementById('lst_mat_adc_filter')
    let input_code_add_mat_adc = document.getElementById('lst_mat_code_new_mat_adc')
    let input_quant_add_mat_adc = document.getElementById('lst_mat_quant_new_mat_adc')
    for (let i = 0; i <datas_filtros.length;i++){
        input_add_filter.value = datas_filtros[i]
        AddFilterTalasLstMat()
        input_add_filter.value = ''
    }
    for (let i = 0; i <datas_mats_adc.length;i++){
        input_code_add_mat_adc.value = datas_mats_adc[i]['code']
        input_quant_add_mat_adc.value = datas_mats_adc[i]['quant']
        AddMatAdcTalaListMat('lst_mat_code_new_mat_adc', 'lst_mat_quant_new_mat_adc', 'lst_mat_content_all_mats_adc')
        input_code_add_mat_adc.value = ''
        input_quant_add_mat_adc.value = ''
    }

}

async function RequestDatasInTala(tipo_tala, band_eletro){
    var datas_return
    let band_ele = band_eletro
    let tipo_mat = ReturnTipoMatSelectedLstMat()
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "DatasInTalaLstMat/" + tipo_tala + "/",
        dataType: 'json',
        data: {'band_ele': band_ele, 'tipo_mat': tipo_mat},
        success: function (data) {
            datas_return = data['datas_in_tala']
        },
        failure: function (error) {
        },
    });
    return datas_return
}


function SendDatasTalaLstMat(){
    let tala = document.getElementById('tala_selected').innerHTML
    let filtros = GetArrayWithAllFiltersTala()
    let mats_adc = ReturnMatsAdcLstMat('lst_mat_content_all_mats_adc')
    let band_ele = ReturnValueSelectedCheckboxBandEle()
    let tipo_mat = ReturnTipoMatSelectedLstMat()
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "DatasInTalaLstMat/" + tala + "/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'filtros': filtros,
                'mats_adc': mats_adc,
                'band_ele': band_ele,
                'tipo_mat': tipo_mat
            })},
        success: function (data) {
            SwitchAlertLstMat(data['return'])
        },
        failure: function (error) {
        },
    });
}

function ClearModalTalasLstMat(){
    document.getElementById('lst_mat_content_all_mats_adc').innerHTML = ''
    document.getElementById('lst_mat_all_filters_adc').innerHTML = ''
}


function DeleFileXlsxLstMat(btn_del, idOrFilename=null){
    try{
        // elemento pai do botão -> card
        let card = null
        if(btn_del && btn_del.parentElement) card = btn_del.parentElement.parentElement
        // se não encontrou card a partir do botão, tenta localizar por id
        if(!card && typeof idOrFilename === 'string') card = document.getElementById(idOrFilename)
        if(!card) return
        // animação (se quiser manter animation classes)
        if(card && card.classList){
            card.classList.remove('animate__zoomInDown')
            card.classList.add('animate__hinge')
        }
        setTimeout(()=>{
            if(card && card.parentElement) card.remove()
            // se id/string fornecido, tenta remover do registry por id; caso não exista, faz fallback por filename
            if(idOrFilename){
                try{
                    if(window._fileRegistry && window._fileRegistry.has(idOrFilename)){
                        window._fileRegistryRemove(idOrFilename)
                    } else {
                        const newForm = new FormData()
                        for(const pair of formFileLstMat.entries()){
                            const val = pair[1]
                            if(val && val.name && val.name === idOrFilename) continue
                            newForm.append(pair[0], val)
                        }
                        formFileLstMat = newForm
                    }
                }catch(e){ console.error(e) }
            }
            // ajusta container visual se necessário
            const container = document.getElementById('dropzone_xlsx_lst_mat') || document.getElementById('dropzone_dwg_lst_mat')
            if(container){
                if(container.children.length === 0){ container.style.maxHeight = ''; container.style.overflow = '' }
            }
        },250)
    }catch(e){
        console.error(e)
    }
}

function SendFileXlsxLstMat(){
    let lst_files_tampa = []
    let lst_files_sem_tampa = []
    let let_files_perfis = []
    let let_dwgs = []
    let num_doc = document.getElementById('num_doc_id').innerHTML
    let items_dropzone_sem_tampa = document.getElementById('dropzone_xlsx_lst_mat').children
    let items_dropzone_com_tampa = document.getElementById('dropzone_xlsx_tampa_lst_mat').children

    let items_dropzone_perfis = document.getElementById('dropzone_xlsx_perfis_lst_mat').children
    let items_dropzone_dwg = document.getElementById('dropzone_dwg_lst_mat').children

    let checkbox_num_client = document.getElementById('num_client_lst_mat').checked
    let checkbox_cod = document.getElementById('cod_forn_lst_mat').checked
    let check_box_checked = false
    let len_bandeja_eletro = 0
    let index = 0

    let id_tipo_tampa_eletrocalha = document.getElementById("tipo_material_tampa_eletrocalha").selectedOptions[0].value
    let id_tipo_tampa_bandeja = document.getElementById("tipo_material_tampa_bandeja").selectedOptions[0].value

    let filtro_trecho_6m = document.getElementById("filtro_trecho_6m").value
    for (let i = 0; i <items_dropzone_sem_tampa.length;i++){
        if(items_dropzone_sem_tampa[i].id === ''){

            check_box_checked = items_dropzone_sem_tampa[i].querySelector('input').checked
            console.log(check_box_checked)
            if(check_box_checked === true)
                len_bandeja_eletro = 6;
            else
                len_bandeja_eletro = 3;
            index =i+1
            lst_files_sem_tampa[index] = {'name_file': items_dropzone_sem_tampa[i].title, 'len': len_bandeja_eletro}
        }
    }

    for (let i = 0; i <items_dropzone_com_tampa.length;i++) {
        if (items_dropzone_com_tampa[i].id === '') {
            check_box_checked = items_dropzone_com_tampa[i].querySelector('input').checked
            if (check_box_checked === true)
                len_bandeja_eletro = 6;
            else
                len_bandeja_eletro = 3;
            index =i+1
            lst_files_tampa[index] = {'name_file': items_dropzone_com_tampa[i].title, 'len': len_bandeja_eletro}
        }
    }
    if(lst_files_tampa.length > 0  && (id_tipo_tampa_eletrocalha === '0' || id_tipo_tampa_bandeja === '0')){
        return SwitchAlertLstMat('É Necessário selecionar um tipo de tampa antes de enviar!!', true)
    }
    for (let i = 0; i <items_dropzone_perfis.length;i++){
        if(items_dropzone_perfis[i].id === ''){
            let_files_perfis.push(items_dropzone_perfis[i].title)
        }
    }


    for (let i = 0; i <items_dropzone_dwg.length;i++){
        if(items_dropzone_dwg[i].id === ''){
            let_dwgs.push(items_dropzone_dwg[i].title)
        }
    }

    if(lst_files_sem_tampa.length === 0 && lst_files_tampa.length === 0 && let_files_perfis.length === 0 && let_dwgs.length === 0){
        return SwitchAlertLstMat('Favor envie algum arquivo!!', true)
    }else{
        formFileLstMat.append('lst_files_tampa', JSON.stringify(lst_files_tampa))
        formFileLstMat.append('lst_files_sem_tampa', JSON.stringify(lst_files_sem_tampa))
        formFileLstMat.append('let_files_perfis', JSON.stringify(let_files_perfis))
        formFileLstMat.append('let_dwgs', JSON.stringify(let_dwgs))
        formFileLstMat.append('num_cliente', checkbox_num_client)
        formFileLstMat.append('cod_forn', checkbox_cod)
        formFileLstMat.append('id_tipo_tampa_eletrocalha', id_tipo_tampa_eletrocalha)
        formFileLstMat.append('id_tipo_tampa_bandeja', id_tipo_tampa_bandeja)
        formFileLstMat.append('filtro_trecho_6m', filtro_trecho_6m)
        formFileLstMat.append('num_doc', num_doc)
        $.ajax({
            url: "ImportXlsxLstMat/", // Caminho do Ajax
            type: "POST", // http method
            enctype: 'multipart/form-data',
            headers:{'X-CSRFToken':csrftokenlst_mat},
            dataType: "json",
            data: formFileLstMat, // Envia form pela solicitação do POST
            processData: false,
            contentType: false,
            success: function (data) {
                $('#modal_load_celery').modal('show')
                InitProgressLstMat(data['task_id'])
            },
            failure: function () {

            }
        })
    }
}

function InitProgressLstMat(task_id){
    var progressUrl = `/celery-progress/${task_id}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
          onSuccess: customSucess,
          onError: customError,
          onProgress: customProgress,
        })

        function customSucess(progressBarElement, progressBarMessageElement, result){
            progressBarElement.style.backgroundColor = '#76ce60';
            progressBarMessageElement.innerHTML = 'Sucesso!!'
            $('#modal_load_celery').modal('hide')
            window.open('/app/eletrica/a1pro/GerarTipicosDoc/DownloadFilesDwg/' + task_id + '/', '_self')

        }

        function customError(progressBarElement, progressBarMessageElement, excMessage){
            progressBarElement.style.backgroundColor = '#dc4f63';
            progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
            + progressUrl;
            $('#modal_load_celery').modal('hide')
        }

        function customProgress(progressBarElement, progressBarMessageElement, progress){
            progressBarElement.style.backgroundColor = '#68a9ef';
            progressBarElement.style.width = progress.percent + "%";
            var description = progress.description || "";
            progressBarMessageElement.innerHTML = description
        }
}

function GetDatasFilterGerenciarMatTalaSimples(){
    let filter = document.getElementById('tala_simples_adc_filter').value
    let quant_talas = document.getElementById('tala_simples_adc_quant').value
    var errors = []
    if(filter.length === 0){
        errors.push('Filtro')
    }
    if(quant_talas === ''){
        errors.push('Quantidade Talas')
    }
    if(errors.length === 0){
        return {
            'filter': filter,
            'quant': quant_talas
        }
    }
    else{
        return "Campos inválidos: " + errors.join(' e ')
    }
}

function ClickBtnShowContentAdcMatInFilter(btn_show){
    let element_row = btn_show.parentElement.parentElement.nextElementSibling
    element_row.hidden = !element_row.hidden
}

function AddMaterialInFilter(btn_adc){
    let mat = btn_adc.parentElement.previousElementSibling.children[0].children[1].children[0].value
    let content_new_mats = btn_adc.parentElement.parentElement.parentElement.nextElementSibling
    if(mat.length > 0){
        let str_html_material = `
                              <div class="row d-flex justify-content-end mt-1">
                                  <div class="col-9 radius_10 bg-secondary text-center text-white">
                                      <div class="row">
                                          <div class="col-2">
                                              <i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DeleteMaterialInFilter(this)"></i>
                                          </div>

                                          <div class="col-10">
                                              ${mat}
                                          </div>
                                      </div>

                                  </div>
                              </div>`
        content_new_mats.innerHTML += str_html_material
    }
}

function DeleteMaterialInFilter(btn_del){
    btn_del.parentElement.parentElement.parentElement.parentElement.remove()
}
function AdcFilterGerenciarMatTalaSimples(){
    let datas_filter = GetDatasFilterGerenciarMatTalaSimples()
    if(typeof datas_filter === "string"){
        return SwitchAlertLstMat(datas_filter, true)
    }
    if(!VerifyFiltroGerenciarMat(datas_filter['filter'])){
        let str_filter_html = `<div class="container-fluid p-0 mt-2">
                                  <div class="container radius_10 bg-warning">
                                      <div class="row">
                                           <div class="col-8 pr-0 border-right text-center">
                                              <div class="row">
                                                  <div class="col-2">
                                                      <i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DeleteFiltroGerenciarMat(this)"></i>
                                                  </div>
                                                  <div class="col-10 d-flex justify-content-start">
                                                      ${datas_filter['filter']}
                                                  </div>
                                              </div>
                                           </div>
        
                                           <div class="col-2 text-center">
                                              ${datas_filter['quant']}
                                           </div>
        
                                          <div class="col-1">
                                              <i class="fa-solid fa-sort hover_btn_mais_lst_mat_mats_adc" onclick="ClickBtnShowContentAdcMatInFilter(this)"></i>
                                          </div>
                                      </div>
        
                                      <div class="row my-2" hidden>
                                          <div class="col-9 pr-0 text-center">
                                              <div class="row mb-2">
                                                  <div class="col-5 d-flex align-items-center">
                                                      Material:
                                                  </div>
                                                  <div class="col-7 d-flex justify-content-start">
                                                      <input class="form-control form-control-sm" type="text">
                                                  </div>
                                              </div>
                                          </div>
        
                                           <div class="col-3 text-center">
                                              <button type="button" class="btn btn-sm btn-secondary" onclick="AddMaterialInFilter(this)"><i class="fa-solid fa-plus"></i></button>
                                           </div>
        
                                      </div>
                                  </div>
        
        
                                  <div class="container-fluid mt-2">
        
                                  </div>
                              </div>`
        document.getElementById('tala_simples_all_filters_adc').innerHTML += str_filter_html
    }

}

function DeleteFiltroGerenciarMat(btn_del){
    btn_del.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.remove()
}

function VerifyFiltroGerenciarMat(filtro){
    let filter_exists = false
    let all_filters = document.getElementById('tala_simples_all_filters_adc').children
    for (let i = 0; i <all_filters.length;i++){
        let filter_in_element = all_filters[i].children[0].children[0].children[0].children[0].children[1].innerText
        if(filtro === filter_in_element){
            filter_exists = true
            break
        }
    }
    return filter_exists
}

function ReturnFiltersAndChildresGerenciarMat(){
    var lst_datas_return = []
    let all_filters = document.getElementById('tala_simples_all_filters_adc').children
    for (let i = 0; i <all_filters.length;i++){
        let filter_in_element = all_filters[i].children[0].children[0].children[0].children[0].children[1].innerText
        let quant = all_filters[i].children[0].children[0].children[1].innerText
        let content_filhos = all_filters[i].children[1].children
        var filhos = []
        for (let i = 0; i <content_filhos.length;i++){
            filhos.push(content_filhos[i].children[0].children[0].children[1].innerText)
        }
        lst_datas_return.push({
            'FILTRO': {'NOME': filter_in_element,
                       'QUANT': quant},
            'FILHOS': filhos
        })

    }
    return lst_datas_return
}


function SendDatasTalaSimples(){
    let mats_adc = ReturnMatsAdcLstMat('tala_simples_content_all_mats_adc')
    let datas_gerenciar_mats = ReturnFiltersAndChildresGerenciarMat()
    let band_ele = ReturnValueSelectedCheckboxBandEle()
    let tipo_mat = ReturnTipoMatSelectedLstMat()
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTalaSimples/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'mats_adc': mats_adc,
                'datas_gerenciar_mats': datas_gerenciar_mats,
                'band_ele': band_ele,
                'tipo_mat': tipo_mat
            })},
        success: function (data) {
            SwitchAlertLstMat(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function ShowModalTalaSimplesLstMat(band_eletro){
    document.getElementById('lst_mat_band_ele_checkbox').value = band_eletro
    if(ReturnTipoMatSelectedLstMat() !== '0'){
        ClearModalTalaSimples()
        await GetDatasTalaSimples(band_eletro)
        $('#modal_tala_simples').modal('show')
    }
    else{
        SwitchAlertLstMat('Selecione um tipo de material!!', true)
    }

}

function ClearModalTalaSimples(){
    document.getElementById('tala_simples_content_all_mats_adc').innerHTML = ''
    document.getElementById('tala_simples_all_filters_adc').innerHTML = ''
}

async function GetDatasTalaSimples(band_eletro){
    let datas_tala = await RequestDatasTalaSimples(band_eletro)
    let mats_adc = datas_tala['mats_adc']
    let gerenc_mats = datas_tala['gerenc_mats']
    let input_code_add_mat_adc = document.getElementById('tala_simples_code_new_mat_adc')
    let input_quant_add_mat_adc = document.getElementById('tala_simples_quant_new_mat_adc')
    let input_filter_code = document.getElementById('tala_simples_adc_filter')
    let input_filter_quant = document.getElementById('tala_simples_adc_quant')
    let container_filtros = document.getElementById('tala_simples_all_filters_adc')
    for (let i = 0; i <mats_adc.length;i++){
        input_code_add_mat_adc.value = mats_adc[i]['CODE']
        input_quant_add_mat_adc.value = mats_adc[i]['QUANT']
        AddMatAdcTalaListMat('tala_simples_code_new_mat_adc', 'tala_simples_quant_new_mat_adc', 'tala_simples_content_all_mats_adc')
        input_code_add_mat_adc.value = ''
        input_quant_add_mat_adc.value = ''
    }
    for (let i = 0; i <gerenc_mats.length;i++){
        let datas_filtro = gerenc_mats[i]['FILTRO']
        let datas_filhos = gerenc_mats[i]['FILHOS']
        input_filter_code.value = datas_filtro['NOME']
        input_filter_quant.value = datas_filtro['QUANT']
        AdcFilterGerenciarMatTalaSimples()
        input_filter_code.value = ''
        input_filter_quant.value = ''
        let element_filter_create_now = container_filtros.children[i]
        let input_material = element_filter_create_now.children[0].children[1].children[0].children[0].children[1].children[0]
        let btn_add_filho = element_filter_create_now.children[0].children[1].children[1].children[0]
        for (let j = 0; j <datas_filhos.length;j++){
            input_material.value = datas_filhos[j]
            AddMaterialInFilter(btn_add_filho)
            input_material.value = ''
        }
    }
}

async function RequestDatasTalaSimples(band_eletro){
    let band_ele = band_eletro
    let tipo_mat = ReturnTipoMatSelectedLstMat()
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMatTalaSimples/",
        dataType: 'json',
        data: {'band_ele': band_ele, 'tipo_mat': tipo_mat},
        success: function (data) {
            datas_return = data['return']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function ReturnValueSelectedCheckboxBandEle(){
    return document.getElementById('lst_mat_band_ele_checkbox').value
}

async function FillSelectTiposMatTelaPrincialLstMat(){
    let tipos_mat = await RequestTiposMat()
    let str_options = `<option value="0">---</option>`
    for (let i = 0; i <tipos_mat.length;i++){
        str_options += `<option value="${tipos_mat[i]['id']}">${tipos_mat[i]['nome']}</option>`
    }
    document.getElementById('lst_mat_tipos_mat').innerHTML = str_options
}

async function FillSelectTiposMatTelaPrincialLstTamp(){
    let tipos_mat = await RequestTiposTamp()
    let str_options = `<option value="0">---</option>`
    for (let i = 0; i <tipos_mat.length;i++){
        str_options += `<option value="${tipos_mat[i]['id']}">${tipos_mat[i]['nome']}</option>`
    }
    document.getElementById('lst_mat_tipos_tampa').innerHTML = str_options
    document.getElementById('tipo_material_tampa_eletrocalha').innerHTML = str_options
    document.getElementById('tipo_material_tampa_bandeja').innerHTML = str_options
}

function ReturnTipoMatSelectedLstMat(){
    return $('#lst_mat_tipos_mat').val()
}

function ReturnTipoMatSelectedLstTamp(){
    return $('#lst_mat_tipos_tampa').val()
}


function DeleteRowTableDeParaLstMat(btn_del){
    swal({
      title: "Você tem certeza que deseja excluir os itens selecionados?",
      text: "Uma vez deletado, não será possível recuperar os dados excluídos.",
      icon: "warning",
      buttons: ['Não', 'Sim, quero excluir!'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        btn_del.parentElement.parentElement.remove()
        swal("Excluído!", {
          icon: "success",
        });
      }
    });
}

function AdcDeParaTampasLstMat(cod=null, cod_tampa=null, presillhas=null, quant_presilhas=null){
    if(cod.length > 0 && cod_tampa.length > 0){
        if(cod.includes(' ') || cod_tampa.includes(' ')){
            return SwitchAlertLstMat('Códigos não podem conter espaços!!!', true)
        }
        else{
            document.getElementById('lst_mat_body_table_de_para').innerHTML +=
                                    `<tr class="hover_table_depara_tampa" onclick="FindInfoMateriais('${cod}', '${cod_tampa}', '${presillhas}')">
                                        <td class="text-center form-check"><input class="form-check-input" type="checkbox" value=""></td>
                                        <td class="text-center">${cod}</td>
                                        <td class="text-center">${cod_tampa}</td>
                                        <td class="text-center">${presillhas}</td>
                                        <td class="text-center">${quant_presilhas}</td>
                                        <td class="text-center"><i class="fa-solid fa-xmark hover_btn_mais_lst_mat_mats_adc" onclick="DeleteRowTableDeParaLstMat(this)"></i></td>
                                    </tr>`
        }

    }
    else{
        return SwitchAlertLstMat('Verifique os dados enviados e tente novamente!!', true)
    }
}


function FindInfoMateriais(cod_1, cod_2, cod_3){

        $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "FindCodsDeOaraTampas/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'cod_1': cod_1,
                'cod_2': cod_2,
                'cod_3': cod_3
            })},
        success: function (data) {
            document.getElementById('lst_mat_cod_lb').innerHTML = "Cód: <br>" + cod_1
            document.getElementById('lst_mat_cod').value = data['cod_1']

            document.getElementById('lst_mat_cod_tampa_lb').innerHTML = "Cód Tampa: <br>" + cod_2
            document.getElementById('lst_mat_cod_tampa').value = data['cod_2']

            document.getElementById('lst_mat_tampas_presilhas_lb').innerHTML = "Cód Presi: <br>" + cod_3
            document.getElementById('lst_mat_tampas_presilhas').value = data['cod_3']
            //SwitchAlertLstMat(data['return'])
        },
        failure: function (error) {
        },
    });
}

function TransformPasteInTable(pasted_data){
    let rows_pasted = pasted_data.split('\n')
    rows_pasted = rows_pasted.slice(0,rows_pasted.length-1)
    for (let i = 0; i <rows_pasted.length;i++){
        let cols_in_row = rows_pasted[i].split('\t')
        let cod = cols_in_row[0]
        let cod_tampa = cols_in_row[1]
        let presilhas = cols_in_row[2]
        let quant_presilhas = cols_in_row[3]
        AdcDeParaTampasLstMat(cod, cod_tampa, presilhas, quant_presilhas)
    }
}


function GetAllMatsDeParaTampa(){
    let content = document.getElementById('lst_mat_body_table_de_para')
    return Array.from($.map(content.children, function(element) {return {'codigo': element.children[1].innerText,
        'codigo_tampa': element.children[2].innerText, 'presilhas': element.children[3].innerText, 'quant_presilhas': element.children[4].innerText}}))
}

function SaveDeParaTampasLstMat(){
    let all_de_para = GetAllMatsDeParaTampa()
    let band_ele = ReturnValueSelectedCheckboxBandEle()
    let tipo_mat = ReturnTipoMatSelectedLstTamp()
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMataDeParaTampas/" + tipo_mat + "/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'de_para': all_de_para,
                'band_ele': band_ele
            })},
        success: function (data) {
            SwitchAlertLstMat(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function RequestDatasDePara(band_eletro){
    let band_ele = band_eletro
    let tipo_tamp = ReturnTipoMatSelectedLstTamp()
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftokenlst_mat},
        url: "LstMataDeParaTampas/" + tipo_tamp + "/",
        dataType: 'json',
        data: {'band_ele': band_ele},
        success: function (data) {
            datas_return = data['lst_datas']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function FillDeParaExists(band_eletro){
    let lst_datas = await RequestDatasDePara(band_eletro)
    for (let i = 0; i <lst_datas.length;i++){
        AdcDeParaTampasLstMat(lst_datas[i]['codigo'], lst_datas[i]['codigo_tampa'], lst_datas[i]['presilha'], lst_datas[i]['quant_presilha'])
    }
}

async function ShowModalDeParaLstMat(band_eletro){
    document.getElementById('lst_mat_band_ele_checkbox').value = band_eletro
    if(ReturnTipoMatSelectedLstTamp() !== '0'){
        ClearDeParaModal()
        await FillDeParaExists(band_eletro)
        $('#modal_de_para_tampas').modal('show')
    }
    else{
        SwitchAlertLstMat('Selecione um tipo de Tampa!!', true)
    }
}

function ClearDeParaModal(){
    document.getElementById('lst_mat_body_table_de_para').innerHTML = ''
}

function hide_or_show() {
    let filtroRecho = document.getElementById("filtro-recho")
    if (filtroRecho.hidden === true) {
        return filtroRecho.hidden = false
    }
    if (filtroRecho.hidden === false) {
        return filtroRecho.hidden = true
    }
}

function excluirSelecionados() {

    swal({
      title: "Você tem certeza que deseja excluir os itens selecionados?",
      text: "Uma vez deletado, não será possível recuperar os dados excluídos.",
      icon: "warning",
      buttons: ['Não', 'Sim, quero excluir!'],
      dangerMode: true,
    })
    .then((willDelete) => {
      if (willDelete) {
        let ckList = document.querySelectorAll("input[type=checkbox]:checked");
        ckList.forEach(function(el) {
            el.parentElement.parentElement.remove();
        });
        swal("Excluído!", {
          icon: "success",
        });
      }
    });
}


FillSelectTiposMatTelaPrincialLstMat()
FillSelectTiposMatTelaPrincialLstTamp()