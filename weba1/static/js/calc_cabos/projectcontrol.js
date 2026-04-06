const csrf = document.getElementsByName('csrfmiddlewaretoken')[0].value

function GetNomeValueNewProj(id_element_name){
    let nome_proj = document.getElementById(id_element_name).value
    if (nome_proj.length === 0){
        nome_proj = null
    }
    else{
        if(document.getElementById(id_element_name).title === '0'){
            nome_proj = null
        }
    }
    return nome_proj
}

function CreateNewProj(){
    let nome_proj = GetNomeValueNewProj('new_proj_name')
    if(nome_proj!==null){
        $.ajax({
          type: "POST",
          headers: {'X-CSRFToken': csrf},
          url: window.location.href,
          dataType: 'json',
          data: {'datasFront': JSON.stringify({'nome_projeto': nome_proj.trim(), 'checkbox_config': 'default', 'cols_use_bt': ColsDefaultBt(), 'cols_use_mt': ColsDefaultMt()})},
          success: function (data){
              setTimeout(()=>{
                  alert(data['return'])
                  document.location.reload(true)}, 1500)
          }
        });
    }
    else{
        swal({
            text: 'O nome digitado contem algum caractere especial!!',
            icon: "error",
            button: 'Fechar'
        })
    }

}

function DeleteProject(id_proj){
    $.ajax({
      type: "DELETE",
      headers: {'X-CSRFToken': csrf},
      url: 'DeleteProjectCalcCabos/' + id_proj + '/',
      dataType: 'json',
      data: {},
      success: function (data) {
          setTimeout(()=>{
              alert(data['return'])
              window.location.reload(true)},1500)
      },
    });
}

function OcultarProj(id_proj){
    console.log(id_proj)
    $.ajax({
      type: "POST",
      headers: {'X-CSRFToken': csrf},
      url: 'HideProjectCalcCabos/' + id_proj + '/',
      dataType: 'json',
      data: {},
      success: function (data){
          document.location.reload(true)
      },
    });
}


function CopyProj(id_proj_copy){
    let background = document.querySelectorAll(".bg_blue_rgb")

    // Caso selecionado outro item remove a cor e fundo azul do icone selecionado anteriormente.
    if (background.length > 0) {
        for(let i = 0; i < background.length; i++) {
            background[i].children[3].children[0].classList.remove('text-primary')
            background[i].children[3].children[0].classList.add('text-secondary')
            background[i].classList.remove('bg_blue_rgb')
        }
    }
    // Pega o nome do projeto selecionado
    let name_proj = $('#'+id_proj_copy)[0].children[1].innerHTML

    // Remove a cor padrão do icone e adiciona a cor azul ao fundo e ao icone selecionado
    $('#'+id_proj_copy)[0].children[3].children[0].classList.remove('text-secondary')
    $('#'+id_proj_copy)[0].children[3].children[0].classList.add('text-primary')
    $('#'+id_proj_copy)[0].classList.add('bg_blue_rgb')

    // passa valor do id para campo input para salvar e usaar posteriormente
    document.getElementById('transf_datas_proj').value=id_proj_copy

    manipuling_modal_a1pro('Projeto ' + name_proj + ' Copiado', 'Selecione em qual projeto gostaria de colar!!')
}

function PasteProj(id_proj_paste){
    let background = document.querySelectorAll(".bg_green_rgb")

    // Caso selecionado outro item remove a cor e fundo azul do icone selecionado anteriormente.
    if (background.length > 0) {
        for(let i = 0; i < background.length; i++) {
            background[i].children[4].children[0].classList.add('text-secondary')
            background[i].children[4].children[0].classList.remove('text-success')
            background[i].classList.remove('bg_green_rgb')
        }
    }
    // Remove a cor padrão do icone e adiciona a cor azul ao fundo e ao icone selecionado
    $('#'+id_proj_paste)[0].children[4].children[0].classList.remove('text-secondary')
    $('#'+id_proj_paste)[0].children[4].children[0].classList.add('text-success')
    $('#'+id_proj_paste)[0].classList.add('bg_green_rgb')

    var id_copy = document.getElementById('transf_datas_proj').value
    document.getElementById('transf_datas_proj').value=''
    $.ajax({
      type: "GET",
      headers: {'X-CSRFToken': csrf},
      url: 'CopyContentProjectCalcCabos/' + id_copy + '/' + id_proj_paste + '/',
      dataType: 'json',
      data: {},
      success: function (data){
          // DisabledAllCheckBoxProj(true, null)
          manipuling_modal_a1pro('Colado!', data['return'])
          window.location.reload(true)
      }
    });
}

