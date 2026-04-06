window.onload = function(){
carregaListas()
}

function pagCarregada(){
    $("#material")[0].selectedIndex = 0
    $("#diametro")[0].selectedIndex = 0
    $("#sch")[0].selectedIndex = 0
    $("#fluido_vao")[0].selectedIndex = 0
    $("#isolamento")[0].selectedIndex = 0
    $("#criterio")[0].selectedIndex = 0
    sch_frp()
    isolacao_flex()
    criterio_flex()
    fluid_flex()
    diametro_manual()
    espessura_manual()
}
var listaNormaSch
var listaSchFRP
function verify_value_num(item_id) {
    let item_val = parseFloat(document.getElementById(item_id).value);

    if(!(isNaN(item_val))){  // Caso não seja nulo
        // Não tem mais limites para verificar
    // if(typeof(item_val) == 'number'){  //Se o tipo for número
    //     if(item_val >= inf_lim && item_val <= up_lim){  //Só é válido se estiver nesse range
    //     document.getElementById(item_id).classList.remove('is-invalid');
    //     return true
    //     } 
    // }
    return true
    }
    return false  
}

function limpaerro(elemento) { // função para limpar a mensagem de erro
    document.getElementById(elemento.id).classList.remove('is-invalid');
}

function isolacao_flex() {
    if (document.getElementById('isolamento').value == 'Usuário') {
        document.getElementById('usuario_iso').readOnly = false;
    } else{
        document.getElementById('usuario_iso').readOnly = true;
        document.getElementById('usuario_iso').value = ""
    }
}

function criterio_flex() {
    if (document.getElementById('criterio').value == 'Usuário') {
        document.getElementById('usuario_flecha').readOnly = false;
    }  else {
        document.getElementById('usuario_flecha').readOnly = true;
        document.getElementById('usuario_flecha').value = ""
    }
}

function fluid_flex() {
    if (document.getElementById('fluido_vao').value == 'Usuário') {
        document.getElementById('usuario_fluido').readOnly = false;
    } else{
        document.getElementById('usuario_fluido').readOnly = true;
        document.getElementById('usuario_fluido').value = ""
    }
}

function diametro_manual() {
    if (document.getElementById('diametro').value == 'Usuário') {
        // Quando diâmetro for para usuárioa o sch também precisa ser input do usuário
        document.getElementById('usuario_diametro').readOnly = false;
        document.getElementById('sch').value = 'Usuário'
        document.getElementById('sch').setAttribute('disabled', true);
        espessura_manual()
    } else{
        document.getElementById('usuario_diametro').readOnly = true;
        document.getElementById('sch').removeAttribute('disabled');
        document.getElementById('usuario_diametro').value = ""
    }
}

function espessura_manual() {
    if (document.getElementById('sch').value == 'Usuário') {
        document.getElementById('usuario_sch').readOnly = false;
    } else{
        document.getElementById('usuario_sch').readOnly = true;
        document.getElementById('usuario_sch').value = ""
    }
}

function sch_frp() {
    if (document.getElementById('material').value == 'FRP') {
        elemento =  $("#sch")
        elemento.empty() // limpa o <select> atual.
        for(var i = 0; i < listaSchFRP.length; i++){ // Laço para criar as opções de sch para FRP.
        var option = new Option(listaSchFRP[i]);
        elemento.append(option);
        }
    } else{
        elemento =  $("#sch")
        elemento.empty() // limpa o <select> atual.
        for(var i = 0; i < listaNormaSch.length; i++){ // Laço para criar as opções de sch para tubos metálicos.
        var option = new Option(listaNormaSch[i]);
        elemento.append(option);
        }
    }
    $("#diametro")[0].selectedIndex = 0
    diametro_manual()
    espessura_manual()
}        

