# Grid

## Template

### Options
- **height**
- **columns**
  - **title**: the column title to be displayed
  - **field**: The unique name of column
  - **width**: the width of the column
  - **dataType**: 'text' / 'number' (default: 'text')
- **sortable**: 'single' / 'multiple'
- **editable**: true / false

### Examples
```js
var grid = new Grid('grid', {
  height: 500,
  columns: [{
    title: 'Title 1',
    field: 'cell1',
    width: 200
  }, {
    title: 'Title 2',
    field: 'cell2',
    dataType: 'number'
  }, {
    title: 'Title 3',
    field: 'cell3',
  }, {
    title: 'Title 4',
    field: 'cell4',
    width: 150
  }, {
    title: 'Title 5',
    field: 'cell5',
    width: 200
  }]
});
```

***

## Method
### addRow(rows[,insertIndex])
- `rows`

***
### getRow()

***
### setCell(rowIndex, field, value)
- `rowIndex`
- `field`
- `value`

