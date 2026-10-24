Ext.define("ZML.grid.CommonGrid", {

  extend: "Ext.grid.Panel",
  alias: "widget.CommonGrid",

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

  selModel: {
    selType: "checkboxmodel",
    allowDeselect: true,
    mode: 'SINGLE',
  },

  
  listeners: {
    selectionchange: function (obj, selected, eOpts)
    {
      Ext.StoreManager.LoadLinkedStores({ scopeType: 'grid', scopeId: obj.store.GRID.itemId });
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
          rec.set(modelField, coleditor.getDisplayValue());

          if (column.COMBO_EDITOR_PLUGIN && column.COMBO_EDITOR_PLUGIN.editorValueField)
          {
            rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, coleditor.getValue());
            //editor.select(rec);
            column.COMBO_EDITOR_PLUGIN.SelectValues();
            //rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, editor.context.value);
            //rec.set(column.COMBO_EDITOR_PLUGIN.editorValueField, editor);
          };


          /** Коммитим сделанные изменения */
          //rec.commit();
        };
      };


      rec.store.fireEvent('datachanged', rec.store);
    },
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


  initComponent: function ()
  {
    var me = this;

    Ext.getStore(me.store).GRID = me;
    this.callParent(arguments);

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
  },


  columns: {
    defaults: { filterable: true },
    items: [{ dataIndex: "temptableid", header: "Загрузка..." }]
  },


  InitPaging: function ()
  {
    var t = this;
    var store = t.getStore();
    var paging = t.query('paging')[0];
    if (paging)
    {
      t.PAGING = paging;

      paging.bindStore(store);

      var rowsOnPage = paging.getComponent("rowsOnPage");

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


  AddNewRow: function ()
  {
    this.getStore().GetNewRecord();
  },


  RemoveRow: function ()
  {

  },


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
        if (selected[recIndex].get(field) !== undefined)
        {
          ret.push(field ? selected[recIndex].get(field) : selected[recIndex]);
        }
        else
        {
          ret.push(field ? selected[recIndex].raw[field] : selected[recIndex]);
        };
        return ret;
      };
    };
  },


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


  /** Возвращает количество выделенных строк в этой таблице данных. */
  GetSelectedCount: function ()
  {
    return this.getSelectionModel().getSelection().length;
  },

  /**
   * Возвращает значения первичного ключа для всех выделенных
   * строк в этой таблице.
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

  /** Возвращает идентификатор первичного ключа этой таблицы. */
  GetKeyName: function ()
  {
    return this.getStore().KEY;
  },

  /** Возвращает идентификатор хранилища данных этой таблицы. */
  GetSourceId: function ()
  {
    return this.getStore().storeId;
  },


  OnStoreLoaded: function ()
  {
    var me = this;
    var storeLinkersHaveValues = me.store.LinkersHaveValues();
    me.MasterDataLoaded = storeLinkersHaveValues;
    if (me.PAGING && me.PAGING.CreateButton)
    {
      me.PAGING.CreateButton.setDisabled(!storeLinkersHaveValues);
    };
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

});