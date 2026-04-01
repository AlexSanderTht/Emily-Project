function ComparaClasseSelecionada() {
debugger;
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    $.ajax({
        type: "GET",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': area},
        url: "/app/eletrica/a1pro/ComparaClassesIntegracaoComos/",
        success: function (data){
                // aqui ele deve acessar uma função que adiciona a tabela

                adicionarTabela(data)
            },
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


function adicionarTabela(dados) {
    const container = document.getElementById('tabela-container');
    container.style.height = (window.innerHeight * 0.5) + 'px'; // Ajuste conforme necessário
    // Formata os dados do backend para a tabela
    const formattedData = Object.keys(dados).map(tag => [
        tag,
        dados[tag]['STATUS COMOS'] ? '✓' : '✗',
        dados[tag]['AREA COMOS'] || '',
        dados[tag]['POTÊNCIA COMOS'] || '',
        dados[tag]['VELOCIDADE COMOS'] || '',
        dados[tag]['STATUS A1PRO'] ? '✓' : '✗',
        dados[tag]['AREA A1PRO'] || '',
        dados[tag]['POTÊNCIA A1PRO'] || '',
        dados[tag]['VELOCIDADE A1PRO'] || '',
        dados[tag]['STATUS POSICAO'] || ''
    ]);

    // Adiciona a primeira linha com os títulos "COMOS" e "A1PRO" mesclados
    const headers = [
        ['', 'COMOS', '', '', '', 'A1PRO', '', '', '', 'A1PRO x 3D'],
        ['TAG MOTOR', 'STATUS', 'AREA', 'POTÊNCIA', 'VELOCIDADE', 'STATUS', 'AREA', 'POTÊNCIA', 'VELOCIDADE', 'COMPARAÇÃO POSIÇÕES']
    ];

    // Configura a tabela com Handsontable
    const hot = new Handsontable(container, {
        data: [...headers, ...formattedData],
        rowHeaders: false,
        colHeaders: false,
        fixedRowsTop: 2,
        mergeCells: [
            {row: 0, col: 1, rowspan: 1, colspan: 4},
            {row: 0, col: 5, rowspan: 1, colspan: 4},
        ],
        //td.style.textAlign = 'center';
        colWidths: [150, 100, 100, 100, 100, 100, 100, 100, 100, 150],
        height: container.clientHeight, // Define a altura da tabela
        stretchH: 'all',
        className: 'htCenter htMiddle',
        cells: function (row, col, prop) {
            const cellProperties = {};

            if (row === 0) {
                cellProperties.renderer = firstRowRenderer;
            } else if (row === 1) {
                cellProperties.renderer = headerRenderer;
            } else if (col === 1 || col === 5) {
                cellProperties.renderer = statusRenderer;
            } else if (col === 2 || col === 3 || col === 4 || col === 6 || col === 7 || col === 8) {
                cellProperties.renderer = compareRenderer;
            } else if (col === 0) {
                cellProperties.renderer = rowRenderer;
            }

            return cellProperties;
        },
    });

    function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.style.fontWeight = 'bold';
        td.style.textAlign = 'center';
        td.style.backgroundColor = '#f0f0f0';
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function headerRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.style.fontWeight = 'bold';
        td.style.textAlign = 'center';
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function rowRenderer(instance, td, row, col, prop, value, cellProperties){
        td.style.textAlign = 'center';
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function statusRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.style.textAlign = 'center';
        if (value === '✓') {
            td.style.backgroundColor = 'lightgreen';
        } else if (value === '✗') {
            td.style.backgroundColor = 'red';
        }
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function compareRenderer(instance, td, row, col, prop, value, cellProperties) {
        const comosArea = formattedData[row - 2][2];
        const comosPotencia = formattedData[row - 2][3];
        const comosVelocidade = formattedData[row - 2][4];
        const a1proArea = formattedData[row - 2][6];
        const a1proPotencia = formattedData[row - 2][7];
        const a1proVelocidade = formattedData[row - 2][8];
        const statusCOMOS = formattedData[row - 2][1];
        const statusA1PRO = formattedData[row - 2][5];


        if ((col === 2 || col === 3 || col === 4) && statusCOMOS === '✗') {
            td.style.backgroundColor = 'red';
        }
        if ((col === 6 || col === 7 || col === 8) && statusA1PRO === '✗') {
            td.style.backgroundColor = 'red';
        }

        if ((col === 2 || col === 3 || col === 4) && statusCOMOS === '✓') {
            td.style.backgroundColor = 'lightgreen';
        }

        if ((col === 6 || col === 7 || col === 8) && statusA1PRO === '✓') {
            td.style.backgroundColor = 'lightgreen';
        }

        if (col === 2 || col === 6) {
            if (comosArea != a1proArea && comosArea != '' && a1proArea != '') {
                td.style.backgroundColor = 'yellow';
            }
        }
        if (col === 3 || col === 7) {
            if (comosPotencia != a1proPotencia && comosPotencia != '' && a1proPotencia != '') {
                td.style.backgroundColor = 'yellow';
            }
        }
        if (col === 4 || col === 8) {
            if (comosVelocidade != a1proVelocidade && comosPotencia != '' && a1proPotencia != '') {
                td.style.backgroundColor = 'yellow';
            }
        }

        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
}


// Ajusta o tamanho da tabela quando o modal for mostrado
$('#meuModal').on('shown.bs.modal', function () {
    const container = document.getElementById('tabela-container');
    // Define o tamanho do contêiner com base na altura do modal
    container.style.height = (window.innerHeight * 0.5) + 'px'; // Ajuste conforme necessário

    // Re-renderiza a tabela Handsontable
    hot.updateSettings({
        height: container.clientHeight
    });
});

// Ajusta o tamanho da tabela ao redimensionar a janela
window.addEventListener('resize', function () {
    const container = document.getElementById('tabela-container');
    container.style.height = (window.innerHeight * 0.5) + 'px'; // Ajuste conforme necessário

    // Re-renderiza a tabela Handsontable
    hot.updateSettings({
        height: container.clientHeight
    });
});


function ExportaParaComos() {
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    const dict_request = {'OSA1PRO': osnum, 'AREA': area}
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/IntegracaoComos/",
        dataType: 'json',
        data: {'dict_request': JSON.stringify(dict_request)},
        success: function (data) {
                swalAlert(false, data['MESSAGE'], data['STATUS'], false)
            },
        });
    }

    // --------------------- Alert para notificar usuario ---------------------//
    function swalAlert(titulo, texto, icone_img, btn) {
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


function AtualizaPosicoesCargas() {
    debugger;
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    const dict_request = {'OSA1PRO': osnum, 'AREA': area}
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken},
        url: "/app/eletrica/a1pro/AtualizaPosicoesA1ProComos/",
        dataType: 'json',
        data: {'dict_request': JSON.stringify(dict_request)},
        success: function (data) {
                swalAlert(false, data['MESSAGE'], data['STATUS'], false)
            },
        });
}