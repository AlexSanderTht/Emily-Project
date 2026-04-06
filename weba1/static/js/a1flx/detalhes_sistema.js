window.onload = function () {

    document.getElementById("loader").style.display = "none";
    OS = $("#OSRef").html();
    Sistema = $("#SistemaRef").html();
    Rev = $("#RevRef").html();
    IbelData = RetornaIbelData(OS, Sistema, Rev);
    Restraints = RetornaRestraints(OS, Sistema, Rev);
    RestraintsSummary = RetornaRestraintsSummary(OS, Sistema, Rev);
    CriarTabelaLinhas(OS, Sistema, Rev);
    CriarTabelaSuportes(OS, Sistema, Rev);
};
var OS;
var Sistema;
var Rev;
var Restraints = [];
var RestraintsSummary = [];
var IbelData = [];

function NaoEhRigido(value) {
    return value.rigid_ptr == 0;
}

function CriarTabelaLinhas(OS, Sistema, Rev) {


    let LinhasNomes = [...new Set(IbelData.filter(NaoEhRigido).map(v => v.line_no))];


    var dataSetStress = [];
    for (var i = 0; i < LinhasNomes.length; i++) {
        dataSetStress.push([LinhasNomes[i]]);
    }


    $('#TabelaLinhas').DataTable({
        data: dataSetStress,
        columns: [
            {title: "Linha"},
        ],

        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
        "pageLength": 10,
        "language": {
            "emptyTable": "Nenhuma Linha Encontrada.",
            "zeroRecords": "Nenhuma linha encontrada.",
            "search": "Pesquisar",
            "paginate": {
                "first": "Primeiro",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            },
            "lengthMenu": "Mostrar _MENU_ ",
            "info": "",
            "infoEmpty": "Sem linhas",
            "infoFiltered": "",
            'sDom': "<'pagination' 'w-100'p>"
        }


    });
    table = $('#TabelaLinhas').DataTable();


    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });

    document.getElementById("loaderLinhas").style.display = "none";
    pagination_class()
}

function RetornaSuporte(sup, id) {
    return sup.rest_ptr === id;
}

function RemoverSistema(OS, Sistema, Rev) {
    $("#ErroExcluirSistema").html("");
    //ErroExcluirSistema
    //window.location = '/app/flexibilidade/RemoverSistema/{{ InfoImports_records.os }}/{{ InfoImports_records.sistema }}/{{ InfoImports_records.revisão }}'
    const csrf = document.getElementsByName("csrfmiddlewaretoken")
    const fd = new FormData()
    fd.append('csrfmiddlewaretoken', csrf[0].value)
    var UrlT = `/app/flexibilidade/RemoverSistema/${OS}/${Sistema}/${Rev}/`;
    $.ajax({
        type: 'post',

        url: UrlT,

        enctype: 'multipart/form-data',
        data: fd,
        beforeSend: function () {

        },
        success: function (response) {

            //console.log(response);
            //DadosImportacao = response["Dados"]
            if (response["Erro"]) {
                var Erro = response["Erro"]
                if (Erro.length > 0) {
                    $("#ErroExcluirSistema").html(`<div class="alert alert-danger" role="alert">
                      <strong>Não é possível excluir um modelo vinculado!</strong>
                    </div>`);
                }
            } else {
                window.location.href = "/app/flexibilidade/PesquisarSistemas/";
            }

            //var ID = response["id"]

        },
        fail: function (error) {

        },
        cache: false,
        contentType: false,
        processData: false
    })

}

