import { useInView } from '@/hooks/useInView';
import { cn } from '@/lib/utils';
import { Calendar, Clock } from 'lucide-react';
import { type MouseEvent, useMemo, useRef, useState } from 'react';

export type PostItem = {
  slug: string;
  title: string;
  description: string;
  pubDate: string;
  tags: string[];
  heroImage: string;
  readingTime: number;
};

const FeaturedCard = ({ post }: { post: PostItem }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);
  const date = new Date(post.pubDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      ref={ref}
      className={cn(
        'mb-8 transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
      )}
    >
      <a
        href={`/blog/${post.slug}/`}
        className={cn(
          'group flex flex-col md:flex-row overflow-hidden',
          'rounded-2xl border border-border/60 bg-card',
          'hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5',
          'transition-all duration-500',
        )}
      >
        <div className="flex-1 p-7 md:p-10 flex flex-col justify-between gap-6 order-last md:order-first">
          <div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  # {tag}
                </span>
              ))}
            </div>
            <h2
              className={cn(
                'text-2xl md:text-3xl font-extrabold text-foreground leading-tight mb-3',
                'group-hover:text-primary transition-colors duration-300',
              )}
            >
              {post.title}
            </h2>
            <p className="text-muted-foreground leading-relaxed line-clamp-3">
              {post.description}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border/40 pt-4">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              약 {post.readingTime}분 읽기
            </span>
          </div>
        </div>

        <div className="md:w-2/5 aspect-video md:aspect-auto overflow-hidden bg-muted order-first md:order-last shrink-0">
          <img
            src={post.heroImage}
            alt={post.title}
            style={{ viewTransitionName: `blog-image-${post.slug}` }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/og/blog.png';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      </a>
    </div>
  );
};

const GridCard = ({ post, index }: { post: PostItem; index: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useInView(ref);
  const date = new Date(post.pubDate).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
      )}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
    >
      <a
        href={`/blog/${post.slug}/`}
        className={cn(
          'group block h-full rounded-xl overflow-hidden',
          'border border-border/60 bg-card',
          'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1',
          'transition-all duration-300',
        )}
      >
        <div className="aspect-video overflow-hidden bg-muted relative">
          <img
            src={post.heroImage}
            alt={post.title}
            style={{ viewTransitionName: `blog-image-${post.slug}` }}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = '/og/blog.png';
            }}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-5">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  'bg-muted text-muted-foreground',
                  'group-hover:bg-primary/10 group-hover:text-primary',
                  'transition-colors duration-300',
                )}
              >
                # {tag}
              </span>
            ))}
          </div>
          <h2
            className={cn(
              'font-bold text-foreground line-clamp-2 mb-2',
              'group-hover:text-primary transition-colors duration-300',
            )}
          >
            {post.title}
          </h2>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{post.description}</p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3" />
              {date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3" />
              {post.readingTime}분
            </span>
          </div>
        </div>
      </a>
    </div>
  );
};

const VISIBLE_TAG_COUNT = 10;

const TagButton = ({
  active,
  onClick,
  label,
  count,
  className,
}: {
  active: boolean;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  label: string;
  count: number;
  className?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={active}
    className={cn(
      'shrink-0 whitespace-nowrap px-3.5 py-1.5 rounded-full text-sm font-medium',
      'transition-all duration-200 active:scale-95',
      active
        ? 'bg-primary text-primary-foreground shadow-md'
        : 'bg-muted text-muted-foreground hover:bg-muted/80',
      className,
    )}
  >
    {label} <span className="ml-1 opacity-70">{count}</span>
  </button>
);

export const BlogList = ({ posts }: { posts: PostItem[] }) => {
  const [selectedTag, setSelectedTag] = useState('전체');
  const [expanded, setExpanded] = useState(false);

  const selectTag = (tag: string, e: MouseEvent<HTMLButtonElement>) => {
    setSelectedTag(tag);
    // 모바일 가로 스크롤에서 선택한 태그가 가장자리에 걸리지 않도록 가운데로 옮김
    e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const tagCounts = useMemo(() => {
    const map = new Map<string, number>();
    for (const post of posts) {
      for (const tag of post.tags) {
        map.set(tag, (map.get(tag) ?? 0) + 1);
      }
    }
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const hiddenTagCount = Math.max(0, tagCounts.length - VISIBLE_TAG_COUNT);

  const filtered = useMemo(
    () => (selectedTag === '전체' ? posts : posts.filter((p) => p.tags.includes(selectedTag))),
    [posts, selectedTag],
  );

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div>
      {/* Tag filter: 모바일은 한 줄 가로 스크롤, 데스크톱은 상위 태그만 펼치고 나머지는 접음 */}
      <div
        className={cn(
          'flex gap-2 mb-10',
          '-mx-6 px-6 overflow-x-auto flex-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
          '[mask-image:linear-gradient(to_right,black_85%,transparent)]',
          'md:mx-0 md:px-0 md:overflow-visible md:flex-wrap md:[mask-image:none]',
        )}
      >
        <TagButton
          active={selectedTag === '전체'}
          onClick={(e) => selectTag('전체', e)}
          label="전체"
          count={posts.length}
        />
        {tagCounts.map(([tag, count], i) => (
          <TagButton
            key={tag}
            active={selectedTag === tag}
            onClick={(e) => selectTag(tag, e)}
            label={`# ${tag}`}
            count={count}
            className={cn(!expanded && i >= VISIBLE_TAG_COUNT && selectedTag !== tag && 'md:hidden')}
          />
        ))}
        {hiddenTagCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className={cn(
              'hidden md:inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-medium',
              'border border-dashed border-border text-muted-foreground',
              'hover:text-foreground hover:border-foreground/40 transition-colors duration-200',
            )}
          >
            {expanded ? '접기' : `+${hiddenTagCount}개 더보기`}
          </button>
        )}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">해당 태그의 글이 없습니다.</p>
        </div>
      )}

      {featured && (
        <FeaturedCard key={`featured-${selectedTag}-${featured.slug}`} post={featured} />
      )}

      {rest.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((post, i) => (
            <GridCard key={`${selectedTag}-${post.slug}`} post={post} index={i} />
          ))}
        </div>
      )}
    </div>
  );
};
