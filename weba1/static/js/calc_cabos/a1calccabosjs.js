let csrf = document.getElementsByName("csrfmiddlewaretoken")
let id_task_book
// Variaveis globais de controle do cronômetro
let tempoConsultaCalcCabos = 0;
let cronometroCalcCabos;

 // --------------------- Atualiza a contagem do cronômetro ---------------------//
function atualizarCronometro() {
    const minutos = Math.floor(tempoConsultaCalcCabos / 60000);
    const segundos = Math.floor((tempoConsultaCalcCabos % 60000) / 1000);
    const milissegundos = tempoConsultaCalcCabos % 1000;
    const minutosStr = minutos.toString().padStart(2, '0');
    const segundosStr = segundos.toString().padStart(2, '0');
    const milissegundosStr = milissegundos.toString().padStart(3, '0').slice(0, 2);
    const tempoStr = `${minutosStr}:${segundosStr}:${milissegundosStr}`;
    document.getElementById('cronometroCalcCabos').textContent = tempoStr;
}

// --------------------- Inicia a contagem do cronômetro ---------------------//
function iniciarCronometro() {
    cronometroCalcCabos = setInterval(() => {
        tempoConsultaCalcCabos += 10;
        atualizarCronometro();
    }, 10);
}

// --------------------- Zera a contagem do cronômetro ---------------------//
function finalizarCronometro() {
    clearInterval(cronometroCalcCabos);
    tempoConsultaCalcCabos = 0;
    atualizarCronometro();
}

function Fill_Tipo_Cabo(value) {
    let options_cabos = $.parseJSON(String(value.selectedOptions[0].value).replaceAll('\'', '"'))
    let string_html_options = '<option value="0">---</option>\n'
    for (let opt in options_cabos) {
        string_html_options += `<option value="${opt}">${options_cabos[opt]}</option>\n`
    }
    document.getElementById('tipo_cabo').innerHTML = string_html_options
}


function ShowConformacaoCabos(tipo_cabo) {
    if (tipo_cabo === 'UNIPOLAR') {
        document.getElementById("conformacao_cabos_unipolar").hidden = false
    } else {
        document.getElementById("conformacao_cabos_unipolar").hidden = true
        $('#unipolar_conformacao').val(0)
    }
    $('#unipolar_espacameno').val(0)
}

function ShowEspacamentoUnipolar(conformacao) {
    if (conformacao === 'Justaposto espaçado Horizontal' || conformacao === 'Justaposto espaçado Vertical') {
        document.getElementById("disctancia_cabos_unipolar").hidden = false
    } else {
        document.getElementById("disctancia_cabos_unipolar").hidden = true
        $('#unipolar_espacameno').val(0)
    }
}

function ClearFatorAgrupamento(){
    document.getElementById('procalc-mt-clust-fac').value = ''
}

function VerifyFormsCalcBt(id_element, range_min, range_max) {
    var val_element = document.getElementById(id_element).value
    var list_class_element = Array.from(document.getElementById(id_element).classList)
    if (list_class_element.includes('bg-danger')) {
        RemoveClassIsInvalid(id_element)
    }
    if (isNaN(Number(val_element))) {
        ClassIsInvalid(id_element)
    } else {
        if (range_max != false) {
            if (Number(val_element) >= range_min && Number(val_element) <= range_max) {
                RemoveClassIsInvalid(id_element)
            } else {
                ClassIsInvalid(id_element)
            }
        } else {
            if (Number(val_element) >= range_min){
                RemoveClassIsInvalid(id_element)
            }
            else{
                ClassIsInvalid(id_element)
            }
        }
    }
}

