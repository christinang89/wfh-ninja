var SubmitButton = React.createClass({
  render: function() {
    return (
      <a {...this.props}
        href="javascript:;"
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var SubmitForm = React.createClass({
  getInitialState: function() {
    return {
      quoteText: ''
    };
  },
  
  handleChange: function(evt) {
    this.setState({
      quoteText: evt.target.value
    });
  },
  
  submit: function(e) {
    if (this.state.quoteText == "") { 
      return e.preventDefault(); 
    }
    $('button').prop('disabled', true);
    $.ajax({
      type: 'POST',
      url: "http://wfh.ninja/api/quote",
      data: JSON.stringify({ text: this.state.quoteText }),
      contentType: "application/json; charset=utf-8",
      success: function(result) { 
        $('button').prop('disabled', false);
        this.setState({
          quoteText: ""
        });
        window.forceQuote(result.id);
        window.scrollUp();
      }.bind(this)
    });
    return e.preventDefault();
  },

  render: function() {
    return (
      <div className="site-wrapper-inner-auto">
        <div className="cover-container submit-quote">
          <form onSubmit={this.submit} className="inner cover">
            <div className="form-group new-quote">
              <label htmlFor="suggestedQuote" className="lead">I'm working from home because...</label>
              <input type="text" className="form-control input-lg" onChange={this.handleChange} placeholder="Excuse goes here" value={this.state.quoteText}/>
            </div>
            <VoteButton onClick={this.submit} className="btn btn-lg btn-success">This is too good.</VoteButton>
          </form>
        </div>
      </div>
    );
  }
});
