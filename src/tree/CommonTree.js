Ext.define('ZML.tree.CommonTree', {

  extend: 'Ext.tree.Panel',
  alias: 'widget.CommonTree',
  xtype: 'CommonTree',

  width: '100%',
  height: '100%',
  collapsible: false,
  titleCollapse: false,
  split: false,

  cls: '',
  rowCls: '',
  fieldsForRowCls: [],
  ExtraToolbars: [],

  useArrows: true,
  rootVisible: false,
  allowDeselect: true,
  expanded: false,
  dataLoaded: false,

  plugins: [
    {
      ptype: 'cellediting',
      clicksToEdit: 2,
      pluginId: 'cedit'
    }
  ],

  viewConfig: {
    plugins: [
      {
        ptype: 'treeviewdragdrop',
        dragText: 'Drag and drop to reorganize',
        allowCopy: true,
        allowContainerDrops: true,
        allowParentInserts: true,
        containerScroll: true,
        expandDelay: 300,
        sortOnDrop: true,
        nodeHighlightColor: '74aaf1',
        pluginId: 'commonTreeDD'
      }
    ]
  },


  listeners: {

    afterrender: function ()
    {
      var me = this;
      var tlb = me.ComposeToolbar('top');
      var extraTlbs = me.GetExtraToolbars('top');
      me.addDocked(tlb);
      me.addDocked(extraTlbs);

      if (me.store && me.store.isStore)
      {
        me.store.TREE = me;
        me.relayEvents(me.store, ['datachanged', 'update']);

        me.on({
          datachanged: me.OnStoreDatachanged,
          scope: me
        });
      };
    },


    edit: function (editor, ctx)
    {
      /** Ссылка на редактируемую запись из хранилища данных этого дерева */
      var rec = editor.context.record;
      /** Наименование поля в модели данных, в котором завершено это редактирование */
      var modelField = editor.context.field;

      /** Ссылка на столбец, в котором завершено это редактирование */
      var column = editor.context.column;
      /** Ссылка на инлайн-редактор в этом столбце */
      var coleditor = column.field;


      /** Если этот инлайн-редактор - комбобокс... */
      if (coleditor.is('combobox'))
      {
        /** Если только что отредактированное значение является массивом, И комбобокс - с мультивыбором... */
        if (Array.isArray(editor.context.value) && coleditor.multiSelect == true)
        {
          /** Объединяем отредактированное значение в единую строку через разделитель... */
          var val = editor.context.value.join(coleditor.delimiter);
          /** Обновляем данные в записи... */
          rec.set(modelField, val);
          /** Коммитим сделанные изменения */
          //rec.commit();
        }
        /** ...Иначе, если отредактированное значение - строка или число... */
        else if (typeof editor.context.value === 'string' || typeof editor.context.value === 'number')
        {
          /** Обновляем данные в записи... */
          rec.set(modelField, editor.context.value);
          /** Коммитим сделанные изменения */
          //rec.commit();
        };
      };

      rec.store.fireEvent('datachanged', rec.store);
    },


    selectionchange: function (obj, selected, eOpts)
    {
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'tree', scopeId: obj.view.panel.itemId });
    },
  },


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments); 
  },


  AddRowClassFromField: function (field)
  {
    var me = this;
    Array.from(me.view.getNodes()).forEach(function (node)
    {
      var rec = me.view.getRecord(node);
      var clsFirst = (me.rowCls || '');
      var clsSecond = (rec.get(field) || '');
      var cls = clsFirst + (!!clsFirst && !!clsSecond ? '-' : '') + clsSecond;
      node.classList.add(cls);
    });
  },


  GetSelectedRowField: function (field)
  {
    var me = this;
    if (typeof me.getSelectionModel === 'function' && me.getSelectionModel())
    {
      var selmodel = me.getSelectionModel();
      var selected = selmodel.getSelection();
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


  ComposeToolbar: function (dock)
  {
    var me = this;
    dock = dock || 'top';

    var sep = { xtype: 'tbseparator' };

    var btnStoreLoad = Ext.create('ZML.button.Button', {
      itemId: 'btnStoreLoad',
      iconSet: 'mat-icons',
      __icon: 'get_app',
      color: 'darkgreen',
      tooltip: 'Загрузить/обновить данные',
      condition: function () { return true; },
      OnHandlerCall: function ()
      {
        me.store.load();
      },
    });

    var btnCollapseAll = Ext.create('ZML.button.Button', {
      itemId: 'btnCollapseAll',
      iconSet: 'mat-icons',
      __icon: 'unfold_less',
      color: 'blue',
      tooltip: 'Свернуть все',
      condition: function () { return true; },
      OnHandlerCall: function ()
      {
        me.collapseAll();
      },
    });

    var btnExpandAll = Ext.create('ZML.button.Button', {
      itemId: 'btnExpandAll',
      iconSet: 'mat-icons',
      __icon: 'unfold_more',
      color: 'blue',
      tooltip: 'Развернуть все',
      disabled: true,
      condition: function () { return true; },
      OnHandlerCall: function ()
      {
        me.expandAll();
      },
    });

    var btnUpdateAll = Ext.create('ZML.button.Button', {
      itemId: 'btnUpdateAll',
      iconSet: 'mat-icons',
      __icon: 'save',
      color: 'darkgreen',
      tooltip: 'Сохранить все изменения',
      disabled: true,
      condition: function () { return this.up('treepanel').getStore().getUpdatedRecords().length > 0 },
      OnHandlerCall: function ()
      {
        me.store.UpdateRecords();
      },
    });


    var tlb = Ext.create('Ext.toolbar.Toolbar', {
      dock: dock,
      items: [
        btnStoreLoad, sep, btnCollapseAll, btnExpandAll, sep, btnUpdateAll
      ]
    });

    me.ExtraToolbars.filter(function (f) { return f.dock == dock }).forEach(function (btn)
    {
      tlb.add(btn);
    });

    return tlb;
  },


  GetExtraToolbars: function (allExcept)
  {
    return this.ExtraToolbars.filter(function (f) { return f.dock != allExcept });
  },



  OnStoreLoaded: function ()
  {
    var me = this;
    var storeLinkersHaveValues = me.store.LinkersHaveValues();


    //if (me.store.proxy.reader.jsonData && me.store.proxy.reader.jsonData.data)
    //{
    //  me.getRootNode().set('Id', me.store.proxy.reader.jsonData.data[0].Id);
    //  me.getRootNode().set('Name', me.store.proxy.reader.jsonData.data[0].Name);
    //};

    //if (me.dataLoaded == true)
    //{
    //  if (me.store.proxy.reader.jsonData && me.store.proxy.reader.jsonData.data)
    //  {
    //    me.getRootNode().appendChild(me.store.proxy.reader.jsonData.data[0].children);
    //  };
    //}
    //else
    //{
    //  me.getRootNode().appendChild(me.store.proxy.reader.jsonData.data[0].children);
    //  me.dataLoaded = true;
    //};    
    //if (me.expanded == true)
    //{
    //  me.expandAll();
    //}
    //else
    //{
    //  me.collapseAll();
    //};

    //setTimeout(function ()
    //{
    //  me.fieldsForRowCls.forEach(function (fld)
    //  {
    //    me.AddRowClassFromField(fld);
    //  });
    //}, 100);
  },


  OnStoreDatachanged: function ()
  {
    var updatedCount = this.getStore().getUpdatedRecords().length;
    var addedCount = this.getStore().getNewRecords().length;
    var removedCount = this.getStore().getRemovedRecords().length;

    this.ManageButtonsState();
  },


  /**
   * Возвращает узел дерева по заданному идентификатору узла.
   * @param {String | Number} id Идентификатор разворачиваемого узла.
   */
  FindNodeById: function (id)
  {
    return this.store.getNodeById(id);
  },

  /**
   * Разворачивает узел дерева с заданным идентификатором.
   * @param {String | Number} id Идентификатор разворачиваемого узла.
   * @param {Boolean} closestChildren Если равно true, то также разворачивает все потомки 1-го уровня этого узла.
   */
  ExpandNodeById: function (id, closestChildren)
  {
    var me = this;
    var node = this.FindNodeById(id);

    if (node && node.get('leaf') == false && node.get('expanded') == false)
    {
      me.GetNodeAncestors(id).forEach(function (a)
      {
        me.expandNode(a, false, function () { a.isExpandingOrCollapsing = false; })
      });


      setTimeout(function ()
      {

        me.expandNode(node, false, function ()
        {
          node.isExpandingOrCollapsing = false;
          if (closestChildren === true)
          {
            node.childNodes.filter(function (f) { return f.get('leaf') == false && f.get('expanded') == false }).forEach(function (n)
            {
              me.expandNode(n, false, function () { n.isExpandingOrCollapsing = false; });
            });
          };
        }, me);

      }, 10);

    };
  },

  /**
   * Возвращает список узлов-предков для узла с заданным идентификатором.
   * @param {any} id Идентификатор узла, для которого выполняется поиск предков.
   */
  GetNodeAncestors: function (id)
  {
    var me = this;
    var ret = [];
    var startfrom = me.FindNodeById(id);

    if (!startfrom || startfrom.get('root') == true)
    {
      return ret;
    }
    else
    {
      var parent = startfrom.parentNode;
      while (parent && parent.get('root') == false)
      {
        ret.push(parent);
        parent = parent.parentNode;
      };
      ret.push(me.getRootNode());
    };
    return ret.reverse();
  },



  ManageButtonsState: function ()
  {
    var me = this;
    var buttons = me.query('button');
    //var selcount = me.CountSelected();

    buttons.forEach(function (btn)
    {
      var needsel = btn.needSelection;
      //var btnid = btn.itemId;
      var condition = btn.condition();


      switch (needsel)
      {
        case 'none': btn.setDisabled(false && !condition); break;
        case 'single': btn.setDisabled(selcount != 1 || !condition); break;
        case 'multi': btn.setDisabled(selcount < 2 && !condition); break;
        case 'any': btn.setDisabled(selcount == 0 && !condition); break;

        default: btn.setDisabled(!condition); break;
      };
    });
  },


});