function env_vao_ajax() {
    var ctrl = 0;
    let material = document.getElementById('material').value
    let temperatura = parseFloat(document.getElementById('temperatura').value);
    let nps = document.getElementById('diametro').value
    let nps_usuario = parseFloat(document.getElementById('usuario_diametro').value)
    let sch = document.getElementById('sch').value
    let sch_usuario = parseFloat(document.getElementById('usuario_sch').value)
    let espessura_corrosao = parseFloat(document.getElementById('espessura').value)
    if(!espessura_corrosao) {
        document.getElementById('espessura').value = 0
        espessura_corrosao = 0
    }
    let espessura_isolamento = parseFloat(document.getElementById('espessuraiso').value)
    if(!espessura_isolamento) {
        document.getElementById('espessuraiso').value = 0
        espessura_isolamento = 0
    }
    let fluido = document.getElementById('fluido_vao').value;
    let fluido_usuario = parseFloat(document.getElementById('usuario_fluido').value);
    let isolamento = document.getElementById('isolamento').value;
    let isolamento_usuario = parseFloat(document.getElementById('usuario_iso').value);
    let criterio = document.getElementById('criterio').value;
    let criterio_usuario = parseFloat(document.getElementById('usuario_flecha').value);
    let vao_criterio_l = parseFloat(document.getElementById('vao_usuario_l').value);
    let list_ids = ['temperatura']
    let list_user_dt = ['fluido_vao', 'isolamento', 'criterio']  // Ids dos comboboxes
    let list_user_input = ['usuario_fluido', 'usuario_iso', 'usuario_flecha', 'usuario_diametro', 'usuario_sch']  // Ids dos inputs
    let list_limites = [[50, 300]]
    // let list_limites_usr = [[0, 3000], [0,3000], [0, 25]]
    var list_err = [];

    for (cmb in list_user_dt) {
        if ($(`#${list_user_dt[cmb]}`).val() == 'Usuário') {
        list_ids.push(list_user_input[cmb]);
        // list_limites.push(list_limites_usr[cmb]);
        } 
    }

    for (idd in list_ids) { if (!(verify_value_num(list_ids[idd]))) { list_err.push(list_ids[idd]) } }

    var dict_vao = {
        'temp': temperatura,
        'fluido': fluido,
        'mat': material,
        'espess_corro': espessura_corrosao,
        'isolam': isolamento,
        'espessura_isolam': espessura_isolamento,
        'crite_flecha': criterio,
        'nps': nps,
        'sch': sch,
        'vao_usuario': vao_criterio_l,
        'densidade_fluido_usuario': fluido_usuario,
        'densidade_isolamento_usuario': isolamento_usuario,
        'valor_flecha_usuario': criterio_usuario,
        'nps_usuario': nps_usuario,
        'sch_usuario': sch_usuario,
    };
    if (list_err.length == 0) {
        $.ajax({
            type: "GET",
            url: "report",
            dataType: 'json',
            data: {'dict_edit_flx': JSON.stringify({'dict_vao': dict_vao})},
        }).done(function (data) {
            let dt_info = data['dt'];
            let resposta = data['resposta'];
            if(dt_info === null){
                alert(resposta);
                // hidden_vao(1);
                result_calc_bad();
            } else {
                // hidden_vao(2);
                result_calc_ok();
                document.getElementById("modulo_elast").value = dt_info['mod_elast'];
                document.getElementById("sigma").value = dt_info['flecha_meio_vao'] + ' mm';
                document.getElementById("fixacao").value = dt_info['carga_apoio'] + ' kgf';
                document.getElementById("tamanho_L").value = dt_info['vao_sups'] + ' m';
                document.getElementById('espessura_result').value = dt_info['Espessura'] + ' mm';
                document.getElementById('area_vazia').value = dt_info['area_vazia'] + ' cm²';
                document.getElementById('area_mental').value = dt_info['area_metal'] + ' cm4';
                document.getElementById('momento_inercia').value = dt_info['mom_inercia'] + ' cm4';
                document.getElementById('momento_resistente').value = dt_info['momento_res'] + ' cm4';
                document.getElementById('peso_fluido').value = dt_info['peso_flu'] + ' kgf/m';
                document.getElementById('peso_tubo').value = dt_info['peso_tub'] + ' kgf/m';
                document.getElementById('peso_total').value = dt_info['peso_total'] + ' kgf/m';
                document.getElementById('peso_isolamento').value = dt_info['peso_iso'] + ' kgf/m';
                document.getElementById('od_wall').value = dt_info['Rel_OD_Wall'];
                document.getElementById('vao_criterio_tesao').value = dt_info['vao_cri_tensao'] + ' m';
                document.getElementById('vao_criterio_fleca').value = dt_info['vao_cri_flexa'] + ' m';
                let rel_od_wall = parseFloat(dt_info['Rel_OD_Wall']);

                if (rel_od_wall >= 100) {
                    document.getElementById('od_wall').classList.add('bg-danger');
                } else {
                    // hidden_vao(2);
                    result_calc_ok();
                    document.getElementById("modulo_elast").value = dt_info['mod_elast'];
                    document.getElementById("sigma").value = dt_info['flecha_meio_vao'] + ' mm';
                    document.getElementById("fixacao").value = dt_info['carga_apoio'] + ' kgf';
                    document.getElementById("tamanho_L").value = dt_info['vao_sups'] + ' m';
                    document.getElementById('espessura_result').value = dt_info['Espessura'] + ' mm';
                    document.getElementById('area_vazia').value = dt_info['area_vazia'] + ' cm²';
                    document.getElementById('area_mental').value = dt_info['area_metal'] + ' cm4';
                    document.getElementById('momento_inercia').value = dt_info['mom_inercia'] + ' cm4';
                    document.getElementById('momento_resistente').value = dt_info['momento_res'] + ' cm4';
                    document.getElementById('peso_fluido').value = dt_info['peso_flu'] + ' kgf/m';
                    document.getElementById('peso_tubo').value = dt_info['peso_tub'] + ' kgf/m';
                    document.getElementById('peso_total').value = dt_info['peso_total'] + ' kgf/m';
                    document.getElementById('peso_isolamento').value = dt_info['peso_iso'] + ' kgf/m';
                    let rel_od_wall = parseFloat(dt_info['Rel_OD_Wall']);
                    if (rel_od_wall >= 100) {
                        document.getElementById('od_wall').classList.add('bg-danger');
                    } else {
                        document.getElementById('od_wall').classList.remove('bg-danger');
                    }
                    document.getElementById('od_wall').value = dt_info['Rel_OD_Wall'];
                    document.getElementById('vao_criterio_tesao').value = dt_info['vao_cri_tensao'] + ' m';
                    document.getElementById('vao_criterio_fleca').value = dt_info['vao_cri_flexa'] + ' m';
                }
            }
        });
    } else {
        for(err in list_err){ document.getElementById(list_err[err]).classList.add('is-invalid') }
    }
}

