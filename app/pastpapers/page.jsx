import React from "react";
import './page.module.css'
const Pastpapers = () => {
  return (
    <div className="pastpapers-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-item active">1st Year</div>
        <div className="sidebar-item">2nd Year</div>
        <div className="sidebar-item">3rd Year</div>
      </aside>

      {/* Main Area */}
      <main className="main-area">
        {/* Search Box */}
        <div className="search-box">
          <input type="text" placeholder="Search..." />
        </div>

        {/* Cards Grid */}
        <div className="cards-grid">
          {[1, 2, 3, 4].map((item, index) => (
            <div key={index} className="card">
              <h2>2023</h2>
              <div className="card-buttons">
                <button className="btn preview">Preview</button>
                <button className="btn download">Download</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Pastpapers;
