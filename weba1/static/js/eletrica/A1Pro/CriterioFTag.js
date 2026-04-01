function working_with_nav_menu(id_element, all_containers){
    for(let i = 0; i < all_containers.length; i++){
        if (all_containers[i] == id_element){
            $('#'+all_containers[i]).show()
            document.getElementById(all_containers[i]+'-nav').className = 'nav-item active'
        }
        else{
            document.getElementById(all_containers[i]+'-nav').className = 'nav-item'
            $('#'+all_containers[i]).hide()
        }
    }
}
function mani_modal_caracteres(first_header, second_header, TipoCabo, multipolar=false){
    var uni_or_multi = 'UNIPOLAR'
    if(multipolar){
        uni_or_multi = 'MULTIPOLAR'
    }
    document.getElementById('unipolar-or-multipolar').value = uni_or_multi
    document.getElementById('tipo-cabo-selected-ftag').value=TipoCabo
    $('#modal-caracteres-header').html(first_header)
    $('#modal-caracteres-second-header').html(second_header+'° Caractere')
    document.getElementById('modal-caracteres-second-header').title = second_header
    $('#modal-caracteres').modal('show')
}

function check_only_1_element(id_element, queryselector){
    let all_element = document.querySelectorAll("[name=" + queryselector + "]")
    for(let i = 0; i < all_element.length; i++){
        if(all_element[i].id == id_element){
            all_element[i].checked=true
        }
        else{
            all_element[i].checked=false
        }
    }
}

async function GetAcessOs(os){
    let all_acess = ''
    await $.ajax({
      type: "GET",
      url: "AcessOsinFTag/" + os,
      dataType: 'json',
      success: function (data){
          all_acess = data
      },
      failure: function(error){
      },
    })
    return all_acess
}

async function GetSinaisOs(os){
    let all_sinais = ''
    await $.ajax({
      type: "GET",
      url: "SinaisOsinFTag/" + os,
      dataType: 'json',
      success: function (data){
          all_sinais = data
      },
      failure: function(error){
      },
    })
    return all_sinais
}

async function pick_datas_acess_for_fill_selects(){
    let datas = await GetAcessOs($('#pro-os').val())
    fill_selects_crit_tag(datas, 'select-acess-crit-tag')
}

async function pick_datas_sinais_for_fill_selects(){
    let datas = await GetSinaisOs($('#pro-os').val())
    fill_selects_crit_tag(datas, 'select-sinal-crit-tag')
}
function fill_selects_crit_tag(datas, id_select){
    let options = ``
    $('#'+id_select).html('')
    for(let keys in datas){
        options += `<option value="${keys}">${datas[keys]}</option>`
    }
    $('#'+id_select).html(options)
}



function SendFTagBack(TipoCabo){
    var TipoCaboParametro = ConvertTipoCaboPatternDBorFunc(TipoCabo, false)
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var DatasSend = GetDatasFTag(TipoCaboParametro)
    if(typeof DatasSend === "string"){
        return alert(DatasSend)
    }
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "FormacaoTag/",
        dataType: 'json',
        data: {'AllDatas': JSON.stringify(DatasSend)},
        success: function (data){
            alert(data['return'])
        },
        failure: function(error){
        },
    })

}

function GetDatasFTag(TipoCabo){
    var errors = null
    var tag = GetValueTagSelectedCheckbox('checkbox-tag-'+TipoCabo)
    var first_caractere = document.getElementById('crit-tag-'+TipoCabo+'-first-carac').value
    if(first_caractere.length>1){
        errors = 'Campo de 1° Caractere só aceita um unico digito!!'
    }
    if(errors != null){
        return errors
    }
    else{
        return {'tag': tag, 'first_carac': first_caractere, 'tipo_cabo': ConvertTipoCaboPatternDBorFunc(TipoCabo, true)}
    }
}

function GetValueTagSelectedCheckbox(name){
    let all_element = document.querySelectorAll("[name=" + name + "]")
    var element_checked = null
    for(let i = 0; i < all_element.length; i++){
        if(all_element[i].checked){
            element_checked = all_element[i].value
        }
    }
    return element_checked
}

function VerifyFormsSizeOne(id_element){
    var element = document.getElementById(id_element)
    if(element.value.length>1){
        element.className+=' is-invalid '
    }
    else {
        element.classList.remove('is-invalid')
    }
}


