function RequestAllFabGeral(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/FabricantesGeral/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillSelectFabGeral(data['fabricantes'])
        },
        failure: function (error) {
        },
    });
}

function FillSelectFabGeral(datas_select){
    var options_select = `<option value="0">Selecione</option>`
    for(let id_fab in datas_select){
        options_select += `<option value="${id_fab}">${datas_select[id_fab]}</option>`
    }
    document.getElementById('fabricantes_existentes').innerHTML = options_select
}

function GetDatasFormsFab(){
    let nome = document.getElementById('nome_fabricante').value
    var desc = document.getElementById('desc_fabricante').value
    var fab_selected = $('#fabricantes_existentes').val() !== '0'?$('#fabricantes_existentes').val():null
    var fields_error = []
    if(nome.length>0){
        if(nome.length>80){
            fields_error.push('Nome')
        }
    }
    else{
        fields_error.push('Nome')
    }

    if(desc.length>0){
        if(desc.length>200){
            fields_error.push('Descrição')
        }
    }
    else{
        desc = null
    }

    if(fields_error.length === 0){
        return {'nome': nome, 'desc': desc, 'fab_selected': fab_selected}
    }
    else{
        return fields_error.join(' e ')
    }
}

function RequestDatasFabGeral(){
    let datas_fab_geral = GetDatasFormsFab()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(typeof datas_fab_geral === "string"){
        return swal({
                    title: "Atenção!",
                    text: "Campos ivalidos: " + datas_fab_geral,
                    icon: "error",
                    button: 'Fechar'
                    })
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/FabricantesGeral/",
        dataType: 'json',
        data: {'datas_fab_geral': JSON.stringify(datas_fab_geral)},
        success: function (data) {
            let title_swal = !data['response']['error']?'Sucesso':'Opa'
            let icon_swal = !data['response']['error']?'success':'error'
            swal({
                title: title_swal,
                text: data['response']['msg'],
                icon: icon_swal,
                button: 'Fechar'
                })
            RequestAllFabGeral()
        },
        failure: function (error) {
        },
    });

}

function FillFormsFabricantesGeral(datas_fields){
    document.getElementById('nome_fabricante').value = datas_fields['nome']
    document.getElementById('desc_fabricante').value = datas_fields['desc']
}
function ChangeFabGeral(){
    let fab_selected = $('#fabricantes_existentes').val()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(fab_selected !== '0'){
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/DatasFabricantesGeral/" + fab_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                FillFormsFabricantesGeral(data['datas'])
            },
            failure: function (error) {
            },
        });
    }
    else{
        FillFormsFabricantesGeral({'nome': '', 'desc': ''})
    }

}

function DeleteFabGeral(){
    let fab_selected = $('#fabricantes_existentes').val()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(fab_selected !== '0') {
        $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/DatasFabricantesGeral/" + fab_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                RequestAllFabGeral()
                FillFormsFabricantesGeral({'nome': '', 'desc': ''})
                return swal({
                    title: "Sucesso!",
                    text: "Fabricante Geral " + data['return'],
                    icon: "success",
                    button: 'Fechar'
                })
            },
            failure: function (error) {
            },
        });
    }
}

function GetDatasTipoCaboFolga(){
    let tipo_cabo = $('#os_carac_tipo_cabo').val()
    let folga = document.getElementById('os_carac_folga').value
    var invalid_fields = []
    if(tipo_cabo === '0'){
        invalid_fields.push('Tipo Cabo')
    }
    if(folga.length>0){
        if(isNaN(Number(folga))){
            invalid_fields.push('Folga')
        }
    }
    else{
        invalid_fields.push('Folga')
    }

    if(invalid_fields.length>0){
        return invalid_fields.join(' e ')
    }
    else{
        return {'tipo_cabo': tipo_cabo, 'folga': folga}
    }
}

