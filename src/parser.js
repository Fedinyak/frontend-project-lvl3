const parseFeed = (dom) => ({
  title: dom.querySelector('title').textContent,
  description: dom.querySelector('description').textContent,
});

const parsePosts = (dom) => {
  const result = [];
  const items = dom.querySelectorAll('item');
  items.forEach((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    result.push(post);
  });
  return result;
};

const parser = (data) => {
  const parse = new DOMParser();
  const dom = parse.parseFromString(data, 'application/xml');

  if (dom.querySelector('parsererror')) {
    const error = new Error(
      `invalidRss: ${dom.querySelector('parsererror').textContent}`,
    );
    error.invalidRss = true;
    throw error;
  }

  const feed = parseFeed(dom);
  const posts = parsePosts(dom);
  return { feed, posts };
};

export default parser;
