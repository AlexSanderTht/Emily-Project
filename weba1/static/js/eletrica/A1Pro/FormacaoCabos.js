async function get_FuncsOS(){
    // Função que pega todos os dados pertinentes do back end pro front
    var datas = {}
    if(verify_selects_show_modal('formacao') === true){
        let os = $('#pro-os').val();
        await $.ajax({
          type: "GET",
          url: "FormacaoCabos/" + os,
          dataType: 'json',
          success: function (data){
              datas = data['funcs']
          },
          failure: function(error){
          },
         })
    }
    return datas
}

async function fill_select_func_form_cabo(){
    // Manda as funções pro select de Função
    clean_all_fields_formacao(true)
    var all_funcs = await get_FuncsOS()
    var options_funcs = `<option value="none">Selecione uma Função</option>`
    for(var i = 0; i < all_funcs.length; i++){
        options_funcs += `<option value="${all_funcs[i]['id']}">${all_funcs[i]['name_func']}</option>`
    }
    document.getElementById('func-formacao').innerHTML = options_funcs
}

function pick_datas_form_cabo(){
    // Função acionada ao clicar no botão de atualizar
    let func = $('#func-formacao').val()
    let n_or_t = ''
    try {  // se não tem nenhum checkbox marcado gera erro
        n_or_t = document.querySelector('input[name="n-or-t-formacao"]:checked').value;
    }
    catch (e) {
        n_or_t = false
    }
    let datas_bt = verify_wich_element('bt')
    let datas_mt = verify_wich_element('mt')
    let multipolares = which_multipolar()
    if (document.getElementById('all-func-formacao').checked==true){
        func = 'ALL'
    }
    if(func == 'none'){
        return 'Por favor selecione uma Função!!'
    }
    if(n_or_t == false){
        return 'Marque Neutro e/ou Terra!!'
    }

    if(typeof datas_bt === "string"){
        return datas_bt
    }
    else{
        if(datas_bt['value'] == ""){
            return 'Preencha a parte respectiva a cabos unipolares de BT!!'
        }
    }

    if(typeof datas_mt === "string"){
        return datas_mt
    }
    else{
        if(datas_mt['value'] == ""){
            return 'Preencha a parte respectiva a cabos unipolares de MT!!'
        }
    }

    if(multipolares['par'] == ""){
        return 'Selecione os Cabos Pares!!'
    }
    if(multipolares['impar'] == ""){
        return 'Selecione os Cabos Impares!!'
    }
    return {'func': func, 'NT': n_or_t, 'BT': datas_bt, 'MT': datas_mt, 'multipol': multipolares}
}

function manipuling_checkbox_all_funcs(){
    var checkbox = document.getElementById('all-func-formacao')
    if (checkbox.checked){
        $('#func-formacao').val("none")
        document.getElementById('func-formacao').disabled=true
    }
    else{
        document.getElementById('func-formacao').disabled=false
    }
}
async function send_form_cabos(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let form_cabos = pick_datas_form_cabo()
    if(typeof form_cabos === "string"){
        return alert(form_cabos)
    }
    else{
        await $.ajax({
          type: "POST",
          headers:{'X-CSRFToken':csrftoken},
          url: "FormacaoCabos/" + $('#pro-os').val(),
          data: {'datas': JSON.stringify(form_cabos)},
          success: function(data){
              alert(data['msg_return'])
              clean_all_fields_formacao(true)
          },
          error: function(error){
              alert('Houve um erro inesperado')
          }
        });
    }
}
function verify_wich_element(type){
    // Verifica de qual formulario vai pegar os dados e retornas o dado
    var input_values = {'value': '', 'selecionado': ''}
    if (document.getElementById('checkbox-pot-'+type).checked){
        if(isNaN(Number(document.getElementById('pot-'+type+'-formacao').value))){
            return 'O formulario de '+type+' só aceita numeros!!'
        }
        else{
            input_values['value'] = Number(document.getElementById('pot-'+type+'-formacao').value)
            input_values['selecionado'] = 'pot'
        }
    }
    else{
        if(isNaN(Number(document.getElementById('sec-'+type+'-formacao').value))){
            return 'O formulario de '+type+' só aceita numeros!!'
        }
        else {
            input_values['value'] = document.getElementById('sec-'+type+'-formacao').value
            input_values['selecionado'] = 'sec'
        }
    }
    return input_values
}

function block_checkbox(p_or_s, type){
    // Ao clicar no checkbox bloqueia o outro input e desmarca o contrario do marcado
    if(p_or_s == 'secao'){
        document.getElementById('checkbox-pot-'+type).checked=false
        document.getElementById('checkbox-sec-'+type).checked=true

    }
    else{
        document.getElementById('checkbox-sec-'+type).checked=false
        document.getElementById('checkbox-pot-'+type).checked=true

    }
}

