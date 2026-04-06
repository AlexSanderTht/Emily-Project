function nw_crop(preview) {
  'use strict';

  if (parseInt(preview.split('_')[1]) != 0){ cropper.destroy() }

  var Cropper = window.Cropper;
  var container = document.querySelector('.img-container');
  var image = container.getElementsByTagName('img').item(0);
  var dataX = 0;
  var dataY = 0;
  var dataHeight = 0;
  var dataWidth = 0;
  var dataScaleX = 1;
  var dataScaleY = 1;
  var options = {
    aspectRatio: NaN,
    preview: document.getElementById(preview),
    crop: function (e) {
      var data = e.detail;

      //console.log(e.type);
      dataX = Math.round(data.x);
      dataY = Math.round(data.y);
      dataHeight = Math.round(data.height);
      dataWidth = Math.round(data.width);
      dataScaleX = typeof data.scaleX !== 'undefined' ? data.scaleX : '';
      dataScaleY = typeof data.scaleY !== 'undefined' ? data.scaleY : '';
    },
    zoom: function (e) {
    }
  };
  var cropper = new Cropper(image, options);

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
}
