
/**
 * bornes-config.js
 * ================
 * Módulo responsável pela interface de configuração de bornes e réguas no ambiente A1Pro.
 *
 * Responsabilidades:
 * - Carrega funções disponíveis por OS e popula dropdowns de formação.
 * - Busca e exibe bornes cadastrados para uma função/formação selecionada.
 * - Permite inserção e edição de réguas (origem/destino) e bornes com suas veias/cores.
 * - Envia dados de cadastro ao back-end via AJAX (BornesConfigOs/).
 * - Gerencia upload de arquivo DWG e persistência de coordenadas (X/Y) via BornesConfigUpdateImg/.
 *
 * Dependências:
 * - jQuery (AJAX e manipulação DOM)
 * - defines-msgs.js (constantes de mensagens dados ao return)
 * - defines-modals.js (funções para os modais)
 * - GerarTipicosDoc.js (geração de documentação)
 */

let sistemaLigacao, tipoFuncao, tipoCabo;
let reguaTerra, reguaNeutro, quantLinhasFase;
let mapaFormacoes = {};
let formacoesGeradasCabos = [];
let tagsFormacaoCabosGeradas = [];
let arquivosBornesImportados = []; // Array para rastrear arquivos importados
let formFileDin = new FormData();
let tipoImagemSelecionada = 'BORNE';
const MSG_SEM_MATERIAL = 'Não cadastrado.';

/**
 * Normaliza uma string de formação para lower-case e remove espaços.
 *
 * @param {string|null|undefined} valor - Valor a normalizar.
 * @returns {string} - Valor normalizado em minúsculas e sem espaços.
 */
function normalizarFormacao(valor) {
    return (valor || '').toString().trim().toLowerCase();
}

/**
 * Atualiza o resumo de formações geradas no console e dataset do select.
 *
 * Armazena as formações normalizadas e tags brutas como atributos `dataset`
 * do select de formação para consulta posterior pelo frontend.
 *
 * @returns {void}
 */
function atualizarResumoFormacoesGeradas() {
    console.log('Formações geradas (normalizadas):', formacoesGeradasCabos);
    console.log('Tags de formação geradas (brutas):', tagsFormacaoCabosGeradas);

    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    if (selectFormacao) {
        selectFormacao.dataset.formacoesGeradas = formacoesGeradasCabos.join(', ');
        selectFormacao.dataset.tagsFormacaoGeradas = tagsFormacaoCabosGeradas.join(', ');
    }
}

/**
 * Obtém a referência do botão "Salvar Formação".
 *
 * Busca pelo atributo `onclick` que contenha "ajaxRegistrarReguaBornes".
 *
 * @returns {HTMLButtonElement|null} - Elemento do botão ou null se não encontrado.
 */
function obterBotaoSalvarFormacao() {
    return document.querySelector('button[onclick*="ajaxRegistrarReguaBornes"]');
}

/**
 * Obtém ou cria um elemento de alerta para status de formação.
 *
 * Se o alerta já existe no DOM, retorna-o; caso contrário, cria um novo
 * elemento `<div>` com classes Bootstrap e o insere no painel do select.
 *
 * @returns {HTMLDivElement|null} - Elemento do alerta ou null se select não existe.
 */
function obterOuCriarAlertaFormacao() {
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    if (!selectFormacao) {
        return null;
    }

    let alerta = document.getElementById('formacao-status-alert');
    if (alerta) {
        return alerta;
    }

    alerta = document.createElement('div');
    alerta.id = 'formacao-status-alert';
    alerta.className = 'alert mt-2 py-2 px-2 mb-0';
    alerta.style.fontSize = '12px';
    alerta.setAttribute('role', 'alert');

    const parent = selectFormacao.parentElement;
    if (parent) {
        parent.appendChild(alerta);
    }

    return alerta;
}

/**
 * Atualiza o alerta visual e status do botão para formação.
 *
 * Exibe avisos quando não há função selecionada ou quando nenhuma formação
 * possui cabos gerados. Mostra disponibilidade de formações quando existentes.
 * Ativa/desativa o botão "Salvar" conforme a situação.
 *
 * @param {number} quantidadeDisponivel - Quantidade de formações disponíveis com cabos gerados.
 * @returns {void}
 */
function atualizarAlertaStatusFormacao(quantidadeDisponivel) {
    const alerta = obterOuCriarAlertaFormacao();
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    const selectFuncao = document.getElementById('funcao-nome-os-borne');
    const botaoSalvarFormacao = obterBotaoSalvarFormacao();

    if (!alerta || !selectFormacao) {
        return;
    }

    const semFuncaoSelecionada = !selectFuncao || !selectFuncao.value || String(selectFuncao.value) === '0';
    if (semFuncaoSelecionada) {
        alerta.style.display = 'none';
        if (botaoSalvarFormacao) {
            botaoSalvarFormacao.disabled = true;
        }
        return;
    }

    alerta.style.display = 'block';

    if (quantidadeDisponivel <= 0) {
        alerta.className = 'alert alert-warning mt-2 py-2 px-2 mb-0';
        alerta.textContent = 'Nenhuma formação com cabos gerados para esta função. A aba Formação foi bloqueada.';
        if (botaoSalvarFormacao) {
            botaoSalvarFormacao.disabled = true;
        }
        return;
    }

    const listaFormacoes = formacoesGeradasCabos.join(', ');
    alerta.className = 'alert alert-info mt-2 py-2 px-2 mb-0';
    alerta.textContent = `Formações disponíveis para cadastro: ${listaFormacoes}.`;

    if (botaoSalvarFormacao) {
        botaoSalvarFormacao.disabled = false;
    }
}

/**
 * Verifica se a formação possui cabos realmente gerados no mapa retornado pelo backend.
 *
 * Critério adotado: existe ao menos um código de material não vazio e diferente de
 * valores sentinela como `none`, `null` e `undefined`.
 *
 * @param {string} formacao - Chave da formação (ex: `unipolar`, `bipolar`).
 * @returns {boolean} - `true` quando há cabo/material válido para a formação.
 */
function possuiCabosGeradosNaFormacao(formacao) {
    const formacaoNormalizada = normalizarFormacao(formacao);
    if (!formacaoNormalizada) {
        return false;
    }

    // Primeiro filtro: formação precisa existir no que foi realmente gerado nas tags.
    if (!Array.isArray(formacoesGeradasCabos) || !formacoesGeradasCabos.includes(formacaoNormalizada)) {
        return false;
    }

    // Segundo filtro: também precisa existir um código de material válido no mapa.
    const dadosFormacao = mapaFormacoes[formacao];
    if (!dadosFormacao || typeof dadosFormacao !== 'object') {
        return false;
    }

    return Object.keys(dadosFormacao).some((codigoMaterial) => {
        const codigo = String(codigoMaterial || '').trim().toLowerCase();
        return codigo !== '' && codigo !== 'none' && codigo !== 'null' && codigo !== 'undefined';
    });
}

/**
 * Filtra o dropdown de formação exibindo apenas formações com cabos gerados.
 *
 * Oculta e desabilita as opções sem material válido, limpa a seleção atual e,
 * quando não houver opções disponíveis, bloqueia o select e atualiza o campo
 * visual de material com a mensagem padrão.
 *
 * @returns {void}
 */
function filtrarDropdownFormacaoPorCabosGerados() {
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    if (!selectFormacao) {
        return;
    }

    let quantidadeDisponivel = 0;

    Array.from(selectFormacao.options).forEach((option) => {
        const valor = (option.value || '').trim().toLowerCase();
        if (!valor) {
            option.hidden = false;
            option.disabled = false;
            return;
        }

        const possuiCabos = possuiCabosGeradosNaFormacao(valor);
        option.hidden = !possuiCabos;
        option.disabled = !possuiCabos;

        if (possuiCabos) {
            quantidadeDisponivel += 1;
        }
    });

    selectFormacao.value = '';
    selectFormacao.disabled = quantidadeDisponivel === 0;

    const inputFormacaoCabo = document.getElementById('formacao-cabo1');
    if (inputFormacaoCabo) {
        inputFormacaoCabo.value = quantidadeDisponivel === 0 ? MSG_SEM_MATERIAL : '';
    }

    atualizarAlertaStatusFormacao(quantidadeDisponivel);
}


