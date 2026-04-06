function ShowDistMedia(){
    if(verify_selects_show_modal('modal-dist-media')){
        const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
        $.ajax({
              type: "GET",
              headers:{'X-CSRFToken':csrftoken},
              url: "/app/eletrica/a1pro/DistMedia/",
              dataType: 'json',
              data: {},
              success: function (data) {
                  FillFormsDistMedia(data['dist'])
              }
            });
    }
}

function FillFormsDistMedia(dm){
    document.getElementById('dist-media-value').value=dm
}

function RegisterDistMedia(){
    var dist_media = document.getElementById('dist-media-value').value
    if(dist_media === ''){
        return alert('A medida está inválida!!')
    }
    const csrftoken = document.getElementsByName('csrfmiddlewaretoken')[0].value
    $.ajax({
      type: "POST",
      headers:{'X-CSRFToken':csrftoken},
      url: "/app/eletrica/a1pro/DistMedia/",
      dataType: 'json',
      data: {'dist_media': JSON.stringify({'dist': dist_media})},
      success: function (data) {
          alert(data['return'])
      }
    });

}
