let formFileDin = new FormData();

/* ------------------------------------------------ ABA INICIO ------------------------------------------------------ */
function SaveOrDeleteNotesCards(id_note, save_delete, button) {
        debugger;
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        const cardBody = button.closest(".card-body");
        const campoAnotacao = cardBody.querySelector(".campo-anotacao");

        // Captura o texto da anotação
        const anotacaoText = campoAnotacao.innerText.trim();

        // Verifica a ação (Salvar ou Excluir)
        if (save_delete === 'SALVAR' && anotacaoText === '') {
            alert('Não é possível salvar uma anotação vazia.');
            return;
        }

        // Dados para enviar
        const data = {
            'type': 'geral_os',
            'save_delete': save_delete,
            'notes': anotacaoText,
            'id_notes': id_note
        };

        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/SaveOrDeleteNotesCards/",
            headers: { 'X-CSRFToken': csrf },
            dataType: "json",
            data: data,

            success: function (data) {
                    swalAlert_DOC(false, data['message'], 'success', false).then(() => {
                    // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                    $('#modalRender').modal('show');
                    $('#overlay').show();
                    });
            }
        });
}


function SaveOrDeleteNotesCardsStandard(button) {
        debugger;
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
        const cardBody = button.closest(".card-body");
        const campoAnotacao = cardBody.querySelector(".campo-anotacao");

        // Captura o texto da anotação
        const anotacaoText = campoAnotacao.innerText.trim();

        // Verifica a ação (Salvar ou Excluir)
        if (anotacaoText === '') {
            alert('Não é possível salvar uma anotação vazia.');
            return;
        }

        // Dados para enviar
        const data = {
            'type': 'standard',
            'notes': anotacaoText
        };

        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/SaveOrDeleteNotesCards/",
            headers: { 'X-CSRFToken': csrf },
            dataType: "json",
            data: data,

            success: function (data) {
                    swalAlert_DOC(false, data['message'], 'success', false).then(() => {
                    $('#modalRender').modal('show');
                    $('#overlay').show();
                    });
            }
        });
}
/* ------------------------------------------------ ABA FIM --------------------------------------------------------- */






/* ------------------------------------------------ ABA CABEÇALHO --------------------------------------------------- */
function SalvarCabecalhoPainel() {
    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const numeroA1 = document.getElementById('numero_a1').value;
    const numeroCliente = document.getElementById('numero_cliente').value;
    const descricaoDocumento = document.getElementById('descricao_documento').value;
    const descricaoArea = document.getElementById('descricao_area').value;
    const diagramaFuncional = document.getElementById('diagrama_funcional').value;
    const revisaoA1 = document.getElementById('revisao_a1').value;
    const revisaoCliente = document.getElementById('revisao_cliente').value;
    const painelSelecionado = document.getElementById('painel-origem-os').value;

    const formData = {
        'NUMERO A1': numeroA1,
        'NUMERO CLIENTE': numeroCliente,
        'DESCRICAO DO DOC': descricaoDocumento,
        'DESCRICAO AREA': descricaoArea,
        'DIAGRAMA FUNCIONAL': diagramaFuncional,
        'REVISAO A1': revisaoA1,
        'REVISAO CLIENTE': revisaoCliente,
        'ID_EQUIP_ELETRIC': painelSelecionado
    };

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/SalvarCabecalhoForca/",
        headers:{'X-CSRFToken': csrf},
        /*contentType: "application/json"*/
        dataType: "json",
        data: JSON.stringify(formData),
        success: function(data){
            swalAlert(false, 'Cabeçalho salvo com sucesso!', 'success', false);
            /*$('#CatalogoCabos').modal('hide'); */
        }
    });
}