/**
 * Habilita ou desabilita o dropdown de formação conforme a função selecionada.
 *
 * Quando não há função válida selecionada, limpa a formação atual e o campo
 * de material para evitar reaproveitar dados de contexto anterior.
 *
 * @param {string|number|null|undefined} idFg - Id da função geral selecionada.
 * @returns {void}
 */
function atualizarDisponibilidadeFormacao(idFg) {
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    if (!selectFormacao) return;

    const habilitar = !!idFg && String(idFg) !== '0';
    selectFormacao.disabled = !habilitar;

    if (!habilitar) {
        selectFormacao.value = '';
        const inputFormacaoCabo = document.getElementById('formacao-cabo1');
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = '';
        }

        formacoesGeradasCabos = [];
        tagsFormacaoCabosGeradas = [];
        atualizarAlertaStatusFormacao(0);
    }
}



/**
 * Define o tipo de imagem selecionado no fluxo de upload.
 *
 * Normaliza o valor para upper-case e aceita apenas `BORNE` ou `REGUA`.
 * Em caso de valor inválido, aplica `BORNE` como padrão.
 *
 * @param {string|null|undefined} valorSelecionado - Opção escolhida no dropdown.
 * @returns {void}
 */
function opcaoImagem(valorSelecionado) {
    const valorNormalizado = (valorSelecionado || '').toString().trim().toUpperCase();
    if (valorNormalizado === 'REGUA' || valorNormalizado === 'BORNE') {
        tipoImagemSelecionada = valorNormalizado;
    } else {
        tipoImagemSelecionada = 'BORNE';
    }

    console.log(`Tipo de imagem selecionado: ${tipoImagemSelecionada}`);
}


/**
 * Busca no backend os dados da função selecionada e prepara a tela de configuração.
 *
 * Atualiza informações de sistema/tipo/finalidade, recria linhas de bornes,
 * zera campos dependentes, carrega o mapa de formações e formações geradas
 * para uso posterior. Filtra o dropdown de formação conforme cabos realmente gerados.
 *
 * @param {string|number|null|undefined} idFg - Id da função geral.
 * @returns {void}
 */
function ajaxIdFuncaoGeral(idFg){
    debugger;

    const reguaFaseOrigInput = document.getElementById('regua_fase_orig');
    const reguaFaseDestInput = document.getElementById('regua_fase_dest');
    if (reguaFaseOrigInput) {
        reguaFaseOrigInput.value = '';
    }
    if (reguaFaseDestInput) {
        reguaFaseDestInput.value = '';
    }

    atualizarDisponibilidadeFormacao(idFg);
    if (!idFg || String(idFg) === '0') {
        return;
    }

    $.ajax({

        type: "GET",
        data: {'id_fg': idFg},
        dataType: "json",
        url: "BornesConfigOs/",

        success: function (response){

            debugger;
            
            // Limpa o campo de material ao trocar de função
            const inputFormacaoCabo = document.getElementById('formacao-cabo1');
            if (inputFormacaoCabo) {
                inputFormacaoCabo.value = '';
            }
            
            sistemaLigacao   = response["sistema_ligacao"];
            tipoFuncao       = response["tipo_funcao"];
            tipoCabo         = response["tipo_cabo"];
            carregaCamposBornesConfig(sistemaLigacao, tipoFuncao, tipoCabo);

            reguaTerra       = response["terra"];
            reguaNeutro      = response["neutro"];
            quantLinhasFase  = response["quant_linhas"];
            carregaCamposLinhasBornesConfig(quantLinhasFase, reguaTerra, reguaNeutro);

            mapaFormacoes = {
                unipolar:   response["unipolar"],
                bipolar:    response["bipolar"],
                tripolar:   response["tripolar"],
                tetrapolar: response["tetrapolar"],
                pentapolar: response["pentapolar"],
                shield:     response["shield"],
            };

            formacoesGeradasCabos = Array.isArray(response["formacoes_geradas"])
                ? response["formacoes_geradas"].map((item) => normalizarFormacao(item)).filter((item) => !!item)
                : [];

            tagsFormacaoCabosGeradas = Array.isArray(response["tags_formacao_cabos_geradas"])
                ? response["tags_formacao_cabos_geradas"]
                : [];

            atualizarResumoFormacoesGeradas();

            filtrarDropdownFormacaoPorCabosGerados();

            const selectFormacao = document.getElementById('funcao-tipo-formacao');
            if (selectFormacao) {
                selectFormacao.value = "";
            }
            limparVeias();

            // Bornes salvos estão disponíveis em response["bornes_salvos"]
            // Espera o usuário selecionar a formação manualmente em onchange
        }
    });
}


/**
 * Retorna o id da função geral atualmente selecionada.
 *
 * Sempre vai pegar o valor recebido por parâmetro; se não vier, lê o valor do
 * dropdown `funcao-nome-os-borne`.
 *
 * @param {string|number|null} idFg - Id da função informado.
 * @returns {string|number|null} - Id da função selecionada ou `null` quando não tem.
 */
function obterIdFuncaoSelecionada(idFg) {
    const selectFuncao = document.getElementById('funcao-nome-os-borne');
    return idFg || (selectFuncao ? selectFuncao.value : null);
}


/**
 * Retorna a formação selecionada no dropdown de formação.
 *
 * @returns {string} - Formação selecionada ou string vazia.
 */
function obterFormacaoSelecionada() {
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    return selectFormacao ? selectFormacao.value : "";
}

/**
 * Obtém o primeiro código de material para a formação informada.
 *
 * @param {string} formacao - Chave da formação (ex: `unipolar`, `bipolar`).
 * @returns {string|null} - Código do material ou `null` quando não existir.
 */
function obterCodigoMaterialPorFormacao(formacao) {
    const dadosFormacao = mapaFormacoes[formacao];
    if (!dadosFormacao || Object.keys(dadosFormacao).length === 0) {
        return null;
    }

    const codigos = Object.keys(dadosFormacao);
    return codigos[0] || null;
}

/**
 * Monta a lista de bornes ativos da régua de fase para envio ao backend.
 *
 * Ignora linhas bloqueadas (`readOnly`) e mantém apenas as linhas editáveis.
 *
 * @returns {Array<Object>} - Lista de objetos de borne/veia da fase.
 */
function montarBornesFaseAtivos() {
    const bornesFase = [];

    for (let i = 0; i < quantLinhasFase; i++) {
        const borneOrigEl = document.getElementById(`borne_orig_${i}`);
        const veiaOrigEl  = document.getElementById(`veia_orig_${i}`);
        const borneDestEl = document.getElementById(`borne_dest_${i}`);
        const veiaDestEl  = document.getElementById(`veia_dest_${i}`);

        // Se a linha foi desativada (readOnly), não envia para o backend.
        if (borneOrigEl && borneOrigEl.readOnly && borneDestEl && borneDestEl.readOnly) {
            continue;
        }

        bornesFase.push({
            index: i,
            borne_orig: borneOrigEl ? borneOrigEl.value : "",
            veia_orig:  veiaOrigEl  ? veiaOrigEl.value  : "",
            borne_dest: borneDestEl ? borneDestEl.value : "",
            veia_dest:  veiaDestEl  ? veiaDestEl.value  : ""
        });
    }

    return bornesFase;
}

/**
 * Monta o payload da régua de fase com origem, destino e bornes ativos no momento atual.
 *
 * @returns {{regua_orig: string, regua_dest: string, bornes: Array<Object>}}
 */
