export async function findRelevance(query, comparisonType) {
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/vector-db-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'unique',
      query: query,
      comparisonType: comparisonType,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function findHighestRelevance(group, comparisonString) {
  console.log('FINN RELEVANCE');
  const response = await fetch(`${import.meta.env.VITE_REACT_APP_API_DOMAIN}/vector-db-query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: 'highestRelevance',
      query: group, // this should be all <p> tags to start off with, array of strings
      comparisonString: comparisonString,
    }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
