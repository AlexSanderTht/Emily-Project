// Obtém o token CSRF do Django para uso em requisições AJAX
const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0]?.value || '';

function FillFuncsAndShowModalConfigCC(){
    debugger;
    if(verify_selects_show_modal('config-calc-cabos')){
        $.ajax({
              type: "GET",
              url: "AllFuncOsInConfigCC/",
              dataType: 'json',
              success: function (data){
                  ClearConfigCC()
                  FillSelectFunc(data['AllFuncs'])
              },
              failure: function(error){
              },
        })
    }
}

function ChangeFuncFillTensao(option_selected){
    if(option_selected.value != "none"){
        document.getElementById('tensao-func-config-cc').value = option_selected.title
    }
    else{
        document.getElementById('tensao-func-config-cc').value = ''
    }
}
function FillSelectFunc(datas_func){
    var options_select_func = `<option value="none">Selecione uma Função!</option>`
    for (let i = 0; i < datas_func.length; i++){
        options_select_func += `<option value="${datas_func[i]['id']}" title="${datas_func[i]['tensao']}">${datas_func[i]['nome']}</option>`
    }
    $('#func-config-cc').html(options_select_func)
}

async function SendFuncForVerifyNivelTensao(){
    var func_selected = $('#func-config-cc').val()
    if(func_selected != "none"){
         await $.ajax({
              type: "GET",
              url: "NivelTensionFuncConfigCC/" + func_selected + "/",
              dataType: 'json',
              success: function (data){
                  debugger;
                  $('#content_bt_or_mt').html(data['page_render'])
                  document.getElementById('nivel_tensao_func_config_cc').value = data['nivel_tensao']
                  if(data['datas_forms'] != null){
                      if (data['nivel_tensao'] === 'BT'){
                          FillFormsConfigCCBT(data['datas_forms'])
                      }
                      else{
                          FillFormsConfigCcMt(data['datas_forms'])
                      }
                  }
              },
              failure: function(error){
              },
        })
    }
    else{
        ClearConfigCC()
    }
}

function ClearConfigCC(){
    $('#func-config-cc').val("none")
    document.getElementById('tensao-func-config-cc').value = ''
    document.getElementById('nivel_tensao_func_config_cc').value = ''
    $('#content_bt_or_mt').html(``)
}

function SendConfigCCBack(){
    var datas_config_cc = GetAndVerifyDatasConfigCCBt()
    if(typeof datas_config_cc === "string"){
        return alert(datas_config_cc)
    }
    $.ajax({
        type: "POST",
        headers:{'X-CSRFToken':csrftoken},
        url: "ConfigCalcCabos/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(datas_config_cc)},
        success: function (data){
            alert(data['return'])
        }
    });
}

function ReturnCheckboxSelected(name){
    let all_checkbox = document.getElementsByName(name)
    var check_return = null
    for (let i = 0; i < all_checkbox.length; i++){
        if(all_checkbox[i].checked){
            check_return = all_checkbox[i].value
            break
        }
    }
    return check_return
}

