function set_storage_session(key, value){
    /** função para salvar valores na sessão
     * @key {String} nome da chave
     * @value {String} valor da chave
    * */
    sessionStorage.setItem(key, value);
    return true;
}

function get_storage_session(key){
    /** função para salvar valores na sessão
     * @key {String} nome da chave que foi salva
     * @return {String} valor salvo na sessão
    * */
    return sessionStorage.getItem(key);
}

function set_cookies(key, value, days){
    /** função para salvar valores nos cookies
     * @key {String} nome da chave
     * @value {String} valor da chave
    * */

    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = key + "=" + (value || "")  + expires + "; path=/; SameSite=Lax; Secure";
    return true;
}

async function cookies_os(){
    let value_os = $('#pro-os').val();
    if (value_os!="none"){
        set_cookies('OS', value_os,1)
        let datas_tools = await verify_tools_user()
        disblock_all_elements()
        block_only_elements_acess(datas_tools['name_hierarchy'])
        set_cookies('hierarchy', datas_tools['name_hierarchy'], 1)
    }
}

async function cookies_area(){
    let value_area = $('#pro-area').val()
    if (value_area!="none"){
        set_cookies('Area', value_area,1)
    }
}

function block_only_elements_acess(NameHierarchy){
    var ElementsAcess = []
    var AllElements = GetIdsAllToolsHtml()
    if(NameHierarchy === 'GERENTE DE DISCIPLINA'){
        ElementsAcess = GetIdsAllToolsHtml()
    }
    else if(NameHierarchy === 'LÍDER DA OS'){
        ElementsAcess = GetIdsToolsLiderOsHtml()
    }
    else{
        ElementsAcess = GetIdsToolsUserDisc()
    }
    for(let i = 0; i < AllElements.length; i++){
        if(ElementsAcess.includes(AllElements[i])){
            $('#'+AllElements[i]+'-dropdown').show()
        }
        else {
            $('#'+AllElements[i]+'-dropdown').hide()
        }
    }
}

function verify_hierarchy_in_screen(screen){
    /**
     * Verifica a hierarquia do usuario pelos cookies, para limitar as ferramentas dele
     * @screen {string} - Tela que vai bloquear os botões, ligações ou equipamentos
     */
    var cookie_hierarchy = get_cookie('hierarchy')
    if(cookie_hierarchy == 'USUÁRIO DA DISCIPLINA'){
        block_buttons_eqp_lig(true, screen)
    }
    else{
        block_buttons_eqp_lig(false, screen)
    }
}

function get_cookie(cookie_name){
    let all_cookies = document.cookie.split(';')
    var cookie_value = ''
    for(let i = 0; i < all_cookies.length; i++){
        if(all_cookies[i].includes(cookie_name)){
            cookie_value = all_cookies[i].split('=')[1]
            break
        }
    }
    return cookie_value
}
function block_buttons_eqp_lig(disabled, lig_or_eqp){
    /**
     * Manipula os botões dentro das telas de ligação ou equipamentos
     * @disabled {boolean} - Para desabilitar os botoes basta por true, e habilitar false
     * @lig_or_eqp {string} - 'lig' OU 'eqp'
     */
    document.getElementById('btn-'+lig_or_eqp+'-adc').disabled=disabled
    document.getElementById('btn-'+lig_or_eqp+'-excluir').disabled=disabled
    document.getElementById('btn-'+lig_or_eqp+'-import').disabled=disabled
}

function disblock_all_elements(){
    /**
     * desbloqueia todos as ferramentas do a1pro
     * @list_elements {array} - Lista com todas as ferramentas do a1pro que veio do banco de dados
     */
    var AllIdsElements = GetIdsAllToolsHtml()
    for(let i = 0; i < AllIdsElements.length; i++){
        $('#'+AllIdsElements[i]+'-dropdown').show()
    }
}

function GetIdsAllToolsHtml(){
    let AllIdsElements = ['ligacoes', 'motor-status', 'tipo-partida', 'resumo-partida', 'acessorios', 'funcao', 'sinais',
        'gav-cubs', 'equipamentos', 'tipo-ligacao', 'setup-sinais-acess', 'classe-isolacao', 'formacao-cabos', 'criterio-formacao-tag',
        'codigos-a1mat', 'tipo-de-cabo', 'tabela-resumo', 'lista-de-cabos', 'setup-cabos', 'OS', 'area']
    return AllIdsElements
}

function GetIdsToolsUserDisc(){
    let IdsElementsUserDisc = ['equipamentos', 'ligacoes']
    return IdsElementsUserDisc
}

function GetIdsToolsLiderOsHtml(){
    let AllIdsElements = GetIdsAllToolsHtml()
    return AllIdsElements.filter(id_tool => id_tool !== 'OS')
}

async function verify_tools_user(){
    let datas = {}
    await $.ajax({
        type: "GET",
        url: "VerifyToolsUserA1Pro/",
        dataType: 'json',
        success: function (data){
            datas = data
      },
      failure: function(error){
          alert("erro")
      },
    })
    return datas
}


function save_session_by_id(key,id){
    /** função para guardar as informações na sessão pelo ID
     * @key {String} nome da chave
     * @id {int} id recebido
     */
    const value = document.getElementById(id).value;
    set_storage_session(key, value);
    if (key === 'OSA1PRO'){
        set_storage_session('AREAA1PRO', null);
    }
}

function check_os_and_area(tela){
    /**#função que verifica que há uma os e uma area válida antes de preencher
     * @id_modal {String} Nome do id que vai ser chamado o modal
     * @return {Boolean} false para falha e true para funcionou
     */
    debugger;
    const os_value = $('#pro-os').val();
    const area_value = $('#pro-area').val();
    var url = ''
    if(os_value === 'none' || os_value === ''){
        alert("Selecione a OS!");
        return false
    }else if(area_value === 'none' || area_value === ''){
        alert("Selecione a AREA!");
        return false
    }
    else{
        if (tela == 'cargas'){
            url = `/app/eletrica/a1pro/TelaCarga/`
        }
        else {
            url = `/app/eletrica/a1pro/TelaEquips/`
        }
        window.open(url, '_self')

    }
}

function ResumoTBR(){
    if(verify_selects_show_modal(false)) {
        window.open('/app/eletrica/a1pro/resumo_tbr', '_self')
    }
}

const dict_valid = {};


