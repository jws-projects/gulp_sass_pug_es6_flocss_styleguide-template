import jQuery from 'jquery';
import iziModal from 'iziModal';

const $ = jQuery;

const options = {
  width: 1200,
  transitionIn: 'fadeInLeft',
  transitionOut: 'fadeOutLeft',
  navigateArrows: false,
  navigateCaption: false
}

export default function (selector) {
  $(selector).iziModal(options);
};