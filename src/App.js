import React, { Component } from 'react';
import axios from 'axios';

const TITLE = 'GitHub user search';

const key = 'bc71434457909492d70126f3e7b07c124a05c809';

const axiosGitHubGraphQL = axios.create({
  baseURL: 'https://api.github.com/graphql',
  headers: {
    Authorization: `bearer ${key}`
  }
});

const GET_ISSUES_OF_REPOSITORY = `
  query ($user: String!) {
    user(login: $user) {
      name
      url
      bio
      company
      email
      avatarUrl
    }
  }
`;

const getIssuesOfRepository = path => {
  const [user, repository] = path.split('/');

  return axiosGitHubGraphQL.post('', {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { user, repository }
  });
};

const resolveIssuesQuery = queryResult => () => ({
  user: queryResult.data.data.user,
  errors: queryResult.data.errors
});

class App extends Component {
  state = {
    path: 'AlexKlymenkoWork',
    user: null,
    errors: null
  };

  componentDidMount() {
    this.onFetchFromGitHub(this.state.path);
  }

  onChange = event => {
    this.setState({ path: event.target.value });
  };

  onSubmit = event => {
    this.onFetchFromGitHub(this.state.path);

    event.preventDefault();
  };

  onFetchFromGitHub = path => {
    getIssuesOfRepository(path).then(queryResult =>
      this.setState(resolveIssuesQuery(queryResult))
    );
  };

  render() {
    const { path, user, errors } = this.state;

    return (
      <div className='wrapper'>
        <div className='main'>
          <div className='container'>
            <div className='row'>
              <div className='form-container'>
                <h2 className='title-container'>{TITLE}</h2>
                <form onSubmit={this.onSubmit}>
                  <input
                    id='url'
                    type='text'
                    value={path}
                    onChange={this.onChange}
                  />
                  <button type='submit'>Search</button>
                </form>
                {user ? (
                  <User user={user} errors={errors} />
                ) : (
                  <p>No information yet ...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const User = ({ user, errors }) => {
  if (errors) {
    return (
      <p>
        <strong className='info__error'>Something went wrong:</strong>
        {errors.map(error => error.message).join(' ')}
      </p>
    );
  }

  return (
    <div className='info__info'>
      <p>
        Photo: <img src={user.avatarUrl} alt='img' style={{ width: '10rem' }} />
      </p>
      <p>
        User: <a href={user.url}>{user.name}</a>
      </p>
      <p>
        User bio: <span className='info__key'> {user.bio} </span>
      </p>
      <p>
        Company: <span className='info__key'> {user.company} </span>
      </p>
      <p>
        Email: <span className='info__key'> {user.email} </span>
      </p>
    </div>
  );
};

export default App;
