async function GetAllTiposAli(){
    let request = await $.ajax({
        url: "/app/eletrica/a1pro/AllTiposAli/",
        method: "GET",
        data: {}
    })
    return request
}

function CreateSelectTiposLig(AllLigs){
    var options_select = ``
    for(let Id in AllLigs){
        options_select += `<option value="${Id}" onclick="TipoAliSelected(${Id})">${AllLigs[Id]}</option>`
    }
    $('#type-lig-all-types').html(options_select)
}

async function GetDatasTipoAliSelected(Id, Method){
    let request = await $.ajax({
        url: "/app/eletrica/a1pro/DatasTipoAlimentacaoSelected/" + Id + "/",
        method: Method,
        data: {}
    })
    return request
}

async function TipoAliSelected(Id){
    var DatasTipoLig = await GetDatasTipoAliSelected(Id, "GET")
    document.getElementById('type-lig-desc').value = DatasTipoLig['DatasTipoAli']['Desc']
    document.getElementById('type-lig-cod').value = DatasTipoLig['DatasTipoAli']['Codigo']
    document.getElementById('type-lig-search').value = DatasTipoLig['DatasTipoAli']['Codigo']
}

async function ShowModalAndCreateSelectTiposLig(){
    if(verify_selects_show_modal('tipos-ligacao')===true){
        await SelectTipoAliMounted()
        CleanFormsTipoAli()
    }
}

async function HandleFilterTipoAli(Value){
    let request = await $.ajax({
        url: "/app/eletrica/a1pro/AllTiposAli/",
        method: "POST",
        data: {'DataSearch': Value}
    })
    return request
}

async function FilterTipoAli(Value){
    var DatasFiltereds = await HandleFilterTipoAli(Value)
    CreateSelectTiposLig(DatasFiltereds['TiposAliFiltered'])
}

function CleanFormsTipoAli(){
    var AllOptionsSelect = document.getElementById('type-lig-all-types').options
    for (let i = 0; i < AllOptionsSelect.length; i++){
        if(AllOptionsSelect[i].selected){
            AllOptionsSelect[i].selected = false
        }
    }
    document.getElementById('type-lig-cod').value=""
    document.getElementById('type-lig-desc').value=""
    document.getElementById('type-lig-search').value=""
}

function VerifyAndGetDatasTiposAli(){
    var codigo = document.getElementById('type-lig-cod').value
    var desc = document.getElementById('type-lig-desc').value
    var tipo_ali_selected = $('#type-lig-all-types').val()
    var errors = []
    if (codigo.length!=0){
        if(codigo.length>50){
            errors.push('Código com tamanho maior do que permitido')
        }
    }
    else{
        errors.push('O campo de Código é obrigatório')
    }

    if(desc.length>400){
        errors.push('Descrição com tamanho maior do que permitido')
    }


    if(errors.length === 0){
        return {
            'Cod': codigo,
            'Desc': desc,
            'Selected': tipo_ali_selected
        }
    }
    else{
        return errors.join(', ')
    }

}
async function SelectTipoAliMounted(){
    var AllTiposAli = await GetAllTiposAli()
    CreateSelectTiposLig(AllTiposAli['TiposAli'])
}

async function RegisterOrUpdateTipoAli(){
    var FormsDatas = VerifyAndGetDatasTiposAli()
    if(typeof FormsDatas === "string"){
        return alert(FormsDatas)
    }
    var MsgReturnServer = await PostDatasTipoAli(FormsDatas)
    alert(MsgReturnServer['return'])
    await SelectTipoAliMounted()
    CleanFormsTipoAli()
}

async function PostDatasTipoAli(FormsDatas){
    let request = await $.ajax({
        url: "/app/eletrica/a1pro/CreateOrUpdateTipoAli/",
        method: "POST",
        data: {'AllDatas': JSON.stringify(FormsDatas)}
    })
    return request
}

async function DeleteTipoAli(){
    var TipoAliSelected = $('#type-lig-all-types').val()
    if (TipoAliSelected.length!=0){
        let RequestDel = await GetDatasTipoAliSelected(TipoAliSelected[0], "DELETE")
        alert(RequestDel['return'])
        await SelectTipoAliMounted()
        CleanFormsTipoAli()
    }
    else{
        return alert('Para excluir um Tipo de Alimentação selecione um!!')
    }
}
