import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">URL Shortener</div>
        <nav className="nav">
          <a href="/">Главная</a>
          <a href="#about">О проекте</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
