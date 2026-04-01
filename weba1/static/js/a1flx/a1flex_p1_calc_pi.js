// Inicialização das variáveis para função de adiocionar ou remover linhas de dados a serem calculados
var btn_add_tubo = document.getElementById('add_linha_tubo');
var btn_rm_tubo = document.getElementById('remove_linha_tubo');
var btn_add_flange = document.getElementById('add_linha_flange');
var btn_rm_flange = document.getElementById('remove_linha_flange');
var dntubo = document.getElementById('dntubo');
var normatubo = document.getElementById('normatubo');
var sch = document.getElementById('sch');
var materialtubo = document.getElementById('materialtubo');
var pmtatubo = document.getElementById('pmtatubo');
var dnflange = document.getElementById('dnflange');
var normaflange = document.getElementById('normaflange');
var classepressao = document.getElementById('classepressao');
var materialflange = document.getElementById('materialflange');
var pmtaflange = document.getElementById('pmtaflange');
var contadortubo = 3; // A página padrão começa com três linhas
var contadorflange = 3; // A página padrão começa com três linhas

var listaNormaSch; // Variável que irá receber do python o dicionário com a norma como chave e a lista de sch como valor
var listaNps;
var lista_materiais_tub;
var lista_classe_pressao;
var lista_materiais_flange;
var lista_norma_flange;

window.onload = function(){
    carregaListas()
}

// Quando clicar no botão chama a função
btn_add_tubo.addEventListener('click', function(){
    adicionar_linha_tubo();
})
btn_add_flange.addEventListener('click', function(){
    adicionar_linha_flange();
})
btn_rm_tubo.addEventListener('click', function(){
    remover_linha_tubo();
})
btn_rm_flange.addEventListener('click', function(){
    remover_linha_flange();
})

function pagCarregada(){
    // Quando a página é atualizada no f5 e alguma opção foi selecionada os arquivos de cache faz com que essas opções ainda estejam selecionadas e o evento 'onchange' desses campos não são aplicados. O código abaixo resolve esse problema.
    // Vale também para apagar os resultados dos cálculos anteriores à atualização da página.
    for(var i = 1; i < 4; i++){
        var elementot = Object($('#dnt'+i+'_1'))[0] // Recebe os elementos dos diâmetros do tubo
        var elementof = Object($('#dnf'+i+'_1'))[0] // Recebe os elementos dos diâmetros do flange
        var elementon = Object($('#normatubo'+i))[0] // Recebe os elementos das normas do tubo
        if(elementot.value != '----'){ // se o valor do select for diferente do padrão no html
            mostraDn2(elementot)
        }
        if(elementof.value != '----'){
            mostraDn2(elementof)
        }
        if(elementon.value != '--Selecione--'){
            mostraListaSch(elementon)
        }
        limparPmta()
    }
    
}

