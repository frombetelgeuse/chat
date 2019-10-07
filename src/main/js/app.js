'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const follow = require('./follow');
var stompClient = require('./websocket-listener');

const root = '/api';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {messages: [], pageSize: 100, links: {}};
		this.loadFromServer = this.loadFromServer.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.refreshPage = this.refreshPage.bind(this);
		//this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(pageSize) {
		
		follow(client, root, [{rel: 'messages', params: {size: pageSize}}])
			.then((resp) => {
				console.log(resp.entity._links.last);
				console.log(resp.entity.page.totalPages);
				if (resp.entity._links.last) {
					return follow(client, root, 
						[{rel: 'messages', params: {size: pageSize, page: resp.entity.page.totalPages - 1}}])
				} else {
					return resp;
				}
			})
			.then((messageCollection) => {
				this.setState({
					messages: messageCollection.entity._embedded.messages.reverse(),
					pageSize: pageSize,
					links: messageCollection.entity._links
				});
			});
	}

	onCreate(newMessage) {
		follow(client, root, [{rel: 'messages'}]).then((resp) => {
			return client({
				method: 'POST',
				path: resp.entity._links.self.href,
				entity: newMessage,
				headers: {'Content-Type': 'application/json'}
			})
		});
	}

	refreshPage() {
		this.loadFromServer(this.state.pageSize);
	}

	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/topic/newMessage', callback: this.refreshPage}
		]);
	}

	render() {
		return (
			<div className="container">
				<h1>CHAT2</h1>
				<MessageForm onCreate={this.onCreate} />
				<MessageList messages={this.state.messages} />
			</div>
		)
	}
}

class MessageForm extends React.Component {

	constructor(props) {
		super(props);
		this.state = {messageUser: '', messageText: ''};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChangeUser = this.handleChangeUser.bind(this);
		this.handleChangeText = this.handleChangeText.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newMessage = {
			username: this.state.messageUser,
			text: this.state.messageText
		};
		this.props.onCreate(newMessage);
		this.setState({messageText: ''});
	}

	handleChangeText(e) {
		if (e.target.value.length > 156) return;
		this.setState({messageText: e.target.value});
	}
	handleChangeUser(e) {
		if (e.target.value.length > 42) return;
		this.setState({messageUser: e.target.value});
	}

	render() {
		return (
			<div className="bubble bubble-no-border brown">
				<form>
					<button onClick={this.handleSubmit}><b>Send</b></button>
					<div className="god-help-me input-for-name">
						<input type="text" value={this.state.messageUser} onChange={this.handleChangeUser} ref="newMessageText" />
					</div>
					<div className="god-help-me">
						<textarea rows="4" value={this.state.messageText} onChange={this.handleChangeText} ref="newMessageText" />
					</div>
				</form>
			</div>
		)
	}
}

class MessageList extends React.Component {
	render() {
		var messages = this.props.messages.map((message, id) => 
			<Message key={id/*message._links.self.href*/} message={message} />
		);
		return (
			<div>
				{messages}
			</div>
		)
	}
}

class Message extends React.Component {
	render() {
		return (
			<div className="bubble">
				<p><b>{this.props.message.username}:</b> {this.props.message.text}</p>
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)