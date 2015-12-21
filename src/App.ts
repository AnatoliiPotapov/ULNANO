///<reference path="./definitions/d3.d.ts" />

import Layout = require('./modules/Layout');
import Projects = require('./modules/ProjectArray');
import ProjectManager = require('./modules/ProjectManager');
import SVG_graph = require('./modules/Svg');

function Init(data) {
    var Vis = new SVG_graph(15000,15000,".vis");
    console.log(Vis);
    var NanoProjects = new Projects(Vis.svg, data)
    return [NanoProjects, Vis];
}

(<any>window).Init = Init;
(<any>window).ProjectManager = ProjectManager;
