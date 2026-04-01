const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

function HideShowDatasNotas(hidden){
    document.getElementById('dados_doc_content_adc_nota').hidden = hidden
}

function ShowFormAdcNewDocNum(){
    document.getElementById('dados_doc_btn_adc_new_num').hidden = true
    document.getElementById('dados_doc_btn_save_new_num').hidden = false
    document.getElementById('dados_doc_num_doc_a1').hidden = true
    document.getElementById('dados_doc_adc_new_num').hidden = false
    document.getElementById('dados_doc_edit_num').title = ''
    document.getElementById('dados_doc_edit_num').value = ''
}

function ClickBtnOkAdcNewDocNum(){
    let new_doc_num = document.getElementById('dados_doc_adc_new_num').value
    if(new_doc_num.length > 0 && new_doc_num.length <= 100){
        if(!VerifyIfExistsNumDoc(new_doc_num)){
            let new_option_in_select = `<option value="new">${new_doc_num}</option>`
            document.getElementById('dados_doc_num_doc_a1').innerHTML += new_option_in_select
        }
    }
    document.getElementById('dados_doc_adc_new_num').hidden = true
    document.getElementById('dados_doc_btn_save_new_num').hidden = true
    document.getElementById('dados_doc_num_doc_a1').hidden = false
    document.getElementById('dados_doc_btn_adc_new_num').hidden = false

}

function VerifyIfExistsNumDoc(num_doc){
    let options_select_all_num_docs = document.getElementById('dados_doc_num_doc_a1').options
    let exists = false
    for(let i = 0; i < options_select_all_num_docs.length; i++){
        if(options_select_all_num_docs[i].value !== '0'){
            if(options_select_all_num_docs[i].innerHTML === num_doc){
                exists = true
                break
            }
        }
    }
    return exists
}

function SaveNotasInDoc(){
    let new_nota = document.getElementById('dados_doc_adc_nota').value
    if(new_nota.length > 0 && new_nota.length <= 250){
        if(!VerifyIfExistsNota(new_nota)){
            let content_all_notas = document.getElementById('dados_doc_all_notas')
            content_all_notas.innerHTML += `<div class="mx-1 my-1 bg-white rounded notas_cadastradas">
                                                 <i class="fa-solid fa-circle-xmark muda_cursor_hover mx-1" onclick="RemoveNotaInContent(this)"></i>${new_nota}
                                            </div>`
        }
    }
}

function VerifyIfExistsNota(new_nota){
    let content_notas = document.getElementById('dados_doc_all_notas').children
    let exists = false
    for(let i = 0; i < content_notas.length; i++){
        let nota = content_notas[i].children[0].innerText
        if(nota === new_nota){
            exists = true
            break
        }
    }
    return exists
}

function RemoveNotaInContent(element_x){
    element_x.parentElement.remove()
}


function GetAllNotasInDoc(){
    let content_notas = document.getElementById('dados_doc_all_notas').children
    var notas = []
    for(let i = 0; i < content_notas.length; i++){
        let nota = content_notas[i].innerText
        notas.push(nota)
    }
    return notas
}


