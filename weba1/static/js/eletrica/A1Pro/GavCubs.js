
async function handleCubs(){
    // pega todos os cubiculos
    var objs_cubs = {}
    var all_cubs = {}
    var num_os = document.getElementById('pro-os').value
    if (num_os == ""){
        return alert("Por Favor selecione uma OS!!")
    }
    await $.ajax({
          type: "GET",
          url: "Cubiculos/" + num_os,
          dataType: 'json',
          success: function (data){
              for(i in data){
                  objs_cubs['tb_cub_nome'] = data[i]['tb_cub_nome']
                  objs_cubs['tb_cub_id_eq_ele'] = data[i]['tb_cub_id_eq_ele']
                  all_cubs[data[i]['tb_cub_id']] = objs_cubs
                  objs_cubs = {}
              }
          },
          failure: function(error){
              alert("erro")
         },
    })
    return all_cubs
}

async function handleGavs(id_painel){
    // pega todos os cubiculos
    var objs_gavs = {}
    var all_gavs = {}
    var num_os = document.getElementById('pro-os').value
    await $.ajax({
          type: "GET",
          url: "Gavetas/" + num_os,
          dataType: 'json',
          success: function (data){
              for(i in data){
                  objs_gavs['tb_gav_nome'] = data[i]['tb_gav_nome']
                  objs_gavs['tb_gav_id_cub'] = data[i]['tb_gav_id_cub']
                  all_gavs[data[i]['tb_gav_id']] = objs_gavs
                  objs_gavs = {}
              }
          },
          failure: function(error){
              alert("erro")
          },
    })
    return all_gavs
}

async function handlePaineis(){
    // pega todos os paineis
    var objs_paineis = {}
    var all_paineis = {}
    var num_os = $(`#pro-os`).val()
    if (num_os == 'none'){
        return alert("Por Favor selecione uma OS!!")
    }
    all_paineis = []
    await $.ajax({
          type: "GET",
          url: "Paineis/" + num_os + '/',
          dataType: 'json',
          success: function (data){

              for(let i in data['data']){
                  all_paineis.push(data['data'][i])
              }
              $('#gav-cub').modal('show')
          },
          failure: function(error){
              alert("erro")
          },
    })
    return all_paineis
}

async function print_options_painel(){
    clear_gav()
    clear_cub()
    clear_cargas()
    var datas = await handlePaineis()
    var options = `<option value="none">Selecione um Painel</option>`
    var all_tags = []
    for(tuple in datas){
        options += `<option value="${datas[tuple][0]}">${datas[tuple][1]}</option>`
    }
    $('#select-paineis').html(options)
}

function print_options_cubs_and_gavs() {
    pick_cubs()
}

function pick_gavs(){
    clear_gav()
    clear_cargas()
    var objs_gav = {}
    var all_gav = {}
    var painel = $('#select-paineis').val();
    var cub = $('#select-cubs').val();
    let options_gav = ''
    let class_btp = ''
    $.ajax({
          type: "GET",
          url: "Gavetas/" + painel + "/" + cub,
          dataType: 'json',
          success: function (data){
              fill_cargas_painel(data['list_equips'])
              options_gav = `<option value="none">----</option>`
              for(let ids in data['data']){

                  if (data['data'][ids]['carga'] == 1 || data['data'][ids]['tb_gav_reserve'] == 1){
                      class_btp = 'bg-success'
                  }
                  else{
                      class_btp = 'bg-danger'
                  }
                  options_gav += `<option class="${class_btp}" value=${data['data'][ids]['tb_gav_id']}>${data['data'][ids]['tb_gav_nome']}</option>`


                  // objs_gav['tb_gav_nome'] = data['data'][i]['tb_gav_nome']
                  // objs_gav['tb_gav_id_cub'] = data['data'][i]['tb_gav_id_cub']
                  // objs_gav['tb_gav_reserve'] = data['data'][i]['tb_gav_reserve']
                  // objs_gav['carga'] = data['data'][i]['carga']
                  // all_gav[data['data'][i]['tb_gav_id']] = objs_gav
                  // objs_gav = {}
              }
            $('#select-gav').html(options_gav)
          },
          failure: function(error){
              alert("erro")
          },
    })

}

