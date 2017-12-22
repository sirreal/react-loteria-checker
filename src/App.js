/** @format */

import React from 'react';

class App extends React.PureComponent {
  pollerA = null;
  pollerB = null;

  state = {
    inputs: Array(13).fill(''),
    results: [],
  };

  componentWillMount() {
    this.setState(({ inputs }) => ({
      inputs: JSON.parse(localStorage.getItem('inputs')) || inputs,
    }));
  }

  componentDidMount() {
    this.pollerA = setInterval(() => {
      console.group('batch');
      this.state.inputs.filter(Boolean).forEach(async (n, i) => {
        const res = await fetch(
          `http://api.elpais.com/ws/LoteriaNavidadPremiados?n=${n}`,
          { mode: 'no-cors' }
        );

        res.text().then(console.log.bind(console));
        // console.log(JSON.parse(body.slice(9)));
      });
      console.groupEnd();
    }, 10000);

    this.pollerB = setInterval(
      () => localStorage.setItem('inputs', JSON.stringify(this.state.inputs)),
      300
    );
  }

  componentWillUnmount() {
    clearInterval(this.pollerA);
    clearInterval(this.pollerB);
  }

  handleChange = i => e => {
    const newVal = e.target.value;
    this.setState(({ inputs }) => ({
      inputs: inputs.map((prevVal, prevI) => (i !== prevI ? prevVal : newVal)),
    }));
  };

  render() {
    return (
      <React.Fragment>
        {this.state.inputs.map((v, i) => (
          <div key={i}>
            <input type="text" value={v} onChange={this.handleChange(i)} />
            <div />
          </div>
        ))}
        <div className="Ticker">
          {this.state.results.map(r => JSON.stringify(r))}
        </div>
      </React.Fragment>
    );
  }
}

export default App;
