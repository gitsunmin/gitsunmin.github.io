export type Headline = {
  __t: 'headline';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
  className?: string;
};

export type Text = {
  __t: 'text';
  text: string;
  className?: string;
};

export type Link = {
  __t: 'link';
  label: string;
  url: string;
  target?: '_blank' | '_self';
  className?: string;
};

export type Image = {
  __t: 'image';
  src: string;
  alt: string;
  width?: number;
  height?: number;
  caption?: string;
  loading?: 'lazy' | 'eager';
  className?: string;
};

export type Content = Headline | Text | Link | Image;
