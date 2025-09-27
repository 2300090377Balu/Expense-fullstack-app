import React, { Component } from 'react'
import Chat from './components/Chat';

export default class chatbot extends Component {
  render() {
    return (
      <div>
        <h1>Expense Tracker Chatbot</h1>
     <Chat />
      </div>
    )
  }
}
