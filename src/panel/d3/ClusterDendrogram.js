Ext.define('ZML.panel.d3.ClusterDendrogram', {

  extend: 'Ext.panel.Panel',
  alias: 'widget.D3Cluster',

  bodyPadding: 10,
  overflowX: 'auto',
  overflowY: 'auto',
  width: '100%',
  height: '100%',

  config: {
    jsondata: null,
  },

  strokeColor: '#999',
  strokeOpacity: 0.4,
  strokeWidth: 1,
  colorOver: 'hsl(195, 60%, 45%)',
  itemdX: 13,
  circle: {
    radius: 2.5,
    nodeColor: '#555',
    leafColor: '#AAA'
  },



  setJsondata: function (value)
  {
    var oldvalue = this.getJsondata();
    this.jsondata = value;
    if (oldvalue != value)
    {
      this.fireEvent('jsondataChanged', this, oldvalue, value);
    };
  },


  initComponent: function (config)
  {
    var me = this;
    me.addEvents('jsondataChanged');
    me.on({
      jsondataChanged: me.OnJsondataChanged,

      scope: me
    });
    me.initConfig(config);
    me.callParent(arguments);
  },


  OnJsondataChanged: function (obj, oldval, newval)
  {
    if (obj && newval)
    {
      obj.body.el.dom.querySelector('span > div').innerHTML = '';
      var item = obj.ComposeSvgRoot();
      obj.body.el.dom.querySelector('span > div').append(item);
    };
  },


  ComposeSvgRoot: function ()
  {
    var me = this;

    function autoBox()
    {
      document.body.appendChild(this);
      const { x, y, width, height } = this.getBBox();
      document.body.removeChild(this);
      return [x, y, width, height];
    };


    //function overed(event, d)
    //{
    //  d3.select(this).attr('fill', me.colorOver);
    //  d3.select(d3.select(this).select(d => d.parent).node()).attr('fill', me.colorOver);
    //  //d3.selectAll(d.map(d => d.source.text)).attr('fill', me.colorOver);
    //};
    //function outed(event, d)
    //{
    //  d3.select(this).attr('fill', null);
    //  d3.select(d3.select(this).select(d => d.parent).node()).attr('fill', null);
    //  //d3.selectAll(d.map(d => d.target.text)).attr('fill', null);
    //  //d3.selectAll(d.map(d => d.source.text)).attr('fill', null);
    //};


    var tree = data =>
    {
      const root = d3.hierarchy(data).sort((a, b) => d3.descending(a.height, b.height) || d3.ascending(a.data.name, b.data.name));
      root.dx = me.itemdX;
      root.dy = me.getWidth() / (root.height + 1);
      return d3.cluster().nodeSize([root.dx, root.dy])(root);
    };

    const root = tree(me.jsondata);
    const svg = d3.create("svg");

    svg.append("g")
      .attr("fill", "none")
      .attr("stroke", me.strokeColor)
      .attr("stroke-opacity", me.strokeOpacity)
      .attr("stroke-width", me.strokeWidth)
      .selectAll("path")
      .data(root.links())
      .join("path")
      .attr("d", d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
         ${d.source.y + root.dy / 2},${d.source.x}
         ${d.source.y},${d.source.x}
      `)
      ;

    svg.append("g")
      .selectAll("circle")
      .data(root.descendants())
      .join("circle")
      .attr("cx", d => d.y)
      .attr("cy", d => d.x)
      .attr("fill", d => d.children ? me.circle.nodeColor : me.circle.leafColor)
      .attr("r", me.circle.radius);

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll("text")
      .data(root.descendants())
      .join("text")
      .attr("x", d => d.y)
      .attr("y", d => d.x)
      .attr("dy", "0.31em")
      .attr("dx", d => d.children ? -6 : 6)
      .text(d => d.data.name)
      //.on('mouseover', overed)
      //.on('mouseout', outed)
      .filter(d => d.children)
      .attr("text-anchor", "end")
      .clone(true).lower()
      .attr("stroke", "white")
      ;

    return svg.attr("viewBox", autoBox).node();
  },
});
