// import GitsunminLogo from ''

export const Footer = () => {
  return (
    <footer className="p-4 mt-4 flex justify-between text-foreground">
      <div className="flex items-center">
        <span>Powered by Gitsunmin</span>
      </div>
      <ul className="flex gap-2 justify-end">
        <li>
          <a
            href="https://github.com/gitsunmin"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            GitHub
          </a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/gitsunmin/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-500 hover:underline"
          >
            LinkedIn
          </a>
        </li>
      </ul>
    </footer>
  );
};
