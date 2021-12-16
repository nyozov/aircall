import React from 'react';
import ReactDOM from 'react-dom';

import Header from './Header.jsx';
import Calls from './components/Calls.jsx'

const App = () => {
  return (
    <div className='container'>
      <Header/>
      <div className="container-view">
        
        <Calls/>
      </div>
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('app'));

export default App;
