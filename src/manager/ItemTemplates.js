Ext.define('ZML.manager.ItemTemplates', {

  extend: 'Ext.AbstractManager',


  singleton: true,


  registerType: function (name)
  {
    //var proto = config.prototype;
    //var itemtemplate;

    //if (proto && proto.isItemTemplate)
    //{
    //  // registering an already defined model
    //  itemtemplate = config;
    //}
    //else
    //{
    //  // passing in a configuration
    //  if (!config.extend)
    //  {
    //    config.extend = '{{APP_NS}}.template.Item';
    //  }
    //  itemtemplate = Ext.define(name, config);
    //}
    this.types[name] = name;
    return name;
  },








});