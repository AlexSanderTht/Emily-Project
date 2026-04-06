
    var hot;
    //--------------------- Função atualiza quantidade de options ---------------------//
    $(document).ready(function() {
        // Atualiza o valor de quantidade das cargas e tipicos
        setInterval(function() {
            $('#length_cargas_select_tipicos').text($('#cargas_select_tipicos option').filter(':visible').length);
            $('#length_detalhes_tipicos').text($('#detalhes_tipicos option').filter(':visible').length);
            $('#length_cargas_tipicos').text($('#cargas_tipicos option').filter(':visible').length);
            $('#length_cargas_select_tipicos_acessorios').text($('#cargas_select_tipicos-acessorios option').filter(':visible').length);
            $('#length_detalhes_tipicos_acessorios').text($('#detalhes_tipicos_acessorios option').filter(':visible').length);
            $('#length_cargas_tipicos-acessorios').text($('#cargas_tipicos-acessorios option').filter(':visible').length);
            $('#length_cargas_select_tipicos_suportes').text($('#cargas_select_tipicos-suportes option').filter(':visible').length);
            $('#length_detalhes_tipicos_suportes').text($('#detalhes_tipicos_suportes option').filter(':visible').length);
            $('#length_cargas_tipicos-suportes').text($('#cargas_tipicos-suportes option').filter(':visible').length);
        }, 1000);
        /*$('#testModal').modal({
        backdrop: 'static',
        keyboard: false
        });*/
        // Aplica a primeira configuração de current_id, filter_value, tipo_carga, next_id
        filterOptionTipicos('tipo_carga_area', '1', 'MO', 'tipo_componente')
        CarregaDescidaDerivacoes()
        // Seta a regra disable para os selects
        removeDisabledAtribute('tipo_carga_area', 'select_detalhes_tipicos');
        removeDisabledAtribute('tipo_componente_acessorios', 'select_detalhes_tipicos-acessorios')
    });

     //--------------------- Função de pesquisa em equipamentos e tipicos ---------------------//
    function filtrarOpcoes(carga, id) {
        debugger;
        let selectElement = document.getElementById(id);
        let options = selectElement.options;

        for (let i = 0; i < options.length; i++) {
            let option = options[i];
            let optionText = option.textContent.toLowerCase();

            if (optionText.indexOf(carga.toLowerCase()) === -1) {
                option.style.display = 'none';
            } else {
                option.style.display = '';
            }
        }
    }

    //--------------------- Função remove atributo disabled ---------------------//
    function removeDisabledAtribute(id_select, aba_tipico) {
        let teste = aba_tipico;
        let list_select = document.getElementById(teste).querySelectorAll('select');
        let list_id = $.map(list_select , function(element) {return element.id});
        let startingIndex = list_id.indexOf(id_select) + 1; // Encontra o índice do ID de partida posterior
        let selectsDesabilitados =document.getElementById(id_select);

        // Remove o atributo disabled do ID de partida
        selectsDesabilitados.removeAttribute("disabled");

        // Percorre os elementos a partir do índice encontrado e define o atributo 'disabled'
        for (var i = startingIndex; i < list_id.length; i++) {
          document.getElementById(list_id[i]).disabled = true;
          $('#'+list_id[i]).val('--')}
        }


    //--------------------- Função pega o valor do cookie com base no nome ---------------------//
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }


    //--------------------- Função pega o valor do cookie com base no nome ---------------------//
    function registerNewTipic(cargas_sem_tipico, codigo_montado, tipo_tipico) {

        let options = document.getElementById(cargas_sem_tipico).selectedOptions
        let code = $.map($(codigo_montado)[0].children  , function(element) {
            return element.textContent}).join('')
        let values_motor=''
        let tagmotores = [];
        let dict_tip = {};

        if (options.length > 0) {
            if (tipo_tipico === 'equipamento' && ($('#componente_ligacao_equip')[0].selectedOptions[0].id === '--' || $('#componente_ligacao_equip')[0].disabled)) {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Selecione todas as configurações para continuar!', 'warning', false)
            } else if (tipo_tipico === 'acessorios' && ($('#material_acess_acessorios')[0].selectedOptions[0].id === '--' || $('#material_acess_acessorios')[0].disabled)) {
                swalAlert(false, 'Selecione todas as configurações para continuar!', 'warning', false)
            } else {
                // Cria nova option com base no código do tipico

                let new_option = `<option class="px-2 rounded text-truncate">${code}</option>`

                // Loop incrementa options com base nos equipamentos retornados
                let quant_options = options.length
                for (var i = 0; i < quant_options; i++) {
                    tagmotores.push(options[i].text);
                }
                const osnum = getCookie('OS');
                const area = getCookie('Area');

                dict_tip['os'] = osnum;
                dict_tip['area'] = area;
                dict_tip['tipo_tip'] = tipo_tipico
                dict_tip['codigo_tip'] = code;
                dict_tip['motores'] = tagmotores;

                sendDict(dict_tip, options, tipo_tipico);

            }
        } else {
            if ($('#tipo_rosca')[0].selectedOptions[0].id === '--' || $('#tipo_rosca')[0].disabled) {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Selecione todas as configurações para continuar!', 'warning', false)
            } else {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Selecione algum motor para continuar!', 'warning', false)
            }
        }
    }

    //--------------------- Função pega o valor do cookie com base no nome ---------------------//
    function getCookie(name) {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            if (cookie.startsWith(name + '=')) {
                return cookie.substring(name.length + 1);
            }
        }
        return null;
    }


    //--------------------- Função async busca equipamentos ---------------------//
    async function RetornaEquipOs(tipo) {
        /**
         * Função assincrona que faz a busca dos equipamentos por OS, na tabela de ligação e origem
         * @param {string} tipo - Tipo do equipamento
         * @return {*} - Retorna uma procedure
         */
        const osnum = getCookie('OS');
        const area = getCookie('Area');

        let request = await $.ajax({
            url: "/app/eletrica/a1pro/RetornaEquipOsCadastroForcaControle/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPOEQUIP': tipo}
        })
        return request
        /*return request['Equips']*/
}

    //--------------------- Função filtra options com base na carga ---------------------//
    async function filterOptionTipicos(current_id, value, tipo_carga, next_id){
        let data = await RetornaEquipOs(tipo_carga);
        /*let equipamentos = await RetornaEquipOs(tipo_carga);*/
        let equipamentos = data['Equips'];
        let acessorios = data['Acess']
        let tipicos_forca = data['TipicosForca']
        let tipicos_acessorios = data['TipicosAcessorios']
        let values_equip = '';
        let values_acessorios = '';
        let values_tipicos_forca = '';
        let values_tipicos_acessorios = '';
        // Loop incrementa options com base nos equipamentos retornados
        for (var i = 0; i < equipamentos.length; i++) {
            values_equip += `<option class="px-2 rounded text-truncate" value=${equipamentos[i]['id']}>${equipamentos[i]['tag']}</option>`
        }
        for (var i = 0; i < acessorios.length; i++) {
            values_acessorios += `<option class="px-2 rounded text-truncate" value="${acessorios[i]}">${acessorios[i]}</option>`;
        }
        for (var i = 0; i < tipicos_forca.length; i++) {
            values_tipicos_forca += `<option class="px-2 rounded text-truncate" value="${acessorios[i]}">${tipicos_forca[i]}</option>`;
        }
        for (var i = 0; i < tipicos_acessorios.length; i++) {
            values_tipicos_acessorios += `<option class="px-2 rounded text-truncate" value="${acessorios[i]}">${tipicos_acessorios[i]}</option>`;
        }

        // Preenche as cargas novamente
        document.getElementById('cargas_select_tipicos').innerHTML = values_equip
        document.getElementById('cargas_select_tipicos-acessorios').innerHTML = values_acessorios
        document.getElementById('detalhes_tipicos').innerHTML = values_tipicos_forca
        document.getElementById('detalhes_tipicos_acessorios').innerHTML = values_tipicos_acessorios

        // Busca o Primeiro option
        ajaxOptionNextLevel(current_id, value, tipo_carga, next_id)
        ajaxOptionNextLevel('tipo_componente_acessorios', value, tipo_carga, 'tipo_rosca_ligacao_acessorios')

        // Carrega detalhes típicos
        //CarregaDwgsSuportes()

    }

