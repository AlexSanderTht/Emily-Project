var hot;
    function printBornes(){
        if ($(`#pro-os`).val() == 'none'){
            return alert("Por favor selecione uma OS!")
        }

        let osnum = $(`#pro-os`).val();
        $('#cadastrobornes').modal('show')
        var options='';
        $.ajax({
              type: "GET",
              data: {'OSA1PRO': osnum},
              url: "/app/eletrica/a1pro/ExibeFuncoesDiagramaInterligacao/",
              success: function (data){
                  //document.getElementById('funcao_bornes').innerHTML = `<option class="px-2 rounded text-truncate">---</option>`;
                  document.getElementById('funcao_bornes').innerHTML = '<option id="--" value="--" disabled selected>---</option>';
                  for (let i = 0; i < data['FUNCOES'].length; i++) {
                       let novoItem = data['FUNCOES'][i];
                       let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                       document.getElementById('funcao_bornes').innerHTML += new_option;
                  }
                  RemoveTabela()
                  InputDadosTabela([['ORIGEM', 'ORIGEM' , 'ORIGEM', 'DESTINO', 'DESTINO' , 'DESTINO'], ['RÉGUA', 'BORNES' , 'VEIAS', 'RÉGUA', 'BORNES' , 'VEIAS'], ['', '' , '', '', '' , ''], ['', '' , '', '', '' , ''], ['', '' , '', '', '' , '']], '#cadastrobornes', 'handsontableContainer6', [])
                  //var data = [["", "Ford", "Volvo", "Toyota", "Honda"], ["2020", 10, 11, 12, 13], ["2021", 20, 11, 14, 13], ["2022", 30, 15, 12, 13]];
                  //InputDadosTabela(data, '#cadastrobornes', 'handsontableContainer6', []);
              },
              /*failure: function(error){
              console.log("erro")
                  alert("erro")

              },*/
        })

        //return options
    }


    function InputDadosTabela(data, modal, tabela, valores_validos) {
    const container = document.getElementById(tabela);
    hot = new Handsontable(container, {
        data: data,
        rowHeaders: false,
        colHeaders: false,
        mergeCells: [
            {row: 0, col: 0, rowspan: 1, colspan: 3}, // Mescla as células A1 a C1
            {row: 0, col: 3, rowspan: 1, colspan: 3},  // Mescla as células D1 a F1
        ],
        contextMenu: {
            items: {
                'row_above': {},
                'row_below': {},
                'remove_row': {},
                '---------': {},  // Separador
                'undo': {},
                'redo': {}
            }
        },
        rowHeights: 40,
        colWidths: function(index) {
            let maxWidth = 100; // Largura mínima inicial da coluna
            for (let i = 0; i < data.length; i++) {
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
            return maxWidth > 100 ? maxWidth : 100;
        },
        cells: function(row, col, prop) {
            var cellProperties = {};

            if (row === 0) {
                cellProperties.readOnly = true; // Define a primeira linha como somente leitura
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                    td.style.fontWeight = 'bold'; // Aplica negrito
                    td.style.color = '#4169E1'; // Aplica cor
                };
            }
            if (row === 1) {
                cellProperties.readOnly = true; // Define a primeira linha como somente leitura
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                    td.style.fontWeight = 'bold'; // Aplica negrito
                };
            }
            /*if (col === 2) { // Se for a coluna C (índice 2), aplica a borda direita mais grossa
                cellProperties.renderer = function(instance, td, row, col, prop, value, cellProperties) {
                    Handsontable.renderers.TextRenderer.apply(this, arguments);
                    td.style.borderRight = '3px solid black'; // Define a borda direita mais grossa
                };
            }*/

            if (valores_validos.length != 0) {
                cellProperties.type = 'dropdown';
                cellProperties.source = valores_validos;
                cellProperties.strict = true;
                cellProperties.allowInvalid = false; // Não permite valores inválidos
            }

            cellProperties.className = 'htCenter htMiddle';

            return cellProperties;
        },

        beforeRemoveRow: function(index, amount) {
            // Impede a remoção das duas primeiras linhas
            if (index < 2) {
                return false; // Cancela a remoção
            }
        }
    });

    // Redimensiona a Handsontable quando o modal é exibido
    $(modal).on('shown.bs.modal', function () {
        hot.render();
    });

}