async function SendCalcBack(method) {
    debugger;
    let project = $('#procalc-bt-project').val()
    let os = document.getElementById('os_calc').value
    let area = document.getElementById('area_calc').value
    let circuito = document.getElementById('procalc-circuito').value
    let id_maneira_instalacao = document.getElementById("procalc-install-mode").selectedOptions[0].value
    let checkbox_sobrecarga = document.getElementById('check_box_sobrecarga').checked
    let checkbox_cc = document.getElementById('check_box_cc').checked
    let id_sistema = document.getElementById("procalc-system").selectedOptions[0].title
    let id_cabo = document.getElementById("procalc-cable").selectedOptions[0].value
    let comprimento = document.getElementById("procalc-length").value
    let id_tipo_cabo = document.getElementById("tipo_cabo").selectedOptions[0].value
    let id_element_temperature = document.getElementById("procalc-install-mode").selectedOptions[0].title !== '0'?  'procalc-temperature-solo' : 'procalc-temperature-env'
    let id_temperatura = document.getElementById(id_element_temperature).selectedOptions[0].value
    let id_conformacao = document.getElementById('unipolar_conformacao').selectedOptions[0].value
    let id_unipolar_espacameno = document.getElementById('unipolar_espacameno').selectedOptions[0].value
    let tensao = document.getElementById("procalc-voltage-fase").value
    let corrente = document.getElementById("corrente_calc").value
    let secao_maxima = document.getElementById("secao_maxima").value
    let corrente_partida = document.getElementById("corrente_calc_partida").value
    let fator_agrupamento = document.getElementById("procalc-clustering-factor").value
    let corrente_cc = document.getElementById("procalc-circuit-current").value
    let corrente_cc_limitada = document.getElementById("procalc-circuit-current-limit").value
    let queda_tensao_origem = document.getElementById("procalc-drop-voltage-circuit").value
    let queda_tensao_partida = document.getElementById("procalc-drop-voltage-circuit-start").value
    let material_condutor = document.getElementById('material_condutor').selectedOptions[0].value
    let e_motor = false
    let desequilibrado = document.getElementById('check_box_desequilibrado').checked
    let secao_minima = document.getElementById('procalc-sec-cond').selectedOptions[0].value
    let numero_condutor = document.getElementById('numero_condutores').value
    let fator_potencia = document.getElementById('fator_potencia').value
    let fator_potencia_partida = document.getElementById('fator_potencia_partida').value
    let harmonico = document.getElementById('procalc-harmonic').value
    let corrente_disjutor = document.getElementById('corrente_disjuntor_nominal').value
    let corrente_regulada = null
    let tipo_partida = null
    let checkbox_tempo_livre = document.getElementById('check_box_tempo_livre').checked
    let disjuntor = disjuntor_selected()
    let ctrl = verifica_campos_e_valida()
    let id_temp_disp_prot = ''
    let calc_selected = document.getElementById('calc_bt_selected').value === ''?null:document.getElementById('calc_bt_selected').value
    if (ctrl) {
        if($('#procalc-tipo-carga').val() === 'MOTOR'){
            e_motor = true
            tipo_partida = $('#procalc_tipo_partida').val()
        }
        if(checkbox_sobrecarga){
            id_temp_disp_prot = 'temp_dips_protecao_sobrecarga'
            disjuntor = null
            corrente_disjutor = null
            corrente_cc_limitada = null
        }
        else{
            id_temp_disp_prot = checkbox_tempo_livre || disjuntor === 'Outro' ? 'temp_dips_protecao_livre' : 'temp_dips_protecao'
            if(document.getElementById('check_box_corrente_regulada').checked){
                corrente_regulada = document.getElementById('procalc-corrente-regulada').value
            }
        }
        let value_temp_disp_prot = id_temp_disp_prot === 'temp_dips_protecao' ? document.getElementById(id_temp_disp_prot).selectedOptions[0].value : document.getElementById(id_temp_disp_prot).value
        if(checkbox_cc){
            value_temp_disp_prot = null
            corrente_cc = null
        }
        let verify = await VerifyCircuitoOk(method, calc_selected, project, circuito)
        if(!verify['error']){
            let dict_data = {
                'project': project,
                'os': os,
                'area': area,
                'id_maneira_instalacao': id_maneira_instalacao,
                'id_sistema': id_sistema,
                'material_condutor': material_condutor,
                'id_cabo': id_cabo,
                'comprimento': comprimento,
                'id_uni_multi': id_tipo_cabo,
                'id_temperatura': id_temperatura,
                'id_unipolar_espacameno': id_unipolar_espacameno,
                'id_conformacao': id_conformacao,
                'tensao': tensao,
                'corrente': corrente,
                'corrente_partida': corrente_partida,
                'fator_agrupamento': fator_agrupamento,
                'corrente_cc': corrente_cc,
                'corrente_cc_limitada': corrente_cc_limitada,
                'queda_tensao_origem': queda_tensao_origem,
                'queda_tensao_partida': queda_tensao_partida,
                'harmonico': harmonico,
                'secao_minima': secao_minima,
                'secao_maxima': secao_maxima,
                'numero_condutor': numero_condutor,
                'e_motor': e_motor,
                'fator_potencia': fator_potencia,
                'fator_potencia_partida': fator_potencia_partida,
                'tempo_disp_protecao': value_temp_disp_prot,
                'disjuntor': disjuntor,
                'e_desequilibrado': desequilibrado,
                'corrente_disjutor': corrente_disjutor,
                'tipo_partida': tipo_partida,
                'corrente_regulada': corrente_regulada,
                'circuito': circuito,
                'checkbox_tempo_livre': checkbox_tempo_livre,
                'checkbox_sobrecarga': checkbox_sobrecarga,
                'checkbox_cc': checkbox_cc,
                'calc_selected': calc_selected,
                'method': method
            }

            $.ajax({
                type: 'POST',
                url: "/app/calc_cabos/a1calccabos/",
                enctype: 'multipart/form-data',
                data: {'data': JSON.stringify(dict_data), 'csrfmiddlewaretoken': csrf[0].value},
            }).done(function (data) {
                if (data['status']) {
                    swal({
                        text: 'Calculo efetuado!',
                        icon: "success",
                        button: 'Fechar'
                    })
                    FillCardDatasCalc(data['data'])
                    ChangeProjeto()
                    SelectCalcBtSelected(data['data'])
                } else {
                    alert(data['data'])
                }
            })
        }
        else{
            swal({
                text: verify['msg_return'],
                icon: "error",
                button: 'Fechar'
            })
        }

    }
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

function verifica_campos_e_valida() {
    let checkbox_tempo_livre = document.getElementById('check_box_tempo_livre').checked
    let checkbox_sobrecarga = document.getElementById('check_box_sobrecarga').checked
    let project = $('#procalc-bt-project').val()
    let circuito = document.getElementById('procalc-circuito').value
    let harmonico = document.getElementById('procalc-clustering-factor').value
    let id_maneira_instalacao = document.getElementById("procalc-install-mode").selectedOptions[0].value
    let id_element_temperature = document.getElementById("procalc-install-mode").selectedOptions[0].title !== '0'?  'procalc-temperature-solo' : 'procalc-temperature-env'
    let id_sistema = document.getElementById("procalc-system").selectedOptions[0].title
    let id_cabo = document.getElementById("procalc-cable").selectedOptions[0].value
    let comprimento = document.getElementById("procalc-length").value
    let id_tipo_cabo = document.getElementById("tipo_cabo").selectedOptions[0].value
    let id_temperatura = document.getElementById(id_element_temperature).selectedOptions[0].value
    let id_conformacao = document.getElementById('unipolar_conformacao').selectedOptions[0].value
    let id_unipolar_espacameno = document.getElementById('unipolar_espacameno').selectedOptions[0].value
    let tensao = document.getElementById("procalc-voltage-fase").value
    let corrente = document.getElementById("corrente_calc").value
    let corrente_partida = document.getElementById("corrente_calc_partida").value
    let fator_agrupamento = document.getElementById("procalc-clustering-factor").value
    let corrente_cc = document.getElementById("procalc-circuit-current").value
    let queda_tensao_origem = document.getElementById("procalc-drop-voltage-circuit").value
    let queda_tensao_partida = document.getElementById("procalc-drop-voltage-circuit-start").value
    let e_motor = false
    let check_box_corrente_regulada = document.getElementById('check_box_corrente_regulada').checked
    let titulo_tipo_cabo = document.getElementById("tipo_cabo").selectedOptions[0].innerText
    let titulo_conformacao_cabos = document.getElementById("unipolar_conformacao").selectedOptions[0].innerText
    let fator_potencia = document.getElementById('fator_potencia').value
    let fator_potencia_partida = document.getElementById('fator_potencia_partida').value
    let corrente_disjutor = document.getElementById('corrente_disjuntor_nominal').value
    let corrente_regulada = document.getElementById('procalc-corrente-regulada').value
    let corrente_limitada = document.getElementById('procalc-circuit-current-limit').value
    let disp_prot = disjuntor_selected()
    let checkbox_cc = document.getElementById('check_box_cc').checked
    let datas_alert = false
    let ctrl = true

    if (project === '0'){
        ClassIsInvalid('procalc-bt-project')
        ctrl = false
        datas_alert = 'Selecione um projeto!!'
    }
    else{
        RemoveClassIsInvalid('procalc-bt-project')
    }

    if (circuito.length === 0) {
        ClassIsInvalid('procalc-circuito')
        ctrl = false
    }
    else{
        RemoveClassIsInvalid('procalc-circuito')
    }


    if($('#procalc-tipo-carga').val() === 'MOTOR'){
        e_motor = true
    }

    let id_temp = ''
    if(checkbox_sobrecarga){
        id_temp = 'temp_dips_protecao_sobrecarga'
    }
    else{
        id_temp = checkbox_tempo_livre || disp_prot === 'Outro' ? 'temp_dips_protecao_livre' : 'temp_dips_protecao'
    }
    let value_temp_disp = id_temp === 'temp_dips_protecao' ? document.getElementById(id_temp).selectedOptions[0].innerHTML : document.getElementById(id_temp).value

    if(!checkbox_cc){
        if (isNaN(Number(value_temp_disp)) || Number(value_temp_disp) < 0 || value_temp_disp.length === 0) {
            ClassIsInvalid(id_temp)
            ctrl = false
        }
        else {
            RemoveClassIsInvalid(id_temp)
        }

        if(isNaN(parseFloat(corrente_cc)) || Number(corrente_cc) === 0){
            ClassIsInvalid("procalc-circuit-current")
            ctrl = false
        } else {RemoveClassIsInvalid("procalc-circuit-current")}
    }
    else{
        RemoveClassIsInvalid(id_temp)
        RemoveClassIsInvalid("procalc-circuit-current")
    }

    if(!checkbox_sobrecarga){
        if(check_box_corrente_regulada){
            if(corrente_regulada.length>0){
                if(isNaN(Number(corrente_regulada))){
                    ClassIsInvalid('procalc-corrente-regulada')
                    ctrl = false
                }
                else{
                    RemoveClassIsInvalid("procalc-corrente-regulada")
                }
            }
            else{
                ClassIsInvalid('procalc-corrente-regulada')
                ctrl = false
            }
        }

        if (corrente_disjutor.length > 0) {
            if (isNaN(Number(corrente_disjutor)) || Number(corrente_disjutor) < corrente) {
                ClassIsInvalid("corrente_disjuntor_nominal")
                ctrl = false
            } else {RemoveClassIsInvalid("corrente_disjuntor_nominal")}
        }
        else{
            ClassIsInvalid("corrente_disjuntor_nominal")
            ctrl = false
        }

        if(disp_prot === ''){
            ctrl = false
            alert('Selecione um Dispositivo de Proteção')
        }
        else{
             if (disjuntor_selected() === 'Disjuntor Limitador') {
                if (Number(corrente_disjutor) > 225) {
                    ctrl = false;
                    alert("Corrente nominal é incompatível com a corrente do dispositivo de proteção")
                }
                if(corrente_limitada.length === 0 || isNaN(Number(corrente_limitada))){
                    ClassIsInvalid('procalc-circuit-current-limit')
                    ctrl = false
                }
                else{
                    RemoveClassIsInvalid('procalc-circuit-current-limit')
                }
             }
             else if (disjuntor_selected() === 'Caixa Moldada') {
                if (Number(corrente_disjutor) > 1200) {
                    ctrl = false;
                    alert("Corrente nominal é incompatível com a corrente do dispositivo de proteção")
                }
             }
             else if (disjuntor_selected() === 'Caixa Aberta') {
                if (Number(corrente_disjutor) < 400 && Number(corrente_disjutor) > 4000) {
                    ctrl = false;
                    alert("Corrente nominal é incompatível com a corrente do dispositivo de proteção")
                }
             }
        }
    }


    if (isNaN(Number(harmonico)) || Number(harmonico) > 100) {
        ClassIsInvalid("procalc-clustering-factor")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-clustering-factor")}

    if (id_maneira_instalacao === '0') {
        ClassIsInvalid("procalc-install-mode")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-install-mode")}

    if (id_sistema === '0') {
        ClassIsInvalid("procalc-system")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-system")}

    if (id_cabo === '0') {
        ClassIsInvalid("procalc-cable")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-cable")}

    if (id_tipo_cabo === '0') {
        ClassIsInvalid("tipo_cabo")
        ctrl = false
    } else {RemoveClassIsInvalid("tipo_cabo")}

    if (id_temperatura === '0') {
        ClassIsInvalid(id_element_temperature)
        ctrl = false
    } else {RemoveClassIsInvalid(id_element_temperature)}

    if (isNaN(Number(comprimento)) || Number(comprimento) === 0) {
        ClassIsInvalid("procalc-length")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-length")}

    if (isNaN(Number(tensao)) || Number(tensao) === 0 || Number(tensao) > 1000) {
        ClassIsInvalid("procalc-voltage-fase")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-voltage-fase")}

    if(isNaN(Number(corrente)) || Number(corrente) === 0){
        ClassIsInvalid("corrente_calc")
        ctrl = false
    } else {RemoveClassIsInvalid("corrente_calc")}

    if(e_motor === true){
        if((isNaN(Number(corrente_partida)) || Number(corrente_partida) === 0)){
            ClassIsInvalid("corrente_calc_partida")
            ctrl = false
        } else {RemoveClassIsInvalid("corrente_calc_partida")}

        if((isNaN(Number(fator_potencia_partida)) || Number(fator_potencia_partida)>1)){
            ClassIsInvalid("fator_potencia_partida")
            ctrl = false
        } else {RemoveClassIsInvalid("fator_potencia_partida")}
    }
    if(isNaN(Number(fator_agrupamento)) || Number(fator_agrupamento) === 0 || Number(fator_agrupamento)>1){
        ClassIsInvalid("procalc-clustering-factor")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-clustering-factor")}

    if(!checkbox_cc){
        if(isNaN(parseFloat(corrente_cc)) || Number(corrente_cc) === 0){
            ClassIsInvalid("procalc-circuit-current")
            ctrl = false
        } else {RemoveClassIsInvalid("procalc-circuit-current")}
    }

    if((isNaN(Number(queda_tensao_origem))) || Number(queda_tensao_origem) === 0 || Number(queda_tensao_origem)>100){
        ClassIsInvalid("procalc-drop-voltage-circuit")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-drop-voltage-circuit")}

    if((isNaN(Number(queda_tensao_partida)) || Number(queda_tensao_partida)>100 || Number(queda_tensao_partida) === 0) && e_motor){
        ClassIsInvalid("procalc-drop-voltage-circuit-start")
        ctrl = false
    } else {RemoveClassIsInvalid("procalc-drop-voltage-circuit-start")}

    if(id_tipo_cabo !== '0' && id_conformacao === '0' && titulo_tipo_cabo === 'UNIPOLAR'){
        ClassIsInvalid("unipolar_conformacao")
        ctrl = false
    } else {RemoveClassIsInvalid("unipolar_conformacao")}

    if(id_tipo_cabo !== '0' && id_conformacao !== '0' && id_unipolar_espacameno === '0' && (titulo_conformacao_cabos === 'Justaposto espaçado Horizontal' || titulo_conformacao_cabos === 'Justaposto espaçado Vertical')) {
        ClassIsInvalid("unipolar_espacameno")
        ctrl = false
    } else {RemoveClassIsInvalid("unipolar_espacameno")}

    if(isNaN(Number(fator_potencia)) || Number(fator_potencia)>1 || fator_potencia.length === 0){
        ClassIsInvalid("fator_potencia")
        ctrl = false
    } else {RemoveClassIsInvalid("fator_potencia")}

    if(datas_alert !== false){
        alert(datas_alert)
    }
    return ctrl
}

function secao_minima() {
    let secao = document.getElementById('procalc-sec-cond').selectedOptions[0].value
    if (secao !== '0') {
        document.getElementById('numero_condutores').value = ''
    }
}

function numero_condutores() {
    $('#procalc-sec-cond').val('0')
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

function SelectDisjuntorLimitado() {
    document.getElementById('corrente_limitada').hidden = false
    document.getElementById('temp_dips_protecao').hidden = false
    document.getElementById('temp_dips_protecao').innerHTML = `<option>---</option>
                                                               <option>0.008</option>`
    document.getElementById('temp_dips_protecao_livre').hidden = true
    document.getElementById('content_checkbox_tempo_livre').hidden = false
}

function SelectDisjuntorCaixaMoldada() {
    document.getElementById('corrente_limitada').hidden = true
    document.getElementById('temp_dips_protecao').hidden = false
    document.getElementById('temp_dips_protecao').innerHTML = `<option>---</option>
                                                               <option>0.020</option>
                                                               <option>0.030</option>`
    document.getElementById('temp_dips_protecao_livre').hidden = true
    document.getElementById('content_checkbox_tempo_livre').hidden = false
}

function SelectDisjuntorCaixaaberta() {
    document.getElementById('corrente_limitada').hidden = true
    document.getElementById('temp_dips_protecao').hidden = false
    document.getElementById('temp_dips_protecao').innerHTML = `<option>---</option>
                                                               <option>0.040</option>
                                                               <option>0.060</option>`
    document.getElementById('temp_dips_protecao_livre').hidden = true
    document.getElementById('content_checkbox_tempo_livre').hidden = false
}

function SelectDispProtOutro() {
    document.getElementById('temp_dips_protecao').hidden = true
    document.getElementById('temp_dips_protecao_livre').hidden = false
    document.getElementById('corrente_limitada').hidden = true
    document.getElementById('content_checkbox_tempo_livre').hidden = true
}

function disjuntor_selected() {
    let disjuntor_caixa_aberta = document.getElementById('disjuntor_caixa_aberto').checked
    let disjuntor_caixa_moldada = document.getElementById('disjuntor_caixa_moldada').checked
    let disjuntor_limitador = document.getElementById('disjuntor_limitador').checked
    let outro = document.getElementById('disjuntor_outro').checked
    if (disjuntor_caixa_aberta) {
        return 'Caixa Aberta'
    }
    if (disjuntor_caixa_moldada) {
        return 'Caixa Moldada'
    }
    if (disjuntor_limitador) {
        return 'Disjuntor Limitador'
    }
    if (outro) {
        return 'Outro'
    }
    return ''
}

function load_image(id) {
    $.ajax({
        type: 'GET',
        url: `/app/calc_cabos/load_img_bt/${id}`,
        enctype: 'multipart/form-data',
        data: {},
    }).done(function (data) {
        if (data['status']) {
            document.getElementById('descritivo_modo_instalacao').hidden = false;
            document.getElementById('imagem').src = `data:image/png;base64,${data['data']}`
            document.getElementById('numero_metodo_instalacao').value = data['numero_MI']
            document.getElementById('texto_modo_instalacao').value = data['desc']
        } else {
            document.getElementById('descritivo_modo_instalacao').hidden = true;
        }
    })
}

function ShowTableCorrenteCurtoLimit() {
    let table = document.getElementById("table_icc_limitada")
    let eye_open = document.getElementById("botao_eye_corrente_curto")
    let eye_close = document.getElementById("botao_eye_corrente_curto_closed")
    if (eye_close.hidden !== true) {
        table.hidden = false
        eye_open.hidden = false
        eye_close.hidden = true
    } else {
        table.hidden = true
        eye_open.hidden = true
        eye_close.hidden = false
    }
}

function ShowTableGrouping() {
    let table = document.getElementById("table_grouping")
    let eye_open = document.getElementById("botao_eye")
    let eye_close = document.getElementById("botao_eye_closed")
    if (eye_close.hidden !== true) {
        table.hidden = false
        eye_open.hidden = false
        eye_close.hidden = true
    } else {
        table.hidden = true
        eye_open.hidden = true
        eye_close.hidden = false
    }
}

function ShowTableGroupingMT(change) {
    let id_table = "table_grouping_mt"
    let id_open_eye = "botao_eye_mt"
    let id_close_eye = "botao_eye_closed_mt"

    if (change === 'resistencia'){
        id_table = "table_resistencia"
        id_open_eye = "botao_eye_mt_fat_r"
        id_close_eye = "botao_eye_closed_mt_fat_r"

    }else if(change === 'profundidade'){
        id_table = "table_distancia"
        id_open_eye = "botao_eye_mt_dist"
        id_close_eye = "botao_eye_closed_mt_dist"
    }
    let table_mt = document.getElementById(id_table)
    let eye_open_mt = document.getElementById(id_open_eye)
    let eye_close_mt = document.getElementById(id_close_eye)
    if (eye_close_mt.hidden !== true) {
        table_mt.hidden = false
        eye_open_mt.hidden = false
        eye_close_mt.hidden = true
    } else {
        table_mt.hidden = true
        eye_open_mt.hidden = true
        eye_close_mt.hidden = false
    }
}

function SetVelueGrounping(value) {
    document.getElementById("procalc-clustering-factor").value = value
}

function ChangeManeiraInstalar() {
    var id_modo_instal = $('#procalc-install-mode').val()
    if (id_modo_instal !== '0') {
        $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrf},
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

async function ManeiraInstalarMT() {
    debugger;

    let id_maneira_instal_mt = document.getElementById("procalc-mt-install-mode").selectedOptions[0].value;
    if (id_maneira_instal_mt !== '0') {
         await $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrf},
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


async function SelectTemperature() {
    let maneira_instalar = document.getElementById("procalc-mt-install-mode").selectedOptions[0].value
    let id_cabo = document.getElementById("procalc-mt-cable").selectedOptions[0].value
    let check_sol = document.getElementById('check_mt').checked
    if (id_cabo !== '0' && maneira_instalar !== '0') {
        await $.ajax({
            type: "GET",
            headers: {'X-CSRFToken': csrf},
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



// --------------------- Função envia valores para cálculo ---------------------//
async function SendValuesToCalc(method) {
    let projeto = $('#procalc-mt-project').val()
    let circuito = document.getElementById("procalc-mt-circuit").value
    let maneira_instalar = document.getElementById("procalc-mt-install-mode").selectedOptions[0].value
    let tensao_servico = document.getElementById("procalc-mt-voltage-service").value
    let check_sol = document.getElementById("check_mt").checked
    let class_voltage = document.getElementById("procalc-mt-class-voltage").selectedOptions[0].value
    let class_voltage_content = document.getElementById("procalc-mt-class-voltage").selectedOptions[0].innerHTML
    let cabo = document.getElementById("procalc-mt-cable").selectedOptions[0].value
    let tipo_cabo = document.getElementById("procalc-mt-type-cable").selectedOptions[0].value
    let comprimento = document.getElementById("procalc-mt-length").value
    let temp_ambiente = document.getElementById("procalc-mt-ambient-temperature").selectedOptions[0].value
    let queda_tensao = document.getElementById("procalc-mt-drop-voltage").value
    let queda_tensao_partida = document.getElementById("queda_tensao_partida").value
    let corrente_projeto = document.getElementById("procalc-mt-chain-proj").value
    let corrente_partida = document.getElementById("corrente_partida").value
    let potencia_aparente = document.getElementById("procalc-mt-apparent-power").value
    let fator_de_potencia_nominal = document.getElementById("fator_de_potencia_nominal").value
    let fator_de_potencia_partida = document.getElementById("fator_de_potencia_partida").value
    let corrente_cc = document.getElementById("procalc-mt-chain-cc").value
    let tempo_corrente_cc = document.getElementById("procalc-mt-time-corrent-cond").value
    let fator_agrup = document.getElementById("procalc-mt-clust-fac").value
    let material = document.getElementById("procalc-campo-material-cabo-sl").selectedOptions[0].value
    let tipo_carga = document.getElementById("tipo_carga").selectedOptions[0].value
    let secao_minima = document.getElementById("secao_minima").selectedOptions[0].value
    let secao_maxima = document.getElementById("secao_maxima").selectedOptions[0].value
    let blindagem = document.getElementById("blindagem").selectedOptions[0].value
    let area = document.getElementById("area").value
    let os = document.getElementById("os").value
    let fator_resist_term = document.getElementById('fator_resist_termica').value
    let fator_dist_terra = document.getElementById('fator_dist_terra').value
    let check_blind = document.getElementById('blindagem_enterrada').checked
    let icc_fase_terra = null
    let tempo_icc = null
    var tipo_partida = null
    var num_cond_fase = null
    let calc_selected = document.getElementById('calc_mt_selected').value === ''?null:document.getElementById('calc_mt_selected').value
    let ctrl = 0
    let list_ids = {
        'procalc-mt-circuit': {'value': circuito},
        'procalc-mt-install-mode': {'value': maneira_instalar},
        'procalc-mt-voltage-service': {'value': tensao_servico, 'min': class_voltage_content === '3.6/6.0 kV' ? 0: Number(class_voltage_content.split('/')[0]), 'max': class_voltage_content === '3.6/6.0 kV' ? 6: Number(class_voltage_content.split('/')[1].replace('kV', ''))},
        'procalc-mt-class-voltage': {'value': class_voltage},
        'procalc-mt-cable': {'value': cabo},
        'procalc-mt-type-cable': {'value': tipo_cabo},
        'procalc-mt-length': {'value': comprimento, 'min': 0, 'max': null},
        'procalc-mt-ambient-temperature': {'value': temp_ambiente},
        'procalc-mt-chain-cc': {'value': corrente_cc, 'min': 0, 'max': null},
        'procalc-mt-time-corrent-cond': {'value': tempo_corrente_cc, 'min': 0, 'max': 5},
        'procalc-mt-clust-fac': {'value': fator_agrup, 'min': 0, 'max': 1},
        'blindagem': {'value': blindagem},
        'fator_resist_termica': {'value': fator_resist_term},
        'fator_dist_terra': {'value': fator_dist_terra},
        'procalc-mt-drop-voltage': {'value': queda_tensao, 'min': 0, 'max': 100},
        'procalc-mt-chain-proj': {'value': corrente_projeto, 'min': 0, 'max': null},
        'fator_de_potencia_nominal': {'value': fator_de_potencia_nominal, 'min': 0, 'max': 1}
    }
    if(projeto !== '0'){
        if(check_blind){
            icc_fase_terra = document.getElementById('procalc-mt-icc-terra').value
            tempo_icc = document.getElementById('procalc-mt-tempo-icc-terra').value
            list_ids['procalc-mt-icc-terra'] = {'value': icc_fase_terra, 'min': 0, 'max': null}
            list_ids['procalc-mt-tempo-icc-terra'] = {'value': tempo_icc, 'min': 0, 'max': 5}
        }
        if(document.getElementById('procalc-mt-num-cond').value.length > 0){
            num_cond_fase = document.getElementById('procalc-mt-num-cond').value
            list_ids['procalc-mt-num-cond'] = {'value': num_cond_fase, 'min': 1, 'max': null}
        }
        for(let item in list_ids) {
            let error = ErrorInForm(list_ids[item])
            if(error){
                ClassIsInvalid(item)
                if(ctrl === 0){
                    ctrl = 1
                }
            }
            else{
                RemoveClassIsInvalid(item)
            }
        }
        if(tipo_carga === 'MOTOR'){
            tipo_partida = $('#tipo_partida_mt').val()
            let list_ids_motor = {
                'queda_tensao_partida': {'value': queda_tensao_partida, 'min': 0, 'max': 100},
                'corrente_partida': {'value': corrente_partida, 'min': 0, 'max': null},
                'fator_de_potencia_partida': {'value': fator_de_potencia_partida, 'min': 0, 'max': 1}
            }
            for(let item in list_ids_motor){
                let error = ErrorInForm(list_ids_motor[item])
                if(error){
                    ClassIsInvalid(item)
                    if(ctrl === 0){
                        ctrl = 1
                    }
                }
                else {
                    RemoveClassIsInvalid(item)
                }
            }
        }
        if (ctrl === 0) {
            let verify = await VerifyCircuitoOkMt(method, calc_selected, projeto, circuito)
            if(!verify['error']){
                let data_dict = {'Circuito': circuito,'ManeiraInstalar': maneira_instalar,
                                 'TensaoServico': tensao_servico, 'CheckBoxSol':check_sol,
                                 'ClassVoltage':class_voltage, 'Cabo':cabo,
                                 'TemperaturaAmbiente': temp_ambiente, 'TipoCabo': tipo_cabo,
                                 'Comprimento': comprimento, 'QuedaTensao': queda_tensao,
                                 'CorrenteProjeto': corrente_projeto, 'PotenciaAparente': potencia_aparente,
                                 'CorrenteCC': corrente_cc, 'TempoCorrenteCC': tempo_corrente_cc,
                                 'SecaoMin': secao_minima, 'SecaoMax': secao_maxima, 'FatorAgrupamento': fator_agrup,
                                 'Material':material, 'QuedaTensaoPartida': queda_tensao_partida,
                                 'CorrentePartida': corrente_partida,
                                 'FPPartida': fator_de_potencia_partida,
                                 'FPNominal': fator_de_potencia_nominal,
                                 'TipoCarga': tipo_carga, 'Blindagem': blindagem,
                                 'Area': area, 'OS': os, 'fator_resist_term': fator_resist_term,
                                 'fator_dist_terra': fator_dist_terra, 'projeto': projeto,
                                 'tipo_partida': tipo_partida, 'check_blind': check_blind, 'icc_fase': icc_fase_terra,
                                 'tempo_icc': tempo_icc, 'numero_condutores': num_cond_fase, 'calc_selected': calc_selected,
                                 'method': method
                }
                const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
                $.ajax({
                    url: "CalcCabosMT/", // Caminho do Ajax
                    type: "POST", // http method
                    headers: {'X-CSRFToken': csrftoken},
                    dataType: "json",
                    data: {'DictCalcMT': JSON.stringify(data_dict)},
                    success: function (data) {
                        if(data['Result']['status']){
                            let id_new_calc = data['Result']['data']
                            FillCardDatasCalcMt(id_new_calc)
                            ChangeProjetoMt()
                            SelectCalcMtSelected(id_new_calc)
                            swal({
                                text: 'Calculo efetuado!',
                                icon: "success",
                                button: 'Fechar'
                            })
                        }
                        else{
                            alert(data['Result']['data'])
                        }
                    },
                    failure: function (error) {
                    },
                })
            }
            else{
                swal({
                    text: verify['msg_return'],
                    icon: "error",
                    button: 'Fechar'
                })
            }

        }
    }
    else{
        alert('Selecione um projeto!!')
    }
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

function VerifyValuesWithRange(value, range_min, range_max){
    var error = false
    if(!isNaN(Number(value))){
        if(range_max!=null){
            if(!(Number(value) >= range_min && Number(value) <= range_max)){
                error = true
            }
        }
        else{
            if(Number(value) < range_min){
                error = true
            }
        }
    }
    else{
        error = true
    }
    return error
}

function CampoCalculo() {
    // Switch theme color
    let estilo = $('#vinao');
    if (!estilo.hasClass('switcher_open')) {
        estilo.addClass('switcher_open')
    } else {
        estilo.removeClass('switcher_open')
    }
}

function MoveCard() {
    let filter = document.getElementById("procalc_campo_filtro");
    let opaco = document.getElementById("campo_opaco");
    let cond_1 = filter.classList.contains("move")
    let cond_2 = opaco.classList.contains("opaco")
    if (cond_1){filter.classList.remove("move");filter.classList.add("move_hover")} else {filter.classList.remove("move_hover"); filter.classList.add("move")}
    if (cond_2){opaco.classList.remove("opaco");opaco.classList.add("opaco_hover")} else {opaco.classList.remove("opaco_hover"); opaco.classList.add("opaco")}
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

function ChangeTipoCarga(){
    var tipo_carga = $('#procalc-tipo-carga').val()
    if(tipo_carga === 'MOTOR'){
        document.getElementById('procalc-row-dados-motor').hidden = false
        document.getElementById('procalc_label_tipo_partida').hidden = false
        document.getElementById('procalc_col_tipo_partida').hidden = false
        document.getElementById('procalc-drop-voltage-circuit-start').readOnly = false
        document.getElementById('procalc-harmonic').readOnly = true
        document.getElementById('row_circuito_desequilibrado').hidden = true
    }
    else{
        document.getElementById('procalc-row-dados-motor').hidden = true
        document.getElementById('procalc_label_tipo_partida').hidden = true
        document.getElementById('procalc_col_tipo_partida').hidden = true
        document.getElementById('procalc-drop-voltage-circuit-start').readOnly = true
        document.getElementById('procalc-harmonic').readOnly = false
        document.getElementById('row_circuito_desequilibrado').hidden = false
    }
}

async function FillSistemasBt(){
    let tipo_carga = $('#procalc-tipo-carga').val()
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrf},
        url: "/app/calc_cabos/a1calccabos/FillSistema/",
        dataType: 'json',
        data: {'tipo_carga': tipo_carga},
        success: function (data) {
            SelectSitemasBt(data['sistemas'])
        },
        failure: function (error) {
        },
    })
}

function SelectSitemasBt(list_sistemas){
    let options_sistema = `<option value="0" title="0">---</option>`
    let index_id = 0
    let index_tipo = 1
    let index_unimulti = 2
    for (let i = 0; i < list_sistemas.length;i++){
        options_sistema += `<option title="${list_sistemas[i][index_id]}" value="${list_sistemas[i][index_unimulti].replace("''",)}">${list_sistemas[i][index_tipo]}</option>`
    }
    $('#procalc-system').html(options_sistema)
}

function CheckCorrenteRegulada(){
    let checkbox = document.getElementById('check_box_corrente_regulada')
    document.getElementById('corrente_regulada').hidden = !checkbox.checked;
}

function VerifyCorrentePartida(value){
    debugger;
    title_partida_direta = 'O VALOR DE CORRENTE DE PARTIDA BEM ACEITO PARA PARTIDA DIRETA É 6X A CORRENTE NOMINAL. DEVE SER CONSULTADO O CRITÉRIO DE PROJETO PARA A DEFINIÇÃO DESSE VALOR DE PARTIDA.'
    title_inversor = 'O VALOR DE CORRENTE DE PARTIDA BEM ACEITO PARA INVERSOR DE FREQUÊNCIA É 2X A CORRENTE NOMINAL. DEVE SER CONSULTADO O CRITÉRIO DE PROJETO PARA A DEFINIÇÃO DESSE VALOR DE PARTIDA.'
    title_softstarter = 'O VALOR DE CORRENTE DE PARTIDA BEM ACEITO PARA SOFTSTARTER É 3X A CORRENTE NOMINAL. DEVE SER CONSULTADO O CRITÉRIO DE PROJETO PARA A DEFINIÇÃO DESSE VALOR DE PARTIDA.'
    let corrente = document.getElementById("corrente_calc").value
    let corrente_partida = document.getElementById("corrente_calc_partida").value
    if(value==='DIRETA' || value==='INVERSOR' || value==='SOFTSTARTER'){
        if(value==='DIRETA'){
            document.getElementById('corrente_calc_partida').title=title_partida_direta
            if (Number(corrente_partida) === Number(corrente) * 6){
                RemoveClassBgWng('corrente_calc_partida')
            }
            else{
                AddClassBgWng('corrente_calc_partida')
            }
        }
        if(value==='INVERSOR'){
            document.getElementById('corrente_calc_partida').title=title_inversor
            if (Number(corrente_partida) === Number(corrente) * 2){
                RemoveClassBgWng('corrente_calc_partida')
            }
            else{
                AddClassBgWng('corrente_calc_partida')
            }
        }
        if(value==='SOFTSTARTER'){
            document.getElementById('corrente_calc_partida').title=title_softstarter
            if (Number(corrente_partida) === Number(corrente) * 3){
                RemoveClassBgWng('corrente_calc_partida')
            }
            else{
                AddClassBgWng('corrente_calc_partida')
            }
        }
    }
    else{
        if(value!==null){
            var tipo_partida = document.getElementById('procalc_tipo_partida').selectedOptions[0]
            var value_corrente = Number(document.getElementById('corrente_calc').value)
            var title = ''
            if(isNaN(Number(value))){
                ClassIsInvalid('corrente_calc_partida')
            }
            else{
                RemoveClassIsInvalid('corrente_calc_partida')
                if(tipo_partida.value === 'DIRETA'){
                    if(Number(value) === value_corrente * 6){
                        RemoveClassBgWng('corrente_calc_partida')
                    }
                    else{
                        AddClassBgWng('corrente_calc_partida')
                        document.getElementById('corrente_calc_partida').title=title_partida_direta
                    }
                }
                if(tipo_partida.value === 'INVERSOR'){
                    if(Number(value) === value_corrente * 2){
                        RemoveClassBgWng('corrente_calc_partida')
                    }
                    else{
                        AddClassBgWng('corrente_calc_partida')
                        document.getElementById('corrente_calc_partida').title=title_inversor
                    }
                }
                if(tipo_partida.value === 'SOFTSTARTER'){
                    if(Number(value) === value_corrente * 3){
                        RemoveClassBgWng('corrente_calc_partida')
                    }
                    else{
                        AddClassBgWng('corrente_calc_partida')
                        document.getElementById('corrente_calc_partida').title=title_softstarter
                    }
                }
            }
            //document.getElementById('corrente_calc_partida').title=title
        }
    }
}

function AddClassBgWng(id_element){
    let i = document.getElementById(id_element)
    let class_list = Array.from(i.classList)
    if(!class_list.includes('bg-warning')){
        i.classList.add('bg-warning')
    }
}

function RemoveClassBgWng(id_element){
    let i = document.getElementById(id_element)
    let class_list = Array.from(i.classList)
    if(class_list.includes('bg-warning')){
        i.classList.remove('bg-warning')
    }
}

function ShowItensPartida(tipo_carga){
    if(tipo_carga === 'MOTOR'){
        document.getElementById('motor_queda_tensao').hidden = false
        document.getElementById('motor_corrente_partida').hidden = false
        document.getElementById('motor_fator_potencia_partida').hidden = false
        document.getElementById('row_tipo_partida').hidden = false
    }else{
        document.getElementById('motor_queda_tensao').hidden = true
        document.getElementById('motor_corrente_partida').hidden = true
        document.getElementById('motor_fator_potencia_partida').hidden = true
        document.getElementById('row_tipo_partida').hidden = true
    }
}

function ChangeProjeto(){
    var proj = $('#procalc-bt-project').val()
    if(proj !== '0'){
        $.ajax({
            url: "CalcsInProjBt/" + proj + "/", // Caminho do Ajax
            type: "GET", // http method
            headers: {'X-CSRFToken': csrf},
            dataType: "json",
            data: {},
            beforeSend: function () {
                $('#table_filter_calc_mt')[0].hidden = true
                $('#loader_table')[0].hidden = false
                finalizarCronometro()
                iniciarCronometro()
            },
            success: function (data) {
                // Pausa o cronômetro
                clearInterval(cronometroCalcCabos);

                if (Object.keys(data['all_calcs']).length === 0){
                    setTimeout(()=>{
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = true
                        finalizarCronometro()
                    }, 2000)
                } else {
                    FillCalcsInProj(data['all_calcs'])
                    setTimeout(()=>{
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = false
                        finalizarCronometro()
                    }, 2000)
                }
            },
            failure: function (error) {
            },
        })
    }
    else{
        $('#table_calcs_in_proj').html('')
    }
}


function FillCalcsInProj(all_calcs){
    var content_table = ``
    for(let id_calc in all_calcs){
        content_table += `<div class="list_name_calc">
                            <li class="py-0 mt-1 calc_exist list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                                onclick="FillCalculoExists(${id_calc}, this);SelectCalcBtSelected(${id_calc});FillCardDatasCalc(${id_calc})" 
                                title="${all_calcs[id_calc]}">
                                <span class='text-truncate'>${FormatTextWithFormatProj(all_calcs[id_calc])}</span>
                                <button data-delete-calc='${id_calc}' class='text-danger' onclick='DeleteCalcInProj(${id_calc})'>
                                    <i class='fas fa-times-circle fa-lg'></i>
                                </button>
                            </li>
                         </div>`
    }
    let heigth_select_project = $('#project_select_card_calc_cabos')[0].offsetHeight;
    let heigth_botoes = $('#botoes_project_cal_cabos')[0].offsetHeight;
    let heigth_card_bt = $('#procalc_campo_filtro')[0].parentElement.offsetHeight;
    let total = heigth_card_bt - ((heigth_select_project * 2 + heigth_botoes * 2) * 1.05)

    $('.content_calcs_in_proj')[0].style.maxHeight = total + 'px';
    $('#select_calcs_in_proj').html(content_table)
}

//--------------------- Filtro de pesquisa ------------------//
function filterCalcsInCalcCabos(projeto_calc, classe){
   var all_project_calc = document.querySelectorAll("." + classe);

  for (let i = 0; i < all_project_calc.length; i++) {
    let projet_name = all_project_calc[i].textContent.toUpperCase();
    let shouldShow = projet_name.includes(projeto_calc.toUpperCase());
    all_project_calc[i].hidden = !shouldShow;
  }
}
function handleKeyUp(event, id, tag) {
    if (event.keyCode === 38) { // Seta para cima
        event.preventDefault(); // Impede o comportamento de rolagem padrão

        let select_calcs = document.querySelectorAll("#"+ id +" li.list-group-item-secondary")[0].parentElement;
        let previousItem = select_calcs.previousElementSibling;
        while (previousItem && previousItem.hasAttribute("hidden")) {
            previousItem = previousItem.previousElementSibling;
        }
        if (previousItem && previousItem.children[0].tagName === tag) {
            previousItem.children[0].click();
        }
    }
}

function handleKeyDown(event, id, tag) {
    if (event.keyCode === 40) { // Seta para baixo
        event.preventDefault(); // Impede o comportamento de rolagem padrão

        let select_calcs = document.querySelectorAll("#"+ id +" li.list-group-item-secondary")[0].parentElement;
        let nextItem = select_calcs.nextElementSibling;
        while (nextItem && nextItem.hasAttribute("hidden")) {
            nextItem = nextItem.nextElementSibling;
        }
        if (nextItem && nextItem.children[0].tagName === tag) {
            nextItem.children[0].click();
        }
    }
}

function SelectCalcBtSelected(id_calc){
    document.getElementById('calc_bt_selected').value = id_calc
    document.getElementById('btn_download_template_bt').disabled = false
}

function DeselectCalcExists(){
    let all_trs = document.getElementsByClassName('calc_exist')
    for (let i = 0; i < all_trs.length; i++){
        if(Array.from(all_trs[i].classList).includes('calc_exist_selected')){
            all_trs[i].classList.remove('calc_exist_selected')
        }
    }
}

function selectCalcProjectExists(){
    let all_trs = document.getElementsByClassName('calc_exist')
    for (let i = 0; i < all_trs.length; i++){
        if(Array.from(all_trs[i].classList).includes('list-group-item-secondary')){
            all_trs[i].classList.remove('list-group-item-secondary')
        }
    }
}

function FillCalculoExists(id_calc, element_td){
    debugger;
    $.ajax({
        url: "DatasCalcInProjBt/" + id_calc + "/", // Caminho do Ajax
        type: "GET", // http method
        headers: {'X-CSRFToken': csrf},
        dataType: "json",
        data: {},
        success: function (data) {
            debugger;
            selectCalcProjectExists()
            element_td.classList.add('list-group-item-secondary')
            FillFormsCalculos(data['datas_calc'])
        },
        failure: function (error) {
        },
    })
}

function PlayingWithTipoPartida(sistema_tipo_selected){
    let tipo_partida = document.getElementById('procalc_tipo_partida')
     for(let i = 0; i < tipo_partida.options.length; i++){
         if(sistema_tipo_selected === '3F + SH'){
             if(tipo_partida.options[i].innerHTML !== 'INVERSOR'){
                 tipo_partida.options[i].hidden = true
             }
             else{
                 tipo_partida.options[i].hidden = false
             }
         }
         else{
             tipo_partida.options[i].hidden = false
         }
     }
     if(sistema_tipo_selected === '3F + SH'){
         $('#procalc_tipo_partida').val('INVERSOR')
     }
}

async function FillFormsCalculos(datas_calc) {
    debugger;
    var sistema = document.getElementById('procalc-system')
    var cabo = document.getElementById('procalc-cable')
    var dispositivos_prot = document.querySelectorAll('[name="checkbox_disp_prot"]')
    var tempo_disp_prot = document.getElementById('temp_dips_protecao')
    document.getElementById('os_calc').value = datas_calc['os']
    document.getElementById('area_calc').value = datas_calc['area']
    document.getElementById('procalc-circuito').value = datas_calc['circuito']
    $('#procalc-tipo-carga').val(datas_calc['tipo_carga'])
    ChangeTipoCarga()
    await FillSistemasBt()
    if(datas_calc['tipo_partida'] !== null){
        $('#procalc_tipo_partida').val(datas_calc['tipo_partida'])
    }
    $('#procalc-install-mode').val(datas_calc['modo_inst'])
    load_image(datas_calc['modo_inst'])
    ChangeManeiraInstalar()
    CardWarningEletroduto(document.getElementById('procalc-install-mode').selectedOptions[0].innerHTML)
    VerifyAmbienteOrSolo(document.getElementById('procalc-install-mode').selectedOptions[0])
    let id_temperature = document.getElementById('procalc-install-mode').selectedOptions[0].title != '0' ? 'procalc-temperature-solo': 'procalc-temperature-env'
    for(let i = 0; i < sistema.options.length; i++){
        if(sistema.options[i].title == datas_calc['sistema']){
            sistema.selectedIndex = i
            break
        }
    }
    PlayingWithTipoPartida(sistema.selectedOptions[0].innerHTML)
    Fill_Tipo_Cabo(sistema)
    $('#procalc-cable').val(datas_calc['cabo'])
    fill_temperatura(cabo.selectedOptions[0].title)
    $('#tipo_cabo').val(datas_calc['tipo_cabo'])
    ShowConformacaoCabos(document.getElementById('tipo_cabo').selectedOptions[0].innerHTML)
    $('#unipolar_conformacao').val(ConvertValueNullInPatternNullSelect(datas_calc['conform']))
    ShowEspacamentoUnipolar(document.getElementById('unipolar_conformacao').selectedOptions[0].innerHTML)
    $('#unipolar_espacameno').val(ConvertValueNullInPatternNullSelect(datas_calc['espacamento_uni']))
    document.getElementById('procalc-length').value = datas_calc['comprimento']
    $('#' + id_temperature).val(datas_calc['temperatura'])
    $('#material_condutor').val(datas_calc['material_cond'])
    document.getElementById('procalc-voltage-fase').value = datas_calc['tensao']
    document.getElementById('corrente_calc').value = datas_calc['corrente']
    document.getElementById('corrente_calc_partida').value = datas_calc['corrente_partida']
    VerifyCorrentePartida(datas_calc['corrente_partida'])
    document.getElementById('fator_potencia').value = datas_calc['fp']
    document.getElementById('fator_potencia_partida').value = datas_calc['fp_partida']
    document.getElementById('procalc-clustering-factor').value = datas_calc['f_agrup']
    if(!datas_calc['checkbox_cc']){
        document.getElementById('procalc-circuit-current').value = datas_calc['corrente_cc']
    }
    document.getElementById('procalc-harmonic').value = datas_calc['harmonicos']


    //$('#procalc-sec-cond').val(ConvertValueNullInPatternNullSelect(datas_calc['secao_minima']))
    //$('#secao_maxima').val(ConvertValueNullInPatternNullSelect(datas_calc['secao_maxima']))
    await ShowSecaoCobreOuAluminio(datas_calc['material_cond'])
    if (datas_calc['secao_minima'] === null){
        document.getElementById('procalc-sec-cond').value = 0
    }
    else{
        document.getElementById('procalc-sec-cond').value = datas_calc['secao_minima']
    }
    //document.getElementById('procalc-sec-cond').value = datas_calc['secao_minima']
    document.getElementById('secao_maxima').value = datas_calc['secao_maxima']

    document.getElementById('numero_condutores').value = datas_calc['num_cond']
    document.getElementById('check_box_sobrecarga').checked = datas_calc['checkbox_sobrecarga']
    document.getElementById('check_box_cc').checked = datas_calc['checkbox_cc']
    ChangeSobrecarga(datas_calc['checkbox_sobrecarga'])
    if(!datas_calc['checkbox_sobrecarga']){
        let dp = datas_calc['dp'] !== 'Limitador'? datas_calc['dp']:'Disjuntor Limitador'
        for(let i = 0; i < dispositivos_prot.length; i++){
            if(dispositivos_prot[i].value === dp){
                dispositivos_prot[i].checked=true
            }
            else{
                dispositivos_prot[i].checked=false
            }
        }
        if(dp === 'Caixa Aberta'){
            SelectDisjuntorCaixaaberta()
        }
        else if(dp === 'Caixa Moldada'){
            SelectDisjuntorCaixaMoldada()
        }
        else if(dp === 'Outro'){
            SelectDispProtOutro()
        }
        else{
            SelectDisjuntorLimitado()
        }
        document.getElementById('corrente_disjuntor_nominal').value = datas_calc['corrente_dp']
        if(!datas_calc['checkbox_cc']){
            document.getElementById('check_box_tempo_livre').checked=datas_calc['checkbox_tempo_livre']
            if(dp !== 'Outro'){
                ChangeCheckboxTempoLivre(document.getElementById('check_box_tempo_livre'))
            }
            if(dp === 'Outro' || datas_calc['checkbox_tempo_livre']){
                document.getElementById('temp_dips_protecao_livre').value = datas_calc['temp_disp_prot']
            }
            else{
                for(let i = 0; i < tempo_disp_prot.options.length; i++){
                    if(tempo_disp_prot.options[i].innerHTML == datas_calc['temp_disp_prot']){
                        tempo_disp_prot.selectedIndex = i
                        break
                    }
                }
            }
        }

        document.getElementById('procalc-circuit-current-limit').value = datas_calc['corrente_cc_limitada']
        document.getElementById('procalc-corrente-regulada').value = datas_calc['corrente_regulada']
        document.getElementById('check_box_corrente_regulada').checked = datas_calc['corrente_regulada'] !== null;
        CheckCorrenteRegulada()
    }
    else{
        ClearBlockDpBt()
        if(!datas_calc['checkbox_cc']){
            document.getElementById('temp_dips_protecao_sobrecarga').value = datas_calc['temp_disp_prot']
        }
    }
    document.getElementById('procalc-drop-voltage-circuit').value = datas_calc['queda_tensao_origem']
    document.getElementById('procalc-drop-voltage-circuit-start').value = datas_calc['queda_tensao_partida']
    document.getElementById('check_box_desequilibrado').checked = datas_calc['desequilibrado']
}

function ClearBlockDpBt() {
    var dispositivos_prot = document.querySelectorAll('[name="checkbox_disp_prot"]')
    for (let i = 0; i < dispositivos_prot.length; i++) {
        dispositivos_prot[i].checked = false
    }
    SelectDisjuntorCaixaaberta()
    document.getElementById('corrente_disjuntor_nominal').value = ''
    document.getElementById('check_box_tempo_livre').checked = false
    ChangeCheckboxTempoLivre(document.getElementById('check_box_tempo_livre'))
    document.getElementById('temp_dips_protecao_livre').value = ''
    document.getElementById('procalc-circuit-current-limit').value = ''
    document.getElementById('procalc-corrente-regulada').value = ''
    document.getElementById('check_box_corrente_regulada').checked = false
}
function ConvertValueNullInPatternNullSelect(value){
    let value_return = value
    if(value === null){
        value_return = '0'
    }
    return value_return
}

function ClearFormCalcBt(){
    debugger;
    DeselectCalcExists()
    var dispositivos_prot = document.querySelectorAll('[name="checkbox_disp_prot"]')
    document.getElementById('os_calc').value=''
    document.getElementById('area_calc').value=''
    document.getElementById('procalc-circuito').value=''
    document.getElementById('material_condutor').value=''
    document.getElementById('procalc-tipo-carga').value=''
    document.getElementById('procalc-install-mode').value=''

    //$('#procalc-tipo-carga').val('ALIMENTADOR')
    ChangeTipoCarga()
    $('#procalc-install-mode').val('0')

    CardWarningEletroduto(document.getElementById('procalc-install-mode').selectedOptions[0].innerHTML)
    load_image('0')
    $('#procalc-system').val('0')
    Fill_Tipo_Cabo(document.getElementById('procalc-system'))
    $('#procalc-cable').val('0')
    document.getElementById('procalc-length').value=''
    $('#tipo_cabo').val('0')
    $('#procalc-temperature-env').val('0')
    $('#unipolar_conformacao').val('0')
    ShowEspacamentoUnipolar('---')
    //$('#material_condutor').val('COBRE')
    document.getElementById('procalc-voltage-fase').value=''
    document.getElementById('corrente_calc').value=''
    document.getElementById('fator_potencia').value=''
    document.getElementById('fator_potencia_partida').value=''
    document.getElementById('corrente_calc_partida').value=''
    document.getElementById('procalc-harmonic').value=''
    $('#procalc-sec-cond').val('0')
    $('#secao_maxima').val('0')
    document.getElementById('numero_condutores').value=''
    for(let i = 0; i < dispositivos_prot.length; i++){
        dispositivos_prot[i].checked=false
    }
    document.getElementById('check_box_sobrecarga').checked = false
    ChangeSobrecarga(document.getElementById('check_box_sobrecarga').checked)
    document.getElementById('check_box_cc').checked = false
    ChangeCheckBoxCC(document.getElementById('check_box_cc').checked)
    document.getElementById('check_box_corrente_regulada').checked=false
    CheckCorrenteRegulada()
    document.getElementById('procalc-circuit-current-limit').value=''
    document.getElementById('temp_dips_protecao_livre').value=''
    SelectDisjuntorCaixaaberta()
    document.getElementById('procalc-drop-voltage-circuit').value=''
    document.getElementById('procalc-drop-voltage-circuit-start').value=''
    document.getElementById('check_box_desequilibrado').checked=false
    document.getElementById('corrente_disjuntor_nominal').value=''
    document.getElementById('procalc-clustering-factor').value=''
    document.getElementById('procalc-circuit-current').value=''
    VerifyAmbienteOrSolo(document.getElementById('procalc-install-mode').selectedOptions[0])
    document.getElementById('card_datas_calc').hidden = true
}

function ClickButtonProjeto(only_button){
    var element_hide = only_button ? 'ButtonProjNotContent' : 'procalc_campo_filtro';
    var element_show = only_button ? 'procalc_campo_filtro': 'ButtonProjNotContent';
    document.getElementById(element_hide).hidden = true
    document.getElementById(element_show).hidden = false
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

function DeleteCalcInProj(id_calc){
    let text_swal = id_calc ? 'Deseja realmente excluir o cálculo?' : 'Deseja realmente excluir <b>todos os cálculos</b>?'
    let list_id_delete_calc = Array.from(document.querySelectorAll('[data-delete-calc]')).map(element => element.dataset.deleteCalc)
    let result_data = id_calc ? [id_calc] : list_id_delete_calc

    swal({
        icon: 'warning',
        buttons: {
            confirm: {
                text: "Sim",
                value: "Sim",
                className: "swal-button swal-button--confirm bg-danger"
            },
            cancel: "Não",
        },
        content: {
            element: "span",
            attributes: {
                innerHTML: text_swal,
            },
        },
    }).then((value) => {
        if (value) {
            // Ação a ser executada quando o usuário confirma
            const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
            $.ajax({
                url: "DatasCalcInProjBt/" + list_id_delete_calc[0] + "/",
                type: "POST",
                headers: {'X-CSRFToken': csrftoken},
                dataType: "json",
                data: {result: result_data},
                success: function (data) {
                    // Argumentos possíveis (tipo, mesagem, timeout(milisegundos))
                    messageNotification(data['icon'],data['return'])
                    ChangeProjeto()
                },
                failure: function (error) {
                },
            })
        }
    });
}

function ChangeCheckboxTempoLivre(element){
    var tempo_livre = element.checked ? false : true;
    var select = element.checked ? true : false;
    document.getElementById('temp_dips_protecao_livre').hidden = tempo_livre
    document.getElementById('temp_dips_protecao').hidden = select
}

function FormatTextWithFormatProj(text, bt=true){
    let text_return = text
    let length_card_calcs = bt ? 23 : 25
    if(text.length > length_card_calcs){
        text_return = text.slice(0, 16) + '...'
    }
    return text_return
}

function VeirifyTensaoServico(value){
    var class_tensao = document.getElementById('procalc-mt-class-voltage').selectedOptions[0].innerHTML
    if (class_tensao !== '---'){
        var value_start = class_tensao === '3.6/6.0 kV' ? 0: Number(class_tensao.split('/')[0])
        var value_finish = class_tensao === '3.6/6.0 kV' ? 6: Number(class_tensao.split('/')[1].replace('kV', ''))
        if(value >= value_start && value <= value_finish){
            RemoveClassIsInvalid('procalc-mt-voltage-service')
        }
        else{
            ClassIsInvalid('procalc-mt-voltage-service')
        }
    }
}

function ChangeProjetoMt(){
    var proj = $('#procalc-mt-project').val()
    if(proj !== '0'){
        $.ajax({
            url: "CalcsInProjMt/" + proj + "/", // Caminho do Ajax
            type: "GET", // http method
            headers: {'X-CSRFToken': csrf},
            dataType: "json",
            data: {},
            beforeSend: function () {
                $('#table_filter_calc_mt')[0].hidden = true
                $('#loader_table')[0].hidden = false
                finalizarCronometro()
                iniciarCronometro()
            },
            success: function (data) {
                // Pausa o cronômetro
                clearInterval(cronometroCalcCabos);

                if (Object.keys(data['all_calcs']).length === 0){
                    setTimeout(()=>{
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = true
                        finalizarCronometro()
                    }, 2000)
                } else {
                    FillCalcsInProjMt(data['all_calcs'])
                    setTimeout(() => {
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = false
                        finalizarCronometro()
                    }, 2000)
                }
            },
            failure: function (error) {
            },
        })
    }
    else{
        $('#table_calcs_in_proj_mt').html('')
    }
}

function FillCalcsInProjMt(all_calcs){
    var content_table = ``
    for(let id_calc in all_calcs){
        content_table += `<div class="list_name_calc">
                            <li class="py-0 mt-1 calc_exist list-group-item list-group-item-action d-flex justify-content-between align-items-center" 
                                onclick="FillFormsCalcExistsMt(${id_calc}, this);SelectCalcMtSelected(${id_calc});FillCardDatasCalcMt(${id_calc})" 
                                title="${all_calcs[id_calc]}">
                                <span class='text-truncate'>${FormatTextWithFormatProj(all_calcs[id_calc])}</span>
                                <button data-delete-calc='${id_calc}' class='text-danger' onclick='DeleteCalcMt(${id_calc})'>
                                    <i class='fas fa-times-circle fa-lg'></i>
                                </button>
                            </li>
                         </div>`
    }
    let heigth_select_project = $('#project_select_card_calc_cabos')[0].offsetHeight;
    let heigth_botoes = $('#botoes_project_cal_cabos')[0].offsetHeight;
    let heigth_card_bt = $('#procalc_campo_filtro')[0].parentElement.offsetHeight;
    let total = heigth_card_bt - ((heigth_select_project * 2 + heigth_botoes * 2) * 1.05)

    $('.content_calcs_in_proj')[0].style.maxHeight = total + 'px';
    $('#select_calcs_in_proj_mt').html(content_table)
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

function Fill_Fator(fator, resist_dist) {
    if (resist_dist === 'resistencia') {
        document.getElementById('fator_resist_termica').value = fator
    } else {
        document.getElementById('fator_dist_terra').value = fator
    }
}

async function FillFormsCalcExistsMt(id_calc, element_td){
    $.ajax({
        url: "DatasCalcInProjMt/" + id_calc + "/", // Caminho do Ajax
        type: "GET", // http method
        headers: {'X-CSRFToken': csrf},
        dataType: "json",
        data: {},
        success: function (data) {
            selectCalcProjectExists()
            element_td.classList.add('list-group-item-secondary')
            FillDatasCalcMt(data['datas_calc'])
        },
        failure: function (error) {
        },
    })
}

async function FillDatasCalcMt(datas_calc){
    document.getElementById('procalc-mt-circuit').value=datas_calc['circuito']
    document.getElementById('os').value=datas_calc['os']
    document.getElementById('area').value=datas_calc['area']
    $('#tipo_carga').val(datas_calc['tipo_carga'])
    ShowItensPartida(datas_calc['tipo_carga'])
    $('#procalc-mt-install-mode').val(datas_calc['modo_inst'])
    await ManeiraInstalarMT()
    document.getElementById('check_mt').checked = datas_calc['check_sol']
    $('#procalc-mt-cable').val(datas_calc['cabo'])
    await SelectTemperature()
    $('#procalc-mt-ambient-temperature').val(datas_calc['temperatura'])
    $('#procalc-mt-class-voltage').val(datas_calc['classe_tensao'])
    document.getElementById('procalc-mt-voltage-service').value = datas_calc['tensao_proj']
    VeirifyTensaoServico(datas_calc['tensao_proj'])
    $('#blindagem').val(datas_calc['blindagem'])
    $('#procalc-mt-type-cable').val(datas_calc['tipo_cabo'])
    $('#procalc-campo-material-cabo-sl').val(datas_calc['material'])
    document.getElementById('procalc-mt-length').value = datas_calc['comprimento']
    document.getElementById('procalc-mt-drop-voltage').value = datas_calc['queda_tensao_max']
    document.getElementById('procalc-mt-chain-proj').value = datas_calc['corrente_proj']
    document.getElementById('fator_de_potencia_nominal').value = datas_calc['fp']
    document.getElementById('procalc-mt-clust-fac').value = datas_calc['f_agrup']
    document.getElementById('procalc-mt-chain-cc').value = datas_calc['corrente_cc']
    document.getElementById('procalc-mt-time-corrent-cond').value = datas_calc['tempo_atuacao_cc']
    document.getElementById('fator_dist_terra').value = datas_calc['fator_dist_terra']
    document.getElementById('fator_resist_termica').value = datas_calc['fator_resist_termica']
    $('#secao_minima').val(datas_calc['secao_min'])
    $('#secao_maxima').val(datas_calc['secao_max'])
    document.getElementById('queda_tensao_partida').value = datas_calc['queda_tensao_partida']
    document.getElementById('corrente_partida').value = datas_calc['corrente_partida']
    document.getElementById('fator_de_potencia_partida').value = datas_calc['fp_partida']
    $('#tipo_partida_mt').val(datas_calc['tipo_partida'])
    CalcPotenciaAparente()
    document.getElementById('blindagem_enterrada').checked = datas_calc['check_blind']
    ChangeBlindagemEnterrada(document.getElementById('blindagem_enterrada').checked)
    document.getElementById('procalc-mt-icc-terra').value = datas_calc['icc_fase']
    document.getElementById('procalc-mt-tempo-icc-terra').value = datas_calc['tempo_icc']
    document.getElementById('procalc-mt-num-cond').value = datas_calc['numero_condutores']
}

function DeleteCalcMt(id_calc){
    let text_swal = id_calc ? 'Deseja realmente excluir o cálculo?' : 'Deseja realmente excluir <b>todos os cálculos</b>?'
    let list_id_delete_calc = Array.from(document.querySelectorAll('[data-delete-calc]')).map(element => element.dataset.deleteCalc)
    let result_data = id_calc ? [id_calc] : list_id_delete_calc

    swal({
        icon: 'warning',
        buttons: {
            confirm: {
                text: "Sim",
                value: "Sim",
                className: "swal-button swal-button--confirm bg-danger"
            },
            cancel: "Não",
        },
        content: {
            element: "span",
            attributes: {
                innerHTML: text_swal,
            },
        },
    }).then((value) => {
        if (value) {
            // Ação a ser executada quando o usuário confirma
            const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
            $.ajax({
                url: "DatasCalcInProjMt/" + list_id_delete_calc[0] + "/",
                type: "POST",
                headers: {'X-CSRFToken': csrftoken},
                dataType: "json",
                data: {result: result_data},
                success: function (data) {
                    swal({
                        icon: data['icon'],
                        button: 'Fechar',
                        content: {
                            element: "span",
                            attributes: {
                                innerHTML: data['return'],
                            },
                        },
                    })
                    ChangeProjetoMt()
                },
                failure: function (error) {
                },
            })
        }
    });
}

function CalcPotenciaAparente(){
    var corrente = document.getElementById('procalc-mt-chain-proj').value
    var tensao = document.getElementById('procalc-mt-voltage-service').value
    if(corrente.length > 0 && tensao.length > 0){
        corrente = Number(corrente)
        tensao = Number(tensao)
        if(!(isNaN(corrente) && isNaN(tensao))){
            document.getElementById('procalc-mt-apparent-power').value = (Math.sqrt(3) * corrente * tensao).toFixed(0)
        }
    }
}

function DownloadTemplateImportCalcsBt(){
    document.getElementById('download_file_memorial').action = `/app/calc_cabos/a1calccabos/DownloadTemplateImportCalc/bt/`
    document.getElementById('download_file_memorial').submit()
}

function DownloadTemplateImportCalcsMt(){
    document.getElementById('download_file_memorial_mt').action = `/app/calc_cabos/a1calccabos/DownloadTemplateImportCalc/mt/`
    document.getElementById('download_file_memorial_mt').submit()
}

function DropFileImport(){
    let input_file = document.getElementById('ArquivoUploadInput')
    let name_file = input_file.files[0].name
    if (name_file.includes('.xlsx')){
        document.getElementById('id_NomeDoArquivolbl').innerHTML = name_file
    }
    else {
        document.getElementById('ArquivoUploadInput').value=''
        alert('Formato de arquivo não aceito!!')
    }
}

function OpenModalImportCalcsBt(){
    if($('#procalc-bt-project').val() !== '0'){
        $('#modal_import_calcs').modal('show')
        document.getElementById('ArquivoUploadInput').value=''
        document.getElementById('id_NomeDoArquivolbl').innerHTML = 'Selecione um arquivo'
    }
    else{
        alert('Selecione um projeto acima para prosseguir com a importação')
    }
}

function OpenModalImportCalcsMt(){
    if($('#procalc-mt-project').val() !== '0'){
        $('#modal_import_calcs').modal('show')
        document.getElementById('ArquivoUploadInput').value=''
        document.getElementById('id_NomeDoArquivolbl').innerHTML = 'Selecione um arquivo'
    }
    else{
        alert('Selecione um projeto acima para prosseguir com a importação')
    }
}

function SendFileImportCalcsBtBack(){
    let file = document.getElementById('ArquivoUploadInput').files[0]
    if(file !== undefined){
        let id_project = $('#procalc-bt-project').val()
        let form_data = new FormData()
        form_data.append('file_import', file)
        form_data.append('id_proj', id_project)
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
              url: "ImportCalcsBt/", // Caminho do Ajax
              type: "POST", // http method
              headers:{'X-CSRFToken':csrftoken},
              dataType: "json",
              data: form_data, // Envia dados pela solicitação do POST
              processData: false,
              contentType: false,
              beforeSend: function () {
                  document.getElementById("progress-box-calc-cabos-2").hidden = false;
                  $('#table_filter_calc_mt')[0].hidden = true
                  $('#loader_table')[0].hidden = false
                  finalizarCronometro()
                  iniciarCronometro()
              },
              success: function (data) {
                  var progressUrl = `/celery-progress/${data["id_task"]}/`
                  CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                      progressBarId: 'progress-bar-calc-cabos-2',
                      progressBarMessageId: 'progress-bar-message-calc-cabos-2',
                      onSuccess: customSucess,
                      onError: customError,
                      onProgress: onProgressCustom
                  })

                  function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                  }
                  function customSucess(progressBarElement, progressBarMessageElement, result){
                      progressBarMessageElement.innerHTML = "Sucesso";
                      progressBarElement.style.backgroundColor = '#76ce60';
                      let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["id_task"] + '/'
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-2").hidden = true
                            finalizarCronometro()
                      }, 2000)

                      document.getElementById('download_file_memorial').action = url_download
                      document.getElementById('download_file_memorial').submit()
                      ChangeProjeto()
                  }

                  function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-2").hidden = true
                            finalizarCronometro()
                      }, 2000)
                  }

              },
              failure: function () {
                  alert('Algo deu errado! verifique e tente novamente.')
              }
        })
    }
    else{
        alert('Por favor selecione um arquivo!')
    }
}

function SendFileImportCalcsMtBack(){
    let file = document.getElementById('ArquivoUploadInput').files[0]
    if(file !== undefined){
        let id_project = $('#procalc-mt-project').val()
        let form_data = new FormData()
        form_data.append('file_import', file)
        form_data.append('id_proj', id_project)
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
              url: "ImportCalcsMt/", // Caminho do Ajax
              type: "POST", // http method
              headers:{'X-CSRFToken':csrftoken},
              dataType: "json",
              data: form_data, // Envia dados pela solicitação do POST
              processData: false,
              contentType: false,
              beforeSend: function () {
                  document.getElementById("progress-box-calc-cabos-2").hidden = false;
                  $('#table_filter_calc_mt')[0].hidden = true
                  $('#loader_table')[0].hidden = false
                  finalizarCronometro()
                  iniciarCronometro()
              },
              success: function (data) {
                  var progressUrl = `/celery-progress/${data["task_id"]}/`
                  CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                      progressBarId: 'progress-bar-calc-cabos-2',
                      progressBarMessageId: 'progress-bar-message-calc-cabos-2',
                      onSuccess: customSucess,
                      onError: customError,
                      onProgress: onProgressCustom
                  })

                  function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                  }
                  function customSucess(progressBarElement, progressBarMessageElement, result){
                      progressBarMessageElement.innerHTML = "Sucesso";
                      progressBarElement.style.backgroundColor = '#76ce60';
                      let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-2").hidden = true
                            finalizarCronometro()
                      }, 2000)

                      document.getElementById('download_file_memorial_mt').action = url_download
                      document.getElementById('download_file_memorial_mt').submit()
                      ChangeProjetoMt()
                  }

                  function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-2").hidden = true
                            finalizarCronometro()
                      }, 2000)
                  }

              },
              failure: function () {
                  alert('Algo deu errado! verifique e tente novamente.')
              }
        })
    }
    else{
        alert('Por favor selecione um arquivo!')
    }
}

