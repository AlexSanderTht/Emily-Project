$( document ).ready(function() {


    head = document.getElementById("Mod3D").parentElement;
    head.classList.remove("py-5");
    head.classList.remove("container");
});
var Cores = [];
var head;
var Stresses = [];
var Displacements = [];
var Restraints = [];
var RestraintsSummary = [];
var IbelData = [];
var Rigids = [];
var WRC297 = [];
var SifTees = [];
var SifTeesTypes = [];
var Units = [];
var InputRestraints = [];
var RestraintTypes = [];
var ExpansionJoints = [];
var InputHangers = [];
var OutputHangers = [];
var CasosDeCarga = [];
var table; //variavel global para controlar o clique na linha
var AdmissiveisSuporte = [];

    window.onbeforeunload = function() {
        unityGame.Quit();
        unityGame = null;
            head.classList.add("py-5");
            head.classList.add("container");
      };

function CheckSeCasoCargaExiste(Nome)
{
    var found = false;
    for(var i = 0; i < CasosDeCarga.length; i++) {
        if (CasosDeCarga[i] == Nome) {
            found = true;
            break;
        }
    }
    return found;
}

function CarregarAbasInfo(OS, Sistema, Rev){
    AdmissiveisSuporte = RetornaAdmissiveisSuporte().sort(dynamicSort("diametro"));
    Stresses = RetornaStresses(OS, Sistema, Rev);
    Displacements = RetornaDisplacements(OS, Sistema, Rev);
    Restraints = RetornaRestraints(OS, Sistema, Rev);
    CarregarDadosCargas(OS, Sistema, Rev);
    RestraintsSummary = RetornaRestraintsSummary(OS, Sistema, Rev);
    IbelData = RetornaIbelData(OS, Sistema, Rev);
    Rigids = RetornaRigids(OS, Sistema, Rev);
    WRC297 = RetornaWRC297(OS, Sistema, Rev);
    SifTees = RetornaSifTees(OS, Sistema, Rev);
    SifTeesTypes = RetornaSifTeesTypes(OS, Sistema, Rev);
    Units = RetornaUnits(OS, Sistema, Rev);
    InputRestraints = RetornaInputRestraints(OS, Sistema, Rev);
    RestraintTypes = RetornaRestraintTypes(OS, Sistema, Rev);
    ExpansionJoints = RetornaExpansionJoints(OS, Sistema, Rev);
    InputHangers = RetornaInputHangers(OS, Sistema, Rev);
    OutputHangers = RetornaOutputHangers(OS, Sistema, Rev);

}

