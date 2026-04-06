$(document).ready(function() {
    // Sua função JavaScript aqui
    debugger;
    CabecalhosCadastrados();
});




let formFileLstMat = new FormData();



function limit_string(string = '') {
    if(string.length > 15)
        return string.substring(0, 10) + '...'
    else
        return string
}

jQuery(document).ready(function($) {

    document.getElementById('lst_mat_table_de_para').addEventListener('paste', function(event) {
      var clipboardData = event.clipboardData || window.clipboardData;
      var pastedText = clipboardData.getData('text');
      TransformPasteInTable(pastedText)
    });

    $('#dropzone_xlsx_capa').on('dragover', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).addClass('upload-hover-blue');
    })

    $('#dropzone_xlsx_capa').on('drop', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
      debugger;
      let files = event_2.originalEvent.dataTransfer//.files;
      console.log(files)
      // A função abaixo altera o conteudo do campo dropdown
      DropFileInLstMatRevit('dropzone_xlsx_capa', 'arquivo_xlsx_lst_mat', 'FileCapa', files, 0)
    })

    $('#dropzone_xlsx_capa').on('dragleave', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
    })



    $('#dropzone_xlsx_template').on('dragover', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).addClass('upload-hover-blue');
    })

    $('#dropzone_xlsx_template').on('drop', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
      let files = event_2.originalEvent.dataTransfer;
      // A função abaixo altera o conteudo do campo dropdown
      DropFileInLstMatRevit('dropzone_xlsx_template', 'uploaded-file-template', 'FileTemplate', files, 0)
    })

    $('#dropzone_xlsx_template').on('dragleave', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
    })

//////////////////////////////////////////////////////////////////////////////////////////////////////
    $('#dropzone_xlsx_revit').on('dragover', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).addClass('upload-hover-blue');
    })

    $('#dropzone_xlsx_revit').on('drop', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
      let files = event_2.originalEvent.dataTransfer;
      // A função abaixo altera o conteudo do campo dropdown
      DropFileInLstMatRevit('dropzone_xlsx_revit', files, 'FileRevit', files, 0)
    })

    $('#dropzone_xlsx_revit').on('dragleave', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
    })
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

    $('#dropzone_dwg_lst_mat').on('dragover', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).addClass('upload-hover-blue');
    })

    $('#dropzone_dwg_lst_mat').on('drop', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
      let files = event_2.originalEvent.dataTransfer;
      // A função abaixo altera o conteudo do campo dropdown
      DropFileInLstMatRevit('dropzone_dwg_lst_mat', 'arquivo_dwg_lst_mat', 'FilesDWG', files, 2)
    })

    $('#dropzone_dwg_lst_mat').on('dragleave', function(event_2) {
      event_2.preventDefault();
      event_2.stopPropagation();
      $(this).removeClass('upload-hover-blue');
    })
});



function SendFileLstMatRevit() {
    const numClienteCheckbox = document.getElementById('num_client_lst_mat').checked;
    const numFornecedorCheckbox = document.getElementById('cod_forn_lst_mat').checked;
    numero_fornecedor = document.getElementById('cabecalhos_salvos').selectedOptions[0].text;
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    if (numero_fornecedor==='Novo Documento') {
        swalAlert(false, 'Favor selecionar documento!', 'error', false);
        return
    }
    if (!formFileLstMat.has('FileTemplate')) {
        swalAlert(false, 'Selecionar template o antes de continuar!', 'error', false);
        return
    }
    dict_request = {'CHECKBOX CLIENTE': numClienteCheckbox, 'CHECKBOX FORNECEDOR': numFornecedorCheckbox, 'NUMERO FORNECEDOR': numero_fornecedor}
    formFileLstMat.append('dict_request', JSON.stringify(dict_request))
    $.ajax({
        url: "/app/eletrica/a1pro/ListaMateriaisPeloRevit/", // Caminho do Ajax
        type: "POST", // http method
        enctype: 'multipart/form-data',
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: formFileLstMat, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            $('#modal_load_celery').modal('show')
            InitProgressGerarTipicos(data['task_id'])
        },
        failure: function () {

        }
    })
}

function DeleFileXlsxLstMat(btn_del, fileName) {
    debugger;
    // Remover o elemento HTML associado ao arquivo
    btn_del.parentElement.parentElement.remove();

    // Criar uma nova instância de FormData e manter apenas os arquivos que não correspondem ao que será deletado
    const newFormFileLstMat = new FormData();
    formFileLstMat.forEach((file, key) => {
        if (file.name !== fileName) {
            newFormFileLstMat.append(key, file);
        }
    });

    // Substituir o antigo FormData pelo novo
    formFileLstMat = newFormFileLstMat;
}




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


