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
				var date = new Date(quote.date_created);
    			var formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +  date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
				var quoteRow = (
					<div className="row">
					<div className="col-md-2"></div>
					<div className="col-md-1"><input type="checkbox" name="checkbox" id={quote.id} value={quote.id} /></div>
					<div className="col-md-3">{quote.text}</div>
					<div className="col-md-1">{quote.active ? "Active" : "Inactive"}</div>
					<div className="col-md-3">{formattedDate}</div>
					<div className="col-md-2"></div>
					</div>
					);
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
			<form className="inner cover">
			<div className="row">
			<div className="col-md-2"></div>
			<div className="col-md-1"><input type="checkbox" onClick={this.selectAll} /> Select All</div>
			<div className="col-md-3">Quote</div>
			<div className="col-md-1">Status</div>
			<div className="col-md-3">Date created</div>
			<div className="col-md-2"></div>
			</div>

			{this.state.renderedRows}

				<FormButton onClick={this.reject()} className="btn btn-warning form-button">Reject</FormButton>
				<FormButton onClick={this.approve()} className="btn btn-success form-button">Approve</FormButton>
				<br />
				<FormButton onClick={this.delete()} className="btn btn-danger form-button">Delete</FormButton>
			</form>
			</div>
			</div>

			);
	}
});


React.render(<AdminMain />, document.body);