function SalvarBornes() {

    const osnum = getCookie('OS');
    let funcao = document.getElementById('funcao_bornes').selectedOptions[0].text;
    if (funcao === '---') {
        swalAlert(false, 'Selecione alguma função para continuar!', 'error', false);
        return
    }

    let tabela = hot.getData();
    debugger;
    formacao_selecionada = document.getElementById('formacao_selecionada').selectedOptions[0].text;

    if (formacao_selecionada === '---') {
        formacao_selecionada = document.getElementById('formacao_funcao').value;
        if (formacao_selecionada === '---') {
            swalAlert(false, 'Selecione a formação do cabo para continuar!', 'error', false);
            return
        }
    }
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    dicionario_bornes = {'OSA1PRO': osnum, 'FUNCAO': funcao, 'FORMACAO': formacao_selecionada, 'TABELA': tabela}
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/ExibeFuncoesDiagramaInterligacao/",
        headers:{'X-CSRFToken':csrf},
        dataType: "json",
        data: {'data': JSON.stringify(dicionario_bornes)},
        success: function(data) {
            swalAlert(false, data['MESSAGE'], data['STATUS'], false);
        }
    });
}

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


    function CarregaInfosBornes() {
        debugger;
        //document.getElementById('box_formacao_selecionada').setAttribute('hidden', 'true');
        const osnum = getCookie('OS');
        let funcao = document.getElementById('funcao_bornes').value;
        let opcoes_formacao = '---';
        let formacao_selecionada = document.getElementById('formacao_selecionada');
        box_formacao_selecionada=document.getElementById('box_formacao_selecionada')
        // Verifica se o formacao_selecionada ou seu elemento pai está oculto
        //if (formacao_selecionada && !formacao_selecionada.closest('.row').hidden) {
        if (formacao_selecionada && !box_formacao_selecionada.hidden) {
            if (formacao_selecionada.selectedOptions.length > 0) {
                opcoes_formacao = formacao_selecionada.selectedOptions[0].text;
            }
        }

        $.ajax({
              type: "GET",
              data: {'OSA1PRO': osnum, 'FUNCAO': funcao, 'FORMACAO SELECIONADA': opcoes_formacao},
              url: "/app/eletrica/a1pro/InfosBorneDiagramaInterligacao/",
              success: function (data){
                  document.getElementById('descricao_funcao').value = data['DESCRICAO'];
                  document.getElementById('formacao_funcao').value = data['FORMACAO'];
                  RemoveTabela()
                  InputDadosTabela(data['TABELA'], '#cadastrobornes', 'handsontableContainer6', [])

                  if (data['POSSIBILIDADES'].length != 0) {

                    document.getElementById('formacao_selecionada').innerHTML='<option id="--" value="--" disabled selected>---</option>';
                    document.getElementById('box_formacao_selecionada').removeAttribute('hidden');
                    for (let i = 0; i < data['POSSIBILIDADES'].length; i++) {
                       let novoItem = data['POSSIBILIDADES'][i];
                       let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                       document.getElementById('formacao_selecionada').innerHTML += new_option;
                    }
                  } /*else {
                    document.getElementById('formacao_selecionada').value === '---'
                    document.getElementById('box_formacao_selecionada').setAttribute('hidden', 'true');

                  }*/
              },
        })
    }

    function ProximaFuncao() {
        document.getElementById('formacao_selecionada').innerHTML='<option id="--" value="--" disabled selected>---</option>';
        document.getElementById('box_formacao_selecionada').setAttribute('hidden', 'true');

    }


    function RemoveTabela() {
        if (hot) {
            hot.destroy(); // Remove a instância do Handsontable
            hot = null; // Limpa a variável
        }
    }