import React, { useState, useEffect } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import axios from 'axios';
import './FAQ.css';

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await axios.get('/api/faqs');
      setFaqs(response.data.faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="faq-container">
        <div className="loading">Loading FAQs...</div>
      </div>
    );
  }

  return (
    <div className="faq-container">
      <div className="faq-header">
        <HelpCircle size={48} className="faq-icon" />
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common health questions</p>
      </div>

      <div className="faq-search">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="faq-list">
        {filteredFaqs.length === 0 ? (
          <div className="no-results">
            <p>No FAQs found matching your search.</p>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => (
            <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
              <button
                className="faq-question"
                onClick={() => toggleFaq(index)}
              >
                <span className="faq-q-mark">Q:</span>
                <span className="faq-question-text">{faq.q}</span>
                {openIndex === index ? (
                  <ChevronUp size={20} className="faq-chevron" />
                ) : (
                  <ChevronDown size={20} className="faq-chevron" />
                )}
              </button>
              {openIndex === index && (
                <div className="faq-answer">
                  <span className="faq-a-mark">A:</span>
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default FAQ;

