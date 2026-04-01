var partida_no_ref = {}
var partida_with_ref = {}
var id_partida = ""

async function handle_datas(url, tb_name, id_modal){
    // Função generica que pega os dados tanto de tipo de partida quanto motos status
    var field_name = tb_name + '_nome'
    var field_id = tb_name + '_id'
    var field_desc = tb_name + '_desc'
    var field_tipo = tb_name + '_tipo'
    var obj = {}
    var all_objs = {}
    var os = document.getElementById('pro-os').value
    if (os == ""){
        return swal({
          title: "Erro!",
          text: "Por Favor selecione uma OS!!",
          icon: 'error',
          button: "Fechar",
        });
    }
    await $.ajax({
          type: "GET",
          url: url,
          dataType: 'json',
          success: function (data){
              for(i in data){
                  obj[field_name] = data[i][field_name]
                  obj[field_desc] = data[i][field_desc]
                  if (data[i][field_desc]){
                      obj[field_tipo] = data[i][field_tipo]
                  }
                  all_objs[data[i][field_id]] = obj
                  obj = {}
              }
              $(id_modal).modal('show')
          },
          failure: function(error){
              return swal({
                  title: "Erro!",
                  icon: 'error',
                  button: "Fechar",
              });
         },
    })
    return all_objs
}

async function print_options_search(url, tb_name, id_select, id_modal, elements){
    // Função generica que mostra as options tanto de tipo de partida quanto motor status
    var all_objs = await handle_datas(url, tb_name, id_modal)
    var field_name = tb_name + '_nome'
    var options = ''
    for(var idzao in all_objs){
        options += `<option value="${idzao}" onclick="display_datas('${idzao}', '${url}', '${tb_name}', '${id_modal}', '${elements}')">${all_objs[idzao][field_name]}</option>`
    }
    $(id_select).html(options)
}

async function display_datas(id, url, tb_name, id_modal, elements){
    // Função generica que preenche os formularios ao clicar em umas das opções
    var field_nome = tb_name + '_nome'
    var field_desc = tb_name + '_desc'
    var field_tipo = tb_name + '_tipo'
    var form_cdg = elements + '-cod'
    var form_desc = elements + '-desc'
    var forms_tipo = document.getElementsByName('tipo-partida-options')
    var all_datas = await handle_datas(url, tb_name, id_modal)
    if (all_datas[id][field_tipo]){
        for (var i = 0; i < forms_tipo.length; i++) {
            if (forms_tipo[i].value.toUpperCase() == all_datas[id][field_tipo]){
                forms_tipo[i].checked = true
            }
        }
    }
    document.getElementById(form_cdg).value=all_datas[id][field_nome]
    document.getElementById(form_desc).value=all_datas[id][field_desc]
}

async function filter_options(tb_name, id_search, url, id_modal, elements, id_select){
    var field_name = tb_name + '_nome'
    var search = document.getElementById(id_search).value
    var options = ''
    var all_datas = await handle_datas(url, tb_name, id_modal)
    for(id in all_datas){
        if(all_datas[id][field_name].toUpperCase().includes(search.toUpperCase())){
            options += `<option value="${id}" onclick="display_datas('${id}', '${url}', '${tb_name}', '${id_modal}', '${elements}')">${all_datas[id][field_name]}</option>`
        }
    }
    $(id_select).html(options)
}

async function reset_forms(elements, tipo, url, tb_name, id_select, id_modal){
    var forms_tipo = document.getElementsByName('tipo-partida-options')
    var form_cgd = elements + '-cod'
    var form_desc = elements + '-desc'
    var form_search = elements + '-search'
    $('#' + elements + '-select').val([]);
    document.getElementById(form_cgd).value=""
    document.getElementById(form_desc).value=""
    document.getElementById(form_search).value=""
    if(tipo == 1){
         for (var i = 0; i < forms_tipo.length; i++) {
            if (forms_tipo[i].checked){
                forms_tipo[i].checked = false
            }
        }
    }
    await print_options_search(url, tb_name, id_select, id_modal, elements)
}

async function clean_with_backspace(elements, tipo, url, tb_name, id_select, id_modal){
    var form_search = elements + '-search'
    const search = document.getElementById(form_search)
    search.addEventListener('keydown', function(event) {
    const key = event.key;
    if (key === "Backspace") {
        reset_forms(elements, tipo, url, tb_name, id_select, id_modal)
        }
    });
}

