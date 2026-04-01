  document.getElementById("loader").style.display = "none";
var QuantidadeAtividades;
var Contagem = 0;
var TiposDocumentos = []
var Atividades = []
var Estudos = []
var Calculos = []
var Modelos = []
var Documentos = []
var StatusEstudo = []
var StatusCalculo = []
var StatusModelo = []
var StatusDocumento = []
var Verificacoes = []
var StatusVerificacoes = []
var Disciplinas = []
var Finalidades = []
var ItensIntegracoes = []
var StatusAtividades = []
var StatusEmissao = []
$( document ).ready(async function() {
    document.getElementById("loader").style.display = "block";

    TiposDocumentos = await RetornaTiposDocumentos();
    StatusEstudo = await RetornaStatusEstudos();
    StatusEmissao = await RetornaStatusEmissao();
    StatusModelo = await RetornaStatusModelo();
    StatusCalculo = await RetornaStatusCalculo();
    StatusDocumento = await RetornaStatusDocumento();
    Disciplinas = await RetornaDisciplinas();
    Finalidades = await RetornaTiposDocumentosFinalidade();
    StatusVerificacoes = await RetornaStatusVerificacoes();

    var OSSelecionada = $('#SelectOS').children("option:selected").val();
    CarregarTabela(OSSelecionada);

});
function ExcluirAtividade()
{
     var TextoConfirmacao = $("#TextoConfirmacao").val()

    if(TextoConfirmacao.trim() == "Excluir Atividades")
    {
        var IDS = []
        $("#ErroConfirmacao").html("");
        $("#loaderExcluirAtividade").show();
         var table = document.getElementById("TabelaAtividades");
            for (let row of table.rows)
            {
                if(row.rowIndex > 0) //para evitar o header
                {
                    if(row.cells[12].firstChild )
                    {
                       var par = row.cells[12].firstChild;
                       IDS.push(par.innerHTML)
                    }

                }
            }
            Contagem = 0;
            QuantidadeAtividades = IDS.length
            for(var i = 0; i < IDS.length; i++)
            {
                  $.ajax({
                    url : "/app/civil/RemoverAtividade/"+IDS[i]+"/", // the endpoint
                    type : "POST", // http method
                    data : { }, // data sent with the post request

                    // handle a successful response
                    success : function(json) {
                        AtualizarProgress();

                    },

                    // handle a non-successful response
                    error : function(xhr,errmsg,err) {

                    }
                });
            }
            $("#TextoConfirmacao").val("")
            $("#loaderExcluirAtividade").hide();
     }
     else
     {
        $("#ErroConfirmacao").html(`<div class="alert alert-danger" role="alert">
          Texto de Confirmação Inválido!
            </div>`);
     }



}
function ExportarAtividades()
{

        var IDS = []
        $("#loaderExportarAtividade").show();
         var table = document.getElementById("TabelaAtividades");
            for (let row of table.rows)
            {
                if(row.rowIndex > 0) //para evitar o header
                {
                    if(row.cells[12].firstChild )
                    {
                       var par = row.cells[12].firstChild;
                       IDS.push(par.innerHTML)
                    }

                }
            }


              $.ajax({
                url : "/app/civil/ExportarAtividades/", // the endpoint
                type : "POST", // http method
                dataType : "json",
                data : { "Atividades":JSON.stringify(IDS) }, // data sent with the post request

                // handle a successful response
                success : function(json) {
                   $("#loaderExportarAtividade").hide();
                    var NomeArquivo = json["NomeArquivo"]
                    window.open("/app/civil/DownloadReport/"+NomeArquivo, '_blank').focus();
                },

                // handle a non-successful response
                error : function(xhr,errmsg,err) {

                }
            });





}
function AtualizarProgress()
{
    Contagem++;
    var DadosPorc = Math.round10(Contagem*100/QuantidadeAtividades,0);
    var Color = "";
    if(DadosPorc < 25) Color = "bg-danger";
    else if(DadosPorc < 50) Color = "bg-warning";
    else if(DadosPorc < 75) Color="bg-info"
    else Color = "bg-success";
    var HTML = `<div class="progress">
  <div class="progress-bar progress-bar-striped progress-bar-animated ${Color}" role="progressbar" aria-valuenow="${DadosPorc}" aria-valuemin="0" aria-valuemax="100" style="width: ${DadosPorc}%">${DadosPorc}%</div>
</div>`;
$("#progressExcluir").html(HTML);

    if(DadosPorc == 100)
    {

         $("#ExcluirAtividadeModal").modal('hide');
         $("#progressExcluir").html("");
         CarregarTabela($('#SelectOS').children("option:selected").val());

    }

}
$('#SelectOS').on('change', function (e) {
    var optionSelected = $("option:selected", this);
    var valueSelected = this.value;
    CarregarTabela(valueSelected);
});