function GetDatasDocAndVerify(){
    let num_doc = !document.getElementById('dados_doc_edit_num').hidden ? document.getElementById('dados_doc_edit_num').value:document.getElementById('dados_doc_adc_new_num').value
    let doc_selected = document.getElementById('dados_doc_edit_num').title !== ''?document.getElementById('dados_doc_edit_num').title:null
    let tipo_doc = $('#dados_doc_tipo_doc').val()
    let desc_doc = document.getElementById('dados_doc_desc_doc').value.length > 0?document.getElementById('dados_doc_desc_doc').value:null
    let desc_tipo = document.getElementById('dados_doc_desc_tipo').value.length > 0?document.getElementById('dados_doc_desc_tipo').value:null
    let desc_area = document.getElementById('dados_doc_desc_area').value.length > 0?document.getElementById('dados_doc_desc_area').value:null
    let num_cliente = document.getElementById('dados_doc_num_cliente').value.length > 0?document.getElementById('dados_doc_num_cliente').value:null
    let notas = GetAllNotasInDoc()
    let rev_a1 = $('#dados_doc_num_rev_a1').val()
    let rev_cliente = $('#dados_doc_num_rev_cliente').val()
    let data = document.getElementById('dados_doc_data').value
    let desc_rev = document.getElementById('dados_doc_desc_rev').value.length > 0?document.getElementById('dados_doc_desc_rev').value:null
    let status = $('#dados_doc_status').val()
    let finalidade = $('#dados_doc_finalidade').val()
    let elaborado = document.getElementById('dados_doc_elaborado').title
    let verificado = document.getElementById('dados_doc_verificado').title
    let aprovado = document.getElementById('dados_doc_aprovado').title
    var invalid_fields = []
    var msg_return = ''

    if(num_doc.length === 0){
        invalid_fields.push('Número do Documento')
    }

    if(tipo_doc === '0'){
        invalid_fields.push('Tipo de Doc')
    }

    if(desc_doc !== null){
        if(desc_doc.length>200){
            invalid_fields.push('Descrição do documento')
        }
    }

    if(num_cliente !== null){
        if(num_cliente.length>100){
            invalid_fields.push('N° Cliente')
        }
    }

    if(data.length === 0){
        invalid_fields.push('Data')
    }

    if(desc_rev !== null){
        if(desc_rev.length > 200){
            invalid_fields.push('Descrição Rev')
        }
    }

    if(status === '0'){
        invalid_fields.push('Status')
    }

    if(finalidade === '0'){
        invalid_fields.push('Finalidade')
    }

    if(elaborado === ''){
        invalid_fields.push('Elaborado')
    }

    if(verificado === ''){
        invalid_fields.push('Verificado')
    }

    if(aprovado === ''){
        invalid_fields.push('Aprovado')
    }

    if(invalid_fields.length === 0){
        return {'num_doc': num_doc,
                'doc_selected': doc_selected,
                'tipo_doc': tipo_doc,
                'desc_doc': desc_doc,
                'desc_tipo': desc_tipo,
                'desc_area': desc_area,
                'num_cliente': num_cliente,
                'notas': notas,
                'rev_a1': rev_a1,
                'rev_cliente': rev_cliente,
                'data': data,
                'desc_rev': desc_rev,
                'status': status,
                'finalidade': finalidade,
                'elaborado': elaborado,
                'verificado': verificado,
                'aprovado': aprovado}
    }

    else{
        msg_return = 'Campos Invalidos: ' + invalid_fields.join(', ')
    }
    return msg_return

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

function VerifyIniciasPerson(element_iniciais){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/GerarTipicosDoc/VerifyInicialPersonValid/",
        dataType: 'json',
        data: {'inicial': element_iniciais.value},
        success: function (data) {
            if(data['id_person'] !== null){
                RemoveClassIsInvalid(element_iniciais.id)
                element_iniciais.title = data['id_person']
            }
            else{
                ClassIsInvalid(element_iniciais.id)
                element_iniciais.title = ''
            }
        },
        failure: function (error) {
        },
    });
}

function UpperText(element_text){
    element_text.value = element_text.value.toUpperCase()
}

function ChangeNumDoc(select){
    let option_selected = select.selectedOptions[0]
    let input_edit_num = document.getElementById('dados_doc_edit_num')
    select.hidden = true
    input_edit_num.hidden = false
    input_edit_num.value = option_selected.innerHTML
    input_edit_num.title = option_selected.value !== 'new' ? option_selected.value:''
    document.getElementById('dados_doc_btn_adc_new_num').hidden = true
    document.getElementById('dados_doc_btn_outro').hidden = false
    document.getElementById('dados_doc_btn_del').hidden = option_selected.value === 'new'?true:false
    if(option_selected.value !== 'new'){
        ResponseNumDocSelected(option_selected.value)
    }
    else{
        ClearAllFieldsDadosDoc(false)
    }

}

