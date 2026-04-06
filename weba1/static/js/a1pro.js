/*
 * Lista opções obtidas do back-end e preenche o elemento de seleção correspondente. 
 * Aceita ids de elementos como: 'os-type', 'area-type', 'sub-area-type', 'motor-status-type', 'tipo-partida-type', 'pro-area', 'pro-os'.
 *
 * @param {string} element_id - id do elemento que solicita as opções.
 * @returns {void}
 */
function list_options(element_id) {
    //Lista as opções de seleção do banco.
    console.log(element_id);
    var search = '';
    var table = '';
    var columns = '';
    var key = '';
    // Define parâmetros da consulta conforme o elemento que solicitou as opções
    if (element_id == 'os-type' || element_id == 'pro-os'){
        search = JSON.stringify({});
        table = 'TbOsProjeto';
        columns = JSON.stringify(['tb_os_projeto.tb_os_p_id', 'tb_os_projeto.tb_os_p_num']);
        key = 'os';
    }
    else if(element_id == 'area-type' || element_id == 'pro-area')
    {
        search = JSON.stringify({'tb_area.tb_area_id_os_p':'os'});
        table = 'TbArea';
        columns = JSON.stringify(['tb_area.tb_area_id', 'tb_area.tb_area_nome']);
        key = 'area';
    }
    else if(element_id == 'sub-area-type')
    {
        search = JSON.stringify({'tb_sub_area.tb_sub_area_id_area':'area'});
        table = 'TbSubArea';
        columns = JSON.stringify(['tb_sub_area.tb_sub_area_id', 'tb_sub_area.tb_sub_area_nome']);
        key = 'sub_area';
    }
    else if(element_id == 'motor-status-type')
    {
        search = JSON.stringify({});
        table = 'TbStatus';
        columns = JSON.stringify(['tb_status.tb_stt_id', 'tb_status.tb_stt_nome']);
        key = 'motor_status';
    }
    else if(element_id == 'tipo-partida-type'){
        search = JSON.stringify({});
        table = 'TbTipoPartida';
        columns = JSON.stringify(['tb_tipo_partida.tb_tp_id', 'tb_tipo_partida.tb_tp_nome']);
        key = 'tipo_partida';
    }
    var list_id = element_id+'-list';
    $.ajax({
        type: "GET",
        url: "a1pro_list_options",
        dataType: 'json',
        data: {
            'search': search,
            'table': table,
            'columns': columns,
            'key': key,
        }
    }).done(function( data ) {
        console.log(data);
        var options = '';
        // Monta as <option> para o elemento select/datalist.
        for (var i = 0; i < data.length; i++) {
            // usa o segundo campo retornado como value e label.
            options += `<option value="${data[i][1]}">${data[i][1]}</option>`;
        }
        document.getElementById(list_id).innerHTML = options;
    });
}

/*
 * Busca os dados do item selecionado no back-end e preenche os campos do formulário.
 * Suporta seleções de OS, área, sub-área, status de motor e tipo de partida.
 * @param {string} element_id - id do elemento que disparou a seleção.
 * @param {string|number} option_value - valor selecionado (normalmente id).
 * @returns {void}
 */
