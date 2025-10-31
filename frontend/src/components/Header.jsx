import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { DropdownDivider, DropdownHeader, DropdownItem } from "flowbite-react";
import { NavbarCollapse, NavbarLink, NavbarToggle } from "flowbite-react";
import { Link, useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { signOut } from '../redux/user/userSlice';
import { toggleTheme } from '../redux/theme/themeSlice';
import { useEffect, useState } from 'react';

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState('');
  const location = useLocation().pathname;

  useEffect(() => {
    
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  const handleSignOut = async () => {
    try {
      await fetch(`/api/user/signout`);
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ NEW: Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // URL search params update လုပ်မယ်
    const urlParams = new URLSearchParams(window.location.search);
    
    if (searchTerm) {
      urlParams.set('searchTerm', searchTerm);
    } else {
      urlParams.delete('searchTerm');
    }
    
    // New URL create လုပ်ပြီး navigate လုပ်မယ်
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <>
      <Navbar className='border-b-2'>
        <Link
          to='/'
          className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white'
        >
          <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
            ဘားအံ's
          </span>
          Blog App
        </Link>

        {/* Search Bar - FIXED */}
        <div className='flex-1 max-w-lg mx-4'>
          <form 
            className='w-full' 
            onSubmit={handleSubmit} // ✅ ADDED: Form submission handler
          >
            <TextInput
              type='text'
              placeholder='Search articles...'
              rightIcon={AiOutlineSearch}
              className='hidden lg:inline rounded-full'
              size="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                // ✅ Optional: Enter key နှိပ်ရင်လည်း search လုပ်မယ်
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
          </form>
        </div>

        {/* Mobile Search Button - FIXED */}
        <Button 
          className='w-12 h-10 lg:hidden' 
          color='gray' 
          pill
          onClick={handleSubmit} // ✅ ADDED: Mobile search button click handler
        >
          <AiOutlineSearch />
        </Button>

        {/* Navigation Links */}
        <NavbarCollapse>
          <NavbarLink as={Link} to='/' active={location === "/"}>
            Home
          </NavbarLink>
          <NavbarLink as={Link} to='/about' active={location === "/about"}>
            About
          </NavbarLink>
          <NavbarLink as={Link} to='/projects' active={location === "/projects"}>
            Projects
          </NavbarLink>
        </NavbarCollapse>

        <div className='flex gap-2 md:order-2'>
          <Button
            className='w-12 h-10 hidden sm:inline'
            color='gray'
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {theme === 'light' ? <FaSun /> : <FaMoon />}
          </Button>

          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt='user' img={currentUser.profilePicture} rounded />
              }
            >
              <DropdownHeader>
                <span className='block text-sm'>@{currentUser.username}</span>
                <span className='block text-sm font-medium truncate'>
                  {currentUser.email}
                </span>
              </DropdownHeader>

              <Link to={'/profile'}>
                <DropdownItem>Profile</DropdownItem>
              </Link>

              <Link to={'/dashboard?tab=profile'}>
                <DropdownItem>Dashboard</DropdownItem>
              </Link>

              <DropdownDivider />
              <DropdownItem onClick={handleSignOut}>Sign out</DropdownItem>
            </Dropdown>
          ) : (
            <Link to='/sign-in'>
              <Button color='purple' outline>
                Sign In
              </Button>
            </Link>
          )}          
        </div>

        <NavbarToggle />
      </Navbar>
    </>
  )
}

export default Header;