Ext.define('ZML.toolbar.Paging', {

  extend: 'Ext.toolbar.Paging',
  alias: 'widget.paging',

  itemId: 'paging',
  dock: 'bottom',
  displayInfo: true,

  /** Собственное меню тулбара */
  MENU: null,

  /** Кнопка для создания новой записи */
  CreateButton: null,
  /** Кнопка для удаления выбранных записей */
  RemoveButton: null,
  /** Кнопка для сохранения изменений в записях */
  UpdateButton: null,
  /** Кнопка для начала редактирования выделенной записи */
  EditButton: null,
  /** Кнопка для копирования выбранных записей в буфер обмена */
  CopyButton: null,
  /** Кнопка для массовой вставки новых записей из буфера обмена (НЕ ИСПОЛЬЗУЕТСЯ) */
  PasteButton: null,
  /** Кнопка для вызова меню плагина GridEditor (НЕ ИСПОЛЬЗУЕТСЯ) */
  GridEditorBtn: null,

  /** Поле ввода для изменения количества строк на странице по умолчанию */
  PageSizeInput: null,



  listeners: {
    afterrender: function ()
    {
      var me = this;
      var grid = me.up('grid');

      me.CreateButton.CTX_BINDERS[0].setHostId(grid.itemId);
      me.RemoveButton.CTX_BINDERS[0].setHostId(grid.itemId);
      me.UpdateButton.CTX_BINDERS[0].setHostId(grid.itemId);
      me.EditButton.CTX_BINDERS[0].setHostId(grid.itemId);


      me.CopyButton.CTX_BINDERS[0].setHostId(grid.itemId);
      me.PasteButton.CTX_BINDERS[0].setHostId(grid.itemId);

      me.NextButton = me.query('#next')[0];
      me.LastButton = me.query('#last')[0];
      me.PrevButton = me.query('#prev')[0];
      me.FirstButton = me.query('#first')[0];
      me.RefreshButton = me.query('#refresh')[0];

      me.NextButton.addCls('logx-icon-btn mat-icons');
      me.NextButton.setIconCls('fast_forward blue');
      me.LastButton.addCls('logx-icon-btn mat-icons');
      me.LastButton.setIconCls('skip_next blue');
      me.PrevButton.addCls('logx-icon-btn mat-icons');
      me.PrevButton.setIconCls('fast_rewind blue');
      me.FirstButton.addCls('logx-icon-btn mat-icons');
      me.FirstButton.setIconCls('skip_previous blue');
      me.RefreshButton.addCls('logx-icon-btn mat-icons');
      me.RefreshButton.setIconCls('refresh darkblue');


      me.ComposeOwnMenu();

    },
  },


  initComponent: function ()
  {
    this.callParent(arguments);
    var me = this;
    me.ComposeOwnItems();
    me.__defaultPageSize = me.defaultpagesize;
  },


  updateStatusInfo: function (text)
  {
    this.getComponent('statusInfo').setText(Ext.Date.format(new Date(), 'H:i:s') + ' ' + text);
  },

  updateSelectionInfo: function (records)
  {
    if (records > 0)
    {
      this.getComponent('selectionInfo').setText('Отмечено ' + records + ' зап.');
    }
    else
    {
      this.getComponent('selectionInfo').setText('');
    };
  },

  doRefresh: function ()
  {
    var me = this;
    var current = me.store.currentPage;
    if (me.fireEvent('beforechange', me, current) !== false)
    {
      me.store.loadPage(current);
    };
  },

  ClearFilters: function ()
  {
    try 
    {
      if (this.up('grid') && this.up('grid').filters)
      {
        this.up('grid').filters.clearFilters();
      };
    }
    catch (err)
    {

    };
  },


  ComposeOwnItems: function ()
  {
    var me = this;

    me.CreateButton = Ext.create('ZML.button.Button', {
      itemId: 'CreateNewRecord',
      call: 'action',
      disabled: true,
      iconSet: 'mat-icons',
      __icon: 'add_circle',
      color: 'darkgreen',
      needSelection: 'none',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'CreateNewRecord-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'none',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnCreateClicked
    });
    me.RemoveButton = Ext.create('ZML.button.Button', {
      itemId: 'RemoveRecord',
      call: 'action',
      disabled: true,
      iconSet: 'mat-icons',
      __icon: 'remove_circle',
      color: 'darkred',
      needSelection: 'any',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'RemoveRecord-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'any',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnDeleteClicked
    });
    me.UpdateButton = Ext.create('ZML.button.Button', {
      itemId: 'UpdateRecord',
      call: 'action',
      disabled: true,
      iconSet: 'mat-icons',
      __icon: 'save',
      color: 'darkgreen',
      needSelection: 'any',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'UpdateRecord-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'any',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnUpdateClicked
    });
    me.EditButton = Ext.create('ZML.button.Button', {
      itemId: 'EditRecord',
      call: 'action',
      disabled: true,
      iconSet: 'mat-icons',
      __icon: 'edit',
      color: 'darkgreen',
      needSelection: 'single',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'EditRecord-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'single',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnEditClicked
    });

    me.CopyButton = Ext.create('ZML.button.Button', {
      itemId: 'CopyRecords',
      call: 'action',
      disabled: true,
      iconSet: 'mat-icons',
      __icon: 'post_add',
      color: 'brown',
      tooltip: 'Скопировать выбранные записи в буфер обмена',
      needSelection: 'any',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'CopyRecords-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'any',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnCopyClicked
    });


    me.PasteButton = Ext.create('ZML.button.Button', {
      itemId: 'PasteRecords',
      call: 'action',
      iconSet: 'mat-icons',
      __icon: 'archive',
      color: 'brown',
      tooltip: 'Вставить новые записи из буфера обмена',
      needSelection: 'none',
      plugins: [
        {
          ptype: 'HostContext',
          pluginId: 'PasteRecords-hostContextPlugin',
          CTX_BINDERS: [
            {
              hostType: 'grid',
              hostId: '',
              hostEvent: 'selectionchange',
              needSelection: 'none',
            }
          ]
        }
      ],
      OnHandlerCall: me.OnPasteClicked
    });


    me.GridEditorBtn = Ext.create('ZML.button.Button', {
      itemId: 'GridEditorMenuBtn',
      call: 'action',
      iconSet: 'mat-icons',
      __icon: 'more_vert',
      color: 'grey',
      tooltip: '',
      needSelection: 'none',
      OnHandlerCall: function (item, evt)
      {
        me.ShowOwnMenu(item, evt);
      }
    });

    me.PageSizeInput = Ext.create('Ext.form.field.Number', { itemId: 'rowsOnPage', labelWidth: 45, fieldLabel: 'На стр.:', width: 110, tooltip: 'Количество строк на странице', minValue: 1, maxValue: 9999 });

    me.insert(0, me.CreateButton);
    me.insert(1, me.RemoveButton);
    me.insert(2, me.UpdateButton);
    me.insert(3, me.EditButton);
    me.insert(4, { xtype: 'tbseparator', margin: '0 3' });
    //me.insert(4, me.CopyButton);
    //me.insert(5, me.PasteButton);
    //me.insert(6, { xtype: 'tbseparator', margin: '0 5' });
    me.insert(5, me.GridEditorBtn);

    me.add({ xtype: 'tbseparator', margin: '0 3' });
    me.add(me.PageSizeInput);

  },


  ComposeOwnMenu: function ()
  {
    var me = this;
    var grid = me.up('grid');
    me.MENU = new Ext.menu.Menu({

      id: grid.itemId + '-Paging-InnerMenu',
      animCollapse: true,
      allowOtherMenus: true,
      defaults: { clickHideDelay: 200 },
      HOST: me,
      items: [
        {
          xtype: 'menucheckitem',
          itemId: 'Item1',
          text: 'Отображать все записи',
          checked: false,
          handler: function (it)
          {
            var host = it.parentMenu.HOST;
            if (it.checked === true)
            {
              host.SetPageSize(host.up('grid').getStore().totalCount);
            }
            else
            {
              host.SetPageSize();
            };
          }
        },
        me.CopyButton,
        me.PasteButton
      ]
    });

  },

  ShowOwnMenu: function (it, ev)
  {
    this.MENU.showAt(ev.getXY());
    this.MENU.alignTo(it, 'bl?', [0, -90], false);
  },




  SetPageSize: function (amount)
  {
    var me = this;

    if (amount !== undefined && amount !== null)
    {
      if (+amount <= me.PageSizeInput.maxValue && +amount >= me.PageSizeInput.minValue)
      {
        me.__defaultPageSize = me.PageSizeInput.getValue();

        me.up('grid').getStore().pageSize = +amount;
        me.PageSizeInput.setValue(+amount);
        me.defaultpagesize = +amount;
        me.doRefresh();
      };
    }
    else
    {
      me.up('grid').getStore().pageSize = me.__defaultPageSize;
      me.PageSizeInput.setValue(me.__defaultPageSize);
      me.defaultpagesize = me.__defaultPageSize;
      me.doRefresh();
    };
  },




  OnCreateClicked: function ()
  {
    var grid = this.up('grid');
    grid.GRID_EDITOR.PrepareNewRows();
  },

  OnDeleteClicked: function ()
  {
    var grid = this.up('grid');
    var records = [].concat(grid.getSelectionModel().getSelection());
    grid.getStore().remove(records);
  },

  OnUpdateClicked: function ()
  {
    var grid = this.up('grid');
    if (grid && grid.getStore())
    {
      grid.getStore().sync();
    };
  },

  OnEditClicked: function ()
  {
    var grid = this.up('grid');
    if (grid && grid.editingPlugin)
    {
      grid.editingPlugin.startEdit(grid.GetSelectedRowField()[0], 0);
    };
  },

  OnCopyClicked: function ()
  {
    var grid = this.up('grid');
    grid.GRID_EDITOR.ExportToClipboard();
  },

  OnPasteClicked: function ()
  {

  },

  __defaultPageSize: null,

});