function MostrarModal(NumeroSuporte, NomeSuporte) {
    $('#TituloCargas').html("CARGAS PARA O SUPORTE " + NomeSuporte);
    $('#CargasSuporte').modal('show')
    var FX = 0, FY = 0, FZ = 0, MX = 0, MY = 0, MZ = 0;
    var CasoFX = "", CasoFY = "", CasoFZ = "", CasoMX = "", CasoMY = "", CasoMZ = "";
    var TipoSuporte = "";
    var funits = "";
    var munits = "";
    for (var j = 0; j < RestraintsSummary.length; j++) {
        if (RestraintsSummary[j].node == NumeroSuporte)// && RestraintsSummary[j].case.toLowerCase().indexOf("(exp)")==-1)
        {
            if (Math.abs(RestraintsSummary[j].fx) > Math.abs(FX)) {
                FX = RestraintsSummary[j].fx;
                CasoFX = RestraintsSummary[j].case;
            }
            if (Math.abs(RestraintsSummary[j].fy) > Math.abs(FY)) {
                FY = RestraintsSummary[j].fy;
                CasoFY = RestraintsSummary[j].case;
            }
            if (Math.abs(RestraintsSummary[j].fz) > Math.abs(FZ)) {
                FZ = RestraintsSummary[j].fz;
                CasoFZ = RestraintsSummary[j].case;
            }
            if (Math.abs(RestraintsSummary[j].mx) > Math.abs(MX)) {
                MX = RestraintsSummary[j].mx;
                CasoMX = RestraintsSummary[j].case;
            }
            if (Math.abs(RestraintsSummary[j].my) > Math.abs(MY)) {
                MY = RestraintsSummary[j].my;
                CasoMY = RestraintsSummary[j].case;
            }
            if (Math.abs(RestraintsSummary[j].mz) > Math.abs(MZ)) {
                MZ = RestraintsSummary[j].mz;
                CasoMZ = RestraintsSummary[j].case;
            }
            TipoSuporte = RestraintsSummary[j].type;
            munits = RestraintsSummary[j].munits;
            funits = RestraintsSummary[j].funits;
        }
    }

    var HtmlPesquisa = "<table id='pesquisaSistema'> <tr>" +
        " <th>Carga</th>" +
        "<th>Valor</th>" +
        "<th>Caso de Carga</th>" +
        " </tr>"
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>FX(' + funits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(FX, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoFX + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>FY(' + funits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(FY, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoFY + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>FZ(' + funits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(FZ, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoFZ + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>MX(' + munits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(MX, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoMX + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>MY(' + munits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(MY, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoMY + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += '<td>MZ(' + munits + ')</td > '
    HtmlPesquisa += "<td>" + Math.round10(MZ, -2) + " </td >";
    HtmlPesquisa += "<td>" + CasoMZ + " </td >";
    HtmlPesquisa += "</tr >";
    HtmlPesquisa += " <tr>";
    HtmlPesquisa += "</table>";
    HtmlPesquisa += "<br/>";
    HtmlPesquisa += `<div class="input-group mb-3" >
                                      <div class="input-group-prepend" >
                                        <span style="height:34px" class="input-group-text" id="TipoSup" ><b>Tipo do suporte</b></span>
                                      </div>
                                      <input readonly type="text" style="font-weight: bold;" name="TipoSuporte" class="form-control"  value="${TipoSuporte}" aria-describedby="TipoSup">
                                    </div>`;

    $('#Detalhescarga').html(HtmlPesquisa);


    document.getElementById("loaderCargas").style.display = "none";
}

function CriarTabelaSuportes(OS, Sistema, Rev) {
    $.fn.DataTable.ext.pager.numbers_length = 5;
    var Suportes = [];
    var dataSetStress = [];
    for (var i = 0; i < IbelData.length; i++) {
        if (IbelData[i].rest_ptr > 0) {
            var suporte = Restraints.find(eh => eh.rest_ptr == IbelData[i].rest_ptr);
            if (suporte != null && suporte.node_name) {
                Suportes.push({"Suporte": suporte.node_name, "Linha": IbelData[i].line_no, "Node": suporte.node_num})
            }
        }
    }
    for (var i = 0; i < Suportes.length; i++) {
        var OBJ = Suportes[i];
        var onclick = `onclick="MostrarModal('${OBJ.Node}', '${OBJ.Suporte}')"`
        HTML2 = `<button value="" class="centerbtn subscribe btn btn-warning  rounded-pill shadow-sm" style="padding: 2px; font-size:75%;" title="Mostrar Cargas Máximas" ${onclick}>Cargas</button>`
        dataSetStress.push([OBJ.Suporte, OBJ.Linha, HTML2]);

    }


    $('#TabelaSuportes').DataTable({
        data: dataSetStress,
        columns: [
            {title: "Suporte"},
            {title: "Linha"},
            {title: "Cargas"},
        ],

        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
        "pageLength": 10,
        "language": {
            "emptyTable": "Nenhuma Linha Encontrada.",
            "zeroRecords": "Nenhuma linha encontrada.",
            "search": "Pesquisar",
            "paginate": {
                "first": "Primeiro",
                "last": "Último",
                "next": "Próximo",
                "previous": "Anterior"
            },
            "lengthMenu": "Mostrar _MENU_ ",
            "info": "",
            "infoEmpty": "Sem linhas",
            "infoFiltered": "",

        }


    });
    table = $('#TabelaSuportes').DataTable();


    $('#button').click(function () {
        table.row('.selected').remove().draw(false);
    });
    pagination_class()

}

function pagination_class(){
    document.getElementById("loaderSuportes").style.display = "none";
    let pagination = document.getElementsByClassName('pagination')
    for (let i = 0; i < pagination.length; i++) {
        pagination[i].className = pagination[i].className + ' w-100 '
    }
}

function RetornaIbelData(OS, Sistema, Rev) {
    var DataReturn = []
    var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarIbelData/?os=' + OS + '&sistema=' + Sistema + '&revisao=' + Rev, false);
    request.onload = function () {
        var data = JSON.parse(this.response)
        data.forEach((Sist) => {
            DataReturn.push(Sist);

        })

    };
    request.send();
    return DataReturn;
}

function RetornaRestraints(OS, Sistema, Rev) {
    var RestraintsTemp = []
    var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarInputRestraints/?os=' + OS + '&sistema=' + Sistema + '&revisao=' + Rev, false);
    request.onload = function () {
        var data = JSON.parse(this.response)
        data.forEach((Sist) => {
            RestraintsTemp.push(Sist);

        })


    };
    request.send();
    return RestraintsTemp;
}

function RetornaRestraintsSummary(OS, Sistema, Rev) {
    var RestraintsTemp = []
    var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputRestraintsSummary/?os=' + OS + '&sistema=' + Sistema + '&revisao=' + Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
        data.forEach((Sist) => {
            RestraintsTemp.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return RestraintsTemp;
}

//document.getElementById("ConfirmacaoExclusao").onclick = function ()
//{
//    document.getElementById("loader").style.display = "block";
//     window.location.href = "/app/flexibilidade/RemoverSistema/"+OS+"/"+Sistema+"/"+Rev;
//};

(function () {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // If the value is negative...
        if (value < 0) {
            return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();