function CarregaDwgsSuportes() {
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    document.getElementById('cargas_tipicos-suportes').innerHTML='';
    $.ajax({
        url: "/app/eletrica/a1pro/DwgsSuportesTipicosForca/",
        type: "GET",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': area},
        success: function (data) {
            document.getElementById('template_select').innerHTML = ''; // Mudei o ID para 'template_select'
            for (var i = 0; i < data['data'].length; i++) {
                var id_template = data['data'][i].id_template;
                var nome_template = data['data'][i].nome_template;

                // Cria uma opção para cada template
                var templateHTML = `
                    <option value="${id_template}" title="${nome_template}" onclick="getImgDwg('${nome_template}')">
                        ${nome_template}
                    </option>
                `;
                document.getElementById('template_select').insertAdjacentHTML('beforeend', templateHTML);
            }
            document.getElementById('cargas_select_tipicos-suportes').innerHTML = '';
                for (let i = 0; i < data['motores cadastrados'].length; i++) {
                    let novoItem = data['motores cadastrados'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('cargas_select_tipicos-suportes').innerHTML += new_option;
                }


            document.getElementById('detalhes_tipicos_suportes').innerHTML = '';
                for (let i = 0; i < data['suportes cadastrados'].length; i++) {
                    let novoItem = data['suportes cadastrados'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('detalhes_tipicos_suportes').innerHTML += new_option;
                }


        },
        error: function (xhr, status, error) {
            console.log("Erro:", error);
            swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
        }
    });
}


function CarregaDwgsFixacaoInfra() {
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    document.getElementById('tipicos_selecionados_fixacao_infra').innerHTML='';
    document.getElementById('cargas_tipicos-fixacao_infra').innerHTML='';

    $.ajax({
        url: "/app/eletrica/a1pro/DwgsFixacaoInfraTipicosForca/",
        type: "GET",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': area},
        success: function (data) {
            document.getElementById('template_select_fixacao_infra').innerHTML = ''; // Mudei o ID para 'template_select'
            for (var i = 0; i < data['data'].length; i++) {
                var id_template = data['data'][i].id_template;
                var nome_template = data['data'][i].nome_template;

                // Cria uma opção para cada template
                var templateHTML = `
                    <option value="${id_template}" title="${nome_template}" onclick="getImgDwg('${nome_template}')">
                        ${nome_template}
                    </option>
                `;

                document.getElementById('template_select_fixacao_infra').insertAdjacentHTML('beforeend', templateHTML);

            }

            document.getElementById('cargas_select_tipicos-fixacao_infra').innerHTML = '';
                for (let i = 0; i < data['lista diametros'].length; i++) {
                    let novoItem = data['lista diametros'][i];
                    let new_option = `<option class="px-2 rounded text-truncate" onclick="SelecionarDiametroFixacaoInfra()">${novoItem}</option>`;
                    document.getElementById('cargas_select_tipicos-fixacao_infra').innerHTML += new_option;
                }

                document.getElementById('detalhes_tipicos_fixacao_infra').innerHTML = '';
                    for (let i = 0; i < data['fixacoes_cadastradas'].length; i++) {
                    debugger;
                        let novoItem = data['fixacoes_cadastradas'][i];
                        let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                        document.getElementById('detalhes_tipicos_fixacao_infra').innerHTML += new_option;
                    }


            /*
            document.getElementById('detalhes_tipicos_suportes').innerHTML = '';
                for (let i = 0; i < data['suportes cadastrados'].length; i++) {
                    let novoItem = data['suportes cadastrados'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('detalhes_tipicos_suportes').innerHTML += new_option;
                }
            */


        },
        error: function (xhr, status, error) {
            console.log("Erro:", error);
            swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
        }
    });
}


function toggleInputBox(checkbox, inputBoxId) {
    var inputBox = document.getElementById(inputBoxId);
    if (checkbox.checked) {
        inputBox.style.display = "block"; // Mostra o input
    } else {
        inputBox.style.display = "none"; // Esconde o input
    }
}

    //--------------------- Função busca próximo nível do select ---------------------//
    function ajaxOptionNextLevel(current_id, value, tipo_carga) {
        // Verifica se a seleção efetivamente é diferente de '--'
        const osnum = getCookie('OS');
        if (value !== '--') {
            let list_select;
            if (current_id.endsWith('acessorio') || current_id.endsWith('acessorios')) {
                list_select = document.getElementById('select_detalhes_tipicos-acessorios').querySelectorAll('select');
            } else {
                list_select = document.getElementById('select_detalhes_tipicos').querySelectorAll('select');
            }
            let list_title = $.map(list_select , function(element) {if (element.selectedOptions[0]) {
                return element.selectedOptions[0].title.split(' | ')[0]}})
            $.ajax({
                url: "/app/eletrica/a1pro/NextLevelControleTipicosForca/", // Caminho do Ajax
                type: "GET", // http method
                dataType: "json",
                data: {'next_level': JSON.stringify({'code': list_title, 'current_id': current_id, 'value': value, 'tipo_carga': tipo_carga, 'os': osnum})}, // Envia form pela solicitação do GET
                success: function (data) {
                    if (Array.isArray(data['message'])) {
                        let itens = data['message']
                        let options_itens = '<option id="--" value="--" disabled selected>---</option>'

                        // Limpa as options primeiramente
                        document.getElementById(current_id).innerHTML = ''

                        // Loop incrementa options com base nos itens retornados
                        for (var i = 0; i < itens.length; i++) {
                            var estilo = itens[i].hasOwnProperty('invalido') ? 'style="color:red;"' : '';
                            var desabilitar = itens[i].hasOwnProperty('invalido') ? 'disabled' : '';
                            options_itens += `<option title="${itens[i]['title']}"
                            id="${itens[i]['id']}"
                            data-carga-motora="${itens[i]['data-carga-motora']}"
                            ${estilo} ${desabilitar}>${itens[i]['value']}</option>`;
                        }

                        // Preenche as options novamente
                        document.getElementById(current_id).innerHTML = options_itens;
                    } else {
                        // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                        swalAlert(false, data['message']['error'], 'error', false)
                    }
                },
                failure: function () {
                    // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                    swalAlert(false, 'Algo deu errado ao buscar o próximo nível! verifique e tente novamente.', 'error', false)
                }
            })
        }
    }

    //--------------------- Função atualiza codigo do tipico ---------------------//
    function fillCodeTipico(){
        let code = document.getElementById('codigo-tipico')
        let list_select = document.getElementById('select_detalhes_tipicos').querySelectorAll('select')
        let list_title = $.map(list_select , function(element) {if (element.selectedOptions[0]) {
            return element.selectedOptions[0].title.split(' | ')[0]}})
        let filteredArray = list_title.filter(function(item) {return item.trim() !== ''});
        let maskedValue = "************";
        let value = '';

        // Adiciona o caractere '-' após o primeiro select
        if (filteredArray.length > 0) {
            filteredArray.splice(0, 0, 'M');
        }
        // Adiciona o caractere '-' após o primeiro select
        if (filteredArray.length > 1) {
            filteredArray.splice(2, 0, '-');
        }
        // Adiciona o caractere 'X' após o 6 caractere
        if (filteredArray.length > 5) {
            filteredArray.splice(6, 0, 'X');
        }
        // Adiciona o caractere 'X' após o 7 caractere
        if (filteredArray.length > 8) {
            filteredArray.splice(9, 0, 'X');
        }
        if (filteredArray.length > 10) {
            filteredArray.splice(11, 0, 'X0');
        }

        value = filteredArray.join('');

        for (let i = 0; i < value.length; i++) {
            (function(index) {
                let updatedValue = value.substr(0, index + 1) + maskedValue.substr(index + 1);
                let maskedHTML = '';

                for (let j = 0; j < updatedValue.length; j++) {
                    maskedHTML += `<span class="animate__animated animate__fadeIn">${updatedValue[j]}</span>`;
                }

                code.innerHTML = maskedHTML;
          })(i);
        }
    }


        //--------------------- Função atualiza codigo do tipico ---------------------//
    function fillCodeTipicoAcessorios(){
        let code = document.getElementById('codigo-tipico-acessorios')
        let list_select = document.getElementById('select_detalhes_tipicos-acessorios').querySelectorAll('select')
        let list_title = $.map(list_select , function(element) {if (element.selectedOptions[0]) {
            return element.selectedOptions[0].title.split(' | ')[0]}})
        let filteredArray = list_title.filter(function(item) {return item.trim() !== ''});
        let maskedValue = "************";
        let value = '';
        for (let i = 0; i < 2; i++) {
        }
        // Adiciona o caractere '-' após o primeiro select
        if (filteredArray.length > 0) {
            filteredArray.splice(0, 0, 'A');
        }
        if (filteredArray.length > 0) {
            filteredArray.splice(1, 0, 'X');
        }
        // Adiciona o caractere '-' após o primeiro select
        if (filteredArray.length > 1) {
            filteredArray.splice(2, 0, '-');
        }
        // Adiciona o caractere 'X' após o 6 caractere
        if (filteredArray.length > 3) {
            filteredArray.splice(4, 0, 'X');
        }
        // Adiciona o caractere 'X' após o 6 caractere
        if (filteredArray.length > 5) {
            filteredArray.splice(6, 0, 'X');
        }
        // Adiciona o caractere 'X' após o 7 caractere
        if (filteredArray.length > 6) {
            filteredArray.splice(8, 0, 'XXXX0');
        }


        value = filteredArray.join('');

        for (let i = 0; i < value.length; i++) {

            (function(index) {
                let updatedValue = value.substr(0, index + 1) + maskedValue.substr(index + 1);
                let maskedHTML = '';

                for (let j = 0; j < updatedValue.length; j++) {
                    maskedHTML += `<span class="animate__animated animate__fadeIn">${updatedValue[j]}</span>`;
                }

                code.innerHTML = maskedHTML;
          })(i);
        }
    }


    //--------------------- Função preenche inputs do popover ---------------------//
    function fillPopoverSelect(id_select){
        let option = document.getElementById(id_select).selectedOptions[0].id
        if (option !== '--') {
            let option_split = option.split('|')
            if (id_select === 'tipo_carga_area') {
                $('#code-area-new-item').val(option_split[0])
                $('#desc-area-new-item').val(option_split[1])
                $('#area-carga-motora').prop('checked', option_split[2].replace('0', '').replace('1', 'checked'))
            } else if (id_select === 'tipo_componente' || id_select === 'tipo_componente_acessorios') {
                $('#code-acess-new-item').val(option_split[0])
                $('#desc-acess-new-item').val(option_split[1])
                $('#acessorio-carga-motora').prop('checked', option_split[2].replace('0', '').replace('1', 'checked'))
            } else if (id_select === 'forma_alim') {
                $('#code-alim-new-item').val(option_split[0])
                $('#desc-alim-new-item').val(option_split[1])
                $('#dependency-alim-new-item').val(option_split[2])
            } else if (id_select === 'tipo_rosca_ligacao_motor' || id_select === 'tipo_rosca_ligacao_acessorios') {
                $('#code-tipo-rosca-ligacao-motor-item').val(option_split[0])
                $('#desc-tipo-rosca-ligacao-motor-item').val(option_split[1])
                $('#dependency-tipo-rosca-ligacao-motor').val(option_split[2])
            } else if (id_select === 'material_acess' || id_select === 'material_acess_acessorios') {
                $('#code-mat-acess-new-item').val(option_split[0])
                $('#desc-mat-acess-new-item').val(option_split[1])
                $('#dependency-mat-acess-new-item').val(option_split[2])
            } else if (id_select === 'componente_ligacao_equip') {
                $('#code-componente_ligacao_equip').val(option_split[0])
                $('#desc-componente_ligacao_equip').val(option_split[1])
                $('#dependency-componente_ligacao_equip').val(option_split[2])
            } else if (id_select === 'tipo_conduite' || id_select === 'tipo_conduite_acessorios') {
                $('#code-tipo-conduite-new-item').val(option_split[0])
                $('#desc-tipo-conduite-new-item').val(option_split[1])
                $('#dependency-tipo-conduite-new-item').val(option_split[2])
            } else if (id_select === 'tipo_rosca' || id_select === 'tipo_rosca_acessorios') {
                $('#code-tipo-rosca-new-item').val(option_split[0])
                $('#desc-tipo-rosca-new-item').val(option_split[1])
                $('#dependency-tipo-rosca-new-item').val(option_split[2])
            }
        }
    }

    //--------------------- Função adiciona novo item ---------------------//
    function EventDropItem(formId,nameForm,evento) {
        let array_data = document.getElementById(formId).querySelectorAll('input[data-type]')
        let values = {};
        let is_invalid_input = ''

        // Armazena o id do campo e ação
        values['id_tabela'] = nameForm
        values['acao'] = evento

        // Percorre o array de inputs
        for (let i = 0; i < array_data.length; i++) {
            let input = array_data[i];

            // Verifica tipo do input
            if (input.type === 'checkbox') {
                values[input.dataset.type] = input.checked // atribui o valor do checked à propriedade data-nome
            } else {
                if (input.value !== '') {
                    // Verifica se contém classe de validação
                    if (input.classList.contains('is-invalid')) {
                        input.classList.remove('is-invalid')
                    }
                    values[input.dataset.type] = input.value; // atribui o valor do input à propriedade data-nome
                } else {
                    input.classList.add('is-invalid')
                }
            }
        }
        // Cria array de inputs que contem classe is-invalid
        is_invalid_input = $.map(array_data, function(element) {return element.classList.contains('is-invalid')});

        // Verifica se possui inputs invalidos no form
        if (is_invalid_input.includes(true)) {
            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            swalAlert(false, 'O formulário apresenta erros! verifique e tente novamente.', 'error', false)
        } else {
            sendValuesToRegister(values)
        }
    }


    //--------------------- Função ajax para cadastrar novos detalhes tipicos ---------------------//
    function sendDict(dict, options, tipo_tipico) {
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        const osnum = getCookie('OS');
        $.ajax({
            url: "/app/eletrica/a1pro/CadastrarTipicosForca/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: {'OSA1PRO': osnum, 'new_item': JSON.stringify(dict)}, // Envia form pela solicitação do POST
            success: function (data) {
                if ('success' in data['message']) {
                    debugger;
                    // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                    let string_erros = ''
                    for (let j=0; j < data['mensagem_erros'].length; j++) {
                        $('.swal2-popup').css('text-align', 'left');
                        string_erros = string_erros + data['mensagem_erros'][j];
                        }
                    if (data['mensagem_erros'].length != 0) {
                        swalAlert(false, string_erros, 'error', false)
                    } else {
                        swalAlert(false, 'Típicos cadastrados com sucesso!', 'success', false)
                    }

                    let lista_tipicos = data['message']['tipicos'].length

                    let new_option = ''
                    for (let i=0; i < lista_tipicos; i++) {
                         console.log(data['message']['tipicos'][i]);
                         let new_option = `<option class="px-2 rounded text-truncate">${data['message']['tipicos'][i]}</option>`
                         let novoItem = data['message']['tipicos'][i];
                         if (tipo_tipico==='equipamento') {
                            if (!document.getElementById('detalhes_tipicos').innerHTML.includes(novoItem)) {
                                document.getElementById('detalhes_tipicos').innerHTML += new_option;
                            }
                         }
                         if (tipo_tipico==='acessorios') {
                            if (!document.getElementById('detalhes_tipicos_acessorios').innerHTML.includes(novoItem)) {
                                document.getElementById('detalhes_tipicos_acessorios').innerHTML += new_option;
                            }
                         }
                    }

                    /*for (let i=0; i < data['message']['tipicos_acessorios'].length; i++) {
                         console.log(data['message']['tipicos_acessorios'][i]);
                         let new_option = `<option class="px-2 rounded text-truncate">${data['message']['tipicos_acessorios'][i]}</option>`
                         document.getElementById('detalhes_tipicos_acessorios').innerHTML += new_option
                    }*/

                    for (let i = 0; i < data['message']['tipicos_acessorios'].length; i++) {
                        let novoItem = data['message']['tipicos_acessorios'][i];
                        if (!document.getElementById('detalhes_tipicos_acessorios').innerHTML.includes(novoItem)) {
                            let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                            document.getElementById('detalhes_tipicos_acessorios').innerHTML += new_option;
                        }
                    }



                    let values_motor =''
                    let listaequips = data['lista_equipamentos']
                    let quant_options = options.length
                    for (var i = 0; i < quant_options; i++) {
                        if (!listaequips.includes(options[i].text)) {
                            values_motor += `<option class="px-2 rounded text-truncate">${options[i].text}</option>`
                            options[i].remove()
                            quant_options = options.length
                            i = i - 1
                        }
                    }

                    /*debugger;
                    let testea = tipo_tipico
                    for (let i=0; i < data['message']['lista_equipamentos_acessorios'].length; i++) {
                         console.log(data['message']['lista_equipamentos_acessorios'][i]);
                         let new_option = `<option class="px-2 rounded text-truncate">${data['message']['lista_equipamentos_acessorios'][i]}</option>`
                         document.getElementById('cargas_select_tipicos-acessorios').innerHTML += new_option
                    }*/

                    for (let i = 0; i < data['message']['lista_equipamentos_acessorios'].length; i++) {
                        let novoItem = data['message']['lista_equipamentos_acessorios'][i];
                        if (!document.getElementById('cargas_select_tipicos-acessorios').innerHTML.includes(novoItem)) {
                            let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                            document.getElementById('cargas_select_tipicos-acessorios').innerHTML += new_option;
                        }
                    }

                    filterOptionTipicos('tipo_carga_area', '1', 'MO', 'tipo_componente')



                    /*document.getElementById('cargas_tipicos').innerHTML += values_motor*/

                } else {
                    // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                    swalAlert(false, data['message']['error'], 'error', false)
                }
            },
            failure: function () {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false)
            }
        })
    }



    //--------------------- Função ajax para cadastrar novo item ---------------------//
    function sendValuesToRegister(dict) {
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            url: "/app/eletrica/a1pro/ControleTipicosForcaControle/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: {'new_item': JSON.stringify(dict)}, // Envia form pela solicitação do POST
            success: function (data) {
                if ('success' in data['message']) {
                    // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                    swalAlert(false, data['message']['success'], 'success', false)
                    setTimeout(()=>{swal.close();window.location.reload();}, 2000)
                } else {
                    // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                    swalAlert(false, data['message']['error'], 'error', false)
                }
            },
            failure: function () {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false)
            }
        })
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



    // --------------------- Exibe modal para confirmar ação ---------------------//
    document.addEventListener("DOMContentLoaded", function() {
    const detalhesTipicos = document.getElementById("detalhes_tipicos");
    const detalhesTipicosAcessorios = document.getElementById("detalhes_tipicos_acessorios");
    const detalhesTipicosSuportes = document.getElementById("detalhes_tipicos_suportes");
    const detalhesTipicosFixacaoInfra = document.getElementById("detalhes_tipicos_fixacao_infra");
    let valorSelecionado = "";
    detalhesTipicos.addEventListener("click", function() {
        const options = detalhesTipicos.selectedOptions;
        valorSelecionado = options[0].text;
        console.log("Valor selecionado:", valorSelecionado);
        debugger;
        ajax_pesquisa_tipico(valorSelecionado, 'equipamento');
    });

    detalhesTipicosAcessorios.addEventListener("click", function() {
        const options = detalhesTipicosAcessorios.selectedOptions;
        valorSelecionado = options[0].text;
        console.log("Valor selecionado:", valorSelecionado);
        ajax_pesquisa_tipico(valorSelecionado, 'acessorios');
    });
    detalhesTipicosSuportes.addEventListener("click", function() {
        const options = detalhesTipicosSuportes.selectedOptions;
        valorSelecionado = options[0].text;
        ajax_pesquisa_suporte(valorSelecionado);
    });

    detalhesTipicosFixacaoInfra.addEventListener("click", function() {
        const options = detalhesTipicosFixacaoInfra.selectedOptions;
        valorSelecionado = options[0].text;
        ajax_pesquisa_fixacao_infra(valorSelecionado);
    });

    });

     function ajax_pesquisa_tipico(tipico, tipo) {
        debugger;
        const osnum = getCookie('OS');
        const area = getCookie('Area');
        $.ajax({
            url: "/app/eletrica/a1pro/CadastrarTipicosForca/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPOTIPICO': tipo, 'TIPICO': tipico},
            success: function(data) {
                /*const testea = data['DIACABO'];
                const testeb = data['CARCACA'];
                const testec = data['QTECABO'];*/
                if (tipo === 'equipamento') {
                //$('#preenchimento_diametro_eletroduto').val(data['DIACABO']);
                //$('#preenchimento_diametro_caixa').val(data['CARCACA']);
                //$('#preenchumento_qte_cabos').val(data['QTECABO']);
                }
                let values_motor ='';
                for (var i=0; i < data['MOTORES'].length; i++) {
                    values_motor += `<option class="px-2 rounded text-truncate">${data['MOTORES'][i]}</option>`
                }
                if (tipo==='equipamento') {
                InfoParaMarkdows('tipo_carga_area', data['AREA']) //2 --
                InfoParaMarkdows('tipo_componente', data['TIPO INSTALACAO']) //3 --
                InfoParaMarkdows('forma_alim', data['POSICAO LIGACAO']) //4 --
                InfoParaMarkdows('tipo_rosca_ligacao_motor', data['TIPO ROSCA']) //5 --
                $('#preenchimento_diametro_eletroduto').val(data['DIACABO']); //6
                InfoParaMarkdows('material_acess', data['COMPONENTE ELETRODUTO']) //7 --
                InfoParaMarkdows('tipo_rosca', data['ROSCA CAIXA']) //8 --
                $('#preenchimento_diametro_caixa').val(data['CARCACA']); //9
                InfoParaMarkdows('componente_ligacao_equip', data['MATERIAL EQUIPAMENTO']); //10 --
                $('#preenchumento_qte_cabos').val(data['QTECABO']); //11

                document.getElementById('cargas_tipicos').innerHTML = values_motor
                }
                if (tipo==='acessorios') {
                $('#area_acessorio').val(data['AREA']); //2
                InfoParaMarkdows('tipo_componente_acessorios', data['TIPO INSTALACAO']) //3 --
                $('#posicao_ligacao_acessorio').val(data['POSICAO LIGACAO']); //4
                InfoParaMarkdows('tipo_rosca_ligacao_acessorios', data['TIPO ROSCA']); //5 --
                $('#diametro_eletr_acessorios').val(data['DIACABO']); //6
                InfoParaMarkdows('material_acess_acessorios', data['COMPONENTE ELETRODUTO']) //7 --
                $('#rosca_caixa_acessorio').val(data['ROSCA CAIXA']); //8
                $('#diametro_furo_caixa_acessorio').val(data['CARCACA']); //9
                $('#mat_componente_acessorio').val(data['MATERIAL EQUIPAMENTO']); //10
                $('#sequencial_numerico_acessorio').val('0'); //11

                document.getElementById('cargas_tipicos-acessorios').innerHTML = values_motor
                }
            },
            error: function (xhr, status, error) {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
            }
        });


    }

    function InfoParaMarkdows(id_markdown, dado) {
        let new_option = `<option class="px-2 rounded text-truncate">${dado}</option>`;
        document.getElementById(id_markdown).innerHTML = new_option;
    }


    function carrega_configuracoes_acessorios() {
        debugger;
        const osnum = getCookie('OS');
        const area = getCookie('Area');
        $.ajax({
            url: "/app/eletrica/a1pro/OpcoesIniciaisConfigsAcessorios/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'AREAA1PRO': area},
            success: function(data) {
                let start_opt = `<option class="px-2 rounded text-truncate">---</option>`;
                document.getElementById('diametro_eletroduto_acessorio').innerHTML = start_opt;
                document.getElementById('diametro_rosca_caixa_acessorio').innerHTML = start_opt;
                document.getElementById('acessorios_os').innerHTML = '';
                for (let i = 0; i < data['DIAMETROS'].length; i++) {
                    let novoItem = data['DIAMETROS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('diametro_eletroduto_acessorio').innerHTML += new_option;
                    document.getElementById('diametro_rosca_caixa_acessorio').innerHTML += new_option;
                }

                for (let i = 0; i < data['LISTA_ACESSORIOS'].length; i++) {
                    let novoItem = data['LISTA_ACESSORIOS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('acessorios_os').innerHTML += new_option;
                }

                Consulta_DiametrosCadastrados(data['ACESSORIOS_CADASTRADOS'])
                }
                //
            },
        );

    }

    function pesquisa_acessorio() {
        const osnum = getCookie('OS');
        const area = getCookie('Area');
        let option = document.getElementById('acessorios_os').selectedOptions
        let tipo_acessorio = option[0].text
        let selectElement = document.getElementById('acessorios_os');

        $.ajax({
            url: "/app/eletrica/a1pro/PesquisaAcessorio/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPO ACESSORIO': tipo_acessorio},
            success: function(data) {
                document.getElementById('descricao_acessorio').value = data['DESCRICAO'];
                document.getElementById('formacao_cabo_acessorio').value = data['FORMACAO'];
                document.getElementById('secao_cabo_acessorio').value = data['SECAO'];
                document.getElementById('classe_cabo_acessorio').value = data['ISOLACAO'];
                document.getElementById('classe_isolacao').value = data['CLASSE ISOLACAO'];
                document.getElementById('diametro_eletroduto_acessorio').value = data['DIAMETRO ELETRODUTO']
                document.getElementById('diametro_rosca_caixa_acessorio').value = data['DIAMETRO CAIXA']
                }
            },
        );

    }

    //--------------------- Função pega o valor do cookie com base no nome ---------------------//
    function PassagemAjax_DeletarTipicos(id_codigo_tipico, id_cargas, osnum, area, lista_opcoes) {
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        const selectElement = document.getElementById(id_codigo_tipico)
        $.ajax({
            type: "DELETE",
            url: "/app/eletrica/a1pro/CadastrarTipicosForca/",
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: JSON.stringify({'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPO TIPICOS': id_codigo_tipico, 'LISTA TIPICOS': lista_opcoes}),
            success: function(data) {

                filterOptionTipicos('tipo_carga_area', '1', 'MO', 'tipo_componente')
                document.getElementById('cargas_tipicos-acessorios').innerHTML = '';
                document.getElementById('cargas_tipicos').innerHTML = '';

                /*for (let i = 0; i < data['motores sem carga'].length; i++) {
                    let novoItem = data['motores sem carga'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById(id_cargas).innerHTML += new_option;
                }
                document.getElementById('cargas_tipicos-acessorios').innerHTML = '';
                document.getElementById('cargas_tipicos').innerHTML = '';

                for (let i = 0; i < data['tipicos deletados'].length; i++) {
                    let itemToRemove = data['tipicos deletados'][i];
                    for (let j = 0; j < selectElement.options.length; j++) {
                        if (selectElement.options[j].text === itemToRemove) {
                            selectElement.remove(j);
                            break;
                        }
                    }
                }

                if (data['tipicos depedente']['RESET'] === true) {
                    document.getElementById('detalhes_tipicos_acessorios').innerHTML = '';
                    for (let i = 0; i < data['tipicos depedente']['LISTA'].length; i++) {
                    let novoItem = data['tipicos depedente']['LISTA'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('detalhes_tipicos_acessorios').innerHTML += new_option;
                    }
                }
                let final_mensagem = '';
                let mensagem_completa = '';
                    if (data['status']==='success') {
                        final_mensagem = data['tipicos deletados'].join(', <br>');
                    }
                    if (data['status']==='error') {
                        final_mensagem = data['tipicos pendentes'].join(', <br>');
                    }
                    var mensagem_final = `${data['mensagem']}`
                swalAlert(false, mensagem_final, data['status'], false)*/
            }
        },
        );
    }


    function FiltroErros_DeletarTipicos(id_codigo_tipico, id_cargas) {
        const osnum = getCookie('OS');
        const area = getCookie('Area');
        let options = document.getElementById(id_codigo_tipico).selectedOptions;
        let lista_opcoes = []
        for (var i=0; i < options.length; i++) {
            lista_opcoes.push(options[i].text);
        }
        if (options.length === 0) {
                swalAlert(false, 'Erro: Nenhum detalhe típico selecionado', 'error', false)
        } else {
            let string_opcoes = lista_opcoes.join(', <br>');
            var text_swal = `<p>Deseja realmente excluir?<br> <b>${string_opcoes}</b> </p>`;

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
                if (value === 'Sim') {
                    PassagemAjax_DeletarTipicos(id_codigo_tipico, id_cargas, osnum, area, lista_opcoes)
                }
            });
        }
    }

    function DeletarTipicos(id_codigo_tipico, id_cargas) {

        FiltroErros_DeletarTipicos(id_codigo_tipico, id_cargas)
    }

    function Consulta_DiametrosCadastrados(listaVerde) {

        //listaVerde = ['RAQ', 'PTC', 'PTC3123'];
        //listaVerde=lista_cadastrados
        const selectElement = document.getElementById('acessorios_os');
        const options = selectElement.options;
        for (let i = 0; i < options.length; i++) {
            if (listaVerde.includes(options[i].text)) {
                options[i].style.color = 'green';
            } else {
                options[i].style.color = 'red';
            }

        }
    }


    function SalvarDiametrosAcessorio() {

        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        const optionsElementAcessorio = document.getElementById('acessorios_os').selectedOptions;
        let selectElementAcessorio;
        if (optionsElementAcessorio.length > 0) {
            selectElementAcessorio = optionsElementAcessorio[0].text;
        } else {
            swalAlert(false, 'Selecione algum acessório para continuar!', 'warning', false)
            return
        }
        const formacao_cabo = document.getElementById('formacao_cabo_acessorio').value;
        if (formacao_cabo==='---') {
            swalAlert(false, 'Acessório não encontrado! Favor cadastrar cabos e regular pendências do acessório.', 'warning', false)
            return
        }
        const DiametroEletroduto = document.getElementById('diametro_eletroduto_acessorio').selectedOptions[0].text;
        const DiametroCaixa = document.getElementById('diametro_rosca_caixa_acessorio').selectedOptions[0].text;
        if (DiametroEletroduto==='---') {
            swalAlert(false, 'Necessário selecionar diâmentro para eletroduto!', 'warning', false)
            return
        }
        if (DiametroCaixa==='---') {
            swalAlert(false, 'Necessário selecionar diâmetro para rosca do motor!', 'warning', false)
            return
        }
        const osnum = getCookie('OS');
        dict = {'OS': osnum, 'ACESSORIO': selectElementAcessorio, 'DIAMETRO ELETRODUTO': DiametroEletroduto, 'DIAMETRO CAIXA': DiametroCaixa}
        $.ajax({
            url: "/app/eletrica/a1pro/OpcoesIniciaisConfigsAcessorios/", // Caminho do Ajax
            type: "POST", // http method
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: {'cadastro_diametros': JSON.stringify(dict)}, // Envia form pela solicitação do POST
            success: function (data) {
                Consulta_DiametrosCadastrados(data['ACESSORIOS_CADASTRADOS'])
                swalAlert(false, data['MENSAGEM'], data['STATUS'], false)
            },
            failure: function () {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false)
            }
        })
    }

    function FecharConfigAcessorios() {
        const selectElement = document.getElementById('acessorios_os');
        const options = selectElement.options;
        let redOptionExists = false;

        for (let i = 0; i < options.length; i++) {
            if (options[i].style.color === 'red') {
                redOptionExists = true;
                break;
            }
        }

        if (redOptionExists) {
            swalAlert(false, 'Erro: Informar diâmetros para todos os acessórios, antes de continuar.\n Ocorrerá erro as cadastrar acessórios sem a conclusão desta etapa!', 'error', false);
        } else {
            $('#testModal').modal('hide');
        }
    }

    function ConsultaMateriais(codigo, descricao, unidade, IdQuantitativo) {
        const codigo_material = document.getElementById(codigo).value;
        //if (codigo_material.length === 8) {
        $.ajax({
            url: "/app/eletrica/a1pro/ConfiguracaoMateriaisForca/",
            method: "GET",
            data: {'ID HTML': codigo, 'CODIGO MATERIAL': codigo_material},
            success: function(data) {
            debugger;
                if (data['STATUS']==='erro') {
                    document.getElementById(IdQuantitativo).setAttribute('hidden', true);
                    updateValidationClass(codigo, false)
                } else {
                    document.getElementById(IdQuantitativo).removeAttribute('hidden');
                    updateValidationClass(codigo, true)
                }
                document.getElementById(descricao).innerHTML = data['DESCRICAO'];

                document.getElementById(unidade).innerHTML = data['UNIDADE'];
            },
            error: function (xhr, status, error) {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
            }
        });
    //}
    }

    function ConsultaQuantitativo(IdQuantitativo) {
    const valor_quantitativo = parseFloat(document.getElementById(IdQuantitativo).value);
    if (!isNaN(valor_quantitativo)) {
        updateValidationClass(IdQuantitativo, true);
    } else {
        updateValidationClass(IdQuantitativo, false);
    }
}


    function updateValidationClass(item, isValid){
    let i = document.getElementById(item);
    if (isValid) {
        i.classList.remove('is-invalid');
        i.classList.add('is-valid');
    } else {
        i.classList.remove('is-valid');
        i.classList.add('is-invalid');
    }
    }

    function InputDadosTabela(data, modal, tabela, valores_validos) {

        const container = document.getElementById(tabela);
        hot = new Handsontable(container, {
            data: data,
            rowHeaders: false,
            colHeaders: false,
            contextMenu: true,
            rowHeights: 40,
            //colWidths: 85,
            colWidths: function(index) {
                // Encontre a largura máxima do conteúdo em cada coluna
                let maxWidth = 100; // Largura mínima inicial da coluna
                for (let i = 0; i < data.length; i++) {
                    // Measure the width of the content in the cell
                    let cellContent = data[i][index]; // Conteúdo da célula na coluna específica
                    let tempElement = document.createElement('div');
                    tempElement.style.position = 'absolute';
                    tempElement.style.visibility = 'hidden';
                    tempElement.style.width = 'auto';
                    tempElement.style.whiteSpace = 'nowrap'; // Evita quebra de linha
                    tempElement.textContent = cellContent;
                    document.body.appendChild(tempElement);
                    maxWidth = Math.max(maxWidth, tempElement.clientWidth);
                    document.body.removeChild(tempElement);
                }

                // Defina a largura da coluna com uma margem mínima
                return maxWidth > 100 ? maxWidth : 100;
            },
            cells: function(row, col, prop) {
                var cellProperties = {};
                if (row === 0 || col === 0) {
                    cellProperties.readOnly = true; // Define células da primeira linha e da primeira coluna como somente leitura
                    cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                    td.style.fontWeight = 'bold'; // Aplica o negrito apenas na primeira linha e na primeira coluna
                    td.style.color = '#4169E1';
                    };
                }

            let teste = valores_validos;
            if (valores_validos.length != 0) {
                cellProperties.type = 'dropdown';
                cellProperties.source = valores_validos;
                cellProperties.strict = true;
                cellProperties.allowInvalid = false; // Não permite valores inválidos
            } else {
            ///////////////////////////////////////////////////

                /*validator: function(value, callback) {
                    const colunaAtual = this.col; // Obtém o índice da coluna atual
                    const colunasNumericas = [2, 3, 4, 5];
                    // Verifica se a coluna atual está na lista de colunas numéricas
                    if (colunasNumericas.includes(colunaAtual)) {
                        // Verifica se o valor é um número (float ou inteiro)
                        if (!isNaN(parseFloat(value)) && isFinite(value)) {
                            // Valor é numérico, pode ser aceito
                            callback(true);
                        } else {
                            // Valor não é numérico, não é aceito
                            callback(false);
                        }
                    } else {
                        // Coluna não está na lista de colunas numéricas, aceita qualquer valor
                        callback(true);
                    }
                }*/
            /////////////////////////////////////////////////
            }

            cellProperties.className = 'htCenter htMiddle';
            return cellProperties;
            }
        });

        // Redimensiona a Handsontable quando o modal é exibido
        $(modal).on('shown.bs.modal', function () {
            hot.render();
        });
    }

   function AtivarTabela() {

        $.ajax({
            url: "/app/eletrica/a1pro/DimensionamentoEletrodutoForca/",
            method: "GET",
            success: function(data) {
                InputDadosTabela(data['lista diametros'], '#CatalogoEletrodutos', 'handsontableContainer', data['lista opcoes'])
            },
            error: function (xhr, status, error) {
                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
            }
        });
    }

    function AtivarTabelaCarcaca() {
    //const DiametroEletroduto = document.getElementById('diametro_eletroduto_acessorio').selectedOptions[0].text;
    let option = document.getElementById('tipo_rosca_tabela').selectedOptions[0].text;
    $.ajax({
        url: "/app/eletrica/a1pro/DimensionamentoCarcacasForca/",
        method: "GET",
        data: {'TIPO ROSCA': option},
        success: function(data) {
            InputDadosTabela(data['lista carcacas'], '#CatalogoCarcacas', 'handsontableContainer1', [])
        },
        error: function (xhr, status, error) {
            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
        }
    });
    }

    function showModal() {
        return new Promise((resolve) => {
            $('#CatalogoCarcacas').modal('show');
            $('#CatalogoCarcacas').on('shown.bs.modal', function () {
                resolve();
            });
        });
    }

    async function CarregaModalTabelaCarcacas() {
        await showModal();
        AtivarTabelaCarcaca();
    }

    function ResetCadastro(aba) {
        if (aba === 'equipamentos') {
            removeDisabledAtribute('tipo_carga_area', 'select_detalhes_tipicos')
            $('#preenchimento_diametro_eletroduto').val('Preenchimento automático'); //6
            $('#preenchimento_diametro_caixa').val('Preenchimento automático'); //9
            $('#preenchumento_qte_cabos').val('Preenchimento automático'); //11
        }
        if (aba === 'acessorios') {
            removeDisabledAtribute('tipo_componente_acessorios', 'select_detalhes_tipicos-acessorios')
            $('#area_acessorio').val('Preenchimento automático'); //2
            $('#posicao_ligacao_acessorio').val('Preenchimento automático'); //4
            $('#diametro_eletr_acessorios').val('Preenchimento automático'); //6
            $('#rosca_caixa_acessorio').val('Preenchimento automático'); //8
            $('#diametro_furo_caixa_acessorio').val('Preenchimento automático'); //9
            $('#mat_componente_acessorio').val('Preenchimento automático'); //10
            $('#sequencial_numerico_acessorio').val('Preenchimento automático'); //11
        }
    }

   function AcaoUpdateTabelaDimencionamento() {
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    extract_tab_eletrodutos = hot.getData();
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DimensionamentoEletrodutoForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'data': JSON.stringify(extract_tab_eletrodutos)},
        success: function(data) {
            swalAlert(false, data['DESCRICAO'], data['STATUS'], false);
        }
    });
   }

   function UpdateTabelaDimencionamento() {

    AlertaConfirmacao(AcaoUpdateTabelaDimencionamento, 'Desejá realmente alterar a tabela de dimencionamento de eletrodutos?');
   }


   function AlertaConfirmacao(acao, text_swal) {
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
                if (value === 'Sim') {
                    acao();
                }
            });
   }

   function UpdateTabelaDimencionamentoCarcacas() {
    AlertaConfirmacao(AcaoUpdateTabelaCarcacas, 'Deseja realmente alterar a tabela de dimencionamento de carcaças?')
   }

   function AcaoUpdateTabelaCarcacas() {
    const filtro = document.getElementById('tipo_rosca_tabela').selectedOptions[0].text;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    extract_tab_carcacas = hot.getData();
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DimensionamentoCarcacasForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'data': JSON.stringify({'TIPO ROSCA': filtro, 'TABELA': extract_tab_carcacas})},
        success: function(data) {
            swalAlert(false, data['DESCRICAO'], data['STATUS'], false);
        }
    });
   }

   function SalvarMateriais() {
        let parametros = ['codigo_eletroduto', 'quantidade_eletroduto',
        'codigo_fixacao_eletroduto', 'quantidade_fixacao_eletroduto',
        'codigo_bucha_acabamento', 'quantidade_bucha_acabamento',
        'codigo_bucha_acabamento', 'quantidade_bucha_reducao',
        'codigo_bucha_reducao', 'quantidade_bucha_reducao',
        'codigo_prensa_cabo', 'quantidade_prensa_cabo',
        'codigo_prensa_cabo_caixa', 'quantidade_prensa_cabo_caixa',
        'codigo_eletroduto_flexivel', 'quantidade_conector_eletrodutos',
        'codigo_conector_eletrodutos', 'codigo_condulete',
        'codigo_luva']

        //let resultado_verificacao = checkValidationClass('codigo_eletroduto');
        let resultado_verificacao = parametros.some(param => !checkValidationClass(param));

        const osnum = getCookie('OS');
        const descricao_area = document.getElementById('area_materiais').selectedOptions[0].text;
        const codigo_eletroduto = document.getElementById('codigo_eletroduto').value;
        const quant_eletroduto = document.getElementById('quantidade_eletroduto').value;
        const codigo_fixacao_eletroduto = document.getElementById('codigo_fixacao_eletroduto').value;
        const quantidade_fixacao_eletroduto = document.getElementById('quantidade_fixacao_eletroduto').value;
        //const selectElement = document.getElementById('materiais_fixacao_leito');
        //const materiaisFixacaoLeito = Array.from(selectElement.options).map(option => option.text);
        //const materiais_fixacao_leito = materiaisFixacaoLeito.map((item, index) => FormacaoDicionarioMateriais(item, index)).filter(item => item !== null);
        const codigo_bucha_acabamento = document.getElementById('codigo_bucha_acabamento').value;
        const quantidade_bucha_acabamento = document.getElementById('quantidade_bucha_acabamento').value;
        const codigo_bucha_reducao = document.getElementById('codigo_bucha_reducao').value;
        const quantidade_bucha_reducao = document.getElementById('quantidade_bucha_reducao').value;
        const codigo_prensa_cabo = document.getElementById('codigo_prensa_cabo').value;
        const quantidade_prensa_cabo = document.getElementById('quantidade_prensa_cabo').value;
        const codigo_prensa_cabo_caixa = document.getElementById('codigo_prensa_cabo_caixa').value;
        const quantidade_prensa_cabo_caixa = document.getElementById('quantidade_prensa_cabo_caixa').value;
        const codigo_eletroduto_flexivel = document.getElementById('codigo_eletroduto_flexivel').value;
        const quantidade_eletroduto_flexivel = document.getElementById('quantidade_eletroduto_flexivel').value;
        const codigo_conector_eletrodutos = document.getElementById('codigo_conector_eletrodutos').value;
        const quantidade_conector_eletrodutos = document.getElementById('quantidade_conector_eletrodutos').value;
        const codigo_condulete = document.getElementById('codigo_condulete').value;
        const codigo_luva = document.getElementById('codigo_luva').value;

        let dicionario = {'OSA1': osnum, 'AREA': descricao_area, 'MATERIAIS':
                        [{'ELETRODUTO': codigo_eletroduto, 'QUANTIDADE': quant_eletroduto},
                         {'FIXACAO ELETRODUTO': codigo_fixacao_eletroduto, 'QUANTIDADE': quantidade_fixacao_eletroduto},
                         {'BUCHA ACABAMENTO': codigo_bucha_acabamento, 'QUANTIDADE': quantidade_bucha_acabamento},
                         {'BUCHA REDUCAO': codigo_bucha_reducao, 'QUANTIDADE': quantidade_bucha_reducao},
                         {'PRENSA CABO': codigo_prensa_cabo, 'QUANTIDADE': quantidade_prensa_cabo},
                         {'PRENSA CABO CAIXA': codigo_prensa_cabo_caixa, 'QUANTIDADE': quantidade_prensa_cabo_caixa},
                         {'ELETRODUTO FLEXIVEL': codigo_eletroduto_flexivel, 'QUANTIDADE': quantidade_eletroduto_flexivel},
                         {'CONECTER ELETRODUTOS': codigo_conector_eletrodutos, 'QUANTIDADE': quantidade_conector_eletrodutos},
                         {'CONDULETE': codigo_condulete},
                         {'LUVA': codigo_luva}]};
        //dicionario['MATERIAIS'] = dicionario['MATERIAIS'].concat(materiais_fixacao_leito);
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        if (resultado_verificacao === true || descricao_area === '---') {
            swalAlert(false, 'Informe materiais válidos para todos os campos!', 'error', false);
            return
        }
        $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/ConfiguracaoMateriaisForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'materiais': JSON.stringify(dicionario)},
        success: function(data) {
            swalAlert(false, data['DESCRICAO'], data['STATUS'], false);
        }
    });
   }

   function CarregaAreaMateriais() {
        const osnum = getCookie('OS');
        $.ajax({
        type: "GET",
        data: {'OS': osnum},
        url: "/app/eletrica/a1pro/CarregaAreaMateriaisForca/",
        success: function(data) {
            let new_option = `<option class="px-2 rounded text-truncate">---</option>`
            document.getElementById('area_materiais').innerHTML = new_option;
            for (let i = 0; i < data['DESCRICOES AREAS'].length; i++) {
                    let novoItem = data['DESCRICOES AREAS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('area_materiais').innerHTML += new_option;
            }
            document.getElementById('copiar_materiais_os').innerHTML = '';
            for (let i = 0; i < data['TODAS OS'].length; i++) {
                    let novoItem = data['TODAS OS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('copiar_materiais_os').innerHTML += new_option;
            }
            CarregaMateriaisArea()
        }

       });
   }

   function checkValidationClass(item) {
    let i = document.getElementById(item);
    if (i.classList.contains('is-valid')) {
        return true;
    } else {
        return false;
    }
    }


    function AddMatFixacaoLeito() {
        const codigo_fixacao_leito = document.getElementById('codigo_fixacao_leito').value;
        const descricao_fixacao_leito = document.getElementById('descricao_fixacao_leito').innerHTML;
        const quantidade_fixacao_leito = document.getElementById('quantidade_fixacao_leito').value;
        let resultado_verificacao_material = checkValidationClass('codigo_fixacao_leito');
        let resultado_verificacao_quantidade = checkValidationClass('quantidade_fixacao_leito');
        if (!resultado_verificacao_material || !resultado_verificacao_quantidade) {
            return
        }

        let novoItem = codigo_fixacao_leito + ' 🡆 ' + descricao_fixacao_leito + ' 🡆 quantidade: ' + quantidade_fixacao_leito;
        //let new_option = `<option class="px-2 rounded text-truncate"><span style="font-weight: bold;">${codigo_fixacao_leito}</span> : ${descricao_fixacao_leito} - QTE: ${quantidade_fixacao_leito}</option>`;

        let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
         //let selectElement = document.getElementById('materiais_fixacao_leito');
         selectElement.insertAdjacentHTML('beforeend', new_option);
        $('#modal_add_material').modal('hide')
    }


    /*function DeletarMaterialFixacao() {
        const materiais_fixacao_leito = document.getElementById('materiais_fixacao_leito').selectedOptions[0].text;
        const selectElement = document.getElementById('materiais_fixacao_leito')
        let itemToRemove = materiais_fixacao_leito;
        for (let j = 0; j < selectElement.options.length; j++) {
            if (selectElement.options[j].text === itemToRemove) {
                selectElement.remove(j);
                break;
            }
        }
    }*/

function FormacaoDicionarioMateriais(str, index) {
    // Usando uma expressão regular para extrair o código e a quantidade
    const regex = /([A-Z0-9]+)\s.*\squantidade:\s(\d+)/i;
    const match = str.match(regex);

    if (match) {
        return {
            [`FIXACAO LEITO ${index + 1}`]: match[1],
            'QUANTIDADE': match[2]
        };
        } else {
            return null;  // Retorna null se a string não estiver no formato esperado
        }
    }


function CarregaMateriaisArea() {
    const osnum = getCookie('OS');
    const area_materiais = document.getElementById('area_materiais').selectedOptions[0].text;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

    //document.getElementById('materiais_fixacao_leito').innerHTML = '';
    document.getElementById('codigo_eletroduto').value='';
    document.getElementById('codigo_fixacao_eletroduto').value='';
    document.getElementById('codigo_bucha_acabamento').value='';
    document.getElementById('codigo_bucha_reducao').value='';
    document.getElementById('codigo_prensa_cabo').value='';
    document.getElementById('codigo_prensa_cabo_caixa').value='';
    document.getElementById('codigo_eletroduto_flexivel').value='';
    document.getElementById('codigo_conector_eletrodutos').value='';
    document.getElementById('codigo_condulete').value='';
    document.getElementById('codigo_luva').value='';

    document.getElementById('descricao_eletroduto').innerHTML='';
    document.getElementById('descricao_fixacao_eletroduto').innerHTML='';
    document.getElementById('descricao_bucha_acabamento').innerHTML='';
    document.getElementById('descricao_bucha_reducao').innerHTML='';
    document.getElementById('descricao_prensa_cabo').innerHTML='';
    document.getElementById('descricao_prensa_cabo_caixa').innerHTML='';
    document.getElementById('descricao_eletroduto_flexivel').innerHTML='';
    document.getElementById('descricao_conector_eletrodutos').innerHTML='';
    document.getElementById('descricao_condulete').innerHTML='';
    document.getElementById('descricao_luva').innerHTML='';

    document.getElementById('quantitativo_eletroduto').setAttribute('hidden', true);
    document.getElementById('quantitativo_fixacao_eletroduto').setAttribute('hidden', true);
    document.getElementById('quantitativo_bucha_acabamento').setAttribute('hidden', true);
    document.getElementById('quantitativo_bucha_reducao').setAttribute('hidden', true);
    document.getElementById('quantitativo_prensa_cabo').setAttribute('hidden', true);
    document.getElementById('quantitativo_prensa_cabo_caixa').setAttribute('hidden', true);
    document.getElementById('quantitativo_eletroduto_flexivel').setAttribute('hidden', true);
    document.getElementById('quantitativo_conector_eletrodutos').setAttribute('hidden', true);
    document.getElementById('quantitativo_condulete').setAttribute('hidden', true);
    document.getElementById('quantitativo_luva').setAttribute('hidden', true);

    removeValidationClass('codigo_eletroduto');
    removeValidationClass('codigo_fixacao_eletroduto');
    removeValidationClass('codigo_bucha_acabamento');
    removeValidationClass('codigo_bucha_reducao');
    removeValidationClass('codigo_prensa_cabo');
    removeValidationClass('codigo_prensa_cabo_caixa');
    removeValidationClass('codigo_eletroduto_flexivel');
    removeValidationClass('codigo_conector_eletrodutos');
    removeValidationClass('codigo_condulete');
    removeValidationClass('codigo_luva');

    let dicionario = {'OS': osnum, 'DESCRICAO AREA': area_materiais}
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/CarregaAreaMateriaisForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'new_item': JSON.stringify(dicionario)},
        success: function(data) {
            //document.getElementById('area_materiais').innerHTML = '---';
            for (let key in data[area_materiais]) {
                /*if (key === 'materiais_fixacao_leito') {
                    for (let i = 0; i < data[area_materiais][key].length; i++) {

                        let novoItem = data[area_materiais][key][i];
                        let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                        document.getElementById('materiais_fixacao_leito').innerHTML += new_option;
                        document.getElementById(IdQuantitativo).removeAttribute('hidden');
                    }
                } else {*/
                    if (key.startsWith("quantidade")) {
                        IdQuantitativo = key.replace("quantidade", "quantitativo");
                        document.getElementById(IdQuantitativo).removeAttribute('hidden');
                        debugger;
                        document.getElementById(key).value = data[area_materiais][key];
                        ConsultaQuantitativo(key)
                    //} else if (key.startsWith("unidade")){
                    //    document.getElementById(key).value = data[area_materiais][key];
                    } else {
                        IdQuantitativo = key.replace("codigo", "quantitativo");
                        IdDescricao = key.replace("codigo", "descricao");
                        document.getElementById(key).value = data[area_materiais][key];
                        IdUnidade = key.replace('codigo', 'unidade')
                        ConsultaMateriais(key, IdDescricao, IdUnidade, IdQuantitativo)
                    }
                //}
            }
        }
       });
}



