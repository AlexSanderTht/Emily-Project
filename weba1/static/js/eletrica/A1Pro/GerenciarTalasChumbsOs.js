const csrftoken_talas_chumbs = document.getElementsByName('csrfmiddlewaretoken')[0].value

function SwitchAlertGTalasChumbs(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}

async function FillAllTalasInContainer(img_dwg_jinja){
    let all_talas = await RequestAllTalas()
    FillContainerTalas(all_talas, img_dwg_jinja)
}

function FillContainerTalas(datas_talas, img_dwg_jinja){
    let str_container = ``
    for(let id_tala in datas_talas){
        let checked = datas_talas[id_tala]['check']?`checked`:``
        str_container += `<div class="card mb-1">
                            <div class="row">
                                <div class="col-3 d-flex align-items-center">
                                    <input class="form-check-input ml-5" value="${id_tala}" type="checkbox" ${checked}>
                                </div>
                                <div class="col-9 hover_dwgs_talas_chumbs_os text-truncate" onclick="ShowImgDwgGerenciarTalas(${id_tala}, 'tala')">
                                   <img  src="${img_dwg_jinja}" alt="Image TXT"  width="40" class="my-2"> ${datas_talas[id_tala]['name_file']}
                                </div>
                            </div>
                         </div>`
    }
    document.getElementById('content_cards_tipicos_talas').innerHTML = str_container
}

async function RequestAllTalas(){
    let datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/GTalasAllTalas/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['return']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function ShowImgDwgGerenciarTalas(id_tala, tala_chumbs){
    $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/RenderDwgImageTalas/" + id_tala + "/",
        dataType: 'json',
        data: {},
        success: function (data) {
            FillBase64InImgTala(data['img'], tala_chumbs)
        },
        failure: function (error) {
        },
    });
}

function FillBase64InImgTala(base_64_img, tala_chumbs){
    let element_img = document.getElementById('img_dwg_' + tala_chumbs)
    element_img.src = `data:image/png;base64,${base_64_img}`
    element_img.hidden = false
    document.getElementById('text_notify_image_' + tala_chumbs).hidden = true
}

function FilterFilesDwgTalasInGTalas(value){
    let all_cards = document.getElementById('content_cards_tipicos_talas').children
    for (let i = 0; i <all_cards.length;i++){
        let name_file = all_cards[i].children[0].children[1].innerText.toUpperCase()
        if(name_file.includes(value.toUpperCase())){
            all_cards[i].hidden = false
        }
        else{
            all_cards[i].hidden = true
        }
    }
}

function GetTalasCheckedInOs(){
    var list_ids = []
    let all_cards = document.getElementById('content_cards_tipicos_talas').children
    for (let i = 0; i <all_cards.length;i++){
        let checkbox = all_cards[i].children[0].children[0].children[0]
        if(checkbox.checked){
            list_ids.push(checkbox.value)
        }
    }
    return list_ids
}

function SendTalasCheckedInOs(){
    let talas_checked = GetTalasCheckedInOs()
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/",
        dataType: 'json',
        data: {'talas_in_os': JSON.stringify(talas_checked)},
        success: function (data) {
            SwitchAlertGTalasChumbs(data['return'])
        },
        failure: function (error) {
        },
    });
}

async function FillAllChumbsInContainer(){
    let all_chumbs = await RequestAllChumbs()
    let all_band_elet = await RequestAllBandElet()
    FillContainerChumbs(all_chumbs)
    FillContainerChumbs(all_band_elet, 'band_elet')
}

async function RequestAllChumbs(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/GChumbsAllChumbs/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['chumbs_groups']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

async function RequestAllBandElet(){
    var datas_return
    await $.ajax({
        type: "GET",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/GChumbsAllChumbs/",
        dataType: 'json',
        data: {},
        success: function (data) {
            datas_return = data['bnad_elet_groups']
        },
        failure: function (error) {
        },
    });
    return datas_return
}

function FillContainerChumbs(all_chumbs, type_chumb='chumbs') {
    let inner_html_container = ``
    for (let group in all_chumbs) {
        let card_body = ``
        let id_header = 'card_header_' + group
        let id_collapse_body = 'collapse_' + group
        let name_checkbox = 'radios_' + group
        for (let i = 0; i < all_chumbs[group].length; i++) {
            let obj_file = all_chumbs[group][i]
            let check = obj_file['check'] ? `checked` : ``
            card_body += `<input type="radio" name="${name_checkbox}" onclick="ShowImgDwgGerenciarTalas(${obj_file['id_file']}, '${type_chumb}')" value="${obj_file['id_file']}" ${check}>
                          <label>${obj_file['name_file']}</label><br>`
        }
        inner_html_container += `<div class="card mb-1" title="${group}">
                                    <div class="card-header p-1" id="${id_header}" data-toggle="collapse" data-target="#${id_collapse_body}" aria-controls="${id_collapse_body}" aria-expanded="true" onclick="HideImgChumbDwgOs()">
                                        <h5 class="mb-0">
                                            <a class="btn btn-link w-100 text-left">
                                                <i class="fa-solid fa-folder-closed text-secondary pr-2"></i>${group}
                                            </a>
                                        </h5>
                                    </div>
                                    <div class="collapse" id="${id_collapse_body}" aria-labelledby="${id_header}">
                                        <div class="card-body">
                                            ${card_body}
                                        </div>
            
                                    </div>
                                </div>`
    }
    if (type_chumb === 'chumbs') {
        document.getElementById('content_cards_tipicos_chumbs').innerHTML = inner_html_container
    } else {
        document.getElementById('content_cards_tipicos_band_elet').innerHTML = inner_html_container
    }

}

function GetFilesSelectedInChumbsOs(type_chumb='chumbs'){
    let input
    if(type_chumb==='chumbs'){
         input = document.querySelectorAll("#content_cards_tipicos_chumbs .collapse input[type='radio']");
    }else{
        input = document.querySelectorAll("#content_cards_tipicos_band_elet .collapse input[type='radio']");
    }

    var list_chumbs_in_os = []
    for(let i = 0; i < input.length; i++){
        if (input[i].checked) {
            list_chumbs_in_os.push(input[i].value)
        }
    }
    return list_chumbs_in_os
}

function SendFilesCheckedChumbs(type_chumb='chumbs'){
    let files_checked = GetFilesSelectedInChumbsOs(type_chumb)
    $.ajax({
        type: "POST",
        headers: {'X-CSRFToken': csrftoken_talas_chumbs},
        url: "/app/eletrica/a1pro/GerenciarTalasChumbsOs/GChumbsAllChumbs/",
        dataType: 'json',
        data: {'chumbs_checked': JSON.stringify(files_checked), 'type_chumb': JSON.stringify(type_chumb)},
        success: function (data) {
            SwitchAlertGTalasChumbs(data['return'])
        },
        failure: function (error) {
        },
    });
}

function HideImgChumbDwgOs(){
    document.getElementById('text_notify_image_chumbs').hidden = false
    document.getElementById('img_dwg_chumbs').hidden = true
}

function FilterGroupsInChumbsOs(value){
    let all_cards = document.getElementById('content_cards_tipicos_chumbs').children
    for(let i = 0; i < all_cards.length; i++){
        let name_gp = all_cards[i].title.toUpperCase()
        if(name_gp.includes(value.toUpperCase())){
            all_cards[i].hidden = false
        }
        else{
            all_cards[i].hidden = true
        }
    }
}