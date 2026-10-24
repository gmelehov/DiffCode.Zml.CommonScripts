/**
 * ТАБЛИЦА ДАННЫХ
 * @alias Grid
 * @manager ZML.GridMgr
 * @registration initComponent
 * @method GetSelectedRowField
 * @method SetSelectedRowField
 * @method GetSelectedCount
 * @method GetSelectedKeys
 * @method GetKeyName
 * @method GetSourceId
 */
Ext.define("ZML.grid.Grid", {

  extend: "Ext.grid.Panel",
  alias: "widget.Grid",

  width: '100%',
  height: '100%',
  flex: 1,
  collapsible: false,
  split: false,
  columnLines: false,
  hideHeaders: false,
  hidePaging: false,
  forceFit: true,

  MasterDataLoaded: null,

  CtxMenu: null,
  CtxMenuId: null,
  CtxMenuTitle: null,
  CtxMenuItems: [],

  selModel: {
    selType: "checkboxmodel",
    allowDeselect: true,
    mode: 'SINGLE',
  },


  listeners: {
    selectionchange: function (obj, selected, eOpts)
    {
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'Grid', scopeId: obj.store.GRID.itemId });
      this.OnActiveItemChanged(obj, selected, eOpts);
    },
    cellcontextmenu: function (view, td, cellIndex, record, tr, rowIndex, e, eOpts)
    {
      e.preventDefault();
      this.OnCtxMenu();
      if (Array.isArray(this.CtxMenuItems) && this.CtxMenuItems.length)
      {
        this.CtxMenu.showAt(e.getXY());
      };
    },
    //celldblclick: function (obj, td, cellIndex, record, tr, rowIndex, e, eOpts)
    //{
    //  this.OnRowDblClicked();
    //  if (obj.editingPlugin)
    //  {
    //    obj.editingPlugin.startEditByPosition({ row: rowIndex, column: cellIndex });
    //  };
    //},
    beforecelldblclick: function (obj, td, cellIndex, record, tr, rowIndex, e, eOpts)
    {
      obj.suspendEvent('selectionchange');
    },
    aftercelldblclick: function (obj, td, cellIndex, record, tr, rowIndex, e, eOpts)
    {
      obj.resumeEvent('selectionchange');
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



      //ctx.grid.getStore().autoSync = false;

      if (column.COMBO_EDITOR_PLUGIN && column.COMBO_EDITOR_PLUGIN.editorValueField)
      {
        rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, coleditor.getValue());
        rec.set(column.COMBO_EDITOR_PLUGIN.cmp.dataIndex, coleditor.getDisplayValue());
        column.COMBO_EDITOR_PLUGIN.SelectValues();
      };

      rec.store.sync();

      //ctx.grid.getStore().autoSync = true;

    }

    //edit: function (editor, ctx)
    //{
    //  /** Ссылка на редактируемую запись из хранилища данных этого дерева */
    //  var rec = editor.context.record;
    //  /** Наименование поля в модели данных, в котором завершено это редактирование */
    //  var modelField = editor.context.field;

    //  /** Ссылка на столбец, в котором завершено это редактирование */
    //  var column = editor.context.column;
    //  /** Ссылка на инлайн-редактор в этом столбце */
    //  var coleditor = column.field;




    //  /** Если этот инлайн-редактор - комбобокс... */
    //  if (coleditor.is('combobox'))
    //  {
    //    /** Если только что отредактированное значение является массивом, И комбобокс - с мультивыбором... */
    //    if (Array.isArray(editor.context.value) && coleditor.multiSelect == true)
    //    {
    //      /** Объединяем отредактированное значение в единую строку через разделитель... */
    //      var val = editor.context.value.join(coleditor.delimiter);
    //      /** Обновляем данные в записи... */
    //      rec.set(modelField, val);
    //      /** Коммитим сделанные изменения */
    //      //rec.commit();
    //    }
    //    /** ...Иначе, если отредактированное значение - строка или число... */
    //    else if (typeof editor.context.value === 'string' || typeof editor.context.value === 'number')
    //    {
    //      /** Обновляем данные в записи... */
    //      rec.set(modelField, coleditor.getDisplayValue());

    //      if (column.COMBO_EDITOR_PLUGIN && column.COMBO_EDITOR_PLUGIN.editorValueField)
    //      {
    //        rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, coleditor.getValue());
    //        //editor.select(rec);
    //        column.COMBO_EDITOR_PLUGIN.SelectValues();
    //        //rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, editor.context.value);
    //        //rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, editor);
    //      };


    //      /** Коммитим сделанные изменения */
    //      //rec.commit();
    //    };
    //  }
    //  else if (Array.isArray(editor.context.value))
    //  {
    //    var val = coleditor.value.split(',');
    //    rec.set(modelField, val);
    //  };




    //  rec.store.fireEvent('datachanged', rec.store);
    //},
  },


  features: [{ ftype: 'filters' }],

  plugins: [
    {
      ptype: 'rowediting',
      clicksToEdit: 2
    },
    {
      ptype: 'GridEditor'
    },
  ],


  /** Имя приложения (Ext.application({ name: AppNAME })) */
  AppNAME: 'APP',



  initComponent: function ()
  {
    var me = this;
    Ext.getStore(me.store).GRID = me;

    this.callParent(arguments);

    me.InitCtxMenu();

    me.on('afterrender', function ()
    {
      me.InitPaging();
      if (me.hidePaging === true)
      {
        me.TogglePaging();
      };

    });

    me.on({
      viewready: me.OnViewReady,
      scope: me
    });

    GLOBAL[this.AppNAME].Grid.register(this);
  },


  columns: {
    defaults: { filterable: true },
    items: [{ dataIndex: "temptableid", header: "Загрузка..." }]
  },


  InitPaging: function ()
  {
    var t = this;
    var store = t.getStore();
    var paging = t.query('Paging')[0];
    if (paging)
    {
      t.PAGING = paging;

      paging.bindStore(store);

      //var rowsOnPage = paging.getComponent("rowsOnPage");
      var rowsOnPage = paging.PageSizeInput;

      if (!!rowsOnPage)
      {
        if (paging.defaultpagesize)
        {
          rowsOnPage.setValue(paging.defaultpagesize);
          if (store) store.pageSize = paging.defaultpagesize;
        }

        if (store) rowsOnPage.setValue(store.pageSize);

        rowsOnPage.on("blur", function (textfield)
        {
          if (store && textfield.validate())
          {
            store.pageSize = textfield.getValue();

            store.load();
            return;
          }
        });

        rowsOnPage.on("specialkey", function (textfield, e)
        {
          if (e.getKey() === e.ENTER && textfield.validate() && store)
          {
            store.pageSize = textfield.getValue();

            if (t.stateful)
            {
              var state = t.getState();
              t.fireEvent("beftatesave", t, state);
            }

            store.load();
          }
        });
      };
    }
  },


  TogglePaging: function ()
  {
    var me = this;
    var pagingtlb = me.query('paging')[0] || me.PAGING;
    if (pagingtlb)
    {
      var hidden = pagingtlb.hidden;
      pagingtlb.setVisible(hidden);
    };
  },


  InitCtxMenu: function (title, items)
  {
    var t = this;
    t.CtxMenuId = [t.itemId, 'CtxMenu'].join('-');
    if (Array.isArray(items))
    {
      t.CtxMenuItems = [].concat(items);
    };
    title = title || t.CtxMenuTitle;
    t.CtxMenu = new Ext.menu.Menu({
      id: t.CtxMenuId,
      title: title,
      Grid: t,
      animCollapse: true,
      defaults: {
        clickHideDelay: 200
      },
      items: t.CtxMenuItems
    });
  },


  AddNewRow: function ()
  {
    this.getStore().GetNewRecord();
  },


  RemoveRow: function ()
  {

  },


  /**
   * @method
   * @param {any} field
   * @param {any} recIndex
   */
  GetSelectedRowField: function (field, recIndex)
  {
    var me = this;
    recIndex = recIndex || 0;
    if (typeof me.getSelectionModel === 'function' && me.getSelectionModel())
    {
      var selmodel = me.getSelectionModel();
      var selected = selmodel.getSelection();
      var selLength = selected.length;
      if (selected && selLength)
      {
        var ret = [];

        if (selLength > 1)
        {
          ret = me.getSelectionModel().getSelection().map(function (m) { return m.get(field) });
        }
        else
        {
          if (selected[recIndex].get(field) !== undefined)
          {
            ret.push(field ? selected[recIndex].get(field) : selected[recIndex]);
          }
          else
          {
            ret.push(field ? selected[recIndex].raw[field] : selected[recIndex]);
          };
        };
        return ret;
      };
    };
  },

  /**
   * @method
   * @param {any} field
   * @param {any} val
   * @param {any} recIndex
   */
  SetSelectedRowField: function (field, val, recIndex)
  {
    var me = this;
    recIndex = recIndex || 0;
    if (typeof me.getSelectionModel === 'function' && me.getSelectionModel())
    {
      var selmodel = me.getSelectionModel();
      var selected = selmodel.getSelection();
      if (selected && selected[recIndex])
      {
        selected[recIndex].set(field, val);
      };
    };
  },

  /**
   * Возвращает количество выделенных строк в этой таблице данных.
   * @method
   */
  GetSelectedCount: function ()
  {
    return this.getSelectionModel().getSelection().length;
  },

  /**
   * Возвращает значения первичного ключа для всех выделенных строк в этой таблице.
   * @method
   * @param {Boolean} asArray Если true, то значения возвращаются в виде массива, иначе - в одну строку через запятую.
   */
  GetSelectedKeys: function (asArray)
  {
    var me = this;
    if (asArray === undefined || asArray === null)
    {
      asArray = true;
    };
    asArray = !!asArray;
    var ret = me.getSelectionModel().getSelection().map(function (m)
    {
      return m.get(me.getStore().KEY);
    });
    return asArray ? ret : ret.join(',');
  },

  /**
   * Возвращает идентификатор первичного ключа этой таблицы.
   * @method
   */
  GetKeyName: function ()
  {
    return this.getStore().KEY;
  },


  GetKeyType: function ()
  {
    var me = this;
    var keyname = me.GetKeyName();
    var keytype = me.getStore().model.getFields().find(function (f) { return f.name == keyname }).type.type;
    return keytype;
  },

  /**
   * Возвращает идентификатор хранилища данных этой таблицы.
   * @method
   */
  GetSourceId: function ()
  {
    return this.getStore().storeId;
  },


  OnActiveItemChanged: function (obj, selected, eOpts)
  {
    var t = this;
    var selmodel = t.getSelectionModel();
    var selmode = selmodel.selectionMode;
    var currselected = selmodel.getSelection();
    var selcount = currselected.length;
    var stor = t.getStore();

    switch (selcount)
    {
      case 0:
        t.OnRowDeselected();
        if (stor && typeof (stor.CheckCurrentPage) === 'function')
        {
          stor.CheckCurrentPage();
        };
        break;

      case 1: t.OnRowSelected(1); break;

      default: t.OnRowSelected(selcount); break;
    };
  },


  /**
   * Заглушка для обработчика события выделения строки в этой таблице данных.
   * @event
   */
  OnRowSelected: function () { },

  /**
   * Заглушка для обработчика события снятия выделения строки в этой таблице данных.
   * @event
   */
  OnRowDeselected: function () { },

  /**
   * Заглушка для обработчика события окончания загрузки данных в этой таблице данных.
   * @event
   */
  OnDataLoaded: function () { },

  /**
   * Заглушка для обработчика события двойного клика по строке в этой таблице данных.
   * @event
   */
  OnRowDblClicked: function () { },

  /**
   * Заглушка для обработчика события клика правой кнопкой мыши в этой таблице данных.
   * @event
   */
  OnCtxMenu: function () { },



  OnStoreLoaded: function ()
  {
    var me = this;
    var storeLinkersHaveValues = me.store.LinkersHaveValues();
    me.MasterDataLoaded = storeLinkersHaveValues;
    if (me.store && typeof (me.store.CheckCurrentPage) === 'function')
    {
      me.store.CheckCurrentPage();
    };
    if (me.PAGING && me.PAGING.CreateButton)
    {
      me.PAGING.CreateButton.setDisabled(!storeLinkersHaveValues);
    };
    me.OnDataLoaded();
  },


  OnViewReady: function (grid)
  {
    grid.keyMap = new Ext.util.KeyMap({

      target: grid.getView().getEl(),
      binding: [{
        key: 'c',
        ctrl: true,
        fn: function (keyCode, e)
        {
          console.dir('Ctrl+C pressed');
          var selcount = grid.getSelectionModel().getSelection().length;
          if (selcount > 0)
          {
            var resultText = grid.getCsvDataFromRecs();
            var ta = document.createElement('textarea');
            ta.id = 'tempcliparea';
            ta.style.position = 'absolute';
            ta.style.left = '-1000px';
            ta.style.top = '-1000px';
            ta.value = resultText;

            document.body.appendChild(ta);
            ta.focus();
            ta.select();

            document.execCommand('copy');

            setTimeout(function ()
            {
              document.body.removeChild(ta);
              console.dir(resultText);
              console.dir('Textarea removed');

            }, 500);
          };
        }
      }]
    });

  },



  getCsvDataFromRecs: function (withHeaders)
  {
    var me = this;
    var stor = me.getStore();
    var key = stor.KEY;
    var columns = me.initialConfig.columns;
    var dataIndices = columns.items.map(function (m) { return m.dataIndex; });

    var records = me.getSelectionModel().getSelection();

    var resultText = !!withHeaders ? dataIndices.join('\t') + '\n' : '';

    var res = records.map(function (rec)
    {
      var values = dataIndices.map(function (d)
      {
        var temp = rec.get(d);
        var result;
        if (typeof temp.toLocaleDateString === 'function')
        {
          result = temp.toLocaleDateString();
        }
        else if (!isNaN(parseFloat(temp)))
        {
          result = parseFloat(temp).toString().replace('.', ',');
        }
        else
        {
          result = temp;
        };
        return result;
      });
      return values.join('\t');
    });

    resultText += res.join('\n');

    return resultText;
  },



  IsVisible: function ()
  {
    var t = this;
    var result = true;
    var parent = t;
    while (parent !== undefined && !parent.is('viewport'))
    {
      parent = parent.up('component');
      if (parent && parent.is('tabpanel'))
      {
        var activetab = parent.activeTab;
        if (activetab && activetab.is('grid'))
        {
          result &= (activetab.xtype == t.xtype);
        }
        else
          if (activetab)
          {
            result &= (activetab.query('*[xtype=' + t.xtype + ']').length);
          };
        result &= parent.isVisible() && !parent.collapsed;
      }
      else
        if (parent && parent.tab && parent.tab.is('tab'))
        {
          result &= (parent.tab.active == true);
        }
        else
        {
          result &= true;
        };
    };
    return !!result;
  },


});