function ResponseNumDocSelected(id_selected){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/GerarTipicosDoc/DadosDocGerarTipicosWithId/" + id_selected + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillFormsDocSelected(data['dados_doc'])
        },
        failure: function (error) {
        },
    });
}

function FillFormsDocSelected(dados_doc){
    $('#dados_doc_tipo_doc').val(dados_doc['tipo_doc'])
    document.getElementById('dados_doc_desc_doc').value = dados_doc['desc_doc']
    document.getElementById('dados_doc_num_cliente').value = dados_doc['num_cliente']
    FillNotasExists(dados_doc['notas'])
    $('#dados_doc_num_rev_a1').val(dados_doc['rev_a1'])
    $('#dados_doc_num_rev_cliente').val(dados_doc['rev_cliente'])
    document.getElementById('dados_doc_data').value = dados_doc['data']
    document.getElementById('dados_doc_desc_rev').value = dados_doc['desc_rev']
    $('#dados_doc_status').val(dados_doc['status'])
    document.getElementById('dados_doc_elaborado').value = dados_doc['elaborado']['sigla']
    document.getElementById('dados_doc_elaborado').title = dados_doc['elaborado']['id']
    document.getElementById('dados_doc_verificado').value = dados_doc['verificado']['sigla']
    document.getElementById('dados_doc_verificado').title = dados_doc['verificado']['id']
    document.getElementById('dados_doc_aprovado').value = dados_doc['aprovado']['sigla']
    document.getElementById('dados_doc_aprovado').title = dados_doc['aprovado']['id']
    RemoveClassIsInvalid('dados_doc_elaborado')
    RemoveClassIsInvalid('dados_doc_verificado')
    RemoveClassIsInvalid('dados_doc_aprovado')
}

function FillNotasExists(list_notas){
    var html_content_notas = ``
    for(let i = 0; i < list_notas.length; i++){
        html_content_notas += `<div class="mx-1 my-1 bg-white rounded notas_cadastradas text-truncate">
                                     <i class="fa-solid fa-circle-xmark muda_cursor_hover mx-1" onclick="RemoveNotaInContent(this)"></i>${list_notas[i]}
                                </div>`
    }
    document.getElementById('dados_doc_all_notas').innerHTML = html_content_notas
}


function ClearAllFieldsDadosDoc(clean_select=true){
    if(clean_select){
        $('#dados_doc_num_doc_a1').val('0')
        document.getElementById('dados_doc_num_doc_a1').hidden = false
        document.getElementById('dados_doc_adc_new_num').hidden = true
        document.getElementById('dados_doc_edit_num').hidden = true
        document.getElementById('dados_doc_btn_outro').hidden = true
        document.getElementById('dados_doc_btn_save_new_num').hidden = true
        document.getElementById('dados_doc_btn_adc_new_num').hidden = false
        document.getElementById('dados_doc_btn_del').hidden = true
    }
    $('#dados_doc_tipo_doc').val('0')
    document.getElementById('dados_doc_num_cliente').value = ''
    document.getElementById('dados_doc_all_notas').innerHTML = ''
    document.getElementById('dados_doc_content_adc_nota').hidden = true
    $('#dados_doc_num_rev_a1').val('0')
    $('#dados_doc_num_rev_cliente').val('0')
    document.getElementById('dados_doc_data').value = ''
    document.getElementById('dados_doc_desc_rev').value = ''
    $('#dados_doc_status').val('0')
    document.getElementById('dados_doc_elaborado').value = ''
    document.getElementById('dados_doc_elaborado').title = ''
    document.getElementById('dados_doc_verificado').value = ''
    document.getElementById('dados_doc_verificado').title = ''
    document.getElementById('dados_doc_aprovado').value = ''
    document.getElementById('dados_doc_aprovado').title = ''
    RemoveClassIsInvalid('dados_doc_elaborado')
    RemoveClassIsInvalid('dados_doc_verificado')
    RemoveClassIsInvalid('dados_doc_aprovado')
}

