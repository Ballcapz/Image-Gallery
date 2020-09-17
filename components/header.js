import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navLinks}>
        <li className={styles.navItem}>
          <Link href="/">
            <a>Upload</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link href="/gallery">
            <a>Gallery</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
