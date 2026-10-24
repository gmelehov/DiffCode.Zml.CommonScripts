Ext.define('ZML.column.Number', {

  extend: 'Ext.grid.column.Number',
  alias: 'widget.numbercol',
  format: '0',
  width: 50,
  align: 'center',


  initComponent: function ()
  {
    var t = this;
    if (!this.renderer)
    {
      this.renderer = function (value)
      {
        if (!value && !t.format)
        {
          return '';
        };
        if (value !== undefined && value !== null)
        {
          return Ext.util.Format.number(value, t.format);
        };
      };
    };
    this.callParent(arguments);
  }
});