function SendTipoCaboFolga(){
    let datas_tc_folga = GetDatasTipoCaboFolga()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(typeof datas_tc_folga === "string"){
        return swal({
                    title: "Atenção!",
                    text: "Campos ivalidos: " + datas_tc_folga,
                    icon: "error",
                    button: 'Fechar'
                    })
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/TipoCaboFolga/",
        dataType: 'json',
        data: {'datas_tc_folga': JSON.stringify(datas_tc_folga)},
        success: function (data) {
            return swal({
                    title: "Sucesso!",
                    text: data['return'],
                    icon: "success",
                    button: 'Fechar'
                })
        },
        failure: function (error) {
        },
    });
}

function ChangeTipoCaboFolga(){
    let tpc_selected = $('#os_carac_tipo_cabo').val()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(tpc_selected !== '0'){
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/DatasTipoCaboFolga/" + tpc_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                document.getElementById('os_carac_folga').value = data['folga']
            },
            failure: function (error) {
            },
        });
    }
    else{
        document.getElementById('os_carac_folga').value = ''
    }
}

function ShowModalCaracOs(){
    RequestAndFillSelectFabGeralInCaracOs()
    RequestAndFillSelectFabOsInCaracOs()
    $('#caracteristicas_os').modal('show')
}

function RequestAndFillSelectFabGeralInCaracOs(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/FabricantesGeral/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillSelectFabGeralInCaracOs(data['fabricantes'])
        },
        failure: function (error) {
        },
    });
}

function RequestAndFillSelectFabOsInCaracOs(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/FabricantesOs/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillSelectFabOsInCaracOs(data['fabricantes_os'])
        },
        failure: function (error) {
        },
    });
}

function FillSelectFabGeralInCaracOs(datas_select){
    var options_select = ``
    for(let id_fab in datas_select){
        options_select += `<option value="${id_fab}" draggable="true" ondragstart="DragStartFabGeral(event, ${id_fab})">${datas_select[id_fab]}</option>`
    }
    document.getElementById('os_carac_all_fabricantes').innerHTML = options_select
}

function FillSelectFabOsInCaracOs(datas_select){
    var options_select = ``
    for(let id_fab in datas_select){
        options_select += `<option value="${id_fab}" draggable="true" ondragstart="DragStartFabOs(event, ${id_fab})">${datas_select[id_fab]}</option>`
    }
    document.getElementById('os_carac_fabricantes_os').innerHTML = options_select
}
function DragStartFabGeral(event, id_fab_geral){
    event.dataTransfer.setData('id_fab_geral', id_fab_geral)
}

function DragOverFabOs(event) {
    // Função para mudar a cor do elemento
    event.preventDefault()
    const select = document.getElementById('os_carac_fabricantes_os')
    select.style.backgroundColor = 'grey'
}

function DragLeaveFabOs(event){
    event.preventDefault()
    const select = document.getElementById('os_carac_fabricantes_os')
    select.style.backgroundColor = 'white'
}

function DropFabGeralInFabOs(event){
    event.preventDefault()
    let id_fab_geral = event.dataTransfer.getData('id_fab_geral')
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/RegisterOrDeleteFabOs/" + id_fab_geral + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            let title_swal = !data['return']['error']?'Sucesso':'Opa'
            let icon_swal = !data['return']['error']?'success':'error'
            swal({
                title: title_swal,
                text: data['return']['msg_return'],
                icon: icon_swal,
                button: 'Fechar'
                })
            ShowModalCaracOs()
            DragLeaveFabOs(event)
        },
        failure: function (error) {
        },
    });

}

function ColorButtonTrash(event, color){
    event.preventDefault()
    let button = document.getElementById('btn_thrash_fab_os')
    button.style.backgroundColor = color
}

function DragStartFabOs(event, id_fab_os){
    event.dataTransfer.setData('id_fab_os', id_fab_os)
}

function DropFabOsInTrash(event){
    event.preventDefault()
    let id_fab_os = event.dataTransfer.getData('id_fab_os')
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(id_fab_os !== ""){
        $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/RegisterOrDeleteFabOs/" + id_fab_os + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                swal({
                    title: "Sucesso!!",
                    text: data['return'],
                    icon: 'success',
                    button: 'Fechar'
                    })
                ShowModalCaracOs()
            },
            failure: function (error) {
            },
        });
    }
    else{
        swal({
            title: "Atenção!",
            text: 'Só podemos remover Fabricantes da Os!!',
            icon: "warning",
            button: 'Fechar'
        })
    }
    ColorButtonTrash(event, 'gray')
}

