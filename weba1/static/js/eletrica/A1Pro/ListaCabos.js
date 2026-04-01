window.onload = ChangeCheckBoxTypeDistancia('not-value')

function ChangeCheckBoxTypeDistancia(value){
    var AllCheckBox = document.querySelectorAll('[name="OptionsDistListCabos"]')
    for (let i = 0; i < AllCheckBox.length; i++){
        if(AllCheckBox[i].value === value){
            AllCheckBox[i].checked = true
            $('#ContentDist-'+value).show()
        }
        else{
            AllCheckBox[i].checked = false
            $('#ContentDist-'+AllCheckBox[i].value).hide()
        }
    }
}

function FillDatasCarga(id_lig){
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/DatasCargaListCabos/" + id_lig + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            FillFormsDatasCarga(data['DatasCarga'])
        },
        failure: function(error){
        },
    })
}

function FillFormsDatasCarga(datas_carga){
    document.getElementById('PotenciaCargaListCabos').value = datas_carga['pot']
    document.getElementById('TensaoCargaListCabos').value = datas_carga['tensao']
    document.getElementById('FuncaoCargaListCabos').value = datas_carga['func']
    document.getElementById('TpartidaCargaListCabos').value = datas_carga['tipo_partida']
    document.getElementById('DescCargaListCabos').value = datas_carga['desc']
    document.getElementById('StatusLigListaCabos').value = datas_carga['status_lig']
}

function FillDatasCabo(id_cabo){
    document.getElementById("id_oculto_cabo").value = id_cabo
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/DatasCaboListCabos/" + id_cabo + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            FillFormsDatasCabo(data['DatasCabo'])
        },
        failure: function(error){
        },
    })
}

function FillFormsDatasCabo(datas_cabo){
    document.getElementById('TagCargaListCabos').value = datas_cabo['tag_carga']
    document.getElementById('CubGavCargaListCabos').value = datas_cabo['gav_carga']
    document.getElementById('TagAliListCabos').value = datas_cabo['tag_ali']
    document.getElementById('CubGavAliListCabos').value = datas_cabo['gav_ali']
    document.getElementById('ClassIsolListCabos').value = datas_cabo['class_isol']
    document.getElementById('IsolListCabos').value = datas_cabo['isol']
    document.getElementById('FormacaoListCabos').value = datas_cabo['formacao']
    document.getElementById('SecListCabos').value = datas_cabo['secao']
    document.getElementById('QuantCabosListCabos').value = datas_cabo['quant']
    document.getElementById('FormacaoFTagListCabos').value = datas_cabo['form_f_tag']
    document.getElementById('DistCalcListCabos').value = datas_cabo['dist_calc']
    document.getElementById('DistRotaPdms').value = datas_cabo['dist_rota']
    document.getElementById('RotaListCabos').value = datas_cabo['rota']
    document.getElementById('bobina').value = datas_cabo['bobina']
    document.getElementById('DistTipoInstalacao').value = datas_cabo['tipo_instalacao']
    document.getElementById('DistTipoInstalacaoManual').value = datas_cabo['tipo_instalacao_man']
    document.getElementById('CheckComElet').checked = datas_cabo['comp_elet_check']
    document.getElementById('DistCompElet').value = datas_cabo['comp_elet']
    document.getElementById('CompoEletManual').value = datas_cabo['com_elet_manual']
    document.getElementById('DistManualListCabos').value = datas_cabo['dist_manual']
    document.getElementById('CheckBoxDistManualListCabos').checked = datas_cabo['dist_manual_checked']
    document.getElementById('CheckBoxTipoInstalacao').checked = datas_cabo['tipo_instalacao_check']
}