function list_options(element_id, select=false) {
    //Lista as opções de seleção do banco.
    var dict_dt = {'os-type': [0, 'TbOsProjeto'],
                   'area-type': [$(`#pro-os`).val(), 'TbArea'],
                   'sub-area-type': [$(`#area-type`).val(), 'TbSubArea'],
                   'motor-status-type': [0, 'TbStatus'],
                   'tipo-partida-type': [0, 'TbTipoPartida'],
                   get 'pro-area'() {return this["area-type"]},
                   get 'pro-os'() {return this["os-type"]}};

    if (Object.keys(dict_dt).includes(element_id)){ // Se a chave do elemento está no dicionário, faz requisição por ajax
        var list_id = element_id+'-list';
        if (element_id == 'pro-area' && select == true){
            if ($(`#pro-os`).val() == 'none'){
                $(`#${element_id}`).html(`<option value="none">---</option>`)
                return false
            }
        }
        $.ajax({
            type: "GET",
            url: "list_options/",
            dataType: 'json',
            data: {'table': dict_dt[element_id][1], 'find': dict_dt[element_id][0]}
        }).done(function(data) {
            if( data[0] === 'erro' ){
                alert(data[1])
            } else {
                var options='';
                if(select == true){
                    list_id = element_id
                    options += `<option value="none">---</option>`
                }
                let resposta = data['resposta'];
                for (i in resposta) { options += `<option value=${resposta[i]}>${resposta[i]}</option>` }
                $(`#${list_id}`).html(options);
                dict_valid[element_id] = resposta;
            }
        });
    }
}


function changeInputFilter(inputFilter, idSelect){
    const select = document.getElementById(idSelect)
    select.focus()
    select.click()
}

function selected_option(element_id, option_value) {  //Apresenta os dados cadastrados conforme seleção.
    debugger;
    var dict_dt = {'os-type': 'TbOsProjeto',
                   'area-type': 'TbArea',
                   'sub-area-type': 'TbSubArea',
                   'motor-status-type': 'TbStatus',
                   'tipo-partida-type': 'TbTipoPartida',
                   get 'pro-os'() { return this["os-type"] },
                   get 'pro-area'() { return this["area-type"] } };

    // console.log(`Inclui ${dict_valid[element_id].includes($(`${element_id}`).val())}`);

    if (Object.keys(dict_dt).includes(element_id) && Object.keys(dict_valid).includes(element_id) ) { // Se a chave do elemento está no dicionário, faz requisição por AJAX
        $.ajax({
            type: "GET",
            url: "select_insert/",
            dataType: 'json',
            data: { 'find': option_value, 'table': dict_dt[element_id] }
        }).done(function (data) {
            debugger;
            var dict_result = {
                'os-type': [['os-num', 2], ['os-project-num', 3], ['os-project', 4], ['os-client', 5],
                            ['os-unid-fabril', 6], ['os-path', 7], ['os-sep', 8], ['os-client-initials', 9]],
                'area-type': [['area-desc', 2], ['area-cod', 3]],
                'sub-area-type': [['sub-area-desc', 2], ['sub-area-cod', 3]],
                'pro-os': [['pro-os-project-num', 3], ['pro-os-project', 4], ['pro-os-client', 5],
                           ['pro-os-unid-fabril', 6]],
                'pro-area': [['pro-area-desc', 2]],
                'motor-status-type': [['motor-status-desc', 1], ['motor-status-cod', 2]],
                'tipo-partida-type': [['tipo-partida-cod', 1], ['tipo-partida-desc', 2]]
            };
            if (Object.keys(dict_result).includes(element_id)) {
                let result = dict_result[element_id];
                for (it in result[0]) { document.getElementById(result[it][0]).value = data[0][result[it][1]] }
                if (element_id === 'tipo-partida-type') {  // Caso especial
                    set_radio_value(document.getElementsByName('tipo-partida-options'), data[0][3]);
                } /*else if (element_id === 'pro-os') {  // Nesse caso, preenche os detalhes do projeto na tela inicial
                    let os_detail = ['pro-os-project', 'pro-os-project-num', 'pro-os-unid-fabril', 'pro-os-client'];
                    for (i in os_detail) {$(`#${os_detail[i]}`).value = data['detalhes'][i]}
                }*/
            }
        });
    }
}

function clear_radio(element) { for (var i=0; i < element.length; i++){ element[i].checked = false; } }

function get_radio_value(element) {
    for (var i=0; i < element.length; i++){ if (element[i].checked){ return element[i].value } }
    return null;
}

function set_radio_value(element, value) {
    for (var i=0; i < element.length; i++){ if (element[i].value === value){ element[i].checked = true } }
}

function clear_inputs(owner_id) {
    //Limpa as informações da tela.
    var dict_ids = {'left-os': ['os-num', 'os-client', 'os-project-num', 'os-unid-fabril', 'os-path', 'os-sep',
                                'os-client-initials', 'os-project', 'os-type'],
                    'left-area': ['area-cod', 'area-desc', 'area-type'],
                    'left-sub-area': ['sub-area-cod', 'sub-area-desc', 'sub-area-type'],
                    'left-motor-status': ['motor-status-desc', 'motor-status-cod', 'motor-status-type'],
                    'left-tipo-partida': ['tipo-partida-type', 'tipo-partida-cod', 'tipo-partida-desc']};

    if(owner_id === 'left-tipo-partida') { clear_radio(document.getElementsByName('tipo-partida-options')) }
    for (idd in dict_ids[owner_id]) { document.getElementById(dict_ids[owner_id][idd]).value = '' }
}

function export_file(owner_id){
    //Faz download do arquivo com os dados do banco.
    var dict_dt = {'data-os': ['TbOsProjeto',  'os-form'],
                   'data-area': ['TbArea', 'area-form'],
                   'data-sub-area': ['TbSubArea', 'sub-area-form'],
                   'data-motor-status': ['TbStatus', 'sub-area-form'],
                   'tipo-partida-type': ['TbTipoPartida', 'motor-status-form']};

    if (Object.keys(dict_dt).includes(owner_id)) {
        let result = dict_dt[owner_id];
        for (it in result) { document.getElementById(result[it][0]).value = data[0][result[it][1]] }
        var form_id = result[2]+"-export";
        var str_html = `<input type="hidden" name="table" value=${result[1]}>\n
                        <input type="hidden" name="search" value=${result[0]}>`;
        document.getElementById(form_id).html(str_html);  //innerHTML = str_html;
        document.getElementById(form_id).submit();
    }
}

