const DOM =
  {
  tags: (t) => document.getElementsByTagName(t),
  id: (i) => document.getElementById(i),
  class: (c) => document.getElementsByClassName(c),
  select: (s) => document.querySelector(s),
  collect: (s) => document.querySelectorAll(s),
  ready: (f) => document.addEventListener("DOMContentLoaded", f),
  element: (s) => document.createElement(s),
  }

const isValidURL = (url) =>
  {
  try
    {
    new URL(url);
    return true;
    }
  catch (error)
    {
    return false;
    }
  }

const fetchData = async (url) =>
  {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch JSON from ${url}. HTTP error! Status: ${response.status}`);
  return await response.json();
  };

const getDataJSON = async (url = null) =>
  {
  if (url)
    {
    try
      {
      const data = await fetchData(url);
      return data;
      }
    catch (error)
      {
      console.error(`Error fetching JSON from ${url}:`, error);
      return null;
      }
    }
  else
    {
    console.error('Invalid URL. Aborting fetch request.');
    return null;
    }
  };