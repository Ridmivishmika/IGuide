// 'use client';
// import { useSession } from 'next-auth/react';
// import { usePathname } from 'next/navigation';
// import AdminNavLinks from './AdminNavLinks';
// import AuthPromptLinks from './AuthPromptLinks';

// const NavbarAuth = () => {
//   const { data: session, status } = useSession();
//   const pathname = usePathname();

//   const isAdmin = pathname.startsWith('/admin');

//   if (status === 'loading') return null;

//   if (isAdmin) {
//     if (session) {
//       return <AdminNavLinks />;
//     } else {
//       return <AuthPromptLinks />;
//     }
//   }

//   return null;
// };

// export default NavbarAuth;
