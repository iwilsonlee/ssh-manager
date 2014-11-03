function Shortcut(gui){
  var option = {
    key : "Ctrl+Q",
    active : function() {
      console.log("Global desktop keyboard shortcut: " + this.key + " active.");
      // var app = gui.App;
      // app.quit();
    },
    failed : function(msg) {
      // :(, fail to register the |key| or couldn't parse the |key|.
      console.log(msg);
    }
  };

  // Create a shortcut with |option|.
  var shortcut = new gui.Shortcut(option);

  // Register global desktop shortcut, which can work without focus.
  gui.App.registerGlobalHotKey(shortcut);

  // If register |shortcut| successfully and user struck "Ctrl+Shift+A", |shortcut|
  // will get an "active" event.

  // You can also add listener to shortcut's active and failed event.
  // shortcut.on('active', function() {
  //   console.log("Global desktop keyboard shortcut2: " + this.key + " active.");
  // });
  //
  // shortcut.on('failed', function(msg) {
  //   console.log(msg);
  // });

  // Unregister the global desktop shortcut.
  /* gui.App.unregisterGlobalHotKey(shortcut);*/

}

exports.Shortcut = Shortcut;