function import_file(token, owner_id, e){
    //Faz download do arquivo com os dados do banco.
    var table = '';
    var search = '';
    var alert_id = '';
    var alert_desc = '';
    var owner_ids = {'data-os': ['TbOsProjeto', 'os-alert', 'da OS'],
                     'data-area': ['TbArea', 'area-alert', 'da área'],
                     'data-sub-area': ['TbSubArea', 'sub-area-alert', 'da sub-área'],
                     'data-motor-status': ['TbStatus', 'motor-status-alert', 'do status do motor'],
                     'data-tipo-partida': ['TbTipoPartida', 'tipo-partida-alert', 'do tipo de partida']};

    if(Object.keys(owner_ids).includes(owner_id)) {  // Se o id dono do arquivo estiver no dicionário com os demais ids
        search = owner_ids[owner_id][0];
        table = owner_ids[owner_id][1];
        alert_id = owner_ids[owner_id][2];
        alert_desc = owner_ids[owner_id][3];
        var formData = new FormData();
        formData.append('csrfmiddlewaretoken', token);
        formData.append('search', search);
        formData.append('table', table);
        formData.append('file' , e.target.files[0]);
        $.ajax({
            type: "POST",
            url: "a1pro_import_file/",
            dataType: 'json',
            data: formData,
            contentType : false,
            processData : false
        }).done(function( data ) {
            let message = ` Informações: ${alert_desc}.\n\n Status: ${data['status']}`;
            display_alert(message, alert_id);
        });
    }
}

function display_alert(message, alert_id) {
    var str_html = '<div class="alert alert-warning alert-dismissible fade show" role="alert" >\n' +
                   '    <strong>Atenção!</strong>'+message+'\n' +
                   '    <button type="button" id="alert-button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                   '    <span aria-hidden="true">&times;</span>\n' +
                   '    </button>\n' +
                   '</div>';
    document.getElementById(alert_id).innerHTML = str_html;
    setTimeout(function () { document.getElementById('alert-button').click() }, 1000);
}

function import_data(token, owner_id){
    // Dicionário com os ids apontando para uma lista
    var dict_dados = {'left-os': ['TbOsProjeto', ['os-num', 'os-project-num', 'os-project', 'os-client',
                                                  'os-unid-fabril', 'os-path', 'os-sep', 'os-client-initials']],
                      'left-area': ['TbArea', ['area-cod', 'area-desc']],
                      'left-sub-area': ['TbSubArea', ['sub-area-cod', 'sub-area-desc']],
                      'left-motor-status': ['TbStatus', ['motor-status-desc', 'motor-status-cod']],
                      'left-tipo-partida': ['TbTipoPartida', ['tipo-partida-cod', 'tipo-partida-desc', 'tipo-partida-options']]};

    //TODO: TRATAR NO BACK-END O TIPO DA PARTIDA tipo = 'Não usado'; SE O RADIOVALUE FOR 0

    if (Object.keys(dict_dados).includes(owner_id)){
        var table = dict_dados[owner_id][0];
        var data = [];
        let items = dict_dados[owner_id][1];
        for (itt in items) {data.push(items[itt])};
        $.ajax({
            type: "POST",
            url: "a1pro_select_insert/",
            dataType: 'json',
            data: {'csrfmiddlewaretoken': token, 'data': data, 'table': table}
        }).done(function( data ) {
            let message = ` Informações ${table}. ${data['status']}`;
            display_alert(message, alert_id);
        });
    }
}

function exclude_selected_data(token, owner_id){
    //Exclui do banco o dado selecionado.
    let dict_dt = {'right-os': ['TbOsProjeto', 'os', 'os-alert', 'da OS'],
                   'right-area': ['TbArea', 'area', 'area-alert', 'da area'],
                   'right-sub-area': ['TbSubArea', 'sub_area', 'sub-area-alert', 'da sub-area'],
                   'right-motor-status': ['TbStatus', 'motor_status', 'motor-status-alert', 'do status do motor'],
                   'right-tipo-partida': ['TbTipoPartida', 'tipo_partida', 'tipo-partida-alert', 'do tipo de partida']};

    if (Object.keys(dict_dt).includes(owner_id)) {
        let dt = dict_dt[owner_id];
        $.ajax({
            type: "POST",
            url: "a1pro_exclude/",
            dataType: 'json',
            data: { 'csrfmiddlewaretoken': token, 'table': dt[0], 'key': dt[1] }
        }).done(function( data ) {
            let message = ` Informações ${dt[3]}. ${data['status']}`;
            display_alert(message, dt[2]);
        });
    }
}
                                // CADASTRO DA OS

// Ramon Peretti

function VerifyAndGetDatasOs(update){
    var Errors = []
    const os_search = $('#os-type').val()
    var num = document.getElementById('os-num').value
    const sep = document.getElementById('os-sep').value
    const client = document.getElementById('os-client').value
    const project = document.getElementById('os-project').value
    const num_proj = '-'
    const desc = document.getElementById('os-desc-prj').value
    const initials_client = document.getElementById('os-client-initials').value
    const unid_fabril = document.getElementById('os-unid-fabril').value
    const path = document.getElementById('os-path').value
    const finish = document.getElementById('check-proj-finish').checked

    if(num===""||project===""||client===""||num_proj===""){
        Errors.push("Os campos de Número, Projeto e Cliente são obrigatorios")
    }
    else{
        if (sep.length > 5){
            Errors.push('Digite no maximo 5 caracteres no Separador!')
        }

        if (isNaN(num)){
            Errors.push('Campo Número não é permitido letras ou caracteres especiais!')
        }

        if (initials_client.length > 5){
            Errors.push('Digite no maximo 5 caracteres nas Iniciais!')
        }

        if (project.length>100){
            Errors.push('Projeto só aceita no maximo 100 caracteres!!')
        }

        if (client.length>100){
            Errors.push('Cliente só aceita no maximo 100 caracteres!!')
        }

        if (num_proj.length>100){
            Errors.push('N° Projeto so aceita no maximo 100 caracteres!!')
        }

        if (unid_fabril.length>100){
            Errors.push('Unid Fabril só aceita no maximo 100 caracteres!!')
        }
    }

    if(Errors.length>0){
        return Errors.join(', ')
    }
    else{
        if (update===true){
            num = os_search
        }
        return {
            'num': num,
            'sep': sep,
            'client': client,
            'project': project,
            'num_proj': num_proj,
            'desc': desc,
            'initials_client': initials_client,
            'unid_fabril': unid_fabril,
            'path': path,
            'finish': finish
        }

    }


}
// função para cadastrar os no banco
function import_data_tb_os() {
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var DatasOs = VerifyAndGetDatasOs(false)
    if(typeof DatasOs === "string"){
        return alert(DatasOs)
    }
    $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "register_os/",
              dataType: 'json',
              data: DatasOs,
              success: function (data) {
                  if ('success' in data['return']) {
                      // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                      swalAlert(false, data['return']['success'], 'success', false)
                  } else {
                      // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                      swalAlert(false, data['return']['error'], 'error', false)
                  }
                  clean_forms()
                  list_options('os-type', select=true)
              }
            });
}

// --------------------- Alert para notificar usuario ---------------------//
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