function GetAndVerifyDatasBobinas(){
    let isol = $('#isolacao_bobina').val()
    let class_isol = $('#class_isol_bobina').val()
    let formacao = document.getElementById('formacao_bobina').selectedOptions[0]
    let secao = $('#secao_bobina').val()
    let tipo_formacao = $('#tipo_formacao_bobina').val()
    let fabricante = $('#fabricante_bobina').val()
    let comprimento = document.getElementById('comprimento_bobina').value
    let cod_a1 = document.getElementById('coda1_bobina').value
    let bobina_selected = document.getElementById('bobina_selected').value !== ''? document.getElementById('bobina_selected').value:null
    var invalid_fields = []
    if (isol === '0' || isol === null){
        invalid_fields.push('Isolação')
    }

    if (class_isol === '0' || class_isol === null){
        invalid_fields.push('Classe de Isolação')
    }

    if (formacao.value === '0' || formacao.value === null){
        invalid_fields.push('Formação')
    }

    if (secao === '0' || secao === null){
        invalid_fields.push('Seção')
    }

    if(fabricante === '0' || fabricante === null){
        invalid_fields.push('Fabricante')
    }

    if(comprimento.length > 0){
        if(isNaN(Number(comprimento))){
            invalid_fields.push('Comprimento')
        }
    }
    else{
        invalid_fields.push('Comprimento')
    }

    if(cod_a1.length === 0 || cod_a1.length === null){
        invalid_fields.push('Cod.A1')
    }

    if(invalid_fields.length === 0){
        return {
            'isol': isol,
            'class_isol': class_isol,
            'formacao': formacao.value,
            'tipo_formacao': tipo_formacao,
            'secao': secao,
            'fabricante': fabricante,
            'cod_a1': cod_a1,
            'comprimento': comprimento,
            'bobina_selected': bobina_selected
        }
    } else {
        return invalid_fields.join(', ')
    }
}

function SendDatasBobinas(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let datas_bobinas = GetAndVerifyDatasBobinas()
    if(typeof datas_bobinas === "string"){
        return swal({
                    title: "Atenção!",
                    text: 'Campos invalidos: ' + datas_bobinas,
                    icon: "warning",
                    button: 'Fechar'
                })
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/RegisterOrUpdateBobinas/",
        dataType: 'json',
        data: {'datas_bobinas': JSON.stringify(datas_bobinas)},
        success: function (data) {
            let icon_swal = !data['return']['error']?'success':'error'
            swal({
                title: false,
                text: data['return']['msg_return'],
                icon: icon_swal,
                button: false
            })
            if(!data['return']['error']){
                document.getElementsByClassName('swal-button--confirm')[0].onclick = ReloadPageBobina
            }
        },
        failure: function (error) {
        },
    });

}

function DeselectBobinas(){
    let all_trs = document.getElementsByClassName('saidas_existentes')
    for (let i = 0; i < all_trs.length; i++){
        if(Array.from(all_trs[i].classList).includes('bobina_select')){
            all_trs[i].classList.remove('bobina_select')
        }
    }
}

function OnClickBobinaCadastrada(id_bobina, element_tr){
    DeselectBobinas()
    element_tr.classList.add('bobina_select')
    document.getElementById('bobina_selected').value = id_bobina
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/DatasBobinaSelected/" + id_bobina + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillFormsBobinaExists(data)
        },
        failure: function (error) {
        },
    });
}


