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

// -------------------------------------------------------------
// Base Functions
// -------------------------------------------------------------
    Grid.extend({
      _init: function (id, options) {
        this.el = {};
        this.el.grid = document.getElementById(id);
        this.options = options;
        this._drawElements()._drawCols()._drawHeader();
      },
      _drawElements: function () {
        const { el } = this;

        const header = el.header = createElement('div', { className: 'grid-header' });
        const headerWrap = el.headerWrap = createElement('div', { className: 'grid-header-wrap' });
        const headerTable = el.headerTable = createElement('table');
        const headerTableColgroup = el.headerTableColgroup = createElement('colgroup');
        const content = el.content = createElement('div', { className: 'grid-content' });
        const contentTable = el.contentTable = createElement('table');
        const contentTableColgroup = el.contentTableColgroup = createElement('colgroup');

        headerTable.appendChild(headerTableColgroup)
        headerWrap.appendChild(headerTable)
        header.appendChild(headerWrap);

        contentTable.appendChild(contentTableColgroup);
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

        el.headerTable.innerHTML = headerStr;
      },
      destroy: function () {

      },
      addRow: function () {
        
      }
    });

    return Grid;
  })();

  window.Grid = Grid;
})();