const TITLE       = 'Recursive Time Ghost';
const DESCRIPTION = 'A tiny blog for nerds.';

// Function to set the target attribute of all links to "_blank"
   const setLinksTargetBlank = () =>
      {
      // Assuming your footer has an ID, replace "yourFooterId" with the actual ID
      var footer = document.getElementsByTagName("footer");

      Array.from(footer).forEach((f) =>
         {
      // Select all anchor elements within the footer
         var links = f.getElementsByTagName('a');

      // If you want to do something specific with each link, you can iterate through them
         Array.from(links).forEach((l) => {console.log(l.href);});
         });
      }

const exportFooterLinksAsJSON ()
  {
  let footerLinks = {};

  // Iterate through each link list in the footer
  document.querySelectorAll('footer .linkList').forEach((linkList, index) => {
    // Check if there is a previous element sibling before accessing its textContent
    const label = linkList.previousElementSibling ? linkList.previousElementSibling.textContent.trim().toLowerCase().replace(/\s/g, '_') : null;

    if (label) {
      // Use an existing category array or create a new one
      footerLinks[label] = footerLinks[label] || [];

      // Iterate through links in the current link list
      linkList.querySelectorAll('li a').forEach(link => {
        const linkInfo = {
          text: link.textContent.trim(),
          url: link.href.trim(),
        };
        footerLinks[label].push(linkInfo);
      });
    }
  });

  // Output the result to the console
  console.log(JSON.stringify(footerLinks, null, 2));
  }

// Function to set the target attribute of all links to "_blank"
const handleWindowLoadEvent = () =>
  {
  try
    {
    setLinksTargetBlank ();
    }
  catch (error)
    {
    console.error(error.message);
    }
  }

// Call the function when the page has fully loaded
    window.addEventListener('load', handleWindowLoadEvent);

