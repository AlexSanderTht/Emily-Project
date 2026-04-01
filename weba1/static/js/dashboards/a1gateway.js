window.addEventListener("load", async function () {
    await fill_all_elements()
});

async function fill_all_elements(){
    // Função que preenche todos os elementos da forma que vem ao abrir a ferramenta
    const loader = document.querySelector(".loader");
    loader.className += " hidden"; // class "loader hidden"
    edit_modal('modal-load-portaria', 'Aguarde...', true)
    $('#modal-load-portaria').modal('show')
    let Info = await GetDatasInfo()
    clean_filters_portaria()
    await exec_all_funcs_datas(Info)
    $('#modal-load-portaria').modal('hide')
}

async function exec_all_funcs_datas(Info){
    await UpdateDate(Info)
    await CardPortaria1(Info)
    await DadosTabela(Info)
    await DadosGraficoBarraEmpilhada(Info)
    await DadosGraficoRosca(Info)
}
//////////// Cartão Portaria - IP ////////////

async function PortariaSelecionada(Info) {
    //let Info = await GetDatasInfo();
    let port_select = Info['portaria_selecionada_first']
    let Catraca_IP = document.getElementById("CatracaIP").textContent = port_select
    Catraca_IP[0];
}

async function FiltroCatraca(Info) {
    //let Info = await GetDatasInfo();
    let filtro_catraca = Info['catraca_distinta']
    let itemlist = ''
    for (indices in filtro_catraca) {
        let catraca = filtro_catraca[indices]
        itemlist += `<label class="form-check-label">
                        ${catraca}
                     </label>`
    }
    document.getElementById('CatracaCheckDefault').innerHTML = itemlist
}

//////////// Início Funções Cartões ////////////
async function CardPortaria1(Info) {
    //let Info = await GetDatasInfo();
    let cartao_p1 = Info['quantidade_catraca_p1']
    let cartao_p2 = Info['quantidade_catraca_p2']
    let cartao_p3 = Info['quantidade_catraca_p3']
    let cartao_ref = Info['quantidade_catraca_ref']
    let cartao_recep = Info['quantidade_catraca_recep']
    let CardP1 = document.getElementById("CardPort1").textContent = cartao_p1
    let CardP2 = document.getElementById("CardPort2").textContent = cartao_p2
    let CardP3 = document.getElementById("CardPort3").textContent = cartao_p3
    let CardRF = document.getElementById("CardRef").textContent = cartao_ref
    let CardRP = document.getElementById("CardRecep").textContent = cartao_recep
}

//////////// Fim Funções Cartões ////////////

async function FiltroPessoas(Info) {
    //let Info = await GetDatasInfo();
    let nomes = Info['nome_pessoas_distintas']
    let itemlist = ''
    for (indices in nomes) {
        let nome = nomes[indices]
        itemlist += `<option>${nome}</option>`
    }
    document.getElementById('colaborador').innerHTML = itemlist
}

async function FiltroTipoEvento(Info) {
    //let Info = await GetDatasInfo();
    let event_type = Info['unique_event_type']
    let itemlist = ''
    for (indices in event_type) {
        let evento = event_type[indices]
        itemlist += `<option>${evento}</option>`
    }
    document.getElementById('refeicao').innerHTML = itemlist
}

$(document).ready(function () {
})

async function DadosTabela(Info) {
    let dados_tabela = Info['dataframe_tabela']
    let table_aux = ``
    document.getElementById('table-body').innerHTML = ''
    $('#spinnersblade').hide()
    $('#table').show()
    for (let i = 0; i < dados_tabela.length; i++) {
        table_aux += `<tr>
                        <td>${dados_tabela[i]['DATA_HORA']}</td>
                        <td>${dados_tabela[i]['TIPO']}</td>
                        <td>${dados_tabela[i]['EQPI_DESCRICAO']}</td>
                        <td>${dados_tabela[i]['PES_NOME']}</td>
                 </tr>`
    }
    document.getElementById('table-body').innerHTML = table_aux
}


