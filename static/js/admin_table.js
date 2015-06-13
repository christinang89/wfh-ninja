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

var Quotes = React.createClass({
	getInitialState: function() {
		return {
			quoteText: '',
			quotes: [],
			index: -1
		};
	},

	componentDidMount: function() {
		var twitter_script = document.createElement('script');
		twitter_script.textContent = "!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');";
		document.body.appendChild(twitter_script);
		$.get("http://wfh.ninja/api/quote", function(result) {
			if (this.isMounted()) {
				var quoteIds = _.keys(result);
				quoteIds = _.sample(quoteIds, quoteIds.length);

				this.setState({
					quotes: quoteIds
				});

				this.loadNextQuote();
			}
		}.bind(this));
		window.forceQuote = this.forceQuote;
	},

	forceQuote: function(quoteId) {
		$.get("http://wfh.ninja/api/quote/" + quoteId, function(result) {
			if (this.isMounted()) {
				this.setState({
					quoteText: result.text,
          index: this.state.quotes.length // force invalid index to restart it again
      });
				$('.form-button').attr('disabled', false);
			}
		}.bind(this));
	},

	loadNextQuote: function() {
		if (this.state.index >= (this.state.quotes.length - 1)) {
			quoteIds = _.sample(this.state.quotes, this.state.quotes.length);
			this.setState({
				index: -1,
				quotes: quoteIds
			});
			this.state.index = -1;
		}

		var quoteId = this.state.quotes[this.state.index + 1];

		$.get("http://wfh.ninja/api/quote/" + quoteId, function(result) {
			if (this.isMounted()) {
				this.setState({
					quoteText: result.text,
					index: this.state.index + 1
				});
				$('.form-button').attr('disabled', false);
			}
		}.bind(this));
	},

	approve: function() {
		return function() {
			$('.form-button').attr('disabled', true);
			var quoteId = this.state.quotes[this.state.index];
			if (!quoteId) {
				return this.loadNextQuote();
			}
			$.ajax({
				type: 'PUT',
				url: "http://wfh.ninja/api/quote/" + quoteId + '/approve',
				contentType: "application/json; charset=utf-8",
				success: function(result) { this.loadNextQuote(); }.bind(this)
			});
		}.bind(this);
	},

	reject: function() {
		return function() {
			$('.form-button').attr('disabled', true);
			var quoteId = this.state.quotes[this.state.index];
			if (!quoteId) {
				return this.loadNextQuote();
			}
			$.ajax({
				type: 'PUT',
				url: "http://wfh.ninja/api/quote/" + quoteId + '/reject',
				contentType: "application/json; charset=utf-8",
				success: function(result) { this.loadNextQuote(); }.bind(this)
			});
		}.bind(this);
	},

	delete: function() {
		return function() {
			$('.form-button').attr('disabled', true);
			var quoteId = this.state.quotes[this.state.index];
			if (!quoteId) {
				return this.loadNextQuote();
			}
			$.ajax({
				type: 'DELETE',
				url: "http://wfh.ninja/api/quote/" + quoteId,
				contentType: "application/json; charset=utf-8",
				success: function(result) { this.loadNextQuote(); }.bind(this)
			});
		}.bind(this);
	},

	render: function() {
		return (
			<div className="site-wrapper-inner">
			<div className="cover-container">
			<form  className="inner cover">
			<div class="table-responsive">
			<table class="table table-bordered table-condensed">
			<tr>
			<td><input type="checkbox" onClick="toggleSelect(this)" /> Select All</td>
			<td>Quote</td>
			<td>Status</td>
			</tr>
			<tr>
			<td><input type="checkbox" name="checkbox" value="quote1"></td>
			<td>{this.state.quoteText}</td>
			<td>Active</td>
			</tr>
			<tr class="danger">
			<td><input type="checkbox" name="checkbox" value="quote2"></td>
			<td>Quote 2</td>
			<td>Not Active</td>
			</tr>
			</table>
			</div> 

			<FormButton onClick={this.reject} className="btn btn-lg btn-warning form-button">Reject</FormButton>
			<FormButton onClick={this.approve} className="btn btn-lg btn-success form-button">Approve</FormButton>
			<br /><br />
			<FormButton onClick={this.delete} className="btn btn-lg btn-danger form-button">Delete</FormButton>
			</form>
			</div>
			</div>
			);
	}
});