function PreencherCamposPainel(){
    debugger;
    const painelSelecionado = document.getElementById('painel-origem-os').value;
    console.log("Painel selecionado:", painelSelecionado);
    $.ajax({
        type: "GET",
        data: {'ID_ORIGEM': painelSelecionado},
        dataType: "json",
        url: "/app/eletrica/a1pro/SalvarCabecalhoForca/",
        /*headers:{'X-CSRFToken': csrf},*/
        success: function(data) {
            debugger;
            /*swalAlert(false, 'blabla sucesso!', 'success', false);*/
            if (data[painelSelecionado] !== '---') {
                data = data[painelSelecionado];
                document.getElementById('numero_a1').value = data['numero_a1'];
                document.getElementById('numero_cliente').value = data['numero_cliente'];
                document.getElementById('descricao_documento').value = data['descricao_documento'];
                document.getElementById('descricao_area').value = data['descricao_area'];
                document.getElementById('diagrama_funcional').value =  data['diagrama_funcional'];
                document.getElementById('revisao_a1').value = data['revisao_a1'];
                document.getElementById('revisao_cliente').value = data['revisao_cliente'];
                }
            else {
                document.getElementById('numero_a1').value = '';
                document.getElementById('numero_cliente').value = '';
                document.getElementById('descricao_documento').value = '';
                document.getElementById('descricao_area').value = '';
                document.getElementById('diagrama_funcional').value = '';
                document.getElementById('revisao_a1').value = '';
                document.getElementById('revisao_cliente').value = '';
                }
        }
    })
}
/* ------------------------------------------------ ABA CABEÇALHO --------------------------------------------------- */







/* ------------------------------------------------ ABA ACESSÓRIO --------------------------------------------------- */


function UpdateAndSendDwgAcess(){
        debugger;
        formFileDin.append('OS', JSON.stringify(getCookie('OS')))
        formFileDin.append('Area', JSON.stringify(getCookie('Area')))

        formFileDin.append('X', JSON.stringify(document.getElementById('X').value));
        formFileDin.append('Y', JSON.stringify(document.getElementById('Y').value));


        formFileDin.append('acessorios_nome_padrao',JSON.stringify(document.getElementById('acessorios-nome-padrao').selectedOptions[0].innerHTML));
        formFileDin.append('acessorios_nome_os', JSON.stringify(document.getElementById('acessorios-nome-os').selectedOptions[0].innerHTML));


        let fileAcessorio = formFileDin.get('FileAcessorio')
        const nome_padrao = document.getElementById('acessorios-nome-padrao').selectedOptions[0].innerHTML;
        const nome = document.getElementById('acessorios-nome-os').selectedOptions[0].innerHTML;
        const X = document.getElementById('X').value;
        const Y = document.getElementById('Y').value;
        const area = getCookie('Area');
        const osnum = getCookie('OS');
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;

        if (!(nome_padrao === '---' || nome === '---' || fileAcessorio == null || X === "" || Y === "")) {
            $('#modalLoading').modal('show');
        }

        console.log(formFileDin)

        $.ajax({
                type: "POST",
                url: "/app/eletrica/a1pro/GeraDiagInter/PainelDiagInter/",
                headers:{'X-CSRFToken':csrf},
                dataType: "json",
                data: formFileDin,
                processData: false,
                contentType: false,
                success: function (data) {
                        $('#modalLoading').modal('hide');
                        console.log(data);
                        if(data['STATUS'].length === 0){

                            swalAlert_DOC(false, 'Arquivo .DWG do acessório salvo com sucesso!', 'success', false).then(() => {
                            // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                            $('#modalRender').modal('show');
                            $('#overlay').show();
                        });
                        }
                        else{
                            swalAlert(false, `${data['STATUS']}`, 'warning', false)
                        }
                }
            })
}

function DeleteAcessorioOs(btn_del, name_os, name_std){
    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    btn_del.parentElement.remove()

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DeleteAcessorioOs/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'name_os': name_os, 'name_std': name_std},
        success: function (){
            $('#modalRender').modal('show');
            $('#overlay').show();
            debugger;
            location.reload();
        }
    });
}
/* ------------------------------------------------ ABA ACESSÓRIO --------------------------------------------------- */