function HideRowLoadElements(show){
    document.getElementById('row_load_elements').hidden = show
}

function toggleLoader(show){
    document.getElementById('loader_table').hidden = show
}

function CardWarningEletroduto(value_selected){
    document.getElementById('card_warning_eletroduto').hidden = value_selected == 'Eletroduto enterrado' ? false : true
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

function ChangeSobrecarga(check){
    document.getElementById('content_disp_prot').hidden = check ? true : false
    ShowHideTempAtuacaoSobrecarga(check ? false : true)
    ChangeCheckBoxCC(document.getElementById('check_box_cc').checked)
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


// --------------------- Função adiciona nome do arquivo no campo input ---------------------//
function DropFileCapaBook() {
    let name_file = document.getElementById('BookArquivoUpload').files[0].name
    let name_default = document.getElementById('TextInputFileBook')
    name_default.innerHTML = name_file
}

// --------------------- Função trata os dados para fazer o Ajax ---------------------//
function GeraBookProjeto(proj, nivel_tensao) {
    let file = document.getElementById('BookArquivoUpload').files[0]
    let extension = file.name.split('.').pop().toUpperCase();
    if(proj !== '0'){
        if (extension === 'PDF') {
            let bookFileCalc = new FormData();
            bookFileCalc.append('Capa',file);
            bookFileCalc.append('Projeto', proj)
            bookFileCalc.append('NivelTensao', nivel_tensao)
            $.ajax({
                url: "/app/calc_cabos/a1calccabos/GeraBookCalculo/", // Caminho do Ajax
                type: "POST", // http method
                headers:{'X-CSRFToken':csrf[0].value},
                dataType: "json",
                data: bookFileCalc, // Envia form pela solicitação do POST
                cache: false,
                processData: false,
                contentType: false,
                success: function (data) {
                    // inti_celery_bar({'task_id': data['task_id']})
                    document.getElementById('div_bar_task_book').hidden = false
                    CeleryProgressBarNotError.initProgressBar(`/celery-progress/${data["task_id"]}/`)
                    id_task_book = data['task_id']
                },
                failure: function () {
                    alert('Algo deu errado ao gerar o book! Verifique e tente novamente.')
                }
            })
        } else {
            alert('Arquivo selecionado não é do tipo (.pdf)')
        }
    }
    else{
        alert('Selecione o projeto para continuar!')
    }
}

class CeleryProgressBarNotError {
    constructor(progressUrl, options) {
        this.progressUrl = progressUrl;
        options = options || {};
        let progressBarId = options.progressBarId || 'progress-bar';
        let progressBarMessage = options.progressBarMessageId || 'progress-bar-message-book';
        this.progressBarElement = options.progressBarElement || document.getElementById(progressBarId);
        this.progressBarMessageElement = options.progressBarMessageElement || document.getElementById(progressBarMessage);
        this.onProgress = options.onProgress || this.onProgressDefault;
        this.onSuccess = options.onSuccess || this.onSuccessDefault;
        this.onError = options.onError || this.onErrorDefault;
        this.onTaskError = options.onTaskError || this.onTaskErrorDefault;
        this.onDataError = options.onDataError || this.onError;
        this.onRetry = options.onRetry || this.onRetryDefault;
        this.onIgnored = options.onIgnored || this.onIgnoredDefault;
        let resultElementId = options.resultElementId || 'celery-result';
        this.resultElement = options.resultElement || document.getElementById(resultElementId);
        this.onResult = options.onResult || this.onResultDefault;
        // HTTP options
        this.onNetworkError = options.onNetworkError || this.onError;
        this.onHttpError = options.onHttpError || this.onError;
        this.pollInterval = options.pollInterval || 500;
        // Other options
        let barColorsDefault = {
            success: '#76ce60',
            error: '#dc4f63',
            progress: '#68a9ef',
            ignored: '#7a7a7a'
        }
        this.barColors = Object.assign({}, barColorsDefault, options.barColors);
    }

    onSuccessDefault(progressBarElement, progressBarMessageElement, result) {
        result = this.getMessageDetails(result);
        progressBarElement.style.backgroundColor = this.barColors.success;
        progressBarMessageElement.textContent = "Sucesso!";
    }

    onResultDefault(resultElement, result) {
        if (resultElement) {
            resultElement.textContent = result;
        }
    }

    /**
     * Default handler for all errors.
     * @param data - A Response object for HTTP errors, undefined for other errors
     */
    onErrorDefault(progressBarElement, progressBarMessageElement, excMessage, data) {
        progressBarElement.style.backgroundColor = this.barColors.error;
        excMessage = excMessage || '';
        progressBarMessageElement.innerHTML = "Ops, algo deu errado! " + excMessage;
    }

    onTaskErrorDefault(progressBarElement, progressBarMessageElement, excMessage) {
        let message = this.getMessageDetails(excMessage);
        this.onError(progressBarElement, progressBarMessageElement, message);
    }

    onRetryDefault(progressBarElement, progressBarMessageElement, excMessage, retryWhen) {
        retryWhen = new Date(retryWhen);
        let message = 'Retrying in ' + Math.round((retryWhen.getTime() - Date.now())/1000) + 's: ' + excMessage;
        this.onError(progressBarElement, progressBarMessageElement, message);
    }

    onIgnoredDefault(progressBarElement, progressBarMessageElement, result) {
        progressBarElement.style.backgroundColor = this.barColors.ignored;
        progressBarMessageElement.innerHTML =  result || 'Tarefa ignorada!'
    }

    onProgressDefault(progressBarElement, progressBarMessageElement, progress) {
        progressBarElement.style.backgroundColor = this.barColors.progress;
        progressBarElement.style.width = progress.percent + "%";
        var description = progress.description || "";
        if (progress.current == 0) {
            if (progress.pending === true) {
                progressBarMessageElement.innerHTML = 'Aguardando tarefa para iniciar...';
            } else {
                progressBarMessageElement.innerHTML = 'Tarefa iniciada, aguardando celery...';
            }
        } else {
            progressBarMessageElement.innerHTML =`<br>`+ progress.current + ' de ' + progress.total + ' processos.' + `<br>` + description;
        }
    }

    getMessageDetails(result) {
        if (this.resultElement) {
            return ''
        } else {
            return result || '';
        }
    }

    /**
     * Process update message data.
     * @return true if the task is complete, false if it's not, undefined if `data` is invalid
     */
    onData(data) {
        let done = false;
        if (data.progress) {
            this.onProgress(this.progressBarElement, this.progressBarMessageElement, data.progress);
        }
        if (data.complete === true) {
            done = true;
            if (data.success === true) {
                this.onSuccess(this.progressBarElement, this.progressBarMessageElement, data.result);
            } else if (data.success === false) {
                if (data.state === 'RETRY') {
                    this.onRetry(this.progressBarElement, this.progressBarMessageElement, data.result.message, data.result.when);
                    done = false;
                    delete data.result;
                } else {
                    this.onTaskError(this.progressBarElement, this.progressBarMessageElement, data.result);
                }
            } else {
                if (data.state === 'IGNORED') {
                    this.onIgnored(this.progressBarElement, this.progressBarMessageElement, data.result);
                    delete data.result;
                } else {
                    done = undefined;
                    this.onDataError(this.progressBarElement, this.progressBarMessageElement, "Data Error");
                }
            }
            if (data.hasOwnProperty('result')) {
                this.onResult(this.resultElement, data.result);
            }
        } else if (data.complete === undefined) {
            done = undefined;
            this.onDataError(this.progressBarElement, this.progressBarMessageElement, "Data Error");
        }
        return done;
    }

    async connect() {
        let response;
        try {
            response = await fetch(this.progressUrl);
        } catch (networkError) {
            this.onNetworkError(this.progressBarElement, this.progressBarMessageElement, "Network Error");
            throw networkError;
        }

        if (response.status === 200) {
            let data;
            try {
                data = await response.json();
            } catch (parsingError) {
                this.onDataError(this.progressBarElement, this.progressBarMessageElement, "Parsing Error")
                throw parsingError;
            }

            const complete = this.onData(data);

            if (complete === false) {
                setTimeout(this.connect.bind(this), this.pollInterval);
            }
        } else {
            this.onHttpError(this.progressBarElement, this.progressBarMessageElement, "HTTP Code " + response.status, response);
        }
    }

    static initProgressBar(progressUrl, options) {
        const bar = new this(progressUrl, options);
        bar.connect();
    }
}

function ExportCalcsMt() {
    let project_selected = $('#procalc-mt-project').val()
    if (project_selected !== '0') {
        // faz a mandinga
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
            url: "ExportCalcsMt/" + project_selected + "/",
            type: "GET",
            headers: {'X-CSRFToken': csrftoken},
            dataType: "json",
            data: {},
            beforeSend: function () {
                document.getElementById("progress-box-calc-cabos-1").hidden = false;
                $('#table_filter_calc_mt')[0].hidden = true
                $('#loader_table')[0].hidden = false
                finalizarCronometro()
                iniciarCronometro()
            },
            success: function (data) {
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBarCalcCabos.initProgressBar(progressUrl,  {
                    progressBarId: 'progress-bar-calc-cabos-1',
                    progressBarMessageId: 'progress-bar-message-calc-cabos-1',
                    onSuccess: customSucess,
                    onError: customError,
                    onProgress: onProgressCustom
                })

                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                }

                function customSucess(progressBarElement, progressBarMessageElement, result){
                    progressBarMessageElement.innerHTML = "Sucesso";
                    progressBarElement.style.backgroundColor = '#76ce60';
                    if(result!==null){
                        let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                        document.getElementById('download_file_memorial_mt').action = url_download
                        document.getElementById('download_file_memorial_mt').submit()
                    }
                    else{
                        swal({
                          title: "Atenção!",
                          text: "Configure a exportação do projeto!!",
                          icon: "warning",
                          button: "Clique Aqui!",
                        })
                    }
                    // Pausa o cronômetro
                    clearInterval(cronometroCalcCabos);
                    setTimeout(() => {
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = true
                        document.getElementById("progress-box-calc-cabos-1").hidden = true
                        finalizarCronometro()
                        HideModalSimNao()
                    }, 2000)
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-1").hidden = true
                            finalizarCronometro()
                            HideModalSimNao()
                      }, 2000)
                }

            },
            failure: function (error) {
            },
        })
    } else {
        swal({
            title: "Atenção!",
            text: "Selecione um projeto para prosseguir com a exportação!",
            icon: "warning",
            button: "Fechar",
        })
    }
}

