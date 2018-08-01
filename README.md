# Grid

```js
    var grid = new Grid('grid', {
      height: 500,
      sortable: 'single',
      // editable: true,
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

## Template
### options
- **height**
- **columns**
  - **title**: the column title to be displayed
  - **field**: The unique name of column
  - **width**: the width of the column
  - **dataType**: 'text' (default: 'text')
- **sortable**: 'single' / 'multiple'
- **editable**: true / false

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