function VerifyFormsSizeFive(id_element){
    var element = document.getElementById(id_element)
    if(element.value.length>5){
        element.className+=' is-invalid '
    }
    else {
        element.classList.remove('is-invalid')
    }
}

function ConvertTipoCaboPatternDBorFunc(TipoCabo, PatternDB){
    var TipoCaboParametro = null
    var AllDatas = {'ali': df_tipo_cabo_ali,
                    'neutro': df_tipo_cabo_neutro,
                    'terra': df_tipo_cabo_terra,
                    'acess': df_tipo_cabo_acess,
                    'sinal': df_tipo_cabo_sinal}
    for(let key in AllDatas){
        var Condition = key
        var Val = AllDatas[key]
        if(PatternDB === false){
            Condition = AllDatas[key]
            Val = key
        }
        if(TipoCabo === Condition){
            TipoCaboParametro = Val
            break
        }
    }
    return TipoCaboParametro
}

async function FillFTagExistsInOs(){
    var DatasFTag = await RequestDatasFTag()
    DatasFTag = DatasFTag['AllFTag']
    for(let tipo_cabo in DatasFTag){
        FillFormsFTag(DatasFTag[tipo_cabo], tipo_cabo)
    }
}

async function RequestDatasFTag(){
    let request = $.ajax({
        url: `FormacaoTag/`,
        method: "GET",
        data: {}
    })
    return request
}

function FillFormsFTag(Datas, TipoCabo){
    var TipoCaboFormatHTML = ConvertTipoCaboPatternDBorFunc(TipoCabo, false)
    var NameQuerySelector = 'checkbox-tag-'+TipoCaboFormatHTML
    var AllCheckBox = document.querySelectorAll("[name=" + NameQuerySelector + "]")
    for(let i = 0; i < AllCheckBox.length; i++){
        if(AllCheckBox[i].value===Datas['tag']){
            AllCheckBox[i].checked=true
        }
        else{
            AllCheckBox[i].checked=false
        }
    }
    document.getElementById('crit-tag-'+TipoCaboFormatHTML+'-first-carac').value=Datas['first_carac']
}


function FillSinalOrAcessFTag(TipoCabo, Datas){
    var TipoCaboFormatHTML = ConvertTipoCaboPatternDBorFunc(TipoCabo, false)
    document.getElementById('first-caractere-'+TipoCaboFormatHTML).value=Datas['first_carac']
}


function AddFormsForNewTensions(){
    let MaxNumIdInTensionDefault = DiscoverLastNumIdFormsTensionDefault()
    let ContentFormsTensao = `<div class="row mt-1">
                                  <div class="col-lg-5 p-0">
                                      <input type="text" class="form-control form-control-sm w-100" name="forms-tensao-ftag" id="ftag-form-tensao-${MaxNumIdInTensionDefault + 1}" title="${MaxNumIdInTensionDefault + 1}">
                                  </div>
            
                                  <div class="col-lg-2 text-center p-0">
                                      <button type="button" class="btn btn-outline-danger btn-sm" hidden>x</button>
                                  </div>
            
                                  <div class="col-lg-5 p-0">
                                      <input type="text" class="form-control form-control-sm w-100" id="ftag-form-caractere-${MaxNumIdInTensionDefault + 1}">
                                  </div>
                              </div>`
    document.getElementById('content-forms-tensao').innerHTML += ContentFormsTensao
}

async function AddFormsForNewTipoAlim(){
    let MaxNumIdInTipoAlimDefault = DiscoverLastNumIdFormsTipoAlimDefault()
    let TipoAlimentacoesGerais = await FindTipoAlim()
    let optionsTipoAlimHtml = TipoAlimentacoesGerais.map(item => `<option value="${item.tb_tali_nome}">${item.tb_tali_nome}</option>`).join('');
    let ContentFormsTipoAlim = `<div class="row mt-1">
                                  <div class="col-lg-5 p-0">
                                      <select class="form-control form-control-sm w-100" name="forms-tipo-alim-ftag" id="ftag-form-tipo-alim-${MaxNumIdInTipoAlimDefault + 1}" title="${MaxNumIdInTipoAlimDefault + 1}">
                                          <option value="--">--</option>
                                          ${optionsTipoAlimHtml}
                                      </select>
                                  </div>
            
                                  <div class="col-lg-2 text-center p-0">
                                      <button type="button" class="btn btn-outline-danger btn-sm" hidden>x</button>
                                  </div>
            
                                  <div class="col-lg-5 p-0">
                                      <input type="text" class="form-control form-control-sm w-100" id="ftag-form-caractere-${MaxNumIdInTipoAlimDefault + 1}">
                                  </div>
                              </div>`
    document.getElementById('content-forms-tipo-alim').innerHTML += ContentFormsTipoAlim;
}