function FillFormsBobinaExists(datas_bobina){
    console.log(datas_bobina)
    $('#isolacao_bobina').val(datas_bobina['isol'])
    $('#class_isol_bobina').val(datas_bobina['class_isol'])
    $('#formacao_bobina').val(datas_bobina['formacao'])
    $('#secao_bobina').val(datas_bobina['secao'])
    document.getElementById('tipo_formacao_bobina').value = datas_bobina['tipo_formacao']
    document.getElementById('coda1_bobina').value = String(datas_bobina['cod_a1']).slice('0','-1')
    document.getElementById('fabricante_bobina').value = datas_bobina['fabricante']
    document.getElementById('comprimento_bobina').value = datas_bobina['comprimento']
}

function DeleteBobina(id_bobina){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "DELETE",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/DatasBobinaSelected/" + id_bobina + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            swal({
                title: "Sucesso!",
                text: data['return'],
                icon: "success",
                button: 'Fechar'
            })
            document.getElementsByClassName('swal-button--confirm')[0].onclick = ReloadPageBobina
        },
        failure: function (error) {
        },
    });
}

function ReloadPageBobina(){
    window.location.reload()
}

// --------------------- Função para converter o tamanho para bytes ---------------------//
function FormatNumberToBytes(bytes, decimal = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimal < 0 ? 0 : decimal
    const tamanho = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${tamanho[i]}`
}

let formFileBobinas = new FormData();

// --------------------- Função para cadastrar bobinas ---------------------//
function sendCoilsToRegister() {
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

    if ($('#xlsx-bobinas').find('#image_xls_bobinas').length !== 0){
        $.ajax({
            url: "/app/eletrica/a1pro/Bobinas/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: formFileBobinas, // Envia form pela solicitação do POST
            processData: false,
            contentType: false,
            beforeSend: function(){
                document.getElementById("progress-box-bobinas").hidden = false;
                $('#gif_progress_bobinas')[0].hidden = false
                $('#gif_success_bobinas')[0].hidden = true
            },
            success: function (data) {
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBarBobinas.initProgressBar(progressUrl, {
                    progressBarId: 'progress-bar-bobinas',
                    progressBarMessageId: 'progress-bar-message-bobinas',
                    onSuccess: customSucess,
                    onError: customError,
                    onProgress: onProgressCustom
                })
                function customSucess(progressBarElement, progressBarMessageElement, result){
                    $('#gif_progress_bobinas')[0].hidden = true
                    $('#gif_success_bobinas')[0].hidden = false
                    let chave = Object.keys(result)[0];
                    let valor = result[chave];
                    console.log(result)

                    if (chave === 'success') {
                        progressBarMessageElement.innerHTML = "Sucesso";
                        progressBarElement.style.backgroundColor = '#76ce60';

                        // Argumentos possíveis (tipo, mensagem, timeout em milissegundos)
                        swalAlert(false, valor, chave, false);
                    } else {
                        progressBarMessageElement.innerHTML = "Houve um erro inesperado!";
                        progressBarElement.style.backgroundColor = '#dc4f63';
                        if (Array.isArray(valor)) {
                            valor = valor.join(', \n');
                        }

                        // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                        swalAlert(false, valor, chave, false);
                        $('div.swal-text').addClass('font_size_0_8 list-tags-cabo-container')
                    }

                    setTimeout(()=>{
                        document.getElementById("progress-box-bobinas").hidden = true;
                    }, 3000);
                }

                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                      $('#load_gif_bobinas')[0].style.width = progress.percent + "%";
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';

                      setTimeout(() => {
                            document.getElementById("progress-box-bobinas").hidden = true
                            $('#gif_progress_bobinas')[0].hidden = true
                            $('#gif_success_bobinas')[0].hidden = true
                      }, 2000)
                }
            }
        });
    } else {
        // Argumentos possíveis (tipo, mesagem, timeout(milisegundos))
        messageNotification('error','Faça o upload de um arquivo para continuar!')
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


// --------------------- Altert para notificar usuario do erro ---------------------//
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


// --------------------- Classe para receber respostas do celery ---------------------//
let CeleryProgressBarBobinas = (function () {
    function onSuccessDefault(progressBarElement, progressBarMessageElement, result) {
        progressBarElement.style.backgroundColor = '#76ce60';
        progressBarMessageElement.innerHTML = "Success!";
    }

    function onResultDefault(resultElement, result) {
        if (resultElement) {
            resultElement.innerHTML = result;
        }
    }

    function onErrorDefault(progressBarElement, progressBarMessageElement, excMessage) {
        progressBarElement.style.backgroundColor = '#dc4f63';
        progressBarMessageElement.innerHTML = "Uh-Oh, something went wrong! " + excMessage;
    }

    function onProgressDefault(progressBarElement, progressBarMessageElement, progress) {
        progressBarElement.style.backgroundColor = '#68a9ef';
        progressBarElement.style.width = progress.percent + "%";
        var description = progress.description || "";
        progressBarMessageElement.innerHTML = progress.current + ' de ' + progress.total + ' processado. ' + description;
    }

    function updateProgress (progressUrl, options) {
        options = options || {};
        var progressBarElement = options.progressBarElement || document.getElementById(options.progressBarId);
        var progressBarMessageElement = options.progressBarMessageElement || document.getElementById(options.progressBarMessageId);
        var onProgress = options.onProgress || onProgressDefault;
        var onSuccess = options.onSuccess || onSuccessDefault;
        var onError = options.onError || onErrorDefault;
        var pollInterval = options.pollInterval || 500;
        var resultElementId = options.resultElementId || 'celery-result';
        var resultElement = options.resultElement || document.getElementById(resultElementId);
        var onResult = options.onResult || onResultDefault;


        fetch(progressUrl).then(function(response) {
            response.json().then(function(data) {
                if (data.progress) {
                    onProgress(progressBarElement, progressBarMessageElement, data.progress);
                }
                if (!data.complete) {
                    setTimeout(updateProgress, pollInterval, progressUrl, options);
                } else {
                    if (data.success) {
                        onSuccess(progressBarElement, progressBarMessageElement, data.result);
                    } else {
                        onError(progressBarElement, progressBarMessageElement, data.result);
                    }
                    if (data.result) {
                        onResult(resultElement, data.result);
                    }
                }
            });
        });
    }
    return {
        onSuccessDefault: onSuccessDefault,
        onResultDefault: onResultDefault,
        onErrorDefault: onErrorDefault,
        onProgressDefault: onProgressDefault,
        initProgressBar: updateProgress,  // just for api cleanliness
    };
})();

// --------------------- Função para adicionar classes ao soltar arquivo sobre dropzone ---------------------//
jQuery(document).ready(function($) {
    // Ao arrastar o cursor com arquivo sobre o campo dropzone as bordas aumentam
    $('#drop-area-xlsx-bobinas').on('dragover', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).addClass('upload-hover');
    })

    // Ao retirar o cursor com arquivo sobre o campo dropzone as bordas diminuem
    $('#drop-area-xlsx-bobinas').on('dragleave', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).removeClass('upload-hover');
    })

    // Ao soltar o arquivo sobre o campo chama a função DropArquivo passando os parâmetros
    $('#drop-area-xlsx-bobinas').on('drop', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $(this).removeClass('upload-hover');
      let file_xls = event.originalEvent.dataTransfer;
      // A função abaixo altera o conteudo do campo dropdown
      dropArquivo('arquivo_xlsx_bobinas','drop-area-xlsx-bobinas','xlsx-bobinas',file_xls)
    })
});

function DownloadBobina() {
    debugger;
    $('#baixar-bobinas').off('click').on('click', function (e) {
        const btn = $(this);
        btn.prop('disabled', true).text('Gerando...');
        $.ajax({
            url: '/app/eletrica/a1pro/Bobinas/Download',
            method: 'GET',
            xhr: function () {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                return xhr;
            },
            success: function(response, status, xhr) {
                const blob = new Blob([response], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });

                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'Download_bobinas.xlsx';

                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(link.href);
            },
            error: function(xhr, status, error) {
                alert('Erro ao gerar o arquivos');
            },
            complete: function() {
                btn.prop('disabled', false).text('Baixar Bobinas');


            }

        });
    });
}

$(document).ready(function () {
    DownloadBobina();
});