async function FillLigsPerTypeEqp(tipo_eqp){
    debugger;
    ClearListaCabos(false)
    edit_modal('modal_load_a1pro', 'Fazendo a pesquisa...', true)
    document.querySelectorAll("div.position-relative > *")[0].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[0].classList.add('animate__zoomIn')
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    $.ajax({

        type: "GET",
        url: "/app/eletrica/a1pro/LigsInListCabos/",
        dataType: 'json',
        data: {'TIPOEQUIP': tipo_eqp},
        success: function (data){
            FillSelectLigsListCabos(data['AllLigs'])

            setTimeout(()=> {$('#modal_load_a1pro').modal('hide')}, 500)

            document.querySelectorAll("div.position-relative > *")[0].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
            document.querySelectorAll("div.position-relative > *")[0].classList.remove('animate__zoomIn')
            document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')

        },
        failure: function(error){
        },
    })


}
function OnClickCargaListCabos(id_lig){
    FillCabosListCabos(id_lig)
    FillDatasCarga(id_lig)
    ClearDatasCaboListaCabos()
    countItemsListaDest()
}
function FillCabosListCabos(id_lig){
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/CabosInLigListCabos/" + id_lig + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            FillSelectCabosListCabos(data['AllCabosInLig'])
        },
        failure: function(error){
        },
    })
}

function FillSelectCabosListCabos(all_cabos){
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    var options_select_cabos = ``
    for(let id_cabo in all_cabos){
        options_select_cabos += `<option value="${id_cabo}" onclick="FillDatasCabo(${id_cabo})">${all_cabos[id_cabo]}</option>`
    }
    $('#ListCabosCabosSearchSelect').html(options_select_cabos)
    setTimeout(()=>{
        document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
        document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')
    }, 500)
}

async function FillSelectLigsListCabos(list_all_ligs){
    var options_select = ``
    for(let i = 0; i < list_all_ligs.length; i++){
        options_select += `<option value=${list_all_ligs[i]['id']} onclick="OnClickCargaListCabos(${list_all_ligs[i]['id']});"> ${list_all_ligs[i]['lig']}</option>`
    }
    $('#ListCabosCargasSearchSelect').html(options_select)
}

function CreateTagsCabosInOs(){
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/CreateTagsInOs/",
        dataType: 'json',
        data: {},
        success: function (data){
            var progressUrl = `/celery-progress/${data["task_id"]}/`
            CeleryProgressBar.initProgressBar(progressUrl, {
              progressBarId: 'progress-bar-list-cabos',
              progressBarMessageId: 'progress-bar-message-list-cabos',
              onSuccess: customSucess,
              onError: customError,
              onProgress: customProgress,
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

            function customProgress(progressBarElement, progressBarMessageElement, progress){
                progressBarElement.style.backgroundColor = '#68a9ef';
                progressBarElement.style.width = progress.percent + "%";
                var description = progress.description || "";
                progressBarMessageElement.innerHTML = description
            }
        },
        failure: function(error){
        },
    })
}

function ClearDatasCargaListaCabos(){
    document.getElementById('PotenciaCargaListCabos').value = ''
    document.getElementById('TensaoCargaListCabos').value = ''
    document.getElementById('FuncaoCargaListCabos').value = ''
    document.getElementById('TpartidaCargaListCabos').value = ''
    document.getElementById('DescCargaListCabos').value = ''
    document.getElementById('StatusLigListaCabos').value = ''
}

function ClearDatasCaboListaCabos(){
    document.getElementById("id_oculto_cabo").value = ''
    document.getElementById('TagCargaListCabos').value = ''
    document.getElementById('CubGavCargaListCabos').value = ''
    document.getElementById('TagAliListCabos').value = ''
    document.getElementById('CubGavAliListCabos').value = ''
    document.getElementById('ClassIsolListCabos').value = ''
    document.getElementById('IsolListCabos').value = ''
    document.getElementById('FormacaoListCabos').value = ''
    document.getElementById('SecListCabos').value = ''
    document.getElementById('QuantCabosListCabos').value = ''
    document.getElementById('FormacaoFTagListCabos').value = ''
    document.getElementById('CheckBoxDistManualListCabos').checked = false
    document.getElementById('CheckBoxTipoInstalacao').checked = false
    document.getElementById('CheckComElet').checked = false
    document.getElementById('DistManualListCabos').value = ''
    document.getElementById('RotaListCabos').value = ''
    document.getElementById('DistCalcListCabos').value = ''
    document.getElementById('DistRotaPdms').value = ''
    document.getElementById('RotaListCabos').value = ''
    document.getElementById('DistTipoInstalacao').value = ''
    document.getElementById('DistTipoInstalacaoManual').value = ''
    document.getElementById('DistCompElet').value = ''
    document.getElementById('CompoEletManual').value = ''

}

