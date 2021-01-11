//this route will be used for modals
var modalRoute = applet => {
    if (applet.view.attached) applet.view.show();
    else applet.view.render().then(cmpInstance => applet.view.show() );
  };