function adicionar_linha_tubo(){
    contadortubo++
    // Adicionar duas novas colunas na coluna do diâmetro
    $('#dntubo').append('<div id="dntubo'+contadortubo+'" class="row mb-1 mx-0 altura-caixa">')
    $('#dntubo'+contadortubo).append('<select id="dnt'+contadortubo+'_1" class="form-control my-1" onchange="mostraDn2(this)">')
    $('#dnt'+contadortubo+'_1').append('<option disabled selected>----</option>')
    for(var i = 0; i < listaNps.length; i++){
        var option = new Option(listaNps[i])
        $('#dnt'+contadortubo+'_1').append(option)
    }
    $('#dnt'+contadortubo+'_1').wrap('<div class="col px-1">')
    $('#dntubo'+contadortubo).append('<select id="dnt'+contadortubo+'_2" class="form-control my-1" onchange="limparPmta(this.parentNode.parentNode, true)"></select>')
    $('#dnt'+contadortubo+'_2').wrap('<div class="col px-1">')

    // Adicionar nova coluna na coluna da norma dimensional
    $('#normatubo').append('<select id="normatubo'+contadortubo+'" class="form-control my-1" onchange="mostraListaSch(this)">')
    $('#normatubo'+contadortubo).append('<option disabled selected>--Selecione--</option>')
    var listaNorma = Object.keys(listaNormaSch) // pega as chaves do dicionário criado no python
    for(var i = 0; i < listaNorma.length; i++){
        $('#normatubo'+contadortubo).append(new Option(listaNorma[i]))
    }
    
    // Adicionar nova coluna na coluna do SCH
    $('#sch').append('<select id="sch'+contadortubo+'" class="form-control my-1" onchange="limpaValidacao(this)"></select>')

    // Adicionar nova coluna na coluna do material do tubo
    $('#materialtubo').append('<select id="materialtubo'+contadortubo+'" class="form-control my-1" onchange="limpaValidacao(this)">')
    $('#materialtubo'+contadortubo).append('<option disabled selected>--Selecione--</option>')
    for(var i = 0; i < lista_materiais_tub.length; i++){
        $('#materialtubo'+contadortubo).append(new Option(lista_materiais_tub[i][0]+' - '+lista_materiais_tub[i][1], i))
    }

    // Adicionar nova coluna na coluna da pmta do tubo
    $('#pmtatubo').append('<input id="pmtatubo'+contadortubo+'" class="form-control text-center font-weight-bold my-1" type="text" readonly>')
 }

 function remover_linha_tubo(){
    var colunadn = document.getElementById('dntubo' + contadortubo);
    var colunanorma = document.getElementById('normatubo' + contadortubo);
    var colunasch = document.getElementById('sch' + contadortubo);
    var colunamaterial = document.getElementById('materialtubo' + contadortubo);
    var colunapmta = document.getElementById('pmtatubo' + contadortubo);
    dntubo.removeChild(colunadn);
    normatubo.removeChild(colunanorma);
    sch.removeChild(colunasch);
    materialtubo.removeChild(colunamaterial);
    pmtatubo.removeChild(colunapmta);
    contadortubo--;
}

 function adicionar_linha_flange(){
    contadorflange++
    // Adicionar duas novas colunas na coluna do diâmetro
    $('#dnflange').append('<div id="dnflange'+contadorflange+'" class="row mb-1 mx-0 altura-caixa">')
    $('#dnflange'+contadorflange).append('<select id="dnf'+contadorflange+'_1" class="form-control my-1" onchange="mostraDn2(this)">')
    $('#dnf'+contadorflange+'_1').append('<option disabled selected>----</option>')
    for(var i = 0; i < listaNps.length; i++){
        var option = new Option(listaNps[i])
        $('#dnf'+contadorflange+'_1').append(option)
    }
    $('#dnf'+contadorflange+'_1').wrap('<div class="col px-1">')
    $('#dnflange'+contadorflange).append('<select id="dnf'+contadorflange+'_2" class="form-control my-1 onchange="limparPmta(this.parentNode.parentNode, true)""></select>')
    $('#dnf'+contadorflange+'_2').wrap('<div class="col px-1">')

    // Adicionar nova coluna na coluna da norma do flange
    $('#normaflange').append('<select id="normaflange'+contadorflange+'" class="form-control my-1" onchange="limpaValidacao(this)"">')
    $('#normaflange'+contadorflange).append('<option disabled selected>--Selecione--</option>')
    for(var i = 0; i < lista_norma_flange.length; i++){
        $('#normaflange'+contadorflange).append(new Option(lista_norma_flange[i]))
    }
    
    // Adicionar nova coluna na coluna do classe de pressão
    $('#classepressao').append('<select id="classepressao'+contadorflange+'" class="form-control my-1" onchange="limpaValidacao(this)"></select>')
    $('#classepressao'+contadorflange).append('<option disabled selected>--Selecione--</option>')
    for(var i = 0; i < lista_classe_pressao.length; i++){
        $('#classepressao'+contadorflange).append(new Option(lista_classe_pressao[i]))
    }
    

    // Adicionar nova coluna na coluna do material do flange
    $('#materialflange').append('<select id="materialflange'+contadorflange+'" class="form-control my-1" onchange="limpaValidacao(this)">')
    $('#materialflange'+contadorflange).append('<option disabled selected>--Selecione--</option>')
    for(var i = 0; i < lista_materiais_flange.length; i++){
        $('#materialflange'+contadorflange).append(new Option(lista_materiais_flange[i]))
    }

    // Adicionar nova coluna na coluna da pmta do tubo
    $('#pmtaflange').append('<input id="pmtaflange'+contadorflange+'" class="form-control text-center font-weight-bold my-1" type="text" readonly>')
    
 }

 function remover_linha_flange(){
    var colunadn = document.getElementById('dnflange' + contadorflange);
    var colunanorma = document.getElementById('normaflange' + contadorflange);
    var colunaclasse = document.getElementById('classepressao' + contadorflange);
    var colunamaterial = document.getElementById('materialflange' + contadorflange);
    var colunapmta = document.getElementById('pmtaflange' + contadorflange);
    dnflange.removeChild(colunadn);
    normaflange.removeChild(colunanorma);
    classepressao.removeChild(colunaclasse);
    materialflange.removeChild(colunamaterial);
    pmtaflange.removeChild(colunapmta);
    contadorflange--;
}