function SalvarCabecalho() {

    let numero_fornecedor = document.getElementById('numero_fornecedor').value
    let revisao_fornecedor = document.getElementById('revisao_fornecedor').value
    let numero_cliente = document.getElementById('numero_cliente').value
    let revisao_cliente = document.getElementById('revisao_cliente').value
    if (numero_fornecedor==='Novo Documento') {
        return
    }
    dict_request = {'NUMERO FORNECEDOR': numero_fornecedor, 'REVISAO FORNECEDOR': revisao_fornecedor, 'NUMERO CLIENTE': numero_cliente, 'REVISAO CLIENTE': revisao_cliente}
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
        url: "/app/eletrica/a1pro/CabecalhoListaRevit/", // Caminho do Ajax
        type: "POST", // http method
        headers:{'X-CSRFToken':csrftoken},
        dataType: "json",
        data: {'dict_request': JSON.stringify(dict_request)},
        success: function (data) {
            $('#dadosDocumentoModal').modal('hide');
            swalAlert(false, data['message'], data['status'], false)
            CabecalhosCadastrados();
        },
        failure: function () {

        }
    })
}


function CabecalhosCadastrados() {
    document.getElementById('cabecalhos_salvos').innerHTML = `<option class="px-2 rounded text-truncate">Novo Documento</option>`;
    $.ajax({
        url: "/app/eletrica/a1pro/CabecalhoListaRevit/",
        method: "GET",
        success: function(data) {
                for (let i = 0; i < data['CABECALHO SALVOS'].length; i++) {
                    let novoItem = data['CABECALHO SALVOS'][i];
                    let new_option = `<option class="px-2 rounded text-truncate">${novoItem}</option>`;
                    document.getElementById('cabecalhos_salvos').innerHTML += new_option;
                }
            },
        error: function (xhr, status, error) {
            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            swalAlert(false, 'Algo deu errado ao buscar códigos! verifique e tente novamente.', 'error', false);
        }
    });


}


function AberturaModalCabecalho() {
    document.getElementById('numero_fornecedor').value = '';
    document.getElementById('revisao_fornecedor').value = '';
    document.getElementById('numero_cliente').value = '';
    document.getElementById('revisao_cliente').value = '';
    restaurarCorOriginal()
    numero_fornecedor = document.getElementById('cabecalhos_salvos').selectedOptions[0].text;
    if (numero_fornecedor != 'Novo Documento') {
        document.getElementById('numero_fornecedor').value = numero_fornecedor;
        pintarDeAzul()
        PesquisaCabecalho()
    }
}


function PesquisaCabecalho() {
    debugger;
    restaurarCorOriginal()
    let numero_fornecedor = document.getElementById('cabecalhos_salvos').selectedOptions[0].text;
    $.ajax({
        url: "/app/eletrica/a1pro/PesquisaCadastroRevit/",
        method: "GET",
        data: {'NUMERO FORNECEDOR': numero_fornecedor},
        success: function(data) {
                document.getElementById('revisao_fornecedor').value = data['REVISAO FORNECEDOR'];
                document.getElementById('numero_cliente').value = data['NUMERO CLIENTE'];
                document.getElementById('revisao_cliente').value = data['REVISAO CLIENTE'];
                pintarDeAzul()
            },
    });
}


// Função para pintar de azul, bloquear edição, e atualizar o botão
function pintarDeAzul() {
    const input = document.getElementById('numero_fornecedor');
    const button = document.getElementById('botaoSalvar');
    const deleteButton = document.getElementById('botaoDeletar');

    if (input && button && deleteButton) {
        input.style.backgroundColor = 'lightblue'; // Define a cor de fundo como azul-claro
        input.setAttribute('readonly', true); // Bloqueia a edição

        button.classList.remove('btn-success'); // Remove a classe verde
        button.classList.add('btn-primary'); // Adiciona a classe azul
        button.textContent = 'Alterar'; // Altera o texto do botão

        deleteButton.removeAttribute('hidden'); // Remove o atributo 'hidden' do botão Excluir
    }
}

// Função para devolver a cor original, liberar edição, e atualizar o botão
function restaurarCorOriginal() {
    debugger;
    const input = document.getElementById('numero_fornecedor');
    const button = document.getElementById('botaoSalvar');
    const deleteButton = document.getElementById('botaoDeletar');

    if (input && button && deleteButton) {
        input.style.backgroundColor = ''; // Restaura para a cor padrão
        input.removeAttribute('readonly'); // Libera a edição

        button.classList.remove('btn-primary'); // Remove a classe azul
        button.classList.add('btn-success'); // Adiciona a classe verde
        button.textContent = 'Salvar'; // Altera o texto do botão

        deleteButton.setAttribute('hidden', true); // Adiciona o atributo 'hidden' ao botão Excluir
    }
}



function DeletarCabecalho() {
    const numero_fornecedor = document.getElementById('numero_fornecedor').value;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        $.ajax({
            type: "DELETE",
            url: "/app/eletrica/a1pro/CabecalhoListaRevit/",
            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: JSON.stringify({'NUMERO FORNECEDOR': numero_fornecedor}),
            success: function(data) {
                $('#dadosDocumentoModal').modal('hide');
                swalAlert(false, data['message'], data['status'], false)
                CabecalhosCadastrados();
            }
        },
        );
}