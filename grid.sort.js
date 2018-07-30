(function () {
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

  const sort = function (data, fieldName, sortType, fn) {
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
    sort: function (fieldName, sortType) {
      const { data, options } = this;
      const { columns } = options;
      let displayData = data.displayData = data.displayData || data.slice();
      const column = columns.map[fieldName];
      let dataType = column.dataType;

      if (!sortType) {
        sortType = column.sortType === 'basic' ? 'asc' : column.sortType === 'asc' ? 'desc' : 'basic';
      }

      if (sortType !== 'basic') {
        if (dataType === 'number') {
          sort(displayData, fieldName, sortType, numberSorting);
        } else {
          sort(displayData, fieldName, sortType, notNumberSorting);
        }
      } else {
        delete data.displayData;
      }

      column.sortType = sortType;
      this._removeRows();
      this._renderRows();
    }
  });
})()
