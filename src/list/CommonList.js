
Ext.define('{{APP_NS}}.list.CommonList', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.CommonList',

  layout: 'fit',

  PAGING: null,
  DATAVIEW: null,
  TEMPLATE: [],
  DATA: [],
  FIELDS: [],

  config: {

    itemSelector: 'div.dataitem',
    selectedItemCls: 'selected',
    overItemCls: 'over',
    src: null,
    sel: 'single',
    hideHeader: false,
    hidePaging: false,
    iconAs: 'font-icon',
    imageSize: 60,
    pageSize: 20,
    pagingDock: 'bottom',

  },





  initComponent: function (config)
  {
    var me = this;
    me.callParent(arguments);
    me.initConfig(config);

    me.addEvents('created', 'dataviewAdded', 'pagingAdded', 'selectionChanged');
    me.on({
      created: me.OnCreated,
      dataviewAdded: me.OnDataviewAdded,
      pagingAdded: me.OnPagingAdded,
      selectionChanged: me.OnSelectionChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });

    me.fireEvent('created', me);
  },




  OnCreated: function (obj)
  {

  },


  OnAfterRender: function (obj)
  {
    if (obj)
    {
      obj.AddDataView();
      if (obj.getHideHeader() == true)
      {
        obj.header.hide();
      };
    };
  },


  OnDataviewAdded: function (obj)
  {
    if (obj)
    {
      obj.DATAVIEW.store.on('load', obj.OnAfterStoreLoad, obj);
      obj.AddPaging();
    };
  },


  OnPagingAdded: function (obj)
  {
    if (obj)
    {
      obj.SetTemplate(obj.TEMPLATE);
    };
  },


  OnSelectionChanged: function (obj)
  {
    if (obj)
    {
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'list', scopeId: obj.itemId });
    };
  },


  OnAfterStoreLoad: function (obj)
  {
    if (obj && obj.DATAVIEW)
    {
      obj.DATAVIEW.refresh();
      obj.DATAVIEW.setLoading(false);
    };
  },


  AddDataView: function ()
  {
    var me = this;
    if (!me.DATAVIEW)
    {
      me.DATAVIEW = Ext.create('Ext.view.View', {
        WRAPPER: me,
        PAGING: me.PAGING,
        itemId: me.itemId + '-InnerList',
        itemSelector: me.getItemSelector(),
        selectedItemCls: me.getSelectedItemCls(),
        overItemCls: me.getOverItemCls(),
        overflowX: 'hidden',
        overflowY: 'auto',
        width: '100%',
        height: '100%',
        border: 0,
        bodyBorder: 0,
        padding: 5,
        flex: 1,

        plugins: {
          ptype: 'gridviewdragdrop',
          dragText: 'Drag and drop to reorganize',
          ignoreSelf: false,
          dropZone: {
            overClass: 'over-drop-zone',
            maintainOffset: true,
          },
          dragZone: {
            overClass: 'over-drop-zone'
          },
        },

        store: me.getSrc() ? Ext.getStore(me.getSrc()) : Ext.create('Ext.data.Store', {
          id: me.itemId + '-InnerStore',
          fields: me.FIELDS,
          data: me.DATA,
        }),
        listeners: {
          selectionchange: function (selmodel, selrecords)
          {
            me.fireEvent('selectionChanged', me, selmodel, selrecords);
          }
        }
      });
      if (me.getSel() === 'single' || me.getSel() === 'multi')
      {
        switch (me.getSel())
        {
          case 'single': me.DATAVIEW.getSelectionModel().setSelectionMode('SINGLE'); break;
          case 'multi': me.DATAVIEW.getSelectionModel().setSelectionMode('SIMPLE'); break;

          default: break;
        };
      };
      me.add(me.DATAVIEW);

      me.fireEvent('dataviewAdded', me);
    };
  },


  AddPaging: function ()
  {
    var me = this;
    if (!me.PAGING)
    {
      var paging = Ext.create('Ext.toolbar.Paging', {
        dock: me.getPagingDock(),
        WRAPPER: me,
        LIST: me.DATAVIEW,
        hidden: me.getHidePaging(),
        store: me.DATAVIEW.store,
      });
      paging.insert(0, { xtype: 'tbspacer', flex: 1 });
      paging.add({ xtype: 'tbspacer', flex: 1 });
      me.PAGING = paging;
      me.addDocked(paging);
      me.fireEvent('pagingAdded', me);
    };
  },


  SetTemplate: function (tplStrings)
  {
    var me = this;
    var tpl = new Ext.XTemplate(tplStrings);
    me.DATAVIEW.tpl = tpl;
    me.DATAVIEW.refresh();

    //me.DATAVIEW.REORDERER = Ext.create('Ext.ux.BoxReorderer', {
    //  animate: 100,
    //  itemSelector: 'div.data-item'
    //});
    //me.DATAVIEW.addPlugin(me.DATAVIEW.REORDERER);
    //me.DATAVIEW.REORDERER.afterFirstLayout();
  },


  CountSelected: function ()
  {
    var me = this;
    if (typeof me.getSelectionModel === 'function' && me.getSelectionModel())
    {
      var listmodel = me.getSelectionModel();
      var selected = listmodel.getSelection();
      return selected.length;
    };
  },


  CountTotal: function ()
  {
    var me = this;
    if (me.DATAVIEW && me.DATAVIEW.store && me.DATAVIEW.store.isStore)
    {
      return me.DATAVIEW.store.getCount();
    }
  },


  GetSelectedRowField: function (field)
  {
    var me = this;
    if (typeof me.getSelectionModel === 'function' && me.getSelectionModel())
    {
      var listmodel = me.getSelectionModel();
      var selected = listmodel.getSelection();
      var selLength = selected.length;
      if (selected && selLength)
      {
        var ret = [];
        if (selected[0].get(field) !== undefined)
        {
          ret.push(field ? selected[0].get(field) : selected[0]);
        }
        else
        {
          ret.push(field ? selected[0].raw[field] : selected[0]);
        };
        return ret;
      };
    };
  },

});