Ext.define('ZML.plugin.ColorManager', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.ColorManager',

  mixins: {
    observable: 'Ext.util.Observable',
  },

  MENU: null,


  config: {

    /** Цвет текста заголовка для управляемого плагином элемента */
    titleColor: null,

    /** Цвет фона заголовка для управляемого плагином элемента */
    titleBackColor: null,

    /** Цвет фона содержимого для управляемого плагином элемента */
    bodyBackColor: null,

  },


  setTitleColor: function (value)
  {
    this.titleColor = value;
    this.UpdateTitleColor();
  },

  setTitleBackColor: function (value)
  {
    this.titleBackColor = value;
    this.UpdateTitleBackColor();
  },

  setBodyBackColor: function (value)
  {
    this.bodyBackColor = value;
    this.UpdateBodyBackColor();
  },


  init: function (comp)
  {
    var me = this;
    comp.COLOR_MAN = me;

    var conf = {
      titleColor: me.titleColor,
      titleBackColor: me.titleBackColor,
      bodyBackColor: me.bodyBackColor,
      showTool: me.showTool,
    };


    me.callParent(arguments);
    me.mixins.observable.constructor.call(me, conf);
    me.addEvents('colorsInitDone');

    me.on({
      colorsInitDone: me.OnColorsInitDone,
      scope: me
    });



    comp.on('afterrender', function (obj)
    {
      if (me.showTool === 'true')
      {
        if (obj.header && obj.title && !obj.tools.find(function (f) { return f.itemId == (obj.itemId + '-colorManTlbToggler') }))
        {
          obj.addTool({
            type: 'gear',
            itemId: obj.itemId + '-colorManTlbToggler',
            HOST: obj,
            callback: function (owner, tool, ev)
            {
              tool.HOST.COLOR_MAN.ShowMenu(ev);
            }
          });
        }
        else if (comp.tabBar && !comp.tabBar.tools.find(function (f) { return f.itemId == (comp.itemId + '-colorManTlbToggler') }))
        {
          comp.tabBar.add({ xtype: 'tbfill', flex: 1 });
          comp.tabBar.addTool({
            type: 'gear',
            itemId: comp.itemId + '-colorManTlbToggler',
            HOST: comp,
            callback: function (owner, tool, ev)
            {
              tool.HOST.COLOR_MAN.ShowMenu(ev);
            }
          });
        };
      };

      comp.COLOR_MAN.MENU = comp.COLOR_MAN.ComposeMenu();
      //comp.UpdateTitleBackColor();
      //comp.UpdateTitleColor();
      //comp.UpdateBodyBackColor();
    });


    me.InitColors();

  },


  OnColorsInitDone: function (obj)
  {
    obj.UpdateTitleBackColor();
    obj.UpdateTitleColor();
    obj.UpdateBodyBackColor();
  },



  UpdateTitleBackColor: function ()
  {
    var me = this;
    var check = !!me.cmp.header && !!me.cmp.header.el && !!me.cmp.header.el.dom && !!me.titleBackColor;
    if (!!check)
    {
      me.cmp.header.el.dom.style.setProperty('background-color', me.Colors[me.titleBackColor].color);
    }
    else if (!!me.cmp.tabBar)
    {
      me.cmp.tabBar.el.dom.style.setProperty('background-color', me.Colors[me.titleBackColor].color);
    };
  },


  UpdateTitleColor: function ()
  {
    var me = this;
    var check = !!me.cmp.header && typeof me.cmp.header.query === 'function' && !!me.titleColor;
    if (!!check && !!me.cmp.header.query('*[ariaRole=heading]')[0].textEl)
    {
      me.cmp.header.query('*[ariaRole=heading]')[0].textEl.el.dom.style.setProperty('color', me.Colors[me.titleColor].color);
    }
    else if (!!me.cmp.tabBar)
    {
      Ext.Array.from(me.cmp.tabBar.el.dom.querySelectorAll('.x-tab-inner')).forEach(function (f)
      {
        f.style.setProperty('color', me.Colors[me.titleColor].color);
      });
    };
  },


  UpdateBodyBackColor: function ()
  {
    var me = this;
    var check = typeof me.cmp.setBodyStyle === 'function' && !!me.bodyBackColor;
    if (!!check)
    {
      me.cmp.setBodyStyle('background-color', me.Colors[me.bodyBackColor].color);
    };
  },







  ComposeMenu: function ()
  {
    var me = this;

    var colormenuitems1 = Ext.Object.getKeys(me.Colors).map(function (m)
    {
      return {
        xtype: 'menucheckitem',
        text: m,
        checked: me.getTitleBackColor() == m,
        handler: function (it)
        {
          it.parentMenu.UncheckAll();
          it.parentMenu.parentMenu.HOST.setTitleBackColor(it.text);
          it.setChecked(true);
        }
      };
    });
    var colormenuitems2 = Ext.Object.getKeys(me.Colors).map(function (m)
    {
      return {
        xtype: 'menucheckitem',
        text: m,
        checked: me.getTitleColor() == m,
        handler: function (it)
        {
          it.parentMenu.UncheckAll();
          it.parentMenu.parentMenu.HOST.setTitleColor(it.text);
          it.setChecked(true);
        }
      };
    });
    var colormenuitems3 = Ext.Object.getKeys(me.Colors).map(function (m)
    {
      return {
        xtype: 'menucheckitem',
        text: m,
        checked: me.getBodyBackColor() == m,
        handler: function (it)
        {
          it.parentMenu.UncheckAll();
          it.parentMenu.parentMenu.HOST.setBodyBackColor(it.text);
          it.setChecked(true);
        }
      };
    });

    var menu = new Ext.menu.Menu({
      id: me.cmp.itemId + '-ColorManMenu',
      animCollapse: true,
      allowOtherMenus: true,
      defaults: { clickHideDelay: 200 },
      HOST: me,
      plain: true,
      ignoreParentClicks: true,
      menutarget: 'titleBodyColor',
      items: [
        {
          itemId: 'Item1',
          text: 'Цвет фона заголовка',
          clickHideDelay: 50,
          //plain: true,
          menu: {
            animCollapse: true,
            plain: true,
            defaults: { clickHideDelay: 200 },
            items: colormenuitems1,
            UncheckAll: function ()
            {
              this.query('menucheckitem[checked=true]').forEach(function (f) { f.setChecked(false); });
            }
          }
        },
        {
          itemId: 'Item2',
          text: 'Цвет текста заголовка',
          clickHideDelay: 50,
          //plain: true,
          menu: {
            animCollapse: true,
            plain: true,
            defaults: { clickHideDelay: 200 },
            items: colormenuitems2,
            UncheckAll: function ()
            {
              this.query('menucheckitem[checked=true]').forEach(function (f) { f.setChecked(false); });
            }
          }
        },
        {
          itemId: 'Item3',
          text: 'Цвет фона содержимого',
          clickHideDelay: 50,
          //plain: true,
          menu: {
            animCollapse: true,
            plain: true,
            defaults: { clickHideDelay: 200 },
            items: colormenuitems3,
            UncheckAll: function ()
            {
              this.query('menucheckitem[checked=true]').forEach(function (f) { f.setChecked(false); });
            }
          }
        }
      ]
    });

    return menu;
  },


  ShowMenu: function (ev)
  {
    var toolCont = this.cmp.header || this.cmp.tabBar;
    this.MENU.showAt(ev.getXY());
    this.MENU.alignTo(toolCont, 'tr-br', [-5, -5], false);
  },


  InitColors: function ()
  {
    var me = this;
    Ext.Object.getKeys(me.Colors).forEach(function (cc)
    {
      var c = me.Colors[cc];
      if (c.color === undefined && typeof c.Compute !== 'function')
      {
        var csscolor = Ext.create('ZML.CSSColor', c);
        csscolor.enable();
        me.Colors[cc] = csscolor;
      };
    });

    setTimeout(function () { me.fireEvent('colorsInitDone', me) }, 50);
  },


  Colors: {
    black: { hue: 0, sat: 0, light: 0, alpha: 1 },
    white: { hue: 0, sat: 0, light: 100, alpha: 1 },
    transparent: { hue: 0, sat: 0, light: 0, alpha: 0 },
    darkopaque: { hue: 0, sat: 0, light: 0, alpha: 0.1 },
    lightopaque: { hue: 0, sat: 0, light: 100, alpha: 0.1 },
    darkred: { hue: 0, sat: 90, light: 30, alpha: 1 },
    red: { hue: 0, sat: 52, light: 44, alpha: 1 },
    lightred: { hue: 0, sat: 42, light: 60, alpha: 1 },
    darkgrey: { hue: 0, sat: 0, light: 28, alpha: 1 },
    grey: { hue: 0, sat: 0, light: 50, alpha: 1 },
    cleargrey: { hue: 0, sat: 0, light: 82, alpha: 1 },
    lightgrey: { hue: 0, sat: 0, light: 88, alpha: 1 },
    slightgrey: { hue: 0, sat: 0, light: 92, alpha: 1 },
    palegrey: { hue: 0, sat: 0, light: 96, alpha: 1 },
    darkbrown: { hue: 38, sat: 96, light: 22, alpha: 1 },
    brown: { hue: 38, sat: 40, light: 35, alpha: 1 },
    lightbrown: { hue: 38, sat: 22, light: 52, alpha: 1 },
    yellow: { hue: 46, sat: 70, light: 52, alpha: 1 },
    lightyellow: { hue: 46, sat: 62, light: 70, alpha: 1 },
    darkgreen: { hue: 140, sat: 95, light: 22, alpha: 1 },
    green: { hue: 140, sat: 52, light: 37, alpha: 1 },
    lightgreen: { hue: 140, sat: 32, light: 58, alpha: 1 },
    darkcyan: { hue: 192, sat: 90, light: 26, alpha: 1 },
    cyan: { hue: 192, sat: 50, light: 46, alpha: 1 },
    lightcyan: { hue: 192, sat: 35, light: 60, alpha: 1 },
    darkblue: { hue: 210, sat: 90, light: 30, alpha: 1 },
    blue: { hue: 210, sat: 70, light: 44, alpha: 1 },
    lightblue: { hue: 210, sat: 55, light: 60, alpha: 1 },
    darkindigo: { hue: 240, sat: 88, light: 30, alpha: 1 },
    indigo: { hue: 240, sat: 42, light: 52, alpha: 1 },
    lightindigo: { hue: 240, sat: 42, light: 62, alpha: 1 },
    darkpurple: { hue: 295, sat: 75, light: 30, alpha: 1 },
    purple: { hue: 295, sat: 46, light: 42, alpha: 1 },
    lightpurple: { hue: 295, sat: 30, light: 54, alpha: 1 },
  },

});