var SummaryMain = React.createClass({
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
		$.get("/quote", function(result) {
			this.setState({
				quotes: result
			});
			var renderedRows = [];
			var padZeroes = function(input) {
				// pad 1 digit to 2 digits
				return ("0" + input).slice(-2);
			}
			var resultArray = _.values(result);
			var sortedResults = _.sortBy(resultArray, function(row) { return -row['score']; });
			sortedResults.forEach(function(quote) {
				var date = new Date(quote.date_created);
				var formattedDate = date.getFullYear() + "-" + padZeroes(date.getMonth() + 1) + "-" + padZeroes(date.getDate()) + " " +  padZeroes(date.getHours()) + ":" + padZeroes(date.getMinutes()) + ":" + padZeroes(date.getSeconds());
				var quoteRow = (					
					
					<tr>
					<td>{quote.id}</td>
					<td>{quote.text}</td>
					<td data-value={parseInt(quote.score)}>{parseInt(quote.score)}</td>
					</tr>					
					
					);
				renderedRows.push(quoteRow);
			});
			this.setState({ renderedRows: renderedRows });
		Sortable.init();
		}.bind(this));  	
	},

	render: function() {
		return (
			<div className="site-wrapper">
			<div className="site-wrapper-inner">
			<div className="cover-container">
			<div className="inner cover">
			<h1>The Best Reasons to Work From Home</h1>

			<form>
			<div className="table-responsive">
			<table className="table table-bordered" data-sortable>
			<thead>
			<tr className="table-header">
			<th>Quote Id</th>
			<th>Quote</th>
			<th>Score</th>
			</tr>
			</thead>
			<tbody>
			{this.state.renderedRows}
			</tbody>
			</table>
			</div>

			<div className="admin-buttons">
			Want to contribute to this? <a href="/">Vote now!</a>

			</div>
			
			
			</form>

			</div>
			</div>
			</div>
			</div>

			);
}
});


React.render(<SummaryMain />, document.body);