var table;
async function CarregarTabela(OS){

    $("#BotaoExcluir").hide();
    $("#BotaoExportar").hide();
    document.getElementById("SelectOS").setAttribute("disabled", "disabled");
  document.getElementById("loader").style.display = "block";
    if($( "#TabelaAtividades" ).html() != "")
    {
       $('#TabelaAtividades').DataTable().clear().destroy(false);
       $('#TabelaAtividades').empty();
        $("#TabelaAtividades tbody").empty();
        $("#TabelaAtividades thead").empty();
    }
   await CriarTabelaAtividades(OS);
 document.getElementById("SelectOS").removeAttribute("disabled");
  document.getElementById("loader").style.display = "none";

}

function RetornarProgressoAtividade(Atividade){
    var EstudoMaisAtual;
    var CalculoMaisAtual;
    var ModeloMaisAtual;
    var DocumentoMaisAtual;

    var IntegracoesAtividade = []
    var IntegracoesAtividadeAprovadas = []

     for(var i = 0; i < ItensIntegracoes.length; i++){
                if(ItensIntegracoes[i].Atividade == Atividade.id)
                {
                   IntegracoesAtividade.push(ItensIntegracoes[i]);
                   if(ItensIntegracoes[i].StatusIntegracao == 1)
                   {
                       IntegracoesAtividadeAprovadas.push(ItensIntegracoes[i]);
                   }
                }
            }

     for(var i = 0; i < Estudos.length; i++){
            if(Estudos[i].Atividade == Atividade.id)
            {
               if(EstudoMaisAtual)
               {
                    if(EstudoMaisAtual.DataCadastro < Estudos[i].DataCadastro)
                    {
                        EstudoMaisAtual = Estudos[i];
                    }
               }
               else
               {
                    EstudoMaisAtual = Estudos[i];
               }
            }
        }
        
        for(var i = 0; i < Calculos.length; i++){
            if(Calculos[i].Atividade == Atividade.id)
            {
               if(CalculoMaisAtual)
               {
                    if(CalculoMaisAtual.DataCadastro < Calculos[i].DataCadastro)
                    {
                        CalculoMaisAtual = Calculos[i];
                    }
               }
               else
               {
                    CalculoMaisAtual = Calculos[i];
               }
            }
        }

        for(var i = 0; i < Modelos.length; i++){
            if(Modelos[i].Atividade == Atividade.id)
            {
               if(ModeloMaisAtual)
               {
                    if(ModeloMaisAtual.DataCadastro < Modelos[i].DataCadastro)
                    {
                        ModeloMaisAtual = Modelos[i];
                    }
               }
               else
               {
                    ModeloMaisAtual = Modelos[i];
               }
            }
        }

         for(var i = 0; i < Documentos.length; i++){
            if(Documentos[i].Atividade == Atividade.id)
            {
               if(DocumentoMaisAtual)
               {
                    if(DocumentoMaisAtual.DataCadastro < Documentos[i].DataCadastro)
                    {
                        DocumentoMaisAtual = Documentos[i];
                    }
               }
               else
               {
                    DocumentoMaisAtual = Documentos[i];
               }
            }
        }
   // console.log(EstudoMaisAtual)
   // console.log(CalculoMaisAtual)
   // console.log(ModeloMaisAtual)
   // console.log(DocumentoMaisAtual)
     var QtdEtapas = 0;
     var ProgressoTotal = 0;

     if(EstudoMaisAtual)
     {
        ProgressoTotal += RetornaProgressoEstudo(EstudoMaisAtual);
    //    console.log("Estudo " + ProgressoTotal);
        QtdEtapas++;
     }
      if(CalculoMaisAtual)
     {
        ProgressoTotal+= RetornaProgressoCalculo(CalculoMaisAtual);
    //    console.log("Calculo " + ProgressoTotal);
        QtdEtapas++;
     }

       if(ModeloMaisAtual)
     {
        ProgressoTotal+= RetornaProgressoModelo(ModeloMaisAtual);
     //   console.log("Modelo " + ProgressoTotal);
        QtdEtapas+=2;//dois pq modelo tem verificação
     }

     if(DocumentoMaisAtual)
     {
        ProgressoTotal+= RetornaProgressoDocumento(DocumentoMaisAtual);
    //    console.log("Documento " + ProgressoTotal);
        QtdEtapas+=2;//dois pq documento tem verificação
     }
      var SttEmissao;
        for(var n = 0; n < StatusEmissao.length; n++)
        {
            if(StatusEmissao[n].id == Atividade.StatusEmissao)
            {
                SttEmissao = StatusEmissao[n];
                break;
            }
        }
     var ProgressoIntegracao = (IntegracoesAtividadeAprovadas.length / IntegracoesAtividade.length);
     if(IntegracoesAtividade.length == 0) ProgressoIntegracao = 0;
    ProgressoTotal+= ProgressoIntegracao ;
     var TotalEtapas = QtdEtapas + 1; //Por causa da etapa de integração
     TotalEtapas += 1; //1 para emissão
     ProgressoTotal += parseFloat(SttEmissao.Progresso)
     //Ao finar somar etapa emissão que é 10% do total;
        var ValorRetornar = Math.round10(ProgressoTotal / TotalEtapas * 100, -2);
        var CorProgresso = "";


        if(ValorRetornar < 25) CorProgresso = "bg-danger"; //vermelho
        else if(ValorRetornar < 50) CorProgresso = "bg-warning" //Amarelo
        else if(ValorRetornar < 75) CorProgresso = "bg-info" //Verde musgo
        else if(ValorRetornar < 99.9) CorProgresso = "" //Azul
        else CorProgresso = "bg-success" //Verde

        var HTML = `<div class="progress" style="margin-bottom: 0px">
                      <div class="progress-bar progress-bar-striped progress-bar-animated ${CorProgresso}" role="progressbar" aria-valuenow="${ValorRetornar}" aria-valuemin="0" aria-valuemax="100" style="width: ${ValorRetornar}%;"></div>
                         <div class="progress-bar-title" style="position: absolute; top: 50%; -ms-transform: translateY(-50%); transform: translateY(-50%);">${ValorRetornar}%</div>
                    </div>`;
        var Retornaveis = []
        Retornaveis.push(HTML);

        var HTML2 = "<div>";
        if(EstudoMaisAtual)
        {
            var ProgStatus=(RetornaProgressoEstudoCInfo(EstudoMaisAtual));
            var Progr = Math.round10(ProgStatus.Progresso * 100, -2);
            var CorProgresso = "";
            if(Progr < 25) CorProgresso = "btn-danger"; //vermelho
            else if(Progr < 50) CorProgresso = "btn-warning" //Amarelo
            else if(Progr < 75) CorProgresso = "btn-info" //Verde musgo
            else if(Progr < 99.9) CorProgresso = "btn-primary" //Azul
            else CorProgresso = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/Estudo/${EstudoMaisAtual.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgresso} btn-sm" style="padding: 2px; font-size:75%;" title="Estudo ${Progr}%\n${ProgStatus.Status}" ${onclick}>[E]</button>`

        }
         if(CalculoMaisAtual)
        {
            var ProgStatus=(RetornaProgressoCalculoCInfo(CalculoMaisAtual));
            var Progr = Math.round10(ProgStatus.Progresso * 100, -2);
            var CorProgresso = "";
            if(Progr < 25) CorProgresso = "btn-danger"; //vermelho
            else if(Progr < 50) CorProgresso = "btn-warning" //Amarelo
            else if(Progr < 75) CorProgresso = "btn-info" //Verde musgo
            else if(Progr < 99.9) CorProgresso = "btn-primary" //Azul
            else CorProgresso = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/Calculo/${CalculoMaisAtual.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgresso} btn-sm" style="padding: 2px; font-size:75%;" title="Cálculo ${Progr}%\n${ProgStatus.Status}" ${onclick}>[C]</button>`

        }
          if(ModeloMaisAtual)
        {
            var ProgStatus=(RetornaProgressoModeloCInfo(ModeloMaisAtual));
            var Progr = Math.round10(ProgStatus.Progresso * 100, -2);
            var CorProgresso = "";
            if(Progr < 25) CorProgresso = "btn-danger"; //vermelho
            else if(Progr < 50) CorProgresso = "btn-warning" //Amarelo
            else if(Progr < 75) CorProgresso = "btn-info" //Verde musgo
            else if(Progr < 99.9) CorProgresso = "btn-primary" //Azul
            else CorProgresso = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/Modelo/${ModeloMaisAtual.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgresso} btn-sm" style="padding: 2px; font-size:75%;" title="Modelo ${Progr}%\n${ProgStatus.Status}" ${onclick}>[M]</button>`

            var ProgrVerificacao = Math.round10(ProgStatus.ProgressoVerificacao * 100, -2);
            var CorProgressoVerificacao = "";
            if(ProgrVerificacao < 25) CorProgressoVerificacao = "btn-danger"; //vermelho
            else if(ProgrVerificacao < 50) CorProgressoVerificacao = "btn-warning" //Amarelo
            else if(ProgrVerificacao < 75) CorProgressoVerificacao = "btn-info" //Verde musgo
            else if(ProgrVerificacao < 99.9) CorProgressoVerificacao = "btn-primary" //Azul
            else CorProgressoVerificacao = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/VerificacaoModelo/${ProgStatus.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgressoVerificacao} btn-sm" style="padding: 2px; font-size:75%;" title="Verificação de Modelo ${ProgrVerificacao}%\n${ProgStatus.StatusVerificacao}" ${onclick}>[VM]</button>`


        }
          if(DocumentoMaisAtual)
        {
            var ProgStatus=(RetornaProgressoDocumentoCInfo(DocumentoMaisAtual));
            var Progr = Math.round10(ProgStatus.Progresso * 100, -2);
            var CorProgresso = "";
            if(Progr < 25) CorProgresso = "btn-danger"; //vermelho
            else if(Progr < 50) CorProgresso = "btn-warning" //Amarelo
            else if(Progr < 75) CorProgresso = "btn-info" //Verde musgo
            else if(Progr < 99.9) CorProgresso = "btn-primary" //Azul
            else CorProgresso = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/Documento/${DocumentoMaisAtual.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgresso} btn-sm" style="padding: 2px; font-size:75%;" title="Documento ${Progr}%\n${ProgStatus.Status}" ${onclick}>[D]</button>`

            var ProgrVerificacao = Math.round10(ProgStatus.ProgressoVerificacao * 100, -2);
            var CorProgressoVerificacao = "";
            if(ProgrVerificacao < 25) CorProgressoVerificacao = "btn-danger"; //vermelho
            else if(ProgrVerificacao < 50) CorProgressoVerificacao = "btn-warning" //Amarelo
            else if(ProgrVerificacao < 75) CorProgressoVerificacao = "btn-info" //Verde musgo
            else if(ProgrVerificacao < 99.9) CorProgressoVerificacao = "btn-primary" //Azul
            else CorProgressoVerificacao = "btn-success" //Verde
            var onclick = `onclick="window.location='/app/civil/VerificacaoDocumento/${ProgStatus.id}'"`
            HTML2 += `<button value="" class="btn ${CorProgressoVerificacao} btn-sm" style="padding: 2px; font-size:75%;" title="Verificação de Documento ${ProgrVerificacao}%\n${ProgStatus.StatusVerificacao}" ${onclick}>[VD]</button>`


        }
            var ProgressoIntegracaoCEM = Math.round10(ProgressoIntegracao * 100, -2);
            var CorProgressoIntegracao="";
           if(ProgressoIntegracaoCEM < 25) CorProgressoIntegracao = "btn-danger"; //vermelho
            else if(ProgressoIntegracaoCEM < 50) CorProgressoIntegracao = "btn-warning" //Amarelo
            else if(ProgressoIntegracaoCEM < 75) CorProgressoIntegracao = "btn-info" //Verde musgo
            else if(ProgressoIntegracaoCEM < 99.9) CorProgressoIntegracao = "btn-primary" //Azul
            else CorProgressoIntegracao = "btn-success" //Verde

        var onclick = `onclick="window.location='/app/civil/Integracao/${Atividade.id}'"`
        HTML2 += `<button value="" class="btn ${CorProgressoIntegracao} btn-sm" style="padding: 2px; font-size:75%;" title="Integração ${ProgressoIntegracaoCEM}% (${IntegracoesAtividadeAprovadas.length}/${IntegracoesAtividade.length})\n" ${onclick}>[I]</button>`

         var ProgressoIntegracaoEM = Math.round10(SttEmissao.Progresso * 100, -2);
            var CorProgressoEmissao="";
           if(ProgressoIntegracaoEM < 25) CorProgressoEmissao = "btn-danger"; //vermelho
            else if(ProgressoIntegracaoEM < 50) CorProgressoEmissao = "btn-warning" //Amarelo
            else if(ProgressoIntegracaoEM < 75) CorProgressoEmissao = "btn-info" //Verde musgo
            else if(ProgressoIntegracaoEM < 99.9) CorProgressoEmissao = "btn-primary" //Azul
            else CorProgressoEmissao = "btn-success" //Verde
            var onclickEM = `onclick="window.location='/app/civil/Emissao/${Atividade.id}'"`
        HTML2 += `<button value="" class="btn ${CorProgressoEmissao} btn-sm" style="padding: 2px; font-size:75%;" title="Emissão ${ProgressoIntegracaoEM}%\n${SttEmissao.NomeStatus}" ${onclickEM}>[EM]</button>`

        HTML2+="</div>"
        Retornaveis.push(HTML2);


        return(Retornaveis)

}
function RetornaProgressoEstudo(Estudo){
    for(var i = 0; i < StatusEstudo.length; i++){
        if(StatusEstudo[i].id == Estudo.Status)
            return(parseFloat(StatusEstudo[i].Progresso));
    }
}
function RetornaProgressoEstudoCInfo(Estudo){
    var ArrRetornar = {}
    for(var i = 0; i < StatusEstudo.length; i++){
        if(StatusEstudo[i].id == Estudo.Status)
        {
            ArrRetornar['Progresso'] = parseFloat(StatusEstudo[i].Progresso);
            ArrRetornar['Status'] = StatusEstudo[i].NomeStatus;
            return(ArrRetornar);
        }

    }
}
function RetornaProgressoCalculoCInfo(Calculo){
    var ArrRetornar = {}
    for(var i = 0; i < StatusCalculo.length; i++){
        if(StatusCalculo[i].id == Calculo.Status)
        {
            ArrRetornar['Progresso'] = parseFloat(StatusCalculo[i].Progresso);
            ArrRetornar['Status'] = StatusCalculo[i].NomeStatus;
            return(ArrRetornar);
        }

    }
}
function RetornaProgressoCalculo(Calculo){
    for(var i = 0; i < StatusCalculo.length; i++){
        if(StatusCalculo[i].id == Calculo.Status)
            return(parseFloat(StatusCalculo[i].Progresso));
    }
}

