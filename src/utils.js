
Ext.require('Ext.ux.grid.menu.ListMenu');
Ext.require('Ext.ux.grid.FiltersFeature');
Ext.require('Ext.ux.grid.filter.StringFilter');
Ext.require('Ext.ux.grid.filter.ListFilter');
Ext.require('Ext.ux.grid.filter.NumericFilter');






function ExtendExtStoreManager()
{
  Ext.StoreManager.LINKS = [];
  Ext.StoreManager.LINKS_MAP = {};


  Ext.StoreManager.on('add', function (indx, stor, key)
  {
    if (stor && Array.isArray(stor.paramLinkers) && stor.paramLinkers.length && !Ext.StoreManager.LINKS_MAP[key])
    {
      Ext.StoreManager.LINKS.push({
        storeId: key,
        ObjectType: stor.ObjectType,
        linkers: [].concat(stor.paramLinkers)
      });
      Ext.StoreManager.LINKS_MAP[key] = stor.paramLinkers.length;
    };
  }, Ext.StoreManager);

  Ext.StoreManager.QueryLinks = function (query)
  {
    if (query)
    {
      var qry = Ext.Object.getKeys(query);
      return Ext.StoreManager.LINKS.filter(function (f)
      {
        return f.linkers.some(function (s)
        {
          return qry.every(function (ev)
          {
            return s[ev] == query[ev];
          });
        })
      })
    };
  };

  Ext.StoreManager.GetLinkedStores = function (query)
  {
    return Ext.StoreManager.QueryLinks(query).filter(function (f) { return f.ObjectType == 'source'; }).map(function (m)
    {
      return Ext.getStore(m.storeId)
    });
  };

  Ext.StoreManager.LoadLinkedStores = function (query)
  {
    Ext.StoreManager.GetLinkedStores(query).forEach(function (f) { f.load(); });
  };



  Ext.StoreManager.SOURCE = function (id)
  {
    return Ext.StoreManager.items.filter(function (f) { return f.ObjectType == 'source' && (id ? f.storeId == id : true); });
  };

  Ext.StoreManager.ACTION = function (id)
  {
    return Ext.StoreManager.items.filter(function (f) { return f.ObjectType == 'action' && (id ? f.storeid == id : true); });
  };

  /**
   * Метод для загрузки всех хранилищ данных, имеющих свойство autoLoad = true.
   * Предназначен для автоматической инициализации хранилищ данных,
   * вызывается однократно при запуске приложения.
   */
  Ext.StoreManager.AutoloadSources = function ()
  {
    Ext.StoreManager.SOURCE().filter(function (stor) { return stor.autoLoad === true && stor.totalCount === 0; }).forEach(function (st)
    {
      st.load();
    });
  },




  Ext.StoreManager.NEWRECORD = function (linkers)
  {
    if (Array.isArray(linkers) && linkers.every(function (ev) { return ev.isParam; }))
    {
      linkers.forEach(function (f) { f.compute(); });
      var record = {};
      linkers.forEach(function (f)
      {
        record[f.as] = f.value;
      });
      record.phantom = true;
      return record;
    };
  };

  Ext.StoreManager.SAVENEWRECORD = function (id, linkers)
  {
    if (id && Ext.StoreManager.SOURCE(id) && Array.isArray(linkers) && linkers.every(function (ev) { return ev.isParam; }))
    {
      var rec = Ext.StoreManager.NEWRECORD(linkers);
      rec.phantom = true;
      Ext.StoreManager.SOURCE(id)[0].AddAndSaveRecord(rec);
    };
  };

}


ExtendExtStoreManager();





function ExtendComboBox()
{
  Ext.override(Ext.form.field.ComboBox, {

    SelectRecordByValue: function ()
    {
      var me = this;
      if (me.store && me.store.isStore)
      {
        var record = me.store.findRecord(me.valueField, me.defaultValue);
        me.select(record);
      };
    },


    updateClearIcon: function ()
    {
      var me = this;
      var cls = 'saki-gms-hasvalue';
      var body = me.bodyEl ? me.bodyEl.down('input') : null;
      var value = me.getValue ? me.getValue() : null;
      if (body)
      {
        body = body.up('td');
        me.clearIcon = me.bodyEl.dom.querySelector('div.saki-gms-clear');
        if (!me.clearIcon)
        {
          me.clearIcon = body.createChild({ tag: 'div', cls: 'saki-gms-clear' });
          me.clearIcon.on('click', Ext.bind(me.clearField, me, [me]));
          body.applyStyles({ position: 'relative' });
        };
        if (value && !me.readOnly && !me.disabled)
        {
          body.addCls(cls);
        }
        else
        {
          body.removeCls(cls);
        };
      };
    },


    clearField: function ()
    {
      var me = this;
      if (me && Ext.isFunction(me.setValue) && !me.readOnly && !me.disabled)
      {
        me.setValue(null);
        me.clearIcon = null;
        me.updateClearIcon();
      };
    }

  });
}