// função para limpar os formularios
function clean_forms() {
    document.getElementById('os-num').value=""
    document.getElementById('os-num').readOnly=false
    document.getElementById('os-sep').value=""
    document.getElementById('os-client').value=""
    document.getElementById('os-project').value=""
    document.getElementById('os-project-num').value=""
    document.getElementById('os-desc-prj').value=""
    document.getElementById('os-client-initials').value=""
    document.getElementById('os-unid-fabril').value=""
    document.getElementById('os-path').value=""
    document.getElementById('check-proj-finish').checked = false
    $('#os-type').val("none")
}

// Função para bloquear o formulario search ao comecar a digitar no formulario de numero de os
function block_search(){
    document.getElementById('os-type').readOnly=true
}


// Classe para manipulação de dados da OS
class Update_datas{
    constructor() {
        this.num_os = this.catch_num_os()
    }

    catch_num_os(){
        return $('#os-type').val()
    }

    take_front_end(){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "search_os/",
              dataType: 'json',
              data: {'num_os': this.num_os},
              success: function (data){
                  if(data['erro']){
                      return alert(data['erro'])
                  }
                  else {
                      document.getElementById('os-num').value = data['num']
                      document.getElementById('os-num').readOnly = true
                      document.getElementById('os-sep').value = data['sep']
                      document.getElementById('os-client').value = data['client']
                      document.getElementById('os-project').value = data['project']
                      document.getElementById('os-project-num').value = data['num_proj']
                      document.getElementById('os-desc-prj').value = data['num_proj']
                      document.getElementById('os-client-initials').value = data['initials']
                      document.getElementById('os-unid-fabril').value = data['unid']
                      document.getElementById('os-path').value = data['path']
                      document.getElementById('check-proj-finish').checked = data['finish']
                  }
              }
          });
    }

    // Método para atualizar a OS
    update_datas(){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        var DatasOs = VerifyAndGetDatasOs(true)
        if(typeof DatasOs === "string"){
            return alert(DatasOs)
        }
        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "update_os/",
              dataType: 'json',
              data: DatasOs,
              success: function (data){
                  if ('success' in data['return']) {
                      // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                      swalAlert(false, data['return']['success'], 'success', false)
                  } else {
                      // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                      swalAlert(false, data['return']['error'], 'error', false)
                  }
                  clean_forms()
                  list_options('os-type', select=true)
              }

          });
    }

    // Método para excluir a os caso ela não tenha area cadastrada
    drop_os(){
        const search = document.getElementById('os-type').value
        if (search == ""){
            return alert("Selecione a OS para poder excluir")
        }
        $.ajax({
              type: "GET",
              url: "drop_os/",
              dataType: 'json',
              data: {'num': this.num_os},
              success: function (data){
                  alert(data['return'])
                  clean_forms()
                  list_options('os-type', select=true)
              }
          });

    }

}

function send_back_front_end(){
    var obj = new Update_datas();
    obj.take_front_end()
}

function exec_update_method(){
    var obj = new Update_datas()
    obj.update_datas()
}

function drop_os(){
    var obj = new Update_datas()
    obj.drop_os()
}

function excluirCadastroOS() {
    swal({
        text: 'Deseja realmente excluir a OS?',
        icon: 'warning',
        buttons: {
            confirm: {
                text: "Sim",
                value: "Sim",
                className: "swal-button swal-button--confirm bg-danger"
            },
            cancel: "Não",
        },
        }).then((value) => {
            if (value) {
                // Ação a ser executada quando o usuário confirma
                drop_os()
            }
        });

}

// função para cadastrar a area
function register_area(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    const cdg = document.getElementById('area-cod').value
    const desc = document.getElementById('area-desc').value
    const os = $(`#pro-os`).val()

    for(i in cdg){
        if(cdg[i] == " "){
            return alert("Um código não pode conter espaço!")
        }
    }
    if (cdg.length > 10){
        return alert("Só é permitido cadastrar um codigo de no maximo 10 caracteres!")
    }

    if (cdg === "" || desc === "" ){
        return alert("Por favor preencha os campos para poder cadastrar!")
    }

    if (desc.length>100){
        return alert("Tamanho de descrição maior do que o permitido")
    }
     $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "register_area/",
              dataType: 'json',
              data: { 'codigo': cdg,
                      'desc': desc,
                      'os': os },
              success: function (data){
                  alert(data['return'])
                  clean_forms_area()
                  list_options_area()
              }

          });
}

// função para limpar os formularios da area
function clean_forms_area(){
    document.getElementById('area-cod').value = ""
    document.getElementById('area-desc').value = ""
    $('#area-type').val("none")
}

// função que lista as opções de area para selecionar
function list_options_area(){
    var list_id = 'area-type'
    var os = document.getElementById('pro-os').value
     $.ajax({
              type: "GET",
              url: "list_options_area/" + os,
              dataType: 'json',
              success: function (data) {
                  var options=`<option value="none">---</option>`;
                  let all_cdg = data['Areas']
                  for (let i = 0; i < all_cdg.length; i++) {
                      options += `<option value=${all_cdg[i]}>${all_cdg[i]}</option>`
                  }
                  $(`#${list_id}`).html(options);
              }
     });
}

// Classe para manipular os formularios
class ManipulationFormsArea{
    constructor() {
        this.cdg_area = this.catch_cdg_area()
    }

    catch_cdg_area(){
        return $('#area-type').val()
    }
    //Método que pega os campos de acordo com o codigo da area e insere nos formularios
    take_front_end(){
        if(this.cdg_area!="none"){
            const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
            $.ajax({
                  type: "POST",
                  headers:{'X-CSRFToken':csrftoken},
                  url: "manipulation_forms_area/",
                  dataType: 'json',
                  data : {'cdg': this.cdg_area, 'os': $(`#pro-os`).val()},
                  success: function (data){
                      if(data['erro']){
                          return alert(data['erro'])
                      }
                      else{
                          document.getElementById('area-desc').value=data['desc']
                          document.getElementById('area-cod').value=data['cdg']
                      }
                  }
              });
        }
        else{
            clean_forms_area()
        }
    }
    // Método atualiza os campos alterados
    update_datas(){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        const cdg = document.getElementById('area-cod').value
        const desc = document.getElementById('area-desc').value
        const os = $(`#pro-os`).val()
        if(cdg.length>10){
            return alert('Código de Area maior do que o permitido!!')
        }
        if(desc.length>100){
            return alert('Descrição maior do que a permitida!!')
        }
        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "update_area/",
              dataType: 'json',
              data: { 'codigo': cdg,
                      'desc': desc,
                      'cdg_search': this.cdg_area,
                      'os': os},
              success: function (data){
                  alert(data['return'])
                  list_options_area()
              }

          });
    }
    // Método deleta o registro de acordo com o numero do codigo
    drop_area(){
        const search = $('#area-type').val()
        if (search == "none"){
            return alert("Selecione a Area para poder excluir")
        }
        $.ajax({
              type: "GET",
              url: "drop_area/",
              dataType: 'json',
              data: {'cdg': search, 'os': $(`#pro-os`).val()},
              success: function (data){
                  alert(data['return'])
                  clean_forms_area()
                  list_options_area()
              }
          });
    }

}