function SendDadosDoc(){
    debugger;
    let dados_doc = GetDatasDocAndVerify()
    console.log(dados_doc)
    if(typeof dados_doc === "string"){
        return swal({
                    title: "Atenção!",
                    text: dados_doc,
                    icon: "warning",
                    button: 'Fechar'
                })
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/GerarTipicosDoc/DadosDocGerarTipicos/",
        dataType: 'json',
        data: {'dados_doc': JSON.stringify(dados_doc)},
        success: function (data) {
            FillSelectAllNumDocs('dados_doc_num_doc_a1')
            if(data['return']['id_doc'] !== null){
                $('#dados_doc_num_doc_a1').val(data['return']['id_doc'])
            }
            let title_swal = !data['return']['error']?'Sucesso':'Opa'
            let icon_swal = !data['return']['error']?'success':'error'
            swal({
                title: title_swal,
                text: data['return']['msg_return'],
                icon: icon_swal,
                button: 'Fechar'
            })
            ClearAllFieldsDadosDoc()
        },
        failure: function (error) {
        },
    });
}

function FillSelectAllNumDocs(id_select){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/GerarTipicosDoc/DadosDocGerarTipicos/",
        dataType: 'json',
        data: {},
        success: function (data) {
            let all_docs = data['all_docs']
            var options_select = `<option value="0">---</option>`
            for(let i = 0; i < all_docs.length; i++){
                options_select += `<option value="${all_docs[i]['id']}" title="${all_docs[i]['tipo']}">${all_docs[i]['num_doc']}</option>`
            }
            document.getElementById(id_select).innerHTML = options_select
        },
        failure: function (error) {
        },
    });
}

function FilterNumDocPorTipoDoc(){
    let options_num_doc = document.getElementById('num_doc').options
    let tipo_doc = $('#tipo_doc').val()
    $('#num_doc').val('0')
    if(tipo_doc !== '0'){
        for(let i = 0; i < options_num_doc.length; i++){
            let hidden_option = tipo_doc === options_num_doc[i].title || options_num_doc[i].value === '0'
            options_num_doc[i].hidden = !hidden_option
        }
        document.getElementById('num_doc').disabled = false
    }
    else{
        for(let i = 0; i < options_num_doc.length; i++){
            options_num_doc[i].hidden = false
        }
        document.getElementById('num_doc').disabled = true
        document.getElementById('content_drop_tipicos').hidden = true
    }
}

function ChangeNumDocTelaPrincipal(){
    let num_doc_selected = document.getElementById('num_doc').selectedOptions[0]
    let value_select_td = num_doc_selected.value !== '0'? num_doc_selected.title : '0'
    $('#tipo_doc').val(value_select_td)

}

function DeleteDoc(){
    let doc_selected = document.getElementById('dados_doc_edit_num').title
    if(doc_selected !== ''){
        $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/GerarTipicosDoc/DadosDocGerarTipicosWithId/" + doc_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                swal({
                    title: "Sucesso!",
                    text: data['return'],
                    icon: "success",
                    button: 'Fechar'
                })
                ClearAllFieldsDadosDoc()
                FillSelectAllNumDocs('dados_doc_num_doc_a1')
            },
            failure: function (error) {
            },
        });
    }
}

function ShowContentNumDoc(){
    let select_num_doc = document.getElementById('num_doc').selectedOptions[0]
    let relation_containers = {'content_drop_tipicos': ['ATERRAMENTO', 'ALIM. CARGAS ELET', 'ILUMINAÇÃO'], 'content_drop_tipicos_sup_band': ['SUPORTES E BANDEJAS'], 'content_drop_tipicos_forca_controle': ['FORÇA E CONTROLE']}
    for(let id_container in relation_containers){
        let element_container = document.getElementById(id_container)
        if(relation_containers[id_container].includes(select_num_doc.title)){
            element_container.hidden = false
        }
        else{
            element_container.hidden = true
        }
    }

}