ExtendComboBox();








function ExtendExtTreeColumn()
{
  Ext.override(Ext.tree.Column, {

    cellTpl: [
      '<tpl for="lines">',
      '<img src="{parent.blankUrl}" class="{parent.childCls} {parent.elbowCls}-img ',
      '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"/>',
      '</tpl>',
      '<img src="{blankUrl}" class="{childCls} {elbowCls}-img {elbowCls}',
      '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"/>',
      '<tpl if="checked !== null">',
      '<input type="button" {ariaCellCheckboxAttr}',
      ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"/>',
      '</tpl>',
      '<img src="{blankUrl}" role="presentation" class="{childCls} {baseIconCls} ',
      '{baseIconCls}-<tpl if="leaf">leaf<tpl else>parent</tpl> {iconCls}"',
      '<tpl if="icon">style="background-image:url({icon})"</tpl>/>',
      '<tpl if="href">',
      '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
      '<tpl else>',

      '<span class="mat-icons icon-24">{iconCls}</span>',

      '<span class="{textCls} {childCls}">{value}</span>',
      '</tpl>'
    ],

  });
}


ExtendExtTreeColumn();





/**
 * @class Ext.data.Types
 * Additional Types for {@link Ext.data.Field}
 */
(function ()
{
  if (typeof Ext !== 'undefined' && Ext.data && Ext.data.Types)
  {
    Ext.apply(Ext.data.Types, {


      /**
       * @property {Object} ARRAY
       * Converts the value into an array. Use `arrayType` to specify the type of each
       * array item. `arrayType` can be any {@link Ext.data.Types} type.
       * `arrayType` can be a string or an object. If `arrayType` is an object,
       * it is used as config object for an {@link Ext.data.Field}, though only the properties
       * `type`, `convert`, `defaultValue` and `useNull` are relevant. If it is not given,
       * {@link Ext.data.Types#AUTO} is used.
       */
      ARRAY: {

        convert: function (v)
        {
          var res = [],
            defaultValue = this.useNull ? null : res,
            i,
            len,
            at = this.arrayType;

          if (!at && this.config && this.config.arrayType) // for Sencha Touch
            this.arrayType = at = this.config.arrayType;

          // create an Ext.data.Field. The CTOR handles the logic we need
          if (!(at instanceof Ext.data.Field))
          {
            if (Ext.isString(at))
              this.arrayType = at = { type: at };
            this.arrayType = at = new Ext.data.Field(at);
          }

          if (v === undefined || v === null)
            return defaultValue;

          v = Ext.Array.from(v);

          for (i = 0, len = v.length; i < len; i++)
            res.push(at.convert(v[i]));
          return res;
        },
        sortType: Ext.data.SortTypes.none,
        type: 'array'
      }
    });


    var shortCuts = [

			/**
			 * @property {Object} STRING[]
			 * Converts the value into an array. Each item is converted to {@link Ext.data.Types#STRING string}.
			 */
      'STRING',

			/**
			 * @property {Object} INT[]
			 * Converts the value into an array. Each item is converted to {@link Ext.data.Types#INT int}.
			 */
      'INT',

			/**
			 * @property {Object} INTEGER[]
			 * @inheritdoc #INT[]
			 */
      'INTEGER',

			/**
			 * @property {Object} FLOAT[]
			 * Converts the value into an array. Each item is converted to {@link Ext.data.Types#FLOAT float}.
			 */
      'FLOAT',

			/**
			 * @property {Object} NUMBER[]
			 * @inheritdoc #FLOAT[]
			 */
      'NUMBER'


      // DATE and BOOL arrays don't make sense for me
    ];

    var len = shortCuts.length;

    for (var i = 0; i < len; i++)
      Ext.data.Types[shortCuts[i] + '[]'] = (function (arrayType)
      {
        return {
          convert: function ()
          {
            this.arrayType = arrayType;
            this.convert = Ext.data.Types.ARRAY.convert;
            return this.convert.apply(this, arguments);
          },
          sortType: Ext.data.SortTypes.none,
          type: 'array'
        };
      })(shortCuts[i]);
  }
})();



