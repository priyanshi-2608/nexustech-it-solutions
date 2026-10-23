import React, { useState, useEffect } from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';
import styles from '../styles/FAQ.module.css';

const FAQ = () => {
  useScrollAnimation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/faqs')
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching FAQs:', err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(faqs.map(f => f.category))];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const heroImage = '/faq1.jpg';

  return (
    <div className={styles.faqPage}>
      <div 
        className={styles.faqHeader}
        style={{ backgroundImage: `linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.88) 100%), url(${heroImage})` }}
      >
        <div className="container">
          <span className={styles.tag}>Help Center</span>
          <h1 className={styles.title}>Frequently Asked Questions</h1>
          <p className={styles.subtitle}>
            Everything you need to know about our platform, services, and developer architecture.
          </p>
        </div>
      </div>

      {/* Search and Filter Section (Outside Hero) */}
      <section className={styles.searchFilterSection}>
        <div className="container">
          <div className={styles.searchFilterWrapper}>
            {/* Search Bar */}
            <div className={styles.searchBox}>
              <input 
                type="text" 
                placeholder="Search questions or keywords..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            {/* Category Filters */}
            {!loading && categories.length > 1 && (
              <div className={styles.filterBar}>
                {categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className={`${styles.filterBtn} ${selectedCategory === cat ? styles.activeFilter : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Accordion List Section */}
      <section className={styles.faqContent}>
        <div className="container">
          {loading && <div className={styles.statusBox}>Loading questions...</div>}

          {!loading && filteredFaqs.length === 0 && (
            <div className={styles.statusBox}>
              <h3>No matching questions found</h3>
              <p>Try searching for something else or browse another category.</p>
            </div>
          )}

          <div className={styles.accordionList}>
            {filteredFaqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={faq._id || index} className={`${styles.accordionItem} ${isOpen ? styles.open : ''}`}>
                  <button className={styles.accordionQuestion} onClick={() => toggleAccordion(index)}>
                    <span>{faq.question}</span>
                    <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
                  </button>
                  {isOpen && (
                    <div className={styles.accordionAnswer}>
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;