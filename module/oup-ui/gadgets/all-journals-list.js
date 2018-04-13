define(function(require, exports, module) {

    debugger;

    var Ratchet = require("ratchet/web");
    var DocList = require("ratchet/dynamic/doclist");
    var DocumentsList = require("/oneteam/modules/app/gadgets/project/documents/documents-list.js");
    var OneTeam = require("oneteam");

    return Ratchet.GadgetRegistry.register("all-journals-list", DocumentsList.extend({

        setup: function()
        {

            this.get("/projects/{projectId}/documents/{documentId}/browse", this.index);
        },

        configureDefault: function()
        {
            this.base();

            this.config({
                "observables": {
                    "query": "all-journals-list_query",
                    "sort": "all-journals-list_sort",
                    "sortDirection": "all-journals-list_sortDirection",
                    "searchTerm": "all-journals-list_searchTerm",
                    "selectedItems": "all-journals-list_selectedItems"
                }
            });
        },

        entityTypes: function()
        {
            return {
                "plural": "journals",
                "singular": "journal"
            }
        },

        afterSwap: function(el, model, context, callback)
        {
            model.loader = "gitana";
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
        // columnValue: function(row, item, model, context)
        // {
        //     var self = this;
        //     var project = self.observable("project").get();
        //
        //     var value = this.base(row, item);
        //
        //     if (item.key === "titleDescription") {
        //
        //         var primarySummary = OneTeam.buildPrimaryNodeSummary(row, false, project);
        //         var expandedSummary = OneTeam.buildNodeSummary(row, false, project);
        //
        //         var expanded = self.isTogglerActive(row._doc);
        //
        //         value = OneTeam.listTitleDescription(context, row, null, null, false, primarySummary, expandedSummary, expanded);
        //     }
        //
        //     return value;
        // },

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

