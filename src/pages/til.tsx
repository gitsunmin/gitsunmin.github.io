// import { useEffect } from 'react';
import '@gitsunmin/ui/css';
import { Button, Text } from '@gitsunmin/ui';
// const URL = `https://api.github.com/repos/gitsunmin/til/readme`;

export const TilPage = () => {
  // useEffect(() => {
  //   fetch(URL)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log('data:', data.download_url);

  //       fetch(data.download_url)
  //         .then((res) => res.text())
  //         .then(console.log);
  //     });

  //   fetch(
  //     'https://api.github.com/repos/gitsunmin/til/contents/flutter/assert.md'
  //   )
  //     .then((res) => res.json())
  //     .then((json) => {
  //       console.log('text:', json);
  //       fetch(json.download_url)
  //         .then((res) => res.text())
  //         .then((text) => {
  //           console.log('text:', text);
  //         });
  //     });
  // }, []);
  return (
    <div>
      <Button>Hello</Button>
      <Text token="heading-5">daijsojdio</Text>
    </div>
  );
};