function removeValidationClass(item) {
    let i = document.getElementById(item);
    if (i) {
        i.classList.remove('is-valid', 'is-invalid');
    }
}

function CopiaMateriaisOS() {
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const osnum = getCookie('OS');
    const copiar_materiais_os = document.getElementById('copiar_materiais_os').selectedOptions[0].text;
    let dicionario = {'OS ATUAL': osnum, 'OS PARA COPIAR': copiar_materiais_os}
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/CopiaOsMateriaisForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'os': JSON.stringify(dicionario)},
        success: function(data) {
            swalAlert(false, data['DESCRICAO'], data['STATUS'], false);
            $('#modal_config_mat_fc').modal('hide');
        }

    });
}

function AlterarFabricanteCabo() {
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const osnum = getCookie('OS');
    const fabricante_cabo_equipamento = document.getElementById('fabricante_cabo_equipamento').selectedOptions[0].text;
    const fabricante_cabo_acessorio = document.getElementById('fabricante_cabo_acessorio').selectedOptions[0].text;
    let dicionario = {'OS': osnum, 'FABRICANTE CABO EQUIPAMENTO': fabricante_cabo_equipamento, 'FABRICANTE CABO ACESSORIO': fabricante_cabo_acessorio}
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/FabricanteCaboForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'fabricante': JSON.stringify(dicionario)},
        success: function(data) {
            swalAlert(false, 'Fabricantes salvos com sucesso!', 'success', false);
            $('#CatalogoCabos').modal('hide');
        }

    });
}


