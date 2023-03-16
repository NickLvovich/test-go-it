import React from 'react'

 const RepoList = ({ loading, error, repos, handlePrevClick, currentPage, handleNextClick }) => {

  if (loading) {
    return <p>Loading...</p>;
  } else if (error) {
    return <p>{error}</p>;
  } else if (repos?.length > 0) {
    return (
        <>
        <ul>
          {repos?.map(repo => (
            <li key={repo.id}>
              <a href={repo.html_url}>{repo.full_name}</a>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={handlePrevClick} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage}</span>
          <button onClick={handleNextClick}>Next</button>
        </div>
      </>
    );
  } else {
    return <p>{error || 'По Вашему запросу не найдено ни одного репозитория.'}</p>;
  }
}

export default RepoList;