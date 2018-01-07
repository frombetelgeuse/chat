'use strict';

// tag::vars[]
const React = require('react');
const ReactDOM = require('react-dom');

class App extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
			<table>
				<tbody>
					<tr>
						<td>First Name</td>
						<td>Last Name</td>
						<td>Description</td>
					</tr>
				</tbody>
			</table>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)