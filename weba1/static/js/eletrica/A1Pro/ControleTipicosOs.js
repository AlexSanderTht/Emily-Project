// const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
async function ChangeSusControleTipicosOs(option_selected, inner_html){
    if(option_selected !== '0'){
        var id_select
        if(option_selected === 'PERFIS DE FIXAÇÃO' || option_selected === 'PERFIS DE SUSTENTAÇÃO'){
            document.getElementById('controle_tipicos_os_content_items').hidden = false
            document.getElementById('controle_tipicos_os_content_tipos').hidden = true
            id_select = 'controle_tipicos_os_items'
        }
        else{
            document.getElementById('controle_tipicos_os_content_items').hidden = true
            document.getElementById('controle_tipicos_os_content_tipos').hidden = false
            id_select = 'controle_tipicos_os_tipos'
        }
        FilterSelectForTitleControleTipicosOs(id_select, option_selected)
        await FillDatasExistsInSusOsGerenciarTipicosOs(inner_html)
    }
    else{
        document.getElementById('controle_tipicos_os_content_items').hidden = true
        document.getElementById('controle_tipicos_os_content_tipos').hidden = true
    }
}

function FilterSelectForTitleControleTipicosOs(id_select, title){
    let options_select = document.getElementById(id_select).options
    for (let i = 0; i <options_select.length;i++){
        if(options_select[i].value !== '0'){
            if(options_select[i].title === title){
                options_select[i].hidden = false
            }
            else{
                options_select[i].hidden = true
            }
        }
    }
}

async function ChangeTipoControleTipicosOs(tipo_selected){
    if(tipo_selected !== '0'){
        let items = await RequestItemsInTipo(tipo_selected)
        let str_html_content_items_in_tipo = ``
        for (let i = 0; i <items.length;i++){
            str_html_content_items_in_tipo += `<div class="col-12">${items[i]}</div>`
        }
        document.getElementById('controle_tipicos_os_items_in_tipo').innerHTML = str_html_content_items_in_tipo
        document.getElementById('controle_tipicos_os_items_in_tipo_content').hidden = false
    }
    else{
        document.getElementById('controle_tipicos_os_items_in_tipo').innerHTML = ''
        document.getElementById('controle_tipicos_os_items_in_tipo_content').hidden = true
    }
}

async function RequestItemsInTipo(tipo){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ControleTipicosOs/ItemsInTiposControleTipicosOs/" + tipo + "/",
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

function GetDatasForSendControleTipicosOs(){
    let sus = document.getElementById('controle_tipicos_os_sus').selectedOptions[0].innerHTML
    let msg_return = null
    if(sus !== '0'){
        var item = null
        var tipo = null
        if(sus === 'PERFIS DE FIXAÇÃO' || sus === 'PERFIS DE SUSTENTAÇÃO'){
            item = $('#controle_tipicos_os_items').val()
            if(item === '0'){
                msg_return = 'Selecione um Item!!'
            }
        }
        else{
            tipo = $('#controle_tipicos_os_tipos').val()
            if(tipo === '0'){
                msg_return = 'Selecione um Tipo!!'
            }
        }
    }
    else{
        msg_return = 'Selecione uma Sustentação!!'
    }

    if(msg_return === null){
        return {'sus': sus,
                'item': item,
                'tipo': tipo}
    }
    else{
        return msg_return
    }
}

function SendDatasControleTipicosOs(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let datas_forms = GetDatasForSendControleTipicosOs()
    if(typeof datas_forms === "string"){
        return SwitchAlertA1Pro(datas_forms, true)
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ControleTipicosOs/",
        dataType: 'json',
        data: {'datas_front': JSON.stringify(datas_forms)},
        success: function (data) {
            SwitchAlertA1Pro(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function RequestDatasSusInOsGerenciarTipicosOs(sus){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ControleTipicosOs/DatasInSusControleTipicosOs/",
        dataType: 'json',
        data: {'sus': sus},
        success: function (data) {
            datas_return = data['datas']
        },
        failure: function (error) {
        },
    });
    return datas_return
}


async function FillDatasExistsInSusOsGerenciarTipicosOs(sus){
    let datas_sus = await RequestDatasSusInOsGerenciarTipicosOs(sus)
    if(sus === 'PERFIS DE FIXAÇÃO' || sus === 'PERFIS DE SUSTENTAÇÃO'){
        let item = datas_sus['item'] === null?{'selection': '0', 'disabled': true}:{'selection': datas_sus['item'], 'disabled': false}
        $('#controle_tipicos_os_items').val(item['selection'])
        document.getElementById('controle_tipicos_os_btn_del').disabled = item['disabled']
    }
    else{
        let tipo = datas_sus['tipo'] === null?{'selection': '0', 'disabled': true}:{'selection': datas_sus['tipo'], 'disabled': false}
        $('#controle_tipicos_os_tipos').val(tipo['selection'])
        await ChangeTipoControleTipicosOs(tipo['selection'])
        document.getElementById('controle_tipicos_os_btn_del').disabled = tipo['disabled']
    }
}

function DeleteDatasSusControleTipicosOs(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let sus = $('#controle_tipicos_os_sus').val()
    $.ajax({
        type: "DELETE",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/ControleTipicosOs/DatasInSusControleTipicosOs/" + sus + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            SwitchAlertA1Pro(data['return'])
            document.getElementById('controle_tipicos_os_btn_del').disabled = true
        },
        failure: function (error) {
        },
    });
}

