(function ($$1) {
'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

var FilterMenu = function () {
    function FilterMenu(target, th, column, index, options) {
        this.options = options;
        this.th = th;
        this.column = column;
        this.index = index;
        this.tds = target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
    }
    FilterMenu.prototype.initialize = function () {
        this.menu = this.dropdownFilterDropdown();
        this.th.appendChild(this.menu);
        var $trigger = $(this.menu.children[0]);
        var $content = $(this.menu.children[1]);
        var $menu = $(this.menu);
        $trigger.click(function (a) { a.pageX + 310 > $(window).width() && $($content[0]).css({ right: 0 }); return $content.toggle() });
        $(document).click(function (el) {
            if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
                $content.hide();
            }
        });
    };
    FilterMenu.prototype.searchToggle = function (value) {
        if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
        this.th.classList.add("filtrado") // Classe para alterar a cor do filtro quando um filtro é aplicado
        if (value.length === 0) {
            this.toggleAll(true);
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
            this.th.classList.remove("filtrado") // Classe para remover a cor do filtro quando o filtro é removido
            return;
        }
        this.toggleAll(false);
        this.inputs.filter(function (input) {
            return input.value.toLowerCase().indexOf(value.toLowerCase()) > -1;
        }).forEach(function (input) {
            input.checked = true;
        });
    };
    FilterMenu.prototype.updateSelectAll = function () {
        if (this.selectAllCheckbox instanceof HTMLInputElement) {
                 
            $(this.searchFilter).val('');
            this.selectAllCheckbox.checked = this.inputs.length === this.inputs.filter(function (input) {
                return input.checked;
            }).length;
            if(this.selectAllCheckbox.checked){
                this.th.classList.remove("filtrado") // Classe para remover a cor do filtro quando o filtro é removido
            } else this.th.classList.add("filtrado") // Classe para alterar a cor do filtro quando um filtro é aplicado   
        }
    };
    FilterMenu.prototype.selectAllUpdate = function (checked) {
        $(this.searchFilter).val('');
        this.toggleAll(checked);
        this.th.classList.remove('filtrado') // Classe para remover a cor do filtro quando o filtro é removido
    };
    FilterMenu.prototype.toggleAll = function (checked) {
        for (var i = 0; i < this.inputs.length; i++) {
            var input = this.inputs[i];
            if (input instanceof HTMLInputElement) input.checked = checked;
        }
        if(this.inputs[0].checked === false) { // Entra aqui somente quando usuário clica em "Selecionar Todos" e não há filtro aplicado na coluna
            var $th = $(this.th);
            setTimeout(function() {
                $th[0].classList.add("filtrado") // Classe para alterar a cor do filtro quando um filtro é aplicado
            }, 10)
        }   
    };
    FilterMenu.prototype.dropdownFilterItem = function (td, self) {
        var value = td.innerText;
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-item';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = value.trim().replace(/ +(?= )/g, '');
        input.setAttribute('checked', 'checked');
        input.className = 'dropdown-filter-menu-item item';
        input.setAttribute('data-column', self.column.toString());
        input.setAttribute('data-index', self.index.toString());
        dropdownFilterItem.appendChild(input);
        dropdownFilterItem.innerHTML = dropdownFilterItem.innerHTML.trim() + ' ' + value;
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterItemSelectAll = function () {
        var value = this.options.captions.select_all;
        var dropdownFilterItemSelectAll = document.createElement('div');
        dropdownFilterItemSelectAll.className = 'dropdown-filter-item';
        var input = document.createElement('input');
        input.type = 'checkbox';
        input.value = this.options.captions.select_all;
        input.setAttribute('checked', 'checked');
        input.className = 'dropdown-filter-menu-item select-all';
        input.setAttribute('data-column', this.column.toString());
        input.setAttribute('data-index', this.index.toString());
        dropdownFilterItemSelectAll.appendChild(input);
        dropdownFilterItemSelectAll.innerHTML = dropdownFilterItemSelectAll.innerHTML + ' ' + value;
        return dropdownFilterItemSelectAll;
    };
    FilterMenu.prototype.dropdownFilterSearch = function () {
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-search';
        var input = document.createElement('input');
        input.type = 'text';
        input.className = 'dropdown-filter-menu-search form-control';
        input.setAttribute('data-column', this.column.toString());
        input.setAttribute('data-index', this.index.toString());
        input.setAttribute('placeholder', this.options.captions.search);
        dropdownFilterItem.appendChild(input);
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterSort = function (direction) {
        var dropdownFilterItem = document.createElement('div');
        dropdownFilterItem.className = 'dropdown-filter-sort';
        var span = document.createElement('span');
        span.className = direction.toLowerCase().split(' ').join('-');
        span.setAttribute('data-column', this.column.toString());
        span.setAttribute('data-index', this.index.toString());
        span.innerText = direction;
        dropdownFilterItem.appendChild(span);
        return dropdownFilterItem;
    };
    FilterMenu.prototype.dropdownFilterContent = function () {
        var _this = this;
        var self = this;
        var dropdownFilterContent = document.createElement('div');
        dropdownFilterContent.className = 'dropdown-filter-content';
        var innerDivs = this.tds.reduce(function (arr, el) {
            var values = arr.map(function (el) {
                return el.innerText.trim();
            });
            if (values.indexOf(el.innerText.trim()) < 0) arr.push(el);
            return arr;
        }, []).sort(function (a, b) {
            var A = a.innerText.toLowerCase();
            var B = b.innerText.toLowerCase();
            if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                if (Number(A) < Number(B)) return -1;
                if (Number(A) > Number(B)) return 1;
            } else {
                if (A < B) return -1;
                if (A > B) return 1;
            }
            return 0;
        }).map(function (td) {
            return _this.dropdownFilterItem(td, self);
        });
        this.inputs = innerDivs.map(function (div) {
            return div.firstElementChild;
        });
        var selectAllCheckboxDiv = this.dropdownFilterItemSelectAll();
        this.selectAllCheckbox = selectAllCheckboxDiv.firstElementChild;
        innerDivs.unshift(selectAllCheckboxDiv);
        var searchFilterDiv = this.dropdownFilterSearch();
        this.searchFilter = searchFilterDiv.firstElementChild;
        var outerDiv = innerDivs.reduce(function (outerDiv, innerDiv) {
            outerDiv.appendChild(innerDiv);
            return outerDiv;
        }, document.createElement('div'));
        outerDiv.className = 'checkbox-container';
        var elements = [];
        if (this.options.sort) elements = elements.concat([this.dropdownFilterSort(this.options.captions.a_to_z), this.dropdownFilterSort(this.options.captions.z_to_a)]);
        if (this.options.search) elements.push(searchFilterDiv);
        return elements.concat(outerDiv).reduce(function (html, el) {
            html.appendChild(el);
            return html;
        }, dropdownFilterContent);
    };
    FilterMenu.prototype.dropdownFilterDropdown = function () {
        var dropdownFilterDropdown = document.createElement('div');
        dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
        var arrow = document.createElement('span');
        arrow.className = '';
        var icon = document.createElement('i');
        icon.className = 'fas fa-filter';
        arrow.appendChild(icon);
        dropdownFilterDropdown.appendChild(arrow);
        dropdownFilterDropdown.appendChild(this.dropdownFilterContent());
        if ($(this.th).hasClass('no-sort')) {
            $(dropdownFilterDropdown).find('.dropdown-filter-sort').remove();
        }
        if ($(this.th).hasClass('no-filter')) {
            $(dropdownFilterDropdown).find('.checkbox-container').remove();
        }
        if ($(this.th).hasClass('no-search')) {
            $(dropdownFilterDropdown).find('.dropdown-filter-search').remove();
        }
        return dropdownFilterDropdown;
    };
    return FilterMenu;
}();

var FilterCollection = function () {
    function FilterCollection(target, options) {
        this.target = target;
        this.options = options;
        this.ths = target.find('th' + options.columnSelector).toArray();
        this.filterMenus = this.ths.map(function (th, index) {
            var column = $(th).index();
            return new FilterMenu(target, th, column, index, options);
        });
        this.rows = target.find('tbody').find('tr').toArray();
        this.table = target.get(0);
    }
    FilterCollection.prototype.initialize = function () {
        this.filterMenus.forEach(function (filterMenu) {
            filterMenu.initialize();
        });
        this.bindCheckboxes();
        this.bindSelectAllCheckboxes();
        this.bindSort();
        this.bindSearch();
    };
    FilterCollection.prototype.bindCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-menu-item.item').change(function () {
            var index = $(this).data('index');
            var value = $(this).val();
            filterMenus[index].updateSelectAll();
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSelectAllCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-menu-item.select-all').change(function () {
            var index = $(this).data('index');
            var value = this.checked;
            filterMenus[index].selectAllUpdate(value);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSort = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var sort = this.sort;
        var table = this.table;
        var options = this.options;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-sort').click(function () {
            var $sortElement = $(this).find('span');
            var column = $sortElement.data('column');
            var order = $sortElement.attr('class');
            sort(column, order, table, options);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.bindSearch = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        this.target.find('.dropdown-filter-search').keyup(function () {
            var $input = $(this).find('input');
            var index = $input.data('index');
            var value = $input.val();
            filterMenus[index].searchToggle(value);
            updateRowVisibility(filterMenus, rows, ths);
        });
    };
    FilterCollection.prototype.updateRowVisibility = function (filterMenus, rows, ths) {
        var showRows = rows;
        var hideRows = [];
        var selectedLists = filterMenus.map(function (filterMenu) {
            return {
                column: filterMenu.column,
                selected: filterMenu.inputs.filter(function (input) {
                    return input.checked;
                }).map(function (input) {
                    return input.value.trim().replace(/ +(?= )/g, '');
                })
            };
        });
        for (var i = 0; i < rows.length; i++) {
            var tds = rows[i].children;
            for (var j = 0; j < selectedLists.length; j++) {
                var content = tds[selectedLists[j].column].innerText.trim().replace(/ +(?= )/g, '');
                if (selectedLists[j].selected.indexOf(content) === -1) {
                    $(rows[i]).hide();
                    break;
                }
                $(rows[i]).show();
            }
        }
         CriarRodapeSistemas(rows);
    };
    FilterCollection.prototype.sort = function (column, order, table, options) {
        var flip = 1;
        if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
        var tbody = $(table).find('tbody').get(0);
        var rows = $(tbody).find('tr').get();
        rows.sort(function (a, b) {
            var A = a.children[column].innerText.toUpperCase();
            var B = b.children[column].innerText.toUpperCase();
            if (!isNaN(Number(A)) && !isNaN(Number(B))) {
                if (Number(A) < Number(B)) return -1 * flip;
                if (Number(A) > Number(B)) return 1 * flip;
            } else {
                if (A < B) return -1 * flip;
                if (A > B) return 1 * flip;
            }
            return 0;
        });
        for (var i = 0; i < rows.length; i++) {
            tbody.appendChild(rows[i]);
        }

    };

    return FilterCollection;
}();

    $$1.fn.excelTableFilter = function (options) {
    var target = this;
    options = $$1.extend({}, $$1.fn.excelTableFilter.options, options);
    if (typeof options.columnSelector === 'undefined') options.columnSelector = '';
    if (typeof options.sort === 'undefined') options.sort = true;
    if (typeof options.search === 'undefined') options.search = true;
    if (typeof options.captions === 'undefined') options.captions = {
        a_to_z: 'A to Z',
        z_to_a: 'Z to A',
        search: 'Search',
        select_all: 'Select All'
    };
    var filterCollection = new FilterCollection(target, options);
    filterCollection.initialize();
    return target;
};
$$1.fn.excelTableFilter.options = {};
    function CriarRodapeSistemas(rows) {
        if ($("#RodapeSistemas").length ) {

            if (rows.length > 0) {
                var table = rows[0].parentElement.parentElement;
                if (table.id == "TabelaSistemasT") {
                    var Rodape = document.getElementById("RodapeSistemas")
                    Rodape.innerHTML = "";
                    let tb = document.createElement('table');
                    tb.classList.add("TabelaFlex");
                    let thead = document.createElement('thead');
                    thead.style.display = "table"
                    thead.style.border = "0"
                    thead.style.tableLayout = "fixed"
                    thead.style.fontSize = "80%"
                    let tr = document.createElement('tr');
                    let td1 = document.createElement('td');
                    let td2 = document.createElement('td');
                    let td3 = document.createElement('td');
                    let td4 = document.createElement('td');
                    let td5 = document.createElement('td');
                    let td6 = document.createElement('td');
                    let td7 = document.createElement('td');
                    let td8 = document.createElement('td');
                    let td9 = document.createElement('td');
                    let td10 = document.createElement('td');
                    let td11 = document.createElement('td');
                    let td12 = document.createElement('td');
                    let td13 = document.createElement('td');
                    let td14 = document.createElement('td');
                    let td15 = document.createElement('td');
                    let td16 = document.createElement('td');
                    thead.appendChild(tr);
                    tb.appendChild(thead);
                    Rodape.appendChild(tb)
                    tr.appendChild(td1);
                    tr.appendChild(td2);
                    tr.appendChild(td3);
                    tr.appendChild(td4);
                    tr.appendChild(td5);
                    tr.appendChild(td6);
                    tr.appendChild(td7);
                    tr.appendChild(td8);
                    tr.appendChild(td9);
                    tr.appendChild(td10);
                    tr.appendChild(td11);
                    tr.appendChild(td12);
                    tr.appendChild(td13);
                    tr.appendChild(td14);
                    tr.appendChild(td15);
                    tr.appendChild(td16);
                    tr.style.backgroundColor = "gray";
                    // let DivScr = document.createElement('td');
                    // DivScr.appendChild(document.createTextNode(""));
                    // tr.appendChild(DivScr);
                    // // DivScr.style.width = "16.5px"
                    var LinhasTotais = 0;
                    var LinhasCalculadas = 0;
                    var TotalHoras = 0.0;
                    var table = document.getElementById("TabelaSistemasT");
                    for (var i = 1; i < table.rows.length; i++) {
                        if ($(table.rows[i]).is(':visible')) {
                            LinhasTotais += parseInt(table.rows[i].cells[2].textContent);
                            LinhasCalculadas += parseInt(table.rows[i].cells[3].textContent);
                            TotalHoras += parseFloat(table.rows[i].cells[12].textContent);
                        }
                    }
                    td1.innerHTML = "Total: ";
                    td1.style.color = "white";
                    td3.innerHTML = LinhasTotais;
                    td3.style.color = "white";
                    td4.innerHTML = LinhasCalculadas;
                    td4.style.color = "white";
                    td13.innerHTML = (Math.round(TotalHoras * 100) / 100);;
                    td13.style.color = "white";
                    td1.onmouseover = function () {
                        this.style.color = "black";
                    }
                    td1.onmouseleave = function () {
                        this.style.color = 'white';
                    }
                    td3.onmouseover = function () {
                        this.style.color = "black";
                    }
                    td3.onmouseleave = function () {
                        this.style.color = 'white';
                    }
                    td4.onmouseover = function () {
                        this.style.color = "black";
                    }
                    td4.onmouseleave = function () {
                        this.style.color = 'white';
                    }
                    td13.onmouseover = function () {
                        this.style.color = "black";
                    }
                    td13.onmouseleave = function () {
                        this.style.color = 'white';
                    }
                }
            }
        }
    }
    
}(jQuery));
//# sourceMappingURL=excel-bootstrap-table-filter-bundle.js.map