function ExportCalcsBt(){
    let projeto = document.getElementById('procalc-bt-project').selectedOptions[0].value
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if (projeto !== "0") {
        $.ajax({
              url: "ExportCalcsBt/" + projeto + '/', // Caminho do Ajax
              type: "GET", // http method
              headers:{'X-CSRFToken':csrftoken},
              dataType: "json",
              data: {},
              beforeSend: function () {
                  document.getElementById("progress-box-calc-cabos-1").hidden = false;
                  $('#table_filter_calc_mt')[0].hidden = true
                  $('#loader_table')[0].hidden = false
                  finalizarCronometro()
                  iniciarCronometro()
              },
              success: function (data){
                    var progressUrl = `/celery-progress/${data["task_id"]}/`
                    CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                        progressBarId: 'progress-bar-calc-cabos-1',
                        progressBarMessageId: 'progress-bar-message-calc-cabos-1',
                        onSuccess: customSucess,
                        onError: customError,
                        onProgress: onProgressCustom
                    })

                    function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                        progressBarElement.style.backgroundColor = '#68a9ef';
                        progressBarMessageElement.innerHTML = progress.description || "";
                        progressBarElement.style.width = progress.percent + "%";
                    }

                    function customSucess(progressBarElement, progressBarMessageElement, result){
                        progressBarElement.style.backgroundColor = '#76ce60';
                        progressBarMessageElement.innerHTML = "Sucesso";
                        if(result!==null){
                            let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                            document.getElementById('download_file_memorial').action = url_download
                            document.getElementById('download_file_memorial').submit()
                        }
                        else{
                            swal({
                                title: "Atenção!",
                                text: "Configure a exportação do projeto!!",
                                icon: "warning",
                                button: "Clique Aqui!",
                              })
                          }
                          // Pausa o cronômetro
                          clearInterval(cronometroCalcCabos);
                          setTimeout(() => {
                              document.getElementById('loader_table').hidden = true
                              document.getElementById('table_filter_calc_mt').hidden = true
                              document.getElementById("progress-box-calc-cabos-1").hidden = true
                              finalizarCronometro()
                              HideModalSimNao()
                          }, 2000)
                    }

                    function customError(progressBarElement, progressBarMessageElement, excMessage) {
                          progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                          progressBarElement.style.backgroundColor = '#dc4f63';
                          // Pausa o cronômetro
                          clearInterval(cronometroCalcCabos);
                          setTimeout(() => {
                              document.getElementById('loader_table').hidden = true
                              document.getElementById('table_filter_calc_mt').hidden = true
                              document.getElementById("progress-box-calc-cabos-1").hidden = true
                              finalizarCronometro()
                          }, 2000)
                    }
              }
              ,
              failure: function () {
                  alert('Algo deu errado ao fazer o Download! verifique e tente novamente.')
              }
        })
    }
    else{
        swal({
            title: "Atenção!",
            text: "Selecione um projeto para prosseguir com a exportação!",
            icon: "warning",
            button: "Fechar",
        })
    }
}