function GetAndVerifyDatasConfigCCBt(){
    var checkbox_cc = document.getElementById('check_box_cc').checked
    var checkbox_sobrecarga = document.getElementById('check_box_sobrecarga').checked
    var funcao = $('#func-config-cc').val()
    var maneira_instalar = $('#procalc-install-mode').val()
    var sistema = document.getElementById('procalc-system').selectedOptions[0].title
    var cabo = $('#procalc-cable').val()
    var temperatura_ambiente = Number(document.getElementById('procalc-install-mode').selectedOptions[0].title) === 0 ? $('#procalc-temperature-env').val() : $('#procalc-temperature-solo').val()
    var select_conformacao_cabos = document.getElementById('unipolar_conformacao')
    var conformacao_cabos = {'id': select_conformacao_cabos.options[select_conformacao_cabos.selectedIndex].value, 'value': select_conformacao_cabos.options[select_conformacao_cabos.selectedIndex].innerHTML}
    var dist_unipolar = $('#unipolar_espacameno').val()
    var material_condutor = $('#material_condutor').val()
    var fator_agrup = convertCommaToDot(document.getElementById('procalc-clustering-factor').value)
    var corrente_curto = convertCommaToDot(document.getElementById('procalc-circuit-current').value)
    var harmonicos = convertCommaToDot(document.getElementById('procalc-harmonic').value)
    var sec_min = $('#procalc-sec-cond').val()
    var sec_max = $('#secao_maxima').val()
    var condutores_fase = document.getElementById('numero_condutores').value
    var disp_prot = GetDispProtSelected()
    var tempo_atuacao_disp_prot = checkbox_sobrecarga ? convertCommaToDot(document.getElementById('temp_dips_protecao_sobrecarga').value) : convertCommaToDot(document.getElementById('temp_dips_protecao').selectedOptions[0].innerHTML)
    var corrente_nominal_disj = convertCommaToDot(document.getElementById('corrente_disjuntor_nominal').value)
    var corrente_curto_limitada = null
    var queda_tensao_circuito = convertCommaToDot(document.getElementById('procalc-drop-voltage-circuit').value)
    var queda_tensao_circuito_partida = convertCommaToDot(document.getElementById('procalc-drop-voltage-circuit-start').value)
    var desequilibrado = document.getElementById('check_box_desequilibrado').checked
    var checkbox_tempo_livre = document.getElementById('check_box_tempo_livre').checked
    var checkbox_corrente_regulada = document.getElementById('check_box_corrente_regulada').checked
    let unipolar_checked = ReturnCheckboxSelected('checkbox-formacao-bt-cc')
    let uni_value_pot = document.getElementById('pot-bt-formacao')
    let uni_value_sec = document.getElementById('sec-bt-formacao')
    let impares = $('#select_impar_cc_bt').val() === '0'? null : $('#select_impar_cc_bt').val()
    let pares = $('#select_par_cc_bt').val() === '0'? null : $('#select_par_cc_bt').val()
    var all_funcs = document.getElementById('all_func_config_cc').checked
    var corrente_regulada = null
    var errors = {'nao_selecionados': [], 'invalidos': []}
    if (funcao!= "none"){

        if(Array.from(uni_value_pot.classList).includes('is-invalid')){
            errors['invalidos'].push('Se potência')
        }

        if(Array.from(uni_value_sec.classList).includes('is-invalid')){
            errors['invalidos'].push('Se seção')
        }

        if(maneira_instalar === '0'){
            errors['nao_selecionados'].push('Maneira de instalar')
        }
        if(sistema === '0'){
            errors['nao_selecionados'].push('Sistema')
        }
        if(cabo === '0'){
            errors['nao_selecionados'].push('Cabo')
        }

        if(conformacao_cabos['id'] === '0'){
            errors['nao_selecionados'].push('Conformação Cabos')
        }
        else{
            if(conformacao_cabos['value'] === 'Justaposto espaçado Horizontal' || conformacao_cabos['value'] === 'Justaposto espaçado Vertical'){
                if(dist_unipolar === '0'){
                    errors['nao_selecionados'].push('Distancia Unipolar')
                }
            }
        }

        if(temperatura_ambiente === '0'){
            errors['nao_selecionados'].push('Temperatura ambiente')
        }

        if(fator_agrup.length>0){
            if(VerifyValuesFloatConfigCC(fator_agrup,0, 1) === false){
                errors['invalidos'].push('Fator de agrupamento')
            }
        }
        else{
            errors['invalidos'].push('Fator de agrupamento')
        }

        if(!checkbox_cc){
            if(corrente_curto.length>0){
                if(VerifyValuesFloatConfigCC(corrente_curto,0, 1000) === false){
                    errors['invalidos'].push('Corrente de curto')
                }
            }
            else{
                errors['invalidos'].push('Corrente de curto')
            }
        }
        else{
            corrente_curto = null
        }

        if(condutores_fase.length === 0){
            condutores_fase = null
        }
        else{
            if(VerifyValuesFloatConfigCC(condutores_fase,0, false) === false){
                errors['invalidos'].push('Número de condutores por fase')
            }
        }

        if(harmonicos.length === 0){
            harmonicos = null
        }
        else{
            if(VerifyValuesFloatConfigCC(harmonicos, 0, 100) === false){
                errors['invalidos'].push('Harmonicos')
            }
        }


        if(!checkbox_sobrecarga){
            if(disp_prot === null){
                errors['nao_selecionados'].push('Dispositivo de proteção')
            }
            else{
                if(checkbox_corrente_regulada){
                    corrente_regulada = convertCommaToDot(document.getElementById('procalc-corrente-regulada').value)
                    if(corrente_regulada.length>0){
                        if(VerifyValuesFloatConfigCC(corrente_regulada, 0, false) === false){
                            errors['invalidos'].push('Corrente Regulada Disp.Proteção')
                        }
                    }
                    else{
                        errors['invalidos'].push('Corrente Regulada Disp.Proteção')
                    }
                }
                if(corrente_nominal_disj.length>0){
                    if(VerifyValuesFloatConfigCC(corrente_nominal_disj, 0, 1000) === false){
                        errors['invalidos'].push('Corrente Nominal Disjuntor')
                    }
                }
                else{
                    errors['invalidos'].push('Corrente Nominal Disjuntor')
                }

                if(disp_prot === 'Disjuntor Limitador'){
                    corrente_curto_limitada = convertCommaToDot(document.getElementById('procalc-circuit-current-limit').value)
                    if(corrente_curto_limitada.length>0){
                        if(VerifyValuesFloatConfigCC(corrente_curto_limitada, 0, 1000) === false){
                            errors['invalidos'].push('Corrente de curto limitada')
                        }
                    }
                    else{
                        errors['invalidos'].push('Corrente de curto limitada')
                    }
                }
            }
        }
        else{
            corrente_regulada = null
            corrente_nominal_disj = null
            disp_prot = null
            corrente_curto_limitada = null
        }
        if(!checkbox_cc){
            if(!checkbox_sobrecarga){
                if(checkbox_tempo_livre || disp_prot === 'Outro'){
                    tempo_atuacao_disp_prot = convertCommaToDot(document.getElementById('temp_dips_protecao_livre').value)
                }
            }
            if(tempo_atuacao_disp_prot === '---' || tempo_atuacao_disp_prot.length === 0 || VerifyValuesFloatConfigCC(tempo_atuacao_disp_prot, 0, 5) === false){
                errors['invalidos'].push('Tempo atuação dispositivo de proteção')
            }
        }
        else{
            tempo_atuacao_disp_prot = null
        }

        if(queda_tensao_circuito.length>0){
            if(VerifyValuesFloatConfigCC(queda_tensao_circuito, 0, 100) === false){
                errors['invalidos'].push('Queda de tensão do circuito')
            }
        }
        else{
           errors['invalidos'].push('Queda de tensão do circuito')
        }

        if(queda_tensao_circuito_partida.length>0){
            if(VerifyValuesFloatConfigCC(queda_tensao_circuito_partida, 0, 100) === false){
                errors['invalidos'].push('Queda de tensão do circuito na partida')
            }
        }
        else{
            queda_tensao_circuito_partida = null
        }

    }
    else {
        errors.push('Função não selecionada')
    }

    if(errors['nao_selecionados'].length === 0 && errors['invalidos'].length === 0){
        return {
            'funcao': funcao,
            'maneira_instalar': maneira_instalar,
            'sistema': sistema,
            'cabo': cabo,
            'temperatura_ambiente': temperatura_ambiente,
            'conformacao_cabos': conformacao_cabos,
            'dist_unipolar': dist_unipolar,
            'material_cond': material_condutor,
            'fator_agrup': fator_agrup,
            'corrente_curto': corrente_curto,
            'harmonicos': harmonicos,
            'sec_min': sec_min,
            'sec_max': sec_max,
            'condutores_fase': condutores_fase,
            'disp_prot': disp_prot,
            'tempo_atuacao_disp_prot': tempo_atuacao_disp_prot,
            'corrente_nominal_disj': corrente_nominal_disj,
            'corrente_curto_limitada': corrente_curto_limitada,
            'queda_tensao_circuito': queda_tensao_circuito,
            'queda_tensao_circuito_partida': queda_tensao_circuito_partida,
            'e_desequilibrado': desequilibrado,
            'corrente_regulada': corrente_regulada,
            'check_corrente_regulada': checkbox_corrente_regulada,
            'checkbox_sobrecarga': checkbox_sobrecarga,
            'checkbox_cc': checkbox_cc,
            'checkbox_tempo_livre': checkbox_tempo_livre,
            'all_funcs': all_funcs,
            'unipolar_checked': unipolar_checked,
            'uni_value_pot': uni_value_pot.value === ''?null:convertCommaToDot(uni_value_pot.value),
            'uni_value_sec': uni_value_sec.value === ''?null:convertCommaToDot(uni_value_sec.value),
            'impares': impares,
            'pares': pares
        }
    }
    else{
        var string_return = ''
        if(errors["nao_selecionados"].length > 0){
            string_return += 'Formularios não selecionados:\n' + errors["nao_selecionados"].join(',\n')
        }
        if(errors['invalidos'].length > 0){
            string_return += '\n\nInvalidos:\n' + errors["invalidos"].join(',\n')
        }
        return string_return
    }
}