var ElementoListaClicado = $("#Iaaaa");
function CarregarDadosCargas(OS, Sistema, Rev){
    var HTML = `<li style="font-size:75%;"><span class='caret'> Load Cases </span>
                <ul class="nested">`;
    var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/PesquisarCasosCarga/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {

            HTML += `
                         <li><span class="caret">${Sist.case.replace('CASE', '')}</span>
                         <ul class="nested">
                         <li onclick="CriarTabelaStresses('${Sist.case}', this)" style="cursor:pointer">Stresses</li>
                         <li onclick="CriarTabelaDisplacements('${Sist.case}', this)" style="cursor:pointer">Displacements</li>
                         <li onclick="CriarTabelaRestraints('${Sist.case}', this)" style="cursor:pointer">Restraints</li>
                        </ul>
                        </li>
                    `;
        })
          HTML += "</ul></li>";
          HTML += `<li style="font-size:75%;"><span class='caret'> Suportes</span>
                <ul class="nested">
                <li onclick="CriarTabelaMaioresCargasSuportes(this)" style="cursor:pointer">Maiores Cargas e Nomes</li>
                </ul></li>`;
         // console.log(HTML);
          $("#InferiorLateralEsq").html(HTML);
    InicializarCarets();

    };
    request.send();

};
function CriarTabelaMaioresCargasSuportes(el)
{
        try
        {
            ElementoListaClicado.style.background = 'lightgray';
        }
        catch(e)
        {

        }
        ElementoListaClicado = el;
        el.style.background = 'gray';

   var funits = "";
   var munits = "";

    var arrNodes = [];
    for(var i = 0; i< RestraintsSummary.length; i++)
    {
        var NODE = RestraintsSummary[i].node;
        var ContemRigido = false;
        var Diametro = 0;
        for(var j = 0; j < IbelData.length; j++)
        {
            if(IbelData[j].to_node == NODE && IbelData[j].rigid_ptr > 0)
            {
                ContemRigido = true;
                break;
            }
            else
            if(IbelData[j].from_node == NODE && IbelData[j].rigid_ptr > 0)
            {
                ContemRigido = true;
                break;
            }

            if(IbelData[j].from_node == NODE || IbelData[j].to_node==NODE)
            {
                  Diametro= IbelData[j].diameter;
            }
        }
        if(ContemRigido == false)
        {
            if(!ContemNode(arrNodes, NODE))
            {
                arrNodes.push({NODE: NODE, Diameter: Diametro});
            }
        }
    }

    var NodesEsfMaximo = [];

      for(var i = 0; i< arrNodes.length; i++)
      {
        var FX =0, FY=0, FZ=0, MX=0, MY=0, MZ = 0;
        var NomeSuporte = "";
        var TipoSuporte = "";
        for(var j = 0; j < RestraintsSummary.length; j++)
        {
            if(RestraintsSummary[j].node == arrNodes[i].NODE)// && RestraintsSummary[j].case.toLowerCase().indexOf("(exp)")==-1)
            {
                if(Math.abs(RestraintsSummary[j].fx) > Math.abs(FX)) FX = RestraintsSummary[j].fx;
                if(Math.abs(RestraintsSummary[j].fy) > Math.abs(FY)) FY = RestraintsSummary[j].fy;
                if(Math.abs(RestraintsSummary[j].fz) > Math.abs(FZ)) FZ = RestraintsSummary[j].fz;
                if(Math.abs(RestraintsSummary[j].mx) > Math.abs(MX)) MX = RestraintsSummary[j].mx;
                if(Math.abs(RestraintsSummary[j].my) > Math.abs(MY)) MY = RestraintsSummary[j].my;
                if(Math.abs(RestraintsSummary[j].mz) > Math.abs(MZ)) MZ = RestraintsSummary[j].mz;
                NomeSuporte = RestraintsSummary[j].node_name;
                TipoSuporte = RestraintsSummary[j].type;
            }
        }


        if(NomeSuporte == "") NomeSuporte = " - ";
        NodesEsfMaximo.push({Nome: NomeSuporte, Node: arrNodes[i].NODE, Diametro: arrNodes[i].Diameter, FX: FX, FY:FY, FZ:FZ, MX:MX, MY:MY, MZ:MZ, type: TipoSuporte});

      }



     if(RestraintsSummary.length > 0)
   {
        funits = RestraintsSummary[0].funits;
        munits = RestraintsSummary[0].munits;
   }


    var dataSetRestraintsSum = [];
     for(var i = 0; i < NodesEsfMaximo.length; i++){
            var Obj = NodesEsfMaximo[i];

            var AdmSelecionado = AdmissiveisSuporte[0];
            for(var j = 0; j < AdmissiveisSuporte.length; j++)
            {
                if(Obj.Diametro < AdmissiveisSuporte[j].diametro)
                {
                    AdmSelecionado = AdmissiveisSuporte[j];
                       break;
                }


            }
           // console.log("Diam tub: " + Obj.Diametro + " - Diam ADm:" + AdmSelecionado.diametro);
            var Divisor = 0;

            if((Math.abs(Obj.FX) / AdmSelecionado.maximoforca) > Divisor && Obj.FX != 0)
            {
               Divisor = Math.abs(Obj.FX) / AdmSelecionado.maximoforca ;
            }
            if((Math.abs(Obj.FY) / AdmSelecionado.maximoforca) > Divisor && Obj.FY != 0)
            {
               Divisor = Math.abs(Obj.FY) / AdmSelecionado.maximoforca ;
            }
            if((Math.abs(Obj.FZ) / AdmSelecionado.maximoforca) > Divisor && Obj.FZ != 0)
            {
               Divisor = Math.abs(Obj.FZ) / AdmSelecionado.maximoforca ;
            }
             if((Math.abs(Obj.MX) / AdmSelecionado.maximomomento) > Divisor && Obj.MX != 0)
            {
               Divisor = Math.abs(Obj.MX) / AdmSelecionado.maximomomento ;
            }
               if((Math.abs(Obj.MY) / AdmSelecionado.maximomomento) > Divisor && Obj.MY != 0)
            {
               Divisor = Math.abs(Obj.MY) / AdmSelecionado.maximomomento ;
            }
               if((Math.abs(Obj.MZ) / AdmSelecionado.maximomomento) > Divisor && Obj.MZ != 0)
            {
               Divisor = Math.abs(Obj.MZ) / AdmSelecionado.maximomomento ;
            }


            var HtmlFX = `<div style="Color: blue">${Math.round10(Obj.FX, -2)}</div>`;
            if( Math.abs(Obj.FX) > AdmSelecionado.maximoforca)
            {
                HtmlFX = `<div style="Color: red">${Math.round10(Obj.FX, -2)}</div>`;
            }
             var HtmlFY = `<div style="Color: blue">${Math.round10(Obj.FY, -2)}</div>`;
            if( Math.abs(Obj.FY) > AdmSelecionado.maximoforca)
            {
                HtmlFY = `<div style="Color: red">${Math.round10(Obj.FY, -2)}</div>`;
            }
              var HtmlFZ = `<div style="Color: blue">${Math.round10(Obj.FZ, -2)}</div>`;
            if( Math.abs(Obj.FZ) > AdmSelecionado.maximoforca)
            {
                HtmlFZ = `<div style="Color: red">${Math.round10(Obj.FZ, -2)}</div>`;
            }
            
            var HtmlMX = `<div style="Color: blue">${Math.round10(Obj.MX, -2)}</div>`;
            if( Math.abs(Obj.MX) > AdmSelecionado.maximomomento)
            {
                HtmlMX = `<div style="Color: red">${Math.round10(Obj.MX, -2)}</div>`;
            }
            
             var HtmlMY = `<div style="Color: blue">${Math.round10(Obj.MY, -2)}</div>`;
            if( Math.abs(Obj.MY) > AdmSelecionado.maximomomento)
            {
                HtmlMY = `<div style="Color: red">${Math.round10(Obj.MY, -2)}</div>`;
            }
            
             var HtmlMZ = `<div style="Color: blue">${Math.round10(Obj.MZ, -2)}</div>`;
            if( Math.abs(Obj.MZ) > AdmSelecionado.maximomomento)
            {
                HtmlMZ = `<div style="Color: red">${Math.round10(Obj.MZ, -2)}</div>`;
            }


            var HtmlDivisor = `<div style="Color: blue">${Math.round10(Divisor, -2)}</div>`;
            if(Divisor > 1)
            HtmlDivisor = `<div style="Color: red">${Math.round10(Divisor, -2)}</div>`;



           dataSetRestraintsSum.push([Obj.Nome, Obj.Node, HtmlFX, HtmlFY, HtmlFZ, HtmlMX, HtmlMY, HtmlMZ, HtmlDivisor, Obj.Diametro, Obj.type]);
        }



    if($( "#TabelaDados" ).html() != "")
    {
        $('#TabelaDados').DataTable().clear().destroy(false);
        $('#TabelaDados').empty();
        $("#TabelaDados tbody").empty();
        $("#TabelaDados thead").empty();
    }

    $('#TabelaDados').DataTable( {
        data: dataSetRestraintsSum,
        columns: [
            { title: "Nome" },
            { title: "Nó" },
            { title: "fX ("+funits+")" },
            { title: "fY ("+funits+")" },
            { title: "fZ ("+funits+")" },
            { title: "mX ("+munits+")" },
            { title: "mY ("+munits+")" },
            { title: "mZ ("+munits+")" },
            { title: "Ratio Adm." },
            { title: "Diâmetro" },
            { title: "Type" }
        ],
        "scrollY":    "275px",
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "searching": false,
             language: {
        search: "",
        searchPlaceholder: "Pesquisar" }

    } );
    table = $('#TabelaDados').DataTable();
   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
      $('#TabelaDados tbody').on( 'click', 'tr', function ()
      {

            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
              var data = table.row( this ).data();
              var JsonStringRet = JSON.stringify(data[1]);
            unityGame.SendMessage('JavaFuncoes', 'SelecionarSuporte', JsonStringRet);

    } );

    $('#button').click( function ()
    {
        table.row('.selected').remove().draw( false );
    } );


}
function ContemCASE(value, caso){
    return value.case.includes(caso);
}
function ContemNode(value, nd){
     for(var i = 0; i < value.length; i++)
      {
        if(value[i].NODE == nd)
        {
            return true;
        }
      }
    return false;
}