function carregaListas(){
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url : "/app/flexibilidade/pi/", // the endpoint
        type : "POST", // http method
        dataType : "json",
        data : {'csrfmiddlewaretoken': csrf[0].value}, // data sent with the post request
    
        // handle a successful response
        success : function(json) {
            listaNormaSch = json['lista_norma_sch']
            listaNps = json['lista_nps']
            lista_materiais_tub = json['list_mat_tubo']
            lista_classe_pressao = json['lista_classe_pressao']
            lista_materiais_flange = json['list_mat_flange']
            lista_norma_flange = json['lista_norma_flange']
            pagCarregada()
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            console.log(errmsg)
             // add the error to the dom
        }
    });
}
function abrirTabela()
{
    window.open('tabelaaux', '_blank').focus();
}
function mostraDn2(elemento){ // função para mostrar a lista de diâmetros na segunda coluna após o usuário selecionar um diâmetro na primeira coluna
    var dnId = elemento.id.slice(0, 5) // Pega o id (linha) do elemento que foi alterado
    var dn2Id = elemento.id.slice(0, 5)+'2' // Variável com o id da segunda coluna de diâmetro
    $('#'+dn2Id).empty() // limpa o <select> atual.
    var option1 = new Option('----')
    option1.setAttribute('disabled', true)
    $('#'+dn2Id).append(option1);
    for(var i = listaNps.indexOf(elemento.value); i < listaNps.length; i++){ // Laço para criar as novas opções.
        var option2 = new Option(listaNps[i])
        $('#'+dn2Id).append(option2)
    }
    $('#'+dnId+'1').removeClass('invalido')        
    $('#'+dnId+'2').removeClass('invalido') 
    limparPmta(elemento.parentNode.parentNode, true)
}


function mostraListaSch(elemento){ // função para mostrar a lista de SCHs após o usuário selecionar a norma do tubo
    var id = elemento.id.slice(-1); // Pega o id (linha) do elemento que foi alterado
    var schId = 'sch'+id// Cria o id do select do sch correspondente ao id select da norma
    var listaSch = listaNormaSch[elemento.value] // Recebe a lista do sch correto com base na norma escolhida pelo usuário.
    $("#"+schId).empty(); // limpa o <select> atual.
    var option1 = new Option('--Selecione--')
    option1.setAttribute('disabled', true)
    option1.setAttribute('selected', true)
    $("#"+schId).append(option1);
    for(var i = 0; i < listaSch.length; i++){ // Laço para criar as novas opções.
        var option2 = new Option(listaSch[i]);
        $("#"+schId).append(option2);
    }
    limpaValidacao(elemento)
    limparPmta(elemento, true)
}

