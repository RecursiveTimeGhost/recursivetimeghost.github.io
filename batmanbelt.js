const $$ =
  {
  tags: (t) => document.getElementsByTagName(t),
  id: (i) => document.getElementById(i),
  class: (c) => document.getElementsByClassName(c),
  select: (s) => document.querySelector(s),
  collect: (s) => document.querySelectorAll(s),
  ready: (f) => document.addEventListener("DOMContentLoaded", f),
  element: (s) => document.createElement(s),
  valid_URL: (url) =>
    {
    try
      {
      const link = new URL(url);
      return true;
      }
    catch (error)
      {
      return false;
      }
    },
  trace: (d) => 
    {
    console.groupCollapsed("data » ");
    console.info(d);
    console.groupEnd();    
    },
  }

const Request =
  {
  json: null,
  get: async (url = null) =>
    {    
    try
      {
      if (!valid_URL(url)) return;
      const response = await fetch(url);
      if (!response.ok) return;
      this.json = await response.json();
      }
    catch (e) 
      {
      console.error("Error » Fetch: ", e);
      }
    },  
  }
