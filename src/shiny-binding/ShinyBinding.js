$(function() {

    function SetUp(name) {
        this.name = name;

        this.init = function (message_channel) {
            if (window.Shiny != undefined) {
                window.Shiny.addCustomMessageHandler(message_channel, function (message) {
                    var data = JSON.parse(message);
                    console.log(data);
                    var dnit = Init(data);
                    var projects = new ProjectManager(dnit[0], dnit[1]);
                    window.ProjectManager = projects;
                })
            }
        }
    }

    var ULNANO = new SetUp("Ульяновский наноцентр");
    var Projects = ULNANO.init("jsondata");
}());
