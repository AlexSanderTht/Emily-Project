    var dict_all_datas = {}
    var dict_all_cargas = {}
    var idzao = ""
    function printAcessorio(){
        if ($(`#pro-os`).val() == 'none'){
            return alert("Por favor selecione uma OS!")
        }
        var options='';
        $.ajax({
              type: "GET",
              url: "AllAcess/",
              dataType: 'json',
              success: function (data){
                  for (i in data){
                      options += `<option value=${data[i]['tb_acess_id']} onclick="selectAcessorio(${data[i]['tb_acess_id']})">${data[i]['tb_acess_nome']}</option>`
                      dict_all_datas['Nome'] = data[i]['tb_acess_nome']
                      dict_all_datas['Desc'] = data[i]['tb_acess_desc']
                      dict_all_cargas[data[i]['tb_acess_id']] = dict_all_datas
                      dict_all_datas = {}
                  }
                  $(`#${id_select}`).html(options)
              },
              failure: function(error){
                  alert("erro")
              },
        })
        $('#motoracessorios').modal('show')
        return options
    }

    function selectAcessorio(id) {
        idzao = id
        clean_forms_cargas()
        document.getElementById('motor-acess-cod').value = dict_all_cargas[id]['Nome']
        document.getElementById('motor-acess-desc').value = dict_all_cargas[id]['Desc']
        document.getElementById('selectCargas-search').value = dict_all_cargas[id]['Nome']
    }

    function clean_forms_cargas(){
        document.getElementById('motor-acess-cod').value=""
        document.getElementById('motor-acess-desc').value=""
        document.getElementById('selectCargas-search').value=""
    }

    function registerAcessorios(){
        if (document.getElementById('selectCargas-search').value == "") {
            const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
            var cdg = document.getElementById('motor-acess-cod').value
            var desc = document.getElementById('motor-acess-desc').value


            if (cdg == "" || desc == ""){
                return swalAlert(false, 'Por favor, preencha todos os campos para poder cadastrar!', 'warning', false)
            }

            if (cdg.length > 30){
                return swalAlert(false, 'O campo código aceita no maximo 30 caracteres!', 'warning', false)
            }

            if (desc.length > 100){
                return swalAlert(false, 'O campo descrição aceita no maximo 100 caracteres!', 'warning', false)
            }

            $.ajax({
                  type: "POST",
                  headers:{'X-CSRFToken':csrftoken},
                  url: "AllAcess/",
                  dataType: 'json',
                  data: { 'tb_acess_nome': cdg,
                          'tb_acess_desc': desc},
                  success: function(data){
                      if (data['success'] == true) {
                          clean_forms_cargas()
                          printAcessorio()
                          return swalAlert(false, 'Cadastrado com sucesso!', 'success', false)
                      }
                      else{
                          return swalAlert(false, 'Houve um erro ao cadastrar o Acessório!', 'error', false)
                      }
                  },
                  error: function () {
                      clean_forms_cargas()
                      return swalAlert(false, 'Houve um erro ao cadastrar o Acessório!', 'error', false)
                  }

              });
            }
        else {
            clean_forms_cargas()
            return swalAlert(false, 'Já existe um Acessório com o código selecionado!', 'error', false)
        }
    }

    function updateAcessorios(){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        var cdg = document.getElementById('motor-acess-cod').value
        var desc = document.getElementById('motor-acess-desc').value

        if (idzao == "" || document.getElementById('selectCargas-search').value == ""){
             return swalAlert(false, 'Por favor, selecione um Acessório para ser alterado!', 'warning', false)
        }

        if (cdg.length > 30){
            return swalAlert(false, 'O campo código aceita no maximo 30 caracteres!', 'warning', false)
            }

        if (desc.length > 100){
            return swalAlert(false, 'O campo descrição aceita no maximo 100 caracteres!', 'warning', false)
            }

        $.ajax({
              type: "PUT",
              headers:{'X-CSRFToken':csrftoken},
              url: "ManipulingAcess/" + idzao + "/",
              dataType: 'json',
              data: { 'tb_acess_nome': cdg,
                      'tb_acess_desc': desc},
              success: function(data){
                  if (data['success'] == true) {
                      clean_forms_cargas()
                      printAcessorio()
                      return swalAlert(false, 'Atualizado com sucesso!', 'success', false)
                  }
                  else{
                      clean_forms_cargas()
                      return swalAlert(false, 'Ocorreu um erro ao alterar pois já existe um Acessório com este código ou os campos continuaram iguais.', 'error', false)
                  }
              },
              error: function () {
                  clean_forms_cargas()
                  return swalAlert(false, 'Já existe um Acessório com este código!', 'error', false)
              }
          });
    }
    function deleteAcessorio(){
        if (idzao == "" || document.getElementById('selectCargas-search').value == ""){
            return alert("Escolha um Acessorio para poder excluir!!!!")
        }
        $.ajax({
              type: "DELETE",
              url: "ManipulingAcess/" + idzao + "/",
              dataType: 'json',
              success: function(data){
                    clean_forms_cargas()
                    printAcessorio()
                    return swalAlert(false, 'Excluído com sucesso!', 'success', false)
              },
              error: function () {
                  return swalAlert(false, 'Houve um erro ao excluir o Acessório!', 'error', false)
              }

          });

    }

    function swalAlert(titulo, texto, icone_img, btn){
    swal({
    title: titulo,
    text: texto,
    icon: icone_img,
    button: btn,
    })
    $('div.swal-modal').addClass('bordas')
    $('div.swal-title').addClass('h4')
    $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
    $('div.swal-text').addClass('text-center')
    $('div.swal-footer').addClass('d-flex justify-content-center')
    }
