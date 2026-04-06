let formFileDin = new FormData();

function GeraCadernoDiagInter(id_pk_painel, tag_painel){

    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    debugger;
    const checkboxes = document.querySelectorAll("#checklist-container input[type='checkbox']:checked");
    const opcoesMarcadas = Array.from(checkboxes).map(checkbox => checkbox.value);
    console.log(opcoesMarcadas);
    $.ajax({
        type: "POST",
        url: "/app/eletrica/a1pro/GeraDiagInter/GeraCadernoDiagInter/",
        headers:{'X-CSRFToken': csrf},
        dataType: "json",
        data: {'id_pk_painel': id_pk_painel, 'tag_painel': tag_painel, 'filter_checkbox': JSON.stringify(opcoesMarcadas)},
        success: function (data){
            debugger;
            if ((tag_painel === '---') || (opcoesMarcadas.length === 0)){
                swalAlert(false, `${data['STATUS']}`, 'warning', false)
            }
            else{
                InitProgressBarLc(data['task_id'])
            }}
    });
}

window.onload = async function () {

    debugger;
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value;
    const button = document.querySelector('[data-target="#ListaNaoConsolidada"]');
    const bGera = document.querySelector('[data-target="#gera_caderno"]');

    await $.ajax({
        type: "GET",
        url: "/app/eletrica/a1pro/GeraDiagInter/ListaNaoConsolidada/",
        headers: { 'X-CSRFToken': csrf },
        dataType: "json",
        beforeSend: function () {


            // Desativa o botão
            bGera.disabled = true;
            button.disabled = true;
        },
        success: function (data) {
            debugger;
            bGera.disabled = false;

            // Seleciona o div onde os dados serão exibidos
            const infoConsolidadaDiv = document.getElementById('infoConsolidada');
            button.disabled = false;
            const divWrapper = document.getElementById('spinner-wrapper');
            //deixa transparente o bagulho
            divWrapper.style.display = 'none';
            //muda o nome do botão confirmando que foi feito a boa
            button.textContent = 'Lista Está Consolidada';
            // Insere os itens retornados pela resposta do backend
            if (data.LISTA.length > 0){
                data.LISTA.forEach(item => {
                    infoConsolidadaDiv.insertAdjacentHTML('beforeend', `
                        <div class="alert alert-info" role="alert">
                            ${item}
                        </div>
                    `);
                });
                
            }
            
             else {
                
                infoConsolidadaDiv.insertAdjacentHTML('beforeend', `

                        <div class="alert alert-info" role="alert" >
                            Nada encontrado.
                        </div>
                    `);
            }
        },
        error: function (xhr, status, error) {
            console.error('Erro na requisição:', status, error);

            // Exibe mensagem de erro
            const infoConsolidadaDiv = document.getElementById('infoConsolidada');
            infoConsolidadaDiv.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    Erro ao carregar os dados. Tente novamente mais tarde.
                </div>
            `;
        },
        complete: function () {
            // Reativa o botão após carregar ou falhar
            bGera.disabled = false;
            button.disabled = true;
            const divWrapper = document.getElementById('spinner-wrapper');
            button.textContent = 'Lista Não Consolidada';

            divWrapper.style.display = 'none';
        }
    });
};

function ShowScreenPainelDiagInter(){
    debugger;
    window.open('PainelDiagInter/', '_self');
}

function InitProgressBarLc(id_task){
    var progressUrl = `/celery-progress/${id_task}/`
    CeleryProgressBar.initProgressBar(progressUrl, {
      progressBarId: 'progress-bar-list-cabos',  // Barra de progresso, pode ser removido caso não seja necessário
      progressBarMessageId: 'progress-bar-message-list-cabos',
      onSuccess: customSucess,
      onError: customError,
      onProgress: customProgress,
    })

    function customSucess(progressBarElement, progressBarMessageElement, result){
        progressBarMessageElement.innerHTML = 'Concluído!';
        progressBarMessageElement.style.color = '#007bff'; // Azul quando concluído
        window.open('/app/calc_cabos/a1calccabos/DownloadFileReturnImport/' + id_task + '/', '_self')
    }

    function customError(progressBarElement, progressBarMessageElement, excMessage){
        progressBarMessageElement.innerHTML = "Houve um erro inesperado. Entre em contato com o SEA e informe o número da tarefa: "
        + progressUrl;
        progressBarMessageElement.style.color = '#dc4f63'; // Vermelho em caso de erro
    }

    function customProgress(progressBarElement, progressBarMessageElement, progress){
        // Ajusta o conteúdo de progresso dentro da div, alinhando verticalmente
        progressBarMessageElement.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width: 100%;">
                <span>PROGRESSO</span>
                <span style="font-size: 1.5em;">${progress.percent}%</span>
            </div>
        `;
        progressBarMessageElement.style.color = '#007bff'; // Azul para a numeração da porcentagem
        progressBarMessageElement.style.textAlign = 'center'; // Centraliza o texto horizontalmente
        progressBarMessageElement.style.width = '100%'; // Garante que a mensagem ocupe toda a largura da div
    }
}

function ShowDestinos(tag_orig){
    debugger;
    console.log(tag_orig)
    $.ajax({
        type: "GET",
        data: {'TAG_PAINEL_ORIGEM': tag_orig},
        dataType: "json",
        url: "/app/eletrica/a1pro/ShowDestinos/",
        success: function(data){
        console.log(data['list_destiny']);
        let container = document.getElementById("checklist-container");
        container.innerHTML = ""; // Limpa o conteúdo anterior

        data['list_destiny'].forEach(function(destino, index){
        let div = document.createElement("div");
        div.className = "form-check mt-2";

        let checkbox = document.createElement("input");
        checkbox.className = "form-check-input";
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${index}`;
        checkbox.value = destino;

        let label = document.createElement("label");
        label.className = "form-check-label";
        label.htmlFor = `checkbox-${index}`;
        label.innerText = destino;

        div.appendChild(checkbox);
        div.appendChild(label);
        container.appendChild(div);
    });
    }
    })
}

function marcarTodos() {
    debugger;
    const checkboxes = document.querySelectorAll("#checklist-container input[type='checkbox']");
    const todosMarcados = Array.from(checkboxes).every(checkbox => checkbox.checked);

    // Alterna entre marcar e desmarcar todos
    checkboxes.forEach(checkbox => {
        checkbox.checked = !todosMarcados; // Marca se todos não estão marcados, ou desmarca se todos estão marcados
    });
}