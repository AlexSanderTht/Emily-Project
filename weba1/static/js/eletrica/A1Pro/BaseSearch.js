    var dict_all_datas = {}
    var dict_all_cargas = {}
    //let id_select = "Search{{id_select}}"

    function filterSearch(id_element){
        var filter = $("#" + id_element).val();
        filter = filter.toUpperCase();
        var options = $("#" + id_element + "Select" + " option");
        for (var i = 0; i < options.length; i++)
        {
           if (options[i].text.toUpperCase().indexOf(filter) < 0)
               $(options[i]).css("display", "none");
           else
               $(options[i]).css("display", "block");
        }
    }

    function clean_form_search(){
        const carga = document.getElementById('Search{{id_select}}Input')
        carga.addEventListener('keydown', function(event) {
        const key = event.key; // const {key} = event; ES6+
        if (key === "Backspace") {
            document.getElementById('Search{{id_select}}Input').value = ""
            clean_forms_cargas()
            $(`#${id_select}`).html(printCargas())
        }
    });
    }

    function printCargas(){
        var options='';

        $.ajax({
              type: "GET",
              url: "RetornaAcessorios/",
              dataType: 'json',
              success: function (data){
                  for (i in data){
                      options += `<option value=${data[i]['tb_acess_id']} onclick="selectCarga(${data[i]['tb_acess_id']})">${data[i]['tb_acess_nome']}</option>`
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
        return options
    }

    function selectCarga(id) {
        clean_forms_cargas()
        document.getElementById('motor-acess-cod').value = dict_all_cargas[id]['Nome']
        document.getElementById('motor-acess-cod').readOnly = true
        document.getElementById('motor-acess-desc').value = dict_all_cargas[id]['Desc']
        document.getElementById('motor-acess-search').value = dict_all_cargas[id]['Nome']
    }

    function clean_forms_cargas(){
        document.getElementById('motor-acess-cod').value=""
        document.getElementById('motor-acess-desc').value=""

    }

               // document.getElementById('motor-acess-cod').readOnly = false