function CarregaFabricantesCabo() {
    const osnum = getCookie('OS');
    const fabricante_cabo_equipamento = document.getElementById('fabricante_cabo_equipamento').selectedOptions[0].text;

    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/FabricanteCaboForca/",
        data: {'OS': osnum},
        success: function(data) {

            document.getElementById('fabricante_cabo_equipamento').value=data['FABRICANTE CABO EQUIPAMENTO'];
            document.getElementById('fabricante_cabo_acessorio').value=data['FABRICANTE CABO ACESSORIO'];
        }

    });
}



function getImgDwg(codigo_tipico) {
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/GetImgSuportesTipicosForca/",
        data: {'CODIGO TIPICO': codigo_tipico},
        success: function(data) {
        debugger;
            if (data['tipo']==='SUPORTE') {
            document.getElementById('img_dwg_suporte_fc').src = `data:image/png;base64,${data['dwg']}`
            }
            if (data['tipo']==='FIXACAO') {
            document.getElementById('img_dwg_fixacao_infra_fc').src = `data:image/png;base64,${data['dwg']}`
            }
        }

    });
}

function CadastraSuporte() {
    const osnum = getCookie('OS');
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    //cargas_select_tipicos-suportes
    //template_select
    const options = document.getElementById('cargas_select_tipicos-suportes').selectedOptions
    const templateSelecionado = document.getElementById('template_select').selectedOptions[0].text;
    let quant_options = options.length
    var tagmotores = []
     for (var i = 0; i < quant_options; i++) {
        tagmotores.push(options[i].text);
     }

     dicionario = {'OSA1PRO': osnum ,'TAG MOTORES': tagmotores, 'TEMPLATE SUPORTE': templateSelecionado}

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DwgsSuportesTipicosForca/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'dict_request': JSON.stringify(dicionario)},
        success: function(data) {
            document.getElementById('descricao_eletroduto').innerHTML+=data['TIPICO SUPORTE'];
            CarregaDwgsSuportes()
            swalAlert(false, data['message']['MENSAGEM'], data['message']['STATUS'], false)
        }

    });
}


    function DeletaSuporte() {
    const osnum = getCookie('OS');
    const area = getCookie('Area');


    const options = document.getElementById('detalhes_tipicos_suportes').selectedOptions
    let quant_options = options.length
    var codigo_suportes = []
     for (var i = 0; i < quant_options; i++) {
        codigo_suportes.push(options[i].text);
     }

    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            type: "DELETE",
            url: "/app/eletrica/a1pro/DwgsSuportesTipicosForca/",
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: JSON.stringify({'OSA1PRO': osnum, 'AREAA1PRO': area, 'CODIGO SUPORTES': codigo_suportes}),
            success: function(data) {
                CarregaDwgsSuportes()
            }
        },
        );
    }


    function StartDelSuporte() {
        AlertaConfirmacao(DeletaSuporte, "Deseja realmente deletar os suportes selecionados?")
    }

    function ajax_pesquisa_suporte(valorSelecionado) {
            const osnum = getCookie('OS');
            const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
            const area = getCookie('Area');


             dicionario = {'OSA1PRO': osnum , 'AREAA1PRO': area ,'SUPORTE': valorSelecionado}

            $.ajax({
                type: "POST",
                url: "/app/eletrica/a1pro/GetImgSuportesTipicosForca/",
                headers:{'X-CSRFToken':csrf},
                dataType: "json",
                data: {'dict_request': JSON.stringify(dicionario)},
                success: function(data) {
                    document.getElementById('cargas_tipicos-suportes').innerHTML='';
                    let values_motor ='';
                    for (var i=0; i < data['MOTORES'].length; i++) {
                        values_motor += `<option class="px-2 rounded text-truncate">${data['MOTORES'][i]}</option>`
                    }
                    document.getElementById('cargas_tipicos-suportes').innerHTML+=values_motor;

                }

            });
    }

    function AddFixacaoUsuario() {
    const options = document.getElementById('template_select_fixacao_infra').selectedOptions
        let quant_options = options.length
        var codigo_suportes = []
         for (var i = 0; i < quant_options; i++) {
            codigo_suportes.push(options[i].text);
         }
         AddFixacao(codigo_suportes)
    }


    function AddFixacao(codigo_suportes) {
        //document.getElementById('tipicos_selecionados_fixacao_infra').innerHTML='';
        let quant_options = codigo_suportes.length
            for (var i = 0; i < quant_options; i++) {
                var templateHTML = `
                                    <div class="d-flex justify-content-between position-relative"
                                         style="padding-right: 30px;"
                                         onmouseover="showButton(this)"
                                         onmouseout="hideButton(this)">
                                        <div class="form-group flex-grow-1">
                                            <input type="text" id="tipico_${codigo_suportes[i]}" value="${codigo_suportes[i]}" class="form-control border-left-0 text-secondary" style="font-size: 11px;">
                                        </div>

                                        <div class="form-group ml-4" style="width: 95px; position: relative;">
                                            <input type="text" class="form-control border-left-0 text-secondary"
                                                    id="porcentagem_${codigo_suportes[i]}"
                                                   style="padding-right: 25px; font-size: 11px;"
                                                   oninput="InputPorcentagem(this.value, 'quantidade_${codigo_suportes[i]}')">
                                            <span style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); color: #6c757d;">%</span>
                                        </div>

                                        <div class="form-group ml-4" style="width: 95px;">
                                            <input type="text" class="form-control border-left-0 text-secondary" id="quantidade_${codigo_suportes[i]}" readonly style="font-size: 11px;">
                                        </div>

                                        <!-- Botão de remoção -->
                                        <button title="Remover arquivo"
                                                class="btn btn-outline-danger rounded-circle border-0 position-absolute"
                                                style="width: 35px; height: 35px; display: none; justify-content: center; align-items: center; right: 0;"
                                                type="button"
                                                onclick="removeItem(this)">
                                            <i class="fas fa-times-circle fa-xs"></i>
                                        </button>
                                    </div>
                                `;



                                document.getElementById('tipicos_selecionados_fixacao_infra').insertAdjacentHTML('beforeend', templateHTML);

            }

    }



