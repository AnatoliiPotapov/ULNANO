///<reference path="./d3.d.ts" />

import Sys = require('./Sys');
import Render = require('./Render');
import Project = require('./Project');

// определяем свойства и методы структуры, в которой храним данные - массиве проектов
interface NodeArray {
    nodes: Project[];
    FindByName(name:string);
    FindWithParentsByName(name:string);
    Filter(types:string[], statuses:string[]);
}

class Projects implements NodeArray {
    nodes: Project[];

    FindByName(name){
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name) node_index = i;
            if (node_index !== -1) return this.nodes[i];
        }
    }

    FindWithParentsByName(name){
        var output:Project[] = [];
        var projectName = name;
        var currentProject = this.FindByName(projectName) ;
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent)
        } while (currentProject != undefined);
        return output;
    }

    Filter(types:string[], statuses:string[]) {
        var output:Project[] = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) || statuses.indexOf(this.nodes[i].status)) >= 0) {
                output.push(this.nodes[i])
            }
        }
        return output;
    }

    constructor(parentSvgElement, data) {
        this.nodes = [];
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
            //console.log(newProject);
            this.nodes.push( newProject );
        }
    }

}

class SVG_graph {
    svg;
    a = 5;
    constructor(width:number, height:number, parentTag:string) {

        this.a = 5;

        this.svg = d3.select(parentTag)
            .append("div")
            .classed("svg-yNamecontainer", true) // container class to make it responsive
            .append("svg")
            .attr("preserveAspectRatio", "xMaxYMin slice")
            .attr("viewBox", "0 0 " + width + " " + height)
            .classed("svg-content-responsive", true)
            .append("g")
            .call(d3.behavior.zoom().scaleExtent([0.1, 8]).on("zoom", this.zoom.bind(this)))
            .append("g");
    }

    private zoom() {
        this.svg.attr("transform", "translate(" + (<any> d3.event).translate + ")scale(" + (<any> d3.event).scale + ")");
    }
}

// инициализируем данные
d3.json("json.json", function(error, data) {
    if (error) return console.warn(error);
    if (data) {
        console.log(data);
        var Vis = new SVG_graph(15000,15000,".vis");
        var NanoProjects = new Projects(Vis.svg, data)
        console.log(NanoProjects);
    }
});



