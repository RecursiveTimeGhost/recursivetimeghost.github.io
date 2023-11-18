const TITLE       = 'Recursive Time Ghost';
const DESCRIPTION = 'A tiny blog for nerds.';


 // Function to set the target attribute of all links to "_blank"
    const setLinksTargetBlank = () =>
        {
        document.querySelectorAll('a').forEach(link => {link.target = '_blank';});
        }

 // Call the function when the page has fully loaded
    window.addEventListener('load', setLinksTargetBlank);