function DisabledAllCheckBoxProj(disabled, value){
    var all_checkbox = document.querySelectorAll('[name="checkbox_selecao_proj"]')
    for(let i = 0; i < all_checkbox.length; i++){
        if(disabled === true){
            all_checkbox[i].disabled=disabled
            all_checkbox[i].checked = false
        }
        else{
            if(all_checkbox[i].value != value){
                all_checkbox[i].disabled=disabled
            }
        }
    }
}

function OnloadScreenProjectControl(){
    if(window.location.href === "http://127.0.0.1:8000/app/calc_cabos/projectcontrolcc/"){
        DisabledAllCheckBoxProj(true, null)
    }
}

function FilterProjProjectControl(nome_pojeto){
    var all_names_proj = document.querySelectorAll(".search_name_proj")
    for(let i = 0; i < all_names_proj.length; i++){
        let name_proj = all_names_proj[i].textContent
        if(name_proj.includes(nome_pojeto)){
            all_names_proj[i].parentElement.hidden = false
        }
        else{
            all_names_proj[i].parentElement.hidden = true
        }
    }
}

$(document).ready(function () {
    let table_proj = $('#TableProjectCalc').DataTable({
        "sDom": "<'row'<'col-sm-12 col-lg-2 offset-lg-10 align-self-end form-inline my-2'l><'d-none'Bf>>" +
                    "<'row'<'col-sm-12 col-lg-12'tr>>" +
                    "<'row mt-2'<'col-sm-12 col-lg-5 text-right'i><'col-sm-12 col-lg-7'p>>",
        "scrollY":    "475px",
        "scrollCollapse": true,
        "paging": false,
        "bFilter": false,
        "language": {
            "showing": 'Exibir',
            "emptyTable": "Nenhum Arquivo Encontrado.",
            "paginate": {
                "first":      "Primeiro",
                "last":       "Último",
                "next":       "Próximo",
                "previous":   "Anterior"
            },
            "info": "Exibindo de _START_ a _END_ de _TOTAL_ entradas",
            "lengthMenu": "Exibir: _MENU_",
        },

    });
    table_proj.column().order().draw()
    $('div.dataTables_length').addClass('d-flex justify-content-end')
    $('div.dataTables_length select').addClass('ml-2 rounded-pill')
    $('div.dataTables_scrollBody').addClass('overflow_firefox overflow_chrome')
    $('div.dataTables_scrollHeadInner table').addClass('mb-0')
});

function ChangeNivelTensaoInConfigProj(nivel_tensao){
    let content_show = nivel_tensao === 'BT'? 'cols_in_export_bt': 'cols_in_export_mt'
    let content_hide = nivel_tensao === 'BT'? 'cols_in_export_mt': 'cols_in_export_bt'
    let checkbox_selected = nivel_tensao === 'BT'? document.getElementById('last_checkbox_selected_bt').value:document.getElementById('last_checkbox_selected_mt').value
    let all_checkbox = document.getElementsByName('colors_config_proj')
    document.getElementById(content_hide).hidden = true
    document.getElementById(content_show).hidden = false
    for(let i = 0; i < all_checkbox.length; i++){
        let checked = all_checkbox[i].value === checkbox_selected
        all_checkbox[i].checked = checked
    }

}

function GetNivelTensaoSelected(){
    let classes_btn_selected_bt = document.getElementById('btn_select_bt').classList
    return Array.from(classes_btn_selected_bt).includes('active') ? 'BT':'MT'
}