function selected_option(element_id, option_value) {
    console.log(element_id);
    // Apresenta os dados cadastrados conforme seleção.
    var search = '';
    var table = '';
    var columns = '';
    var key = '';
    // Prepara parametros de busca (search/table/columns) de acordo com o tipo de elemento
    if (element_id == 'os-type' || element_id == 'pro-os'){
        key = 'os';
        search = JSON.stringify({'tb_os_projeto.tb_os_p_id':option_value});
        table = 'TbOsProjeto';
        columns = JSON.stringify([]);
    }
    else if (element_id == 'area-type' || element_id == 'pro-area'){
        key = 'area';
        search = JSON.stringify({'tb_area.tb_area_id':option_value});
        table = 'TbArea';
        columns = JSON.stringify([]);
    }
    else if (element_id == 'sub-area-type'){
        key = 'sub_area';
        search = JSON.stringify({'tb_sub_area.tb_sub_area_id':option_value});
        table = 'TbSubArea';
        columns = JSON.stringify([]);
    }
    else if(element_id == 'motor-status-type')
    {
        search = JSON.stringify({'tb_status.tb_stt_id':option_value});
        table = 'TbStatus';
        columns = JSON.stringify([]);
        key = 'motor_status';
    }
    else if(element_id == 'tipo-partida-type'){
        search = JSON.stringify({'tb_tipo_partida.tb_tp_id':option_value});
        table = 'TbTipoPartida';
        columns = JSON.stringify([]);
        key = 'tipo_partida';
    }
    $.ajax({
        type: "GET",
        url: "a1pro_select_insert",
        dataType: 'json',
        data: {
            'search': search,
            'table': table,
            'columns': columns,
            'key': key,
        }
    }).done(function( data ) {
        console.log(data)
        // Preenche os campos da interface com os dados retornados pelo servidor total
        if (element_id == 'os-type'){
            document.getElementById('os-num').value = data[0][2];
            document.getElementById('os-project-num').value = data[0][3];
            document.getElementById('os-project').value = data[0][4];
            document.getElementById('os-client').value = data[0][5];
            document.getElementById('os-unid-fabril').value = data[0][6];
            document.getElementById('os-path').value = data[0][7];
            document.getElementById('os-sep').value = data[0][8];
            document.getElementById('os-client-initials').value = data[0][9];
        }
        else if(element_id == 'area-type'){
            document.getElementById('area-desc').value = data[0][2];
            document.getElementById('area-cod').value = data[0][3];
        }
        else if(element_id == 'sub-area-type'){
            document.getElementById('sub-area-desc').value = data[0][2];
            document.getElementById('sub-area-cod').value = data[0][3];
        }
        else if(element_id == 'pro-os'){
            document.getElementById('pro-os-project-num').value = data[0][3];
            document.getElementById('pro-os-project').value = data[0][4];
            document.getElementById('pro-os-client').value = data[0][5];
            document.getElementById('pro-os-unid-fabril').value = data[0][6];
        }
        else if(element_id == 'pro-area'){
            document.getElementById('pro-area-desc').value = data[0][2];
        }
        else if(element_id == 'motor-status-type')
        {
            document.getElementById('motor-status-desc').value = data[0][1];
            document.getElementById('motor-status-cod').value = data[0][2];
        }
        else if(element_id == 'tipo-partida-type'){
            document.getElementById('tipo-partida-cod').value = data[0][1];
            document.getElementById('tipo-partida-desc').value = data[0][2];
            set_radio_value(document.getElementsByName('tipo-partida-options'), data[0][3]);
        }
    });
}

/**
 * Desmarca todos os radio buttons passado no NodeList/array `element`.
 * @param {NodeList|Array} element - coleção de elementos input[type=radio].
 * @returns {void}
 */
function clear_radio(element) {
    for (var i=0; i < element.length; i++){
        element[i].checked = false;
    }
}

/*
 * Retorna o valor do radio selecionado na coleção ou null se nenhum marcado.
 * @param {NodeList|Array} element - coleção de elementos input[type=radio].
 * @returns {string|null}
 */
function get_radio_value(element) {
    for (var i=0; i < element.length; i++){
        if (element[i].checked){
            return element[i].value;
        };
    }
    return null;
}

/*
 * Marca o radio cujo valor corresponde a `value` na coleção `element`.
 * @param {NodeList|Array} element - coleção de elementos input[type=radio].
 * @param {string} value - valor a ser marcado.
 * @returns {void}
 */
function set_radio_value(element, value) {
    for (var i = 0; i < element.length; i++) {
        if (element[i].value == value) {
            element[i].checked = true;
        }
    }
}


/**
 * Limpa (reseta) os campos do formulário dependendo do `owner_id` informado.
 * Exemplos de `owner_id`: 'left-os', 'left-area', 'left-sub-area', 'left-motor-status', 'left-tipo-partida'.
 * @param {string} owner_id - identificador da seção a ser limpa.
 * @returns {void}
 */
