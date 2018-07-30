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
      createElement(tagName, attr = {}) {
        const element = document.createElement(tagName);
        const { className } = attr;
        if (className) {
          element.className = className;
        }

        return element;
      },
      getBoundingClientRect(element) {
        return element.getBoundingClientRect();
      }
    });

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
        this._drawBase()._drawCols()._drawHeader()._setHeight()._event();
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
      _drawBase: function () {
        const { createElement } = Grid;
        const { el } = this;

        const header = el.header = createElement('div', { className: 'grid-header' });
        const headerWrap = el.headerWrap = createElement('div', { className: 'grid-header-wrap' });
        const headerTable = el.headerTable = createElement('table');
        const headerResizeHandle = el.headerResizeHandle = createElement('div', { className: 'resize-handle' });
        const headerTableColgroup = el.headerTableColgroup = createElement('colgroup');
        const headerTableHead = el.headerTableHead = createElement('thead');
        const content = el.content = createElement('div', { className: 'grid-content' });
        const contentTable = el.contentTable = createElement('table');
        const contentTableColgroup = el.contentTableColgroup = createElement('colgroup');
        const contentTableBody = el.contentTableBody = createElement('tbody');

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
      _drawCols: function () {
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
      _drawHeader: function () {
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

        const scrollMove = function (e) {
          headerWrap.scrollLeft = this.scrollLeft;
        }
        
        content.on('scroll', scrollMove);
        
        return this;
      },
      destroy: function () {

      },
      _setHeight: function () {
        const { getBoundingClientRect } = Grid;
        const { options, el } = this;
        let contentHeight = options.height;

        const headerHeight = getBoundingClientRect(el.header).height;
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

        return `<td id='${y}-${field}' class='cell'>${text}</td>`;
      },
      _removeRows: function () {
        const { el } = this;

        el.contentTableBody.innerHTML = '';
      }
    });

    return Grid;
  })();

  _w.Grid = Grid;
})(window);