var FormButton = React.createClass({
	render: function() {
		return (
			<a {...this.props}
			href="javascript:;"
			role="button"
			className={(this.props.className || '') + ' btn'} />
			);
	}
});

var AdminMain = React.createClass({
	getInitialState: function() {
		return {
			quoteText: '',
			quotes: [],
			index: -1
		};
	},

	componentDidMount: function() {
		this.loadQuotes();
	},

	loadQuotes: function() {
		$.get("/quote?all=true", function(result) {
			this.setState({
				quotes: result
			});
			var renderedRows = [];
			var padZeroes = function(input) {
				// pad 1 digit to 2 digits
				return ("0" + input).slice(-2);
			}
			Object.keys(result).forEach(function(key) {
				var quote = result[key];
				var date = new Date(quote.date_created);
				var formattedDate = date.getFullYear() + "-" + padZeroes(date.getMonth() + 1) + "-" + padZeroes(date.getDate()) + " " +  padZeroes(date.getHours()) + ":" + padZeroes(date.getMinutes()) + ":" + padZeroes(date.getSeconds());
				var quoteRow = (
					
					
					<tr>
					<td className="checkbox-align"><input type="checkbox" name="checkbox" id={quote.id} value={quote.id} /></td>
					<td>{quote.text}</td>
					<td>{quote.active ? "Active" : "Inactive"}</td>
					<td>{formattedDate}</td>
					<td data-value={parseInt(quote.score)}>{parseInt(quote.score)}</td>
					</tr>
					
					
					);
				renderedRows.push(quoteRow);
			});
			this.setState({ renderedRows: renderedRows });
		Sortable.init();
		}.bind(this));  	
	},

	approve: function() {
		return function() {
			checkboxes = document.getElementsByName('checkbox');
			for(var i=0, n=checkboxes.length;i<n;i++) {
				if (checkboxes[i].checked) {
					// approve it
					$.ajax({
						type: 'PUT',
						url: "/quote/" + checkboxes[i].id + '/approve',
						contentType: "application/json; charset=utf-8",
						async: false
					});
					checkboxes[i].checked = false;
					
				}
			}
			this.loadQuotes();
		}.bind(this);
	},

	reject: function() {
		return function() {
			checkboxes = document.getElementsByName('checkbox');
			for(var i=0, n=checkboxes.length;i<n;i++) {
				if (checkboxes[i].checked) {
					// approve it
					$.ajax({
						type: 'PUT',
						url: "/quote/" + checkboxes[i].id + '/reject',
						contentType: "application/json; charset=utf-8",
						async: false
					});
					
				}
				checkboxes[i].checked = false;
			}
			this.loadQuotes();
		}.bind(this);
	},

	delete: function() {
		return function() {
			if (!confirm('Are you sure? This is irreversible!')) { return; }
			checkboxes = document.getElementsByName('checkbox');
			for(var i=0, n=checkboxes.length;i<n;i++) {
				if (checkboxes[i].checked) {
					// approve it
					$.ajax({
						type: 'DELETE',
						url: "/quote/" + checkboxes[i].id,
						contentType: "application/json; charset=utf-8",
						async: false
					});
					checkboxes[i].checked = false;	
				}
			}
			this.loadQuotes();
		}.bind(this);
	},

	selectAll: function(f, e) {
		checkboxes = document.getElementsByName('checkbox');
		for(var i=0, n=checkboxes.length;i<n;i++) {
			checkboxes[i].checked = f.target.checked;
		}
	},

	logOut: function() {
		return function() {		
			$.ajax({
				type: 'GET',
				url: "/logout",
				contentType: "application/json; charset=utf-8",
			});
		}.bind(this);
	},

	render: function() {
		return (
			<div className="site-wrapper">
			<div className="site-wrapper-inner">
			<div className="cover-container">
			<div className="inner cover">
			<div className="logout">
			<a href="/logout">Logout</a>
			</div>
			<h1>Admin Panel</h1>

			<form>
			<div className="table-responsive">
			<table className="table table-bordered" data-sortable>
			<thead>
			<tr className="table-header">
			<th className="checkbox-align"><input type="checkbox" onClick={this.selectAll} /></th>
			<th>Quote</th>
			<th>Status</th>
			<th>Date Created</th>
			<th>Score</th>
			</tr>
			</thead>
			<tbody>
			{this.state.renderedRows}
			</tbody>
			</table>
			</div>
			
			<div className="admin-buttons">
			<FormButton onClick={this.reject()} className="btn btn-warning btn-lg form-button">Reject</FormButton>
			<FormButton onClick={this.approve()} className="btn btn-success btn-lg form-button">Approve</FormButton>
			<br />
			<FormButton onClick={this.delete()} className="btn btn-danger btn-sm form-button">Delete</FormButton>
			</div>
			</form>

			</div>
			</div>
			</div>
			</div>

			);
}
});


React.render(<AdminMain />, document.body);