function clear_inputs(owner_id) {
    console.log(owner_id);
    // Limpa as informações da tela.
    if (owner_id == 'left-os'){
        // Limpa campos relacionados à OS (formulário da esquerda)
        document.getElementById('os-num').value = '';
        document.getElementById('os-client').value = '';
        document.getElementById('os-project-num').value = '';
        document.getElementById('os-unid-fabril').value = '';
        document.getElementById('os-path').value = '';
        document.getElementById('os-sep').value = '';
        document.getElementById('os-client-initials').value = '';
        document.getElementById('os-project').value = '';
        document.getElementById('os-project').value = '';
        document.getElementById('os-type').value = '';
    }
    else if (owner_id == 'left-area'){
        // Limpa campos relacionados à Área
        document.getElementById('area-cod').value = '';
        document.getElementById('area-desc').value = '';
        document.getElementById('area-type').value = '';
    }
    else if (owner_id == 'left-sub-area'){
        // Limpa campos relacionados à Sub-Área
        document.getElementById('sub-area-cod').value = '';
        document.getElementById('sub-area-desc').value = '';
        document.getElementById('sub-area-type').value = '';
    }
    else if(owner_id == 'left-motor-status')
    {
        // Limpa campos do status do motor
        document.getElementById('motor-status-desc').value = '';
        document.getElementById('motor-status-cod').value = '';
        document.getElementById('motor-status-type').value = '';
    }
    else if(owner_id == 'left-tipo-partida'){
        // Limpa campos do tipo de partida e radios associados
        document.getElementById('tipo-partida-type').value = '';
        document.getElementById('tipo-partida-cod').value = '';
        document.getElementById('tipo-partida-desc').value = '';
        clear_radio(document.getElementsByName('tipo-partida-options'));
    }
}


/*
 * Prepara e submete um formulário oculto para exportação (download) de dados do back-end.
 * @param {string} owner_id - identifica qual conjunto de dados exportar (ex: 'data-os').
 * @returns {void}
 */
function export_file(owner_id){
    console.log(owner_id);
    //Faz download do arquivo com os dados do banco.
    var table = '';
    var search = '';
    var form_id = '';
    if (owner_id == 'data-os'){
        table = 'TbOsProjeto';
        search = JSON.stringify({});
        form_id = 'os-form';
    }
    else if (owner_id == 'data-area'){
        search = JSON.stringify({});
        table = 'TbArea';
        form_id = 'area-form';
    }
    else if (owner_id == 'data-sub-area'){
        search = JSON.stringify({});
        table = 'TbSubArea';
        form_id = 'sub-area-form';
    }
    else if(owner_id == 'data-motor-status')
    {
        search = JSON.stringify({});
        table = 'TbStatus';
        form_id = 'motor-status-form';
    }
    else if(owner_id == 'data-tipo-partida'){
        search = JSON.stringify({});
        table = 'TbTipoPartida';
        form_id = 'motor-status-form';
    }
    // Corrigir.
    /*var myForm = document.getElementById(form_id);
    var formData = new FormData(myForm);
    formData.append('table', table);
    formData.append('search', search);
    myForm.submit();*/
    form_id = form_id+"-export";
    // Monta campos hidden no form de exportação e submete para iniciar o download
    var str_html = `<input type="hidden" name="table" value=${table}>\n
                    <input type="hidden" name="search" value=${search}>`;
    document.getElementById(form_id).innerHTML = str_html;
    document.getElementById(form_id).submit();
}


/*
 * Envia um arquivo selecionado para importação via AJAX.
 * @param {string} token - CSRF token necessário para a requisição POST.
 * @param {string} owner_id - identifica qual conjunto será importado (ex: 'data-os').
 * @param {Event} e - evento do input file (com o arquivo em e.target.files[0]).
 * @returns {void}
 */
