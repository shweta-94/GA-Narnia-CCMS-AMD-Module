define(function(require, exports, module) {

    debugger;

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var DocumentsList = require("/oneteam/modules/app/gadgets/project/documents/documents-list.js");
    var OneTeam = require("oneteam");

    return Ratchet.GadgetRegistry.register("secondary-pages-list", DocumentsList.extend({

        setup: function()
        {

            this.get("/projects/{projectId}/documents/{documentId}/browse", this.index);
        },

        configureDefault: function()
        {
            this.base();

            this.config({
                "columns": [{
                    "title": "Title",
                    "property": "title",
                    "sort": true
                }, {
                    "title": "Path",
                    "property": "path",
                    "sort": true
                }, {
                    "key": "modifiedOn",
                    "title": "Modified On",
                    "field": "_system.modified_on.ms"
                }, {
                    "key": "modifiedBy",
                    "title": "Modified By",
                    "field": "_system.modified_by"
                }],
                "loader": "gitana",
                "checkbox": false
            });
        },

        entityTypes: function()
        {
            return {
                "plural": "secondary-pages",
                "singular": "secondary-page"
            }
        },

        afterSwap: function(el, model, context, callback)
        {
            var self = this;
            this.base(el, model, context, function() {
                callback();
            });
        },

        doGitanaQuery: function(context, model, searchTerm, query, pagination, callback)
        {
            var self = this;
            var branch = self.observable("branch").get();


            if (OneTeam.isEmptyOrNonExistent(query) && searchTerm)
            {
                query = OneTeam.searchQuery(searchTerm, ["title"]);
            }

            if (!query)
            {
                query = {};
            }
            query._type = "custom:journa0";

            if(!pagination){
                pagination = {};
            }

            if(!pagination.sort){
                pagination.sort = {};
            }

            pagination.sort.family = 1;

            pagination.paths = true;

            Chain(branch).queryNodes(query,pagination).then(function(){
                callback(this);
            });

        },

        // linkUri: function(row, model, context)
        // {
        //     var projectId = context.tokens["projectId"];
        //
        //     return "#/projects/" + projectId + "/documents/" + row["_doc"];
        // },
        //
        // iconUri: function(row, model, context)
        // {
        //     return OneTeam.iconUriForNode(row);
        // },
        //
        columnValue: function(row, item, model, context)
        {
            var self = this;

            var value = "";

            value +=  row._doc;


            //value += "</h3>";

            // var primarySummary = OneTeam.buildNodeSummaryEx(row, definition, project, {
            //     "modifiedOn": true,
            //     "definition": true
            // });

            //value = OneTeam.listTitleDescription(context, row, self.linkUri(row, model, context), null, false, primarySummary);

            return value;
        },

        handleDrawCallback: function(el, model, table, settings) {

            var api = table.api();
            var last=null;
            for (var i = 0; i < model.rows.length; i++)
            {
                var family = model.rows[i].family;
                if( last!== family){
                    var rows = api.rows( {page:'current'} ).nodes();
                    $(rows).eq( i ).before(
                        '<tr class="group"><td colspan="5">'+family+'</td></tr>'
                    );

                    last = family;
                }
            }
            return null;

        }

    }));

});