function ClearContentDwgs(){
    document.getElementById('arquivo_dwg').value = ''
    window.location.reload()
}

function InitProgressGerarTipicos(task_id){
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

function SwitchAlertGtDoc(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}


function ReturnParamsDropFilesInDropzone(){
    return {
        'drop_area_relatorio_pdms': {'id_input': 'arquivo_xlsx_sup_band', 'key_form_data': 'FileRelatPDMS', 'xlsx': true},
        'drop-area-capa_dwg': {'id_input': 'arquivo_capa_sup_band', 'key_form_data': 'FileCapa', 'xlsx': false},
        'drop-area-logo_dwg': {'id_input': 'arquivo_logo_sup_band', 'key_form_data': 'FileLogo', 'xlsx': false}
    }
}

function ClearDropsZonesBandEle(container){
    let dropzone_childrens = container.children
    for(let i = 0; i <dropzone_childrens.length;i++){
        if(dropzone_childrens[i].id === ""){
            dropzone_childrens[i].remove()
        }
    }
}

function VerifyFilesSupBand(){
    let keys_exists_in_form_data = {'FileRelatPDMS': 'Relatório PDMS', 'FileCapa': 'DWG Capa', 'FileLogo': 'DWG Logo'}
    let list_files_error = []
    for(let key_form_data in keys_exists_in_form_data){
        if(!Array.from(formFileSupBand.keys()).includes(key_form_data)){
            list_files_error.push(keys_exists_in_form_data[key_form_data])
        }
    }
    return list_files_error

}

function SendFilesBandEleGtDoc(){
    let list_files_error = VerifyFilesSupBand()
    if(list_files_error.length === 0){
        formFileSupBand.append('id_num_doc', $('#num_doc').val())
        $.ajax({
            url: "/app/eletrica/a1pro/GerarTipicosDoc/GeraTipicosDocSupBand/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrftoken},
            dataType: "json",
            data: formFileSupBand, // Envia form pela solicitação do POST
            processData: false,
            contentType: false,
            success: function (data) {
                $('#modal_load_celery').modal('show')
                InitProgressGerarTipicos(data['task_id'])
            },
            failure: function () {
                alert('Algo deu errado! verifique e tente novamente.')
            }
        })
    }
    else{
        SwitchAlertGtDoc('Falta inserir os arquivos de: '+ list_files_error.join(', '), true)
    }
}

function SendFilesForcaControleGtDoc(){
    //teste = document.getElementById('#num_doc').value;
    //console.log(teste)
    debugger;
    formFileForcaControle.append('id_num_doc', $('#num_doc').val())
    const area = getCookie('Area');
    formFileForcaControle.append('area', area)
    console.log(formFileForcaControle)

    $.ajax({
            url: "/app/eletrica/a1pro/GerarTipicosDoc/GeraTipicosDocForcaControle/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrftoken},
            dataType: "json",
            data: formFileForcaControle, // Envia form pela solicitação do POST
            processData: false,
            contentType: false,
            success: function (data) {
                if (data.status === "aviso") {

                    return swal({
                    title: "Atenção!",
                    text: 'Antes de continuar, configurar derivação Leito/Eletroduto',
                    icon: "warning",
                    button: 'Fechar'
                    })
                } else {
                    $('#modal_load_celery').modal('show');
                    InitProgressGerarTipicos(data['task_id']);
                }
                }
        })
}


function DeleteFileSupBandGtDocs(btn_del, key_form_data){
    btn_del.parentElement.parentElement.remove()
    formFileSupBand.delete(key_form_data)
}

FillSelectAllNumDocs('num_doc')


    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }