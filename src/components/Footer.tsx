// import GitsunminLogo from ''

export const Footer = () => {
  return (
    <footer className="p-4 mt-4 flex flex-col gap-y-4 bg-background-footer text-foreground-footer">
      <div className="flex items-center gap-4 justify-cente w-full">
        <img
          src="https://github.com/gitsunmin.png"
          alt="logo"
          className="rounded-full size-10"
        />
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