function ChangeCheckBoxCC(check){
    let id_temp_disp_prot_sobrecarga = 'temp_dips_protecao_sobrecarga'
    let id_row_disp_prot = 'tempo_atuacao_disp_protecao'
    let id_tempo_disp_prot = document.getElementById('check_box_sobrecarga').checked ? id_temp_disp_prot_sobrecarga : id_row_disp_prot
    let element_temp_disp_prot = document.getElementById(id_tempo_disp_prot)
    let hide_disp_prot = check ? true:false
    document.getElementById('procalc-circuit-current').readOnly = check ? true : false
    if (check){
        document.getElementById('procalc-circuit-current').value = ''
    }
    element_temp_disp_prot.hidden = hide_disp_prot
    if(element_temp_disp_prot.id === id_temp_disp_prot_sobrecarga){
        for(let i=0; i< element_temp_disp_prot.labels.length ;i++){
            element_temp_disp_prot.labels[i].hidden = hide_disp_prot
        }
    }
}

function ShowHideTempAtuacaoSobrecarga(hide){
    let element_temp_atuacao_sobrecarga = document.getElementById('temp_dips_protecao_sobrecarga')
    element_temp_atuacao_sobrecarga.hidden = hide
    for(let i=0; i< element_temp_atuacao_sobrecarga.labels.length ;i++){
        element_temp_atuacao_sobrecarga.labels[i].hidden = hide
    }
}

function ChangeSobrecarga(check){
    document.getElementById('content_disp_prot').hidden = check ? true : false
    ShowHideTempAtuacaoSobrecarga(check ? false : true)
    ChangeCheckBoxCC(document.getElementById('check_box_cc').checked)
}

function ChangeManeiraInstalar() {
    var id_modo_instal = $('#procalc-install-mode').val()
    if (id_modo_instal !== '0') {
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/calc_cabos/a1calccabos/CreateTableFAgrupNBR/" + id_modo_instal,
            dataType: 'json',
            data: {},
            success: function (data) {
                CreateTableFAgrupNBR(data['table'])
            },
            failure: function (error) {
            },
        })
    } else {
        $('#table_grouping').html('')
    }
}

function fill_temperatura(material) {
    if(material!==""){
        let id_element = document.getElementById('procalc-install-mode').selectedOptions[0].title == '0' ? 'procalc-temperature-env' : 'procalc-temperature-solo'
        let list_options = document.getElementById(id_element).options
        for (let i = 0; i < list_options.length; i++) {
            if (list_options[i].title === material || list_options[i].value === '0') {
                list_options[i].hidden = false
            } else {
                list_options[i].hidden = true
            }
        }
    }
}

