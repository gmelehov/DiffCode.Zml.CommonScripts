/** ИКОНКА */
Ext.define('ZML.Icon', {

  extend: 'Ext.Component',
  alias: 'widget.Icon',

  autoEl: {
    tag: 'span'
  },

  style: {
    borderRadius: '50%',
    cursor: 'pointer',
    transition: '120ms all ease-in-out'
  },

  baseCls: 'icon-item',
  overCls: 'icon-item-over',
  componentCls: 'mat-icons',

  config: {
    iconsize: null,
    name: null,
    color: null,
  },


  setIconsize: function (value)
  {
    var oldvalue = this.getIconsize();
    this.iconsize = value;
    if (oldvalue != value)
    {
      this.fireEvent('sizeChanged', this, oldvalue, value);
    };
  },


  setName: function (value)
  {
    var oldvalue = this.getName();
    this.name = value;
    if (oldvalue != value)
    {
      this.fireEvent('nameChanged', this, oldvalue, value);
    };
  },


  setColor: function (value)
  {
    var oldvalue = this.getColor();
    this.__lastColor = oldvalue;
    this.color = value;
    if (oldvalue != value)
    {
      this.fireEvent('colorChanged', this, oldvalue, value);
    };
  },


  initComponent: function ()
  {
    var me = this;
    me.callParent(arguments);

    me.addEvents('sizeChanged', 'nameChanged', 'colorChanged');
    me.on({
      colorChanged: me.OnColorChanged,
      sizeChanged: me.OnSizeChanged,
      nameChanged: me.OnNameChanged,
      afterrender: me.OnAfterRender,
      scope: me
    });
  },


  OnAfterRender: function (obj)
  {
    obj.fireEvent('sizeChanged', obj, null, obj.iconsize);
    obj.fireEvent('nameChanged', obj, null, obj.name);
    obj.fireEvent('colorChanged', obj, obj.__lastColor, obj.color);
    Ext.get(obj.el.dom).on('click', function (e, t, eOpts)
    {
      obj.OnClick(arguments);
    });
  },


  OnSizeChanged: function (obj, oldvalue, newvalue)
  {
    obj.setWidth(newvalue);
    obj.setHeight(newvalue);
    obj.el.dom.style.setProperty('font-size', newvalue + 'px');
  },


  OnNameChanged: function (obj, oldvalue, newvalue)
  {
    obj.el.dom.textContent = newvalue;
  },


  OnColorChanged: function (obj, oldvalue, newvalue)
  {
    obj.removeCls('color-' + oldvalue);
    obj.addCls('color-' + newvalue);
  },


  OnClick: function ()
  {

  },

})