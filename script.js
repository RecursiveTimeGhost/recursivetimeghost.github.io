const TITLE       = 'Recursive Time Ghost';
const DESCRIPTION = 'A tiny blog for nerds.';


 // set target attributes to "_blank" for all <a> tags in a given section
    const setLinkTargetsToBlank = (section = null) =>
        {
        const tags = document.querySelectorAll(section ? section + ' a' : 'a');
        tags.forEach((tag) => {tag.setAttribute('target', '_blank');});
        }