function VerifyAmbienteOrSolo(element_selected){
    let id_temp_ambiente = 'procalc-temperature-env'
    let id_temp_solo = 'procalc-temperature-solo'
    if(element_selected.value !== '0'){
        var selects = element_selected.title == '0' ? {'hide': id_temp_solo, 'show': id_temp_ambiente} : {'hide': id_temp_ambiente, 'show': id_temp_solo}
        document.getElementById(selects['hide']).hidden = true
        document.getElementById(selects['hide']).labels[0].hidden = true
        document.getElementById(selects['show']).hidden = false
        document.getElementById(selects['show']).labels[0].hidden = false
    }
    else{
        document.getElementById(id_temp_solo).hidden = true
        document.getElementById(id_temp_solo).labels[0].hidden = true
        document.getElementById(id_temp_ambiente).hidden = false
        document.getElementById(id_temp_ambiente).labels[0].hidden = false
    }
}

function FillFormsConfigCCBT(datas_forms){
    var sistema = document.getElementById('procalc-system')
    var confomacao_cabos = document.getElementById('unipolar_conformacao')
    var content_conformacao = null
    var all_radios_dp = document.querySelectorAll('[name="checkbox_disp_prot"]')
    $('#procalc-install-mode').val(datas_forms['maneira_install'])
    ChangeManeiraInstalar()
    VerifyAmbienteOrSolo(document.getElementById('procalc-install-mode').selectedOptions[0])
    var cabo_enterrado = document.getElementById('procalc-install-mode').selectedOptions[0].title
    var id_temperatura = Number(cabo_enterrado) === 1 ? 'procalc-temperature-solo': 'procalc-temperature-env'
    for (let i = 0; i < sistema.options.length; i++){
        if(sistema.options[i].title == datas_forms['sistema']){
            sistema.selectedIndex = i
            break
        }
    }
    $('#procalc-cable').val(datas_forms['cabo'])
    fill_temperatura(document.getElementById('procalc-cable').selectedOptions[0].title)
    $('#'+id_temperatura).val(datas_forms['temperatura_ambiente'])
    for(let i = 0; i < confomacao_cabos.options.length; i++){
        if(confomacao_cabos.options[i].value == datas_forms['conformacao_cabos']){
            confomacao_cabos.selectedIndex = i
            content_conformacao = confomacao_cabos.options[i].innerHTML
            break
        }
    }
    $('#unipolar_espacameno').val(datas_forms['dist_unipolar'])
    $('#material_condutor').val(datas_forms['material_cond'])
    document.getElementById('procalc-clustering-factor').value = convertDotToComma(datas_forms['fator_agrup'])
    document.getElementById('procalc-circuit-current').value = convertDotToComma(datas_forms['corrente_curto'])
    document.getElementById('procalc-harmonic').value = convertDotToComma(datas_forms['harmonicos'])
    if(datas_forms['cond_fase'] != null){
        document.getElementById('numero_condutores').value = datas_forms['cond_fase']
    }
    $('#procalc-sec-cond').val(datas_forms['sec_min'])
    $('#secao_maxima').val(datas_forms['sec_max'])
    document.getElementById('check_box_sobrecarga').checked = datas_forms['checkbox_sobrecarga']
    document.getElementById('check_box_cc').checked = datas_forms['checkbox_cc']
    ChangeSobrecarga(document.getElementById('check_box_sobrecarga').checked)
    if(!datas_forms['checkbox_sobrecarga']){
        for(let i = 0; i < all_radios_dp.length; i++){
            if(all_radios_dp[i].value == datas_forms['dp']){
                all_radios_dp[i].checked = true
            }
            else{
                all_radios_dp[i].checked = false
            }
        }
        if(datas_forms['dp'] === 'Caixa Aberta'){
            SelectDisjuntorCaixaaberta()
        }
        else if(datas_forms['dp'] === 'Caixa Moldada'){
            SelectDisjuntorCaixaMoldada()
        }
        else if(datas_forms['dp'] === 'Outro'){
            SelectDispProtOutro()
        }
        else{
            SelectDisjuntorLimitado()
        }
        if(!datas_forms['checkbox_cc']){
            if(datas_forms['dp'] !== 'Outro'){
                document.getElementById('check_box_tempo_livre').checked = datas_forms['checkbox_tempo_livre']
                ChangeCheckboxTempoLivre(document.getElementById('check_box_tempo_livre'))
            }

            if(datas_forms['dp'] === 'Outro' || datas_forms['checkbox_tempo_livre']){
                document.getElementById('temp_dips_protecao_livre').value = datas_forms['dp_tempo_atuacao']
            }
            else{
                var dp_tempo_atuacao = document.getElementById('temp_dips_protecao')
                for(let i = 0; i < dp_tempo_atuacao.options.length; i++){
                    if(Number(dp_tempo_atuacao.options[i].innerHTML) === Number(datas_forms['dp_tempo_atuacao'])){
                        dp_tempo_atuacao.selectedIndex = i
                        break
                    }
                }
            }
        }
        document.getElementById('check_box_corrente_regulada').checked = datas_forms['checkbox_corrente_regulada']
        CheckCorrenteRegulada()
        if(datas_forms['checkbox_corrente_regulada']){
            document.getElementById('procalc-corrente-regulada').value = convertDotToComma(datas_forms['corrente_regulada'])
        }
    }
    else{
        if(!datas_forms['checkbox_cc']){
            document.getElementById('temp_dips_protecao_sobrecarga').value=datas_forms['dp_tempo_atuacao']
        }
    }
    document.getElementById('corrente_disjuntor_nominal').value = convertDotToComma(datas_forms['corrente_nom'])
    document.getElementById('procalc-circuit-current-limit').value = convertDotToComma(datas_forms['corrente_curto_lim'])
    document.getElementById('procalc-drop-voltage-circuit').value = convertDotToComma(datas_forms['queda_tensao_circuito'])
    document.getElementById('procalc-drop-voltage-circuit-start').value = convertDotToComma(datas_forms['queda_tensao_partida'])
    CheckCheckboxPName(datas_forms['unipolar_checked'], 'checkbox-formacao-bt-cc')
    document.getElementById('pot-bt-formacao').value = convertDotToComma(datas_forms['uni_value_pot'])
    document.getElementById('sec-bt-formacao').value = convertDotToComma(datas_forms['uni_value_sec'])
    $('#select_impar_cc_bt').val(datas_forms['impares'])
    ChangeImpares()
}