function ChangeCheckBoxColors(id_change){
    let all_checkbox_colors = document.getElementsByName('colors_config_proj')
    let element_changed = document.getElementById(id_change)
    let nivel_tensao_selected = GetNivelTensaoSelected()
    for(let i = 0; i < all_checkbox_colors.length; i++){
        if(all_checkbox_colors[i].id !== id_change){
            all_checkbox_colors[i].checked = false
        }
    }
    let id_element_save_last_checkbox_selected = nivel_tensao_selected === 'BT' ? 'last_checkbox_selected_bt':'last_checkbox_selected_mt'
    if(element_changed.checked){
        var cols_for_color = []
        var block = false
        document.getElementById(id_element_save_last_checkbox_selected).value = element_changed.value
        if(element_changed.value === 'default'){
            cols_for_color = nivel_tensao_selected === 'BT' ? ColsDefaultBt() : ColsDefaultMt()
            // console.log(cols_for_color)
            block = true
        }
        else if(element_changed.value === 'minimo'){
            cols_for_color = nivel_tensao_selected === 'BT' ? ColsMinimoBt() : ColsMinimoMt()
            block = true
        }
        else{
            cols_for_color = nivel_tensao_selected === 'BT' ? ColsMinimoBt(): ColsMinimoMt()
        }
        SelectedColsAndBlock(cols_for_color, block)
    }
    else{
        SelectedColsAndBlock([], true)
        RemoveSelectionInAllCheckBoxes(nivel_tensao_selected)
        document.getElementById(id_element_save_last_checkbox_selected).value = ''
    }
}

function SelectedColsAndBlock(array_cols_selected, block=false){
    let name_checkbox = GetNivelTensaoSelected() === 'BT'? 'cols_config_proj_bt': 'cols_config_proj_mt'
    let checkboxes_cols = document.getElementsByName(name_checkbox)
    for(let i = 0; i < checkboxes_cols.length; i++){
        let check_checkbox = array_cols_selected.includes(checkboxes_cols[i].value)?true:false
        checkboxes_cols[i].checked=check_checkbox
        checkboxes_cols[i].disabled=block
        BlockDisblockAllCols(block, checkboxes_cols[i].parentElement.parentElement.parentElement.parentElement)
    }
}

function RemoveSelectionInAllCheckBoxes(nivel_tensao){
    let name_checkbox = nivel_tensao === 'BT'? 'cols_config_proj_bt': 'cols_config_proj_mt'
    let checkboxes_cols = document.getElementsByName(name_checkbox)
    for(let i = 0; i < checkboxes_cols.length; i++){
        checkboxes_cols[i].checked=false
    }
}

function BlockDisblockAllCols(block, element){
    let class_add = block?['col_config_proj_block']:['bg-secondary', 'text-white']
    let class_remove = block?['bg-secondary', 'text-white']:['col_config_proj_block']
    for(let i = 0; i < class_add.length; i++){
        element.classList.add(class_add[i])
    }
    for(let i = 0; i < class_remove.length; i++){
        element.classList.remove(class_remove[i])
    }
}

function ColsMinimoBt(){
    return ['Material do Condutor', 'Número de condutores por fase', 'Tensão Nominal', 'Corrente', 'Comprimento',
            'Seção mínima', 'Seção máxima', 'Critério', 'Capacidade de condução de corrente',
            'Queda de tensão em regime calculada', 'Queda de tensão na partida calculada', 'Seção nominal do condutor neutro',
            'Seção nominal do condutor de proteção', 'Circuito Desequilibrado', 'Desconsiderar Sobrecarga',
            'Desconsiderar Curto-Circuito', 'Circuito', 'OS', 'Área', 'Cabo', 'Conformação dos cabos', 'Tipo cabo']
}

function ColsDefaultBt(){
    return ColsMinimoBt().concat(['Tipo da carga', 'Modo de instalação', 'Sistema', 'Temperatura', 'Tipo de Partida',
                                    'Fator Potência nominal', 'Corrente Partida', 'Fator Potência partida',
                                    'Fator de agrupamento', 'Harmonicos', 'Curto-Circuito', 'Corrente de curto limitada',
                                    'Tempo Atuação Disp.proteção', 'Dispositivo de proteção', 'Corrente Nominal Disp. Proteção',
                                    'Corrente Regulada Disp.Proteção', 'Queda de tensão em regime', 'Queda de tensão na partida',
                                    'Fator de correção de temperatura', 'Seção calculada para suportabilidade ao C.C',
                                    'Tipo cabo', 'Seção Calculada', 'Número de condutores por fase calculada',
                                    'Conformação dos cabos', 'Fator Potência nominal calculada', 'Fator Potência partida calculada',
                                    'Fator de correção de agrupamento'])

}