function result_calc_bad() {
    document.getElementById('espessura_result').classList.add('is-invalid');
    document.getElementById('area_vazia').classList.add('is-invalid');
    document.getElementById('area_mental').classList.add('is-invalid');
    document.getElementById('momento_inercia').classList.add('is-invalid');
    document.getElementById('momento_resistente').classList.add('is-invalid');
    document.getElementById('peso_fluido').classList.add('is-invalid');
    document.getElementById('peso_tubo').classList.add('is-invalid');
    document.getElementById('peso_total').classList.add('is-invalid');
    document.getElementById('peso_isolamento').classList.add('is-invalid');
    document.getElementById('od_wall').classList.add('is-invalid');
    document.getElementById('vao_criterio_tesao').classList.add('is-invalid');
    document.getElementById('vao_criterio_fleca').classList.add('is-invalid');
    document.getElementById('espessura_result').value="Error";
    document.getElementById('area_vazia').value="Error";
    document.getElementById('area_mental').value="Error";
    document.getElementById('momento_inercia').value="Error";
    document.getElementById('momento_resistente').value="Error";
    document.getElementById('peso_fluido').value="Error";
    document.getElementById('peso_tubo').value="Error";
    document.getElementById('peso_total').value="Error";
    document.getElementById('peso_isolamento').value = "Error";
    document.getElementById('od_wall').value="Error";
    document.getElementById('vao_criterio_tesao').value="Error";
    document.getElementById('vao_criterio_fleca').value="Error";
}
function result_calc_ok() {
    document.getElementById('espessura_result').classList.remove('is-invalid');
    document.getElementById('area_vazia').classList.remove('is-invalid');
    document.getElementById('area_mental').classList.remove('is-invalid');
    document.getElementById('momento_inercia').classList.remove('is-invalid');
    document.getElementById('momento_resistente').classList.remove('is-invalid');
    document.getElementById('peso_fluido').classList.remove('is-invalid');
    document.getElementById('peso_tubo').classList.remove('is-invalid');
    document.getElementById('peso_total').classList.remove('is-invalid');
    document.getElementById('peso_isolamento').classList.remove('is-invalid');
    document.getElementById('od_wall').classList.remove('is-invalid');
    document.getElementById('vao_criterio_tesao').classList.remove('is-invalid');
    document.getElementById('vao_criterio_fleca').classList.remove('is-invalid');
}

