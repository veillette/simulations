import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import AppView from 'rutherford-scattering/views/app';

$(function() {
    var appView = new AppView();
    $('body').append(appView.el);
    appView.load();
});