function InputPorcentagem(porcentagem, box_quantidade_real) {
    quantidade_total = document.getElementById('quantidade_pecas').value;
    quantidade = Math.ceil(parseFloat(porcentagem) * parseFloat(quantidade_total) / 100)
    document.getElementById(box_quantidade_real).value = quantidade;
}


function showButton(container) {
    var button = container.querySelector('button');
    if (button) {
        button.style.display = 'flex'; // Exibe o botão
    }
}

// Função para esconder o botão
function hideButton(container) {
    var button = container.querySelector('button');
    if (button) {
        button.style.display = 'none'; // Oculta o botão
    }
}

function removeItem(button) {
        var container = button.closest('.d-flex');
        container.remove(); // Remove o contêiner
    }

function SelecionarDiametroFixacaoInfra() {
    const diametro_selecionado = document.getElementById('cargas_select_tipicos-fixacao_infra').selectedOptions[0].text;
    const osnum = getCookie('OS');
    const areanum = getCookie('Area');
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/CadastroFixacaoInfraTipicosForca/",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': areanum, 'DIAMETRO SELECIONADO': diametro_selecionado},
        success: function(data) {
            debugger;
            document.getElementById('comprimento_total').value = data['comprimento']
            if (data['erros'].length != 0) {
                let mensagem_erro = data['erros'].join('');
                swalAlert(false, mensagem_erro, 'error', false);
            }
            document.getElementById('template_select_fixacao_infra').innerHTML='';
            for (var i = 0; i < data['lista_tipicos_fixacao'].length; i++) {
                var id_template = data['lista_tipicos_fixacao'][i].id_template;
                var nome_template = data['lista_tipicos_fixacao'][i].nome_template;

                // Cria uma opção para cada template
                var templateHTML = `
                    <option value="${id_template}" title="${nome_template}" onclick="getImgDwg('${nome_template}')">
                        ${nome_template}
                    </option>
                `;

                document.getElementById('template_select_fixacao_infra').insertAdjacentHTML('beforeend', templateHTML);
                document.getElementById('tipicos_selecionados_fixacao_infra').innerHTML = '';

        }
        }
    });
    CalculaQteTotalPecas();
}