function env_L_ajax(){
    // console.log('Entrou no vao ajax')
    let vao_usuario = parseFloat(document.getElementById("value_vao_usuario_l").value);
    let criterio_flecha = parseFloat(document.getElementById("vao_criterio_fleca").value);
    let modulo_elasticidade = parseFloat(document.getElementById("modulo_elast").value);
    let peso_total = parseFloat(document.getElementById("peso_total").value);
    let momento_inercia = parseFloat(document.getElementById("momento_inercia").value);
    let vao_criterio_l = parseFloat(document.getElementById('value_vao_usuario_l').value);
    var ctrl = 0;

    if (isNaN(vao_usuario)){
        ctrl =1;
        document.getElementById('vao_usuario_l').classList.add('is-invalid');
    }
    else{
        document.getElementById('vao_usuario_l').classList.remove('is-invalid');
    }
    if(isNaN(modulo_elasticidade) || isNaN(peso_total) || isNaN(momento_inercia)){
        alert("Houve um erro inesperado, Contate o CTA1");
    }
    if(vao_criterio_l>criterio_flecha){
        ctrl=1;
        alert("o Valor 'vão usuário L' deve ser menor do que "+ criterio_flecha+" m");
    }
    var dict_new_calc = {'vao_usuario':vao_usuario, 'modulo_elasticidade': modulo_elasticidade,
                            'peso_total':peso_total, 'momento_inercia':momento_inercia};
    console.log(ctrl);
    if (ctrl===0){
        // console.log('controle é zero')
        let temperatura = parseFloat(document.getElementById('temperatura').value);
        let espessura_corrosao = parseFloat(document.getElementById('espessura').value);
        let espessura_isolamento = parseFloat(document.getElementById('espessuraiso').value);
        let fluido = document.getElementById('fluido_vao').value;
        let fluido_usuario = parseFloat(document.getElementById('usuario_fluido').value);
        let isolamento = document.getElementById('isolamento').value;
        let isolamento_usuario = parseFloat(document.getElementById('usuario_iso').value);
        let criterio = document.getElementById('criterio').value;
        let criterio_usuario = parseFloat(document.getElementById('usuario_flecha').value);

        var dict_vao = {
            'temp': temperatura,
            'fluido': fluido,
            'mat': document.getElementById('material').value,
            'espess_corro': espessura_corrosao,
            'isolam': isolamento,
            'espessura_isolam': espessura_isolamento,
            'crite_flecha': criterio,
            'nps': document.getElementById('diametro').value,
            'sch': document.getElementById('sch').value,
            'vao_usuario': vao_criterio_l,
            'densidade_fluido_usuario': fluido_usuario,
            'densidade_isolamento_usuario': isolamento_usuario,
            'valor_flecha_usuario': criterio_usuario
        };
        // hidden_vao(3);

        $.ajax({
            type: "GET",
            url: "vao_l",
            dataType: 'json',
            data: {'dict_edit_flx': JSON.stringify({'dict_vao': dict_vao}),
                    'dict_edit_flx_vao': JSON.stringify({'dict_vao_usr': dict_new_calc})},
        }).done(function (data) {
            let dt_info = data['dt'];
            if(dt_info !== null){
                document.getElementById("fixacao_usuario").value = parseFloat(dt_info['carga_cada_apoio']).toFixed(2) + " kgf";
                // document.getElementById("sigma_user").value = parseFloat(dt_info['flecha_meio_vao']).toFixed(2) + " mm";
            }
        })
    }
}

function hidden_vao(option){
    if (option===1){
        document.getElementById("sigma").hidden = true;
        document.getElementById("vao_usuario_l").hidden = true;
        // document.getElementById("sigma_user").hidden = true;
        document.getElementById("fixacao").hidden = true;
        // document.getElementById("fixacao_usuario").hidden = true;
        document.getElementById("tamanho_L").hidden = true;
        //document.getElementById("btn_l_user").hidden = true;
    } else if (option===2){
        document.getElementById("sigma").hidden = false;
        document.getElementById("vao_usuario_l").hidden = false;
        // document.getElementById("sigma_user").hidden = true;
        document.getElementById("fixacao").hidden = false;
        // document.getElementById("fixacao_usuario").hidden = true;
        document.getElementById("tamanho_L").hidden = false;
        //document.getElementById("btn_l_user").hidden = false;
    } else if (option===3){
        document.getElementById("sigma").hidden = false;
        document.getElementById("vao_usuario_l").hidden = false;
        // document.getElementById("sigma_user").hidden = false;
        document.getElementById("fixacao").hidden = false;
        // document.getElementById("fixacao_usuario").hidden = false;
        document.getElementById("tamanho_L").hidden = false;
        //document.getElementById("btn_l_user").hidden = false;
    }
}

function carregaListas(){
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    $.ajax({
        url : "/app/flexibilidade/vao/", // the endpoint
        type : "POST", // http method
        dataType : "json",
        data : {'csrfmiddlewaretoken': csrf[0].value}, // data sent with the post request
    
        // handle a successful response
        success : function(json) {
            listaNormaSch = json['lista_norma_sch']
            listaSchFRP = json['lista_sch_frp']
            pagCarregada()
        },
        // handle a non-successful response
        error : function(xhr,errmsg,err) {
            console.log(errmsg)
            // add the error to the dom
        }
    });
}