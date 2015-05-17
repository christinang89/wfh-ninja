// Simple pure-React component so we don't have to remember
// Bootstrap's classes
var BootstrapButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var Example = React.createClass({
  getInitialState: function() {
    return {
      quoteText: '',
      quotes: [],
	  index: -1
    };
  },
  componentDidMount: function() {
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
  },
  loadNextQuote: function() {
    if (this.state.index >= (this.state.quotes.length - 1)) {
	  quoteIds = _.sample(this.state.quotes, this.state.quotes.length);
	  this.setState({
	    index: -1,
		quotes: quoteIds
	  });
	}
	var quoteId = this.state.quotes[this.state.index + 1];
    $.get("http://wfh.ninja/api/quote/" + quoteId, function(result) {
	  if (this.isMounted()) {
        this.setState({
          quoteText: result.text,
		  index: this.state.index + 1
        });
      }
    }.bind(this));
  },
  vote: function(value) {
	return function() {
		var quoteId = this.state.quotes[this.state.index];
		if (!quoteId) return;
		$.ajax({
		  type: 'POST',
		  url: "http://wfh.ninja/api/quote/" + quoteId + '/vote', 
		  data: JSON.stringify({ value: value }),
		  contentType: "application/json; charset=utf-8",
		  success: function(result) {
		    this.loadNextQuote();
		  }.bind(this)
		}
		);
	}.bind(this);
  },
  render: function() {
    return (
		<div className="inner cover">
							<div className="sleepy_cat">
								<img src="img/sleepycat.jpg"/>
							</div>
              <p className="lead">I'm working from home today because...</p>
              
              <h1>{this.state.quoteText}</h1>
              
              <p className="lead">
				<BootstrapButton onClick={this.vote(1)} className="btn btn-lg btn-success">
				  Hell, Yeah!
				</BootstrapButton>
				<BootstrapButton onClick={this.vote(-1)} className="btn btn-lg btn-danger">
				  This won't fly.
				</BootstrapButton>
              </p>
		</div>
    );
  }
});

React.render(<Example />, document.getElementById('main'));
