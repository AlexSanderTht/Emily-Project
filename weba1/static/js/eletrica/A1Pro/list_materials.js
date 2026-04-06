// ======================================================================================================
// Lista de Materiais - Gerenciamento de Upload e Processamento de Arquivos
// ======================================================================================================

// -------------------------------------------------------------------------------------------------------
// Variáveis Globais e Registry de Arquivos
// -------------------------------------------------------------------------------------------------------
(function() {
    'use strict';

    // Variáveis globais para FormData
    window.formFile = new FormData();
    window.formFileCompare = new FormData();
    window.id_task_pdf = null;

    // Registry para mapear id -> { file, form, field }
    window._fileRegistry = new Map();
    
    window._fileRegistryAdd = function(id, file, formName, fieldName) {
        window._fileRegistry.set(id, {file: file, form: formName, field: fieldName});
    };
    
    window._fileRegistryRemove = function(id) {
        window._fileRegistry.delete(id);
        window._fileRegistryRebuild();
    };
    
    window._fileRegistryRebuild = function() {
        // Reconstrói os FormData globais a partir do registry
        window.formFile = new FormData();
        window.formFileCompare = new FormData();
        try { 
            window.formFileLstMat = window.formFileLstMat || new FormData(); 
        } catch(e) { 
            window.formFileLstMat = new FormData(); 
        }
        
        for(const [k, v] of window._fileRegistry.entries()) {
            if(!v || !v.file) continue;
            if(v.form === 'formFile') window.formFile.append(v.field, v.file);
            else if(v.form === 'formFileCompare') window.formFileCompare.append(v.field, v.file);
            else if(v.form === 'formFileLstMat') window.formFileLstMat.append(v.field, v.file);
        }
    };
})();

// -------------------------------------------------------------------------------------------------------
// Controle de Interface: Comparação de Revisões
// -------------------------------------------------------------------------------------------------------
window.ComparaRevTipico = function(id) {
    if (id === 'button_compare_rev') {
        document.getElementById('button_drop_file').classList.remove('butof');
        document.getElementById('button_drop_file').classList.remove('btn-outline-light');
        document.getElementById('button_compare_rev').classList.remove('btn-outline-secondary');
        document.getElementById('button_drop_file').classList.add('btn-outline-secondary');
        document.getElementById('button_compare_rev').classList.add('butof');
        document.getElementById('button_compare_rev').classList.add('btn-outline-light');
        document.getElementById('checkbox_config').classList.add('animate__fadeOut');
        document.getElementById('button_send_values_tip').classList.add('animate__fadeOut');
        document.getElementById('checkbox_config').classList.remove('animate__fadeIn');
        document.getElementById('content_select_rev').classList.remove('animate__fadeOut');
        document.getElementById('button_send_values_tip').classList.remove('animate__fadeIn');
        document.getElementById('drop-area-dwg').classList.add('animate__fadeOut');
        document.getElementById('drop-area-xlsx').classList.add('animate__fadeOut');
        setTimeout(() => {
            document.getElementById('form_dropzone').hidden = true;
            document.getElementById('form_dropzone_compare_rev').hidden = false;
            document.getElementById('button_send_values_tip').hidden = true;
            document.getElementById('button_send_values_tip_compare').hidden = false;
            document.getElementById('checkbox_config').hidden = true;
            document.getElementById('content_select_rev').hidden = false;
        }, 1500);
    } else {
        document.getElementById('button_drop_file').classList.remove('btn-outline-secondary');
        document.getElementById('button_compare_rev').classList.remove('butof');
        document.getElementById('button_compare_rev').classList.remove('btn-outline-light');
        document.getElementById('button_drop_file').classList.add('butof');
        document.getElementById('button_drop_file').classList.add('btn-outline-light');
        document.getElementById('button_compare_rev').classList.add('btn-outline-secondary');
        document.getElementById('checkbox_config').classList.remove('animate__fadeOut');
        document.getElementById('content_select_rev').classList.remove('animate__fadeIn');
        document.getElementById('button_send_values_tip').classList.remove('animate__fadeOut');
        document.getElementById('checkbox_config').classList.add('animate__fadeIn');
        document.getElementById('button_send_values_tip').classList.add('animate__fadeIn');
        document.getElementById('drop-area-dwg').classList.remove('animate__fadeOut');
        document.getElementById('drop-area-xlsx').classList.remove('animate__fadeOut');
        setTimeout(() => {
            document.getElementById('form_dropzone').hidden = false;
            document.getElementById('form_dropzone_compare_rev').hidden = true;
            document.getElementById('button_send_values_tip').hidden = false;
            document.getElementById('button_send_values_tip_compare').hidden = true;
            document.getElementById('checkbox_config').hidden = false;
            document.getElementById('content_select_rev').hidden = true;
        }, 1500);
    }
};

