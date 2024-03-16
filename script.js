const handleReadyState = async () =>
  {
  const data = Data.get('index.bookmarks.json');
  $$.trace(data);
  };


$$.ready(handleReadyState);