function DiscoverLastNumIdFormsTensionDefault(){
    var AllInputsTensao = document.querySelectorAll("[name='forms-tensao-ftag']")
    var MaxNumId = 0
    for(let i = 0; i < AllInputsTensao.length; i++){
        let NumInId = Number(AllInputsTensao[i].title)
            if(NumInId>MaxNumId){
                MaxNumId = NumInId
            }
    }
    return MaxNumId
}

function DiscoverLastNumIdFormsTipoAlimDefault(){
    var AllInputsTipoAlim = document.querySelectorAll("[name='forms-tipo-alim-ftag']")
    var MaxNumId = 0
    for(let i = 0; i < AllInputsTipoAlim.length; i++){
        let NumInId = Number(AllInputsTipoAlim[i].title)
            if(NumInId>MaxNumId){
                MaxNumId = NumInId
            }
    }
    return MaxNumId
}

function GetTensionsValues(){
    var MaxNumInIdDefault = DiscoverLastNumIdFormsTensionDefault()
    var NewsTensions = {}
    var msg_error_tension = 'Tensão é numérico!'
    var msg_error_caractere = 'Nos campos de caractere só é aceito 1 digito!!'
    var tipo_cabo = document.getElementById('tipo-cabo-selected-ftag').value
    var tipo_cabo_format_html = ConvertTipoCaboPatternDBorFunc(tipo_cabo, false)
    var SinalAcess = ''
    var uni_or_multi = document.getElementById('unipolar-or-multipolar').value
    var errors = []
    if(tipo_cabo === df_tipo_cabo_acess || tipo_cabo === df_tipo_cabo_sinal){
        SinalAcess = $('#select-'+tipo_cabo_format_html+'-crit-tag').val()[df_index_first_element_array]
    }
    if (MaxNumInIdDefault > 0){
        for(let i = 1; i <= MaxNumInIdDefault; i++){
            let value_tension = document.getElementById('ftag-form-tensao-'+i).value
            let value_caractere = document.getElementById('ftag-form-caractere-'+i).value
            let id_exists = document.getElementById('ftag-form-caractere-'+i).title
            if(isNaN(Number(value_tension))){
                if(!errors.includes(msg_error_tension)){
                    errors.push(msg_error_tension)
                }
            }
            if(value_caractere.length>1){
                if(!errors.includes(msg_error_caractere)){
                    errors.push(msg_error_caractere)
                }
            }
            NewsTensions[i] = {'tension': value_tension, 'caractere': value_caractere, 'id_exists': id_exists}
        }
    }
    if (errors.length>0){
        return errors.join(', ')
    }
    else{
        return {'DatasTension':NewsTensions, 'TipoCabo': tipo_cabo, 'sinal_acess': SinalAcess,
                'carac_num': GetNumCaracSelected(), 'uni_or_multi': uni_or_multi}
    }
}

function GetTipoAlimValues(){
    var MaxNumInIdDefault = DiscoverLastNumIdFormsTipoAlimDefault()
    var NewsTipoAlim = {}
    var msg_error_alim = 'Selecione a alimentação!'
    var msg_error_caractere = 'Nos campos de caractere só é aceito 1 digito!!'
    var tipo_cabo = document.getElementById('tipo-cabo-selected-ftag').value
    var tipo_cabo_format_html = ConvertTipoCaboPatternDBorFunc(tipo_cabo, false)
    var SinalAcess = ''
    var uni_or_multi = document.getElementById('unipolar-or-multipolar').value
    var errors = []
    if(tipo_cabo === df_tipo_cabo_acess || tipo_cabo === df_tipo_cabo_sinal){
        SinalAcess = $('#select-'+tipo_cabo_format_html+'-crit-tag').val()[df_index_first_element_array]
    }
    if (MaxNumInIdDefault > 0){
        for(let i = 1; i <= MaxNumInIdDefault; i++){
            let value_alim = document.getElementById('ftag-form-tipo-alim-'+i).selectedOptions[0].value
            let value_caractere = document.getElementById('ftag-form-caractere-'+i).value
            let id_exists = document.getElementById('ftag-form-caractere-'+i).title
            if(value_alim === '--'){
                if(!errors.includes(msg_error_alim)){
                    errors.push(msg_error_alim)
                }
            }
            if(value_caractere.length>1 || value_caractere.length === 0){
                if(!errors.includes(msg_error_caractere)){
                    errors.push(msg_error_caractere)
                }
            }
            NewsTipoAlim[i] = {'alimentacao': value_alim, 'caractere': value_caractere, 'id_exists': id_exists}
        }
    }
    if (errors.length>0){
        return errors.join(', ')
    }
    else{
        return {'DatasTipoAlim':NewsTipoAlim, 'TipoCabo': tipo_cabo, 'sinal_acess': SinalAcess,
                'carac_num': GetNumCaracSelected(), 'uni_or_multi': uni_or_multi}
    }
}