function ExportCargasBt(){
    let projeto = $('#procalc-bt-project').val()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if (projeto !== "0") {
        $.ajax({
              url: "ExportCargasBt/" + projeto + '/', // Caminho do Ajax
              type: "GET", // http method
              headers:{'X-CSRFToken':csrftoken},
              dataType: "json",
              data: {}, // Envia dados pela solicitação do POST
              beforeSend: function () {
                  document.getElementById("progress-box-calc-cabos-1").hidden = false;
                  $('#table_filter_calc_mt')[0].hidden = true
                  $('#loader_table')[0].hidden = false
                  finalizarCronometro()
                  iniciarCronometro()
              },
              success: function (data){
                    var progressUrl = `/celery-progress/${data["task_id"]}/`
                    CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                        progressBarId: 'progress-bar-calc-cabos-1',
                        progressBarMessageId: 'progress-bar-message-calc-cabos-1',
                        onSuccess: customSucess,
                        onError: customError,
                        onProgress: onProgressCustom
                    })

                    function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                        progressBarElement.style.backgroundColor = '#68a9ef';
                        progressBarMessageElement.innerHTML = progress.description || "";
                        progressBarElement.style.width = progress.percent + "%";
                    }

                    function customSucess(progressBarElement, progressBarMessageElement, result){
                          progressBarElement.style.backgroundColor = '#76ce60';
                          progressBarMessageElement.innerHTML = "Sucesso";
                          let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                          // Pausa o cronômetro
                          clearInterval(cronometroCalcCabos);
                          setTimeout(() => {
                                document.getElementById('loader_table').hidden = true
                                document.getElementById('table_filter_calc_mt').hidden = true
                                document.getElementById("progress-box-calc-cabos-1").hidden = true
                                finalizarCronometro()
                                HideModalSimNao()
                          }, 2000)
                          document.getElementById('download_file_memorial').action = url_download
                          document.getElementById('download_file_memorial').submit()
                    }

                    function customError(progressBarElement, progressBarMessageElement, excMessage) {
                          progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                          progressBarElement.style.backgroundColor = '#dc4f63';
                          // Pausa o cronômetro
                          clearInterval(cronometroCalcCabos);
                          setTimeout(() => {
                                document.getElementById('loader_table').hidden = true
                                document.getElementById('table_filter_calc_mt').hidden = true
                                document.getElementById("progress-box-calc-cabos-1").hidden = true
                                finalizarCronometro()
                          }, 2000)
                    }
              }
              ,
              failure: function () {
                  alert('Algo deu errado ao fazer o Download! verifique e tente novamente.')
              }
        })
    }
}

