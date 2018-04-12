define(function(require, exports, module) {

    var Ratchet = require("ratchet/web");
    var Empty = require("ratchet/dynamic/empty");
    var $ = require("jquery");

    return Ratchet.GadgetRegistry.register("secondary-pages-list", Empty.extend({

        setup: function()
        {
            this.get("/projects/{projectId}/documents/{documentId}/browse", this.index);
        },

        prepareModel: function(el, model, callback)
        {
            var self = this;

            var project = self.observable("project").get();
            var branch = self.observable("branch").get();

            this.base(el, model, function() {
                model.albums = [];
                model.albums = [];
                branch.queryNodes({
                    _type : "custom:journa0"
                }).each(function(){
                    var imageUrl = "/proxy" + this.getUri() + "/attachments/default";

                    this.imageUrl = imageUrl;

                    model.albums.push(this);

                }).then(function(){
                    callback();
                });
            });
        },

        afterSwap: function(el, model, originalContext, callback)
        {
            var self = this;

            this.base(el, model, originalContext, function() {

                callback();
            });
        }


    }));

});