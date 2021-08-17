import Link from "next/link"
import styles from "./footer.module.css"
import packageInfo from "../package.json"

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <hr />
      <ul className={styles.navItems}>
        <li className={styles.navItem}>
          <a href="https://pay.dezigne.co.uk/">Documentation</a>
        </li>
        <li className={styles.navItem}>
          <a href="https://github.com/nextauthjs/next-auth-example">GitHub</a>
        </li>
        <li className={styles.navItem}>
          <Link href="/policy">
            <a>Policy</a>
          </Link>
        </li>
        <li className={styles.navItem}>
          <em>harmonypay@{packageInfo.dependencies["next-auth"]}</em>
        </li>
      </ul>
    </footer>
  )
}
