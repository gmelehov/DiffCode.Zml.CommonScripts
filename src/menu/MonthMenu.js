Ext.define('ZML.menu.MonthMenu', {

  extend: 'Ext.menu.Menu',

  idField: 'id',
  labelField: 'name',
  loadOnShow: true,
  single: false,
  plain: true,

  options: [
    { id: '01', name: 'январь' },
    { id: '02', name: 'февраль' },
    { id: '03', name: 'март' },
    { id: '04', name: 'апрель' },
    { id: '05', name: 'май' },
    { id: '06', name: 'июнь' },
    { id: '07', name: 'июль' },
    { id: '08', name: 'август' },
    { id: '09', name: 'сентябрь' },
    { id: '10', name: 'октябрь' },
    { id: '11', name: 'ноябрь' },
    { id: '12', name: 'декабрь' },
  ],


  constructor: function (cfg)
  {
    var me = this;
    me.selected = [];
    me.addEvents('checkchange');
    me.callParent([cfg = cfg || {}]);

    me.store = Ext.create('Ext.data.ArrayStore', {
      fields: [me.idField, me.labelField],
      data: [].concat(me.options),
      listeners: {
        load: me.onLoad,
        scope: me
      }
    });
    me.loaded = true;
    me.autoStore = true;
  },


  destroy: function ()
  {
    this.store.destroyStore();
    this.callParent();
  },


  show: function ()
  {
    var me = this;
    me.callParent();
    if (me.loadOnShow && !me.loaded && !me.store.loading)
    {
      me.store.load();
    }
  },


  onLoad: function (store, records)
  {
    var me = this;
    var listeners = {
      checkchange: me.checkChange,
      scope: me
    };

    Ext.suspendLayouts();
    me.removeAll(true);
    gid = me.single ? Ext.id() : null;
    me.options.forEach(function (opt)
    {
      me.add(Ext.create('Ext.menu.CheckItem', {
        text: opt[me.labelField],
        group: gid,
        checked: Ext.Array.contains(me.selected, opt[me.idField]),
        hideOnClick: true,
        clickHideDelay: 250,
        value: opt[me.idField],
        listeners: listeners
      }));
    });

    me.loaded = true;
    Ext.resumeLayouts(true);
    me.fireEvent('load', me, records);

  },


  getSelected: function ()
  {
    return this.selected;
  },


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
  },

});