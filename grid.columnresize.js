(function () {
  const { _getBoundingClientRect } = Grid;

  Grid.prototype.extend({
    _columnResize: function () {
      const { el } = this;
      const { 
        grid, 
        headerResizeHandle, 
        header, 
        headerTable,
        headerTableColgroup, 
        content,
        contentTable,
        contentTableColgroup ,
      } = el;
      const handleSize = 9;
      const minWidth = 5;
      let handleTh = null;
      let isDown = false;
      let handleObj = null;
  
      const setHandlePosition = function () {
        // resizing 경우 return false;
        if (handleObj)
          return false;
  
        let thRight = _getBoundingClientRect(this).right;
        let gridLeft = _getBoundingClientRect(grid).left;
        let scrollLeft = content.scrollLeft;
        let handleLeft = thRight - gridLeft - handleSize + scrollLeft;
        handleTh = this;
        headerResizeHandle.style.setProperty('left', handleLeft + 'px'); 
      }
  
      const setColWidth = function (index, width, diff) {
        headerTableColgroup.childNodes[index].style.setProperty('width', `${width}px`);
        contentTableColgroup.childNodes[index].style.setProperty('width', `${width}px`);
  
        let tableWidth = _getBoundingClientRect(headerTable).width;
        let newTableWidth = tableWidth + diff;
        headerTable.style.setProperty('width', `${newTableWidth}px`);
        contentTable.style.setProperty('width', `${newTableWidth}px`);
      };
  
      el.header.on('mouseover', 'th', function (e) {
        setHandlePosition.call(this);
      });
  
      headerResizeHandle.on('pointerdown', function (e) {
        const { pageX } = e;
        handleObj = {
          pageX
        };
  
        grid.classList.add('column-resizing');
      });
  
      document.addEventListener('pointermove', function (e) {
        if (e.pressure === 0 || !handleObj) {
          if (handleObj) {
            handleObj = null;
            grid.classList.remove('column-resizing');
          }
  
          return false;
        }
  
        const { pageX } = e;
        let diff = pageX - handleObj.pageX;
  
        if (diff !== 0) {
          let thIndex = handleTh.cellIndex;
          let thWidth =  this._getColumn('col', thIndex).header.style.width || _getBoundingClientRect(handleTh).width;
          thWidth = parseInt(thWidth, 10);
          let newWidth = thWidth + diff;
  
          if (thWidth === minWidth && diff < 0)
            return false;
  
          if (newWidth < minWidth) {
            newWidth = minWidth;
            diff = diff + minWidth - newWidth;
          }
  
          setColWidth(thIndex, newWidth, diff);
          handleObj.pageX = pageX;
        }      
      }.bind(this));
    }
  });
})()