function ClearListaCabos(all){
    if (all){
        $('#ListCabosCargasSearchSelect').html(``)
        $('#ListCabosCabosSearchSelect').html(``)
    }
    ClearDatasCargaListaCabos()
    ClearDatasCaboListaCabos()
}

function GetDatasCabo(){
    let id_cabo = document.getElementById("id_oculto_cabo").value
    var dist_manual = document.getElementById('DistManualListCabos').value
    var dist_tipo_instalacao = document.getElementById('DistTipoInstalacaoManual').value
    var dist_comp_elet_manual = document.getElementById('CompoEletManual').value
    var rota = document.getElementById('RotaListCabos').value
    var error = []
    var checkbox_dist_manual = 0
    var checkbox_tipo_inst = 0
    var checkbox_comp_elet = 0
    var id_lig = $('#ListCabosCargasSearchSelect').val()[df_index_first_element_array]
    if(id_lig === undefined){
        error.push('Selecione uma ligação para fazer suas manipulações!')
    }
    if(document.getElementById('CheckBoxDistManualListCabos').checked){
        checkbox_dist_manual = 1
    }
    if(document.getElementById('CheckBoxTipoInstalacao').checked){
        checkbox_tipo_inst = 1
    }
    if(document.getElementById('CheckComElet').checked){
        checkbox_comp_elet = 1
    }

    if(rota.length === 0){
        rota = null
    }

    if(dist_manual.length>0){
        if(isNaN(Number(dist_manual))){
            error.push('Campo de distancia manual só aceita numeros!!')
        }
    }
    else{
        dist_manual = null
    }

    if(error.length === 0){
        return {'dist_manual': dist_manual, 'rota': rota,
                'dist_manual_checkbox': checkbox_dist_manual, 'id_lig': id_lig,
                'id_cabo': id_cabo, 'dist_comp_elet_manual': dist_comp_elet_manual,
                'dist_tipo_instalacao': dist_tipo_instalacao,
                'checkbox_tipo_inst': checkbox_tipo_inst,
                'checkbox_comp_elet': checkbox_comp_elet
                }
    }
    else{
        return error.join(', ')
    }
}

function SendDatasCaboBack(){
    debugger;
    var datas_cabo = GetDatasCabo()
    if(typeof datas_cabo === "string"){
        return alert(datas_cabo)
    }

    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "POST",
        headers:{'X-CSRFToken':csrftoken},
        url: "/app/eletrica/a1pro/InfoCabosInLigListCabos/" + datas_cabo['id_lig'] + "/" + datas_cabo['id_cabo'] + "/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(datas_cabo)},
        success: function (data){
            alert(data['return'])
        },
        failure: function(error){
        },
    })

}

function DistanciasLig(id_lig){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    document.querySelectorAll("div.position-relative > *")[2].style.visibility=''
    document.querySelectorAll("div.position-relative > *")[2].classList.add('animate__zoomIn')
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/DistanciasInLig/" + id_lig + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillDistanciasLig(data['datas_dist_lig'])
            setTimeout(()=>{
                document.querySelectorAll("div.position-relative > *")[2].style.visibility='hidden'
                document.querySelectorAll("div.position-relative > *")[2].classList.remove('animate__zoomIn')
            }, 500)
        },
        failure: function (error) {
        },
    });
}

function FillDistanciasLig(dist_lig){

    document.getElementById('CheckBoxDistManualListCabos').checked = dist_lig['dist_manual_checked']
    document.getElementById('CheckBoxTipoInstalacao').checked = dist_lig['tipo_instalacao_check']
    document.getElementById('CheckComElet').checked = dist_lig['comp_elet_check']
    document.getElementById('DistManualListCabos').value = dist_lig['dist_manual']
    document.getElementById('DistRotaPdms').value = dist_lig['dist_rota']
    document.getElementById('DistTipoInstalacao').value = dist_lig['tipo_instalacao']
    document.getElementById('DistTipoInstalacaoManual').value = dist_lig['tipo_instalacao_man']
    document.getElementById('RotaListCabos').value = dist_lig['rota']
    document.getElementById('DistCompElet').value = dist_lig['comp_elet']
    document.getElementById('CompoEletManual').value = dist_lig['com_elet_manual']

}