function limpaValidacao(elemento){ // função para limpar a borda vermelha da validação de dados
    var elementId = elemento.id
    $('#'+elementId).removeClass('sugestao')
    $('#'+elementId).removeClass('invalido')
    limparPmta(elemento, true)
}

function limparPmta(elemento, limpalinha){
    // função para limpar o valor da PMTA calculada
    if (limpalinha){ // se for verdadeiro limpa somente a linha que está sendo alterada, esse caso vai acontecer quando alterar algum valor na linha
        if (elemento.id.slice(0, 3) == 'dnt' || elemento.id.slice(0, 6) == 'normat' || elemento.id.slice(0, 3) == 'sch' || elemento.id.slice(0, 9) == 'materialt'){ // verifica se a linha que está sendo alterada está no campo do tubo
            var linhaId = elemento.id.slice(-1)
            var elementopmtat = Object($('#pmtatubo'+linhaId))
            elementopmtat.val("")
            elementopmtat.removeClass('invalido')
        }
        else{
            var linhaId = elemento.id.slice(-1)
            var elementopmtaf = Object($('#pmtaflange'+linhaId))
            elementopmtaf.val("")
            elementopmtaf.removeClass('invalido')
        }
    }
    else{ // se não limpa todas as linhas, esse caso vai acontecer quando alterar temperatura, pressão, espessura de corrosão ou atualizar a página
        for(var i = 1; i <= contadortubo; i++){
            var elementopmtat = Object($('#pmtatubo'+i))  // Recebe os elementos das pmtas do tubo  
            if(elementopmtat.val()){
                elementopmtat.val("")
                elementopmtat.removeClass('invalido')                
            }
        }
        for(var i = 1; i <= contadorflange; i++){
            var elementopmtaf = Object($('#pmtaflange'+i)) // Recebe os elementos das pmtas do flange
            if(elementopmtaf.val()){
                elementopmtaf.val("")
                elementopmtaf.removeClass('invalido')
            }    
        }
    }
    for(var i = 0; i <= 10; i++ ){
        $("#t"+i).val("")
        $("#p"+i).val("")
    }
}