function CriarTabelaStresses(Case, el){


        try
        {
            ElementoListaClicado.style.background = 'lightgray';
        }
        catch(e)
        {

        }
        ElementoListaClicado = el;
        el.style.background = 'gray';

      arrFiltrada = [];
      var unidade = "";
      for(var i = 0; i < Stresses.length; i++)
      {
          if(Stresses[i].case == Case){
              unidade = Stresses[i].stress_units;
              arrFiltrada.push(Stresses[i]);
          }
      }

    var dataSetStress = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
           dataSetStress.push([Obj.from_node + "-" + Obj.to_node, Obj.from_node, Math.round10(Obj.bending_stressf, -2), Math.round10(Obj.torsion_stressf, -2), Math.round10(Obj.sifinf, -2), Math.round10(Obj.sifoutf, -2), Math.round10(Obj.code_stressf, -2), Math.round10(Obj.allow_stressf, -2), Math.round10(Obj.prct_strf, -2)]);
           dataSetStress.push([Obj.from_node + "-" + Obj.to_node, Obj.to_node, Math.round10(Obj.bending_stresst, -2), Math.round10(Obj.torsion_stresst, -2), Math.round10(Obj.sifint, -2), Math.round10(Obj.sifoutt, -2), Math.round10(Obj.code_stresst, -2), Math.round10(Obj.allow_stresst, -2), Math.round10(Obj.prct_strt, -2)]);
        }



     if($( "#TabelaDados" ).html() != "")
    {
       $('#TabelaDados').DataTable().clear().destroy(false);
       $('#TabelaDados').empty();
        $("#TabelaDados tbody").empty();
        $("#TabelaDados thead").empty();
    }

    $('#TabelaDados').DataTable( {
        data: dataSetStress,
        columns: [
            { title: "On Element" },
            { title: "Element Nodes" },
            { title: "Bending Stress ("+unidade+")" },
            { title: "Torsion Stress ("+unidade+")" },
            { title: "SIF\'s In Plane" },
            { title: "SIF\'s Out Plane" },
            { title: "Code Stress (" +unidade +")" },
            { title: "Allowable Stress (" +unidade + ")" },
            { title: "Percent (%)" }
        ],
        "scrollY":    "275px",
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
    } );
    table = $('#TabelaDados').DataTable();
   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
     $('#TabelaDados tbody').on( 'click', 'tr', function () {

            table.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');
              var data = table.row( this ).data();
            unityGame.SendMessage('JavaFuncoes', 'SelecionarBarra', data[0]);

    } );

    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
    } );


}

function CriarTabelaDisplacements(Case, el){


        try
        {
            ElementoListaClicado.style.background = 'lightgray';
        }
        catch(e)
        {

        }
        ElementoListaClicado = el;
        el.style.background = 'gray';

      arrFiltrada = [];
      var dunits = "";
      var runits = "";
      for(var i = 0; i < Displacements.length; i++)
      {
          if(Displacements[i].case == Case){
              dunits = Displacements[i].dunits;
              runits = Displacements[i].runits;
              arrFiltrada.push(Displacements[i]);
          }
      }

    var dataSetDisplacements = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
           dataSetDisplacements.push([Obj.node, Math.round10(Obj.dx, -2), Math.round10(Obj.dy, -2), Math.round10(Obj.dz, -2), Math.round10(Obj.rx, -2), Math.round10(Obj.ry, -2), Math.round10(Obj.rz, -2)]);
        }



    if($( "#TabelaDados" ).html() != "")
    {
        $('#TabelaDados').DataTable().clear().destroy(false);
        $('#TabelaDados').empty();
        $("#TabelaDados tbody").empty();
        $("#TabelaDados thead").empty();
    }

    $('#TabelaDados').DataTable( {
        data: dataSetDisplacements,
        columns: [
            { title: "Node" },
            { title: "dX ("+dunits+")" },
            { title: "dY ("+dunits+")" },
            { title: "dZ ("+dunits+")" },
            { title: "rX ("+runits+")" },
            { title: "rY ("+runits+")" },
            { title: "rZ ("+runits+")" }
        ],
        "scrollY":    "275px",
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
    } );
    table = $('#TabelaDados').DataTable();
   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
      $('#TabelaDados tbody').on( 'click', 'tr', function () {

            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
              var data = table.row( this ).data();
             var JsonStringRet = JSON.stringify(data[0]);
            unityGame.SendMessage('JavaFuncoes', 'SelecionarBarra', JsonStringRet);

    } );

    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
    } );


}

function CriarTabelaRestraints(Case, el){


        try
        {
            ElementoListaClicado.style.background = 'lightgray';
        }
        catch(e)
        {

        }
        ElementoListaClicado = el;
        el.style.background = 'gray';

      arrFiltrada = [];
      var funits = "";
      var munits = "";
      for(var i = 0; i < Restraints.length; i++)
      {
          if(Restraints[i].case == Case){
              funits = Restraints[i].funits;
              munits = Restraints[i].munits;
              arrFiltrada.push(Restraints[i]);
          }
      }

    var dataSetRestraints = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
           dataSetRestraints.push([Obj.node, Math.round10(Obj.fx, -2), Math.round10(Obj.fy, -2), Math.round10(Obj.fz, -2), Math.round10(Obj.mx, -2), Math.round10(Obj.my, -2), Math.round10(Obj.mz, -2), Obj.type]);
        }



    if($( "#TabelaDados" ).html() != "")
    {
        $('#TabelaDados').DataTable().clear().destroy(false);
        $('#TabelaDados').empty();
        $("#TabelaDados tbody").empty();
        $("#TabelaDados thead").empty();
    }

    $('#TabelaDados').DataTable( {
        data: dataSetRestraints,
        columns: [
            { title: "Node" },
            { title: "fX ("+funits+")" },
            { title: "fY ("+funits+")" },
            { title: "fZ ("+funits+")" },
            { title: "mX ("+munits+")" },
            { title: "mY ("+munits+")" },
            { title: "mZ ("+munits+")" },
            { title: "Type" }
        ],
        "scrollY":    "275px",
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
    } );
    table = $('#TabelaDados').DataTable();
   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
      $('#TabelaDados tbody').on( 'click', 'tr', function () {

            table.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
              var data = table.row( this ).data();
              var JsonStringRet = JSON.stringify(data[0]);
            unityGame.SendMessage('JavaFuncoes', 'SelecionarSuporte', JsonStringRet);

    } );

    $('#button').click( function () {
        table.row('.selected').remove().draw( false );
    } );


}

