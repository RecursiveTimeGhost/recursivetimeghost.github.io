const handleReadyState = async () =>
  {
  const data = Request.get('index.bookmarks.json');
  $$.trace(data);
  };


$$.ready(handleReadyState);
