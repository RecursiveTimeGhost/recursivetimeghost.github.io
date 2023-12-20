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

function generateLinkListFromJSON ({section = null, data = {}, target = '_self'})
  {
  if (section == null && Object.keys(data).length === 0) {console.error("Must specify an HTML tag and must provide a data source."); return;}

  const sectionTags = DOM.tags(section);

  Object.keys(data).forEach(category =>
    {
    const categoryTitle = DOM.element('h2');
    const categoryLists = DOM.element('div');

    categoryTitle.textContent = category;

    Object.keys(data[category]).forEach(subcategory =>
      {
      const subCategoryList = DOM.element('ul');
      const subCategoryListTitle = DOM.element('li');

      subCategoryListTitle.textContent = subcategory;
      subCategoryList.append(subCategoryListTitle);

      Object.values(data[category][subcategory]).forEach(listData =>
        {
        const listTag = DOM.element('li');
        const linkTag = DOM.element('a');

        linkTag.href = listData.link;
        linkTag.textContent = listData.title ? listData.title : listData.link;
        linkTag.target = target;

        listTag.append(linkTag);
        subCategoryList.append(listTag);
        });

      categoryLists.append(subCategoryList);
      });

    sectionTags[0].append(categoryTitle, categoryLists);
    });
  }

const handleReadyState = async () =>
  {
  const url = {articles: 'index.articles.json', bookmarks: 'index.bookmarks.json'};
  const jsonDataMain = await getDataJSON(url.articles);
  const jsonDataFooter = await getDataJSON(url.bookmarks);

  if (jsonDataMain !== null)
    {
    console.log('JSON Data:', jsonDataMain);
    generateLinkListFromJSON({section: 'main', data: jsonDataMain});
    }

  if (jsonDataFooter !== null)
    {
    console.log('JSON Data:', jsonDataFooter);
    generateLinkListFromJSON({section: 'footer', data: jsonDataFooter, target: '_blank'});
    }
  };

DOM.ready(handleReadyState);