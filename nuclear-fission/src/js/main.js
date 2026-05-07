import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import AppView from 'nuclear-fission/views/app';

$(function() {
    var appView = new AppView();
    $('body').append(appView.el);
    appView.load();
});
