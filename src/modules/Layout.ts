import Projects = require('./ProjectArray');

class Layout {
  metaLayout; // Names, R, cx, cy, Rv
  svg;

  GetAlpha(Rlayout, Rout) {
    return 4 * Math.asin( 0.5 * Rout / Rlayout);
  }

  GetPosition(start, R, alpha) {
    var x = start[0] + R * Math.cos(alpha);
    var y = start[1] + R * Math.sin(alpha);
    return [x,y];
  }

  CalculatePosition(rootIndex) {
    // initialise if main node
    if ( rootIndex == 0 ) {
      this.metaLayout[rootIndex].cx = 0.0;
      this.metaLayout[rootIndex].cy = 0.0;
    }

    var position = [this.metaLayout[rootIndex].cx, this.metaLayout[rootIndex].cy];
    var R = this.metaLayout[rootIndex].Rout;

    var alpha = 0.0;
    var delta = 0.0;

    if ( this.metaLayout[rootIndex].childrens.length > 1 ) {

      delta = 2 * Math.PI;
      for (var i = 0; i < this.metaLayout[rootIndex].childrens.length; i++) {

        var nodeIndex = this.metaLayout[rootIndex].childrens[i];
        var nodeOuterR = this.metaLayout[nodeIndex].Rout + this.metaLayout[nodeIndex].RchMax;
        var alphaIncr = this.GetAlpha(this.metaLayout[rootIndex].Rout, nodeOuterR);

        delta = delta - alphaIncr
      }

      delta = delta / this.metaLayout[rootIndex].childrens.length;

    }

    for (var i = 0; i < this.metaLayout[rootIndex].childrens.length; i++) {

      var nodeIndex = this.metaLayout[rootIndex].childrens[i];
      var nodeOuterR = this.metaLayout[nodeIndex].Rout + this.metaLayout[nodeIndex].RchMax;
      var alphaIncr = this.GetAlpha(this.metaLayout[rootIndex].Rout, nodeOuterR);

      alpha = alpha + 0.5*alphaIncr;
      var nodePosition = this.GetPosition(position, R, alpha)
      alpha = alpha + 0.5*alphaIncr;
      alpha = alpha + delta;

      this.metaLayout[nodeIndex].cx = nodePosition[0];
      this.metaLayout[nodeIndex].cy = nodePosition[1];

      this.CalculatePosition(nodeIndex)
    }


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

  ChangeLayout(projects) {

  }

  UpdateMetaLayout(projects) {
    // initialising metaLayout
    this.metaLayout = new Array;
    var nodes = projects.nodes;
    for (var i = 0; i < nodes.length; i++) {
      var childrens = projects.FindChildrensIndexes(nodes[i].name);
      this.metaLayout.push({
        name: nodes[i].name,
         R: nodes[i].currentPosition.r,
         Rout: undefined,
         RchMax: undefined,
         cx: undefined,
         cy: undefined,
         childrens: childrens});
    }
  }

  GetNodesPosition() {
    // calculating Rout
    for (var i = 0; i < this.metaLayout.length; i++) {
      var metaR = this.CalclulateRout(i, 1.1, 1.1);
      this.metaLayout[i].Rout = metaR[0],
      this.metaLayout[i].RchMax = metaR[1]
    };
    // calculate Position
    this.CalculatePosition(0);
    var output = new Array;
    // return New POsition
    for (var i = 0; i < this.metaLayout.length; i++) {
      output.push([this.metaLayout[i].cx,this.metaLayout[i].cy]);
    }
    return output;
  }

  constructor(projects) {
    this.svg = projects.parentSvgElement;
    this.UpdateMetaLayout(projects);
  }

}

export = Layout;
