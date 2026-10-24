/**
 * ЗАГРУЖАЕМЫЙ СЕРВЕРНЫЙ КОМПОНЕНТ
 * Регистрация компонента производится при вызове метода initComponent.
 * Менеджер компонента: ZML.SrvCompMgr
 * @alias ServerComponent
 */
Ext.define('ZML.ServerComponent', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.ServerComponent',

  baseCls: Ext.baseCSSPrefix + 'fdl-srvcomp',
  overCls: Ext.baseCSSPrefix + 'fdl-srvcomp-over',
  width: '100%',
  height: '100%',
  flex: 1,
  layout: 'fit',
  headerPosition: 'top',

  Menu: null,

  paramLinkers: [],

  url: null,
  interval: null,
  autoLoad: false,
  callback: null,
  renderMode: 'component',

  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  listeners: {
    afterrender: function ()
    {
      var tool = Ext.create('ZML.Tool', {
        icon: 'more_vert',
        callback: function (owner, tool, ev)
        {
          this.up('ServerComponent').ShowMenu(ev);
        }
      });
      this.addTool(tool);
      this.getHeader().addCls('x-fdl-srvcomp-header');
      this.setTitle(this.itemId);
    },
  },


  initComponent: function ()
  {
    this.callParent();
    this.ComposeMenu();
    GLOBAL[this.AppNAME].Component.register(this);
  },



  ComposeMenu: function ()
  {
    var me = this;
    me.Menu = new Ext.menu.Menu({
      id: this.itemId + '-Menu',
      animCollapse: true,
      defaults: { clickHideDelay: 225 },
      width: 200,
      items: [
        { text: 'Загрузить содержимое', handler: function () { me.LoadContent(); } },
        { text: 'Удалить содержимое', handler: function () { me.RemoveContent(); } }
      ]
    })
  },


  ShowMenu: function (ev)
  {
    this.Menu.showAt(ev.getXY());
    this.Menu.alignTo(this.header, 'tr-br', [-5, -5], false);
  },


  ComposeLoader: function (prms)
  {
    var me = this;
    var loader = {
      url: me.url,
      renderer: null,
      loadMask: { msg: 'Загружается...', target: me },
      callback: me.callback,
      params: prms
    };
    switch (me.renderMode)
    {
      case 'markdown': loader.renderer = me.MarkdownRenderer; break;

      default: loader.renderer = me.renderMode; break;
    };

    return loader;
  },


  MarkdownRenderer: function (loader, response, active)
  {
    if (window['markdownit'] && typeof (window['markdownit'] === 'function'))
    {
      var md = new window.markdownit('default', { html: true, typographer: true });
      var text = response.responseText;
      var result = md.render(text);
      loader.getTarget().addCls('markdown-body');
      loader.getTarget().update(result, true);
      
      return true;
    };
  },


  LoadContent: function ()
  {
    var me = this;
    var prms = {};
    me.paramLinkers.forEach(function (p)
    {
      p.compute();
      prms[p.as] = p.value;
    });
    me.removeAll();

    //var loader = {
    //  url: me.url,
    //  renderer: me.renderMode,
    //  loadMask: { msg: 'Загружается...', target: me },
    //  callback: me.callback,
    //  params: prms
    //};

    var loader = me.ComposeLoader(prms);

    var cmp = Ext.create('Ext.container.Container', {
      itemId: me.itemId + '-LoaderCont',
      loader: loader
    });

    me.add(cmp);

    cmp.getLoader().on('load', function (obj) { Prism.highlightAllUnder(obj.getTarget().el.dom) });

    cmp.getLoader().load();

    //setTimeout(() => Prism.highlightAllUnder(cmp.getLoader().getTarget().el.dom), 0);
  },


  RemoveContent: function ()
  {
    this.removeAll();
  },

});
