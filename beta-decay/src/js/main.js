import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import BetaDecayAppView from 'beta-decay/views/app';

$(function() {
    var appView = new BetaDecayAppView();
    $('body').append(appView.el);
    appView.load();
});