async function reg_tp_ms(elements, url, tb_name, tipo, id_select, modal){
    var form_cgd = elements + '-cod'
    var form_desc = elements + '-desc'
    var forms_tipo = elements + '-options'
    var cdg = document.getElementById(form_cgd).value
    var desc = document.getElementById(form_desc).value
    var tp = document.getElementsByName(forms_tipo)
    var tipo_select = ''
    var field_cod = tb_name + '_nome'
    var field_desc = tb_name + '_desc'
    if (cdg.length > 50){
        return swal({
          title: "Erro!",
          text: "A quantidade máxima de caracteres permitida em código é de 50. Verifique esse campo e tente novamente!",
          icon: 'error',
          button: "Fechar",
        });
    }
    if (desc.length > 200){
        return swal({
          title: "Erro!",
          text: "A quantidade máxima de caracteres permitida em descrição é de 200. Verifique esse campo e tente novamente!",
          icon: 'error',
          button: "Fechar",
        });
    }
    if(cdg.length == 0 | desc.length == 0){
         return swal({
              title: "Atenção!",
              text: "Digite todos os campos corretamente!!",
              icon: 'info',
              button: "Fechar",
         });
    }
    if (tipo == 1){
        let field_tipo = tb_name + '_tipo'
        for (var i = 0; i < tp.length; i++) {
            if (tp[i].checked){
                tipo_select = tp[i].value.toUpperCase()
            }
        }
        if (tipo_select === ''){

            return swal({
                  title: "Atenção!",
                  text: "Por favor selecione um código!!",
                  icon: 'info',
                  button: "Fechar",
            })

        }
        await $.ajax({
          type: "POST",
          url: url,
          dataType: 'json',
          data:{[field_cod]: cdg,
                [field_desc]: desc,
                [field_tipo]: tipo_select},
          success: function (data){
              if (data['success']){
                  swal({
                      title: "Atenção!",
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url, tb_name, id_select, modal)
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url, tb_name, id_select, modal)
              }
          },
          failure: function(error){
            return swal({
              title: "Erro!",
              icon: 'error',
              button: "Fechar",
            });
         },
        })
    }
    else{
        await $.ajax({
          type: "POST",
          url: url,
          dataType: 'json',
          data:{[field_cod]: cdg,
                [field_desc]: desc},
          success: function (data){
              if (data['success']){
                  swal({
                      title: "Atenção!",
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url, tb_name, id_select, modal)
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url, tb_name, id_select, modal)
              }
          },
          failure: function(error){
              swal({
                  title: "Atenção!",
                  text: (data['erro']),
                  icon: 'error',
                  button: "Fechar",
              })
         },
        })
    }
}