var table1;
function CriarTabelaWRC(IdDt, CasoCarga){


    $('#TituloTabelaDadosLaterais').html("<b>Dados do Bocal</b>");

      arrFiltrada = [];
      var unidade = "";
      for(var i = 0; i < WRC297.length; i++)
      {

          if(WRC297[i].id == IdDt){

              arrFiltrada.push(WRC297[i]);
              break;
          }
      }


    var Unidades = Units[0];
    var dataSet = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
                dataSet.push(["<b>Numero do Nó</b>", Obj.nozzle_node]);
               dataSet.push(["<b>-</b>", "-"]);
                dataSet.push(['<b>Bocal</b>', "-"]);
                dataSet.push(["<b>Diâmetro Externo("+ Unidades.diameter +")</b>", Obj.noz_od]);
                dataSet.push(["<b>Espessura("+ Unidades.thickness +")</b>", Obj.noz_wt]);
                dataSet.push(["<b>-</b>", "-"]);
                dataSet.push(["<b>Equipamento</b>", "-"]);
                dataSet.push(["<b>Diâmetro Externo("+ Unidades.diameter +")</b>", Obj.ves_od]);
                dataSet.push(["<b>Espessura da Parede("+ Unidades.thickness +")</b>", Obj.ves_wt]);
                dataSet.push(["<b>Espessura Chapa de Reforço("+ Unidades.thickness +")</b>", Obj.ves_rpt]);



     }



     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Variável" },
            { title: "Valor" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
    table1 = $('#TabelaDadosLaterais').DataTable();
     $('#TabelaDadosLaterais tbody').on( 'click', 'tr', function () {

            table1.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');


    } );

    $('#button').click( function () {
        table1.row('.selected').remove().draw( false );
    } );





}
function CriarTabelaSIF(IdDt, CasoCarga){


    $('#TituloTabelaDadosLaterais').html("<b>Dados da Derivação</b>");

      arrFiltrada = [];
      var unidade = "";
      for(var i = 0; i < SifTees.length; i++)
      {

          if(SifTees[i].id == IdDt){

              arrFiltrada.push(SifTees[i]);
              break;
          }
      }


    var Unidades = Units[0];
    var dataSet = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
                dataSet.push(["<b>Nó da Derivação</b>", Obj.node]);
                var TipoSif = "";
                var EspParedeTubo = 0;
                 for(var j = 0; j < SifTeesTypes.length; j++){

                    if(SifTeesTypes[j].siftypeid == Obj.type)
                    {
                        TipoSif = SifTeesTypes[j].sif_tee_type;
                        break;
                    }
                 }

                 for(var j = 0; j < IbelData.length; j++){

                    if(IbelData[j].int_ptr == Obj.sif_ptr)
                    {
                        EspParedeTubo = IbelData[j].wall_thick;
                        break;
                    }
                 }
                 if(Obj.pad_thk > -1 && Math.round10(Obj.pad_thk,-3) > Math.round10(EspParedeTubo,-3))
                 {
                    TipoSif = "ReforcoAumentado";
                 }
               dataSet.push(["<b>Tipo da Derivação</b>", RetornaTipoReforco(TipoSif)]);
               if(Obj.pad_thk >= 0)
               {
                    dataSet.push(["<b>Espessura do Reforço("+ Unidades.thickness +")</b>", Math.round10(Obj.pad_thk, -3) ]);
               }
                  dataSet.push(["<b>Espessura do Tubo("+ Unidades.thickness +")</b>", Math.round10(EspParedeTubo, -3) ]);

     }



     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Variável" },
            { title: "Valor" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
    table1 = $('#TabelaDadosLaterais').DataTable();
     $('#TabelaDadosLaterais tbody').on( 'click', 'tr', function () {

            table1.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');


    } );

    $('#button').click( function () {
        table1.row('.selected').remove().draw( false );
    } );





}
function CriarTabelaHangers(IdDt, CasoCarga){

   // console.log(CasosDeCarga);
     var Ope2 = "";
    var Ope4 = "";
    var Hyd = "";
    $('#TituloTabelaDadosLaterais').html("<b>Dados do Suporte Mola</b>");
    for(var i = 0; i < CasosDeCarga.length; i++)
      {
            if(CasosDeCarga[i].includes("OPE"))
            {
                if(Ope2 == "")
                {
                    Ope2 = CasosDeCarga[i];
                }
                else
                {
                    Ope4 = CasosDeCarga[i];
                }
            }

             if(CasosDeCarga[i].includes("HYD"))
            {
                Hyd = CasosDeCarga[i];
            }

            if(Ope2 != "" && Ope4 != "" && Hyd != "")
            {
                break;
            }
      }

      arrFiltrada = [];
      var unidade = "";
      var OutputHanger;
      var Linha;
      for(var i = 0; i < InputHangers.length; i++)
      {

          if(InputHangers[i].id == IdDt){

              arrFiltrada.push(InputHangers[i]);
              for(var j = 0; j < OutputHangers.length; j++)
              {
                  if(OutputHangers[j].node == InputHangers[i].node)
                  {
                       OutputHanger =  OutputHangers[j];
                       break;
                  }
              }
               for(var j = 0; j < IbelData.length; j++)
              {
                  if(IbelData[j].hgr_ptr == InputHangers[i].hanger_ptr)
                  {
                       Linha = IbelData[j];
                       break;
                  }
              }
              break;
          }
      }
    //console.log(Ope2);
   // console.log(Ope4);
   // console.log(Hyd);
    //Prog Design VSH
    var CargaQuenteProjeto = "a";
    var CargaQuenteOperacao = "a";
    var CargaTesteHyd = "a";

      for(var j = 0; j < Restraints.length; j++)
      {
          if(Restraints[j].node == OutputHanger.node && Restraints[j].case == Hyd && Restraints[j].type == "Prog Design  VSH")
          {
               CargaTesteHyd = Math.abs(Restraints[j].fz);

          }
            if(Restraints[j].node == OutputHanger.node && Restraints[j].case == Ope2 && Restraints[j].type == "Prog Design  VSH")
          {
               CargaQuenteProjeto = Math.abs(Restraints[j].fz);

          }
            if(Restraints[j].node == OutputHanger.node && Restraints[j].case == Ope4 && Restraints[j].type == "Prog Design  VSH")
          {
               CargaQuenteOperacao = Math.abs(Restraints[j].fz);

          }
          if(CargaQuenteProjeto != "a" && CargaQuenteOperacao != "a" && CargaTesteHyd != "a")
          {
             break;
          }
      }
      var DesCnodeOpe2 = "a";
      var DesCnodeOpe4 = "a";
      var DesNodeOpe2 = "a";
      var DesNodeOpe4 = "a";

      var Node = OutputHanger.node;
      var Cnode = parseInt(arrFiltrada[0].cnode);
     // console.log("node: " + Node);
     // console.log("cnode: " + Cnode);
     for(var j = 0; j < Displacements.length; j++)
      {
          //  console.log(Displacements[j]);
            if(Displacements[j].node == Node && Displacements[j].case == Ope2)
            {
                DesNodeOpe2 = Displacements[j].dz;
            }
            if(Displacements[j].node == Node && Displacements[j].case == Ope4)
            {
                DesNodeOpe4 = Displacements[j].dz;
            }
            if(Displacements[j].node == Cnode && Displacements[j].case == Ope2)
            {
                DesCnodeOpe2 = Displacements[j].dz;
            }
            if(Displacements[j].node == Cnode && Displacements[j].case == Ope4)
            {
                DesCnodeOpe4 = Displacements[j].dz;
            }


            if(DesCnodeOpe2 != "a" && DesCnodeOpe4 != "a" && DesNodeOpe2 != "a" && DesNodeOpe4 != "a")
            {

                break;
            }
      }
   // console.log(DesNodeOpe2);
   // console.log(DesCnodeOpe2);
  //  console.log(DesNodeOpe4);
   // console.log(DesCnodeOpe4);
      var DispOpe2 = Math.abs(DesNodeOpe2 - DesCnodeOpe2);
      var DispOpe4 = Math.abs(DesNodeOpe4 - DesCnodeOpe4);



    var Unidades = Units[0];
    var dataSet = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];
                dataSet.push(["<b>Nó do Suporte Mola</b>", Obj.node]);

               dataSet.push(["<b>Espaço Disponível("+ Unidades.length +")</b>", Obj.avail_space]);
                dataSet.push(["<b>Nome da Linha</b>", Linha.line_no]);
                 dataSet.push(["<b>Diâmetro da linha("+ Unidades.diameter +")</b>", Linha.diameter]);
                 dataSet.push(["<b>Temperatura Projeto ("+ Unidades.temp +")</b>", Linha.temp_exp_c1]);
                 dataSet.push(["<b>Temperatura Operação ("+ Unidades.temp +")</b>", Linha.temp_exp_c2]);
                 dataSet.push(["<b>Espessura Isolamento ("+ Unidades.thickness +")</b>", Linha.insul_thick]);
                 dataSet.push(["<b>Carga à Frio em Z("+ Unidades.force +")</b>", Math.round10(OutputHanger.th_install_load,-2)]);
                 dataSet.push(["<b>Carga à Quente Projeto em Z ("+ Unidades.force +")</b>", Math.round10(CargaQuenteProjeto,-2)]); //OPE2 load em Z absoluto
                 dataSet.push(["<b>Carga à Quente Operação em Z("+ Unidades.force +")</b>", Math.round10(CargaQuenteOperacao,-2)]); //OPE4 load em Z absoluto
                 dataSet.push(["<b>Carga Teste Hidrostático em Z("+ Unidades.force +")</b>", Math.round10(CargaTesteHyd,-2)]); //HYD carga em FZ Absoluto
                 dataSet.push(["<b>Movimentação Vertical Projeto ("+ Unidades.length +")</b>", Math.round10(DispOpe2, -2)]); //Diferenca deslocamento Z entre Cnode e Node, absoluto Ope2
                 dataSet.push(["<b>Movimentação Vertical Operação ("+ Unidades.length +")</b>", Math.round10(DispOpe4, -2)]); //Diferenca deslocamento Z entre Cnode e Node, absoluto Ope4
                //dataSet.push(["<b>Movimentação Vertical("+ OutputHanger.movement_units +")</b>", Math.round10(OutputHanger.vert_movement,-2)]);
                dataSet.push(["<b>Movimentação Axial("+ OutputHanger.movement_units +")</b>", Math.round10(OutputHanger.hor_movement_axial,-2)]);
                dataSet.push(["<b>Movimentação Lateral("+ OutputHanger.movement_units +")</b>", Math.round10(OutputHanger.hor_movement_lateral,-2)]);
                dataSet.push(["<b>Taxa da Mola/Spring Rate("+ OutputHanger.spring_units +")</b>", Math.round10(OutputHanger.spring_rate,-2)]);
                dataSet.push(["<b>Fabricante do Suporte</b>", OutputHanger.manuf]);
                dataSet.push(["<b>Modelo do Suporte</b>", OutputHanger.size]);


     }



     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Variável" },
            { title: "Valor" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
    table1 = $('#TabelaDadosLaterais').DataTable();
     $('#TabelaDadosLaterais tbody').on( 'click', 'tr', function () {

            table1.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');


    } );

    $('#button').click( function () {
        table1.row('.selected').remove().draw( false );
    } );





}

