"use client"
import React, {useState} from 'react';
import { Bell } from 'lucide-react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useRouter } from "next/navigation";
import { signOut,useSession } from 'next-auth/react';

const Navbar = () => {
  // const [data  session,status] = useSession();
  const loggedIn = false;
  //   const router = useRouter();

  // const handleSignOut = () =>{
  //     router.push("/signup")
  // }
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
                <li className={styles.navItem}><Link href="/addpastpaper">Add Past Papers</Link></li>
                <li className={styles.navItem}><Link href="/addnote">Add Notes</Link></li>
                <li className={styles.navItem}><Link href="/addnews">Add News</Link></li>
                <li className={styles.navItem}><Link href="/login">Login</Link></li>
                <li className={styles.navItem}><Link href="/signup">Signup</Link></li>
                                {/* <li className={styles.navItem} onClick= { handleSignOut}><Link href="/">Logout</Link></li> */}

          {/* {
            loggedIn? (
              <>
                <li className={styles.navItem}><Link href="/pastpapers">Past Papers</Link></li>
                <li className={styles.navItem}><Link href="/notes">Notes</Link></li>
                <li className={styles.navItem}><Link href="/news">News</Link></li>
                <li className={styles.navItem}><Link href="/addpastpaper">Add Past Papers</Link></li>
                <li className={styles.navItem}><Link href="/addnote">Add Notes</Link></li>
                <li className={styles.navItem}><Link href="/addnews">Add News</Link></li>
                /{* <li className={styles.navItem} onClick= {() =>  {signOut(); handleSignOut();}}><Link href="/">Logout</Link></li> *}/

                <li className={styles.navItem} onClick= { handleSignOut}><Link href="/">Logout</Link></li>

              </>
            ):(
              <>
                <li className={styles.navItem}><Link href="/login">Login</Link></li>
                <li className={styles.navItem}><Link href="/signup">Signup</Link></li>
              </>
            )
          } */}

        </ul>
      </div>

      {/* <div className={styles.rightSection}>
        <Bell size={22} className={styles.icon} />
      
      </div> */}
    </nav>
  );
};

export default Navbar;
