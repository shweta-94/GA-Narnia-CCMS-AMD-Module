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
                    "key": "pageName",
                    "title": "Page Name",
                    "sort": true
                }, {
                    "title": "Path",
                    "key": "path",
                    "sort": true
                }, {
                    "key": "modifiedOn",
                    "title": "Modified On",
                    "sort": true
                }, {
                    "key": "modifiedBy",
                    "title": "Modified By",
                    "sort": true
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

            if(item.key == "titleDecription")
                return row._doc;

            if(item.key == "pageName")
                return row._doc;

            if(item.key == "modifiedOn")
                return row.getSystemMetadata().getModifiedOn().getTimestamp();

            if(item.key == "modifiedBy")
                return row.getSystemMetadata().modified_by;

            var value = "";

            if (item.key == "path")
            {
                value = "";
                if (row._paths)
                {
                    var array = [];
                    for (var k in row._paths) {
                        array.push(row._paths[k]);
                    }
                    value = array.join("<br/>");
                }
            }


            //var value = "";

            // value = [
            //     '<strong>','Genres:   ','</strong>', row._paths.toString(),'</br>',
            //     '<strong>','Spotify Link:   ','</strong>',  row.getSystemMetadata().modified_on.ms,'</br>',
            //     '<strong>','Popularity:   ','</strong>', row.getSystemMetadata().modified_by, '</br>',
            //     '</div>'
            // ].join('\n')

            // value = row._doc;
            //
            // value += row._paths.toString();
            // //value += "<br/>"
            //
            // value += row.getSystemMetadata().modified_on.ms;
            // //value += "<br/>"
            //
            // value += row.getSystemMetadata().modified_by;
            // //value += "<br/>"

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