function SendTensionsFTagBack(){
    var DatasTensions = GetTensionsValues()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(typeof DatasTensions === "string"){
        return alert(DatasTensions)
    }
    $.ajax({
        type: "POST",
        url: "TensionsInFTag/",
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(DatasTensions)},
        success: function (data){
            alert(data['return'])
            FillTensionsAndShowModal(false)
        },
        failure: function(error){
        },
    })
}

function FillTensionsAndShowModal(show){
    var DatasSend = GetParametersForSearchAllTensions()
    $.ajax({
        type: "GET",
        url: "TensionsInFTag/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(DatasSend)},
        success: function (data){
            FillFieldsTension(data['AllTensions'])
            if(show){
                $('#modal-tensao').modal('show')
            }
        },
        failure: function(error){
        },
    })
}

function DelTensaoFTag(id_tensao_ftag){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "DELETE",
        headers: {'X-CSRFToken': csrftoken},
        url: "DelTensaoFTag/" + id_tensao_ftag + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            alert(data['return'])
            FillTensionsAndShowModal(false)
        },
        failure: function(error){
        },
    })
}
function DelTipoAlimFTag(DatasSend){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "DELETE",
        url: "TipoAlimInFTag/",
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({ DatasFront: DatasSend }),
        success: function (data){
            alert(data['return'])
            FillTipoAlimShowModal(false)
        },
        failure: function(error){
        },
    })
}

function FillFieldsTension(DatasTension){
    var ContentForms = ``
    var cont = 1
    for (let id_ftag_tensao in DatasTension){
        ContentForms += `<div class="row mt-1">
                            <div class="col-lg-5 p-0">
                                <input type="text" class="form-control form-control-sm w-100" name="forms-tensao-ftag" id="ftag-form-tensao-${cont}" value="${DatasTension[id_ftag_tensao]['tensao']}" title="${cont}">
                            </div>
        
                            <div class="col-lg-2 text-center p-0">
                                <button type="button" class="btn btn-outline-danger btn-sm" onclick="DelTensaoFTag(${id_ftag_tensao})">x</button>
                            </div>
        
                            <div class="col-lg-5 p-0">
                                <input type="text" class="form-control form-control-sm w-100" id="ftag-form-caractere-${cont}" value="${DatasTension[id_ftag_tensao]['caractere']}" title="${id_ftag_tensao}">
                            </div>
                       </div>`
        cont += 1
    }
    $('#content-forms-tensao').html(ContentForms)
}

function FillFieldsTipoAlim(DatasTipoAlim){
    console.log(DatasTipoAlim)
    var ContentForms = ``
    var cont = 1
    for (let id_ftag_tipo_alim in DatasTipoAlim){
        ContentForms += `<div class="row mt-1">
                            <div class="col-lg-5 p-0">
                                <select class="form-control form-control-sm w-100" name="forms-tipo-alim-ftag" id="ftag-form-tipo-alim-${cont}" title="${cont}">
                                    <option value="${DatasTipoAlim[id_ftag_tipo_alim]['alimentacao']}">${DatasTipoAlim[id_ftag_tipo_alim]['alimentacao']}</option>
                                </select>
                            </div>
        
                            <div class="col-lg-2 text-center p-0">
                                <button type="button" class="btn btn-outline-danger btn-sm" onclick="DelTipoAlimFTag(${id_ftag_tipo_alim})">x</button>
                            </div>
        
                            <div class="col-lg-5 p-0">
                                <input type="text" class="form-control form-control-sm w-100" id="ftag-form-caractere-${cont}" value="${DatasTipoAlim[id_ftag_tipo_alim]['caractere']}" title="${id_ftag_tipo_alim}">
                            </div>
                       </div>`
        cont += 1
    }
    $('#content-forms-tipo-alim').html(ContentForms)
}