// --------------------- Clase para receber respostas do celery ---------------------//
let CeleryProgressBarCalcCabos = (function () {
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

function ShowModalSimNao(func_nao, func_sim, content_modal){
    document.getElementById('msg_content_modal_sim_nao').innerHTML = content_modal
    document.getElementById('btn_nao_modal_sim_nao').onclick = func_nao
    document.getElementById('btn_sim_modal_sim_nao').onclick = func_sim
    $('#modal_sim_nao').modal('show')
}

function HideModalSimNao(){
    $('#modal_sim_nao').modal('hide')
}

function ExportCargasMt() {
    let projeto = $('#procalc-mt-project').val()
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if (projeto !== "0") {
        $.ajax({
            url: "ExportCargasMt/" + projeto + '/', // Caminho do Ajax
            type: "GET", // http method
            headers: {'X-CSRFToken': csrftoken},
            dataType: "json",
            data: {}, // Envia dados pela solicitação do POST
            beforeSend: function () {
                document.getElementById("progress-box-calc-cabos-1").hidden = false;
                $('#table_filter_calc_mt')[0].hidden = true
                $('#loader_table')[0].hidden = false
                finalizarCronometro()
                iniciarCronometro()
            },
            success: function (data) {
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                    progressBarId: 'progress-bar-calc-cabos-1',
                    progressBarMessageId: 'progress-bar-message-calc-cabos-1',
                    onSuccess: customSucess,
                    onError: customError,
                    onProgress: onProgressCustom
                })

                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                        progressBarElement.style.backgroundColor = '#68a9ef';
                        progressBarMessageElement.innerHTML = progress.description || "";
                        progressBarElement.style.width = progress.percent + "%";
                }

                function customSucess(progressBarElement, progressBarMessageElement, result){
                      progressBarElement.style.backgroundColor = '#76ce60';
                      progressBarMessageElement.innerHTML = "Sucesso";
                      let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-1").hidden = true
                            finalizarCronometro()
                            HideModalSimNao()
                      }, 2000)
                      document.getElementById('download_file_memorial_mt').action = url_download
                      document.getElementById('download_file_memorial_mt').submit()
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-1").hidden = true
                            finalizarCronometro()
                            HideModalSimNao()
                      }, 2000)
                }
            }
            ,
            failure: function () {
                alert('Algo deu errado ao fazer o Download! verifique e tente novamente.')
            }
        })
    }
}


