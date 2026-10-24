/** @deprecated */
Ext.define('ZML.controller.Base', {

  extend: 'Ext.app.Controller',

  Sources: {},
  Actions: {},
  Grids: {},
  Dialogs: {},
  Combos: {},

  __actions: [],
  __sources: [],
  __dialogs: [],
  __grids: [],
  __combos: [],
  __items: [],



  Find: function (opts)
  {
    var me = this;
    var view = this.ViewPort;
    var scope = opts.scope;
    var target = opts.target;
    var targetId = opts.targetId;
    var itemId = opts.itemId;
    var id = itemId || targetId;
    var idsplitted = (id && typeof id.split === 'function') ? id.split('.').reverse()[0] : id;
    var DLGKEYS = Ext.Object.getKeys(me.Dialogs);
    var DLGS = me.Dialogs;
    var ret;


    var SEARCH = function (xtype, val, parent, prop)
    {
      parent = parent || view;
      prop = prop || 'itemId';
      return parent.query(xtype + '[' + prop + '="' + val + '"]')[0];
    };

    var Grid_Search = function ()
    {
      var ret = SEARCH('grid', id) || SEARCH('grid', idsplitted);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('grid', id, DLGS[f]) || SEARCH('grid', idsplitted, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var Dialog_Search = function ()
    {
      var ret;
      if (scope && typeof scope.up === 'function') ret = scope.up('window');
      if (!ret && DLGS && id) ret = DLGS[id];
      if (!ret && !id) ret = Ext.WindowMgr.front;
      return ret;
    };
    var Tabpanel_Search = function ()
    {
      var ret;
      if (scope && typeof scope.up === 'function') ret = scope.up('tabpanel');
      if (!ret) ret = me.Find({ itemId: itemId, targetId: targetId });
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('tabpanel', id, DLGS[f]) || SEARCH('tabpanel', idsplitted, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var DialogForm_Search = function ()
    {
      var ret;
      if (scope && typeof scope.up === 'function') ret = scope.up('window').down('form');
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('form', id, DLGS[f]) || ret;
        });
      };
      if (!ret)
        ret = SEARCH('form', id, Ext.WindowMgr.front) || SEARCH('form', idsplitted, Ext.WindowMgr.front);

      return ret;
    };
    var Form_Search = function ()
    {
      var ret = SEARCH('form', id) || SEARCH('form', idsplitted);
      return ret;
    };
    var Source_Search = function ()
    {
      console.dir(id);
      var ret = Ext.getStore(id) || me.Sources[id] || me.Sources[idsplitted];
      if (!ret)
      {
        switch (id)
        {
          case 'SrcStore': ret = me.SrcStore; break;
          case 'ActStore': ret = me.ActStore; break;
          case 'VarStore': ret = me.VarStore; break;

          default: break;
        };
      };
      return ret;
    };
    var Action_Search = function ()
    {
      var ret = me.Actions[id] || me.LocalActions[id];
      return ret;
    };
    var Contextmenu_Search = function ()
    {
      var ret;
      if (itemId.endsWith('-CtxMenu'))
      {
        ret = Ext.getCmp(itemId);
      }
      else
      {
        var grid = me.Find({ target: 'grid', itemId: itemId, targetId: targetId });
        if (grid && grid.is('grid')) ret = grid.CtxMenu;
      };
      return ret;
    };
    var Menu_Search = function ()
    {
      var ret;
      return ret;
    };
    var Menuitem_Search = function ()
    {
      var ret;
      if (targetId)
      {
        var menu = me.Find({ target: 'contextmenu', itemId: targetId });
        if (menu && menu.isMenu && itemId)
        {
          if (!itemId.startsWith('#')) itemId = '#' + itemId;
          ret = menu.query(itemId)[0];
        };
        if (!ret && itemId)
        {
          var grid = me.Find({ target: 'grid', targetId: targetId });
          if (grid && grid.is('grid')) ret = grid.GetCtxMenuItem(itemId);
        };
      };
      return ret;
    };
    var Combo_Search = function ()
    {
      var ret = SEARCH('combobox', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('combobox', id, DLGS[f]) || ret;
        });
      };
      if (!ret)
      {
        var windows = Ext.WindowMgr.list;
        Ext.Object.getKeys(windows).forEach(function (w)
        {
          if (windows[w] && typeof windows[w].query === 'function')
          {
            ret = SEARCH('field', id, windows[w]) || ret;
          };
        });
      };
      return ret;
    };
    var Input_Search = function ()
    {
      var ret = SEARCH('field', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          var inner = SEARCH('field', id, DLGS[f]) || SEARCH('field', idsplitted, DLGS[f]);
          if (inner && !inner.is('combobox'))
            ret = inner;
        });
      };
      if (!ret)
      {
        var windows = Ext.WindowMgr.list;
        Ext.Object.getKeys(windows).forEach(function (w)
        {
          if (windows[w] && typeof windows[w].query === 'function')
          {
            var inner = SEARCH('field', id, windows[w]);
            if (inner && (!inner.is('combobox') || inner.is('timefield')))
              ret = inner;
          };
        });
      };
      if (ret && ret.is('combobox') && !ret.is('timefield')) ret = undefined;
      return ret;
    };
    var Frame_Search = function ()
    {
      var ret = SEARCH('SimpleIFrame', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('SimpleIFrame', id, DLGS[f]) || SEARCH('SimpleIFrame', idsplitted, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var Area_Search = function ()
    {
      var ret = SEARCH('ImageView', id) || SEARCH('MarkdownView', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('ImageView', id, DLGS[f]) || SEARCH('ImageView', idsplitted, DLGS[f]) || SEARCH('MarkdownView', id, DLGS[f]) || SEARCH('MarkdownView', idsplitted, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var Editor_Search = function ()
    {
      var ret = SEARCH('MarkdownEditor', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('MarkdownEditor', id, DLGS[f]) || ret;
        });
      };
      if (!ret) ret = SEARCH('XmlEditor', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('XmlEditor', id, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var List_Search = function ()
    {
      var ret = SEARCH('DataView', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('DataView', id, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var Caller_Search = function ()
    {
      var ret = SEARCH('ActionCaller', id) || SEARCH('DialogCaller', id) || SEARCH('MenuCaller', id) || SEARCH('TabCaller', id) || SEARCH('DialogConfirm', id) || SEARCH('DialogCancel', id);
      if (!ret)
      {
        DLGKEYS.forEach(function (f)
        {
          ret = SEARCH('ActionCaller', id, DLGS[f]) || SEARCH('DialogCaller', id, DLGS[f]) || SEARCH('MenuCaller', id, DLGS[f]) || SEARCH('TabCaller', id, DLGS[f]) || SEARCH('DialogConfirm', id, DLGS[f]) || SEARCH('DialogCancel', id, DLGS[f]) || ret;
        });
      };
      return ret;
    };
    var ANY_Search = function ()
    {
      var ret;
      if ((targetId && itemId))
      {
        var trg = SEARCH('*', targetId);
        if (trg)
        {
          ret = SEARCH('*', itemId, trg);
        };
      }
      else if (id)
      {
        ret = SEARCH('*', id);
      };
      return ret;
    };


    if (view)
    {
      switch (target)
      {
        case 'grid': ret = Grid_Search(); break;
        case 'dialog': ret = Dialog_Search(); break;
        case 'tabpanel': ret = Tabpanel_Search(); break;
        case 'dialogform': ret = DialogForm_Search(); break;
        case 'form': ret = Form_Search(); break;
        case 'source': ret = Source_Search(); break;
        case 'action': ret = Action_Search(); break;
        case 'contextmenu': ret = Contextmenu_Search(); break;
        case 'menu': ret = Menu_Search(); break;
        case 'menuitem': ret = Menuitem_Search(); break;
        case 'combo': ret = Combo_Search(); break;
        case 'input': ret = Input_Search(); break;
        case 'frame': ret = Frame_Search(); break;
        case 'area': ret = Area_Search(); break;
        case 'editor': ret = Editor_Search(); break;
        case 'list': ret = List_Search(); break;
        case 'caller': ret = Caller_Search(); break;

        default: ret = ANY_Search(); break;
      };
    };

    return ret;
  },

  FindGrid: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'grid', itemId: id }) || me.Find({ target: 'grid', targetId: id });
    return ret;
  },

  FindAllGrids: function ()
  {
    var me = this;
    var view = me.getView();
    var ret = [].concat(view.query('grid'));
    Ext.Object.getKeys(me.Dialogs).forEach(function (f)
    {
      ret = ret.concat(me.Dialogs[f].query('grid'));
    });
    return ret;
  },

  FindForm: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'form', itemId: id }) || me.Find({ target: 'form', targetId: id });
    return ret;
  },

  FindCombo: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'combo', itemId: id }) || me.Find({ target: 'combo', targetId: id });
    return ret;
  },

  FindInput: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'input', itemId: id }) || me.Find({ target: 'input', targetId: id });
    return ret;
  },

  FindArea: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'area', itemId: id }) || me.Find({ target: 'area', targetId: id });
    return ret;
  },

  FindEditor: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'editor', itemId: id }) || me.Find({ target: 'editor', targetId: id });
    return ret;
  },

  FindList: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'list', itemId: id }) || me.Find({ target: 'list', targetId: id });
    return ret;
  },

  FindFrame: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'frame', itemId: id }) || me.Find({ target: 'frame', targetId: id });
    return ret;
  },

  FindAction: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'action', itemId: id }) || me.Find({ target: 'action', targetId: id });
    return ret;
  },

  FindSource: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'source', itemId: id }) || me.Find({ target: 'source', targetId: id });
    return ret;
  },

  FindCaller: function (id)
  {
    var me = this;
    var ret = me.Find({ target: 'caller', itemId: id }) || me.Find({ target: 'caller', targetId: id });
    return ret;
  },







  FindProp: function (options)
  {
    var me = this;
    var name = options.name;
    var from = options.from || options.target;
    var itemId = options.itemId || options.id;
    var dynamicId = options.dynamicIdVar;
    var dynamicName = options.dynamicNameVar;



    var propSource = me.Find({ target: from, itemId: itemId });
    var ret = null;

    if (propSource && (typeof propSource.is === 'function' || propSource.isStore || propSource.isObservable))
    {

      if (typeof propSource.is === 'function' && propSource.is('DateField'))
      {
        switch (name)
        {
          case 'value': ret = propSource.getSubmitValue(); break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'validity': ret = propSource.isValid(); break;
          case 'id': ret = propSource.itemId; break;
          case 'format': ret = propSource.format; break;
          case 'date': if (propSource.value) ret = propSource.GetDay(); break;
          case 'month': if (propSource.value) ret = propSource.GetMonth(); break;
          case 'year': if (propSource.value) ret = propSource.GetYear(); break;
          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('TimeField'))
      {
        switch (name)
        {
          case 'value': ret = propSource.getSubmitValue(); break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'validity': ret = propSource.isValid(); break;
          case 'id': ret = propSource.itemId; break;
          case 'format': ret = propSource.format; break;
          case 'hours': ret = propSource.GetHours(); break;
          case 'minutes': ret = propSource.GetMinutes(); break;
          case 'seconds': ret = propSource.GetSeconds(); break;

          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('TextField'))
      {
        switch (name)
        {
          case 'value': ret = propSource.getValue(); break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'validity': ret = propSource.isValid(); break;
          case 'id': ret = propSource.itemId; break;
          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is("NumberField"))
      {
        switch (name)
        {
          case 'value': ret = propSource.getValue(); break;
          case 'minValue': ret = propSource.minValue; break;
          case 'maxValue': ret = propSource.maxValue; break;
          case 'step': ret = propSource.step; break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'validity': ret = propSource.isValid(); break;
          case 'id': ret = propSource.itemId; break;
          case 'format': ret = propSource.format; break;
          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('TextArea'))
      {
        switch (name)
        {
          case 'value': ret = propSource.getValue(); break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'validity': ret = propSource.isValid(); break;
          case 'id': ret = propSource.itemId; break;
          case 'rows': ret = propSource.rows; break;
          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('Checkbox'))
      {
        switch (name)
        {
          case 'value': ret = propSource.getValue(); break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'id': ret = propSource.itemId; break;
          case 'readonly': ret = propSource.readOnly; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && (propSource.is('BaseCombo') || propSource.is('Combo')))
      {
        switch (name)
        {
          case 'value': ret = propSource.getValue(); break;
          case 'displayValue': ret = propSource.getDisplayValue(); break;
          case 'descrValue': ret = propSource.getDescriptionValue(); break;
          case 'valueField': ret = propSource.valueField; break;
          case 'displayField': ret = propSource.displayField; break;
          case 'descrField': ret = propSource.descrField; break;
          case 'label':
          case 'title':
          case 'name': ret = propSource.fieldLabel; break;
          case 'id': ret = propSource.itemId; break;
          case 'src': ret = propSource.src; break;
          case 'loader': ret = propSource.sourceId; break;
          case 'totalcount': ret = propSource.ComboStore.getCount(); break;
          case 'validity': ret = propSource.isValid(); break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('button'))
      {
        switch (name)
        {
          case 'icon': ret = propSource.__icon; break;
          case 'iconSet': ret = propSource.iconSet; break;
          case 'title':
          case 'text': ret = propSource.getText(); break;
          case 'targetId': ret = propSource.targetId; break;
          case 'id': ret = propSource.itemId; break;
          case 'needSelection': ret = propSource.needSelection; break;
          case 'color': ret = propSource.color; break;
          case 'role': ret = propSource.btnRole; break;
          case 'disabled': ret = propSource.disabled; break;
          case 'hidden': ret = propSource.hidden; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('panel'))
      {
        switch (name)
        {
          case 'title': ret = propSource.title; break;
          case 'height': ret = propSource.getHeight(); break;
          case 'width': ret = propSource.getWidth(); break;
          case 'collapsed': ret = !!propSource.collapsed; break;
          case 'hidden': ret = !!propSource.hidden; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('ImageView'))
      {
        switch (name)
        {
          case 'src': ret = propSource.src; break;
          case 'loadMode': ret = propSource.loadMode; break;
          case 'loadUrl': ret = propSource.loadUrl; break;
          case 'saveUrl': ret = propSource.saveUrl; break;
          case 'loaded': ret = propSource.ImgLoaded; break;
          case 'accept': ret = propSource.Accept; break;
          case 'id': ret = propSource.itemId; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('SimpleIFrame'))
      {
        switch (name)
        {
          case 'projectname': ret = propSource.ProjectName; break;
          case 'pathname': ret = propSource.PathName; break;
          case 'title': ret = propSource.title; break;
          case 'height': ret = propSource.getHeight(); break;
          case 'width': ret = propSource.getWidth(); break;
          case 'collapsed': ret = !!propSource.collapsed; break;
          case 'hidden': ret = !!propSource.hidden; break;
          case 'id': ret = propSource.itemId; break;

          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('grid'))
      {
        switch (name)
        {
          case 'id': ret = propSource.itemId; break;
          case 'gridname': ret = propSource.gridName; break;
          case 'src': ret = propSource.GridSource; break;
          case 'create': ret = propSource.GridCreateAction; break;
          case 'update': ret = propSource.GridUpdateAction; break;
          case 'delete': ret = propSource.GridDeleteAction; break;
          case 'key': ret = propSource.keyName; break;
          case 'currentpage': ret = propSource.GetCurrentPage(); break;
          case 'pagesize': ret = propSource.Paging.getComponent('rowsOnPage').value; break;
          case 'visible': ret = propSource.IsVisible(); break;
          case 'selcount': ret = propSource.selectedKeys().length; break;
          case 'isEdited': ret = propSource.IsEditedRow(); break;
          case 'isAdded': ret = propSource.IsAddedRow(); break;
          case 'totalcount': ret = propSource.store.totalCount; break;
          case 'totalpages': ret = propSource.GetTotalPages(); break;
          case 'selectedkey': ret = propSource.selectedKeys()[0]; break;
          case 'selectedrow': ret = propSource.GetSelectedRow()[0].getData(); break;
          case 'columns': ret = propSource.columns.map(function (m) { return m.initialConfig }); break;


          default:
            if (name.startsWith('@'))
            {
              var fieldId = name.replace('@', '');
              var sel = propSource.GetSelectedRow('first', fieldId);
              ret = sel ? sel[0] : null;
            };
            if (name.startsWith('#') && !isNaN(parseInt(name.replace('#', ''))))
            {
              var recIndex = parseInt(name.replace('#', ''));
              var rec = propSource.getStore().getAt(recIndex);
              ret = rec ? rec.getData() : null;
            };
            if (name.startsWith('$'))
            {
              var columnName = name.replace('$', '');
              var column = propSource.columns.find(function (f) { return f.dataIndex == columnName });
              ret = column ? column.initialConfig : null;
            };
            break;
        };
      };
      if (typeof propSource.is === 'function' && (propSource.is('MarkdownEditor') || propSource.is('XmlEditor')))
      {
        switch (name)
        {
          case 'value': ret = propSource.GetEditorText(); break;
          case 'id': ret = propSource.itemId; break;


          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('MarkdownView'))
      {
        switch (name)
        {
          case 'src': ret = propSource.src; break;
          case 'id': ret = propSource.itemId; break;


          default: break;
        };
      };
      if (propSource.isStore && (me.FindSource(itemId).isStore || me.__sources.some(function (s) { return propSource.self.getName() === s; }) || me.__static.some(function (s) { return propSource.self.getName() === s; })))
      {
        switch (name)
        {
          case 'id': ret = propSource.storeId; break;
          case 'name': ret = itemId; break;
          case 'totalcount': ret = propSource.totalCount; break;
          case 'fields':
            ret = propSource.model.getFields().map(function (m) { return { name: m.name, type: m.type.type, index: m.originalIndex, defaultValue: m.defaultValue, mapping: m.mapping } });
            break;
          case 'currentpage': ret = propSource.currentPage; break;
          case 'pagesize': ret = propSource.pageSize; break;
          case 'totalpages': ret = propSource.GetTotalPages(); break;


          default: break;
        };
      };
      if (typeof propSource.is === 'function' && propSource.is('DataView'))
      {
        switch (name)
        {
          case 'id': ret = propSource.itemId; break;

          case 'value': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.valueField)[0] : null; break;
          case 'valueField': ret = propSource.valueField; break;

          case 'displayField': ret = propSource.getDisplayField(); break;
          case 'displayValue': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.displayField)[0] : null; break;

          case 'descrField': ret = propSource.getDescrField(); break;
          case 'descrValue': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.descrField)[0] : null; break;

          case 'secondaryField': ret = propSource.getSecondaryField(); break;
          case 'secondaryValue': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.secondaryField)[0] : null; break;

          case 'iconField': ret = propSource.getIconField(); break;
          case 'iconValue': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.iconField)[0] : null; break;

          case 'colorField': ret = propSource.getColorField(); break;
          case 'colorValue': ret = propSource.HasSelection() ? propSource.GetSelectedRow('first', propSource.colorField)[0] : null; break;

          case 'src': ret = propSource.src; break;

          case 'sel': ret = propSource.sel; break;

          case 'totalcount': ret = propSource.GetTotalCount(); break;
          case 'totalpages': ret = propSource.GetTotalPages(); break;
          case 'currentpage': ret = propSource.GetCurrentPage(); break;
          case 'pagesize': ret = propSource.GetPageSize(); break;



          default: break;
        };
      };
    };

    return ret;
  },


  SetProp: function (options)
  {
    var me = this;
    var name = options.name;
    var from = options.from || options.target;
    var itemId = options.itemId || options.id;
    var found = me.Find({ target: from, itemId: itemId });
    var value = options.value;
    var condition = options.condition;

    if (found)
    {
      if (typeof found.is === 'function' && found.is('DateField'))
      {
        if (!condition || (condition == 'IfEmpty' && !found.getSubmitValue()) || (condition == 'IfNotEmpty' && !!found.getSubmitValue()) || (condition == 'IfNotValid' && !found.isValid()))
        {
          switch (name)
          {
            case 'value': found.setRawValue(value); break;
            case 'label':
            case 'title':
            case 'name': found.setFieldLabel(value); found.fireEvent('labelchanged'); break;
            case 'format': found.format = value; found.fireEvent('formatchanged'); break;
            case 'date': found.SetDay(value); break;
            case 'month': found.SetMonth(value); break;
            case 'year': found.SetYear(value); break;
            case 'readonly': found.setReadOnly(value); break;

            default: break;
          };
        };
      };
      if (typeof found.is === 'function' && found.is('TimeField'))
      {
        if (!condition || (condition == 'IfEmpty' && !found.getSubmitValue()) || (condition == 'IfNotEmpty' && !!found.getSubmitValue()) || (condition == 'IfNotValid' && !found.isValid()))
        {
          switch (name)
          {
            case 'value': found.setRawValue(value); break;
            case 'label':
            case 'title':
            case 'name': found.setFieldLabel(value); found.fireEvent('labelchanged'); break;
            case 'format': found.format = value; found.fireEvent('formatchanged'); break;
            case 'hours': found.SetHours(value); break;
            case 'minutes': found.SetMinutes(value); break;
            case 'seconds': found.SetSeconds(value); break;
            case 'readonly': found.setReadOnly(value); break;

            default: break;
          };
        };
      };
      if (typeof found.is === 'function' && found.is('TextField'))
      {
        if (!condition || (condition == 'IfEmpty' && !found.getValue()) || (condition == 'IfNotEmpty' && !!found.getValue()) || (condition == 'IfNotValid' && !found.isValid()))
        {
          switch (name)
          {
            case 'value': found.setValue(value); break;
            case 'label':
            case 'title':
            case 'name': found.setFieldLabel(value); found.fireEvent('labelchanged'); break;
            case 'format': found.format = value; found.fireEvent('formatchanged'); break;
            case 'readonly': found.setReadOnly(value); break;

            default: break;
          };
        };
      };
      if (typeof found.is === 'function' && found.is('NumberField'))
      {
        if (!condition || (condition == 'IfEmpty' && !found.getValue()) || (condition == 'IfNotEmpty' && !!found.getValue()) || (condition == 'IfNotValid' && !found.isValid()))
        {
          switch (name)
          {
            case 'value': found.setValue(value); break;
            case 'minValue': found.setMinValue(value); break;
            case 'maxValue': found.setMaxValue(value); break;
            case 'step': found.step = value; break;
            case 'label':
            case 'title':
            case 'name': found.setFieldLabel(value); found.fireEvent('labelchanged'); break;
            case 'format': found.format = value; found.fireEvent('formatchanged'); break;
            case 'readonly': found.setReadOnly(value); break;

            default: break;
          };
        };
      };
      if (typeof found.is === 'function' && found.is('TextArea'))
      {
        if (!condition || (condition == 'IfEmpty' && !found.getValue()) || (condition == 'IfNotEmpty' && !!found.getValue()) || (condition == 'IfNotValid' && !found.isValid()))
        {
          switch (name)
          {
            case 'value': found.setValue(value); break;
            case 'label':
            case 'title':
            case 'name': found.setFieldLabel(value); found.fireEvent('labelchanged'); break;
            case 'format': found.format = value; found.fireEvent('formatchanged'); break;
            case 'readonly': found.setReadOnly(value); break;

            default: break;
          };
        };
      };
      if (typeof found.is === 'function' && found.is('Checkbox'))
      {
        switch (name)
        {
          case 'value': found.setValue(value); break;
          case 'label':
          case 'title':
          case 'name': found.setFieldLabel(value); break;
          case 'readonly': found.setReadOnly(value); break;

          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('button'))
      {
        switch (name)
        {
          case 'color': found.color = value; found.ComputeColor(); break;
          case 'icon': me.SetIcon({ itemId: itemId, value: value }); break;
          case 'iconSet': found.iconSet = value; found.ComputeIcon(); found.ComputeColor(); break;
          case 'title':
          case 'text': found.setText(value); break;
          case 'targetId': found.targetId = value; found.fireEvent('targetchanged'); break;
          case 'disabled': me.SetDisabled({ itemId: itemId, value: value }); break;
          case 'hidden': me.SetHidden({ itemId: itemId, value: value }); break;

          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('panel'))
      {
        switch (name)
        {
          case 'title': me.SetTitle({ itemId: itemId, value: value }); break;
          case 'height': found.setHeight(value); break;
          case 'width': found.setWidth(value); break;
          case 'collapsed': me.SetCollapsed({ itemId: itemId, value: value }); break;
          case 'hidden': me.SetHidden({ itemId: itemId, value: value }); break;

          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('ImageView'))
      {
        switch (name)
        {
          case 'src':
            found.src = value;
            if (found.src == null || found.src == undefined || found.src == -1 || found.src == ' ' || !found.src) found.ImgLoaded = false;
            if (found.loadMode == 'url-address') found.UpdateSrc(value);
            break;
          case 'loadMode': found.loadMode = value; break;
          case 'loadUrl': found.loadUrl = value; break;
          case 'saveUrl': found.saveUrl = value; break;
          case 'loaded': found.ImgLoaded = value; break;
          case 'accept': found.Accept = value; break;
          case 'title': me.SetTitle({ itemId: itemId, value: value }); break;
          case 'height': found.setHeight(value); break;
          case 'width': found.setWidth(value); break;
          case 'disabled': me.SetDisabled({ itemId: itemId, value: value }); break;
          case 'collapsed': me.SetCollapsed({ itemId: itemId, value: value }); break;
          case 'hidden': me.SetHidden({ itemId: itemId, value: value }); break;

          default: break;
        };

        if (found.loadMode == 'content')
          found.LoadPicture();
      };
      if (typeof found.is === 'function' && found.is('SimpleIFrame'))
      {
        switch (name)
        {
          case 'projectname': found.ProjectName = value; found.Load(); break;
          case 'pathname': found.PathName = value; found.Load(); break;
          case 'title': me.SetTitle({ itemId: itemId, value: value }); break;
          case 'height': found.setHeight(value); break;
          case 'width': found.setWidth(value); break;
          case 'disabled': me.SetDisabled({ itemId: itemId, value: value }); break;
          case 'collapsed': me.SetCollapsed({ itemId: itemId, value: value }); break;
          case 'hidden': me.SetHidden({ itemId: itemId, value: value }); break;

          default: break;
        };
      };
      if (typeof found.is === 'function' && (found.is('MarkdownEditor') || found.is('XmlEditor')))
      {
        switch (name)
        {
          case 'value': found.SetEditorText(value); break;


          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('MarkdownView'))
      {
        switch (name)
        {
          case 'src': found.UpdateSrc(value); break;


          default: break;
        };
      };
      if (found.isStore && (me.__sources.some(function (s) { return found.self.getName() === s; }) || me.__static.some(function (s) { return found.self.getName() === s; })))
      {
        switch (name)
        {
          case 'currentpage': found.SetCurrentPage(value);
          case 'pagesize': found.SetPageSize(value);

          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('DataView'))
      {
        switch (name)
        {
          case 'display':
          case 'displayField': found.setDisplayField(value); break;

          case 'descr':
          case 'descrField': found.setDescrField(value); break;

          case 'secondary':
          case 'secondaryField': found.setSecondaryField(value); break;

          case 'icon':
          case 'iconField': found.setIconField(value); break;

          case 'color':
          case 'colorField': found.setColorField(value); break;

          case 'src': found.setSrc(value); break;
          case 'sel': found.setSel(value); break;

          case 'pagesize': found.SetPageSize(value); break;
          case 'currentpage': found.SetCurrentPage(value); break;


          default: break;
        };
      };
      if (typeof found.is === 'function' && (found.is('BaseCombo') || found.is('Combo')))
      {
        switch (name)
        {
          case 'label': found.SetLabel(value); break;


          default: break;
        };
      };
      if (typeof found.is === 'function' && found.is('grid'))
      {

      };




    };







  },


});