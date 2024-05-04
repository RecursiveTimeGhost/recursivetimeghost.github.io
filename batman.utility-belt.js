const Batman =
  {
  trace: (d) => console.info(d),
  make: (t) => document.createElement(t),
  tag: (t) => document.getElementsByTagName(t),
  id: (i) => document.getElementById(i),
  class: (c) => document.getElementsByClassName(c),
  select: (s) => document.querySelector(s),
  collect: (s) => document.querySelectorAll(s),
  onReady: (f) => document.addEventListener("DOMContentLoaded", f),
  validate: (url) =>
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
  request: async (url = null) =>
    {
    try
      {
      if (!valid_URL(url)) return;
      const response = await fetch(url);
      return (!response.ok) ? {} : await response.json();
      }
    catch (e)
      {
      console.error("Error » request » ", e);
      }
    },
  }

