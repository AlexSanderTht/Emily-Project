var dadosvalidacao;
$( document ).ready(async function()
{
    dadosvalidacao = await Retornadados()
    console.log(dadosvalidacao)
    criartabela()
});
async function Retornadados()
{
 let request;
      request = await $.ajax({
      url: "/app/flexibilidade/vasoext/validacao/",
      method: "GET",
      data: { }
    });

   return request;
}
var dadostab = [];
    function criartabela()
{
    var htmlsubs = ``
    for (var i = 0; i < dadosvalidacao.length;i++)
    {
          var lotimodiff = dadosvalidacao[i].lotimodif
          if (dadosvalidacao[i].lotimodif  != "-")
          {
          lotimodiff = dadosvalidacao[i].lotimodif + " %"
          }
          else
          {
          lotimodiff = dadosvalidacao[i].lotimodif
          }
          var diametronom = (dadosvalidacao[i].dn).toFixed(1);
          htmlsubs += `
          <tr>
          <td><strong>${dadosvalidacao[i].spec}</strong></td>
          <td>${diametronom}</td>
          <td>${dadosvalidacao[i].espessura}</td>
          <td>${dadosvalidacao[i].temperatura}</td>
          <td>${dadosvalidacao[i].material}</td>
          <td>${dadosvalidacao[i].pvpress}</td>
          <td>${dadosvalidacao[i].pypress}</td>
          <td><strong>${dadosvalidacao[i].pressdif} %</strong></td>
          <td>${dadosvalidacao[i].pvtotimo}</td>
          <td>${dadosvalidacao[i].pytotimo}</td>
          <td><strong>${dadosvalidacao[i].totimodif} %</strong></td>
          <td>${dadosvalidacao[i].pvlotimo}</td>
          <td>${dadosvalidacao[i].pylotimo}</td>
          <td><strong>${lotimodiff}</strong></td>
          </tr>
          `;
    }
    $("#Loader").hide()
    $("#dados").html(htmlsubs)
}
