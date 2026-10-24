Ext.define('ZML.column.Date', {

  extend: 'Ext.grid.column.Date',
  alias: 'widget.datecol',
  format: 'd.m.Y H:i:s',
  emptyCellText: '',
  align: 'center',


  initComponent: function ()
  {
    var t = this;
    this.renderer = function (value)
    {
      return (value instanceof Date) ? Ext.util.Format.date(value, t.format) : t.emptyCellText;
    };
    this.callParent(arguments);
  }
});