///<reference path="./definitions/d3.d.ts" />

import Layout = require('./modules/Layout')
import Projects = require('./modules/ProjectArray');

class SVG_graph {
    preSvg;
    svg;
    constructor(width:number, height:number, parentTag:string) {
        this.preSvg = d3.select(parentTag)
            .append("div")
            .classed("svg-yNamecontainer", true) // container class to make it responsive
            .append("svg")
              .call(d3.behavior.zoom().scaleExtent([0.01, 20]).on("zoom", this.zoom.bind(this)))
            .attr("preserveAspectRatio", "xMaxYMin slice")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true)
            .append("g");

        this.svg = this.preSvg;
    }

    private zoom() {
        this.preSvg
            .attr("transform", "translate(" + (<any> d3.event).translate + ")scale(" + (<any> d3.event).scale + ")");
    }
}

function Init(data) {
    var Vis = new SVG_graph(15000,15000,".vis");
    console.log(Vis);
    var NanoProjects = new Projects(Vis.svg, data)
    return NanoProjects;
}

(<any>window).Init = Init;


class ProjectManager {
    layout: Layout;
    projects: Projects;

    constructor (projects) {
        this.layout = new Layout(projects)
        this.projects = this.layout.projects;
        this.projects.nodes
            .forEach(function(node) {
                node.svgElement.on("dblclick", function(d) {
                    alert(node.currentPosition.cx);

                    projects.parentSvgElement
                        .transition()
                        .attr("transform", "translate(" +
                            (-node.currentPosition.cx + 7500.0)+
                            "," +
                            (-node.currentPosition.cy + 1500) + ")");

                });
            })
    }

    ChangeState(types, statuses, text, sharesMode) {
        var projects = this.projects;
        var currentSelection = projects.Filter(types, statuses);

        projects.nodes.forEach(function(entry) {
            entry.Hide();
        });

        currentSelection.forEach(function(entry) {
            //console.log(entry);
            var entryWithParents = projects.FindWithParentsByName(entry.name)
            entryWithParents.forEach(function(node) {
                node.Show();
                node.SetMode(text, sharesMode);
            });
        });
    }

    UpdateLayout(Mode) {

        this.projects.nodes.forEach(function(entry) {
            entry.UpdateLayout(Mode)
        })

        var mainNode = this.projects.FindByName("ULNANOTECH").currentPosition;

        this.projects.parentSvgElement
            .transition()
            .attr("transform", "translate(" + (-mainNode.cx + 7500.0) + "," + (-mainNode.cy + 1500) + ")");

    }
}

(<any>window).ProjectManager = ProjectManager;