function GetParametersForSearchAllTensions(){
    var carac_num = GetNumCaracSelected()
    var tipo_cabo = document.getElementById('tipo-cabo-selected-ftag').value
    var sinal_acess = ''
    var uni_or_multi = document.getElementById('unipolar-or-multipolar').value
    if(tipo_cabo === df_tipo_cabo_acess || tipo_cabo === df_tipo_cabo_sinal){
        let tipo_cabo_format_html = ConvertTipoCaboPatternDBorFunc(tipo_cabo, false)
        sinal_acess = $('#select-'+tipo_cabo_format_html+'-crit-tag').val()[df_index_first_element_array]
    }
    return {'carac_num': carac_num, 'tipo_cabo': tipo_cabo, 'sinal_acess': sinal_acess,
            'uni_or_mult': uni_or_multi}
}

function GetParametersForSearchAllTipoAlim(){
    var carac_num = document.getElementById('modal-caracteres-second-header').title
    var tipo_cabo = document.getElementById('tipo-cabo-selected-ftag').value
    var sinal_acess = ''
    var uni_or_multi = document.getElementById('unipolar-or-multipolar').value
    if(tipo_cabo === df_tipo_cabo_acess || tipo_cabo === df_tipo_cabo_sinal){
        let tipo_cabo_format_html = ConvertTipoCaboPatternDBorFunc(tipo_cabo, false)
        sinal_acess = $('#select-'+tipo_cabo_format_html+'-crit-tag').val()[df_index_first_element_array]
    }
    return {'carac_num': carac_num, 'tipo_cabo': tipo_cabo, 'sinal_acess': sinal_acess,
            'uni_or_mult': uni_or_multi}
}

function VerifySinalOrAcessForShowModal(first_header_modal, caractere_num, TipoCabo){
    var TipoCaboFormatHTML = ConvertTipoCaboPatternDBorFunc(TipoCabo, false)
    var SinalAcessSelected = $('#select-'+TipoCaboFormatHTML+'-crit-tag').val()
    if(SinalAcessSelected.length === 0){
        return alert('Para exibir o modal de caracteres precisa ser selecionado um '+TipoCabo)
    }
    SinalAcessSelected = SinalAcessSelected[df_index_first_element_array]
    $.ajax({
        type: "GET",
        url: "CaracteresSinaisOrAcess/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify({'tipo_cabo': TipoCabo, 'sinal_acess': SinalAcessSelected,
                'carac_num': caractere_num})},
        success: function (data){
            mani_modal_caracteres(first_header_modal, caractere_num, TipoCabo)
            FillCaractereSelected()
        },
        failure: function(error){
        },
    })

}

function GetNumCaracSelected(){
    return document.getElementById('modal-caracteres-second-header').title
}


function GetFasesValues(){
    var fases_values = {'A': '', 'B': '', 'C': ''}
    var all_forms_fases = document.querySelectorAll("[name='forms-fases-ftag']")
    var errors = null
    for(let i = 0; i < all_forms_fases.length; i++){
        let value_element = all_forms_fases[i].value
        if(value_element.length>1){
            errors = 'Caractere de fases só é permitido 1 digito!'
        }
        fases_values[all_forms_fases[i].title] = value_element
    }
    if(errors!=null){
        return errors
    }
    else {
        return {'fases_values': fases_values, 'parametros': GetParametersForSearchAllTensions()}
    }
}

function SendFasesBack(){
    var AllDatas = GetFasesValues()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if (typeof AllDatas === "string"){
        return alert(AllDatas)
    }
    $.ajax({
        type: "POST",
        url: "FasesInFTag/",
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(AllDatas)},
        success: function (data){
            alert(data['return'])
            FillFasesShowModal(false)
        },
        failure: function(error){
        },
    })
}

function FillTipoAlimShowModal(show){
    var DatasSend = GetParametersForSearchAllTipoAlim()
    $.ajax({
        type: "GET",
        url: "TipoAlimInFTag/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(DatasSend)},
        success: function (data){
            FillFieldsTipoAlim(data['AllTipAlim'])
            if(show === true){
                $('#modal-tipo-alimentacao').modal('show')
            }
        },
        failure: function(error){
        },
    })
}