function CheckCheckboxPName(value, name){
    let all_checkboxes = document.getElementsByName(name)
    for (let i = 0; i < all_checkboxes.length; i++){
        if(all_checkboxes[i].value === value){
            all_checkboxes[i].checked = true

        }
        else{
            all_checkboxes[i].checked = false
        }
    }
}

function convertCommaToDot(value) {
  // Check if the value is not null or undefined
  if (value !== null && value !== undefined) {
    // Replace the comma with a dot if it exists
    return value.toString().replace(",", ".");
  }
  // Return null if the value is null
  return null;
}

function convertDotToComma(value) {
  // Check if the value is not null or undefined
  if (value !== null && value !== undefined) {
    // Replace the comma with a dot if it exists
    return value.toString().replace(".", ",");
  }
  // Return null if the value is null
  return null;
}


function GetDispProtSelected(){
    var all_radios = document.querySelectorAll('[name="checkbox_disp_prot"]')
    var element_selected = null
    for (let i = 0; i < all_radios.length; i++){
        if(all_radios[i].checked){
            element_selected = all_radios[i].value
            break
        }
    }
    return element_selected
}

function VerifyValuesFloatConfigCC(value, range_min, range_max){
    var valid = true
    if (isNaN(Number(value))){
        valid = false
    }
    else{
        if(range_max!=false) {
            if(Number(value)>=range_min && Number(value)<=range_max){
                valid = true
            }
            else{
                valid = false
            }
        }
    }
    return valid
}
function ExecFuncSend(){
    debugger;
    let nivel_tensao = document.getElementById('nivel_tensao_func_config_cc').value
    if(nivel_tensao.length>0){
        if(nivel_tensao === 'BT'){
            SendConfigCCBack()
        }
        else{
            SendConfigCCMtBack()
        }
    }
    else {
        return alert('Selecione uma tensão para os formularios serem liberados!')
    }

}

function SendConfigCCMtBack(){
    let datas_config_cc_mt = GetAndVerifyDatasFormsConfigCCMt()
    if (typeof datas_config_cc_mt === "string"){
        return alert(datas_config_cc_mt)
    }
    $.ajax({
        type: "POST",
        headers:{'X-CSRFToken': csrftoken},
        url: "ConfigCalcCabosMt/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(datas_config_cc_mt)},
        success: function (data){
            alert(data['return'])
          }
    });
}


// --------------------- Função cria tabela de visualização ---------------------//
function CreateTableMT(datas_table) {
    let table_MT = `
        <table class="ml-1 mt-1 font_size_0_8 border border-info">
            <tbody class="bg-white">
                <tr class="bg-info">
                    <td class="text-white"><b>Método de Referência - ${datas_table['mt_ref']}</b></td>
                </tr>
                <tr class="p-1">
                    <td>
                     <img class="w-50" src="data:image/png;base64,${datas_table['imagem']}">
                    </td>
                </tr>
                <tr>
                    <td>${datas_table['desc']}</td>
                </tr>
            </tbody>
        </table>`

    let toggle_ref = document.getElementById("toggle_ref")
    let tipo_cabo = document.getElementById("procalc-mt-type-cable")
    let options_tipo_cabos = `<option value="0">---</option>`
    document.getElementById('check_mt').checked = false
    if (datas_table['btn_toggle'] !== 1) {
        $('#table_grouping_mt').html(table_MT);
        toggle_ref.hidden = true;
    } else {
        toggle_ref.hidden = false;
        $('#table_grouping_mt').html(table_MT);
    }
    if (datas_table['ref_espc'] === 1) {
        options_tipo_cabos += `<option value="2D">UNIPOLAR D</option>`

    }
    if (datas_table['ref_just'] === 1) {
        options_tipo_cabos += `<option value="Just">UNIPOLAR JUST</option>`
    }

    if (datas_table['ref_trip'] === 1) {
         options_tipo_cabos += `<option value="Trip">TRIPOLAR</option>`
    }

    if (datas_table['ref_unip'] === 1) {
        options_tipo_cabos += `<option value="Just">UNIPOLAR</option>`
    }


    if (datas_table['enterrado'] === 1){
        document.getElementById('fatores_enterrados').hidden=false
        document.getElementById('fatores_resist_termica').hidden = false
        CreateTableFEnterrado(datas_table['fator_terra'], 'resistencia')
        CreateTableFEnterrado(datas_table['fator_dist'], 'profundidade')
    }
    else{
        document.getElementById('fatores_enterrados').hidden=true
        document.getElementById('fatores_resist_termica').hidden = true
    }
    tipo_cabo.innerHTML = options_tipo_cabos
}


