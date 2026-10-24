/**
 * @private
 */
Ext.define('ZML.data.model.Input', {

  extend: 'Ext.data.Model',

  idProperty: 'id',
  SCOPE: null,

  fields: [
    {
      name: 'id',
      type: 'EField',
      Get: function ()
      {
        return this.itemId;
      },
      Set: function (value)
      {
        this.itemId = value;
      }
    },
    {
      name: 'label',
      type: 'EField',
      Get: function ()
      {
        return this.fieldLabel;
      },
      Set: function (value)
      {
        this.setFieldLabel(value);
      }
    },
    {
      name: 'value',
      type: 'EField',
      Get: function ()
      {
        return this.getSubmitValue();
      },
      Set: function (value)
      {
        this.setValue(value);
      }
    },
    {
      name: 'validity',
      type: 'EField',
      Get: function ()
      {
        return this.isValid();
      },
      Set: Ext.emptyFn
    },
    {
      name: 'readonly',
      type: 'EField',
      Get: function ()
      {
        return this.readOnly;
      },
      Set: function (value)
      {
        this.setReadOnly(value);
      }
    },
  ]

});