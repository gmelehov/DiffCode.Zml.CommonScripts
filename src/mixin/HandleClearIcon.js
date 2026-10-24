Ext.define('ZML.mixin.HandleClearIcon', {


  updateClearIcon: function ()
  {
    var me = this;
    var cls = 'saki-gms-hasvalue';
    var body = me.bodyEl ? me.bodyEl.down(me.inputElem) : null;
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
      if (typeof me.ComposeEmptyDisplayTpl === 'function' && me.descrField && me.descrField != me.displayField)
      {
        me.displayTpl = Ext.create('Ext.XTemplate', me.ComposeEmptyDisplayTpl(me.displayField).outerHTML);
      };
      me.setValue('');
      me.clearIcon = null;
      me.updateClearIcon();
    };
  }
});