// Função executa o método take_front_end
function exec_manipulation_forms(){
    var obj = new ManipulationFormsArea()
    obj.take_front_end()
}

// Função executa o método update_datas
function exec_update(){
    var obj = new ManipulationFormsArea()
    obj.update_datas()
}

// Função que verifica se vai executar o cadastro ou a atualização dos dados
function verify_update(){
    if ($('#area-type').val() === "none"){
            return register_area()
        }
    else {
            return exec_update()
        }
}

// Função que executa o método drop_area
function exec_drop_area(){
    var obj = new ManipulationFormsArea()
    obj.drop_area()
}

                                // FIM CADASTRO DE AREA


                                // INICIO CADASTRO DA SUB AREA

// Função que registra a Sub Area no Banco
function register_sub_area(){
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    const cdg = document.getElementById('sub-area-cod').value
    const desc = document.getElementById('sub-area-desc').value
    const area = $('#area-type').val()
    for(i in cdg){
        if(cdg[i] == " "){
            document.getElementById('sub-area-cod').value = ""
            return alert("Um código não pode conter espaço!")
        }
    }

    if (cdg.length > 10){
        return alert("Só é permitido cadastrar um codigo de no maximo 10 caracteres!")
    }

    if (cdg == "" || desc == "" ){
        return alert("Por favor preencha os campos para poder cadastrar!")
    }

    if (desc.length>100){
        return alert("Ultrapassou o limite de caracteres da descrição!!")
    }

    $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "register_sub_area/",
              dataType: 'json',
              data: { 'codigo': cdg,
                      'desc': desc,
                      'area': area ,
                      'os': $(`#pro-os`).val()},
              success: function (data){
                  alert(data['return'])
                  clean_forms_sub_area()
                  list_options_sub_area()
              }

          });

}

// Função que lista as Sub Areas quando clica no formulario
function list_options_sub_area(){
    var list_id = 'sub-area-type'
    var area = $('#area-type').val()
     $.ajax({
              type: "GET",
              url: "list_options_sub_area/" + area + "/" + $(`#pro-os`).val() + "/",
              dataType: 'json',
              success: function (data) {
                  var options=`<option value="none">---</option>`;
                  let all_cdg = data['SubAreas']
                  for (let i = 0; i < all_cdg.length; i++) {
                      options += `<option value=${all_cdg[i]}>${all_cdg[i]}</option>`
                  }
                  $(`#${list_id}`).html(options);
              }
     });
}

function verify_area_selected(){
    if ($('#area-type').val() === "none"){
        return alert("Selecione uma área para acessar as sub área!!")
    }
    else{
        $('#subarea').modal('show')
        list_options_sub_area()
    }
}

// Classe para manipular os formularios da Sub Area
class ManipulationFormsSubArea{
    constructor() {
        this.cdg_sub_area = this.catch_cdg_sub_area()
    }

    catch_cdg_sub_area(){
        return $('#sub-area-type').val()
    }
    //Método que pega os campos de acordo com o codigo da Sub Area e insere nos formularios
    take_front_end(){
        if(this.cdg_sub_area != "none"){
            var csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
            var area = $('#area-type').val()
            $.ajax({
                  type: "POST",
                  headers:{'X-CSRFToken':csrftoken},
                  url: "manipulation_forms_sub_area/",
                  dataType: 'json',
                  data : {'cdg': this.cdg_sub_area, 'area': area, 'os': $(`#pro-os`).val()},
                  success: function (data){
                      document.getElementById('sub-area-desc').value=data['desc']
                      document.getElementById('sub-area-cod').value=data['cdg']
                  }
              });
        }
        else {
            clean_forms_sub_area()
        }
    }

    // Método atualiza os campos alterados
    update_datas(){
        var csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        var cdg = document.getElementById('sub-area-cod').value
        var desc = document.getElementById('sub-area-desc').value
        var area = $('#area-type').val()
        if (cdg.length>10){
            return alert('Codigo maior do que o permitido!!')
        }
        if (desc.length>100){
            return alert('Descrição maior do que o permitido!!')
        }
        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "update_sub_area/",
              dataType: 'json',
              data: { 'codigo': cdg,
                      'desc': desc,
                      'cdg_search': this.cdg_sub_area,
                      'area': area,
                      'os': $(`#pro-os`).val()
              },
              success: function (data){
                  alert(data['return'])
                  clean_forms_sub_area()
                  list_options_sub_area()
              }

          });
    }
    // Método deleta o registro de acordo com o numero do codigo
    drop_sub_area(){
        var search = $('#sub-area-type').val()
        var area = $('#area-type').val()
        if (search == ""){
            return alert("Selecione a Sub Area para poder excluir")
        }
        $.ajax({
              type: "GET",
              url: "drop_sub_area/",
              dataType: 'json',
              data: {'cdg': search, 'area': area, 'os': $(`#pro-os`).val()},
              success: function (data){
                  alert(data['return'])
                  clean_forms_sub_area()
                  list_options_sub_area()
              }

          });
    }

}
// Função que executa o método take_front_end
function exec_manipulation_forms_sub_area(){
    var obj = new ManipulationFormsSubArea()
    obj.take_front_end()
}

// Função que limpar os formularios de Sub Area
function clean_forms_sub_area(){
    document.getElementById('sub-area-cod').value = ""
    document.getElementById('sub-area-desc').value = ""
    $('#sub-area-type').val("none")
}

// Função que executa o metodo update_datas
function exec_update_sub_area(){
    var obj = new ManipulationFormsSubArea()
    obj.update_datas()
}

// Função que verifica se atualiza ou cadastra a sub area
function verify_update_sub_area(){
debugger;
    if ($('#sub-area-type').val() === "none"){
        return register_sub_area()
    }
    else {
        return exec_update_sub_area()
    }
}

// Função executa o método drop_sub_area
function exec_drop_sub_area(){
    var obj = new ManipulationFormsSubArea()
    obj.drop_sub_area()
}

                                // FIM CADASTRAMENTO DE SUB AREA