async function calcular() {  

    var pmta_menor = {pmta_tubo: false, pmta_flange: false, linhatubo: false, linhaflange: false} // Dicionário para guardar o elemento menos resistente para criar a faixa de aplicação
    var tempmax = parseFloat($('#tempmax').val())
    var pressaomax = parseFloat($('#pressaomax').val())
    var espessuracorrosao = parseFloat($('#especorrosao').val())
    var linhas_tubo = [] // Array que vai guardar as linhas do campo tubo que estão preenchidas
    var linhas_flange = [] // Array que vai guardar as linhas do campo flange que estão preenchidas

    // Verificação se algum dado de entrada básico está faltando. Checa se o usuário entrou com o valor da pressão, temperatura e espessura de corrosão.
    if (isNaN(tempmax) && isNaN(pressaomax)){
        $('#errotempmax').html(
            `<div class="alert alert-danger" role="alert">
                Temperatura Inválida.
            </div>`
        )
        $('#erropressaomax').html(
            `<div class="alert alert-danger" role="alert">
                Temperatura Inválida.
            </div>`
        )
        return;
    }
    if (isNaN(tempmax)) {
        $('#errotempmax').html(
            `<div class="alert alert-danger" role="alert">
                Temperatura Inválida.
            </div>`
        )
        return;

    }
    else {
        $('#errotempmax').html('')
    }
    if (isNaN(pressaomax)) {
        $('#erropressaomax').html(
            `<div class="alert alert-danger" role="alert">
                Pressão Inválida.
            </div>`
        )
        return;
    }
    else {
        $('#erropressaomax').html('')

    }
    if (isNaN(espessuracorrosao)) {
        document.getElementById('especorrosao').value = 0 // Se o usuário não preencher um valor de espessura de corrosão o valor padrão é 0
        var espessuracorrosao = 0
    }

    if(contadortubo >= contadorflange){
        var quantidade_linhas = contadortubo
    }
    else {
        var quantidade_linhas = contadorflange
    }

    // laço para verificar quais linhas do tubo e flange estão preenchidas
    for (i = 1; i <= quantidade_linhas; i++){
        if($('#dnt'+i+'_1').val() && $('#normatubo'+i).val() && $('#sch'+i).val() && $('#materialtubo'+i).val()){ // se todos os campos da linha i do tubo estão preenchidos, pega o id (i) da linha
            linhas_tubo.push(i)
            
        }
        else if($('#dnt'+i+'_1').val() || $('#normatubo'+i).val() || $('#sch'+i).val() || $('#materialtubo'+i).val()){ // verifica se há pelo menos um dado preenchido na linha i do tubo
            if(!($('#dnt'+i+'_1').val())){
                $('#dnt'+i+'_1').addClass('invalido')
                $('#dnt'+i+'_2').addClass('invalido')
            }
            if(!($('#normatubo'+i).val())){
                $('#normatubo'+i).addClass('invalido')
            }
            if(!($('#sch'+i).val())){
                $('#sch'+i).addClass('invalido')
            }
            if(!($('#materialtubo'+i).val())){
                $('#materialtubo'+i).addClass('invalido')
            }
        }
        

        if($('#dnf'+i+'_1').val() && $('#normaflange'+i).val() && $('#classepressao'+i).val() && $('#materialflange'+i).val()){ // se todos os campos da linha i do tubo estão preenchidos
            linhas_flange.push(i)
        }
        else if($('#dnf'+i+'_1').val() || $('#normaflange'+i).val() || $('#classepressao'+i).val() || $('#materialflange'+i).val()){ // verifica se há pelo menos um dado preenchido na linha i do flange
            if(!($('#dnf'+i+'_1').val())){
                $('#dnf'+i+'_1').addClass('invalido')
                $('#dnf'+i+'_2').addClass('invalido')
            }
            if(!($('#normaflange'+i).val())){
                $('#normaflange'+i).addClass('invalido')
            }
            if(!($('#classepressao'+i).val())){
                $('#classepressao'+i).addClass('invalido')
            }
            if(!($('#materialflange'+i).val())){
                $('#materialflange'+i).addClass('invalido')
            }
        }
    }
    const resultados_tubo = []
    for(var i = 0; i < linhas_tubo.length; i++){
        var norma_dimen = $('#normatubo'+linhas_tubo[i]).val()
        var nps01 = $('#dnt'+linhas_tubo[i]+'_1').val()
        var nps02 = $('#dnt'+linhas_tubo[i]+'_2').val()
        var sch = $('#sch'+linhas_tubo[i]).val()
        var material_t = {
            'material': lista_materiais_tub[$('#materialtubo'+linhas_tubo[i]).val()][0],
            'fabricacao': lista_materiais_tub[$('#materialtubo'+linhas_tubo[i]).val()][1],
        }

        resultados_tubo.push($.ajax({
            type: "GET",
            url: "resultado/",
            dataType: 'json',
            data: {'norma_dimen': norma_dimen, 'material_t': JSON.stringify(material_t), 'nps01': nps01, 'nps02': nps02, 'sch': sch, 'tempmax': tempmax,'pressaomax': pressaomax, 'espcorrosao': espessuracorrosao, 'id': 'tubo'},

            }).done(function(data){})
        )
    }
    const resultados_flange = []
    for(var i = 0; i < linhas_flange.length; i++){
        var norma_fl = $('#normaflange'+linhas_flange[i]).val()
        var nps01 = $('#dnf'+linhas_flange[i]+'_1').val()
        var nps02 = $('#dnf'+linhas_flange[i]+'_2').val()
        var classe_pressao = $('#classepressao'+linhas_flange[i]).val()
        var material_flange = $('#materialflange'+linhas_flange[i]).val()

        resultados_flange.push($.ajax({
            type: "GET",
            url: "resultado/",
            dataType: 'json',
            data: {'norma_flange': norma_fl, 'material_fl': material_flange, 'nps01': nps01, 'nps02': nps02, 'classe_p': classe_pressao, 'tempmax': tempmax,'pressaomax': pressaomax,'espcorrosao': espessuracorrosao, 'id': 'flange'},

            }).done(function(data){})
        )
    }
    const results_tubo = await Promise.allSettled(resultados_tubo)
    const results_flange = await Promise.allSettled(resultados_flange)
    for(var i = 0; i < linhas_tubo.length; i++){
        if(results_tubo[i].status === 'fulfilled'){
            if(!pmta_menor.pmta_tubo || results_tubo[i].value[0].pmta <= pmta_menor.pmta_tubo) {
                pmta_menor.pmta_tubo = results_tubo[i].value[0].pmta
                pmta_menor.linhatubo = linhas_tubo[i]
            }
            $('#pmtatubo'+linhas_tubo[i]).val(results_tubo[i].value[0].pmta)
            if($('#pmtatubo'+linhas_tubo[i]).val() < pressaomax){
                $('#pmtatubo'+linhas_tubo[i]).addClass('invalido')
            }
            else($('#pmtatubo'+linhas_tubo[i]).removeClass('invalido'))
        }
        else {
            // TRATAR DOS ERROS E MOSTRAR NA TELA
            // console.log(results_tubo[i].reason)
            console.log("ERRO")
        }
    }
    for(var i = 0; i < linhas_flange.length; i++){
        if(results_flange[i].status === 'fulfilled'){
            if(!pmta_menor.pmta_flange || results_flange[i].value[0].pmta <= pmta_menor.pmta_flange) {
                pmta_menor.pmta_flange = results_flange[i].value[0].pmta
                pmta_menor.linhaflange = linhas_flange[i]
            }
            $('#pmtaflange'+linhas_flange[i]).val(results_flange[i].value[0].pmta)
            if($('#classepressao'+linhas_flange[i]).val() == 'Sugestão da ferramenta'){
                $('#classepressao'+linhas_flange[i]).val(results_flange[i].value[0].classe_sugestao)
                $('#classepressao'+linhas_flange[i]).addClass('sugestao')
            }
            if($('#pmtaflange'+linhas_flange[i]).val() < pressaomax){
                $('#pmtaflange'+linhas_flange[i]).addClass('invalido')
            }
            else($('#pmtaflange'+linhas_flange[i]).removeClass('invalido'))
        }
        else {
            // TRATAR DOS ERROS E MOSTRAR NA TELA
            // console.log(results_flange[i].reason)
            console.log("ERRO")
        }
    }
    calculoFaixaAplicacao(pmta_menor)
}