function colorToHex(color) {
    // Convert any CSS color to a hex representation
    // Examples:
    // colorToHex('red')            # '#ff0000'
    // colorToHex('rgb(255, 0, 0)') # '#ff0000'
    var rgba, hex;
    rgba = colorToRGBA(color);
    hex = [0,1,2].map(
        function(idx) { return byteToHex(rgba[idx]); }
        ).join('');
    return "#" + hex;
}
function colorToRGBA(color) {
    // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
    // color must be a valid canvas fillStyle. This will cover most anything
    // you'd want to use.
    // Examples:
    // colorToRGBA('red')  # [255, 0, 0, 255]
    // colorToRGBA('#f00') # [255, 0, 0, 255]
    var cvs, ctx;
    cvs = document.createElement('canvas');
    cvs.height = 1;
    cvs.width = 1;
    ctx = cvs.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    return ctx.getImageData(0, 0, 1, 1).data;
}

function byteToHex(num) {
    // Turns a number (0-255) into a 2-character hex number (00-ff)
    return ('0'+num.toString(16)).slice(-2);
}
function AtualizarCorElemento(picker, IDCor) {
     for(var i = 0; i < Cores.length; i++)
     {
       if(Cores[i].id == IDCor)
       {
       Cores[i].CorDaLinha = picker.toRGBString();
       Cores[i].RGBA = picker.toRGBAString();
       unityGame.SendMessage('JavaFuncoes', 'MudarCor', Cores[i].NomeDaLinha+"¶"+picker.channel('R')+"¶"+picker.channel('G')+"¶"+picker.channel('B'));
       }
     }
    //document.querySelector(selector).style.background = picker.toBackground();

}
function CriarTabelaCores(){


    $('#TituloTabelaDadosLaterais').html("<b>Cores das Linhas</b>");

    var dataSet = [];
     for(var i = 0; i < Cores.length; i++){

        var ColorHex = colorToHex(Cores[i].CorDaLinha);
        var NomeLinha = Cores[i].NomeDaLinha;
        var IDCor = Cores[i].id;
        var JSColorConf = `data-jscolor='{value: \'${ColorHex}\', onChange: AtualizarCorElemento(this.jscolor, ` + IDCor + `)}'`;
        htmlButton = "<button " + JSColorConf + "></button>";

        var Html2 = `<input class="jscolor" onChange="AtualizarCorElemento(this.jscolor, ${IDCor})" id="btnPicker${i}" value="${ColorHex}" style="width:20px" data-jscolor="{value: \'${ColorHex}\'}">`

        dataSet.push([Html2, Cores[i].NomeDaLinha]);

     }



     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Cor" },
            { title: "Nome da Linha" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

 for(var i = 0; i < Cores.length; i++){
//document.getElementById('btnPicker'+i).addEventListener('change', function(e){AtualizarCorElemento(this.jscolor, Cores[i].NomeDaLinha);})
}
jscolor.presets.default = {
	previewPadding: 0,               // make the picker a little narrower
	previewSize: 42,          // make the color preview bigger

};

jscolor.trigger('input change');
    jscolor.install();


}
function AdicionarCorNaLista(NomeLinha, R, G, B){
            var color = "rgb(" + Math.floor(R) + "," + Math.floor(G) + "," + Math.floor(B) + ")";
              var colorA = "rgba(" + Math.floor(R) + "," + Math.floor(G) + "," + Math.floor(B) + ",1)";
            Cores.push({ id: Cores.length, NomeDaLinha : NomeLinha, CorDaLinha : color, RGBA: colorA});

}
function CriarTabelaIbelData(IdDt, CasoCarga){


    $('#TituloTabelaDadosLaterais').html("<b>Dados da Barra Selecionada</b>");
      var ExpJoint;
      arrFiltrada = [];
      var unidade = "";
      for(var i = 0; i < IbelData.length; i++)
      {

          if(IbelData[i].id == IdDt){
              arrFiltrada.push(IbelData[i]);
              if(IbelData[i].expj_ptr > 0)
              {
                    for(var j = 0; j < ExpansionJoints.length; j++)
                  {
                        if(ExpansionJoints[j].expjt_ptr == IbelData[i].expj_ptr)
                        {
                            ExpJoint = ExpansionJoints[j];
                            break;
                        }
                  }
              }
              break;
          }
      }


      var DeslocamentoNoFrom;
      var DeslocamentoNoTo;

      for(var i=0; i< Displacements.length; i++)
      {
            if(Displacements[i].node == arrFiltrada[0].to_node && Displacements[i].case == CasoCarga)
            {
                DeslocamentoNoTo = Displacements[i];
            }

            if(Displacements[i].node == arrFiltrada[0].from_node && Displacements[i].case == CasoCarga)
            {
                DeslocamentoNoFrom = Displacements[i];
            }
      }

    var Unidades = Units[0];
    var dataSet = [];
     for(var i = 0; i < arrFiltrada.length; i++){
            var Obj = arrFiltrada[i];

               if(Obj.from_node_name == ""){
                   dataSet.push(["<b>Nó de Origem</b>", Obj.from_node]);
               }
               else{
                   dataSet.push(["<b>Nó de Origem</b>", Obj.from_node + " ("+Obj.from_node_name+")" ]);
               }

                if(Obj.to_node_name == ""){
                  dataSet.push(["<b>Nó de Destino</b>", Obj.to_node]);
               }
               else{
                    dataSet.push(["<b>Nó de Destino</b>", Obj.to_node + " ("+Obj.to_node_name+")"]);
               }

               dataSet.push(["<b>Deltas(X,Y,Z)("+ Unidades.length +")</b>", "("+Obj.delta_x+", "+Obj.delta_y+", "+Obj.delta_z+")"]);
               dataSet.push(["<b>Comprimento("+ Unidades.length +")</b>", Math.round10(Math.sqrt(Math.pow(Obj.delta_x,2)+Math.pow(Obj.delta_y,2)+Math.pow(Obj.delta_z,2)),-1)]);
               dataSet.push(["<b>Linha</b>", Obj.line_no]);
               dataSet.push(["<b>Diâmetro("+ Unidades.diameter +")</b>", Obj.diameter]);
               dataSet.push(["<b>Espessura da parede("+ Unidades.thickness +")</b>", Obj.wall_thick]);
               dataSet.push(["<b>Material</b>", Obj.material_name]);
               dataSet.push(["<b>Temperatura Projeto("+ Unidades.temp +")</b>", Obj.temp_exp_c1]);
               dataSet.push(["<b>Temperatura Operação("+ Unidades.temp +")</b>", Obj.temp_exp_c2]);
               dataSet.push(["<b>Pressão Projeto("+ Unidades.pressure +")</b>", Obj.pressure1]);
               dataSet.push(["<b>Pressão Operação("+ Unidades.pressure +")</b>", Obj.pressure2]);
               dataSet.push(["<b>Pressão Teste Hidrostático("+ Unidades.pressure +")</b>", Obj.hydro_pressure]);
               dataSet.push(["<b>Espessura do Isolamento Térmico("+ Unidades.thickness +")</b>", Obj.insul_thick]);
               dataSet.push(["<b>Densidade do fluido("+ Unidades.fluid_density +")</b>", Obj.fluid_density]);
                dataSet.push(["<b>-</b>", " - "]);
               dataSet.push(["<b>Deslocamentos dos nós:</b>", " - "]);
               dataSet.push(["<b>Caso de carga</b>", CasoCarga]);
               dataSet.push(["<b>Nó de Origem(X,Y,Z)("+ Unidades.length +")</b>", "("+Math.round10(DeslocamentoNoFrom.dx,-2)+", "+Math.round10(DeslocamentoNoFrom.dy,-2)+", "+Math.round10(DeslocamentoNoFrom.dz,-2)+")"]);
               dataSet.push(["<b>Nó de Destino(X,Y,Z)("+ Unidades.length +")</b>", "("+Math.round10(DeslocamentoNoTo.dx,-2)+", "+Math.round10(DeslocamentoNoTo.dy,-2)+", "+Math.round10(DeslocamentoNoTo.dz,-2)+")"]);
               if(ExpJoint != null)
               {
                dataSet.push(["<b>-</b>", " - "]);
                  dataSet.push(["<b>Dados da Junta de Expansão:</b>", " - "]);
                  if(ExpJoint.axial_stif < 0)
                  {
                       dataSet.push(["<b>Rigidez Axial("+ Unidades.trans +")</b>", "(Em Branco)"]);
                  }
                  else
                  {
                    dataSet.push(["<b>Rigidez Axial("+ Unidades.trans +")</b>", Math.round10(ExpJoint.axial_stif, -2)]);
                  }

                  if(ExpJoint.trans_stif < 0)
                  {
                       dataSet.push(["<b>Rigidez Transversal("+ Unidades.trans +")</b>", "(Em Branco)"]);
                  }
                  else
                  {
                    dataSet.push(["<b>Rigidez Transversal("+ Unidades.trans +")</b>", Math.round10(ExpJoint.trans_stif, -2)]);
                  }

                   if(ExpJoint.bend_stif < 0)
                  {
                       dataSet.push(["<b>Rigidez de Flexão("+ Unidades.rot_stiff +")</b>", "(Em Branco)"]);
                  }
                  else
                  {
                    dataSet.push(["<b>Rigidez de Flexão("+ Unidades.rot_stiff +")</b>", Math.round10(ExpJoint.bend_stif, -2)]);
                  }

                   if(ExpJoint.tors_stif < 0)
                  {
                       dataSet.push(["<b>Rigidez à Torção("+ Unidades.rot_stiff +")</b>", "(Em Branco)"]);
                  }
                  else
                  {
                    dataSet.push(["<b>Rigidez à Torção("+ Unidades.rot_stiff +")</b>", Math.round10(ExpJoint.tors_stif, -2)]);
                  }

                   if(ExpJoint.bel_dia < 0)
                  {
                       dataSet.push(["<b>Diâmetro Efetivo Dentro do Fole("+ Unidades.diameter +")</b>", "(Em Branco)"]);
                  }
                  else
                  {
                    dataSet.push(["<b>Diâmetro Efetivo Dentro do Fole("+ Unidades.diameter +")</b>", Math.round10(ExpJoint.bel_dia, -2)]);
                  }

               }


        }



     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Variável" },
            { title: "Valor" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
    table1 = $('#TabelaDadosLaterais').DataTable();
     $('#TabelaDadosLaterais tbody').on( 'click', 'tr', function () {

            table1.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');


    } );

    $('#button').click( function () {
        table1.row('.selected').remove().draw( false );
    } );





}

function RetornaTipoRestrição(ID){
    var NomeCorreto = "";
     for(var i = 0; i < RestraintTypes.length; i++)
      {
          if(RestraintTypes[i].res_typeid == ID){
              NomeCorreto = RestraintTypes[i].res_type;
               break;
          }
      }

    switch (NomeCorreto) {
  case 'ANC':
   return("Ancoragem");
    break;
 case 'X':
   return("Restrição em X 2D");
    break;
 case 'Y':
   return("Restrição em Y 2D");
    break;
 case 'Z':
   return("Apoio 2D");
    break;
 case 'RX':
   return("Restrição de Rotação sobre o eixo X");
    break;
 case 'RY':
   return("Restrição de Rotação sobre o eixo Y");
    break;
 case 'RZ':
   return("Restrição de Rotação sobre o eixo Z");
    break;
 case 'GUI':
   return("Guia");
    break;
 case 'LIM':
   return("Limite, Trava ou Batente");
    break;
  case '+X':
   return("Restrição em X somente de um lado");
    break;
  case '+Y':
   return("Restrição em Y somente de um lado");
    break;
  case '+Z':
   return("Apoio");
    break;
  case '-X':
   return("Restrição em X somente de um lado");
    break;
  case '-Y':
   return("Restrição em Y somente de um lado");
    break;
  case '-Z':
   return("Restrição em -Z(Hold Down)");
    break;
  case '+LIM':
   return("Batente somente em um lado");
    break;
  case '-LIM':
   return("Batente somente em um lado");
    break;
  default:
    return("Não identificado, solicitar implantação");
    }
}

function RetornaTipoReforco(Tipo){

    switch (Tipo) {
      case 'ReforcoAumentado':
       return("Boca de Lobo Com Reforço Aumentado");
        break;
     case 'Reinforced':
       return("Boca de Lobo Com Reforço");
        break;
     case 'Welding':
       return("Tee");
        break;
     case 'Unreinforced':
       return("Sem Chapa de Reforço");
        break;
     case 'Weldolet':
       return("Luva ou Colar");
        break;
      default:
        return(Tipo);
    }
}

function CriarTabelaLateralRestraints(Node, CasoCarga){


    $('#TituloTabelaDadosLaterais').html("<b>Dados do Suporte Selecionado</b>");
     //   alert(IdDt);
      arrFiltrada = [];
      var unidadeF = "";
      var unidadeN = "";
      var NodeRest = "";


      for(var i = 0; i < RestraintsSummary.length; i++)
      {
          if(RestraintsSummary[i].node == Node)// && RestraintsSummary[i].case.toLowerCase().indexOf("(exp)")===-1)
          {
              arrFiltrada.push(RestraintsSummary[i]);

          }
      }


      var SuportesInput = [];
      for(var i = 0; i < InputRestraints.length; i++)
      {
          if(InputRestraints[i].node_num == Node){
              SuportesInput.push(InputRestraints[i]);

          }
      }



    var MaiorFX = { CasoCarga: " ", F: 0 };
    var MaiorFY = { CasoCarga: " ", F: 0 };
    var MaiorFZ = { CasoCarga: " ", F: 0 };
    var MaiorMX = { CasoCarga: " ", M: 0 };
    var MaiorMY = { CasoCarga: " ", M: 0 };
    var MaiorMZ = { CasoCarga: " ", M: 0 };

     for(var i = 0; i < arrFiltrada.length; i++){

           if(Math.abs(arrFiltrada[i].fx) > Math.abs(MaiorFX.F))
           {
              MaiorFX = { CasoCarga: arrFiltrada[i].case, F: arrFiltrada[i].fx };
           }
           if(Math.abs(arrFiltrada[i].fy) > Math.abs(MaiorFY.F))
           {
              MaiorFY = { CasoCarga: arrFiltrada[i].case, F: arrFiltrada[i].fy };
           }
           if(Math.abs(arrFiltrada[i].fz) > Math.abs(MaiorFZ.F))
           {
              MaiorFZ = { CasoCarga: arrFiltrada[i].case, F: arrFiltrada[i].fz };
           }
           if(Math.abs(arrFiltrada[i].mx) > Math.abs(MaiorMX.M))
           {
              MaiorMX = { CasoCarga: arrFiltrada[i].case, M: arrFiltrada[i].mx };
           }
            if(Math.abs(arrFiltrada[i].my) > Math.abs(MaiorMY.M))
           {
              MaiorMY = { CasoCarga: arrFiltrada[i].case, M: arrFiltrada[i].my };
           }
            if(Math.abs(arrFiltrada[i].mz) > Math.abs(MaiorMZ.M))
           {
              MaiorMZ = { CasoCarga: arrFiltrada[i].case, M: arrFiltrada[i].mz };
           }
     }

    var Unidades = Units[0];
    var dataSet = [];
     for(var i = 0; i < arrFiltrada.length; i++){
        if(arrFiltrada[i].case == CasoCarga)
        {
               var Obj = arrFiltrada[i];


               if(Obj.node_name == ""){
                   dataSet.push(["<b>Dados para o suporte do nó</b>", Obj.node]);
               }
               else{
                   dataSet.push(["<b>Dados para o suporte do nó</b>", Obj.node + " ("+Obj.node_name+")" ]);
               }
               dataSet.push(["<b>Tipos de suporte</b>", "(" + SuportesInput.length + ")"])
               for(var j = 0; j < SuportesInput.length; j++){
                        var Suporte = SuportesInput[j];

                 //   dataSet.push(["Restrição Número", j+1]);
                  //  dataSet.push(["Tipo", RetornaTipoRestrição(Suporte.res_typeid)]);

                    var DadosSuporteStr = "a)" + RetornaTipoRestrição(Suporte.res_typeid);

                    if(Suporte.fric_coef < 0)
                    {
                        //dataSet.push(["Coeficiente de Fricção", "(Em branco)"]);
                        DadosSuporteStr += "<br>b)(Em Branco)";
                    }
                    else
                    {
                        //dataSet.push(["Coeficiente de Fricção", Math.round10(Suporte.fric_coef, -2)]);
                         DadosSuporteStr += "<br>b)" + Math.round10(Suporte.fric_coef, -2);
                    }

                     if(Suporte.gap < 0)
                    {
                        //dataSet.push(["GAP("+ Unidades.length +")", "(Em branco)"]);
                        DadosSuporteStr+= "<br>c)(Em Branco)";
                    }
                    else
                    {
                        //dataSet.push(["GAP("+ Unidades.length +")", Math.round10(Suporte.gap, -2)]);
                        DadosSuporteStr+= "<br>c)" + Math.round10(Suporte.gap, -2);
                    }

                      if(Suporte.stiffness < 0)
                    {
                       // dataSet.push(["Rigidez("+ Unidades.trans + "-" + Unidades.rot_stiff +")", "(Em branco)"]);
                        DadosSuporteStr+= "<br>d)(Em Branco)";
                    }
                    else
                    {
                     //   dataSet.push(["Rigidez("+ Unidades.trans + "-" + Unidades.rot_stiff +")", Math.round10(Suporte.stiffness, -2)]);
                        DadosSuporteStr+= "<br>d)" + Math.round10(Suporte.stiffness, -2);
                    }
                    dataSet.push(["<b>Tipo(a)<br>Coef. Fricção(b)<br>GAP(c)("+ Unidades.length +")<br>Rigidez(d)</b>", DadosSuporteStr]);

               }
                dataSet.push(["<b>Unidade da Rigidez</b>", "("+ Unidades.trans + "-" + Unidades.rot_stiff +")"]);
                 dataSet.push([" - ", " - "]);
               dataSet.push(["<b>Cargas Caso Selecionado</b>", CasoCarga.replace("CASE", "")]);
               dataSet.push(["<b>FX("+arrFiltrada[i].funits+")</b>", Math.round10(arrFiltrada[i].fx,-2)]);
               dataSet.push(["<b>FY("+arrFiltrada[i].funits+")</b>", Math.round10(arrFiltrada[i].fy,-2)]);
               dataSet.push(["<b>FZ("+arrFiltrada[i].funits+")</b>", Math.round10(arrFiltrada[i].fz,-2)]);
               dataSet.push(["<b>MX("+arrFiltrada[i].munits+")</b>", Math.round10(arrFiltrada[i].mx,-2)]);
               dataSet.push(["<b>MY("+arrFiltrada[i].munits+")</b>", Math.round10(arrFiltrada[i].my,-2)]);
               dataSet.push(["<b>MZ("+arrFiltrada[i].munits+")</b>", Math.round10(arrFiltrada[i].mz,-2)]);
               dataSet.push([" - ", " - "]);
               dataSet.push(["<b>MaioresCargas</b>", " - "]);
               dataSet.push(["<b>FX("+arrFiltrada[i].funits+")(" + MaiorFX.CasoCarga.substring(0,MaiorFX.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorFX.F,-2)]);
               dataSet.push(["<b>FY("+arrFiltrada[i].funits+")(" + MaiorFY.CasoCarga.substring(0,MaiorFY.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorFY.F,-2)]);
               dataSet.push(["<b>FZ("+arrFiltrada[i].funits+")(" + MaiorFZ.CasoCarga.substring(0,MaiorFZ.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorFZ.F,-2)]);
               dataSet.push(["<b>MX("+arrFiltrada[i].munits+")(" + MaiorMX.CasoCarga.substring(0,MaiorMX.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorMX.M,-2)]);
               dataSet.push(["<b>MY("+arrFiltrada[i].munits+")(" + MaiorMY.CasoCarga.substring(0,MaiorMY.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorMY.M,-2)]);
               dataSet.push(["<b>MZ("+arrFiltrada[i].munits+")(" + MaiorMZ.CasoCarga.substring(0,MaiorMZ.CasoCarga.indexOf("(")-1)+")</b>", Math.round10(MaiorMZ.M,-2)]);


        }
     }




     if($( "#TabelaDadosLaterais" ).html() != "")
    {
       $('#TabelaDadosLaterais').DataTable().clear().destroy(false);
       $('#TabelaDadosLaterais').empty();
        $("#TabelaDadosLaterais tbody").empty();
        $("#TabelaDadosLaterais thead").empty();
    }

    $('#TabelaDadosLaterais').DataTable( {
        data: dataSet,
        columns: [
            { title: "Variável" },
            { title: "Valor" }
        ],
        "scrollY":    false,
        "scrollCollapse": true,
        "paging":         false,
         "info":     false,
         "bFilter": false,
         "ordering": false,
    } );

   /*  $('#TabelaDados tbody').on('click', 'tr', function () {
        var data = table.row( this ).data();
        console.log("selecionar elemento " + data[0]);

    } );*/
    table1 = $('#TabelaDadosLaterais').DataTable();
     $('#TabelaDadosLaterais tbody').on( 'click', 'tr', function () {

            table1.$('tr.selected').removeClass('selected');
            $(this).removeClass('selected');
            $(this).addClass('selected');


    } );

    $('#button').click( function () {
        table1.row('.selected').remove().draw( false );
    } );





}


function InicializarCarets()
{
    var toggler = document.getElementsByClassName("caret");
    var i;

    for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function() {
        this.parentElement.querySelector(".nested").classList.toggle("active");
        this.classList.toggle("caret-down");
      });
    }
}
function RetornaStresses(OS, Sistema, Rev){
var StressesTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputStresses/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            StressesTemp.push(Sist);

        })
      //  console.log(StressesTemp);

    };
    request.send();
    return StressesTemp;
}

