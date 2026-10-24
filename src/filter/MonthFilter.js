Ext.define('ZML.filter.MonthFilter', {

  extend: 'Ext.ux.grid.filter.Filter',
  alias: 'gridfilter.month',

  phpMode: true,


  init: function (config)
  {
    this.dt = Ext.create('Ext.util.DelayedTask', this.fireUpdate, this);
  },


  createMenu: function (config)
  {
    var menu = Ext.create('ZML.menu.MonthMenu', config);
    menu.on('checkchange', this.onCheckChange, this);
    return menu;
  },


  getValue: function ()
  {
    return this.menu.getSelected();
  },


  setValue: function (value)
  {
    this.menu.setSelected(value);
    this.fireEvent('update', this);
  },


  isActivatable: function ()
  {
    return this.getValue().length > 0;
  },


  getSerialArgs: function ()
  {
    return { type: 'month', value: this.phpMode ? this.getValue().join(',') : this.getValue() };
  },


  onCheckChange: function ()
  {
    this.dt.delay(this.updateBuffer);
  },


  validateRecord: function (record)
  {
    var valuesArray = this.getValue();
    return Ext.Array.indexOf(valuesArray, record.get(this.dataIndex)) > -1;
  },


});