// --------------------- Função trata os dados para fazer o Ajax ---------------------//
function SendValuesCompare() {
    let drop_prev = document.getElementById('drop-area-xlsx-rev-0');
    let drop_next = document.getElementById('drop-area-xlsx-rev-next');
    let rev_next = document.getElementById('rev_next').value;
    let dict_rev = {'rev_next': rev_next}
    const name_file_previous = drop_prev.children[drop_prev.children.length-1].title;
    const name_file_next = drop_next.children[drop_next.children.length-1].title;

    if(rev_next !== 'a'){
        // Verifica se oa campos foram preenchidos
        if (drop_prev.childElementCount === 2 && drop_next.childElementCount === 2) {
            formFileCompare.append('Dict_Rev', JSON.stringify(dict_rev));
            formFileCompare.append('File_rev_0', name_file_previous);
            formFileCompare.append('File_rev_next', name_file_next);
            formFileCompare.append('Campo','Compare');
            // Envia dados para função que executa o Ajax
            AjaxDocs(formFileCompare)
        } else {// Caso não seja preenchido, será exibido modal de alerta
            swal({
                text: 'Selecione os arquivos Rev. anterior e posterior para enviar.',
                icon: "error",
                button: 'Fechar'
            })
            $('div.swal-modal').addClass('bordas')
            $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
            $('div.swal-text').addClass('text-center')
            $('div.swal-footer').addClass('d-flex justify-content-center')
        }
    }
    else{
        swal({
            text: 'Selecione o número da revisão!!.',
            icon: "error",
            button: 'Fechar'
        })
        $('div.swal-modal').addClass('bordas')
        $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
        $('div.swal-text').addClass('text-center')
        $('div.swal-footer').addClass('d-flex justify-content-center')
    }

}

