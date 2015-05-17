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

var BootstrapModal = React.createClass({
  // The following two methods are the only places we need to
  // integrate Bootstrap or jQuery with the components lifecycle methods.
  componentDidMount: function() {
    // When the component is added, turn it into a modal
    $(React.findDOMNode(this))
      .modal({backdrop: 'static', keyboard: false, show: false});
  },
  componentWillUnmount: function() {
    $(React.findDOMNode(this)).off('hidden', this.handleHidden);
  },
  close: function() {
    $(React.findDOMNode(this)).modal('hide');
  },
  open: function() {
    $(React.findDOMNode(this)).modal('show');
  },
  render: function() {
    var confirmButton = null;
    var cancelButton = null;

    if (this.props.confirm) {
      confirmButton = (
        <BootstrapButton
          onClick={this.handleConfirm}
          className="btn-primary">
          {this.props.confirm}
        </BootstrapButton>
      );
    }
    if (this.props.cancel) {
      cancelButton = (
        <BootstrapButton onClick={this.handleCancel} className="btn-default">
          {this.props.cancel}
        </BootstrapButton>
      );
    }

    return (
      <div className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="close"
                onClick={this.handleCancel}>
                &times;
              </button>
              <h3>{this.props.title}</h3>
            </div>
            <div className="modal-body">
              {this.props.children}
            </div>
            <div className="modal-footer">
              {cancelButton}
              {confirmButton}
            </div>
          </div>
        </div>
      </div>
    );
  },
  handleCancel: function() {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  },
  handleConfirm: function() {
    if (this.props.onConfirm) {
      this.props.onConfirm();
    }
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
		
              <p className="lead">I'm working from home today because...</p>
              
              <h1>{this.state.quoteText}</h1>
              
              <p className="lead">
				<BootstrapButton onClick={this.vote(1)} className="btn btn-lg btn-success">
				  Hell, Yeah!
				</BootstrapButton>
				<BootstrapButton onClick={this.vote(-1)} className="btn btn-lg btn-danger">
				  They ain't gonna buy it.
				</BootstrapButton>
              </p>
		</div>
    );
  }
});

React.render(<Example />, document.getElementById('main'));