function CalculaQteTotalPecas() {
    const distancia_suportes = document.getElementById('distancia_suportes').value;
    const comprimento_total = document.getElementById('comprimento_total').value;
    var quantidade_total_pecas = Math.ceil(comprimento_total / distancia_suportes);
    document.getElementById('quantidade_pecas').value = quantidade_total_pecas
}

function ExtraiTipicosFixacaoInfra() {
    var container = document.getElementById("tipicos_selecionados_fixacao_infra");

    if (container) {
        // Seleciona todos os inputs dentro do container
        var inputs = container.querySelectorAll('input');

        // Lista para armazenar os dicionários
        var listaDados = [];

        // Objeto temporário para armazenar pares tipico-quantidade
        var tempData = {};
        debugger;
        inputs.forEach(function(input) {
            // Verifica se o ID começa com 'tipico_' e armazena o valor temporariamente
            if (input.id.startsWith('tipico_')) {
                tempData[input.id] = { tipico: input.value, quantidade: null };
            }
            // Verifica se o ID começa com 'quantidade_' e tenta associar ao correspondente 'tipico_'
            if (input.id.startsWith('quantidade_')) {
                var tipicoId = input.id.replace('quantidade_', 'tipico_');
                if (tempData[tipicoId]) {
                    tempData[tipicoId].quantidade = input.value;
                }
            }
        });

        // Converte o objeto tempData para uma lista de dicionários
        for (var key in tempData) {
            listaDados.push(tempData[key]);
        }

        // Exibe a lista de dicionários no console
        return listaDados
}
}