function GeraBookExcel(bt=true) {
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let id_proj = bt?document.getElementById('procalc-bt-project').selectedOptions[0].value:document.getElementById('procalc-mt-project').selectedOptions[0].value
    if (id_proj !== '0') {
        $.ajax({
            url: "/app/calc_cabos/a1calccabos/GeraBookExcel/", // Caminho do Ajax
            type: "GET", // http method
            headers: {'X-CSRFToken': csrftoken},
            dataType: "json",
            data: {'Projeto': id_proj, 'bt': bt}, // Envia dados pela solicitação do POST
            beforeSend: function(){
                document.getElementById("progress-box-calc-cabos-book-excel").hidden = false;
                $('#table_filter_calc_mt')[0].hidden = true
                $('#loader_table')[0].hidden = false
                $('#gif_progress_load_book')[0].hidden = false
                $('#gif_success_load_book')[0].hidden = true
                finalizarCronometro()
                iniciarCronometro()
            },
            success: function (data) {
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                    progressBarId: 'progress-bar-calc-cabos-book-excel',
                    progressBarMessageId: 'progress-bar-message-calc-cabos-book-excel',
                    onSuccess: customSucess,
                    onError: customError,
                    onProgress: onProgressCustom
                })
                function customSucess(progressBarElement, progressBarMessageElement, result){
                    $('#gif_progress_load_book')[0].hidden = true
                    $('#gif_success_load_book')[0].hidden = false
                    progressBarMessageElement.innerHTML = "Sucesso";
                    progressBarElement.style.backgroundColor = '#76ce60';
                    let url_download = '/app/calc_cabos/a1calccabos/GeraBookExcel/' + data["task_id"]
                    window.open(url_download, '_self')

                    swal({
                            text: "Book gerado com sucesso!",
                            icon: "success",
                            button: false,
                        });

                    setTimeout(()=>{swal.close()}, 2000)
                    // Pausa o cronômetro
                    clearInterval(cronometroCalcCabos);
                    setTimeout(() => {
                        document.getElementById('loader_table').hidden = true
                        document.getElementById('table_filter_calc_mt').hidden = true
                        document.getElementById("progress-box-calc-cabos-book-excel").hidden = true
                        finalizarCronometro()
                    }, 3000)
                }
                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                      $('#load_gif_book_excel')[0].style.width = progress.percent + "%";
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';
                      // Pausa o cronômetro
                      clearInterval(cronometroCalcCabos);
                      setTimeout(() => {
                            document.getElementById('loader_table').hidden = true
                            document.getElementById('table_filter_calc_mt').hidden = true
                            document.getElementById("progress-box-calc-cabos-book-excel").hidden = true
                            $('#gif_progress_load_book')[0].hidden = true
                            $('#gif_success_load_book')[0].hidden = true
                            finalizarCronometro()
                      }, 2000)
                }
            }
        })
    }
    else {
        return alert('Selecione um projeto!')
    }
}


