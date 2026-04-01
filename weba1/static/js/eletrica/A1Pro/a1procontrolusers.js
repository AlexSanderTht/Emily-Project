async function change_os_a1procontrol(){
    // Função acionada quando muda de os, manipula os containers e pega os dados de requisições
    let os = $(`#procontrol-os`).val()
    if(os!="none"){
        document.getElementById('procontrol-filter').disabled=false
        $('#container-all-persons').show()
        $('#container-no-persons').hide()
        await fill_all_items_a1procontrol()
    }
    else{
        $('#container-all-persons').hide()
        $('#container-no-persons').show()
        document.getElementById('procontrol-filter').disabled=true
    }
}
window.onload = $(`#procontrol-os`).val("none");$('#alter_perm_a1procontrol').hide();

async function pick_all_persons_a1procontrol(){
    // Usada somente para pegar todos os dados da url e retornar eles
    let datas = {}
    await $.ajax({
        type: "GET",
        url: "AllPersonsA1ProControl/" + $(`#procontrol-os`).val(),
        dataType: 'json',
        success: function (data){
            datas = data
      },
      failure: function(error){
          alert("erro")
      },
    })
    return datas
}

function create_select_hierarchy(datas_hierarchy, hiearchyperson, id_person){
    // Cria o select por pessoa e manda selecionado com base a hierarquia dela salva no banco
    var id_selected = hiearchyperson[id_person]
    var select = ''
    if (id_selected!=undefined){
        select = `<option value="none">Selecione a hierarquia</option>`
        for(ids in datas_hierarchy){
            if(ids == id_selected){
                select += `<option value="${ids}" selected>${datas_hierarchy[ids]}</option>`
            }
            else {
                select += `<option value="${ids}">${datas_hierarchy[ids]}</option>`
            }
        }
    }
    else{
        select = `<option value="none" selected>Selecione a hierarquia</option>`
        for(ids in datas_hierarchy){
            select += `<option value="${ids}">${datas_hierarchy[ids]}</option>`
        }
    }
    return select
}

async function fill_all_items_a1procontrol(){
    // Cria o conteudo do container, verifica se tem filtros, se tiver faz o container com o filtro e se não tiver manda os dados de todas as pessoas
    let filter = false
    var all_datas = await pick_all_persons_a1procontrol()
    var cont = 0
    let select = ''
    let content_container = ``
    let form_text_filter = document.getElementById('procontrol-filter').value
    if (form_text_filter.length > 0){
        filter = true
    }
    if (filter == false){
        for(id_person in all_datas['persons']){
            if (cont === 14){
                document.getElementById('container-all-persons').className+= ' content-persons-a1procontrol '
            }
            select = create_select_hierarchy(all_datas['hierarchy'], all_datas['hierarchys_per_person'], id_person)
            content_container += increment_str_container(all_datas['persons'][id_person], id_person, select)
            cont = cont +1
        }
    }
    else{
        for(id_person in all_datas['persons']){
            if (cont === 14){
                document.getElementById('container-all-persons').className+= ' content-persons-a1procontrol '
            }
            if(all_datas['persons'][id_person].toUpperCase().includes(form_text_filter.toUpperCase())){
                select = create_select_hierarchy(all_datas['hierarchy'], all_datas['hierarchys_per_person'], id_person)
                content_container += increment_str_container(all_datas['persons'][id_person], id_person, select)
                cont = cont +1
            }
        }
    }
    $('#container-all-persons').html(content_container)
}

async function change_hierarchy(id){
    // Ao trocar de hierarquia ja manda pro back end e cadastra no banco a nova hierarquia da pessoa
    let hierarchy = document.getElementById(id)
    if(hierarchy.value!="none"){
        await $.ajax({
              type: "POST",
              url: "AllPersonsA1ProControl/" + $(`#procontrol-os`).val(),
              dataType: 'json',
              data: {'all_datas': JSON.stringify({'id_hierarchy': hierarchy.value,
                                                        'id_person': hierarchy.name})},
              success: function(data){
                  manipuling_modal_a1pro('Hierarquia criada na os: '+ $(`#procontrol-os`).val(), data['Sucesso'])
              },
              error: function () {
                  alert('pau na viola')
              }
        });
    }
}

function increment_str_container(name_person, id_person, select){
    // Função usada somente para incrementar a string de criação dos elementos html no container
    let str_container = `
            <div class="row border-bottom border-dark">
                <div class="col-lg-9 mt-1 pl-4 align-self-center">
                    ${name_person}
                </div>

                <div class="col-lg-3 mt-1">
                    <select id="select-person-${id_person}" name="${id_person}" class="form-control form-control-sm mb-1" onchange="change_hierarchy(this.id)">
                        ${select}
                    </select>
                </div>
            </div>`
    return str_container
}