function SalvarFixacaoInfra() {
    var dicionarios_tipicos = []
    dicionarios_tipicos = ExtraiTipicosFixacaoInfra()
    const diametro_selecionado = document.getElementById('cargas_select_tipicos-fixacao_infra').value;
    const comprimento_total = document.getElementById('comprimento_total').value;
    const distancia_suportes = document.getElementById('distancia_suportes').value;
    const osnum = getCookie('OS');
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    dict_request = {'OSA1PRO': osnum, 'DIAMETRO': diametro_selecionado, 'COMPRIMENTO TOTAL': comprimento_total, 'DISTANCIA SUPORTES': distancia_suportes, 'INFORMACOES TIPICOS': dicionarios_tipicos}
    $.ajax({
                type: "POST",
                url: "/app/eletrica/a1pro/CadastroFixacaoInfraTipicosForca/",
                headers:{'X-CSRFToken':csrf},
                dataType: "json",
                data: {'dict_request': JSON.stringify(dict_request)},
                success: function(data) {
                    CarregaDwgsFixacaoInfra()
                    swalAlert(false, data['message']['MENSAGEM'], data['message']['STATUS'], false)

                }

            });

}

function StartDelFixacaoInfra() {
    AlertaConfirmacao(DeletaFixacaoInfra, "Deseja realmente deletar os típicos selecionados?")
}

