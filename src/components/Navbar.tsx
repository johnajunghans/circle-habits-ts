const navLinks = [
  { name: 'My Account', url: '/account' },
];

const Navbar = () => {
  return (
    <div className="px-3 py-3">
      <nav className="flex flex-row items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Circle Habits</h2>
        </div>
        <div>
          <ul className="m-0 p-0 flex list-none">
            {navLinks.map((link) => (
              <li key={link.name} className="list-none">
                <a href={link.url} className="font-medium text-inherit hover:underline">
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
