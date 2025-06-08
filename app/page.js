import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Home</h2>
      <p className={styles.paragraph}>
        Welcome to iGuide, the Academic Wing of the Independent Law Student Movement

        iGuide serves as a dedicated platform for legal learning and academic excellence. Designed with the modern law student in mind, it offers structured resources including curated notes, past paper analysis, examination strategies, and seminars led by distinguished legal professionals.

        Our aim is not only to support academic success but to nurture the next generation of advocates, scholars, and leaders in law.
      </p>
    </div>
  );
}
