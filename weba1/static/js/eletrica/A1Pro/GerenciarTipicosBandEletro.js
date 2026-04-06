//const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value

// function ClearDropzonesInsert(id_dropzone){
//     let items_dropzone = document.getElementById(id_dropzone).children
//     for (let i = 0; i <items_dropzone.length;i++){
//         if(!Array.from(items_dropzone[i].classList).includes('dwgs_insert')){
//             items_dropzone[i].remove()
//         }
//     }
// }
//
// function ParametrosEventDropzones(){
//     return [{key_id_dropzone: 'cardzone_block_header', key_id_file: 'arquivo_dwg_header', key_formdata: 'block_header'},
//     {key_id_dropzone: 'cardzone_block_celula', key_id_file: 'arquivo_dwg_celula', key_formdata: 'block_celula'},
//     {key_id_dropzone: 'cardzone_block_tag', key_id_file: 'arquivo_dwg_tag', key_formdata: 'block_tag'}]
// }
//

function DeleteFileDwgBandEletr(arrayDel){
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
                 DeleteBlockBandEletr(arrayDel)
             }
         }
     );

}

function deleteAllBandEleSelecteds(){
    const allSelecteds = Array.from(document.getElementsByClassName('check_in_band_ele_exists')).filter(check=>check.checked).map(check=>{return check.value})
    if(allSelecteds.length > 0){
        DeleteFileDwgBandEletr(allSelecteds)
    }
}

function ClearFilesBandEleDropzoneGt(){
    document.getElementById('cardzone_block_band_eletro').innerHTML = ''
    FilesBandEele.delete('FileBandEle')
}

function ClickButtonLimparBandEle(){
    ClearFilesBandEleDropzoneGt()
    ClearFormsFileBandEle()
    document.getElementById('band_ele_exists_selected').value = ''
    document.getElementById('band_ele_forms_file').hidden = true
    document.getElementById('img_dwg_band_ele').src = ''
}
function ClearFormsFileBandEle(){
    document.getElementById('nome_bloco_band_eletro').value = ''
    document.getElementById('altura_bandeja').value  = ''
    document.getElementById('largura_bandeja').value  = ''
    document.getElementById('bandeja_eletrocalha').value = ''
    document.getElementById('pos_inicial').value = ''
    document.getElementById('pos_final').value = ''
    document.getElementById('pos_inicial_primeiro').value = ''
    document.getElementById('pos_final_primeiro').value = ''
    document.getElementById('primeiro_bloco').value = 'NÃO'
}
function GetInfoBlockEletBand(id_bloco){
    ClearFilesBandEleDropzoneGt()
    document.getElementById('band_ele_exists_selected').value = id_bloco
    $.ajax({
        url: "/app/eletrica/GerenciarTipicosBandEletro/", // Caminho do Ajax
        type: "GET", // http method
        headers:{'X-CSRFToken':csrftoken},
        enctype: 'multipart/form-data',
        dataType: "json",
        data: {'id_bloco': id_bloco}, // Envia form pela solicitação do POST
        success: function (data) {
            document.getElementById('nome_bloco_band_eletro').value = data['nome_tipico']
            document.getElementById('altura_bandeja').value  = data['altura_bandeja']
            document.getElementById('largura_bandeja').value  = data['largura_bandeja']
            document.getElementById('bandeja_eletrocalha').value = data['tipo_bandeja_eletrocalha']
            document.getElementById('pos_inicial').value = data['pos_x_ini']
            document.getElementById('pos_final').value = data['pos_y_ini']
            document.getElementById('pos_inicial_primeiro').value = data['pos_x_insert']
            document.getElementById('pos_final_primeiro').value = data['pos_y_insert']
            document.getElementById('primeiro_bloco').value = (data['primeiro_bloco'] === 1) ? 'SIM': 'NÃO'
            document.getElementById('band_ele_forms_file').hidden = false
        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}

function ShowDwgInScreenBandEletr(id_block){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicosBandEletro/ShowDwgInScreen/" + id_block + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            document.getElementById('img_dwg_band_ele').src = `data:image/png;base64,${data['dwg']}`
        },
        failure: function (error) {
        },
    });
}

