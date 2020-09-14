import Link from 'next/link';

export default function Header() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">
            <a>Home</a>
          </Link>
        </li>
        <li>
          <Link href="/upload">
            <a>Upload</a>
          </Link>
        </li>
        <li>
          <Link href="/gallery">
            <a>Gallery</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