// Função que exibe os dados da OS na tela inicial do A1 Pro
function print_datas_index(){
    debugger;
    const num_os = $(`#pro-os`).val()
    const num_area = cookies_area()
  
 
    if (num_os != 'none'){
        $.ajax({
              type: "GET",
              url: "print_os_index/",
              dataType: 'json',
              data: {'num_os': num_os},
              success: function (data){
                  if(data['erro']){
                      return alert(data['erro'])
                  }
                  else{
                      document.getElementById('pro-os-project').value = data['project']
                      document.getElementById('pro-os-project-num').value = data['num_os']
                      document.getElementById('pro-os-unid-fabril').value = data['unid']
                      document.getElementById('pro-os-client').value = data['client']
                      document.getElementById('pro-os-desc').value = data['desc']
                  }
              }

          });
    }
    else{
          debugger;
          document.getElementById('pro-os-project').value = ""
          document.getElementById('pro-os-project-num').value = ""
          document.getElementById('pro-os-unid-fabril').value = ""
          document.getElementById('pro-os-client').value = ""
          document.getElementById('pro-os-desc').value = ""
    }
}

// Função que limpa os dados da tela inicial do A1 Pro quando aperta backspace nos formularios
function clean_forms_index(){
    document.getElementById('pro-os-project').value = ""
    document.getElementById('pro-os-project-num').value = ""
    document.getElementById('pro-os-unid-fabril').value = ""
    document.getElementById('pro-os-desc').value = ""
    document.getElementById('pro-os-client').value = ""




}

function selectValueInDatalistOs(valueOs){
    const itemsDatalist = document.getElementById('listCustomDatalist').children
    for (let i = 0; i < itemsDatalist.length; i++){
        const elementItem = itemsDatalist[i]
        const idValue = elementItem.dataset.valueFill
        if(String(valueOs) === String(idValue)){
            elementItem.click()
            break
        }

    }
}

async function on_load_a1pro(){
    clean_forms_index()
    setTimeout(getOsAndAreaInCookies, 3000) //aqui é o dalay basico do a1pro cara
}

async function getOsAndAreaInCookies(){
    await $.ajax({
        url: 'get_os_area/',
        method: 'GET',
        success: function(response) {
            // Check if there's a selected service order
            if (response.os) {
                const osNumSelected = response.os
                selectValueInDatalistOs(osNumSelected)
                // percorrer os items da os e selecionar o que der igual
                setTimeout(function() {
                    $('#pro-area').val(response.area);
                    // $('#pro-area').trigger('change');
                }, 2000);
            }
        },
        error: function(xhr, status, error) {
            console.error("Error fetching selected OS:", error);
        }
    });
}

function verify_os_scr_index(){
    if ($(`#pro-os`).val() == 'none'){
        return alert("Selecione uma OS para cadastrar uma nova Área")
    }
    else{
        $('#area').modal('show')
        list_options_area()
    }
}


function manipuling_modal_a1pro(header, content, reload_page=false){
    // Funçãozada pra exibir o modal e colocar o conteudo e o header nele
    $('#header-modal_warning-a1pro').html(header)
    $('#content-modal_warning-a1pro').html(content)
    $('#modal-warning-a1pro').modal('show')
    if(reload_page===true){
        document.getElementById('btn_hide_modal_warning').onclick=HideModalWarningReloadedPage
    }
}
function HideModalWarningReloadedPage(){
    $('#modal-warning-a1pro').modal('hide');
    window.location.reload();
}

function KeyPressCdgAlterSelect(IdCdg, IdSelect){
    if(document.getElementById(IdCdg).value!=""){
        $('#'+IdSelect).val("none")
    }
}

function DebugA1Pro(){
    var num_os = $('#pro-os').val()
    var area = $('#pro-area').val()
    if (num_os!="none" && area!="none"){
        edit_modal('modal-load-a1pro', 'Aguarde...', true)
        $('#modal-load-a1pro').modal('show')
        $.ajax({
          type: "GET",
          url: "A1ProDebug/",
          dataType: 'json',
          data: {},
          success: function (data){
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBar.initProgressBar(progressUrl, {
                  progressBarId: 'progress-bar-modal-load',
                  progressBarMessageId: 'progress-bar-message-modal-load',
                  onSuccess: customSucess,
                  onError: customError,
                  onProgress: customProgress,
                })

                function customSucess(progressBarElement, progressBarMessageElement, result){
                    progressBarElement.style.backgroundColor = '#76ce60';
                    progressBarMessageElement.innerHTML = result
                    setTimeout(()=> {document.getElementById('modal-load-a1pro-content-celery').hidden = true}, 2000)
                    $('#modal-load-a1pro').modal('hide')
                    if(result['status']){
                        swal({
                            title: "Sucesso!",
                            text: result['return'],
                            icon: "success",
                            button: "Fechar!",
                        })
                    }
                    else{
                        window.open('/app/eletrica/a1pro/A1ProDownloadDebugFile/' + data['task_id'] + '/', '_self')
                    }
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage){
                    progressBarElement.style.backgroundColor = '#dc4f63';
                    progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
                    + progressUrl;
                    setTimeout(()=> {document.getElementById('modal-load-a1pro-content-celery').hidden = true}, 1000)
                    $('#modal-load-a1pro').modal('hide')
                }

                function customProgress(progressBarElement, progressBarMessageElement, progress){
                    document.getElementById('modal-load-a1pro-content-celery').hidden = false
                    progressBarElement.style.backgroundColor = '#68a9ef';
                    progressBarElement.style.width = progress.percent + "%";
                    var description = progress.description || "";
                    progressBarMessageElement.innerHTML = description
                }
           }
        });
    }
    else{
        return alert('Selecione uma OS e Area para tirar o debug!!')
    }
}

function verify_selects_show_modal(id_modal){
    // Funçãozinha para usar genericamente na ferramenta sem o uso de cookies
    const os_value = $('#pro-os').val();
    const area_value = $('#pro-area').val();
    if(os_value === 'none' || os_value === ''){
        alert("Selecione a OS!");
        return false
    }
    else if(area_value === 'none' || area_value === '') {
        alert("Selecione a AREA!");
        return false
    }
    else {
        if (id_modal!=false){
            $('#'+id_modal).modal('show')
        }
        return true
    }
}

function OpenScreenListaCabos(){
    if(verify_selects_show_modal(false)){
        window.open('/app/eletrica/a1pro/ListaCabos/', '_self')
    }
}

function VerifyFieldsFloat(id_element){
    var val_element = document.getElementById(id_element).value
    if(isNaN(Number(val_element))){
        document.getElementById(id_element).className+= ' is-invalid '
    }
    else{
        document.getElementById(id_element).classList.remove('is-invalid')
    }
}


function get_page_a1_mat(){
    /**#função que verifica que há uma os e uma area válida antes de preencher
     * @id_modal {String} Nome do id que vai ser chamado o modal
     * @return {Boolean} false para falha e true para funcionou
     */
    const os_value = $('#pro-os').val();
    const area_value = $('#pro-area').val();
    var url = ''
    if(os_value === 'none' || os_value === ''){
        alert("Selecione a OS!");
        return false
    }else if(area_value === 'none' || area_value === ''){
        alert("Selecione a AREA!");
        return false
    }
    else{
        url = `/app/eletrica/a1pro/ConfigCodigosA1MAT`
        window.open(url, '_self')
    }
}