/* ------------------------------------------------ ABA EQUIPAMENTO ------------------------------------------------- */
function IndicaSistemaFuncaoOs(id_pk, aba) {
    debugger;
    $.ajax({
        type: "GET",
        data: { 'ID_FUNCAO_GERAL': id_pk, 'aba': aba },
        dataType: "json",
        url: "/app/eletrica/a1pro/PainelEquipamento/",
        success: function (data_response) {
            debugger;
            if (aba === 'equip') {
                document.getElementById('code_tipico').value =data_response["sistema"];
            }
            if (aba === 'borne') {
                document.getElementById('sistema').value = data_response["sistema"];
                document.getElementById('tipo-funcao').value = data_response["tipo_funcao"];
                document.getElementById('formacao-cabo').value = data_response["tipo_formacao"];
                let tbody = document.querySelector("table tbody");
                // Limpa todas as linhas existentes antes de adicionar novas
                tbody.innerHTML = '';
                // Adiciona `k` novas linhas
                const k = data_response['amount_borne']; // Define o número de linhas a serem adicionadas
                for (let i = 0; i < k; i++) {
                    let newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td class="border"><input type="text" class="form-control" id="borne_orig_${i}"></td>
                        <td class="border"><input type="text" class="form-control" readonly id="veia_orig"></td>
                        <td class="border"><input type="text" class="form-control"></td>
                        <td class="border"><input type="text" class="form-control" readonly></td>
                    `;
                    tbody.appendChild(newRow);
                }
            }







        }
    });
}



function UpdateAndSendDwgEquip(){

        debugger;
        formFileDin.append('OS', JSON.stringify(getCookie('OS')))
        formFileDin.append('Area', JSON.stringify(getCookie('Area')))
        formFileDin.append('funcao_nome_os_id', JSON.stringify(document.getElementById('funcao-nome-os').value))
        formFileDin.append('funcao_nome_os', JSON.stringify(document.getElementById('funcao-nome-os').selectedOptions[0].innerHTML))
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

        let FileEquip = formFileDin.get('FileEquip')
        const FuncaoNomeOs = document.getElementById('funcao-nome-os').selectedOptions[0].innerHTML

        if (!(FileEquip === null  || FuncaoNomeOs === '---' )) {
            $('#modalLoading').modal('show');
        }

        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/PainelEquipamento/",

            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: formFileDin,
            processData: false,
            contentType: false,
            success: function (data) {
                $('#modalLoading').modal('hide');
                console.log(data);
                if(data['STATUS'].length === 0){
                    swalAlert_DOC(false, 'Arquivo .DWG do acessório salvo com sucesso!', 'success', false).then(() => {
                            // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                            $('#modalRender').modal('show');
                            $('#overlay').show();
                        });
                }
                else{
                    swalAlert(false, `${data['STATUS']}`, 'warning', false)
                }
            }
        })
}

function FiltroMotorPainel(){
        debugger;
        formFileDin.append('motor', JSON.stringify(document.getElementById('motor').value))
        formFileDin.append('painel', JSON.stringify(getCookie('Area')))
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
}

function DeleteEquipOs(btn_del, id_fos, OS, nome_fg){
    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    btn_del.parentElement.parentElement.remove()

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DeleteEquipOs/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'id_fos': id_fos, 'OS': OS, 'nome_fg': nome_fg},
        success: function (){
            $('#modalRender').modal('show');
            $('#overlay').show();
            debugger;
            location.reload();
        }
    });
}
/* ------------------------------------------------ ABA EQUIPAMENTO ------------------------------------------------- */








/* ------------------------------------------------ ABA SINAIS ------------------------------------------------------ */
function UpdateAndSendDwgSinal(){

        debugger;
        formFileDin.append('OS', JSON.stringify(getCookie('OS')))
        formFileDin.append('sinais_nome_os_id', JSON.stringify(document.getElementById('sinais-nome-os').value))
        formFileDin.append('sinais_nome_os', JSON.stringify(document.getElementById('sinais-nome-os').selectedOptions[0].innerHTML))
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

        let FileSinal = formFileDin.get('FileSinal')
        const SinalNomeOs = document.getElementById('sinais-nome-os').selectedOptions[0].innerHTML

        if (!(FileSinal === null  || SinalNomeOs === '---' )) {
            $('#modalLoading').modal('show');
        }

        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/PainelSinais/",

            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: formFileDin,
            processData: false,
            contentType: false,
            success: function (data) {

                console.log(data);
                $('#modalLoading').modal('hide');
                if(data['STATUS'].length === 0){
                    debugger;
                    swalAlert_DOC(false, 'Arquivo .DWG do acessório salvo com sucesso!', 'success', false).then(() => {
                            // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                            $('#modalRender').modal('show');
                            $('#overlay').show();
                        });
                }
                else{
                    swalAlert(false, `${data['STATUS']}`, 'warning', false)
                }

            }
        })
}
function DeleteSinaisOs(btn_del, id_fos_sig, OS){

    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    btn_del.parentElement.parentElement.remove()

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DeleteSinaisOs/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'id_fos_sig': id_fos_sig, 'OS': OS},
        success: function (){
            $('#modalRender').modal('show');
            $('#overlay').show();
            debugger;
            location.reload();
        }
    });
}
/* ------------------------------------------------ ABA SINAIS ------------------------------------------------------ */







/* ------------------------------------------------ ABA TEMPLATES -------------------------------------------------- */
function DeleteTempleteOs(btn_del, id_template){

    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    btn_del.parentElement.parentElement.remove()

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DeleteTemplateOs/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'id_template': id_template},
        success: function (){
            $('#modalRender').modal('show');
            $('#overlay').show();
            debugger;
            location.reload();
        }
    });
}

function UpdateAndSendDwgTemplate(){

        debugger;
        formFileDin.append('OS', JSON.stringify(getCookie('OS')))
        formFileDin.append('template_nome_os_id', JSON.stringify(document.getElementById('template-nome-os').value))
        formFileDin.append('template_nome_os', JSON.stringify(document.getElementById('template-nome-os').selectedOptions[0].innerHTML))
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

        let FileTemplate = formFileDin.get('FileTemplate')
        const TempNomeOs = document.getElementById('template-nome-os').selectedOptions[0].innerHTML

        if (!(FileTemplate === null  || TempNomeOs === '---' )) {
            $('#modalLoading').modal('show');
        }
        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/PainelTemplate/",

            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: formFileDin,
            processData: false,
            contentType: false,
            success: function (data) {
                console.log(data);
                $('#modalLoading').modal('hide');
                if(data['STATUS'].length === 0){
                    debugger;
                    swalAlert_DOC(false, 'Arquivo .DWG do acessório salvo com sucesso!', 'success', false).then(() => {
                            // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                            $('#modalRender').modal('show');
                            $('#overlay').show();
                        });
                }
                else{
                    swalAlert(false, `${data['STATUS']}`, 'warning', false)
                }
            }
        })
}

function UpdateTemplates(tipo){

        debugger;
        formFileDin.append('OS', JSON.stringify(getCookie('OS')))
        formFileDin.append('TIPO_CAPA', JSON.stringify(tipo))

        if (tipo === 'CAPA'){
            formFileDin.append('X', 'CAPA')
            formFileDin.append('Y', 'CAPA')
        }
        else if (tipo === 'INDICE') {
            formFileDin.append('X', 'INDICE')
            formFileDin.append('Y', 'INDICE')
        }
        else if (tipo === 'LOGO A1') {
            formFileDin.append('X', document.getElementById('X_logoa1').value)
            formFileDin.append('Y', document.getElementById('Y_logoa1').value)
        }
        else if (tipo === 'LOGO CLIENTE') {
            formFileDin.append('X', document.getElementById('X_cliente').value)
            formFileDin.append('Y', document.getElementById('Y_cliente').value)
        }
        if (tipo === 'LOGO A1' || tipo === 'LOGO CLIENTE'){

            let X  = formFileDin.get('X')
            let Y  = formFileDin.get('Y')
            let FileTemplateGeral = null;

            if (tipo === 'LOGO A1'){
                FileTemplateGeral = formFileDin.get('FileLogoa1')
            }
            else{
                FileTemplateGeral = formFileDin.get('FileCliente')
            }
            if (FileTemplateGeral !== null){
                if (!(FileTemplateGeral === null || X === "" || Y === "")) {
                $('#modalLoading').modal('show');
                }
            }
        }
        if (tipo === 'INDICE' || tipo === 'CAPA'){
            let FileTemplateGeral = null;
            if (tipo === 'INDICE'){
                FileTemplateGeral = formFileDin.get('FileIndice')
            }
            if (tipo === 'CAPA'){
                FileTemplateGeral = formFileDin.get('FileCapa')
            }
            if (FileTemplateGeral !== null){
                if (!(FileTemplateGeral === null)) {
                $('#modalLoading').modal('show');
                }
            }
        }
        const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
            type: "POST",
            url: "/app/eletrica/a1pro/PainelTemplateGeral/",

            headers:{'X-CSRFToken':csrf},
            dataType: "json",
            data: formFileDin,
            processData: false,
            contentType: false,
            success: function (data) {


                console.log(data);
                $('#modalLoading').modal('hide');
                if(data['STATUS'].length === 0){
                    debugger;
                    swalAlert_DOC(false, 'Arquivo .DWG do acessório salvo com sucesso!', 'success', false).then(() => {
                            // 3. Quando o alerta for fechado (clicar fora ou fechar manualmente), exibir o modal de renderização
                            $('#modalRender').modal('show');
                            $('#overlay').show();
                        });
                }
                else{
                    swalAlert(false, `${data['STATUS']}`, 'warning', false)
                }

            }
        })
}

function DeleteTempleteGeralOs(btn_del, id_template){

    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    btn_del.parentElement.parentElement.remove()

    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/DeleteTemplateGeralOs/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'id_template': id_template},
        success: function (){
            $('#modalRender').modal('show');
            $('#overlay').show();
            debugger;
            location.reload();
        }
    });
}
/* ------------------------------------------------ ABA TEMPLATES --------------------------------------------------- */








/* ------------------------------------------------ GERAL ----------------------------------------------------------- */
jQuery(document).ready(function($) {
        debugger;
        let params = ReturnParamsDropFilesInDropzoneInterligacaoPainel()
        /*let params = { 'acessorio_dwg': {'id_input': 'uploaded-file', 'key_form_data': 'FileAcessorio', 'xlsx': false}}*/
        for(let id_dropzone in params){
            $('#'+id_dropzone).on('dragover', function(event_2) {
              event_2.preventDefault();
              event_2.stopPropagation();
              $(this).addClass('upload-hover-blue');
            })

            $('#'+id_dropzone).on('drop', function(event_2) {
              event_2.preventDefault();
              event_2.stopPropagation();
              $(this).removeClass('upload-hover-blue');
              let file = event_2.originalEvent.dataTransfer;
              // A função abaixo altera o conteudo do campo dropdown
              debugger;
              DropRelatPdms(id_dropzone, params[id_dropzone]['id_input'], params[id_dropzone]['key_form_data'], params[id_dropzone]['xlsx'], file)
            })

            $('#'+id_dropzone).on('dragleave', function(event_2) {
              event_2.preventDefault();
              event_2.stopPropagation();
              $(this).removeClass('upload-hover-blue');
            })
        }
});

function DropRelatPdms(id_dropzone, id_input_file, key_form_data, xlsx=false, file_event=null){
        debugger;
        let container_drop_file = document.getElementById(id_dropzone)
        let input_file = document.getElementById(id_input_file)
        let file = file_event === null ? input_file.files[0]:file_event.files[0]
        let error_file = false
        let name_file_splited = file.name.split('.')
        let extension = name_file_splited[name_file_splited.length - 1]
        let image
        if(xlsx){
            if(extension !== 'xlsx'){
                error_file = true
            }
            image = "{% static 'img/XLS.png' %}"
        }
        else{
            if(extension !== 'dwg'){
                error_file = true
            }
            image = "{% static 'img/DWG.png' %}"
        }
        if(!error_file){
            ClearDropsZonesBandEle(container_drop_file)
            formFileDin.append(key_form_data, file)
            debugger;
            console.log(formFileDin.get(key_form_data));

            container_drop_file.innerHTML += `<div class="col mx-auto my-1 input-group rounded-pill border input-group-sm bg-white shadow px-1 animate__animated animate__zoomInDown">
                                                <span type="text" title="${file.name}" class="col border-0 input-group-text bg-white text-truncate">${file.name}</span>
                                                <div class="input-group-append">
                                                     <button class="btn btn-outline-danger rounded-pill px-2 my-1 border-0" type="button" onclick="DeleteFileSupBandGtDocs(this, '${key_form_data}')">
                                                        <i class="fas fa-times-circle fa-lg"></i>
                                                        </button>
                                                    </div>
                                                </div>`
        }
        else{
            SwitchAlertGtDoc('Extensão de arquivo inválida!!', true)
        }
}

function ClearDropsZonesBandEle(container){
    let dropzone_childrens = container.children
    for(let i = 0; i <dropzone_childrens.length;i++){
        if(dropzone_childrens[i].id === ""){
            dropzone_childrens[i].remove()
        }
    }
}

function ReturnParamsDropFilesInDropzoneInterligacaoPainel(){
    debugger;
    return{
        'acessorio_dwg': {'id_input': 'uploaded-file-1', 'key_form_data': 'FileAcessorio', 'xlsx': false},
        'sistema_tipo_dwg': {'id_input': 'uploaded-file-2', 'key_form_data': 'FileEquip', 'xlsx':false},
        'sinal_dwg': {'id_input': 'uploaded-file-3', 'key_form_data': 'FileSinal', 'xlsx':false},
        'templete_dwg': {'id_input': 'uploaded-file-4', 'key_form_data': 'FileTemplate', 'xlsx':false},
        'capa_dwg': {'id_input': 'uploaded-file-5', 'key_form_data': 'FileCapa', 'xlsx':false},
        'indice_dwg': {'id_input': 'uploaded-file-6', 'key_form_data': 'FileIndice', 'xlsx':false},
        'logoa1_dwg': {'id_input': 'uploaded-file-7', 'key_form_data': 'FileLogoa1', 'xlsx':false}
    }
}

function PreencheImgDwg(pk, tipo){
    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/ViewImgDwgDiagramInter/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'pk': pk, 'tipo': tipo},
        success: function (data){
            debugger;
            document.getElementById('img_dwg_template').src = `data:image/png;base64,${data['img']}`
        }
    });
}

$(document).on('click', '.dropdown-menu a', function (e) {
    e.preventDefault();

    // Remove a classe 'active' de todas as abas
    $('.nav-link').removeClass('active');
    $('.tab-pane').removeClass('active show');

    // Adiciona a classe 'active' à aba clicada
    var target = $(this).attr('href');
    $(this).addClass('active');
    $(target).addClass('active show');
});

document.addEventListener("DOMContentLoaded", function () {
    const selectAcessorios = document.getElementById("acessorios-nome-padrao");
    const inputX = document.getElementById("X");
    const inputY = document.getElementById("Y");


    // Dicionário de valores padrão para cada opção (exemplo)
    const valoresPadraoX = {
        "1": 60.0000, // ACESSORIO_PTC
        "2": 60.0000, // ACESSORIO_RAQ
        "3": 60.0000, // ENCODER
        "4": 60.0000, // PT100
        "5": 60.0000 // FREIO
    };
    const valoresPadraoY = {
        "1": 51.0000, // ACESSORIO_PTC
        "2": 39.0000, // ACESSORIO_RAQ
        "3": 59.0000, // ENCODER
        "4": 129.0000, // PT100
        "5": 39.0000 // FREIO
    };


    selectAcessorios.addEventListener("change", function () {
        const selectedValue = this.value;

        if (valoresPadraoX[selectedValue]) {
            inputX.value = valoresPadraoX[selectedValue];
            inputY.value = valoresPadraoY[selectedValue];
        } else {
            inputX.value = ""; // Se não houver valor associado, limpa o campo
        }
    });
});



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


    function InitProgressBarLcDin(id_task){
    var progressUrl = `/celery-progress/${id_task}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
      progressBarId: 'progress-bar-list-cabos',
      progressBarMessageId: 'progress-bar-message-list-cabos',
      onSuccess: customSucess,
      onError: customError,
      onProgress: customProgress,
    })

    function customSucess(progressBarElement, progressBarMessageElement, result){
        result = ''
        progressBarElement.style.backgroundColor = '#76ce60';
        progressBarMessageElement.innerHTML = 'Exportado!!'
        window.open('/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + id_task + '/', '_self')
    }

    function customError(progressBarElement, progressBarMessageElement, excMessage){
        progressBarElement.style.backgroundColor = '#dc4f63';
        progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
        + progressUrl;
    }

    function customProgress(progressBarElement, progressBarMessageElement, progress){
        progressBarElement.style.backgroundColor = '#68a9ef';
        progressBarElement.style.width = progress.percent + "%";
        var description = progress.description || "";
        progressBarMessageElement.innerHTML = description
    }
}
/* ------------------------------------------------ GERAL ----------------------------------------------------------- */











