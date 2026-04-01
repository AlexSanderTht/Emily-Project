 // --------------------- Analisador de evento da barra de progresso em tempo real ---------------------//
    $('#progress-bar-message-book').on('DOMSubtreeModified', function(){
        if ($('#progress-bar-message-book')[0].innerText === 'Sucesso!'){
            // console.log($('#progress-bar-message-book')[0].innerText)
            let url =  '/app/calc_cabos/a1calccabos/GeraBookCalculo/' + id_task_book + '/'
            window.open(url, '_self')
            setTimeout(()=>{document.getElementById('div_bar_task_book').hidden = true}, 2000)
            setTimeout(()=>{$('#modal_import_capa').modal('hide')}, 4000)
        }
    });
    //------------- Botão de Pesquisa ----------------//
    let teste =  document.getElementById('TextFix')

     function  meuBotao(){
        teste.style.width = '11rem';
        teste.style.paddingLeft  = "5px";
        const myTimeout = setTimeout(fecharHover, 5000);
     }

     function fecharHover(){
        if(teste.value === ''){
           teste.style.width = '0px'
           teste.style.paddingLeft = '1px'
        }else{
        }
     }
    //-----------Limpar input pesquisa ------------//
    window.onload = function (){
       document.getElementById('TextFix').value = '';
    }

    //--------------------- Filtro de pesquisa ------------------//
    function FilterCalcMtProject(projeto_calc){
       var all_project_calc = document.querySelectorAll(".calc_exist");
       for(let i =0; i < all_project_calc.length; i++){
           let projet_name = all_project_calc[i].innerHTML.toUpperCase()
           if(projet_name.includes(projeto_calc.toUpperCase())){
               all_project_calc[i].parentElement.hidden = false
           }else{
               all_project_calc[i].parentElement.hidden = true
           }
       }
    }