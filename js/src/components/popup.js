import "@fancyapps/fancybox";

let $links;
const options = {
  baseClass: 'common-popup-layout',
  touch: false,
  btnTpl: {
    smallBtn:
      '<button type="button" data-fancybox-close="" class="fancybox-button fancybox-close-small common-popup__close" title="Close"><svg xmlns="http://www.w3.org/2000/svg" version="1" viewBox="6 6 12 12"><path d="M13 12l5-5-1-1-5 5-5-5-1 1 5 5-5 5 1 1 5-5 5 5 1-1z"></path></svg></button>'
  }
}

export function initPopup() {
  $links = $('.js__popup');
  if($links.length) {
    $links.fancybox(options);
  }
}