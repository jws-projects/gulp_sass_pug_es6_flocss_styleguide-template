import Message from './modules/hello-world';
import slider from './modules/slider';
import modal from './modules/modal'
import jQuery from 'jquery';


const $ = jQuery;

var hello = new Message('Hello es2015');
hello.hello_world();

$(function(){
  console.log("object");
  slider('.swiper-container');
  modal("#modal");
});