/** 
 * КНОПКА 
 * @alias Button
 * @manager ZML.ButtonMgr
 * @registration afterrender
 */
Ext.define('ZML.button.Button', {

  extend: 'Ext.button.Button',
  alias: 'widget.Button',

  targetId: null,
  call: null,
  iconSet: 'mat-icons',
  color: null,
  __icon: null,
  __cls: '',



  listeners: {
    render: function ()
    {
      var me = this;
      me.ComputeIcon();
      me.ComputeColor();
    },
    afterrender: function ()
    {
      GLOBAL[this.AppNAME].Button.register(this);
    }
  },


  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  initComponent: function ()
  {
    this.callParent(arguments);

    //GLOBAL[this.AppNAME].Button.register(this);
    //window[this.AppNAME][this.AppPROP].MGR.Button.register(this);
  },


  handler: function (item, evt)
  {
    item.OnHandlerCall(item, evt);
    if (typeof this.ApiOnAfterClick === 'function')
    {
      Ext.Function.defer(this.ApiOnAfterClick, 0, this, arguments);
    };
  },


  ComputeIcon: function ()
  {
    var me = this;
    var spanImg = me.el.dom.querySelector('span[role=img]') || me.el.dom.querySelector('span.x-btn-icon-el');

    if (me.cls)
    {
      me.cls.split(' ').forEach(function (f) { me.removeCls(f); });
    };

    me.addCls(me.__cls);

    if (!me.text)
    {
      me.addCls('logx-icon-btn');
    }
    else
    {
      me.addCls('logx-small-btn');
    };

    if (!me.__icon)
    {
      me.addCls('no-icon');
    };
    if (me.iconSet)
    {
      me.addCls(me.iconSet);
    };
    if (me.__icon)
    {
      switch (me.iconSet)
      {
        case 'fa': me.setIconCls(me.__icon); break;
        case 'mat-icons': spanImg.textContent = me.__icon; break;

        default: break;
      };
    };
  },


  ComputeColor: function ()
  {
    var me = this;
    var spanImg = me.el.dom.querySelector('span[role=img]') || me.el.dom.querySelector('span.x-btn-icon-el');

    if (me.color)
    {
      if (me.color && me.color.startsWith('#'))
      {
        if (spanImg)
        {
          spanImg.style.color = me.color;
        };
      };
      if (/^[0-9]+.*%$/.test(me.color))
      {
        if (spanImg)
        {
          spanImg.style.color = 'hsla(' + me.color + ',1)';
        };
      };
      if (/^[0-9]+.*[^%]$/.test(me.color))
      {
        if (spanImg)
        {
          spanImg.style.color = 'hsla(' + me.color + ')';
        };
      };
      if (/^[a-z]+/.test(me.color))
      {
        if (me.color && me.color.startsWith('color-'))
        {
          me.setIconCls(me.iconCls + ' ' + me.color);
        }
        else
        {
          me.setIconCls(me.iconCls + ' color-' + me.color);
        };
      };
    };
  },


  OnHandlerCall: function (item, evt)
  {

  },


  ApiOnAfterClick: null,

});
