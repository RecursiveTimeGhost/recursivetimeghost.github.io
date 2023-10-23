    console.log('set link targets');

 // set target attributes to "_blank" for all <a> tags
    const aTags = document.querySelectorAll('footer a');
    aTags.forEach(aTag => {aTag.setAttribute('target', '_blank');});
