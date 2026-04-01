// ===================================================================
// ELETRICA – defines-modals.js
// Funções totalmente focadas no controle de modais para o módulo Elétrica.
// Padrão: uma função show e uma hide por modal ID.
// ===================================================================


// - BORNES CONFIG (#modalLoading / #modalRender / #overlay) ---------
function modalBornesLoadingShow() { $('#modalLoading').modal('show'); }
function modalBornesLoadingHide() { $('#modalLoading').modal('hide'); }
function modalBornesRenderShow()  { $('#modalRender').modal('show'); $('#overlay').show(); }

