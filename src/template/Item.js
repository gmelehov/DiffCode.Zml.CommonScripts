Ext.define('ZML.template.Item', {

  extend: 'Ext.Component',
  alias: 'widget.ItemTemplate',

  isItemTemplate: true,

  /** Название этого шаблона */
  Name: null,

  /** Типы элементов, использующих этот шаблон */
  Types: [],

  Template: [],

  XTEMPLATE: null,


  initComponent: function (cfg)
  {
    //this.Name = cfg.Name;
    //this.Types = [].concat(cfg.Types);
    //this.Template = [].concat(cfg.Template);
    this.id = this.Name;

    this.XTEMPLATE = new Ext.XTemplate(this.Template);
  },
});