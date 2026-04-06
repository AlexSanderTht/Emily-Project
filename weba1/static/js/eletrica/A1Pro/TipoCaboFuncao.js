const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
async function RequestTipoCaboFunc(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/TipoCaboFunc/",
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

async function FillAllTiposCabo(){
    let array_all_tipos_cabo = await RequestTipoCaboFunc()
    var options_html = ``
    for(let i = 0; i < array_all_tipos_cabo.length; i++){
        options_html += `<option value="${array_all_tipos_cabo[i]['id']}" title="${array_all_tipos_cabo[i]['sigla']}" onclick="ClickTipoFuncExists(${array_all_tipos_cabo[i]['id']})">${array_all_tipos_cabo[i]['nome']}</option>`
    }
    document.getElementById('all_tipo_cabo').innerHTML = options_html
}

async function ShowModalTpcFunc(){
    await FillAllTiposCabo()
    $('#modal_tipo_cabo_func').modal('show')
}

function ClickTipoFuncExists(id_selected){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/DatasTipoCaboFunc/" + id_selected + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillFormsTipoCaboFunc(data['return'])
        },
        failure: function (error) {
        },
    });
}

function FillFormsTipoCaboFunc(datas_tc){
    document.getElementById('nome_tipo_cabo').value = datas_tc['nome']
    document.getElementById('sigla_tipo_cabo').value = datas_tc['sigla']
}

function GetDatasTipoCaboFunc(){
    let nome = document.getElementById('nome_tipo_cabo').value
    let sigla = document.getElementById('sigla_tipo_cabo').value
    let tipo_cabo_selected = $('#all_tipo_cabo').val()[0] === undefined ? null : $('#all_tipo_cabo').val()[0]
    var errors = []

    if(sigla.length > 0 && sigla.length <= 5){
        if(VerifySiglaExists(sigla, tipo_cabo_selected)){
            errors.push('Sigla')
        }
    }
    else{
        errors.push('Sigla')
    }

    if(nome.length === 0){
        errors.push('Nome')
    }

    if(errors.length > 0){
        return "Campos inválidos: " + errors.join(' e ')
    }
    else{
        return {
            'nome': nome,
            'sigla': sigla,
            'selected': tipo_cabo_selected
        }
    }
}

async function SendDatasTipoCaboFunc(){
    let datas_tpc = GetDatasTipoCaboFunc()
    if(typeof datas_tpc === "string"){
        SwitchAlertA1Pro(datas_tpc, true)
    }
    await $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/TipoCaboFunc/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify(datas_tpc)},
        success: function (data) {
            SwitchAlertA1Pro(data['return'])
            FillAllTiposCabo()
        },
        failure: function (error) {
        },
    });
}

function VerifySiglaExists(sigla, id_not_verif){
    let all_options = document.getElementById('all_tipo_cabo').options
    let sigla_exists = false
    for(let i = 0; i < all_options.length; i++){
        if(id_not_verif !== null){
            if(all_options[i].value !== id_not_verif){
                if(all_options[i].title === sigla){
                    sigla_exists = true
                    break
                }
            }

        }
        else{
            if(all_options[i].title === sigla){
                sigla_exists = true
                break
            }
        }

    }
    return sigla_exists
}

function DeleteTipoCabo(){
    let tipo_cabo_selected = $('#all_tipo_cabo').val()[0]
    if(tipo_cabo_selected !== undefined){
        $.ajax({
            type: "DELETE",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/eletrica/a1pro/DatasTipoCaboFunc/" + tipo_cabo_selected + "/",
            dataType: 'json',
            data: {},
            success: function (data) {
                SwitchAlertA1Pro(data['return'])
            },
            failure: function (error) {
            },
        });
    }
}

function FilterTipoCabo(inner_html){
    let all_options = document.getElementById('all_tipo_cabo').options
    for(let i = 0; i < all_options.length; i++){
        let hidden = true
        if(all_options[i].innerHTML.toUpperCase().includes(inner_html.toUpperCase())){
            hidden = false
        }
        all_options[i].hidden = hidden
    }
}

function ClearTipoCabo(){
    FillFormsTipoCaboFunc({'nome': '', 'sigla': ''})
    document.getElementById('search_tipo_cabo').value = ''
    FilterTipoCabo('')
    $('#all_tipo_cabo').val(0)
}