import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import RepoList from './components/list';
import axios from 'axios';

function App() {
  const [query, setQuery] = useState('react');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.github.com/search/repositories?q=${query}+in:name&per_page=20&page=${currentPage}`);
      if (response.status === 403) {
        setError('API rate limit exceeded');
        throw new Error('API rate limit exceeded');
      }
      const data = await response.json();
      if (data.items.length === 0) {
        setRepos([]);
        setError('По Вашему запросу не найдено ни одного репозитория');
      } else {
        setRepos(data.items);
        setError('');
      }
    } catch (error) {
      console.error(error);
      if (error === 'Error: API rate limit exceeded at handleSearch') {
      setError(`превышен лимит загрузки репозиториев`);
      } else {
        setError(`Произошла ошибка при загрузке репозиториев`);
      }
    } finally {
      setLoading(false);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 2000);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    setCurrentPage(1);
    debouncedHandleSearch();
  };

  const handlePrevClick = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      handleSearch();
    }
  };

  const handleNextClick = () => {
    setCurrentPage(currentPage + 1);
    handleSearch();
  };

  useEffect(() => {
    debouncedHandleSearch(query)
  }, [currentPage]);


  return (
    <div>
      <input type="text" value={query} onChange={handleInputChange} />
      <RepoList 
        handlePrevClick={handlePrevClick} 
        handleNextClick={handleNextClick} 
        repos={repos} 
        loading={loading} 
        error={error} 
        currentPag={currentPage}
      />
    </div>
  );
}

export default App;