function ClearCalcBtSelected(){
    document.getElementById('calc_bt_selected').value = ''
    document.getElementById('btn_download_template_bt').disabled = true
}

function ClearCalcMtSelected(){
    document.getElementById('calc_mt_selected').value = ''
    document.getElementById('btn_download_template_mt').disabled = true
}

function SelectCalcMtSelected(id_calc){
    document.getElementById('calc_mt_selected').value = id_calc
    document.getElementById('btn_download_template_mt').disabled = false
}

function FillCardDatasCalc(id_calc){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        url: "DatasCard/" + id_calc + "/",
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        data: {},
        success: function (data) {
            document.getElementById('card_sec_calc').innerHTML = `<b>${data['sec_calc']} mm²</b>`
            document.getElementById('card_qnt_calc').innerHTML = `<b>${data['qnt']}</b>`
            document.getElementById('card_datas_calc').hidden = false
            document.getElementById('card_sec_criterio_dimen').innerHTML = `<b>${data['criterio']}</b>`
            document.getElementById('card_datas_criterio_dimen').hidden = false
        },
        failure: function (error) {
        },
    })
}

function DownloadMemorialCalcBt(){
    let id_calc = document.getElementById('calc_bt_selected').value
    window.open('/app/calc_cabos/a1calccabos/DownloadMemorialBt/' + id_calc + '/', '_self')
}

function DownloadMemorialCalcMt(){
    let id_calc = document.getElementById('calc_mt_selected').value
    window.open('/app/calc_cabos/a1calccabosmt/DownloadMemorialMt/' + id_calc + '/', '_self')
}

function FillCardDatasCalcMt(id_calc){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        url: "DatasCardMt/" + id_calc + "/",
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        data: {},
        success: function (data) {
            document.getElementById('sec_calc_mt').innerHTML = ` <b> ${data['sec_calc']} mm²</b>`
            document.getElementById('qnt_calc_mt').innerHTML = ` <b> ${data['qnt']}</b>`
            document.getElementById('card_datas_calc_mt').hidden = false
            document.getElementById('card_sec_criterio_dimen_mt').innerHTML = `<b>${data['criterio']}</b>`
            document.getElementById('card_datas_criterio_dimen_mt').hidden = false
        },
        failure: function (error) {
        },
    })
}

async function VerifyCircuitoOk(method, id_selected, proj, circuito){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var error = false
    var msg_return = ''
    await $.ajax({
        url: "VerifyCircuitoOk/",
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        data: {'datas_verify': JSON.stringify({
                'method': method,
                'id_selected': id_selected,
                'proj': proj,
                'circuito': circuito
            })},
        success: function (data) {
            error = data['return']['error']
            msg_return = data['return']['msg_return']

        },
        failure: function (error) {
        },
    })
    return {'error': error, 'msg_return': msg_return}
}


async function VerifyCircuitoOkMt(method, id_selected, proj, circuito){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var error = false
    var msg_return = ''
    await $.ajax({
        url: "VerifyCircuitoMtOk/",
        type: "GET",
        headers: {'X-CSRFToken': csrftoken},
        dataType: "json",
        data: {'datas_verify': JSON.stringify({
                'method': method,
                'id_selected': id_selected,
                'proj': proj,
                'circuito': circuito
            })},
        success: function (data) {
            error = data['return']['error']
            msg_return = data['return']['msg_return']

        },
        failure: function (error) {
        },
    })
    return {'error': error, 'msg_return': msg_return}
}

    function filterOptionsByInput(inputId, selectId) {
        const input = document.getElementById(inputId);
        const select = document.getElementById(selectId);
        const filter = input.value.toLowerCase();
        const options = select.options;

        for (let i = 0; i < options.length; i++) {
            const optionText = options[i].text.toLowerCase();
            if (optionText.includes(filter)) {
                options[i].style.display = ""; // Show option
            } else {
                options[i].style.display = "none"; // Hide option
            }
        }
    }


function VerifyCorrenteRegulada(value){
    debugger;
    if (value === ""){
        RemoveClassBgWng('procalc-corrente-regulada')
        document.getElementById('procalc-corrente-regulada').title=''
    }
    else{
        let corrente = document.getElementById("corrente_calc").value
        let corrente_regulada_bool = document.getElementById('check_box_corrente_regulada').checked
        title_corrente_regulada = 'CORRENTE REGULADA DEVE SER IGUAL A CORRENTE NOMINAL.'
        if (corrente_regulada_bool){
            if (Number(value) != Number(corrente)){
                AddClassBgWng('procalc-corrente-regulada')
                 document.getElementById('procalc-corrente-regulada').title=title_corrente_regulada
            }
            else{
                RemoveClassBgWng('procalc-corrente-regulada')
                document.getElementById('procalc-corrente-regulada').title=''
            }
        }
    }
}


async function ShowSecaoCobreOuAluminio(material) {
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrf},
        url: "/app/calc_cabos/a1calccabos/ShowSecaoCobreOuAluminio/",
        dataType: 'json',
        data: {'tipo_material': material},
        success: function (data) {
            debugger;
            let options_sec_material = `<option value="0" title="0">Automático</option>`
            for (let i = 0; i < data["sec_material"].length; i++){
                //console.log(data['sec_material'][i][0])
                options_sec_material += `<option title="${data['sec_material'][i][1]}" value="${data['sec_material'][i][0]}">${data['sec_material'][i][1]}</option>`
            }
            $('#procalc-sec-cond').html(options_sec_material)
            $('#secao_maxima').html(options_sec_material)
        },

    })
}
