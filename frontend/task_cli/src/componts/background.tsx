import React from 'react';

const DummyPage = () => {
  return (
    <div style={styles.pageContainer}>
      <header style={styles.header}>
        <h1>Welcome to the Dummy Page</h1>
        <p>This is a background page for capturing a screenshot using html2canvas.</p>
      </header>
      <main style={styles.mainContent}>
        <section style={styles.section}>
          <h2>About Us</h2>
          <p>This is some dummy text for the "About Us" section. You can replace it with any content.</p>
        </section>
        <section style={styles.section}>
          <h2>Services</h2>
          <ul>
            <li>Web Development</li>
            <li>App Development</li>
            <li>UI/UX Design</li>
          </ul>
        </section>
        <section style={styles.section}>
          <h2>Contact</h2>
          <p>If you'd like to contact us, feel free to reach out through any of the channels listed below.</p>
        </section>
      </main>
      {/* <footer style={styles.footer}>
        <button style={styles.button}>Click Me</button>
      </footer> */}
    </div>
  );
};

const styles = {
  pageContainer: {
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#f0f0f0',
    padding: '20px',
  },
  header: {
    backgroundColor: '#4CAF50',
    color: '#fff',
    padding: '20px',
    borderRadius: '5px',
  },
  mainContent: {
    marginTop: '20px',
  },
  section: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '15px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  footer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#008CBA',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

export default DummyPage;
