import { Meteor } from "meteor/meteor";
import React, { Component } from "react";
import { withTracker } from "meteor/react-meteor-data";
import PropTypes from "prop-types";

import { Runners } from "../api/runners.js";

import AccountsUIWrapper from "./AccountsUIWrapper.js";


class App extends Component {
  constructor(props) {
    super(props);

    this.state= {
      playerName:null
    };
  }

  renderRunners() {
    return this.props.runners.map((r,i) => {
      return (<li
        key={i}
        style={{
          position: "relative",
          left: `${r.pos}%`
        }}
      >
        {r.name}
      </li>);
    });
  }

  addRunner(evt) {
    evt.preventDefault();

    const name = Meteor.user().username;

    let id;

    const player = Runners.findOne({
      name: name
    });

    if (!player) {
      id = Runners.insert({
        name: name,
        pos:0
      });
    } else {
      id = player._id;
    }

    this.setState({
      playerName: name,
      playerId : id
    });

  }

  run() {
    Runners.update(
      this.state.playerId,
      {
        $inc: { pos:1 }
      }
    );
  }


  render() {
    console.log("props", this.props);
    return (
      <div>
        <AccountsUIWrapper />
        <h1>Meteor Race</h1>
        <ul>
          {this.renderRunners()}
        </ul>
        {
          this.state.playerName ?
            <button onClick={this.run.bind(this)}>Run Forest!!!</button> :
            this.props.user ?
              <button onClick={this.addRunner.bind(this)}>Enter</button> :
              <div>Please log in</div>

        }
      </div>
    );
  }
}

App.propTypes = {
  runners: PropTypes.array.isRequired,
  user: PropTypes.object.isRequired
};


export default withTracker(() => {
  return {
    runners: Runners.find({}).fetch(),
    user: Meteor.user()
  };
})(App);

















