const csrftokenctfc = document.getElementsByName('csrfmiddlewaretoken')[0].value
function SwitchAlertCTFC(text, error=false){
    let icon = error?'error':'success'
    swal({
        text: text,
        icon: icon,
        button: 'Fechar'
    })
}
