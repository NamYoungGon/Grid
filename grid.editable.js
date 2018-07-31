(function () {
  const { _createElement } = Grid;

  const cancelEditable = function () {

  }
  
  Grid.prototype.extend({
    _editable: function () {
      const that = this;
      const { el } = this;
      const { content } = el;

      content.on('mouseup', 'td', function (e) {
        const td = this;
        const isEditing = td.classList.contains('editing');
        if (!isEditing) {
          td.classList.add('editing');
          const text = td.textContent;
          const input = _createElement('input', {
            type: 'text'
          });
          input.value = text;
          td.textContent = '';
          td.appendChild(input);
          input.focus();
        }
      }).on('focusout', 'input', function (e) {
        const input = this;
        const td = input.closest('td');
        const isEditing = td.classList.contains('editing');
        let [, rowIndex, fieldName] = td.id.split('-');
        rowIndex = parseInt(rowIndex, 10);
      
        if (isEditing) {
          td.classList.remove('editing');
          const text = input.value;

          that._setData(rowIndex, fieldName, text);
        } 
      })
    }
  });
})();