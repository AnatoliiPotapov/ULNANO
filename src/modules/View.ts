///<reference path="./../definitions/d3.d.ts" />

class View {
  svg;
  zoom;
  layout;
  lastP;

  constructor(layout, svg) {
    this.svg = svg.svg;
    this.zoom = svg.zoom;
    this.layout = layout;
    this.lastP = [0,0,7500];
  }

  transition(svg, zoom, start, end) {
    var center = [7500,4000],
        i = d3.interpolateZoom(start, end);

    d3.transition().duration(2 * i.duration).tween("zoom", function() {
      return function(t) {
        var p = transform(i(t));

        svg.call(zoom.event);

        zoom
        .scale(p[0])
        .translate([p[1],p[2]]);

      }
    });

    function transform(p) {
      var k = 4000 / p[2];
      return [k,(center[0] - p[0] * k),(center[1] - p[1] * k)];
      //return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
    }
  }

  SetView(rootIndex) {


    var scale = scale =  3800 / (
      this.layout.metaLayout[rootIndex].Rout +
      this.layout.metaLayout[rootIndex].RchMax );
    var translate = [
      7500 - this.layout.metaLayout[rootIndex].cx * scale,
      4000 - this.layout.metaLayout[rootIndex].cy * scale
    ];
    var height = (
      this.layout.metaLayout[rootIndex].Rout +
      this.layout.metaLayout[rootIndex].RchMax );

    var newP = [this.layout.metaLayout[rootIndex].cx,this.layout.metaLayout[rootIndex].cy,height];

    this.transition(this.svg, this.zoom, this.lastP, newP);

    this.lastP = newP;
  }
}

export = View;