function RetornaDisplacements(OS, Sistema, Rev){
var DisplacementsTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputDisplacements/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DisplacementsTemp.push(Sist);
            if(CheckSeCasoCargaExiste(Sist.case) == false)
            {
                CasosDeCarga.push(Sist.case);
            }


        })
       // console.log(DisplacementsTemp);

    };
    request.send();
    return DisplacementsTemp;
}

function RetornaInputHangers(OS, Sistema, Rev){
var TableTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarInputHangers/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {

            TableTemp.push(Sist);

        })

    };
    request.send();
    return TableTemp;
}
function RetornaOutputHangers(OS, Sistema, Rev){
var TableTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputHangers/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            TableTemp.push(Sist);

        })
       // console.log(DisplacementsTemp);

    };
    request.send();
    return TableTemp;
}

function RetornaRestraints(OS, Sistema, Rev){
var RestraintsTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputRestraints/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
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

function RetornaAdmissiveisSuporte(){
var RestraintsTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarAdmissiveisMaximos/', true);
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

function RetornaRestraintsSummary(OS, Sistema, Rev){
var RestraintsTemp = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarOutputRestraintsSummary/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
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

function RetornaIbelData(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarIbelData/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaRigids(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarRigids/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaWRC297(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarWRC297/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaSifTees(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarSifTees/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaSifTeesTypes(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarSifTeesTypes/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaUnits(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarUnits/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaInputRestraints(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarInputRestraints/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })
        // console.log(RestraintsTemp);

    };
    request.send();
    return DataReturn;
}

function RetornaRestraintTypes(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarRestraintTypes/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);

        })


    };
    request.send();
    return DataReturn;
}

function RetornaExpansionJoints(OS, Sistema, Rev){
var DataReturn = []
  var request = new XMLHttpRequest();
    request.open('GET', '/app/flexibilidade/PesquisarSistemas/RetornarEXPJoint/?os='+OS+'&sistema='+Sistema+'&revisao='+Rev, true);
    request.onload = function () {
        var data = JSON.parse(this.response)
            data.forEach((Sist) => {
            DataReturn.push(Sist);
        })
        // console.log(RestraintsTemp);
    };
    request.send();
    return DataReturn;
}

if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    'use strict';
    if (typeof start !== 'number') {
      start = 0;
    }

    if (start + search.length > this.length) {
      return false;
    } else {
      return this.indexOf(search, start) !== -1;
    }
  };
}

function ConstruirDadosBarra(IDBarra, Caso){
   CriarTabelaIbelData(IDBarra, Caso);

};
function ConstruirDadosRestraint(IDRest, Caso){
    CriarTabelaLateralRestraints(IDRest, Caso);

};
function ConstruirDadosWRC(IDWRC, Caso){
   CriarTabelaWRC(IDWRC, Caso);

};
function ConstruirDadosSIFTEE(SifTee, Caso){
  CriarTabelaSIF(SifTee, Caso);

};
function ConstruirDadosHanger(Hanger, Caso){
    //console.log("ID: " + Hanger);
    CriarTabelaHangers(Hanger, Caso);

};
function ConstuirTabelaCores(){
    //console.log("ID: " + Hanger);
    CriarTabelaCores();

};

(function() {
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
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();
function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        /* next line works with strings and numbers,
         * and you may want to customize it to your needs
         */
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}


