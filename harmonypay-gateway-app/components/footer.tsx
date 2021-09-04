import Link from "next/link"
import styles from "./footer.module.css"
import packageInfo from "../package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://harmonypay.one/">Documentation</a>
        </li>
        <li className={styles.navItem}>
          <a href="https://github.com/sekmet/harmonypay-gateway-app">GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href="/policy">
            <a>Policy</a>
          </Link>
        </li>
      </ul>
    </footer>
  )
}