function CreateTableFEnterrado(datas_table, resist_dist) {
    let th_str = ''
    let td_str = ''
    for(let i=0; i< datas_table.length ;i++){
        th_str += `<th class="bg-info text-white text-nowrap px-3">${datas_table[i][0]}</th>`
        td_str += `<td onclick="Fill_Fator('${datas_table[i][1]}' ,'${resist_dist}')" class="tb_f_agrup px-3">${datas_table[i][1]}</td>`
    }
    let label_str = ''
    if (resist_dist === 'resistencia'){
       label_str = 'Resistência Termica. (K.mW)'
    }else{
        label_str = 'Profundidade (m)'
    }

    let tb_html = `
        <table class="table-bordered font_size_0_8">
            <thead>
                <tr>
                    <th class="bg-info text-white px-3 text-nowrap" rowspan="2">${label_str}</th>
                </tr>
                <tr class="bg-info text-white">
                ${th_str}
                </tr>
            </thead>
            <tbody class="bg-white">
                <tr>
                    <th class="bg-info text-white px-3" scope="row">Fator de correção</th>
                    ${td_str}
                </tr>
            </tbody>
        </table>
    `
    if (resist_dist === 'resistencia'){
       $('#table_resistencia').html(tb_html)
    }else{
        $('#table_distancia').html(tb_html)
    }

}



function CreateTableFAgrupNBR(datas_table) {
    let tb_html = `
        <table class="table-bordered font_size_0_8">
            <thead>
                <tr>
                    <th rowspan="2" width="30px">Ref.</th>
                    <th rowspan="2">Forma de agrupamento dos condutores</th>
                    <th colspan="12">Número de circuitos ou de cabos multipolares</th>
                </tr>
                <tr>
                    <th width="30px">1</th>
                    <th width="30px">2</th>
                    <th width="30px">3</th>
                    <th width="30px">4</th>
                    <th width="30px">5</th>
                    <th width="30px">6</th>
                    <th width="30px">7</th>
                    <th width="30px">8</th>
                    <th width="50px">9 a 11</th>
                    <th width="50px">12 a 15</th>
                    <th width="50px">16 a 19</th>
                    <th>>=20</th>
                </tr>
            </thead>
            <tbody class="bg-white">
                <tr>
                    <th scope="row">${datas_table['ref_num']}</th>
                    <td>${datas_table['desc']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['1']}')" class="tb_f_agrup">${datas_table['1']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['2']}')" class="tb_f_agrup">${datas_table['2']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['3']}')" class="tb_f_agrup">${datas_table['3']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['4']}')" class="tb_f_agrup">${datas_table['4']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['5']}')" class="tb_f_agrup">${datas_table['5']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['6']}')" class="tb_f_agrup">${datas_table['6']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['7']}')" class="tb_f_agrup">${datas_table['7']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['8']}')" class="tb_f_agrup">${datas_table['8']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['9/11']}')" class="tb_f_agrup">${datas_table['9/11']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['12/15']}')" class="tb_f_agrup">${datas_table['12/15']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['16/19']}')" class="tb_f_agrup">${datas_table['16/19']}</td>
                    <td onclick="SetVelueGrounping('${datas_table['20']}')" class="tb_f_agrup">${datas_table['20']}</td>
                </tr>
            </tbody>
        </table>
    `
    $('#table_grouping').html(tb_html)
}

function SendConfigCCBack(){
    var datas_config_cc = GetAndVerifyDatasConfigCCBt()
    if(typeof datas_config_cc === "string"){
        return alert(datas_config_cc)
    }
    $.ajax({
        type: "POST",
        headers:{'X-CSRFToken':csrftoken},
        url: "ConfigCalcCabos/",
        dataType: 'json',
        data: {'DatasFront': JSON.stringify(datas_config_cc)},
        success: function (data){
            alert(data['return'])
        }
    });
}


function ErrorInForm(dict_datas){
    let value = dict_datas['value']
    var error = false
    if(value === '---' || value === '0' || value === ''){
        error = true
    }
    else{
        if(Array.from(Object.keys(dict_datas)).includes('min') && Array.from(Object.keys(dict_datas)).includes('max')){
            if(VerifyValuesWithRange(value, dict_datas['min'], dict_datas['max'])){
                error = true
            }
        }
    }
    return error
}


// --------------------- Função Adiciona validação ---------------------//
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