async function update_tp_ms(tb_name, elements, tipo, url, id_select, id_modal, url_all){
    var id = $(id_select).val();
    var form_cgd = elements + '-cod'
    var form_desc = elements + '-desc'
    var cdg = document.getElementById(form_cgd).value
    var desc = document.getElementById(form_desc).value
    var field_cod = tb_name + '_nome'
    var field_desc = tb_name + '_desc'
    if (cdg.length > 50){
        return swal({
                  title: "Atenção!",
                  text: "A quantidade máxima de caracteres permitida em código é de 50. Verifique esse campo e tente novamente!",
                  icon: 'info',
                  button: "Fechar",
        })
    }
    if (desc.length > 200){
        return swal({
                  title: "Atenção!",
                  text: "A quantidade máxima de caracteres permitida em descrição é de 200. Verifique esse campo e tente novamente!",
                  icon: 'info',
                  button: "Fechar",
        })
    }
    if(cdg.length == 0 | desc.length == 0){
         return swal({
              title: "Atenção!",
              text: "Digite todos os campos corretamente!!",
              icon: 'info',
              button: "Fechar",
         });
    }
    if(tipo == 1){
        var forms_tipo = elements + '-options'
        var tp = document.getElementsByName(forms_tipo)
        var tipo_select = ''
        let field_tipo = tb_name + '_tipo'
        for (var i = 0; i < tp.length; i++) {
            if (tp[i].checked){
                tipo_select = tp[i].value.toUpperCase()
            }
        }
        if(tipo_select == ''){
             return swal({
                  title: "Atenção!",
                  text: "Selecione um codigo para prosseguir com a atualização!!",
                  icon: 'error',
                  button: "info",
             });
        }
        await $.ajax({
          type: "PUT",
          url: url + id,
          dataType: 'json',
          data:{[field_cod]: cdg,
                [field_desc]: desc,
                [field_tipo]: tipo_select},
          success: function (data){
              if (data['success']){
                  swal({
                      title: "Atenção!",
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
          },
          failure: function(error){
              swal({
                  title: "Atenção!",
                  text: (data['erro']),
                  icon: 'error',
                  button: "Fechar",
              })
          },
        })
    }
    else{
        await $.ajax({
          type: "PUT",
          url: url + id,
          dataType: 'json',
          data:{[field_cod]: cdg,
                [field_desc]: desc},
          success: function (data){
              if (data['success']){
                  swal({
                      title: "Atenção!",
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
          },
          failure: function(error){
              swal({
                  title: "Atenção!",
                  text: (data['erro']),
                  icon: 'error',
                  button: "Fechar",
              })
         },
        })
    }
}

async function atualiza(elements, url_reg, url_up, tb_name, tipo, id_select, id_modal){
    if($(id_select).val().length == 0){
       return swal({
          title: "Atenção!",
          text: "Selecione um código para prosseguir com a atualização!!",
          icon: 'info',
          button: "Fechar",
       });
    }
    else{
        return await update_tp_ms(tb_name, elements, tipo, url_up, id_select, id_modal, url_reg)
    }
}

async function what_up_or_create(elements, url_reg, url_up, tb_name, tipo, id_select, id_modal){
    if($(id_select).val().length == 0){
        return await reg_tp_ms(elements, url_reg, tb_name, tipo, id_select, id_modal)
    }
    else{
       return swal({
          title: "Erro!",
          text: "Limpe os campos para adicionar!!",
          icon: 'error',
          button: "Fechar",
       });
    }
}
async function del_tp_ms(url, id_select, elements, tipo, url_all, tb_name, id_modal){
    var ids = $(id_select).val();
    if(ids.length == 0){
        return swal({
          title: "Atenção!",
          text: "Selecione um código para remover",
          icon: 'info',
          button: "Fechar",
        });

    }
    for(i in ids){
        await $.ajax({
          type: "DELETE",
          url: url + ids[i],
          dataType: 'json',
          success: function (data){
              if (data['success']){
                  swal({
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  reset_forms(elements, tipo, url_all, tb_name, id_select, id_modal)
              }
          },
          failure: function(error){
            return swal({
              title: "Atenção!",
              text: "Selecione um código para remover",
              icon: 'info',
              button: "Fechar",
            });
         },
        })
    }
}


function updateTipoPartida() {
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    let cdg = document.getElementById("tipo-partida-cod").value
    let desc = document.getElementById("tipo-partida-desc").value
    let tipo = document.querySelector('input[name="tipo-partida-options"]:checked').value

    if (id_partida == "" || document.getElementById('tipo-partida-search').value == ""){
            return swalAlert(false, 'Por favor, selecione um Tipo de Partida para ser alterado!', 'warning', false)
        }

    if (cdg.length > 50) {
        return swal({
            title: "Erro!",
            text: "A quantidade máxima de caracteres permitida em código é de 50. Verifique esse campo e tente novamente!",
            icon: 'error',
            button: "Fechar",
        });
    }
    if (desc.length > 200) {
        return swal({
            title: "Erro!",
            text: "A quantidade máxima de caracteres permitida em descrição é de 200. Verifique esse campo e tente novamente!",
            icon: 'error',
            button: "Fechar",
        });
    }
    if (cdg.length == 0 | desc.length == 0) {
        return swal({
            title: "Atenção!",
            text: "Digite todos os campos corretamente!!",
            icon: 'info',
            button: "Fechar",
        });
    }
        $.ajax({
            type: "PUT",
            headers: {'X-CSRFToken': csrftoken},
            url: "ManTP/" + id_partida,
            dataType: 'json',
            data: {
                'tb_tp_nome': cdg,
                'tb_tp_desc': desc,
                'tb_tp_tipo': tipo
            },
            success: function (data) {
                if (data['success'] == true) {
                    printPartidas()
                    return swalAlert(false, 'Atualizado com sucesso!', 'success', false)
                } else {
                    printPartidas()
                    return swalAlert(false, 'Ocorreu um erro ao alterar pois já existe um Tipo de Partida com este código ou os campos continuaram iguais.', 'error', false)
                }
            },
            error: function () {
                printPartidas()
                return swalAlert(false, 'Já existe um Tipo de Partida com este código!', 'error', false)
            }
        });
}


function printPartidas(){
    if ($(`#pro-os`).val() == 'none'){
        return alert("Selecione uma OS")
    }
    var options_partida='';
    $.ajax({
          type: "GET",
          url: "TPartida/",
          dataType: 'json',
          success: function (data){
              for (i in data) {
                  options_partida += `<option value=${data[i]['tb_tp_id']} onclick="selectPartida(${data[i]['tb_tp_id']})">${data[i]['tb_tp_nome']}</option>`
                  partida_no_ref['Nome'] = data[i]['tb_tp_nome']
                  partida_no_ref['Desc'] = data[i]['tb_tp_desc']
                  partida_no_ref['Tipo'] = data[i]['tb_tp_tipo']
                  partida_with_ref[data[i]['tb_tp_id']] = partida_no_ref
                  partida_no_ref = {}
              }
              $(`#tipo-partida-select`).html(options_partida)
          },
          failure: function(error){
              alert("erro")
          },
    })
    $('#tipopartida').modal('show')
    return options_partida
}

function selectPartida(id) {
    id_partida = id
    document.getElementById('tipo-partida-cod').value = partida_with_ref[id]['Nome']
    document.getElementById('tipo-partida-desc').value = partida_with_ref[id]['Desc']
    document.getElementById('tipo-partida-search').value = partida_with_ref[id]['Nome']
    document.querySelector('input[value="' + partida_with_ref[id]['Tipo'] + '"]').checked = true
}


function adicionarPartida() {
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        var cdg = document.getElementById('tipo-partida-cod').value
        var desc = document.getElementById('tipo-partida-desc').value
        let tipo = document.querySelector('input[name="tipo-partida-options"]:checked').value


        if (cdg == "" || desc == ""){
            // Chama o swal passando os seguintes parametros swalAlert(titulo, texto, icone, btn)
            return swalAlert(false, 'Por favor, preencha todos os campos para poder cadastrar!', 'warning', false)
        }

        if (cdg.length > 30){
            return swalAlert(false, 'O campo código aceita no máximo 30 caracteres!', 'warning', false)
        }

        if (desc.length > 100){
            return swalAlert(false, 'O campo descrição aceita no máximo 100 caracteres!', 'warning', false)
        }

        if (tipo == ""){
            return swalAlert(false, 'Favor, selecionar um critério!', 'warning', false)
        }

        $.ajax({
              type: "POST",
              headers:{'X-CSRFToken':csrftoken},
              url: "TPartida/",
              dataType: 'json',
              data: { 'tb_tp_nome': cdg,
                      'tb_tp_desc': desc,
                      'tb_tp_tipo': tipo},

              success: function(data){
                  if (data['success'] == true){
                  printPartidas()
                  clean_all_forms_partida()
                  return swalAlert(false, 'Cadastrado com sucesso!', 'success', false)
                }
                  else{
                      printPartidas()
                      return swalAlert(false, 'Já existe um Tipo de Partida com este código!', 'error', false)
                  }
              },
              error: function (data) {
                  printPartidas()
                  clean_all_forms_partida()
                  return swalAlert(false, 'Houve um erro ao cadastrar o Tipo de Partida!', 'error', false)
            }
          });
}


function clean_all_forms_partida(id){
    id_partida = id
    document.getElementById('tipo-partida-search').value = ""
    document.getElementById('tipo-partida-cod').value = ""
    document.getElementById('tipo-partida-desc').value = ""
    document.querySelector('input[name="tipo-partida-options"]').checked = false
}


function delete_partida(){

    if (id_partida == "" || document.getElementById('tipo-partida-search').value == ""){
        return swalAlert(false, 'Por favor, selecione um Tipo de Partida para ser alterado!', 'warning', false)
    }
        $.ajax({
          type: "DELETE",
          url: 'ManTP/' + id_partida,
          dataType: 'json',
          success: function (data){
              if (data['success']){
                  swal({
                      text: (data['success']),
                      icon: 'success',
                      button: "Fechar",
                  })
                  printPartidas()
                  clean_all_forms_partida()
              }
              else{
                  swal({
                      title: "Atenção!",
                      text: (data['erro']),
                      icon: 'error',
                      button: "Fechar",
                  })
                  printPartidas()
                  clean_all_forms_partida()
              }
          },
          failure: function(error){
            return swal({
              title: "Atenção!",
              text: "Selecione um código para remover",
              icon: 'info',
              button: "Fechar",
            });
         },
        })
}