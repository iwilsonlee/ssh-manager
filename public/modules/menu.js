//加载 native ui library
function Menu(gui){
  //创建window menu
  var win = gui.Window.get();

  var windowMenu = new gui.Menu({type:'menubar'});
  var windowSubMenu = new gui.Menu();
  var subMenuItem_about = new gui.MenuItem({label:'关于',tooltip:'about'});
  var subMenuItem_quit = new gui.MenuItem({label:'退出(cmd+Q)',tooltip:'quit'});

  windowSubMenu.append(subMenuItem_about);
  windowSubMenu.append(subMenuItem_quit);

  windowMenu.append(
    new gui.MenuItem({label:'子菜单',submenu:windowSubMenu})
  );

  win.menu = windowMenu;

  subMenuItem_about.click = function(){
    var win_editor = gui.Window.open("about.html",
    {position: 'center',width: 300,height: 150,
    focus: true,frame:true,toolbar:false,resizable:false,
    kiosk:false,"always-on-top":true,fullscreen:false});
  }

  subMenuItem_quit.click = function(){
    var app = gui.App;
    app.quit();
  }
}

exports.Menu = Menu;
