import Layout = require('./Layout');
import Projects = require('./ProjectArray');
import View = require('./View');
//import Link = require('./Link');

class ProjectManager {
    layout: Layout;
    projects: Projects;
    svg;
    view: View;

    constructor (projects, svg) {
        this.layout = new Layout(projects)
        this.projects = projects;
        this.svg = projects.parentSvgElement;
        this.view = new View(this.layout, svg);

        var view = this.view;

        this.projects.nodes
            .forEach(function(node) {
                node.svgElement.on("dblclick", function(d) {

                    alert(node.name);
                    alert(projects.FindIndexByName(node.name));

                    view.SetView(projects.FindIndexByName(node.name));


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
      // Update Radiuses of projects
      this.projects.nodes.forEach(function(entry) {
          entry.UpdateLayout(Mode)
      })

      // Update Nodes positions
      this.layout.UpdateMetaLayout(this.projects)

      // Rerender node to new coordinates
      var coordinates = this.layout.GetNodesPosition()

      this.view.SetView(0);

      for (var i=0; i < this.projects.nodes.length; i++) {
        this.projects.nodes[i].UpdatePosition(coordinates[i][0],coordinates[i][1]);
      }


    }
}

export = ProjectManager;
