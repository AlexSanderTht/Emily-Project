document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.dropdown-item[data-toggle="tab"]').forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            const tabTarget = el.getAttribute('href');
            const tabPane = document.querySelector(tabTarget);

            if (tabPane) {
                // Remove 
                document.querySelectorAll('.tab-pane').forEach(p => {
                    p.classList.remove('active', 'show');
                });

                // Remove 
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                });

                // Remove
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.classList.remove('active');
                });

                // Ativa
                tabPane.classList.add('active', 'show');

                // Ativa o link 
                el.classList.add('active');
            }
        });
    });
    // Controle de revisão para habilitar/desabilitar botões Gerar / Consolidar
    try {
        const revValue = document.getElementById('rev_consolidado')?.value;
        const gerarBtn = document.querySelector('button[onclick="ConsolidarPlanoDeCorte()"]');
        const consolidarBtn = document.querySelector('button[onclick="ConsolidarPlanoDeCorte()"]');
        if(revValue === '0'){
            [consolidarBtn].forEach(btn=>{
                if(btn){
                    btn.disabled = true;
                    btn.classList.add('disabled');
                    btn.title = 'Indisponível caso for 0';
                    btn.style.opacity = '0.55';
                    btn.style.cursor = 'not-allowed';
                }
            });
        }
    } catch(err){
        console.warn('Falha ao tentar a revisão ', err);
    }
});


/* ------------------------------------------------ ABA GERAÇÃO ----------------------------------------------------- */
function GeneratePlanoDeCorte() {
    const csrf = document.getElementsByName("csrfmiddlewaretoken");
    const rev = document.getElementById('rev_consolidado').value;
    
    const btn = event ? event.currentTarget : document.querySelector('button[onclick="ConsolidarPlanoDeCorte()"]');
    const bar = document.getElementById('pc-bar-gerar');
    const label = document.getElementById('pc-bar-gerar-label');
    let localTimer = null;
    function startLocalAnimation() {
        if(!bar || !label) return;
        let pct = 0;
        bar.style.width = '0%';
        label.textContent = 'INICIANDO...';
        label.style.color = '#666';
        localTimer = setInterval(()=>{
            pct += Math.random()*4 + 1; // 1-5%
            if(pct > 92) pct = 92; // segura enquanto backend não envia
            bar.style.width = pct.toFixed(1)+'%';
            label.textContent = 'PROCESSANDO ' + pct.toFixed(0) + '%';
        }, 400);
    }
    swal({
        icon: 'info',
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
                innerHTML: `Deseja gerar o plano de corte?<br> Ao confirmar a <b>${rev}</b> será <b>gerada</b>.`,
            },
        },
    }).then((value) => {
        if (value === 'Sim') {
            if(btn){ btn.disabled = true; btn.classList.add('disabled'); }
            startLocalAnimation();
            $.ajax({
                url: "/app/eletrica/a1pro/PlanoDeCorteRender/",
                type: "POST",
                headers: { 'X-CSRFToken': csrf[0].value },
                dataType: "json",
                success: function (data) {
                    if(localTimer){ clearInterval(localTimer); }
                    InitProgressBarPc(data['task_id'], function(){
                        if(bar){ bar.style.width = '100%'; }
                        if(label){ label.textContent = 'CONCLUÍDO 100%'; label.style.color = '#0a7d25'; }
                        if(btn){ btn.disabled = false; btn.classList.remove('disabled'); }
                    }, 'gerar');
                },
                error: function(){
                    if(localTimer){ clearInterval(localTimer); }
                    if(label){ label.textContent = 'ERRO AO INICIAR'; label.style.color = '#c53030'; }
                    if(bar){ bar.style.background = '#c53030'; }
                    if(btn){ btn.disabled = false; btn.classList.remove('disabled'); }
                }
            });
        }
    });
}


function DownloadPlanoDeCorte() {
    const csrf = document.getElementsByName("csrfmiddlewaretoken");
    swal({
        icon: 'info',
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
                innerHTML: `Deseja baixar o plano de corte atualizado?`,
            },
        },
    }).then((value) => {
        if (value === 'Sim') {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = '/app/eletrica/a1pro/PlanoDeCorteToExcel/';
            
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = 'csrfmiddlewaretoken';
            csrfInput.value = csrf[0].value;
            form.appendChild(csrfInput);

            // Passa o  (LIVRE/CONSOLIDADO) conforme a aba que tá ativa (usando a div)
            const canalInput = document.createElement('input');
            canalInput.type = 'hidden';
            canalInput.name = 'canal';
            try {
                const tipo = pegaTipo(); // '1' para livres, '2' para consolidadas
                canalInput.value = (tipo === '2') ? 'CONSOLIDADO' : 'LIVRE';
            } catch (e) {
                canalInput.value = 'LIVRE';
            }
            form.appendChild(canalInput);
            
            document.body.appendChild(form);
            form.submit();
            
            document.body.removeChild(form);
        }
    });
}