function montarReguaFase() {
    const reguaFaseOrigInput = document.getElementById('regua_fase_orig');
    const reguaFaseDestInput = document.getElementById('regua_fase_dest');

    return {
        regua_orig: reguaFaseOrigInput ? reguaFaseOrigInput.value : "",
        regua_dest: reguaFaseDestInput ? reguaFaseDestInput.value : "",
        bornes: montarBornesFaseAtivos()
    };
}

/**
 * Monta a estrutura de uma régua simples (terra/neutro) para envio.
 *
 * @param {string} prefixo - fixa dos ids no DOM (`terra` ou `neutro`).
 * @returns {{regua_orig: string, regua_dest: string, bornes: Array<Object>}}
 */
function montarReguaSimples(prefixo) {
    const reguaOrigEl = document.getElementById(`regua_${prefixo}_orig`);
    const reguaDestEl = document.getElementById(`regua_${prefixo}_dest`);
    const borneOrigEl = document.getElementById(`borne_${prefixo}_orig`);
    const veiaOrigEl  = document.getElementById(`veia_${prefixo}_orig`);
    const borneDestEl = document.getElementById(`borne_${prefixo}_dest`);
    const veiaDestEl  = document.getElementById(`veia_${prefixo}_dest`);

    return {
        regua_orig: reguaOrigEl ? reguaOrigEl.value : "",
        regua_dest: reguaDestEl ? reguaDestEl.value : "",
        bornes: [
            {
                borne_orig: borneOrigEl ? borneOrigEl.value : "",
                veia_orig:  veiaOrigEl  ? veiaOrigEl.value  : "",
                borne_dest: borneDestEl ? borneDestEl.value : "",
                veia_dest:  veiaDestEl  ? veiaDestEl.value  : ""
            }
        ]
    };
}

/**
 * Verifica se uma régua opcional está ativa para cadastro.
 *
 * @param {boolean} flagRegua - Flag de existência da régua no sistema.
 * @param {string} prefixo - Prefixo dos campos da régua no DOM.
 * @returns {boolean} - `true` quando a régua existe e está editável.
 */
function verificarReguaAtiva(flagRegua, prefixo) {
    const reguaOrigEl = document.getElementById(`regua_${prefixo}_orig`);
    return flagRegua && reguaOrigEl && !reguaOrigEl.readOnly;
}

/**
 * Monta o objeto completo de cadastro de bornes/réguas para a OS.
 *
 * Inclui sempre fase e adiciona terra/neutro somente quando ativos.
 *
 * @param {string|number|null} idFg - Id da função geral.
 * @param {string} formacao - Formação selecionada.
 * @param {string|null} codigoMaterial - Código do material associado.
 * @returns {Object} - Payload pronto para serialização e envio.
 */
function montarOSBornes(idFg, formacao, codigoMaterial) {
    const tabelaBornes = {
        id_fg: idFg,
        formacao: formacao,
        codigo_material: codigoMaterial,
        regua_fase: montarReguaFase()
    };

    const terraAtiva = verificarReguaAtiva(reguaTerra, 'terra');
    const neutroAtivo = verificarReguaAtiva(reguaNeutro, 'neutro');

    if (terraAtiva) {
        tabelaBornes.regua_terra = montarReguaSimples('terra');
    }

    if (neutroAtivo) {
        tabelaBornes.regua_neutro = montarReguaSimples('neutro');
    }

    return tabelaBornes;
}

/**
 * Envia o payload de bornes para persistência no endpoint `BornesConfigOs/`.
 *
 * @param {string|number|null} idFg - Id da função geral.
 * @param {Object} tabelaBornes - Estrutura de dados com réguas e bornes.
 * @returns {void}
 */
function enviarParaosBornes(idFg, tabelaBornes) {
    
    $.ajax({
        type: "POST",
        url: "BornesConfigOs/",
        dataType: "json",
        data: {
            csrfmiddlewaretoken: obterCsrfToken(),
            id_fg: idFg,
            tabela_bornes: JSON.stringify(tabelaBornes),
        },
        success: function (response){
            debugger;
            const resultMsg = response['result_msg'];
            const resultIcon = response['result_icon'];
            swalAlert(false, resultMsg, resultIcon, false);
        }
    });
}

/**
 * Executa o fluxo de validação e envio do cadastro de bornes.
 *
 * Coleta função/formação, monta payload, valida material/campos e envia ao backend.
 *
 * @param {Object} tabelaBornes - Payload opcional (recalculado internamente).
 * @param {string|number|null} idFg - Id da função geral.
 * @returns {void}
 */
function ajaxRegistrarReguaBornes(tabelaBornes, idFg){

    debugger;
    idFg = obterIdFuncaoSelecionada(idFg);
    const formacao = obterFormacaoSelecionada();

    if (!formacao) {
        alert(result_formacao_required);
        return;
    }

    const codigoMaterial = obterCodigoMaterialPorFormacao(formacao);
    tabelaBornes = montarOSBornes(idFg, formacao, codigoMaterial);

    if (!verificaMaterialCadastrado(idFg, tabelaBornes)) {
        alert(result_tabela_campos_required);
        return;
    }

    console.log("Payload bornes:", tabelaBornes);

    // Salva a tela de borne no banco e retorna feedback para o usuario.
    enviarParaosBornes(idFg, tabelaBornes);
}
// Da um load nas configs gravadas (Todas vindas do Back-End)
/**
 * Preenche os campos visuais de sistema, tipo de função e finalidade.
 *
 * @param {string} sisLig - Sistema de ligação.
 * @param {string} tipFunc - Tipo da função.
 * @param {string} tipCab - Finalidade/formação de cabo.
 * @returns {void}
 */
function carregaCamposBornesConfig(sisLig, tipFunc, tipCab){

    document.getElementById('sistema-ligacao').value = sisLig;
    document.getElementById('tipo-funcao').value = tipFunc;
    document.getElementById('formacao-cabo').value = tipCab;

}

/**
 * Renderiza dinamicamente as linhas da tabela de bornes conforme o cenário da função.
 *
 * Cria linhas de fase e, quando aplicável, adiciona blocos extras para terra e neutro.
 *
 * @param {number} quantLinFase - Quantidade de linhas da fase.
 * @param {boolean} regT - Indica se existe régua de terra.
 * @param {boolean} regN - Indica se existe régua de neutro.
 * @returns {void}
 */