function RetornaProgressoModeloCInfo(Modelo){
    var ArrRetornar = {}
    for(var i = 0; i < StatusModelo.length; i++)
    {
        if(StatusModelo[i].id == Modelo.Status)
        {
            ArrRetornar['Progresso'] = parseFloat(StatusModelo[i].Progresso);
            ArrRetornar['Status'] = StatusModelo[i].NomeStatus;
            for(var k = 0; k< Verificacoes.length; k++)
            {
                if(Verificacoes[k].Modelo == Modelo.id)
                {

                    for(var j = 0; j < StatusVerificacoes.length; j++)
                    {
                        if(StatusVerificacoes[j].id == Verificacoes[k].Status)
                        {
                            ArrRetornar['ProgressoVerificacao'] = parseFloat(StatusVerificacoes[j].Progresso);
                            ArrRetornar['StatusVerificacao'] = StatusVerificacoes[j].NomeStatus;

                            ArrRetornar['id'] = Verificacoes[k].id;
                            break;
                        }
                    }
                    break;
                }
            }
            return(ArrRetornar);
        }
    }
}

function RetornaProgressoDocumentoCInfo(Documento){
    var ArrRetornar = {}
    for(var i = 0; i < StatusDocumento.length; i++)
    {
        if(StatusDocumento[i].id == Documento.Status)
        {
            ArrRetornar['Progresso'] = parseFloat(StatusDocumento[i].Progresso);
            ArrRetornar['Status'] = StatusModelo[i].NomeStatus;
            for(var k = 0; k< Verificacoes.length; k++)
            {
                if(Verificacoes[k].Documento == Documento.id)
                {
                    for(var j = 0; j < StatusVerificacoes.length; j++)
                    {
                        if(StatusVerificacoes[j].id == Verificacoes[k].Status)
                        {
                            ArrRetornar['ProgressoVerificacao'] = parseFloat(StatusVerificacoes[j].Progresso);
                            ArrRetornar['StatusVerificacao'] = StatusVerificacoes[j].NomeStatus;
                            ArrRetornar['id'] = Verificacoes[k].id;
                            break;
                        }
                    }
                    break;
                }
            }
            return(ArrRetornar);
        }
    }
}

