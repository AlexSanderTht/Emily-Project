// -------------------- Bloco de Funções para preencher todos os selects -----------------------------------

async function get_datas_class_isol(){
    // Função que pega todos os dados pertinentes do back end pro front
    var datas = {}
    if(verify_selects_show_modal('isolacao') === true){
        let os = $('#pro-os').val();
        await $.ajax({
          type: "GET",
          url: "ClasseIsol/" + os,
          dataType: 'json',
          success: function (data){
              datas = data
          },
          failure: function(error){
          },
         })
    }
    return datas
}

async function fill_all_selects(){
    // Executa todas as funções que preenche os selects
    var datas = await get_datas_class_isol()
    document.getElementById('func-class-isol').disabled=0
    document.getElementById('all-funcs-class-isol').checked=false
    await fill_select_func(datas['funcaoOS'])
    await fill_selects_isol(datas['isol'])
    await fill_selects_ci(datas['CI'])
}
async function fill_select_func(data){
    // Preenche o select de função
    var dict_datas = data
    var options_funcs = `<option value="none">Selecione uma Função</option>`
    for(ids in dict_datas){
        options_funcs += `<option value="${ids}">${dict_datas[ids]}</option>`
    }
    document.getElementById('func-class-isol').innerHTML = options_funcs
}

async function fill_selects_isol(data){
    // Preenche todos os selects de isolação
    var dict_datas = data
    var options_funcs = `<option value="none">Selecione uma Isolação</option>`
    for(ids in dict_datas){
        options_funcs += `<option value="${ids}">${dict_datas[ids]}</option>`
    }
    document.getElementById('bt-isol').innerHTML = options_funcs
    document.getElementById('mt-isol').innerHTML = options_funcs
    document.getElementById('nt-isol').innerHTML = options_funcs
    document.getElementById('tr-isol').innerHTML = options_funcs
}

async function fill_selects_ci(data){
    // Funçãozinha que preenche todos os formularios de classe de isolação
    var dict_datas = data
    var options_bt = `<option value="none">Selecione uma Classe de Isolação</option>`
    var options_mt = `<option value="none">Selecione uma Classe de Isolação</option>`
    var options_tr = `<option value="none">Selecione uma Classe de Isolação</option>`
    var options_nt = `<option value="none">Selecione uma Classe de Isolação</option>`
    for(var i = 0; i < dict_datas['id'].length; i++){
        if(dict_datas['type'][i] == 'BT'){
            options_bt += `<option value="${dict_datas['id'][i]}">${dict_datas['class_isol'][i]}</option>`
        }
        else if(data['type'][i] == 'MT'){
            options_mt += `<option value="${dict_datas['id'][i]}">${dict_datas['class_isol'][i]}</option>`
        }
        else if(data['type'][i] == 'NEUTRO'){
            options_nt += `<option value="${dict_datas['id'][i]}">${dict_datas['class_isol'][i]}</option>`
        }
        else {
            options_tr += `<option value="${dict_datas['id'][i]}">${dict_datas['class_isol'][i]}</option>`
        }
    }
    document.getElementById('tr-class-isol').innerHTML = options_tr
    document.getElementById('nt-class-isol').innerHTML = options_nt
    document.getElementById('bt-class-isol').innerHTML = options_bt
    document.getElementById('mt-class-isol').innerHTML = options_mt
}

// -------------------- Fim do Bloco de Funções para preencher todos os selects -----------------------------------


// -------------------- Bloco de Funções para manipular os dados -----------------------------------
function pick_and_verify_morrings(){
    // Funçãozinha que pega a função e a classe de isolacao e isolação, verifica se foi selecionada de forma valida, se for invalidade da um alert e retorna false
    var dict_for_return = {}
    var func = $('#func-class-isol').val();
    var morrings ={'BT': {'ci': $('#bt-class-isol').val(), 'isol': $('#bt-isol').val()},
                   'MT': {'ci': $('#mt-class-isol').val(), 'isol': $('#mt-isol').val()},
                   'NEUTRO': {'ci': $('#nt-class-isol').val(), 'isol': $('#nt-isol').val()},
                   'TERRA': {'ci': $('#tr-class-isol').val(), 'isol': $('#tr-isol').val()}}
    if(document.getElementById('all-funcs-class-isol').checked){
        func = 'ALL'
    }
    if (func == 'none' && document.getElementById('all-funcs-class-isol').checked == false){
        alert("Selecione uma Função!!")
        return false
    }
    for(types in morrings){  // forzinho de verificação de amarrações para não deixar o usuario mandar sem classe de isolação ou isolação como 'none'
        if((morrings[types]['ci'] != 'none' && morrings[types]['isol'] == 'none') || (morrings[types]['ci'] == 'none' && morrings[types]['isol'] != 'none')){
            alert("Para amarrar uma função você precisa selecionar a Classe de Isolação e também Isolação")
            return false
        }
    }
    dict_for_return['fos'] = func
    dict_for_return['morrings'] = morrings
    return dict_for_return
}

function manipuling_all_funcs(){
    if(document.getElementById('all-funcs-class-isol').checked){
        $('#func-class-isol').val("none")
        return document.getElementById('func-class-isol').disabled=1
    }
    else{
        return document.getElementById('func-class-isol').disabled=0
    }
}
async function send_morrings(){
    // Funçãozinha que envia as amarrações pro back-end
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    var all_datas = await pick_and_verify_morrings()
    if(all_datas!=false){
        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "ClasseIsol/" + $('#pro-os').val(),
              data: {'datas': JSON.stringify(all_datas)},
              success: function(data){
                  alert(data['SUCESSO'])
                  fill_all_selects()
              },
              error: function(error){
                  alert('Houve um erro inesperado')
              }
          });
    }
    else{
        return false
    }
}

function clean_selects(){
    // Funçãozinha somente para limpar os selects
    var all_ids = ['bt-class-isol', 'mt-class-isol', 'nt-class-isol', 'tr-class-isol']
    for(var i = 0; i < all_ids.length; i++){
        $('#'+ all_ids[i]).val("none")
        $('#'+ all_ids[i].replace("-class","")).val("none")
    }
}

async function ChangeFunc(){
    // Pega todas as amarrações e joga na variavel global
    clean_selects()
    var func = $('#func-class-isol').val();
    if (func!="none"){
        await $.ajax({
           type: "GET",
           url: "MorringsCI/" + func + "/",
           dataType: 'json',
           success: function (data){
               FillSelectsWhenChangeFunc(data['all_datas'])
           },
           failure: function(error){
           },
        })
    }

}

function FillSelectsWhenChangeFunc(array_dicts){
    for(var i = 0; i < array_dicts.length; i++){
        $('#'+df_convert_type_class_isol[array_dicts[i]['type']]+'-class-isol').val(array_dicts[i]['class_isol'])
        $('#'+df_convert_type_class_isol[array_dicts[i]['type']]+'-isol').val(array_dicts[i]['isol'])
    }
}

// -------------------- Fim do Bloco de Funções para manipular os dados -----------------------------------