async function pick_persons_and_gerents(){
    // Funçãozinha que faz uma requisição que retorna todas pessoas e todos gerentes
    let datas = {}
    await $.ajax({
        type: "GET",
        url: "AllPersonsAcessA1pro/",
        dataType: 'json',
        success: function (data){
            datas = data
      },
      failure: function(error){
          alert("erro")
      },
    })
    return datas
}

async function show_modal_gerents_fill_elements(){
    // Abre o modal de gerentes e preenche todos os elementos dele
    edit_modal('modal-load-a1pro-control', 'Aguarde...', true)
    $('#modal-load-a1pro-control').modal('show')
    var datas = await pick_persons_and_gerents()
    fill_select_all_persons(datas['persons'])
    fill_select_gerents(datas['gerents'])
    $('#procontrol-os').val("none")
    $('#container-all-persons').hide()
    $('#container-no-persons').show()
    $('#modal-load-a1pro-control').modal('hide')
    $('#modal-gerenc-gest-a1procontrol').modal('show')
}

function fill_select_all_persons(all_persons){
    // Preeenche o select de pessoas
    var options_persons = ``
    $('#all-persons-geren-gest').html(options_persons)
    for(id in all_persons){
        options_persons += `<option value="${id}" draggable="true" ondragstart="drag_person_for_gerent(event, ${id}, 'id_person')">${all_persons[id]}</option>`
    }
    $('#all-persons-geren-gest').html(options_persons)
}

function fill_select_gerents(all_gerents){
    // preenche o select de gerentes
    var options_gerents = ``
    $('#gerents-a1pro').html(options_gerents)
    for(id in all_gerents){
        options_gerents += `<option value="${id}" draggable="true" ondragstart="drag_person_for_gerent(event, ${id}, 'id_person_for_trash')">${all_gerents[id]}</option>`
    }
    $('#gerents-a1pro').html(options_gerents)
}

function drag_person_for_gerent(event, id_person, key){
    // Função acionada ao arrastar pessoa, quardando o id para pegar ele na hora de soltar o elemento
    event.dataTransfer.setData(key, id_person)
}

async function drop_person_for_gerent(event){
    // acionada quando dropa a pessoa no select
    event.preventDefault()
    let id_person = event.dataTransfer.getData('id_person')
    await send_person_for_gerent(id_person)
    changecolor_gerents(event, 'white', 'gerents-a1pro')
    let datas = await pick_persons_and_gerents()
    fill_select_all_persons(datas['persons'])
    fill_select_gerents(datas['gerents'])
}

async function drop_gerent_for_trash(event){
    // acionada arrasta o gerente pra lixeira
    event.preventDefault()
    let id_person = event.dataTransfer.getData('id_person_for_trash')
    await send_gerent_for_trash(id_person)
    changecolor_gerents(event, 'gray', 'btn_thrash_gerents')
    let datas = await pick_persons_and_gerents()
    fill_select_all_persons(datas['persons'])
    fill_select_gerents(datas['gerents'])
}
async function send_gerent_for_trash(id_person){
    // manda o gerente pro banckend para excluir ele
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
          type: "DELETE",
          headers: {'X-CSRFToken': csrftoken},
          url: "AllPersonsAcessA1pro/",
          dataType: 'json',
          data: { 'id_person': id_person },
          success: function (data){
              return alert(data['return'])
          },
          failure: function(error){
              return alert("erro")
          },
    })
}
function changecolor_gerents(event, color, element) {
    // Função para mudar a cor do elemento
    event.preventDefault()
    const select = document.getElementById(element)
    select.style.backgroundColor = color
}

async function send_person_for_gerent(id_person){
    // manda a pessoa para o backend para adicionar ela como gerente
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
          type: "POST",
          headers: {'X-CSRFToken': csrftoken},
          url: "AllPersonsAcessA1pro/",
          dataType: 'json',
          data: { 'id_person': id_person },
          success: function (data){
              return alert(data['return'])
          },
          failure: function(error){
              return alert("erro")
          },
    })
}

function filter_persons_a1pro_control(id_element_filter, str_filter){
    let select_options = document.getElementById(id_element_filter).options
    for (let i = 0; i < select_options.length;i++){
        if(select_options[i].innerHTML.toUpperCase().includes(str_filter.toUpperCase())){
            select_options[i].hidden = false
        }
        else{
            select_options[i].hidden = true
        }
    }
}