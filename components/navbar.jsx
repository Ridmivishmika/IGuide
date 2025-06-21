'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './navbar.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminRoute = pathname.startsWith('/admin');

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('accessToken');
      setIsLoggedIn(!!token);
    };

    checkToken();
    window.addEventListener('storage', checkToken); // Sync across tabs

    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, [pathname]);

  const handleSignOut = async () => {
    localStorage.removeItem('accessToken');
    await signOut({ redirect: false });
    setIsLoggedIn(false);
    router.push('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>Iguide</div>
        <ul className={styles.navList}>
          <li className={styles.navItem}><Link href="/">Home</Link></li>
          <li className={styles.navItem}><Link href="/pastpapers">Past Papers</Link></li>
          <li className={styles.navItem}><Link href="/notes">Notes</Link></li>
          <li className={styles.navItem}><Link href="/referencebooks">Reference Books</Link></li>
          <li className={styles.navItem}><Link href="/news">News</Link></li>

          {isLoggedIn && (
            <>
              
              <li className={styles.navItem}><Link href="/addpastpaper">Add Past Paper</Link></li>
              <li className={styles.navItem}><Link href="/addnote">Add Note</Link></li>
              <li className={styles.navItem}><Link href="/addreferencebook">Add Reference Books</Link></li>
              <li className={styles.navItem}><Link href="/addad">Add Ad</Link></li>
              <li className={styles.navItem}><Link href="/addnews">Add News</Link></li>
              <li
                className={styles.navItem}
                onClick={handleSignOut}
                style={{ cursor: 'pointer' }}
              >
                Logout
              </li>
            </>
          )}

          {!isLoggedIn && isAdminRoute && (
            <>
              <li className={styles.navItem}><Link href="/login">Login</Link></li>
              <li className={styles.navItem}><Link href="/signup">Signup</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
