import { useQuery } from '@tanstack/react-query';

const GITHUB_API_TIL_URL = 'https://api.github.com/repos/gitsunmin/til';

export const useQueryTIL = (endpoint: string) => {
  return useQuery({
    queryKey: [GITHUB_API_TIL_URL, endpoint],
    queryFn: async () => {
      return await fetch(`${GITHUB_API_TIL_URL}${endpoint}`)
        .then((res) => res.json())
        .catch((err) => {
          console.error(err);
          throw new Error('Error fetching when fetching download_url');
        })
        .then(({ download_url }) =>
          fetch(download_url)
            .then((res) => res.text())
            .catch((err) => {
              console.error(err);
              throw new Error('Error fetching when fetching markdown text');
            })
        )
        .catch(console.error);
    },
  });
};
