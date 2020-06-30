var RepeaterEventArgs = function (row, item, index, deletedRows = null) {
    this.currentRow = row;
    this.currentIndex = index;
    this.currentItem = item;
    this.deletedRows = deletedRows;
};