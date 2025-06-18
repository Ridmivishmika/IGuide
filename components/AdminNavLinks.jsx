// 'use client';
// import Link from 'next/link';
// import { signOut } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import styles from './navbar.module.css';

// const AdminNavLinks = () => {
//   const router = useRouter();

//   const handleSignOut = async () => {
//     await signOut({ redirect: false });
//     router.push('/');
//   };

//   return (
//     <>
//       <li className={styles.navItem}><Link href="/addnote">Add Note</Link></li>
//       <li className={styles.navItem}><Link href="/addad">Add Ad</Link></li>
//       <li className={styles.navItem}><Link href="/addpastpaper">Add Past Paper</Link></li>
//       <li className={styles.navItem}><Link href="/addnews">Add News</Link></li>
//       <li className={styles.navItem}><Link href="/addreferencebook">Add Reference Books</Link></li>
//       <li
//         className={styles.navItem}
//         onClick={handleSignOut}
//         style={{ cursor: 'pointer' }}
//       >
//         Logout
//       </li>
//     </>
//   );
// };

// export default AdminNavLinks;
