/** ИКОНКА ИНСТРУМЕНТА */
Ext.define('ZML.Tool', {

  extend: 'Ext.Component',
  alias: 'widget.Tool',

  isTool: true,
  icon: null,
  baseCls: Ext.baseCSSPrefix + 'fdltool',
  disabledCls: Ext.baseCSSPrefix + 'fdltool-disabled',
  toolPressedCls: Ext.baseCSSPrefix + 'fdltool-pressed',
  toolOverCls: Ext.baseCSSPrefix + 'fdltool-over',
  height: 24,
  width: 24,

  renderTpl: [
    '<span id="{id}-toolEl" class="material-icons {baseCls}-{icon}">{icon}</span>'
  ],

  stopEvent: true,


  initComponent: function ()
  {
    var me = this;
    me.addEvents('click');
    Ext.applyIf(me.renderData, {
      baseCls: me.baseCls,
      icon: me.icon
    });
    me.tooltip = me.tooltip || me.qtip;
    me.callParent();
  },


  afterRender: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.el.on({
      click: me.onClick,
      mousedown: me.onMouseDown,
      mouseover: me.onMouseOver,
      mouseout: me.onMouseOut,
      scope: me
    });

    if (me.tooltip)
    {
      if (Ext.quickTipsActive && Ext.isObject(me.tooltip))
      {
        Ext.tip.QuickTipManager.register(Ext.apply({ target: me.id }, me.tooltip));
      }
      else
      {
        var attr = me.tooltipType == 'qtip' ? 'data-qtip' : 'title';
        me.el.dom.setAttribute(attr, me.tooltip);
      }
    }
  },


  getFocusEl: function ()
  {
    return this.el;
  },


  setType: function (type)
  {
    var me = this;
    var oldType = me.icon;

    me.icon = type;
    if (me.rendered)
    {
      if (oldType)
      {
        me.toolEl.removeCls(me.baseCls + '-' + oldType);
      };
      me.toolEl.addCls(me.baseCls + '-' + type);
    }
    else
    {
      me.renderData.icon = type;
    }
    return me;
  },



  onClick: function (e, target)
  {
    var me = this;

    if (me.disabled)
    {
      return false;
    };

    me.el.removeCls(me.toolPressedCls);
    me.el.removeCls(me.toolOverCls);

    if (me.stopEvent !== false)
    {
      e.stopEvent();
    };

    if (me.handler)
    {
      Ext.callback(me.handler, me.scope || me, [e, target, me.ownerCt, me]);
    }
    else if (me.callback)
    {
      Ext.callback(me.callback, me.scope || me, [me.toolOwner || me.ownerCt, me, e]);
    };
    me.fireEvent('click', me, e);
    return true;
  },


  onDestroy: function ()
  {
    var me = this;

    if (Ext.quickTipsActive && Ext.isObject(me.tooltip))
    {
      Ext.tip.QuickTipManager.unregister(me.id);
    };

    if (me.keyMap)
    {
      me.keyMap.destroy();
    };
    delete me.toolOwner;
    me.callParent();
  },


  /**
   * Called when the user presses their mouse button down on a tool
   * Adds the press class ({@link #toolPressedCls})
   * @private
   */
  onMouseDown: function ()
  {
    if (this.disabled)
    {
      return false;
    };
    this.el.addCls(this.toolPressedCls);
  },


  /**
   * Called when the user rolls over a tool
   * Adds the over class ({@link #toolOverCls})
   * @private
   */
  onMouseOver: function ()
  {
    if (this.disabled)
    {
      return false;
    };
    this.el.addCls(this.toolOverCls);
  },


  /**
   * Called when the user rolls out from a tool.
   * Removes the over class ({@link #toolOverCls})
   * @private
   */
  onMouseOut: function ()
  {
    this.el.removeCls(this.toolOverCls);
    this.el.removeCls(this.toolPressedCls);
  }
});