async function FindTipoAlim() {
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    try {
        const data = await $.ajax({
            type: "PUT",
            url: "TipoAlimInFTag/",
            headers: {'X-CSRFToken': csrftoken},
            dataType: 'json',
        });

        return data['AllTipAlim'];
    } catch (error) {
        console.error('Erro na requisição Ajax:', error);
        throw error; // Propagar o erro para quem chama a função, se necessário
    }
}


function SendTipoAlimFTagBack(){
    var DatasTipoAlim = GetTipoAlimValues()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(typeof DatasTipoAlim === "string"){

        return alert(DatasTipoAlim)
    }
    $.ajax({
        type: "POST",
        url: "TipoAlimInFTag/",
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(DatasTipoAlim)},
        success: function (data){
            alert(data['return'])
            FillTipoAlimShowModal(false)
        },
        failure: function(error){
        },
    })
}

function FillFasesShowModal(show){
    var DatasSend = GetParametersForSearchAllTensions()
    $.ajax({
        type: "GET",
        url: "FasesInFTag/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(DatasSend)},
        success: function (data){
            FillFormsFase(data['AllFases'])
            if(show === true){
                $('#modal-fases').modal('show')
            }
        },
        failure: function(error){
        },
    })
}

function FillFormsFase(DatasFase){
    var AllFields = document.querySelectorAll("[name='forms-fases-ftag']")
    for(let i = 0; i < AllFields.length; i++){
        AllFields[i].value = DatasFase[AllFields[i].title]
    }
}

function GetCheckboxSelectedCaractere(){
    var AllCheckbox = document.querySelectorAll("[name='checkbox-caractere']")
    var selected_value = null
    for(let i = 0; i < AllCheckbox.length; i++){
        if(AllCheckbox[i].checked){
            selected_value = AllCheckbox[i].value
        }
    }
    return selected_value
}

function SendDatasCaractere(){
    var CheckboxSelected = GetCheckboxSelectedCaractere()
    var l_or_n = document.getElementById('crit-carac-l-or-n').value
    var apply = document.getElementById('crit-carac-valid').checked
    var Parametros = GetParametersForSearchAllTensions()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if(apply){
        apply = 1
    }
    else{
        apply = 0
    }
    var DatasCaractere = {'apply': apply, 'selected': CheckboxSelected, 'l_or_n': l_or_n}
    $.ajax({
        type: "POST",
        url: "FTagCaractere/",
        headers: {'X-CSRFToken': csrftoken},
        dataType: 'json',
        data: {'DatasFront': JSON.stringify({'DatasCaractere': DatasCaractere, 'parametros': Parametros})},
        success: function (data){
            alert(data['return'])
        },
        failure: function(error){
        },
    })
}

function FillCaractereSelected(){
    $.ajax({
        type: "GET",
        url: "FTagCaractere/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(GetParametersForSearchAllTensions())},
        success: function (data){
            FillElementsCaractere(data['DatasCarac'])
        },
        failure: function(error){
        },
    })
}

function FillElementsCaractere(DatasCaractere){
    var AllCheckboxCarac = document.querySelectorAll("[name='checkbox-caractere']")
    var checked_apply = false
    for(let i = 0; i < AllCheckboxCarac.length; i++){
        if(AllCheckboxCarac[i].value === DatasCaractere['selected']){
            AllCheckboxCarac[i].checked = true
        }
        else{
            AllCheckboxCarac[i].checked = false
        }
    }
    if(Number(DatasCaractere['apply']) === 1){
        checked_apply = true
    }
    document.getElementById('crit-carac-valid').checked = checked_apply
    document.getElementById('crit-carac-l-or-n').value = DatasCaractere['l_or_n']
}

function ShowAndFillModalCaracteres(first_header, second_header, TipoCabo, multipolar=false){
    mani_modal_caracteres(first_header, second_header, TipoCabo, multipolar)
    FillCaractereSelected()
}

function HideModalFTag(){
    $('#modal-tensao').modal('hide')
    $('#modal-fases').modal('hide')
    $('#modal-caracteres').modal('hide')
    $('#criterios_tag').modal('hide')
}

function HideModalCaractere(){
    $('#modal-tensao').modal('hide')
    $('#modal-fases').modal('hide')
    $('#modal-caracteres').modal('hide')
}