// function ColsColorYellowBt(){
//     return ColsColorBlueBt().concat(['Preço', 'Resistência em CA de cada condutor', 'Reatância indutiva de cada condutor'])
// }

function ColsMinimoMt(){
    return ['Material Cabo', 'Número de condutores por fase', 'Tensão de serviço', 'Classe de tensão', 'Corrente de projeto',
    'Comprimento', 'Seção mínima do condutor', 'Seção máxima do condutor', 'Critério', 'Queda tensão máxima em regime calculada',
    'Queda tensão máxima na partida calculada', 'Seção da blindagem do cabo', 'Blindagem aterrada nas duas extremidades',
    'Circuito', 'OS', 'Área', 'Tipo cabo', 'Seção Calculada', 'Tipo da carga', 'Modo de instalação', 'Cabo',
    'Icc nos condutores', 'Tempo de Icc nos condutores', 'Icc Fase-Terra', 'Exposição do cabo', 'Tempo Icc Fase-Terra',
    'Número de condutores por fase calculada']
}

function ColsDefaultMt(){
    return ColsMinimoMt().concat(['Tipo da carga', 'Modo de instalação', 'Temperatura', 'Tipo de Partida', 'Fator de potencia em regime',
    'Corrente Partida', 'Fator de potencia de partida', 'Fator de agrupamento', 'Icc nos condutores', 'Tempo de Icc nos condutores',
    'Queda tensão máxima em regime', 'Queda tensão máxima na partida', 'Fator de correção de profundidade', 'Fator Resist. Termica',
    'Número de condutores por fase calculada', 'Exposição do cabo', 'Corrente calculada', 'Material da cobertura',
    'Icc Fase-Terra', 'Tempo Icc Fase-Terra', 'Seção Calculada', 'Número de condutores por fase calculada', 'Cabo'])
}

// function ColsColorYellowMt(){
//     return ColsColorBlueMt().concat(['Preço', 'Resistência Máxima em Corrente Alternada', 'Reatância Máxima em Corrente Alternada',
//     'Ref'])
// }

function ShowModalConfigProj(id_proj){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrf},
        url: 'ColsConfigProj/' + id_proj + '/',
        dataType: 'json',
        data: {},
        success: function (data){
            FillConfigsExists(data['cols_bt'], data['cols_mt'], data['checkbox_bt'], data['checkbox_mt'])
            console.log(data)
            $('#config_project_bt_mt').modal('show')
            document.getElementById('proj_selected_config').value = id_proj
        },
    });
}

function FillConfigsExists(cols_bt, cols_mt, checkbox_bt, checkbox_mt){
    let names_checkboxes = {'cols_config_proj_bt': 'BT', 'cols_config_proj_mt': 'MT'}
    for(let id_content in names_checkboxes){
        let checkbox_selected = names_checkboxes[id_content] === 'BT'?checkbox_bt:checkbox_mt
        let id_element_save_last_checkbox_selected = names_checkboxes[id_content] === 'BT'?'last_checkbox_selected_bt':'last_checkbox_selected_mt'
        document.getElementById(id_element_save_last_checkbox_selected).value = checkbox_selected !== null ? checkbox_selected:''
        let all_checkboxes_cols = document.getElementsByName(id_content)
        let block = checkbox_selected === 'livre'? false : true
        for(let i = 0; i < all_checkboxes_cols.length; i++){
            let list_verify = names_checkboxes[id_content] === 'BT'? cols_bt : cols_mt
            all_checkboxes_cols[i].checked = list_verify.includes(all_checkboxes_cols[i].value)
            BlockDisblockAllCols(block, all_checkboxes_cols[i].parentElement.parentElement.parentElement.parentElement)
        }
    }
    ChangeNivelTensaoInConfigProj('BT')
    AddClassActiveInButtonNivelTensao('BT')
}

