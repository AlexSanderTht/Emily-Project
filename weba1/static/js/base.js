function clicked(name){
  $(`#${name}`).click();
}

function obterCsrfToken() {
  const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
  return csrfInput ? csrfInput.value : '';
}

function obterCsrfHeaders() {
  return {
    'X-CSRFToken': obterCsrfToken()
  };
}




function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue
}
function selectedFile(e, label) {
  var theFile = e.target.files;
  if (label === 'file-mat') {

      if (theFile[0].name.includes('.xlsx')) {
          $(`#text-${label}`).text(label + ": " + theFile[0].name);
      } else {
          $(`#text-${label}`).text("O tipo do arquivo deve ser .xslx!");
      }
  } else {
      $(`#text-` + label).text(label + ": " + theFile[0].name);
  }
}

function bar_trigger() {
  document.getElementById('agua-modal-task').style.display='none';
  let formData = new FormData($("#form")[0]);
  $.ajax({
      type: "POST",
      url: "",
      dataType: 'json',
      data: formData,
      contentType : false,
      processData : false
  }).done(function( data ) {
      var progressUrl = `/celery-progress/${data["task_id"]}/`;
      function customResult(resultElement, result) {
          document.getElementById('auto-download').submit();
          $( resultElement ).append(
          $('<p>').text('Sum of all seconds is ' + result)
          );
      }

      function customError(progressBarElement, progressBarMessageElement, excMessage) {
          progressBarElement.style.backgroundColor = '#ff1100';
          progressBarMessageElement.innerHTML = "Entre em contato com o SEA e informe o número da tarefa: "
              + progressUrl;
      }

      CeleryProgressBar.initProgressBar(progressUrl, {
          onResult: customResult,
          onError: customError,
      })
  });
}

function selectedFolder(e, text_id) {
var theFiles = e.target.files;
var files = '';
for (var i=0; i < theFiles.length; i++)
  {
      if (i > 3)
      {
          files += 'e mais '+(theFiles.length-4).toString()+' arquivos';
          break;
      }
      else if (i == theFiles.length-1)
      {
          files += theFiles[i].name;
      }

      else
      {
          files += theFiles[i].name+', ';
      }
  }
  if (1) {
      $(`#${text_id}`).text("selecionados: " + files);
  } else {
      $(`#${text_id}`).innerHTML = "Selecione os arquivos.";
  }
}

var id_ul = sessionStorage.getItem('chave');

if (id_ul == "sair" || id_ul == null || id_ul == "" || id_ul == "home" ){
  sessionStorage.setItem('chave','');
}
else{
  id_ul = document.getElementById(id_ul);
  id_ul.classList.add("active_")
  

}
/===== LINK ACTIVE  =====/ 
const linkColor = document.querySelectorAll('.nav__link')


const ulcollapse = document.getElementsByClassName('collapse__menu')
const linkCollapse = document.getElementsByClassName('collapse__link')

const linkCollapse1 = document.getElementsByClassName('nav__link')
var i
var x
var y
for(i=0;i<linkCollapse1.length;i++){

  linkCollapse1[i].addEventListener('click', function(){
    
    const collapseMenu = this.lastElementChild

    for(y=0;y<ulcollapse.length;y++)
    {
                if (ulcollapse[y] !== collapseMenu)
                {
                  ulcollapse[y].classList.remove("showCollapse");
                  
                }
                else{collapseMenu.classList.add('showCollapse')}
    }  
  
    
    const rotate = collapseMenu.previousElementSibling
          for(x=0;x<linkCollapse.length;x++)
{
          if (linkCollapse[x] !== rotate)
          {
          linkCollapse[x].classList.remove("rotate");
          }
}
rotate.classList.add('rotate')
  })
}
const ulcollapse1= document.getElementsByClassName('collapse__menu_t')
const linkCollapse2 = document.getElementsByClassName('collapse__link')

const linkCollapse3 = document.getElementsByClassName('nav__link1')

for(i=0;i<linkCollapse3.length;i++){

  linkCollapse3[i].addEventListener('click', function(){
    
    const collapseMenu1 = this.lastElementChild
    const collapseMenu12 = this

for(y=0;y<linkCollapse3.length;y++)
{
          if (linkCollapse3[y] !== collapseMenu12)
          {
            linkCollapse3[y].classList.remove("active_");
            
          }
          else{collapseMenu12.classList.add('active_')}
}  

    for(y=0;y<ulcollapse1.length;y++)
    {
                if (ulcollapse1[y] !== collapseMenu1)
                {
                  ulcollapse1[y].classList.remove("showCollapse");
                  
                }
                else{collapseMenu1.classList.add('showCollapse')}
    }  
  
    const rotate = collapseMenu1.previousElementSibling
          for(x=0;x<linkCollapse2.length;x++)
{
          if (linkCollapse2[x] !== rotate)
          {
          linkCollapse2[x].classList.remove("rotate");
          }
}
rotate.classList.add('rotate')
  })
}








const linkCollapse9 = document.getElementsByClassName('collapse__sublink')

for(i=0;i<linkCollapse9.length;i++){

  linkCollapse9[i].addEventListener('click', function(){
    
    const collapseMenu5 = this.parentNode


  
sessionStorage.setItem('chave',collapseMenu5.parentNode.id);
    
  })
}


const linkCollapse54 = document.getElementsByClassName('collapse__sublink1')

for(i=0;i<linkCollapse54.length;i++){

    linkCollapse54[i].addEventListener('click', function(){
    
    const collapseMenu54 = this.id


  
sessionStorage.setItem('chave',collapseMenu54);
    
  })
}
const linkCollapse64 = document.getElementById('layoutSidenav_content')



  document.getElementById("layoutSidenav_content").onmouseout = function() {
    const ulcollapse9867 = document.getElementsByClassName('collapse__menu')
    const linkCollapse167 = document.getElementsByClassName('nav__link')
    var i
    var x
    var y
    for(i=0;i<linkCollapse167.length;i++){
    
        
        const collapseMenu1576 = this.lastElementChild
    
        for(y=0;y<ulcollapse9867.length;y++)
        {
                    if (ulcollapse9867[y] !== collapseMenu1576)
                    {
                        ulcollapse9867[y].classList.remove("showCollapse");
                      
                    }
                    else{collapseMenu.classList.remove('showCollapse')}
        }
      
}

  }


function edit_modal(id_with, header, load){
    // funçãozinha q manipula o modal de load
    document.getElementById(id_with + '-header').textContent = ''
    document.getElementById(id_with + '-header').textContent = header
    if (load != false){
        $('#' + id_with + '-skate').show()
        $('#' + id_with + '-content').hide()
    }
    else{
        $('#' + id_with + '-skate').hide()
        $('#' + id_with + '-content').show()
    }
}