function DeleteBlockBandEletr(arrayIds){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/GerenciarTipicosBandEletro/DeleteBandElet/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify({
                'idsBandEleDelete': arrayIds
            })},
        success: function (data) {
            SwitchAlertGt(data['return'])
            localStorage.setItem("screen_load", "template_tipicos_band_eletro")
            $('div.swal-modal').addClass('bordas')
            $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
            changeCheckboxSelectAllChecks(false, 'check_in_band_ele_exists')
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

function InitProgressGerenciarTipicosBandEle(task_id){
    var progressUrl = `/celery-progress/${task_id}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
          onSuccess: customSucess,
          onError: customError,
          onProgress: customProgress,
        })

        function customSucess(progressBarElement, progressBarMessageElement, result){
            progressBarElement.style.backgroundColor = '#76ce60';
            if(result['status']){
                progressBarMessageElement.innerHTML = result['msg_return']
                setTimeout(()=>{
                    HideModalLoadCelery()
                    window.location.reload()}, 5000)
            }
            else{
                SwitchAlertGt(result['msg_return'], true)
                HideModalLoadCelery()
            }


        }

        function customError(progressBarElement, progressBarMessageElement, excMessage){
            progressBarElement.style.backgroundColor = '#dc4f63';
            progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
            + progressUrl;
            setTimeout(()=>{
                HideModalLoadCelery()
                window.location.reload()}, 8000)
        }

        function customProgress(progressBarElement, progressBarMessageElement, progress){
            progressBarElement.style.backgroundColor = '#68a9ef';
            progressBarElement.style.width = progress.percent + "%";
            var description = progress.description || "";
            progressBarMessageElement.innerHTML = description
        }
}


// function NavMenuTipicos(id_show){
//     let all_ids = ['content_insert_blocks', 'content_templates']
//     for (let i = 0; i <all_ids.length;i++){
//         document.getElementById(all_ids[i]).hidden = all_ids[i] === id_show?false:true
//     }
// }


function SendInfoFileBlock(){
    let nome_bloco = document.getElementById('nome_bloco_band_eletro').value
    let altura_bandeja = document.getElementById('altura_bandeja').value
    let largura_bandeja = document.getElementById('largura_bandeja').value
    let tipo_bandeja_eletrocalha = document.getElementById('bandeja_eletrocalha').selectedOptions[0].value
    let pos_x_ini = document.getElementById('pos_inicial').value
    let pos_y_ini = document.getElementById('pos_final').value
    let pos_x_insert = document.getElementById('pos_inicial_primeiro').value
    let pos_y_insert = document.getElementById('pos_final_primeiro').value
    let primeiro_bloco = document.getElementById('primeiro_bloco').selectedOptions[0].value
    let file = FilesBandEele.get('FileBandEle')
    let band_ele_selected = document.getElementById('band_ele_exists_selected').value !== ''?document.getElementById('band_ele_exists_selected').value:null
    let form
    let form_data = new FormData()
    if (file !== null){
        form = file
    }else{
        return swal({
                    title: "Atenção!",
                    text: 'É necessário enviar um arquivo DWG!!',
                    icon: "warning",
                    button: "Fechar",
                })
    }
    if (! nome_bloco){
            return swal({
                title: "Atenção!",
                text: 'É necessário inserir um nome para o Bloco!!',
                icon: "warning",
                button: "Fechar",
            })
    }
    let dict_to_send = {'nome_tipico': nome_bloco, 'altura_bandeja':altura_bandeja, 'largura_bandeja':largura_bandeja,
                        'tipo_bandeja_eletrocalha': tipo_bandeja_eletrocalha, 'pos_x_ini': pos_x_ini, 'pos_y_ini': pos_y_ini,
                        'pos_x_insert': pos_x_insert, 'pos_y_insert': pos_y_insert, 'primeiro_bloco': primeiro_bloco,
                        'file': form, 'band_ele_selected': band_ele_selected
    }
    for(let key in dict_to_send){
        form_data.append(key, dict_to_send[key]);
    }
    $.ajax({
        url: "/app/eletrica/GerenciarTipicosBandEletro/", // Caminho do Ajax
        type: "POST", // http method
        enctype: 'multipart/form-data',
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: form_data, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            localStorage.setItem("screen_load", "template_tipicos_band_eletro")
            InitProgressGerenciarTipicosBandEle(data['task_id'])

        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}