function IconAndHeaderSwal(value_bool){
    // Ramonzao monstro adora usar essa função
    let icon = !value_bool ? 'success':'error'
    let header = !value_bool ? 'Sucesso':'Opa'
    return {'icon': icon, 'header': header}
}

function ScreenGerarTipicosDoc(){
    const os_value = $('#pro-os').val();
    const area_value = $('#pro-area').val();
    if (os_value === 'none' || os_value === '') {
        swal({
            title: "Atenção!",
            text: 'Favor selecionar uma OS!!',
            icon: "warning",
            button: 'Fechar'
        })
        return
    } else if (area_value === 'none' || area_value === '') {
        swal({
            title: "Atenção!",
            text: 'Favor selecionar uma Area!!',
            icon: "warning",
            button: 'Fechar'
        })
        return
    }
    window.open('/app/eletrica/a1pro/GerarTipicosDoc/', '_self')
}

function screenGerenciarTagsTipicos(){
    const os_value = $('#pro-os').val();
    if(os_value !== 'none'){
        console.log('hmmm')
        window.open('/app/eletrica/a1pro/GerenciarTagsTipicos/', '_self')
        // window.open('/app/eletrica/a1pro/GerarTipicosDoc/', '_self')
    }
    else{
        swal({
            title: "Atenção!",
            text: 'Favor selecionar uma OS!!',
            icon: "warning",
            button: 'Fechar'
        })
    }
}

function ScreenControleTipicos(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('ControleTipicos/', '_self')
    }
    else{
        swal({
            text: 'Favor selecione uma OS!!',
            icon: "error",
            button: 'Fechar'
        })
    }
}


function ShowScreenPlanoDeCorte(){
    debugger;
    let os_selected = $('#pro-os').val()
     if(os_selected !== 'none'){
        window.open('PlanoDeCorteRender/', '_self');
     }
     else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço.', true)
     }
}


function ExportacaoListaMateriaisPlanoDeCorte(){
    let os_selected = $('#pro-os').val()
    let area_selected = $('#pro-area').val()
    if(os_selected !== 'none' && area_selected !== 'none'){
        $('#modal_loading_list_material').modal('show')
        $.ajax({
            type: "GET",
            url: "ListaMateriais/",
            dataType: 'json',
            data: {},
            beforeSend: function(){
                document.getElementById("progress-box-list-material-plan-corte").hidden = false;
                $('#gif-progress-list-material-plan-corte')[0].hidden = false
                $('#gif-success-list-material-plan-corte')[0].hidden = true
            },
            success: function (data){
                var progressUrl = `/celery-progress/${data["task_id"]}/`
                CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                    progressBarId: 'progress-bar-list-material-plan-corte',
                    progressBarMessageId: 'progress-bar-message-list-material-plan-corte',
                    onSuccess: customSucess,
                    onError: customError,
                    onProgress: onProgressCustom
                })

                function customSucess(progressBarElement, progressBarMessageElement, result){
                    $('#gif-progress-list-material-plan-corte')[0].hidden = true
                    $('#gif-success-list-material-plan-corte')[0].hidden = false
                    let chave = Object.keys(result)[0];
                    let valor = result[chave];

                    $('#modal_loading_list_material').modal('hide')

                    if (chave === 'success') {
                        progressBarMessageElement.innerHTML = "Sucesso";
                        progressBarElement.style.backgroundColor = '#76ce60';

                    } if (chave === 'info') {
                        progressBarMessageElement.innerHTML = "Sucesso";
                        progressBarElement.style.backgroundColor = '#76ce60';
                        if (valor[2].length === 0) {
                            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                            swalAlert(false, valor[1], 'success', false);
                        } else {
                            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                            swalAlert(false, valor[2].join('\n'), 'info', false);
                        }
                        $('div.swal-text').addClass('font_size_0_8 list-tags-cabo-container')

                        // Faz download do arquivo
                        let diretorioURL = valor[0].split('\\');
                        debugger;
                        window.open("/app/eletrica/a1pro/PlanoDeCorte/Render/DownloadPlanoDeCorte/" + diretorioURL[diretorioURL.length-1], '_self');

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

                    setTimeout(() => {
                        document.getElementById("progress-box-list-material").hidden = true;

                        if (chave === 'success' || chave === 'info') {
                            window.location.reload(true);
                        }
                    }, 3000);
                }

                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                      progressBarElement.style.backgroundColor = '#68a9ef';
                      progressBarMessageElement.innerHTML = progress.description || "";
                      progressBarElement.style.width = progress.percent + "%";
                      $('#load-gif-list-material-plan-corte')[0].style.width = progress.percent + "%";
                }

                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                      progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                      progressBarElement.style.backgroundColor = '#dc4f63';

                      setTimeout(() => {
                            document.getElementById("progress-box-list-material-plan-corte").hidden = true
                            $('#gif-progress-list-material-plan-corte')[0].hidden = true
                            $('#gif-progress-list-material-plan-corte')[0].hidden = true
                      }, 2000)
                }
            }
        });
    }
    else{
        swal({
            text: 'Favor selecione uma OS e Area!!',
            icon: "error",
            button: 'Fechar'
        })
    }
}

// --------------------- Alert para notificar usuario ---------------------//
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


function ScreenControleTipicosForcaControle(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('ControleTipicosForcaControle/', '_self')
    }
    else{
        swal({
            text: 'Favor selecionar uma OS!!',
            icon: "error",
            button: 'Fechar'
        })
    }
}


function ShowScreenListaMateriais(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('ListaMateriaisDocTipicos/', '_self')
    }
    else{
        SwitchAlertA1Pro('Favor selecione uma OS!!', true)
    }
}

function ShowScreenGerenciarTalasChumbs(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('GerenciarTalasChumbsOs/', '_self')
    }
    else{
        SwitchAlertA1Pro('Favor selecione uma OS!!', true)
    }
}
function ShowScreenGeraDiagInter(){
    debugger;
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('GeraDiagInter/', '_self')
    }
    else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço.', true)
    }
}

function ShowScreenGerarLMRevit() {
    debugger;
    window.open('ListaMateriaisPeloRevit/', '_self')
}

function ShowScreenIntegracaoComos(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('IntegracaoComos/', '_self')


    }
    else{
        SwitchAlertA1Pro('Favor selecione uma OS!!', true)
    }
}


function ShowScreenIntegracaoCalcCabos(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('IntegracaoCalcCabos/', '_self')


    }
    else{
        SwitchAlertA1Pro('Favor selecione uma OS!!', true)
    }
}


