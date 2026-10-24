Ext.define('ZML.menu.ListMenu', {

  extend: 'Ext.menu.Menu',

  idField: 'id',
  labelField: 'text',
  loadingText: 'Loading...',
  loadOnShow: true,
  single: false,
  plain: true,
  ignoreParentClicks: true,


  constructor: function (cfg)
  {
    var me = this,
      options,
      i,
      len,
      value;

    me.selected = [];
    me.addEvents('checkchange');

    me.callParent([cfg = cfg || {}]);

    if (!cfg.store && cfg.options)
    {
      options = [];
      for (i = 0, len = cfg.options.length; i < len; i++)
      {
        value = cfg.options[i];
        switch (Ext.type(value))
        {
          case 'array': options.push(value); break;
          case 'object': options.push([value[me.idField], value[me.labelField]]); break;
          case 'string': options.push([value, value]); break;
        }
      }

      me.store = Ext.create('Ext.data.ArrayStore', {
        fields: [me.idField, me.labelField],
        data: options,
        listeners: {
          load: me.onLoad,
          scope: me
        }
      });
      me.loaded = true;
      me.autoStore = true;
    }
    else
    {
      me.add({
        text: me.loadingText,
        iconCls: 'loading-indicator'
      });
      me.store.on('load', me.onLoad, me);
    }
  },

  destroy: function ()
  {
    var me = this,
      store = me.store;

    if (store)
    {
      if (me.autoStore)
      {
        store.destroyStore();
      }
      else
      {
        store.un('unload', me.onLoad, me);
      }
    }
    me.callParent();
  },

  /**
   * Lists will initially show a 'loading' item while the data is retrieved from the store.
   * In some cases the loaded data will result in a list that goes off the screen to the
   * right (as placement calculations were done with the loading item). This adapter will
   * allow show to be called with no arguments to show with the previous arguments and
   * thus recalculate the width and potentially hang the menu from the left.
   */
  show: function ()
  {
    var me = this;
    me.callParent();
    if (me.loadOnShow && !me.loaded && !me.store.loading)
    {
      me.store.load();
    }
  },

  /** @private */
  onLoad: function (store, records)
  {
    var me = this,
      gid, itemValue, i, len,
      listeners = {
        checkchange: me.checkChange,
        scope: me
      };

    Ext.suspendLayouts();
    me.removeAll(true);
    gid = me.single ? Ext.id() : null;
    for (i = 0, len = records.length; i < len; i++)
    {
      itemValue = records[i].get(me.idField);
      me.add(Ext.create('Ext.menu.CheckItem', {
        text: records[i].get(me.labelField),
        group: gid,
        checked: Ext.Array.contains(me.selected, itemValue),
        hideOnClick: true,
        clickHideDelay: 200,
        value: itemValue,
        listeners: listeners
      }));
    }

    me.loaded = true;
    Ext.resumeLayouts(true);
    me.fireEvent('load', me, records);
  },

  /**
   * Get the selected items.
   * @return {Array} selected
   */
  getSelected: function ()
  {
    return this.selected;
  },

  /** @private */
  setSelected: function (value)
  {
    value = this.selected = [].concat(value);

    if (this.loaded)
    {
      this.items.each(function (item)
      {
        item.setChecked(false, true);
        for (var i = 0, len = value.length; i < len; i++)
        {
          if (item.value == value[i])
          {
            item.setChecked(true, true);
          }
        }
      });
    }
  },

  /**
   * Handler for the 'checkchange' event from an check item in this menu
   * @param {Object} item Ext.menu.CheckItem
   * @param {Object} checked The checked value that was set
   */
  checkChange: function (item, checked)
  {
    var value = [];
    this.items.each(function (item)
    {
      if (item.checked)
      {
        value.push(item.value);
      }
    });
    this.selected = value;

    this.fireEvent('checkchange', item, checked);
  }
});
