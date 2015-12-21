class SVG_graph {

    preSvg;
    svg;
    zoom;

    constructor(width:number, height:number, parentTag:string) {
        this.zoom = d3.behavior.zoom().scaleExtent([0.01, 20]);

        this.preSvg = d3.select(parentTag)
            .append("div")
            .classed("svg-yNamecontainer", true) // container class to make it responsive
            .append("svg")
              .call(this.zoom.on("zoom", this.zoomFunction.bind(this)))
              .on("dblclick.zoom", null)
            .attr("preserveAspectRatio", "xMaxYMin slice")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true)
            .append("g");

        this.svg = this.preSvg;
    }

    private zoomFunction() {
        this.preSvg
            .attr("transform", "translate(" + (<any> d3.event).translate + ")scale(" + (<any> d3.event).scale + ")");
    }
}

export = SVG_graph;