function GetAndVerifyDatasFormsConfigCCMt(){
    debugger;
    let func = $('#func-config-cc').val()
    let id_maneira_install = $('#procalc-mt-install-mode').val()
    let id_class_tensao = $('#procalc-mt-class-voltage').val()
    let id_cabo = $('#procalc-mt-cable').val()
    let id_blind = $('#blindagem').val()
    let tipo_cabo = $('#procalc-mt-type-cable').val()
    let id_temperatura = $('#procalc-mt-ambient-temperature').val()
    let material = $('#procalc-campo-material-cabo-sl').val()
    let queda_tensao_max = convertCommaToDot(document.getElementById('procalc-mt-drop-voltage').value)
    let queda_tensao_max_partida = document.getElementById('queda_tensao_partida').value.length>0?convertCommaToDot(document.getElementById('queda_tensao_partida').value):null
    let f_agrup = convertCommaToDot(document.getElementById('procalc-mt-clust-fac').value)
    let icc = convertCommaToDot(document.getElementById('procalc-mt-chain-cc').value)
    let tempo_icc = convertCommaToDot(document.getElementById('procalc-mt-time-corrent-cond').value)
    let sec_min = $('#secao_minima').val()
    let sec_max = $('#secao_maxima').val()
    let num_cond = document.getElementById('procalc-mt-num-cond').value.length>0?document.getElementById('procalc-mt-num-cond').value:null
    let fator_profund = convertCommaToDot(document.getElementById('fator_dist_terra').value)
    let fator_resist_termica = document.getElementById('fator_resist_termica').value
    let check_blind_aterrada = document.getElementById('blindagem_enterrada').checked
    let icc_terra = check_blind_aterrada ? convertCommaToDot(document.getElementById('procalc-mt-icc-terra').value): null
    let tempo_icc_terra = check_blind_aterrada ? convertCommaToDot(document.getElementById('procalc-mt-tempo-icc-terra').value): null
    var all_funcs = document.getElementById('all_func_config_cc').checked
    var error = false
    var msg_alert = ''
    if (func !== "none"){
        let elements_not_nulls = {
            'procalc-mt-install-mode': {'value': id_maneira_install},
            'procalc-mt-class-voltage': {'value': id_class_tensao},
            'procalc-mt-cable': {'value': id_cabo},
            'blindagem': {'value': id_blind},
            'procalc-mt-type-cable': {'value': tipo_cabo},
            'procalc-mt-ambient-temperature': {'value': id_temperatura},
            'procalc-mt-drop-voltage': {'value': queda_tensao_max, 'min': 0, 'max': 100},
            'procalc-mt-clust-fac': {'value': f_agrup, 'min': 0, 'max': 1},
            'procalc-mt-chain-cc': {'value': icc, 'min': 0, 'max': 1000},
            'procalc-mt-time-corrent-cond': {'value': tempo_icc, 'min': 0.0001, 'max': 5}
        }
        let elements_null = {
            'queda_tensao_partida': {'value': queda_tensao_max_partida, 'min': 0, 'max': 100},
            'procalc-mt-num-cond': {'value': num_cond, 'min': 1, 'max': null}
        }
        if(check_blind_aterrada){
            elements_not_nulls['procalc-mt-icc-terra'] = {'value': icc_terra, 'min': 0, 'max': 1000}
            elements_not_nulls['procalc-mt-tempo-icc-terra'] = {'value': tempo_icc_terra, 'min': 0.0001, 'max': 5}
        }
        for(let item in elements_not_nulls){
            let error_in_element = ErrorInForm(elements_not_nulls[item])
            if(error_in_element){
                ClassIsInvalid(item)
                if(!error){
                    error = true
                    msg_alert = 'Verifique os formularios e preencha novamente!!'
                }
            }
            else{
                RemoveClassIsInvalid(item)
            }
        }
        for(let item in elements_null){
            if(elements_null[item]['value'] !== null){
                let error_in_element = ErrorInForm(elements_null[item])
                if (error_in_element){
                    ClassIsInvalid(item)
                    if(!error){
                        error = true
                        msg_alert = 'Verifique os formularios e preencha novamente!!'
                    }
                }
                else{
                    RemoveClassIsInvalid(item)
                }
            }
            else{
                RemoveClassIsInvalid(item)
            }
        }
    }
    else {
        error = true
        msg_alert = 'Selecione uma função!!'
    }
    if(!error){
        return {
            'func': func, 'id_maneira_install': id_maneira_install, 'id_class_tensao': id_class_tensao,
            'id_cabo': id_cabo, 'id_blind': id_blind, 'tipo_cabo': tipo_cabo, 'id_temperatura': id_temperatura,
            'material': material, 'queda_tensao_max': queda_tensao_max,
            'queda_tensao_max_partida': queda_tensao_max_partida, 'f_agrup': f_agrup, 'icc': icc, 'tempo_icc': tempo_icc,
            'sec_min': sec_min, 'sec_max': sec_max, 'num_cond': num_cond, 'f_profund': fator_profund,
            'f_resist_termica': fator_resist_termica, 'check_blind': check_blind_aterrada, 'icc_terra': icc_terra,
            'tempo_icc_terra': tempo_icc_terra, 'all_funcs': all_funcs
        }
    }
    else{
        return msg_alert
    }
}




