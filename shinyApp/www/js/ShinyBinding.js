$(function() {

    function SetUp(name) {
        this.name = name;

        this.init = function (message_channel) {
            if (window.Shiny != undefined) {
                window.Shiny.addCustomMessageHandler(message_channel, function (message) {
                    var data = JSON.parse(message);
                    console.log(data);
                    var projects = new ProjectManager(Init(data));
                    window.ProjectManager = projects;
                })
            }
        }
    }

    var ULNANO = new SetUp("Ульяновский наноцентр");
    var Projects = ULNANO.init("jsondata");
}());