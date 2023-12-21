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
  const url = {articles: './data/index.articles.json', bookmarks: './data/index.bookmarks.json'};
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