function ManeiraInstalarMT() {
    debugger;
    let id_maneira_instal_mt = document.getElementById("procalc-mt-install-mode").selectedOptions[0].value;
    if (id_maneira_instal_mt !== '0') {
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/calc_cabos/a1calccabosmt/CreateTableCalcMT/" + id_maneira_instal_mt,
            dataType: 'json',
            data: {},
            success: function (data) {
                CreateTableMT(data['tableMT'])
            },
            failure: function (error) {
            },
        })
    }
}
// --------------------- Função preenche option temperatura ---------------------//
function PreencheSelectTemperature(data) {
    let temp_option = document.getElementById('procalc-mt-ambient-temperature')
    let id_temp = 0
    let value_temp = 1
    let gera_option = `<option value="0">---</option>`
    let item_option = ''

    for (let i = 0; i < data.length;i++){
        let list_data = data[i]
        item_option = `<option value="${list_data[id_temp]}">${list_data[value_temp]}</option>`
        gera_option += item_option;
    }
    temp_option.innerHTML = gera_option;
}



function SelectTemperature() {
    let maneira_instalar = document.getElementById("procalc-mt-install-mode").selectedOptions[0].value
    let id_cabo = document.getElementById("procalc-mt-cable").selectedOptions[0].value
    let check_sol = document.getElementById('check_mt').checked
    if (id_cabo !== '0' && maneira_instalar !== '0') {
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            url: "/app/calc_cabos/a1calccabosmt/FindTemperature/",
            dataType: 'json',
            data: {"IDcabo": id_cabo, 'ManeiraInstalar': maneira_instalar, 'CheckSol': check_sol},
            success: function (data) {
                PreencheSelectTemperature(data['SelectTemperature'])
            },
            failure: function (error) {
            },
        })
    }
    else{
        PreencheSelectTemperature([])
    }
}



function ChangeBlindagemEnterrada(checked){
    var element_icc_fase_terra = document.getElementById('procalc-mt-icc-terra')
    var element_tempo_icc_fase_terra = document.getElementById('procalc-mt-tempo-icc-terra')
    var hide = checked ? false : true
    element_icc_fase_terra.hidden = hide
    for(let i=0; i< element_icc_fase_terra.labels.length ;i++){
        element_icc_fase_terra.labels[i].hidden = hide
    }
    element_tempo_icc_fase_terra.hidden = hide
    for(let i=0; i< element_tempo_icc_fase_terra.labels.length ;i++){
        element_tempo_icc_fase_terra.labels[i].hidden = hide
    }
}
function FillFormsConfigCcMt(datas_config_cc_mt){
    $('#procalc-mt-install-mode').val(datas_config_cc_mt['maneira_install'])
    ManeiraInstalarMT()
    $('#procalc-mt-class-voltage').val(datas_config_cc_mt['classe_tensao'])
    $('#procalc-mt-cable').val(datas_config_cc_mt['cabo'])
    document.getElementById('check_mt').checked = datas_config_cc_mt['check_button']
    SelectTemperature()
    $('#blindagem').val(datas_config_cc_mt['blindagem'])
    $('#procalc-mt-type-cable').val(datas_config_cc_mt['tipo_cabo'])
    $('#procalc-mt-ambient-temperature').val(datas_config_cc_mt['temperatura'])
    $('#procalc-campo-material-cabo-sl').val(datas_config_cc_mt['material'])
    document.getElementById('procalc-mt-drop-voltage').value = convertDotToComma(datas_config_cc_mt['queda_tensao'])
    document.getElementById('queda_tensao_partida').value = convertDotToComma(datas_config_cc_mt['queda_tensao_pt'])
    document.getElementById('procalc-mt-clust-fac').value = convertDotToComma((datas_config_cc_mt['f_agrup']))
    document.getElementById('blindagem_enterrada').checked = datas_config_cc_mt['check_blind']
    ChangeBlindagemEnterrada(datas_config_cc_mt['check_blind'])
    document.getElementById('procalc-mt-icc-terra').value = convertDotToComma(datas_config_cc_mt['icc_terra'])
    document.getElementById('procalc-mt-tempo-icc-terra').value = convertDotToComma(datas_config_cc_mt['tempo_icc_terra'])
    document.getElementById('secao_minima').value = convertDotToComma(datas_config_cc_mt['sec_min'])
    document.getElementById('secao_maxima').value = convertDotToComma(datas_config_cc_mt['sec_max'])
    document.getElementById('procalc-mt-num-cond').value = datas_config_cc_mt['num_cond_fase']
    document.getElementById('procalc-mt-chain-cc').value = convertDotToComma(datas_config_cc_mt['icc'])
    document.getElementById('procalc-mt-time-corrent-cond').value = convertDotToComma(datas_config_cc_mt['tempo_icc'])
    if(!datas_config_cc_mt['sec_min'] === null){
        $('#secao_minima').val(datas_config_cc_mt['sec_min'])
    }
    if(!datas_config_cc_mt['sec_max'] === null){
        $('#secao_maxima').val(datas_config_cc_mt['sec_max'])
    }
    document.getElementById('fator_dist_terra').value = datas_config_cc_mt['f_profund']
    document.getElementById('fator_resist_termica').value = datas_config_cc_mt['f_resist_termica']
}

function ChangeImpares(){
    let value_par = '0'
    let impar_selected = $('#select_impar_cc_bt').val()
    if(impar_selected !== '0'){
        value_par = impar_selected === '1X3'?'1X4':'1X3'
    }
    $('#select_par_cc_bt').val(value_par)
}
