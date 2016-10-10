import React, { Component } from "react";
import firebase from "firebase";
import reactMixin from "react-mixin";
import ReactFire from "reactfire";

import Game from "./Game";
import ArenaOwnerUI from "./ArenaOwnerUI";
import ArenaVisitorUI from "./ArenaVisitorUI";

export default class Arena extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: undefined,
    }

    this.bindFirebase = this.bindFirebase.bind(this);
  }

  componentDidMount() {
    if (this.props.params.arenaID) {
      this.bindFirebase(this.props.params.arenaID);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.arenaID !== this.props.params.arenaID) {
      if (this.firebaseRefs.firebase) {
        this.unbind("game");
      }
      if (nextProps.params.arenaID) {
        this.bindFirebase(nextProps.params.arenaID);
      }
    }
  }

  bindFirebase(arenaID) {
    this.bindAsObject(
      firebase.database().ref(`games/${arenaID}`),
      "game",
      function(error) {
        console.log("Firebase subscription cancelled:")
        console.log(error);
        this.setState({game: undefined})
      }.bind(this)
    );
  }

  createGame() {
    const arenaID = this.props.params.arenaID;
    firebase.database().ref("games").update({
      [arenaID]: {
        started: false,
        teams: {
          1: {},
          2: {},
        }
      }
    });
  }

  endGame() {
    const arenaID = this.props.params.arenaID;
    firebase.database().ref("games").child(arenaID).remove();
  }

  render() {
    const arenaID = this.props.params.arenaID;
    const playerID = this.props.playerID;
    const isOwner = arenaID === playerID;
    const game = this.state.game;
    const hasGame = game && typeof game.started !== "undefined";

    return (
      <div className="arena">
        {game ? (
          hasGame && (
            <Game
              game={game}
              isOwner={isOwner}
              endGame={this.endGame.bind(this)}
            />
          )
        ) : (
          <p>Connecting to arena…</p>
        )}

        {game && isOwner && (
          <ArenaOwnerUI
            createGame={this.createGame.bind(this)}
            hasGame={hasGame}
          />
        )}

        {game && !isOwner && (
          <ArenaVisitorUI/>
        )}
      </div>
    );
  }
}

reactMixin(Arena.prototype, ReactFire);