function ExportLc(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let cols_selected = GetColsSelectedExportLc()
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ExportLc/",
        dataType: 'json',
        data: {'cols_selected': JSON.stringify(cols_selected)},
        success: function (data) {
            $('#modal_select_cols').modal('hide')
            InitProgressBarLc(data['task_id'])
        },
        failure: function (error) {
        },
    });
}


function ExportRotasA1pro(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ExportRotasA1Pro/",
        dataType: 'json',
        success: function (data) {
            InitProgressBarLc(data['task_id'])
        },
        failure: function (error) {
        },
    });
}

function ExportRotasE3d(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ExportRotasE3d/",
        dataType: 'json',
        success: function (data) {
            InitProgressBarLc(data['task_id'])
        },
        failure: function (error) {
        },
    });
}


function ExportLcPdms(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ExportLcPdms/",
        dataType: 'json',
        data: {},
        success: function (data) {
            InitProgressBarLc(data['task_id'])
        },
        failure: function (error) {
        },
    });
}

function InitProgressBarLc(id_task){
    var progressUrl = `/celery-progress/${id_task}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
      progressBarId: 'progress-bar-list-cabos',
      progressBarMessageId: 'progress-bar-message-list-cabos',
      onSuccess: customSucess,
      onError: customError,
      onProgress: customProgress,
    })

    function customSucess(progressBarElement, progressBarMessageElement, result){
        progressBarElement.style.backgroundColor = '#76ce60';
        progressBarMessageElement.innerHTML = 'Exportado!!'
        window.open('/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + id_task + '/', '_self')
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

function GetColsSelectedExportLc(){
    var checkeds = []
    let all_checkbox = document.getElementsByName('cols_export_lc')
    for(let i = 0; i < all_checkbox.length; i++){
        if(all_checkbox[i].checked){
            checkeds.push(all_checkbox[i].value)
        }
    }
    return checkeds
}

function ClearColsSelectedExportLc(){
    let all_checkbox = document.getElementsByName('cols_export_lc')
    for(let i = 0; i < all_checkbox.length; i++){
        all_checkbox[i].checked = false
    }
}

function ShowModalSelectCols(){
    debugger;
    ClearColsSelectedExportLc()
    $('#modal_select_cols').modal('show')
}

const selectOrigemListaCabos = document.getElementById("ListCabosCargasSearchSelect");
selectOrigemListaCabos.addEventListener("keydown", (event) => {
    let id_cabo = selectOrigemListaCabos.options[selectOrigemListaCabos.selectedIndex].value
    if (event.key === "ArrowUp" && id_cabo !== '') {
        id_cabo = selectOrigemListaCabos.options[selectOrigemListaCabos.selectedIndex-1].value
        OnClickCargaListCabos(id_cabo);
    } else if (event.key === "ArrowDown" && id_cabo !== '') {
        id_cabo = selectOrigemListaCabos.options[selectOrigemListaCabos.selectedIndex+1].value
        OnClickCargaListCabos(id_cabo);
    }
});

const selectDestinoListaCabos = document.getElementById("ListCabosCabosSearchSelect");
selectDestinoListaCabos.addEventListener("keydown", (event) => {
    let id_cabo = selectDestinoListaCabos.options[selectDestinoListaCabos.selectedIndex].value
    if (event.key === "ArrowUp" && id_cabo !== '') {
        id_cabo = selectDestinoListaCabos.options[selectDestinoListaCabos.selectedIndex-1].value
        FillDatasCabo(id_cabo);
    } else if (event.key === "ArrowDown" && id_cabo !== '') {
        id_cabo = selectDestinoListaCabos.options[selectDestinoListaCabos.selectedIndex+1].value
        FillDatasCabo(id_cabo);
    }
});