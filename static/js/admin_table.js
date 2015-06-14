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
      		Object.keys(result).forEach(function(key) {
				var quote = result[key];
				var quoteRow = (
					<tr>
						<td><input type="checkbox" name="checkbox" id={quote.id} value={quote.id} /></td>
						<td>{quote.text}</td>
						<td>{quote.active ? "Active" : "Inactive"}</td>
					</tr>);
				renderedRows.push(quoteRow);
			});
			this.setState({ renderedRows: renderedRows });
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

	render: function() {
		return (
			<div className="site-wrapper-inner">
			<div className="cover-container">
			<form  className="inner cover">

				<div class="table-responsive">
					<table class="table table-bordered table-condensed">
						<tr>
							<td><input type="checkbox" onClick={this.selectAll} /> Select All</td>
							<td>Quote</td>
							<td>Status</td>
						</tr>
						{this.state.renderedRows}
					</table>
				</div> 

				<FormButton onClick={this.reject()} className="btn btn-lg btn-warning form-button">Reject</FormButton>
				<FormButton onClick={this.approve()} className="btn btn-lg btn-success form-button">Approve</FormButton>
				<br />
				<FormButton onClick={this.delete()} className="btn btn-lg btn-danger form-button">Delete</FormButton>
			</form>
			</div>
			</div>

			);
	}
});


React.render(<AdminMain />, document.body);
