document.getElementById("BotaoPesquisar").onclick = function ()
{
    var OS = $("#PesquisarCampoOS").val();
    var Sistema = $("#PesquisarCampoSistema").val();
    if (OS.length == 0) OS = '*';
    if (Sistema.length == 0) Sistema = '*';

    var request = new XMLHttpRequest();
    

  //  request.open('GET', 'api/ModelCII/PesquisaSistema/' + OS + '/' + Sistema, true);
    request.open('GET', 'PesquisarSistema/?os='+OS+'&sistema='+Sistema, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
        var HtmlPesquisa = "<table id='pesquisaSistema' class='pesquisaSistema'> <tr>"+
            " <th>Sistema</th>" +
            "<th>OS</th>" +
            "  <th>Revisão</th>" +
            '  <th style="background: white; border: 0px;"></th>' +
       " </tr>"
       
        data.forEach((Sist) => {
            HtmlPesquisa += " <tr>";
            HtmlPesquisa += '<td>'  + Sist.sistema + '</td > '
            HtmlPesquisa += " <td>" + Sist.os + " </td >";
            HtmlPesquisa += " <td>" + Sist.revisão + " </td >";
            HtmlPesquisa += '<td> <button value="Pesquisar" style="width: 100%" class="subscribe btn btn-warning  rounded-pill shadow-sm" style="background-color:#ffbe47;" onclick="window.location.href=' + "'/app/flexibilidade/DetalhesSistema/" + Sist.os + '/' + Sist.sistema + '/'+Sist.revisão+ "'" + '">Acessar</button>' + " </td >";
            HtmlPesquisa += "</tr >";
        })
        HtmlPesquisa += "</table>";
        $("#ResultadoPesquisa").html(HtmlPesquisa);
    };
    request.send();
};
document.getElementById("BotaoPesquisarLinhas").onclick = function () {

    document.getElementById("ResultadoPesquisa").style.display = "none";
    document.getElementById("loader").style.display = "block";

    var Linha = $("#PesquisarCampoLinha").val();
    if (Linha.length == 0) Linha = '*';

    var request = new XMLHttpRequest();


    request.open('GET', '/app/flexibilidade/PesquisarSistemas/PesquisarLinha/?linha=$' + Linha, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
        var HtmlPesquisa = "<table id='pesquisaSistema' class='pesquisaSistema'> <tr>" +
            " <th>Sistema</th>" +
            "<th>OS</th>" +
            "  <th>Revisão</th>" +
            '  <th style="background: white; border: 0px;"></th>' +
            " </tr>"

        data.forEach((Sist) => {
            HtmlPesquisa += " <tr>";
            HtmlPesquisa += '<td>' + Sist.sistema + '</td > '
            HtmlPesquisa += " <td>" + Sist.os + " </td >";
            HtmlPesquisa += " <td>" + Sist.revisão + " </td >";
            HtmlPesquisa += '<td> <button value="Pesquisar" style="width: 100%" class="subscribe btn btn-warning  rounded-pill shadow-sm" style="background-color:#ffbe47;" onclick="window.location.href=' + "'/app/flexibilidade/DetalhesSistema/" + Sist.os + '/' + Sist.sistema + '/' + Sist.revisão + "'" + '">Acessar</button>' + " </td >";
            HtmlPesquisa += "</tr >";
        })
        HtmlPesquisa += "</table>";
        $("#ResultadoPesquisa").html(HtmlPesquisa);
        document.getElementById("loader").style.display = "none";
        document.getElementById("ResultadoPesquisa").style.display = "block";


    };
    request.send();
};
document.getElementById("BotaoPesquisarSuporte").onclick = function () {

    document.getElementById("ResultadoPesquisa").style.display = "none";
    document.getElementById("loader").style.display = "block";

    var Suporte = $("#PesquisarCampoSuporte").val();
    if (Suporte.length == 0) Suporte = '*';

    var request = new XMLHttpRequest();


    request.open('GET', '/app/flexibilidade/PesquisarSistemas/PesquisarSuporte/?suporte=' + Suporte, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
        var HtmlPesquisa = "<table id='pesquisaSistema' class='pesquisaSistema'> <tr>" +
            " <th>Sistema</th>" +
            "<th>OS</th>" +
            "  <th>Revisão</th>" +
            '  <th style="background: white; border: 0px;"></th>' +
            " </tr>"

        data.forEach((Sist) => {
            HtmlPesquisa += " <tr>";
            HtmlPesquisa += '<td>' + Sist.sistema + '</td > '
            HtmlPesquisa += " <td>" + Sist.os + " </td >";
            HtmlPesquisa += " <td>" + Sist.revisão + " </td >";
            HtmlPesquisa += '<td> <button value="Pesquisar" style="width: 100%" class="subscribe btn btn-warning  rounded-pill shadow-sm" style="background-color:#ffbe47;" onclick="window.location.href=' + "'/app/flexibilidade/DetalhesSistema/" + Sist.os + '/' + Sist.sistema + '/' + Sist.revisão + "'" + '">Acessar</button>' + " </td >";
            HtmlPesquisa += "</tr >";
        })
        HtmlPesquisa += "</table>";
        $("#ResultadoPesquisa").html(HtmlPesquisa);
        document.getElementById("loader").style.display = "none";
        document.getElementById("ResultadoPesquisa").style.display = "block";


    };
    request.send();
};