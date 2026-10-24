/**
 * ПЛАГИН, ДОБАВЛЯЮЩИЙ РАСШИРЕННЫЕ ВОЗМОЖНОСТИ
 * РЕДАКТИРОВАНИЯ ТАБЛИЦЫ ДАННЫХ.
 */
Ext.define('ZML.plugin.GridEditor', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.GridEditor',


  mixins: {
    observable: 'Ext.util.Observable',
  },


  /** Содержимое буфера обмена, вставленное в подключенную таблицу данных */
  CLIPBOARD: '',

  /** Меню плагина */
  MENU: null,


  init: function (comp)
  {
    var me = this;
    comp.GRID_EDITOR = me;

    comp.on('afterrender', function (obj)
    {     
      var compid = obj.getId();
      document.getElementById(compid).addEventListener('paste', obj.GRID_EDITOR.HandlePaste);

      //obj.GRID_EDITOR.MENU = obj.GRID_EDITOR.ComposeMenu();

    });

    me.callParent(arguments);

    me.mixins.observable.constructor.call(me, me);
    me.addEvents('pasteCompleted');
    me.on({
      pasteCompleted: me.OnPasteCompleted,
      scope: me
    });
  },


  /**
   * Обработчик события pasteCompleted, генерируемого плагином
   * после успешной записи содержимого буфера обмена в свойство CLIPBOARD.
   * @param {any} obj Экземпляр плагина, сгенерировавший это событие.
   */
  OnPasteCompleted: function (obj)
  {
    var rowsList = obj.CLIPBOARD.trim().split('\n');
    var columns = obj.cmp.initialConfig.columns;
    var stor = obj.cmp.getStore();
    var model = stor.model.getName();
    var key = stor.KEY || stor.first().idField.name;
    var dataIndices = columns.items.map(function (m) { return m.dataIndex; });

    rowsList.forEach(function (r)
    {
      var newRow = obj.CreateNewRow(stor, model);

      r.trim().split('\t').forEach(function (f, i)
      {
        var type = stor.model.getFields().find(function (ff) { return ff.name == dataIndices[i]; }).type.type;

        switch (type)
        {
          case 'date': var res = Ext.Date.parse(f, 'd.m.Y'); break;
          case 'float': var res = parseFloat(f.replace(',', '.')); break;
          case 'int': var res = parseInt(f); break;
          case 'boolean': var res = (f == '0' || f.toString().toLowerCase() == 'false') ? false : true; break;
          case 'string': var res = f; break;


          default: var res = f; break;
        };

        newRow.set(dataIndices[i], res);
      });

      stor.add(newRow);
    });

    var updButton = obj.cmp.PAGING.UpdateButton;
    updButton.setDisabled(false);

  },


  /**
   * Создает одну либо несколько новых записей и добавляет их в хранилище данных
   * @param {any} amount Количество новых записей, создаваемых при запуске метода
   */
  PrepareNewRows: function (amount)
  {
    var me = this;
    var store = me.cmp.getStore();
    var model = store.model.getName();
    var key = store.KEY || store.first().idField.name;

    amount = amount || 1;

    if (model)
    {
      var tempRecordObject = {};
      var prmlinkers = store.paramLinkers;
      prmlinkers.forEach(function (p)
      {
        tempRecordObject[p.as] = p.value;
      });

      for (var i = 1; i <= amount; i++)
      {
        var lastDirtyKey = store.last() ? store.last().getId() : 0;
        var newDirtyKey = lastDirtyKey < -1 ? (lastDirtyKey - 1) : -2;

        var newRecordObject = Ext.apply({}, tempRecordObject);
        newRecordObject[key] = newDirtyKey;

        var newRecord = Ext.create(model, newRecordObject);
        store.add([newRecord]);
      };

    };
  },



  CreateNewRow: function (store, model)
  {
    if (store && model)
    {
      var key = store.KEY || store.first().idField.name;

      var tempRecordObject = {};
      var prmlinkers = store.paramLinkers;
      prmlinkers.forEach(function (p)
      {
        tempRecordObject[p.as] = p.value;
      });

      var lastDirtyKey = store.last() ? store.last().getId() : 0;
      var newDirtyKey = lastDirtyKey < -1 ? (lastDirtyKey - 1) : -2;

      tempRecordObject[key] = newDirtyKey;
      var newRecord = Ext.create(model, tempRecordObject);

      return newRecord;
    };
  },


  /**
   * Получает данные из выделенных строк таблицы, конвертирует
   * их в представление, подходящее для массовой вставки
   * строк в таблицу Excel.
   * @param {any} withHeaders Если true, то данные будут сконвертированы вместе с заголовками столбцов
   */
  PrepareForExcel: function (withHeaders)
  {
    var me = this;
    var stor = me.cmp.getStore();
    var key = stor.KEY || stor.first().idField.name;
    var columns = me.cmp.initialConfig.columns;
    var dataIndices = columns.items.map(function (m) { return m.dataIndex; });

    var records = me.cmp.getSelectionModel().getSelection();

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


  /** Копирует в буфер обмена подготовленные для вставки в Excel данные */
  ExportToClipboard: function ()
  {
    var me = this;
    var selcount = me.cmp.getSelectionModel().getSelection().length;
    if (selcount > 0)
    {
      var resultText = me.PrepareForExcel(true);
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
      }, 500);
    };
  },


  /**
   * Обработчик события paste, сгенерированного на подключенной к плагину таблице данных.
   * Перехватывает содержимое, вставленное в таблицу данных из буфера обмена
   * и записывает его в собственное свойство CLIPBOARD для дальнейшей обработки.
   * @param {any} ev Объект события paste
   */
  HandlePaste: function (ev)
  {
    var me = this;
    var grid = Ext.getCmp(me.id);

    var clipboardData;
    var pastedData;

    ev.stopPropagation();
    ev.preventDefault();

    clipboardData = ev.clipboardData || window.clipboardData;
    pastedData = clipboardData.getData('Text');

    grid.GRID_EDITOR.CLIPBOARD = pastedData;
    grid.GRID_EDITOR.fireEvent('pasteCompleted', grid.GRID_EDITOR);
    console.dir(pastedData);
  },


  //ComposeMenu: function ()
  //{
  //  var me = this;
  //  var ret = new Ext.menu.Menu({

  //    id: 'InnerMenu',
  //    animCollapse: true,
  //    allowOtherMenus: true,
  //    cls: 'logx',
  //    defaults: { clickHideDelay: 200 },
  //    HOST: me,
  //    plain: true,
  //    items: [
  //      {
  //        itemId: 'Item1',
  //        text: 'Хранилище данных',
  //        cls: 'logx mat-icons',
  //        iconCls: 'storage darkgreen',
  //        clickHideDelay: 50,
  //        menu: {
  //          animCollapse: true,
  //          allowOtherMenus: true,
  //          cls: 'logx',
  //          plain: true,
  //          defaults: { clickHideDelay: 200 },
  //          items: [
  //            {
  //              itemId: 'Item2',
  //              text: 'Хранилище данных',
  //              cls: 'logx mat-icons',
  //              clickHideDelay: 50,
  //            }
  //          ]
  //        }
  //      }
  //    ]

  //  });

  //  return ret;
  //},



});