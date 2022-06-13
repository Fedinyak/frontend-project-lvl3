const parseFeeds = (dom) => ({
  title: dom.querySelector('title').textContent,
  description: dom.querySelector('description').textContent,
  link: dom.querySelector('link').textContent,
});

const parsePosts = (dom) => {
  const items = dom.querySelectorAll('item');
  return Array.from(items).map((item) => ({
    title: item.querySelector('title').textContent,
    description: item.querySelector('description').textContent,
    link: item.querySelector('link').textContent,
  }));
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

  const feeds = parseFeeds(dom);
  const posts = parsePosts(dom);
  return { feeds, posts };
};

export default parser;
