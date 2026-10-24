/**
 * ЗАГРУЗЧИК СОДЕРЖИМОГО
 * @manager ZML.LoaderMgr
 * @registration initComponent
 */
Ext.define('ZML.data.Loader', {

  extend: 'Ext.ComponentLoader',

  itemId: null,

  paramLinkers: [],

  url: null,

  autoLoad: false,

  scripts: true,

  replaceContent: true,

  renderMode: 'component',


  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',


  listeners: {
    beforeload: function (obj, options, eOpts)
    {
      obj.PrepareLoader();
      setTimeout(() =>
      {
        obj.OnBeforeLoad(obj, options, eOpts);
        obj.RemoveTargetContent();
      }, 0);
    },
    load: function (obj, response, options, eOpts)
    {
      if (obj.renderMode === 'markdown' && window['Prism'] && typeof (window['Prism'] === 'function'))
      {
        window.Prism.highlightAllUnder(obj.getTarget().el.dom);
      };
      obj.OnAfterLoad(obj, response, options, eOpts);
    }
  },


  initComponent: function ()
  {
    this.callParent(arguments);

    GLOBAL[this.AppNAME].Loader.register(this);
  },



  GetRenderMode: function ()
  {
    return this.renderMode;
  },


  GetUrl: function ()
  {
    return this.url;
  },


  SetUrl: function (url)
  {
    this.url = url;
  },



  Load: function ()
  {
    var me = this;
    if (me.getTarget())
    {
      me.load();
    };
  },


  ComputeParamLinkers: function ()
  {
    var me = this;
    me.params = {};
    me.paramLinkers.forEach(function (p)
    {
      p.compute();
      me.params[p.as] = p.value;
    });
  },


  PrepareLoader: function ()
  {
    var me = this;
    me.ComputeParamLinkers();

    me.__autoLoad = me.autoLoad;
    me.autoLoad = false;

    me.renderer = null;
    
    if (me.getTarget())
    {
      //me.autoLoad = me.__autoLoad;
      me.loadMask = { msg: 'Загружается...' };
      switch (me.renderMode)
      {
        case 'markdown': me.renderer = me.MarkdownRenderer; break;

        default: me.renderer = me.renderMode; break;
      };
    };    
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


  RemoveTargetContent: function ()
  {
    var me = this;
    if (typeof (me.getTarget) === 'function' && me.getTarget() && me.replaceContent === true)
    {
      me.getTarget().removeAll();
    };
  },


  UnlinkTarget: function ()
  {
    var me = this;
    if (me.getTarget())
    {
      me.getTarget().loader = null;
      me.setTarget(null);
    };
  },


  OnBeforeLoad: function ()
  {

  },


  OnAfterLoad: function ()
  {

  },

});
