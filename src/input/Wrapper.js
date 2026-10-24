/**
 * ВСПОМОГАТЕЛЬНЫЙ КЛАСС
 * КОНТЕЙНЕР ДЛЯ ДОЧЕРНИХ ЭЛЕМЕНТОВ РЕДАКТОРА СПИСКОВ
 */
Ext.define('ZML.input.Wrapper', {

  extend: 'Ext.container.Container',
  alias: 'widget.InputWrapper',

  padding: '0 6',
  margin: '2 0',
  cls: 'logx-expr-group',
  layout: 'column',
  width: '100%',

  config: {
    index: null,
  },

  HOST: null,

  INPUT: null,

  INDEX: null,

  AddBtn: null,

  DelBtn: null,


  setIndex: function (value)
  {
    var me = this;
    var oldvalue = me.getIndex();
    me.index = value;
    if (oldvalue != value)
    {
      me.fireEvent('indexChanged', me, oldvalue, value);
    };
  },


  initComponent: function (config)
  {
    var me = this;
    config = config || {};
    me.initConfig(config);
    me.callParent(arguments);
    me.addEvents('indexChanged');

    me.on({
      indexChanged: me.OnIndexChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });
  },


  ComposeIndexElement: function ()
  {
    var me = this;
    me.INDEX = me.INDEX || Ext.create('Ext.form.field.Display', {
      itemId: me.itemId + '-index',
      cls: 'logx-align-start',
      width: 24,
      height: 22,
      value: me.getIndex()
    });
  },


  ComposeOwnButtons: function ()
  {
    var me = this;
    var totalElements = me.HOST.GetElementsCount();
    me.AddBtn = me.AddBtn || Ext.create('Ext.button.Button', {
      Parent: me,
      itemId: me.itemId + '-action-add',
      cls: 'logx-icon-btn opaque mat-icons',
      iconCls: 'add darkblue',
      width: 22,
      height: '100%',
      tooltip: 'Добавить элемент',
      handler: function ()
      {
        var parent = this.Parent;
        parent.HOST.AddNewElement(parent.getIndex());
      },
    });
    me.DelBtn = me.DelBtn || Ext.create('Ext.button.Button', {
      Parent: me,
      itemId: me.itemId + '-action-delete',
      cls: 'logx-icon-btn opaque mat-icons',
      iconCls: 'remove darkred',
      disabled: totalElements < 2,
      width: 22,
      height: '100%',
      tooltip: 'Удалить элемент',
      handler: function ()
      {
        var parent = this.Parent;
        parent.HOST.DeleteElementByIndex(parent.getIndex());
      },
    });
  },


  OnAfterRender: function ()
  {
    var me = this;
    me.ComposeIndexElement();
    me.ComposeOwnButtons();
    if (!!me.HOST.showIndices)
    {
      me.add([me.INDEX, me.INPUT, me.DelBtn, me.AddBtn]);
    }
    else
    {
      me.add([me.INPUT, me.DelBtn, me.AddBtn]);
    };
  },


  OnIndexChanged: function (obj, oldval, newval)
  {
    if (obj && obj.INDEX)
    {
      obj.INDEX.setValue(newval);
    };
  },

});
