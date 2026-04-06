function getCookie(name) {
    debugger;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}


function ajaxTestsMinimalAPI(btn){
    debugger;
    const url = btn.dataset.url;
    const payload = { name: "Matheus", action: "teste" };
    $.ajax({

        type: "POST",
        data: JSON.stringify(payload),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: { "X-CSRFToken": getCookie("csrftoken") },
        url: "PanelDevTests/",

        success: function (response){
            debugger;
            console.log("OK:", response);
            alert(JSON.stringify(response, null, 2));
        },
        error: function (xhr, status, err){
            console.error("ERRO:", status, err, xhr.responseText);
            alert("Erro: " + xhr.status + " - " + (xhr.responseText || status));
        }
    });
}