// --------------------- Função trata os dados para fazer o Ajax ---------------------//
function SendValuesToDownload() {
    // Tenta usar um único drop
    // Prioriza o painel de exibição `#drop-list-multi` quando presente
    let dropListMulti = document.getElementById('drop-list-multi');
    let containerMulti = document.getElementById('drop-area-multi');
    let dwgArea = document.getElementById('drop-area-dwg');
    let xlsxArea = document.getElementById('drop-area-xlsx');

    // coleta elementos que podem conter o nome do arquivo
    let nodes = [];
    if (dropListMulti) {
        nodes = Array.from(dropListMulti.querySelectorAll('*'));
    } else if (containerMulti) {
        nodes = Array.from(containerMulti.querySelectorAll('*'));
    } else {
        if (dwgArea) nodes = nodes.concat(Array.from(dwgArea.querySelectorAll('*')));
        if (xlsxArea) nodes = nodes.concat(Array.from(xlsxArea.querySelectorAll('*')));
    }

    let filenamesDWG = [];
    let filenamesXLSX = [];
    let list_id_file = [];

    nodes.forEach(el => {
        // prioriza atributo title, senão usa innerText
        let name = el.getAttribute && el.getAttribute('title') ? el.getAttribute('title') : (el.innerText || el.textContent || '').trim();
        if (!name) return;
        // extrai extensão
        let parts = name.split('.');
        if (parts.length < 2) return;
        let ext = parts[parts.length - 1].toLowerCase();
        if (ext === 'dwg') {
            filenamesDWG.push(name);
            list_id_file.push(name);
        } else if (ext === 'xlsx' || ext === 'xls') {
            filenamesXLSX.push(name);
        }
    });

    // remove duplicados
    filenamesDWG = [...new Set(filenamesDWG)];
    filenamesXLSX = [...new Set(filenamesXLSX)];
    list_id_file = [...new Set(list_id_file)];

    // flags 
    let num_cliente = document.getElementById('num_cliente').checked;
    let cod_fornece = document.getElementById('cod_fornece').checked;
    let dict_check = {'num_cliente': num_cliente, 'cod_fornecedor': cod_fornece};

    // valida presença de pelo menos 1 DWG e 1 XLSX
    if (filenamesDWG.length > 0 || filenamesXLSX.length > 0) {
        // usa o primeiro xlsx encontrado como Name_file_xlsx 
        formFile.append('Dict_check', JSON.stringify(dict_check));
        formFile.append('Name_file_xlsx', filenamesXLSX[0]);
        formFile.append('listID', JSON.stringify(list_id_file));
        formFile.append('Campo', 'FilesDWG');
        // envia 
        AjaxDocs(formFile);
    } else {
        // exibe modal de erro igual ao
        document.getElementById('mensagem_load').innerText = '';
        document.getElementById('mensagem_load').innerText = 'Selecione os arquivos DWG e XLSX para enviar.';
        document.getElementById('image_load').src = "/static/img/alert.gif";
        document.getElementById('image_load').classList.remove('w-100');
        document.getElementById('image_load').classList.add('w-50');
        document.getElementById('titulo').classList.remove('text-success');
        document.getElementById('titulo').classList.add('text-danger');
        $('#modal_submit').modal('show');
    }
}

// --------------------- Função envia os dados para backend e baixa o arquivo ---------------------//
function AjaxDocs(formData) {
    document.getElementById('mensagem_load').innerText = 'Verificando documentos, por favor aguarde!'
    document.getElementById('image_load').src = "/static/img/merge.gif"
    document.getElementById('image_load').classList.remove('w-50')
    document.getElementById('image_load').classList.add('w-100')
    document.getElementById('titulo').classList.remove('text-danger')
    document.getElementById('titulo').classList.add('text-success')
    $('#modal_submit').modal('show')
    $.ajax({
        url: '/app/eletrica/a1pro/RenderListMaterials/ListMaterials/',
        type: "POST", // http method
        headers:{'X-CSRFToken':csrf[0].value},
        dataType: "json",
        data: formData, // Envia form pela solicitação do POST
        processData: false,
        contentType: false,
        success: function (data) {
            inti_celery_bar({'task_id': data['task_id']})
            id_task_pdf = data['task_id']
        },
        failure: function () {
            alert('Algo deu errado! verifique e tente novamente.')
        }
    })
}

// --------------------- Analisador de evento da barra de tarefas em tempo real ---------------------//
$('#progress-bar-message').on('DOMSubtreeModified', function(){
    if ($('#progress-bar-message')[0].innerText === 'Success!'){
        console.log($('#progress-bar-message')[0].innerText)
        let url =  '/app/eletrica/gerar_tipicos/trata_documento{{nome_url_enviar_arquivo}}/' + id_task_pdf + '/'
        window.open(url, '_self')
        setTimeout(()=>{document.getElementById('div_bar_taks').hidden = true}, 2000)
        setTimeout(()=>{$('#modal_submit').modal('hide')}, 3000)
    }
});

