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
      }.bind(this)
    });
    return e.preventDefault();
  },

  render: function() {
    return (
      <form onSubmit={this.submit}>
        <div className="form-group">
          <label for="suggestedQuote">I'm working from home because...</label>
          <input type="text" className="form-control" onChange={this.handleChange} placeholder="Reason" value={this.state.quoteText}/>
        </div>
        <button onClick={this.submit} className="btn btn-default">Submit</button>
      </form>
    );
  }
});