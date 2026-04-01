window.onload = function() {
  'use strict';

  var Cropper = window.Cropper;
  var URL = window.URL || window.webkitURL;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var download = document.getElementById('download');
  var actions = document.getElementById('actions');
  var dataX = document.getElementById('dataX');
  var dataY = document.getElementById('dataY');
  var dataHeight = document.getElementById('dataHeight');
  var dataWidth = document.getElementById('dataWidth');
  // var dataRotate = document.getElementById('dataRotate');
  // var dataScaleX = document.getElementById('dataScaleX');
  // var dataScaleY = document.getElementById('dataScaleY');
  var options = {
    aspectRatio: NaN,
    preview: '.img-preview',
    ready: function (e) {
      // console.log(e.type);
    },
    cropstart: function (e) {
      // console.log(e.type, e.detail.action);
    },
    cropmove: function (e) {
      // console.log(e.type, e.detail.action);
    },
    cropend: function (e) {
      // console.log(e.type, e.detail.action);
    },
    crop: function (e) {
      var data = e.detail;

      // console.log(e.type);
      dataX.value = Math.round(data.x);
      dataY.value = Math.round(data.y);
      dataHeight.value = Math.round(data.height);
      dataWidth.value = Math.round(data.width);
      // dataRotate.value = typeof data.rotate !== 'undefined' ? data.rotate : '';
      // dataScaleX.value = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
      // dataScaleY.value = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
    },
    zoom: function (e) {
      // console.log(e.type, e.detail.ratio);
    }
  };
  var cropper = new Cropper(image, options);
  var originalImageURL = image.src;
  var uploadedImageType = 'image/jpeg';
  var uploadedImageName = 'cropped.jpg';
  var uploadedImageURL;

  // Tooltip
  $('[data-toggle="tooltip"]').tooltip();

  // Buttons
  if (!document.createElement('canvas').getContext) {
    $('button[data-method="getCroppedCanvas"]').prop('disabled', true);
  }

  if (typeof document.createElement('cropper').style.transition === 'undefined') {
    $('button[data-method="rotate"]').prop('disabled', true);
    $('button[data-method="scale"]').prop('disabled', true);
  }

  // Download
  if (typeof download.download === 'undefined') {
    download.className += ' disabled';
    download.title = 'Your browser does not support download';
  }

  // Options
  actions.querySelector('.docs-toggles').onchange = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropBoxData;
    var canvasData;
    var isCheckbox;
    var isRadio;

    if (!cropper) {
      return;
    }

    if (target.tagName.toLowerCase() === 'label') {
      target = target.querySelector('input');
    }

    isCheckbox = target.type === 'checkbox';
    isRadio = target.type === 'radio';

    if (isCheckbox || isRadio) {
      if (isCheckbox) {
        options[target.name] = target.checked;
        cropBoxData = cropper.getCropBoxData();
        canvasData = cropper.getCanvasData();

        options.ready = function () {
          // console.log('ready');
          cropper.setCropBoxData(cropBoxData).setCanvasData(canvasData);
        };
      } else {
        options[target.name] = target.value;
        options.ready = function () {
          // console.log('ready');
        };
      }

      // Restart
      cropper.destroy();
      cropper = new Cropper(image, options);
    }
  };

  var imageProj = document.getElementById('imagem_proj')
  var imgPreview = document.querySelector('.img-preview');
  var imgPreviewNow = document.getElementById('img-preview-now');
  var levelSelect1 = document.getElementById('register-level-1');
  var levelSelect2 = document.getElementById('register-level-2');

  // Adicione um ouvinte de evento à tab usando o evento 'shown.bs.tab'
  $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    // Se o Cropper ainda não foi inicializado, crie uma nova instância
    if (cropper) {
      cropper.destroy();
    }

    // Crie uma nova instância do Cropper
    cropper = new Cropper(image, options);

    // Aplica os estilos à classe .img-preview
    imgPreview.style.width = '192px';
    imgPreview.style.height = '108px';
    imgPreviewNow.style.display = 'block';
    imgPreviewNow.style.width = '160px';
    imgPreviewNow.style.height = '90px';
    imgPreviewNow.style.minWidth = '0px !important';
    imgPreviewNow.style.minHeight = '0px !important';
    imgPreviewNow.style.maxWidth = 'none !important';
    imgPreviewNow.style.maxHeight = 'none !important';
    imgPreviewNow.style.transform = 'translateX(-16px) translateY(-9px)';
  });


  levelSelect1.addEventListener('click', function () {
    imageProj.src = '/static/models/1.png'
    imgPreviewNow.src = '/static/models/1.png'
    findImagesSave('1')

    // Se o Cropper ainda não foi inicializado, crie uma nova instância
    if (cropper) {
      cropper.destroy();
    }

    // Crie uma nova instância do Cropper
    cropper = new Cropper(image, options);

    // Aplica os estilos à classe .img-preview
    imgPreview.style.width = '192px';
    imgPreview.style.height = '108px';
    imgPreviewNow.style.display = 'block';
    imgPreviewNow.style.width = '160px';
    imgPreviewNow.style.height = '90px';
    imgPreviewNow.style.minWidth = '0px !important';
    imgPreviewNow.style.minHeight = '0px !important';
    imgPreviewNow.style.maxWidth = 'none !important';
    imgPreviewNow.style.maxHeight = 'none !important';
    imgPreviewNow.style.transform = 'translateX(-16px) translateY(-9px)';
  });


  levelSelect2.addEventListener('click', function () {
    imageProj.src = '/static/models/2.png'
    imgPreviewNow.src = '/static/models/2.png'
    findImagesSave('2')

    // Se o Cropper ainda não foi inicializado, crie uma nova instância
    if (cropper) {
      cropper.destroy();
    }

    // Crie uma nova instância do Cropper
    cropper = new Cropper(image, options);

    // Aplica os estilos à classe .img-preview
    imgPreview.style.width = '192px';
    imgPreview.style.height = '108px';
    imgPreviewNow.style.display = 'block';
    imgPreviewNow.style.width = '160px';
    imgPreviewNow.style.height = '90px';
    imgPreviewNow.style.minWidth = '0px !important';
    imgPreviewNow.style.minHeight = '0px !important';
    imgPreviewNow.style.maxWidth = 'none !important';
    imgPreviewNow.style.maxHeight = 'none !important';
    imgPreviewNow.style.transform = 'translateX(-16px) translateY(-9px)';
  });


  // Methods
  actions.querySelector('.docs-buttons').onclick = function (event) {
    var e = event || window.event;
    var target = e.target || e.srcElement;
    var cropped;
    var result;
    var input;
    var data;

    if (!cropper) {
      return;
    }

    while (target !== this) {
      if (target.getAttribute('data-method')) {
        break;
      }

      target = target.parentNode;
    }

    if (target === this || target.disabled || target.className.indexOf('disabled') > -1) {
      return;
    }
    let ctrl = false;
    data = {
      method: target.getAttribute('data-method'),
      target: target.getAttribute('data-target'),
      option: target.getAttribute('data-option') || undefined,
      secondOption: target.getAttribute('data-second-option') || undefined
    };

    cropped = cropper.cropped;

    if (data.method) {
      if (typeof data.target !== 'undefined') {
        input = document.querySelector(data.target);

        if (!target.hasAttribute('data-option') && data.target && input) {
          try {
            data.option = JSON.parse(input.value);
          } catch (e) {
            // console.log(e.message);
          }
        }
      }

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.clear();
          }

          break;

        case 'croppedImageSelected':
          try {
            data.option = JSON.parse(data.option);
          } catch (e) {
            console.log(e.message);
          }

          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }
            data.option.fillColor = '#fff';
          }
          ctrl = true;
          data.method = 'getCroppedCanvas';

          break;
        case 'getCroppedCanvas':
          try {
            data.option = JSON.parse(data.option);
          } catch (e) {
            // console.log(e.message);
          }

          if (uploadedImageType === 'image/jpeg') {
            if (!data.option) {
              data.option = {};
            }

            data.option.fillColor = '#fff';
          }

          break;
      }

      result = cropper[data.method](data.option, data.secondOption);
      data.method = ctrl ? 'croppedImageSelected' : data.method;

      switch (data.method) {
        case 'rotate':
          if (cropped && options.viewMode > 0) {
            cropper.crop();
          }

          break;

        case 'scaleX':
        case 'scaleY':
          target.setAttribute('data-option', -data.option);
          break;

        case 'croppedImageSelected':
          if (result) {
            // Cria o container div
            var containerDiv = document.createElement('div');
            containerDiv.className = 'bordas d-inline-block bg-white border w-auto shadow animate__animated animate__zoomInDown position-relative';

            // Cria o botão de remoção
            var removeButton = document.createElement('button');

            // Adiciona um evento de clique para remover a imagem e o botão
            removeButton.addEventListener('click', function () {
              containerDiv.remove();
            });
            removeButton.title = 'Remove arquivo';
            removeButton.className = 'btn btn-outline-danger rounded-pill px-2 border-0 position-absolute';
            removeButton.type = 'button';
            removeButton.style.right = '0px';
            removeButton.style.top = '0px';
            removeButton.style.zIndex = '1';

            // Cria o ícone dentro do botão
            var icon = document.createElement('i');
            icon.className = 'fas fa-times-circle fa-xl';

            // Adiciona o ícone ao botão
            removeButton.appendChild(icon);

            // Cria um elemento de imagem e defina o src como a imagem recortada
            var croppedImageElement = document.createElement('img');
            croppedImageElement.src = result.toDataURL();
            croppedImageElement.width = '60';
            croppedImageElement.classList.add('border', 'rounded', 'm-2');

            // Adiciona o botão e imagem ao container
            containerDiv.appendChild(removeButton);
            containerDiv.appendChild(croppedImageElement);

            // Adicione o elemento de imagem ao elemento com id 'crop_selected'
            var cropSelectedElement = document.getElementById('crop_selected');
            // cropSelectedElement.innerHTML = ''; // Limpe qualquer conteúdo existente
            cropSelectedElement.appendChild(containerDiv);
          }

          break;

        case 'getCroppedCanvas':
          if (result) {
            // Bootstrap's Modal
            $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);

            if (!download.disabled) {
              download.download = uploadedImageName;
              download.href = result.toDataURL(uploadedImageType);
            }
          }

          break;

        case 'destroy':
          cropper = null;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
            uploadedImageURL = '';
            image.src = originalImageURL;
          }

          break;
      }

      if (typeof result === 'object' && result !== cropper && input) {
        try {
          input.value = JSON.stringify(result);
        } catch (e) {
          // console.log(e.message);
        }
      }
    }
  };

  document.body.onkeydown = function (event) {
    var e = event || window.event;

    if (e.target !== this || !cropper || this.scrollTop > 300) {
      return;
    }

    switch (e.keyCode) {
      case 37:
        e.preventDefault();
        cropper.move(-1, 0);
        break;

      case 38:
        e.preventDefault();
        cropper.move(0, -1);
        break;

      case 39:
        e.preventDefault();
        cropper.move(1, 0);
        break;

      case 40:
        e.preventDefault();
        cropper.move(0, 1);
        break;
    }
  };

  // Import image
  var inputImage = document.getElementById('inputImage');

  if (URL) {
    inputImage.onchange = function () {
      var files = this.files;
      var file;

      if (files && files.length) {
        file = files[0];

        if (/^image\/\w+/.test(file.type)) {
          uploadedImageType = file.type;
          uploadedImageName = file.name;

          if (uploadedImageURL) {
            URL.revokeObjectURL(uploadedImageURL);
          }

          image.src = uploadedImageURL = URL.createObjectURL(file);

          if (cropper) {
            cropper.destroy();
          }

          cropper = new Cropper(image, options);
          inputImage.value = null;
        } else {
          window.alert('Please choose an image file.');
        }
      }
    };
  } else {
    inputImage.disabled = true;
    inputImage.parentNode.className += ' disabled';
  }
};

async function findImagesSave(element) {
  var imagesCard = $('#crop_selected').find('div').remove();

  $.ajax({
        url: "/app/engenharia/a1recognize/find_images/", // Caminho do Ajax
        type: "GET", // http method
        dataType: "json",
        data: {'project': element},
        success: function (data) {
            fillCardImage(data['response'])
        },
        failure: function () {
            swalAlert(false, 'Algo deu errado ao deletar o objeto! verifique e tente novamente.', 'error', false);
        }
  })
}

function fillCardImage(images) {
  var container = document.getElementById('crop_selected')

  images.forEach(imageData => {
    // Criação da string de elementos usando template literal
    var elementString = `
      <div class="bordas d-inline-block bg-white border w-auto shadow animate__animated animate__zoomInDown position-relative">
        <button title="Remove arquivo" class="btn btn-outline-danger rounded-pill px-2 border-0 position-absolute" style="right: 0; top: 0; z-index: 1;" onclick="this.parentNode.remove()">
          <i class="fas fa-times-circle fa-xl"></i>
        </button>
        <img src="data:image/png;base64,${imageData}" width="60" class="border rounded m-2">
      </div>
    `;

    // Adição da string de elementos ao container
    container.innerHTML += elementString;
  });
}
