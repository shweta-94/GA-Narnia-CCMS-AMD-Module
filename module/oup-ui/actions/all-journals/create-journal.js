define(function (require, exports, module) {

    var Ratchet = require("ratchet/ratchet");
    var UI = require("ui");
    var $ = require("jquery");

    return Ratchet.Actions.register("create-journal", UI.AbstractIFrameAction.extend({

        defaultConfiguration: function () {
            var config = this.base();

            config.title = "Create Journal";
            config.iconClass = "glyphicon glyphicon-pencil";
            
            // the location of the "overlay app"
            config.src = "http://localhost:3000/";

            return config;
        }

    }));
});

