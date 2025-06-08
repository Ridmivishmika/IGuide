'use client'
import React from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const isLoggedIn = !!session?.user;
  const isAdminRoute = pathname.startsWith('/admin');

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/'); // Go back to home page after logout
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.leftSection}>
        <div className={styles.logo}>Iguide</div>
        <ul className={styles.navList}>

          {/* ✅ Always visible */}
          <li className={styles.navItem}><Link href="/pastpapers">Past Papers</Link></li>
          <li className={styles.navItem}><Link href="/news">News</Link></li>
          <li className={styles.navItem}><Link href="/notes">Notes</Link></li>
          <li className={styles.navItem}><Link href="/referencebooks">Reference Books</Link></li>


          {/* ✅ Show login/signup only on /admin and not logged in */}
          {!isLoggedIn && isAdminRoute && (
            <>
              <li className={styles.navItem}><Link href="/login">Login</Link></li>
              <li className={styles.navItem}><Link href="/signup">Signup</Link></li>
            </>
          )}

          {/* ✅ Show admin features only after login */}
          {isLoggedIn && (
            <>
              <li className={styles.navItem}><Link href="/addnote">Add Note</Link></li>
              <li className={styles.navItem}><Link href="/addad">Add Ad</Link></li>
              <li className={styles.navItem}><Link href="/addpastpaper">Add Past Paper</Link></li>
              <li className={styles.navItem}><Link href="/addnews">Add News</Link></li>
              <li className={styles.navItem}><Link href="/addreferencebook">Add referencebooks</Link></li>

              <li
                className={styles.navItem}
                onClick={handleSignOut}
                style={{ cursor: 'pointer' }}
              >
                Logout
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
