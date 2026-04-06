// Scripts Extraídos do a1pro.html

// openTool: tab helper
window.openTool = function(evt, Name) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    var el = document.getElementById(Name);
    if (el) el.style.display = "block";
    if (evt && evt.currentTarget) evt.currentTarget.className += " active";
};

// Move  o modal #cadastro para o  body
(function(){
    if (window.jQuery) {
        jQuery(function(){ jQuery('#cadastro').appendTo(document.body); });
    } else {
        document.addEventListener('DOMContentLoaded', function(){
            var el = document.getElementById('cadastro');
            if (el && document.body) document.body.appendChild(el);
        });
    }
})();

// Função sincada com a senha visível.
(function(){
    const btn = document.querySelector('.toggle-pass');
    const input = document.getElementById('id_password');
    if(btn && input){
        btn.addEventListener('click', () => {
            const show = input.type === 'password';
            input.type = show ? 'text':'password';
            if (btn.firstElementChild) {
                btn.firstElementChild.classList.toggle('fa-eye');
                btn.firstElementChild.classList.toggle('fa-eye-slash');
            }
            btn.setAttribute('aria-label', show? 'Ocultar senha':'Mostrar senha');
        });
    }
})();

// Garante que os menus suspensos do Bootstrap estejam carregados
(function(){
    if (window.jQuery && typeof jQuery.fn.dropdown === 'function') {
        jQuery(function(){ jQuery('.dropdown-toggle').dropdown(); });
    }
})();

// permite que check_os_and_area funcione com esta estrutura de página
(function(){
    const original = window.check_os_and_area;
    if (typeof original === 'function') {
        window.check_os_and_area = function(tela){
            const proOsEl = document.getElementById('pro-os');
            const proAreaEl = document.getElementById('pro-area');
            let osVal = proOsEl ? (proOsEl.value || '') : (document.getElementById('test_datalist')?.value || '');
            let areaVal = proAreaEl ? (proAreaEl.value || '') : '';

            if (!osVal) {
                alert('Selecione a OS!');
                return false;
            }

            if (!proAreaEl) {
                const url = (tela === 'cargas') ? '/app/eletrica/a1pro/TelaCarga/' : '/app/eletrica/a1pro/TelaEquips/';
                window.open(url, '_self');
                return true;
            }

            try {
                return original(tela);
            } catch (e) {
                console.warn('check_os_and_area fallback due to error:', e);
                const url = (tela === 'cargas') ? '/app/eletrica/a1pro/TelaCarga/' : '/app/eletrica/a1pro/TelaEquips/';
                window.open(url, '_self');
                return true;
            }
        };
    }
})();

// Após escolher o sistema operacional, preencha a área #pro com o URL 
(function(){
    function populateAreasAbsolute(){
        var osVal = (document.getElementById('pro-os')||{}).value || 'none';
        if(!osVal || osVal === 'none'){ return; }
        if (!window.jQuery) { return; }
        jQuery.ajax({
            type: 'GET',
            url: '/app/eletrica/a1pro/list_options/',
            dataType: 'json',
            data: { table: 'TbArea', find: osVal }
        }).done(function(data){
            var options = '<option value="none">---</option>';
            var resposta = data && data.resposta ? data.resposta : [];
            for (var i in resposta) { options += '<option value='+resposta[i]+'>'+resposta[i]+'</option>'; }
            jQuery('#pro-area').html(options);
        });
    }

    var originalChange = window.changeOsValues;
    window.changeOsValues = function(paramId, paramName){
        if (typeof originalChange === 'function') { originalChange(paramId, paramName); }
        populateAreasAbsolute();
    };
})();

// onload de números onload e pro-os
window.onload = window.onload || function(){ if (typeof on_load_a1pro === 'function') { try { on_load_a1pro(); } catch(e) { console.warn('on_load_a1pro error', e); } } };

(function(){
    function updateProOsNumber(){
        var src = document.getElementById('pro-os') || document.getElementById('test_datalist');
        var dest = document.getElementById('pro-os-number');
        if(!dest) return;
        dest.textContent = (src && src.value) ? src.value : '';
    }
    updateProOsNumber();
    var src = document.getElementById('pro-os') || document.getElementById('test_datalist');
    if(src){
        src.addEventListener('input', updateProOsNumber);
        src.addEventListener('change', updateProOsNumber);
        try{
            var observer = new MutationObserver(updateProOsNumber);
            observer.observe(src, { attributes: true, attributeFilter: ['value'] });
        }catch(e){}
    }
    var origChange = window.changeOsValues;
    window.changeOsValues = function(){
        if(typeof origChange === 'function') origChange.apply(this, arguments);
        updateProOsNumber();
    };
})();


