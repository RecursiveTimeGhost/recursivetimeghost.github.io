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

