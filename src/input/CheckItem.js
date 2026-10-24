Ext.define('ZML.input.CheckItem', {

  extend: 'Ext.container.Container',
  alias: 'widget.CheckItem',

  layout: 'hbox',
  width: '100%',
  anchor: '100%',
  margin: 0,
  height: 24,
  border: 0,
  bodyBorder: 0,

  CHECK: null,
  NAME: null,

  plugins: [{ ptype: 'Ripple' }],

  config: {
    citemId: null,
    citemName: null,
    citemDisplay: null,
    citemDescr: null,
    citemValue: null,
    citemActive: null,
  },


  setCitemActive: function (val)
  {
    var oldval = this.getCitemActive();
    this.citemActive = val;
    if (oldval != val)
    {
      this.fireEvent('activeChanged', this, oldval, val);
    };
  },

  setCitemName: function (val)
  {
    if (!this.citemDisplay && this.NAME)
    {
      this.NAME.setValue(val);
    };
  },

  setCitemDisplay: function (val)
  {
    if (val && this.NAME)
    {
      this.NAME.setValue(val);
    };
  },


  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    me.initConfig(config);
    me.callParent(arguments);

    me.addEvents('created', 'activeChanged', 'click');
    me.on({
      created: me.OnCreated,
      activeChanged: me.OnActiveChanged,
      click: me.OnClick,
      beforerender: me.OnBeforeRender,
      afterrender: me.OnAfterRender,
      scope: me
    });

    me.fireEvent('created', me);
  },


  OnCreated: function (obj)
  {

  },


  OnBeforeRender: function (obj)
  {
    var me = this;

    me.CHECK = Ext.create('Ext.form.field.Checkbox', {
      ITEM: me,
      itemId: me.itemId + '-toggleActive',
      width: 24,
      height: 24,
      margin: '0 2 0 5',
      checked: me.getCitemActive(),
      listeners: {
        change: function ()
        {
          var val = this.getValue();
          this.ITEM.setCitemActive(val);
        }
      }
    });

    me.NAME = Ext.create('Ext.form.field.Display', {
      ITEM: me,
      itemId: me.itemId + '-name',
      margin: '0 5 0 0',
      anchor: '100%',
      width: '100%',
      flex: 1,
      height: 24,
      value: me.citemDisplay || me.citemName,
    });

    me.add(me.CHECK);
    me.add(me.NAME);
  },


  OnAfterRender: function (obj)
  {
    var me = this;
    me.CHECK.setValue(me.citemActive);
    me.el.dom.onclick = function ()
    {
      if (!me.CHECK.isDisabled())
      {
        me.RIPPLE.ripple();
        me.ToggleActive();
      };
    };
    //Ext.tip.QuickTipManager.register({ target: me.getId(), text: me.citemDescr });
  },


  OnActiveChanged: function (obj, oldvalue, newvalue)
  {

  },


  OnClick: function (obj)
  {
    obj.ToggleActive();
  },




  ToggleActive: function ()
  {
    var me = this;
    var currstatus = me.getCitemActive();
    me.CHECK.setValue(!currstatus);
    me.up('CheckList').computeValue(me);
  },

});