function RetornaProgressoModelo(Modelo){

    var ProgressoModelo = 0;

    for(var i = 0; i < StatusModelo.length; i++){
        if(StatusModelo[i].id == Modelo.Status)
        {
            ProgressoModelo+= parseFloat(StatusModelo[i].Progresso);
            break;
        }
    }

    for(var i = 0; i< Verificacoes.length; i++)
    {
        if(Verificacoes[i].Modelo == Modelo.id)
        {
            ProgressoModelo += parseFloat(RetornaProgressoVerificacao(Verificacoes[i]));
            break;
        }
    }
    return ProgressoModelo;
}
function RetornaProgressoVerificacao(Verificacao){
    for(var i = 0; i < StatusVerificacoes.length; i++){
        if(StatusVerificacoes[i].id == Verificacao.Status)
            return(parseFloat(StatusVerificacoes[i].Progresso));
    }
}

function RetornaProgressoDocumento(Documento){
       var ProgressoDocumento = 0;


    for(var i = 0; i < StatusDocumento.length; i++){
        if(StatusDocumento[i].id == Documento.Status)
        {
            ProgressoDocumento+= parseFloat(StatusDocumento[i].Progresso);
            break;
        }
    }

    for(var i = 0; i< Verificacoes.length; i++)
    {
        if(Verificacoes[i].Documento == Documento.id)
        {
            ProgressoDocumento += parseFloat(RetornaProgressoVerificacao(Verificacoes[i]));
            break;
        }
    }

    return(ProgressoDocumento);

}
function PegarNomeDisciplina(ID){
     for(var i = 0; i < Disciplinas.length; i++){
            if(Disciplinas[i].id == ID)
            {
                return(Disciplinas[i].Nome);
            }
        }
     return("Não encontrada");
}

