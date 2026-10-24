Ext.define('{{APP_NS}}.CSSColor', {

  extend: 'Ext.Component',
  xtype: 'csscolor',

  mixins: {
    observable: 'Ext.util.Observable',
  },

  color: null,

  config: {
    hue: null,
    sat: null,
    light: null,
    alpha: null,
  },


  setHue: function (value)
  {
    var oldvalue = this.getHue();
    if (+value >= 0 && +value <= 360)
    {
      this.hue = value;
      if (oldvalue !== value)
      {
        this.fireEvent('changed', this);
      };
    };    
  },

  setSat: function (value)
  {
    var oldvalue = this.getSat();
    if (+value >= 0 && +value <= 100)
    {
      this.sat = value;
      if (oldvalue !== value)
      {
        this.fireEvent('changed', this);
      };
    };
  },

  setLight: function (value)
  {
    var oldvalue = this.getLight();
    if (+value >= 0 && +value <= 100)
    {
      this.light = value;
      if (oldvalue !== value)
      {
        this.fireEvent('changed', this);
      };
    };
  },

  setAlpha: function (value)
  {
    var oldvalue = this.getAlpha();
    if (+value >= 0 && +value <= 1)
    {
      this.alpha = value;
      if (oldvalue !== value)
      {
        this.fireEvent('changed', this);
      };
    };
  },



  initComponent: function (config)
  {
    var me = this;
    me.initConfig(config);
    me.callParent(arguments);

    me.mixins.observable.constructor.call(me, config);
    me.addEvents('changed');

    me.on({
      changed: me.OnChanged,
      enable: me.OnEnable,
      scope: me
    });
  },


  OnChanged: function (obj)
  {
    if (obj && typeof obj.Compute === 'function' && obj.hue != null && obj.sat != null && obj.light != null && obj.alpha != null)
    {
      obj.color = obj.Compute();
      Ext.Function.defer(obj.OnAfterChanged, 0, obj, arguments);
    };
  },


  OnAfterChanged: function ()
  {
    
  },


  OnEnable: function ()
  {
    this.OnChanged(this);
  },


  Compute: function ()
  {
    var me = this;
    var h = me.getHue().toString();
    var s = me.getSat() + '%';
    var l = me.getLight() + '%';
    var a = me.getAlpha().toString();
    return 'hsla(' + h + ', ' + s + ', ' + l + ', ' + a + ')';
  },

});