function pick_cubs(){
    var objs_cub = {}
    var all_cub = []
    clear_gav()
    clear_cub()
    var id_painel = $('#select-paineis').val();
    if (id_painel !== 'none'){
        $.ajax({
          type: "GET",
          url: "Cubiculos/" + id_painel,
          dataType: 'json',
          success: function (data){
              fill_cubiculos(data['data'])
              fill_cargas_painel(data['list_equips'])
          },
          failure: function(error){
              alert("erro")
          },
        })
    }
}


function fill_cubiculos(list_cubiculos){
    clear_cub()
    let options = `<option value="none">----</option>`
    for(let id in list_cubiculos){
        options += `<option value=${list_cubiculos[id][0]}>${list_cubiculos[id][1]}</option>`
    }
    document.getElementById('select-cubs').innerHTML = options
}

function fill_cargas_painel(list_cargas){
    clear_cargas()
    let cards = ''
    let back_groud_color_card
    for (let id in list_cargas){
        back_groud_color_card = '#F8F8F8'
        if(!list_cargas[id][1]){
            back_groud_color_card = '#ffbfbf'
        }
        cards+=  `
            <div class="card" style="background-color: ${back_groud_color_card}">
                <div class="card-body">${list_cargas[id][0]}</div>
            </div>`
    }
    document.getElementById('cargas_painel_cub_gav').innerHTML = cards

}

function clear_cargas(){
    document.getElementById('cargas_painel_cub_gav').innerHTML = ''
}

function clear_gav(){
    document.getElementById('select-gav').innerHTML = `<option value="none">----</option>`
}

function clear_cub(){
    document.getElementById('select-cubs').innerHTML = `<option value="none">----</option>`
}

function gav_selected(){
    // await print_cub_per_gav()
    var id_gav = $('#select-gav').val();
    var id_painel = $('#select-paineis').val();
    var reserve = ''
    var id = ''
    var dict_return = {}
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
          type: "POST",
          url: "GavReserve/" + id_painel + '/' + id_gav,
          headers: {'X-CSRFToken': csrf},
          dataType: 'json',
          success: function (data){
              fill_cargas_painel(data['list_equips'])
              document.getElementById('gav-reserve').checked = data['data'] === 1;
          },
          failure: function(error){
              alert("erro")
          },
    })
}

function gavs_per_cub(){
    var obj_gavs = {}
    var all_gavs = {}
    var painel = $('#select-paineis').val();
    var cub = $('#select-cubs').val();
    if (cub === 'none'){
        return 0
    }
    $.ajax({
          type: "GET",
          url: "Gavetas/" + painel + "/" + cub,
          dataType: 'json',
          success: function (data){

              for(i in data['data']){
                  obj_gavs['tb_gav_nome'] = data['data'][i]['tb_gav_nome']
                  obj_gavs['tb_gav_id_cub'] = data['data'][i]['tb_gav_id_cub']
                  obj_gavs['tb_gav_reserve'] = data['data'][i]['tb_gav_reserve']
                  obj_gavs['carga'] = data['data'][i]['carga']
                  all_gavs[data['data'][i]['tb_gav_id']] = obj_gavs
                  obj_gavs = {}
              }
              document.getElementById('btn-del-gav-cub').disabled=0
          },
          failure: function(error){
              alert("erro")
          },
    })
    return all_gavs
}

async function print_options_gav_per_cub(){
    var gavs = await gavs_per_cub()
    var options_gavs = `<option value="none">----</option>`
    var all_tags = []
    var class_btp = ''
    if (gavs == 0){
        return await print_options_cubs_and_gavs()
    }
    for(ids in gavs){
        if (all_tags.includes(gavs[ids]['tb_gav_nome'])){
            //
        }
        else{
            if (gavs[ids]['carga'] == 1 || gavs[ids]['tb_gav_reserve'] == 1){
                class_btp = 'bg-success'
            }
            else{
                class_btp = 'bg-danger'
            }
            all_tags.push(gavs[ids]['tb_gav_nome'])
            options_gavs += `<option class="${class_btp}" value=${gavs[ids]['tb_gav_nome']}>${gavs[ids]['tb_gav_nome']}</option>`
        }
    }
    $('#select-gav').html(options_gavs)
}

