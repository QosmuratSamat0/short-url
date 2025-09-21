import React, { useState } from 'react';
import { createShortUrl, deleteUrl } from '../services/api';
import { copyToClipboard, isValidUrl, generateRandomAlias } from '../utils/helpers';
import { UrlRequest, AuthCredentials, ApiError } from '../types/api';

const UrlShortener: React.FC = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [authCredentials, setAuthCredentials] = useState<AuthCredentials>({
    username: 'myuser',
    password: 'mypass'
  });
  const [deleteAlias, setDeleteAlias] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    
    if (!url.trim()) {
      setError('Пожалуйста, введите URL');
      return;
    }

    if (!isValidUrl(url)) {
      setError('Пожалуйста, введите корректный URL');
      return;
    }

    setIsLoading(true);

    try {
      const urlData: UrlRequest = {
        url: url.trim(),
        alias: alias.trim() || undefined
      };

      const response = await createShortUrl(urlData, authCredentials);
      
      if (response.status === 'OK' && response.alias) {
        const fullShortUrl = `${window.location.origin}/${response.alias}`;
        setShortUrl(fullShortUrl);
        setSuccessMessage('Короткая ссылка успешно создана!');
        setUrl('');
        setAlias('');
      } else {
        setError(response.error || 'Произошла ошибка при создании ссылки');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Произошла ошибка при создании ссылки');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (shortUrl) {
      const success = await copyToClipboard(shortUrl);
      if (success) {
        setSuccessMessage('Ссылка скопирована в буфер обмена!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Не удалось скопировать ссылку');
      }
    }
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!deleteAlias.trim()) {
      setError('Пожалуйста, введите алиас для удаления');
      return;
    }

    setIsLoading(true);

    try {
      const response = await deleteUrl(deleteAlias.trim(), authCredentials);
      
      if (response.status === 'OK') {
        setSuccessMessage('Ссылка успешно удалена!');
        setDeleteAlias('');
        if (shortUrl.includes(deleteAlias)) {
          setShortUrl('');
        }
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.error || 'Произошла ошибка при удалении ссылки');
    } finally {
      setIsLoading(false);
    }
  };

  const generateRandomAliasHandler = () => {
    setAlias(generateRandomAlias());
  };

  return (
    <div className="container">
      <h1 className="title">URL Shortener</h1>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="url">Введите URL для сокращения:</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="alias">
            Алиас (необязательно):
            <button
              type="button"
              onClick={generateRandomAliasHandler}
              style={{
                marginLeft: '10px',
                padding: '5px 10px',
                fontSize: '0.8rem',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Сгенерировать
            </button>
          </label>
          <input
            type="text"
            id="alias"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="my-custom-alias"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="btn" disabled={isLoading}>
          {isLoading ? 'Создание...' : 'Создать короткую ссылку'}
        </button>
      </form>

      {shortUrl && (
        <div className="result">
          <h3>Ваша короткая ссылка:</h3>
          <div className="short-url">
            <input
              type="text"
              value={shortUrl}
              readOnly
            />
            <button onClick={handleCopy} className="copy-btn">
              Копировать
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <div className="auth-section">
        <h4>Настройки авторизации:</h4>
        <div className="auth-inputs">
          <div className="form-group">
            <label htmlFor="username">Имя пользователя:</label>
            <input
              type="text"
              id="username"
              value={authCredentials.username}
              onChange={(e) => setAuthCredentials(prev => ({
                ...prev,
                username: e.target.value
              }))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль:</label>
            <input
              type="password"
              id="password"
              value={authCredentials.password}
              onChange={(e) => setAuthCredentials(prev => ({
                ...prev,
                password: e.target.value
              }))}
            />
          </div>
        </div>
      </div>

      <div className="delete-section">
        <h4>Удалить ссылку:</h4>
        <form onSubmit={handleDelete} className="delete-form">
          <div className="form-group">
            <label htmlFor="deleteAlias">Алиас для удаления:</label>
            <input
              type="text"
              id="deleteAlias"
              value={deleteAlias}
              onChange={(e) => setDeleteAlias(e.target.value)}
              placeholder="alias-to-delete"
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="delete-btn" disabled={isLoading}>
            {isLoading ? 'Удаление...' : 'Удалить'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UrlShortener;