function import_file(token, owner_id, e){
    console.log(owner_id);
    //Faz upload do arquivo com os dados para o back-end.
    var table = '';
    var search = '';
    var alert_id = '';
    var alert_desc = '';
    if (owner_id == 'data-os'){
        table = 'TbOsProjeto';
        search = JSON.stringify({});
        alert_id = 'os-alert';
        alert_desc = 'da OS';
    }
    else if (owner_id == 'data-area'){
        search = JSON.stringify({});
        table = 'TbArea';
        alert_id = 'area-alert';
        alert_desc = 'da área';
    }
    else if (owner_id == 'data-sub-area'){
        search = JSON.stringify({});
        table = 'TbSubArea';
        alert_id = 'sub-area-alert';
        alert_desc = 'da sub-área';
    }
    else if(owner_id == 'data-motor-status')
    {
        search = JSON.stringify({});
        table = 'TbStatus';
        alert_id = 'motor-status-alert';
        alert_desc = 'do status do motor';
    }
    else if(owner_id == 'data-tipo-partida'){
        search = JSON.stringify({});
        table = 'TbTipoPartida';
        alert_id = 'tipo-partida-alert';
        alert_desc = 'do tipo de partida';
    }
    var formData = new FormData();
    formData.append('csrfmiddlewaretoken', token);
    formData.append('search', search);
    formData.append('table', table);
    // Anexa o arquivo selecionado pelo input file
    formData.append('file' , e.target.files[0]);
    $.ajax({
        type: "POST",
        url: "a1pro_import_file",
        dataType: 'json',
        data: formData,
        contentType : false,
        processData : false
    }).done(function( data ) {
        let message = ` Informações ${alert_desc}. ${data['status']}`
        display_alert(message, alert_id);
    });

}


/*
 * Exibe uma mensagem Bootstrap alert dentro do elemento `alert_id` e fecha automaticamente a parada.
 * @param {string} message - texto da mensagem de alerta.
 * @param {string} alert_id - id do contêiner onde o alerta será inserido.
 * @returns {void}
 */
function display_alert(message, alert_id){
    var str_html = '<div class="alert alert-warning alert-dismissible fade show" role="alert" >\n' +
                       '    <strong>Atenção!</strong>'+message+'\n' +
                       '    <button type="button" id="alert-button" class="close" data-dismiss="alert" aria-label="Close">\n' +
                       '    <span aria-hidden="true">&times;</span>\n' +
                       '    </button>\n' +
                       '</div>';
    document.getElementById(alert_id).innerHTML = str_html;
    setTimeout(function () {
        document.getElementById('alert-button').click();
    }, 1000);
}


/*
 * Envia os dados do formulário para a atualização no back-end via AJAX.
 * @param {string} token - CSRF token para a requisição.
 * @param {string} owner_id - identifica qual conjunto de dados está sendo enviado.
 * @returns {void}
 */
