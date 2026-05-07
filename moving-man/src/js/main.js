import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import MovingManAppView from 'views/app';

$(function() {
    var appView = new MovingManAppView();
    $('body').append(appView.el);
    appView.load();
});
