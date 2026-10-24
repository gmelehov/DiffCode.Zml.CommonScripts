/** 
 * ПЛАГИН ДЛЯ СТОЛБЦА ТАБЛИЦЫ ДАННЫХ С РЕДАКТОРОМ-КОМБОБОКСОМ.
 * ВЫПОЛНЯЕТ АВТОМАТИЧЕСКОЕ ОБНОВЛЕНИЕ РЕДАКТОРА-КОМБОБОКСА
 * МАССИВОМ УНИКАЛЬНЫХ ЗНАЧЕНИЙ-ОПЦИЙ, ИЗВЛЕЧЕННЫХ ИЗ ХРАНИЛИЩА ДАННЫХ ТАБЛИЦЫ.
 */
Ext.define('ZML.plugin.ColumnComboEditor', {

  extend: 'Ext.AbstractPlugin',
  alias: 'plugin.ColumnComboEditor',


  /** Источник данных для инлайн-комбобокса */
  DataSrc: null,

  /** 
   * Поле в источнике данных (либо в модели данных таблицы), выступающее в роли значимого поля для комбобокса.
   * В случае, если это свойство равно null, значимое и отображаемое поля комбобокса будет совпадать.
   */
  editorValueField: null,

  editorInited: false,

  /**
   * Выполняет инициализацию плагина.
   * @param {any} comp Столбец таблицы данных, к которому подключен этот плагин.
   */
  init: function (comp)
  {
    var me = this;
    comp.COMBO_EDITOR_PLUGIN = me;

    comp.on('afterrender', me.OnColumnAfterRender, {delay: 1000});
    
    me.callParent(arguments);
  },

  /**
   * Метод, вызываемый в качестве обработчика события afterrender, сгенерированного
   * столбцом таблицы данных, к которому подключен этот плагин.
   * @param {any} comp Столбец таблицы данных, к которому подключен этот плагин.
   */
  OnColumnAfterRender: function (comp)
  {
    var me = comp.COMBO_EDITOR_PLUGIN;
    var grid = comp.up('grid') || comp.up('treepanel');
    var store = grid.getStore();

    if (store)
    {
      store.on('load', me.ComputeComboEditorData, me);
    };
    if (me.DataSrc && Ext.getStore(me.DataSrc))
    {
      Ext.getStore(me.DataSrc).on('load', me.ComputeComboEditorData, me);
      Ext.getStore(me.DataSrc).load();
    };
  },

  /**
   * Извлекает массив уникальных значений из записей в указанном хранилище данных.
   * Значения из записей выбираются по полю, имя которого соответствует
   * свойству dataIndex столбца, к которому подключен этот плагин.
   * Обновляет внутреннее хранилище редактора-комбобокса в этом столбце найденными значениями.
   * @param {any} stor Экземпляр хранилища данных - поставщика записей для извлечения значений.
   */
  ComputeComboEditorData: function (stor)
  {
    var me = this;

    if (me.DataSrc && Ext.getStore(me.DataSrc))
    {
      stor = Ext.getStore(me.DataSrc);
    };

    var uniqueArray = Ext.Array.unique(stor.data.items.map(function (m)
    {
      if (me.editorValueField)
      {
        var retobj = {};
        retobj[me.editorValueField] = m.get(me.editorValueField);
        retobj[me.cmp.dataIndex] = m.get(me.cmp.dataIndex);
        return retobj;
      }
      else
      {
        return m.get(me.cmp.dataIndex);
      };
    }));
    var sorted = Ext.Array.sort(uniqueArray);

    if (me.editorValueField)
    {
      var ret = sorted.map(function (m)
      {
        var obj = {};
        obj[me.editorValueField] = m[me.editorValueField];
        obj[me.cmp.dataIndex] = m[me.cmp.dataIndex];
        return obj;
      });
    }
    else
    {
      var ret = sorted.map(function (m)
      {
        var obj = {};
        obj[me.cmp.dataIndex] = m;
        return obj;
      });
    };
    
    me.SetComboEditorData(ret);
  },

  /**
   * Обновляет внутреннее хранилище редактора-комбобокса в столбце, 
   * к которому подключен этот плагин, передавая в хранилище указанный массив значений.
   * @param {any} data Массив значений - опций для редактора-комбобокса.
   */
  SetComboEditorData: function (data)
  {
    var me = this;
    var editor = me.cmp.getEditor();
    var grid = me.cmp.up('grid') || me.cmp.up('treepanel');
    var store = grid.getStore();


    //if (me.DataSrc && Ext.getStore(me.DataSrc))
    //{
    //  editor.bindStore(Ext.getStore(me.DataSrc));
    //}
    //else

    if (editor && editor.is('combobox'))
    {
      var fields = me.editorValueField ? [{ name: me.editorValueField, type: 'auto' }, { name: me.cmp.dataIndex, type: 'auto' }] : [{ name: me.cmp.dataIndex, type: 'auto' }]

      var modelname = grid.itemId + '-' + me.cmp.dataIndex + '-EditorModel';
      Ext.define(modelname, {
        extend: 'Ext.data.Model',
        idProperty: me.editorValueField || me.cmp.dataIndex,
        fields: fields
      });

      var cmbstor = Ext.create('Ext.data.Store', {
        model: modelname,
        combo: editor,
        data: [].concat(data)
      });

      cmbstor.on('load', function (stor)
      {
        var emptytext = '' + stor.getCount() + ' элем.';
        stor.combo.emptyText = emptytext;
        stor.combo.applyEmptyText();
      });

      editor.bindStore(cmbstor);
      
      editor.on('expand', me.SelectValues, me);
    };
  },


  SelectValues: function ()
  {
    var me = this;
    var editor = me.cmp.getEditor();
    //var grid = editor.column.up('grid');
    //var ctx = grid.getPlugin('cedit').context;

    if (editor && editor.is('combobox'))
    {
      if (editor.multiSelect == true)
      {
        var valuesArray = editor.rawValue.split(editor.delimiter);
        var arr = valuesArray.map(function (m) { return editor.getStore().findRecord(me.editorValueField || me.cmp.dataIndex, m); });
        editor.select(arr);
      }
      else
      {
        var record = editor.getStore().findRecord(me.editorValueField || me.cmp.dataIndex, editor.getValue());

        editor.select(record);
      };
    };
  },

});