function SwitchAlertA1Pro(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })

}

function ListaDeCabos() {
    debugger;
    $('#bookexcel').modal('show')
    let csrftoken = document.getElementsByName("csrfmiddlewaretoken")

    $.ajax({
        url: "/app/eletrica/a1pro/ExportLc/", // Caminho do Ajax
        type: "GET", // http method
        headers: {'X-CSRFToken': csrftoken[0].value},
        dataType: "json",
        cache: false,
        processData: false,
        contentType: false,// Envia dados pela solicitação do POST
        beforeSend: function () {
            document.getElementById("div_bar_task_book_excel").hidden = false;
        },
        success: function (data) {
            var progressUrl = `/celery-progress/${data["task_id"]}/`
            CeleryProgressBarCalcCabos.initProgressBar(progressUrl, {
                progressBarId: 'progress-bar-book-excel',
                progressBarMessageId: 'progress-bar-message-book-excel',
                onSuccess: customSucess,
                onError: customError,
                onProgress: onProgressCustom
            })


            function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                progressBarElement.style.backgroundColor = '#68a9ef';
                progressBarMessageElement.innerHTML = progress.description || "";
                progressBarElement.style.width = progress.percent + "%";
            }

            function customSucess(progressBarElement, progressBarMessageElement, result) {
                progressBarElement.style.backgroundColor = '#76ce60';
                progressBarMessageElement.innerHTML = "Sucesso";
                let hamster = document.getElementById('hamstein')
                let url_download = '/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + data["task_id"] + '/'
                document.getElementById('download_file_memorial_excel').action = url_download
                document.getElementById('download_file_memorial_excel').submit()
                hamster.classList.add('animate__backOutLeft')
                hamster.addEventListener('animationend', function () {
                    hamster.classList.remove('animate__backOutLeft');
                    progressBarElement.style.backgroundColor = '#68a9ef';
                    progressBarMessageElement.innerHTML = "Aguardando Inicialização da tarefa..."
                    progressBarElement.style.width = '0%'
                });

                // Pausa o cronômetro
                setTimeout(() => {
                    document.getElementById("div_bar_task_book_excel").hidden = true
                    $('#bookexcel').modal('hide')
                    swalAlert(false, 'Book gerado com sucesso!', 'success', false)
                }, 1000)

            }

            function customError(progressBarElement, progressBarMessageElement, excMessage) {
                progressBarMessageElement.innerHTML = "Houve um erro inesperado:" + excMessage;
                progressBarElement.style.backgroundColor = '#dc4f63';
                // Pausa o cronômetro

                setTimeout(() => {
                    document.getElementById("div_bar_task_book_excel").hidden = true
                }, 1000)
            }
        }
        ,
        failure: function () {
            swalAlert(false, 'Algo deu errado ao fazer o Download! verifique e tente novamente.', 'error', false)
        }
    });

}


function ShowScreenCarregarAcessorios(){
    debugger;
    let os_selected = $('#pro-os').val()
        if(os_selected !== 'none'){
            window.open('CarregarAcessorios/', '_self')
        }
        else{
            SwitchAlertA1Pro('Selecione uma OS antes de prosseguir.', true)
        }
}

function changeOsValues(paramId, paramName){
    list_options('pro-area', select=true);
    print_datas_index();
    print_area_index();
    cookies_os();

}

function list_all_consolidado_and_show_modal(){
    //só tirei o selectElement daqui pq tava meio estranho jogado aqui tudo
    // Atribui o valor do csrt token ali definindo para que ele pegue o token se ele existir e é isso.
    const selectElement = document.getElementById('select_rev_lista_cabos'); 
    selectElement.innerHTML = '<option selected value="0">---</option>';
    const csrf = document.getElementsByName('csrfmiddlewaretoken');
    const headers = (csrf && csrf.length) ? {'X-CSRFToken': csrf[0].value} : {};

    $.ajax({
        url: "/app/eletrica/lista_cabos_consolidado/",
        type: "GET",
        headers: headers,    
        dataType: "json",
        processData: false,
        contentType: false,
        success: function (data) {
            const listPkConsolidacao = data.data;
            const selectElement = document.getElementById('select_rev_lista_cabos');
            listPkConsolidacao.forEach((pk, index) => {
                const option = document.createElement('option');
                option.value = pk;
                option.textContent = `Rev: ${index}` ;
                selectElement.appendChild(option);
            });
            $('#modal_lista_cabos_consolidado').modal('show')
        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}

function ShowScreenConfigBornes(){
    debugger;
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('BornesConfig/', '_self')
    }
    else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço.', true)
    }

}
function print_area_index(){
    debugger;
    const num_os = $('#pro-os').val();
    const num_area = $("#pro-area").val();

    if (num_area !== 'none'){
        $.ajax({
            type: "GET",
            url: "print_area_index/",
            dataType: 'json',
            data: {'num_os': num_os, 'num_area': num_area},
            success: function (data){
                if (data['erro']){
                    return alert(data['erro']);
                }
                document.getElementById('pro-area-desc').value = data['desc_area']

            },
            error: function(xhr, status, err){
                console.error('Erro ao buscar descrição da área:', err);
            }
        });
    } else {
        document.getElementById('pro-area-desc').value = "";
    }
}

// chama automaticamente quando o select #pro-area for alterado pelo usuário
$(document).ready(function(){
    $('#pro-area').on('change', print_area_index);
});

// se você define o valor programaticamente (ex.: getOsAndAreaInCookies),
// garanta também de disparar o evento para executar a função:
// $('#pro-area').val(response.area).trigger('change');

function clear_area_index(){
    // Limpa apenas o campo de descrição da área (evita sobrescrever clean_forms_index existente)
    document.getElementById('pro-area-desc').value = "";
}




function RenderBornesConfigGlobal(){
    window.open('RenderBornesConfigGlobal/', '_self')
}

function RenderBornesConfigOs(){
    debugger;
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('RenderBornesConfigOs/', '_self')
    }
    else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço.', true)
    }
}



function renderBornesConfigOs(){
    let os_selected = $('#pro-os').val()
    if(os_selected !== 'none'){
        window.open('RenderBornesConfigOs/', '_self')
    }
    else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço.', true)
    }
}

function renderPainelDevTests() {
    window.open('RenderPanelDevTests/', '_self')
}

function renderMaterialsList(){
    window.open('RenderMaterialsList/', '_self')
}

function renderEquips(){
    debugger;
    let osSelec = $('#pro-os').val()
    let areaSelec = $('#pro-area').val()
    if(osSelec !== 'none' && areaSelec !== 'none'){
        window.open('RenderEquips/', '_self')
    }
    else{
        SwitchAlertA1Pro('Selecione uma ordem de serviço e área.', true)
    }
}