function DeletaFixacaoInfra() {

    const options = document.getElementById('detalhes_tipicos_fixacao_infra').selectedOptions
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    let quant_options = options.length
    var codigo_suportes = []
     for (var i = 0; i < quant_options; i++) {
        codigo_suportes.push(options[i].text);
     }

    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            type: "DELETE",
            url: "/app/eletrica/a1pro/CadastroFixacaoInfraTipicosForca/",
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: JSON.stringify({'OSA1PRO': osnum, 'AREAA1PRO': area, 'CODIGO FIXACAO INFRA': codigo_suportes}),
            success: function(data) {
                CarregaDwgsFixacaoInfra()
            }
        },
        );
}


function InfosFixacaoInfra() {
    const tipico_selecionado = document.getElementById('cargas_select_tipicos-fixacao_infra').selectedOptions[0].text;
    const osnum = getCookie('OS');
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/InfosFixacaoInfraTipicosForca/",
        data: {'OSA1PRO': osnum, 'TIPICO': tipico_selecionado},
        success: function(data) {
            debugger;
        }

    });
}

function ajax_pesquisa_fixacao_infra(valorSelecionado) {
        const osnum = getCookie('OS');
        const area = getCookie('Area');
        $.ajax({
            url: "/app/eletrica/a1pro/InfosFixacaoInfraTipicosForca/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'AREAA1PRO': area, 'TIPICO': valorSelecionado},
            success: function(data) {
                let new_option = '';
                for (var i = 0; i < data['lista_motores'].length; i++) {
                    new_option += `<option class="px-2 rounded text-truncate">${data['lista_motores'][i]}</option>`
                }

                document.getElementById('cargas_tipicos-fixacao_infra').innerHTML = new_option;
                document.getElementById('comprimento_total').value = data['comprimento_total'];
                document.getElementById('distancia_suportes').value = data['distancia_suportes'];
                document.getElementById('quantidade_pecas').value = data['quantidade_pecas'];
                document.getElementById('tipicos_selecionados_fixacao_infra').innerHTML = '';
                AddFixacao([data['tipico']])
                debugger;
                let tipico = data['tipico']
                var IdQuantidade = 'quantidade_' + tipico
                var IdPorcentagem = 'porcentagem_' + tipico
                document.getElementById(IdQuantidade).value = data['quantidade'];
                document.getElementById(IdPorcentagem).value = data['porcentagem'];
                }
                //
            },
        );

}

function SalvarTipoDerivacao() {
    debugger;
    const osnum = getCookie('OS');
    const selectedOption = document.querySelector('input[name="options"]:checked').value;
    dict_request = {'OSA1PRO': osnum, 'TIPO DERIVACAO': selectedOption}
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    $.ajax({
                type: "POST",
                url: "/app/eletrica/a1pro/ControleTipicosDerivacao/",
                headers:{'X-CSRFToken':csrf},
                dataType: "json",
                data: {'dict_request': JSON.stringify(dict_request)},
                success: function(data) {
                    swalAlert(false, data['message'], data['status'], false)

                }

    });
}


function SelecionarEspecificacao() {
    const osnum = getCookie('OS');
    const tipo_acessorio = document.getElementById('tipo_acessorio').selectedOptions[0].text;
    document.getElementById('especificacao_acessorio').innerHTML = '';
    document.getElementById('tipo_rosca_acessorio_eletr').innerHTML = '';
    $.ajax({
            url: "/app/eletrica/a1pro/ConduletesForcaControle/",
            method: "GET",
            data: {'OSA1PRO': osnum, 'TIPO ACESSORIO': tipo_acessorio},
            success: function(data) {
                    for (let i = 0; i < data['OPCOES HABILITADAS'].length; i++) {
                    let novoItem = data['OPCOES HABILITADAS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('especificacao_acessorio').innerHTML += new_option;
                    }
                    for (let i = 0; i < data['ROSCAS DISPONIVEIS'].length; i++) {
                    let novoItem = data['ROSCAS DISPONIVEIS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('tipo_rosca_acessorio_eletr').innerHTML += new_option;
                    }
                }
                //
            },
        );
}

function SalvaAcessorioEletroduto() {
    const osnum = getCookie('OS');
    const tipo_acessorio = document.getElementById('tipo_acessorio').selectedOptions[0].text;
    const especificacao_acessorio = document.getElementById('especificacao_acessorio').selectedOptions[0].text;
    const porcentagem_acessorio = document.getElementById('porcentagem_acessorio').value;
    const tipo_rosca_acessorio_eletr = document.getElementById('tipo_rosca_acessorio_eletr').selectedOptions[0].text;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    let dict_request = {'OSA1PRO': osnum, 'TIPO ACESSORIO': tipo_acessorio, 'ESPECIFICACAO': especificacao_acessorio, 'PORCENTAGEM': porcentagem_acessorio, 'TIPO ROSCA': tipo_rosca_acessorio_eletr}
    $.ajax({
                type: "POST",
                url: "/app/eletrica/a1pro/ConduletesForcaControle/",
                headers:{'X-CSRFToken':csrf},
                dataType: "json",
                data: {'dict_request': JSON.stringify(dict_request)},
                success: function(data) {
                    CarregaAcessoriosEletrodutos()
                    //swalAlert(false, data['message'], 'success', false)

                }

    });
}

function CarregaAcessoriosEletrodutos() {
    document.getElementById('acessorios_eletrodutos_cadastrados').innerHTML='';
    const osnum = getCookie('OS');
    $.ajax({
            url: "/app/eletrica/a1pro/CarregaAcessoriosEletrForca/",
            method: "GET",
            data: {'OSA1PRO': osnum},
            success: function(data) {
            debugger;
                for (var i = 0; i < data['lista_cadastrados'].length; i++) {
                    var templateHTML = `
                                    <div class="d-flex justify-content-between position-relative"
                                         onmouseover="this.querySelector('button').style.display = 'flex';"
                                         onmouseout="this.querySelector('button').style.display = 'none';">

                                        <div class="form-group ml-4">
                                            <input type="text" class="form-control border-left-0 text-secondary" value="${data['lista_cadastrados'][i]}" id="card_${i}" readonly style="font-size: 11px;">
                                        </div>

                                        <!-- Botão de remoção -->
                                        <button title="Remover arquivo"
                                                class="btn btn-outline-danger rounded-circle border-0 position-absolute"
                                                style="width: 35px; height: 35px; display: none; justify-content: center; align-items: center; right: 0;"
                                                type="button"
                                                onclick="DeletaAcessorioEletroduto('card_${i}'); removeItem(this)">
                                            <i class="fas fa-times-circle fa-xs"></i>
                                        </button>
                                    </div>
                                `;



                    document.getElementById('acessorios_eletrodutos_cadastrados').insertAdjacentHTML('beforeend', templateHTML);

                }
            }
                //

        });

}

function DeletaAcessorioEletroduto(id_acessorio_cadastrado) {
    const osnum = getCookie('OS');
    const acessorio_cadastrado = document.getElementById(id_acessorio_cadastrado).value;

    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            type: "DELETE",
            url: "/app/eletrica/a1pro/ConduletesForcaControle/",
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: JSON.stringify({'OSA1PRO': osnum, 'ACESSORIO CADASTRADO': acessorio_cadastrado}),
            success: function(data) {

            }
        },
        );
}


function GerarMateriaisEletrodutos() {
    var forms = new FormData();
    $('#modal_acessorios_eletroduto').modal('hide');
    debugger;
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const osnum = getCookie('OS');
    let dict_request = {'OSA1PRO': osnum}
    forms.append('dict_request', JSON.stringify(dict_request));
    $.ajax({
        url: "/app/eletrica/a1pro/CarregaAcessoriosEletrForca/",
        type: "POST", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: forms, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            InitProgressGerarTipicos(data['task_id'])
        },
        failure: function () {
                alert('Algo deu errado! verifique e tente novamente.')
            }
    });

}

/*function InitProgressGerenciarTipicos(task_id){
    var progressUrl = `/celery-progress/${task_id}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
          onSuccess: customSucess,
          onError: customError,
          onProgress: customProgress,
        })

        function customSucess(progressBarElement, progressBarMessageElement, result){
            progressBarElement.style.backgroundColor = '#76ce60';
            setTimeout(HideModalLoadCelery, 8000)
            SwitchAlertGt(result)
            document.querySelectorAll('.swal-button.swal-button--confirm')[0].onclick = FecharModalReturnDeleteTemplate
        }

        function customError(progressBarElement, progressBarMessageElement, excMessage){
            progressBarElement.style.backgroundColor = '#dc4f63';
            progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
            + progressUrl;
            setTimeout(HideModalLoadCelery, 8000)
        }

        function customProgress(progressBarElement, progressBarMessageElement, progress){
            progressBarElement.style.backgroundColor = '#68a9ef';
            progressBarElement.style.width = progress.percent + "%";
            var description = progress.description || "";
            progressBarMessageElement.innerHTML = description
        }
}*/


function CarregaDescidaDerivacoes() {
    const osnum = getCookie('OS');
    $.ajax({
            url: "/app/eletrica/a1pro/ControleTipicosDerivacao/",
            method: "GET",
            data: {'OSA1PRO': osnum},
            success: function(data) {
                    if (data['posicao'] === 'Por cima') {
                        document.getElementById('derivacao_por_cima').checked = true;
                    } else if (data['posicao'] === 'Por baixo') {
                        document.getElementById('derivacao_por_baixo').checked = true;
                    }
                }
                //
            },
        );
}