// --------------------- Função para converter o tamanho para bytes ---------------------//
function FormatNumberToBytes(bytes, decimal = 2) {
    if (!+bytes) return '0 Bytes'
    const k = 1024
    const dm = decimal < 0 ? 0 : decimal
    const tamanho = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${tamanho[i]}`
}

// --------------------- Função adiciona campo visual nos dropzones ---------------------//
// Recebe arquivos (via input ou dataTransfer) e delega a renderizacao a 'MostrarArquivo'
function DropArquivo(id_input,id_drop,campo,arquivo, compare) {
    let fileInput = document.getElementById(id_input);
    let files = [];

    if (arquivo !== null && arquivo.files) {
        files = archivoToArray(arquivo.files);
    } else if (fileInput && fileInput.files) {
        files = archivoToArray(fileInput.files);
    }

    // percorre os arquivos e chama a funcao que apenas mostra cada arquivo
    for (let i = 0; i < files.length; i++) {
        MostrarArquivo(files[i], id_drop, campo, compare, id_input);
    }
}

// helper: converte FileList para array (compatibilidade)
function archivoToArray(fileList) {
    try { return Array.prototype.slice.call(fileList); } catch(e) { // fallback
        let arr = [];
        for (let i = 0; i < fileList.length; i++) arr.push(fileList[i]);
        return arr;
    }
}

// --------------------- Função que apenas monta o card visual para um arquivo e anexa aos dropzones ---------------------//
function MostrarArquivo(fileObj, id_drop, campo, compare, id_input) {
    const drop_container = document.getElementById(id_drop);
    if (!drop_container) return;
    // prefere um container global '#drop-list-multi' se presente, senão procura .drop-list dentro do drop_container
    let listContainer = document.getElementById('drop-list-multi') || drop_container.querySelector('.drop-list') || drop_container;

    let name_file = fileObj.name;
    let name_title = name_file;
    let extension = (name_file.split('.').pop() || '').toLowerCase();
    if (extension !== String(campo).toLowerCase()) return; // ignora se extensao diferente

    // cria id unico
    const id = (Math.random() + 1).toString(36).substring(7);
    if (document.getElementById(id)) return;

    // decide comportamento conforme tipo
    if (extension === 'dwg') {
        formFile.append('filesDWG', fileObj);
        const drop = `<div class="col-10 mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown" id="${id}">
                                    <div class="input-group-prepend my-auto px-1">
                                        <img class="" src="/static/img/DWG.png" alt="Image DWG" style="height:20px">
                                    </div>
                                    <span type="text" title="${name_title}" class="col border-0 input-group-text bg-white text-truncate">${name_file}</span>
                                    <div class="input-group-append">
                                        <button class="btn btn-outline-danger rounded-pill px-2 border-0" type="button" onclick="RemoverArquivoDWG('${id}');">
                                            <i class="fas fa-times-circle fa-lg"></i>
                                        </button>
                                    </div>
                                </div>`;
        listContainer.innerHTML += drop;
        // registra arquivo para remoção por id
        window._fileRegistryAdd(id, fileObj, 'formFile', 'filesDWG');
    } else {
        // para xlsx, valida se existe espaco livre no container (comportamento original)
        let itens = listContainer.children;
        if (itens.length === 0) {
            if (compare) {
                let tamanho = FormatNumberToBytes(fileObj.size);
                if (name_file.split(' ').length <= 1) {
                    name_file = name_file.split('.')[0].match(/.{1,10}/g).join(' ') + '.xlsx';
                }
                if (id_input === 'arquivo_xlsx_rev_0'){
                    formFileCompare.append('filesComparePreviousXLSX', fileObj);
                    window._fileRegistryAdd(id, fileObj, 'formFileCompare', 'filesComparePreviousXLSX');
                } else {
                    formFileCompare.append('filesCompareNextXLSX', fileObj);
                    window._fileRegistryAdd(id, fileObj, 'formFileCompare', 'filesCompareNextXLSX');
                }

                const drop = `<div class="col-6 bordas mx-auto my-1 input-group border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown position-relative" id="${id}" title="${name_title}">
                                        <button onclick="RemoverArquivoXLS('${id}','${id_drop}');" title="Remover arquivo" class="btn btn-outline-danger rounded-pill px-2 border-0 position-absolute" type="button" style="right:0px;top:0px;z-index: 1;">
                                            <i class="fas fa-times-circle fa-xl"></i>
                                        </button>
                                        <img class="my-2 w-75 mx-auto" src="/static/img/XLS.png" alt="Image TXT">
                                        <span type="text" title="${name_title}" class="py-2 w-100 border-bottom font-weight-bold text-center">${tamanho}</span>
                                        <span type="text" title="${name_title}" class="py-2 mx-2 text-center">${name_file}</span>
                                    </div>`;
                listContainer.innerHTML += drop;
            } else {
                formFile.append('filesXLSX', fileObj);
                const drop = `<div class="col-10 mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown" id="${id}" title="${name_title}">
                                        <div class="input-group-prepend my-auto px-1">
                                            <img class="" src="/static/img/XLS.png" alt="Image XLSX" style="height:20px">
                                        </div>
                                        <span type="text" title="${name_title}" class="col border-0 input-group-text bg-white text-truncate">${name_file}</span>
                                        <div class="input-group-append">
                                            <button class="btn btn-outline-danger rounded-pill px-2 my-1 border-0" type="button" onclick="RemoverArquivoXLS('${id}','${id_drop}');">
                                                <i class="fas fa-times-circle fa-lg"></i>
                                            </button>
                                        </div>
                                    </div>`;
                listContainer.innerHTML += drop;
                window._fileRegistryAdd(id, fileObj, 'formFile', 'filesXLSX');
            }
        } else {
            swal({
                text: 'Não é permitido adicionar mais de um arquivo, remova o arquivo atual e tente novamente!',
                icon: "error",
                button: 'Fechar'
            });
            $('div.swal-modal').addClass('bordas');
            $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill');
            $('div.swal-text').addClass('text-center');
            $('div.swal-footer').addClass('d-flex justify-content-center');
        }
    }
}

// ---------------------Função para remover elemento ao clicar no X vermelho---------------------//
function RemoverArquivoDWG(elemento) {
    const el = document.getElementById(elemento)
    if(!el) return
    el.classList.remove('animate__zoomInDown')
    el.style.zIndex = '1'
    el.classList.add('animate__hinge')
    setTimeout(()=>{
        // remove do registry por id e reconstrói os FormData
        try{ window._fileRegistryRemove(elemento); }catch(e){ /* ignore */ }
        // remove o elemento onde quer que esteja
        if(el.parentElement) el.remove()
        // ajusta container visual se necessário
        const container = document.getElementById('drop-list-multi') || document.getElementById('drop-area-dwg')
        if(container){
            const list = container.querySelector('.drop-list') || container
            if(list.children.length === 0){ list.style.maxHeight = ''; list.style.overflow = '' }
        }
    },2500)
}

// ---------------------Função para remover elemento ao clicar no X vermelho---------------------//
function RemoverArquivoXLS(id_item, drop) {
    const el = document.getElementById(id_item)
    if(!el) return
    el.classList.remove('animate__zoomInDown')
    el.style.zIndex = '1'
    el.classList.add('animate__hinge')
    setTimeout(()=>{
        // remove do registry por id e reconstrói os FormData
        try{ window._fileRegistryRemove(id_item); }catch(e){ /* ignore */ }
        if(el.parentElement) el.remove()
        const container = document.getElementById('drop-list-multi') || document.getElementById(drop)
        if(container){
            const list = container.querySelector('.drop-list') || container
            if(list.children.length === 0){ list.style.maxHeight = ''; list.style.overflow = '' }
        }
    },2500)
}

jQuery(document).ready(function($) {
    // Ao arrastar o cursor com arquivo sobre o campo dropzone as bordas aumentam
    $('#drop-area-xlsx').on('dragover', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).addClass('upload-hover');
    })
    // Ao arrastar o cursor com arquivo sobre o campo dropzone as bordas aumentam
    $('#drop-area-dwg').on('dragover', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).addClass('upload-hover-blue');
    })
    // Ao arrastar o cursor com arquivo sobre o campo dropzone as bordas aumentam
    $('#drop-area-xlsx-rev-0').on('dragover', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).addClass('upload-hover');
    })
    // Ao arrastar o cursor com arquivo sobre o campo dropzone as bordas aumentam
    $('#drop-area-xlsx-rev-next').on('dragover', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).addClass('upload-hover');
    })


    // Ao retirar o cursor com arquivo sobre o campo dropzone as bordas diminuem
    $('#drop-area-xlsx').on('dragleave', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('upload-hover');
    })
    // Ao retirar o cursor com arquivo sobre o campo dropzone as bordas diminuem
    $('#drop-area-dwg').on('dragleave', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).removeClass('upload-hover-blue');
    })
    // Ao retirar o cursor com arquivo sobre o campo dropzone as bordas diminuem
    $('#drop-area-xlsx-rev-0').on('dragleave', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('upload-hover');
    })
    // Ao retirar o cursor com arquivo sobre o campo dropzone as bordas diminuem
    $('#drop-area-xlsx-rev-next').on('dragleave', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).removeClass('upload-hover');
    })


    // Ao soltar o arquivo sobre o campo chama a função DropArquivo passando os parâmetros
    $('#drop-area-xlsx-rev-0').on('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('upload-hover');
        let file_xls = event.originalEvent.dataTransfer;
        // A função abaixo altera o conteudo do campo dropdown
        DropArquivo('arquivo_xlsx_rev_0','drop-area-xlsx-rev-0','xlsx',file_xls, true)
    })

    // Ao soltar o arquivo sobre o campo chama a função DropArquivo passando os parâmetros
    $('#drop-area-xlsx-rev-next').on('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('upload-hover');
        let file_xls = event.originalEvent.dataTransfer;
        // A função abaixo altera o conteudo do campo dropdown
        DropArquivo('arquivo_xlsx_rev_next','drop-area-xlsx-rev-next','xlsx',file_xls, true)
    })

    // Ao soltar o arquivo sobre o campo chama a função DropArquivo passando os parâmetros
    $('#drop-area-xlsx').on('drop', function(event) {
        event.preventDefault();
        event.stopPropagation();
        $(this).removeClass('upload-hover');
        let file_xls = event.originalEvent.dataTransfer;
        // A função abaixo altera o conteudo do campo dropdown
        DropArquivo('arquivo_xlsx','drop-area-xlsx','xlsx',file_xls, null)
    })

    // Ao soltar o arquivo sobre o campo a função DropArquivo passando os parâmetros
    $('#drop-area-dwg').on('drop', function(event_2) {
        event_2.preventDefault();
        event_2.stopPropagation();
        $(this).removeClass('upload-hover-blue');
        let file_dwg = event_2.originalEvent.dataTransfer;
        // A função abaixo altera o conteudo do campo dropdown
        DropArquivo('arquivo_dwg','drop-area-dwg','dwg',file_dwg, null)
    })

            // Multi dropzone: suporta tanto XLSX quanto DWG (arrastar/soltar)
            $('#drop-area-multi').on('dragover', function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).addClass('upload-hover');
            })

            $('#drop-area-multi').on('dragleave', function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass('upload-hover');
            })

            $('#drop-area-multi').on('drop', function(event) {
                event.preventDefault();
                event.stopPropagation();
                $(this).removeClass('upload-hover');
                let dataTransfer = event.originalEvent.dataTransfer;
                // Chamamos DropArquivo para cada tipo; a função irá ignorar extensões diferentes
                DropArquivo('arquivo_xlsx_multi','drop-area-multi','xlsx',dataTransfer,null)
                DropArquivo('arquivo_dwg_multi','drop-area-multi','dwg',dataTransfer,null)
            })
});





function DropFileInLstMatRevit(id_dropzone, id_input, key_form_data, files_event=null, dwg_or_xlsx=0){
    debugger;
    /// dwg_or_xlsx = 0 para cair na regra dos 3 ou 6 metros, 1 para cair na regra do xlsx simples e 2 para cair na regra do dwg
    let container_drop_file = document.getElementById(id_dropzone)
    let input_file = document.getElementById(id_input)
    let files = files_event === null ? input_file.files:files_event.files
    for (let i = 0; i <files.length;i++){
        let file = files[i]
        let error_file = false
        let name_file_splited = file.name.split('.')
        let extension = name_file_splited[name_file_splited.length - 1]
        extension = extension.toUpperCase()
        console.log(extension, dwg_or_xlsx)
        if((extension === 'XSLX' || extension === 'CSV') && (dwg_or_xlsx !== 0 && dwg_or_xlsx !== 1)){
            error_file = true
        }
        if ((dwg_or_xlsx !== 2) && (extension === 'DWG')){
            error_file = true
        }

        if(!error_file){
            // cria id único para este arquivo e registra
            const id = (Math.random() + 1).toString(36).substring(7);
            formFileLstMat.append(key_form_data, file)
            window._fileRegistryAdd(id, file, 'formFileLstMat', key_form_data);
            console.log(file)

            if(dwg_or_xlsx === 0){

                    container_drop_file.innerHTML += `<div id="${id}" class="col-10 mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown" title="${file.name}">
                                                            <div class="input-group-prepend my-auto px-1">
                                                                <img src="/static/img/XLS.png" style="height:20px">
                                                            </div>
                                                            <span class="col-6 my-1 text-truncate" type="text">${file.name}</span>

                                                            <div class="input-group-append ml-auto">
                                                                <button class="btn btn-outline-danger rounded-pill px-2 border-0" type="button" onclick="DeleFileXlsxLstMat(this, '${id}')">
                                                                    <i class="fas fa-times-circle fa-lg"></i>
                                                                </button>
                                                            </div>

                                                    </div>
                                                </div>`
            }
            else if(dwg_or_xlsx === 1){
                container_drop_file.innerHTML += `<div id="${id}" class="col-10 mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown" title="${file.name}">
                                                    <div class="input-group-prepend my-auto px-1">
                                                        <img class="" src="/static/img/XLS.png" style="height:20px">
                                                    </div>
                                                    <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate">${file.name}</span>
                                                    <div class="input-group-append">
                                                        <button class="btn btn-outline-danger rounded-pill px-2 my-1 border-0" type="button" onclick="DeleFileXlsxLstMat(this, '${id}')">
                                                            <i class="fas fa-times-circle fa-lg"></i>
                                                        </button>
                                                    </div>
                                                </div>`
            }
            else{
                container_drop_file.innerHTML += `<div id="${id}" class="col-10 mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown" title="${file.name}">
                                <div class="input-group-prepend my-auto px-1">
                                    <img class="" src="{% static 'imgDWG.png' %}" style="height:20px">
                                </div>
                                <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate">${file.name}</span>
                                <div class="input-group-append">
                                    <button class="btn btn-outline-danger rounded-pill px-2 my-1 border-0" type="button" onclick="DeleFileXlsxLstMat(this, '${id}')">
                                        <i class="fas fa-times-circle fa-lg"></i>
                                    </button>
                                </div>
                            </div>`
            }
        }
        else{
            formFileLstMat.delete(key_form_data)
            return SwitchAlertLstMat(file.name + ': Extensão de arquivo inválida!!', true)
        }
    }
    input_file.value = ''
}

