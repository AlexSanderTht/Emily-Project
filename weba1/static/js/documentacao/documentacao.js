function swalAlert_DOC(titulo, texto, icone_img, btn){
    return swal(
        {
        title: titulo,
        text: texto,
        icon: icone_img,
        button: btn,

    }).then(() => {
    location.reload();
})

    $('div.swal-modal').addClass('bordas')
    $('div.swal-title').addClass('h4')
    $('button.swal-button').addClass('btn btn-primary px-5 rounded-pill')
    $('div.swal-text').addClass('text-center')
    $('div.swal-footer').addClass('d-flex justify-content-center')
}


function swalAlert_DOC_without_reload(titulo, texto, icone_img, btn){
    swal(
        {
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
function sleepFor(sleepDuration){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){
        /* Do nothing */
    }
}