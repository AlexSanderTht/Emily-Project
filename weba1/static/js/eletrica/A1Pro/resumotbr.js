
function CleanFormsTbr(){
    document.getElementById('tensao_tbr').value=""
    document.getElementById('fator_agrupamento').value=""
    document.getElementById('corrente_continua').value=""
    ClearDropzoneTbr()
}
function SendTbrBack(){
    var AllDatas = GetTbrDatas()
    if(typeof AllDatas === "string"){
        return alert(AllDatas)
    }
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: window.location.pathname,
              processData: false,
              contentType: false,
              data: AllDatas,
              success: function (data) {
                  var progressUrl = `/celery-progress/${data["task_id"]}/`
                  CeleryProgressBar.initProgressBar(progressUrl, {
                      progressBarId: 'progress-bar-tbr',
                      progressBarMessageId: 'progress-bar-message-tbr',
                      onSuccess: customSucess,
                      onError: customError,
                  })

                  function customSucess(progressBarElement, progressBarMessageElement, result){
                      progressBarElement.style.backgroundColor = '#76ce60';
                      progressBarMessageElement.innerHTML = result
                  }

                  function customError(progressBarElement, progressBarMessageElement, excMessage){
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
                        + progressUrl;
                  }

              }
            });

}

var fileTBR = new FormData()
function DropFileExcelTbr(file_drop=null){
    var file = file_drop !== null ? file_drop.files[0] : document.getElementById('file_tbr').files[0]
    let name_file_splited = file.name.split('.')
    let extension = name_file_splited[name_file_splited.length - 1]
    if(extension === 'xlsx' || extension === 'csv'){
        ClearDropzoneTbr()
        fileTBR.append('file', file)
        var container_file = `
                    <p class="font-italic text-center w-100 mb-0">Arquivo selecionado</p>
                    <div class="col-8 mx-auto my-2 input-group input-group-sm">
                        <span type="text" class="col form-control bg-white input-group-text">${file.name}</span>
                        <div class="input-group-append">
                            <button class="btn btn-outline-secondary border bg-white" type="button" onclick="ClearDropzoneTbr()">
                                <i class="fa-solid fa-x text-danger"></i>
                            </button>
                        </div>
                    </div>`
        $('#files-uploads-tbr').html(container_file)
        $('#content-file-not-droped').hide()
    }
    else{
        SwitchAlertTBR('Só aceitamos arquivos excel!!!', true)
    }

}

function ClearDropzoneTbr(){
    $('#files-uploads-tbr').html('')
    $('#content-file-not-droped').show()
    fileTBR.delete('file')
    document.getElementById('file_tbr').value=''
}

function SwitchAlertTBR(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}

function GetTbrDatas(){
    var errors = []
    var tensao = document.getElementById('tensao_tbr').value
    var fagrup = document.getElementById('fator_agrupamento').value
    var cc = document.getElementById('corrente_continua').value
    var type_equip = $('#tipo_equip_tbr').val()

    if(tensao.length === 0){
        errors.push('Preencha o campo de tensão!!')
    }
    else {
        if(isNaN(Number(tensao))){
            errors.push('Tensão só aceita números!!')
        }
    }

    if(fagrup.length === 0){
        errors.push('Preencha o campo de Fator de agrupamento!!')
    }
    else{
        if(isNaN(Number(fagrup))){
            errors.push('Fator de agrupamento só aceita números!!')
        }
    }

    if(cc.length === 0){
        errors.push('Preencha o campo de Corrente contínua!!')
    }
    else{
        if(isNaN(Number(cc))){
            errors.push('Corrente continua só aceita números!!')
        }
    }

    if(fileTBR.get('file') === null){
        errors.push('Para cadastrar uma TBR precisamos do arquivo excel dela!!')
    }

    if(errors.length>0){
        return errors.join(', ')
    }
    else{
        let json_datas = {'cc': cc,
                          'type_eqp': type_equip,
                          'fagrup': fagrup,
                          'tensao': tensao}
        fileTBR.append('json', JSON.stringify(json_datas))
        return fileTBR
    }
}

function DeleteTbr(id_tbr){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
              type: "DELETE",
              headers:{'X-CSRFToken':csrftoken},
              url: "/app/eletrica/a1pro/DeleteTbr/" + id_tbr + "/",
              dataType: 'json',
              data: {},
              success: function (data) {
                  manipuling_modal_a1pro('Deletada!', data['finish'], true)
              }
            });
}