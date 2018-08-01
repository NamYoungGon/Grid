(function () {
  const g = Grid;

  Grid.prototype.extend({
    _editable: function () {
      const that = this;
      const { el, status } = this;
      const { content } = el;
      const { down, up } = status.selected;

      content.on('mouseup', 'td', function (e) {
        const td = this;
        const isEditing = td.classList.contains('editing');
        if (!isEditing && down.rowIndex === up.rowIndex && down.field === up.field) {
          td.classList.add('editing');
          const value = td.textContent;
          const input = g._createElement('input', {
            type: 'text'
          });
          input.value = value;
          td.textContent = '';
          td.appendChild(input);
          input.focus();
        }
      }).on('focusout', 'input', function (e) {
        const input = this;
        const td = input.closest('td');
        const isEditing = td.classList.contains('editing');
        const { rowIndex, field } = g._getCellPos(td.id);
      
        if (isEditing) {
          td.classList.remove('editing');
          const value = input.value;
          const prevValue = that.getCell(rowIndex, field);
          td.textContent = prevValue;

          if (value !== prevValue) {
            if (that.onChange) {
              let result = that.onChange.call(null, {
                rowIndex,
                field,
                prevValue,
                value
              });
  
              if (result === false)
                return true;
            }
  
            that._setData(rowIndex, field, value);
  
            that.onChanged && that.onChanged.call(null, {
              rowIndex,
              field,
              value
            });
          }
        } 
      })
    }
  });
})();