async function pick_gav(){
    var obj_cub = {}
    var all_cub = {}
    var gav = $('#select-gav').val();
    var painel = $('#select-paineis').val();
    if (gav == 'none'){
        return 0
    }
    await $.ajax({
          type: "GET",
          url: "CubPerGav/"+ painel + "/" + gav,
          dataType: 'json',
          success: function (data){
              for(i in data){
                  obj_cub['tb_cub_nome'] = data[i]['tb_cub_nome']
                  obj_cub['tb_cub_id_eq_ele'] = data[i]['tb_cub_id_eq_ele']
                  all_cub[data[i]['tb_cub_id']] = obj_cub
                  obj_cub = {}
              }
              document.getElementById('btn-del-gav-cub').disabled=0
          },
          failure: function(error){
              alert("erro")
          },
    })
    return all_cub
}

async function print_cub_per_gav(){
    var cub = await pick_gav()
    if (cub == 0){
        return await print_options_cubs_and_gavs()
    }
    var option_cub = `<option value="none">----</option>`
    for (id in cub){
        option_cub += `<option value=${cub[id]['tb_cub_nome']} selected>${cub[id]['tb_cub_nome']}</option>`
    }
    $('#select-cubs').html(option_cub)
}

function change_reserve(){
    var gav = $('#select-gav').val();
    var painel = $('#select-paineis').val();
    var reserve = $('#gav-reserve').prop('checked')
    const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
          type: "PUT",
          url: "GavReserve/" + painel + "/" + gav,
          dataType: 'json',
          headers: {'X-CSRFToken': csrf},
          data: {'reserve': reserve},
          success: function (data){
              if (data['sucess']){
                  alert(data['sucess'])
              }
              else{
                  alert(data['error'])
              }
          },
          failure: function(error){
              alert("erro")
          },
    })
}

function show_modal(){
    $('#register-gav-cub').show()
}

async function print_cubs_reg(){
    var cubs = await pick_cubs()
    var all_tags = []
    var options = ""

    document.getElementById('select-gav').disabled=1
    document.getElementById('select-cubs').disabled=1
    $('#options-cub-reg').html(options)
}

function clean_forms_register(){
    document.getElementById('form-register-cub').value=""
    document.getElementById('form-register-gav').value=""
}

async function register_cubs(){
    var sucess = 0
    var id_cub = document.getElementById('form-register-cub').value
    var id_painel = $('#select-paineis').val()
    const regex = /\W|_/
    if (id_cub === ""){
        return swalAlert('Preenchimeto do Cubiculo!', 'É necessário inserir um cubiculo para o cadastro', 'error', false)
    }
    if (regex.test(id_cub)){
        clean_forms_register()
        return swalAlert('Caracteres Cubiculo!', 'É necessário inserir um cubiculo sem caracteres especiais', 'error', false)
    }
    await $.ajax({
          type: "POST",
          url: "RegCub/",
          dataType: 'json',
          data: {'cub': id_cub,
                 'painel': id_painel},
          success: function (data){
              if (data['success']){
                  sucess = 1
              }
              else if(data['passa']){
                  sucess = 1
              }
              else{
                  alert(data['erro'])
              }
          },
          failure: function(error){
              alert("Erro Inesperado")
          },
    })
    return sucess
}

async function register_gavs(){
    let painel = $('#select-paineis').val()
    if (painel === 'none'){
        return swalAlert('Painel não selecionado!', 'É necessário selecionar o painel para a criação do cubiculo e da gaveta', 'error', false)
    }
    let func_cub = await register_cubs()
    if (func_cub === 1){
        var reserve = ''
        var cub = document.getElementById('form-register-cub').value
        var gav = document.getElementById('form-register-gav').value
        var checkbox = document.getElementById('gav-reserve-reg')
        const regex = /\W|_/
        if(checkbox.checked){
            reserve = 1
        }
        else{
            reserve = 0
        }

        if (gav === ""){
            return swalAlert('Preenchimeto da Gaveta!', 'É necessário preencher corretamente para inserir uma gaveta', 'error', false)

        }
        if (regex.test(gav)){
            clean_forms_register()
            return swalAlert('Caracteres Gaveta!', 'É necessário inserir um gaveta sem caracteres especiais', 'error', false)
        }
        await $.ajax({
          type: "POST",
          url: "RegGav/",
          dataType: 'json',
          data: {'cub': cub,
                 'painel': painel,
                 'gav': gav,
                 'reserve': reserve},
          success: function (data){
              if (data['success']){
                  swalAlert('Cadastro da gaveta', data['success'], 'success', false)
                  clean_forms_register()
              }
              else{
                  swalAlert('gaveta não cadastrada', data['erro'], 'error', false)
              }
          },
          failure: function(error){
              alert("Erro Inesperado")
          },
        })
    }
}

