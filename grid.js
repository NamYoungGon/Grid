(function () {
  const Grid = (function () {
    function Grid(id, options) {
      if (!(this instanceof Grid)) {
        return new Grid(id, options);
      }

      this._init(id, options);
    }

    Grid.extend = function (objs) {
      for (let key in objs) {
        this.prototype[key] = objs[key];
      }
    }

    function createElement(tagName, attr = {}) {
      const element = document.createElement(tagName);
      const { className } = attr;
      if (className) {
        element.className = className;
      }

      return element;
    }

    function getDOMRect(element) {
      return element.getBoundingClientRect();
    }

    HTMLElement.prototype.on = function (event, selector, fn) {
      if (typeof selector === 'function') {
        fn = selector;
        selector = undefined;
      }

      this.addEventListener(event, (e) => {
        const { target } = e;
        if (!selector) {
          if (this === target || this.contains(target)) {
            fn.call(this, e);
          }
        } else {
          const elements = Array.from(this.querySelectorAll(selector));
          let index = elements.indexOf(target);
          if (index > -1) {
            fn.call(elements[index], e);
          } else {
            let result = elements.some((element, i) => {
              index = i;
              return element.contains(target);
            });

            result && fn.call(elements[i], e);
          }
        }
      });
    };

// -------------------------------------------------------------
// Base Functions
// -------------------------------------------------------------
    Grid.extend({
      _init: function (id, options) {
        this.el = {};
        this.data = [];
        this.el.grid = document.getElementById(id);
        this.options = options;
        this._drawBase()._drawCols()._drawHeader()._setHeight()._event();
      },
      _drawBase: function () {
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
        headerStr = columns.reduce((accumulator, { title }) => {
          return accumulator + `<th>${title}</th>`;
        }, headerStr);
        headerStr = `<tr class='tr'>${headerStr}</tr>`;

        el.headerTableHead.innerHTML = headerStr;

        return this;
      },
      _event: function () {
        const { el } = this;
        el.header.on('click', 'th', function (e) {
          console.log('th click');
        });

        return this;
      },
      destroy: function () {

      },
      _setHeight: function () {
        const { options, el } = this;
        let contentHeight = options.height;

        const headerHeight = getDOMRect(el.header).height;
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
      _renderRows: function (rows = this.data) {
        const { el } = this;

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
      }
    });

    return Grid;
  })();

  window.Grid = Grid;
})();