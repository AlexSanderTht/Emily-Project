function calcula_vao(id){
    console.log(id);

    $.ajax({
            type: 'POST',
            url: '/flexibilidade/vao/',
            success: function (result) {
                console.log("suucesso")
                $('#mensagem').text('foi');
            }
        }
    );
}