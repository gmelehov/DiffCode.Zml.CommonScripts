Ext.define('ZML.column.Combo', {

  extend: 'Ext.grid.Column',
  alias: 'widget.ComboColumn',


  initComponent: function ()
  {   
    this.callParent(arguments);
  },


  listeners: {
    afterrender: function ()
    {
      // Detect if there is an editor and if it at least extends a combobox, otherwise just treat it as a normal column and render the value itself
      this.renderer = (this.getEditor() && this.getEditor().triggerAction) ? this.Renderer(this.getEditor()) : function (value)
      {
        return value;
      };
    },
  },


  Renderer: function (combo)
  {
    var me = this;

    var getValue = function (value)
    {
      var idx = combo.store.find(combo.valueField, value);
      var rec = combo.store.getAt(idx);
      if (rec)
      {
        return rec.get(combo.displayField);
      };
      return value;
    };

    return function (value)
    { /* If we are trying to load the displayField from a store that is not loaded, add a single listener to the combo store's load event to refresh the grid view */
      if (combo.store.getCount() == 0 && gridId)
      {
        combo.store.on('load', function ()
        {
          var grid = me.up('grid');
          if (grid)
          {
            grid.getView().refresh();
          }
        }, {
          single: true
        });
        return value;
      };
      return getValue(value);
    };
  }

});