async function DadosGraficoBarraEmpilhada(Info) {
    //let Info = await GetDatasInfo();
    let x_axis = Info['data_distinta']
    let dados = Info['couter_dados_data']
    var datasets = []
    var object_data_set = []
    var eixo_x = []
    var vai = []
    var datas = []
    datas = Object.keys(dados)
    var catracas = []
    catracas = Object.keys(dados)
    var fundo = []
    fundo = Object.keys(dados)
    for (let j = 0; j < catracas.length; j++) {
        if (catracas[j] === 'PORTARIA 01') {
            fundo = '#fc580c'
        } else if (catracas[j] === 'PORTARIA 02') {
            fundo = '#d9e1df'
        } else if (catracas[j] === 'PORTARIA 03') {
            fundo = '#ffa927'
        } else if (catracas[j] === 'REFEITORIO') {
            fundo = '#333237'
        } else if (catracas[j] === 'RECEPCAO') {
            fundo = '#0f4571'
        }
        object_data_set.push({
            label: catracas[j],
            data: dados[catracas[j]],
            backgroundColor: fundo,
        })
        eixo_x.push({
            label: catracas[datas],
        })
    }
    datasets = object_data_set

    new Chart(document.getElementById("bar-chart-grouped"), {
        type: 'bar',
        data: {
            labels: x_axis,
            datasets: datasets,
        },
        options: {
            title: {
                display: true,
                text: 'Pessoas por Data & Catraca'
            },
            tooltips: {
                displayColors: true,
                callbacks: {
                    mode: 'x',
                },
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false,
                    }
                }],
                yAxes: [{
                    stacked: true,
                    ticks: {
                        beginAtZero: true,
                    },
                    type: 'linear',
                }]
            },
            responsive: true,
            maintainAspectRatio: false,
            legend: {position: 'bottom'},
        }
    });
}

//////////// Função Retorna Dados JSON através do Ajax ////////////
async function GetDatasInfo() {
    let request = await $.ajax({
        url: "/app/dashboards/GetData/",
        method: "GET",
        data: {}
    });
    return request
}

async function UpdateDate(Info){
    var date = Info['date_updated']
    document.getElementById('AtualizacaoGateway').textContent = ''
    document.getElementById('AtualizacaoGateway').textContent = 'Atualizado em ' + date
}