function which_multipolar(){
    // Funçãozinha que pega o valor dos multipolares e retorna elas em um objeto
    var mult = {'par': '', 'impar': ''}
    try{ // se não tem nenhum checkbox marcado gera erro
        mult['par'] = document.querySelector('input[name="par"]:checked').value
    }
    catch (e){
        mult['par'] = ""
    }

    try { // se não tem nenhum checkbox marcado gera erro
        mult['impar'] = document.querySelector('input[name="impar"]:checked').value
    }
    catch (e){
        mult['impar'] = ""
    }
    return mult

}

async function get_cabos_formados(){
    var func = $('#func-formacao').val()
    if(func!="none"){
        await $.ajax({
          type: "GET",
          url: "AllCabosFormados/" + func + "/",
          dataType: 'json',
          success: function (data){
              let cabo_formado = data['ObjReturn']
              if(Object.keys(cabo_formado).length > 0){
                  fill_cabos_formados(cabo_formado)
              }
              else{
                  clean_all_fields_formacao(false)
              }
          },
          failure: function(error){
          },
        })
    }
}

function fill_cabos_formados(cabo_formado){
    // Acionada ao selecionar uma função se ela tiver uma formação de cabo, preenche os formularios de acordo com as proprias informações
    let radios = document.querySelectorAll('input[name="n-or-t-formacao"]')
    let checkbox_pares = document.querySelectorAll('input[name="par"]')
    let checkbox_impares = document.querySelectorAll('input[name="impar"]')
    for(let i = 0; i < checkbox_pares.length; i++){
        if(checkbox_pares[i].value == cabo_formado['par']){
            checkbox_pares[i].checked = true
        }
    }
    for(let i = 0; i < checkbox_impares.length; i++){
        if(checkbox_impares[i].value == cabo_formado['impar']){
            checkbox_impares[i].checked = true
        }
    }
    for(let i = 0; i < radios.length; i++){  // for para ver qual dos radios deve-se marcar
        if(radios[i].value == cabo_formado['n_or_t']){
            radios[i].checked = true
        }
    }
    verify_and_fill_element('bt', cabo_formado)
    verify_and_fill_element('mt', cabo_formado)
    document.getElementById('desc-formacao').value = cabo_formado['desc']  // preenchendo a parte de descrição
    document.getElementById('pot-bt-formacao').value = cabo_formado['pot_bt']
    document.getElementById('sec-bt-formacao').value = cabo_formado['sec_bt']
    document.getElementById('pot-mt-formacao').value = cabo_formado['pot_mt']
    document.getElementById('sec-mt-formacao').value = cabo_formado['sec_mt']
}

function verify_and_fill_element(type, datas){
    // Faz uma verificação dos dados que veio do back-end para manipular os formularios de bt e mt
    if(datas['selected_'+type] == "potencia"){
        document.getElementById('sec-'+type+'-formacao').readOnly = true
        document.getElementById('checkbox-pot-'+type).checked = true
    }
    else{
        document.getElementById('pot-'+type+'-formacao').readOnly = true
        document.getElementById('checkbox-sec-'+type).checked = true
    }
}

function clean_all_fields_formacao(clean_func){
    // Função que limpa todos os formularios da tela de formação de cabos
    if (clean_func){
        $('#func-formacao').val("none")
    }
    let radios = document.querySelectorAll('input[name="n-or-t-formacao"]')
    let checkbox_pares = document.querySelectorAll('input[name="par"]')
    let checkbox_impares = document.querySelectorAll('input[name="impar"]')
    let checkbox_bt = document.querySelectorAll('input[name="checkbox-formacao-bt"]')
    let checkbox_mt = document.querySelectorAll('input[name="checkbox-formacao-mt"]')
    document.getElementById('func-formacao').disabled=false
    document.getElementById('all-func-formacao').checked=false
    document.getElementById('pot-bt-formacao').readOnly = false
    document.getElementById('sec-bt-formacao').readOnly = false
    document.getElementById('pot-mt-formacao').readOnly = false
    document.getElementById('sec-mt-formacao').readOnly = false

    document.getElementById('pot-bt-formacao').value = ""
    document.getElementById('sec-bt-formacao').value = ""
    document.getElementById('pot-mt-formacao').value = ""
    document.getElementById('sec-mt-formacao').value = ""

    for(let i = 0; i < checkbox_mt.length; i++){
        if(checkbox_mt[i].checked){
            checkbox_mt[i].checked = false
        }
    }

    for(let i = 0; i < checkbox_bt.length; i++){
        if(checkbox_bt[i].checked){
            checkbox_bt[i].checked = false
        }
    }
    for(let i = 0; i < checkbox_pares.length; i++){
        if(checkbox_pares[i].checked){
            checkbox_pares[i].checked = false
        }
    }

    for(let i = 0; i < checkbox_impares.length; i++){
        if(checkbox_impares[i].checked){
            checkbox_impares[i].checked = false
        }
    }

    for(let i = 0; i < radios.length; i++){
        if(radios[i].checked){
            radios[i].checked = false
        }
    }

}