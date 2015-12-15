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
    parentSvgElement;

    FindByName(name){
        for (var i = 0; i < this.nodes.length; i++) {
            var node_index = -1;
            if (this.nodes[i].name === name) node_index = i;
            if (node_index !== -1) return this.nodes[i];
        }
    }

    FindChildrensNames(name){
      var output = new Array;
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].parent === name) output.push(this.nodes[i].name)
      }
      return output;
    }

    FindChildrensIndexes(name){
      var output = new Array;
      for (var i = 0; i < this.nodes.length; i++) {
        if (this.nodes[i].parent === name) output.push(i)
      }
      return output;
    }

    FindWithChildrensByName(name){

    }

    FindWithParentsByName(name){
        var output:Project[] = [];
        var currentProject = this.FindByName(name) ;
        do {
            output.push(currentProject);
            currentProject = this.FindByName(currentProject.parent)
        } while (currentProject != undefined);
        return output;
    }

    Filter(types:string[], statuses:string[]) {

        var output:Project[] = [];
        for (var i = 0; i < this.nodes.length; i++) {
            if ((types.indexOf(this.nodes[i].type) >= 0 ) && (statuses.indexOf(this.nodes[i].status) >= 0)) {
                output.push(this.nodes[i])
            }
        }
        console.log(output);
        return output;
    }

    constructor(parentSvgElement, data) {
        this.nodes = [];
        this.parentSvgElement = parentSvgElement;
        for (var i = 0; i < data.length; i++) {
            var newProject = new Project(parentSvgElement, data[i]);
            this.nodes.push( newProject );
        }
    }

}

export = Projects;
