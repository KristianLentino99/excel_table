(function ($$1) {
'use strict';

$$1 = 'default' in $$1 ? $$1['default'] : $$1;

var FilterMenu = function () {
    function FilterMenu(target, th, column, index, options,dataKey,spinner) {
        this.options = options;
        this.th = th;
        this.column = column;
        this.index = index;
        this.dataKey = dataKey;
        this.spinner = options.spinner;
        this.sortOnClick = options.sortOnHeaderClick;
        this.dataSort = $(th).data('type-sort')??'normal';
        this.tds = target.find('tbody tr td:nth-child(' + (this.column + 1) + ')').toArray();
    }
    FilterMenu.prototype.initialize = function () {
        this.menu = this.dropdownFilterDropdown(this.dataKey,this.spinner);
        let th = this.th;
        th.appendChild(this.menu);

        
        if(this.sortOnClick){
            $(th).attr('data-sort-on-click',true);
            $(th).attr('data-sort-type','a-to-z');
        }

        var $trigger = $(this.menu.children[0]);
        var $content = $(this.menu.children[1]);
        var $menu = $(this.menu);
        $trigger.click(function () {
            return $content.toggle();
        });
        $(document).click(function (el) {
            if (!$menu.is(el.target) && $menu.has(el.target).length === 0) {
                $content.hide();
            }
        });
    };
    FilterMenu.prototype.searchToggle = function (value) {
        if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = false;
        if (value.length === 0) {
            this.toggleAll(true);
            if (this.selectAllCheckbox instanceof HTMLInputElement) this.selectAllCheckbox.checked = true;
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
        }
    };
    FilterMenu.prototype.selectAllUpdate = function (checked) {
        $(this.searchFilter).val('');
        this.toggleAll(checked);
    };
    FilterMenu.prototype.toggleAll = function (checked) {
        for (var i = 0; i < this.inputs.length; i++) {
            var input = this.inputs[i];
            if (input instanceof HTMLInputElement) input.checked = checked;
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
        this.createSpinner(dropdownFilterItem,this.spinner);
        return dropdownFilterItem;
    };

    FilterMenu.prototype.createSpinner = function (element,spinner) {

        if(spinner.show){
            $(element).append(`<i class='${spinner.icon} search-column-spinner' style='display: none;margin-left: 5px;'></i>`);
        }

    };
    FilterMenu.prototype.hideSpinner = function () {
        $('.search-column-spinner').remove();
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
    FilterMenu.prototype.dropdownFilterContent = function (spinnerSearch) {
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
        var searchFilterDiv = this.dropdownFilterSearch(spinnerSearch);
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

    FilterMenu.prototype.dropdownFilterDropdown = function (dataKey,spinner) {
        var dropdownFilterDropdown = document.createElement('div');
        dropdownFilterDropdown.className = 'dropdown-filter-dropdown';
        dropdownFilterDropdown.setAttribute('data-field-key-header',dataKey);
        var arrow = document.createElement('span');
        arrow.className = 'glyphicon glyphicon-arrow-down dropdown-filter-icon';
        var icon = document.createElement('i');
        icon.className = 'arrow-down';
        arrow.appendChild(icon);
        dropdownFilterDropdown.appendChild(arrow);
        dropdownFilterDropdown.appendChild(this.dropdownFilterContent(spinner));
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
        this.spinner = options.spinner;
        this.ths = target.find('th' + options.columnSelector).toArray();
        this.floatOptions = options.floatOptions;

        this.filterMenus = this.ths.map(function (th, index) {
            var column = $(th).index();
            var columnDataKey = $(th).data('key');
            return new FilterMenu(target, th, column, index, options,columnDataKey);
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
        var filterCollectionContext = this;
        this.target.find('.dropdown-filter-menu-item.item').change(function () {
            var index = $(this).data('index');
            var value = $(this).val();
            filterMenus[index].updateSelectAll();
            updateRowVisibility(filterMenus, rows, ths).then(() => filterCollectionContext.target.trigger('updateTableCompleted',[{type:'checkbox'}]));
        });
    };
    FilterCollection.prototype.bindSelectAllCheckboxes = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        var filterCollectionContext = this;
        this.target.find('.dropdown-filter-menu-item.select-all').change(function () {
            var index = $(this).data('index');
            var value = this.checked;
            filterMenus[index].selectAllUpdate(value);
            updateRowVisibility(filterMenus, rows, ths).then(() => filterCollectionContext.target.trigger('updateTableCompleted',[{type:'checkbox_select_all'}]));
        });
    };
    FilterCollection.prototype.bindSort = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var sort = this.sort;
        var table = this.table;
        var options = this.options;
        var floatOptions = this.floatOptions;
        var updateRowVisibility = this.updateRowVisibility;
        var filterCollectionContext = this;
        this.target.find('.dropdown-filter-sort').click(function () {
            var $sortElement = $(this).find('span');
            var column = $sortElement.data('column');
            var order = $sortElement.attr('class');
            sort(column, order, table, options,floatOptions);
            updateRowVisibility(filterMenus, rows, ths).then(() =>  filterCollectionContext.target.trigger('updateTableCompleted',[{type:'sort'}]));
        });

        if(this.options.sortOnHeaderClick){

            this.target.find('th[data-sort-on-click=true]').click(function(e){


                if(e.target === this ){
                
                    var sortType = $(this).attr('data-sort-type');
                    var $sortElement = $(this).find('span[class='+sortType+']');
                
                    var currentTh = this;
                    var column = $sortElement.data('column');
                    var order = $sortElement.attr('class');
                    sort(column, order, table, options,floatOptions);
                    updateRowVisibility(filterMenus, rows, ths).then(() => {

                        let nextSort = sortType === 'a-to-z' ? 'z-to-a' : 'a-to-z';

                        $(currentTh).attr('data-sort-type',nextSort);

                        filterCollectionContext.target.trigger('updateTableCompleted',[{type:'sort',target:'header'}]);
                    })
                }
            })



        }
    };
    FilterCollection.prototype.bindSearch = function () {
        var filterMenus = this.filterMenus;
        var rows = this.rows;
        var ths = this.ths;
        var updateRowVisibility = this.updateRowVisibility;
        var toggleSpinner = this.toggleSpinner;
        var filterCollectionContext = this;
        this.target.find('.dropdown-filter-search').keyup(function (e) {
            var code = e.keyCode || e.which;
            if (code == 13 || !code) {

                var $input = $(this).find('input');
                var index = $input.data('index');
                var value = $input.val();

                toggleSpinner($(this));
                filterMenus[index].searchToggle(value);
                updateRowVisibility(filterMenus, rows, ths).then((resolve) => {
                    toggleSpinner($($input).parent());

                    filterCollectionContext.target.trigger('updateTableCompleted',[{type:'search'}]);
                });
            }
        });
    };

    FilterCollection.prototype.toggleSpinner = function(element){

        let display = $(element).find('.search-column-spinner').is(':visible') ? 'none' : 'inline-block';

        $(element).parent().find('.search-column-spinner').css('display',display);
    }



    FilterCollection.prototype.updateRowVisibility =async function (filterMenus, rows, ths) {

        return new Promise(function (resolve, reject) {
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

            resolve('updated!');
        });
    };
    FilterCollection.prototype.sort = function (column, order, table, options,floatOptions) {
        var flip = 1;
        
        
        if (order === options.captions.z_to_a.toLowerCase().split(' ').join('-')) flip = -1;
        var tbody = $(table).find('tbody').get(0);
        var rows = $(tbody).find('tr').get();
        var thFilter = $(table).find('th').get(column);
        var dataSort = $(thFilter).data('type-sort')??'normal';

        rows.sort(function (a, b) {

            var childrenA = a.children[column];
            var childrenB = b.children[column];
            var A = childrenA.innerText.toUpperCase();
            var B = childrenB.innerText.toUpperCase();

            /** normal means sort with numbers and strings */

            switch(dataSort){

                case 'normal':
                    if (A < B) return -1 * flip;
                    if (A > B) return 1 * flip;
                break;
                case 'number':
                    if(floatOptions.thousandsSeparator=='.'){

                        A = A.replace('.','');
                        B = B.replace('.','');
                    }
        
                    if(floatOptions.decimalSeparator == ','){
        
                        A = A.replace(',','.');
                        B = B.replace(',','.');
        
                    }
                    
                    if (!isNaN(Number(A)) && !isNaN(Number(B))) {
        
                        A = parseFloat(A);
                        B = parseFloat(B);
        
                        if (Number(A) < Number(B)) return -1 * flip;
                        if (Number(A) > Number(B)) return 1 * flip;
                    }
                break;
                case 'date':
                    var timestampA = undefined;
                    var timestampB = undefined;
    
                    timestampA = Date.parse($(childrenA).data('sort-date'));
                    timestampB = Date.parse($(childrenB).data('sort-date'));
    
                    if (timestampA < timestampB) return -1 * flip;
                    if (timestampA > timestampB) return 1 * flip;
                break;

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
    if (typeof options.spinner === 'undefined') options.spinner = { show:true,icon:'fa fa-spinner fa-spin'};
    if (typeof options.columnSelector === 'undefined') options.columnSelector = '';
    if (typeof options.sort === 'undefined') options.sort = true;
    if (typeof options.search === 'undefined') options.search = true;
    if (typeof options.sortOnHeaderClick === 'undefined') options.sortOnHeaderClick = false;
    if (typeof options.floatOptions === 'undefined') options.floatOptions = {
        decimalSeparator: ',',
        thousandsSeparator: false
    };
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

}(jQuery));
//# sourceMappingURL=excel-bootstrap-table-filter-bundle.js.map
