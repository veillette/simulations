import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import NuclearPhysicsAppView from 'views/app';

$(function() {
    var appView = new NuclearPhysicsAppView();
    $('body').append(appView.el);
    appView.load();
});
