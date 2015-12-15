///<reference path='./../definitions/d3.d.ts'/>
import Projects = require('./ProjectArray');
import Render = require('./Render');
import Sys = require('./Sys');

class Layout {
  projects: Projects;
  metaLayout; // Names, R, cx, cy, Rv
  svg;



  GetAlpha(Rlayout, Rout) {
    return 2 * Rout / Rlayout;
  }

  GePosition() {
    s
  }

  CalculatePosition(rootIndex) {

  }

  CalclulateRout(index, innerCoef, outerCoef) {
    var metaProject = this.metaLayout[index];

    if (metaProject.childrens.length == 0) {

      // means the project is terminal
      return [metaProject.R, 0];

    } else {

      // means that we need to calculate Rout of all child nodes
      var RoutMax = 0;
      var Rsum = 0;

      for (var i = 0; i < metaProject.childrens.length; i++) {

        var get = this.CalclulateRout(metaProject.childrens[i], innerCoef, outerCoef);
        var Rout = get[0] + get[1];
        Rsum = Rsum + Rout
        if ( Rout > RoutMax) RoutMax = Rout

      }

      var Rlayout = innerCoef * Math.max( Rsum / Math.PI , metaProject.R + RoutMax);
      return [Rlayout, outerCoef * RoutMax];
    }
  }

  constructor(projects) {
    this.projects = projects;
    this.svg = this.projects.parentSvgElement;

    // initialising metaLayout
    this.metaLayout = new Array;
    var nodes = this.projects.nodes;
    for (var i = 0; i < nodes.length; i++) {
      var childrens = this.projects.FindChildrensIndexes(nodes[i].name);
      this.metaLayout.push({
        name: nodes[i].name,
         R: nodes[i].currentPosition.r,
         Rout: undefined,
         RchMax: undefined,
         position: [nodes[i].currentPosition.cx, nodes[i].currentPosition.cy],
         childrens: childrens});
    };
    // calculating Rout
    for (var i = 0; i < nodes.length; i++) {
      var metaR = this.CalclulateRout(i, 1.1, 1.1);
      this.metaLayout[i].Rout = metaR[0],
      this.metaLayout[i].RchMax = metaR[1]
    };

    console.log(this.metaLayout);

    var data = this.metaLayout;

    var GetArc = function(d) {
      return Sys.ringGenerator(d.Rout,d.Rout+10)(d);
    };

    var GetOut = function(d) {
      return Sys.ringGenerator(d.Rout+d.RchMax,d.Rout+d.RchMax+10)(d);
    };

    this.svg
      .selectAll(".arc")
      .data(data)
      .enter().append("g")
      .attr("transform", function(d,i){ return "translate("+d.position[0]+","+d.position[1]+")";})
      .attr("class","arc")
          .append("path")
          .attr("d", GetArc);

      this.svg
        .selectAll(".out")
        .data(data)
        .enter().append("g")
        .attr("transform", function(d,i){ return "translate("+d.position[0]+","+d.position[1]+")";})
        .attr("class","arc")
            .append("path")
            .attr("d", GetOut);

    // drawing links
    for (var i = 0; i < nodes.length; i++) {
      var projectName = nodes[i].name;
      var parentName = nodes[i].parent;

      if (parentName != undefined && parentName != "NA") {
        var project = nodes[i];
        var parent = this.projects.FindByName(parentName);

        this.svg
          .append("line")
          .attr("x1", project.currentPosition.cx)
          .attr("y1", project.currentPosition.cy)
          .attr("x2", parent.currentPosition.cx)
          .attr("y2", parent.currentPosition.cy)
          .attr("stroke-width", 20)
          .attr("stroke", "black");
        console.log([project, parent]);

      }
    };
  }

}

export = Layout;
