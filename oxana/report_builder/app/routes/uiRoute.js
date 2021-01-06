//this function will decide where the view will go in the GUI on endDraw
//principles to follow
//a view should be added to one of its parent`s children
var uiRoute = function (applet) {
    //check applet.view.attached if you want to addChild only when its not already
    let _appendTo = "viewStack";
    // let viewContainer = applet.parent.find(_appendTo);
    let viewContainer = applet.parent.children.viewStack
    return viewContainer.addChild(applet.view);
  };