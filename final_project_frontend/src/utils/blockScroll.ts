// call this to Disable
function disableScroll() {
  document.body.style.overflow = 'hidden';
}

// call this to Enable
function enableScroll() {
    document.body.style.overflow = 'initial';
}

export default { disableScroll, enableScroll };