function AddClassActiveInButtonNivelTensao(nivel_tensao){
    let element_remove_active = nivel_tensao === 'BT'?document.getElementById('btn_select_mt'):document.getElementById('btn_select_bt')
    let element_add_active = nivel_tensao === 'BT'?document.getElementById('btn_select_bt'):document.getElementById('btn_select_mt')
    if(Array.from(element_remove_active.classList).includes('active')){
        element_remove_active.classList.remove('active')
    }
    if(!Array.from(element_add_active.classList).includes('active')){
        element_add_active.classList.add('active')
    }
}


function GetColsSelectedConfigProj(){
    let names_checkboxes = {'cols_config_proj_bt': 'BT', 'cols_config_proj_mt': 'MT'}
    var cols_bt = []
    var cols_mt = []
    for(let name_checkbox in names_checkboxes){
        let checkbox = document.getElementsByName(name_checkbox)
        for(let i = 0; i < checkbox.length; i++){
            if(checkbox[i].checked){
                if(names_checkboxes[name_checkbox] === 'BT'){
                    cols_bt.push(checkbox[i].value)
                }
                else{
                    cols_mt.push(checkbox[i].value)
                }
            }
        }
    }
    return {'cols_bt': cols_bt, 'cols_mt': cols_mt}
}

function SendColsSelectedConfigProj(){
    let cols_selected_in_proj = GetColsSelectedConfigProj()
    let last_checkbox_selected_bt = document.getElementById('last_checkbox_selected_bt').value
    let last_checkbox_selected_mt = document.getElementById('last_checkbox_selected_mt').value
    let id_proj = document.getElementById('proj_selected_config').value
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrf},
        url: 'ColsConfigProj/' + id_proj + '/',
        dataType: 'json',
        data: {'cols_selected': JSON.stringify(cols_selected_in_proj), 'checkbox_bt': last_checkbox_selected_bt,
               'checkbox_mt': last_checkbox_selected_mt},
        success: function (data){
            swal({
                title: "Sucesso!",
                text: data['return'],
                icon: "success",
                button: "Fechar!",
            })

        },
    });
}

function ShowModalEditProj(id_proj, name_exists){
    document.getElementById('id_proj_selected').value = id_proj
    $('#modal_edit_project').modal('show')
    document.getElementById('edit_proj_name').value = name_exists
    RemoveClassIsInvalid('edit_proj_name')
}

function UpdateProj(){
    let id_proj = document.getElementById('id_proj_selected').value
    let new_name = GetNomeValueNewProj('edit_proj_name')
    if(new_name !== null){
        $.ajax({
          type: "GET",
          headers: {'X-CSRFToken': csrf},
          url: 'DeleteProjectCalcCabos/' + id_proj + '/',
          dataType: 'json',
          data: {'new_name': new_name.trim()},
          success: function (data) {
              let icon_header = IconAndHeaderSwal(data['error'])
              swal({
                title: icon_header['header'],
                text: data['return'],
                icon: icon_header['icon'],
                button: "Fechar!",
              })
          },
        });
    }
    else{
        swal({
            text: 'O nome digitado contem algum caractere especial!!',
            icon: "error",
            button: 'Fechar'
        })
    }
}


function VerifyNameProj(element){
    let not_items_str = "`´~!@#$%^&*+=|\\:;'<,>.?/\"\'"
    let value_element = element.value
    let regex_acentos = /[^\u0000-\u007F]/
    var error = false
    for(let i = 0; i < value_element.length; i++){
        if(not_items_str.includes(value_element[i])){
            error = true
            break
        }
    }
    if(error){
        ClassIsInvalid(element.id)
        element.title = '0'
    }
    else{
        if(regex_acentos.test(value_element)){
            ClassIsInvalid(element.id)
            element.title = '0'
        }
        else{
            RemoveClassIsInvalid(element.id)
            element.title = '1'
        }

    }
}

function ShowModalCreateNewProj(){
    $('#modal_create_new_project').modal('show')
    RemoveClassIsInvalid('new_proj_name')
}



function ClassIsInvalid(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(!class_list.includes('is-invalid')){
        i.classList.add('is-invalid')
    }
}


// --------------------- Função Remove validação ---------------------//
function RemoveClassIsInvalid(item){
    let i = document.getElementById(item)
    let class_list = Array.from(i.classList)
    if(class_list.includes('is-invalid')){
        i.classList.remove('is-invalid')
    }
}


window.onload = OnloadScreenProjectControl()