async function calculoFaixaAplicacao(pmta_menor){  
    var tempmax = parseFloat($('#tempmax').val())
    var pressaomax = parseFloat($('#pressaomax').val())
    var espessuracorrosao = parseFloat($('#especorrosao').val())  
    const resultados_faixa = []
    if(pmta_menor.pmta_flange < pmta_menor.pmta_tubo && pmta_menor.pmta_tubo && pmta_menor.pmta_flange || !pmta_menor.pmta_tubo){
        var norma_fl = $('#normaflange'+pmta_menor.linhaflange).val()
        var nps01 = $('#dnf'+pmta_menor.linhaflange+'_1').val()
        var nps02 = $('#dnf'+pmta_menor.linhaflange+'_2').val()
        var classe_pressao = $('#classepressao'+pmta_menor.linhaflange).val()
        var material_flange = $('#materialflange'+pmta_menor.linhaflange).val()
        resultados_faixa.push($.ajax({
            type: "GET",
            url: "resultado/",
            dataType: 'json',
            data: {'norma_flange': norma_fl, 'material_fl': material_flange, 'nps01': nps01, 'nps02': nps02, 'classe_p': classe_pressao, 'tempmax': tempmax,'pressaomax': pressaomax,'espcorrosao': espessuracorrosao, 'id': 'faixa_aplic_flange'},

            }).done(function(data){}))              

    } else {
        if(pmta_menor.pmta_flange > pmta_menor.pmta_tubo && pmta_menor.pmta_tubo && pmta_menor.pmta_flange || !pmta_menor.pmta_flange){
            var norma_dimen = $('#normatubo'+pmta_menor.linhatubo).val()
            var nps01 = $('#dnt'+pmta_menor.linhatubo+'_1').val()
            var nps02 = $('#dnt'+pmta_menor.linhatubo+'_2').val()
            var sch = $('#sch'+pmta_menor.linhatubo).val()
            var material_t = {
                'material': lista_materiais_tub[$('#materialtubo'+pmta_menor.linhatubo).val()][0],
                'fabricacao': lista_materiais_tub[$('#materialtubo'+pmta_menor.linhatubo).val()][1],
            }
            resultados_faixa.push($.ajax({
                type: "GET",
                url: "resultado/",
                dataType: 'json',
                data: {'norma_dimen': norma_dimen, 'material_t': JSON.stringify(material_t), 'nps01': nps01, 'nps02': nps02, 'sch': sch, 'tempmax': tempmax,'pressaomax': pressaomax, 'espcorrosao': espessuracorrosao, 'id': 'faixa_aplic_tubo'},
    
                }).done(function(data){}))   

        } else {
            if(pmta_menor.pmta_flange == pmta_menor.pmta_tubo && pmta_menor.pmta_tubo && pmta_menor.pmta_flange){
                var norma_fl = $('#normaflange'+pmta_menor.linhaflange).val()
                var classe_pressao = $('#classepressao'+pmta_menor.linhaflange).val()
                var material_flange = $('#materialflange'+pmta_menor.linhaflange).val()
                var norma_dimen = $('#normatubo'+pmta_menor.linhatubo).val()
                var nps01 = $('#dnt'+pmta_menor.linhatubo+'_1').val()
                var nps02 = $('#dnt'+pmta_menor.linhatubo+'_2').val()
                var sch = $('#sch'+pmta_menor.linhatubo).val()
                var material_t = {
                    'material': lista_materiais_tub[$('#materialtubo'+pmta_menor.linhatubo).val()][0],
                    'fabricacao': lista_materiais_tub[$('#materialtubo'+pmta_menor.linhatubo).val()][1],
                }
                resultados_faixa.push($.ajax({
                    type: "GET",
                    url: "resultado/",
                    dataType: 'json',
                    data: {'norma_dimen': norma_dimen, 'material_t': JSON.stringify(material_t), 'nps01': nps01, 'nps02': nps02, 'sch': sch, 'tempmax': tempmax,'pressaomax': pressaomax, 'espcorrosao': espessuracorrosao, 'norma_flange': norma_fl, 'material_fl': material_flange, 'classe_p': classe_pressao, 'id': 'faixa_aplic_igual'},
        
                    }).done(function(data){})) 
            }
        }
    }
    const results_faixa = await Promise.allSettled(resultados_faixa)
    if(results_faixa[0].status === 'fulfilled'){
        const faixa_aplic_temp = results_faixa[0].value[0].faixa_aplic_temp
        const faixa_aplic_pmta = results_faixa[0].value[0].faixa_aplic_pmta
        for(var i = 0; i < faixa_aplic_temp.length; i++){
            $('#t'+i).val(faixa_aplic_temp[i])
            $('#p'+i).val(faixa_aplic_pmta[i])
        }
    }
    else {
        // TRATAR DOS ERROS E MOSTRAR NA TELA
        // console.log(results_tubo[i].reason)
        console.log("ERRO")
    }
}

function trocaVirg(elemento) { // função para trocar vírgula por ponto
    $('#' + elemento.id).val($('#' + elemento.id).val().replace(',', '.'))
    $('#erro' + elemento.id).html('')
    limparPmta()
}

function limpaerro(elemento) { // função para limpar a mensagem de erro
    $('#erro' + elemento.id).html('')
}

$(function() {
    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});