function carregaCamposLinhasBornesConfig(quantLinFase, regT, regN) {

    let tbody = document.querySelector("#table-borne tbody");
    tbody.innerHTML = '';

    for (let i = 0; i < quantLinFase; i++){
        let newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td class="border"><input type="text" class="form-control" id="borne_orig_${i}"></td>
            <td class="border"><input type="text" class="form-control" readonly id="veia_orig_${i}"></td>
            <td class="border"><input type="text" class="form-control" id="borne_dest_${i}"></td>
            <td class="border"><input type="text" class="form-control" readonly id="veia_dest_${i}"></td>
        `;
        tbody.appendChild(newRow);
    }

    /*
    *
    *
    * @param
    * @returns
    */
    function linhaRegua(nome, sufixo){
        let trRegua = document.createElement("tr");
        trRegua.classList.add("table-primary");   // pra ficar azul igual ao cabeçalho
        trRegua.innerHTML = `
            <td colspan="2" class="text-primary border">
                RÉGUA ${nome}: <input type="text" class="form-control" id="regua_${sufixo}_orig">
            </td>
            <td colspan="2" class="text-primary border">
                RÉGUA ${nome}: <input type="text" class="form-control" id="regua_${sufixo}_dest">
            </td>
        `;
        tbody.appendChild(trRegua);

        // linha de bornes/veias dessa régua
        let trDados = document.createElement("tr");
        trDados.innerHTML = `
            <td class="text-primary border"><input type="text" class="form-control" id="borne_${sufixo}_orig"></td>
            <td class="text-primary border"><input type="text" class="form-control" readonly id="veia_${sufixo}_orig"></td>
            <td class="text-primary border"><input type="text" class="form-control" id="borne_${sufixo}_dest"></td>
            <td class="text-primary border"><input type="text" class="form-control" readonly id="veia_${sufixo}_dest"></td>
        `;
        tbody.appendChild(trDados);
    }

    if (regT) {
        linhaRegua('TERRA', 'terra');
    }

    if (regN) {
        linhaRegua('NEUTRO', 'neutro');
    }
}

/**
 * Limpa valores e desbloqueia campos de bornes/réguas na tela.
 *
 * Zera fase, terra e neutro (quando existirem) e remove `readOnly` dos campos editáveis.
 *
 * @returns {void}
 */
function limparVeias(){

    if (typeof quantLinhasFase === 'undefined') return;

    // linhas de fase
    for (let i = 0; i < quantLinhasFase; i++){
        const vo = document.getElementById(`veia_orig_${i}`);
        const vd = document.getElementById(`veia_dest_${i}`);
        const bo = document.getElementById(`borne_orig_${i}`);
        const bd = document.getElementById(`borne_dest_${i}`);

        if (vo) vo.value = "";
        if (vd) vd.value = "";
        if (bo) bo.value = "";
        if (bd) bd.value = "";

        if (bo) bo.readOnly = false;
        if (bd) bd.readOnly = false;
    }

    // terra / neutro – zera cores e desbloqueia campos
    const veiaTerraOrig   = document.getElementById('veia_terra_orig');
    const veiaTerraDest   = document.getElementById('veia_terra_dest');
    const veiaNeutroOrig  = document.getElementById('veia_neutro_orig');
    const veiaNeutroDest  = document.getElementById('veia_neutro_dest');

    if (veiaTerraOrig)  veiaTerraOrig.value  = "";
    if (veiaTerraDest)  veiaTerraDest.value  = "";
    if (veiaNeutroOrig) veiaNeutroOrig.value = "";
    if (veiaNeutroDest) veiaNeutroDest.value = "";

    const regTerraOrig    = document.getElementById('regua_terra_orig');
    const regTerraDest    = document.getElementById('regua_terra_dest');
    const borneTerraOrig  = document.getElementById('borne_terra_orig');
    const borneTerraDest  = document.getElementById('borne_terra_dest');

    if (regTerraOrig)   regTerraOrig.value = "";
    if (regTerraDest)   regTerraDest.value = "";
    if (borneTerraOrig) borneTerraOrig.value = "";
    if (borneTerraDest) borneTerraDest.value = "";

    if (regTerraOrig)   regTerraOrig.readOnly   = false;
    if (regTerraDest)   regTerraDest.readOnly   = false;
    if (borneTerraOrig) borneTerraOrig.readOnly = false;
    if (borneTerraDest) borneTerraDest.readOnly = false;

    const regNeutroOrig   = document.getElementById('regua_neutro_orig');
    const regNeutroDest   = document.getElementById('regua_neutro_dest');
    const borneNeutroOrig = document.getElementById('borne_neutro_orig');
    const borneNeutroDest = document.getElementById('borne_neutro_dest');

    if (regNeutroOrig)   regNeutroOrig.value = "";
    if (regNeutroDest)   regNeutroDest.value = "";
    if (borneNeutroOrig) borneNeutroOrig.value = "";
    if (borneNeutroDest) borneNeutroDest.value = "";

    if (regNeutroOrig)   regNeutroOrig.readOnly   = false;
    if (regNeutroDest)   regNeutroDest.readOnly   = false;
    if (borneNeutroOrig) borneNeutroOrig.readOnly = false;
    if (borneNeutroDest) borneNeutroDest.readOnly = false;

    const regFaseOrig = document.getElementById('regua_fase_orig');
    const regFaseDest = document.getElementById('regua_fase_dest');
    if (regFaseOrig) regFaseOrig.readOnly = false;
    if (regFaseDest) regFaseDest.readOnly = false;
}

/**
 * Recarrega os campos de veias/cores ao trocar a formação.
 *
 * Primeiro limpa os campos que dependem de outras vias, depois tenta carregar dados salvos;
 * se não houver, aplica as cores padrão da formação.
 *
 * @param {string} formacao - Formação selecionada no dropdown.
 * @returns {void}
 */
function carregaCamposViasCores(formacao){

    debugger;
    // limpa valores e desbloqueia linhas antes de aplicar a nova formação
    limparVeias();

    // Limpa as réguas de origem e destino antes de carregar a nova formação
    const reguaFaseOrigInput = document.getElementById('regua_fase_orig');
    const reguaFaseDestInput = document.getElementById('regua_fase_dest');
    if (reguaFaseOrigInput) reguaFaseOrigInput.value = '';
    if (reguaFaseDestInput) reguaFaseDestInput.value = '';

    // Limpa o campo de material sempre que trocar de formação
    const inputFormacaoCabo = document.getElementById('formacao-cabo1');
    if (inputFormacaoCabo) {
        inputFormacaoCabo.value = '';
    }

    if (!formacao) {
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = MSG_SEM_MATERIAL;
        }
        return;
    }

    if (!possuiCabosGeradosNaFormacao(formacao)) {
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = MSG_SEM_MATERIAL;
        }
        return;
    }

    // Busca no back-end se há bornes cadastrados para esta formação
    const selectFuncao = document.getElementById('funcao-nome-os-borne');
    const idFg = selectFuncao ? selectFuncao.value : null;
    
    if (idFg) {
        $.ajax({
            type: "GET",
            data: {'id_fg': idFg, 'formacao': formacao},
            dataType: "json",
            url: "BornesConfigOs/",
            success: function (response) {
                debugger;
                // Se existirem bornes salvos para esta formação
                if (response && response.bornes_salvos && Object.keys(response.bornes_salvos).length > 0) {
                    carregarBornesSalvos(response.bornes_salvos);
                    return; // Não precisa carregar as cores padrão
                }
                
                // Se o backend retornou apenas o código do material (sem bornes cadastrados)
                if (response && response.codigo_material) {
                    const inputFormacaoCabo = document.getElementById('formacao-cabo1');
                    if (inputFormacaoCabo) {
                        inputFormacaoCabo.value = response.codigo_material;
                    }
                }
                
                // Carrega as cores padrão (não sobrescreve o material se já foi preenchido)
                carregarCoresFormacao(formacao);
            },
            error: function() {
                // Em caso de erro, carrega as cores padrão
                carregarCoresFormacao(formacao);
            }
        });
    } else {
        // Se não há função selecionada, apenas carrega as cores padrão
        carregarCoresFormacao(formacao);
    }
}

/**
 * Aplica as cores padrão da formação nos campos de veia.
 *
 * Considera regras para unipolar/multipolar e bloqueia linhas não utilizadas.
 *
 * @param {string} formacao - Formação alvo para carregamento das cores.
 * @returns {void}
 */
function carregarCoresFormacao(formacao) {
    // Carrega as cores padrão da formação selecionada
    const dadosFormacao = mapaFormacoes[formacao];
    const inputFormacaoCabo = document.getElementById('formacao-cabo1');

    if (!dadosFormacao || Object.keys(dadosFormacao).length === 0) {
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = MSG_SEM_MATERIAL;
        }
        return;
    }

    const codigos = Object.keys(dadosFormacao);
    const codCabo = codigos[0];
    const cores   = (dadosFormacao[codCabo] || []).slice(); // cópia

    if (!cores.length) {
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = MSG_SEM_MATERIAL;
        }
        return;
    }

    const totalLinhasLogicas =
        quantLinhasFase +
        (reguaTerra ? 1 : 0) +
        (reguaNeutro ? 1 : 0);

    // ----------- CASO UNIPOLAR -----------
    if (formacao === 'unipolar') {
        const cor = cores[0];

        // fases
        for (let i = 0; i < quantLinhasFase; i++){
            const vo = document.getElementById(`veia_orig_${i}`);
            const vd = document.getElementById(`veia_dest_${i}`);
            if (vo) vo.value = cor;
            if (vd) vd.value = cor;
        }

        // terra / neutro (se existirem)
        const veiaTerraOrig  = document.getElementById('veia_terra_orig');
        const veiaTerraDest  = document.getElementById('veia_terra_dest');
        const veiaNeutroOrig = document.getElementById('veia_neutro_orig');
        const veiaNeutroDest = document.getElementById('veia_neutro_dest');

        if (veiaTerraOrig)  veiaTerraOrig.value  = cor;
        if (veiaTerraDest)  veiaTerraDest.value  = cor;
        if (veiaNeutroOrig) veiaNeutroOrig.value = cor;
        if (veiaNeutroDest) veiaNeutroDest.value = cor;

        // todas as linhas são usadas → nenhuma precisa ser bloqueada
        // (se por acaso tiver mais linhas que condutores num unipolar, você pode
        //  decidir bloquear manualmente depois, mas pelo seu cenário isso não ocorre)

        // Preenche o campo de material apenas se ainda estiver vazio
        if (inputFormacaoCabo && codCabo && !inputFormacaoCabo.value) {
            inputFormacaoCabo.value = codCabo;
        }

        return;
    }

    // ----------- CASOS MULTIPOLARES -----------

    let idxCor   = 0; // índice na lista de cores
    let linhasUsadas = 0; // número de "linhas lógicas" que receberam cor

    // 1) linhas de fase
    for (let i = 0; i < quantLinhasFase && idxCor < cores.length; i++, idxCor++){
        const cor = cores[idxCor];
        const vo  = document.getElementById(`veia_orig_${i}`);
        const vd  = document.getElementById(`veia_dest_${i}`);
        if (vo) vo.value = cor;
        if (vd) vd.value = cor;
        linhasUsadas++;
    }

    // 2) régua TERRA
    if (reguaTerra && idxCor < cores.length) {
        const corTerra = cores[idxCor];
        const veiaTerraOrig = document.getElementById('veia_terra_orig');
        const veiaTerraDest = document.getElementById('veia_terra_dest');
        if (veiaTerraOrig) veiaTerraOrig.value = corTerra;
        if (veiaTerraDest) veiaTerraDest.value = corTerra;
        idxCor++;
        linhasUsadas++;
    }

    // 3) régua NEUTRO
    if (reguaNeutro && idxCor < cores.length) {
        const corNeutro = cores[idxCor];
        const veiaNeutroOrig = document.getElementById('veia_neutro_orig');
        const veiaNeutroDest = document.getElementById('veia_neutro_dest');
        if (veiaNeutroOrig) veiaNeutroOrig.value = corNeutro;
        if (veiaNeutroDest) veiaNeutroDest.value = corNeutro;
        idxCor++;
        linhasUsadas++;
    }

    // bloqueia todas as linhas que NÃO receberam cor
    bloquearLinhasNaoUsadas(linhasUsadas, totalLinhasLogicas);

    // Preenche o campo de material apenas se ainda estiver vazio
    if (inputFormacaoCabo && codCabo && !inputFormacaoCabo.value) {
        inputFormacaoCabo.value = codCabo;
    }
}

/**
 * Preenche as veias das réguas de terra e neutro com as cores informadas.
 *
 * @param {string} corTerra - Cor a aplicar na régua de terra.
 * @param {string} corNeutro - Cor a aplicar na régua de neutro.
 * @returns {void}
 */
function preencherVeiasReguas(corTerra, corNeutro){
    // TERRA
    if (reguaTerra && corTerra) {
        const veiaTerraOrig = document.getElementById('veia_terra_orig');
        const veiaTerraDest = document.getElementById('veia_terra_dest');
        if (veiaTerraOrig) veiaTerraOrig.value = corTerra;
        if (veiaTerraDest) veiaTerraDest.value = corTerra;
    }

    // NEUTRO
    if (reguaNeutro && corNeutro) {
        const veiaNeutroOrig = document.getElementById('veia_neutro_orig');
        const veiaNeutroDest = document.getElementById('veia_neutro_dest');
        if (veiaNeutroOrig) veiaNeutroOrig.value = corNeutro;
        if (veiaNeutroDest) veiaNeutroDest.value = corNeutro;
    }
}

/**
 * Bloqueia e limpa linhas lógicas que não receberam cor no carregamento.
 *
 * @param {number} linhasUsadas - Quantidade de linhas efetivamente preenchidas.
 * @param {number} totalLinhasLogicas - Total de linhas possíveis no cenário atual.
 * @returns {void}
 */
function bloquearLinhasNaoUsadas(linhasUsadas, totalLinhasLogicas){

    // índice lógico:
    // 0 .. quantLinhasFase-1  -> linhas de fase
    // quantLinhasFase        -> régua TERRA (se existir)
    // quantLinhasFase + 1    -> régua NEUTRO (se existir)

    for (let idx = linhasUsadas; idx < totalLinhasLogicas; idx++){

        if (idx < quantLinhasFase) {
            // linha de fase "sobrando"
            const bo = document.getElementById(`borne_orig_${idx}`);
            const bd = document.getElementById(`borne_dest_${idx}`);
            const vo = document.getElementById(`veia_orig_${idx}`);
            const vd = document.getElementById(`veia_dest_${idx}`);
            if (bo) bo.value = "";
            if (bd) bd.value = "";
            if (vo) vo.value = "";
            if (vd) vd.value = "";
            if (bo) bo.readOnly = true;
            if (bd) bd.readOnly = true;
            // veias já estão vazias e readonly pelo HTML
        } else {
            // linhas de régua
            let offset = idx - quantLinhasFase;

            if (reguaTerra && offset === 0) {
                // RÉGUA TERRA
                const regO = document.getElementById('regua_terra_orig');
                const regD = document.getElementById('regua_terra_dest');
                const bo   = document.getElementById('borne_terra_orig');
                const bd   = document.getElementById('borne_terra_dest');
                const vo   = document.getElementById('veia_terra_orig');
                const vd   = document.getElementById('veia_terra_dest');

                if (regO) regO.value = "";
                if (regD) regD.value = "";
                if (bo)   bo.value   = "";
                if (bd)   bd.value   = "";
                if (vo)   vo.value   = "";
                if (vd)   vd.value   = "";
                if (regO) regO.readOnly = true;
                if (regD) regD.readOnly = true;
                if (bo)   bo.readOnly   = true;
                if (bd)   bd.readOnly   = true;

            } else {
                // pode ser NEUTRO
                offset -= (reguaTerra ? 1 : 0);
                if (reguaNeutro && offset === 0) {
                    const regO = document.getElementById('regua_neutro_orig');
                    const regD = document.getElementById('regua_neutro_dest');
                    const bo   = document.getElementById('borne_neutro_orig');
                    const bd   = document.getElementById('borne_neutro_dest');
                    const vo   = document.getElementById('veia_neutro_orig');
                    const vd   = document.getElementById('veia_neutro_dest');

                    if (regO) regO.value = "";
                    if (regD) regD.value = "";
                    if (bo)   bo.value   = "";
                    if (bd)   bd.value   = "";
                    if (vo)   vo.value   = "";
                    if (vd)   vd.value   = "";
                    if (regO) regO.readOnly = true;
                    if (regD) regD.readOnly = true;
                    if (bo)   bo.readOnly   = true;
                    if (bd)   bd.readOnly   = true;
                }
            }
        }
    }
}

/**
 * Carrega na interface os bornes/réguas já salvos no banco para a formação encontrada.
 *
 * Também ajusta o dropdown de formação, o código de material e as cores das veias.
 *
 * @param {Object} bornesSalvos - Objeto de bornes cadastrados organizados por formação.
 * @returns {void}
 */
function carregarBornesSalvos(bornesSalvos) {
    // Procurar qual formação tem dados
    let formacaoComDados = null;
    let dadosFormacao = null;
    
    for (let formacao in bornesSalvos) {
        if (bornesSalvos[formacao] && bornesSalvos[formacao].reguas && Object.keys(bornesSalvos[formacao].reguas).length > 0) {
            formacaoComDados = formacao;
            dadosFormacao = bornesSalvos[formacao];
            break;
        }
    }
    
    if (!formacaoComDados || !dadosFormacao) {
        return; // Não há dados salvos
    }
    
    // Selecionar a formação no dropdown
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    if (selectFormacao) {
        selectFormacao.value = formacaoComDados;
    }
    
    // Preencher o código do material no campo formacao-cabo1
    const inputFormacaoCabo = document.getElementById('formacao-cabo1');
    if (inputFormacaoCabo && dadosFormacao.codigo_material) {
        inputFormacaoCabo.value = dadosFormacao.codigo_material;
    }
    
    const reguas = dadosFormacao.reguas;
    
    // Preencher régua FASE
    if (reguas.fase) {
        const reguaFaseData = reguas.fase;
        
        // Preencher cabeçalho da régua origem
        const reguaFaseOrigInput = document.getElementById('regua_fase_orig');
        if (reguaFaseOrigInput && reguaFaseData.regua_orig) {
            reguaFaseOrigInput.value = reguaFaseData.regua_orig;
        }
        
        // Preencher cabeçalho da régua destino
        const reguaFaseDestInput = document.getElementById('regua_fase_dest');
        if (reguaFaseDestInput && reguaFaseData.regua_dest) {
            reguaFaseDestInput.value = reguaFaseData.regua_dest;
        }
        
        // Preencher bornes da fase
        if (reguaFaseData.bornes && Array.isArray(reguaFaseData.bornes)) {
            reguaFaseData.bornes.forEach((borne, index) => {
                const borneOrigEl = document.getElementById(`borne_orig_${index}`);
                const veiaOrigEl = document.getElementById(`veia_orig_${index}`);
                const borneDestEl = document.getElementById(`borne_dest_${index}`);
                const veiaDestEl = document.getElementById(`veia_dest_${index}`);
                
                if (borneOrigEl && borne.borne_orig) {
                    borneOrigEl.value = borne.borne_orig;
                }
                if (veiaOrigEl && borne.veia_orig) {
                    veiaOrigEl.value = borne.veia_orig;
                }
                if (borneDestEl && borne.borne_dest) {
                    borneDestEl.value = borne.borne_dest;
                }
                if (veiaDestEl && borne.veia_dest) {
                    veiaDestEl.value = borne.veia_dest;
                }
            });
        }
    }
    
    // Preencher régua TERRA
    if (reguas.terra && reguaTerra) {
        const reguaTerraData = reguas.terra;
        
        const reguaTerraOrigInput = document.getElementById('regua_terra_orig');
        if (reguaTerraOrigInput && reguaTerraData.regua_orig) {
            reguaTerraOrigInput.value = reguaTerraData.regua_orig;
        }
        
        const reguaTerraDestInput = document.getElementById('regua_terra_dest');
        if (reguaTerraDestInput && reguaTerraData.regua_dest) {
            reguaTerraDestInput.value = reguaTerraData.regua_dest;
        }
        
        if (reguaTerraData.bornes && reguaTerraData.bornes.length > 0) {
            const borne = reguaTerraData.bornes[0];
            
            const borneTerraOrigEl = document.getElementById('borne_terra_orig');
            const veiaTerraOrigEl = document.getElementById('veia_terra_orig');
            const borneTerraDestEl = document.getElementById('borne_terra_dest');
            const veiaTerraDestEl = document.getElementById('veia_terra_dest');
            
            if (borneTerraOrigEl && borne.borne_orig) {
                borneTerraOrigEl.value = borne.borne_orig;
            }
            if (veiaTerraOrigEl && borne.veia_orig) {
                veiaTerraOrigEl.value = borne.veia_orig;
            }
            if (borneTerraDestEl && borne.borne_dest) {
                borneTerraDestEl.value = borne.borne_dest;
            }
            if (veiaTerraDestEl && borne.veia_dest) {
                veiaTerraDestEl.value = borne.veia_dest;
            }
        }
    }
    
    // Preencher régua NEUTRO
    if (reguas.neutro && reguaNeutro) {
        const reguaNeutroData = reguas.neutro;
        
        const reguaNeutroOrigInput = document.getElementById('regua_neutro_orig');
        if (reguaNeutroOrigInput && reguaNeutroData.regua_orig) {
            reguaNeutroOrigInput.value = reguaNeutroData.regua_orig;
        }
        
        const reguaNeutroDestInput = document.getElementById('regua_neutro_dest');
        if (reguaNeutroDestInput && reguaNeutroData.regua_dest) {
            reguaNeutroDestInput.value = reguaNeutroData.regua_dest;
        }
        
        if (reguaNeutroData.bornes && reguaNeutroData.bornes.length > 0) {
            const borne = reguaNeutroData.bornes[0];
            
            const borneNeutroOrigEl = document.getElementById('borne_neutro_orig');
            const veiaNeutroOrigEl = document.getElementById('veia_neutro_orig');
            const borneNeutroDestEl = document.getElementById('borne_neutro_dest');
            const veiaNeutroDestEl = document.getElementById('veia_neutro_dest');
            
            if (borneNeutroOrigEl && borne.borne_orig) {
                borneNeutroOrigEl.value = borne.borne_orig;
            }
            if (veiaNeutroOrigEl && borne.veia_orig) {
                veiaNeutroOrigEl.value = borne.veia_orig;
            }
            if (borneNeutroDestEl && borne.borne_dest) {
                borneNeutroDestEl.value = borne.borne_dest;
            }
            if (veiaNeutroDestEl && borne.veia_dest) {
                veiaNeutroDestEl.value = borne.veia_dest;
            }
        }
    }
    
    // Carrega apenas as cores das veias (não faz nova requisição AJAX)
    // Já temos os dados salvos, só precisamos das cores do material
    carregarCoresFormacao(formacaoComDados);
}


/**
 * Verifica coerência do material cadastrado na tabela de bornes.
 *
 * Valida se o código de material em `formacao-cabo1` corresponde ao selecionado
 * no dropdown de formação. Verifica se todos os campos obrigatórios da régua de fase
 * (e terra/neutro quando existentes) foram preenchidos corretamente.
 *
 * @param {number|string} idFg - Id da função geral (não utilizado diretamente, mantido por compatibilidade).
 * @param {Object} tabelaBornes - Estrutura de dados do payload de bornes com réguas validadas.
 * @returns {boolean} - `true` se material está consistente e todos os campos obrigatórios foram preenchidos.
 */
function verificaMaterialCadastrado(idFg, tabelaBornes){
    // 1. Verifica se há uma formação selecionada
    const selectFormacao = document.getElementById('funcao-tipo-formacao');
    const formacao = selectFormacao ? selectFormacao.value : "";
    
    if (!formacao) {
        console.warn("Nenhuma formação selecionada");
        return false;
    }
    
    // 2. Verifica se há dados no mapa de formações carregado do backend
    const dadosFormacao = mapaFormacoes[formacao];
    
    if (!dadosFormacao || Object.keys(dadosFormacao).length === 0) {
        const inputFormacaoCabo = document.getElementById('formacao-cabo1');
        if (inputFormacaoCabo) {
            inputFormacaoCabo.value = MSG_SEM_MATERIAL;
        }
        console.warn(`Nenhum material cadastrado para a formação: ${formacao}`);
        return false;
    }
    
    // 3. Verifica se existe pelo menos um código de material válido
    const codigos = Object.keys(dadosFormacao);
    if (codigos.length === 0 || !codigos[0]) {
        console.warn("Código de material inválido ou inexistente");
        return false;
    }
    
    // 4. Validação adicional: verifica se o campo visual está preenchido na interface
    const inputFormacaoCabo = document.getElementById('formacao-cabo1');
    if (!inputFormacaoCabo || !inputFormacaoCabo.value.trim()) {
        console.warn("Campo de material (formacao-cabo1) está vazio");
        return false;
    }

    if (!tabelaBornes || !tabelaBornes.regua_fase) {
        console.warn("Tabela de bornes inválida");
        return false;
    }

    const camposObrigatoriosRegua = ['regua_orig', 'regua_dest'];
    const camposObrigatoriosBornes = ['borne_orig', 'veia_orig', 'borne_dest', 'veia_dest'];

    function campoVazio(valor) {
        return valor === null || valor === undefined || String(valor).trim() === '';
    }

    function validarRegua(regua) {
        for (const campo of camposObrigatoriosRegua) {
            if (campoVazio(regua[campo])) {
                return false;
            }
        }

        if (!Array.isArray(regua.bornes) || regua.bornes.length === 0) {
            return false;
        }

        for (const borne of regua.bornes) {
            for (const campo of camposObrigatoriosBornes) {
                if (campoVazio(borne[campo])) {
                    return false;
                }
            }
        }

        return true;
    }

    if (!validarRegua(tabelaBornes.regua_fase)) {
        console.warn("Existem campos vazios na régua de fase");
        return false;
    }

    if (tabelaBornes.regua_terra && !validarRegua(tabelaBornes.regua_terra)) {
        console.warn("Existem campos vazios na régua de terra");
        return false;
    }

    if (tabelaBornes.regua_neutro && !validarRegua(tabelaBornes.regua_neutro)) {
        console.warn("Existem campos vazios na régua de neutro");
        return false;
    }
    
    // Todas as validações passaram - há material cadastrado
    console.log(`✓ Material cadastrado encontrado: ${codigos[0]}`);
    return true;
}



/* ------------------------------------------------ ABA ACESSÓRIO --------------------------------------------------- */

/**
 * Atualiza lista de arquivos importados e exibe resumo em popover.
 *
 * Rastreia quantidade e tamanho de cada arquivo (BORNE/REGUA) e atualiza
 * a visualização no popover de informações. Substitui arquivo anterior se for DWG.
 *
 * @param {File} arquivo - Objeto File do navegador.
 * @param {string} tipo - Tipo de imagem (`BORNE` ou `REGUA`, ou `Largura`/`Comprimento`).
 * @returns {void}
 */
function atualizarListaArquivosImportados(arquivo, tipo) {
    const agora = new Date();
    const horaFormatada = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;

    // aqui só aceita apenas um DWG por vez; um novo upload substitui o anterior apenas isso cara.
    if (tipo === 'DWG') {
        arquivosBornesImportados = arquivosBornesImportados.filter(item => item.tipo !== 'DWG');
    }
    
    arquivosBornesImportados.push({
        nome: arquivo.name,
        tipo: tipo,
        tamanho: formatarTamanhoArquivo(arquivo.size),
        hora: horaFormatada,
        file: arquivo  // Armazena o objeto File real
    });
    
    atualizarPopoverArquivos();
}

/**
 * Formata tamanho de arquivo em unidades legíveis (B, KB, MB).
 *
 * @param {number} bytes - Tamanho em bytes.
 * @returns {string} - Tamanho formatado com unidade.
 */
function formatarTamanhoArquivo(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
}

/**
 * Atualiza conteúdo do popover com lista de arquivos importados.
 *
 * Exibe resumo de arquivos DWG, Largura, Comprimento com tamanhos e horas.
 * Reinicializa o popover com conteúdo HTML atualizado.
 *
 * @returns {void}
 */
function atualizarPopoverArquivos() {
    const btnArquivos = $('#btn-arquivos-bornes');
    
    if (arquivosBornesImportados.length === 0) {
        btnArquivos.attr('data-content', '<p class="mb-0 text-muted text-center" style="padding: 10px;"><i>Nenhum arquivo importado</i></p>');
    } else {
        let conteudoHTML = '<div style="max-height: 300px; overflow-y: auto; overflow-x: hidden;">';
        conteudoHTML += '<table class="table table-sm table-borderless mb-0" style="font-size: 12px; border-spacing: 0;">';
        
        arquivosBornesImportados.forEach((arquivo, index) => {
            // Define ícone e cor baseado no tipo
            let iconeTipo, corTipo, bgColor;
            if (arquivo.tipo === 'DWG') {
                iconeTipo = 'fa-file-code';
                corTipo = 'text-primary';
                bgColor = 'rgba(0, 123, 255, 0.1)';
            } else if (arquivo.tipo === 'Largura') {
                iconeTipo = 'fa-arrows-left-right';
                corTipo = 'text-warning';
                bgColor = 'rgba(255, 193, 7, 0.1)';
            } else if (arquivo.tipo === 'Comprimento') {
                iconeTipo = 'fa-arrows-up-down';
                corTipo = 'text-info';
                bgColor = 'rgba(23, 162, 184, 0.1)';
            } else {
                iconeTipo = 'fa-file-lines';
                corTipo = 'text-success';
                bgColor = 'rgba(40, 167, 69, 0.1)';
            }
            
            conteudoHTML += `
                <tr style="background: ${bgColor}; border-radius: 8px;">
                    <td class="text-center" style="width: 40px; padding: 12px 8px; border-radius: 8px 0 0 8px;">
                        <i class="fa-solid ${iconeTipo} ${corTipo}" style="font-size: 18px;"></i>
                    </td>
                    <td style="padding: 12px 12px 12px 8px; border-radius: 0 8px 8px 0;">
                        <div style="font-weight: 600; color: #333; margin-bottom: 2px;">${arquivo.nome}</div>
                        <small class="text-muted" style="font-size: 11px;">
                            <i class="fa-solid fa-tag" style="font-size: 9px;"></i> ${arquivo.tipo} 
                            ${arquivo.tamanho !== '-' ? `• <i class="fa-solid fa-weight-hanging" style="font-size: 9px;"></i> ${arquivo.tamanho}` : ''} 
                            • <i class="fa-solid fa-clock" style="font-size: 9px;"></i> ${arquivo.hora}
                        </small>
                    </td>
                </tr>
            `;
            
            if (index < arquivosBornesImportados.length - 1) {
                conteudoHTML += '<tr><td colspan="2" style="padding: 4px 0;"></td></tr>';
            }
        });
        
        conteudoHTML += '</table></div>';
        btnArquivos.attr('data-content', conteudoHTML);
    }
    
    // Atualiza o badge com a quantidade
    const badge = btnArquivos.find('.badge');
    if (arquivosBornesImportados.length > 0) {
        if (badge.length === 0) {
            btnArquivos.append(`<span class="badge badge-danger" style="position: absolute; top: -5px; right: -5px; font-size: 10px; border-radius: 10px; padding: 3px 6px; box-shadow: 0 2px 4px rgba(220,53,69,0.3);">${arquivosBornesImportados.length}</span>`);
        } else {
            badge.text(arquivosBornesImportados.length);
        }
    }
    
    // Reinicializa o popover
    btnArquivos.popover('dispose');
    btnArquivos.popover({
        trigger: 'hover',
        html: true,
        placement: 'left',
        container: 'body',
        title: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; margin: -8px -14px 8px -14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><i class="fa-solid fa-folder-open"></i> Arquivos Importados</div>',
        template: '<div class="popover" role="tooltip" style="max-width: 400px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: none;"><div class="arrow"></div><h3 class="popover-header" style="background: transparent; border: none; padding: 0;"></h3><div class="popover-body" style="padding: 8px 14px 14px 14px;"></div></div>'
    });
}

/**
 * Inicializa o popover quando a página carrega
 */
$(document).ready(function() {
    const btnArquivos = $('#btn-arquivos-bornes');
    if (btnArquivos.length > 0) {
        btnArquivos.popover({
            trigger: 'hover',
            html: true,
            placement: 'left',
            container: 'body',
            title: '<div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 12px; border-radius: 8px 8px 0 0; margin: -8px -14px 8px -14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"><i class="fa-solid fa-folder-open"></i> Arquivos Importados</div>',
            content: '<p class="mb-0 text-muted text-center" style="padding: 10px;"><i>Nenhum arquivo importado</i></p>',
            template: '<div class="popover" role="tooltip" style="max-width: 400px; border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,0.15); border: none;"><div class="arrow"></div><h3 class="popover-header" style="background: transparent; border: none; padding: 0;"></h3><div class="popover-body" style="padding: 8px 14px 14px 14px;"></div></div>'
        });
    }
    
    // Adiciona CSS customizado para o popover
    if (!$('#custom-popover-style').length) {
        $('<style id="custom-popover-style">')
            .text(`
                .popover {
                    backdrop-filter: blur(10px);
                    background: rgba(255, 255, 255, 0.98) !important;
                }
                .popover .arrow::after {
                    border-left-color: rgba(255, 255, 255, 0.98) !important;
                }
            `)
            .appendTo('head');
    }
    
    // Inicializa drag-and-drop para a dropzone de bornes
    const dropArea = document.getElementById('drop-area-bornes-dwg');
    const fileInput = document.getElementById('arquivo_bornes_dwg');
    
    if (dropArea && fileInput) {
        // Previne comportamento padrão para todos os eventos de drag
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
            document.body.addEventListener(eventName, preventDefaults, false);
        });
        
        // Adiciona destaque visual quando o arquivo está sobre a dropzone
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.style.background = 'rgba(0, 123, 255, 0.1)';
                dropArea.style.borderColor = '#007bff';
            }, false);
        });
        
        // Remove destaque visual quando o arquivo sai da dropzone
        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, () => {
                dropArea.style.background = '';
                dropArea.style.borderColor = '';
            }, false);
        });
        
        // Manipula o drop do arquivo
        dropArea.addEventListener('drop', handleBornesDrop, false);
    }
    
    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }
    
    function handleBornesDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        
        if (files.length > 0) {
            const file = files[0];
            
            // Verifica se é um arquivo DWG
            if (file.name.toLowerCase().endsWith('.dwg')) {
                // Atribui o arquivo ao input
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                
                // Chama a função de upload
                handleBornesDwgUpload(fileInput);
            } else {
                alert(result_dwg_required);
            }
        }
    }
});

/**
 * Processa o upload de arquivo DWG de bornes/régua.
 *
 * Valida extensão, prepara FormData e envia ao backend via AJAX
 * para armazenamento e processamento.
 *
 * @param {HTMLInputElement} input - Elemento de input com arquivo selecionado.
 * @returns {void}
 */
function handleBornesDwgUpload(input) {
    if (input.files && input.files[0]) {
        const arquivo = input.files[0];
        
        // Registra o arquivo importado
        atualizarListaArquivosImportados(arquivo, 'DWG');
        
        // Chama a função original de upload
        if (typeof DropRelatPdms === 'function') {
            DropRelatPdms('uploaded-bornes-dwg', input.id, 'FileAcessorio', false, null);
        } else {
            console.warn('Função DropRelatPdms não encontrada');
        }
    }
}

/**
 * Registra coordenadas (X/Y) de dimensão de bornes/régua no backend.
 *
 * Envia chamada AJAX para persistir dados de localização do bloco CAD
 * via endpoint BornesConfigUpdateCadBlock/.
 *
 * @param {string} baseDirectory - Diretório base para armazenar arquivo.
 * @param {string} projectCode - Código da OS.
 * @param {string} equipmentTag - Tag/identificador do equipamento.
 * @returns {Promise<Object>} - Promise resolvida com resposta do servidor.
 */
function ajaxBornesConfigUpdateCadBlock(baseDirectory, projectCode, equipmentTag) {
    return new Promise((resolve, reject) => {
        const payload = {
            base_directory: baseDirectory,
            project_code: projectCode,
            equipment_tag: equipmentTag
        };
        
        $.ajax({
            type: "POST",
            url: "BornesConfigUpdateCadBlock/",
            headers: obterCsrfHeaders(),
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify(payload),
            success: function(response) {
                if (response.ok) {
                    console.log('✓ Caminho DWG gerado:', response.dwg_path);
                    resolve(response);
                } else {
                    console.error('✗ Erro ao gerar caminho:', response.error);
                    reject(new Error(response.error));
                }
            },
            error: function(xhr, status, error) {
                console.error('✗ Erro na requisição:', error);
                reject(new Error(`Erro na requisição: ${error}`));
            }
        });
    });
}



/**
 * Registra dimen são (altura ou comprimento) de bloco CAD.
 *
 * Armazena valor numérico validado para posterior envio ao backend.
 *
 * @param {string} tipo - Tipo de dimensão (`altura` ou `comprimento`).
 * @param {string|number} valor - Valor da dimensão em unidades CAD.
 * @returns {void}
 */
function registrarDimensao(tipo, valor) {
    if (valor && valor.trim() !== '') {
        // Remove registros antigos do mesmo tipo
        arquivosBornesImportados = arquivosBornesImportados.filter(item => item.tipo !== tipo);
        
        const agora = new Date();
        const horaFormatada = `${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`;
        
        arquivosBornesImportados.push({
            nome: `${tipo}: ${valor}`,
            tipo: tipo,
            tamanho: '-',
            hora: horaFormatada,
            file: null  // Dimensões não têm arquivo real
        });
        
        atualizarPopoverArquivos();
    }
}

/**
 * Valida dimensões e envia registro de acesso ao arquivo DWG.
 *
 * Verifica se altura e comprimento foram preenchidos, carrega metadados de cookies,
 * valida arquivo DWG, monta FormData com todas as informações, e dispara chamada
 * AJAX para persistir dados no backend. Exibe feedback visual (modal de loading,
 * alertas SweetAlert) do progresso.
 *
 * @returns {void}
 */
function UpdateAndSendDwgAcess(){
    debugger;

    // Coleta dados iniciais
    const X = document.getElementById('X').value;
    const Y = document.getElementById('Y').value;
    const area = getCookie('Area');
    const osnum = getCookie('OS');
    const tipoItemAtual = (tipoImagemSelecionada || 'BORNE').toUpperCase();

    // Verifica se há pelo menos um arquivo DWG no array
    const temArquivoDWG = arquivosBornesImportados.some(item => item.file && item.tipo === 'DWG');

    // Validações básicas
    if (temArquivoDWG == false || X === "" || Y === "") {
        alert(result_campos_required);
        return;
    }

    // Mostra o modal de loading
    modalBornesLoadingShow();

    // Prepara o FormData com todos os dados
    formFileDin = new FormData();
    
    // Adiciona somente um arquivo DWG no FormData.
    const itemDwg = arquivosBornesImportados.find(item => item.file && item.tipo === 'DWG');
    if (itemDwg) {
        formFileDin.append('FileAcessorio', itemDwg.file);
    }
    
    // Adiciona os dados do formulário
    formFileDin.append('OS', JSON.stringify(osnum));
    formFileDin.append('Area', JSON.stringify(area));
    formFileDin.append('X', JSON.stringify(X));
    formFileDin.append('Y', JSON.stringify(Y));
    formFileDin.append('tipo_item', tipoItemAtual);

    console.log(`📦 Enviando FormData para BornesConfigUpdateCadBlock... tipo_item=${tipoItemAtual}`);

   
    $.ajax({
        type: "POST",
        url: "BornesConfigUpdateCadBlock/",
        headers: obterCsrfHeaders(),
        dataType: "json",
        data: formFileDin,
        processData: false,
        contentType: false,
        success: function (data) {
            modalBornesLoadingHide();
            console.log('✓ Resposta do servidor:', data);
            
            if (data['STATUS'] && data['STATUS'].length === 0) {
               
                swalAlert_DOC(false, result_dwg_save_positive, result_icon_positive, false).then(() => {
                    modalBornesRenderShow();
                });
            } else if (data['STATUS']) {
             
                swalAlert(false, `${data['STATUS']}`, 'warning', false);
            } else {
               
                swalAlert(false, result_arquivo_saved, result_icon_info, false);
            }
        },
        error: function(xhr, status, error) {
            modalBornesLoadingHide();
            console.error('✗ Erro no upload:', error);
            swalAlert(false, `${result_arquivo_save_error_prefix}${error}`, result_icon_error, false);
        }
    });
}
