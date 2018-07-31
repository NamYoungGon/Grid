(function (_w) {
  const Grid = (function () {
    function Grid(id, options) {
      if (!(this instanceof Grid)) {
        return new Grid(id, options);
      }

      this._init(id, options);
    }

    Grid.extend = Grid.prototype.extend = function (objs) {
      for (let key in objs) {
        this[key] = objs[key];
      }
    }

    Grid.extend({
      _createElement(tagName, attr = {}) {
        const element = document.createElement(tagName);
        for (let name in attr) {
          element[name] = attr[name];
        }

        return element;
      },
      _getBoundingClientRect(element) {
        return element.getBoundingClientRect();
      },
      _getElement: function (domain, query) {
        return domain.querySelector(query);
      },
    });

    const g = Grid;

// -------------------------------------------------------------
// Base Functions
// -------------------------------------------------------------
    Grid.prototype.extend({
      _init: function (id, options) {
        this.el = {};
        this.data = [];
        this.el.grid = document.getElementById(id);
        this.options = options;
        this._initColumns();
        this._renderBase()._renderCols()._renderHeader()._setHeight()._event();
      },
      _initColumns: function () {
        const columns = this.options.columns;
        columns.map = {};
        columns.forEach(function (column) {
          column.dataType = column.dataType || 'text';
          column.sortType = 'basic';
          columns.map[column.field] = column;
        });

        return this;
      },
      _renderBase: function () {
        const { _createElement } = g;
        const { el, options } = this;
        const { editable } = options;

        const header = el.header = _createElement('div', { className: 'grid-header' });
        const headerWrap = el.headerWrap = _createElement('div', { className: 'grid-header-wrap' });
        const headerTable = el.headerTable = _createElement('table');
        const headerResizeHandle = el.headerResizeHandle = _createElement('div', { className: 'resize-handle' });
        const headerTableColgroup = el.headerTableColgroup = _createElement('colgroup');
        const headerTableHead = el.headerTableHead = _createElement('thead');
        const content = el.content = _createElement('div', { className: `grid-content${editable ? ' editable' : ''}` });
        const contentTable = el.contentTable = _createElement('table');
        const contentTableColgroup = el.contentTableColgroup = _createElement('colgroup');
        const contentTableBody = el.contentTableBody = _createElement('tbody');

        headerTable.appendChild(headerTableColgroup);
        headerTable.appendChild(headerTableHead);
        headerWrap.appendChild(headerTable);
        headerWrap.appendChild(headerResizeHandle);
        header.appendChild(headerWrap);

        contentTable.appendChild(contentTableColgroup);
        contentTable.appendChild(contentTableBody);
        content.appendChild(contentTable);

        el.grid.appendChild(header);
        el.grid.appendChild(content);

        return this;
      },
      _renderCols: function () {
        const { options, el } = this;
        const { columns } = options;

        let columnStr = '';
        columnStr = columns.reduce((accumulator, { width }) => {
          let style = width !== undefined ? ` style="width: ${width}px;" ` : '';
          return accumulator + `<col${style}></col>`;
        }, columnStr);

        el.headerTableColgroup.innerHTML = columnStr;
        el.contentTableColgroup.innerHTML = columnStr;

        return this;
      },
      _renderHeader: function () {
        const { options, el } = this;
        const { columns } = options;

        let headerStr = '';
        headerStr = columns.reduce((accumulator, { title, field }, i) => {
          return accumulator + `<th data-field=${field}>${title}</th>`;
        }, headerStr);
        headerStr = `<tr class='tr'>${headerStr}</tr>`;

        el.headerTableHead.innerHTML = headerStr;

        return this;
      },
      _event: function () {
        const { el } = this;
        const { headerWrap , content } = el;

        this._columnResize();
        this._columnSort();
        this._editable();

        const scrollMove = function (e) {
          headerWrap.scrollLeft = this.scrollLeft;
        }
        
        content.on('scroll', scrollMove);
        
        return this;
      },
      destroy: function () {

      },
      _setHeight: function () {
        const { options, el } = this;
        let contentHeight = options.height;

        const headerHeight = g._getBoundingClientRect(el.header).height;
        contentHeight -= headerHeight;
        this.el.headerResizeHandle.style.height = `${headerHeight}px`;
        this.el.content.style.height = `${contentHeight}px`;

        return this;
      },
      addRows: function (rows) {
        const { el } = this;
        this.data = this.data.concat(rows);
        this._renderRows(rows);
      },
      _renderRows: function (rows) {
        const { el } = this;

        rows = rows || this.data.displayData || this.data;

        let rowsStr = '';
        rows.forEach((row, i) => {
          rowsStr += this._renderRow(row, i);
        })

        el.contentTableBody.insertAdjacentHTML('beforeend', rowsStr);
      },
      _renderRow: function (row, y) {
        const { columns } = this.options;

        let rowStr = '';
        rowStr = columns.reduce((accumulator, { field }) => {
          return accumulator + this._renderCell({
            field,
            y,
            text: row[field],
          });
        }, rowStr);

        rowStr = `<tr class='row'>${rowStr}</tr>`;

        return rowStr;
      },
      _renderCell: function (args) {
        const {
          text,
          y,
          field
        } = args;

        return `<td id='grid-${y}-${field}' class='cell'>${text}</td>`;
      },
      _removeRows: function () {
        const { el } = this;

        el.contentTableBody.innerHTML = '';
      },
      _setData: function (rowIndex, fieldName, value) {
        let { data } = this;

        data = data.displayData || data;
        data[rowIndex][fieldName] = value;
        this._setCell(rowIndex, fieldName, value)

        return true;
      },
      _setCell: function (rowIndex, fieldName, value, td) {
        const { el } = this;
        const { contentTable } = el;
        td = td || g._getElement(contentTable, `#grid-${rowIndex}-${fieldName}`);
        td.textContent = value;

        return true;
      },
      setData: function (rowIndex, fieldName, value) {
        this._setData(rowIndex, fieldName, value);
      },
    });

    return Grid;
  })();

  _w.Grid = Grid;
})(window);