async function CatracasSelecteds(Info){
    // Funçãozinha muito é zika que lista todas as catracas selecionadas no header do dashh
    var selecteds = Info['catracas_selecteds']
    var context = ''
    document.getElementById('catracas-selecteds').textContent = ''
    for (let i = 0; i < selecteds.length; i++){
        if (i != 0) {
            context = ', ' + selecteds[i]
        }
        else {
            context = selecteds[i]
        }
        document.getElementById('catracas-selecteds').textContent += context
    }
}
function pick_persons_and_catracas(){
    // função que pega os elementos selecionados e faz a verificação para saber qual é a catraca e a pessoa
    var persons_cat = {'persons': [], 'cat': [], 'ev': []}
    var all_elements_html = document.querySelectorAll('.fs-option.g0.selected')
    for (let i = 0; i < all_elements_html.length; i++){
        if (all_elements_html[i].parentElement.textContent.length > 90){
            persons_cat['persons'].push(all_elements_html[i].dataset.value)
        }
        else if (all_elements_html[i].parentElement.textContent.length == 37){
            persons_cat['ev'].push(all_elements_html[i].dataset.value)
        }
        else {
            persons_cat['cat'].push(all_elements_html[i].dataset.value)
        }
    }
    return persons_cat

}
async function PostDataInfo() {
    // event.preventDefault()  Não recarrega página, apenas os dados
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let date_initial = document.getElementById("DataInicio").value  // data inicial
    let date_final = document.getElementById("DataFim").value  // data final
    let elements_selecteds = pick_persons_and_catracas()  // foi feito essa função pois a estrutura para verificar qual é qual é trabalhosa
    if(elements_selecteds['persons'].length == 0 && elements_selecteds['cat'].length == 0 && elements_selecteds['ev'].length == 0 && date_initial == "" && date_final == ""){  // verifica se n tem nada preenchido
        reload_graphs('daddy-chart', 'doughnut-chart', `<canvas class="" id="doughnut-chart" width="" height=""></canvas>`)  // executa essa função pois tem um bug na hora de criar um o grafico novamemte
        reload_graphs('graph-daddy', 'bar-chart-grouped', `<canvas id="bar-chart-grouped" width="" height="227px"></canvas>`)
        return await fill_all_elements()  // retorna os elementos no estado inicial da pagina
    }
    else {
        if (date_initial && date_final) {
            if (verif_date(date_initial, date_final) == false) {
                return change_color_date('form-control is-invalid')
            }
        }
        edit_modal('modal-load-portaria', 'Aguarde...', true)  // exibe o modal sem o footer.
        $('#modal-load-portaria').modal('show')
    }
    let post_datas = JSON.stringify({'per': elements_selecteds['persons'],
                      'catracas': elements_selecteds['cat'],
                      'ev': elements_selecteds['ev'],
                      'date_initial': date_initial,
                      'date_final': date_final})   // dados q vao pro back end
    await $.ajax({
        type: 'POST',
        headers:{'X-CSRFToken':csrftoken},
        url: "/app/dashboards/GetData/",
        dataType: 'json',
        data: {'data': post_datas}, // data sent with the post request
        success: function (data){
            if (data['all_datas']['dataframe_tabela'].length == 0){  // verifica se a pesquisa foi invalida
                return edit_modal('modal-load-portaria', 'Aviso!!', false)
            }
            else{  // cai nessa condição quando a pesquisa é feita com sucesso
                reload_graphs('daddy-chart', 'doughnut-chart', `<canvas class="" id="doughnut-chart" width="" height=""></canvas>`)
                reload_graphs('graph-daddy', 'bar-chart-grouped', `<canvas id="bar-chart-grouped" width="" height="227px"></canvas>`)
                exec_all_funcs_datas(data['all_datas'])
                $('#modal-load-portaria').modal('hide')
            }
        },
        error: function(data){
            alert("Erro inesperado, atualizade a pagina e tente novamente!!")
        }
    })
}

function verif_date(data_inicio, data_fim){
    // Funçãozinha que verifica se a hora inicial é maior que a final
    var dt_init_format = Date.parse(data_inicio)
    var dt_finish_format = Date.parse(data_fim)
    if (dt_init_format > dt_finish_format){
        return false
    }
    else {
        return true
    }
}

function change_color_date(class_name){
    // mudar a cor da cada quando ela é invalida
    document.getElementById('DataInicio').className = class_name
    document.getElementById('DataFim').className = class_name
}
function clean_filters_portaria(){
    // limpa todos os formularios
    var itens_selecteds = document.querySelectorAll('.fs-option.g0.selected')
    var labels = document.querySelectorAll('.fs-label')
    for (let i = 0; i < labels.length; i++){
        labels[i].textContent = 'Selecione'
    }
    for (let i = 0; i < itens_selecteds.length; i++){
        itens_selecteds[i].className = 'fs-option g0'
    }
    document.getElementById("DataInicio").value=''
    document.getElementById("DataFim").value=''
}
//Gráfico de Rosca

