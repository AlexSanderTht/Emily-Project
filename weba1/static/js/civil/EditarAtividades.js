$( document ).ready(function() {
DataEstudo = $('#DataEstudo').html();
DataCalculo = $('#DataCalculo').html();
DataModelo = $('#DataModelo').html();
DataDocumento = $('#DataDocumento').html();
DataVerificacao = $('#DataVerificacao').html();
$('#FormAtividades').on('submit', on_submit_function);
});

var DataEstudo = "";
var DataCalculo = "";
var DataModelo = "";
var DataDocumento = "";
var DataVerificacao = "";



var on_submit_function = function(evt){
        $('#FooterContinuarEnvio').hide();
        $('#FooterErro').hide();
        evt.preventDefault();

        var ApagarEstudo = false;
        var ApagarCalculo = false;
        var ApagarModelo = false;
        var ApagarDocumento = false;
        var ApagarVerificacao = false;

        var NVValorEstudo = $('#DataEstudoVlrForm').val();
        var NVValorCalculo = $('#DataCalculoVlrForm').val();
        var NVValorModelo = $('#DataModeloVlrForm').val();
        var NVValorDocumento = $('#DataDocumentoVlrForm').val();
        var NVValorVerificacao = $('#DataVerificacaoVlrForm').val();

        var NomeEstudo = $('#ResponsavelEstudo option:selected').text();
        var NomeCalculo = $('#ResponsavelCalculo option:selected').text();
        var NomeModelo = $('#ResponsavelModelagem option:selected').text();
        var NomeDocumento = $('#ResponsavelDocumento option:selected').text();
        var NomeVerificacao = $('#ResponsavelVerificacao option:selected').text();



        if((NVValorModelo.length > 0 || NVValorDocumento.length > 0) && NVValorVerificacao.length == 0)
        {
             $('#TituloConfirmacao').html("Preencher Verificação")
                $('#AvisoErroAtividades').html('<p><b>Quando existem indicações para modelo ou documento, é obrigatório o preenchimento de verificação </b></p>')
                $('#FooterErro').show();
                $('#AvisoAtividades').modal('show')
        }
        else
            {
            if(NVValorEstudo.length == 0 && DataEstudo.length > 0)
            {
                ApagarEstudo = true;
            }
            if(NVValorCalculo.length == 0 && DataCalculo.length > 0)
            {
                ApagarCalculo = true;
            }
            if(NVValorModelo.length == 0 && DataModelo.length > 0)
            {
                ApagarModelo = true;
            }
            if(NVValorDocumento.length == 0 && DataDocumento.length > 0)
            {
                ApagarDocumento = true;
            }
             if(NVValorVerificacao.length == 0 && DataVerificacao.length > 0)
            {
                ApagarVerificacao = true;
            }
            if(ApagarEstudo || ApagarCalculo || ApagarModelo || ApagarDocumento || ApagarVerificacao)
            {
                 $('#TituloConfirmacao').html("Confirmação de Modificação")
                var Erros = "<div><p>As seguintes etapas serão removidas da atividade:</p>";
                if(ApagarEstudo) Erros+= "<p><b>-Estudo</b></p>"
                if(ApagarCalculo) Erros+= "<p><b>-Cálculo</b></p>"
                if(ApagarModelo) Erros+= "<p><b>-Modelo e Verificação do Modelo</b></p>"
                if(ApagarDocumento) Erros+= "<p><b>-Documento e Verificação do Documento</b></p>"
                if(ApagarVerificacao) Erros+= "<p<b>>-Verificação de Modelo e Documento</b></p>"
                Erros += "<p>Deseja continuar?</p></div>"
                $('#AvisoErroAtividades').html(Erros)
                $('#FooterContinuarEnvio').show();
                $('#AvisoAtividades').modal('show')
            }
            else
            {
                 $(this).off('submit', on_submit_function); //It will remove this handle and will submit the form again if it's all ok.
                 $(this).submit();
            }
        }
};

function ContinuarEnvioAtividade(){
            $('#FormAtividades').off('submit', on_submit_function); //It will remove this handle and will submit the form again if it's all ok.
             $('#FormAtividades').submit();
}

