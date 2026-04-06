function GetAndVerifyDatasTiposMat(){
    let nome = document.getElementById('nome_tipo_mat_fc').value
    let fix = $('#fix_tipo_mat_fc').val()
    let tipo_select = $('#all_tipos_mat_fc').val()[0]!==undefined?$('#all_tipos_mat_fc').val()[0]:null
    var list_errors = []
    if(nome.length === 0){
        list_errors.push('Nome')
    }
    else{
        if(VerifyTipoMatExists(nome)){
            list_errors.push('Nome')
        }
    }

    if(fix === '0'){
        list_errors.push('Fixação')
    }

    if(list_errors.length === 0){
        return {
            'nome': nome,
            'fix': fix,
            'tipo_selected': tipo_select
        }
    }
    else{
        return 'Campos Inválidos: ' + list_errors.join(' e ')
    }
}

function VerifyTipoMatExists(tipo){
    let options_tipo = document.getElementById('fix_tipo_mat_fc').options
    let exists = false
    for(let i = 0; i < options_tipo.length; i++){
        if(options_tipo[i].value === tipo){
            exists = true
            break
        }
    }
    return exists
}

function SaveDatasTiposMatFc(){
    let datas_tipos_mat = GetAndVerifyDatasTiposMat()
    if(typeof datas_tipos_mat === "string"){
        return SwitchAlertCTFC(datas_tipos_mat, true)
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftokenctfc},
        url: "TiposMaterialForcaControle/",
        dataType: 'json',
        data: {},
        success: function (data) {

        },
        failure: function (error) {
        },
    });
}

function FillAllFieldsInModalConfigMatFc(){

}

function RequestAllTiposMatFc(){

}