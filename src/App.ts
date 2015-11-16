///<reference path="./definitions/d3.d.ts" />

import Projects = require('./modules/ProjectArray');

class SVG_graph {
    preSvg;
    svg;
    constructor(width:number, height:number, parentTag:string) {
        this.preSvg = d3.select(parentTag)
            .append("div")
            .classed("svg-yNamecontainer", true) // container class to make it responsive
            .append("svg")
            .attr("preserveAspectRatio", "xMaxYMin slice")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true)
            .append("g")
                .call(d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", this.zoom.bind(this)))
            .append("g");

        this.svg = this.preSvg
            .append("g")
            .attr("class", "Bastard");
            /*.append("g")
                .attr("class", "scaleG")
            .append("g")
                .attr("class", "translateG");*/
    }

    private zoom() {
        /*this.svg.select(".scaleG")
            .attr("transform", "scale(" + (<any> d3.event).scale + ")");
        this.svg.select(".translateG")
            .attr("transform", "translate(" + (<any> d3.event).translate + ")");*/
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
    projects: Projects;

    constructor (projects) {
        this.projects = projects;
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