function InitProgressBarPc(id_task, onSuccessCallback = null, context = 'gerar') {
    const progressUrl = `/celery-progress/${id_task}/`;

    const progressBarMessageId = `progress-bar-message-${context}`;
    const progressBarMessageElement = document.getElementById(progressBarMessageId);
    const visualBar = context === 'gerar' ? document.getElementById('pc-bar-gerar') : null;
    const visualLabel = context === 'gerar' ? document.getElementById('pc-bar-gerar-label') : null;

    if (!progressBarMessageElement) {
        console.warn(`Elemento de mensagem de progresso não encontrado: ${progressBarMessageId}`);
        return;
    }

    CeleryProgressBar.initProgressBar(progressUrl, {
        progressBarId: null, // terei a progressbar aqui 
        progressBarMessageId: progressBarMessageId,

        onSuccess: function (_, progressBarMessageElement, result) {
            if(visualBar && visualLabel){
                visualBar.style.width = '100%';
                visualBar.style.background = 'linear-gradient(90deg,#22c55e,#16a34a)';
                visualLabel.textContent = 'CONCLUÍDO 100%';
                visualLabel.style.color = '#0a7d25';
            } else {
                progressBarMessageElement.innerHTML = 'Concluído!';
                progressBarMessageElement.style.color = '#007bff';
            }
            if(visualBar){ visualBar.style.width = '100%'; visualBar.style.background = 'linear-gradient(90deg,#22c55e,#16a34a)'; }
            if(visualLabel){ visualLabel.textContent = 'CONCLUÍDO 100%'; visualLabel.style.color = '#0a7d25'; }

            if (onSuccessCallback) {
                onSuccessCallback(id_task);
            }
        },
        onError: function (_, progressBarMessageElement, excMessage) {
            if(visualBar && visualLabel){
                visualBar.style.background = '#dc4f63';
                visualBar.style.width = '100%';
                visualLabel.textContent = 'ERRO';
                visualLabel.style.color = '#c53030';
            } else {
                progressBarMessageElement.innerHTML = `
                    <div style="color: #dc4f63;">
                        Houve um erro inesperado. Informe ao SEA o número da tarefa:<br>
                        <strong>${id_task}</strong>
                    </div>
                `;
            }
            if(visualLabel){ visualLabel.textContent = 'ERRO'; visualLabel.style.color = '#c53030'; }
            if(visualBar){ visualBar.style.background = '#dc4f63'; }
        },
        onProgress: function (_, progressBarMessageElement, progress) {
            if(visualBar && visualLabel){
                visualBar.style.width = progress.percent + '%';
                visualLabel.textContent = (progress.description ? progress.description + ' - ' : 'PROCESSANDO ') + progress.percent + '%';
                visualLabel.style.color = '#004a99';
            } else {
                progressBarMessageElement.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%;">
                        <div style="font-size: 0.9em; margin-bottom: 4px;">${progress.description || 'Processando...'}</div>
                        <div style="font-size: 1.5em; font-weight: bold;">${progress.percent}%</div>
                    </div>
                `;
                progressBarMessageElement.style.color = '#007bff';
                progressBarMessageElement.style.textAlign = 'center';
                progressBarMessageElement.style.width = '100%';
            }
        }
    });
}


function ConsolidarPlanoDeCorte(){
    const csrf = document.getElementsByName("csrfmiddlewaretoken");
    const rev = document.getElementById('rev_consolidado').value;
    if(rev === '0'){
        swal({icon:'warning', text:'A revisão está em 0. Atualize a revisão antes de consolidar.', buttons:{confirm:'Ok'}});
        return;
    }
    const btn = event ? event.currentTarget : document.querySelector('button[onclick="ConsolidarPlanoDeCorte()"]');
    const bar = document.getElementById('pc-bar-download');
    const label = document.getElementById('pc-bar-download-label');
    const bGera = document.querySelector('button[onclick="ConsolidarPlanoDeCorte()"]');

    let localTimer = null;
    function startLocalAnimation() {
        if(!bar || !label) return;
        let pct = 0;
        bar.style.width = '0%';
        label.textContent = 'INICIANDO...';
        label.style.color = '#666';
        localTimer = setInterval(()=>{
            pct += Math.random()*5 + 2; // 2-7%
            if(pct > 90) pct = 90; // segura até backend enviar
            bar.style.width = pct.toFixed(1)+'%';
            label.textContent = 'CONSOLIDANDO ' + pct.toFixed(0) + '%';
        }, 450);
    }
    swal({      
        icon: 'info',
        buttons:{       
            confirm:{text: "Sim", value: "Sim", className: "swal-button swal-button--confirm bg-danger"},
            cancel: "Não",
        },  
        content:{
            element:"span",
            attributes:{
                innerHTML: `Deseja CONSOLIDAR o plano de corte?<br>Ao confirmar a <b>${rev}</b> será <b>consolidada</b>.`,
             }
          }   
    }).then(value => {
        if(value === 'Sim'){
            if(btn){ btn.disabled = true; btn.classList.add('disabled'); }
            startLocalAnimation();
            $.ajax({
                url: "/app/eletrica/a1pro/PlanoDeCorteConsolidarLivres/",
                type: "POST",
                headers:{'X-CSRFToken':csrf[0].value},
                dataType: "json",
                success: function(data){
                    if(localTimer) clearInterval(localTimer);
                    if(data && data['task_id']){
                        InitProgressBarPc(data['task_id'], function(){
                            if(bar){ bar.style.width = '100%'; bar.style.background = 'linear-gradient(90deg,#22c55e,#16a34a)'; }
                            if(label){ label.textContent = 'CONSOLIDADO 100%'; label.style.color = '#0a7d25'; }
                            if(btn){ btn.disabled = false; btn.classList.remove('disabled'); }
                        }, 'download');
                    } else {
                        if(label){ label.textContent = 'Consolidado'; label.style.color = '#aa6b00'; }
                        if(btn){ btn.disabled = false; btn.classList.remove('disabled'); }
                    }
                         },
                error: function(){
                    if(localTimer) clearInterval(localTimer);
                    if(label){ label.textContent = 'Erro ao tentar consolidar '; label.style.color = '#c53030'; }
                    if(bar){ bar.style.background = '#c53030'; bar.style.width = '100%'; }
                    if(btn){ btn.disabled = false; btn.classList.remove('disabled'); }
                 }
                     })
                     }
                 });
}
/* ------------------------------------------------------------------------------------------------------------------ */













/* ------------------------------------------------ ABA DADOS DOCS -------------------------------------------------- */



/* ------------------------------------------------------------------------------------------------------------------ */










/* ------------------------------------------------ ABAS PLANO DE CORTE --------------------------------------------- */
function SearchCabosInCoilPlanoDeCorte(id_pk){
    debugger;
}

function setupPagination(containerSelector, itemSelector, prevBtnId, nextBtnId, indicatorId, itemsPerPage = 65) {
    //pega o opção das páginas e joga bonitinho uma para as livres e outra para a consolidadas
    //pré configurada para 65 itens dividitos em px totais da tela 
    //cada if tem um valor único da
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const items = Array.from(container.querySelectorAll(itemSelector));
    const totalPages = Math.ceil(items.length / itemsPerPage);
    let currentPage = 1;

    const pageIndicator = document.getElementById(indicatorId);
    const prevButton = document.getElementById(prevBtnId);
    const nextButton = document.getElementById(nextBtnId);

    function showPage(page) {
        items.forEach((item, index) => {
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            item.classList.toggle('d-none', !(index >= start && index < end));
        });
        if (pageIndicator) pageIndicator.textContent = `Página ${page} de ${totalPages}`;
        if (prevButton) prevButton.disabled = page === 1;
        if (nextButton) nextButton.disabled = page === totalPages;
    }

    if (prevButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showPage(currentPage);
            }
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                showPage(currentPage);
            }
        });
    }

    showPage(currentPage);
}

document.addEventListener('DOMContentLoaded', function () {
    setupPagination('#bobinas-container', '.bobina-item', 'prevPage', 'nextPage', 'pageIndicator');
    setupPagination('#bobinas-container1', '.bobina-item', 'prevPage1', 'nextPage1', 'pageIndicator1');
});

function onclickPlanoC(id_pk){
    debugger;
    SearchSpecCoilPlanoDeCorte(id_pk)
    FiltraCaboseLista(id_pk)
}


document.addEventListener('DOMContentLoaded', function () {
    const abaLivres = document.querySelector('a[href="#bobinas-livres"]');
    if (abaLivres) {
        abaLivres.addEventListener('click', function () {
            limparCamposBobina('livre_');
            limparCamposBobina('consolidada_')
            limparCabosContainers();
            
        });
    }
    const abaConsolidadas = document.querySelector('a[href="#bobinas-consolidadas"]');
    if (abaConsolidadas) {
        abaConsolidadas.addEventListener('click', function () {
            limparCamposBobina('livre_');
            limparCamposBobina('consolidada_');
            limparCabosContainers();
        });
}
});

function limparCamposBobina(prefix) {
    const campos = [
        'isolacao', 'classe', 'formacao', 'tipo-formacao',
        'codigo-a1', 'secao', 'fabricante', 'tamanho-total', 'corte-cabo'
    ];
    campos.forEach(id => {
        const campo = document.getElementById(prefix + id);
        if (campo) campo.value = '';
    });
}

function limparCabosContainers(){
    const containers = ['cabos-container', 'cabos-container1', 'nomeB', 'nomeA'];
    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerHTML = '';
    });
}
function SearchSpecCoilPlanoDeCorte(id_pk){
    debugger;
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/PlanoDeCorteSearchSpecCoil/",
        dataType: 'json',
        data: {'id_pk': id_pk},
        success: function (data){
            document.getElementById('livre_isolacao').value = data["ISOLAÇÃO"];
            document.getElementById('livre_classe').value = data["CLASSEISOLAÇÃO"];
            document.getElementById('livre_formacao').value = data["FORMAÇÃO"];
            document.getElementById('livre_tipo-formacao').value = data["TIPO FORMAÇÃO"];
            document.getElementById('livre_secao').value = data["SEÇÃO"];
            document.getElementById('livre_codigo-a1').value = data["CÓDIGO MATERIAL"];
            document.getElementById('livre_fabricante').value = data["FABRICANTE"];
            document.getElementById('livre_tamanho-total').value = data["TAMANHO_TOTAL"];
            document.getElementById('livre_corte-cabo').value = data["CORTE_TOTAL"];
            document.getElementById('consolidada_isolacao').value = data["ISOLAÇÃO"];
            document.getElementById('consolidada_classe').value = data["CLASSEISOLAÇÃO"];
            document.getElementById('consolidada_formacao').value = data["FORMAÇÃO"];
            document.getElementById('consolidada_tipo-formacao').value = data["TIPO FORMAÇÃO"];
            document.getElementById('consolidada_secao').value = data["SEÇÃO"];
            document.getElementById('consolidada_codigo-a1').value = data["CÓDIGO MATERIAL"];
            document.getElementById('consolidada_fabricante').value = data["FABRICANTE"];
            document.getElementById('consolidada_tamanho-total').value = data["TAMANHO_TOTAL"];
            document.getElementById('consolidada_corte-cabo').value = data["CORTE_TOTAL"];
            debugger;
        },
    })
}

document.addEventListener("DOMContentLoaded", function () {
    const bobinas = document.querySelectorAll('.bobina-item');

    bobinas.forEach(item => {
        item.addEventListener('click', function () {
        bobinas.forEach(b => b.classList.remove('selected'));

        // Adiciona a classe "selected" ao item clicado
        this.classList.add('selected');
        });
    });
});

function ajustarColunas() {
  
    const container = document.getElementById("bobinas-container");
    const container1 = document.getElementById("bobinas-container1");
    const container2 = document.getElementById("bobinas-container2")
    const container3 = document.getElementById("bobinas-container3")
    if (!container || !container1 || !container2 || !container3) {
        return; //
    }
    const largura = container.clientWidth || window.innerWidth;

    if (largura > 1344) {
      container.style.gridTemplateColumns = `repeat(7, 220px)`;
      container1.style.gridTemplateColumns = `repeat(7, 220px)`;
      container2.style.gridTemplateColumns = `repeat(7, 240px)`;
      container3.style.gridTemplateColumns = `repeat(7, 240px)`;
    } else {
      container.style.gridTemplateColumns = `repeat(5, 240px)`;
      container1.style.gridTemplateColumns = `repeat(5, 240px)`;
      container2.style.gridTemplateColumns = `repeat(5, 240px)`;
      container3.style.gridTemplateColumns = `repeat(5, 240px)`;

    }
  }
    window.addEventListener('load', ajustarColunas);
    window.addEventListener('resize', ajustarColunas);
    // Chamada imediata se os elementos já estiverem no DOM (script carregado após HTML dos grids)
    if (document.getElementById('bobinas-container') || document.getElementById('bobinas-container1')){
            ajustarColunas();

    }
    
  

function fixZoomDiv() {
    const container = document.getElementById('bobinas-container');
    // Só aplica se o zoom for diferente de 100%
    if (window.devicePixelRatio > 1) {
        const scale = 1.1 / window.devicePixelRatio;
        container.style.transform = `scale(${scale})`;
        container.style.transformOrigin = 'top left';
    } else {
        container.style.transform = '';
        container.style.transformOrigin = '';
    }
}

window.addEventListener('resize', fixZoomDiv);
window.addEventListener('load', fixZoomDiv);


window.onload = ChangeCheckBoxTypeDistancia('not-value')

function ChangeCheckBoxTypeDistancia(value){
    var AllCheckBox = document.querySelectorAll('[name="OptionsDistListCabos"]')
    for (let i = 0; i < AllCheckBox.length; i++){
        if(AllCheckBox[i].value === value){
            AllCheckBox[i].checked = true
            $('#ContentDist-'+value).show()
        }
        else{
            AllCheckBox[i].checked = false
            $('#ContentDist-'+AllCheckBox[i].value).hide()
        }
    }
}





function SendValuesToRegistration(action) {
        debugger;
        const csrf = document.getElementsByName("csrfmiddlewaretoken")
        var text_swal = action !== 'update' ? `Deseja gerar o plano de corte?` +
            '<br> ao confirmar a <b>revisão 0</b> será <b>emitida</b>!' : `Deseja realmente <b>atualizar</b> o plano de corte?!`;
        var dict_update = '';
        if (action === 'update') {
            dict_update = readCoilsAndCables()
            swal({
                icon: 'info',
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
                    $.ajax({
                        url: "/app/eletrica/a1pro/PlanoDeCorte/Render/", // Caminho do Ajax
                        type: "POST", // http method
                        headers:{'X-CSRFToken':csrf[0].value},
                        dataType: "json",
                        data: {'dict': JSON.stringify(dict_update)}, // Envia form pela solicitação do POST
                        beforeSend: function(){
                            document.getElementById("progress-box-plan-corte").hidden = false;
                        },
                        success: function (data) {
                            var progressUrl = `/celery-progress/${data["task_id"]}/`
                            CeleryProgressBarPlanCorte.initProgressBar(progressUrl, {
                                progressBarId: 'progress-bar-plan-corte',
                                progressBarMessageId: 'progress-bar-message-plan-corte',
                                onSuccess: customSucess,
                                onError: customError,
                                onProgress: onProgressCustom
                            })

                            function customSucess(progressBarElement, progressBarMessageElement, result){
                                let chave = Object.keys(result)[0];
                                let valor = result[chave];

                                if (chave === 'success') {
                                    progressBarMessageElement.innerHTML = "Sucesso";
                                    progressBarElement.style.backgroundColor = '#76ce60';

                                    // Argumentos possíveis (tipo, mensagem, timeout em milissegundos)
                                    messageNotification(chave, valor);
                                } if (chave === 'info') {
                                    progressBarMessageElement.innerHTML = "Sucesso";
                                    progressBarElement.style.backgroundColor = '#76ce60';
                                    swalAlert(false, valor[1], 'success', false);
                                    $('div.swal-text').addClass('font_size_0_8 list-tags-cabo-container')

                                    // Faz download do arquivo
                                    let diretorioURL = valor[0].split('\\');
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
                                    document.getElementById("progress-box-plan-corte").hidden = true;

                                    if (chave === 'success' || chave === 'info') {
                                        window.location.reload(true);
                                    }
                                }, 3000);
                            }

                            function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                                progressBarElement.style.backgroundColor = '#68a9ef';
                                progressBarMessageElement.innerHTML = progress.description || "";
                                progressBarElement.style.width = progress.percent + "%";
                            }

                            function customError(progressBarElement, progressBarMessageElement, excMessage) {
                                let chave = Object.keys(excMessage)[0];
                                let valor = excMessage[chave];
                                progressBarMessageElement.innerHTML = "Houve um erro inesperado!";
                                progressBarElement.style.backgroundColor = '#dc4f63';

                                // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
                                swalAlert(false, valor, chave, false);
                            }
                        },
                        failure: function () {
                            // Argumentos possíveis (tipo, mesagem, timeout(milisegundos))
                            messageNotification('error','Algo deu errado! verifique e tente novamente.')
                        }
                    })
                }
            })
        }
        if (action !== 'update') {
            dict_update = action
            swal({
                icon: 'info',
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
                    $.ajax({
                        url: "/app/eletrica/a1pro/PlanoDeCorte/Render/", // Caminho do Ajax
                        type: "POST", // http method
                        headers:{'X-CSRFToken':csrf[0].value},
                        dataType: "json",
                        data: {'dict': JSON.stringify(dict_update)}, // Envia form pela solicitação do POST
                        beforeSend: function(){
                            document.getElementById("progress-box-plan-corte").hidden = false;
                        },
                        success: function (data) {

                            function customSucess(progressBarElement, progressBarMessageElement, result){
                                    let chave = Object.keys(result)[0];
                                    let valor = result[chave];

                                    if (chave === 'success') {
                                        progressBarMessageElement.innerHTML = "Sucesso";
                                        progressBarElement.style.backgroundColor = '#76ce60';

                                        // Chama o swal passando os seguintes parametros swalAlert
                                        swalAlert(false, valor[1], 'success', false);
                                        $('div.swal-text').addClass('font_size_0_8 list-tags-cabo-container')

                                        // Faz download do arquivo
                                        let diretorioURL = valor[0].split('\\');
                                        window.open("/app/eletrica/a1pro/PlanoDeCorte/Render/DownloadPlanoDeCorte/" + diretorioURL[diretorioURL.length-1], '_self');

                                    } else {
                                        progressBarMessageElement.innerHTML = "Houve um erro inesperado!";
                                        progressBarElement.style.backgroundColor = '#dc4f63';
                                        if (Array.isArray(valor)) {
                                            valor = valor.join(', \n');
                                        }

                                        // Chama o swal passando os seguintes parametros swalAlert
                                        swalAlert(false, valor, chave, false);
                                        $('div.swal-text').addClass('font_size_0_8 list-tags-cabo-container')
                                    }

                                    setTimeout(() => {
                                        document.getElementById("progress-box-plan-corte").hidden = true;

                                        if (chave === 'success' || chave === 'info') {
                                            window.location.reload(true);
                                        }
                                    }, 3000);
                                }

                                function onProgressCustom(progressBarElement, progressBarMessageElement, progress) {
                                    progressBarElement.style.backgroundColor = '#68a9ef';
                                    progressBarMessageElement.innerHTML = progress.description || "";
                                    progressBarElement.style.width = progress.percent + "%";
                                }

                                function customError(progressBarElement, progressBarMessageElement, excMessage) {
                                    let chave = Object.keys(excMessage)[0];
                                    let valor = excMessage[chave];
                                    progressBarMessageElement.innerHTML = "Houve um erro inesperado!";
                                    progressBarElement.style.backgroundColor = '#dc4f63';

                                    // Chama o swal passando os seguintes parametros swalAlert
                                    swalAlert(false, valor, chave, false);
                                }
                            if(data['status'] === true){
                                let progressUrl = `/celery-progress/${data["task_id"]}/`
                                CeleryProgressBarPlanCorte.initProgressBar(progressUrl, {
                                    progressBarId: 'progress-bar-plan-corte',
                                    progressBarMessageId: 'progress-bar-message-plan-corte',
                                    onSuccess: customSucess,
                                    onError: customError,
                                    onProgress: onProgressCustom
                                })

                            }else {
                                swalAlert('Problema na geração', data['mensage'], 'error', false)
                            }

                        },
                        failure: function () {
                            // Argumentos possíveis
                            messageNotification('error','Algo deu errado! verifique e tente novamente.')
                        }
                    })
                }
            })
        }
    }



function FiltraCaboseLista(id_pk){
    debugger;
    $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/CabosPlanoDeCorte/" + id_pk + "/",
        dataType: 'json',
        data: {},
        success: function (data){
            SelecionaCabosPL(data['DatasCarga'])
        },
        failure: function(error){
        },
    })
}


function SelecionaCabosPL(all_nomes){
    let html = '';
    for(let i = 0; i < all_nomes.length; i++){
        html += `<div class="cabo-card" data-id="${all_nomes[i]['id']}" onclick="FillPC(${all_nomes[i]['id']});selectCaboCard(this)" 
                    style="font-size: 11px; display: flex; align-items: center; gap: 10px; justify-content: space-between;">
                    <b>${all_nomes[i]['coil']}</b>
                    <small class="text-muted" style="margin-left:10px;">
                    Comprimento: <span class="text-success">${all_nomes[i]['compri']}</span>
            </small>
                </div>`;
        let teste =  `<b>${all_nomes[i]['isolacao']}</b>`

    }
    document.getElementById('cabos-container').innerHTML = html;
    document.getElementById('cabos-container1').innerHTML = html;
    
    const elementoNomeB = document.getElementById('nomeB');
    const elementoTeste = document.getElementById('nomeA');
    
    if (elementoNomeB) elementoNomeB.innerHTML = teste;
    if (elementoTeste) elementoTeste.innerHTML = teste;
}

function selectCaboCard(card) {
    document.querySelectorAll('.cabo-card').forEach(el => el.classList.remove('selected'));
    card.classList.add('selected');
}


// ========== FUNÇÕES DE FILTRO PARA BACKEND ==========

function getActivePrefix() {
    const tabLivres = document.getElementById('bobinas-livres');
    const tabConsolidadas = document.getElementById('bobinas-consolidadas');
    if (tabConsolidadas && tabConsolidadas.classList.contains('active')) return 'consolidada_';
    return 'livre_';
}

function OnClickFiltroIsolacao(valorIsolacao) {
    console.log('Filtro Isolação selecionado:', valorIsolacao);
    const prefix = getActivePrefix();
    if (valorIsolacao !== "0") {
        enviarFiltroParaBackend('isolacao', valorIsolacao);
        highlightActiveFilter(prefix + 'cl_isolacao_bobina');
    } else {
        removeHighlight(prefix + 'cl_isolacao_bobina');
    }
}

function OnClickFiltroFormacao(valorFormacao) {
    console.log('Filtro Formação selecionado:', valorFormacao);
    const prefix = getActivePrefix();
    // Obtém o elemento select real (alguns templates usam ids diferentes)
    const formacaoSelect = document.getElementById(prefix + 'formacao_bobina') || document.getElementById(prefix + 'isolacao_bobina');
    // Pega o texto da opção selecionada para enviar ao backend (ex.: "1x1")
    const selectedText = formacaoSelect && formacaoSelect.selectedIndex >= 0
        ? (formacaoSelect.options[formacaoSelect.selectedIndex].text || '').trim()
        : valorFormacao;

    if (valorFormacao !== "0") {
        // Envia o texto legível para o backend (em vez do id)
        enviarFiltroParaBackend('formacao', selectedText);
        highlightActiveFilter(prefix + 'formacao_bobina');
        
        // Agrupa bobinas com a mesma formação
        agruparBobinasPorFormacao(selectedText);
    } else {
        removeHighlight(prefix + 'formacao_bobina');
        // Remove os grupos quando limpar filtro
        removerAgrupamentoBobinas();
    }
}

function OnClickFiltroSecao(valorSecao) {
    console.log('Filtro Seção selecionado:', valorSecao);
    const prefix = getActivePrefix();
    if (valorSecao !== "0") {
        enviarFiltroParaBackend('secao', valorSecao);
        highlightActiveFilter(prefix + 'secao_bobina');
    } else {
        removeHighlight(prefix + 'secao_bobina');
    }
}

function OnClickFiltroOrigem(valorOrigem) {
    console.log('Filtro Origem selecionado:', valorOrigem);
    const prefix = getActivePrefix();
    if (valorOrigem !== "0") {
        enviarFiltroParaBackend('origem', valorOrigem);
        highlightActiveFilter(prefix + 'origem_bobina');
    } else {
        removeHighlight(prefix + 'origem_bobina');
    }
}

function OnClickFiltroComprimento(valorComprimento) {
    console.log('Filtro Comprimento selecionado:', valorComprimento);
    const prefix = getActivePrefix();
    if (valorComprimento !== "0") {
        enviarFiltroParaBackend('comprimento', valorComprimento);
        highlightActiveFilter(prefix + 'comp_bobina');
    } else {
        removeHighlight(prefix + 'comp_bobina');
    }
}

function pegaTipo(){
    const tabLivres = document.getElementById('bobinas-livres');
    const tabConsolidadas = document.getElementById('bobinas-consolidadas');
    if (tabLivres && tabLivres.classList.contains('active'))
        return document.getElementById("bobinas-livres").dataset.valor;
    if (tabConsolidadas && tabConsolidadas.classList.contains('active')) 
        return document.getElementById("bobinas-consolidadas").dataset.valor;


}

async function enviarFiltroParaBackend(tipoFiltro, valor) {
    try {
        const teste = pegaTipo()
        
        const response = await fetch('/app/eletrica/a1pro/PlanoDeCorte/Filtrar/',
            
            {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
            },
            body: JSON.stringify({
                tipo_filtro: tipoFiltro,
                valor_filtro: valor,
                area: getCookie('Area'),
                os: getCookie('OS'),
                teste : teste
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('Filtro aplicado com sucesso:', data);
            atualizarBobinasNaTela(data.bobinas_filtradas);
        } else {
            console.error('Erro ao aplicar filtro:', response.status);
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
        
    }
}

function highlightActiveFilter(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
        select.style.backgroundColor = '#e6fff2';
        select.style.borderColor = '#E0E0E0';
        select.style.fontWeight = 'bold';
    }
}

function removeHighlight(selectId) {
    const select = document.getElementById(selectId);
    if (select) {
        select.style.backgroundColor = '';
        select.style.borderColor = '';
        select.style.fontWeight = '';
    }
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}


function atualizarBobinasNaTela(bobinas){
  const teste = pegaTipo()

  const containerId = teste === '2' ? 'bobinas-container1' : 'bobinas-container';
  const container = document.getElementById(containerId);
  if(!container) return;
  container.innerHTML = '';
  bobinas.forEach(bobina => {
    const div = document.createElement('div');
    div.className = 'p-2 bg-light border rounded text-center bobina-item align-items-center';
    div.onclick = () => onclickPlanoC(bobina.id);
    div.style.cssText = 'font-size: 14px; display: flex; justify-content: space-around; width: 15rem';
    div.setAttribute('data-codigo-a1', bobina.codigo || '');
    const descricaoValue = Array.isArray(bobina.descricoes) ? bobina.descricoes.join(' | ') : (bobina.descricao || '');
    div.setAttribute('data-descricao', descricaoValue);
    div.setAttribute('data-valor', bobina.id);
    div.innerHTML = `${bobina.codigo}<br><small class="text-muted">Comp. restante: <span class="text-success">${bobina.comprimento}</span></small>`;
    container.appendChild(div);
  });
  try {
    if(teste === '2'){
      setupPagination('#bobinas-container1', '.bobina-item', 'prevPage1', 'nextPage1', 'pageIndicator1');
    } else {
      setupPagination('#bobinas-container', '.bobina-item', 'prevPage', 'nextPage', 'pageIndicator');
    }
  } catch(e){
    console.warn('Falha para calcular a paginação:', e);
  }
}


function limparFiltros(prefix = '') {
    ['cl_isolacao_bobina', 'formacao_bobina', 'secao_bobina', 'origem_bobina', 'comp_bobina', 'busca_geral', 'descricao_bobina'].forEach(id => {
        const el = document.getElementById(prefix + id) || document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') {
            el.value = '0';
            removeHighlight(prefix + id);
        } else if (el.tagName === 'INPUT') {
            el.value = '';
        }
    });
    // Reaplica filtro vazio
    enviarFiltroParaBackend('origem', '0');
}



document.addEventListener('DOMContentLoaded', function() {
    const CONFIG = {
        searchInputId: 'busca_geral',       // base id, com o prefix
        bobinasSelector: '.bobina-item',
        minChars: 0,
        debounceTime: 100
    };
    const CONFIGB = {
        searchInputId: 'descricao_bobina',  // base id, com o prefix
        bobinasSelector: '.bobina-item',
        minChars: 0,
        debounceTime: 100
    };

    initSearchFilter();
    initCharacteristicFilters(); // filtro por caracteristicas 
    initDescricaoFilter();

    function initCharacteristicFilters() {
        function bind(prefix) {
            const clIsolacaoSelect = document.getElementById(prefix + 'cl_isolacao_bobina');
            if (clIsolacaoSelect) clIsolacaoSelect.addEventListener('change', applyFilters);
            const formacaoSelect = document.getElementById(prefix + 'formacao_bobina') || document.getElementById(prefix + 'isolacao_bobina');
            if (formacaoSelect) formacaoSelect.addEventListener('change', applyFilters);
            const secaoSelect = document.getElementById(prefix + 'secao_bobina');
            if (secaoSelect) secaoSelect.addEventListener('change', applyFilters);
            const origemSelect = document.getElementById(prefix + 'origem_bobina');
            if (origemSelect) origemSelect.addEventListener('change', applyFilters);
            const compSelect = document.getElementById(prefix + 'comp_bobina');
            if (compSelect) compSelect.addEventListener('change', applyFilters);
        }
        bind('livre_');
        bind('consolidada_');
    } // fecha da função initCharacteristicFilters()
    /**
     */
    function applyFilters() {
        const bobinas = document.querySelectorAll(CONFIG.bobinasSelector);
        const prefix = getActivePrefix();
        const desc = document.getElementById(prefix + CONFIGB.searchInputId);

        const clIsolacao = document.getElementById(prefix + 'cl_isolacao_bobina')?.value || "0";
        // pega texto da opção selecionada para formação (ex '1x1') em vez do id
        const formacaoSelectForFilter = document.getElementById(prefix + 'formacao_bobina') || document.getElementById(prefix + 'isolacao_bobina');
        const formacao = (formacaoSelectForFilter && formacaoSelectForFilter.selectedIndex >= 0)
            ? (formacaoSelectForFilter.options[formacaoSelectForFilter.selectedIndex].text || '').trim()
            : (document.getElementById(prefix + 'isolacao_bobina')?.value || "0");
        const secao = document.getElementById(prefix + 'secao_bobina')?.value || "0";
        const origem = document.getElementById(prefix + 'origem_bobina')?.value || "0";
        const comp = document.getElementById(prefix + 'comp_bobina')?.value || "0";
        // pega o valor do inpuT de descr (CONFIGB.searchInputId = 'descricao_bobina')

        // sem filtro ativo ele zera 
        if (clIsolacao === "0" && formacao === "0" && secao === "0" && origem === "0" && comp === "0") {
            showAllBobinas(bobinas);
            return;
        }

        let visibleCount = 0;

        bobinas.forEach(bobina => {
            const bobinText = bobina.textContent.toLowerCase();
            let shouldShow = true;

            if (clIsolacao !== "0" && !bobinText.includes(clIsolacao.toLowerCase())) {
                shouldShow = false;
            }
            if (formacao !== "0" && !bobinText.includes(formacao.toLowerCase())) {
                shouldShow = false;
            }
            if (secao !== "0" && !bobinText.includes(secao.toLowerCase())) {
                shouldShow = false;
            }
            if (origem !== "0" && !bobinText.includes(origem.toLowerCase())) {
                shouldShow = false;
            }
            if (comp !== "0" && !bobinText.includes(comp.toLowerCase())) {
                shouldShow = false;
            }
            if (shouldShow) {
                showBobina(bobina);
                visibleCount++;
            } else {
                hideBobina(bobina);
            }
        });

        console.log(`Filtros - ${visibleCount} bobinas`);
        console.log(`Filtros ativos:`, {
            'Classe Isolação': clIsolacao,                                                                                                                                              
            'Formação': formacao,
            'Seção': secao,
            'Origem': origem,
            'Comprimento': comp,
            'Descrição': desc
        });
    } // Fecha da função initCharacteristicFilters()
    
    function initSearchFilter() {
        const inputs = [
            document.getElementById('livre_' + CONFIG.searchInputId),
            document.getElementById('consolidada_' + CONFIG.searchInputId)
        ].filter(Boolean);
        if (inputs.length === 0) {
            console.warn('Campo de busca não encontrado:', CONFIG.searchInputId);
            return;
        }

        let debounceTimer;
        inputs.forEach(searchInput => {
            searchInput.addEventListener('input', function() {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(() => {
                    performSearch(this.value);
                }, CONFIG.debounceTime);
            });
        });

        console.log(' Filtro de bobinas inicializado');
    }

    // DESCRICAO CAMPO (campo separado, comportamento análogo ao busca_geral)
    function initDescricaoFilter() {
        const inputs = [
            document.getElementById('livre_' + CONFIGB.searchInputId),
            document.getElementById('consolidada_' + CONFIGB.searchInputId)
        ].filter(Boolean);
        if (inputs.length === 0) {
            console.warn('Campo de descrição não encontrado:', CONFIGB.searchInputId);
            return;
        }
        // tempo de pausa entre as rodadas 
        let debounceTimerDesc;
        inputs.forEach(descInput => {
            descInput.addEventListener('input', function() {
                clearTimeout(debounceTimerDesc);
                const value = this.value;
                debounceTimerDesc = setTimeout(() => {
                    if (value && value.trim().length >= 2) {
                        console.debug('Descricao input: solicitando filtro ao backend ->', value.trim());
                        enviarFiltroParaBackend('descricao', value.trim());
                    } else if (!value || value.trim().length === 0) {
                        console.debug('Descricao input vazio: recarregando lista completa');
                        enviarFiltroParaBackend('origem', '0');
                    } else {
                        performDescriptionSearch(value);
                    }
                }, CONFIGB.debounceTime);
            });
        });

        console.log('Filtro de descrição inicializado');
    }

    /**
     * 
     * @param {string} searchTerm - 
     */
    function performSearch(searchTerm) {                  //remove textos e espaços
        const cleanTerm = searchTerm.toLowerCase().trim();
        const containerId = pegaTipo() === '2' ? 'bobinas-container1' : 'bobinas-container';
        const container = document.getElementById(containerId);
        const bobinas = container ? container.querySelectorAll(CONFIG.bobinasSelector) : document.querySelectorAll(CONFIG.bobinasSelector);
        
        if (cleanTerm.length < CONFIG.minChars) {
            showAllBobinas(bobinas);
            return;
        }

        let visibleCount = 0;
        
        bobinas.forEach(bobina => {                             
            // Pega o código A1 da bobina pelo atributo data-codigo-a1
            const codigoA1 = bobina.getAttribute('data-codigo-a1');
            const codigoA1Lower = codigoA1 ? codigoA1.toLowerCase().trim() : '';
            const isMatch = codigoA1Lower.includes(cleanTerm);         
        
            if (isMatch) {
                showBobina(bobina);
                visibleCount++;
            } else {
                hideBobina(bobina);
            }
        });
    }

    function performDescriptionSearch(searchTerm) {
        const cleanTerm = searchTerm.toLowerCase().trim();
        const containerId = pegaTipo() === '2' ? 'bobinas-container1' : 'bobinas-container';
        const container = document.getElementById(containerId);
        const bobinas = container ? container.querySelectorAll(CONFIGB.bobinasSelector) : document.querySelectorAll(CONFIGB.bobinasSelector);

        if (cleanTerm.length < CONFIGB.minChars) {
            showAllBobinas(bobinas);
            return;
        }

        let visibleCount = 0;

        bobinas.forEach(bobina => {
            const descricao = bobina.getAttribute('data-descricao') || '';
            const descricaoLower = descricao.toLowerCase().trim();
            const isMatch = descricaoLower.includes(cleanTerm);

            if (isMatch) {
                showBobina(bobina);
                visibleCount++;
            } else {
                hideBobina(bobina);
            }
        });
    }

    /**
     * 
     * @param {HTMLElement} bobina          // pega o elemento HTML da bobina 
     */
    function showBobina(bobina) {
        bobina.style.display = 'flex';               //deixa visível 
        bobina.style.opacity = '1';                  
        bobina.style.transform = 'scale(1)';
    }

    /**
     * 
     * @param {HTMLElement} bobina  
     */
    function hideBobina(bobina) {
        bobina.style.display = 'none';                    //deixa invisível
        bobina.style.opacity = '0.5';
        bobina.style.transform = 'scale(0.95)';
    }

    /**
     * 
     * @param {NodeList} bobinas //Coleção de elementos bobina do DOM
     */
    function showAllBobinas(bobinas) {
        bobinas.forEach(bobina => showBobina(bobina));
    }


    function retorna(){
        return 1;
    }


});

/* ================================================ ABA TESTE CLAUDE ================================================ */

// Calculadora Avançada
function calcularExpressao() {
    const input = document.getElementById('calc-input').value;
    const result = document.getElementById('calc-result');
    
    try {
        // Substitui operadores especiais
        let expr = input.replace(/\^/g, '**'); // Potência
        expr = expr.replace(/√/g, 'Math.sqrt'); // Raiz quadrada
        expr = expr.replace(/π/g, 'Math.PI'); // Pi
        expr = expr.replace(/e/g, 'Math.E'); // Euler
        
        // Adiciona suporte para funções trigonométricas
        expr = expr.replace(/sin\(/g, 'Math.sin(');
        expr = expr.replace(/cos\(/g, 'Math.cos(');
        expr = expr.replace(/tan\(/g, 'Math.tan(');
        expr = expr.replace(/log\(/g, 'Math.log10(');
        expr = expr.replace(/ln\(/g, 'Math.log(');
        
        const calculado = eval(expr);
        result.innerHTML = `
            <strong>Resultado:</strong> ${calculado}<br>
            <small class="text-muted">Expressão: ${input}</small>
        `;
        result.style.color = '#155724';
        result.style.backgroundColor = '#d4edda';
    } catch (error) {
        result.innerHTML = `
            <strong>Erro:</strong> Expressão inválida<br>
            <small class="text-muted">Digite uma expressão matemática válida (ex: 2+3*4, sin(45), √16)</small>
        `;
        result.style.color = '#721c24';
        result.style.backgroundColor = '#f8d7da';
    }
}

// Gerador de Dados
function gerarDados() {
    const type = document.getElementById('data-type').value;
    const result = document.getElementById('data-result');
    let dados = [];
    
    switch(type) {
        case 'names':
            const nomes = ['Ana Silva', 'Carlos Santos', 'Maria Oliveira', 'João Pereira', 'Fernanda Costa', 
                          'Roberto Lima', 'Juliana Alves', 'Pedro Rodrigues', 'Camila Ferreira', 'Lucas Martins'];
            dados = nomes.sort(() => 0.5 - Math.random()).slice(0, 5);
            break;
        case 'emails':
            const dominios = ['gmail.com', 'outlook.com', 'empresa.com.br', 'hotmail.com'];
            for(let i = 0; i < 5; i++) {
                const usuario = `user${Math.floor(Math.random()*9999)}`;
                const dominio = dominios[Math.floor(Math.random() * dominios.length)];
                dados.push(`${usuario}@${dominio}`);
            }
            break;
        case 'dates':
            for(let i = 0; i < 5; i++) {
                const start = new Date(2020, 0, 1);
                const end = new Date();
                const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                dados.push(randomDate.toLocaleDateString('pt-BR'));
            }
            break;
        case 'numbers':
            for(let i = 0; i < 10; i++) {
                dados.push(Math.floor(Math.random() * 10000));
            }
            break;
    }
    
    result.innerHTML = dados.map(item => `<div class="mb-1">${item}</div>`).join('');
}

// Análise de Texto
function analisarTexto() {
    const text = document.getElementById('text-input').value;
    const result = document.getElementById('text-analysis');
    
    if(!text.trim()) {
        result.innerHTML = '<em>Digite um texto para análise...</em>';
        return;
    }
    
    const palavras = text.trim().split(/\s+/).length;
    const caracteres = text.length;
    const caracteresNoEspaco = text.replace(/\s/g, '').length;
    const paragrafos = text.split('\n').filter(p => p.trim()).length;
    const frases = text.split(/[.!?]+/).filter(f => f.trim()).length;
    
    // Palavras mais comuns
    const palavrasLimpas = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
    const frequencia = {};
    palavrasLimpas.forEach(palavra => {
        if(palavra.length > 2) { // Ignora palavras muito pequenas
            frequencia[palavra] = (frequencia[palavra] || 0) + 1;
        }
    });
    
    const topPalavras = Object.entries(frequencia)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([palavra, freq]) => `${palavra}: ${freq}x`);
    
    result.innerHTML = `
        <div class="row">
            <div class="col-md-6">
                <strong>Estatísticas:</strong><br>
                • Palavras: ${palavras}<br>
                • Caracteres: ${caracteres}<br>
                • Sem espaços: ${caracteresNoEspaco}<br>
                • Parágrafos: ${paragrafos}<br>
                • Frases: ${frases}
            </div>
            <div class="col-md-6">
                <strong>Palavras frequentes:</strong><br>
                ${topPalavras.map(p => `• ${p}`).join('<br>')}
            </div>
        </div>
    `;
}

// Automação DOM
function animarElementos() {
    const demo = document.querySelector('#automation-demo .demo-box');
    if(!demo) return;
    
    // Sequência de animações
    demo.style.transform = 'rotate(360deg) scale(1.5)';
    demo.style.background = `hsl(${Math.random() * 360}, 70%, 50%)`;
    
    setTimeout(() => {
        demo.style.transform = 'rotate(0deg) scale(1)';
        demo.style.borderRadius = demo.style.borderRadius === '50%' ? '8px' : '50%';
    }, 1000);
}

function alterarTema() {
    const demo = document.getElementById('automation-demo');
    const isDark = demo.classList.contains('dark-theme');
    
    if(isDark) {
        demo.classList.remove('dark-theme');
        demo.style.background = '#f8f9fa';
        demo.style.color = '#333';
    } else {
        demo.classList.add('dark-theme');
        demo.style.background = '#2d3436';
        demo.style.color = '#fff';
    }
    
    // Adiciona efeito visual
    demo.style.transition = 'all 0.5s ease';
}

// Gerador de Código
function gerarCodigo() {
    const type = document.getElementById('code-type').value;
    const result = document.getElementById('code-result');
    let codigo = '';
    
    switch(type) {
        case 'function':
            codigo = `// Função JavaScript exemplo
function processarDados(dados) {
    return dados
        .filter(item => item.ativo)
        .map(item => ({
            id: item.id,
            nome: item.nome.toUpperCase(),
            processado: new Date().toISOString()
        }))
        .sort((a, b) => a.nome.localeCompare(b.nome));
}

// Uso:
const resultado = processarDados(meusDados);`;
            break;
        case 'class':
            codigo = `# Classe Python exemplo
class GerenciadorTarefas:
    def __init__(self):
        self.tarefas = []
        self.contador = 0
    
    def adicionar_tarefa(self, descricao, prioridade='normal'):
        self.contador += 1
        tarefa = {
            'id': self.contador,
            'descricao': descricao,
            'prioridade': prioridade,
            'concluida': False,
            'criada_em': datetime.now()
        }
        self.tarefas.append(tarefa)
        return tarefa
    
    def listar_pendentes(self):
        return [t for t in self.tarefas if not t['concluida']]`;
            break;
        case 'sql':
            codigo = `-- Query SQL exemplo
SELECT 
    p.nome AS produto,
    c.nome AS categoria,
    SUM(v.quantidade) AS total_vendido,
    AVG(v.preco_unitario) AS preco_medio,
    COUNT(v.id) AS num_vendas
FROM vendas v
INNER JOIN produtos p ON v.produto_id = p.id
INNER JOIN categorias c ON p.categoria_id = c.id
WHERE v.data_venda >= DATE('now', '-30 days')
GROUP BY p.id, c.id
HAVING total_vendido > 10
ORDER BY total_vendido DESC
LIMIT 20;`;
            break;
        case 'css':
            codigo = `.card-moderna {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 
        0 10px 25px rgba(0, 0, 0, 0.1),
        0 4px 10px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    color: white;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateY(0);
}

.card-moderna:hover {
    transform: translateY(-8px);
    box-shadow: 
        0 20px 40px rgba(0, 0, 0, 0.15),
        0 8px 20px rgba(0, 0, 0, 0.15);
}

.card-moderna::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: inherit;
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.3s;
}`;
            break;
    }
    
    result.textContent = codigo;
}

// Adiciona listeners para Enter nos inputs
document.addEventListener('DOMContentLoaded', function() {
    const calcInput = document.getElementById('calc-input');
    if(calcInput) {
        calcInput.addEventListener('keypress', function(e) {
            if(e.key === 'Enter') calcularExpressao();
        });
    }
    
    const textInput = document.getElementById('text-input');
    if(textInput) {
        textInput.addEventListener('input', function() {
            if(this.value.trim()) {
                setTimeout(analisarTexto, 500); // Auto-análise com delay
            }
        });
    }
});

/* ============================================================================================================== */