function import_data(token, owner_id){
    //Insere os dados no banco.
    console.log(owner_id)
    var data = {};
    var table = '';
    var alert_id = '';
    var alert_desc = '';
    var key = '';
    if (owner_id == 'left-os') {
        // Coleta valores do formulário de OS para enviar ao back-end
        data = JSON.stringify({
            'tb_os_p_num': document.getElementById('os-num').value,
            'tb_os_p_num_proj': document.getElementById('os-project-num').value,
            'tb_os_p_desc_proj': document.getElementById('os-project').value,
            'tb_os_p_cliente': document.getElementById('os-client').value,
            'tb_os_p_uni_fabril': document.getElementById('os-unid-fabril').value,
            'tb_os_p_path': document.getElementById('os-path').value,
            'tb_os_p_caracter_tag': document.getElementById('os-sep').value,
            'tb_os_p_cod_cliente': document.getElementById('os-client-initials').value,
        });
        table = 'TbOsProjeto';
        alert_id = 'os-alert';
        alert_desc = 'da OS';
        key = 'os';
    }
    else if (owner_id == 'left-area'){
        // Coleta valores do formulário de Área
        data = JSON.stringify({
        'tb_area_nome': document.getElementById('area-cod').value,
        'tb_area_desc': document.getElementById('area-desc').value,
        'tb_area_id_os_p': 'os',
        });
        table = 'TbArea';
        alert_id = 'area-alert';
        alert_desc = 'da área';
        key = 'area';
    }
    else if (owner_id == 'left-sub-area'){
        // Coleta valores do formulário de Sub-Área
        data = JSON.stringify({
        'tb_sub_area_nome': document.getElementById('sub-area-cod').value,
        'tb_sub_area_desc': document.getElementById('sub-area-desc').value,
        'tb_sub_area_id_area': 'area',
        });
        table = 'TbSubArea';
        alert_id = 'sub-area-alert';
        alert_desc = 'da sub-área';
        key = 'sub_area';
    }
    else if (owner_id == 'left-motor-status'){
        // Coleta valores do formulário de Status do Motor
        data = JSON.stringify({
        'tb_stt_desc': document.getElementById('motor-status-desc').value,
        'tb_stt_nome': document.getElementById('motor-status-cod').value,
        });
        table = 'TbStatus';
        alert_id = 'motor-status-alert';
        alert_desc = 'do status do motor';
        key = 'motor_status';
    }
    else if (owner_id == 'left-tipo-partida'){
        var tipo = get_radio_value(document.getElementsByName('tipo-partida-options'));
        if (tipo == null){
            tipo = 'Não usado';
        }
        // Coleta valores do formulário de Tipo de Partida (inclui opção do radio)
        data = JSON.stringify({
        'tb_tp_nome': document.getElementById('tipo-partida-cod').value,
        'tb_tp_desc': document.getElementById('tipo-partida-desc').value,
        'tb_tp_tipo': tipo,
        });
        table = 'TbTipoPartida';
        alert_id = 'tipo-partida-alert';
        alert_desc = 'do tipo de partida';
        key = 'tipo_partida';
    }
    $.ajax({
        type: "POST",
        url: "a1pro_select_insert",
        dataType: 'json',
        data: {
            'csrfmiddlewaretoken': token,
            'data': data,
            'table': table,
            'key': key,
        }
    }).done(function( data ) {
        console.log(data);
        let message = ` Informações ${alert_desc}. ${data['status']}`
        display_alert(message, alert_id);
    });
}


/*
 * Pede a exclusão de um registro selecionado via AJAX.
 * @param {string} token - CSRF token para a requisição.
 * @param {string} owner_id - identifica qual tipo de dado excluir (ex: 'right-os').
 * @returns {void}
 */
function exclude_selected_data(token, owner_id){
    console.log(owner_id);
    //Exclui do banco o dado selecionado.
    var table = '';
    var key = '';
    var alert_id = '';
    var alert_desc = '';
    if (owner_id == 'right-os') {
        table = 'TbOsProjeto';
        key = 'os';
        alert_id = 'os-alert';
        alert_desc = 'da OS';
    }
    else if (owner_id == 'right-area'){
        table = 'TbArea';
        key = 'area';
        alert_id = 'area-alert';
        alert_desc = 'da area';
    }
    else if (owner_id == 'right-sub-area'){
        table = 'TbSubArea';
        key = 'sub_area';
        alert_id = 'sub-area-alert';
        alert_desc = 'da sub-area';
    }
    else if (owner_id == 'right-motor-status'){
        table = 'TbStatus';
        key = 'motor_status';
        alert_id = 'motor-status-alert';
        alert_desc = 'do status do motor';
    }
    else if (owner_id == 'right-tipo-partida'){
        table = 'TbTipoPartida';
        key = 'tipo_partida';
        alert_id = 'tipo-partida-alert';
        alert_desc = 'do tipo de partida';
    }
    $.ajax({
        type: "POST",
        url: "a1pro_exclude",
        dataType: 'json',
        data: {
            'csrfmiddlewaretoken': token,
            'table': table,
            'key': key,
        }
    }).done(function( data ) {
        console.log(data);
        let message = ` Informações ${alert_desc}. ${data['status']}`
        display_alert(message, alert_id);
    });
}




