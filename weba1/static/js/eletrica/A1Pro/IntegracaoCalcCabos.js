var hot;

$(document).ready(function() {
    ComparaCabos();
});

function ComparaCabos() {
    const osnum = getCookie('OS');
    const area = getCookie('Area');
    $.ajax({
        type: "GET",
        data: {'OSA1PRO': osnum, 'AREAA1PRO': area},
        url: "/app/eletrica/a1pro/ComparaA1ProCalcCabos/",
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
        //container.style.height = (window.innerHeight * 0.5) + 'px'; // Ajuste conforme necessário
        //container.style.overflow = 'auto'; // Habilita a barra de rolagem

        container.style.height = '800px'; // Define uma altura fixa
        //container.style.overflow = 'hidden'; // Permite rolagem

        // Adicione a PerfectScrollbar após inicializar a tabela

        // Formata os dados do backend para a tabela
        const formattedData = Object.keys(dados).map(tag => [
            tag,
            dados[tag]['STATUS CALC CABOS'] ? '✓' : '✗',
            dados[tag]['CORRENTE CALC CABOS'] || '',
            dados[tag]['DISTÂNCIA CALC CABOS'] || '',
            dados[tag]['TIPO PARTIDA CALC CABOS'] || '',
            dados[tag]['SECAO CALC CABOS'] || '',
            dados[tag]['STATUS A1PRO'] ? '✓' : '✗',
            dados[tag]['CORRENTE A1PRO'] || '',
            dados[tag]['DISTÂNCIA A1PRO'] || '',
            dados[tag]['TIPO PARTIDA A1PRO'] || '',
            dados[tag]['SECAO A1PRO'] || '',
            dados[tag]['DIFERENCAS ADICIONAIS'] || '',
        ]);

        // Adiciona a primeira linha com os títulos "COMOS" e "A1PRO" mesclados
        const headers = [
            ['', 'CALCULADORA DE CABOS', '', '', '', '', 'A1PRO', '', '', '', '', ''],
            ['TAG MOTOR', 'STATUS', 'CORRENTE', 'DISTÂNCIA', 'TIPO DE PARTIDA', 'SEÇÃO DO CABO', 'STATUS', 'CORRENTE', 'DISTÂNCIA', 'TIPO DE PARTIDA', 'SEÇÃO DO CABO', 'DIFERENÇAS ADICIONAIS']
        ];

        // Configura a tabela com Handsontable
        hot = new Handsontable(container, {
        data: [...headers, ...formattedData],
        rowHeaders: false,
        colHeaders: false,
        fixedRowsTop: 2, // Congela as 2 primeiras linhas
        className: 'htCenter htMiddle',
        mergeCells: [
            {row: 0, col: 1, rowspan: 1, colspan: 5}, // Mescla B até F
            {row: 0, col: 6, rowspan: 1, colspan: 5}, // Mescla G até J
            {row: 1, col: 12, rowspan: 2, colspan: 1},
        ],
        colWidths: [100, 50, 50, 50, 50, 50, 50, 50, 50, 50, 50, 100], // Definindo largura para as colunas
        height: container.clientHeight, // Define a altura da tabela
        rowHeights: 30, // Define uma altura fixa para todas as linhas
        manualRowResize: false, // Desativa redimensionamento de altura
        className: 'no-wrap', // Adiciona classe personalizada para evitar quebra
        stretchH: 'all', // Garante que as colunas se ajustem
        width: '90%', // Garantir que a tabela ocupe 100% da largura disponível
        cells: function (row, col, prop) {
            const cellProperties = {};

            if (row === 0) {
                cellProperties.renderer = firstRowRenderer;
            } else if (row === 1) {
                cellProperties.renderer = headerRenderer;
                cellProperties.fontSize = '5px';
            } else if (col === 1 || col === 6) {
                cellProperties.renderer = statusRenderer;
            } else if (col === 2 || col === 3 || col === 4 || col === 5 || col === 7 || col === 8 || col === 9|| col === 10) {
                cellProperties.renderer = compareRenderer;
            } else if (col === 0) {
                cellProperties.renderer = rowRenderer;
            } /*else if (row >= 2) { // A partir da terceira linha
                if (col === 1 || col === 6) {
                    cellProperties.renderer = statusRenderer;
                } else {
                    cellProperties.renderer = noWrapRenderer; // Renderer padrão para as células
                }
            }*/

            return cellProperties;
        },
        /*new PerfectScrollbar(container, {
            wheelSpeed: 2,
            wheelPropagation: true,
            minScrollbarLength: 20
        });*/
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
        td.style.fontSize = '12px'
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function rowRenderer(instance, td, row, col, prop, value, cellProperties){
        td.style.textAlign = 'center';
        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

    function noWrapRenderer(instance, td, row, col, prop, value, cellProperties) {
        td.style.whiteSpace = 'nowrap'; // Impede a quebra de texto
        td.style.overflow = 'hidden'; // Oculta o texto que exceder a largura da célula
        td.style.textOverflow = 'ellipsis'; // Adiciona reticências para texto truncado
        td.style.textAlign = 'center'; // Alinha o texto ao centro
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

        const a1proCorrente = formattedData[row - 2][2];
        const a1proDistancia = formattedData[row - 2][3];
        const a1proTipopartida = formattedData[row - 2][4];
        const a1proSecaocabo = formattedData[row - 2][5];
        const calccabosCorrente = formattedData[row - 2][7];
        const calccabosDistancia = formattedData[row - 2][8];
        const calccabosTipopartida = formattedData[row - 2][9];
        const calccabosSecaocabo = formattedData[row - 2][10];
        const statusCALCCABOS = formattedData[row - 2][1];
        const statusA1PRO = formattedData[row - 2][6];


        if ((col === 2 || col === 3 || col === 4 || col === 5) && statusCALCCABOS === '✗') {
            td.style.backgroundColor = 'red';
        }
        if ((col === 7 || col === 8 || col === 9 || col === 10) && statusA1PRO === '✗') {
            td.style.backgroundColor = 'red';
        }

        if ((col === 2 || col === 3 || col === 4 || col === 5) && statusCALCCABOS === '✓') {
            td.style.backgroundColor = 'lightgreen';
        }

        if ((col === 7 || col === 8 || col === 9 || col === 10) && statusA1PRO === '✓') {
            td.style.backgroundColor = 'lightgreen';
        }

        if (col === 2 || col === 7) {
            if (a1proCorrente != calccabosCorrente && calccabosCorrente != '' && a1proCorrente != '') {
                td.style.backgroundColor = 'yellow';
            }
        }
        if (col === 3 || col === 8) {
            if (a1proDistancia != calccabosDistancia && a1proDistancia != '' && calccabosDistancia != '') {
                td.style.backgroundColor = 'yellow';
            }
        }
        if (col === 4 || col === 9) {
            if (calccabosTipopartida != a1proTipopartida && a1proTipopartida != '' && calccabosTipopartida != '') {
                td.style.backgroundColor = 'yellow';
            }
        }
        if (col === 5 || col === 10) {
            if (a1proSecaocabo != calccabosSecaocabo && a1proSecaocabo != '' && calccabosSecaocabo != '') {
                td.style.backgroundColor = 'yellow';
            }
        }

        Handsontable.renderers.TextRenderer.apply(this, arguments);
    }
}


// Ajusta o tamanho da tabela quando o modal for mostrado
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.content-gerar-tipicos-doc'); // Contêiner desejado
    const tabelaContainer = document.getElementById('tabela-container'); // Elemento da tabela dentro do contêiner

    // Define o tamanho da tabela dentro do contêiner
    function ajustarTabela() {
        const alturaDisponivel = container.clientHeight * 0.8; // Ajuste a proporção conforme necessário
        tabelaContainer.style.height = alturaDisponivel + 'px';

        // Atualiza as configurações da tabela Handsontable
        hot.updateSettings({
            height: tabelaContainer.clientHeight
        });
    }

    // Ajusta a tabela quando a página é carregada
    ajustarTabela();

    // Ajusta a tabela ao redimensionar a janela
    window.addEventListener('resize', ajustarTabela);
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

