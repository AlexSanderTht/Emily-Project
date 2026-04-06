window.addEventListener("load", async function () {
    // await fill_all_elements()
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
    await PreencheValorConsumido(Info)
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

async function SendLicValue(){
    let value_lic = document.getElementById('valor_lic_unit').value
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let request = await $.ajax({
        url: "/app/dashboards/ValueLic/",
        method: "POST",
        headers:{'X-CSRFToken':csrftoken},
        data: {'data': value_lic},
        dataType: 'json',
    }).done(function(data){
        alert(data['data']);
    });
}

async function RecivieLicValue(){
    let value_lic = document.getElementById('valor_lic_unit').value
    let request = await $.ajax({
        url: "/app/dashboards/ValueLic/",

        method: "GET",
        data: {},
    }).done(function(data){
        document.getElementById('valor_lic_unit').value = data['data']
    });
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

async function PreencheValorConsumido(Info){
    let lics_qtd = Info['license_used']
    let valor_lics = Info['value_unit_licence']

    document.getElementById('quant_lic').innerHTML = `${parseFloat(lics_qtd)}`
    document.getElementById('valor_lic').innerHTML = `${numberToReal(parseFloat(valor_lics) * parseFloat(lics_qtd))}`
}

function numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$: " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
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
        fundo = getRandColor(5)
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
                text: 'N° de Acessos por Data'
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
        url: "/app/dashboards/GetDataE3D/",
        method: "GET",
        data: {}
    });
    return request
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
        console.log(all_elements_html[i].parentElement.textContent)
        if(all_elements_html[i].parentElement.textContent.startsWith('OS')){
            persons_cat['cat'].push(all_elements_html[i].dataset.value)
        }else{
            persons_cat['persons'].push(all_elements_html[i].dataset.value)
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
    edit_modal('modal-load-portaria', 'Aguarde...', true)  // exibe o modal sem o footer.
    $('#modal-load-portaria').modal('show')
    let post_datas = JSON.stringify({'per': elements_selecteds['persons'],
                      'catracas': elements_selecteds['cat'],
                      'ev': elements_selecteds['ev'],
                      'date_initial': date_initial,
                      'date_final': date_final})   // dados q vao pro back end
    await $.ajax({
        type: 'POST',
        headers:{'X-CSRFToken':csrftoken},
        url: "/app/dashboards/GetDataE3D/",
        dataType: 'json',
        data: {'data': post_datas}, // data sent with the post request
        success: function (data){
            setTimeout(function() {
                $('#modal-load-portaria').modal('hide');  // Hide the modal
            }, 500);  // 2000ms = 2 seconds
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
        fundo.push(getRandColor(4))
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
            legend: {display: true,
                    position: 'top',},
            responsive: true,
            title: {
                display: true,
                text: 'Percentual por OS'
            }
        },
    });

}



function getRandColor(brightness){

    // Six levels of brightness from 0 to 5, 0 being the darkest
    var rgb = [Math.random() * 256, Math.random() * 256, Math.random() * 256];
    var mix = [brightness*51, brightness*51, brightness*51]; //51 => 255/5
    var mixedrgb = [rgb[0] + mix[0], rgb[1] + mix[1], rgb[2] + mix[2]].map(function(x){ return Math.round(x/2.0)})
    return "rgb(" + mixedrgb.join(",") + ")";
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