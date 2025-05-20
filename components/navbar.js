import React from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      {/* Left Section: Logo + Links */}
      <div className={styles.leftSection}>
        <div className={styles.logo}>EduZone</div>
        <ul className={styles.navList}>
          <li className={styles.navItem}><Link href="/">Home</Link></li>
          <li className={styles.navItem}><Link href="/pastpapers">Past Papers</Link></li>
          <li className={styles.navItem}><Link href="/notes">Notes</Link></li>
          <li className={styles.navItem}><Link href="/news">News</Link></li>
        </ul>
      </div>

      {/* Right Section: Notification + Login */}
      <div className={styles.rightSection}>
        <Bell size={22} className={styles.icon} />
        <button className={styles.loginButton}>Login</button>
      </div>
    </nav>
  );
};

export default Navbar;