function PegarNomeFinalidade(ID){
     for(var i = 0; i < Finalidades.length; i++){
            if(Finalidades[i].id == ID)
            {
                return(Finalidades[i].Finalidade);
            }
        }
     return("Não encontrada");
}

function PegarNomeTipoDocumento(ID){
     for(var i = 0; i < TiposDocumentos.length; i++){
            if(TiposDocumentos[i].id == ID)
            {
                return(TiposDocumentos[i].TipoDocumento);
            }
        }
     return("Não encontrada");
}
function ModalExcluirAtividade()
{
    $("#ExcluirAtividadeModal").modal('show');
}
async function CriarTabelaAtividades(OS){

    Atividades = await RetornaAtividades(OS);
    Estudos = await RetornaEstudos(OS);
    Calculos = await RetornaCalculos(OS);
    Modelos = await RetornaModelos(OS);
    Documentos = await RetornaDocumentos(OS);
    Verificacoes = await RetornaVerificacoes(OS);
    ItensIntegracoes = await RetornaItensIntegracoesPorOS(OS)


        var dataSetStress = [];
         for(var i = 0; i < Atividades.length; i++){
                const date2 = Date.now();
                const date1 = new Date(Atividades[i].DataPrazoEmissao);
                const diffTime = date1 - date2;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                var corDias = "red";
                if(diffDays >=0) corDias="#006600";
                var HtmlDias = `<div style="color: ${corDias}"><b> ${diffDays}<b></div>`;
                var Obj = Atividades[i];
                var Retornaveis = RetornarProgressoAtividade(Obj);
                var HTMLAcessar =`<p style="display: none">${Obj.id}</p><button value="" onclick="window.location='/app/civil/DetalhesAtividade/${Obj.id}'" class="centerbtn shadow-sm btn btn-secondary btn-sm" style="padding: 2px; font-size:75%;" title="Acessar Atividade">Acessar <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
    </svg></button>`;
               dataSetStress.push([Obj.CodigoDocumento, Obj.Revisao, Obj.Tag, Obj.AreaCorrespondente, Obj.StatusHold ,Obj.Descricao, PegarNomeDisciplina(Obj.Disciplina), PegarNomeFinalidade(Obj.Finalidade), PegarNomeTipoDocumento(Obj.TipoDocumento), Retornaveis[0], Retornaveis[1], HtmlDias, HTMLAcessar]);
            }



        $('#TabelaAtividades').DataTable( {
            data: dataSetStress,
            columns: [
                { title: "Código Documento" },
                { title: "Revisão" },
                { title: "Tag" },
                { title: "Área" },
                { title: "Status" },
                { title: "Descrição" },
                { title: "Disciplina" },
                { title: "Finalidade" },
                { title: "TipoDocumento" },
                { title: "Progresso" },
                { title: "Etapas", width: "150px" },
                { title: "Dias até Emissão"},
                { title: "Acessar" }
            ],

               "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "Tudo"]],
             "pageLength": 50,
                  "language": {
              "emptyTable": "Nenhuma Atividade Encontrada.",
              "search": "Pesquisar",
                "paginate": {
                "first":      "Primeiro",
                "last":       "Último",
                "next":       "Próximo",
                "previous":   "Anterior"
                },
                "lengthMenu":     "Mostrar _MENU_ ",
                  "info":           "Mostrando atividade _START_ à _END_ de um total de _TOTAL_",
                  "infoEmpty":      "Sem atividades",
                  "infoFiltered":   "(Filtrando de um total de _MAX_)",
            }


        } );
        table = $('#TabelaAtividades').DataTable();
       /*  $('#TabelaDados tbody').on('click', 'tr', function () {
            var data = table.row( this ).data();
            console.log("selecionar elemento " + data[0]);

        } );*/
    //     $('#TabelaAtividades tbody').on( 'click', 'tr', function () {
    //
    //            table.$('tr.selected').removeClass('selected');
    //            $(this).removeClass('selected');
    //            $(this).addClass('selected');
    //              var data = table.row( this ).data();
    //
    //
    //    } );

        $('#button').click( function () {
            table.row('.selected').remove().draw( false );
        } );
 $("#BotaoExcluir").show();
 $("#BotaoExportar").show();

}
async function RetornaHolds(IDAtividade){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarHoldsAtividade/",
      method: "GET",
      data: { id: IDAtividade }
    });

   return request;



}
async function RetornaAtividades(OS){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarAtividades/",
      method: "GET",
      data: { os: OS }
    });

   return request;


}
async function RetornaStatusAtividade(IDOS){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusTodasAtividadesOS/"+IDOS+"/",
      method: "GET",
      data: { }
    });

   return request;
}
async function RetornaTiposDocumentos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarTipoDocumentoAtividade/",
      method: "GET",
      data: { }
    });

   return request;
}
async function RetornaTiposDocumentosFinalidade(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarFinalidadesAtividade/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaDisciplinas(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarDisciplinasAtividade/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaEstudos(OS){
let request;
      request = await $.ajax({
      url: "/app/civil/RetornarEstudos/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}
async function RetornaCalculos(OS){
let request;
      request = await $.ajax({
      url: "/app/civil/RetornarCalculos/",
      method: "GET",
      data: { os: OS }
    });

   return request;
}

async function RetornaModelos(OS){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarModelos/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}

async function RetornaDocumentos(OS){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarDocumentos/",
      method: "GET",
      data: { os: OS }
    });

   return request;


}

async function RetornaVerificacoes(OS){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarVerificacoes/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}

async function RetornaItensIntegracoesPorOS(OS){

 let request;
      request = await $.ajax({
      url: "/app/civil/RetornaItensIntegracoesPorOS/",
      method: "GET",
      data: { os: OS }
    });

   return request;

}

async function RetornaStatusVerificacoes(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusVerificacoes/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaStatusEmissao(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEmissao/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaStatusEstudos(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusEstudo/",
      method: "GET",
      data: { }
    });

   return request;

}
async function RetornaStatusAtividadeID(IDStatusAtividade, IDAtividade){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusAtividade/",
      method: "GET",
      data: {"id": IDStatusAtividade, "atividade": IDAtividade }
    });

   return request;

}

async function RetornaStatusCalculo(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusCalculo/",
      method: "GET",
      data: { }
    });

   return request;

}

async function RetornaStatusModelo(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusModelo/",
      method: "GET",
      data: { }
    });

   return request;
}

async function RetornaStatusDocumento(){
 let request;
      request = await $.ajax({
      url: "/app/civil/RetornarStatusDocumento/",
      method: "GET",
      data: { }
    });

   return request;


}
$(function() {
    // This function gets cookie with a given name
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    var csrftoken = getCookie('csrftoken');

    /*
    The functions below will create a header with csrftoken
    */

    function csrfSafeMethod(method) {
        // these HTTP methods do not require CSRF protection
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }
    function sameOrigin(url) {
        // test that a given url is a same-origin URL
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }

    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && sameOrigin(settings.url)) {
                // Send the token to same-origin, relative URLs only.
                // Send the token only if the method warrants CSRF protection
                // Using the CSRFToken value acquired earlier
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

});
