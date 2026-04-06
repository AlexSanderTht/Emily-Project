// var Usuarios;
// var Tools;
// var ToolsAccess;
// var Access;
//
// $( document ).ready(async function() {
//     Usuarios = await RetornaUsuarios();
//     Tools = await RetornaTools();
//     ToolsAccess = await RetornaToolsAccess();
//     Access = await RetornaAccess();
//     //console.log(Usuarios)
//     //console.log(Tools)
//     //console.log(ToolsAccess)
//     //console.log(Access)
//     PreencherSelectFerramentas();
//     $("#loaderFerramentas").hide();
// });
// async function AtualizarDados()
// {
//     $("#ControleFerramentas").hide();
//     $("#loaderFerramentas").show();
//     Usuarios = []
//     Tools = []
//     ToolsAccess = []
//     Access = []
//     Usuarios = await RetornaUsuarios();
//     Tools = await RetornaTools();
//     ToolsAccess = await RetornaToolsAccess();
//     Access = await RetornaAccess();
//     $("#loaderFerramentas").hide();
//     $("#ControleFerramentas").show();
//     $("#Avisos").html(`<div class="alert alert-success" role="alert">
//         Níveis de Acesso Alterados com Sucesso!
//     </div>`);
//
// }
// const checkbox = document.getElementById('CheckBoxTodosUsuarios')
//
// checkbox.addEventListener('change', (event) => {
//     var Selecionado = false;
//   if (event.currentTarget.checked)
//   {
//     Selecionado = true;
//   } else
//   {
//     Selecionado = false;
//   }
//   var table = document.getElementById("tabelaUsuariosFerramentasBody");
//   for (let row of table.rows)
//     {
//         row.cells[2].firstChild.checked = Selecionado;
//     }
//
// })
//
// function PreencherSelectFerramentas()
// {
//     $("#selectFerramentas").empty();
//     for(var i = 0; i < Tools.length; i++)
//     {
//         var o = new Option(Tools[i].tb_tool_name, Tools[i].tb_tool_id);
//                   $(o).html(Tools[i].tb_tool_name + " - " + Tools[i].tb_tool_desc);
//                    $("#selectFerramentas").append(o);
//     }
//     if(Tools.length > 0)
//     {
//         PreencherTabelaFerramentasUsuario(Tools[0].tb_tool_id);
//     }
// }
// $('#selectFerramentas').change(function() {
//     var IDFerramenta = $("#selectFerramentas option:selected").val()
//      $("#Avisos").html("")
//     PreencherTabelaFerramentasUsuario(IDFerramenta);
//
//
//
// });
// function AlterarPermissoes()
// {
//         $("#ControleFerramentas").hide();
//     $("#loaderFerramentas").show();
//     var IDFerramenta = $("#selectFerramentas option:selected").val()
//     var table = document.getElementById("tabelaUsuariosFerramentasBody");
//     var ItensEnviar = []
//     for (let row of table.rows)
//     {
//         IDUsuario = row.cells[0].innerText;
//         Acesso = row.cells[2].firstChild.checked;
//         Nivel = row.cells[3].firstChild.value;
//         var Achou = false;
//         for(var j = 0; j < ToolsAccess.length; j++)
//         {
//             if((ToolsAccess[j].tb_to_ac_id_per == IDUsuario && ToolsAccess[j].tb_to_ac_id_tool == IDFerramenta) )
//             {
//                 Achou = true;
//                 if(ToolsAccess[j].tb_to_ac_id_acc != Nivel || Acesso==false)
//                 {
//                     ItensEnviar.push({"IDFerramenta": IDFerramenta, "IDUsuario":IDUsuario, "TemAcesso": Acesso, "NivelAcesso": Nivel})
//
//                 }
//             }
//         }
//         if(Achou == false && Acesso == true)
//         {
//             ItensEnviar.push({"IDFerramenta": IDFerramenta, "IDUsuario":IDUsuario, "TemAcesso": Acesso, "NivelAcesso": Nivel})
//         }
//     }
//       $.ajax({
//             url : "/app/a1hub/controle_usuarios/", // the endpoint
//             type : "POST", // http method
//             dataType : "json",
//             data : { ItensCadastro: JSON.stringify(ItensEnviar) }, // data sent with the post request
//
//             // handle a successful response
//             success : function(json) {
//                   AtualizarDados();
//
//             },
//
//             // handle a non-successful response
//             error : function(xhr,errmsg,err) {
//
//             }
//         });
//
// }
//
// function PreencherTabelaFerramentasUsuario(IDFerramenta)
// {
//     $("#ControleFerramentas").hide();
//     $('#tabelaUsuariosFerramentas tr td').parents('tr').remove();
//
//     for(var i = 0; i < Tools.length; i++)
//     {
//         if(Tools[i].tb_tool_id == IDFerramenta)
//         {
//             $("#BotaoAlterarFerramenta").html("Alterar Autorizações - " + Tools[i].tb_tool_name)
//             break;
//         }
//     }
//
//
//      var table = document.getElementById("tabelaUsuariosFerramentasBody");
//     for(var i = 0; i < Usuarios.length; i++)
//     {
//         var Achou = false;
//         for(var j = 0; j < ToolsAccess.length; j++)
//         {
//
//              if(ToolsAccess[j].tb_to_ac_id_tool == IDFerramenta && ToolsAccess[j].tb_to_ac_id_per == Usuarios[i].tb_per_id)
//             {
//                var selectList = document.createElement("select");
//                 for (var k = 0; k < Access.length; k++) {
//                  var option = document.createElement("option");
//                  option.setAttribute('value', Access[k].tb_acc_id);
//                  option.text = Access[k].tb_acc_id + " - " + Access[k].tb_acc_name;
//                  selectList.appendChild(option);
//                 }
//                var row = table.insertRow(table.rows.length);
//                var cell1 = row.insertCell(0);
//                var cell2 = row.insertCell(1);
//                var cell3 = row.insertCell(2);
//                var cell4 = row.insertCell(3);
//                cell1.innerHTML = Usuarios[i].tb_per_id;
//                cell1.style.width = "0px";
//                cell1.style.padding = "0px 0px 0px 0px";
//                cell1.style.border = "0px solid black";
//                cell1.style.fontSize = "0px";
//                cell2.innerHTML = Usuarios[i].tb_per_name;
//                cell3.innerHTML = `<input type="checkbox" checked>`;
//                cell4.appendChild(selectList);
//                selectList.options[ToolsAccess[j].tb_to_ac_id_acc-1].selected = true;
//                cell3.align = "center";
//                cell3.style.width = "100px";
//                cell4.style.width = "200px";
//                cell4.align = "center";
//                Achou = true;
//                break;
//             }
//         }
//         if(Achou == false)
//         {
//             var selectList = document.createElement("select");
//                 for (var k = 0; k < Access.length; k++) {
//                  var option = document.createElement("option");
//                  option.setAttribute("value", Access[k].tb_acc_id);
//                  option.text = Access[k].tb_acc_id + " - " + Access[k].tb_acc_name;
//                  selectList.appendChild(option);
//                 }
//            var row = table.insertRow(table.rows.length);
//            var cell1 = row.insertCell(0);
//            var cell2 = row.insertCell(1);
//            var cell3 = row.insertCell(2);
//            var cell4 = row.insertCell(3);
//            cell1.innerHTML = Usuarios[i].tb_per_id;
//            cell1.style.width = "0px";
//            cell1.style.padding = "0px 0px 0px 0px";
//            cell1.style.border = "0px solid black";
//            cell1.style.fontSize = "0px";
//            cell2.innerHTML = Usuarios[i].tb_per_name;
//            cell3.innerHTML = `<input type="checkbox">`;
//            cell3.align = "center";
//            cell4.appendChild(selectList);
//            selectList.options[2].selected = true;
//            cell3.style.width = "100px";
//            cell4.style.width = "200px";
//            cell4.align = "center";
//         }
//     }
//     $("#ControleFerramentas").show();
// }
//
//
// async function RetornaUsuarios(){
//  let request;
//       request = await $.ajax({
//       url: "/app/a1hub/controle_usuarios/RetornarPerson/",
//       method: "GET",
//       data: { }
//     });
//
//    return request;
// }
// async function RetornaTools(){
//  let request;
//       request = await $.ajax({
//       url: "/app/a1hub/controle_usuarios/RetornarTools/",
//       method: "GET",
//       data: { }
//     });
//
//    return request;
// }
// async function RetornaToolsAccess(){
//  let request;
//       request = await $.ajax({
//       url: "/app/a1hub/controle_usuarios/RetornarToolsAccess/",
//       method: "GET",
//       data: { }
//     });
//
//    return request;
// }
// async function RetornaAccess(){
//  let request;
//       request = await $.ajax({
//       url: "/app/a1hub/controle_usuarios/RetornarAccess/",
//       method: "GET",
//       data: { }
//     });
//
//    return request;
// }
//
//
//
// $(function() {
//
//
//     // This function gets cookie with a given name
//     function getCookie(name) {
//         var cookieValue = null;
//         if (document.cookie && document.cookie != '') {
//             var cookies = document.cookie.split(';');
//             for (var i = 0; i < cookies.length; i++) {
//                 var cookie = jQuery.trim(cookies[i]);
//                 // Does this cookie string begin with the name we want?
//                 if (cookie.substring(0, name.length + 1) == (name + '=')) {
//                     cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
//                     break;
//                 }
//             }
//         }
//         return cookieValue;
//     }
//     var csrftoken = getCookie('csrftoken');
//
//     /*
//     The functions below will create a header with csrftoken
//     */
//
//     function csrfSafeMethod(method) {
//         // these HTTP methods do not require CSRF protection
//         return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
//     }
//     function sameOrigin(url) {
//         // test that a given url is a same-origin URL
//         // url could be relative or scheme relative or absolute
//         var host = document.location.host; // host + port
//         var protocol = document.location.protocol;
//         var sr_origin = '//' + host;
//         var origin = protocol + sr_origin;
//         // Allow absolute or scheme relative URLs to same origin
//         return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
//             (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
//             // or any other URL that isn't scheme relative or absolute i.e relative.
//             !(/^(\/\/|http:|https:).*/.test(url));
//     }
//
//     $.ajaxSetup({
//         beforeSend: function(xhr, settings) {
//             if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
//                 // Send the token to same-origin, relative URLs only.
//                 // Send the token only if the method warrants CSRF protection
//                 // Using the CSRFToken value acquired earlier
//                 xhr.setRequestHeader("X-CSRFToken", csrftoken);
//             }
//         }
//     });
//
// });