function reload_graphs(element_daddy, element_son, structure_element_son){
    // Funçãozinha mai monstra q limpa os graficos para inserir novos
    document.getElementById(element_son).remove()
    document.getElementById(element_daddy).innerHTML= structure_element_son
}
async function DadosGraficoRosca(Info) {
    let dados = Info['donut_count']
    let datasets = []
    let object_data_set = []
    let list_values = []
    let catracas = []
    catracas = Object.keys(dados)
    let fundo = []
    let cont_all_values = 0
    for (let j = 0; j < catracas.length; j++) {
        if (catracas[j] === 'PORTARIA 01') {
            fundo.push('#fc580c')
        } else if (catracas[j] === 'PORTARIA 02') {
            fundo.push('#d9e1df')
        } else if (catracas[j] === 'PORTARIA 03') {
            fundo.push('#ffa927')
        } else if (catracas[j] === 'REFEITORIO') {
            fundo.push('#333237')
        } else if (catracas[j] === 'RECEPCAO') {
            fundo.push('#0f4571')
        }
        list_values.push(dados[catracas[j]])
        cont_all_values += dados[catracas[j]]
    }
    if (cont_all_values) {
        for (let j = 0; j < list_values.length; j++) {
        list_values[j] = ((list_values[j]/cont_all_values) * 100).toFixed(2)
        }
    }


    object_data_set.push({
        label: catracas,
        data: list_values,
        backgroundColor: fundo,

    })
    datasets = object_data_set
    // console.log(dados)


    var options = {
        tooltips: {
            enabled: false
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    let sum = 0;
                    let dataArr = ctx.chart.data.datasets[0].data;
                    dataArr.map(data => {
                        sum += data;
                    });
                    let percentage = (value * 100 / sum).toFixed(2) + "%";
                    return percentage;
                },
                color: '#ff9900',
            }
        }
    };
    var mychart = new Chart(document.getElementById("doughnut-chart"), {
        type: 'doughnut',
        data: {
            labels: catracas,
            datasets: datasets,
        },
        options: {
            legend: {display: false},
            title: {
                display: true,
                text: 'Pessoas por portaria'
            }
        },
    });

}




//Gráfico de Barras Empilhadas Modelo Padrão
// DadosGraficoBarraEmpilhada()
// async function DadosGraficoBarraEmpilhada() {
//     let Info = await GetDatasInfo();
//     let x_axis = Info['x_axis']
//     let y_axis = Info['y_axis']
//     new Chart(document.getElementById("myChart4"), {
//         type: 'bar',
//         data: {
//           labels: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"],
//           datasets: [{
//             label: 'PORTARIA 1',
//             backgroundColor: "#fc580c",
//             data: [12, 59, 5, 56, 58,12, 59, 87, 45, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87],
//           }, {
//             label: 'PORTARIA 2',
//             backgroundColor: "#d9e1df",
//             data: [12, 59, 5, 56, 58,12, 59, 85, 23, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87],
//           }, {
//             label: 'PORTARIA 3',
//             backgroundColor: "#ffa927",
//             data: [12, 59, 5, 56, 58,12, 59, 65, 51, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87],
//           }, {
//             label: 'REFEITÓRIO',
//             backgroundColor: "#333237",
//             data: [12, 59, 5, 56, 58, 12, 59, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87],
//           }, {
//             label: 'RECEPÇÃO',
//             backgroundColor: "#0f4571",
//             data: [12, 59, 5, 56, 58, 12, 59, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87, 45, 12, 74, 12, 59, 5, 56, 58,12, 59, 87],
//           }],
//         },
//         options: {
//           title: {
//             display: true,
//             text: 'Pessoas por Data & Catraca'
//           },
//           tooltips: {
//             displayColors: true,
//             callbacks:{
//               mode: 'x',
//             },
//           },
//           scales: {
//             xAxes: [{
//               stacked: true,
//               gridLines: {
//                 display: false,
//               }
//             }],
//             yAxes: [{
//               stacked: true,
//               ticks: {
//                 beginAtZero: true,
//               },
//               type: 'linear',
//             }]
//           },
//           responsive: true,
//           maintainAspectRatio: false,
//           legend: { position: 'bottom' },
//         }
//         });