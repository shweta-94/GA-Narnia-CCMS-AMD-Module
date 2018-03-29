define(function(require) {

    // action: "create-journal"
    require("./actions/create-journal/create-journal.js");
    
    // action: "edit-journal"
    require("./actions/edit-journal/edit-journal.js");
    
    // use this to globally control the position of helper text
    Alpaca.defaultHelpersPosition = "above";    
});