async function verif_cub_del(){
    var painel = $('#select-paineis').val()
    var cub = $('#select-cubs').val();
    await $.ajax({
          type: "POST",
          url: "DelCub/",
          dataType: 'json',
          data: {'cub': cub,
                 'painel': painel},
          success: function (data){
              if (data['success']){
                  return del_cub()
              }
              else if(data['reserve']){
                  return manipuling_modal(data['reserve'], '#content-modal-del', '#modal-del')
              }
              else{
                  // aqui excluir mostrando o modal e deletando filhos antes
                  return manipuling_modal(data['erro'], '#content-modal-del', '#modal-del')
              }
          },
          failure: function(error){
              alert("Erro Inesperado")
          },
    })
}

function manipuling_modal(msg, element_body, modal){
    var content = `<p>${msg}</p>`
    $(element_body).html(content)
    $(modal).modal('show')
}

async function del_cub(){
    var cub =  $('#select-cubs').val()
    var painel = $('#select-paineis').val()
    await $.ajax({
          type: "DELETE",
          url: "DelCub/",
          dataType: 'json',
          data: {'cub_del': cub,
                 'painel_del': painel},
          success: function (data){
              if(data['success']){
                  $('#modal-del').modal('hide')
                  alert(data['success'])
              }
              else{
                  $('#modal-del').modal('hide')
                  alert(data['erro'])
              }
              return print_options_cubs_and_gavs()
          },
          failure: function(error){
              $('#modal-del').modal('hide')
              alert("Erro Inesperado")
          },
    })
}

async function verif_gav_del(){
    var painel = $('#select-paineis').val()
    var cub = $('#select-cubs').val();
    var gav = $('#select-gav').val();
    await $.ajax({
          type: "POST",
          url: "DelGav/",
          dataType: 'json',
          data: {'cub': cub,
                 'painel': painel,
                 'gav': gav},
          success: function (data){
              if (data['carga']){
                  // avisa modal se tiver carga
                  return manipuling_modal(data['carga'], '#content-modal-del-gav', '#modal-del-gav')
              }
              else if(data['reserve']){
                  // modal avisando da reserva
                  return manipuling_modal(data['reserve'], '#content-modal-del-gav', '#modal-del-gav')
              }
              else if (data['success']){
                  // sucesso sem modal so alerta
                  return del_gav()
              }
              else{
                  // ERRO
                  return alert(data['erro'])
              }
          },
          failure: function(error){
              alert("Erro Inesperado")
          },
    })

}

async function what_func(){
    if ($('#select-gav').val() == 'none'){

        await verif_cub_del()
        // clear_cub()
        // swalAlert('Cubiculo removido!', 'Cubiculo foi removido', 'success', false)
    }
    else{
        await verif_gav_del()
        // clear_gav()
        // swalAlert('Gaveta removida!', 'Gaveta foi removida', 'success', false)
    }
}

async function del_gav(){
    var painel = $('#select-paineis').val()
    var cub = $('#select-cubs').val();
    var gav = $('#select-gav').val();
    await $.ajax({
          type: "DELETE",
          url: "DelGav/",
          dataType: 'json',
          data: {'cub': cub,
                 'painel': painel,
                 'gav': gav},
          success: function (data){
              if (data['success']){
                  $('#modal-del-gav').modal('hide')
                  alert(data['success'])
              }
              else{
                  $('#modal-del-gav').modal('hide')
                  alert(data['erro'])
              }
              return print_options_cubs_and_gavs()
          },
          failure: function(error){
              $('#modal-del-gav').modal('hide')
              alert("Erro Inesperado")
          },
    })
}