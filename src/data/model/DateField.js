/**
 * @private
 */
Ext.define('ZML.data.model.DateField', {

  extend: 'ZML.data.model.Input',

  SCOPE: null,

  fields: [
    {
      name: 'format',
      type: 'EField',
      Get: function ()
      {
        return this.format;
      },
      Set: function (value)
      {
        this.format = value;
      }
    },
    {
      name: 'date',
      type: 'EField',
      Get: function ()
      {
        return this.value ? this.GetDay() : null;
      },
      Set: function (value)
      {
        this.SetDay(value);
      }
    },
    {
      name: 'month',
      type: 'EField',
      Get: function ()
      {
        return this.value ? this.GetMonth() : null;
      },
      Set: function (value)
      {
        this.SetMonth(value);
      }
    },
    {
      name: 'year',
      type: 'EField',
      Get: function ()
      {
        return this.value ? this.GetYear() : null;
      },
      Set: function (value)
      {
        this.SetYear(value);
      }
    },
  ]

});