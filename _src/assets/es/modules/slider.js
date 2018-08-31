import Swiper from 'swiper';

const options = {
  loop: true,
  speed: 600,
  slidesPerView: 1,
  spaceBetween: 10,
  direction: 'horizontal',
  effect: 'slide',
  autoplay: {
    delay: 3000,
    stopOnLast: false,
    disableOnInteraction: true
  },
  pagination: {
    el: '.swiper-pagination',
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
}

export default function(selector) {
  let mySwiper = new Swiper(selector,options);
};