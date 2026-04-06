import * as bootstrap from "'./js/bootstrap 4.1.3/bootstrap'";

var element_load_wheel = null
function load_element_load_wheel() {
    /**
     *Função para carregar o modal da load wheel
     */
    element_load_wheel = new bootstrap.Modal(document.getElementById("ModalLoadWheel"), {
        backdrop: 'static',
        keyboard: true
    });
}