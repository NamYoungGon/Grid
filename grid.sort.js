(function () {
  const { _getElement } = Grid;

  const comparator = function (fn) {
    return (a, b, sortType) => {
      return fn(a, b, sortType);
    }
  }

  const sortNumber = function (d1, d2, sortType) {
    if (sortType === 'asc')
      return d1 - d2;
    else 
      return d2 - d1;
  }

  const sortNotNumber = function (d1, d2, sortType) {
    if (sortType === 'asc') {
      return d1 > d2 ? 1 : d1 < d2 ? -1 : 0
    } else {
      return d1 > d2 ? -1 : d1 < d2 ? 1 : 0
    }
  }

  const numberSorting = comparator(sortNumber);
  const notNumberSorting = comparator(sortNotNumber);

  const sort = function (data, fieldName, sortType, dataType) {
    const fn = dataType === 'number' ? numberSorting : notNumberSorting;

    data.sort(function (a, b) {
      const d1 = a[fieldName];
      const d2 = b[fieldName];

      return fn(d1, d2, sortType);
    });
  }

  Grid.prototype.extend({
    _columnSort: function () {
      const that = this;
      const { el } = this;
      const { headerTable } = el;

      headerTable.on('click', 'th', function () {
        const fieldName = this.dataset.field;
        that.sort(fieldName);
      });
    },
    _clearSortDisplay: function () {
      const { el } = this;
      const { headerTable } = el;

      const sortedTh = _getElement(headerTable, `[data-sort]`);
      if (sortedTh) {
        sortedTh.classList.remove('sorted');
        delete sortedTh.dataset.sort;
      }
    },
    _applySortDisplay: function (fieldName, sortType) {
      const { el } = this;
      const { headerTable } = el;

      const th = _getElement(headerTable, `[data-field=${fieldName}]`);
      th.classList.add('sorted');
      th.dataset.sort = sortType;
    },
    sort: function (fieldName, sortType) {
      const { data, options, el } = this;
      const { columns } = options;
      const { headerTable } = el;
      let displayData = data.displayData = data.displayData || data.slice();
      const column = columns.map[fieldName];
      let dataType = column.dataType;

      sortType = sortType || (column.sortType === 'basic' ? 'asc' : column.sortType === 'asc' ? 'desc' : 'basic');
      
      this._clearSortDisplay();

      if (sortType !== 'basic') {
        sort(displayData, fieldName, sortType, dataType);
        this._applySortDisplay(fieldName, sortType);
      } else {
        delete data.displayData;
      }

      column.sortType = sortType;
      this._removeRows();
      this._renderRows();
    }
  });
})()
